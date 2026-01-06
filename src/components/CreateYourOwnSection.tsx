const CreateYourOwnSection = () => {
  return (
    <section id="create" className="section-padding bg-background">
      <div className="container-wide">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Image */}
          <div className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-sm">
            <img
              src="https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80"
              alt="Create your own perfume"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="text-center md:text-left">
            <span className="text-sm uppercase tracking-[0.2em] text-gold font-medium">
              Personalization
            </span>
            <h2 className="heading-section mt-4 mb-6">
              Create <span className="italic-accent">Your Own</span> Bottle
            </h2>
            <p className="text-body text-muted-foreground mb-8 max-w-lg">
              Design a fragrance as unique as you are. Choose your notes, customize 
              your bottle, and create a signature scent that tells your story. 
              From top notes to base, every detail is in your hands.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                  <span className="text-gold font-serif text-lg">1</span>
                </div>
                <p className="text-body">Choose your fragrance notes</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                  <span className="text-gold font-serif text-lg">2</span>
                </div>
                <p className="text-body">Customize your bottle design</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                  <span className="text-gold font-serif text-lg">3</span>
                </div>
                <p className="text-body">Add a personal message</p>
              </div>
            </div>

            <a href="#customize" className="btn-gold inline-block">
              Start Creating
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateYourOwnSection;
