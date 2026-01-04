import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import Solution from "@/components/landing/Solution";
import Value from "@/components/landing/Value";
import Example from "@/components/landing/Example";
import Testimonials from "@/components/landing/Testimonials";
import Audience from "@/components/landing/Audience";
import Pricing from "@/components/landing/Pricing";
import Trust from "@/components/landing/Trust";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Value />
        <Example />
        <Testimonials />
        <Audience />
        <Pricing />
        <Trust />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
