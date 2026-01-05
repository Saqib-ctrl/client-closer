import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-narrow">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">Last updated: January 5, 2026</p>
            
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Information We Collect</h2>
              <p className="text-muted-foreground">
                We collect information you provide directly, including your name, email address, and payment information. We also collect usage data such as pages visited and features used.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
              <p className="text-muted-foreground">
                We use your information to provide and improve our services, process payments, communicate with you, and ensure security. We do not sell your personal data to third parties.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">3. Data Storage and Security</h2>
              <p className="text-muted-foreground">
                Your data is stored securely using industry-standard encryption. We implement appropriate technical and organizational measures to protect your personal information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">4. Cookies and Tracking</h2>
              <p className="text-muted-foreground">
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can control cookie preferences in your browser settings.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">5. Third-Party Services</h2>
              <p className="text-muted-foreground">
                We may use third-party services for payment processing, analytics, and customer support. These services have their own privacy policies governing their use of your information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">6. Your Rights</h2>
              <p className="text-muted-foreground">
                You have the right to access, correct, or delete your personal data. You may also request a copy of your data or withdraw consent for certain processing activities.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">7. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your data for as long as your account is active or as needed to provide services. Upon account deletion, we will remove your data within 30 days, except where required by law.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">8. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy periodically. We will notify you of significant changes via email or through the service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">9. Contact Us</h2>
              <p className="text-muted-foreground">
                For privacy-related inquiries, please contact us at privacy@propel.app.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
