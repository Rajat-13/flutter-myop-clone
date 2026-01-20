import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, User, Search, ChevronDown, Heart } from "lucide-react";
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

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Perfumes", href: "/all-products" },
    { name: "Personalised", href: "/personalised" },
    { name: "Ai", href: "/my-type" },
    { name: "Accessories", href: "/accessories" },
  ];

  const otherLinks = [
    { name: "About Us", href: "/about-us" },
    { name: "FAQ", href: "/faq" },
    { name: "Privacy Policy", href: "/privacy-policy" },
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
                <img src={logoImg} alt="RIMAE Logo" className="h-11 md:h-14 w-auto brightness-0 invert transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-tr from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full blur-xl" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gold/80 leading-tight font-light">
                  Fragrance That
                </p>
                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/60 leading-tight font-light">
                  Understands You
                </p>
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
                Others
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
