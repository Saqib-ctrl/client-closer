import { FileText, Upload, Sparkles } from "lucide-react";

const steps = [
  {
    icon: FileText,
    number: "01",
    title: "Paste the job description",
    description: "Copy the client's project brief or job posting. We'll extract exactly what they're looking for."
  },
  {
    icon: Upload,
    number: "02",
    title: "Add your past work",
    description: "Upload samples or link to your portfolio. We'll match relevant projects to the client's needs."
  },
  {
    icon: Sparkles,
    number: "03",
    title: "Get your proposal",
    description: "Receive a personalized proposal and portfolio page tailored specifically for this client."
  }
];

const Solution = () => {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Three steps to a winning proposal.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No templates. No guesswork. Just proposals that speak directly to what your client needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <span className="text-sm font-semibold text-primary mb-2 block">{step.number}</span>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-7 left-[calc(100%_-_24px)] w-12 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solution;
