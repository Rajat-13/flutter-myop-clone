const genders = [
  {
    id: 1,
    name: "For Him",
    image: "https://images.unsplash.com/photo-1557862921-37829c790f19?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "For Her",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop&q=80",
  },
];

const GenderSection = () => {
  return (
    <section className="section-padding bg-muted">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="heading-section">
            Shop by <span className="italic-accent">Gender</span>
          </h2>
        </div>

        {/* Gender Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {genders.map((gender) => (
            <a
              key={gender.id}
              href={`#${gender.name.toLowerCase().replace(" ", "-")}`}
              className="group relative aspect-[16/9] md:aspect-[16/10] overflow-hidden rounded-sm"
            >
              <img
                src={gender.image}
                alt={gender.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal/30 group-hover:bg-charcoal/20 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="font-serif text-3xl md:text-4xl font-medium text-primary-foreground uppercase tracking-wider">
                    {gender.name}
                  </h3>
                  <span className="inline-block mt-4 text-primary-foreground/80 text-sm uppercase tracking-wider border-b border-primary-foreground/50 pb-1 group-hover:border-primary-foreground transition-colors">
                    Explore Collection
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenderSection;
