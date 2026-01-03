import { ArrowRight, Play } from "lucide-react";

const Hero = () => {
  return (
    <section className="section-padding pt-24 md:pt-32 lg:pt-40">
      <div className="container-narrow text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 animate-fade-in-up">
          Win more freelance clients.
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Create client-ready proposals and portfolios that convert — in minutes.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <a href="#pricing" className="btn-primary group">
            Generate my proposal
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#example" className="btn-secondary group">
            <Play className="mr-2 w-4 h-4" />
            See example
          </a>
        </div>
        
        <p className="mt-8 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
          No credit card required to start
        </p>
      </div>
    </section>
  );
};

export default Hero;
