import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I create my own perfume?",
    answer: "Visit our 'Personalised' section and answer a few questions about your preferences, personality, and the occasions you'll wear your fragrance. Our AI-powered system will then recommend the perfect blend for you, or you can work with our perfumers to create something completely unique."
  },
  {
    question: "What is the difference between EDP and EDT?",
    answer: "EDP (Eau de Parfum) contains 15-20% fragrance oils and typically lasts 6-8 hours. EDT (Eau de Toilette) contains 5-15% fragrance oils and lasts 3-5 hours. We recommend EDP for longer-lasting fragrance."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping takes 5-7 business days across India. Express shipping (1-3 business days) is available at checkout. International shipping takes 10-15 business days depending on the destination."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for unopened products. If you're not satisfied with your personalized fragrance, contact us within 7 days and we'll work with you to create a new blend or offer store credit."
  },
  {
    question: "Are your products cruelty-free?",
    answer: "Yes! All MYOP products are 100% cruelty-free. We never test on animals and are certified by PETA. We also use vegan-friendly ingredients wherever possible."
  },
  {
    question: "How should I store my perfume?",
    answer: "Store your perfume in a cool, dry place away from direct sunlight and extreme temperatures. Avoid keeping it in the bathroom where humidity can affect the fragrance. Properly stored, your perfume can last 3-5 years."
  },
  {
    question: "Can I get a sample before buying?",
    answer: "Yes! We offer sample sets of our bestselling fragrances. You can also visit our experience stores in select cities to try our full range before purchasing."
  },
  {
    question: "Do you offer gift wrapping?",
    answer: "Absolutely! Select gift wrapping at checkout and we'll beautifully package your order with our signature ribbon and a personalized card at no extra charge."
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container-wide px-4 py-12">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-center mb-8">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Find answers to common questions about our products, shipping, and services.
          </p>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
