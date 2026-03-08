import { motion } from "framer-motion";

const platforms = ["Upwork", "Fiverr", "Toptal", "Freelancer", "99designs", "Dribbble", "Behance", "LinkedIn"];

const LogoBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="py-12 border-t border-border/30 overflow-hidden"
    >
      <p className="text-center text-xs uppercase tracking-widest text-muted-foreground/50 mb-8 font-medium">
        Trusted by freelancers on
      </p>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex animate-marquee">
          {[...platforms, ...platforms].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="mx-8 md:mx-12 text-muted-foreground/30 text-lg font-semibold tracking-wide whitespace-nowrap select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LogoBar;
