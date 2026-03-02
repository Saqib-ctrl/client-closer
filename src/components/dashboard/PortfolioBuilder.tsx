import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, GripVertical, Save, Eye, Globe, EyeOff,
  Type, Image, Briefcase, MessageSquare, Link2, ArrowUp, ArrowDown,
  Palette, ExternalLink, Copy
} from "lucide-react";

export interface PortfolioSection {
  id: string;
  type: "hero" | "about" | "projects" | "testimonial" | "contact" | "custom";
  title: string;
  content: string;
  imageUrl?: string;
  items?: { title: string; description: string; link?: string }[];
}

interface Portfolio {
  id: string;
  slug: string;
  title: string;
  bio: string;
  theme: string;
  sections: PortfolioSection[];
  is_published: boolean;
}

const THEMES = [
  { id: "minimal", label: "Minimal", colors: "bg-white text-gray-900 dark:bg-zinc-950 dark:text-white", accent: "hsl(var(--primary))" },
  { id: "bold", label: "Bold", colors: "bg-black text-white", accent: "#f97316" },
  { id: "ocean", label: "Ocean", colors: "bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100", accent: "#0ea5e9" },
  { id: "forest", label: "Forest", colors: "bg-emerald-50 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-50", accent: "#10b981" },
  { id: "sunset", label: "Sunset", colors: "bg-orange-50 text-orange-950 dark:bg-orange-950 dark:text-orange-50", accent: "#f59e0b" },
];

const SECTION_TYPES = [
  { type: "hero" as const, label: "Hero Banner", icon: Type, desc: "Large title with subtitle" },
  { type: "about" as const, label: "About Me", icon: MessageSquare, desc: "Bio and introduction" },
  { type: "projects" as const, label: "Projects", icon: Briefcase, desc: "Showcase your work" },
  { type: "testimonial" as const, label: "Testimonial", icon: MessageSquare, desc: "Client quotes" },
  { type: "contact" as const, label: "Contact", icon: Link2, desc: "Contact information" },
  { type: "custom" as const, label: "Custom", icon: Type, desc: "Free-form content" },
];

interface PortfolioBuilderProps {
  userId: string;
  userEmail?: string;
}

export const PortfolioBuilder = ({ userId, userEmail }: PortfolioBuilderProps) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchPortfolio();
  }, [userId]);

  const fetchPortfolio = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (data) {
      setPortfolio({
        ...data,
        sections: (Array.isArray(data.sections) ? data.sections : []) as unknown as PortfolioSection[],
      });
    } else {
      // Create default portfolio
      const slug = (userEmail?.split("@")[0] || "my-portfolio") + "-" + Math.random().toString(36).slice(2, 6);
      const defaultPortfolio: Omit<Portfolio, "id"> = {
        slug,
        title: "My Portfolio",
        bio: "",
        theme: "minimal",
        sections: [
          { id: crypto.randomUUID(), type: "hero", title: "Hello, I'm a Freelancer", content: "I create amazing things for amazing people.", items: [] },
          { id: crypto.randomUUID(), type: "about", title: "About Me", content: "Tell your story here...", items: [] },
          { id: crypto.randomUUID(), type: "projects", title: "My Work", content: "", items: [{ title: "Project 1", description: "A brief description", link: "" }] },
          { id: crypto.randomUUID(), type: "contact", title: "Get In Touch", content: userEmail || "email@example.com", items: [] },
        ],
        is_published: false,
      };

      const insertData = {
        user_id: userId,
        slug: defaultPortfolio.slug,
        title: defaultPortfolio.title,
        bio: defaultPortfolio.bio,
        theme: defaultPortfolio.theme,
        sections: defaultPortfolio.sections as unknown as any,
        is_published: defaultPortfolio.is_published,
      };

      const { data: created, error: createErr } = await supabase
        .from("portfolios")
        .insert(insertData)
        .select()
        .single();

      if (created) {
        setPortfolio({ ...created, sections: defaultPortfolio.sections });
      }
    }
    setLoading(false);
  };

  const savePortfolio = async () => {
    if (!portfolio) return;
    setSaving(true);
    const { error } = await supabase
      .from("portfolios")
      .update({
        title: portfolio.title,
        bio: portfolio.bio,
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
    const newSection: PortfolioSection = {
      id: crypto.randomUUID(),
      type,
      title: SECTION_TYPES.find((s) => s.type === type)?.label || "New Section",
      content: "",
      items: type === "projects" ? [{ title: "New Project", description: "", link: "" }] : [],
    };
    setPortfolio({ ...portfolio, sections: [...portfolio.sections, newSection] });
    setShowAddSection(false);
    setEditingSection(newSection.id);
  };

  const updateSection = (id: string, updates: Partial<PortfolioSection>) => {
    if (!portfolio) return;
    setPortfolio({
      ...portfolio,
      sections: portfolio.sections.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    });
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

  // Drag and drop handlers
  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  const handleDrop = (index: number) => {
    if (dragIndex !== null && dragIndex !== index) moveSection(dragIndex, index);
    setDragIndex(null);
    setDragOverIndex(null);
  };
  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const portfolioUrl = portfolio
    ? `${window.location.origin}/portfolio/${portfolio.slug}`
    : "";

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
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-5">
        <div className="flex-1 space-y-3 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Portfolio Title</Label>
              <Input
                value={portfolio.title}
                onChange={(e) => setPortfolio({ ...portfolio, title: e.target.value })}
                placeholder="My Portfolio"
              />
            </div>
            <div>
              <Label className="text-xs">URL Slug</Label>
              <Input
                value={portfolio.slug}
                onChange={(e) => setPortfolio({ ...portfolio, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                placeholder="my-portfolio"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Short Bio</Label>
            <Textarea
              value={portfolio.bio}
              onChange={(e) => setPortfolio({ ...portfolio, bio: e.target.value })}
              placeholder="A brief introduction about yourself..."
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Theme Picker */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" /> Theme
        </h3>
        <div className="flex flex-wrap gap-3">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setPortfolio({ ...portfolio, theme: theme.id })}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all text-sm font-medium ${
                portfolio.theme === theme.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.accent }} />
              {theme.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sections Editor */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Sections</h3>
          <Button size="sm" onClick={() => setShowAddSection(!showAddSection)}>
            <Plus className="w-4 h-4 mr-1" /> Add Section
          </Button>
        </div>

        {/* Add Section Panel */}
        <AnimatePresence>
          {showAddSection && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 rounded-lg bg-muted/50 border border-border">
                {SECTION_TYPES.map((st) => {
                  const Icon = st.icon;
                  return (
                    <button
                      key={st.type}
                      onClick={() => addSection(st.type)}
                      className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors text-left"
                    >
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
            const isDragOver = dragOverIndex === index && dragIndex !== index;

            return (
              <motion.div
                key={section.id}
                layout
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e as any, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                className={`rounded-lg border transition-all ${
                  isDragOver ? "border-primary bg-primary/5" : "border-border"
                } ${dragIndex === index ? "opacity-50" : ""}`}
              >
                {/* Section Header */}
                <div
                  className="flex items-center gap-3 p-3 cursor-pointer"
                  onClick={() => setEditingSection(isEditing ? null : section.id)}
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab shrink-0" />
                  <Icon className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{section.title}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{section.type}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); moveSection(index, index - 1); }}>
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); moveSection(index, index + 1); }}>
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}>
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                </div>

                {/* Section Editor */}
                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 space-y-3 border-t border-border pt-3">
                        <div>
                          <Label className="text-xs">Title</Label>
                          <Input
                            value={section.title}
                            onChange={(e) => updateSection(section.id, { title: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Content</Label>
                          <Textarea
                            value={section.content}
                            onChange={(e) => updateSection(section.id, { content: e.target.value })}
                            rows={3}
                            placeholder={
                              section.type === "contact" ? "your@email.com" :
                              section.type === "testimonial" ? '"Great work!" — Client Name' :
                              "Write your content here..."
                            }
                          />
                        </div>
                        {section.type === "hero" && (
                          <div>
                            <Label className="text-xs">Background Image URL (optional)</Label>
                            <Input
                              value={section.imageUrl || ""}
                              onChange={(e) => updateSection(section.id, { imageUrl: e.target.value })}
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                        )}
                        {section.type === "projects" && (
                          <div className="space-y-2">
                            <Label className="text-xs">Projects</Label>
                            {(section.items || []).map((item, itemIndex) => (
                              <div key={itemIndex} className="grid grid-cols-12 gap-2">
                                <Input
                                  className="col-span-4"
                                  value={item.title}
                                  onChange={(e) => {
                                    const newItems = [...(section.items || [])];
                                    newItems[itemIndex] = { ...newItems[itemIndex], title: e.target.value };
                                    updateSection(section.id, { items: newItems });
                                  }}
                                  placeholder="Project name"
                                />
                                <Input
                                  className="col-span-4"
                                  value={item.description}
                                  onChange={(e) => {
                                    const newItems = [...(section.items || [])];
                                    newItems[itemIndex] = { ...newItems[itemIndex], description: e.target.value };
                                    updateSection(section.id, { items: newItems });
                                  }}
                                  placeholder="Description"
                                />
                                <Input
                                  className="col-span-3"
                                  value={item.link || ""}
                                  onChange={(e) => {
                                    const newItems = [...(section.items || [])];
                                    newItems[itemIndex] = { ...newItems[itemIndex], link: e.target.value };
                                    updateSection(section.id, { items: newItems });
                                  }}
                                  placeholder="Link URL"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="col-span-1 h-9"
                                  onClick={() => {
                                    const newItems = (section.items || []).filter((_, i) => i !== itemIndex);
                                    updateSection(section.id, { items: newItems });
                                  }}
                                >
                                  <Trash2 className="w-3 h-3 text-destructive" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newItems = [...(section.items || []), { title: "", description: "", link: "" }];
                                updateSection(section.id, { items: newItems });
                              }}
                            >
                              <Plus className="w-3 h-3 mr-1" /> Add Project
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-xl border border-border bg-card p-5">
        <Button onClick={savePortfolio} disabled={saving} className="flex-1 sm:flex-none">
          <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save Portfolio"}
        </Button>
        <Button variant={portfolio.is_published ? "destructive" : "default"} onClick={togglePublish} className="flex-1 sm:flex-none">
          {portfolio.is_published ? <EyeOff className="w-4 h-4 mr-2" /> : <Globe className="w-4 h-4 mr-2" />}
          {portfolio.is_published ? "Unpublish" : "Publish"}
        </Button>
        {portfolio.is_published && (
          <>
            <Button variant="outline" onClick={copyUrl} className="flex-1 sm:flex-none">
              <Copy className="w-4 h-4 mr-2" /> Copy URL
            </Button>
            <a href={portfolioUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" /> Preview
              </Button>
            </a>
          </>
        )}
      </div>

      {portfolio.is_published && (
        <p className="text-xs text-muted-foreground text-center">
          Your portfolio is live at{" "}
          <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">
            {portfolioUrl}
          </a>
        </p>
      )}
    </div>
  );
};
