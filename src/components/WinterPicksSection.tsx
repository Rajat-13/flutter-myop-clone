import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { allProducts } from "@/data/products";

const winterPicks = [
  {
    name: "BLUE",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80",
    gradient: "from-sky-200 to-blue-300",
    slug: "sandal-veer",
  },
  {
    name: "CRYSTAL",
    image:
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80",
    gradient: "from-pink-200 to-rose-300",
    slug: "flora-bliss",
  },
  {
    name: "BOMB",
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
    gradient: "from-pink-300 to-fuchsia-200",
    slug: "midnight-rose",
  },
  {
    name: "IBIZA",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
    gradient: "from-teal-300 to-cyan-400",
    slug: "ocean-breeze",
  },
];

const AUTO_SCROLL_DELAY = 3000;

const WinterPicksSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);

  const featuredProducts = allProducts.slice(0, 4);
  const [activeIndex, setActiveIndex] = useState(0);

  // 🔁 Auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrollRef.current || isHovered.current) return;

      const container = scrollRef.current;
      const width = container.offsetWidth;
      const maxIndex = featuredProducts.length - 1;

      setActiveIndex((prev) => {
        const next = prev === maxIndex ? 0 : prev + 1;
        container.scrollTo({
          left: width * next,
          behavior: "smooth",
        });
        return next;
      });
    }, AUTO_SCROLL_DELAY);

    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  const manualScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const width = scrollRef.current.offsetWidth;
    const maxIndex = featuredProducts.length - 1;

    setActiveIndex((prev) => {
      const next =
        direction === "left"
          ? prev === 0
            ? maxIndex
            : prev - 1
          : prev === maxIndex
          ? 0
          : prev + 1;

      scrollRef.current!.scrollTo({
        left: width * next,
        behavior: "smooth",
      });

      return next;
    });
  };

  return (
    <section className="section-padding bg-background">
      <div className="container-wide">
        {/* Mobile Title */}
        <div className="lg:hidden mb-6 text-center">
          <h2 className="text-xl font-bold text-charcoal">EXPLORE</h2>
          <h3 className="text-2xl font-bold text-primary">
            OUR WINTER PICKS
          </h3>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Grid */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {winterPicks.map((pick, index) => (
                <Link
                  key={index}
                  to={`/products/${pick.slug}`}
                  className="group relative aspect-square rounded-xl md:rounded-2xl overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${pick.gradient}`}
                  />
                  <img
                    src={pick.image}
                    alt={pick.name}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="font-serif text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wider">
                      {pick.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Carousel */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            {/* Desktop Title */}
            <div className="hidden lg:block mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-charcoal">
                EXPLORE
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-primary">
                OUR WINTER
                <br />
                PICKS
              </h3>
            </div>

            <div className="relative">
              {/* Slider */}
              <div
                ref={scrollRef}
                className="overflow-hidden"
                onMouseEnter={() => (isHovered.current = true)}
                onMouseLeave={() => (isHovered.current = false)}
              >
                <div className="flex snap-x snap-mandatory">
                  {featuredProducts.map((product, index) => (
                    <Link
                      key={index}
                      to={`/products/${product.slug}`}
                      className="flex-shrink-0 w-full snap-center group"
                    >
                      <div className="aspect-square rounded-xl md:rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-teal-100 to-teal-200">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-charcoal">
                            {product.name}
                          </h4>
                          <p className="text-sm text-primary">
                            or ₹{Math.round(product.price / 3)}/Month{" "}
                            <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">
                              EMI
                            </span>
                          </p>
                        </div>
                        <p className="font-medium">
                          ₹{product.price.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Arrows */}
              <div className="flex justify-center gap-6 mt-4">
                <button onClick={() => manualScroll("left")}>
                  <ChevronLeft />
                </button>
                <button onClick={() => manualScroll("right")}>
                  <ChevronRight />
                </button>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-4">
                {featuredProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!scrollRef.current) return;
                      const width = scrollRef.current.offsetWidth;
                      scrollRef.current.scrollTo({
                        left: width * index,
                        behavior: "smooth",
                      });
                      setActiveIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === activeIndex
                        ? "bg-charcoal"
                        : "bg-charcoal/30"
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
