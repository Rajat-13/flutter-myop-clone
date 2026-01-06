import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import BestsellersSection from "@/components/BestsellersSection";
import CategorySection from "@/components/CategorySection";
import CreateYourOwnSection from "@/components/CreateYourOwnSection";
import GenderSection from "@/components/GenderSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSlider />
        <BestsellersSection />
        <CategorySection />
        <CreateYourOwnSection />
        <GenderSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
