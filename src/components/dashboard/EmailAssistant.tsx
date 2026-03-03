import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UsageIndicator } from "@/components/dashboard/UsageIndicator";
import { Loader2, Sparkles, Copy, Check, Download, Plus, Mail, Crown } from "lucide-react";
import { exportToPdf } from "@/lib/exportToPdf";

interface EmailResult {
  subject: string;
  email: string;
  tips: string[];
}

interface EmailUsage { used: number; limit: number; isPremium: boolean; }

interface EmailAssistantProps {
  userId: string;
  userEmail?: string;
  onEmailSaved?: () => void;
  isPremium?: boolean;
}

const EMAIL_TYPES = [
  { id: "follow-up", label: "Follow-up", desc: "After a meeting or proposal" },
  { id: "negotiation", label: "Negotiation", desc: "Rate or scope discussions" },
  { id: "thank-you", label: "Thank You", desc: "Post-project gratitude" },
  { id: "cold-outreach", label: "Cold Outreach", desc: "New client prospecting" },
  { id: "project-update", label: "Project Update", desc: "Progress reports" },
];

export const EmailAssistant = ({ userId, userEmail, onEmailSaved, isPremium = false }: EmailAssistantProps) => {
  const [emailType, setEmailType] = useState("follow-up");
  const [context, setContext] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [result, setResult] = useState<EmailResult | null>(null);
  const [streamedContent, setStreamedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState<EmailUsage>({ used: 0, limit: 5, isPremium: false });
  const [canGenerate, setCanGenerate] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsage = async () => {
      const { data } = await supabase
        .from("user_usage")
        .select("emails_generated, emails_limit, is_premium")
        .eq("user_id", userId)
        .single();
      if (data) {
        const u = {
          used: (data as any).emails_generated || 0,
          limit: (data as any).emails_limit || 5,
          isPremium: data.is_premium || false,
        };
        setUsage(u);
        setCanGenerate(u.isPremium || u.used < u.limit);
      }
    };
    fetchUsage();
  }, [userId]);

  const generateEmail = async () => {
    if (!context.trim()) return;
    setIsGenerating(true);
    setResult(null);
    setStreamedContent("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ emailType, context, recipientName, senderName, userId }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to generate");
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let buffer = ""; // Buffer for incomplete SSE lines

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n");
        // Keep the last part as it may be incomplete
        buffer = parts.pop() || "";
        for (const line of parts) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullContent += content;
              setStreamedContent(fullContent);
            }
          } catch { /* partial JSON chunk */ }
        }
      }
      // Process any remaining buffer
      if (buffer.startsWith("data: ")) {
        const jsonStr = buffer.slice(6).trim();
        if (jsonStr !== "[DONE]") {
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) fullContent += content;
          } catch { /* ignore */ }
        }
      }

      // Parse JSON result from accumulated content
      const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]) as EmailResult;
          setResult(parsed);

          // Auto-save
          await supabase.from("emails" as any).insert({
            user_id: userId,
            email_type: emailType,
            context,
            generated_email: parsed.email,
            subject_line: parsed.subject,
          });

          if (!usage.isPremium) setUsage(prev => ({ ...prev, used: prev.used + 1 }));
          setCanGenerate(usage.isPremium || usage.used + 1 < usage.limit);
          onEmailSaved?.();
        } catch (parseError) {
          // JSON parsing failed - show raw content as fallback
          setResult({
            subject: "",
            email: fullContent.replace(/```json\s*/g, "").replace(/```\s*/g, "").replace(/^\s*\{[\s\S]*\}\s*$/, fullContent),
            tips: [],
          });
        }
      } else if (fullContent.trim()) {
        // No JSON found - display raw content
        setResult({ subject: "", email: fullContent, tips: [] });
      }
    } catch (error) {
      toast({ title: "Generation failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setContext("");
    setRecipientName("");
    setSenderName("");
    setResult(null);
    setStreamedContent("");
  };

  return (
    <div className="space-y-6">
      <UsageIndicator used={usage.used} limit={usage.limit} isPremium={usage.isPremium} userId={userId} userEmail={userEmail} onUpgrade={() => {}} />

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          {/* Email Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Email Type</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EMAIL_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setEmailType(t.id)}
                  className={`p-3 rounded-lg text-left text-sm transition-all border ${
                    emailType === t.id
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                  }`}
                  disabled={isGenerating || !canGenerate}
                >
                  <p className="font-medium">{t.label}</p>
                  <p className="text-xs opacity-70 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Recipient Name</Label>
              <Input placeholder="e.g., John Smith" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} disabled={isGenerating || !canGenerate} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Your Name</Label>
              <Input placeholder="e.g., Jane Doe" value={senderName} onChange={(e) => setSenderName(e.target.value)} disabled={isGenerating || !canGenerate} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Context & Details</Label>
            <Textarea
              placeholder={emailType === "follow-up" ? "Describe the meeting or proposal you're following up on..." : emailType === "negotiation" ? "Describe what you're negotiating (rate, scope, timeline)..." : emailType === "cold-outreach" ? "Describe the potential client and what you offer..." : "Describe the situation and what you want to communicate..."}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-[180px] resize-none"
              disabled={isGenerating || !canGenerate}
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={generateEmail} disabled={isGenerating || !context.trim() || !canGenerate} className="flex-1">
              {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4 mr-2" />Generate Email</>}
            </Button>
            {(result || streamedContent) && (
              <Button variant="outline" onClick={resetForm}><Plus className="w-4 h-4 mr-2" />New</Button>
            )}
          </div>
        </div>

        {/* Output */}
        <div className="space-y-6">
          {isGenerating && !result && streamedContent && (
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm font-medium text-primary">Generating...</span>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono leading-relaxed">{streamedContent}</pre>
            </div>
          )}

          {result && (
            <>
              {result.subject && (
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground mb-1">Subject Line</p>
                  <p className="text-sm font-medium">{result.subject}</p>
                </div>
              )}
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="font-medium">Generated Email</span>
                    <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded">Auto-saved</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.email)}>
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => exportToPdf(result.email, `email-${emailType}.pdf`)} disabled={!isPremium}>
                      <Download className="w-4 h-4" />
                      {!isPremium && <Crown className="w-3 h-3 text-primary ml-1" />}
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{result.email}</p>
                </div>
              </div>

              {result.tips && result.tips.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="font-medium mb-3">Sending Tips</h3>
                  <ul className="space-y-2">
                    {result.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {!isGenerating && !result && !streamedContent && (
            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
              <Mail className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-medium mb-2">Your email will appear here</h3>
              <p className="text-sm text-muted-foreground">Select an email type, provide context, and generate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
