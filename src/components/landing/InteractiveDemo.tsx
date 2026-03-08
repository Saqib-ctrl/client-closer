import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const sampleJobDescription = `Looking for a talented UI/UX designer to redesign our mobile banking app. Need someone with fintech experience who understands user psychology and can create intuitive interfaces.`;

const generatedProposal = `Hi! I noticed you're looking to redesign your mobile banking app, and I'm excited about the opportunity.

I specialize in fintech UI/UX design with 5+ years of experience creating intuitive financial interfaces. My recent work includes redesigning a payment app that increased user engagement by 40%.

I understand the unique challenges of banking apps — balancing security with usability, building trust through design, and simplifying complex transactions.

I'd love to discuss your vision and show you some relevant case studies. Available for a quick call this week?`;

const InteractiveDemo = () => {
  const [stage, setStage] = useState<"input" | "processing" | "output">("input");
  const [typedText, setTypedText] = useState("");
  const navigate = useNavigate();

  const startDemo = () => {
    setStage("processing");
    setTimeout(() => {
      setStage("output");
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i <= generatedProposal.length) {
          setTypedText(generatedProposal.slice(0, i));
          i++;
        } else {
          clearInterval(typeInterval);
        }
      }, 15);
    }, 1500);
  };

  const resetDemo = () => {
    setStage("input");
    setTypedText("");
  };

  return (
    <section id="demo" className="py-24 md:py-32 border-t border-border/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-12"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground/50 font-medium mb-4">Live demo</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            See it in action.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-4xl"
        >
          <div className="bg-card rounded-2xl border border-border/30 overflow-hidden">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
              </div>
              <span className="text-[10px] text-muted-foreground/50 ml-2 font-mono">propel.app</span>
            </div>

            <div className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {stage === "input" && (
                  <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-medium">Paste a job description</p>
                    <div className="bg-muted/30 rounded-lg p-4 border border-border/20 text-sm text-muted-foreground font-mono leading-relaxed">
                      {sampleJobDescription}
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={startDemo} className="btn-primary text-sm">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Proposal
                    </motion.button>
                  </motion.div>
                )}

                {stage === "processing" && (
                  <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-16">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent mb-4" />
                    <p className="text-sm font-medium">Analyzing requirements...</p>
                    <p className="text-xs text-muted-foreground">Crafting personalized proposal</p>
                  </motion.div>
                )}

                {stage === "output" && (
                  <motion.div key="output" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-widest text-primary/60 font-medium">Generated proposal</p>
                      <button onClick={resetDemo} className="text-xs text-muted-foreground/50 hover:text-foreground transition-colors">Reset</button>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 border border-primary/10 min-h-[200px]">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {typedText}
                        {typedText.length < generatedProposal.length && (
                          <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle" />
                        )}
                      </p>
                    </div>

                    {typedText.length === generatedProposal.length && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center justify-between pt-4 border-t border-border/20">
                        <p className="text-sm text-muted-foreground">Ready to try with your own job?</p>
                        <motion.a href="/auth" whileHover={{ scale: 1.02 }} className="btn-primary group text-sm">
                          Start Free
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.a>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
