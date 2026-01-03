import { Check, ArrowRight } from "lucide-react";

const features = [
  "Unlimited proposals",
  "Personalized portfolio pages",
  "Client-specific customization",
  "Export to PDF",
  "Priority support",
  "Cancel anytime"
];

const Pricing = () => {
  return (
    <section id="pricing" className="section-padding">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Simple, honest pricing.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            One plan. Everything included. One client pays for it.
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="bg-card rounded-2xl p-8 lg:p-10 card-elevated border-2 border-primary">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-primary mb-2">Pro Plan</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-extrabold">$19</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Billed monthly. Cancel anytime.
              </p>
            </div>
            
            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className="btn-primary w-full group">
              Start generating proposals
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-center text-sm text-muted-foreground mt-4">
              7-day free trial. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
