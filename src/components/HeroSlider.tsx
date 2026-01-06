import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  bgColor: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "THE SCENT LOOT BOX",
    subtitle: "IS LIVE",
    cta: "Shop Now",
    ctaLink: "#shop",
    bgColor: "bg-cream",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "CREATE YOUR OWN",
    subtitle: "SIGNATURE SCENT",
    cta: "Start Creating",
    ctaLink: "#create",
    bgColor: "bg-muted",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "THE COSMOPOLITAN",
    subtitle: "COLLECTION",
    cta: "Explore",
    ctaLink: "#cosmopolitan",
    bgColor: "bg-cream",
    image: "https://images.unsplash.com/photo-1594035900144-17fc72a68908?w=1200&auto=format&fit=crop&q=80",
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
    <section className="relative h-[80vh] md:h-screen mt-16 md:mt-20 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className={`relative h-full ${slide.bgColor}`}>
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-background/20" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center justify-center text-center px-4">
              <div className={`${index === currentSlide ? "animate-fade-in" : ""}`}>
                <h2 className="heading-display text-charcoal mb-2">
                  {slide.title}
                </h2>
                <p className="heading-subsection italic-accent text-charcoal/80 mb-8">
                  {slide.subtitle}
                </p>
                <a href={slide.ctaLink} className="btn-primary inline-block">
                  {slide.cta}
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-background/80 hover:bg-background rounded-full transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-background/80 hover:bg-background rounded-full transition-all"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentSlide
                ? "bg-primary w-8"
                : "bg-foreground/30 hover:bg-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
