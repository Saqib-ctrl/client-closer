import { X } from "lucide-react";

const problems = [
  {
    title: "Generic proposals",
    description: "Copy-paste templates that don't speak to what the client actually needs."
  },
  {
    title: "Unclear portfolio",
    description: "Past work buried in folders, not presented in a way clients can quickly evaluate."
  },
  {
    title: "No visible value",
    description: "Clients can't immediately see why you're the right choice for their specific project."
  }
];

const Problem = () => {
  return (
    <section className="section-padding bg-muted/50">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            You're losing clients — not because of skill.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Most freelancers have the talent. What they don't have is a pitch that proves it.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-6 lg:p-8 card-elevated"
            >
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <X className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
              <p className="text-muted-foreground">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problem;
