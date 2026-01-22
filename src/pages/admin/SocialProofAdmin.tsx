import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, Eye, Search } from "lucide-react";
import { allProducts } from "@/data/products";
import { toast } from "sonner";

interface SocialProofSettings {
  enabled: boolean;
  selectedProductIds: string[];
  intervalPattern: number[];
}

const SocialProofAdmin = () => {
  const [settings, setSettings] = useState<SocialProofSettings>({
    enabled: true,
    selectedProductIds: allProducts.slice(0, 5).map(p => p.id),
    intervalPattern: [5, 3, 5, 3], // in minutes
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("socialProofSettings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings({
        ...parsed,
        intervalPattern: parsed.intervalPattern.map((ms: number) => ms / 60000), // Convert ms to minutes
      });
    }
  }, []);

  const handleSave = () => {
    const toSave = {
      ...settings,
      intervalPattern: settings.intervalPattern.map(m => m * 60000), // Convert minutes to ms
    };
    localStorage.setItem("socialProofSettings", JSON.stringify(toSave));
    toast.success("Social proof settings saved!");
  };

  const toggleProduct = (productId: string) => {
    setSettings(prev => ({
      ...prev,
      selectedProductIds: prev.selectedProductIds.includes(productId)
        ? prev.selectedProductIds.filter(id => id !== productId)
        : [...prev.selectedProductIds, productId],
    }));
  };

  const selectAll = () => {
    setSettings(prev => ({
      ...prev,
      selectedProductIds: allProducts.map(p => p.id),
    }));
  };

  const deselectAll = () => {
    setSettings(prev => ({
      ...prev,
      selectedProductIds: [],
    }));
  };

  const updateInterval = (index: number, value: number) => {
    setSettings(prev => ({
      ...prev,
      intervalPattern: prev.intervalPattern.map((v, i) => i === index ? value : v),
    }));
  };

  const filteredProducts = allProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-charcoal">Social Proof Popup</h1>
          <p className="text-muted-foreground">Configure the "Someone just purchased" notification</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreviewVisible(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      {/* Enable/Disable */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status</CardTitle>
          <CardDescription>Enable or disable the social proof popup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enabled: checked }))}
            />
            <Label>{settings.enabled ? "Enabled" : "Disabled"}</Label>
          </div>
        </CardContent>
      </Card>

      {/* Interval Pattern */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Display Interval Pattern</CardTitle>
          <CardDescription>Set the repeating interval pattern in minutes (e.g., 5,3,5,3)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 items-center flex-wrap">
            {settings.intervalPattern.map((interval, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={interval}
                  onChange={(e) => updateInterval(index, parseInt(e.target.value) || 1)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">min</span>
                {index < settings.intervalPattern.length - 1 && (
                  <span className="text-muted-foreground">→</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Pattern repeats: Popup appears every {settings.intervalPattern.join(" → ")} minutes
          </p>
        </CardContent>
      </Card>

      {/* Product Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Products to Display</CardTitle>
              <CardDescription>
                Select which products can appear in the popup ({settings.selectedProductIds.length} selected)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAll}>
                Deselect All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {filteredProducts.map((product) => (
              <label
                key={product.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  settings.selectedProductIds.includes(product.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Checkbox
                  checked={settings.selectedProductIds.includes(product.id)}
                  onCheckedChange={() => toggleProduct(product.id)}
                />
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">₹{product.price}</p>
                </div>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {previewVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-start p-6 z-50" onClick={() => setPreviewVisible(false)}>
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-xs animate-slide-in-right" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 p-3">
              <div className="relative w-16 h-16 flex-shrink-0">
                <img
                  src={allProducts[0]?.image}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">
                  Someone from <span className="font-medium text-charcoal">Mumbai, Maharashtra</span>
                </p>
                <p className="text-sm font-medium text-charcoal truncate">
                  just purchased this!
                </p>
                <p className="text-sm text-primary font-semibold truncate">
                  {allProducts[0]?.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  2 minutes ago
                </p>
              </div>
            </div>
            <div className="h-0.5 bg-primary" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialProofAdmin;
