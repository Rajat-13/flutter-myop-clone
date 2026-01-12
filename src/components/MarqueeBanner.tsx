const MarqueeBanner = () => {
  const text = "The Scent Loot Box is Now Live — Choose Your 4 Scents at ₹1599";

  return (
    <section className="relative z-50 h-12 w-full bg-gold text-charcoal overflow-hidden">
      <a href="#loot-box" className="flex h-full items-center cursor-pointer">
        <div className="marquee-track flex">
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="mx-8 text-sm uppercase tracking-[0.15em] font-semibold whitespace-nowrap"
            >
              {text} ✦
            </span>
          ))}
        </div>
      </a>
    </section>
  );
};

export default MarqueeBanner;
