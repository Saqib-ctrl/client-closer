import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2, Copy, Check, FileText, Plus, Save } from "lucide-react";

interface ProposalResult {
  proposal: string;
  portfolioSummary: string;
  keyPoints: string[];
}

interface ProposalGeneratorProps {
  userId: string;
  onProposalSaved?: () => void;
}

export const ProposalGenerator = ({ userId, onProposalSaved }: ProposalGeneratorProps) => {
  const [jobDescription, setJobDescription] = useState("");
  const [portfolioContent, setPortfolioContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<ProposalResult | null>(null);
  const [streamedContent, setStreamedContent] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateProposal = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a job description to generate a proposal.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setStreamedContent("");
    setResult(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-proposal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ jobDescription, portfolioContent }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate proposal");
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
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Parse the final JSON from the streamed content
      try {
        const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as ProposalResult;
          setResult(parsed);
        }
      } catch {
        setResult({
          proposal: fullContent,
          portfolioSummary: "",
          keyPoints: [],
        });
      }
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

  const saveProposal = async () => {
    if (!result) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.from("proposals").insert({
        user_id: userId,
        job_description: jobDescription,
        portfolio_content: portfolioContent || null,
        generated_proposal: result.proposal,
        generated_portfolio: result.portfolioSummary || null,
        status: "saved",
      });

      if (error) throw error;

      toast({ title: "Proposal saved!" });
      onProposalSaved?.();
    } catch (error) {
      toast({
        title: "Failed to save",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setJobDescription("");
    setPortfolioContent("");
    setResult(null);
    setStreamedContent("");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="jobDescription" className="text-base font-medium">
            Job Description
          </Label>
          <Textarea
            id="jobDescription"
            placeholder="Paste the client's job posting or project brief here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[200px] resize-none"
            disabled={isGenerating}
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="portfolio" className="text-base font-medium">
            Your Portfolio / Past Work
            <span className="text-muted-foreground font-normal ml-2">(optional)</span>
          </Label>
          <Textarea
            id="portfolio"
            placeholder="Describe your relevant experience, past projects, or skills that match this job..."
            value={portfolioContent}
            onChange={(e) => setPortfolioContent(e.target.value)}
            className="min-h-[150px] resize-none"
            disabled={isGenerating}
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={generateProposal}
            disabled={isGenerating || !jobDescription.trim()}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Proposal
              </>
            )}
          </Button>

          {(result || streamedContent) && (
            <Button variant="outline" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>
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
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono">
              {streamedContent}
            </pre>
          </div>
        )}

        {result && (
          <>
            {/* Proposal */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="font-medium">Your Proposal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={saveProposal}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(result.proposal)}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {result.proposal}
                </p>
              </div>
            </div>

            {/* Key Points */}
            {result.keyPoints && result.keyPoints.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-medium mb-3">Key Selling Points</h3>
                <ul className="space-y-2">
                  {result.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-primary font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Portfolio Summary */}
            {result.portfolioSummary && (
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30">
                  <span className="font-medium">Portfolio Summary</span>
                </div>
                <div className="p-4">
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                    {result.portfolioSummary}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {!isGenerating && !result && !streamedContent && (
          <div className="rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
            <Sparkles className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-medium mb-2">Your proposal will appear here</h3>
            <p className="text-sm text-muted-foreground">
              Enter a job description and click "Generate Proposal" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
