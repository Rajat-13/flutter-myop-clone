import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Minus, Plus, Share2, Eye, ChevronDown, ChevronUp, Star, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarqueeBanner from "@/components/MarqueeBanner";
import TrustBadges from "@/components/TrustBadges";
import ReviewDialog from "@/components/ReviewDialog";
import CustomerAlsoLove from "@/components/CustomerAlsoLove";
import { useCart } from "@/context/CartContext";
import intensityImg from "@/assets/intensity-reference.webp";
import personalityImg from "@/assets/personality-reference.webp";
import concentrationImg from "@/assets/concentration-comparison.jpg";

// Sample product data - in real app this would come from API/ViewModel
const products: Record<string, {
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  notes: { top: string[]; middle: string[]; base: string[] };
  images: string[];
  sizes: { ml: number; price: number; label: string }[];
  tag?: string;
  gender: "for-him" | "for-her" | "unisex";
  occasion: string;
  concentration: { sillage: number; projection: number; longevity: number };
  viewersCount: number;
}> = {
  "sandal-veer": {
    name: "Sandal Veer",
    price: 599,
    originalPrice: 899,
    description: "A bold and sophisticated fragrance that captures the essence of timeless elegance.",
    notes: {
      top: ["Grapefruit", "Cardamom", "Pepper"],
      middle: ["Orris", "Sandalwood", "Cinnamon"],
      base: ["Musk", "Dry Amber", "Akigalawood"]
    },
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: [
      { ml: 8, price: 599, label: "8ml" },
      { ml: 50, price: 1129, label: "50ml" },
      { ml: 100, price: 1999, label: "100ml" },
    ],
    tag: "Bestseller",
    gender: "for-him",
    occasion: "All Day",
    concentration: { sillage: 85, projection: 75, longevity: 90 },
    viewersCount: 15
  },
  "flora-bliss": {
    name: "Flora Bliss",
    price: 499,
    description: "A delicate floral symphony that evokes blooming gardens at dawn.",
    notes: {
      top: ["Rose", "Jasmine", "Bergamot"],
      middle: ["Peony", "Lily", "Violet"],
      base: ["White Musk", "Cedarwood", "Vanilla"]
    },
    images: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: [
      { ml: 8, price: 499, label: "8ml" },
      { ml: 50, price: 899, label: "50ml" },
      { ml: 100, price: 1499, label: "100ml" },
    ],
    gender: "for-her",
    occasion: "Evening",
    concentration: { sillage: 70, projection: 80, longevity: 85 },
    viewersCount: 12
  }
};

const ProductDetail = () => {
  const { slug } = useParams();
  const product = products[slug || "sandal-veer"] || products["sandal-veer"];
  const { addItem, setIsCartOpen, setIsCheckoutOpen } = useCart();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    intensity: false, // Minimized by default
    notes: false,
    personality: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAddToCart = () => {
    addItem({
      id: slug || "sandal-veer",
      name: product.name,
      size: selectedSize.label,
      price: selectedSize.price,
      quantity,
      image: product.images[0],
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addItem({
      id: slug || "sandal-veer",
      name: product.name,
      size: selectedSize.label,
      price: selectedSize.price,
      quantity,
      image: product.images[0],
    });
    setIsCheckoutOpen(true);
  };

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
      
      <main className="pt-4 pb-16">
        <div className="container-wide">
          {/* Breadcrumb */}
          <nav className="mb-6 px-4 lg:px-8">
            <ol className="flex items-center gap-2 text-xs text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground transition-colors">Collections</Link></li>
              <li className="text-muted-foreground">&gt;</li>
              <li><Link to="/#bestsellers" className="hover:text-foreground transition-colors">Best Sellers</Link></li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 px-4 lg:px-8">
            {/* Image Gallery - Left Side */}
            <div className="space-y-3">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden bg-cream rounded-lg">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-md"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-md"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-charcoal" : "bg-charcoal/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 overflow-hidden rounded-md border-2 transition-colors ${
                      index === currentImageIndex ? "border-charcoal" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info - Right Side */}
            <div className="lg:pr-8">
              {/* Product Title */}
              <h1 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= 4 ? "fill-amber-400 text-amber-400" : "fill-amber-400/50 text-amber-400/50"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(4.5) 128 reviews</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-semibold text-charcoal">Rs. {selectedSize.price.toLocaleString()}.00</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">Rs. {product.originalPrice.toLocaleString()}.00</span>
                )}
              </div>

              {/* Viewers Count */}
              <div className="flex items-center gap-2 text-sm text-charcoal mb-6 bg-muted/50 px-4 py-2 rounded-full w-fit">
                <Eye className="w-4 h-4 text-primary" />
                <span className="font-medium">{product.viewersCount} People</span>
                <span className="text-muted-foreground">are viewing right now.</span>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-charcoal uppercase tracking-wide">Size</span>
                  <span className="text-sm text-muted-foreground">: {selectedSize.label}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 text-sm font-medium rounded-md border-2 transition-all ${
                        selectedSize.label === size.label
                          ? "border-charcoal bg-charcoal text-white"
                          : "border-border bg-white text-charcoal hover:border-charcoal"
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity Section - Accordion (Minimized by default) */}
              <div className="border-t border-border">
                <button
                  onClick={() => toggleSection("intensity")}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="text-sm font-medium text-charcoal uppercase tracking-wide">Intensity</span>
                  {expandedSections.intensity ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                {expandedSections.intensity && (
                  <div className="pb-4">
                    <img 
                      src={intensityImg} 
                      alt="Perfume Intensity Levels" 
                      className="w-full max-w-md rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Notes & Composition Section - Accordion */}
              <div className="border-t border-border">
                <button
                  onClick={() => toggleSection("notes")}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="text-sm font-medium text-charcoal uppercase tracking-wide">Notes & Composition</span>
                  {expandedSections.notes ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                {expandedSections.notes && (
                  <div className="pb-6">
                    <h3 className="font-serif text-xl font-medium text-charcoal mb-6">Notes</h3>
                    
                    <div className="space-y-4">
                      {/* Top Notes */}
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-2">
                          Top Notes
                        </h4>
                        <p className="text-muted-foreground">
                          {product.notes.top.join(", ")}
                        </p>
                      </div>

                      {/* Middle Notes */}
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-2">
                          Middle Notes
                        </h4>
                        <p className="text-muted-foreground">
                          {product.notes.middle.join(", ")}
                        </p>
                      </div>

                      {/* Base Notes */}
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-2">
                          Base Notes
                        </h4>
                        <p className="text-muted-foreground">
                          {product.notes.base.join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Personality Section - Accordion */}
              <div className="border-t border-border">
                <button
                  onClick={() => toggleSection("personality")}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="text-sm font-medium text-charcoal uppercase tracking-wide">Personality</span>
                  {expandedSections.personality ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                {expandedSections.personality && (
                  <div className="pb-4">
                    <img 
                      src={personalityImg} 
                      alt="Perfume Personality" 
                      className="w-full max-w-md rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div className="border-t border-border py-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-charcoal uppercase tracking-wide">Quantity</span>
                  <div className="flex items-center border border-border rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2.5 hover:bg-muted transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-5 py-2.5 text-sm font-medium min-w-[50px] text-center border-x border-border">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2.5 hover:bg-muted transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 py-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-charcoal text-white py-4 text-sm font-medium uppercase tracking-wider hover:bg-charcoal/90 transition-colors rounded-md"
                >
                  Add to cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-primary text-white py-4 text-sm font-medium uppercase tracking-wider hover:bg-primary/90 transition-colors rounded-md"
                >
                  Buy it now
                </button>
              </div>

              {/* Share Section */}
              <div className="flex items-center gap-3 py-4 border-t border-border">
                <span className="text-sm text-muted-foreground">Share:</span>
                <div className="flex gap-2">
                  <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-90 transition-opacity">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#E60023] text-white hover:opacity-90 transition-opacity">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                    </svg>
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#25D366] text-white hover:opacity-90 transition-opacity">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center rounded-full bg-muted text-charcoal hover:bg-muted/80 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Concentration Comparison Section */}
          <div className="mt-16 px-4 lg:px-8">
            <div className="border-t border-border pt-12">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal text-center mb-4">
                Why Choose RIMAÉ?
              </h2>
              <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-8">
                Our perfumes contain 35-40% oil concentration — the highest in the industry. 
                Here's how we compare to other fragrance types:
              </p>
              
              <div className="max-w-4xl mx-auto">
                <img 
                  src={concentrationImg} 
                  alt="Perfume Concentration Comparison - EDT, EDP, Extrait de Parfum vs RIMAÉ" 
                  className="w-full rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-5xl mx-auto">
                <div className="text-center p-4 border border-border rounded-xl bg-white">
                  <h3 className="font-semibold text-charcoal mb-2">Eau de Cologne</h3>
                  <p className="text-2xl font-bold text-muted-foreground mb-1">2-4%</p>
                  <p className="text-sm text-muted-foreground">Oil Concentration</p>
                  <p className="text-xs text-muted-foreground mt-2">Lasts 2-3 hours</p>
                </div>
                <div className="text-center p-4 border border-border rounded-xl bg-white">
                  <h3 className="font-semibold text-charcoal mb-2">Eau de Toilette</h3>
                  <p className="text-2xl font-bold text-muted-foreground mb-1">5-15%</p>
                  <p className="text-sm text-muted-foreground">Oil Concentration</p>
                  <p className="text-xs text-muted-foreground mt-2">Lasts 3-5 hours</p>
                </div>
                <div className="text-center p-4 border border-border rounded-xl bg-white">
                  <h3 className="font-semibold text-charcoal mb-2">Eau de Parfum</h3>
                  <p className="text-2xl font-bold text-muted-foreground mb-1">15-20%</p>
                  <p className="text-sm text-muted-foreground">Oil Concentration</p>
                  <p className="text-xs text-muted-foreground mt-2">Lasts 5-8 hours</p>
                </div>
                <div className="text-center p-4 border-2 border-primary rounded-xl bg-primary/5">
                  <h3 className="font-semibold text-primary mb-2">RIMAÉ</h3>
                  <p className="text-2xl font-bold text-primary mb-1">35-40%</p>
                  <p className="text-sm text-charcoal">Oil Concentration</p>
                  <p className="text-xs text-charcoal mt-2">Lasts 12-24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Also Love Section */}
          <div className="mt-16 px-4 lg:px-8">
            <CustomerAlsoLove currentProductSlug={slug} />
          </div>

          {/* Customer Reviews Section */}
          <div className="mt-16 px-4 lg:px-8">
            <div className="border-t border-border pt-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-2">
                    Customer Reviews
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${star <= 4 ? "fill-amber-400 text-amber-400" : "fill-amber-400/50 text-amber-400/50"}`}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground">Based on 128 reviews</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsReviewDialogOpen(true)}
                  className="px-6 py-3 border-2 border-charcoal text-charcoal text-sm font-medium uppercase tracking-wider hover:bg-charcoal hover:text-white transition-colors rounded-md"
                >
                  Write a Review
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {[
                  {
                    name: "Rahul S.",
                    rating: 5,
                    date: "2 weeks ago",
                    title: "Amazing longevity!",
                    review: "This fragrance lasts all day long. I get compliments everywhere I go. The sandalwood notes are perfectly balanced. Worth every penny!"
                  },
                  {
                    name: "Priya M.",
                    rating: 5,
                    date: "1 month ago",
                    title: "Best perfume I've ever used",
                    review: "The concentration is incredible - just 2 sprays last the entire day. The projection is amazing and it smells so luxurious. Highly recommend!"
                  },
                  {
                    name: "Amit K.",
                    rating: 4,
                    date: "1 month ago",
                    title: "Great quality, unique scent",
                    review: "Very unique fragrance profile. The oil concentration is noticeably higher than other brands. Sillage is excellent. Will definitely repurchase."
                  }
                ].map((review, index) => (
                  <div key={index} className="border-b border-border pb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <div>
                            <span className="font-medium text-charcoal">{review.name}</span>
                            <span className="text-muted-foreground text-sm ml-2">• {review.date}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${star <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <h4 className="font-medium text-charcoal mb-1">{review.title}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{review.review}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Reviews */}
              <div className="text-center mt-8">
                <button className="text-sm font-medium text-charcoal underline hover:no-underline">
                  Load More Reviews
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <TrustBadges />
      <Footer />

      {/* Review Dialog */}
      <ReviewDialog
        isOpen={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
        productName={product.name}
      />
    </div>
  );
};

export default ProductDetail;
