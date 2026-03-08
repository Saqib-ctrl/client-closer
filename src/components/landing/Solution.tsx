import { FileText, Upload, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: FileText,
    number: "01",
    title: "Paste the job or brief",
    description: "Drop in a job description or project brief. AI extracts what the client needs."
  },
  {
    icon: Upload,
    number: "02",
    title: "Add your context",
    description: "Upload portfolio samples or describe your experience. We match your strengths."
  },
  {
    icon: Sparkles,
    number: "03",
    title: "Get instant deliverables",
    description: "Proposal, mockup, cover letter, email, or invoice — ready in seconds."
  }
];

const Solution = () => {
  return (
    <section className="py-24 md:py-32 border-t border-border/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-20"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground/50 font-medium mb-4">How it works</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            From job post to pitch<br />in 3 steps.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-16 md:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="relative"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-muted/80 flex items-center justify-center border border-border/30">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground/50 tracking-widest uppercase">Step {step.number}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[calc(100%_-_8px)] w-8 border-t border-dashed border-border/50" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solution;
