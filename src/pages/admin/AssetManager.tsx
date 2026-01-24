import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Image, 
  Video, 
  Copy, 
  Trash2, 
  Search, 
  ExternalLink,
  FileImage,
  FileVideo,
  Eye,
  X,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { adminAPI, Asset } from "@/lib/api";

const AssetManager = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Fetch assets from API
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setIsLoading(true);
        const response = await adminAPI.assets.list();
        setAssets(response.results || []);
      } catch (error) {
        console.error('Failed to fetch assets:', error);
        toast.error('Failed to load assets');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.used_in?.some(usage => usage.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const imageAssets = filteredAssets.filter(a => a.type === "image");
  const videoAssets = filteredAssets.filter(a => a.type === "video");

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    setIsUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        const isVideo = file.type.startsWith("video/");
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;
        
        // Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('assets')
          .upload(filePath, file);
        
        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('assets')
          .getPublicUrl(filePath);
        
        // Save metadata to database via API
        try {
          const newAsset = await adminAPI.assets.create({
            name: file.name,
            type: isVideo ? 'video' : 'image',
            storage_path: filePath,
            url: publicUrl,
            size_bytes: file.size,
            mime_type: file.type,
            used_in: [],
          });
          
          setAssets(prev => [newAsset, ...prev]);
        } catch (apiError) {
          console.error('Failed to save asset metadata:', apiError);
          // Still show success since file uploaded
        }
      }
      
      toast.success(`${files.length} file(s) uploaded successfully`);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  const deleteAsset = async (asset: Asset) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('assets')
        .remove([asset.storage_path]);
      
      if (storageError) {
        console.error('Storage delete error:', storageError);
      }
      
      // Delete from API
      await adminAPI.assets.delete(asset.id);
      
      setAssets(prev => prev.filter(a => a.id !== asset.id));
      toast.success("Asset deleted");
    } catch (error) {
      console.error('Failed to delete asset:', error);
      toast.error('Failed to delete asset');
    }
  };

  const AssetCard = ({ asset }: { asset: Asset }) => (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow">
      <div className="relative aspect-video bg-muted">
        {asset.type === "image" ? (
          <img 
            src={asset.url} 
            alt={asset.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Image";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-charcoal/10">
            <Video className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button 
            size="icon" 
            variant="secondary" 
            className="h-8 w-8"
            onClick={() => setSelectedAsset(asset)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="secondary" 
            className="h-8 w-8"
            onClick={() => copyUrl(asset.url)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="destructive" 
            className="h-8 w-8"
            onClick={() => deleteAsset(asset)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <Badge 
          variant="secondary" 
          className="absolute top-2 right-2 text-xs"
        >
          {asset.type === "image" ? <FileImage className="w-3 h-3 mr-1" /> : <FileVideo className="w-3 h-3 mr-1" />}
          {asset.type}
        </Badge>
      </div>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm truncate flex-1" title={asset.name}>
            {asset.name}
          </h4>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{asset.size_formatted}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{new Date(asset.created_at).toLocaleDateString()}</span>
        </div>
        {asset.used_in && asset.used_in.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {asset.used_in.map((usage, idx) => (
              <Badge key={idx} variant="outline" className="text-xs py-0">
                {usage}
              </Badge>
            ))}
          </div>
        )}
        {(!asset.used_in || asset.used_in.length === 0) && (
          <Badge variant="secondary" className="text-xs py-0 bg-yellow-100 text-yellow-800">
            Not in use
          </Badge>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">Asset Manager</h1>
        <p className="text-muted-foreground">Upload and manage images & videos with auto-generated URLs</p>
      </div>

      {/* Upload Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-3">
              {isUploading ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="font-medium">Uploading...</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Drag & drop files here</p>
                    <p className="text-sm text-muted-foreground">or click to browse</p>
                  </div>
                  <Input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  />
                  <Button asChild variant="outline">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Browse Files
                    </label>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Supported: JPG, PNG, WEBP, GIF, MP4, MOV (Max 50MB)
                  </p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Asset Library */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Asset Library
              <Badge variant="secondary">{assets.length} files</Badge>
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search assets or usage..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({filteredAssets.length})</TabsTrigger>
              <TabsTrigger value="images">Images ({imageAssets.length})</TabsTrigger>
              <TabsTrigger value="videos">Videos ({videoAssets.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAssets.map(asset => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
              {filteredAssets.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No assets found matching your search
                </div>
              )}
            </TabsContent>

            <TabsContent value="images">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {imageAssets.map(asset => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="videos">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videoAssets.map(asset => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Asset Preview Modal */}
      {selectedAsset && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedAsset(null)}
        >
          <div 
            className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">{selectedAsset.name}</h3>
              <Button size="icon" variant="ghost" onClick={() => setSelectedAsset(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4">
              {selectedAsset.type === "image" ? (
                <img 
                  src={selectedAsset.url} 
                  alt={selectedAsset.name}
                  className="w-full max-h-[60vh] object-contain rounded"
                />
              ) : (
                <video 
                  src={selectedAsset.url} 
                  controls 
                  className="w-full max-h-[60vh] rounded"
                />
              )}
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">URL:</span>
                  <code className="flex-1 text-sm bg-muted px-2 py-1 rounded truncate">
                    {selectedAsset.url}
                  </code>
                  <Button size="sm" variant="outline" onClick={() => copyUrl(selectedAsset.url)}>
                    <Copy className="w-4 h-4 mr-1" /> Copy
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Size:</span>
                  <span className="text-sm">{selectedAsset.size_formatted}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Uploaded:</span>
                  <span className="text-sm">{new Date(selectedAsset.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">Used in:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedAsset.used_in && selectedAsset.used_in.length > 0 ? (
                      selectedAsset.used_in.map((usage, idx) => (
                        <Badge key={idx} variant="outline">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {usage}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Not currently in use
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManager;
