import { motion } from "framer-motion";

const problems = [
  {
    number: "01",
    title: "Generic proposals",
    description: "Copy-paste templates that don't speak to what the client actually needs."
  },
  {
    number: "02",
    title: "Scattered workflow",
    description: "Juggling separate tools for proposals, invoices, CRM, and portfolio."
  },
  {
    number: "03",
    title: "No visible value",
    description: "Clients can't see why you're the right choice when your pitch lacks polish."
  }
];

const Problem = () => {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground/50 font-medium mb-4">The problem</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            You're losing clients — not because of skill.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-px bg-border/50 rounded-2xl overflow-hidden border border-border/50">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card p-8 md:p-10"
            >
              <span className="text-4xl font-bold text-border/80 block mb-6">{problem.number}</span>
              <h3 className="text-lg font-semibold mb-3">{problem.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problem;
