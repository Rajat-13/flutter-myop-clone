import { useState } from "react";
import {
  Search,
  Plus,
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  IndianRupee,
  Edit,
  Eye,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Shipment {
  id: string;
  orderId: string;
  orderNumber: string;
  customer: string;
  destination: {
    city: string;
    state: string;
    pincode: string;
  };
  carrier: string;
  trackingNumber: string;
  status: "pending" | "picked" | "in_transit" | "out_for_delivery" | "delivered" | "returned";
  weight: number;
  dimensions: string;
  shippingCost: number;
  actualCost: number;
  profit: number;
  estimatedDelivery: string;
  actualDelivery?: string;
  createdAt: string;
}

interface Carrier {
  id: string;
  name: string;
  code: string;
  baseRate: number;
  perKgRate: number;
  codCharge: number;
  avgDeliveryDays: number;
  performance: number;
}

const sampleShipments: Shipment[] = [
  {
    id: "1",
    orderId: "1",
    orderNumber: "ORD-2024-001",
    customer: "Rahul Sharma",
    destination: { city: "Mumbai", state: "Maharashtra", pincode: "400001" },
    carrier: "Delhivery",
    trackingNumber: "DLV123456789",
    status: "delivered",
    weight: 0.5,
    dimensions: "15x10x8 cm",
    shippingCost: 0,
    actualCost: 65,
    profit: -65,
    estimatedDelivery: "2024-01-22",
    actualDelivery: "2024-01-21",
    createdAt: "2024-01-20",
  },
  {
    id: "2",
    orderId: "2",
    orderNumber: "ORD-2024-002",
    customer: "Priya Mehta",
    destination: { city: "Delhi", state: "Delhi", pincode: "110001" },
    carrier: "BlueDart",
    trackingNumber: "BD987654321",
    status: "in_transit",
    weight: 0.8,
    dimensions: "20x12x10 cm",
    shippingCost: 50,
    actualCost: 85,
    profit: -35,
    estimatedDelivery: "2024-01-23",
    createdAt: "2024-01-19",
  },
  {
    id: "3",
    orderId: "3",
    orderNumber: "ORD-2024-003",
    customer: "Amit Kumar",
    destination: { city: "Bangalore", state: "Karnataka", pincode: "560001" },
    carrier: "DTDC",
    trackingNumber: "DTDC456789123",
    status: "out_for_delivery",
    weight: 0.3,
    dimensions: "12x8x6 cm",
    shippingCost: 0,
    actualCost: 55,
    profit: -55,
    estimatedDelivery: "2024-01-21",
    createdAt: "2024-01-18",
  },
];

const carriers: Carrier[] = [
  { id: "1", name: "Delhivery", code: "DLV", baseRate: 40, perKgRate: 25, codCharge: 30, avgDeliveryDays: 3, performance: 92 },
  { id: "2", name: "BlueDart", code: "BD", baseRate: 60, perKgRate: 35, codCharge: 40, avgDeliveryDays: 2, performance: 95 },
  { id: "3", name: "DTDC", code: "DTDC", baseRate: 35, perKgRate: 20, codCharge: 25, avgDeliveryDays: 4, performance: 88 },
  { id: "4", name: "Ecom Express", code: "ECM", baseRate: 45, perKgRate: 28, codCharge: 35, avgDeliveryDays: 3, performance: 90 },
];

const statusConfig = {
  pending: { label: "Pending", color: "bg-gray-100 text-gray-700", icon: Clock },
  picked: { label: "Picked Up", color: "bg-blue-100 text-blue-700", icon: Package },
  in_transit: { label: "In Transit", color: "bg-indigo-100 text-indigo-700", icon: Truck },
  out_for_delivery: { label: "Out for Delivery", color: "bg-amber-100 text-amber-700", icon: MapPin },
  delivered: { label: "Delivered", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  returned: { label: "Returned", color: "bg-red-100 text-red-700", icon: AlertTriangle },
};

const Logistics = () => {
  const [shipments, setShipments] = useState<Shipment[]>(sampleShipments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [carrierFilter, setCarrierFilter] = useState("all");
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCost, setEditingCost] = useState(0);

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter;
    const matchesCarrier = carrierFilter === "all" || shipment.carrier === carrierFilter;
    return matchesSearch && matchesStatus && matchesCarrier;
  });

  const totalShippingCost = shipments.reduce((sum, s) => sum + s.actualCost, 0);
  const avgDeliveryCost = totalShippingCost / (shipments.length || 1);
  const deliveredCount = shipments.filter(s => s.status === "delivered").length;
  const returnedCount = shipments.filter(s => s.status === "returned").length;
  const inTransitCount = shipments.filter(s => ["picked", "in_transit", "out_for_delivery"].includes(s.status)).length;

  const handleUpdateCost = () => {
    if (!selectedShipment) return;
    setShipments(shipments.map(s =>
      s.id === selectedShipment.id
        ? { ...s, actualCost: editingCost, profit: s.shippingCost - editingCost }
        : s
    ));
    setIsEditOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">Logistics</h1>
          <p className="text-muted-foreground">Track shipments and manage delivery costs</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Shipment
        </Button>
      </div>

      <Tabs defaultValue="shipments">
        <TabsList>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="carriers">Carriers</TabsTrigger>
        </TabsList>

        <TabsContent value="shipments" className="space-y-6 mt-4">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Truck className="w-4 h-4" />
                  <span className="text-xs">In Transit</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{inTransitCount}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs">Delivered</span>
                </div>
                <p className="text-2xl font-bold text-emerald-600">{deliveredCount}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs">Returned</span>
                </div>
                <p className="text-2xl font-bold text-red-600">{returnedCount}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <IndianRupee className="w-4 h-4" />
                  <span className="text-xs">Total Cost</span>
                </div>
                <p className="text-2xl font-bold">₹{totalShippingCost.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <IndianRupee className="w-4 h-4" />
                  <span className="text-xs">Avg Cost</span>
                </div>
                <p className="text-2xl font-bold">₹{avgDeliveryCost.toFixed(0)}</p>
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
                    placeholder="Search by order, tracking, or customer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={carrierFilter} onValueChange={setCarrierFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Carriers</SelectItem>
                    {carriers.map(c => (
                      <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Shipments Table */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase">Order</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase">Customer</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">Carrier</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase hidden lg:table-cell">Tracking</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase hidden xl:table-cell">Charged</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase">Actual Cost</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase hidden xl:table-cell">Profit/Loss</th>
                      <th className="text-right py-4 px-4 text-xs font-medium text-muted-foreground uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredShipments.map((shipment) => {
                      const StatusIcon = statusConfig[shipment.status].icon;
                      return (
                        <tr key={shipment.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                          <td className="py-4 px-4">
                            <p className="font-medium text-sm">{shipment.orderNumber}</p>
                            <p className="text-xs text-muted-foreground">{shipment.createdAt}</p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-medium text-sm">{shipment.customer}</p>
                            <p className="text-xs text-muted-foreground">
                              {shipment.destination.city}, {shipment.destination.state}
                            </p>
                          </td>
                          <td className="py-4 px-4 hidden md:table-cell">
                            <Badge variant="outline">{shipment.carrier}</Badge>
                          </td>
                          <td className="py-4 px-4 hidden lg:table-cell">
                            <code className="text-xs bg-muted px-2 py-1 rounded">{shipment.trackingNumber}</code>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={`${statusConfig[shipment.status].color} border-0`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig[shipment.status].label}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 hidden xl:table-cell">
                            <span className="text-sm">₹{shipment.shippingCost}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-bold">₹{shipment.actualCost}</span>
                          </td>
                          <td className="py-4 px-4 hidden xl:table-cell">
                            <span className={`font-bold ${shipment.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {shipment.profit >= 0 ? '+' : ''}₹{shipment.profit}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => { setSelectedShipment(shipment); setIsViewOpen(true); }}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              </button>
                              <button
                                onClick={() => { setSelectedShipment(shipment); setEditingCost(shipment.actualCost); setIsEditOpen(true); }}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="carriers" className="mt-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {carriers.map((carrier) => (
              <Card key={carrier.id} className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {carrier.name}
                    <Badge variant="outline">{carrier.code}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Base Rate</p>
                      <p className="font-medium">₹{carrier.baseRate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Per Kg</p>
                      <p className="font-medium">₹{carrier.perKgRate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">COD Charge</p>
                      <p className="font-medium">₹{carrier.codCharge}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Avg Days</p>
                      <p className="font-medium">{carrier.avgDeliveryDays} days</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Performance</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${carrier.performance >= 90 ? 'bg-emerald-500' : carrier.performance >= 80 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${carrier.performance}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{carrier.performance}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Cost Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Shipping Cost</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Order</Label>
              <p className="font-medium">{selectedShipment?.orderNumber}</p>
            </div>
            <div>
              <Label>Actual Cost (₹)</Label>
              <Input
                type="number"
                value={editingCost}
                onChange={(e) => setEditingCost(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateCost}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Shipment Details</DialogTitle>
          </DialogHeader>
          {selectedShipment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Order</Label>
                  <p className="font-medium">{selectedShipment.orderNumber}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Customer</Label>
                  <p className="font-medium">{selectedShipment.customer}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Carrier</Label>
                  <p className="font-medium">{selectedShipment.carrier}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Tracking</Label>
                  <p className="font-medium text-sm">{selectedShipment.trackingNumber}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Weight</Label>
                  <p className="font-medium">{selectedShipment.weight} kg</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Dimensions</Label>
                  <p className="font-medium">{selectedShipment.dimensions}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Delivery Address</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedShipment.destination.city}, {selectedShipment.destination.state} - {selectedShipment.destination.pincode}
                </p>
              </div>
              <div className="border-t pt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Charged</p>
                  <p className="font-bold">₹{selectedShipment.shippingCost}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Actual</p>
                  <p className="font-bold">₹{selectedShipment.actualCost}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Profit/Loss</p>
                  <p className={`font-bold ${selectedShipment.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    ₹{selectedShipment.profit}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Logistics;
