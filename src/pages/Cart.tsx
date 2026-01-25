import { Link } from "react-router-dom";
import { ChevronUp, ChevronDown, CornerDownLeft, Gift } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarqueeBanner from "@/components/MarqueeBanner";
import CouponInput from "@/components/CouponInput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { itemsWithDiscount, removeItem, updateQuantity, discountInfo, itemCount, setIsCheckoutOpen } = useCart();

  const freeShippingThreshold = 1500;
  const progress = Math.min((discountInfo.totalPayable / freeShippingThreshold) * 100, 100);
  const isFreeShipping = discountInfo.totalPayable >= freeShippingThreshold;

  return (
    <div className="min-h-screen bg-background">
      <MarqueeBanner />
      <Header />

      <main className="pt-8 pb-16">
        <div className="container-wide px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-light italic text-charcoal">
              YOUR CART
            </h1>
            <Link
              to="/"
              className="flex items-center gap-2 px-6 py-3 border border-charcoal rounded-full text-sm font-medium hover:bg-charcoal hover:text-white transition-colors"
            >
              <CornerDownLeft className="w-4 h-4" />
              Continue shopping
            </Link>
          </div>

          {/* Buy 2 Get 2 Free Banner */}
          {itemCount >= 1 && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Gift className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-medium text-green-800">Buy 2 Get 2 FREE!</h3>
                  <p className="text-sm text-green-600">
                    {itemCount < 3 
                      ? `Add ${3 - itemCount} more item${3 - itemCount > 1 ? 's' : ''} to unlock free items!`
                      : `You're getting ${discountInfo.freeItemsCount} item${discountInfo.freeItemsCount > 1 ? 's' : ''} FREE! The lowest priced items are on us.`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {itemsWithDiscount.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-6">Your cart is empty</p>
              <Link to="/">
                <Button className="bg-charcoal text-white hover:bg-charcoal/90">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="divide-y divide-border">
                  {itemsWithDiscount.map((item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="py-6 flex gap-6"
                    >
                      {/* Product Image */}
                      <div className="w-28 h-28 bg-cream flex-shrink-0 overflow-hidden relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {item.freeQuantity > 0 && (
                          <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 font-medium">
                            FREE
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-medium text-charcoal text-lg">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.size}</p>
                        
                        {/* Price breakdown per unit type */}
                        <div className="mt-2 space-y-1">
                          {item.paidQuantity > 0 && (
                            <p className="text-sm font-medium text-charcoal">
                              {item.paidQuantity} × Rs. {item.price.toLocaleString()}.00 = Rs. {(item.paidQuantity * item.price).toLocaleString()}.00
                            </p>
                          )}
                          {item.freeQuantity > 0 && (
                            <p className="text-sm text-green-600 flex items-center gap-2">
                              <span>{item.freeQuantity} × </span>
                              <span className="line-through text-muted-foreground">Rs. {item.price.toLocaleString()}.00</span>
                              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium text-xs">FREE</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-border">
                          <span className="px-4 py-2 text-sm min-w-[50px] text-center">
                            {item.quantity}
                          </span>
                          <div className="flex flex-col border-l border-border">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.size, item.quantity + 1)
                              }
                              className="p-1.5 hover:bg-muted transition-colors"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.size, item.quantity - 1)
                              }
                              className="p-1.5 hover:bg-muted transition-colors border-t border-border"
                            >
                              <ChevronDown className="w-4 h-4" />
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

                      {/* Line Total */}
                      <div className="text-right min-w-[120px]">
                        <p className="font-medium text-charcoal">
                          Rs. {(item.paidQuantity * item.price).toLocaleString()}.00
                        </p>
                        {item.freeQuantity > 0 && (
                          <p className="text-sm text-green-600 font-medium">
                            +{item.freeQuantity} FREE
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-muted/30 p-6 sticky top-24">
                  {/* Free Shipping Progress */}
                  <div className="mb-6">
                    <p className="text-sm text-charcoal mb-2">
                      {isFreeShipping
                        ? "You are eligible for free shipping."
                        : `Add ₹${(freeShippingThreshold - discountInfo.totalPayable).toLocaleString()} more for free shipping.`}
                    </p>
                    <div className="w-full bg-gray-300 h-1 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-charcoal transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Discount Summary */}
                  {discountInfo.totalDiscount > 0 && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-charcoal">Cart Total</span>
                        <span className="line-through text-muted-foreground">
                          Rs. {discountInfo.totalOriginal.toLocaleString()}.00
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-700 font-medium flex items-center gap-1">
                          <Gift className="w-4 h-4" />
                          Buy 2 Get 2 Free
                        </span>
                        <span className="text-green-700 font-medium">
                          - Rs. {discountInfo.totalDiscount.toLocaleString()}.00
                        </span>
                      </div>
                      <div className="pt-2 border-t border-green-200">
                        <div className="flex items-center justify-between">
                          <span className="text-green-800 font-semibold">You Save</span>
                          <span className="text-green-800 font-semibold">
                            {discountInfo.discountPercentage}% ({discountInfo.freeItemsCount} items FREE)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Subtotal */}
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-lg text-muted-foreground">YOU PAY</span>
                    <span className="text-2xl font-semibold text-charcoal">
                      Rs. {discountInfo.totalPayable.toLocaleString()}.00
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6">
                    Tax included.{" "}
                    <a href="#" className="underline">
                      Shipping
                    </a>{" "}
                    calculated at checkout.
                  </p>

                  {/* Coupon Code */}
                  <div className="mb-6">
                    <label className="text-sm text-charcoal font-medium block mb-2">
                      Have a coupon?
                    </label>
                    <CouponInput total={discountInfo.totalPayable} />
                  </div>

                  {/* Order Note */}
                  <div className="mb-6">
                    <label className="text-sm text-charcoal font-medium block mb-2">
                      Add a note to your order
                    </label>
                    <Textarea
                      placeholder="Order note"
                      className="resize-none bg-white"
                      rows={3}
                    />
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full bg-charcoal text-white hover:bg-charcoal/90 py-6 text-sm font-medium uppercase tracking-wider"
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
