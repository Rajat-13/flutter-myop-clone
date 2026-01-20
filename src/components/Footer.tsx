import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import logoImg from "@/assets/logo.png";

const Footer = () => {
  const footerLinks = {
    shop: [
      { name: "All Products", href: "/all-products" },
      { name: "Bestsellers", href: "/bestsellers" },
      { name: "New Arrivals", href: "/all-products" },
      { name: "Gift Sets", href: "/accessories" },
    ],
    company: [
      { name: "About Us", href: "/about-us" },
      { name: "Our Story", href: "/about-us" },
      { name: "Sustainability", href: "/about-us" },
      { name: "Careers", href: "/about-us" },
    ],
    support: [
      { name: "Contact Us", href: "/faq" },
      { name: "FAQs", href: "/faq" },
      { name: "Shipping", href: "/faq" },
      { name: "Returns", href: "/faq" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/privacy-policy" },
      { name: "Refund Policy", href: "/privacy-policy" },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-charcoal text-primary-foreground">
      <div className="container-wide section-padding">
        {/* Main Footer */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={logoImg} alt="RIMAE Logo" className="h-12 w-auto invert" />
            </Link>
            <p className="text-xs uppercase tracking-[0.15em] text-primary-foreground/60 mb-4">
              Fragrance That Understands You
            </p>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Crafting personalized fragrances since 2014. Your scent, your story.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">
            © 2024 RIMAE. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="p-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                aria-label={social.label}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
