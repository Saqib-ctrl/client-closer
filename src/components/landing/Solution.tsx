import { FileText, Upload, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: FileText,
    number: "01",
    title: "Paste the job description",
    description: "Copy the client's project brief or job posting. We'll extract exactly what they're looking for."
  },
  {
    icon: Upload,
    number: "02",
    title: "Add your past work",
    description: "Upload samples or link to your portfolio. We'll match relevant projects to the client's needs."
  },
  {
    icon: Sparkles,
    number: "03",
    title: "Get your proposal",
    description: "Receive a personalized proposal and portfolio page tailored specifically for this client."
  }
];

const Solution = () => {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Three steps to a winning proposal.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No templates. No guesswork. Just proposals that speak directly to what your client needs.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.15, type: "spring" }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex-shrink-0"
                >
                  <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                </motion.div>
                <div>
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.15 }}
                    className="text-sm font-semibold text-primary mb-2 block"
                  >
                    {step.number}
                  </motion.span>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.15 }}
                  className="hidden md:block absolute top-7 left-[calc(100%_-_24px)] w-12 h-0.5 bg-border origin-left"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solution;
