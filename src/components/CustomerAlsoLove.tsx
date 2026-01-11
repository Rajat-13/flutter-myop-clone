import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { allProducts, Product } from "@/data/products";

interface CustomerAlsoLoveProps {
  currentProductSlug?: string;
}

const CustomerAlsoLove = ({ currentProductSlug }: CustomerAlsoLoveProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Get related products (exclude current product)
  const relatedProducts = allProducts
    .filter(p => p.slug !== currentProductSlug)
    .slice(0, 8);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal">
          Customers Also Love
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-4 px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {relatedProducts.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-[260px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CustomerAlsoLove;
