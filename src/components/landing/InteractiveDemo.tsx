import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

const jobDescription = `Looking for a talented UI/UX designer to redesign our mobile banking app. Need someone with fintech experience who understands user psychology and can create intuitive interfaces.`;

const generatedProposal = `Hi! I noticed you're looking to redesign your mobile banking app, and I'm excited about the opportunity.

I specialize in fintech UI/UX design with 5+ years of experience creating intuitive financial interfaces. My recent work includes redesigning a payment app that increased user engagement by 40%.

I understand the unique challenges of banking apps — balancing security with usability, building trust through design, and simplifying complex transactions.

I'd love to discuss your vision and show you some relevant case studies. Available for a quick call this week?`;

const InteractiveDemo = () => {
  const [stage, setStage] = useState<"input" | "processing" | "output">("input");
  const [typedText, setTypedText] = useState("");
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const startDemo = () => {
    setIsAutoPlaying(true);
    setStage("processing");
    
    setTimeout(() => {
      setStage("output");
      // Start typing animation
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i <= generatedProposal.length) {
          setTypedText(generatedProposal.slice(0, i));
          i++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            setIsAutoPlaying(false);
          }, 2000);
        }
      }, 20);
    }, 2000);
  };

  const resetDemo = () => {
    setStage("input");
    setTypedText("");
  };

  return (
    <section id="demo" className="section-padding bg-muted/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            See the magic happen.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how Propel transforms a job description into a winning proposal.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-xl">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs text-muted-foreground ml-2">propel.app</span>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {stage === "input" && (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                      <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs">Step 1</span>
                      Paste the job description
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border/50 font-mono text-sm">
                      {jobDescription}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={startDemo}
                      className="btn-primary w-full sm:w-auto"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Proposal
                    </motion.button>
                  </motion.div>
                )}

                {stage === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent mb-4"
                    />
                    <p className="text-muted-foreground">Analyzing job requirements...</p>
                    <p className="text-sm text-muted-foreground/60">Crafting personalized proposal</p>
                  </motion.div>
                )}

                {stage === "output" && (
                  <motion.div
                    key="output"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <span className="px-2 py-1 rounded bg-green-500/10 text-green-600 text-xs">Done</span>
                        Your personalized proposal
                      </div>
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 3 }}
                        onClick={resetDemo}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Try again
                      </motion.button>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border/50 min-h-[200px]">
                      <p className="text-sm whitespace-pre-wrap">
                        {typedText}
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle"
                        />
                      </p>
                    </div>
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
