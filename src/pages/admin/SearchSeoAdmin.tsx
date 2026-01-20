import { useState } from "react";
import { 
  Search, 
  Globe, 
  Save,
  Plus,
  Trash2,
  GripVertical,
  FileText,
  Image,
  Link as LinkIcon
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface PopularSearch {
  id: number;
  term: string;
  enabled: boolean;
}

interface TrendingProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  slug: string;
  enabled: boolean;
}

interface PageSeo {
  id: string;
  pageName: string;
  path: string;
  title: string;
  description: string;
  ogImage: string;
  keywords: string;
}

const SearchSeoAdmin = () => {
  // Search Settings State
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [searchPlaceholder, setSearchPlaceholder] = useState("Search for perfumes, collections, ingredients...");
  
  const [popularSearches, setPopularSearches] = useState<PopularSearch[]>([
    { id: 1, term: "Vanilla perfume", enabled: true },
    { id: 2, term: "Oud collection", enabled: true },
    { id: 3, term: "Floral fragrances", enabled: true },
    { id: 4, term: "Gift sets", enabled: true },
    { id: 5, term: "Men's cologne", enabled: true },
    { id: 6, term: "Summer scents", enabled: true },
  ]);

  const [trendingProducts, setTrendingProducts] = useState<TrendingProduct[]>([
    { id: 1, name: "Midnight Oud", price: 1999, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=100", slug: "midnight-oud", enabled: true },
    { id: 2, name: "Rose Garden", price: 1499, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=100", slug: "rose-garden", enabled: true },
    { id: 3, name: "Ocean Breeze", price: 1299, image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=100", slug: "ocean-breeze", enabled: true },
  ]);

  // SEO Settings State
  const [globalSeo, setGlobalSeo] = useState({
    siteName: "RIMAE",
    defaultTitle: "A SCENT THAT REFLECTS YOU | Personalized Fragrances",
    defaultDescription: "Create your own signature scent with RIMAE. Discover bestselling perfumes, customize your fragrance, and explore our curated collection of fresh, floral, woody, and oriental scents.",
    defaultOgImage: "https://lovable.dev/opengraph-image-p98pqg.png",
    twitterHandle: "@rimae",
    facebookAppId: "",
  });

  const [pageSeoSettings, setPageSeoSettings] = useState<PageSeo[]>([
    { 
      id: "home", 
      pageName: "Home Page", 
      path: "/",
      title: "A SCENT THAT REFLECTS YOU | Personalized Fragrances",
      description: "Create your own signature scent with RIMAE. Discover bestselling perfumes, customize your fragrance, and explore our curated collection.",
      ogImage: "",
      keywords: "perfume, fragrance, personalized, custom scent, luxury perfume"
    },
    { 
      id: "bestsellers", 
      pageName: "Bestsellers", 
      path: "/bestsellers",
      title: "Bestselling Perfumes | RIMAE",
      description: "Discover our most loved fragrances. Shop bestselling perfumes and attars loved by thousands.",
      ogImage: "",
      keywords: "bestseller perfume, popular fragrance, top rated"
    },
    { 
      id: "personalised", 
      pageName: "Personalised", 
      path: "/personalised",
      title: "Create Your Own Perfume | RIMAE",
      description: "Design a fragrance as unique as you. Choose your notes, customize your bottle, and create your signature scent.",
      ogImage: "",
      keywords: "custom perfume, personalized fragrance, create perfume"
    },
    { 
      id: "ai", 
      pageName: "AI Advisor", 
      path: "/my-type",
      title: "AI Fragrance Advisor | RIMAE",
      description: "Get personalized fragrance recommendations from our AI advisor. Find your perfect scent match.",
      ogImage: "",
      keywords: "AI perfume, fragrance advisor, scent recommendation"
    },
    { 
      id: "all-products", 
      pageName: "All Products", 
      path: "/all-products",
      title: "All Perfumes & Fragrances | RIMAE",
      description: "Explore our complete collection of perfumes, attars, and fragrances. Find your perfect scent.",
      ogImage: "",
      keywords: "all perfumes, fragrance collection, shop perfume"
    },
    { 
      id: "about", 
      pageName: "About Us", 
      path: "/about-us",
      title: "About RIMAE | Our Story",
      description: "Learn about RIMAE's journey in crafting personalized fragrances since 2014.",
      ogImage: "",
      keywords: "about rimae, fragrance company, perfume brand"
    },
  ]);

  const handleSave = (section: string) => {
    toast.success(`${section} settings saved successfully!`);
  };

  // Search handlers
  const addPopularSearch = () => {
    const newId = Math.max(...popularSearches.map(s => s.id), 0) + 1;
    setPopularSearches([...popularSearches, { id: newId, term: "", enabled: true }]);
  };

  const removePopularSearch = (id: number) => {
    setPopularSearches(popularSearches.filter(s => s.id !== id));
  };

  const addTrendingProduct = () => {
    const newId = Math.max(...trendingProducts.map(p => p.id), 0) + 1;
    setTrendingProducts([...trendingProducts, { id: newId, name: "", price: 0, image: "", slug: "", enabled: true }]);
  };

  const removeTrendingProduct = (id: number) => {
    setTrendingProducts(trendingProducts.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Search & SEO</h1>
        <p className="text-muted-foreground mt-1">
          Configure search functionality and SEO settings for all pages
        </p>
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span>Search Settings</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>SEO Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Search Settings Tab */}
        <TabsContent value="search" className="mt-6 space-y-6">
          {/* General Search Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Configure search drawer behavior and appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                <div>
                  <Label className="text-base">Enable Search</Label>
                  <p className="text-sm text-muted-foreground">Show search icon in header</p>
                </div>
                <Switch 
                  checked={searchEnabled}
                  onCheckedChange={setSearchEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label>Search Placeholder Text</Label>
                <Input 
                  value={searchPlaceholder}
                  onChange={(e) => setSearchPlaceholder(e.target.value)}
                  placeholder="Enter placeholder text..."
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("Search General")}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Popular Searches */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Searches</CardTitle>
              <CardDescription>
                Manage suggested search terms shown to users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {popularSearches.map((search, index) => (
                <div key={search.id} className="flex items-center gap-4 p-3 border rounded-lg bg-muted/30">
                  <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                  <Input 
                    value={search.term}
                    onChange={(e) => {
                      const updated = [...popularSearches];
                      updated[index].term = e.target.value;
                      setPopularSearches(updated);
                    }}
                    placeholder="Search term"
                    className="flex-1"
                  />
                  <Switch 
                    checked={search.enabled}
                    onCheckedChange={(checked) => {
                      const updated = [...popularSearches];
                      updated[index].enabled = checked;
                      setPopularSearches(updated);
                    }}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removePopularSearch(search.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex justify-between">
                <Button variant="outline" onClick={addPopularSearch}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Search Term
                </Button>
                <Button onClick={() => handleSave("Popular Searches")}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Trending Products */}
          <Card>
            <CardHeader>
              <CardTitle>Trending Products</CardTitle>
              <CardDescription>
                Products shown in the search drawer as trending
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {trendingProducts.map((product, index) => (
                <div key={product.id} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30">
                  <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab mt-2" />
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Product Name</Label>
                      <Input 
                        value={product.name}
                        onChange={(e) => {
                          const updated = [...trendingProducts];
                          updated[index].name = e.target.value;
                          setTrendingProducts(updated);
                        }}
                        placeholder="Product name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (₹)</Label>
                      <Input 
                        type="number"
                        value={product.price}
                        onChange={(e) => {
                          const updated = [...trendingProducts];
                          updated[index].price = parseInt(e.target.value) || 0;
                          setTrendingProducts(updated);
                        }}
                        placeholder="1999"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input 
                        value={product.image}
                        onChange={(e) => {
                          const updated = [...trendingProducts];
                          updated[index].image = e.target.value;
                          setTrendingProducts(updated);
                        }}
                        placeholder="Image URL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Product Slug</Label>
                      <Input 
                        value={product.slug}
                        onChange={(e) => {
                          const updated = [...trendingProducts];
                          updated[index].slug = e.target.value;
                          setTrendingProducts(updated);
                        }}
                        placeholder="product-slug"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <Switch 
                      checked={product.enabled}
                      onCheckedChange={(checked) => {
                        const updated = [...trendingProducts];
                        updated[index].enabled = checked;
                        setTrendingProducts(updated);
                      }}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeTrendingProduct(product.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between">
                <Button variant="outline" onClick={addTrendingProduct}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Trending Product
                </Button>
                <Button onClick={() => handleSave("Trending Products")}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings Tab */}
        <TabsContent value="seo" className="mt-6 space-y-6">
          {/* Global SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Global SEO Settings
              </CardTitle>
              <CardDescription>
                Default SEO settings applied across all pages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Site Name</Label>
                  <Input 
                    value={globalSeo.siteName}
                    onChange={(e) => setGlobalSeo({...globalSeo, siteName: e.target.value})}
                    placeholder="RIMAE"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Twitter Handle</Label>
                  <Input 
                    value={globalSeo.twitterHandle}
                    onChange={(e) => setGlobalSeo({...globalSeo, twitterHandle: e.target.value})}
                    placeholder="@rimae"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Default Meta Title</Label>
                <Input 
                  value={globalSeo.defaultTitle}
                  onChange={(e) => setGlobalSeo({...globalSeo, defaultTitle: e.target.value})}
                  placeholder="Site title for SEO"
                />
                <p className="text-xs text-muted-foreground">Keep under 60 characters</p>
              </div>

              <div className="space-y-2">
                <Label>Default Meta Description</Label>
                <Textarea 
                  value={globalSeo.defaultDescription}
                  onChange={(e) => setGlobalSeo({...globalSeo, defaultDescription: e.target.value})}
                  placeholder="Site description for SEO"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">Keep under 160 characters</p>
              </div>

              <div className="space-y-2">
                <Label>Default OG Image URL</Label>
                <Input 
                  value={globalSeo.defaultOgImage}
                  onChange={(e) => setGlobalSeo({...globalSeo, defaultOgImage: e.target.value})}
                  placeholder="https://example.com/og-image.png"
                />
                <p className="text-xs text-muted-foreground">Recommended: 1200x630px</p>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("Global SEO")}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Per-Page SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Page-Specific SEO
              </CardTitle>
              <CardDescription>
                Override SEO settings for individual pages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {pageSeoSettings.map((page, index) => (
                <div key={page.id} className="p-4 border rounded-lg bg-muted/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{page.pageName}</h4>
                      <p className="text-sm text-muted-foreground">{page.path}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Meta Title</Label>
                      <Input 
                        value={page.title}
                        onChange={(e) => {
                          const updated = [...pageSeoSettings];
                          updated[index].title = e.target.value;
                          setPageSeoSettings(updated);
                        }}
                        placeholder="Page title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Keywords</Label>
                      <Input 
                        value={page.keywords}
                        onChange={(e) => {
                          const updated = [...pageSeoSettings];
                          updated[index].keywords = e.target.value;
                          setPageSeoSettings(updated);
                        }}
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Description</Label>
                    <Textarea 
                      value={page.description}
                      onChange={(e) => {
                        const updated = [...pageSeoSettings];
                        updated[index].description = e.target.value;
                        setPageSeoSettings(updated);
                      }}
                      placeholder="Page description for SEO"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>OG Image URL (optional)</Label>
                    <Input 
                      value={page.ogImage}
                      onChange={(e) => {
                        const updated = [...pageSeoSettings];
                        updated[index].ogImage = e.target.value;
                        setPageSeoSettings(updated);
                      }}
                      placeholder="Leave empty to use default"
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <Button onClick={() => handleSave("Page SEO")}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchSeoAdmin;
