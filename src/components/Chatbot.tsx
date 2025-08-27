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

// Example product database (replace with real API)
const products = [
  { name: 'Plate', price: 5.99, stock: 120 },
  { name: 'Fork', price: 2.49, stock: 200 },
  { name: 'Knife Set', price: 89.99, stock: 50, discount: '10% off' },
  { name: 'Pot Set', price: 149.99, stock: 30, discount: '25% off' },
];

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm your kitchen assistant. Ask me anything about our products.", isBot: true, timestamp: new Date() }
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

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Call AI / n8n endpoint to process message
    const botReply = await getBotReply([...messages, userMessage]);

    const botMessage: Message = {
      id: messages.length + 2,
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

      // Check local product knowledge first (optional)
      for (let product of products) {
        if (lastMessage.includes(product.name.toLowerCase())) {
          let reply = `${product.name}: $${product.price.toFixed(2)} - Stock: ${product.stock}`;
          if (product.discount) reply += ` - Discount: ${product.discount}`;
          return reply;
        }
      }

      // Send to AI endpoint (n8n) for human-like response
      const response = await fetch('https://mutegwaraba.app.n8n.cloud/webhook/ai-assist', {
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
                  placeholder="Ask about products, prices, stock..."
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
