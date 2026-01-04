import { Check, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const features = [
  "Unlimited proposals",
  "Personalized portfolio pages",
  "Client-specific customization",
  "Export to PDF",
  "Priority support",
  "Cancel anytime"
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  
  const monthlyPrice = 19;
  const yearlyPrice = 15;
  const currentPrice = isYearly ? yearlyPrice : monthlyPrice;
  const savings = Math.round((1 - yearlyPrice / monthlyPrice) * 100);

  return (
    <section id="pricing" className="section-padding">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Simple, honest pricing.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            One plan. Everything included. One client pays for it.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-muted rounded-full p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !isYearly 
                  ? "bg-background shadow-sm text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                isYearly 
                  ? "bg-background shadow-sm text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                Save {savings}%
              </span>
            </button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-card rounded-2xl p-8 lg:p-10 card-elevated border-2 border-primary relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
            
            <div className="relative">
              <div className="text-center mb-8">
                <p className="text-sm font-semibold text-primary mb-2">Pro Plan</p>
                <div className="flex items-baseline justify-center gap-1">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentPrice}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.2 }}
                      className="text-5xl font-extrabold"
                    >
                      ${currentPrice}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {isYearly ? `Billed yearly ($${yearlyPrice * 12}/year)` : "Billed monthly"}. Cancel anytime.
                </p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
              
              <motion.a
                href="/auth"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full group"
              >
                Start generating proposals
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              
              <p className="text-center text-sm text-muted-foreground mt-4">
                7-day free trial. No credit card required.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
