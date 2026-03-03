import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, ImageIcon, Mail, Trash2, Clock, ChevronDown, ChevronUp, Download, Copy, Check, Send, Receipt, Crown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ProBanner } from "./ProFeatureLock";

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

interface CoverLetter {
  id: string;
  job_title: string | null;
  company_name: string | null;
  job_description: string;
  generated_cover_letter: string | null;
  tone: string | null;
  created_at: string;
}

interface Email {
  id: string;
  email_type: string;
  context: string;
  generated_email: string | null;
  subject_line: string | null;
  created_at: string;
}

interface Invoice {
  id: string;
  client_name: string;
  invoice_number: string | null;
  total: number;
  currency: string;
  status: string;
  created_at: string;
}

interface HistoryPanelProps {
  userId: string;
  refreshTrigger: number;
  compact?: boolean;
  isPremium?: boolean;
}

export const HistoryPanel = ({ userId, refreshTrigger, compact = false, isPremium = false }: HistoryPanelProps) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [mockups, setMockups] = useState<Mockup[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const [proposalsRes, mockupsRes, coverLettersRes, emailsRes, invoicesRes] = await Promise.all([
        supabase.from("proposals").select("id, job_description, generated_proposal, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
        supabase.from("mockups").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
        supabase.from("cover_letters").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
        supabase.from("emails").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
        supabase.from("invoices").select("id, client_name, invoice_number, total, currency, status, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
      ]);

      if (proposalsRes.error) throw proposalsRes.error;
      setProposals(proposalsRes.data || []);
      
      // Generate signed URLs for mockups since bucket is private
      const rawMockups = (mockupsRes.data as unknown as Mockup[]) || [];
      const mockupsWithSignedUrls = await Promise.all(
        rawMockups.map(async (mockup) => {
          // If image_url is a full URL (legacy), use as-is; otherwise generate signed URL
          if (mockup.image_url.startsWith("http")) return mockup;
          const { data } = await supabase.storage.from("mockups").createSignedUrl(mockup.image_url, 3600);
          return { ...mockup, image_url: data?.signedUrl || mockup.image_url };
        })
      );
      setMockups(mockupsWithSignedUrls);
      
      setCoverLetters((coverLettersRes.data as unknown as CoverLetter[]) || []);
      setEmails((emailsRes.data as unknown as Email[]) || []);
      setInvoices((invoicesRes.data as unknown as Invoice[]) || []);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchHistory();
  }, [userId, refreshTrigger]);

  const deleteItem = async (table: string, id: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
      const { error } = await supabase.from(table as any).delete().eq("id", id);
      if (error) throw error;
      setter((prev: any[]) => prev.filter((item: any) => item.id !== id));
      toast({ title: "Deleted successfully" });
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  const deleteMockup = async (id: string, imageUrl: string) => {
    try {
      const urlParts = imageUrl.split("/mockups/");
      if (urlParts.length > 1) {
        await supabase.storage.from("mockups").remove([urlParts[1]]);
      }
      await deleteItem("mockups", id, setMockups);
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadAsText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const hasHistory = proposals.length > 0 || mockups.length > 0 || coverLetters.length > 0 || emails.length > 0 || invoices.length > 0;

  if (!hasHistory) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="font-medium mb-2">No history yet</h3>
        <p className="text-sm text-muted-foreground">
          Your saved proposals, mockups, cover letters, emails, and invoices will appear here.
        </p>
      </div>
    );
  }

  // Free users see limited history in compact, Pro sees all
  const freeLimit = compact ? 2 : 3;
  const proLimit = compact ? 3 : 20;
  const limit = isPremium ? proLimit : freeLimit;

  const displayProposals = proposals.slice(0, limit);
  const displayMockups = mockups.slice(0, isPremium ? (compact ? 4 : 20) : (compact ? 2 : 4));
  const displayCoverLetters = coverLetters.slice(0, limit);
  const displayEmails = emails.slice(0, limit);
  const displayInvoices = invoices.slice(0, limit);

  const currencySymbol = (c: string) => c === "USD" ? "$" : c === "EUR" ? "€" : c === "GBP" ? "£" : c;

  const TextHistoryItem = ({
    id, title, subtitle, content, onDelete, icon: Icon,
  }: {
    id: string; title: string; subtitle: string; content: string | null; onDelete: () => void; icon: React.ElementType;
  }) => (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpandedItem(expandedItem === id ? null : id)}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate flex items-center gap-2">
            <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            {title}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-1 ml-4">
          {content && (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); copyToClipboard(content, id); }}>
                {copiedId === id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); downloadAsText(content, `${id.slice(0, 8)}.txt`); }}>
                <Download className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
          </Button>
          {expandedItem === id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </div>
      {expandedItem === id && content && (
        <div className="border-t border-border p-4 bg-muted/10">
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {!isPremium && !compact && (
        <ProBanner isPremium={isPremium} feature="Full history with unlimited access" />
      )}

      {/* Proposals */}
      {proposals.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Saved Proposals ({proposals.length})
          </h3>
          <div className="space-y-3">
            {displayProposals.map((p) => (
              <TextHistoryItem
                key={p.id}
                id={p.id}
                icon={FileText}
                title={p.job_description.slice(0, 80) + "..."}
                subtitle={formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}
                content={p.generated_proposal}
                onDelete={() => deleteItem("proposals", p.id, setProposals)}
              />
            ))}
            {!isPremium && proposals.length > freeLimit && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Crown className="w-3 h-3 text-primary" /> +{proposals.length - freeLimit} more — upgrade to Pro to see all
              </p>
            )}
          </div>
        </div>
      )}

      {/* Cover Letters */}
      {coverLetters.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Saved Cover Letters ({coverLetters.length})
          </h3>
          <div className="space-y-3">
            {displayCoverLetters.map((cl) => (
              <TextHistoryItem
                key={cl.id}
                id={cl.id}
                icon={Mail}
                title={cl.job_title ? `${cl.job_title}${cl.company_name ? ` at ${cl.company_name}` : ""}` : cl.job_description.slice(0, 80) + "..."}
                subtitle={`${cl.tone ? cl.tone + " • " : ""}${formatDistanceToNow(new Date(cl.created_at), { addSuffix: true })}`}
                content={cl.generated_cover_letter}
                onDelete={() => deleteItem("cover_letters", cl.id, setCoverLetters)}
              />
            ))}
            {!isPremium && coverLetters.length > freeLimit && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Crown className="w-3 h-3 text-primary" /> +{coverLetters.length - freeLimit} more — upgrade to Pro
              </p>
            )}
          </div>
        </div>
      )}

      {/* Emails */}
      {emails.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Send className="w-4 h-4" />
            Saved Emails ({emails.length})
          </h3>
          <div className="space-y-3">
            {displayEmails.map((em) => (
              <TextHistoryItem
                key={em.id}
                id={em.id}
                icon={Send}
                title={em.subject_line || `${em.email_type} email`}
                subtitle={formatDistanceToNow(new Date(em.created_at), { addSuffix: true })}
                content={em.generated_email}
                onDelete={() => deleteItem("emails", em.id, setEmails)}
              />
            ))}
            {!isPremium && emails.length > freeLimit && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Crown className="w-3 h-3 text-primary" /> +{emails.length - freeLimit} more — upgrade to Pro
              </p>
            )}
          </div>
        </div>
      )}

      {/* Invoices */}
      {invoices.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Saved Invoices ({invoices.length})
          </h3>
          <div className="space-y-3">
            {displayInvoices.map((inv) => (
              <div key={inv.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate flex items-center gap-2">
                      <Receipt className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      {inv.invoice_number || "Invoice"} — {inv.client_name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded capitalize ${
                        inv.status === "paid" ? "bg-green-500/10 text-green-600" :
                        inv.status === "sent" ? "bg-blue-500/10 text-blue-600" :
                        "bg-muted text-muted-foreground"
                      }`}>{inv.status}</span>
                      <span className="text-sm font-semibold">{currencySymbol(inv.currency)}{Number(inv.total).toFixed(2)}</span>
                      <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(inv.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteItem("invoices", inv.id, setInvoices)}>
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            {!isPremium && invoices.length > freeLimit && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Crown className="w-3 h-3 text-primary" /> +{invoices.length - freeLimit} more — upgrade to Pro
              </p>
            )}
          </div>
        </div>
      )}

      {/* Mockups */}
      {mockups.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Saved Mockups ({mockups.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayMockups.map((mockup) => (
              <div key={mockup.id} className="group relative rounded-lg border border-border overflow-hidden bg-card">
                <div className="aspect-video">
                  <img src={mockup.image_url} alt="Mockup" className="w-full h-full object-cover" />
                </div>
                <div className="p-2">
                  <p className="text-xs text-muted-foreground truncate">{mockup.style_prompt || "No style specified"}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(mockup.created_at), { addSuffix: true })}
                  </p>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={mockup.image_url} download={`mockup-${mockup.id.slice(0, 8)}.png`} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="icon" className="h-7 w-7">
                      <Download className="w-3 h-3" />
                    </Button>
                  </a>
                  <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => deleteMockup(mockup.id, mockup.image_url)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {!isPremium && mockups.length > (compact ? 2 : 4) && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Crown className="w-3 h-3 text-primary" /> +{mockups.length - (compact ? 2 : 4)} more — upgrade to Pro
            </p>
          )}
        </div>
      )}
    </div>
  );
};
