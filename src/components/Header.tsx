import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, User, Search, ChevronDown, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import LoginDialog from "./LoginDialog";
import SearchDrawer from "./SearchDrawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoImg from "@/assets/logo.png";

// Perfume spray particles component
const SprayParticles = ({ isAnimating }: { isAnimating: boolean }) => {
  const particles = Array.from({ length: 12 }, (_, i) => i);
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {particles.map((i) => {
        const angle = (i / 12) * 360;
        const delay = i * 0.05;
        const distance = 20 + Math.random() * 15;
        
        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-gold/60"
            initial={{ 
              x: 0, 
              y: 0, 
              opacity: 0,
              scale: 0 
            }}
            animate={isAnimating ? {
              x: [0, Math.cos(angle * Math.PI / 180) * distance],
              y: [0, Math.sin(angle * Math.PI / 180) * distance],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            } : {}}
            transition={{
              duration: 0.8,
              delay,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
};

// Mist effect component
const MistEffect = ({ isAnimating }: { isAnimating: boolean }) => {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={isAnimating ? {
        opacity: [0, 0.4, 0],
      } : { opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 bg-gradient-radial from-gold/30 via-gold/10 to-transparent blur-md" />
    </motion.div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoRevealed, setIsLogoRevealed] = useState(false);
  const [isSprayAnimating, setIsSprayAnimating] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();
  const { itemCount: wishlistCount, setIsWishlistOpen } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isHomePage = location.pathname === "/";

  // Track scroll position to hide marquee
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logo spray animation on mount and interval
  useEffect(() => {
    // Initial reveal with spray
    const revealTimer = setTimeout(() => {
      setIsSprayAnimating(true);
      setTimeout(() => {
        setIsLogoRevealed(true);
        setIsSprayAnimating(false);
      }, 800);
    }, 500);

    // Repeat spray animation every 8 seconds
    const intervalTimer = setInterval(() => {
      setIsSprayAnimating(true);
      setTimeout(() => setIsSprayAnimating(false), 1000);
    }, 8000);

    return () => {
      clearTimeout(revealTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "STORE", href: "/all-products" },
    { name: "PERSONALIZED", href: "/personalised" },
    { name: "Ai", href: "/my-type" },
    { name: "ACCESSORIES", href: "/accessories" },
  ];

  const otherLinks = [
    { name: "ABOUT US", href: "/about-us" },
    { name: "FAQ", href: "/faq" },
    { name: "PRIVACY POLICY", href: "/privacy-policy" },
  ];

  const handleLoginDialogChange = (open: boolean, navigateTo?: string) => {
    setIsLoginOpen(open);
    if (navigateTo) {
      navigate(navigateTo);
    }
  };

  return (
    <header 
      className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "top-0 bg-[#1a1817] shadow-xl" 
          : isHomePage 
            ? "top-8 bg-[#1a1817]/95 backdrop-blur-sm" 
            : "top-0 bg-[#1a1817]"
      }`}
    >
      {/* Premium gold accent line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />
      
      <div className="container-wide">
        <div className={`flex items-center justify-between px-4 md:px-6 transition-all duration-300 ${
          isHomePage ? "h-20 md:h-24" : "h-14 md:h-16"
        }`}>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white/90 hover:text-gold transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <div className="flex-1 md:flex-none flex items-center justify-center md:justify-start gap-4">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative">
                {/* Spray particles */}
                <SprayParticles isAnimating={isSprayAnimating} />
                
                {/* Mist effect */}
                <MistEffect isAnimating={isSprayAnimating} />
                
                {/* Logo with reveal animation */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                  animate={{ 
                    opacity: isLogoRevealed ? 1 : 0, 
                    scale: isLogoRevealed ? 1 : 0.8,
                    filter: isLogoRevealed ? "blur(0px)" : "blur(10px)",
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <motion.img 
                    src={logoImg} 
                    alt="RIMAE Logo" 
                    className="h-11 md:h-14 w-auto brightness-0 invert"
                    whileHover={{ scale: 1.1 }}
                    animate={isSprayAnimating ? {
                      scale: [1, 1.05, 1],
                      filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
                    } : {}}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                </motion.div>
                
                {/* Glow effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-gold/40 to-transparent rounded-full blur-xl"
                  animate={{ 
                    opacity: isSprayAnimating ? [0.3, 0.8, 0.3] : [0.2, 0.4, 0.2],
                    scale: isSprayAnimating ? [1, 1.3, 1] : [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: isSprayAnimating ? 0.8 : 2, 
                    repeat: isSprayAnimating ? 0 : Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
              <div className="hidden sm:block text-left">
                <motion.p 
                  className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gold/80 leading-tight font-light"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: isLogoRevealed ? 1 : 0, x: isLogoRevealed ? 0 : -10 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  Fragrance That
                </motion.p>
                <motion.p 
                  className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/60 leading-tight font-light"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: isLogoRevealed ? 1 : 0, x: isLogoRevealed ? 0 : -10 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  Understands You
                </motion.p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href} 
                className="relative px-4 py-2 text-sm font-medium text-white/80 tracking-wide hover:text-gold transition-all duration-300 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-gold to-gold-light group-hover:w-3/4 transition-all duration-300" />
              </Link>
            ))}
            
            {/* Others Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="relative px-4 py-2 text-sm font-medium text-white/80 tracking-wide hover:text-gold transition-all duration-300 flex items-center gap-1 outline-none group">
                OTHERS
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-gold to-gold-light group-hover:w-3/4 transition-all duration-300" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-[#2D2A26] border-gold/20 shadow-2xl">
                {otherLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link to={link.href} className="w-full cursor-pointer text-white/80 hover:text-gold hover:bg-white/5 transition-colors">
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-1">
            <button 
              className="p-3 text-white/80 hover:text-gold transition-all duration-300 hover:bg-white/5 rounded-full" 
              aria-label="Search"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={20} />
            </button>
            <button 
              className="p-3 text-white/80 hover:text-gold transition-all duration-300 hover:bg-white/5 rounded-full relative" 
              aria-label="Wishlist"
              onClick={() => setIsWishlistOpen(true)}
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-br from-gold to-gold-light text-charcoal text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button 
              className="p-3 text-white/80 hover:text-gold transition-all duration-300 hover:bg-white/5 rounded-full" 
              aria-label="Account"
              onClick={() => setIsLoginOpen(true)}
            >
              <User size={20} />
            </button>
            <button 
              className="p-3 text-white/80 hover:text-gold transition-all duration-300 hover:bg-white/5 rounded-full relative" 
              aria-label="Cart"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-br from-gold to-gold-light text-charcoal text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-gold/20 py-4 px-4 animate-fade-in bg-[#2D2A26]/95">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.href}
                className="block py-3 text-white/80 hover:text-gold transition-colors font-medium tracking-wide"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-gold/20 mt-3 pt-3">
              <p className="text-xs text-gold/60 uppercase tracking-widest mb-2">Others</p>
              {otherLinks.map((link, index) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block py-3 text-white/70 hover:text-gold transition-colors text-sm"
                  style={{ animationDelay: `${(navLinks.length + index) * 0.1}s` }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
      
      {/* Bottom gold accent line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* Login Dialog */}
      <LoginDialog open={isLoginOpen} onOpenChange={handleLoginDialogChange} />
      
      {/* Search Drawer */}
      <SearchDrawer open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  );
};

export default Header;
