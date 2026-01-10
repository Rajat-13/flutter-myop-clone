import { useState } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const popularSearches = [
  "Vanilla perfume",
  "Oud collection",
  "Floral fragrances",
  "Gift sets",
  "Men's cologne",
  "Summer scents",
];

const trendingProducts = [
  {
    id: 1,
    name: "Midnight Oud",
    price: 1999,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Rose Garden",
    price: 1499,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Ocean Breeze",
    price: 1299,
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=100&h=100&fit=crop",
  },
];

const SearchDrawer = ({ open, onOpenChange }: SearchDrawerProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Add search logic here
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh]">
        <div className="mx-auto w-full max-w-3xl">
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <DrawerTitle className="font-serif text-xl">Search</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                </Button>
              </DrawerClose>
            </div>
            
            {/* Search Input */}
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for perfumes, collections, ingredients..."
                className="pl-10 pr-4 py-6 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </DrawerHeader>
          
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Popular Searches */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Trending Products */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                Trending Now
              </h3>
              <div className="space-y-4">
                {trendingProducts.map((product) => (
                  <a
                    key={product.id}
                    href={`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors group"
                    onClick={() => onOpenChange(false)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">₹{product.price}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SearchDrawer;
