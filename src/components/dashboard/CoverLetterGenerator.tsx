import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UsageIndicator } from "./UsageIndicator";
import { usePaddleCheckout } from "@/components/PaddleCheckout";
import { 
  Sparkles, Loader2, Copy, Check, FileText, Plus, Save, 
  Briefcase, Building2, Download, BookmarkPlus, Crown
} from "lucide-react";
import { exportToPdf } from "@/lib/exportToPdf";
import { saveAsTemplate } from "./TemplatesLibrary";

interface CoverLetterResult {
  coverLetter: string;
  highlights: string[];
  suggestedSubject: string;
}

interface CoverLetterUsage {
  used: number;
  limit: number;
  isPremium: boolean;
}

interface CoverLetterGeneratorProps {
  userId: string;
  userEmail?: string;
  onCoverLetterSaved?: () => void;
  isPremium?: boolean;
}

export const CoverLetterGenerator = ({ userId, userEmail, onCoverLetterSaved, isPremium = false }: CoverLetterGeneratorProps) => {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeContent, setResumeContent] = useState("");
  const [tone, setTone] = useState<"professional" | "casual" | "confident">("professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<CoverLetterResult | null>(null);
  const [streamedContent, setStreamedContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState<CoverLetterUsage>({ used: 0, limit: 3, isPremium: false });
  const { toast } = useToast();

  const { openCheckout } = usePaddleCheckout({ userId, userEmail });

  useEffect(() => {
    fetchUsage();
  }, [userId]);

  const fetchUsage = async () => {
    const { data } = await supabase
      .from("user_usage")
      .select("cover_letters_generated, cover_letters_limit, is_premium")
      .eq("user_id", userId)
      .single();

    if (data) {
      setUsage({
        used: (data as any).cover_letters_generated ?? 0,
        limit: (data as any).cover_letters_limit ?? 3,
        isPremium: data.is_premium ?? false,
      });
    }
  };

  const canGenerate = usage.isPremium || usage.used < usage.limit;

  const generateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      toast({ title: "Missing information", description: "Please enter a job description.", variant: "destructive" });
      return;
    }
    if (!canGenerate) {
      toast({ title: "Limit reached", description: "Upgrade to Pro for unlimited cover letters.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    setStreamedContent("");
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Please log in to generate cover letters.");
      }
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-cover-letter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ jobTitle, companyName, jobDescription, resumeContent, tone }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate cover letter");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullContent += content;
              setStreamedContent(fullContent);
            }
          } catch { textBuffer = line + "\n" + textBuffer; break; }
        }
      }

      let parsedResult: CoverLetterResult;
      try {
        const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResult = JSON.parse(jsonMatch[0]) as CoverLetterResult;
        } else {
          parsedResult = { coverLetter: fullContent, highlights: [], suggestedSubject: "" };
        }
      } catch {
        parsedResult = { coverLetter: fullContent, highlights: [], suggestedSubject: "" };
      }
      setResult(parsedResult);

      if (!usage.isPremium) {
        setUsage(prev => ({ ...prev, used: prev.used + 1 }));
      }

      // Auto-save
      try {
        await supabase.from("cover_letters" as any).insert({
          user_id: userId,
          job_title: jobTitle || null,
          company_name: companyName || null,
          job_description: jobDescription,
          resume_content: resumeContent || null,
          generated_cover_letter: parsedResult.coverLetter,
          tone,
        });
        onCoverLetterSaved?.();
      } catch (e) { console.error("Failed to auto-save:", e); }

    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
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
    setJobTitle("");
    setCompanyName("");
    setJobDescription("");
    setResumeContent("");
    setResult(null);
    setStreamedContent("");
  };

  return (
    <div className="space-y-6">
      <UsageIndicator
        used={usage.used}
        limit={usage.limit}
        isPremium={usage.isPremium}
        userId={userId}
        userEmail={userEmail}
        onUpgrade={() => openCheckout("monthly")}
      />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5" /> Job Title
              </Label>
              <Input
                id="jobTitle"
                placeholder="e.g., Senior Frontend Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                disabled={isGenerating || !canGenerate}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-medium flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5" /> Company
              </Label>
              <Input
                id="companyName"
                placeholder="e.g., Stripe"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={isGenerating || !canGenerate}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clJobDescription" className="text-sm font-medium">Job Description</Label>
            <Textarea
              id="clJobDescription"
              placeholder="Paste the full job posting here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[160px] resize-none"
              disabled={isGenerating || !canGenerate}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume" className="text-sm font-medium">
              Your Resume / Background <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              id="resume"
              placeholder="Paste your resume or describe your relevant experience..."
              value={resumeContent}
              onChange={(e) => setResumeContent(e.target.value)}
              className="min-h-[120px] resize-none"
              disabled={isGenerating || !canGenerate}
            />
          </div>

          {/* Tone selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tone</Label>
            <div className="flex gap-2">
              {(["professional", "casual", "confident"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                    tone === t
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                  disabled={isGenerating || !canGenerate}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={generateCoverLetter} disabled={isGenerating || !jobDescription.trim() || !canGenerate} className="flex-1">
              {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4 mr-2" />Generate Cover Letter</>}
            </Button>
            {(result || streamedContent) && (
              <Button variant="outline" onClick={resetForm}><Plus className="w-4 h-4 mr-2" />New</Button>
            )}
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          {isGenerating && !result && streamedContent && (
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm font-medium text-primary">Generating...</span>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono">{streamedContent}</pre>
            </div>
          )}

          {result && (
            <>
              {result.suggestedSubject && (
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground mb-1">Suggested Email Subject</p>
                  <p className="text-sm font-medium">{result.suggestedSubject}</p>
                </div>
              )}
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="font-medium">Your Cover Letter</span>
                    <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded">Auto-saved</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.coverLetter)}>
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => exportToPdf(result.coverLetter, "cover-letter.pdf")} title="Download PDF" disabled={!isPremium}>
                      <Download className="w-4 h-4" />
                      {!isPremium && <Crown className="w-3 h-3 text-primary ml-1" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => saveAsTemplate(userId, "cover-letter", `${jobTitle || "Cover Letter"} - ${companyName || ""}`.trim(), result.coverLetter, toast)} title="Save as Template" disabled={!isPremium}>
                      <BookmarkPlus className="w-4 h-4" />
                      {!isPremium && <Crown className="w-3 h-3 text-primary ml-1" />}
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{result.coverLetter}</p>
                </div>
              </div>

              {result.highlights && result.highlights.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="font-medium mb-3">Key Highlights</h3>
                  <ul className="space-y-2">
                    {result.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary font-bold">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {!isGenerating && !result && !streamedContent && (
            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-medium mb-2">Your cover letter will appear here</h3>
              <p className="text-sm text-muted-foreground">Enter the job details and click "Generate Cover Letter" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
