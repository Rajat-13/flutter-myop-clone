import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { SlidersHorizontal, ChevronDown, X, Heart, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustBadges from "@/components/TrustBadges";
import { allProducts as staticProducts, categories, genderOptions, Product } from "@/data/products";
import { useWishlist } from "@/context/WishlistContext";
import { adminAPI, Fragrance } from "@/lib/api";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortOption = "featured" | "price-low" | "price-high" | "newest" | "bestseller";
type ViewSection = "all" | "by-type" | "by-gender" | "bestseller" | "recently-viewed";

// Convert fragrance from API to Product format for display
const fragranceToProduct = (fragrance: Fragrance): Product => ({
  id: `fragrance-${fragrance.id}`,
  name: fragrance.name,
  slug: `fragrance-${fragrance.sku.toLowerCase()}`,
  price: fragrance.final_price || fragrance.price,
  originalPrice: fragrance.discount > 0 ? fragrance.price : undefined,
  image: fragrance.cover_image || (fragrance.images?.[0]?.image) || "/placeholder.svg",
  images: fragrance.images?.map(img => img.image) || [],
  category: fragrance.concentration || "perfume",
  gender: "unisex",
  tag: fragrance.status === 'active' && fragrance.watching_count > 10 ? "Bestseller" : undefined,
  notes: {
    top: [],
    middle: [],
    base: [],
  },
  description: fragrance.description || fragrance.short_description || "",
  occasion: "Everyday",
  concentration: {
    sillage: 3,
    projection: 3,
    longevity: 4,
  },
});

const AllProducts = () => {
  const { toggleItem, isInWishlist } = useWishlist();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // API state
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Get initial gender from URL params or location state
  const genderFromUrl = searchParams.get('gender');
  const categoryFromUrl = searchParams.get('category');
  const genderFromState = (location.state as { selectedGender?: string })?.selectedGender;
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryFromUrl);
  const [selectedGender, setSelectedGender] = useState<string | null>(genderFromUrl || genderFromState || null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [viewSection, setViewSection] = useState<ViewSection>(
    genderFromUrl || genderFromState ? "by-gender" : categoryFromUrl ? "by-type" : "all"
  );
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch fragrances from API
  useEffect(() => {
    const fetchFragrances = async () => {
      try {
        setIsLoading(true);
        setApiError(null);
        const response = await adminAPI.fragrances.list({ status: 'active' });
        const convertedProducts = response.results.map(fragranceToProduct);
        setApiProducts(convertedProducts);
      } catch (error) {
        console.error('Failed to fetch fragrances:', error);
        setApiError('Failed to load products from server. Showing cached products.');
        // Fall back to static products
        setApiProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFragrances();
  }, []);

  // Load recently viewed from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("recentlyViewed");
    if (stored) {
      setRecentlyViewed(JSON.parse(stored));
    }
  }, []);
  
  // Update filters when URL params change
  useEffect(() => {
    if (genderFromUrl) {
      setSelectedGender(genderFromUrl);
      setViewSection("by-gender");
    }
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      setViewSection("by-type");
    }
  }, [genderFromUrl, categoryFromUrl]);

  // Combine API products with static products (API products take priority)
  const allProducts = useMemo(() => {
    if (apiProducts.length > 0) {
      return [...apiProducts, ...staticProducts];
    }
    return staticProducts;
  }, [apiProducts]);

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    // Section filters
    if (viewSection === "bestseller") {
      products = products.filter((p) => p.tag === "Bestseller" || p.tag === "Premium");
    } else if (viewSection === "recently-viewed") {
      products = products.filter((p) => recentlyViewed.includes(p.id));
    } else if (viewSection === "by-type" && selectedCategory) {
      products = products.filter((p) => p.category === selectedCategory);
    } else if (viewSection === "by-gender" && selectedGender) {
      products = products.filter((p) => p.gender === selectedGender);
    }

    // Additional filters
    if (selectedCategory && viewSection !== "by-type") {
      products = products.filter((p) => p.category === selectedCategory);
    }
    if (selectedGender && viewSection !== "by-gender") {
      products = products.filter((p) => p.gender === selectedGender);
    }
    products = products.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case "price-low":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        products.sort((a, b) => b.price - a.price);
        break;
      case "bestseller":
        products.sort((a, b) => (b.tag === "Bestseller" ? 1 : 0) - (a.tag === "Bestseller" ? 1 : 0));
        break;
      default:
        break;
    }

    return products;
  }, [selectedCategory, selectedGender, priceRange, sortBy, viewSection, recentlyViewed, allProducts]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedGender(null);
    setPriceRange([0, 2000]);
    setSortBy("featured");
  };

  const hasActiveFilters = selectedCategory || selectedGender || priceRange[0] > 0 || priceRange[1] < 2000;

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "bestseller", label: "Best Selling" },
    { value: "newest", label: "Newest First" },
  ];

  const ProductGridItem = ({ product }: { product: Product }) => {
    const isWishlisted = isInWishlist(product.id);

    return (
      <div className="group relative">
        <Link to={`/products/${product.slug}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.tag && (
              <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs uppercase tracking-wider px-3 py-1">
                {product.tag}
              </span>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  originalPrice: product.originalPrice,
                  image: product.image,
                  slug: product.slug,
                });
              }}
              className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                isWishlisted
                  ? "bg-red-500 text-white"
                  : "bg-white/90 text-foreground hover:bg-white hover:text-red-500"
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
            </button>
          </div>
          <div className="p-4 text-center">
            <h3 className="font-serif text-lg font-medium mb-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center justify-center gap-3">
              <span className="text-lg font-medium">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-muted-foreground line-through text-sm">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container-wide px-4 py-8">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading products...</span>
            </div>
          )}

          {/* Error State */}
          {apiError && (
            <div className="text-center py-4 mb-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-700 text-sm">{apiError}</p>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
              Store
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our complete collection of handcrafted fragrances
            </p>
          </div>

          {/* Section Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: "all", label: "All" },
              { id: "by-type", label: "By Type" },
              { id: "by-gender", label: "By Gender" },
              { id: "bestseller", label: "Bestsellers" },
              { id: "recently-viewed", label: "Recently Viewed" },
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setViewSection(section.id as ViewSection)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  viewSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Category/Gender Pills for By Type/By Gender views */}
          {viewSection === "by-type" && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className={`px-4 py-2 text-sm rounded-full border transition-all ${
                    selectedCategory === cat.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {viewSection === "by-gender" && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {genderOptions.map((gender) => (
                <button
                  key={gender.id}
                  onClick={() => setSelectedGender(selectedGender === gender.id ? null : gender.id)}
                  className={`px-4 py-2 text-sm rounded-full border transition-all ${
                    selectedGender === gender.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {gender.name}
                </button>
              ))}
            </div>
          )}

          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-4">
              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <button className="md:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-lg">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Category Filter */}
                    <div>
                      <h4 className="font-medium mb-3">Category</h4>
                      <div className="space-y-2">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                            }}
                            className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                              selectedCategory === cat.id
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted"
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Gender Filter */}
                    <div>
                      <h4 className="font-medium mb-3">Gender</h4>
                      <div className="space-y-2">
                        {genderOptions.map((gender) => (
                          <button
                            key={gender.id}
                            onClick={() => {
                              setSelectedGender(selectedGender === gender.id ? null : gender.id);
                            }}
                            className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                              selectedGender === gender.id
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted"
                            }`}
                          >
                            {gender.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <h4 className="font-medium mb-3">Price Range</h4>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          className="w-full px-3 py-2 border border-border rounded text-sm"
                          placeholder="Min"
                        />
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="w-full px-3 py-2 border border-border rounded text-sm"
                          placeholder="Max"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        clearFilters();
                        setIsFilterOpen(false);
                      }}
                      className="w-full btn-primary"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop Filters */}
              <div className="hidden md:flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:border-primary transition-colors">
                    Category
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {categories.map((cat) => (
                      <DropdownMenuItem
                        key={cat.id}
                        onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                        className={selectedCategory === cat.id ? "bg-primary/10" : ""}
                      >
                        {cat.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:border-primary transition-colors">
                    Gender
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {genderOptions.map((gender) => (
                      <DropdownMenuItem
                        key={gender.id}
                        onClick={() => setSelectedGender(selectedGender === gender.id ? null : gender.id)}
                        className={selectedGender === gender.id ? "bg-primary/10" : ""}
                      >
                        {gender.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>

              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} products
              </span>
            </div>

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:border-primary transition-colors">
                Sort: {sortOptions.find((s) => s.value === sortBy)?.label}
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={sortBy === option.value ? "bg-primary/10" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory(null)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedGender && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  {genderOptions.find((g) => g.id === selectedGender)?.name}
                  <button onClick={() => setSelectedGender(null)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductGridItem key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No products found matching your criteria</p>
              <button onClick={clearFilters} className="btn-primary">
                Clear Filters
              </button>
            </div>
          )}
        </div>
        <TrustBadges />
      </main>
      <Footer />
    </div>
  );
};

export default AllProducts;
