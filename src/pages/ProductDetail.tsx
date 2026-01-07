import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Minus, Plus, Heart, Share2, Truck, RotateCcw, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarqueeBanner from "@/components/MarqueeBanner";

// Sample product data - in real app this would come from API
const products: Record<string, {
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  notes: { top: string[]; middle: string[]; base: string[] };
  images: string[];
  sizes: { ml: number; price: number }[];
  tag?: string;
}> = {
  "sandal-veer": {
    name: "Sandal Veer",
    price: 799,
    originalPrice: 999,
    description: "A bold and sophisticated fragrance that captures the essence of timeless elegance. Sandal Veer opens with warm sandalwood notes, complemented by subtle hints of musk and amber.",
    notes: {
      top: ["Bergamot", "Pink Pepper"],
      middle: ["Sandalwood", "Oud"],
      base: ["Musk", "Amber", "Vanilla"]
    },
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: [
      { ml: 10, price: 299 },
      { ml: 50, price: 799 },
      { ml: 100, price: 1299 },
    ],
    tag: "Bestseller"
  },
  "flora-bliss": {
    name: "Flora Bliss",
    price: 899,
    description: "A delicate floral symphony that evokes blooming gardens at dawn. Fresh, feminine, and utterly captivating.",
    notes: {
      top: ["Rose", "Jasmine"],
      middle: ["Peony", "Lily"],
      base: ["White Musk", "Cedarwood"]
    },
    images: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: [
      { ml: 10, price: 349 },
      { ml: 50, price: 899 },
      { ml: 100, price: 1499 },
    ],
  }
};

const ProductDetail = () => {
  const { slug } = useParams();
  const product = products[slug || "sandal-veer"] || products["sandal-veer"];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[1]);
  const [quantity, setQuantity] = useState(1);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <MarqueeBanner />
      <Header />
      
      <main className="pt-8 pb-16">
        <div className="container-wide">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
              <li>/</li>
              <li><Link to="/#bestsellers" className="hover:text-foreground transition-colors">Perfumes</Link></li>
              <li>/</li>
              <li className="text-foreground">{product.name}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden bg-muted rounded-sm">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.tag && (
                  <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs uppercase tracking-wider px-3 py-1.5">
                    {product.tag}
                  </span>
                )}
                
                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 overflow-hidden rounded-sm border-2 transition-colors ${
                      index === currentImageIndex ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-semibold">₹{selectedSize.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{Math.round(selectedSize.price * (product.originalPrice / product.price))}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Fragrance Notes */}
              <div className="space-y-3 py-4 border-y border-border">
                <h3 className="font-medium uppercase tracking-wider text-sm">Fragrance Notes</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block mb-1">Top</span>
                    <span>{product.notes.top.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Middle</span>
                    <span>{product.notes.middle.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Base</span>
                    <span>{product.notes.base.join(", ")}</span>
                  </div>
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <h3 className="font-medium uppercase tracking-wider text-sm">Size</h3>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size.ml}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-3 border rounded-sm transition-all ${
                        selectedSize.ml === size.ml
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      <span className="block font-medium">{size.ml}ml</span>
                      <span className="text-xs opacity-80">₹{size.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <h3 className="font-medium uppercase tracking-wider text-sm">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-muted transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-muted transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button className="flex-1 btn-primary py-4 text-sm uppercase tracking-wider font-semibold">
                  Add to Cart
                </button>
                <button className="w-14 h-14 flex items-center justify-center border border-border rounded-sm hover:border-primary hover:text-primary transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-14 h-14 flex items-center justify-center border border-border rounded-sm hover:border-primary hover:text-primary transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <span className="text-xs uppercase tracking-wider">Free Shipping</span>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <span className="text-xs uppercase tracking-wider">Easy Returns</span>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <span className="text-xs uppercase tracking-wider">100% Authentic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
