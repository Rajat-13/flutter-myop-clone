import { useState } from "react";
import { Search, Plus, Edit, Trash2, Eye, X, Upload, Save, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface Accessory {
  id: string;
  name: string;
  sku: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  category: string;
  stockQuantity: number;
  minOrderThreshold: number;
  isActive: boolean;
  tag?: string;
}

const defaultAccessories: Accessory[] = [
  {
    id: "1",
    name: "Perfume Atomizer",
    sku: "ACC-ATM-0001",
    price: 299,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop"],
    description: "Portable travel-sized atomizer for your favorite fragrance",
    category: "Travel",
    stockQuantity: 150,
    minOrderThreshold: 10,
    isActive: true,
  },
  {
    id: "2",
    name: "Gift Box Set",
    sku: "ACC-GFT-0002",
    price: 499,
    originalPrice: 699,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop"],
    description: "Elegant gift box with ribbon and card",
    category: "Gift",
    stockQuantity: 75,
    minOrderThreshold: 5,
    isActive: true,
    tag: "Best Seller",
  },
  {
    id: "3",
    name: "Perfume Tray",
    sku: "ACC-TRY-0003",
    price: 799,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop"],
    description: "Luxurious display tray for your collection",
    category: "Display",
    stockQuantity: 30,
    minOrderThreshold: 5,
    isActive: true,
  },
  {
    id: "4",
    name: "Sample Set",
    sku: "ACC-SMP-0004",
    price: 599,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop"],
    description: "Try 5 of our bestselling fragrances",
    category: "Sample",
    stockQuantity: 200,
    minOrderThreshold: 20,
    isActive: true,
    tag: "New",
  },
];

const categories = ["Travel", "Gift", "Display", "Sample", "Storage", "Refill"];
const ITEMS_PER_PAGE = 8;

const AccessoriesAdmin = () => {
  const [accessories, setAccessories] = useState<Accessory[]>(defaultAccessories);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(null);
  const [viewingAccessory, setViewingAccessory] = useState<Accessory | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  const [formData, setFormData] = useState<Partial<Accessory>>({
    name: "",
    sku: "",
    price: 0,
    originalPrice: undefined,
    image: "",
    images: [],
    description: "",
    category: "Travel",
    stockQuantity: 50,
    minOrderThreshold: 5,
    isActive: true,
    tag: "",
  });

  const [additionalImages, setAdditionalImages] = useState<string[]>(["", "", ""]);

  const filteredAccessories = accessories.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || 
                          (statusFilter === "active" && item.isActive) ||
                          (statusFilter === "inactive" && !item.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAccessories.length / ITEMS_PER_PAGE);
  const paginatedAccessories = filteredAccessories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCreateNew = () => {
    setEditingAccessory(null);
    setFormData({
      name: "",
      sku: `ACC-NEW-${String(accessories.length + 1).padStart(4, "0")}`,
      price: 0,
      originalPrice: undefined,
      image: "",
      images: [],
      description: "",
      category: "Travel",
      stockQuantity: 50,
      minOrderThreshold: 5,
      isActive: true,
      tag: "",
    });
    setAdditionalImages(["", "", ""]);
    setActiveTab("general");
    setIsDialogOpen(true);
  };

  const handleEdit = (accessory: Accessory) => {
    setEditingAccessory(accessory);
    setFormData({ ...accessory });
    setAdditionalImages([
      accessory.images[1] || "",
      accessory.images[2] || "",
      accessory.images[3] || "",
    ]);
    setActiveTab("general");
    setIsDialogOpen(true);
  };

  const handleView = (accessory: Accessory) => {
    setViewingAccessory(accessory);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this accessory?")) {
      setAccessories(accessories.filter((a) => a.id !== id));
      toast({ title: "Deleted", description: "Accessory removed successfully." });
    }
  };

  const handleToggleActive = (id: string) => {
    setAccessories(accessories.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    ));
  };

  const handleSave = () => {
    const allImages = [formData.image, ...additionalImages].filter(Boolean) as string[];
    
    if (editingAccessory) {
      setAccessories(
        accessories.map((a) =>
          a.id === editingAccessory.id ? { ...a, ...formData, images: allImages } as Accessory : a
        )
      );
      toast({ title: "Updated", description: "Accessory updated successfully." });
    } else {
      const newAccessory: Accessory = {
        ...formData,
        id: Date.now().toString(),
        images: allImages,
      } as Accessory;
      setAccessories([...accessories, newAccessory]);
      toast({ title: "Created", description: "Accessory added successfully." });
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-charcoal">Accessories</h1>
          <p className="text-muted-foreground">Manage all accessory products</p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Accessory
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or SKU..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
          Showing {paginatedAccessories.length} of {filteredAccessories.length} accessories
        </span>
        <span className="text-muted-foreground">|</span>
        <span className="text-green-600">{accessories.filter(a => a.isActive).length} Active</span>
        <span className="text-red-500">{accessories.filter(a => !a.isActive).length} Inactive</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Product</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Category</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">SKU</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Price</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Stock</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAccessories.map((item) => (
                <tr key={item.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-charcoal">{item.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                        {item.tag && <Badge variant="outline" className="text-xs mt-1">{item.tag}</Badge>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">{item.category}</Badge>
                  </td>
                  <td className="p-4">
                    <code className="text-xs bg-muted px-2 py-1 rounded">{item.sku}</code>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium">₹{item.price}</p>
                      {item.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">₹{item.originalPrice}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`font-medium ${item.stockQuantity < item.minOrderThreshold ? 'text-red-500' : 'text-charcoal'}`}>
                      {item.stockQuantity}
                    </span>
                    {item.stockQuantity < item.minOrderThreshold && (
                      <p className="text-xs text-red-500">Low stock!</p>
                    )}
                  </td>
                  <td className="p-4">
                    <Switch
                      checked={item.isActive}
                      onCheckedChange={() => handleToggleActive(item.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleView(item)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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

        {filteredAccessories.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No accessories found matching your filters.
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</p>
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

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {editingAccessory ? "Edit Accessory" : "Add New Accessory"}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Perfume Atomizer"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>SKU *</Label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="ACC-ATM-0001"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this accessory..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tag (Optional)</Label>
                  <Input
                    value={formData.tag || ""}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="e.g., Best Seller, New"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Price (₹) *</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Original Price (₹)</Label>
                  <Input
                    type="number"
                    value={formData.originalPrice || ""}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                    placeholder="For discount display"
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-4 mt-4">
              <div>
                <Label>Main Image URL *</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                  />
                  <Button variant="outline" size="icon">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg mt-2"
                  />
                )}
              </div>

              <div>
                <Label>Additional Images</Label>
                <div className="grid md:grid-cols-3 gap-4 mt-2">
                  {additionalImages.map((img, index) => (
                    <div key={index}>
                      <div className="flex gap-2">
                        <Input
                          value={img}
                          onChange={(e) => {
                            const newImages = [...additionalImages];
                            newImages[index] = e.target.value;
                            setAdditionalImages(newImages);
                          }}
                          placeholder={`Image ${index + 2} URL`}
                        />
                      </div>
                      {img && (
                        <img
                          src={img}
                          alt={`Preview ${index + 2}`}
                          className="w-24 h-24 object-cover rounded-lg mt-2"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Stock Quantity</Label>
                  <Input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Minimum Order Threshold</Label>
                  <Input
                    type="number"
                    value={formData.minOrderThreshold}
                    onChange={(e) => setFormData({ ...formData, minOrderThreshold: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Alert when stock falls below this</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label>Active Status</Label>
                  <p className="text-xs text-muted-foreground">Show this accessory on the website</p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {editingAccessory ? "Update" : "Create"} Accessory
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Accessory Details</DialogTitle>
          </DialogHeader>
          {viewingAccessory && (
            <div className="space-y-4 mt-4">
              <div className="flex gap-4">
                <img
                  src={viewingAccessory.image}
                  alt={viewingAccessory.name}
                  className="w-32 h-32 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{viewingAccessory.name}</h3>
                  <p className="text-sm text-muted-foreground">{viewingAccessory.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{viewingAccessory.category}</Badge>
                    {viewingAccessory.tag && <Badge>{viewingAccessory.tag}</Badge>}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">SKU:</span>
                  <code className="ml-2 bg-muted px-2 py-0.5 rounded">{viewingAccessory.sku}</code>
                </div>
                <div>
                  <span className="text-muted-foreground">Price:</span>
                  <span className="ml-2 font-semibold">₹{viewingAccessory.price}</span>
                  {viewingAccessory.originalPrice && (
                    <span className="ml-2 line-through text-muted-foreground">₹{viewingAccessory.originalPrice}</span>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground">Stock:</span>
                  <span className="ml-2">{viewingAccessory.stockQuantity}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className="ml-2" variant={viewingAccessory.isActive ? "default" : "secondary"}>
                    {viewingAccessory.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccessoriesAdmin;
