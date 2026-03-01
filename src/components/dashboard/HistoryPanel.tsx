import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, ImageIcon, Trash2, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Proposal {
  id: string;
  job_description: string;
  generated_proposal: string | null;
  created_at: string;
}

interface Mockup {
  id: string;
  image_url: string;
  style_prompt: string | null;
  original_images_count: number;
  created_at: string;
}

interface HistoryPanelProps {
  userId: string;
  refreshTrigger: number;
  compact?: boolean;
}

export const HistoryPanel = ({ userId, refreshTrigger, compact = false }: HistoryPanelProps) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [mockups, setMockups] = useState<Mockup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedProposal, setExpandedProposal] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const [proposalsRes, mockupsRes] = await Promise.all([
        supabase
          .from("proposals")
          .select("id, job_description, generated_proposal, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("mockups" as any)
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(20),
      ]);

      if (proposalsRes.error) throw proposalsRes.error;
      if (mockupsRes.error) throw mockupsRes.error;

      setProposals(proposalsRes.data || []);
      setMockups((mockupsRes.data as unknown as Mockup[]) || []);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchHistory();
    }
  }, [userId, refreshTrigger]);

  const deleteProposal = async (id: string) => {
    try {
      const { error } = await supabase.from("proposals").delete().eq("id", id);
      if (error) throw error;
      setProposals((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Proposal deleted" });
    } catch (error) {
      toast({
        title: "Failed to delete",
        variant: "destructive",
      });
    }
  };

  const deleteMockup = async (id: string, imageUrl: string) => {
    try {
      // Extract file path from URL for storage deletion
      const urlParts = imageUrl.split("/mockups/");
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from("mockups" as any).remove([filePath]);
      }

      const { error } = await supabase.from("mockups" as any).delete().eq("id", id);
      if (error) throw error;
      setMockups((prev) => prev.filter((m) => m.id !== id));
      toast({ title: "Mockup deleted" });
    } catch (error) {
      toast({
        title: "Failed to delete",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const hasHistory = proposals.length > 0 || mockups.length > 0;

  if (!hasHistory) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="font-medium mb-2">No history yet</h3>
        <p className="text-sm text-muted-foreground">
          Your saved proposals and mockups will appear here.
        </p>
      </div>
    );
  }

  const displayProposals = compact ? proposals.slice(0, 3) : proposals;
  const displayMockups = compact ? mockups.slice(0, 4) : mockups;

  return (
    <div className="space-y-8">
      {/* Proposals History */}
      {proposals.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Saved Proposals ({proposals.length})
          </h3>
          <div className="space-y-3">
            {displayProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="rounded-lg border border-border bg-card overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() =>
                    setExpandedProposal(
                      expandedProposal === proposal.id ? null : proposal.id
                    )
                  }
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {proposal.job_description.slice(0, 80)}...
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(proposal.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProposal(proposal.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                    {expandedProposal === proposal.id ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
                {expandedProposal === proposal.id && proposal.generated_proposal && (
                  <div className="border-t border-border p-4 bg-muted/10">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {proposal.generated_proposal}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mockups History */}
      {mockups.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Saved Mockups ({mockups.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayMockups.map((mockup) => (
              <div
                key={mockup.id}
                className="group relative rounded-lg border border-border overflow-hidden bg-card"
              >
                <div className="aspect-video">
                  <img
                    src={mockup.image_url}
                    alt="Mockup"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="text-xs text-muted-foreground truncate">
                    {mockup.style_prompt || "No style specified"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(mockup.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteMockup(mockup.id, mockup.image_url)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
