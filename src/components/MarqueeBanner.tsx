import { useState, useEffect } from "react";

const MarqueeBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const text = "The Scent Loot Box is Now Live — Choose Your 4 Scents at ₹1599";

  // Track scroll position to hide marquee
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY <= 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section 
      className={`fixed top-0 left-0 right-0 z-[60] h-8 w-full bg-red-500 text-white overflow-hidden transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
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
