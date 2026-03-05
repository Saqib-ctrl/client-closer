import { X } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const problems = [
  {
    title: "Generic proposals & emails",
    description: "Copy-paste templates that don't speak to what the client actually needs — killing your response rate."
  },
  {
    title: "Scattered workflow",
    description: "Juggling separate tools for proposals, invoices, CRM, and portfolio — wasting hours every week."
  },
  {
    title: "No visible value",
    description: "Clients can't immediately see why you're the right choice when your pitch lacks mockups, context, and polish."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

const Problem = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={sectionRef} className="section-padding bg-muted/50 relative overflow-hidden">
      {/* Parallax background */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </motion.div>
      
      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            You're losing clients — not because of skill.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Most freelancers have the talent. What they don't have is a pitch that proves it.
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {problems.map((problem, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-card rounded-xl p-6 lg:p-8 card-elevated"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1, type: "spring" }}
                className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center mb-4"
              >
                <X className="w-5 h-5 text-destructive" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
              <p className="text-muted-foreground">{problem.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Problem;
