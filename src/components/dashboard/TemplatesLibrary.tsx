import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, Mail, Trash2, Copy, Check, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Template {
  id: string;
  type: string;
  title: string;
  content: string;
  created_at: string;
}

interface TemplatesLibraryProps {
  userId: string;
  onUseTemplate?: (content: string, type: string) => void;
}

export const TemplatesLibrary = ({ userId, onUseTemplate }: TemplatesLibraryProps) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTemplates = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("templates" as any)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (!error && data) setTemplates(data as unknown as Template[]);
    setIsLoading(false);
  };

  useEffect(() => { fetchTemplates(); }, [userId]);

  const deleteTemplate = async (id: string) => {
    const { error } = await supabase.from("templates" as any).delete().eq("id", id);
    if (!error) {
      setTemplates(prev => prev.filter(t => t.id !== id));
      toast({ title: "Template deleted" });
    }
  };

  const copyContent = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = templates.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.type.toLowerCase().includes(search.toLowerCase())
  );

  const typeIcon = (type: string) => type === "email" ? Mail : FileText;

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="font-medium mb-2">{templates.length === 0 ? "No templates yet" : "No matching templates"}</h3>
          <p className="text-sm text-muted-foreground">Save your best proposals, cover letters, or emails as templates to reuse them.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((template) => {
            const Icon = typeIcon(template.type);
            return (
              <div key={template.id} className="rounded-lg border border-border bg-card overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedId(expandedId === template.id ? null : template.id)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Icon className="w-4 h-4 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{template.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground capitalize">{template.type}</span>
                        <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(template.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    {onUseTemplate && (
                      <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onUseTemplate(template.content, template.type); }}>
                        Use
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); copyContent(template.content, template.id); }}>
                      {copiedId === template.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); deleteTemplate(template.id); }}>
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </div>
                {expandedId === template.id && (
                  <div className="border-t border-border p-4 bg-muted/10">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{template.content}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Helper to save as template from other components
export const saveAsTemplate = async (userId: string, type: string, title: string, content: string, toast: any) => {
  const { error } = await supabase.from("templates" as any).insert({ user_id: userId, type, title, content });
  if (error) {
    toast({ title: "Failed to save template", variant: "destructive" });
  } else {
    toast({ title: "Saved as template!" });
  }
};
