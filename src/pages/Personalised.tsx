import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CreateYourOwnSection from "@/components/CreateYourOwnSection";

const Personalised = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container-wide px-4 py-8">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-center mb-8">
            Personalised Perfumes
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Create a fragrance that's uniquely yours. Tell us about your personality and preferences, and we'll craft your perfect scent.
          </p>
        </div>
        <CreateYourOwnSection />
      </main>
      <Footer />
    </div>
  );
};

export default Personalised;
