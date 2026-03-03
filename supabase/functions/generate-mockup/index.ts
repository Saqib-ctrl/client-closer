import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_STYLE_PROMPT_LENGTH = 2000;
const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB base64

function sanitizeInput(input: string, maxLength: number): string {
  return input
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
    .substring(0, maxLength);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user via JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = user.id; // Use authenticated user ID

    const body = await req.json();
    const { images, stylePrompt } = body;

    // Input validation
    if (!images || !Array.isArray(images) || images.length === 0) {
      return new Response(
        JSON.stringify({ error: "No images provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (images.length > MAX_IMAGES) {
      return new Response(
        JSON.stringify({ error: `Maximum ${MAX_IMAGES} images allowed` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    for (const img of images) {
      if (typeof img !== "string" || img.length > MAX_IMAGE_SIZE) {
        return new Response(
          JSON.stringify({ error: "Invalid or oversized image data" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const sanitizedStylePrompt = stylePrompt ? sanitizeInput(String(stylePrompt), MAX_STYLE_PROMPT_LENGTH) : undefined;

    // Check mockup usage limit
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("x-real-ip") || "unknown";

    const { data: usageCheck, error: usageError } = await supabaseAdmin.rpc(
      "check_mockup_usage_limit",
      { p_user_id: userId, p_ip: clientIp }
    );

    if (usageError) {
      console.error("Usage check error:", usageError);
    } else if (usageCheck && !usageCheck.allowed) {
      return new Response(
        JSON.stringify({ 
          error: "Mockup generation limit reached. Upgrade to Pro for unlimited mockups.",
          usage: usageCheck
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build the content array with images
    const content: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
      {
        type: "text",
        text: `You are a professional designer. Create a beautiful, polished mockup presentation for the following screenshot(s). 
        
Style instructions: ${sanitizedStylePrompt || "Modern, professional mockup with elegant shadows, subtle gradients, and a clean presentation style suitable for a portfolio or pitch deck."}

Guidelines:
- Place the screenshot(s) in realistic device frames (laptop, phone, tablet) or floating windows
- Add a beautiful gradient or subtle pattern background
- Include soft shadows and depth
- Make it look like a professional SaaS or product landing page hero image
- Keep the original content visible and clear
- Add subtle decorative elements if appropriate (floating shapes, glows, etc.)

Create the most stunning mockup presentation possible.`,
      },
    ];

    for (const image of images) {
      content.push({
        type: "image_url",
        image_url: { url: image },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [{ role: "user", content }],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();

    const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!generatedImage) {
      throw new Error("No image was generated");
    }

    // Record mockup usage after successful generation
    await supabaseAdmin.rpc("record_mockup_usage", { p_user_id: userId, p_ip: clientIp });

    return new Response(
      JSON.stringify({ 
        image: generatedImage,
        message: data.choices?.[0]?.message?.content || "Mockup generated successfully"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in generate-mockup:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while generating the mockup." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
