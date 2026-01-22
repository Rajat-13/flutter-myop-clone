import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  AlertTriangle,
  Package,
  TrendingUp,
  TrendingDown,
  History,
  Save,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { allProducts } from "@/data/products";

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  currentStock: number;
  reorderLevel: number;
  costPerUnit: number;
  supplierName: string;
  lastRestocked: string;
  size: string;
  location: string;
}

interface StockMovement {
  id: string;
  productId: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  reason: string;
  date: string;
  performedBy: string;
}

// Sample inventory data
const sampleInventory: InventoryItem[] = allProducts.slice(0, 8).map((p, i) => ({
  id: `inv-${i + 1}`,
  productId: p.id,
  productName: p.name,
  productImage: p.image,
  sku: `RIM-${p.category.slice(0, 3).toUpperCase()}-${String(i + 1).padStart(4, "0")}`,
  currentStock: Math.floor(Math.random() * 100) + 10,
  reorderLevel: 20,
  costPerUnit: Math.floor(p.price * 0.4),
  supplierName: ["Fragrance House", "Aroma Suppliers", "Scent Masters"][i % 3],
  lastRestocked: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  size: ["8ml", "50ml", "100ml"][i % 3],
  location: `Warehouse ${String.fromCharCode(65 + (i % 3))}`,
}));

const sampleMovements: StockMovement[] = [
  { id: "1", productId: "1", type: "in", quantity: 50, reason: "Restock from supplier", date: "2024-01-20", performedBy: "Admin" },
  { id: "2", productId: "2", type: "out", quantity: 5, reason: "Order fulfillment", date: "2024-01-19", performedBy: "System" },
  { id: "3", productId: "1", type: "adjustment", quantity: -2, reason: "Damaged goods", date: "2024-01-18", performedBy: "Admin" },
];

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(sampleInventory);
  const [movements, setMovements] = useState<StockMovement[]>(sampleMovements);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustmentData, setAdjustmentData] = useState({ quantity: 0, type: "in", reason: "" });

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && item.currentStock <= item.reorderLevel) ||
      (stockFilter === "out" && item.currentStock === 0) ||
      (stockFilter === "healthy" && item.currentStock > item.reorderLevel);
    return matchesSearch && matchesStock;
  });

  const totalValue = inventory.reduce((sum, item) => sum + item.currentStock * item.costPerUnit, 0);
  const lowStockCount = inventory.filter(i => i.currentStock <= i.reorderLevel).length;
  const outOfStockCount = inventory.filter(i => i.currentStock === 0).length;
  const totalUnits = inventory.reduce((sum, i) => sum + i.currentStock, 0);

  const handleAdjustStock = (item: InventoryItem) => {
    setSelectedItem(item);
    setAdjustmentData({ quantity: 0, type: "in", reason: "" });
    setIsAdjustOpen(true);
  };

  const handleSaveAdjustment = () => {
    if (!selectedItem) return;

    const adjustedQty = adjustmentData.type === "out" ? -adjustmentData.quantity : adjustmentData.quantity;
    
    setInventory(inventory.map(item =>
      item.id === selectedItem.id
        ? { ...item, currentStock: Math.max(0, item.currentStock + adjustedQty) }
        : item
    ));

    setMovements([
      {
        id: Date.now().toString(),
        productId: selectedItem.productId,
        type: adjustmentData.type as "in" | "out" | "adjustment",
        quantity: adjustmentData.quantity,
        reason: adjustmentData.reason,
        date: new Date().toISOString().split('T')[0],
        performedBy: "Admin",
      },
      ...movements,
    ]);

    setIsAdjustOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">Inventory</h1>
          <p className="text-muted-foreground">Track stock levels and manage inventory</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Stock
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Package className="w-4 h-4" />
              <span className="text-xs">Total Units</span>
            </div>
            <p className="text-2xl font-bold">{totalUnits.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">Inventory Value</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">₹{totalValue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs">Low Stock</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">{lowStockCount}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600 mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs">Out of Stock</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by product name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="healthy">Healthy</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase">Product</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase">SKU</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase">Size</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase">Stock</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">Reorder Level</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase hidden lg:table-cell">Cost/Unit</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase hidden lg:table-cell">Supplier</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase hidden xl:table-cell">Location</th>
                  <th className="text-right py-4 px-4 text-xs font-medium text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span className="font-medium text-sm">{item.productName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">{item.sku}</code>
                    </td>
                    <td className="py-4 px-4 text-sm">{item.size}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${
                          item.currentStock === 0 ? 'text-red-600' :
                          item.currentStock <= item.reorderLevel ? 'text-amber-600' :
                          'text-emerald-600'
                        }`}>
                          {item.currentStock}
                        </span>
                        {item.currentStock <= item.reorderLevel && item.currentStock > 0 && (
                          <Badge variant="outline" className="text-amber-600 border-amber-300 text-xs">
                            Low
                          </Badge>
                        )}
                        {item.currentStock === 0 && (
                          <Badge variant="outline" className="text-red-600 border-red-300 text-xs">
                            Out
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell text-sm">{item.reorderLevel}</td>
                    <td className="py-4 px-4 hidden lg:table-cell">
                      <span className="font-medium">₹{item.costPerUnit}</span>
                    </td>
                    <td className="py-4 px-4 hidden lg:table-cell text-sm text-muted-foreground">
                      {item.supplierName}
                    </td>
                    <td className="py-4 px-4 hidden xl:table-cell text-sm text-muted-foreground">
                      {item.location}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAdjustStock(item)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Adjust
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Movements */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent Stock Movements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {movements.slice(0, 5).map((movement) => (
              <div key={movement.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium text-sm">
                    {inventory.find(i => i.productId === movement.productId)?.productName || "Unknown Product"}
                  </p>
                  <p className="text-xs text-muted-foreground">{movement.reason}</p>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${
                    movement.type === "in" ? "text-emerald-600" :
                    movement.type === "out" ? "text-red-600" :
                    "text-amber-600"
                  }`}>
                    {movement.type === "out" ? "-" : movement.type === "in" ? "+" : "±"}
                    {movement.quantity}
                  </span>
                  <p className="text-xs text-muted-foreground">{movement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Adjust Stock Dialog */}
      <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Stock - {selectedItem?.productName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Current Stock</p>
              <p className="text-2xl font-bold">{selectedItem?.currentStock} units</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select
                  value={adjustmentData.type}
                  onValueChange={(v) => setAdjustmentData(prev => ({ ...prev, type: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">Stock In</SelectItem>
                    <SelectItem value="out">Stock Out</SelectItem>
                    <SelectItem value="adjustment">Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min={0}
                  value={adjustmentData.quantity}
                  onChange={(e) => setAdjustmentData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div>
              <Label>Reason</Label>
              <Textarea
                placeholder="Enter reason for adjustment..."
                value={adjustmentData.reason}
                onChange={(e) => setAdjustmentData(prev => ({ ...prev, reason: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdjustOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveAdjustment}>
              <Save className="w-4 h-4 mr-2" />
              Save Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
