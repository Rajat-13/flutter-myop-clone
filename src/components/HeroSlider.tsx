import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
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
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <section className="relative overflow-hidden">
      <div className="relative">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100 relative" : "opacity-0 absolute inset-0"
            }`}
          >
            <Link 
              to={slide.link}
              className="block"
            >
              {/* Image container - 1536x1024 images display full without crop */}
              <div className="w-full aspect-[3/2]">
                <img
                  src={slide.image}
                  alt={`Slide ${slide.id}`}
                  className="w-full h-full object-contain bg-muted"
                />
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={(e) => { e.preventDefault(); prevSlide(); }}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full transition-all duration-300 shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="text-charcoal md:w-6 md:h-6" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); nextSlide(); }}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full transition-all duration-300 shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="text-charcoal md:w-6 md:h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 md:h-2.5 rounded-full transition-all duration-500 ${
              index === currentSlide
                ? "bg-charcoal w-8 md:w-10"
                : "bg-charcoal/30 w-4 md:w-6 hover:bg-charcoal/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
