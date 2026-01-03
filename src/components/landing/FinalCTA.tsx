import { ArrowRight } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="section-padding">
      <div className="container-narrow text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
          Your next client should be easier to win.
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
          Stop sending proposals that get ignored. Start closing more deals.
        </p>
        
        <a href="#pricing" className="btn-primary group text-lg px-8 py-4">
          Create my first proposal
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </a>
        
        <p className="mt-6 text-sm text-muted-foreground">
          Free to try. Takes 2 minutes.
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;
