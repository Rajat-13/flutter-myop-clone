import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { allProducts } from "@/data/products";

const winterPicks = [
  {
    name: "BLUE",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80",
    gradient: "from-sky-200 to-blue-300",
    slug: "sandal-veer",
  },
  {
    name: "CRYSTAL",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80",
    gradient: "from-pink-200 to-rose-300",
    slug: "flora-bliss",
  },
  {
    name: "BOMB",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
    gradient: "from-pink-300 to-fuchsia-200",
    slug: "midnight-rose",
  },
  {
    name: "IBIZA",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
    gradient: "from-teal-300 to-cyan-400",
    slug: "ocean-breeze",
  },
];

const WinterPicksSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const featuredProducts = allProducts.slice(0, 4);

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
    <section className="section-padding bg-background">
      <div className="container-wide">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Featured Picks Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              {winterPicks.map((pick, index) => (
                <Link
                  key={index}
                  to={`/products/${pick.slug}`}
                  className="group relative aspect-square rounded-2xl overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${pick.gradient}`} />
                  <img
                    src={pick.image}
                    alt={pick.name}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-wider drop-shadow-lg">
                      {pick.name}
                    </h3>
                  </div>
                  {/* Interactive dot */}
                  <div className="absolute top-4 right-4 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                    <div className="w-2 h-2 bg-charcoal rounded-full" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right - Carousel */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-charcoal">
                EXPLORE
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-primary">
                OUR WINTER<br />PICKS
              </h3>
            </div>

            <div className="relative">
              <div
                ref={scrollRef}
                className="overflow-hidden"
              >
                <div className="flex transition-transform duration-300">
                  {featuredProducts.map((product, index) => (
                    <Link
                      key={index}
                      to={`/products/${product.slug}`}
                      className="flex-shrink-0 w-full group"
                    >
                      <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-teal-100 to-teal-200 mb-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-charcoal">{product.name}</h4>
                          <p className="text-sm text-primary">
                            or ₹{Math.round(product.price / 3)}/Month{" "}
                            <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">
                              Buy on EMI
                            </span>
                          </p>
                        </div>
                        <p className="font-medium text-charcoal">
                          From Rs. {product.price.toLocaleString()}.00
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {featuredProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (scrollRef.current) {
                        const width = scrollRef.current.offsetWidth;
                        scrollRef.current.scrollTo({
                          left: width * index,
                          behavior: "smooth",
                        });
                      }
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === 0 ? "bg-charcoal" : "bg-charcoal/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WinterPicksSection;
