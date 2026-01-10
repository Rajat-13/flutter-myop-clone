import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BestsellersSection from "@/components/BestsellersSection";

const Bestsellers = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container-wide px-4 py-8">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-center mb-8">
            Bestsellers
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Discover our most loved fragrances, chosen by thousands of customers who found their perfect scent.
          </p>
        </div>
        <BestsellersSection />
      </main>
      <Footer />
    </div>
  );
};

export default Bestsellers;
