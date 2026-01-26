import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Edit, Trash2, Eye, X, Upload, Save, ChevronLeft, ChevronRight, Image as ImageIcon, Users, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { adminAPI, Fragrance, FragranceInput } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  { id: "floral", name: "Floral" },
  { id: "woody", name: "Woody" },
  { id: "oriental", name: "Oriental" },
  { id: "fresh", name: "Fresh" },
  { id: "citrus", name: "Citrus" },
  { id: "spicy", name: "Spicy" },
];

const genderOptions = [
  { id: "men", name: "For Him" },
  { id: "women", name: "For Her" },
  { id: "unisex", name: "Unisex" },
];

const concentrationOptions = [
  { id: "parfum", name: "Parfum" },
  { id: "edp", name: "Eau de Parfum" },
  { id: "edt", name: "Eau de Toilette" },
  { id: "edc", name: "Eau de Cologne" },
];

const ITEMS_PER_PAGE = 8;

interface FormData {
  name: string;
  sku: string;
  type: "perfume" | "attar";
  gender: "men" | "women" | "unisex";
  category: string;
  concentration: string;
  price: number;
  discount: number;
  stock_quantity: number;
  min_order_threshold: number;
  watching_count: number;
  is_active: boolean;
  is_bestseller: boolean;
  status: "draft" | "active" | "discontinued";
  description: string;
  short_description: string;
  top_notes: string[];
  middle_notes: string[];
  base_notes: string[];
}

const initialFormData: FormData = {
  name: "",
  sku: "",
  type: "perfume",
  gender: "unisex",
  category: "floral",
  concentration: "edp",
  price: 0,
  discount: 0,
  stock_quantity: 50,
  min_order_threshold: 5,
  watching_count: 0,
  is_active: true,
  is_bestseller: false,
  status: "draft",
  description: "",
  short_description: "",
  top_notes: [],
  middle_notes: [],
  base_notes: [],
};

const Fragrances = () => {
  const [products, setProducts] = useState<Fragrance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Fragrance | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Fragrance | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: number; image: string; is_cover: boolean }[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: any = { page: currentPage };
      if (typeFilter !== "all") params.type = typeFilter;
      if (statusFilter !== "all") {
        if (statusFilter === "active") params.is_active = true;
        else if (statusFilter === "inactive") params.is_active = false;
      }
      if (searchQuery) params.search = searchQuery;
      
      const response = await adminAPI.fragrances.list(params);
      setProducts(response.results);
      setTotalCount(response.count);
    } catch (error) {
      console.error("Failed to fetch fragrances:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, typeFilter, statusFilter, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Client-side filtering for category and gender (since API may not support)
  const filteredProducts = products.filter((product) => {
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesGender = genderFilter === "all" || product.gender === genderFilter;
    return matchesCategory && matchesGender;
  });

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleCreateNew = () => {
    setEditingProduct(null);
    setFormData({
      ...initialFormData,
      sku: `RIM-NEW-${String(Date.now()).slice(-6)}`,
    });
    setUploadedImages([]);
    setImagePreviewUrls([]);
    setExistingImages([]);
    setActiveTab("general");
    setIsDialogOpen(true);
  };

  const handleEdit = async (product: Fragrance) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      type: product.type,
      gender: product.gender || "unisex",
      category: product.category || "floral",
      concentration: product.concentration || "edp",
      price: product.price,
      discount: product.discount || 0,
      stock_quantity: product.stock_quantity,
      min_order_threshold: product.min_order_threshold,
      watching_count: product.watching_count,
      is_active: product.is_active,
      is_bestseller: product.is_bestseller || false,
      status: product.status,
      description: product.description || "",
      short_description: product.short_description || "",
      top_notes: product.top_notes || [],
      middle_notes: product.middle_notes || [],
      base_notes: product.base_notes || [],
    });
    setUploadedImages([]);
    setImagePreviewUrls([]);
    setExistingImages(product.images?.map(img => ({
      id: img.id,
      image: img.image,
      is_cover: img.is_cover,
    })) || []);
    setActiveTab("general");
    setIsDialogOpen(true);
  };

  const handleView = (product: Fragrance) => {
    setViewingProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this fragrance?")) return;
    
    try {
      await adminAPI.fragrances.delete(productId);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleToggleActive = async (product: Fragrance) => {
    try {
      await adminAPI.fragrances.update(product.id, { is_active: !product.is_active });
      toast.success(`Product ${product.is_active ? "deactivated" : "activated"}`);
      fetchProducts();
    } catch (error) {
      toast.error("Failed to update product status");
    }
  };

  // Handle image file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxImages = 4 - existingImages.length - uploadedImages.length;
    const newFiles = files.slice(0, maxImages);
    
    if (files.length > maxImages) {
      toast.warning(`Maximum 4 images allowed. Only first ${maxImages} images added.`);
    }
    
    setUploadedImages(prev => [...prev, ...newFiles]);
    
    // Create preview URLs
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrls(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Upload images to Supabase storage
  const uploadImagesToStorage = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const file of uploadedImages) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `fragrances/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }
      
      const { data: publicUrl } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);
      
      uploadedUrls.push(publicUrl.publicUrl);
    }
    
    return uploadedUrls;
  };

  const handleSave = async () => {
    if (!formData.name || !formData.sku || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSaving(true);
      
      const payload: FragranceInput = {
        name: formData.name,
        sku: formData.sku,
        type: formData.type,
        gender: formData.gender,
        category: formData.category,
        concentration: formData.concentration,
        price: formData.price,
        discount: formData.discount,
        stock_quantity: formData.stock_quantity,
        min_order_threshold: formData.min_order_threshold,
        watching_count: formData.watching_count,
        is_active: formData.is_active,
        is_bestseller: formData.is_bestseller,
        status: formData.status,
        description: formData.description,
        short_description: formData.short_description,
        top_notes: formData.top_notes,
        middle_notes: formData.middle_notes,
        base_notes: formData.base_notes,
      };

      let savedProduct: Fragrance;

      if (editingProduct) {
        savedProduct = await adminAPI.fragrances.update(editingProduct.id, payload);
        toast.success("Product updated successfully");
      } else {
        savedProduct = await adminAPI.fragrances.create(payload);
        toast.success("Product created successfully");
      }

      // Upload new images if any
      if (uploadedImages.length > 0) {
        setIsUploadingImages(true);
        try {
          const imageUrls = await uploadImagesToStorage();
          // Convert URLs to File objects for the API (or adjust based on your API)
          await adminAPI.fragrances.uploadImages(savedProduct.id, uploadedImages, existingImages.length === 0);
          toast.success("Images uploaded successfully");
        } catch (imgError) {
          console.error("Image upload failed:", imgError);
          toast.error("Product saved but image upload failed");
        } finally {
          setIsUploadingImages(false);
        }
      }

      setIsDialogOpen(false);
      fetchProducts();
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotesChange = (type: "top" | "middle" | "base", value: string) => {
    const notes = value.split(",").map((s) => s.trim()).filter(Boolean);
    setFormData({
      ...formData,
      [`${type}_notes`]: notes,
    });
  };

  const removePreviewImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId: number) => {
    if (!editingProduct) return;
    
    try {
      await adminAPI.fragrances.deleteImage(editingProduct.id, imageId);
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      toast.success("Image removed");
    } catch (error) {
      toast.error("Failed to remove image");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-charcoal">Fragrances</h1>
          <p className="text-muted-foreground">Manage all your perfume and attar products</p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Add New Product
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or SKU..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="perfume">Perfume</SelectItem>
            <SelectItem value="attar">Attar</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={genderFilter} onValueChange={(v) => { setGenderFilter(v); setCurrentPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            {genderOptions.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm">
        <span className="text-muted-foreground">
          Showing {filteredProducts.length} of {totalCount} products
        </span>
        <span className="text-muted-foreground">|</span>
        <span className="text-green-600">{products.filter(p => p.is_active).length} Active</span>
        <span className="text-red-500">{products.filter(p => !p.is_active).length} Inactive</span>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading products...</span>
        </div>
      ) : (
        /* Products Table */
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Product</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Type</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">SKU</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Price</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Stock</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Min Order</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Watching</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={product.cover_image || product.images?.[0]?.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-14 h-14 rounded-lg object-cover"
                          />
                          {(product.image_count || 0) > 1 && (
                            <span className="absolute -bottom-1 -right-1 bg-charcoal text-white text-xs px-1.5 py-0.5 rounded">
                              +{(product.image_count || 1) - 1}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-charcoal">{product.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {product.category || "—"} • {product.gender?.replace("-", " ") || "Unisex"}
                          </p>
                          {product.is_bestseller && (
                            <Badge variant="outline" className="text-xs mt-1 bg-amber-50 text-amber-700 border-amber-200">Bestseller</Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant="outline" 
                        className={`capitalize ${product.type === 'attar' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}
                      >
                        {product.type}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">{product.sku}</code>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">₹{product.final_price || product.price}</p>
                        {product.discount > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground line-through">₹{product.price}</span>
                            <span className="text-xs text-green-600">-{product.discount}%</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`font-medium ${product.stock_quantity < product.min_order_threshold ? 'text-red-500' : 'text-charcoal'}`}>
                        {product.stock_quantity}
                      </span>
                      {product.stock_quantity < product.min_order_threshold && (
                        <p className="text-xs text-red-500">Low stock!</p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{product.min_order_threshold}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{product.watching_count}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Switch
                        checked={product.is_active}
                        onCheckedChange={() => handleToggleActive(product)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleView(product)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && !isLoading && (
            <div className="p-8 text-center text-muted-foreground">
              No fragrances found matching your filters.
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {editingProduct ? `Editing: ${editingProduct.name}` : "Fill in the product details"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingProduct ? "Update" : "Publish"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Images */}
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Product Images (up to 4)</label>
                  
                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {existingImages.map((img, index) => (
                        <div key={img.id} className="relative">
                          <img
                            src={img.image}
                            alt={`Image ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          {img.is_cover && (
                            <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1 rounded">Cover</span>
                          )}
                          <button
                            onClick={() => removeExistingImage(img.id)}
                            className="absolute top-1 right-1 p-1 bg-white rounded-full shadow hover:bg-red-50"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* New Image Previews */}
                  {imagePreviewUrls.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`New ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg border-2 border-dashed border-primary"
                          />
                          <span className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">New</span>
                          <button
                            onClick={() => removePreviewImage(index)}
                            className="absolute top-1 right-1 p-1 bg-white rounded-full shadow hover:bg-red-50"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Button */}
                  {(existingImages.length + uploadedImages.length) < 4 && (
                    <div className="border-2 border-dashed border-border rounded-xl p-8 bg-muted/30">
                      <div className="flex flex-col items-center justify-center text-center">
                        <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">Drop images here or click to upload</p>
                        <p className="text-xs text-muted-foreground mb-3">
                          {4 - existingImages.length - uploadedImages.length} slots remaining
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageSelect}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Choose Files
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Visibility & Bestseller */}
                <div className="bg-muted/30 rounded-xl p-4 space-y-4">
                  <h4 className="font-medium">Visibility & Tags</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Active</span>
                      <p className="text-xs text-muted-foreground">Show product in store</p>
                    </div>
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Bestseller</span>
                      <p className="text-xs text-muted-foreground">Feature on homepage</p>
                    </div>
                    <Switch
                      checked={formData.is_bestseller}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_bestseller: checked })}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                <div className="bg-white border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Product Details</h4>
                    <Badge variant="outline">
                      Status: {formData.is_active ? "Active" : "Draft"}
                    </Badge>
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-2 mb-4">
                      <TabsTrigger value="general">General</TabsTrigger>
                      <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Product Name *</label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Royal Oudh Perfume"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Type *</label>
                          <Select
                            value={formData.type}
                            onValueChange={(v) => setFormData({ ...formData, type: v as "perfume" | "attar" })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="perfume">Perfume</SelectItem>
                              <SelectItem value="attar">Attar (Alcohol-free)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">SKU *</label>
                          <Input
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            placeholder="RIM-XXX-0001"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Category *</label>
                          <Select
                            value={formData.category}
                            onValueChange={(v) => setFormData({ ...formData, category: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Gender *</label>
                          <Select
                            value={formData.gender}
                            onValueChange={(v) => setFormData({ ...formData, gender: v as "men" | "women" | "unisex" })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {genderOptions.map((g) => (
                                <SelectItem key={g.id} value={g.id}>
                                  {g.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Price (₹) *</label>
                          <Input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Discount (%)</label>
                          <Input
                            type="number"
                            value={formData.discount}
                            onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                            placeholder="e.g. 15"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Concentration</label>
                        <Select
                          value={formData.concentration}
                          onValueChange={(v) => setFormData({ ...formData, concentration: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {concentrationOptions.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Short Description</label>
                        <Textarea
                          value={formData.short_description}
                          onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                          placeholder="Brief product tagline (max 150 chars)"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Description</label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Detailed product description..."
                          rows={4}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Stock Quantity</label>
                          <Input
                            type="number"
                            value={formData.stock_quantity}
                            onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Min Order Threshold</label>
                          <Input
                            type="number"
                            value={formData.min_order_threshold}
                            onChange={(e) => setFormData({ ...formData, min_order_threshold: Number(e.target.value) })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Watching Count (Social Proof)</label>
                        <Input
                          type="number"
                          value={formData.watching_count}
                          onChange={(e) => setFormData({ ...formData, watching_count: Number(e.target.value) })}
                          placeholder="Number of people watching"
                        />
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Fragrance Notes</h4>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Top Notes</label>
                            <Input
                              value={formData.top_notes.join(", ")}
                              onChange={(e) => handleNotesChange("top", e.target.value)}
                              placeholder="Rose, Jasmine, Bergamot"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Middle Notes</label>
                            <Input
                              value={formData.middle_notes.join(", ")}
                              onChange={(e) => handleNotesChange("middle", e.target.value)}
                              placeholder="Peony, Lily, Violet"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Base Notes</label>
                            <Input
                              value={formData.base_notes.join(", ")}
                              onChange={(e) => handleNotesChange("base", e.target.value)}
                              placeholder="Musk, Cedar, Vanilla"
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {viewingProduct && (
            <div className="space-y-6">
              <div className="flex gap-4">
                <img
                  src={viewingProduct.cover_image || viewingProduct.images?.[0]?.image || "/placeholder.svg"}
                  alt={viewingProduct.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-xl font-semibold">{viewingProduct.name}</h3>
                  <p className="text-muted-foreground">{viewingProduct.sku}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge>{viewingProduct.type}</Badge>
                    <Badge variant="outline">{viewingProduct.status}</Badge>
                    {viewingProduct.is_bestseller && (
                      <Badge className="bg-amber-100 text-amber-800">Bestseller</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Price:</span>
                  <span className="ml-2 font-medium">₹{viewingProduct.price}</span>
                  {viewingProduct.discount > 0 && (
                    <span className="ml-2 text-green-600">(-{viewingProduct.discount}%)</span>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground">Stock:</span>
                  <span className="ml-2 font-medium">{viewingProduct.stock_quantity}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Gender:</span>
                  <span className="ml-2 capitalize">{viewingProduct.gender}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Concentration:</span>
                  <span className="ml-2 uppercase">{viewingProduct.concentration}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Watching:</span>
                  <span className="ml-2">{viewingProduct.watching_count} people</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Min Order:</span>
                  <span className="ml-2">{viewingProduct.min_order_threshold}</span>
                </div>
              </div>
              
              {viewingProduct.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{viewingProduct.description}</p>
                </div>
              )}

              {(viewingProduct.top_notes?.length || viewingProduct.middle_notes?.length || viewingProduct.base_notes?.length) && (
                <div>
                  <h4 className="font-medium mb-2">Fragrance Notes</h4>
                  <div className="space-y-1 text-sm">
                    {viewingProduct.top_notes?.length > 0 && (
                      <p><span className="text-muted-foreground">Top:</span> {viewingProduct.top_notes.join(", ")}</p>
                    )}
                    {viewingProduct.middle_notes?.length > 0 && (
                      <p><span className="text-muted-foreground">Middle:</span> {viewingProduct.middle_notes.join(", ")}</p>
                    )}
                    {viewingProduct.base_notes?.length > 0 && (
                      <p><span className="text-muted-foreground">Base:</span> {viewingProduct.base_notes.join(", ")}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={() => { setIsViewDialogOpen(false); handleEdit(viewingProduct); }}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Product
                </Button>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Fragrances;
