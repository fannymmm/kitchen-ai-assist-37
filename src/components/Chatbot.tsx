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

const PRODUCT_API = 'https://fakestoreapi.com/products';

// Example: replace with real client session ID or userId if available
const CLIENT_ID = 'client_123';
const STORAGE_KEY = `chat_history_${CLIENT_ID}`;

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
      : [
          {
            id: 1,
            text: "👋 Hi! I'm your kitchen assistant. Ask me about products, prices, stock, discounts, or shipping.",
            isBot: true,
            timestamp: new Date(),
          },
        ];
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll & save history
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }

    // Cap at 100+ messages per client
    const cappedMessages = messages.length > 100 ? messages.slice(messages.length - 100) : messages;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cappedMessages));
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const botReplyText = await getBotReply([...messages, userMessage]);

    const botMessage: Message = {
      id: messages.length + 2,
      text: botReplyText,
      isBot: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Bot reply logic
  const getBotReply = async (conversation: Message[]): Promise<string> => {
    const lastMessage = conversation[conversation.length - 1].text.toLowerCase();

    // Product queries
    if (lastMessage.includes('price') || lastMessage.includes('stock') || lastMessage.includes('discount')) {
      try {
        const res = await fetch(PRODUCT_API);
        const products = await res.json();
        const matching = products.filter((p: any) => lastMessage.includes(p.title.toLowerCase()));
        if (matching.length) {
          return matching.map((p: any) =>
            `${p.title}: $${p.price.toFixed(2)} - Stock: ${Math.floor(Math.random() * 50 + 10)}`
          ).join('\n');
        } else {
          return "🔎 I couldn't find that product. Can you specify the exact name?";
        }
      } catch {
        return "⚠️ Couldn't fetch product info right now.";
      }
    }

    // Shipment queries
    if (lastMessage.includes('order') || lastMessage.includes('shipment') || lastMessage.includes('delivery')) {
      const orderIdMatch = lastMessage.match(/([a-zA-Z]\d+)/);
      if (!orderIdMatch) return "📦 Please provide your order ID to check shipment status.";
      return `✅ Order ${orderIdMatch[1]} is currently Shipped. Estimated delivery: 2025-09-05.`;
    }

    // Try n8n AI
    try {
      const response = await fetch('https://mutegwaraba.app.n8n.cloud/webhook/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation }),
      });
      if (!response.ok) throw new Error('n8n error');
      const data = await response.json();
      return data.reply || "🤔 I couldn't understand that. Can you rephrase?";
    } catch {
      return "💡 I'm here but couldn't reach the AI assistant. Let's keep chatting — ask me about products, stock, or shipping!";
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-warm hover:shadow-glow transition-all duration-300 z-50"
        size="icon"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[32rem] shadow-card z-40 animate-fade-in bg-gradient-card">
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

          <CardContent className="p-0 flex flex-col h-[28rem]">
            {/* Scrollable area for 100+ messages */}
            <ScrollArea className="flex-1 p-4 overflow-y-auto" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-2 ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                    {message.isBot && (
                      <div className="w-6 h-6 bg-gradient-warm rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[80%] p-3 rounded-lg text-sm ${message.isBot ? 'bg-muted text-foreground' : 'bg-primary text-primary-foreground'}`}>
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

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about products, prices, stock, or shipping..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon" className="bg-gradient-warm hover:shadow-soft transition-all">
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
