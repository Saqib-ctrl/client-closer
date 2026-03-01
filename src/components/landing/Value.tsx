import { TrendingUp, Clock, Target, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  {
    icon: TrendingUp,
    title: "Win more clients",
    description: "Tailored proposals + professional mockups = higher response rates and more closed deals."
  },
  {
    icon: Clock,
    title: "Save hours every week",
    description: "Generate proposals, mockups, and cover letters in minutes instead of hours of manual work."
  },
  {
    icon: Target,
    title: "Stand out instantly",
    description: "While others send generic pitches and plain screenshots, yours look custom-built for every client."
  },
  {
    icon: DollarSign,
    title: "One client pays for it",
    description: "At $19/mo for unlimited access to all 3 tools, a single new project covers months of Propel."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

const Value = () => {
  return (
    <section className="section-padding bg-muted/50">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Outcomes, not features.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three tools working together to grow your freelance business.
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {values.map((value, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
              className="bg-card rounded-xl p-6 card-elevated text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors"
              >
                <value.icon className="w-6 h-6 text-primary" />
              </motion.div>
              <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Value;
