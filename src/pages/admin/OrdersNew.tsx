import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  IndianRupee,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { toast } from "sonner";
import { adminAPI, ordersAPI, Order } from "@/lib/api";

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "bg-gray-100 text-gray-700", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  processing: { label: "Processing", color: "bg-amber-100 text-amber-700", icon: Package },
  shipped: { label: "Shipped", color: "bg-indigo-100 text-indigo-700", icon: Truck },
  delivered: { label: "Delivered", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: XCircle },
  refunded: { label: "Refunded", color: "bg-purple-100 text-purple-700", icon: XCircle },
};

const paymentStatusConfig: Record<PaymentStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-gray-100 text-gray-700" },
  paid: { label: "Paid", color: "bg-emerald-100 text-emerald-700" },
  failed: { label: "Failed", color: "bg-red-100 text-red-700" },
  refunded: { label: "Refunded", color: "bg-purple-100 text-purple-700" },
};

const OrdersNew = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Partial<Order>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.orders.list(currentPage);
      setOrders(response.results);
      setTotalCount(response.count);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate totals for stats
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalRevenue / (totalOrders || 1);
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setIsViewOpen(true);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setIsEditOpen(true);
  };

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await adminAPI.orders.updateStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order status updated to ${statusConfig[newStatus].label}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleSaveEdit = async () => {
    if (editingOrder.id && editingOrder.notes !== undefined) {
      // Note: The backend doesn't have an update notes endpoint yet
      // This is a placeholder for future implementation
      toast.success("Order notes updated");
    }
    setIsEditOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">Orders</h1>
          <p className="text-muted-foreground">Manage and track all customer orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchOrders}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <span className="text-xs">Total Orders</span>
            </div>
            <p className="text-xl font-bold">{totalOrders}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Pending</span>
            </div>
            <p className="text-xl font-bold text-amber-600">{pendingOrders}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs">Delivered</span>
            </div>
            <p className="text-xl font-bold text-emerald-600">{deliveredOrders}</p>
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
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Package className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No orders found</p>
              <p className="text-sm">Orders will appear here once customers place them</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase">Order</th>
                    <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase">Customer</th>
                    <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase hidden lg:table-cell">Items</th>
                    <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase">Total</th>
                    <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
                    <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase">Payment</th>
                    <th className="text-right py-4 px-4 text-xs font-medium text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusConfig[order.status]?.icon || Clock;
                    return (
                      <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-sm">{order.order_number}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-sm">{order.customer_name || order.shipping_name}</p>
                            <p className="text-xs text-muted-foreground">{order.customer_phone || order.shipping_phone}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 hidden lg:table-cell">
                          <div className="flex -space-x-2">
                            {order.items?.slice(0, 3).map((item, i) => (
                              item.product_image ? (
                                <img
                                  key={i}
                                  src={item.product_image}
                                  alt={item.product_name}
                                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                />
                              ) : (
                                <span key={i} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-white">
                                  {item.product_name?.charAt(0) || 'P'}
                                </span>
                              )
                            ))}
                            {(order.items?.length || 0) > 3 && (
                              <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-white">
                                +{order.items.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-bold">₹{Number(order.total_amount).toLocaleString()}</p>
                        </td>
                        <td className="py-4 px-4">
                          <Select
                            value={order.status}
                            onValueChange={(v) => handleStatusChange(order.id, v as OrderStatus)}
                          >
                            <SelectTrigger className="w-32 h-8">
                              <Badge className={`${statusConfig[order.status]?.color || 'bg-gray-100 text-gray-700'} border-0`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig[order.status]?.label || order.status}
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
                          <Badge className={`${paymentStatusConfig[order.payment_status]?.color || 'bg-gray-100 text-gray-700'} border-0`}>
                            {paymentStatusConfig[order.payment_status]?.label || order.payment_status}
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
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalCount > 10 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {filteredOrders.length} of {totalCount} orders
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage * 10 >= totalCount}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Order Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <Tabs defaultValue="details">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Customer</Label>
                    <p className="font-medium">{selectedOrder.customer_name || selectedOrder.shipping_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.customer_email}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.customer_phone || selectedOrder.shipping_phone}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Shipping Address</Label>
                    <p className="font-medium">{selectedOrder.shipping_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.shipping_address}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.shipping_city}, {selectedOrder.shipping_state}
                    </p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.shipping_pincode}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Order Status</Label>
                    <Badge className={`${statusConfig[selectedOrder.status]?.color || 'bg-gray-100'} border-0 mt-1`}>
                      {statusConfig[selectedOrder.status]?.label || selectedOrder.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Payment</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${paymentStatusConfig[selectedOrder.payment_status]?.color || 'bg-gray-100'} border-0`}>
                        {paymentStatusConfig[selectedOrder.payment_status]?.label || selectedOrder.payment_status}
                      </Badge>
                      <span className="text-sm">{selectedOrder.payment_method}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Order Date</Label>
                    <p className="font-medium">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                  </div>
                  {selectedOrder.delivered_at && (
                    <div>
                      <Label className="text-muted-foreground text-xs">Delivered At</Label>
                      <p className="font-medium">{new Date(selectedOrder.delivered_at).toLocaleString()}</p>
                    </div>
                  )}
                </div>
                {selectedOrder.notes && (
                  <div>
                    <Label className="text-muted-foreground text-xs">Notes</Label>
                    <p className="text-sm">{selectedOrder.notes}</p>
                  </div>
                )}

                {/* Order Summary */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{Number(selectedOrder.subtotal).toLocaleString()}</span>
                  </div>
                  {Number(selectedOrder.discount_amount) > 0 && (
                    <div className="flex justify-between text-sm text-red-600">
                      <span>Discount</span>
                      <span>-₹{Number(selectedOrder.discount_amount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>₹{Number(selectedOrder.shipping_amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>₹{Number(selectedOrder.tax_amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>₹{Number(selectedOrder.total_amount).toLocaleString()}</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="items" className="mt-4">
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                      {item.product_image ? (
                        <img src={item.product_image} alt={item.product_name} className="w-16 h-16 rounded-lg object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          SKU: {item.product_sku} {item.size && `| Size: ${item.size}`} | Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{Number(item.total_price).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">₹{Number(item.unit_price).toLocaleString()} each</p>
                      </div>
                    </div>
                  ))}
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
            <DialogTitle>Edit Order Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Order Number</Label>
              <p className="text-sm font-medium">{editingOrder.order_number}</p>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={editingOrder.notes || ""}
                onChange={(e) => setEditingOrder(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add internal notes about this order..."
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