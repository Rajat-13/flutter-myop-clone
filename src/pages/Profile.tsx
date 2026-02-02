import { useState } from "react";
import { User, MapPin, Plus, Edit2, Trash2, Check, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";

interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const Profile = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      label: "Home",
      fullName: "John Doe",
      phone: "+91 98765 43210",
      addressLine1: "123 Main Street, Apartment 4B",
      addressLine2: "Near Central Park",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      isDefault: true,
    },
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Partial<Address>>({
    label: "Home",
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const handleOpenDialog = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData(address);
    } else {
      setEditingAddress(null);
      setFormData({
        label: "Home",
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveAddress = () => {
    if (!formData.fullName || !formData.phone || !formData.addressLine1 || 
        !formData.city || !formData.state || !formData.pincode) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingAddress) {
      // Update existing address
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddress.id 
          ? { ...addr, ...formData } as Address
          : formData.isDefault ? { ...addr, isDefault: false } : addr
      ));
      toast.success("Address updated successfully");
    } else {
      // Add new address
      const newAddress: Address = {
        id: Date.now().toString(),
        label: formData.label || "Home",
        fullName: formData.fullName!,
        phone: formData.phone!,
        addressLine1: formData.addressLine1!,
        addressLine2: formData.addressLine2,
        city: formData.city!,
        state: formData.state!,
        pincode: formData.pincode!,
        isDefault: formData.isDefault || addresses.length === 0,
      };
      
      if (newAddress.isDefault) {
        setAddresses(prev => [...prev.map(a => ({ ...a, isDefault: false })), newAddress]);
      } else {
        setAddresses(prev => [...prev, newAddress]);
      }
      toast.success("Address added successfully");
    }
    
    setIsDialogOpen(false);
  };

  const handleDeleteAddress = (id: string) => {
    const addressToDelete = addresses.find(a => a.id === id);
    setAddresses(prev => {
      const filtered = prev.filter(addr => addr.id !== id);
      // If deleting default address, make first remaining one default
      if (addressToDelete?.isDefault && filtered.length > 0) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
    toast.success("Address deleted successfully");
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    toast.success("Default address updated");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container-wide px-4 lg:px-8">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal mb-8">
            My Profile
          </h1>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Info Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-border rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-charcoal">John Doe</h2>
                    <p className="text-muted-foreground text-sm">john.doe@email.com</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-medium text-charcoal">Jan 2024</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Total Orders</span>
                    <span className="font-medium text-charcoal">12</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Wishlist Items</span>
                    <span className="font-medium text-charcoal">5</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Addresses Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-semibold text-charcoal flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Saved Addresses
                </h2>
                <Button 
                  onClick={() => handleOpenDialog()}
                  className="bg-charcoal hover:bg-charcoal/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Address
                </Button>
              </div>
              
              {addresses.length === 0 ? (
                <div className="bg-muted/30 rounded-xl p-8 text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-charcoal mb-2">No addresses saved</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Add your first address to make checkout faster
                  </p>
                  <Button 
                    onClick={() => handleOpenDialog()}
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Address
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div 
                      key={address.id}
                      className={`relative bg-white border rounded-xl p-5 transition-all ${
                        address.isDefault ? "border-primary border-2" : "border-border"
                      }`}
                    >
                      {address.isDefault && (
                        <span className="absolute -top-2.5 left-4 bg-primary text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-semibold">
                          Default
                        </span>
                      )}
                      
                      <div className="flex items-start justify-between mb-3">
                        <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-muted-foreground bg-muted px-2 py-1 rounded">
                          {address.label}
                        </span>
                        <div className="flex items-center gap-1">
                          {!address.isDefault && (
                            <button
                              onClick={() => handleSetDefault(address.id)}
                              className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                              title="Set as default"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenDialog(address)}
                            className="p-1.5 text-muted-foreground hover:text-charcoal transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-charcoal mb-1">{address.fullName}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{address.phone}</p>
                      <p className="text-sm text-charcoal leading-relaxed">
                        {address.addressLine1}
                        {address.addressLine2 && <>, {address.addressLine2}</>}
                        <br />
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Add/Edit Address Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="label">Address Label</Label>
                <Select
                  value={formData.label}
                  onValueChange={(value) => setFormData({ ...formData, label: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="addressLine1">Address Line 1 *</Label>
              <Input
                id="addressLine1"
                placeholder="House/Flat No., Building Name, Street"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
              <Input
                id="addressLine2"
                placeholder="Landmark, Area"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="Mumbai"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  placeholder="Maharashtra"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  placeholder="400001"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-charcoal">Set as default</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAddress} className="bg-charcoal hover:bg-charcoal/90">
              {editingAddress ? "Update Address" : "Save Address"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
