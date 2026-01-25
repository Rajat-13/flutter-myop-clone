import { createContext, useContext, useState, ReactNode, useMemo } from "react";

export interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CartItemWithDiscount extends CartItem {
  isFree: boolean;
  freeQuantity: number;
  paidQuantity: number;
}

export interface DiscountInfo {
  totalOriginal: number;
  totalDiscount: number;
  totalPayable: number;
  discountPercentage: number;
  freeItemsCount: number;
}

interface CartContextType {
  items: CartItem[];
  itemsWithDiscount: CartItemWithDiscount[];
  discountInfo: DiscountInfo;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Calculate Buy 2 Get 2 Free discount
// For every 4 items, 2 highest priced are charged, 2 lowest are free
// For 3 items: 2 paid, 1 free
// For 6 items: 4 paid, 2 free
// For 7 items: 5 paid, 2 free (ceil for odd totals)
function calculateDiscount(items: CartItem[]): {
  itemsWithDiscount: CartItemWithDiscount[];
  discountInfo: DiscountInfo;
} {
  // Flatten items by quantity to get individual units with their source
  const flatItems: { item: CartItem; unitIndex: number }[] = [];
  items.forEach((item) => {
    for (let i = 0; i < item.quantity; i++) {
      flatItems.push({ item, unitIndex: i });
    }
  });

  const totalItems = flatItems.length;
  
  // Calculate free items: for every 2 paid, get 2 free (only if 3+ items)
  // So for N items: free = floor(N / 2) but max free = N - ceil(N/2)
  // Simplified: if N >= 3, free = floor(N / 2)
  let freeItemsCount = 0;
  if (totalItems >= 3) {
    freeItemsCount = Math.floor(totalItems / 2);
  }

  // Sort by price descending - highest prices get charged first
  const sortedFlat = [...flatItems].sort((a, b) => b.item.price - a.item.price);
  
  // Mark which units are free (the lowest priced ones)
  const freeIndices = new Set<number>();
  for (let i = sortedFlat.length - 1; i >= sortedFlat.length - freeItemsCount && i >= 0; i--) {
    freeIndices.add(i);
  }

  // Build a map of item key -> { paidQty, freeQty }
  const itemDiscountMap = new Map<string, { paidQty: number; freeQty: number }>();
  
  sortedFlat.forEach((entry, sortedIndex) => {
    const key = `${entry.item.id}-${entry.item.size}`;
    if (!itemDiscountMap.has(key)) {
      itemDiscountMap.set(key, { paidQty: 0, freeQty: 0 });
    }
    const data = itemDiscountMap.get(key)!;
    if (freeIndices.has(sortedIndex)) {
      data.freeQty++;
    } else {
      data.paidQty++;
    }
  });

  // Create items with discount info
  const itemsWithDiscount: CartItemWithDiscount[] = items.map((item) => {
    const key = `${item.id}-${item.size}`;
    const discountData = itemDiscountMap.get(key) || { paidQty: item.quantity, freeQty: 0 };
    return {
      ...item,
      isFree: discountData.freeQty > 0,
      freeQuantity: discountData.freeQty,
      paidQuantity: discountData.paidQty,
    };
  });

  // Calculate totals
  const totalOriginal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiscount = itemsWithDiscount.reduce((sum, item) => sum + item.price * item.freeQuantity, 0);
  const totalPayable = totalOriginal - totalDiscount;
  const discountPercentage = totalOriginal > 0 ? Math.round((totalDiscount / totalOriginal) * 100) : 0;

  return {
    itemsWithDiscount,
    discountInfo: {
      totalOriginal,
      totalDiscount,
      totalPayable,
      discountPercentage,
      freeItemsCount,
    },
  };
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.size === item.size);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  };

  const updateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id, size);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.size === size ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const { itemsWithDiscount, discountInfo } = useMemo(
    () => calculateDiscount(items),
    [items]
  );

  const total = discountInfo.totalPayable;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemsWithDiscount,
        discountInfo,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
