import { Check, X, Minus } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { name: "AI proposals", propel: true, diy: false, other: "partial" },
  { name: "Portfolio mockups", propel: true, diy: false, other: false },
  { name: "Cover letters", propel: true, diy: false, other: "partial" },
  { name: "Email assistant", propel: true, diy: false, other: false },
  { name: "Invoice generator", propel: true, diy: "partial", other: false },
  { name: "Client CRM", propel: true, diy: "partial", other: true },
  { name: "Portfolio builder", propel: true, diy: false, other: true },
  { name: "Analytics dashboard", propel: true, diy: false, other: "partial" },
  { name: "Time to create", propel: "2 min", diy: "1-2 hrs", other: "15-30 min" },
  { name: "All-in-one platform", propel: true, diy: false, other: false },
];

const renderValue = (value: boolean | string) => {
  if (value === true) return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10"><Check className="w-3.5 h-3.5 text-primary" /></span>;
  if (value === false) return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted"><X className="w-3.5 h-3.5 text-muted-foreground/40" /></span>;
  if (value === "partial") return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted"><Minus className="w-3.5 h-3.5 text-muted-foreground/60" /></span>;
  return <span className="text-xs text-muted-foreground">{value}</span>;
};

const ComparisonTable = () => {
  return (
    <section className="py-24 md:py-32 border-t border-border/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-12"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground/50 font-medium mb-4">Comparison</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Why Propel wins.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="overflow-x-auto"
        >
          <div className="min-w-[600px]">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 mb-2 px-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground/40 font-medium">Feature</div>
              <div className="text-center"><span className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">Propel</span></div>
              <div className="text-center"><span className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium">DIY</span></div>
              <div className="text-center"><span className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium">Other</span></div>
            </div>

            {/* Rows */}
            <div className="space-y-px bg-border/20 rounded-xl overflow-hidden border border-border/30 mt-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="grid grid-cols-4 gap-4 items-center p-4 bg-card hover:bg-muted/20 transition-colors"
                >
                  <div className="text-sm font-medium">{feature.name}</div>
                  <div className="flex justify-center">{renderValue(feature.propel)}</div>
                  <div className="flex justify-center">{renderValue(feature.diy)}</div>
                  <div className="flex justify-center">{renderValue(feature.other)}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonTable;
