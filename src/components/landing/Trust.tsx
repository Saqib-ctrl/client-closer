import { Shield, Ban, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const trustItems = [
  {
    icon: Shield,
    title: "Your data stays private",
    description: "We never share your proposals, portfolio, or client information. Ever."
  },
  {
    icon: Ban,
    title: "No spam, no upsells",
    description: "Just the tool. No aggressive marketing or endless email sequences."
  },
  {
    icon: Calendar,
    title: "Cancel anytime",
    description: "No contracts, no hidden fees. Leave whenever you want with one click."
  }
];

const Trust = () => {
  return (
    <section className="section-padding bg-muted/50">
      <div className="container-wide">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
          className="grid md:grid-cols-3 gap-8"
        >
          {trustItems.map((item, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              whileHover={{ y: -5 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4"
              >
                <item.icon className="w-6 h-6 text-primary" />
              </motion.div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Trust;
