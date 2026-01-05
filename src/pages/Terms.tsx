import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-narrow">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Terms and Conditions</h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">Last updated: January 5, 2026</p>
            
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Agreement to Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using Propel, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">2. Description of Service</h2>
              <p className="text-muted-foreground">
                Propel is a SaaS platform that helps freelancers create professional proposals and personalized portfolio pages. We provide tools for generating, customizing, and exporting proposals.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">3. User Accounts</h2>
              <p className="text-muted-foreground">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">4. Subscription and Payments</h2>
              <p className="text-muted-foreground">
                Paid subscriptions are billed on a recurring basis. You authorize us to charge your payment method for all fees incurred. Prices may change with 30 days notice.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">5. Intellectual Property</h2>
              <p className="text-muted-foreground">
                You retain ownership of content you create using Propel. We retain ownership of the platform, including all software, designs, and trademarks.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">6. Prohibited Uses</h2>
              <p className="text-muted-foreground">
                You may not use Propel for any unlawful purpose, to harass others, to distribute malware, or to attempt to gain unauthorized access to our systems.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">7. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Propel is provided "as is" without warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">8. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">9. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms, please contact us at support@propel.app.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
