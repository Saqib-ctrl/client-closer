import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_JOB_DESC_LENGTH = 15000;
const MAX_PORTFOLIO_LENGTH = 20000;

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
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id; // Use authenticated user ID

    const body = await req.json();
    const { jobDescription, portfolioContent } = body;

    // Input validation
    if (!jobDescription || typeof jobDescription !== "string") {
      return new Response(JSON.stringify({ error: "Job description is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sanitizedJobDesc = sanitizeInput(jobDescription, MAX_JOB_DESC_LENGTH);
    const sanitizedPortfolio = portfolioContent ? sanitizeInput(String(portfolioContent), MAX_PORTFOLIO_LENGTH) : null;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("x-real-ip") || 
                     "unknown";

    // Check usage limits
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const { data: usageCheck, error: usageError } = await supabaseAdmin
      .rpc("check_usage_limit", { p_user_id: userId, p_ip: clientIP });

    if (usageError) {
      console.error("Error checking usage:", usageError);
    } else if (usageCheck && !usageCheck.allowed) {
      return new Response(JSON.stringify({ 
        error: usageCheck.message || "Usage limit reached",
        reason: usageCheck.reason,
        used: usageCheck.used,
        limit: usageCheck.limit
      }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are an expert freelance proposal writer. Your job is to create compelling, personalized proposals that win clients.

Given a job description and the freelancer's portfolio/past work, create:
1. A personalized proposal that directly addresses the client's needs
2. A tailored portfolio summary highlighting relevant experience

Guidelines:
- Start with understanding the client's pain points
- Reference specific aspects of the job description
- Match the freelancer's experience to the client's needs
- Be specific and avoid generic language
- Keep proposals concise but impactful (300-400 words max)
- Use a professional but friendly tone
- Include a clear call-to-action

Return your response in the following JSON format:
{
  "proposal": "The personalized proposal text...",
  "portfolioSummary": "A curated summary of relevant portfolio pieces...",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Job Description:\n${sanitizedJobDesc}\n\nMy Portfolio/Past Work:\n${sanitizedPortfolio || "No portfolio content provided - create a general proposal based on the job description."}` 
          },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to generate proposal" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Record usage after successful generation
    const { error: recordError } = await supabaseAdmin
      .rpc("record_proposal_usage", { p_user_id: userId, p_ip: clientIP });

    if (recordError) {
      console.error("Error recording usage:", recordError);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in generate-proposal:", error);
    return new Response(JSON.stringify({ error: "An error occurred while generating the proposal." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
