import Header from "@/components/landing/Header";
import PricingSection from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
