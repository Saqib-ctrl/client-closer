import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_CONTEXT_LENGTH = 10000;
const MAX_NAME_LENGTH = 200;
const VALID_EMAIL_TYPES = ["follow-up", "negotiation", "thank-you", "cold-outreach", "project-update"];

function sanitizeInput(input: string, maxLength: number): string {
  return input
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
    .substring(0, maxLength);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { emailType, context, recipientName, senderName, userId } = body;

    // Input validation
    if (!context || typeof context !== "string") {
      return new Response(JSON.stringify({ error: "Context is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (userId && (typeof userId !== "string" || !UUID_REGEX.test(userId))) {
      return new Response(JSON.stringify({ error: "Invalid user ID format" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (emailType && !VALID_EMAIL_TYPES.includes(emailType)) {
      return new Response(JSON.stringify({ error: "Invalid email type" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const sanitizedContext = sanitizeInput(context, MAX_CONTEXT_LENGTH);
    const sanitizedRecipientName = recipientName ? sanitizeInput(String(recipientName), MAX_NAME_LENGTH) : undefined;
    const sanitizedSenderName = senderName ? sanitizeInput(String(senderName), MAX_NAME_LENGTH) : undefined;
    const safeEmailType = emailType && VALID_EMAIL_TYPES.includes(emailType) ? emailType : "follow-up";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (userId) {
      const { data: usageCheck } = await supabaseAdmin.rpc("check_email_usage_limit", { p_user_id: userId, p_ip: clientIp });
      if (usageCheck && !usageCheck.allowed) {
        return new Response(JSON.stringify({ error: "Email generation limit reached", ...usageCheck }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    const typeInstructions: Record<string, string> = {
      "follow-up": "Write a professional follow-up email. Be polite but assertive, referencing previous communication.",
      "negotiation": "Write a negotiation email. Be diplomatic, present your value proposition clearly, and suggest a win-win outcome.",
      "thank-you": "Write a sincere thank-you email. Express genuine gratitude and reinforce the professional relationship.",
      "cold-outreach": "Write a compelling cold outreach email. Hook them in the first line, be concise, and include a clear call-to-action.",
      "project-update": "Write a project update email. Be clear about progress, milestones, and next steps.",
    };

    const systemPrompt = `You are an expert email writer for freelancers and professionals. 
${typeInstructions[safeEmailType] || typeInstructions["follow-up"]}

IMPORTANT: Return your response as valid JSON with this exact structure:
{
  "subject": "email subject line",
  "email": "the full email body",
  "tips": ["tip 1", "tip 2"]
}`;

    const userContent = `Email type: ${safeEmailType}
${sanitizedRecipientName ? `Recipient: ${sanitizedRecipientName}` : ""}
${sanitizedSenderName ? `Sender: ${sanitizedSenderName}` : ""}
Context: ${sanitizedContext}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userContent }],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway error: ${response.status}`);
    }

    if (userId) {
      await supabaseAdmin.rpc("record_email_usage", { p_user_id: userId, p_ip: clientIp });
    }

    return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (error) {
    console.error("generate-email error:", error);
    return new Response(JSON.stringify({ error: "An error occurred while generating the email." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
