const categories = [
  {
    id: 1,
    name: "Fresh",
    image: "https://images.unsplash.com/photo-1527903789995-dc8ad2ad6de0?w=400&auto=format&fit=crop&q=80",
    description: "Light & Citrusy",
  },
  {
    id: 2,
    name: "Oriental/Woody",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    description: "Warm & Mysterious",
  },
  {
    id: 3,
    name: "Floral",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&auto=format&fit=crop&q=80",
    description: "Romantic & Elegant",
  },
  {
    id: 4,
    name: "Musky",
    image: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=400&auto=format&fit=crop&q=80",
    description: "Sensual & Bold",
  },
];

const CategorySection = () => {
  return (
    <section id="shop" className="section-padding bg-cream">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="heading-section">
            Shop by <span className="italic-accent">Fragrance Type</span>
          </h2>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <a
              key={category.id}
              href={`#${category.name.toLowerCase()}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-sm animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-primary-foreground">
                <h3 className="font-serif text-xl md:text-2xl font-medium uppercase tracking-wide">
                  {category.name}
                </h3>
                <p className="text-sm opacity-80 mt-1">{category.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
