import { motion } from "framer-motion";

const Example = () => {
  return (
    <section id="example" className="section-padding">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            See the difference.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The same freelancer. The same skills. One gets ignored. One gets hired.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl border-2 border-border p-6 lg:p-8 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-6">
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2, type: "spring" }}
                className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium"
              >
                Before
              </motion.span>
              <span className="text-sm text-muted-foreground">Generic proposal</span>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <p className="text-sm leading-relaxed">
                Hi,
              </p>
              <p className="text-sm leading-relaxed">
                I am a freelance web developer with 5 years of experience. I have worked with many clients and can build websites using React, Node.js, and other modern technologies.
              </p>
              <p className="text-sm leading-relaxed">
                Please check my portfolio at myportfolio.com to see my past work. I am available to start immediately and my rate is $50/hour.
              </p>
              <p className="text-sm leading-relaxed">
                Let me know if you have any questions.
              </p>
              <p className="text-sm leading-relaxed">
                Best regards,<br />
                John
              </p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-6 pt-6 border-t border-border"
            >
              <p className="text-sm text-muted-foreground italic">
                ❌ No mention of client's specific needs<br />
                ❌ Generic portfolio link<br />
                ❌ No clear value proposition
              </p>
            </motion.div>
          </motion.div>
          
          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl border-2 border-primary p-6 lg:p-8 bg-primary/[0.02] transition-all duration-300 relative overflow-hidden"
          >
            {/* Shimmer effect */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent pointer-events-none"
            />
            
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3, type: "spring" }}
                className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium"
              >
                After
              </motion.span>
              <span className="text-sm text-foreground font-medium">Client-specific proposal</span>
            </div>
            
            <div className="space-y-4 text-foreground relative z-10">
              <p className="text-sm leading-relaxed font-medium">
                Re: E-commerce rebuild for your outdoor gear shop
              </p>
              <p className="text-sm leading-relaxed">
                I noticed you're looking to migrate from Shopify to a custom solution for better performance and lower fees. I recently helped OutdoorPro do exactly this — they saw a 40% improvement in load times and saved $800/month.
              </p>
              <p className="text-sm leading-relaxed">
                <strong>For your project, I'd recommend:</strong>
              </p>
              <ul className="text-sm leading-relaxed list-disc list-inside space-y-1">
                <li>Next.js storefront with image optimization for your product photos</li>
                <li>Headless CMS for your team to manage inventory</li>
                <li>Stripe integration with lower processing fees</li>
              </ul>
              <p className="text-sm leading-relaxed">
                <strong>Investment:</strong> $4,500 for the complete build (2-3 weeks)
              </p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mt-6 pt-6 border-t border-primary/20 relative z-10"
            >
              <p className="text-sm text-primary">
                ✓ Addresses specific client problem<br />
                ✓ Shows relevant experience<br />
                ✓ Clear scope and pricing
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Example;
