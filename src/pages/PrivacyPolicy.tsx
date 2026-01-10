import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container-wide px-4 py-12">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-center mb-8">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Last updated: January 2026
          </p>
          
          <div className="max-w-3xl mx-auto space-y-8 text-muted-foreground">
            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-4">
                1. Information We Collect
              </h2>
              <p className="leading-relaxed">
                We collect information you provide directly to us, such as your name, email address, 
                phone number, shipping address, and payment information when you make a purchase or 
                create an account. We also collect information about your preferences when you create 
                personalized fragrances.
              </p>
            </section>
            
            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-4">
                2. How We Use Your Information
              </h2>
              <p className="leading-relaxed">
                We use the information we collect to process your orders, communicate with you about 
                your purchases, send you marketing communications (with your consent), personalize 
                your experience, and improve our products and services.
              </p>
            </section>
            
            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-4">
                3. Information Sharing
              </h2>
              <p className="leading-relaxed">
                We do not sell your personal information. We may share your information with service 
                providers who assist in our operations (shipping, payment processing), when required 
                by law, or with your consent.
              </p>
            </section>
            
            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-4">
                4. Data Security
              </h2>
              <p className="leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>
            
            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-4">
                5. Your Rights
              </h2>
              <p className="leading-relaxed">
                You have the right to access, correct, or delete your personal information. You can 
                also opt out of marketing communications at any time. Contact us at privacy@myop.in 
                to exercise these rights.
              </p>
            </section>
            
            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-4">
                6. Cookies
              </h2>
              <p className="leading-relaxed">
                We use cookies and similar technologies to enhance your browsing experience, analyze 
                site traffic, and understand where our visitors come from. You can control cookies 
                through your browser settings.
              </p>
            </section>
            
            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-4">
                7. Contact Us
              </h2>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:<br />
                Email: privacy@myop.in<br />
                Phone: +91 1800-123-4567<br />
                Address: MYOP Fragrances Pvt. Ltd., Mumbai, India
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
