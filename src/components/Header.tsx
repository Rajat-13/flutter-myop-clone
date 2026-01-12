import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const { itemCount, setIsCartOpen } = useCart();
  const { itemCount: wishlistCount, setIsWishlistOpen } = useWishlist();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Perfumes", href: "/all-products" },
    { name: "Personalised", href: "/personalised" },
    { name: "My Type", href: "/my-type" },
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
          <div className="flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3">
            <Link to="/" className="flex items-center gap-3">
              <img src={logoImg} alt="RIMAE Logo" className="h-10 md:h-12 w-auto" />
              <div className="hidden sm:block text-left">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-muted-foreground leading-tight">
                  Perfume That
                </p>
                <p className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-muted-foreground leading-tight">
                  Understands You
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.href} className="nav-link text-sm font-medium">
                {link.name}
              </Link>
            ))}
            
            {/* Others Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="nav-link text-sm font-medium flex items-center gap-1 outline-none">
                Others
                <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {otherLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link to={link.href} className="w-full cursor-pointer">
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-3">
            <button 
              className="p-2 hover:text-primary transition-colors" 
              aria-label="Search"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={20} />
            </button>
            <button 
              className="p-2 hover:text-primary transition-colors relative" 
              aria-label="Wishlist"
              onClick={() => setIsWishlistOpen(true)}
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button 
              className="p-2 hover:text-primary transition-colors" 
              aria-label="Account"
              onClick={() => setIsLoginOpen(true)}
            >
              <User size={20} />
            </button>
            <button 
              className="p-2 hover:text-primary transition-colors relative" 
              aria-label="Cart"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-border py-4 px-4 animate-fade-in">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.href}
                className="block py-3 nav-link"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-border mt-3 pt-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Others</p>
              {otherLinks.map((link, index) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block py-3 nav-link text-sm"
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

      {/* Login Dialog */}
      <LoginDialog open={isLoginOpen} onOpenChange={handleLoginDialogChange} />
      
      {/* Search Drawer */}
      <SearchDrawer open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  );
};

export default Header;
