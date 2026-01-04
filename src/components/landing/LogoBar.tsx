import { motion } from "framer-motion";

const platforms = [
  { name: "Upwork", icon: "💼" },
  { name: "Fiverr", icon: "🎯" },
  { name: "Toptal", icon: "⭐" },
  { name: "Freelancer", icon: "🚀" },
  { name: "99designs", icon: "🎨" }
];

const LogoBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
      className="mt-16 pt-16 border-t border-border/50"
    >
      <p className="text-center text-sm text-muted-foreground mb-8">
        Trusted by freelancers on
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
        {platforms.map((platform, index) => (
          <motion.div
            key={platform.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
            className="flex items-center gap-2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            <span className="text-xl">{platform.icon}</span>
            <span className="font-medium text-sm">{platform.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LogoBar;
