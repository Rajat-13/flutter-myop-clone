import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Lock, CornerDownLeft, Gift } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const {
    itemsWithDiscount,
    removeItem,
    updateQuantity,
    discountInfo,
    itemCount,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
  } = useCart();
  const navigate = useNavigate();

  const freeShippingThreshold = 1500;
  const progress = Math.min((discountInfo.totalPayable / freeShippingThreshold) * 100, 100);
  const isFreeShipping = discountInfo.totalPayable >= freeShippingThreshold;

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    navigate("/cart");
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <SheetTitle className="font-serif text-2xl tracking-tight">
                CART<sup className="text-sm">{itemCount}</sup>
              </SheetTitle>
              <button className="text-muted-foreground text-lg font-light hover:text-charcoal transition-colors">
                RECENTLY VIEWED
              </button>
            </div>
          </div>
        </SheetHeader>

        {/* Free Shipping Progress */}
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm text-charcoal mb-2">
            {isFreeShipping
              ? "You are eligible for free shipping."
              : `Add ₹${(freeShippingThreshold - discountInfo.totalPayable).toLocaleString()} more for free shipping.`}
          </p>
          <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-charcoal transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Buy 2 Get 2 Free Banner */}
        {itemCount >= 1 && (
          <div className="px-4 py-3 bg-green-50 border-b border-green-200">
            <div className="flex items-center gap-2 text-green-700">
              <Gift className="w-4 h-4" />
              <span className="text-sm font-medium">
                {itemCount < 3 
                  ? `Add ${3 - itemCount} more item${3 - itemCount > 1 ? 's' : ''} to get FREE items!`
                  : `🎉 You got ${discountInfo.freeItemsCount} FREE item${discountInfo.freeItemsCount > 1 ? 's' : ''}!`
                }
              </span>
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {itemsWithDiscount.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Button
                onClick={() => setIsCartOpen(false)}
                className="bg-charcoal text-white hover:bg-charcoal/90"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {itemsWithDiscount.map((item) => (
                <div key={`${item.id}-${item.size}`} className="p-4 flex gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-cream flex-shrink-0 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {item.freeQuantity > 0 && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-1 py-0.5 font-medium">
                        FREE
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-charcoal truncate">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.size}</p>
                    
                    {/* Price breakdown */}
                    <div className="mt-1 space-y-0.5">
                      {item.paidQuantity > 0 && (
                        <p className="text-sm font-medium text-charcoal">
                          {item.paidQuantity} × Rs. {item.price.toLocaleString()}.00
                        </p>
                      )}
                      {item.freeQuantity > 0 && (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <span>{item.freeQuantity} × </span>
                          <span className="line-through text-muted-foreground">Rs. {item.price.toLocaleString()}.00</span>
                          <span className="font-medium">FREE</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center border border-border">
                      <span className="px-3 py-1.5 text-sm min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <div className="flex flex-col border-l border-border">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.quantity + 1)
                          }
                          className="p-1 hover:bg-muted transition-colors"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.quantity - 1)
                          }
                          className="p-1 hover:bg-muted transition-colors border-t border-border"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.size)}
                      className="text-sm text-muted-foreground hover:text-charcoal underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {itemsWithDiscount.length > 0 && (
          <div className="border-t border-border p-4 space-y-4 bg-white">
            {/* Discount Summary */}
            {discountInfo.totalDiscount > 0 && (
              <div className="bg-green-50 p-3 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Original Total</span>
                  <span className="line-through text-muted-foreground">
                    Rs. {discountInfo.totalOriginal.toLocaleString()}.00
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <Gift className="w-4 h-4" />
                    Discount ({discountInfo.discountPercentage}% OFF)
                  </span>
                  <span className="text-green-600 font-medium">
                    - Rs. {discountInfo.totalDiscount.toLocaleString()}.00
                  </span>
                </div>
              </div>
            )}

            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Tax included.{" "}
                  <a href="#" className="underline">
                    Shipping
                  </a>{" "}
                  calculated at checkout.
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">You Pay</p>
                <p className="text-xl font-semibold text-charcoal">
                  Rs. {discountInfo.totalPayable.toLocaleString()}.00
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleCheckout}
                className="flex-1 bg-charcoal text-white hover:bg-charcoal/90 py-6 text-sm font-medium"
              >
                <Lock className="w-4 h-4 mr-2" />
                Check out
              </Button>
              <Button
                onClick={handleViewCart}
                variant="outline"
                className="flex-1 border-charcoal text-charcoal hover:bg-charcoal hover:text-white py-6 text-sm font-medium"
              >
                View cart
              </Button>
            </div>

            {/* Continue Shopping */}
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-charcoal transition-colors"
            >
              <CornerDownLeft className="w-4 h-4" />
              Continue shopping
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
