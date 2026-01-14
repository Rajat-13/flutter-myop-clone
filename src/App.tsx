import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
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
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import Ingredients from "./pages/admin/Ingredients";
import PerfumeBuilder from "./pages/admin/PerfumeBuilder";
import Products from "./pages/admin/Products";
import Payments from "./pages/admin/Payments";
import Notifications from "./pages/admin/Notifications";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";
import CartDrawer from "./components/CartDrawer";
import CheckoutDialog from "./components/CheckoutDialog";
import WishlistDrawer from "./components/WishlistDrawer";

const queryClient = new QueryClient();

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
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
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/bestsellers" element={<Bestsellers />} />
              <Route path="/personalised" element={<Personalised />} />
              <Route path="/my-type" element={<MyType />} />
              <Route path="/accessories" element={<Accessories />} />
              <Route path="/all-products" element={<AllProducts />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              
              {/* Admin Routes with Layout */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="orders" element={<Orders />} />
                <Route path="customers" element={<Customers />} />
                <Route path="ingredients" element={<Ingredients />} />
                <Route path="builder" element={<PerfumeBuilder />} />
                <Route path="products" element={<Products />} />
                <Route path="payments" element={<Payments />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
