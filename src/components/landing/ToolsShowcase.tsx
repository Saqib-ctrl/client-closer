import { FileText, Image, Mail, ArrowRight, Sparkles, Palette, PenTool } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const tools = [
  {
    id: "proposals",
    icon: FileText,
    accentIcon: Sparkles,
    title: "AI Proposals",
    tagline: "Win the gig before they read anyone else's pitch.",
    description: "Paste any job description and get a personalized, client-specific proposal in seconds. References your portfolio, addresses their exact needs, and presents clear scope & pricing.",
    features: ["Client-specific value props", "Portfolio integration", "Tone & style options", "One-click copy"],
    freeLimit: "5 free proposals",
    gradient: "from-primary/20 to-primary/5",
    demo: {
      input: "Looking for a UI/UX designer to redesign our mobile banking app...",
      output: "Hi! I specialize in fintech UI/UX with 5+ years of experience. My recent work includes redesigning a payment app that increased engagement by 40%..."
    }
  },
  {
    id: "mockups",
    icon: Image,
    accentIcon: Palette,
    title: "Portfolio Mockups",
    tagline: "Show your work the way clients want to see it.",
    description: "Upload screenshots and get stunning portfolio mockups with device frames, backgrounds, and professional layouts. Perfect for proposals, case studies, and social media.",
    features: ["Device frame overlays", "Custom style prompts", "Download as PNG", "Save to library"],
    freeLimit: "5 free mockups",
    gradient: "from-accent/20 to-accent/5",
    demo: {
      input: "Upload your screenshot + choose a style...",
      output: "Professional mockup with realistic device frame, gradient background, and your design beautifully showcased."
    }
  },
  {
    id: "cover-letters",
    icon: Mail,
    accentIcon: PenTool,
    title: "Cover Letters",
    tagline: "Stand out in every application, every time.",
    description: "Paste the job posting and your resume to get a tailored cover letter that highlights your most relevant experience. Choose professional, friendly, or creative tone.",
    features: ["Resume-matched highlights", "Multiple tone options", "ATS-friendly format", "Instant download"],
    freeLimit: "3 free cover letters",
    gradient: "from-primary/15 to-accent/5",
    demo: {
      input: "Senior Frontend Developer at TechCorp — React, TypeScript...",
      output: "Dear Hiring Manager, I was excited to see your opening for a Senior Frontend Developer. With 6+ years building React applications..."
    }
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

const ToolsShowcase = () => {
  const [activeTab, setActiveTab] = useState("proposals");
  const activeTool = tools.find(t => t.id === activeTab)!;

  return (
    <section id="tools" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            🛠️ Your AI toolkit
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Three tools. One subscription.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to pitch, present, and apply — powered by AI, designed for freelancers.
          </p>
        </motion.div>

        {/* Tab selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-muted border border-border/50">
            {tools.map((tool) => (
              <motion.button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tool.id
                    ? "bg-background shadow-md text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tool.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tool.title}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Active tool detail */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeTool.gradient} flex items-center justify-center`}>
                  <activeTool.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{activeTool.title}</h3>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {activeTool.freeLimit}
                  </span>
                </div>
              </div>
              <p className="text-xl font-semibold text-foreground mb-3">
                {activeTool.tagline}
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {activeTool.description}
              </p>
              <ul className="space-y-3 mb-8">
                {activeTool.features.map((feature, i) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <activeTool.accentIcon className="w-3 h-3 text-primary" />
                    </div>
                    {feature}
                  </motion.li>
                ))}
              </ul>
              <motion.a
                href="/auth"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary group inline-flex"
              >
                Try {activeTool.title} Free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </div>

            {/* Demo preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card rounded-2xl border border-border/50 shadow-xl overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs text-muted-foreground ml-2">propel.app</span>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px]">INPUT</span>
                    </p>
                    <div className="bg-muted/50 rounded-lg p-3 border border-border/30 text-xs text-muted-foreground font-mono">
                      {activeTool.demo.input}
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center py-2"
                  >
                    <motion.div
                      animate={{ y: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-4 h-4 text-primary rotate-90" />
                    </motion.div>
                  </motion.div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 text-[10px]">OUTPUT</span>
                    </p>
                    <div className="bg-muted/50 rounded-lg p-3 border border-primary/20 text-xs leading-relaxed">
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
        </motion.div>

        {/* Cards overview */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-6 mt-20"
        >
          {tools.map((tool) => (
            <motion.div
              key={tool.id}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onClick={() => setActiveTab(tool.id)}
              className={`bg-card rounded-2xl p-6 border cursor-pointer transition-all duration-300 group ${
                activeTab === tool.id
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border/50 hover:border-primary/30"
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <tool.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-1">{tool.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{tool.tagline}</p>
              <span className="text-xs font-medium text-primary">{tool.freeLimit} →</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ToolsShowcase;
