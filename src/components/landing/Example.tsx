const Example = () => {
  return (
    <section id="example" className="section-padding">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            See the difference.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The same freelancer. The same skills. One gets ignored. One gets hired.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Before */}
          <div className="rounded-xl border-2 border-border p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium">
                Before
              </span>
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
            
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground italic">
                ❌ No mention of client's specific needs<br />
                ❌ Generic portfolio link<br />
                ❌ No clear value proposition
              </p>
            </div>
          </div>
          
          {/* After */}
          <div className="rounded-xl border-2 border-primary p-6 lg:p-8 bg-primary/[0.02]">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                After
              </span>
              <span className="text-sm text-foreground font-medium">Client-specific proposal</span>
            </div>
            
            <div className="space-y-4 text-foreground">
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
            
            <div className="mt-6 pt-6 border-t border-primary/20">
              <p className="text-sm text-primary">
                ✓ Addresses specific client problem<br />
                ✓ Shows relevant experience<br />
                ✓ Clear scope and pricing
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Example;
