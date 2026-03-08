import { Check, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePaddleCheckout } from "@/components/PaddleCheckout";

const freeFeatures = [
  "5 AI proposals", "5 mockup generations", "3 cover letters", "5 AI emails",
  "Invoice generator", "Client CRM", "1 portfolio page", "Basic analytics"
];

const proFeatures = [
  "Unlimited proposals & mockups", "Unlimited cover letters & emails", "Unlimited invoices & portfolios",
  "Full analytics dashboard", "Tone & style options", "Auto-save & history",
  "Priority AI models", "Export to PDF", "Priority support", "Cancel anytime"
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
      if (session?.user) setUser({ id: session.user.id, email: session.user.email });
      setIsLoadingSession(false);
    }).catch(() => setIsLoadingSession(false));
  }, []);

  const { openCheckout, isReady } = usePaddleCheckout({ userId: user?.id || "", userEmail: user?.email });

  const handleProPlanClick = () => {
    if (isLoadingSession) return;
    if (!user || !user.id) { navigate("/auth?redirect=/pricing&plan=" + (isYearly ? "yearly" : "monthly")); return; }
    if (!isReady) return;
    openCheckout(isYearly ? "yearly" : "monthly");
  };

  return (
    <section id="pricing" className="py-24 md:py-32 border-t border-border/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground/50 font-medium mb-4">Pricing</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Simple, transparent pricing.
          </h2>

          {/* Toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-muted/50 border border-border/30">
            <button onClick={() => setIsYearly(false)} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${!isYearly ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </button>
            <button onClick={() => setIsYearly(true)} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${isYearly ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}>
              Yearly
              <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-semibold">-{savings}%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* Free */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="bg-card rounded-2xl p-8 border border-border/30 h-full flex flex-col">
              <p className="text-xs uppercase tracking-widest text-muted-foreground/50 font-medium mb-4">Free</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-bold">$0</span>
              </div>
              <p className="text-sm text-muted-foreground mb-8">Try every tool for free</p>
              <ul className="space-y-3 mb-8 flex-1">
                {freeFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <motion.a href="/auth" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-secondary w-full group text-sm">
                Start Free <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </div>
          </motion.div>

          {/* Pro */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="bg-card rounded-2xl p-8 border-2 border-primary/30 h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
                  <Sparkles className="w-3 h-3" /> Popular
                </span>
              </div>
              <p className="text-xs uppercase tracking-widest text-primary font-medium mb-4">Pro</p>
              <div className="flex items-baseline gap-1 mb-1">
                <AnimatePresence mode="wait">
                  <motion.span key={currentPrice} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.2 }} className="text-5xl font-bold">
                    ${currentPrice}
                  </motion.span>
                </AnimatePresence>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mb-8">{isYearly ? `Billed yearly ($${yearlyPrice * 12}/year)` : "Billed monthly"}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {proFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <motion.button onClick={handleProPlanClick} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isLoadingSession} className="btn-primary w-full group text-sm disabled:opacity-50">
                {isLoadingSession ? "Loading..." : "Get Unlimited Access"}
                {!isLoadingSession && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </motion.button>
              <p className="text-center text-xs text-muted-foreground/50 mt-4">14-day money-back guarantee</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
