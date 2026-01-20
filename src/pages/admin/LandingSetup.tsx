import { useState } from "react";
import { 
  Image, 
  Type, 
  Grid3X3, 
  Snowflake, 
  Video, 
  Plus, 
  Trash2, 
  Edit2, 
  Save,
  GripVertical,
  Link as LinkIcon,
  Upload
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// Types for the admin data
interface BannerSlide {
  id: number;
  image: string;
  link: string;
  alt: string;
  enabled: boolean;
}

interface MarqueeSettings {
  text: string;
  link: string;
  enabled: boolean;
  speed: number;
}

interface FragranceCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
  enabled: boolean;
}

interface WinterPick {
  id: number;
  name: string;
  image: string;
  gradient: string;
  slug: string;
  enabled: boolean;
}

interface WinterSettings {
  title: string;
  subtitle: string;
  enabled: boolean;
}

interface ShoppableVideo {
  id: number;
  videoUrl: string;
  productId: string;
  productName: string;
  enabled: boolean;
}

const LandingSetup = () => {
  // Banner Carousel State
  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>([
    { id: 1, image: "/hero-slide-1.png", link: "/all-products", alt: "Hero Slide 1", enabled: true },
    { id: 2, image: "/hero-slide-2.png", link: "/products/sandal-veer", alt: "Hero Slide 2", enabled: true },
    { id: 3, image: "/hero-slide-3.png", link: "/all-products?promo=RIMAENEW", alt: "Hero Slide 3", enabled: true },
  ]);

  // Marquee State
  const [marqueeSettings, setMarqueeSettings] = useState<MarqueeSettings>({
    text: "The Scent Loot Box is Now Live — Choose Your 4 Scents at ₹1599",
    link: "#loot-box",
    enabled: true,
    speed: 30,
  });

  // Fragrance Categories State
  const [categories, setCategories] = useState<FragranceCategory[]>([
    { id: 1, name: "Fresh", slug: "fresh", image: "https://images.unsplash.com/photo-1527903789995-dc8ad2ad6de0?w=400", description: "Light & Citrusy", enabled: true },
    { id: 2, name: "Oriental/Woody", slug: "oriental-woody", image: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=400", description: "Warm & Mysterious", enabled: true },
    { id: 3, name: "Floral", slug: "floral", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400", description: "Romantic & Elegant", enabled: true },
    { id: 4, name: "Musky", slug: "musky", image: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=400", description: "Sensual & Bold", enabled: true },
  ]);

  // Winter Picks State
  const [winterPicks, setWinterPicks] = useState<WinterPick[]>([
    { id: 1, name: "BLUE", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800", gradient: "from-sky-200 to-blue-300", slug: "sandal-veer", enabled: true },
    { id: 2, name: "CRYSTAL", image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800", gradient: "from-pink-200 to-rose-300", slug: "flora-bliss", enabled: true },
    { id: 3, name: "BOMB", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800", gradient: "from-pink-300 to-fuchsia-200", slug: "midnight-rose", enabled: true },
    { id: 4, name: "IBIZA", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800", gradient: "from-teal-300 to-cyan-400", slug: "ocean-breeze", enabled: true },
  ]);

  const [winterSettings, setWinterSettings] = useState<WinterSettings>({
    title: "EXPLORE",
    subtitle: "OUR WINTER PICKS",
    enabled: true,
  });

  // Shoppable Videos State
  const [shoppableVideos, setShoppableVideos] = useState<ShoppableVideo[]>([
    { id: 1, videoUrl: "/videos/perfume-video.mp4", productId: "1", productName: "Sandal Veer", enabled: true },
    { id: 2, videoUrl: "/videos/perfume-video.mp4", productId: "2", productName: "Flora Bliss", enabled: true },
    { id: 3, videoUrl: "/videos/perfume-video.mp4", productId: "3", productName: "Midnight Rose", enabled: true },
    { id: 4, videoUrl: "/videos/perfume-video.mp4", productId: "4", productName: "Ocean Breeze", enabled: true },
    { id: 5, videoUrl: "/videos/perfume-video.mp4", productId: "5", productName: "Royal Oud", enabled: true },
  ]);

  const [shoppableSettings, setShoppableSettings] = useState({
    sectionTitle: "SHOPPABLE",
    sectionHighlight: "VIDEOS",
    enabled: true,
  });

  // Handler functions
  const handleSave = (section: string) => {
    toast.success(`${section} settings saved successfully!`);
  };

  const addBannerSlide = () => {
    const newId = Math.max(...bannerSlides.map(s => s.id), 0) + 1;
    setBannerSlides([...bannerSlides, { id: newId, image: "", link: "", alt: `Slide ${newId}`, enabled: true }]);
  };

  const removeBannerSlide = (id: number) => {
    setBannerSlides(bannerSlides.filter(s => s.id !== id));
  };

  const addCategory = () => {
    const newId = Math.max(...categories.map(c => c.id), 0) + 1;
    setCategories([...categories, { id: newId, name: "", slug: "", image: "", description: "", enabled: true }]);
  };

  const removeCategory = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const addWinterPick = () => {
    const newId = Math.max(...winterPicks.map(w => w.id), 0) + 1;
    setWinterPicks([...winterPicks, { id: newId, name: "", image: "", gradient: "from-gray-200 to-gray-300", slug: "", enabled: true }]);
  };

  const removeWinterPick = (id: number) => {
    setWinterPicks(winterPicks.filter(w => w.id !== id));
  };

  const addShoppableVideo = () => {
    const newId = Math.max(...shoppableVideos.map(v => v.id), 0) + 1;
    setShoppableVideos([...shoppableVideos, { id: newId, videoUrl: "", productId: "", productName: "", enabled: true }]);
  };

  const removeShoppableVideo = (id: number) => {
    setShoppableVideos(shoppableVideos.filter(v => v.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Landing Page Setup</h1>
        <p className="text-muted-foreground mt-1">
          Manage all landing page sections including banner, marquee, categories, and more
        </p>
      </div>

      <Tabs defaultValue="banner" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="banner" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            <span className="hidden sm:inline">Banner</span>
          </TabsTrigger>
          <TabsTrigger value="marquee" className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline">Marquee</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" />
            <span className="hidden sm:inline">Categories</span>
          </TabsTrigger>
          <TabsTrigger value="winter" className="flex items-center gap-2">
            <Snowflake className="w-4 h-4" />
            <span className="hidden sm:inline">Winter</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline">Videos</span>
          </TabsTrigger>
        </TabsList>

        {/* Banner Carousel Tab */}
        <TabsContent value="banner" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Banner Carousel
              </CardTitle>
              <CardDescription>
                Manage hero banner slides. Recommended size: 1920x800px for desktop, 768x600px for mobile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {bannerSlides.map((slide, index) => (
                <div key={slide.id} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center">
                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input 
                        value={slide.image} 
                        onChange={(e) => {
                          const updated = [...bannerSlides];
                          updated[index].image = e.target.value;
                          setBannerSlides(updated);
                        }}
                        placeholder="Image URL or path"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Link URL</Label>
                      <Input 
                        value={slide.link}
                        onChange={(e) => {
                          const updated = [...bannerSlides];
                          updated[index].link = e.target.value;
                          setBannerSlides(updated);
                        }}
                        placeholder="/all-products"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Alt Text</Label>
                      <Input 
                        value={slide.alt}
                        onChange={(e) => {
                          const updated = [...bannerSlides];
                          updated[index].alt = e.target.value;
                          setBannerSlides(updated);
                        }}
                        placeholder="Slide description"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={slide.enabled}
                      onCheckedChange={(checked) => {
                        const updated = [...bannerSlides];
                        updated[index].enabled = checked;
                        setBannerSlides(updated);
                      }}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeBannerSlide(slide.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between">
                <Button variant="outline" onClick={addBannerSlide}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Slide
                </Button>
                <Button onClick={() => handleSave("Banner")}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marquee Tab */}
        <TabsContent value="marquee" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Marquee Banner
              </CardTitle>
              <CardDescription>
                Configure the scrolling announcement banner at the top of the page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Label>Enable Marquee</Label>
                </div>
                <Switch 
                  checked={marqueeSettings.enabled}
                  onCheckedChange={(checked) => setMarqueeSettings({...marqueeSettings, enabled: checked})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Marquee Text</Label>
                  <Textarea 
                    value={marqueeSettings.text}
                    onChange={(e) => setMarqueeSettings({...marqueeSettings, text: e.target.value})}
                    placeholder="Enter announcement text..."
                    rows={3}
                  />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Link URL</Label>
                    <Input 
                      value={marqueeSettings.link}
                      onChange={(e) => setMarqueeSettings({...marqueeSettings, link: e.target.value})}
                      placeholder="#section-id or /page-url"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Scroll Speed (seconds)</Label>
                    <Input 
                      type="number"
                      value={marqueeSettings.speed}
                      onChange={(e) => setMarqueeSettings({...marqueeSettings, speed: parseInt(e.target.value) || 30})}
                      min={10}
                      max={120}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("Marquee")}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid3X3 className="w-5 h-5" />
                Shop by Fragrance Type
              </CardTitle>
              <CardDescription>
                Manage fragrance category cards shown on the landing page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {categories.map((category, index) => (
                <div key={category.id} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center">
                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input 
                        value={category.name}
                        onChange={(e) => {
                          const updated = [...categories];
                          updated[index].name = e.target.value;
                          setCategories(updated);
                        }}
                        placeholder="Category name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Slug</Label>
                      <Input 
                        value={category.slug}
                        onChange={(e) => {
                          const updated = [...categories];
                          updated[index].slug = e.target.value;
                          setCategories(updated);
                        }}
                        placeholder="category-slug"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input 
                        value={category.image}
                        onChange={(e) => {
                          const updated = [...categories];
                          updated[index].image = e.target.value;
                          setCategories(updated);
                        }}
                        placeholder="Image URL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input 
                        value={category.description}
                        onChange={(e) => {
                          const updated = [...categories];
                          updated[index].description = e.target.value;
                          setCategories(updated);
                        }}
                        placeholder="Short description"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={category.enabled}
                      onCheckedChange={(checked) => {
                        const updated = [...categories];
                        updated[index].enabled = checked;
                        setCategories(updated);
                      }}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeCategory(category.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between">
                <Button variant="outline" onClick={addCategory}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
                <Button onClick={() => handleSave("Categories")}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Winter Picks Tab */}
        <TabsContent value="winter" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Snowflake className="w-5 h-5" />
                Explore Our Winter Picks
              </CardTitle>
              <CardDescription>
                Manage the Winter Picks section title and featured products
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Section Settings */}
              <div className="p-4 border rounded-lg bg-muted/30 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Section Settings</Label>
                  <Switch 
                    checked={winterSettings.enabled}
                    onCheckedChange={(checked) => setWinterSettings({...winterSettings, enabled: checked})}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Section Title</Label>
                    <Input 
                      value={winterSettings.title}
                      onChange={(e) => setWinterSettings({...winterSettings, title: e.target.value})}
                      placeholder="EXPLORE"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Section Subtitle</Label>
                    <Input 
                      value={winterSettings.subtitle}
                      onChange={(e) => setWinterSettings({...winterSettings, subtitle: e.target.value})}
                      placeholder="OUR WINTER PICKS"
                    />
                  </div>
                </div>
              </div>

              {/* Winter Picks Items */}
              {winterPicks.map((pick, index) => (
                <div key={pick.id} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center">
                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input 
                        value={pick.name}
                        onChange={(e) => {
                          const updated = [...winterPicks];
                          updated[index].name = e.target.value;
                          setWinterPicks(updated);
                        }}
                        placeholder="Pick name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input 
                        value={pick.image}
                        onChange={(e) => {
                          const updated = [...winterPicks];
                          updated[index].image = e.target.value;
                          setWinterPicks(updated);
                        }}
                        placeholder="Image URL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Product Slug</Label>
                      <Input 
                        value={pick.slug}
                        onChange={(e) => {
                          const updated = [...winterPicks];
                          updated[index].slug = e.target.value;
                          setWinterPicks(updated);
                        }}
                        placeholder="product-slug"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Gradient Classes</Label>
                      <Input 
                        value={pick.gradient}
                        onChange={(e) => {
                          const updated = [...winterPicks];
                          updated[index].gradient = e.target.value;
                          setWinterPicks(updated);
                        }}
                        placeholder="from-sky-200 to-blue-300"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={pick.enabled}
                      onCheckedChange={(checked) => {
                        const updated = [...winterPicks];
                        updated[index].enabled = checked;
                        setWinterPicks(updated);
                      }}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeWinterPick(pick.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between">
                <Button variant="outline" onClick={addWinterPick}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Winter Pick
                </Button>
                <Button onClick={() => handleSave("Winter Picks")}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shoppable Videos Tab */}
        <TabsContent value="videos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Shoppable Videos
              </CardTitle>
              <CardDescription>
                Manage shoppable video content with linked products
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Section Settings */}
              <div className="p-4 border rounded-lg bg-muted/30 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Section Settings</Label>
                  <Switch 
                    checked={shoppableSettings.enabled}
                    onCheckedChange={(checked) => setShoppableSettings({...shoppableSettings, enabled: checked})}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Section Title</Label>
                    <Input 
                      value={shoppableSettings.sectionTitle}
                      onChange={(e) => setShoppableSettings({...shoppableSettings, sectionTitle: e.target.value})}
                      placeholder="SHOPPABLE"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Highlighted Text</Label>
                    <Input 
                      value={shoppableSettings.sectionHighlight}
                      onChange={(e) => setShoppableSettings({...shoppableSettings, sectionHighlight: e.target.value})}
                      placeholder="VIDEOS"
                    />
                  </div>
                </div>
              </div>

              {/* Video Items */}
              {shoppableVideos.map((video, index) => (
                <div key={video.id} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center">
                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Video URL</Label>
                      <Input 
                        value={video.videoUrl}
                        onChange={(e) => {
                          const updated = [...shoppableVideos];
                          updated[index].videoUrl = e.target.value;
                          setShoppableVideos(updated);
                        }}
                        placeholder="/videos/video.mp4"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Product ID</Label>
                      <Input 
                        value={video.productId}
                        onChange={(e) => {
                          const updated = [...shoppableVideos];
                          updated[index].productId = e.target.value;
                          setShoppableVideos(updated);
                        }}
                        placeholder="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Product Name</Label>
                      <Input 
                        value={video.productName}
                        onChange={(e) => {
                          const updated = [...shoppableVideos];
                          updated[index].productName = e.target.value;
                          setShoppableVideos(updated);
                        }}
                        placeholder="Product name"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={video.enabled}
                      onCheckedChange={(checked) => {
                        const updated = [...shoppableVideos];
                        updated[index].enabled = checked;
                        setShoppableVideos(updated);
                      }}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeShoppableVideo(video.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between">
                <Button variant="outline" onClick={addShoppableVideo}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Video
                </Button>
                <Button onClick={() => handleSave("Shoppable Videos")}>
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

export default LandingSetup;
