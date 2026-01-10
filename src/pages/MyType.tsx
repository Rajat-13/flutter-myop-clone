import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategorySection from "@/components/CategorySection";

const MyType = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container-wide px-4 py-8">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-center mb-8">
            Find Your Type
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Explore fragrances based on your personality and preferences. Whether you prefer floral, woody, or fresh scents, we have something for everyone.
          </p>
        </div>
        <CategorySection />
      </main>
      <Footer />
    </div>
  );
};

export default MyType;
