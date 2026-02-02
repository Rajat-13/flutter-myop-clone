import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

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
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { toggleItem, isInWishlist } = useWishlist();
  
  const slug = product.slug || product.name.toLowerCase().replace(/\s+/g, '-');
  const productId = String(product.id);
  const isWishlisted = isInWishlist(productId);

  // Calculate discount percentage
  const discountPercentage = product.discount 
    ? product.discount 
    : product.originalPrice 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
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

  return (
    <Link 
      to={`/products/${slug}`}
      className="card-product group cursor-pointer min-w-[280px] md:min-w-[300px] block bg-background"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Tag Badge */}
        {product.tag && (
          <span className="absolute top-3 left-3 bg-charcoal text-white text-[10px] uppercase tracking-wider px-3 py-1.5 font-semibold">
            {product.tag}
          </span>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
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
      <div className="p-4 text-center">
        {/* Category */}
        {product.category && (
          <span className="text-[11px] uppercase tracking-widest text-primary font-medium mb-1 block">
            {product.category}
          </span>
        )}
        
        {/* Product Name */}
        <h3 className="font-serif text-base font-medium mb-2 group-hover:text-primary transition-colors text-charcoal truncate">
          {product.name}
        </h3>
        
        {/* Price Section */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="text-base font-semibold text-charcoal">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span className="text-muted-foreground line-through text-sm">
                ₹{product.originalPrice.toLocaleString()}
              </span>
              <span className="text-primary text-sm font-medium">
                {discountPercentage}% Off
              </span>
            </>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <button 
          className="w-full mt-4 py-3 bg-charcoal text-white text-xs uppercase tracking-widest font-semibold hover:bg-charcoal/90 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Could add to cart logic here
          }}
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
