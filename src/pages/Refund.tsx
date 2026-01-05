import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const Refund = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-narrow">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Refund Policy</h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">Last updated: January 5, 2026</p>
            
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Free Trial</h2>
              <p className="text-muted-foreground">
                We offer a 7-day free trial for new users. During this period, you can explore all features without charge. No credit card is required to start your trial.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">2. Subscription Cancellation</h2>
              <p className="text-muted-foreground">
                You may cancel your subscription at any time. Upon cancellation, you will retain access to Propel until the end of your current billing period.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">3. Refund Eligibility</h2>
              <p className="text-muted-foreground">
                We offer full refunds within 14 days of your initial purchase if you are not satisfied with our service. This applies to first-time subscribers only.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">4. How to Request a Refund</h2>
              <p className="text-muted-foreground">
                To request a refund, please contact our support team at support@propel.app with your account email and reason for the refund request. We aim to process all requests within 5 business days.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">5. Partial Refunds</h2>
              <p className="text-muted-foreground">
                For annual subscriptions cancelled after 14 days, we may offer a prorated refund at our discretion based on the unused portion of your subscription.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">6. Non-Refundable Items</h2>
              <p className="text-muted-foreground">
                The following are not eligible for refunds: renewals after the initial subscription period, accounts terminated for Terms of Service violations, and any promotional or discounted subscriptions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">7. Processing Time</h2>
              <p className="text-muted-foreground">
                Approved refunds will be processed within 5-10 business days. The refund will be credited to the original payment method used for the purchase.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">8. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about our refund policy, please contact us at support@propel.app.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Refund;
