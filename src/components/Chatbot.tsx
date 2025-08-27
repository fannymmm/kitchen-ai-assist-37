import React, { useState } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hello! I'm your kitchen assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  // 🔗 Send the full conversation to n8n
  async function sendMessageToN8n(conversation: Message[]): Promise<string> {
    try {
      const response = await fetch("https://mutegwaraba.app.n8n.cloud/webhook/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation }),
      });

      if (!response.ok) {
        throw new Error(`n8n returned ${response.status}`);
      }

      const data = await response.json();
      return data.reply || "Sorry, I didn’t understand that.";
    } catch (err) {
      console.error("Chatbot error:", err);
      return "⚠️ Couldn’t connect to assistant. Please try again later.";
    }
  }

  // 📨 Handle sending messages
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();

    setMessages((prev) => {
      const updated = [...prev, { role: "user", text: userMsg }];
      setInput("");

      // Send full chat history to n8n
      sendMessageToN8n(updated).then((reply) => {
        setMessages((final) => [...final, { role: "assistant", text: reply }]);
      });

      return updated;
    });
  };

  return (
    <div className="chatbot-container">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.role === "user" ? "user" : "assistant"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          placeholder="Ask about products, prices, stock..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
