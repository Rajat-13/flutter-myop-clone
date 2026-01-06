import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

const products = [
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

const BestsellersSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="bestsellers" className="section-padding bg-background">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="heading-section">
            Discover <span className="italic-accent">Our Bestsellers</span>
          </h2>
          <p className="text-body text-muted-foreground mt-4 max-w-xl mx-auto">
            Explore our most loved fragrances, crafted with the finest ingredients
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-background shadow-elevated rounded-full hover:bg-muted transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-background shadow-elevated rounded-full hover:bg-muted transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Special Offer */}
        <div className="mt-12 text-center">
          <a href="#shop" className="btn-primary inline-block">
            Buy 2 @ ₹999
          </a>
        </div>
      </div>
    </section>
  );
};

export default BestsellersSection;
