import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const MobileStickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector("section");
      const pricingSection = document.getElementById("pricing");
      
      if (!heroSection || !pricingSection) return;

      const heroBottom = heroSection.getBoundingClientRect().bottom;
      const pricingTop = pricingSection.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      // Show when scrolled past hero, hide when near pricing
      setIsVisible(heroBottom < 0 && pricingTop > windowHeight * 0.5);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-lg border-t border-border/50 md:hidden"
        >
          <a
            href="#pricing"
            className="btn-primary w-full group"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileStickyCTA;
