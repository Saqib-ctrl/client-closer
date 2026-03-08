import { motion } from "framer-motion";

const Example = () => {
  return (
    <section id="example" className="py-24 md:py-32 border-t border-border/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground/50 font-medium mb-4">Before & after</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            See the difference.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-border/30 p-8 bg-card"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium mb-6">
              Before
            </span>

            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>Hi,</p>
              <p>I am a freelance web developer with 5 years of experience. I have worked with many clients and can build websites using React, Node.js, and other modern technologies.</p>
              <p>Please check my portfolio at myportfolio.com to see my past work. I am available to start immediately and my rate is $50/hour.</p>
              <p>Best regards,<br />John</p>
            </div>

            <div className="mt-6 pt-6 border-t border-border/20 space-y-1">
              <p className="text-xs text-muted-foreground/60">❌ No mention of client's needs</p>
              <p className="text-xs text-muted-foreground/60">❌ Generic portfolio link</p>
              <p className="text-xs text-muted-foreground/60">❌ No clear value proposition</p>
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-primary/20 p-8 bg-card relative overflow-hidden"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium mb-6">
              After — with Propel
            </span>

            <div className="space-y-4 text-sm leading-relaxed">
              <p className="font-medium">Re: E-commerce rebuild for your outdoor gear shop</p>
              <p>I noticed you're looking to migrate from Shopify to a custom solution. I recently helped OutdoorPro do exactly this — they saw a 40% improvement in load times and saved $800/month.</p>
              <p><strong>For your project, I'd recommend:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Next.js storefront with image optimization</li>
                <li>Headless CMS for inventory management</li>
                <li>Stripe integration with lower processing fees</li>
              </ul>
              <p><strong>Investment:</strong> $4,500 for the complete build (2-3 weeks)</p>
            </div>

            <div className="mt-6 pt-6 border-t border-primary/10 space-y-1">
              <p className="text-xs text-primary">✓ Addresses specific client problem</p>
              <p className="text-xs text-primary">✓ Shows relevant experience</p>
              <p className="text-xs text-primary">✓ Clear scope and pricing</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Example;
