import { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, GripVertical, Save, Eye, Globe, EyeOff,
  Type, Image, Briefcase, MessageSquare, Link2, ArrowUp, ArrowDown,
  Palette, ExternalLink, Copy, Upload, Loader2, Settings, Layers,
  Star, Clock, Zap, Grid3X3, BarChart3, Share2, ChevronDown, ChevronUp,
  CopyPlus, Code, Linkedin, Github, Twitter, Instagram, Globe2,
  Monitor, Smartphone
} from "lucide-react";

export interface PortfolioSection {
  id: string;
  type: "hero" | "about" | "projects" | "testimonial" | "contact" | "custom" | "skills" | "experience" | "services" | "gallery" | "stats";
  title: string;
  content: string;
  imageUrl?: string;
  items?: {
    title: string;
    description: string;
    link?: string;
    imageUrl?: string;
    tags?: string[];
    date?: string;
    icon?: string;
    value?: string;
  }[];
  layout?: "grid" | "list" | "masonry";
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface Portfolio {
  id: string;
  slug: string;
  title: string;
  bio: string;
  theme: string;
  sections: PortfolioSection[];
  is_published: boolean;
  font?: string;
  accentColor?: string;
  socialLinks?: SocialLink[];
}

const THEMES = [
  { id: "minimal", label: "Minimal", colors: "bg-white text-zinc-900", accent: "hsl(166, 72%, 28%)" },
  { id: "bold", label: "Bold Dark", colors: "bg-zinc-950 text-white", accent: "#f97316" },
  { id: "ocean", label: "Ocean", colors: "bg-slate-50 text-slate-900", accent: "#0ea5e9" },
  { id: "forest", label: "Forest", colors: "bg-emerald-50 text-emerald-950", accent: "#10b981" },
  { id: "sunset", label: "Sunset", colors: "bg-amber-50 text-amber-950", accent: "#f59e0b" },
  { id: "midnight", label: "Midnight", colors: "bg-indigo-950 text-indigo-50", accent: "#818cf8" },
  { id: "rose", label: "Rosé", colors: "bg-rose-50 text-rose-950", accent: "#f43f5e" },
  { id: "monochrome", label: "Monochrome", colors: "bg-neutral-100 text-neutral-900", accent: "#525252" },
  { id: "neon", label: "Neon", colors: "bg-black text-green-400", accent: "#22c55e" },
  { id: "lavender", label: "Lavender", colors: "bg-violet-50 text-violet-950", accent: "#8b5cf6" },
];

const FONTS = [
  { id: "inter", label: "Inter", family: "'Inter', sans-serif" },
  { id: "playfair", label: "Playfair Display", family: "'Playfair Display', serif" },
  { id: "space-grotesk", label: "Space Grotesk", family: "'Space Grotesk', sans-serif" },
  { id: "dm-sans", label: "DM Sans", family: "'DM Sans', sans-serif" },
  { id: "jetbrains", label: "JetBrains Mono", family: "'JetBrains Mono', monospace" },
  { id: "cabinet", label: "Cabinet Grotesk", family: "'Cabinet Grotesk', sans-serif" },
];

const SECTION_TYPES = [
  { type: "hero" as const, label: "Hero Banner", icon: Type, desc: "Large title with subtitle & CTA" },
  { type: "about" as const, label: "About Me", icon: MessageSquare, desc: "Bio and introduction" },
  { type: "projects" as const, label: "Projects", icon: Briefcase, desc: "Showcase your work with tags" },
  { type: "skills" as const, label: "Skills", icon: Code, desc: "Tech stack & skill bars" },
  { type: "experience" as const, label: "Experience", icon: Clock, desc: "Timeline of your career" },
  { type: "services" as const, label: "Services", icon: Zap, desc: "What you offer" },
  { type: "gallery" as const, label: "Gallery", icon: Grid3X3, desc: "Image showcase grid" },
  { type: "stats" as const, label: "Stats", icon: BarChart3, desc: "Key numbers & metrics" },
  { type: "testimonial" as const, label: "Testimonial", icon: Star, desc: "Client quotes & reviews" },
  { type: "contact" as const, label: "Contact", icon: Link2, desc: "Contact information" },
  { type: "custom" as const, label: "Custom", icon: Type, desc: "Free-form content" },
];

const SOCIAL_PLATFORMS = [
  { id: "linkedin", label: "LinkedIn", icon: "linkedin" },
  { id: "github", label: "GitHub", icon: "github" },
  { id: "twitter", label: "X / Twitter", icon: "twitter" },
  { id: "instagram", label: "Instagram", icon: "instagram" },
  { id: "website", label: "Website", icon: "globe" },
  { id: "dribbble", label: "Dribbble", icon: "dribbble" },
  { id: "behance", label: "Behance", icon: "behance" },
];

interface PortfolioBuilderProps {
  userId: string;
  userEmail?: string;
}

const ImageUpload = ({
  currentUrl,
  onUpload,
  userId,
  label = "Image",
}: {
  currentUrl?: string;
  onUpload: (url: string) => void;
  userId: string;
  label?: string;
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please select an image file", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image must be under 5MB", variant: "destructive" });
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const filePath = `${userId}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("portfolio-images").upload(filePath, file, { upsert: true });
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: publicUrlData } = supabase.storage.from("portfolio-images").getPublicUrl(filePath);
    onUpload(publicUrlData.publicUrl);
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">{label}</Label>
      {currentUrl && (
        <div className="relative w-full h-28 rounded-lg overflow-hidden border border-border bg-muted">
          <img src={currentUrl} alt="Preview" className="w-full h-full object-cover" />
          <button
            onClick={() => onUpload("")}
            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs hover:opacity-80"
          >
            ✕
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex-1">
          {uploading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Upload className="w-3 h-3 mr-1" />}
          {uploading ? "Uploading..." : "Upload"}
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>
      <Input value={currentUrl || ""} onChange={(e) => onUpload(e.target.value)} placeholder="Or paste URL..." className="text-xs h-8" />
    </div>
  );
};

// Tag input component
const TagInput = ({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) => {
  const [input, setInput] = useState("");
  const addTag = () => {
    const tag = input.trim();
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInput("");
  };
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-1">
        {tags.map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {tag}
            <button onClick={() => onChange(tags.filter((_, j) => j !== i))} className="hover:text-destructive">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-1">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          placeholder="Add tag..."
          className="text-xs h-7 flex-1"
        />
        <Button type="button" variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={addTag}>+</Button>
      </div>
    </div>
  );
};

// Live preview component
const LivePreview = ({ portfolio, previewMode }: { portfolio: Portfolio; previewMode: "desktop" | "mobile" }) => {
  const fontFamily = FONTS.find(f => f.id === (portfolio.font || "inter"))?.family || "'Inter', sans-serif";
  
  return (
    <div className={`bg-muted rounded-xl border border-border overflow-hidden ${previewMode === "mobile" ? "max-w-[375px] mx-auto" : ""}`}>
      <div className="bg-muted-foreground/10 px-3 py-1.5 flex items-center gap-1.5 border-b border-border">
        <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        <span className="text-[10px] text-muted-foreground ml-2 truncate">propel.app/portfolio/{portfolio.slug}</span>
      </div>
      <div className="h-[500px] overflow-y-auto bg-background" style={{ fontFamily }}>
        {portfolio.sections.map((section, i) => (
          <div key={section.id || i}>
            {section.type === "hero" && (
              <div className="relative px-6 py-16 text-center" style={section.imageUrl ? { backgroundImage: `url(${section.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}>
                {section.imageUrl && <div className="absolute inset-0 bg-black/50" />}
                <div className="relative z-10">
                  <h1 className={`text-2xl font-bold mb-2 ${section.imageUrl ? "text-white" : ""}`}>{section.title || "Your Name"}</h1>
                  <p className={`text-sm ${section.imageUrl ? "text-white/80" : "text-muted-foreground"}`}>{section.content || "Your tagline"}</p>
                </div>
              </div>
            )}
            {section.type === "about" && (
              <div className="px-6 py-8">
                <h2 className="text-lg font-bold mb-2 text-primary">{section.title}</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            )}
            {section.type === "projects" && (
              <div className="px-6 py-8">
                <h2 className="text-lg font-bold mb-4 text-primary text-center">{section.title}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {(section.items || []).slice(0, 4).map((item, j) => (
                    <div key={j} className="rounded-lg border border-border p-3 bg-card">
                      {item.imageUrl && <div className="h-16 rounded mb-2 overflow-hidden"><img src={item.imageUrl} alt="" className="w-full h-full object-cover" /></div>}
                      <p className="text-xs font-semibold">{item.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.description}</p>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.tags.map((t, k) => <span key={k} className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">{t}</span>)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {section.type === "skills" && (
              <div className="px-6 py-8">
                <h2 className="text-lg font-bold mb-4 text-primary text-center">{section.title}</h2>
                <div className="flex flex-wrap gap-2 justify-center">
                  {(section.items || []).map((item, j) => (
                    <span key={j} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium">{item.title}</span>
                  ))}
                </div>
              </div>
            )}
            {section.type === "experience" && (
              <div className="px-6 py-8">
                <h2 className="text-lg font-bold mb-4 text-primary text-center">{section.title}</h2>
                <div className="space-y-3 border-l-2 border-primary/30 pl-4">
                  {(section.items || []).map((item, j) => (
                    <div key={j}>
                      <p className="text-[10px] text-muted-foreground">{item.date}</p>
                      <p className="text-xs font-semibold">{item.title}</p>
                      <p className="text-[10px] text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {section.type === "services" && (
              <div className="px-6 py-8">
                <h2 className="text-lg font-bold mb-4 text-primary text-center">{section.title}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {(section.items || []).map((item, j) => (
                    <div key={j} className="p-3 rounded-lg border border-border text-center">
                      <p className="text-xs font-semibold">{item.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{item.description}</p>
                      {item.value && <p className="text-xs font-bold text-primary mt-1">{item.value}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {section.type === "gallery" && (
              <div className="px-6 py-8">
                <h2 className="text-lg font-bold mb-4 text-primary text-center">{section.title}</h2>
                <div className="grid grid-cols-3 gap-2">
                  {(section.items || []).filter(i => i.imageUrl).slice(0, 6).map((item, j) => (
                    <div key={j} className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {section.type === "stats" && (
              <div className="px-6 py-8 bg-primary/5">
                <h2 className="text-lg font-bold mb-4 text-primary text-center">{section.title}</h2>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {(section.items || []).map((item, j) => (
                    <div key={j}>
                      <p className="text-xl font-bold text-primary">{item.value || "0"}</p>
                      <p className="text-[10px] text-muted-foreground">{item.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {section.type === "testimonial" && (
              <div className="px-6 py-8 bg-muted/50">
                <h2 className="text-lg font-bold mb-3 text-primary text-center">{section.title}</h2>
                <blockquote className="text-xs italic text-muted-foreground text-center">"{section.content}"</blockquote>
              </div>
            )}
            {section.type === "contact" && (
              <div className="px-6 py-8 text-center">
                <h2 className="text-lg font-bold mb-2 text-primary">{section.title}</h2>
                <p className="text-xs text-muted-foreground">{section.content}</p>
              </div>
            )}
            {section.type === "custom" && (
              <div className="px-6 py-8">
                <h2 className="text-lg font-bold mb-2 text-primary">{section.title}</h2>
                <p className="text-xs text-muted-foreground whitespace-pre-wrap">{section.content}</p>
              </div>
            )}
          </div>
        ))}
        {(portfolio.socialLinks || []).length > 0 && (
          <div className="px-6 py-4 flex justify-center gap-3 border-t border-border">
            {portfolio.socialLinks!.map((link, i) => (
              <span key={i} className="text-xs text-primary">{link.platform}</span>
            ))}
          </div>
        )}
        <div className="py-4 text-center border-t border-border">
          <p className="text-[10px] text-muted-foreground">Built with Propel</p>
        </div>
      </div>
    </div>
  );
};

export const PortfolioBuilder = ({ userId, userEmail }: PortfolioBuilderProps) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("sections");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchPortfolio();
  }, [userId]);

  const fetchPortfolio = async () => {
    setLoading(true);
    const { data } = await supabase.from("portfolios").select("*").eq("user_id", userId).maybeSingle();
    if (data) {
      const sections = (Array.isArray(data.sections) ? data.sections : []) as unknown as PortfolioSection[];
      // Parse extended data from bio field (JSON encoded extra settings)
      let font = "inter";
      let accentColor = "";
      let socialLinks: SocialLink[] = [];
      try {
        const extra = data.bio ? JSON.parse(data.bio) : null;
        if (extra && extra.__extended) {
          font = extra.font || "inter";
          accentColor = extra.accentColor || "";
          socialLinks = extra.socialLinks || [];
          // actual bio is stored separately
        }
      } catch { /* bio is plain text */ }
      
      setPortfolio({
        ...data,
        sections,
        font,
        accentColor,
        socialLinks,
        bio: data.bio && data.bio.startsWith("{") ? (JSON.parse(data.bio).bio || "") : (data.bio || ""),
      });
    } else {
      const slug = (userEmail?.split("@")[0] || "my-portfolio") + "-" + Math.random().toString(36).slice(2, 6);
      const defaultSections: PortfolioSection[] = [
        { id: crypto.randomUUID(), type: "hero", title: "Hello, I'm a Freelancer", content: "I create amazing digital experiences.", items: [] },
        { id: crypto.randomUUID(), type: "about", title: "About Me", content: "Tell your story here...", items: [] },
        { id: crypto.randomUUID(), type: "skills", title: "My Skills", content: "", items: [
          { title: "React", description: "" }, { title: "TypeScript", description: "" }, { title: "Node.js", description: "" }, { title: "Figma", description: "" },
        ]},
        { id: crypto.randomUUID(), type: "projects", title: "My Work", content: "", items: [{ title: "Project 1", description: "A brief description", link: "", tags: ["React", "Design"] }] },
        { id: crypto.randomUUID(), type: "stats", title: "By the Numbers", content: "", items: [
          { title: "Projects", description: "", value: "50+" }, { title: "Clients", description: "", value: "30+" }, { title: "Years", description: "", value: "5+" }
        ]},
        { id: crypto.randomUUID(), type: "contact", title: "Get In Touch", content: userEmail || "email@example.com", items: [] },
      ];
      const { data: created } = await supabase
        .from("portfolios")
        .insert({ user_id: userId, slug, title: "My Portfolio", bio: "", theme: "minimal", sections: defaultSections as any, is_published: false })
        .select()
        .single();
      if (created) {
        setPortfolio({ ...created, sections: defaultSections, font: "inter", accentColor: "", socialLinks: [] });
      }
    }
    setLoading(false);
  };

  const savePortfolio = async () => {
    if (!portfolio) return;
    setSaving(true);
    // Encode extended settings into bio field
    const extendedBio = JSON.stringify({
      __extended: true,
      bio: portfolio.bio,
      font: portfolio.font,
      accentColor: portfolio.accentColor,
      socialLinks: portfolio.socialLinks,
    });
    const { error } = await supabase
      .from("portfolios")
      .update({
        title: portfolio.title,
        bio: extendedBio,
        slug: portfolio.slug,
        theme: portfolio.theme,
        sections: portfolio.sections as any,
        is_published: portfolio.is_published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", portfolio.id);
    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Portfolio saved! ✅" });
    }
    setSaving(false);
  };

  const togglePublish = async () => {
    if (!portfolio) return;
    const newState = !portfolio.is_published;
    setPortfolio({ ...portfolio, is_published: newState });
    const { error } = await supabase
      .from("portfolios")
      .update({ is_published: newState, updated_at: new Date().toISOString() })
      .eq("id", portfolio.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: newState ? "Portfolio published! 🌐" : "Portfolio unpublished" });
    }
  };

  const addSection = (type: PortfolioSection["type"]) => {
    if (!portfolio) return;
    const defaultItems: Record<string, any[]> = {
      projects: [{ title: "New Project", description: "", link: "", tags: [] }],
      skills: [{ title: "Skill", description: "" }],
      experience: [{ title: "Role at Company", description: "What you did", date: "2024 - Present" }],
      services: [{ title: "Service", description: "What you offer", value: "$99" }],
      gallery: [{ title: "", description: "", imageUrl: "" }],
      stats: [{ title: "Metric", description: "", value: "100+" }],
    };
    const newSection: PortfolioSection = {
      id: crypto.randomUUID(),
      type,
      title: SECTION_TYPES.find((s) => s.type === type)?.label || "New Section",
      content: "",
      items: defaultItems[type] || [],
      layout: type === "gallery" ? "grid" : undefined,
    };
    setPortfolio({ ...portfolio, sections: [...portfolio.sections, newSection] });
    setShowAddSection(false);
    setEditingSection(newSection.id);
  };

  const duplicateSection = (id: string) => {
    if (!portfolio) return;
    const section = portfolio.sections.find(s => s.id === id);
    if (!section) return;
    const dupe = { ...section, id: crypto.randomUUID(), title: section.title + " (Copy)", items: section.items?.map(i => ({ ...i })) };
    const idx = portfolio.sections.findIndex(s => s.id === id);
    const sections = [...portfolio.sections];
    sections.splice(idx + 1, 0, dupe);
    setPortfolio({ ...portfolio, sections });
    toast({ title: "Section duplicated" });
  };

  const updateSection = (id: string, updates: Partial<PortfolioSection>) => {
    if (!portfolio) return;
    setPortfolio({ ...portfolio, sections: portfolio.sections.map((s) => (s.id === id ? { ...s, ...updates } : s)) });
  };

  const deleteSection = (id: string) => {
    if (!portfolio) return;
    setPortfolio({ ...portfolio, sections: portfolio.sections.filter((s) => s.id !== id) });
  };

  const moveSection = (fromIndex: number, toIndex: number) => {
    if (!portfolio || toIndex < 0 || toIndex >= portfolio.sections.length) return;
    const sections = [...portfolio.sections];
    const [moved] = sections.splice(fromIndex, 1);
    sections.splice(toIndex, 0, moved);
    setPortfolio({ ...portfolio, sections });
  };

  const portfolioUrl = portfolio ? `${window.location.origin}/portfolio/${portfolio.slug}` : "";
  const copyUrl = () => {
    navigator.clipboard.writeText(portfolioUrl);
    toast({ title: "URL copied! 📋" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  if (!portfolio) return null;

  return (
    <div className="space-y-4">
      {/* Top Actions Bar */}
      <div className="flex items-center justify-between gap-3 p-4 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2">
          <Button onClick={savePortfolio} disabled={saving} size="sm">
            <Save className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save"}
          </Button>
          <Button variant={portfolio.is_published ? "destructive" : "default"} onClick={togglePublish} size="sm">
            {portfolio.is_published ? <EyeOff className="w-4 h-4 mr-1" /> : <Globe className="w-4 h-4 mr-1" />}
            {portfolio.is_published ? "Unpublish" : "Publish"}
          </Button>
          {portfolio.is_published && (
            <>
              <Button variant="outline" onClick={copyUrl} size="sm"><Copy className="w-4 h-4 mr-1" /> URL</Button>
              <a href={portfolioUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm"><ExternalLink className="w-4 h-4 mr-1" /> Open</Button>
              </a>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant={showPreview ? "default" : "outline"} size="sm" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="w-4 h-4 mr-1" /> Preview
          </Button>
        </div>
      </div>

      <div className={`grid gap-4 ${showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
        {/* Editor Panel */}
        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="sections"><Layers className="w-4 h-4 mr-1" /> Sections</TabsTrigger>
              <TabsTrigger value="design"><Palette className="w-4 h-4 mr-1" /> Design</TabsTrigger>
              <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-1" /> Settings</TabsTrigger>
            </TabsList>

            {/* === SECTIONS TAB === */}
            <TabsContent value="sections" className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{portfolio.sections.length} Sections</h3>
                <Button size="sm" onClick={() => setShowAddSection(!showAddSection)}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>

              <AnimatePresence>
                {showAddSection && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                      {SECTION_TYPES.map((st) => {
                        const Icon = st.icon;
                        return (
                          <button key={st.type} onClick={() => addSection(st.type)} className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors text-left">
                            <Icon className="w-4 h-4 text-primary shrink-0" />
                            <div>
                              <p className="text-xs font-medium">{st.label}</p>
                              <p className="text-[10px] text-muted-foreground">{st.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Section List */}
              <div className="space-y-2">
                {portfolio.sections.map((section, index) => {
                  const sectionType = SECTION_TYPES.find((s) => s.type === section.type);
                  const Icon = sectionType?.icon || Type;
                  const isEditing = editingSection === section.id;

                  return (
                    <div key={section.id} className="rounded-lg border border-border bg-card">
                      <div className="flex items-center gap-2 p-2.5 cursor-pointer" onClick={() => setEditingSection(isEditing ? null : section.id)}>
                        <GripVertical className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{section.title}</p>
                          <p className="text-[10px] text-muted-foreground capitalize">{section.type}</p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); moveSection(index, index - 1); }}><ArrowUp className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); moveSection(index, index + 1); }}><ArrowDown className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); duplicateSection(section.id); }}><CopyPlus className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                          {isEditing ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </div>
                      </div>

                      <AnimatePresence>
                        {isEditing && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="px-3 pb-3 space-y-3 border-t border-border pt-3">
                              <div>
                                <Label className="text-xs">Title</Label>
                                <Input value={section.title} onChange={(e) => updateSection(section.id, { title: e.target.value })} className="h-8 text-sm" />
                              </div>
                              {!["skills", "gallery", "stats"].includes(section.type) && (
                                <div>
                                  <Label className="text-xs">Content</Label>
                                  <Textarea value={section.content} onChange={(e) => updateSection(section.id, { content: e.target.value })} rows={2} className="text-sm"
                                    placeholder={section.type === "contact" ? "your@email.com" : section.type === "testimonial" ? '"Great work!" — Client' : "Write content..."}
                                  />
                                </div>
                              )}

                              {["hero", "about", "testimonial", "custom"].includes(section.type) && (
                                <ImageUpload currentUrl={section.imageUrl} onUpload={(url) => updateSection(section.id, { imageUrl: url })} userId={userId} label={section.type === "hero" ? "Background Image" : "Image"} />
                              )}

                              {/* Projects editor */}
                              {section.type === "projects" && (
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium">Projects</Label>
                                  {(section.items || []).map((item, j) => (
                                    <div key={j} className="space-y-2 p-2.5 rounded-lg border border-border bg-muted/30">
                                      <div className="grid grid-cols-2 gap-2">
                                        <Input value={item.title} onChange={(e) => { const items = [...(section.items || [])]; items[j] = { ...items[j], title: e.target.value }; updateSection(section.id, { items }); }} placeholder="Name" className="h-7 text-xs" />
                                        <Input value={item.link || ""} onChange={(e) => { const items = [...(section.items || [])]; items[j] = { ...items[j], link: e.target.value }; updateSection(section.id, { items }); }} placeholder="URL" className="h-7 text-xs" />
                                      </div>
                                      <Textarea value={item.description} onChange={(e) => { const items = [...(section.items || [])]; items[j] = { ...items[j], description: e.target.value }; updateSection(section.id, { items }); }} placeholder="Description" rows={2} className="text-xs" />
                                      <TagInput tags={item.tags || []} onChange={(tags) => { const items = [...(section.items || [])]; items[j] = { ...items[j], tags }; updateSection(section.id, { items }); }} />
                                      <ImageUpload currentUrl={item.imageUrl} onUpload={(url) => { const items = [...(section.items || [])]; items[j] = { ...items[j], imageUrl: url }; updateSection(section.id, { items }); }} userId={userId} label="Screenshot" />
                                      <Button variant="ghost" size="sm" className="text-xs text-destructive" onClick={() => { const items = (section.items || []).filter((_, i) => i !== j); updateSection(section.id, { items }); }}><Trash2 className="w-3 h-3 mr-1" /> Remove</Button>
                                    </div>
                                  ))}
                                  <Button variant="outline" size="sm" className="text-xs" onClick={() => updateSection(section.id, { items: [...(section.items || []), { title: "", description: "", link: "", tags: [] }] })}><Plus className="w-3 h-3 mr-1" /> Add Project</Button>
                                </div>
                              )}

                              {/* Skills editor */}
                              {section.type === "skills" && (
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium">Skills</Label>
                                  <div className="flex flex-wrap gap-1.5">
                                    {(section.items || []).map((item, j) => (
                                      <span key={j} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                                        {item.title}
                                        <button onClick={() => { const items = (section.items || []).filter((_, i) => i !== j); updateSection(section.id, { items }); }} className="hover:text-destructive">×</button>
                                      </span>
                                    ))}
                                  </div>
                                  <div className="flex gap-1">
                                    <Input id={`skill-${section.id}`} placeholder="Add skill..." className="h-7 text-xs flex-1" onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        const val = (e.target as HTMLInputElement).value.trim();
                                        if (val) {
                                          updateSection(section.id, { items: [...(section.items || []), { title: val, description: "" }] });
                                          (e.target as HTMLInputElement).value = "";
                                        }
                                      }
                                    }} />
                                  </div>
                                </div>
                              )}

                              {/* Experience editor */}
                              {section.type === "experience" && (
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium">Experience</Label>
                                  {(section.items || []).map((item, j) => (
                                    <div key={j} className="space-y-1.5 p-2.5 rounded-lg border border-border bg-muted/30">
                                      <Input value={item.date || ""} onChange={(e) => { const items = [...(section.items || [])]; items[j] = { ...items[j], date: e.target.value }; updateSection(section.id, { items }); }} placeholder="2024 - Present" className="h-7 text-xs" />
                                      <Input value={item.title} onChange={(e) => { const items = [...(section.items || [])]; items[j] = { ...items[j], title: e.target.value }; updateSection(section.id, { items }); }} placeholder="Role at Company" className="h-7 text-xs" />
                                      <Textarea value={item.description} onChange={(e) => { const items = [...(section.items || [])]; items[j] = { ...items[j], description: e.target.value }; updateSection(section.id, { items }); }} placeholder="What you did..." rows={2} className="text-xs" />
                                      <Button variant="ghost" size="sm" className="text-xs text-destructive" onClick={() => updateSection(section.id, { items: (section.items || []).filter((_, i) => i !== j) })}><Trash2 className="w-3 h-3 mr-1" /> Remove</Button>
                                    </div>
                                  ))}
                                  <Button variant="outline" size="sm" className="text-xs" onClick={() => updateSection(section.id, { items: [...(section.items || []), { title: "", description: "", date: "" }] })}><Plus className="w-3 h-3 mr-1" /> Add Experience</Button>
                                </div>
                              )}

                              {/* Services editor */}
                              {section.type === "services" && (
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium">Services</Label>
                                  {(section.items || []).map((item, j) => (
                                    <div key={j} className="space-y-1.5 p-2.5 rounded-lg border border-border bg-muted/30">
                                      <div className="grid grid-cols-2 gap-2">
                                        <Input value={item.title} onChange={(e) => { const items = [...(section.items || [])]; items[j] = { ...items[j], title: e.target.value }; updateSection(section.id, { items }); }} placeholder="Service name" className="h-7 text-xs" />
                                        <Input value={item.value || ""} onChange={(e) => { const items = [...(section.items || [])]; items[j] = { ...items[j], value: e.target.value }; updateSection(section.id, { items }); }} placeholder="Price (optional)" className="h-7 text-xs" />
                                      </div>
                                      <Textarea value={item.description} onChange={(e) => { const items = [...(section.items || [])]; items[j] = { ...items[j], description: e.target.value }; updateSection(section.id, { items }); }} placeholder="Description" rows={2} className="text-xs" />
                                      <Button variant="ghost" size="sm" className="text-xs text-destructive" onClick={() => updateSection(section.id, { items: (section.items || []).filter((_, i) => i !== j) })}><Trash2 className="w-3 h-3 mr-1" /> Remove</Button>
                                    </div>
                                  ))}
                                  <Button variant="outline" size="sm" className="text-xs" onClick={() => updateSection(section.id, { items: [...(section.items || []), { title: "", description: "", value: "" }] })}><Plus className="w-3 h-3 mr-1" /> Add Service</Button>
                                </div>
                              )}

                              {/* Gallery editor */}
                              {section.type === "gallery" && (
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium">Gallery Images</Label>
                                  <div className="grid grid-cols-2 gap-2">
                                    {(section.items || []).map((item, j) => (
                                      <div key={j} className="relative">
                                        <ImageUpload currentUrl={item.imageUrl} onUpload={(url) => { const items = [...(section.items || [])]; items[j] = { ...items[j], imageUrl: url }; updateSection(section.id, { items }); }} userId={userId} label={`Image ${j + 1}`} />
                                        <Input value={item.title || ""} onChange={(e) => { const items = [...(section.items || [])]; items[j] = { ...items[j], title: e.target.value }; updateSection(section.id, { items }); }} placeholder="Caption" className="h-7 text-xs mt-1" />
                                        <Button variant="ghost" size="sm" className="text-xs text-destructive mt-1" onClick={() => updateSection(section.id, { items: (section.items || []).filter((_, i) => i !== j) })}><Trash2 className="w-3 h-3" /></Button>
                                      </div>
                                    ))}
                                  </div>
                                  <Button variant="outline" size="sm" className="text-xs" onClick={() => updateSection(section.id, { items: [...(section.items || []), { title: "", description: "", imageUrl: "" }] })}><Plus className="w-3 h-3 mr-1" /> Add Image</Button>
                                </div>
                              )}

                              {/* Stats editor */}
                              {section.type === "stats" && (
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium">Metrics</Label>
                                  {(section.items || []).map((item, j) => (
                                    <div key={j} className="flex items-center gap-2">
                                      <Input value={item.value || ""} onChange={(e) => { const items = [...(section.items || [])]; items[j] = { ...items[j], value: e.target.value }; updateSection(section.id, { items }); }} placeholder="100+" className="h-7 text-xs w-20" />
                                      <Input value={item.title} onChange={(e) => { const items = [...(section.items || [])]; items[j] = { ...items[j], title: e.target.value }; updateSection(section.id, { items }); }} placeholder="Label" className="h-7 text-xs flex-1" />
                                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateSection(section.id, { items: (section.items || []).filter((_, i) => i !== j) })}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                                    </div>
                                  ))}
                                  <Button variant="outline" size="sm" className="text-xs" onClick={() => updateSection(section.id, { items: [...(section.items || []), { title: "", description: "", value: "" }] })}><Plus className="w-3 h-3 mr-1" /> Add Stat</Button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* === DESIGN TAB === */}
            <TabsContent value="design" className="space-y-4 mt-4">
              {/* Theme Picker */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Theme</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {THEMES.map((theme) => (
                    <button key={theme.id} onClick={() => setPortfolio({ ...portfolio, theme: theme.id })}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all text-xs font-medium ${portfolio.theme === theme.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}>
                      <div className="w-3.5 h-3.5 rounded-full border border-border" style={{ backgroundColor: theme.accent }} />
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Picker */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Font</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {FONTS.map((font) => (
                    <button key={font.id} onClick={() => setPortfolio({ ...portfolio, font: font.id })}
                      className={`px-3 py-2 rounded-lg border-2 transition-all text-xs ${portfolio.font === font.id ? "border-primary bg-primary/5 font-semibold" : "border-border hover:border-muted-foreground/30"}`}
                      style={{ fontFamily: font.family }}>
                      {font.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Accent Color */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Custom Accent Color</Label>
                <div className="flex items-center gap-3">
                  <input type="color" value={portfolio.accentColor || "#009b72"} onChange={(e) => setPortfolio({ ...portfolio, accentColor: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer border border-border" />
                  <Input value={portfolio.accentColor || ""} onChange={(e) => setPortfolio({ ...portfolio, accentColor: e.target.value })} placeholder="#009b72" className="h-8 text-xs w-32" />
                  {portfolio.accentColor && (
                    <Button variant="ghost" size="sm" className="text-xs" onClick={() => setPortfolio({ ...portfolio, accentColor: "" })}>Reset</Button>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">Override the theme accent color</p>
              </div>
            </TabsContent>

            {/* === SETTINGS TAB === */}
            <TabsContent value="settings" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Portfolio Title</Label>
                  <Input value={portfolio.title} onChange={(e) => setPortfolio({ ...portfolio, title: e.target.value })} placeholder="My Portfolio" className="h-8 text-sm" />
                </div>
                <div>
                  <Label className="text-xs">URL Slug</Label>
                  <Input value={portfolio.slug} onChange={(e) => setPortfolio({ ...portfolio, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} placeholder="my-portfolio" className="h-8 text-sm" />
                </div>
                <div>
                  <Label className="text-xs">Bio / Tagline</Label>
                  <Textarea value={portfolio.bio} onChange={(e) => setPortfolio({ ...portfolio, bio: e.target.value })} placeholder="A brief intro..." rows={2} className="text-sm" />
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2"><Share2 className="w-4 h-4" /> Social Links</Label>
                {(portfolio.socialLinks || []).map((link, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <select value={link.platform} onChange={(e) => {
                      const links = [...(portfolio.socialLinks || [])];
                      links[i] = { ...links[i], platform: e.target.value, icon: SOCIAL_PLATFORMS.find(p => p.id === e.target.value)?.icon || "globe" };
                      setPortfolio({ ...portfolio, socialLinks: links });
                    }} className="h-7 text-xs rounded-md border border-input bg-background px-2">
                      {SOCIAL_PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                    </select>
                    <Input value={link.url} onChange={(e) => {
                      const links = [...(portfolio.socialLinks || [])];
                      links[i] = { ...links[i], url: e.target.value };
                      setPortfolio({ ...portfolio, socialLinks: links });
                    }} placeholder="https://..." className="h-7 text-xs flex-1" />
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setPortfolio({ ...portfolio, socialLinks: (portfolio.socialLinks || []).filter((_, j) => j !== i) })}>
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="text-xs" onClick={() => setPortfolio({ ...portfolio, socialLinks: [...(portfolio.socialLinks || []), { platform: "linkedin", url: "", icon: "linkedin" }] })}>
                  <Plus className="w-3 h-3 mr-1" /> Add Link
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview Panel */}
        {showPreview && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Live Preview</h3>
              <div className="flex items-center gap-1">
                <Button variant={previewMode === "desktop" ? "default" : "outline"} size="sm" className="h-7 px-2" onClick={() => setPreviewMode("desktop")}><Monitor className="w-3 h-3" /></Button>
                <Button variant={previewMode === "mobile" ? "default" : "outline"} size="sm" className="h-7 px-2" onClick={() => setPreviewMode("mobile")}><Smartphone className="w-3 h-3" /></Button>
              </div>
            </div>
            <LivePreview portfolio={portfolio} previewMode={previewMode} />
          </div>
        )}
      </div>

      {portfolio.is_published && (
        <p className="text-xs text-muted-foreground text-center">
          Live at <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">{portfolioUrl}</a>
        </p>
      )}
    </div>
  );
};
