import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobTitle, companyName, jobDescription, resumeContent, tone, userId } = await req.json();

    if (!jobDescription) {
      return new Response(
        JSON.stringify({ error: "Job description is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check usage limit
    if (userId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

      const { data: usageCheck, error: usageError } = await supabaseAdmin.rpc(
        "check_cover_letter_usage_limit",
        { p_user_id: userId, p_ip: clientIp }
      );

      if (usageError) {
        console.error("Usage check error:", usageError);
      } else if (usageCheck && !usageCheck.allowed) {
        return new Response(
          JSON.stringify({ error: "Cover letter limit reached. Upgrade to Pro for unlimited access.", usage: usageCheck }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const toneInstruction = tone === "casual" 
      ? "Use a friendly, conversational tone while remaining professional." 
      : tone === "confident" 
        ? "Use a bold, confident tone that showcases achievements assertively."
        : "Use a professional, polished tone.";

    const systemPrompt = `You are an expert career coach and cover letter writer. Generate a compelling, personalized cover letter.

${toneInstruction}

Guidelines:
- Address the specific job requirements mentioned in the description
- Highlight relevant experience from the resume/background provided
- Keep it concise (3-4 paragraphs)
- Use a strong opening hook
- Include specific achievements with metrics when possible
- End with a confident call to action
- Do NOT use generic phrases like "I am writing to express my interest"
- Make it feel human and authentic, not templated

Respond with ONLY valid JSON in this format:
{
  "coverLetter": "The full cover letter text",
  "highlights": ["Key strength 1", "Key strength 2", "Key strength 3"],
  "suggestedSubject": "Email subject line suggestion"
}`;

    const userContent = `Job Title: ${jobTitle || "Not specified"}
Company: ${companyName || "Not specified"}
Job Description: ${jobDescription}
${resumeContent ? `My Background/Resume: ${resumeContent}` : ""}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        stream: true,
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
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    // Record usage after successful generation
    if (userId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      await supabaseAdmin.rpc("record_cover_letter_usage", { p_user_id: userId, p_ip: clientIp });
    }

    // Stream the response back
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("Error in generate-cover-letter:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate cover letter";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
