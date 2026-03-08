import { Palette, Code, Megaphone, Video } from "lucide-react";
import { motion } from "framer-motion";

const audiences = [
  { icon: Palette, title: "Designers", description: "UI/UX, brand, graphic, and product designers" },
  { icon: Code, title: "Developers", description: "Web, mobile, and software developers" },
  { icon: Megaphone, title: "Marketers", description: "Content, SEO, social media specialists" },
  { icon: Video, title: "Creatives", description: "Video editors, motion graphics, and writers" }
];

const Audience = () => {
  return (
    <section className="py-24 md:py-32 border-t border-border/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground/50 font-medium mb-4">Who it's for</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Built for every freelancer.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {audiences.map((audience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-card rounded-2xl p-6 border border-border/30 group hover:border-border/60 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-muted/80 flex items-center justify-center mb-4 border border-border/30 group-hover:border-primary/30 transition-colors">
                <audience.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold mb-1">{audience.title}</h3>
              <p className="text-sm text-muted-foreground">{audience.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Audience;
