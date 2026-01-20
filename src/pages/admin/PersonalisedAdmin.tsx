import { useState } from "react";
import { Plus, Pencil, Trash2, Save, X, Upload, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface Note {
  id: string;
  name: string;
  price: number;
  category: "top" | "middle" | "base";
}

interface Bottle {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface PageSettings {
  title: string;
  subtitle: string;
  basePrice: number;
  maxNotesPerCategory: number;
}

// Initial data
const initialNotes: Note[] = [
  { id: "1", name: "Bergamot", price: 50, category: "top" },
  { id: "2", name: "Lemon", price: 40, category: "top" },
  { id: "3", name: "Grapefruit", price: 45, category: "top" },
  { id: "4", name: "Pink Pepper", price: 60, category: "top" },
  { id: "5", name: "Cardamom", price: 55, category: "top" },
  { id: "6", name: "Lavender", price: 50, category: "top" },
  { id: "7", name: "Orange", price: 35, category: "top" },
  { id: "8", name: "Rose", price: 70, category: "top" },
  { id: "9", name: "Jasmine", price: 80, category: "middle" },
  { id: "10", name: "Rose", price: 85, category: "middle" },
  { id: "11", name: "Sandalwood", price: 100, category: "middle" },
  { id: "12", name: "Oud", price: 150, category: "middle" },
  { id: "13", name: "Iris", price: 90, category: "middle" },
  { id: "14", name: "Violet", price: 75, category: "middle" },
  { id: "15", name: "Peony", price: 70, category: "middle" },
  { id: "16", name: "Cinnamon", price: 55, category: "middle" },
  { id: "17", name: "Vanilla", price: 60, category: "base" },
  { id: "18", name: "Musk", price: 70, category: "base" },
  { id: "19", name: "Amber", price: 80, category: "base" },
  { id: "20", name: "Cedar", price: 65, category: "base" },
  { id: "21", name: "Vetiver", price: 75, category: "base" },
  { id: "22", name: "Leather", price: 90, category: "base" },
  { id: "23", name: "Benzoin", price: 85, category: "base" },
  { id: "24", name: "Patchouli", price: 70, category: "base" },
];

const initialBottles: Bottle[] = [
  {
    id: "classic",
    name: "Classic Elegance",
    price: 200,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&auto=format&fit=crop&q=80",
    description: "Timeless rectangular design",
  },
  {
    id: "modern",
    name: "Modern Luxe",
    price: 350,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&auto=format&fit=crop&q=80",
    description: "Sleek contemporary style",
  },
  {
    id: "vintage",
    name: "Vintage Charm",
    price: 450,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&auto=format&fit=crop&q=80",
    description: "Art deco inspired elegance",
  },
  {
    id: "premium",
    name: "Premium Crystal",
    price: 600,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&auto=format&fit=crop&q=80",
    description: "Handcrafted crystal masterpiece",
  },
];

const PersonalisedAdmin = () => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [bottles, setBottles] = useState<Bottle[]>(initialBottles);
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    title: "Create Your Signature Scent",
    subtitle: "Design a fragrance that's uniquely yours in 3 simple steps",
    basePrice: 500,
    maxNotesPerCategory: 3,
  });

  // Note Dialog State
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteForm, setNoteForm] = useState({ name: "", price: 0, category: "top" as "top" | "middle" | "base" });

  // Bottle Dialog State
  const [bottleDialogOpen, setBottleDialogOpen] = useState(false);
  const [editingBottle, setEditingBottle] = useState<Bottle | null>(null);
  const [bottleForm, setBottleForm] = useState({ name: "", price: 0, image: "", description: "" });

  // Note CRUD
  const openNoteDialog = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setNoteForm({ name: note.name, price: note.price, category: note.category });
    } else {
      setEditingNote(null);
      setNoteForm({ name: "", price: 0, category: "top" });
    }
    setNoteDialogOpen(true);
  };

  const saveNote = () => {
    if (!noteForm.name.trim()) {
      toast.error("Please enter a note name");
      return;
    }
    if (noteForm.price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (editingNote) {
      setNotes(notes.map((n) => (n.id === editingNote.id ? { ...n, ...noteForm } : n)));
      toast.success("Note updated successfully");
    } else {
      setNotes([...notes, { id: Date.now().toString(), ...noteForm }]);
      toast.success("Note added successfully");
    }
    setNoteDialogOpen(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    toast.success("Note deleted");
  };

  // Bottle CRUD
  const openBottleDialog = (bottle?: Bottle) => {
    if (bottle) {
      setEditingBottle(bottle);
      setBottleForm({ name: bottle.name, price: bottle.price, image: bottle.image, description: bottle.description });
    } else {
      setEditingBottle(null);
      setBottleForm({ name: "", price: 0, image: "", description: "" });
    }
    setBottleDialogOpen(true);
  };

  const saveBottle = () => {
    if (!bottleForm.name.trim()) {
      toast.error("Please enter a bottle name");
      return;
    }
    if (bottleForm.price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (editingBottle) {
      setBottles(bottles.map((b) => (b.id === editingBottle.id ? { ...b, ...bottleForm } : b)));
      toast.success("Bottle updated successfully");
    } else {
      setBottles([...bottles, { id: Date.now().toString(), ...bottleForm }]);
      toast.success("Bottle added successfully");
    }
    setBottleDialogOpen(false);
  };

  const deleteBottle = (id: string) => {
    setBottles(bottles.filter((b) => b.id !== id));
    toast.success("Bottle deleted");
  };

  const savePageSettings = () => {
    toast.success("Page settings saved successfully");
  };

  const renderNoteTable = (category: "top" | "middle" | "base") => {
    const categoryNotes = notes.filter((n) => n.category === category);
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price (₹)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categoryNotes.map((note) => (
            <TableRow key={note.id}>
              <TableCell className="font-medium">{note.name}</TableCell>
              <TableCell>₹{note.price}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openNoteDialog(note)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteNote(note.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-charcoal">Personalised Page</h1>
          <p className="text-muted-foreground">Manage notes, bottles, and page settings for the personalization experience</p>
        </div>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="settings">Page Settings</TabsTrigger>
          <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
          <TabsTrigger value="bottles">Bottles ({bottles.length})</TabsTrigger>
        </TabsList>

        {/* Page Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Page Title</label>
                  <Input
                    value={pageSettings.title}
                    onChange={(e) => setPageSettings({ ...pageSettings, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Base Price (₹)</label>
                  <Input
                    type="number"
                    value={pageSettings.basePrice}
                    onChange={(e) => setPageSettings({ ...pageSettings, basePrice: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subtitle</label>
                <Textarea
                  value={pageSettings.subtitle}
                  onChange={(e) => setPageSettings({ ...pageSettings, subtitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Notes Per Category</label>
                <Input
                  type="number"
                  value={pageSettings.maxNotesPerCategory}
                  onChange={(e) => setPageSettings({ ...pageSettings, maxNotesPerCategory: Number(e.target.value) })}
                  className="w-32"
                />
              </div>
              <Button onClick={savePageSettings} className="bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => openNoteDialog()} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Notes</CardTitle>
              </CardHeader>
              <CardContent>{renderNoteTable("top")}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Middle Notes</CardTitle>
              </CardHeader>
              <CardContent>{renderNoteTable("middle")}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Base Notes</CardTitle>
              </CardHeader>
              <CardContent>{renderNoteTable("base")}</CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Bottles Tab */}
        <TabsContent value="bottles">
          <div className="flex justify-end mb-4">
            <Button onClick={() => openBottleDialog()} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Bottle
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bottles.map((bottle) => (
              <Card key={bottle.id} className="overflow-hidden">
                <div className="aspect-square bg-muted">
                  <img src={bottle.image} alt={bottle.name} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium">{bottle.name}</h3>
                  <p className="text-sm text-muted-foreground">{bottle.description}</p>
                  <p className="text-primary font-semibold mt-2">₹{bottle.price}</p>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" onClick={() => openBottleDialog(bottle)}>
                      <Pencil className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteBottle(bottle.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Note Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingNote ? "Edit Note" : "Add Note"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Note Name</label>
              <Input
                value={noteForm.name}
                onChange={(e) => setNoteForm({ ...noteForm, name: e.target.value })}
                placeholder="e.g., Bergamot"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (₹)</label>
              <Input
                type="number"
                value={noteForm.price}
                onChange={(e) => setNoteForm({ ...noteForm, price: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                value={noteForm.category}
                onChange={(e) => setNoteForm({ ...noteForm, category: e.target.value as "top" | "middle" | "base" })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="top">Top Note</option>
                <option value="middle">Middle Note</option>
                <option value="base">Base Note</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveNote} className="bg-primary hover:bg-primary/90">
              {editingNote ? "Update" : "Add"} Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bottle Dialog */}
      <Dialog open={bottleDialogOpen} onOpenChange={setBottleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBottle ? "Edit Bottle" : "Add Bottle"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bottle Name</label>
              <Input
                value={bottleForm.name}
                onChange={(e) => setBottleForm({ ...bottleForm, name: e.target.value })}
                placeholder="e.g., Classic Elegance"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (₹)</label>
              <Input
                type="number"
                value={bottleForm.price}
                onChange={(e) => setBottleForm({ ...bottleForm, price: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input
                value={bottleForm.image}
                onChange={(e) => setBottleForm({ ...bottleForm, image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={bottleForm.description}
                onChange={(e) => setBottleForm({ ...bottleForm, description: e.target.value })}
                placeholder="Brief description of the bottle design"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBottleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveBottle} className="bg-primary hover:bg-primary/90">
              {editingBottle ? "Update" : "Add"} Bottle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonalisedAdmin;
