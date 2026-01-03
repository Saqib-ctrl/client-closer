import { TrendingUp, Clock, Target, DollarSign } from "lucide-react";

const values = [
  {
    icon: TrendingUp,
    title: "Win more clients",
    description: "Proposals that show you understand the project get responses."
  },
  {
    icon: Clock,
    title: "Close deals faster",
    description: "Skip the back-and-forth. Present everything they need upfront."
  },
  {
    icon: Target,
    title: "Stand out instantly",
    description: "While others send generic pitches, yours speaks directly to their needs."
  },
  {
    icon: DollarSign,
    title: "One client pays for it",
    description: "Land one extra project and the tool pays for itself many times over."
  }
];

const Value = () => {
  return (
    <section className="section-padding bg-muted/50">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Outcomes, not features.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We focus on what actually matters to your freelance business.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-6 card-elevated text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Value;
