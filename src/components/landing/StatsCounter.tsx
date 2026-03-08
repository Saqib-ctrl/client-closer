import { motion, useInView, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
  { value: 15000, suffix: "+", label: "Deliverables generated" },
  { value: 3.2, suffix: "x", label: "Higher response rate", decimals: 1 },
  { value: 2, suffix: " min", label: "Average creation time" },
  { value: 8, suffix: " tools", label: "Included in every plan" }
];

const AnimatedNumber = ({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);

  const spring = useSpring(0, { stiffness: 50, damping: 30, duration: 2000 });

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [isInView, spring, value]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => setDisplayValue(latest));
    return unsubscribe;
  }, [spring]);

  const formatted = decimals > 0 ? displayValue.toFixed(decimals) : Math.floor(displayValue).toLocaleString();

  return <span ref={ref} className="tabular-nums">{formatted}{suffix}</span>;
};

const StatsCounter = () => {
  return (
    <section className="py-16 border-y border-border/30">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
              </div>
              <p className="text-xs text-muted-foreground/60 font-medium tracking-wide">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
