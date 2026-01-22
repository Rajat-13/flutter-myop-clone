import { useState } from "react";
import {
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  IndianRupee,
  TrendingUp,
  Calculator,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { allProducts } from "@/data/products";

interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  cogs: number; // Cost of goods sold
  size: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  cogs: number; // Total COGS for order
  cac: number; // Customer acquisition cost
  logistics: number; // Actual logistics/shipping cost
  netRevenue: number;
  ebitda: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: string;
  createdAt: string;
  notes: string;
}

// Sample orders with unit economics
const sampleOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    customer: { name: "Rahul Sharma", email: "rahul@email.com", phone: "+91 98765 43210" },
    shippingAddress: { address: "123 MG Road", city: "Mumbai", state: "Maharashtra", pincode: "400001" },
    items: [
      { productId: "1", productName: "Sandal Veer", productImage: allProducts[0]?.image || "", quantity: 2, unitPrice: 1129, cogs: 450, size: "50ml" },
    ],
    subtotal: 2258,
    discount: 200,
    shippingCost: 0,
    tax: 175,
    total: 2233,
    cogs: 900,
    cac: 150,
    logistics: 85,
    netRevenue: 2033,
    ebitda: 898,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "UPI",
    createdAt: "2024-01-20T10:30:00",
    notes: "",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    customer: { name: "Priya Mehta", email: "priya@email.com", phone: "+91 87654 32109" },
    shippingAddress: { address: "456 Park Street", city: "Delhi", state: "Delhi", pincode: "110001" },
    items: [
      { productId: "2", productName: "Flora Bliss", productImage: allProducts[1]?.image || "", quantity: 1, unitPrice: 899, cogs: 350, size: "50ml" },
      { productId: "3", productName: "Purple Mystique", productImage: allProducts[2]?.image || "", quantity: 1, unitPrice: 499, cogs: 200, size: "8ml" },
    ],
    subtotal: 1398,
    discount: 0,
    shippingCost: 50,
    tax: 120,
    total: 1568,
    cogs: 550,
    cac: 200,
    logistics: 95,
    netRevenue: 1368,
    ebitda: 523,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "Card",
    createdAt: "2024-01-19T14:45:00",
    notes: "Handle with care",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    customer: { name: "Amit Kumar", email: "amit@email.com", phone: "+91 76543 21098" },
    shippingAddress: { address: "789 Lake View", city: "Bangalore", state: "Karnataka", pincode: "560001" },
    items: [
      { productId: "9", productName: "Spicy Oud", productImage: allProducts[8]?.image || "", quantity: 1, unitPrice: 899, cogs: 380, size: "100ml" },
    ],
    subtotal: 899,
    discount: 100,
    shippingCost: 0,
    tax: 68,
    total: 867,
    cogs: 380,
    cac: 100,
    logistics: 75,
    netRevenue: 767,
    ebitda: 212,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "COD",
    createdAt: "2024-01-18T09:15:00",
    notes: "",
  },
];

const statusConfig = {
  pending: { label: "Pending", color: "bg-gray-100 text-gray-700", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  processing: { label: "Processing", color: "bg-amber-100 text-amber-700", icon: Package },
  shipped: { label: "Shipped", color: "bg-indigo-100 text-indigo-700", icon: Truck },
  delivered: { label: "Delivered", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: XCircle },
};

const paymentStatusConfig = {
  pending: { label: "Pending", color: "bg-gray-100 text-gray-700" },
  paid: { label: "Paid", color: "bg-emerald-100 text-emerald-700" },
  failed: { label: "Failed", color: "bg-red-100 text-red-700" },
  refunded: { label: "Refunded", color: "bg-purple-100 text-purple-700" },
};

const OrdersNew = () => {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Partial<Order>>({});

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate totals for stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalCogs = orders.reduce((sum, o) => sum + o.cogs, 0);
  const totalCac = orders.reduce((sum, o) => sum + o.cac, 0);
  const totalLogistics = orders.reduce((sum, o) => sum + o.logistics, 0);
  const totalEbitda = orders.reduce((sum, o) => sum + o.ebitda, 0);
  const avgOrderValue = totalRevenue / (orders.length || 1);

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setIsViewOpen(true);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setIsEditOpen(true);
  };

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleDelete = (orderId: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      setOrders(orders.filter(o => o.id !== orderId));
    }
  };

  const handleSaveEdit = () => {
    if (editingOrder.id) {
      setOrders(orders.map(o => o.id === editingOrder.id ? { ...o, ...editingOrder } as Order : o));
    }
    setIsEditOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">Orders</h1>
          <p className="text-muted-foreground">Track orders with full unit economics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Order
          </Button>
        </div>
      </div>

      {/* Unit Economics Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <IndianRupee className="w-4 h-4" />
              <span className="text-xs">Revenue</span>
            </div>
            <p className="text-xl font-bold">₹{totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Package className="w-4 h-4" />
              <span className="text-xs">COGS</span>
            </div>
            <p className="text-xl font-bold text-orange-600">₹{totalCogs.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">CAC</span>
            </div>
            <p className="text-xl font-bold text-blue-600">₹{totalCac.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Truck className="w-4 h-4" />
              <span className="text-xs">Logistics</span>
            </div>
            <p className="text-xl font-bold text-purple-600">₹{totalLogistics.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calculator className="w-4 h-4" />
              <span className="text-xs">EBITDA</span>
            </div>
            <p className="text-xl font-bold text-emerald-600">₹{totalEbitda.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <IndianRupee className="w-4 h-4" />
              <span className="text-xs">Avg Order</span>
            </div>
            <p className="text-xl font-bold">₹{avgOrderValue.toFixed(0)}</p>
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
                placeholder="Search by order number or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase">Order</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase">Customer</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase hidden lg:table-cell">Items</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase">Total</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase hidden xl:table-cell">COGS</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase hidden xl:table-cell">EBITDA</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase">Payment</th>
                  <th className="text-right py-4 px-4 text-xs font-medium text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status].icon;
                  return (
                    <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-sm">{order.orderNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-sm">{order.customer.name}</p>
                          <p className="text-xs text-muted-foreground">{order.customer.phone}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item, i) => (
                            <img
                              key={i}
                              src={item.productImage}
                              alt={item.productName}
                              className="w-8 h-8 rounded-full border-2 border-white object-cover"
                            />
                          ))}
                          {order.items.length > 3 && (
                            <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-white">
                              +{order.items.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-bold">₹{order.total.toLocaleString()}</p>
                      </td>
                      <td className="py-4 px-4 hidden xl:table-cell">
                        <p className="text-orange-600 font-medium">₹{order.cogs.toLocaleString()}</p>
                      </td>
                      <td className="py-4 px-4 hidden xl:table-cell">
                        <p className={`font-bold ${order.ebitda > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          ₹{order.ebitda.toLocaleString()}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <Select
                          value={order.status}
                          onValueChange={(v) => handleStatusChange(order.id, v as Order["status"])}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <Badge className={`${statusConfig[order.status].color} border-0`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig[order.status].label}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusConfig).map(([key, config]) => (
                              <SelectItem key={key} value={key}>{config.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`${paymentStatusConfig[order.paymentStatus].color} border-0`}>
                          {paymentStatusConfig[order.paymentStatus].label}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleView(order)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleEdit(order)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Order Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <Tabs defaultValue="details">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="economics">Unit Economics</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Customer</Label>
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.customer.email}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.customer.phone}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Shipping Address</Label>
                    <p className="font-medium">{selectedOrder.shippingAddress.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                    </p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress.pincode}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Order Status</Label>
                    <Badge className={`${statusConfig[selectedOrder.status].color} border-0 mt-1`}>
                      {statusConfig[selectedOrder.status].label}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Payment</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${paymentStatusConfig[selectedOrder.paymentStatus].color} border-0`}>
                        {paymentStatusConfig[selectedOrder.paymentStatus].label}
                      </Badge>
                      <span className="text-sm">{selectedOrder.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="items" className="mt-4">
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                      <img src={item.productImage} alt={item.productName} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">Size: {item.size} | Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{(item.unitPrice * item.quantity).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">COGS: ₹{item.cogs}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="economics" className="mt-4">
                <div className="space-y-3 bg-muted/30 rounded-lg p-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Discount</span>
                    <span>-₹{selectedOrder.discount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping (Customer)</span>
                    <span>₹{selectedOrder.shippingCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{selectedOrder.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total</span>
                    <span>₹{selectedOrder.total.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3 mt-3 space-y-2">
                    <div className="flex justify-between text-orange-600">
                      <span>COGS</span>
                      <span>-₹{selectedOrder.cogs.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-blue-600">
                      <span>CAC</span>
                      <span>-₹{selectedOrder.cac.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-purple-600">
                      <span>Logistics</span>
                      <span>-₹{selectedOrder.logistics.toLocaleString()}</span>
                    </div>
                    <div className={`flex justify-between font-bold text-lg border-t pt-2 ${selectedOrder.ebitda > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      <span>EBITDA</span>
                      <span>₹{selectedOrder.ebitda.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Margin: {((selectedOrder.ebitda / selectedOrder.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Order Costs</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>COGS (₹)</Label>
                <Input
                  type="number"
                  value={editingOrder.cogs || 0}
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, cogs: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label>CAC (₹)</Label>
                <Input
                  type="number"
                  value={editingOrder.cac || 0}
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, cac: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label>Logistics (₹)</Label>
                <Input
                  type="number"
                  value={editingOrder.logistics || 0}
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, logistics: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label>Discount (₹)</Label>
                <Input
                  type="number"
                  value={editingOrder.discount || 0}
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, discount: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={editingOrder.notes || ""}
                onChange={(e) => setEditingOrder(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersNew;
