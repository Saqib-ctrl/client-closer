import { Shield, Ban, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const trustItems = [
  { icon: Shield, title: "Your data stays private", description: "We never share your proposals, portfolio, or client information." },
  { icon: Ban, title: "No spam, no upsells", description: "Just the tool. No aggressive marketing or endless emails." },
  { icon: Calendar, title: "Cancel anytime", description: "No contracts, no hidden fees. Leave whenever you want." }
];

const Trust = () => {
  return (
    <section className="py-16 border-t border-border/30">
      <div className="container-wide">
        <div className="grid md:grid-cols-3 gap-8">
          {trustItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="flex items-start gap-4"
            >
              <div className="w-9 h-9 rounded-lg bg-muted/80 flex items-center justify-center border border-border/30 shrink-0">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trust;
