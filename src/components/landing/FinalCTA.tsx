import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const FinalCTA = () => {
  return (
    <section className="py-24 md:py-32 border-t border-border/30">
      <div className="container-narrow text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight"
        >
          Proposals. Mockups. Emails.{" "}
          <span className="text-gradient">All in one toolkit.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-muted-foreground font-light max-w-xl mx-auto mb-10"
        >
          Stop spending hours on pitches. Start winning clients with AI-powered tools.
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href="/auth"
          className="btn-primary group text-base px-8 py-4 inline-flex items-center"
        >
          Start Free — No Card Required
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.a>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 text-sm text-muted-foreground/50"
        >
          8 AI tools free · No credit card · 30 seconds to sign up
        </motion.p>
      </div>
    </section>
  );
};

export default FinalCTA;
