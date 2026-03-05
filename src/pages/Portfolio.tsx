import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ExternalLink, Mail, ArrowLeft, Github, Linkedin, Twitter, Instagram, Globe } from "lucide-react";
import type { PortfolioSection, SocialLink } from "@/components/dashboard/PortfolioBuilder";

interface PortfolioData {
  title: string;
  bio: string;
  theme: string;
  sections: PortfolioSection[];
  font?: string;
  accentColor?: string;
  socialLinks?: SocialLink[];
}

const THEME_STYLES: Record<string, { bg: string; text: string; accent: string; card: string; muted: string }> = {
  minimal: { bg: "bg-white dark:bg-zinc-950", text: "text-zinc-900 dark:text-zinc-100", accent: "text-primary", card: "bg-zinc-50 dark:bg-zinc-900", muted: "text-zinc-500 dark:text-zinc-400" },
  bold: { bg: "bg-zinc-950", text: "text-white", accent: "text-orange-400", card: "bg-zinc-900", muted: "text-zinc-400" },
  ocean: { bg: "bg-slate-50 dark:bg-slate-950", text: "text-slate-900 dark:text-slate-100", accent: "text-sky-500", card: "bg-white dark:bg-slate-900", muted: "text-slate-500 dark:text-slate-400" },
  forest: { bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-950 dark:text-emerald-50", accent: "text-emerald-600 dark:text-emerald-400", card: "bg-white dark:bg-emerald-900", muted: "text-emerald-600/60 dark:text-emerald-400/60" },
  sunset: { bg: "bg-amber-50 dark:bg-zinc-950", text: "text-amber-950 dark:text-amber-50", accent: "text-amber-600 dark:text-amber-400", card: "bg-white dark:bg-zinc-900", muted: "text-amber-700/60 dark:text-amber-300/60" },
  midnight: { bg: "bg-indigo-950", text: "text-indigo-50", accent: "text-indigo-400", card: "bg-indigo-900/50", muted: "text-indigo-300/60" },
  rose: { bg: "bg-rose-50 dark:bg-rose-950", text: "text-rose-950 dark:text-rose-50", accent: "text-rose-500", card: "bg-white dark:bg-rose-900/50", muted: "text-rose-400" },
  monochrome: { bg: "bg-neutral-100 dark:bg-neutral-950", text: "text-neutral-900 dark:text-neutral-100", accent: "text-neutral-600 dark:text-neutral-400", card: "bg-white dark:bg-neutral-900", muted: "text-neutral-500" },
  neon: { bg: "bg-black", text: "text-green-400", accent: "text-green-400", card: "bg-zinc-900", muted: "text-green-500/60" },
  lavender: { bg: "bg-violet-50 dark:bg-violet-950", text: "text-violet-950 dark:text-violet-50", accent: "text-violet-500", card: "bg-white dark:bg-violet-900/50", muted: "text-violet-400" },
};

const FONTS: Record<string, string> = {
  inter: "'Inter', sans-serif",
  "playfair": "'Playfair Display', serif",
  "space-grotesk": "'Space Grotesk', sans-serif",
  "dm-sans": "'DM Sans', sans-serif",
  "jetbrains": "'JetBrains Mono', monospace",
  "cabinet": "'Cabinet Grotesk', sans-serif",
};

const FONT_URLS: Record<string, string> = {
  playfair: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap",
  "space-grotesk": "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap",
  "dm-sans": "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap",
  "jetbrains": "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap",
};

const SocialIcon = ({ platform }: { platform: string }) => {
  const cls = "w-5 h-5";
  switch (platform) {
    case "github": return <Github className={cls} />;
    case "linkedin": return <Linkedin className={cls} />;
    case "twitter": return <Twitter className={cls} />;
    case "instagram": return <Instagram className={cls} />;
    default: return <Globe className={cls} />;
  }
};

const Portfolio = () => {
  const { slug } = useParams<{ slug: string }>();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      const { data } = await supabase
        .from("portfolios")
        .select("title, bio, theme, sections")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (!data) {
        setNotFound(true);
      } else {
        let bio = data.bio || "";
        let font = "inter";
        let accentColor = "";
        let socialLinks: SocialLink[] = [];
        try {
          const extra = bio ? JSON.parse(bio) : null;
          if (extra && extra.__extended) {
            font = extra.font || "inter";
            accentColor = extra.accentColor || "";
            socialLinks = extra.socialLinks || [];
            bio = extra.bio || "";
          }
        } catch { /* plain text bio */ }

        setPortfolio({
          ...data,
          bio,
          font,
          accentColor,
          socialLinks,
          sections: (Array.isArray(data.sections) ? data.sections : []) as unknown as PortfolioSection[],
        });
      }
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (notFound || !portfolio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Portfolio not found</h1>
        <p className="text-muted-foreground">This portfolio doesn't exist or isn't published yet.</p>
        <Link to="/" className="text-primary hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
      </div>
    );
  }

  const theme = THEME_STYLES[portfolio.theme] || THEME_STYLES.minimal;
  const fontFamily = FONTS[portfolio.font || "inter"] || FONTS.inter;
  const fontUrl = FONT_URLS[portfolio.font || ""];

  return (
    <>
      {fontUrl && <link rel="stylesheet" href={fontUrl} />}
      <div className={`min-h-screen ${theme.bg} ${theme.text}`} style={{ fontFamily, ...(portfolio.accentColor ? { "--portfolio-accent": portfolio.accentColor } as any : {}) }}>
        {portfolio.sections.map((section, i) => (
          <motion.section
            key={section.id || i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            {/* Hero */}
            {section.type === "hero" && (
              <div className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-20"
                style={section.imageUrl ? { backgroundImage: `url(${section.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}>
                {section.imageUrl && <div className="absolute inset-0 bg-black/50" />}
                <div className="relative z-10 max-w-3xl mx-auto">
                  <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-4 ${section.imageUrl ? "text-white" : ""}`}>{section.title}</h1>
                  <p className={`text-lg sm:text-xl ${section.imageUrl ? "text-white/80" : theme.muted}`}>{section.content}</p>
                  {portfolio.bio && <p className={`mt-4 text-sm ${section.imageUrl ? "text-white/60" : theme.muted}`}>{portfolio.bio}</p>}
                  {(portfolio.socialLinks || []).length > 0 && (
                    <div className="flex items-center justify-center gap-4 mt-6">
                      {portfolio.socialLinks!.map((link, j) => (
                        <a key={j} href={link.url} target="_blank" rel="noopener noreferrer"
                          className={`${section.imageUrl ? "text-white/80 hover:text-white" : theme.muted + " hover:opacity-80"} transition-opacity`}>
                          <SocialIcon platform={link.icon || link.platform} />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* About */}
            {section.type === "about" && (
              <div className="max-w-3xl mx-auto px-6 py-16">
                <h2 className={`text-2xl font-bold mb-4 ${theme.accent}`}>{section.title}</h2>
                <p className={`text-base leading-relaxed whitespace-pre-wrap ${theme.muted}`}>{section.content}</p>
              </div>
            )}

            {/* Projects */}
            {section.type === "projects" && (
              <div className="max-w-5xl mx-auto px-6 py-16">
                <h2 className={`text-2xl font-bold mb-8 text-center ${theme.accent}`}>{section.title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(section.items || []).map((project, j) => (
                    <motion.div key={j} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + j * 0.1 }}
                      className={`rounded-xl p-6 ${theme.card} border border-border/50 hover:shadow-lg transition-shadow`}>
                      {project.imageUrl && (
                        <div className="w-full h-40 rounded-lg overflow-hidden mb-3 bg-black/5">
                          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                      <p className={`text-sm ${theme.muted} mb-3`}>{project.description}</p>
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {project.tags.map((tag, k) => (
                            <span key={k} className={`text-xs px-2 py-0.5 rounded-full ${theme.accent} bg-current/10 font-medium`}
                              style={portfolio.accentColor ? { color: portfolio.accentColor, backgroundColor: portfolio.accentColor + "1a" } : {}}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className={`text-sm ${theme.accent} hover:underline flex items-center gap-1`}>
                          View Project <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {section.type === "skills" && (
              <div className="max-w-4xl mx-auto px-6 py-16">
                <h2 className={`text-2xl font-bold mb-8 text-center ${theme.accent}`}>{section.title}</h2>
                <div className="flex flex-wrap gap-3 justify-center">
                  {(section.items || []).map((item, j) => (
                    <motion.span key={j} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + j * 0.05 }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium ${theme.card} border border-border/50`}
                      style={portfolio.accentColor ? { borderColor: portfolio.accentColor + "40" } : {}}>
                      {item.title}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {section.type === "experience" && (
              <div className="max-w-3xl mx-auto px-6 py-16">
                <h2 className={`text-2xl font-bold mb-8 text-center ${theme.accent}`}>{section.title}</h2>
                <div className="relative border-l-2 border-border pl-8 space-y-8">
                  {(section.items || []).map((item, j) => (
                    <motion.div key={j} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + j * 0.1 }} className="relative">
                      <div className="absolute -left-[2.55rem] top-1 w-4 h-4 rounded-full border-2 border-border"
                        style={portfolio.accentColor ? { borderColor: portfolio.accentColor, backgroundColor: portfolio.accentColor } : { backgroundColor: "hsl(var(--primary))", borderColor: "hsl(var(--primary))" }} />
                      <p className={`text-xs font-medium ${theme.muted} mb-1`}>{item.date}</p>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className={`text-sm ${theme.muted} mt-1`}>{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            {section.type === "services" && (
              <div className="max-w-5xl mx-auto px-6 py-16">
                <h2 className={`text-2xl font-bold mb-8 text-center ${theme.accent}`}>{section.title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(section.items || []).map((item, j) => (
                    <motion.div key={j} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + j * 0.1 }}
                      className={`rounded-xl p-6 ${theme.card} border border-border/50 text-center hover:shadow-lg transition-shadow`}>
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className={`text-sm ${theme.muted} mb-3`}>{item.description}</p>
                      {item.value && <p className={`text-xl font-bold ${theme.accent}`}>{item.value}</p>}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {section.type === "gallery" && (
              <div className="max-w-5xl mx-auto px-6 py-16">
                <h2 className={`text-2xl font-bold mb-8 text-center ${theme.accent}`}>{section.title}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(section.items || []).filter(i => i.imageUrl).map((item, j) => (
                    <motion.div key={j} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + j * 0.08 }}
                      className="aspect-square rounded-xl overflow-hidden bg-muted group relative">
                      <img src={item.imageUrl} alt={item.title || ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      {item.title && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-3">
                          <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">{item.title}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            {section.type === "stats" && (
              <div className={`py-16 px-6 ${theme.card}`}>
                <div className="max-w-4xl mx-auto">
                  <h2 className={`text-2xl font-bold mb-8 text-center ${theme.accent}`}>{section.title}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                    {(section.items || []).map((item, j) => (
                      <motion.div key={j} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + j * 0.1 }} className="text-center">
                        <p className={`text-3xl sm:text-4xl font-bold ${theme.accent}`} style={portfolio.accentColor ? { color: portfolio.accentColor } : {}}>{item.value || "0"}</p>
                        <p className={`text-sm mt-1 ${theme.muted}`}>{item.title}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Testimonial */}
            {section.type === "testimonial" && (
              <div className={`py-16 px-6 ${theme.card}`}>
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className={`text-2xl font-bold mb-6 ${theme.accent}`}>{section.title}</h2>
                  <blockquote className={`text-lg italic ${theme.muted} leading-relaxed`}>{section.content}</blockquote>
                </div>
              </div>
            )}

            {/* Contact */}
            {section.type === "contact" && (
              <div className="max-w-3xl mx-auto px-6 py-16 text-center">
                <h2 className={`text-2xl font-bold mb-4 ${theme.accent}`}>{section.title}</h2>
                <p className={`text-base ${theme.muted} mb-6`}>{section.content}</p>
                {section.content.includes("@") && (
                  <a href={`mailto:${section.content.trim()}`}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm border border-current hover:opacity-80 transition-opacity`}
                    style={portfolio.accentColor ? { color: portfolio.accentColor, borderColor: portfolio.accentColor } : {}}>
                    <Mail className="w-4 h-4" /> Send Email
                  </a>
                )}
                {(portfolio.socialLinks || []).length > 0 && (
                  <div className="flex items-center justify-center gap-4 mt-6">
                    {portfolio.socialLinks!.map((link, j) => (
                      <a key={j} href={link.url} target="_blank" rel="noopener noreferrer" className={`${theme.muted} hover:opacity-70 transition-opacity`}>
                        <SocialIcon platform={link.icon || link.platform} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Custom */}
            {section.type === "custom" && (
              <div className="max-w-3xl mx-auto px-6 py-16">
                <h2 className={`text-2xl font-bold mb-4 ${theme.accent}`}>{section.title}</h2>
                <div className={`text-base leading-relaxed whitespace-pre-wrap ${theme.muted}`}>{section.content}</div>
              </div>
            )}
          </motion.section>
        ))}

        {/* Footer */}
        <footer className={`py-8 text-center border-t border-border/30 ${theme.muted}`}>
          <p className="text-xs">
            Built with{" "}
            <a href="/" className={`${theme.accent} hover:underline`}>Propel</a>
          </p>
        </footer>
      </div>
    </>
  );
};

export default Portfolio;
