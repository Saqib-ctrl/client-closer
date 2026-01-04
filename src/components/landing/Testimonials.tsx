import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "UX Designer",
    avatar: "SC",
    quote: "I went from a 10% response rate to landing 3 out of 5 proposals. The personalized approach makes all the difference.",
    rating: 5,
    highlight: "3x more responses"
  },
  {
    name: "Marcus Johnson",
    role: "Full-Stack Developer",
    avatar: "MJ",
    quote: "Used to spend 2 hours on each proposal. Now it takes 10 minutes and they actually convert. Game changer for my freelance business.",
    rating: 5,
    highlight: "10 min vs 2 hours"
  },
  {
    name: "Elena Rodriguez",
    role: "Brand Strategist",
    avatar: "ER",
    quote: "My first proposal with Propel landed me a $12k project. The ROI was immediate and honestly ridiculous.",
    rating: 5,
    highlight: "$12k first project"
  },
  {
    name: "David Park",
    role: "Motion Designer",
    avatar: "DP",
    quote: "Clients actually read my proposals now. They comment on how professional and tailored everything feels.",
    rating: 5,
    highlight: "100% read rate"
  },
  {
    name: "Aisha Patel",
    role: "Content Writer",
    avatar: "AP",
    quote: "Went from struggling to find clients to having a waitlist. The mockup feature alone is worth the subscription.",
    rating: 5,
    highlight: "Now has a waitlist"
  },
  {
    name: "Tom Williams",
    role: "Web Developer",
    avatar: "TW",
    quote: "Finally, a tool that understands freelancers. No fluff, just results. Closed 8 projects last month.",
    rating: 5,
    highlight: "8 projects/month"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

const Testimonials = () => {
  return (
    <section className="section-padding bg-gradient-to-b from-muted/30 to-background overflow-hidden">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            💬 What freelancers say
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Loved by freelancers worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of freelancers who are winning more clients with personalized proposals
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
              className="relative bg-card rounded-2xl p-6 border border-border/50 shadow-lg shadow-foreground/5 group"
            >
              {/* Quote icon */}
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 12, scale: 1.1 }}
                className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <Quote className="w-4 h-4 text-primary" />
              </motion.div>

              {/* Highlight badge */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4"
              >
                {testimonial.highlight}
              </motion.div>

              {/* Quote text */}
              <p className="text-foreground/90 mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                  >
                    <Star className="w-4 h-4 fill-primary text-primary" />
                  </motion.div>
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-semibold text-primary"
                >
                  {testimonial.avatar}
                </motion.div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: "500+", label: "Active freelancers" },
            { value: "15k+", label: "Proposals generated" },
            { value: "73%", label: "Avg. response rate" },
            { value: "$2.4M", label: "Projects won" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center"
            >
              <motion.p
                className="text-3xl md:text-4xl font-bold text-gradient"
                whileHover={{ scale: 1.05 }}
              >
                {stat.value}
              </motion.p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
