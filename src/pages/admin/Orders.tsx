import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Loader2,
  Package,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { adminAPI, Order } from "@/lib/api";

const statusColors: Record<string, string> = {
  delivered: "bg-emerald-100 text-emerald-700",
  shipped: "bg-blue-100 text-blue-700",
  processing: "bg-amber-100 text-amber-700",
  pending: "bg-gray-100 text-gray-700",
  confirmed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-purple-100 text-purple-700",
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await adminAPI.orders.updateStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus as Order['status'] } : o));
      toast.success("Order status updated");
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update order status");
    }
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
      {/* Page Header */}
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
          <Button className="w-fit">
            <Download className="w-4 h-4 mr-2" />
            Export Orders
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID or customer..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Date</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Total</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="py-4 px-4 text-sm font-medium">{order.order_number}</td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm font-medium">{order.customer_name || order.shipping_name}</p>
                          <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground hidden md:table-cell">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold">₹{Number(order.total_amount).toLocaleString()}</td>
                      <td className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'processing')}>
                              Mark Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'shipped')}>
                              Mark Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'delivered')}>
                              Mark Delivered
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {filteredOrders.length} of {totalCount} orders
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                {currentPage}
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
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedOrder.customer_name || selectedOrder.shipping_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedOrder.customer_phone || selectedOrder.shipping_phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full capitalize ${statusColors[selectedOrder.status] || 'bg-gray-100 text-gray-700'}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Shipping Address</p>
                <p className="font-medium">{selectedOrder.shipping_name}</p>
                <p className="text-sm">{selectedOrder.shipping_address}</p>
                <p className="text-sm">{selectedOrder.shipping_city}, {selectedOrder.shipping_state} - {selectedOrder.shipping_pincode}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Order Items</p>
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-start py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        SKU: {item.product_sku} {item.size && `| Size: ${item.size}`} | Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">₹{Number(item.total_price).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{Number(selectedOrder.subtotal).toLocaleString()}</span>
                </div>
                {Number(selectedOrder.discount_amount) > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Discount</span>
                    <span>-₹{Number(selectedOrder.discount_amount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>₹{Number(selectedOrder.shipping_amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>₹{Number(selectedOrder.tax_amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>₹{Number(selectedOrder.total_amount).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedOrder(null)}>Close</Button>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => {
                    handleStatusUpdate(selectedOrder.id, value);
                    setSelectedOrder({ ...selectedOrder, status: value as Order['status'] });
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;