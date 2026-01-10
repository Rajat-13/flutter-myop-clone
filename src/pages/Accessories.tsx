import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const accessories = [
  {
    id: 1,
    name: "Perfume Atomizer",
    price: 299,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop",
    description: "Portable travel-sized atomizer for your favorite fragrance"
  },
  {
    id: 2,
    name: "Gift Box Set",
    price: 499,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop",
    description: "Elegant gift box with ribbon and card"
  },
  {
    id: 3,
    name: "Perfume Tray",
    price: 799,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    description: "Luxurious display tray for your collection"
  },
  {
    id: 4,
    name: "Sample Set",
    price: 599,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
    description: "Try 5 of our bestselling fragrances"
  },
];

const Accessories = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container-wide px-4 py-8">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-center mb-8">
            Accessories
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Complete your fragrance experience with our premium accessories and gift sets.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {accessories.map((item) => (
              <Card key={item.id} className="overflow-hidden group">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">₹{item.price}</span>
                    <Button size="sm" variant="outline">Add to Cart</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Accessories;
