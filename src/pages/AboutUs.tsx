import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container-wide px-4 py-12">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-center mb-8">
            About Us
          </h1>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <section>
              <h2 className="font-serif text-2xl font-medium mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                MYOP (Make Your Own Perfume) was born from a simple belief: everyone deserves a fragrance 
                that truly represents who they are. Founded in 2020, we set out to revolutionize the 
                perfume industry by offering personalized fragrances crafted with the finest ingredients.
              </p>
            </section>
            
            <section>
              <h2 className="font-serif text-2xl font-medium mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe that fragrance is deeply personal. Our mission is to help you discover and 
                create scents that resonate with your unique personality, memories, and aspirations. 
                Every bottle we craft tells a story – your story.
              </p>
            </section>
            
            <section>
              <h2 className="font-serif text-2xl font-medium mb-4">Quality Promise</h2>
              <p className="text-muted-foreground leading-relaxed">
                We source our ingredients from the world's finest perfumeries. Each fragrance is 
                crafted by expert perfumers who blend tradition with innovation. Our commitment to 
                quality means every drop is a testament to excellence.
              </p>
            </section>
            
            <section>
              <h2 className="font-serif text-2xl font-medium mb-4">Sustainability</h2>
              <p className="text-muted-foreground leading-relaxed">
                We're committed to sustainable practices. From eco-friendly packaging to ethically 
                sourced ingredients, we strive to minimize our environmental footprint while 
                maximizing the joy our fragrances bring.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
