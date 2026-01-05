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
            
            <section className="space-y-4 p-4 bg-muted/50 rounded-lg border">
              <h2 className="text-xl font-semibold">Merchant of Record</h2>
              <p className="text-muted-foreground">
                All purchases made through Propel are processed by <strong>Paddle</strong>, our Merchant of Record. Paddle handles all billing, payments, and refund requests on our behalf.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Refund Policy</h2>
              <p className="text-muted-foreground">
                We offer a <strong>14-day refund window</strong> from the date of purchase. If you are not satisfied with your purchase, you may request a full refund within 14 days of your initial transaction, no questions asked. This is in accordance with Paddle's standard refund policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">2. How to Request a Refund</h2>
              <p className="text-muted-foreground">
                To request a refund, please contact Paddle directly through your purchase receipt or visit{" "}
                <a href="https://paddle.net" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                  paddle.net
                </a>{" "}
                and navigate to your transaction history. You can also contact our support team at support@propel.app and we will assist you with the refund process.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">3. Processing Time</h2>
              <p className="text-muted-foreground">
                Once your refund request is approved, Paddle will process the refund to your original payment method. Refunds typically appear within 5-10 business days, depending on your payment provider.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">4. Subscription Cancellation</h2>
              <p className="text-muted-foreground">
                You may cancel your subscription at any time. To cancel, visit your account settings or contact our support team. Upon cancellation, you will retain access to Propel until the end of your current billing period.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">5. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about refunds or need assistance, please contact us at support@propel.app or reach out to Paddle directly for billing-related inquiries.
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
