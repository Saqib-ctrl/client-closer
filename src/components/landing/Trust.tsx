import { Shield, Ban, Calendar } from "lucide-react";

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
        <div className="grid md:grid-cols-3 gap-8">
          {trustItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trust;
