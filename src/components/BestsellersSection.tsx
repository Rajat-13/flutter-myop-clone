import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

const perfumeProducts = [
  {
    id: 1,
    name: "Purple Mystique",
    price: 499,
    originalPrice: 799,
    image: "https://images.unsplash.com/photo-1594035900144-17fc72a68908?w=600&auto=format&fit=crop&q=80",
    tag: "Bestseller",
  },
  {
    id: 2,
    name: "Ocean Breeze",
    price: 599,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Midnight Rose",
    price: 549,
    originalPrice: 899,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
    tag: "Sale",
  },
  {
    id: 4,
    name: "Fresh Citrus",
    price: 449,
    image: "https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Woody Essence",
    price: 699,
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    name: "Floral Dreams",
    price: 549,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&auto=format&fit=crop&q=80",
  },
];

const attarProducts = [
  {
    id: 101,
    name: "Royal Oudh Attar",
    price: 799,
    originalPrice: 999,
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&auto=format&fit=crop&q=80",
    tag: "Premium",
  },
  {
    id: 102,
    name: "Sandal Pure",
    price: 649,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 103,
    name: "Rose Absolute",
    price: 549,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&auto=format&fit=crop&q=80",
    tag: "Bestseller",
  },
  {
    id: 104,
    name: "Musk White",
    price: 499,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 105,
    name: "Amber Gold",
    price: 699,
    originalPrice: 899,
    image: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=600&auto=format&fit=crop&q=80",
    tag: "Sale",
  },
  {
    id: 106,
    name: "Jasmine Night",
    price: 599,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
  },
];

const BestsellersSection = () => {
  const [activeTab, setActiveTab] = useState<"perfume" | "attar">("perfume");
  const [activeIndex, setActiveIndex] = useState(2);
  const scrollRef = useRef<HTMLDivElement>(null);

  const products = activeTab === "perfume" ? perfumeProducts : attarProducts;

  // Reset to center card when tab changes
  useEffect(() => {
    setActiveIndex(2);
  }, [activeTab]);

  const scroll = (direction: "left" | "right") => {
    const newIndex = direction === "left" 
      ? Math.max(0, activeIndex - 1) 
      : Math.min(products.length - 1, activeIndex + 1);
    setActiveIndex(newIndex);
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const absD = Math.abs(diff);
    
    // Base transforms for the stacked effect
    const translateX = diff * 120; // horizontal spacing
    const translateZ = -absD * 100; // depth
    const rotateY = diff * -8; // rotation
    const scale = 1 - absD * 0.1; // scale down as cards get further
    const opacity = absD <= 2 ? 1 - absD * 0.2 : 0;
    const zIndex = 10 - absD;
    
    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
    };
  };

  return (
    <section id="bestsellers" className="section-padding bg-background overflow-hidden">
      <div className="container-wide">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 lg:gap-8 mb-8">
          <div>
            <h2 className="heading-section font-bold">
              Discover <em className="highlighted-text not-italic">Our Bestsellers</em>
            </h2>
          </div>
          <div className="hidden lg:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 flex items-center justify-center border border-foreground rounded-full hover:bg-foreground hover:text-background transition-all duration-300"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 flex items-center justify-center border border-foreground rounded-full hover:bg-foreground hover:text-background transition-all duration-300"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Animated Circular Tabs */}
        <div className="flex justify-center mb-8">
          <div className="relative inline-flex bg-muted/50 rounded-full p-1.5 backdrop-blur-sm">
            {/* Animated background pill */}
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-primary rounded-full shadow-lg transition-all duration-500 ease-out ${
                activeTab === "perfume" ? "left-1.5" : "left-[calc(50%+3px)]"
              }`}
              style={{
                boxShadow: "0 4px 20px -4px hsl(var(--primary) / 0.5)",
              }}
            />
            
            <button
              onClick={() => setActiveTab("perfume")}
              className={`relative z-10 px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === "perfume"
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeTab === "perfume" ? "bg-primary-foreground scale-100" : "bg-muted-foreground/50 scale-75"
                }`} />
                Perfume
              </span>
            </button>
            <button
              onClick={() => setActiveTab("attar")}
              className={`relative z-10 px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === "attar"
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeTab === "attar" ? "bg-primary-foreground scale-100" : "bg-muted-foreground/50 scale-75"
                }`} />
                Attar
              </span>
            </button>
          </div>
        </div>

        {/* Attar Description */}
        {activeTab === "attar" && (
          <div className="text-center mb-6 animate-fade-in">
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              <span className="text-primary font-medium">Alcohol-free oil-based fragrances</span> — Perfect for those who prefer natural, long-lasting scents without alcohol
            </p>
          </div>
        )}

        {/* 3D Stacked Carousel */}
        <div className="relative py-8">
          <div 
            className="flex items-center justify-center min-h-[450px]"
            style={{ perspective: "1500px" }}
          >
            <div className="relative flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
              {products.map((product, index) => (
                <div
                  key={product.id}
                  onClick={() => setActiveIndex(index)}
                  className={`absolute transition-all duration-500 ease-out cursor-pointer ${
                    index === activeIndex ? "z-20" : ""
                  }`}
                  style={getCardStyle(index)}
                >
                  <div className={`w-64 md:w-72 bg-card rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
                    index === activeIndex ? "ring-2 ring-primary/30 shadow-2xl" : "hover:shadow-lg"
                  }`}>
                    <div className="aspect-[3/4] overflow-hidden relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500"
                      />
                      {product.tag && (
                        <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-medium rounded-full ${
                          product.tag === "Bestseller" ? "bg-primary text-primary-foreground" :
                          product.tag === "Sale" ? "bg-red-500 text-white" :
                          "bg-amber-500 text-white"
                        }`}>
                          {product.tag}
                        </span>
                      )}
                    </div>
                    <div className="p-4 bg-gradient-to-t from-background to-card">
                      <h3 className="font-semibold text-foreground text-center">{product.name}</h3>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="text-lg font-bold text-primary">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Arrows */}
          <div className="flex lg:hidden justify-center gap-4 mt-4">
            <button
              onClick={() => scroll("left")}
              disabled={activeIndex === 0}
              className="w-10 h-10 flex items-center justify-center border border-foreground/30 rounded-full hover:bg-foreground hover:text-background transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={activeIndex === products.length - 1}
              className="w-10 h-10 flex items-center justify-center border border-foreground/30 rounded-full hover:bg-foreground hover:text-background transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? "w-8 h-2 bg-primary" 
                    : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestsellersSection;
