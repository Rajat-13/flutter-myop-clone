import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { allProducts } from "@/data/products";

// Indian cities for random display
const indianCities = [
  "Mumbai, Maharashtra",
  "Delhi, NCR",
  "Bangalore, Karnataka",
  "Hyderabad, Telangana",
  "Chennai, Tamil Nadu",
  "Kolkata, West Bengal",
  "Pune, Maharashtra",
  "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan",
  "Lucknow, Uttar Pradesh",
  "Chandigarh, Punjab",
  "Kochi, Kerala",
  "Indore, Madhya Pradesh",
  "Nagpur, Maharashtra",
  "Bhopal, Madhya Pradesh",
  "Surat, Gujarat",
  "Vadodara, Gujarat",
  "Nashik, Maharashtra",
  "Goa",
  "Coimbatore, Tamil Nadu",
  "Thiruvananthapuram, Kerala",
  "Visakhapatnam, Andhra Pradesh",
  "Patna, Bihar",
  "Ranchi, Jharkhand",
  "Guwahati, Assam",
  "Dehradun, Uttarakhand",
  "Shimla, Himachal Pradesh",
  "Raipur, Chhattisgarh",
  "Bhubaneswar, Odisha",
  "Mysore, Karnataka",
];

// Default products to show (admin can customize)
const defaultSelectedProducts = allProducts.slice(0, 5).map(p => p.id);

// Interval pattern in milliseconds (5,3,5,3 minutes)
const intervalPattern = [5 * 60 * 1000, 3 * 60 * 1000, 5 * 60 * 1000, 3 * 60 * 1000];

interface SocialProofSettings {
  enabled: boolean;
  selectedProductIds: string[];
  intervalPattern: number[];
}

const SocialProofPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<typeof allProducts[0] | null>(null);
  const [currentCity, setCurrentCity] = useState("");
  const [intervalIndex, setIntervalIndex] = useState(0);
  const [settings, setSettings] = useState<SocialProofSettings>({
    enabled: true,
    selectedProductIds: defaultSelectedProducts,
    intervalPattern: intervalPattern,
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("socialProofSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    if (!settings.enabled) return;

    const showPopup = () => {
      const availableProducts = allProducts.filter(p => 
        settings.selectedProductIds.includes(p.id)
      );
      
      if (availableProducts.length === 0) return;

      const randomProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
      const randomCity = indianCities[Math.floor(Math.random() * indianCities.length)];
      
      setCurrentProduct(randomProduct);
      setCurrentCity(randomCity);
      setIsVisible(true);

      // Auto-hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Show first popup after 10 seconds
    const initialTimeout = setTimeout(showPopup, 10000);

    // Set up recurring interval
    const scheduleNext = () => {
      const currentInterval = settings.intervalPattern[intervalIndex % settings.intervalPattern.length];
      return setTimeout(() => {
        showPopup();
        setIntervalIndex(prev => prev + 1);
      }, currentInterval);
    };

    let intervalTimeout = scheduleNext();

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(intervalTimeout);
    };
  }, [settings, intervalIndex]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!currentProduct) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-6 left-6 z-50 max-w-xs"
        >
          <Link
            to={`/products/${currentProduct.slug}`}
            className="block bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden hover:shadow-3xl transition-shadow duration-300"
            onClick={handleClose}
          >
            <div className="flex items-center gap-3 p-3">
              {/* Product Image */}
              <div className="relative w-16 h-16 flex-shrink-0">
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">
                  Someone from <span className="font-medium text-charcoal">{currentCity}</span>
                </p>
                <p className="text-sm font-medium text-charcoal truncate">
                  just purchased this!
                </p>
                <p className="text-sm text-primary font-semibold truncate">
                  {currentProduct.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {Math.floor(Math.random() * 10) + 1} minutes ago
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClose();
                }}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>

            {/* Progress bar */}
            <motion.div
              className="h-0.5 bg-primary/20"
              initial={{ scaleX: 1, transformOrigin: "left" }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: "linear" }}
            >
              <motion.div
                className="h-full bg-primary"
                initial={{ scaleX: 1, transformOrigin: "left" }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: "linear" }}
              />
            </motion.div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SocialProofPopup;
