import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import LogoBar from "@/components/landing/LogoBar";
import Problem from "@/components/landing/Problem";
import Solution from "@/components/landing/Solution";
import ToolsShowcase from "@/components/landing/ToolsShowcase";
import Value from "@/components/landing/Value";
import InteractiveDemo from "@/components/landing/InteractiveDemo";
import Example from "@/components/landing/Example";
import Testimonials from "@/components/landing/Testimonials";
import StatsCounter from "@/components/landing/StatsCounter";
import Audience from "@/components/landing/Audience";
import ComparisonTable from "@/components/landing/ComparisonTable";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Trust from "@/components/landing/Trust";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import MobileStickyCTA from "@/components/landing/MobileStickyCTA";
import { SocialProofNotifications } from "@/components/SocialProofNotifications";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative dot-grid">
      <Header />
      <main className="relative z-10">
        <Hero />
        <LogoBar />
        <Problem />
        <Solution />
        <ToolsShowcase />
        <Value />
        <InteractiveDemo />
        <Example />
        <Testimonials />
        <StatsCounter />
        <Audience />
        <ComparisonTable />
        <Pricing />
        <FAQ />
        <Trust />
        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyCTA />
      <SocialProofNotifications />
      <ExitIntentPopup />
    </div>
  );
};

export default Index;
