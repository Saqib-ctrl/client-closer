import { Check, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePaddleCheckout } from "@/components/PaddleCheckout";

const freeFeatures = [
  "5 AI proposals",
  "5 mockup generations",
  "3 cover letters",
  "5 AI emails",
  "Invoice generator",
  "Client CRM",
  "1 portfolio page",
  "Basic analytics"
];

const proFeatures = [
  "Unlimited proposals & mockups",
  "Unlimited cover letters & emails",
  "Unlimited invoices & portfolios",
  "Full analytics dashboard",
  "Tone & style options",
  "Auto-save & history",
  "Priority AI models",
  "Export to PDF",
  "Priority support",
  "Cancel anytime"
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const navigate = useNavigate();
  
  const monthlyPrice = 19;
  const yearlyPrice = 15;
  const currentPrice = isYearly ? yearlyPrice : monthlyPrice;
  const savings = Math.round((1 - yearlyPrice / monthlyPrice) * 100);

  useEffect(() => {
    setIsLoadingSession(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email });
      }
      setIsLoadingSession(false);
    }).catch(() => setIsLoadingSession(false));
  }, []);

  const { openCheckout, isReady } = usePaddleCheckout({
    userId: user?.id || "",
    userEmail: user?.email
  });

  const handleProPlanClick = () => {
    if (isLoadingSession) return;
    if (!user || !user.id) {
      navigate("/auth?redirect=/pricing&plan=" + (isYearly ? "yearly" : "monthly"));
      return;
    }
    if (!isReady) return;
    openCheckout(isYearly ? "yearly" : "monthly");
  };

  return (
    <section id="pricing" className="section-padding">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Start free with every tool. Upgrade to Pro when you're ready for unlimited access — just $19/month.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-muted rounded-full p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !isYearly ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                isYearly ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                Save {savings}%
              </span>
            </button>
          </div>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-card rounded-2xl p-8 border border-border h-full flex flex-col">
              <div className="text-center mb-8">
                <p className="text-sm font-semibold text-muted-foreground mb-2">Free</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-extrabold">$0</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Try every tool for free
                </p>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {freeFeatures.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </motion.li>
                ))}
              </ul>
              
              <motion.a
                href="/auth"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary w-full group"
              >
                Start Free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </div>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card rounded-2xl p-8 card-elevated border-2 border-primary relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </span>
              </div>
              
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
                    {isYearly ? `Billed yearly ($${yearlyPrice * 12}/year)` : "Billed monthly"}
                  </p>
                </div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  {proFeatures.map((feature, index) => (
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
                
                <motion.button
                  onClick={handleProPlanClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoadingSession}
                  className="btn-primary w-full group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingSession ? "Loading..." : "Get Unlimited Access"}
                  {!isLoadingSession && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </motion.button>
                
                <p className="text-center text-sm text-muted-foreground mt-4">
                  14-day money-back guarantee
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
