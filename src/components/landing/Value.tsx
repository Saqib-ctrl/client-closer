import { TrendingUp, Clock, Target, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  { icon: TrendingUp, title: "Win more clients", description: "Tailored proposals + professional mockups = higher response rates." },
  { icon: Clock, title: "Save hours every week", description: "Generate deliverables in minutes instead of hours of manual work." },
  { icon: Target, title: "Stand out instantly", description: "While others send generic pitches, yours look custom-built." },
  { icon: DollarSign, title: "One client pays for it", description: "At $19/mo, a single new project covers months of Propel." }
];

const Value = () => {
  return (
    <section className="py-24 md:py-32 border-t border-border/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground/50 font-medium mb-4">Why Propel</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Outcomes, not features.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border/30 rounded-2xl overflow-hidden border border-border/30">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-card p-8 group"
            >
              <div className="w-10 h-10 rounded-lg bg-muted/80 flex items-center justify-center mb-5 border border-border/30 group-hover:border-primary/30 transition-colors">
                <value.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Value;
