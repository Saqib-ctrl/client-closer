import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import HeroDashboardPreview from "./HeroDashboardPreview";

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-28 md:pt-36 lg:pt-44 pb-20 md:pb-28">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="container-narrow text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 bg-card/50 text-sm text-muted-foreground font-medium mb-8 glass-card">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            AI-Powered Freelance Toolkit
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] mb-6 tracking-tight"
        >
          Win more clients.
          <br />
          <span className="text-gradient">Work less.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground font-light max-w-xl mx-auto mb-10"
        >
          8 AI tools to write proposals, generate mockups, send invoices, and manage clients — all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href="/auth"
            className="btn-primary group"
          >
            Start Free
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="#demo"
            className="btn-ghost group"
          >
            <Play className="mr-2 w-4 h-4" />
            See it in action
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-1.5">
            <span className="text-primary">✓</span> No credit card
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-primary">✓</span> Free tier forever
          </span>
        </motion.div>

        {/* 3D Dashboard Preview */}
        <HeroDashboardPreview />
      </div>
    </section>
  );
};

export default Hero;
