import { FileText, Image, Mail, ArrowRight, Sparkles, Palette, PenTool, Receipt, Users, BarChart3, Globe, BookOpen, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const tools = [
  {
    id: "proposals", icon: FileText, title: "AI Proposals",
    tagline: "Win the gig before they read anyone else's pitch.",
    description: "Paste any job description and get a personalized proposal in seconds.",
    features: ["Client-specific value props", "Portfolio integration", "Tone & style options", "One-click copy"],
    freeLimit: "5 free",
    demo: { input: "Looking for a UI/UX designer to redesign our mobile banking app...", output: "Hi! I specialize in fintech UI/UX with 5+ years of experience..." }
  },
  {
    id: "mockups", icon: Image, title: "Portfolio Mockups",
    tagline: "Show your work the way clients want to see it.",
    description: "Upload screenshots and get stunning mockups with device frames.",
    features: ["Device frame overlays", "Custom style prompts", "Download as PNG", "Save to library"],
    freeLimit: "5 free",
    demo: { input: "Upload your screenshot + choose a style...", output: "Professional mockup with realistic device frame and gradient background." }
  },
  {
    id: "cover-letters", icon: PenTool, title: "Cover Letters",
    tagline: "Stand out in every application.",
    description: "Tailored cover letters that highlight your most relevant experience.",
    features: ["Resume-matched highlights", "Multiple tones", "ATS-friendly format", "Instant download"],
    freeLimit: "3 free",
    demo: { input: "Senior Frontend Developer at TechCorp...", output: "Dear Hiring Manager, I was excited to see your opening..." }
  },
  {
    id: "emails", icon: Mail, title: "Email Assistant",
    tagline: "Professional emails in seconds.",
    description: "Follow-ups, intros, project updates — polished and ready to send.",
    features: ["Multiple email types", "Tone customization", "Subject lines", "One-click copy"],
    freeLimit: "5 free",
    demo: { input: "Follow-up email after initial meeting...", output: "Hi Sarah, It was great meeting with you yesterday..." }
  },
  {
    id: "invoices", icon: Receipt, title: "Invoices",
    tagline: "Get paid faster.",
    description: "Clean, itemized invoices with tax calculations and PDF export.",
    features: ["Itemized line items", "Tax calculations", "PDF export", "Client auto-fill"],
    freeLimit: "Unlimited",
    demo: { input: "Client: Acme Corp — Website redesign...", output: "Invoice #001 | Total: $4,300" }
  },
  {
    id: "crm", icon: Users, title: "Client CRM",
    tagline: "Track every client in one place.",
    description: "Manage relationships, projects, deadlines, and revenue.",
    features: ["Client profiles", "Project tracking", "Revenue overview", "Notes & history"],
    freeLimit: "Included",
    demo: { input: "Add client: Sarah from TechCorp...", output: "Client added ✓ | Project: Website Redesign | Active" }
  },
  {
    id: "portfolio", icon: Globe, title: "Portfolio Builder",
    tagline: "A shareable portfolio in minutes.",
    description: "Beautiful portfolio with themes, sections, and a public link.",
    features: ["5 themes", "Drag & drop", "Image uploads", "Public link"],
    freeLimit: "1 free",
    demo: { input: "Choose theme → Add sections → Upload...", output: "Portfolio live at propel.app/portfolio/you" }
  },
  {
    id: "analytics", icon: BarChart3, title: "Analytics",
    tagline: "Know your numbers.",
    description: "Track proposals, win rates, revenue trends, and tool usage.",
    features: ["Win rates", "Revenue tracking", "Usage analytics", "Growth insights"],
    freeLimit: "Basic",
    demo: { input: "View dashboard for March 2026...", output: "Proposals: 24 sent, 8 won (33%) | Revenue: $12,400" }
  }
];

const ToolsShowcase = () => {
  const [activeTab, setActiveTab] = useState("proposals");
  const activeTool = tools.find(t => t.id === activeTab)!;

  return (
    <section id="tools" className="py-24 md:py-32 border-t border-border/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground/50 font-medium mb-4">Your toolkit</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Eight tools. One subscription.
          </h2>
        </motion.div>

        {/* Tab bar */}
        <div className="flex justify-start mb-12 overflow-x-auto pb-2 -mx-4 px-4">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border/30">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === tool.id
                    ? "bg-card shadow-sm text-foreground border border-border/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tool.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tool.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active tool */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid md:grid-cols-2 gap-12 items-start"
        >
          {/* Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-muted/80 flex items-center justify-center border border-border/30">
                <activeTool.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{activeTool.title}</h3>
                <span className="text-xs text-muted-foreground">{activeTool.freeLimit}</span>
              </div>
            </div>
            <p className="text-lg font-medium mb-2">{activeTool.tagline}</p>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">{activeTool.description}</p>
            <ul className="space-y-3 mb-8">
              {activeTool.features.map((feature, i) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {feature}
                </motion.li>
              ))}
            </ul>
            <motion.a
              href="/auth"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary group inline-flex text-sm"
            >
              Try {activeTool.title} Free
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>

          {/* Demo preview */}
          <div className="bg-card rounded-2xl border border-border/30 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
              </div>
              <span className="text-[10px] text-muted-foreground/50 ml-2 font-mono">propel.app</span>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-medium mb-2">Input</p>
                <div className="bg-muted/30 rounded-lg p-3 border border-border/20 text-xs text-muted-foreground font-mono leading-relaxed">
                  {activeTool.demo.input}
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-px h-6 bg-border/50" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-primary/60 font-medium mb-2">Output</p>
                <div className="bg-muted/30 rounded-lg p-3 border border-primary/10 text-xs leading-relaxed">
                  {activeTool.demo.output}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-0.5 h-3 bg-primary ml-0.5 align-middle"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ToolsShowcase;
