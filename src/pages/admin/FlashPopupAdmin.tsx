import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save, Eye, Upload, Palette } from "lucide-react";
import { toast } from "sonner";
import type { FlashPopupPlacement } from "@/components/FlashPopup";

interface FlashPopupConfig {
  isEnabled: boolean;
  backgroundImage: string;
  backgroundColor: string;
  headerText: string;
  subHeaderText: string;
  message: string;
  redirectUrl: string;
  buttonText: string;
  showOnLoad: boolean;
  delaySeconds: number;
  width: number;
  height: number;
  placement: FlashPopupPlacement;
}

const FlashPopupAdmin = () => {
  const [config, setConfig] = useState<FlashPopupConfig>({
    isEnabled: true,
    backgroundImage: "",
    backgroundColor: "linear-gradient(135deg, hsl(345 60% 30%) 0%, hsl(345 65% 25%) 100%)",
    headerText: "🎉 Flash Sale!",
    subHeaderText: "Limited Time Offer",
    message: "Get 20% off on all perfumes. Use code FLASH20 at checkout.",
    redirectUrl: "/all-products?promo=FLASH20",
    buttonText: "Shop Now",
    showOnLoad: true,
    delaySeconds: 2,
    width: 400,
    height: 300,
    placement: "center",
  });

  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("flashPopupSettings");
    if (saved) {
      setConfig(prev => ({ ...prev, ...JSON.parse(saved) }));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("flashPopupSettings", JSON.stringify(config));
    toast.success("Flash popup settings saved!");
  };

  const colorPresets = [
    { name: "Burgundy", value: "linear-gradient(135deg, hsl(345 60% 30%) 0%, hsl(345 65% 25%) 100%)" },
    { name: "Gold", value: "linear-gradient(135deg, hsl(43 60% 50%) 0%, hsl(43 50% 40%) 100%)" },
    { name: "Dark", value: "linear-gradient(135deg, hsl(0 0% 15%) 0%, hsl(0 0% 5%) 100%)" },
    { name: "Ocean", value: "linear-gradient(135deg, hsl(200 60% 40%) 0%, hsl(220 70% 30%) 100%)" },
  ];

  const placementOptions: { value: FlashPopupPlacement; label: string }[] = [
    { value: "center", label: "Center (Modal)" },
    { value: "top-left", label: "Top Left" },
    { value: "top-right", label: "Top Right" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "bottom-right", label: "Bottom Right" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-charcoal">Flash Popup</h1>
          <p className="text-muted-foreground">Configure promotional popups for deals and announcements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Display Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Popup</Label>
                <Switch
                  checked={config.isEnabled}
                  onCheckedChange={(checked) => setConfig({ ...config, isEnabled: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Show on Page Load</Label>
                <Switch
                  checked={config.showOnLoad}
                  onCheckedChange={(checked) => setConfig({ ...config, showOnLoad: checked })}
                />
              </div>
              <div>
                <Label>Delay (seconds)</Label>
                <Input
                  type="number"
                  min={0}
                  max={30}
                  value={config.delaySeconds}
                  onChange={(e) => setConfig({ ...config, delaySeconds: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Size & Placement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Width (px)</Label>
                  <Input
                    type="number"
                    min={200}
                    max={800}
                    value={config.width}
                    onChange={(e) => setConfig({ ...config, width: parseInt(e.target.value) || 400 })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Height (px)</Label>
                  <Input
                    type="number"
                    min={150}
                    max={600}
                    value={config.height}
                    onChange={(e) => setConfig({ ...config, height: parseInt(e.target.value) || 300 })}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label className="mb-3 block">Placement</Label>
                <RadioGroup
                  value={config.placement}
                  onValueChange={(value) => setConfig({ ...config, placement: value as FlashPopupPlacement })}
                  className="grid grid-cols-2 gap-2"
                >
                  {placementOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`flash-${option.value}`} />
                      <Label htmlFor={`flash-${option.value}`} className="cursor-pointer text-sm">{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Visual placement preview */}
              <div className="relative w-full h-32 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/30">
                <div
                  className={`absolute bg-primary/20 border-2 border-primary rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                    config.placement === "center" ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-12" :
                    config.placement === "bottom-left" ? "bottom-2 left-2 w-12 h-10" :
                    config.placement === "bottom-right" ? "bottom-2 right-2 w-12 h-10" :
                    config.placement === "top-left" ? "top-2 left-2 w-12 h-10" :
                    "top-2 right-2 w-12 h-10"
                  }`}
                >
                  Popup
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Background</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Background Image URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="https://..."
                    value={config.backgroundImage}
                    onChange={(e) => setConfig({ ...config, backgroundImage: e.target.value })}
                  />
                  <Button variant="outline" size="icon">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Leave empty to use background color</p>
              </div>
              
              <div>
                <Label className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Background Color/Gradient
                </Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      className={`h-12 rounded-lg border-2 transition-all ${
                        config.backgroundColor === preset.value ? "border-primary ring-2 ring-primary/20" : "border-transparent"
                      }`}
                      style={{ background: preset.value }}
                      onClick={() => setConfig({ ...config, backgroundColor: preset.value })}
                      title={preset.name}
                    />
                  ))}
                </div>
                <Input
                  placeholder="Custom CSS gradient or color"
                  value={config.backgroundColor}
                  onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Header Text</Label>
                <Input
                  value={config.headerText}
                  onChange={(e) => setConfig({ ...config, headerText: e.target.value })}
                  className="mt-1"
                  placeholder="🎉 Flash Sale!"
                />
              </div>
              <div>
                <Label>Sub-Header Text</Label>
                <Input
                  value={config.subHeaderText}
                  onChange={(e) => setConfig({ ...config, subHeaderText: e.target.value })}
                  className="mt-1"
                  placeholder="Limited Time Offer"
                />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea
                  value={config.message}
                  onChange={(e) => setConfig({ ...config, message: e.target.value })}
                  className="mt-1"
                  rows={3}
                  placeholder="Get 20% off on all perfumes..."
                />
              </div>
              <div>
                <Label>Button Text</Label>
                <Input
                  value={config.buttonText}
                  onChange={(e) => setConfig({ ...config, buttonText: e.target.value })}
                  className="mt-1"
                  placeholder="Shop Now"
                />
              </div>
              <div>
                <Label>Redirect URL (on click)</Label>
                <Input
                  value={config.redirectUrl}
                  onChange={(e) => setConfig({ ...config, redirectUrl: e.target.value })}
                  className="mt-1"
                  placeholder="/all-products?promo=FLASH20"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        {showPreview && (
          <Card className="h-fit sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-muted/50 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                <div
                  className="relative rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    width: Math.min(config.width, 350),
                    minHeight: Math.min(config.height, 250),
                    background: config.backgroundImage 
                      ? `url(${config.backgroundImage}) center/cover no-repeat`
                      : config.backgroundColor,
                  }}
                >
                  {config.backgroundImage && (
                    <div className="absolute inset-0 bg-black/40" />
                  )}
                  <div className="relative z-10 p-6 text-center text-white flex flex-col justify-center h-full" style={{ minHeight: Math.min(config.height, 250) }}>
                    <h2 className="font-serif text-2xl font-bold mb-2">
                      {config.headerText || "Header"}
                    </h2>
                    <p className="text-lg font-medium text-white/90 mb-3">
                      {config.subHeaderText || "Sub-header"}
                    </p>
                    <p className="text-white/80 mb-4 text-sm">
                      {config.message || "Your message here..."}
                    </p>
                    <button className="px-6 py-2 bg-white text-charcoal font-semibold rounded-lg text-sm mx-auto">
                      {config.buttonText || "Button"}
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FlashPopupAdmin;
