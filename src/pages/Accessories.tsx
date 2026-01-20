import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustBadges from "@/components/TrustBadges";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const accessories = [
  {
    id: 1,
    name: "Perfume Atomizer",
    price: 299,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop",
    description: "Portable travel-sized atomizer for your favorite fragrance"
  },
  {
    id: 2,
    name: "Gift Box Set",
    price: 499,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop",
    description: "Elegant gift box with ribbon and card"
  },
  {
    id: 3,
    name: "Perfume Tray",
    price: 799,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    description: "Luxurious display tray for your collection"
  },
  {
    id: 4,
    name: "Sample Set",
    price: 599,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
    description: "Try 5 of our bestselling fragrances"
  },
  {
    id: 5,
    name: "Travel Pouch",
    price: 349,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    description: "Soft leather pouch for your perfumes"
  },
  {
    id: 6,
    name: "Scent Cards",
    price: 199,
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=400&fit=crop",
    description: "Pack of 10 scented cards"
  },
];

const Accessories = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addItem, setIsCartOpen } = useCart();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleAddToCart = (item: typeof accessories[0]) => {
    addItem({
      id: `accessory-${item.id}`,
      name: item.name,
      size: "1 pc",
      price: item.price,
      quantity: 1,
      image: item.image,
    });
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container-wide px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold">
                Accessories
              </h1>
              <p className="text-muted-foreground max-w-2xl mt-2">
                Complete your fragrance experience with our premium accessories and gift sets.
              </p>
            </div>
            <div className="flex gap-2">
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
          
          <div
            ref={scrollRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 md:flex md:overflow-x-auto md:scrollbar-hide pb-4 md:-mx-4 md:px-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {accessories.map((item) => (
              <Card key={item.id} className="overflow-hidden group md:flex-shrink-0 md:w-[300px]">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">₹{item.price}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <TrustBadges />
      <Footer />
    </div>
  );
};

export default Accessories;
