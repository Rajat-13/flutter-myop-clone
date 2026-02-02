import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import heroSlide1 from "@/assets/hero-slide-1.png";
import heroSlide2 from "@/assets/hero-slide-2.png";
import heroSlide3 from "@/assets/hero-slide-3.png";

interface Slide {
  id: number;
  image: string;
  link: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: heroSlide1,
    link: "/all-products",
  },
  {
    id: 2,
    image: heroSlide2,
    link: "/products/sandal-veer",
  },
  {
    id: 3,
    image: heroSlide3,
    link: "/all-products?promo=RIMAENEW",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[500px] md:h-[650px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="absolute inset-0"
          >
            <Link 
              to={slides[currentSlide].link}
              className="block w-full h-full"
            >
              <img
                src={slides[currentSlide].image}
                alt={`Slide ${slides[currentSlide].id}`}
                className="w-full h-full object-cover"
              />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots - Elegant minimal style */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="group relative p-1"
            aria-label={`Go to slide ${index + 1}`}
          >
            <span 
              className={`block h-0.5 transition-all duration-500 ease-out ${
                index === currentSlide
                  ? "w-8 bg-white"
                  : "w-4 bg-white/40 group-hover:bg-white/70"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
