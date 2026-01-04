import { Check, X, Minus } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    name: "Personalized proposals",
    propel: true,
    templates: false,
    manual: "partial"
  },
  {
    name: "Time to create",
    propel: "2 minutes",
    templates: "15-30 min",
    manual: "1-2 hours"
  },
  {
    name: "Portfolio integration",
    propel: true,
    templates: false,
    manual: "partial"
  },
  {
    name: "Client-specific value props",
    propel: true,
    templates: false,
    manual: true
  },
  {
    name: "Professional formatting",
    propel: true,
    templates: true,
    manual: "partial"
  },
  {
    name: "AI-powered insights",
    propel: true,
    templates: false,
    manual: false
  },
  {
    name: "Scalable for volume",
    propel: true,
    templates: "partial",
    manual: false
  },
  {
    name: "Consistency across proposals",
    propel: true,
    templates: true,
    manual: false
  }
];

const renderValue = (value: boolean | string) => {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/10">
        <Check className="w-4 h-4 text-green-500" />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-destructive/10">
        <X className="w-4 h-4 text-destructive" />
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/10">
        <Minus className="w-4 h-4 text-yellow-600" />
      </span>
    );
  }
  return <span className="text-sm text-muted-foreground">{value}</span>;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" as const }
  }
};

const ComparisonTable = () => {
  return (
    <section className="section-padding bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Why Propel wins
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how Propel compares to traditional approaches for creating proposals.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="overflow-x-auto"
        >
          <div className="min-w-[600px]">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Feature
              </div>
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="inline-block px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold"
                >
                  Propel
                </motion.div>
              </div>
              <div className="text-center">
                <div className="inline-block px-4 py-2 rounded-xl bg-muted font-medium">
                  Templates
                </div>
              </div>
              <div className="text-center">
                <div className="inline-block px-4 py-2 rounded-xl bg-muted font-medium">
                  Manual
                </div>
              </div>
            </div>

            {/* Rows */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-2"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  variants={rowVariants}
                  className={`grid grid-cols-4 gap-4 items-center p-4 rounded-xl transition-colors ${
                    index % 2 === 0 ? "bg-card" : "bg-card/50"
                  } hover:bg-card/80`}
                >
                  <div className="font-medium">{feature.name}</div>
                  <div className="flex justify-center">{renderValue(feature.propel)}</div>
                  <div className="flex justify-center">{renderValue(feature.templates)}</div>
                  <div className="flex justify-center">{renderValue(feature.manual)}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10"
        >
          <p className="text-muted-foreground mb-4">
            Ready to upgrade your proposal game?
          </p>
          <motion.a
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href="#pricing"
            className="btn-primary inline-flex items-center"
          >
            Get started free
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonTable;