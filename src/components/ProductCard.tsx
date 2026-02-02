import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

interface Product {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  tag?: string;
  slug?: string;
  category?: string;
  discount?: number;
  isBestseller?: boolean;
  variants?: string[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { toggleItem, isInWishlist } = useWishlist();
  const { addItem } = useCart();
  
  const slug = product.slug || product.name.toLowerCase().replace(/\s+/g, '-');
  const productId = String(product.id);
  const isWishlisted = isInWishlist(productId);

  // Randomize viewing count (5-15) - stable per product
  const viewingCount = useMemo(() => Math.floor(Math.random() * 11) + 5, []);
  
  // Bought last week count (fixed at 5 as per request)
  const boughtLastWeek = 5;

  // Default variants if not provided
  const variants = product.variants || ["8ml", "50ml", "100ml"];
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);

  // Calculate discount percentage
  const discountPercentage = product.discount 
    ? product.discount 
    : product.originalPrice 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  // Calculate discount amount
  const discountAmount = product.originalPrice 
    ? product.originalPrice - product.price 
    : 0;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      id: productId,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      slug: slug,
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedVariant,
      quantity: 1,
    });
  };

  return (
    <Link 
      to={`/products/${slug}`}
      className="card-product group cursor-pointer min-w-[280px] md:min-w-[300px] block bg-background border border-border/50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Best Seller Tag */}
        {(product.isBestseller || product.tag === "Best Seller") && (
          <span className="absolute top-3 left-3 bg-charcoal text-white text-[10px] uppercase tracking-wider px-3 py-1.5 font-bold shadow-md">
            Best Seller
          </span>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
            isWishlisted 
              ? "bg-red-500 text-white" 
              : "bg-white/90 text-foreground hover:bg-white hover:text-red-500"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 text-center space-y-3">
        {/* Category */}
        {product.category && (
          <span className="text-[11px] uppercase tracking-widest text-primary font-medium block">
            {product.category}
          </span>
        )}
        
        {/* Product Name */}
        <h3 className="font-serif text-base font-medium group-hover:text-primary transition-colors text-charcoal line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Variant Selector */}
        <div className="flex items-center justify-center gap-2">
          {variants.map((variant) => (
            <button
              key={variant}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedVariant(variant);
              }}
              className={`px-2 py-1 text-xs rounded border transition-all duration-200 ${
                selectedVariant === variant
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {variant}
            </button>
          ))}
        </div>
        
        {/* Price Section */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-lg font-semibold text-charcoal">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-muted-foreground line-through text-sm">
                MRP ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {discountPercentage > 0 && (
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-green-600 font-medium">
                {discountPercentage}% Off
              </span>
              <span className="text-green-600">
                (Save ₹{discountAmount.toLocaleString()})
              </span>
            </div>
          )}
        </div>

        {/* Social Proof */}
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-1">
            <ShoppingBag className="w-3 h-3" />
            <span>{boughtLastWeek} people bought last week</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Eye className="w-3 h-3" />
            <span className="text-amber-600 font-medium">{viewingCount} people are viewing it right now</span>
          </div>
        </div>
        
        {/* Shimmer Add to Cart Button */}
        <button 
          className="relative w-full py-3 bg-charcoal text-white text-xs uppercase tracking-widest font-semibold overflow-hidden group/btn rounded-full"
          onClick={handleAddToCart}
        >
          <span className="relative z-10">Add to Cart</span>
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
