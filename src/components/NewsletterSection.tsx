import { useState } from "react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="section-padding gradient-burgundy">
      <div className="container-wide text-center">
        <h2 className="heading-section text-primary-foreground mb-4">
          Join the <span className="italic-accent">Fragrance Family</span>
        </h2>
        <p className="text-body text-primary-foreground/80 mb-8 max-w-xl mx-auto">
          Subscribe to receive exclusive offers, early access to new launches, 
          and personalized fragrance recommendations.
        </p>

        {isSubmitted ? (
          <div className="animate-fade-in">
            <p className="text-primary-foreground text-lg font-serif">
              Thank you for subscribing! ✨
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-primary-foreground/10 border border-primary-foreground/30 rounded-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground transition-colors"
                required
              />
              <button type="submit" className="btn-outline border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;
