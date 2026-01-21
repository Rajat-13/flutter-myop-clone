import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FlashPopupConfig {
  isEnabled: boolean;
  backgroundImage?: string;
  backgroundColor: string;
  headerText: string;
  subHeaderText: string;
  message: string;
  redirectUrl: string;
  buttonText: string;
  showOnLoad: boolean;
  delaySeconds: number;
}

// Default config - in production this would come from admin settings
const defaultConfig: FlashPopupConfig = {
  isEnabled: true,
  backgroundImage: "",
  backgroundColor: "linear-gradient(135deg, hsl(345 60% 30%) 0%, hsl(345 65% 25%) 100%)",
  headerText: "🎉 Flash Sale!",
  subHeaderText: "Limited Time Offer",
  message: "Get 20% off on all perfumes. Use code FLASH20 at checkout.",
  redirectUrl: "/all-products?promo=FLASH20",
  buttonText: "Shop Now",
  showOnLoad: true,
  delaySeconds: 2,
};

interface FlashPopupProps {
  config?: Partial<FlashPopupConfig>;
}

const FlashPopup = ({ config = {} }: FlashPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const mergedConfig = { ...defaultConfig, ...config };

  useEffect(() => {
    if (!mergedConfig.isEnabled || !mergedConfig.showOnLoad) return;

    // Check if popup was already shown in this session
    const wasShown = sessionStorage.getItem("flash-popup-shown");
    if (wasShown) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem("flash-popup-shown", "true");
    }, mergedConfig.delaySeconds * 1000);

    return () => clearTimeout(timer);
  }, [mergedConfig.isEnabled, mergedConfig.showOnLoad, mergedConfig.delaySeconds]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClick = () => {
    window.location.href = mergedConfig.redirectUrl;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={handleClose}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-md"
          >
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: mergedConfig.backgroundImage 
                  ? `url(${mergedConfig.backgroundImage}) center/cover no-repeat`
                  : mergedConfig.backgroundColor,
              }}
            >
              {/* Overlay for text readability when using image */}
              {mergedConfig.backgroundImage && (
                <div className="absolute inset-0 bg-black/40" />
              )}
              
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              
              {/* Content */}
              <div className="relative z-10 p-8 text-center text-white">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-serif text-3xl md:text-4xl font-bold mb-2"
                >
                  {mergedConfig.headerText}
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg md:text-xl font-medium text-white/90 mb-4"
                >
                  {mergedConfig.subHeaderText}
                </motion.p>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/80 mb-6 text-sm md:text-base"
                >
                  {mergedConfig.message}
                </motion.p>
                
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={handleClick}
                  className="px-8 py-3 bg-white text-charcoal font-semibold rounded-lg hover:bg-white/90 transition-colors shadow-lg"
                >
                  {mergedConfig.buttonText}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FlashPopup;
