import { ArrowRight, Zap, FileText, Image, PenTool, Mail, Receipt, Users, Globe, BarChart3, Code2, Shield, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const techStack = [
  { name: "React + TypeScript", description: "Modern, type-safe frontend" },
  { name: "Vite", description: "Lightning-fast builds" },
  { name: "Tailwind CSS", description: "Utility-first styling" },
  { name: "Supabase", description: "Auth, database, edge functions" },
  { name: "Paddle", description: "Subscription billing" },
  { name: "AI-Powered", description: "LLM-driven content generation" },
];

const tools = [
  { icon: FileText, name: "Proposal Generator", description: "AI-crafted client proposals from job descriptions" },
  { icon: Image, name: "Mockup Generator", description: "Visual mockups from reference images" },
  { icon: PenTool, name: "Cover Letter Writer", description: "Targeted cover letters for job applications" },
  { icon: Mail, name: "Email Assistant", description: "Professional client communication" },
  { icon: Receipt, name: "Invoice Generator", description: "Create and manage client invoices" },
  { icon: Users, name: "Client CRM", description: "Track clients, projects, and revenue" },
  { icon: Globe, name: "Portfolio Builder", description: "Publishable portfolio with 11 section types" },
  { icon: BarChart3, name: "Analytics Dashboard", description: "Usage tracking and insights" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="pt-24 md:pt-32 pb-16 section-padding">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Rocket className="w-4 h-4" />
              About Propel
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              The all-in-one AI toolkit{" "}
              <span className="text-gradient">built for freelancers</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Propel helps freelancers win more clients by automating proposals, mockups, cover letters, emails, invoices, and more — all powered by AI.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Product Story */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Why Propel Exists</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Freelancers spend 30–40% of their time on non-billable work: writing proposals, crafting emails, creating invoices, and managing clients. That's time that could be spent doing actual work.
                </p>
                <p>
                  Propel consolidates 8 essential freelance tools into one AI-powered platform. Instead of juggling Canva, Google Docs, spreadsheets, and email templates — freelancers get everything in one dashboard.
                </p>
                <p>
                  The result: freelancers respond to opportunities 3x faster, with more polished deliverables, and win more clients.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: "8", label: "AI Tools", icon: Zap },
                { value: "2 min", label: "Avg Creation Time", icon: Rocket },
                { value: "3.2x", label: "Higher Response Rate", icon: BarChart3 },
                { value: "Free Tier", label: "Forever Available", icon: Shield },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-border bg-card p-5 text-center"
                >
                  <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8 Tools */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">8 Tools, One Platform</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything a freelancer needs to pitch, invoice, and manage clients.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <tool.icon className="w-5 h-5 text-primary mb-3" />
                <h3 className="font-semibold mb-1">{tool.name}</h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              <Code2 className="w-6 h-6 inline mr-2 text-primary" />
              Built with Modern Tech
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Production-ready architecture designed for scale and maintainability.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg border border-border bg-card p-4 flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">{tech.name}</p>
                  <p className="text-xs text-muted-foreground">{tech.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Model */}
      <section className="section-padding">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Revenue Model</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Freemium SaaS with usage-based conversion to paid plans.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="rounded-xl border border-border bg-card p-6 text-left">
                <h3 className="font-semibold mb-2">Free Tier</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Limited usage across all 8 tools. Designed to demonstrate value and drive conversions.
                </p>
                <p className="text-xs text-muted-foreground">5 proposals · 5 mockups · 3 cover letters · 5 emails</p>
              </div>
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-left">
                <h3 className="font-semibold mb-2">Pro Plan — $19/mo</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Unlimited access to all tools. Recurring MRR via Paddle billing.
                </p>
                <p className="text-xs text-muted-foreground">Unlimited everything · Priority support · All features</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-8">
              Try Propel free — no credit card required.
            </p>
            <a
              href="/auth"
              className="btn-primary inline-flex items-center text-lg px-8 py-4"
            >
              Start Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
