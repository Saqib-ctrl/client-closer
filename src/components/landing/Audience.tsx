import { Palette, Code, Megaphone, Video } from "lucide-react";
import { motion } from "framer-motion";

const audiences = [
  {
    icon: Palette,
    title: "Designers",
    description: "UI/UX, brand, graphic, and product designers"
  },
  {
    icon: Code,
    title: "Developers",
    description: "Web, mobile, and software developers"
  },
  {
    icon: Megaphone,
    title: "Marketers",
    description: "Content, SEO, social media, and growth specialists"
  },
  {
    icon: Video,
    title: "Video Editors",
    description: "Motion graphics, video production, and editors"
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
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const
    }
  }
};

const Audience = () => {
  return (
    <section className="section-padding bg-muted/50">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Built for every freelancer.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whatever your skill, your proposals should work as hard as you do.
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {audiences.map((audience, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-card rounded-xl p-6 card-elevated group cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary transition-colors duration-300"
              >
                <audience.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{audience.title}</h3>
              <p className="text-muted-foreground">{audience.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Audience;
