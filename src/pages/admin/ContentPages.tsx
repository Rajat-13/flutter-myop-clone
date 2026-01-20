import { useState } from "react";
import { 
  FileText, 
  HelpCircle, 
  Shield, 
  Save,
  Plus,
  Trash2,
  Edit2,
  GripVertical
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface AboutSection {
  id: number;
  title: string;
  content: string;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface PrivacySection {
  id: number;
  title: string;
  content: string;
}

const ContentPages = () => {
  // About Us State
  const [aboutPageTitle, setAboutPageTitle] = useState("About Us");
  const [aboutSections, setAboutSections] = useState<AboutSection[]>([
    { 
      id: 1, 
      title: "Our Story", 
      content: "RIMAE was born from a simple belief: everyone deserves a fragrance that truly represents who they are. Founded in 2014 we set out to revolutionize the perfume industry by offering personalized fragrances crafted with the finest ingredients." 
    },
    { 
      id: 2, 
      title: "Our Mission", 
      content: "We believe that fragrance is deeply personal. Our mission is to help you discover and create scents that resonate with your unique personality, memories, and aspirations. Every bottle we craft tells a story – your story." 
    },
    { 
      id: 3, 
      title: "Quality Promise", 
      content: "We source our ingredients from the world's finest perfumeries. Each fragrance is crafted by expert perfumers who blend tradition with innovation. Our commitment to quality means every drop is a testament to excellence." 
    },
    { 
      id: 4, 
      title: "Sustainability", 
      content: "We're committed to sustainable practices. From eco-friendly packaging to ethically sourced ingredients, we strive to minimize our environmental footprint while maximizing the joy our fragrances bring." 
    },
  ]);

  // FAQ State
  const [faqPageTitle, setFaqPageTitle] = useState("Frequently Asked Questions");
  const [faqPageSubtitle, setFaqPageSubtitle] = useState("Find answers to common questions about our products, shipping, and services.");
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    { id: 1, question: "How do I create my own perfume?", answer: "Visit our 'Personalised' section and answer a few questions about your preferences, personality, and the occasions you'll wear your fragrance. Our AI-powered system will then recommend the perfect blend for you, or you can work with our perfumers to create something completely unique." },
    { id: 2, question: "What is the difference between EDP and EDT?", answer: "EDP (Eau de Parfum) contains 15-20% fragrance oils and typically lasts 6-8 hours. EDT (Eau de Toilette) contains 5-15% fragrance oils and lasts 3-5 hours. We recommend EDP for longer-lasting fragrance." },
    { id: 3, question: "How long does shipping take?", answer: "Standard shipping takes 5-7 business days across India. Express shipping (1-3 business days) is available at checkout. International shipping takes 10-15 business days depending on the destination." },
    { id: 4, question: "What is your return policy?", answer: "We offer a 30-day return policy for unopened products. If you're not satisfied with your personalized fragrance, contact us within 7 days and we'll work with you to create a new blend or offer store credit." },
    { id: 5, question: "Are your products cruelty-free?", answer: "Yes! All RIMAE products are 100% cruelty-free. We never test on animals and are certified by PETA. We also use vegan-friendly ingredients wherever possible." },
    { id: 6, question: "How should I store my perfume?", answer: "Store your perfume in a cool, dry place away from direct sunlight and extreme temperatures. Avoid keeping it in the bathroom where humidity can affect the fragrance. Properly stored, your perfume can last 3-5 years." },
    { id: 7, question: "Can I get a sample before buying?", answer: "Yes! We offer sample sets of our bestselling fragrances. You can also visit our experience stores in select cities to try our full range before purchasing." },
    { id: 8, question: "Do you offer gift wrapping?", answer: "Absolutely! Select gift wrapping at checkout and we'll beautifully package your order with our signature ribbon and a personalized card at no extra charge." },
  ]);

  // Privacy Policy State
  const [privacyPageTitle, setPrivacyPageTitle] = useState("Privacy Policy");
  const [privacyLastUpdated, setPrivacyLastUpdated] = useState("January 2026");
  const [privacySections, setPrivacySections] = useState<PrivacySection[]>([
    { id: 1, title: "1. Information We Collect", content: "We collect information you provide directly to us, such as your name, email address, phone number, shipping address, and payment information when you make a purchase or create an account. We also collect information about your preferences when you create personalized fragrances." },
    { id: 2, title: "2. How We Use Your Information", content: "We use the information we collect to process your orders, communicate with you about your purchases, send you marketing communications (with your consent), personalize your experience, and improve our products and services." },
    { id: 3, title: "3. Information Sharing", content: "We do not sell your personal information. We may share your information with service providers who assist in our operations (shipping, payment processing), when required by law, or with your consent." },
    { id: 4, title: "4. Data Security", content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction." },
    { id: 5, title: "5. Your Rights", content: "You have the right to access, correct, or delete your personal information. You can also opt out of marketing communications at any time. Contact us at privacy@rimae.in to exercise these rights." },
    { id: 6, title: "6. Cookies", content: "We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors come from. You can control cookies through your browser settings." },
    { id: 7, title: "7. Contact Us", content: "If you have any questions about this Privacy Policy, please contact us at:\nEmail: privacy@rimae.in\nPhone: +91 1800-123-4567\nAddress: RIMAE Fragrances Pvt. Ltd., Mumbai, India" },
  ]);

  const handleSave = (section: string) => {
    toast.success(`${section} content saved successfully!`);
  };

  // About Us handlers
  const addAboutSection = () => {
    const newId = Math.max(...aboutSections.map(s => s.id), 0) + 1;
    setAboutSections([...aboutSections, { id: newId, title: "", content: "" }]);
  };

  const removeAboutSection = (id: number) => {
    setAboutSections(aboutSections.filter(s => s.id !== id));
  };

  // FAQ handlers
  const addFaqItem = () => {
    const newId = Math.max(...faqItems.map(f => f.id), 0) + 1;
    setFaqItems([...faqItems, { id: newId, question: "", answer: "" }]);
  };

  const removeFaqItem = (id: number) => {
    setFaqItems(faqItems.filter(f => f.id !== id));
  };

  // Privacy handlers
  const addPrivacySection = () => {
    const newId = Math.max(...privacySections.map(s => s.id), 0) + 1;
    setPrivacySections([...privacySections, { id: newId, title: "", content: "" }]);
  };

  const removePrivacySection = (id: number) => {
    setPrivacySections(privacySections.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Content Pages</h1>
        <p className="text-muted-foreground mt-1">
          Manage About Us, FAQ, and Privacy Policy page content
        </p>
      </div>

      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="about" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">About Us</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
        </TabsList>

        {/* About Us Tab */}
        <TabsContent value="about" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                About Us Page
              </CardTitle>
              <CardDescription>
                Edit the About Us page title and content sections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input 
                  value={aboutPageTitle}
                  onChange={(e) => setAboutPageTitle(e.target.value)}
                  placeholder="About Us"
                />
              </div>

              {aboutSections.map((section, index) => (
                <div key={section.id} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center pt-2">
                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label>Section Title</Label>
                      <Input 
                        value={section.title}
                        onChange={(e) => {
                          const updated = [...aboutSections];
                          updated[index].title = e.target.value;
                          setAboutSections(updated);
                        }}
                        placeholder="Section title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Content</Label>
                      <Textarea 
                        value={section.content}
                        onChange={(e) => {
                          const updated = [...aboutSections];
                          updated[index].content = e.target.value;
                          setAboutSections(updated);
                        }}
                        placeholder="Section content..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeAboutSection(section.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <div className="flex justify-between">
                <Button variant="outline" onClick={addAboutSection}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
                <Button onClick={() => handleSave("About Us")}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                FAQ Page
              </CardTitle>
              <CardDescription>
                Manage frequently asked questions and answers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Page Title</Label>
                  <Input 
                    value={faqPageTitle}
                    onChange={(e) => setFaqPageTitle(e.target.value)}
                    placeholder="Frequently Asked Questions"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input 
                    value={faqPageSubtitle}
                    onChange={(e) => setFaqPageSubtitle(e.target.value)}
                    placeholder="Find answers to common questions..."
                  />
                </div>
              </div>

              {faqItems.map((faq, index) => (
                <div key={faq.id} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center pt-2">
                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label>Question</Label>
                      <Input 
                        value={faq.question}
                        onChange={(e) => {
                          const updated = [...faqItems];
                          updated[index].question = e.target.value;
                          setFaqItems(updated);
                        }}
                        placeholder="Enter question..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Answer</Label>
                      <Textarea 
                        value={faq.answer}
                        onChange={(e) => {
                          const updated = [...faqItems];
                          updated[index].answer = e.target.value;
                          setFaqItems(updated);
                        }}
                        placeholder="Enter answer..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeFaqItem(faq.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <div className="flex justify-between">
                <Button variant="outline" onClick={addFaqItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add FAQ
                </Button>
                <Button onClick={() => handleSave("FAQ")}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Policy Tab */}
        <TabsContent value="privacy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy Policy Page
              </CardTitle>
              <CardDescription>
                Edit the Privacy Policy page content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Page Title</Label>
                  <Input 
                    value={privacyPageTitle}
                    onChange={(e) => setPrivacyPageTitle(e.target.value)}
                    placeholder="Privacy Policy"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Updated</Label>
                  <Input 
                    value={privacyLastUpdated}
                    onChange={(e) => setPrivacyLastUpdated(e.target.value)}
                    placeholder="January 2026"
                  />
                </div>
              </div>

              {privacySections.map((section, index) => (
                <div key={section.id} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center pt-2">
                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label>Section Title</Label>
                      <Input 
                        value={section.title}
                        onChange={(e) => {
                          const updated = [...privacySections];
                          updated[index].title = e.target.value;
                          setPrivacySections(updated);
                        }}
                        placeholder="Section title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Content</Label>
                      <Textarea 
                        value={section.content}
                        onChange={(e) => {
                          const updated = [...privacySections];
                          updated[index].content = e.target.value;
                          setPrivacySections(updated);
                        }}
                        placeholder="Section content..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removePrivacySection(section.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <div className="flex justify-between">
                <Button variant="outline" onClick={addPrivacySection}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
                <Button onClick={() => handleSave("Privacy Policy")}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentPages;
