import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustBadges from "@/components/TrustBadges";
import { allProducts, Product } from "@/data/products";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: Product[];
}

const suggestedQuestions = [
  "I love woody and musky scents",
  "Looking for something fresh and citrusy",
  "Recommend a romantic floral perfume",
  "I want something like Sauvage",
  "What's good for office wear?",
  "Something with vanilla notes",
];

const MyType = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your personal fragrance advisor. Tell me about the notes you love, describe a perfume you've enjoyed, or share the occasion you're shopping for. I'll recommend perfect matches from our collection!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // Only scroll within the chat container, not the entire page
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  useEffect(() => {
    // Only scroll after initial load (when there's more than the welcome message)
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const findMatchingProducts = (query: string): Product[] => {
    const lowerQuery = query.toLowerCase();
    const keywords = lowerQuery.split(/\s+/);
    
    const scored = allProducts.map((product) => {
      let score = 0;
      const allNotes = [
        ...product.notes.top,
        ...product.notes.middle,
        ...product.notes.base,
      ].map((n) => n.toLowerCase());

      keywords.forEach((keyword) => {
        // Match notes
        if (allNotes.some((note) => note.includes(keyword))) {
          score += 10;
        }
        // Match category
        if (product.category.includes(keyword)) {
          score += 8;
        }
        // Match name
        if (product.name.toLowerCase().includes(keyword)) {
          score += 5;
        }
        // Match description
        if (product.description.toLowerCase().includes(keyword)) {
          score += 3;
        }
        // Match occasion
        if (product.occasion.toLowerCase().includes(keyword)) {
          score += 4;
        }
        // Gender keywords
        if (
          (keyword === "him" || keyword === "men" || keyword === "masculine") &&
          product.gender === "for-him"
        ) {
          score += 6;
        }
        if (
          (keyword === "her" || keyword === "women" || keyword === "feminine") &&
          product.gender === "for-her"
        ) {
          score += 6;
        }
      });

      // Common scent type mappings
      if (lowerQuery.includes("fresh") && (product.category === "fresh" || product.category === "citrus")) {
        score += 8;
      }
      if (lowerQuery.includes("woody") && product.category === "woody") {
        score += 8;
      }
      if (lowerQuery.includes("floral") && product.category === "floral") {
        score += 8;
      }
      if (lowerQuery.includes("sweet") && product.category === "gourmand") {
        score += 8;
      }
      if ((lowerQuery.includes("oud") || lowerQuery.includes("oriental")) && product.category === "oriental") {
        score += 8;
      }
      if (lowerQuery.includes("office") || lowerQuery.includes("work")) {
        if (product.occasion === "Office" || product.occasion === "Daily Wear") {
          score += 7;
        }
      }
      if (lowerQuery.includes("date") || lowerQuery.includes("romantic") || lowerQuery.includes("evening")) {
        if (product.occasion === "Date Night" || product.occasion === "Evening") {
          score += 7;
        }
      }
      if (lowerQuery.includes("night") || lowerQuery.includes("party")) {
        if (product.occasion === "Night Out") {
          score += 7;
        }
      }

      return { product, score };
    });

    return scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((item) => item.product);
  };

  const generateResponse = (query: string, products: Product[]): string => {
    if (products.length === 0) {
      return "I couldn't find exact matches for that, but let me know more about what you're looking for! Do you prefer fresh, woody, floral, or oriental scents? Any specific notes you love?";
    }

    const notesMentioned = new Set<string>();
    products.forEach((p) => {
      [...p.notes.top, ...p.notes.middle, ...p.notes.base].forEach((n) =>
        notesMentioned.add(n)
      );
    });

    const topNotes = Array.from(notesMentioned).slice(0, 5).join(", ");

    if (query.toLowerCase().includes("office") || query.toLowerCase().includes("work")) {
      return `For office wear, I'd recommend these sophisticated yet subtle fragrances that won't overpower your colleagues. They feature notes like ${topNotes}:`;
    }

    if (query.toLowerCase().includes("date") || query.toLowerCase().includes("romantic")) {
      return `For a romantic occasion, these captivating fragrances will leave a lasting impression. With notes of ${topNotes}, they're perfect for creating memorable moments:`;
    }

    return `Based on your preferences, I've found some wonderful matches for you! These fragrances feature notes like ${topNotes}. Here are my top recommendations:`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const matchedProducts = findMatchingProducts(input);
    const response = generateResponse(input, matchedProducts);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      products: matchedProducts.length > 0 ? matchedProducts : undefined,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleReset = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Hi! I'm your personal fragrance advisor. Tell me about the notes you love, describe a perfume you've enjoyed, or share the occasion you're shopping for. I'll recommend perfect matches from our collection!",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-20 md:pt-24 flex flex-col">
        <div className="container-wide px-4 py-4 flex-1 flex flex-col max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI Fragrance Advisor</span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-semibold mb-2">
              Find Your Perfect Scent
            </h1>
            <p className="text-muted-foreground text-sm">
              Tell me what you like, and I'll recommend the perfect fragrance for you
            </p>
          </div>

          {/* Chat Container */}
          <div className="flex-1 flex flex-col bg-muted/30 rounded-2xl border border-border overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground text-background"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] space-y-3 ${
                      message.role === "user" ? "text-right" : ""
                    }`}
                  >
                    <div
                      className={`inline-block px-4 py-3 rounded-2xl ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-background border border-border rounded-tl-sm"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>

                    {/* Product Recommendations */}
                    {message.products && message.products.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        {message.products.map((product) => (
                          <Link
                            key={product.id}
                            to={`/products/${product.slug}`}
                            className="bg-background border border-border rounded-xl overflow-hidden hover:border-primary transition-colors group"
                          >
                            <div className="aspect-square overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                                {product.name}
                              </h4>
                              <p className="text-xs text-muted-foreground capitalize mb-1">
                                {product.category} • {product.gender.replace("-", " ")}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">₹{product.price}</span>
                                {product.originalPrice && (
                                  <span className="text-xs text-muted-foreground line-through">
                                    ₹{product.originalPrice}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-background border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 pb-4">
                <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      onClick={() => handleSuggestionClick(question)}
                      className="px-3 py-1.5 bg-background border border-border rounded-full text-xs hover:border-primary transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border bg-background">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  title="Start new chat"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Describe your ideal fragrance..."
                    className="w-full px-4 py-3 pr-12 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <TrustBadges />
      </main>
      <Footer />
    </div>
  );
};

export default MyType;
