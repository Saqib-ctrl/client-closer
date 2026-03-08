import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "UX Designer",
    quote: "I went from a 10% response rate to landing 3 out of 5 proposals. The personalized approach makes all the difference.",
    highlight: "3x more responses"
  },
  {
    name: "Marcus Johnson",
    role: "Full-Stack Developer",
    quote: "Used to spend 2 hours on each proposal. Now it takes 10 minutes and they actually convert.",
    highlight: "10 min vs 2 hours"
  },
  {
    name: "Elena Rodriguez",
    role: "Brand Strategist",
    quote: "My first proposal with Propel landed me a $12k project. The ROI was immediate.",
    highlight: "$12k first project"
  },
  {
    name: "David Park",
    role: "Motion Designer",
    quote: "Clients actually read my proposals now. They comment on how professional everything feels.",
    highlight: "100% read rate"
  },
  {
    name: "Aisha Patel",
    role: "Content Writer",
    quote: "Went from struggling to find clients to having a waitlist. The mockup feature alone is worth it.",
    highlight: "Now has a waitlist"
  },
  {
    name: "Tom Williams",
    role: "Web Developer",
    quote: "Finally, a tool that understands freelancers. No fluff, just results. Closed 8 projects last month.",
    highlight: "8 projects/month"
  }
];

const Testimonials = () => {
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
          <p className="text-xs uppercase tracking-widest text-muted-foreground/50 font-medium mb-4">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Loved by freelancers worldwide.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="bg-card rounded-2xl p-6 border border-border/30 group hover:border-border/60 transition-colors"
            >
              {/* Highlight */}
              <span className="inline-block px-2.5 py-1 rounded-full bg-primary/8 text-primary text-xs font-semibold mb-4 border border-primary/10">
                {testimonial.highlight}
              </span>

              {/* Quote */}
              <p className="text-sm text-foreground/80 leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Stars + Author */}
              <div className="flex items-center justify-between pt-4 border-t border-border/20">
                <div>
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
