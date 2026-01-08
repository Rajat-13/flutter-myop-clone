import { useState } from "react";
import { Menu, X, ShoppingBag, User, Search } from "lucide-react";
import LoginDialog from "./LoginDialog";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navLinks = [
    { name: "Bestsellers", href: "#bestsellers" },
    { name: "Shop All", href: "#shop" },
    { name: "Create Your Own", href: "#create" },
    { name: "Cosmopolitan", href: "#cosmopolitan" },
    { name: "About", href: "#about" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16 md:h-20 px-4">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <div className="flex-1 md:flex-none text-center md:text-left">
            <a href="/" className="inline-block">
              <h1 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight">
                MYOP
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground -mt-1">
                Make Your Own Perfume
              </p>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="nav-link">
                {link.name}
              </a>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:text-primary transition-colors" aria-label="Search">
              <Search size={20} />
            </button>
            <button 
              className="p-2 hover:text-primary transition-colors" 
              aria-label="Account"
              onClick={() => setIsLoginOpen(true)}
            >
              <User size={20} />
            </button>
            <button className="p-2 hover:text-primary transition-colors relative" aria-label="Cart">
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-border py-4 px-4 animate-fade-in">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                className="block py-3 nav-link"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* Login Dialog */}
      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </header>
  );
};

export default Header;
