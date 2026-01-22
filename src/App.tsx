import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import PageTransition from "./components/PageTransition";
import FlashPopup from "./components/FlashPopup";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Bestsellers from "./pages/Bestsellers";
import Personalised from "./pages/Personalised";
import MyType from "./pages/MyType";
import Accessories from "./pages/Accessories";
import AllProducts from "./pages/AllProducts";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import OrdersNew from "./pages/admin/OrdersNew";
import Customers from "./pages/admin/Customers";
import AssetManager from "./pages/admin/AssetManager";
import Products from "./pages/admin/Products";
import Fragrances from "./pages/admin/Fragrances";
import AccessoriesAdmin from "./pages/admin/AccessoriesAdmin";
import FlashPopupAdmin from "./pages/admin/FlashPopupAdmin";
import SocialProofAdmin from "./pages/admin/SocialProofAdmin";
import Inventory from "./pages/admin/Inventory";
import Logistics from "./pages/admin/Logistics";
import Coupons from "./pages/admin/Coupons";
import Payments from "./pages/admin/Payments";
import Notifications from "./pages/admin/Notifications";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import PersonalisedAdmin from "./pages/admin/PersonalisedAdmin";
import AiAdvisorAdmin from "./pages/admin/AiAdvisorAdmin";
import LandingSetup from "./pages/admin/LandingSetup";
import ContentPages from "./pages/admin/ContentPages";
import SearchSeoAdmin from "./pages/admin/SearchSeoAdmin";
import NotFound from "./pages/NotFound";
import CartDrawer from "./components/CartDrawer";
import CheckoutDialog from "./components/CheckoutDialog";
import WishlistDrawer from "./components/WishlistDrawer";
import SocialProofPopup from "./components/SocialProofPopup";

const queryClient = new QueryClient();

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// Animated Routes Component
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/products/:slug" element={<PageTransition><ProductDetail /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
        <Route path="/bestsellers" element={<PageTransition><Bestsellers /></PageTransition>} />
        <Route path="/personalised" element={<PageTransition><Personalised /></PageTransition>} />
        <Route path="/my-type" element={<PageTransition><MyType /></PageTransition>} />
        <Route path="/accessories" element={<PageTransition><Accessories /></PageTransition>} />
        <Route path="/all-products" element={<PageTransition><AllProducts /></PageTransition>} />
        <Route path="/about-us" element={<PageTransition><AboutUs /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
        <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        
        {/* Admin Routes with Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<OrdersNew />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="logistics" element={<Logistics />} />
          <Route path="customers" element={<Customers />} />
          <Route path="fragrances" element={<Fragrances />} />
          <Route path="assets" element={<AssetManager />} />
          <Route path="accessories" element={<AccessoriesAdmin />} />
          <Route path="flash-popup" element={<FlashPopupAdmin />} />
          <Route path="social-proof" element={<SocialProofAdmin />} />
          <Route path="personalised" element={<PersonalisedAdmin />} />
          <Route path="ai-advisor" element={<AiAdvisorAdmin />} />
          <Route path="landing" element={<LandingSetup />} />
          <Route path="content" element={<ContentPages />} />
          <Route path="search-seo" element={<SearchSeoAdmin />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="payments" element={<Payments />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <WishlistProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <CartDrawer />
            <CheckoutDialog />
            <WishlistDrawer />
            <FlashPopup />
            <AnimatedRoutes />
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
