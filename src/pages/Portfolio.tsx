import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ExternalLink, Mail, ArrowLeft } from "lucide-react";
import type { PortfolioSection } from "@/components/dashboard/PortfolioBuilder";

interface PortfolioData {
  title: string;
  bio: string;
  theme: string;
  sections: PortfolioSection[];
}

const THEME_STYLES: Record<string, { bg: string; text: string; accent: string; card: string; muted: string }> = {
  minimal: { bg: "bg-white dark:bg-zinc-950", text: "text-zinc-900 dark:text-zinc-100", accent: "text-primary", card: "bg-zinc-50 dark:bg-zinc-900", muted: "text-zinc-500 dark:text-zinc-400" },
  bold: { bg: "bg-zinc-950", text: "text-white", accent: "text-orange-400", card: "bg-zinc-900", muted: "text-zinc-400" },
  ocean: { bg: "bg-slate-50 dark:bg-slate-950", text: "text-slate-900 dark:text-slate-100", accent: "text-sky-500", card: "bg-white dark:bg-slate-900", muted: "text-slate-500 dark:text-slate-400" },
  forest: { bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-950 dark:text-emerald-50", accent: "text-emerald-600 dark:text-emerald-400", card: "bg-white dark:bg-emerald-900", muted: "text-emerald-600/60 dark:text-emerald-400/60" },
  sunset: { bg: "bg-amber-50 dark:bg-zinc-950", text: "text-amber-950 dark:text-amber-50", accent: "text-amber-600 dark:text-amber-400", card: "bg-white dark:bg-zinc-900", muted: "text-amber-700/60 dark:text-amber-300/60" },
};

const Portfolio = () => {
  const { slug } = useParams<{ slug: string }>();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetch = async () => {
      const { data, error } = await supabase
        .from("portfolios")
        .select("title, bio, theme, sections")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (!data) {
        setNotFound(true);
      } else {
        setPortfolio({
          ...data,
          sections: (Array.isArray(data.sections) ? data.sections : []) as unknown as PortfolioSection[],
        });
      }
      setLoading(false);
    };
    fetch();
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

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text}`}>
      {portfolio.sections.map((section, i) => (
        <motion.section
          key={section.id || i}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15, duration: 0.6 }}
        >
          {/* Hero */}
          {section.type === "hero" && (
            <div
              className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-20"
              style={section.imageUrl ? { backgroundImage: `url(${section.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
            >
              {section.imageUrl && <div className="absolute inset-0 bg-black/50" />}
              <div className="relative z-10 max-w-3xl mx-auto">
                <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-4 ${section.imageUrl ? "text-white" : ""}`}>
                  {section.title}
                </h1>
                <p className={`text-lg sm:text-xl ${section.imageUrl ? "text-white/80" : theme.muted}`}>
                  {section.content}
                </p>
                {portfolio.bio && (
                  <p className={`mt-4 text-sm ${section.imageUrl ? "text-white/60" : theme.muted}`}>{portfolio.bio}</p>
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
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + j * 0.1 }}
                    className={`rounded-xl p-6 ${theme.card} border border-border/50 hover:shadow-lg transition-shadow`}
                  >
                    <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                    <p className={`text-sm ${theme.muted} mb-3`}>{project.description}</p>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm ${theme.accent} hover:underline flex items-center gap-1`}
                      >
                        View Project <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Testimonial */}
          {section.type === "testimonial" && (
            <div className={`py-16 px-6 ${theme.card}`}>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className={`text-2xl font-bold mb-6 ${theme.accent}`}>{section.title}</h2>
                <blockquote className={`text-lg italic ${theme.muted} leading-relaxed`}>
                  {section.content}
                </blockquote>
              </div>
            </div>
          )}

          {/* Contact */}
          {section.type === "contact" && (
            <div className="max-w-3xl mx-auto px-6 py-16 text-center">
              <h2 className={`text-2xl font-bold mb-4 ${theme.accent}`}>{section.title}</h2>
              <p className={`text-base ${theme.muted} mb-4`}>{section.content}</p>
              {section.content.includes("@") && (
                <a
                  href={`mailto:${section.content.trim()}`}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm ${theme.accent} border border-current hover:opacity-80 transition-opacity`}
                >
                  <Mail className="w-4 h-4" /> Send Email
                </a>
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
          <a href="/" className={`${theme.accent} hover:underline`}>
            Propel
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Portfolio;
