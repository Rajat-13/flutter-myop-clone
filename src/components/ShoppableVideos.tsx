import { useRef } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { allProducts } from "@/data/products";

const shoppableVideos = [
  {
    videoUrl: "https://videos.pexels.com/video-files/8447499/8447499-uhd_1440_2560_25fps.mp4",
    product: allProducts[0],
  },
  {
    videoUrl: "https://videos.pexels.com/video-files/8447499/8447499-uhd_1440_2560_25fps.mp4",
    product: allProducts[1],
  },
  {
    videoUrl: "https://videos.pexels.com/video-files/8447499/8447499-uhd_1440_2560_25fps.mp4",
    product: allProducts[2],
  },
  {
    videoUrl: "https://videos.pexels.com/video-files/8447499/8447499-uhd_1440_2560_25fps.mp4",
    product: allProducts[3],
  },
  {
    videoUrl: "https://videos.pexels.com/video-files/8447499/8447499-uhd_1440_2560_25fps.mp4",
    product: allProducts[4],
  },
];

const ShoppableVideos = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addItem, setIsCartOpen } = useCart();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleAddToCart = (product: typeof allProducts[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      size: "50ml",
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    setIsCartOpen(true);
  };

  return (
    <section className="section-padding bg-background">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-charcoal tracking-wide">
            SHOPPABLE <span className="text-primary">VIDEOS</span>
          </h2>
          <div className="w-24 h-0.5 bg-primary mx-auto mt-3 rounded-full" />
        </div>

        {/* Videos Carousel */}
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-muted transition-colors -translate-x-4"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {shoppableVideos.map((item, index) => (
              <div key={index} className="flex-shrink-0 w-[220px] md:w-[240px]">
                {/* Video Container */}
                <div className="aspect-[9/16] rounded-2xl overflow-hidden mb-3 relative bg-charcoal">
                  <video
                    src={item.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info Card */}
                <div className="bg-white border border-border rounded-lg p-3 flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-charcoal truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-sm font-bold text-charcoal">
                      ₹{item.product.price.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item.product)}
                    className="w-9 h-9 flex items-center justify-center border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-muted transition-colors translate-x-4"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShoppableVideos;
