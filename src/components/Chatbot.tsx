import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

// Replace with your real API endpoints
const PRODUCT_API = 'https://fakestoreapi.com/products';
const SHIPMENT_API = 'https://mockapi.io/your-project/shipments';
const N8N_WEBHOOK = 'https://mutegwaraba.app.n8n.cloud/webhook/ai-assist';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm your kitchen assistant. Ask me anything about products, prices, discounts, or shipping.", isBot: true, timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    const botReply = await getBotReply(updatedMessages);

    const botMessage: Message = {
      id: updatedMessages.length + 1,
      text: botReply,
      isBot: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const getBotReply = async (conversation: Message[]): Promise<string> => {
    try {
      const lastMessage = conversation[conversation.length - 1].text.toLowerCase();

      // 1️⃣ Check product info from API
      if (lastMessage.includes('price') || lastMessage.includes('stock') || lastMessage.includes('discount')) {
        const productRes = await fetch(PRODUCT_API);
        const products = await productRes.json(); // Expected: [{name, price, stock, discount}, ...]
        const matchingProducts = products.filter((p: any) => lastMessage.includes(p.name.toLowerCase()));
        if (matchingProducts.length) {
          return matchingProducts.map((p: any) => 
            `${p.name}: $${p.price.toFixed(2)} - Stock: ${p.stock}${p.discount ? ` - Discount: ${p.discount}` : ''}`
          ).join('; ');
        } else {
          return "Sorry, I couldn't find that product. Could you specify the exact product name?";
        }
      }

      // 2️⃣ Check shipping / order status from API
      if (lastMessage.includes('shipment') || lastMessage.includes('delivery') || lastMessage.includes('order')) {
        const orderIdMatch = lastMessage.match(/([a-zA-Z]\d+)/);
        if (!orderIdMatch) return "Please provide your order ID to check shipment status.";

        const shipmentRes = await fetch(`${SHIPMENT_API}/${orderIdMatch[1]}`);
        if (shipmentRes.ok) {
          const order = await shipmentRes.json(); // Expected: {orderId, status, estimatedDelivery}
          return `Order ${order.orderId} is currently ${order.status}. Estimated delivery: ${order.estimatedDelivery}.`;
        } else {
          return "Sorry, I couldn't find that order. Please check the order ID.";
        }
      }

      // 3️⃣ Fallback: send conversation to AI (n8n)
      const response = await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation }),
      });

      if (!response.ok) throw new Error(`n8n returned ${response.status}`);
      const data = await response.json();
      return data.reply || "I'm not sure about that. Could you clarify?";
    } catch (err) {
      console.error('AI error:', err);
      return "⚠️ Couldn’t connect to assistant. Please try again later.";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-warm hover:shadow-glow transition-all duration-300 z-50"
        size="icon"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 h-96 shadow-card z-40 animate-fade-in bg-gradient-card">
          <CardHeader className="bg-gradient-hero text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="w-5 h-5" />
              Kitchen Assistant
              <div className="ml-auto flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs">Online</span>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-80">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    {message.isBot && (
                      <div className="w-6 h-6 bg-gradient-warm rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        message.isBot
                          ? 'bg-muted text-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {message.text}
                    </div>

                    {!message.isBot && (
                      <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-6 h-6 bg-gradient-warm rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about products, prices, discounts, or shipping..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="bg-gradient-warm hover:shadow-soft transition-all"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Chatbot;
