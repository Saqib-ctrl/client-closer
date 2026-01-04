import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import LogoBar from "@/components/landing/LogoBar";
import Problem from "@/components/landing/Problem";
import Solution from "@/components/landing/Solution";
import Value from "@/components/landing/Value";
import InteractiveDemo from "@/components/landing/InteractiveDemo";
import Example from "@/components/landing/Example";
import Testimonials from "@/components/landing/Testimonials";
import StatsCounter from "@/components/landing/StatsCounter";
import Audience from "@/components/landing/Audience";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Trust from "@/components/landing/Trust";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import MobileStickyCTA from "@/components/landing/MobileStickyCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <LogoBar />
        <Problem />
        <Solution />
        <Value />
        <InteractiveDemo />
        <Example />
        <Testimonials />
        <StatsCounter />
        <Audience />
        <Pricing />
        <FAQ />
        <Trust />
        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyCTA />
    </div>
  );
};

export default Index;
