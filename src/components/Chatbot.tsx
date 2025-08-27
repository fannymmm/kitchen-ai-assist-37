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
  const [open, setOpen] = useState(false); // ✅ controls whether chat is visible

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
    <>
      {/* 💬 Floating Chat Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-orange-500 text-white p-4 rounded-full shadow-lg z-50"
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-5 w-80 bg-white border shadow-lg rounded-lg flex flex-col z-50">
          <div className="p-2 font-bold bg-orange-500 text-white rounded-t-lg">
            Kitchen Assistant
          </div>
          <div className="p-2 flex-1 overflow-y-auto max-h-64">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`my-1 p-2 rounded ${
                  msg.role === "user"
                    ? "bg-gray-200 text-right"
                    : "bg-orange-100 text-left"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex p-2 border-t">
            <input
              type="text"
              value={input}
              placeholder="Ask about products, prices, stock..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 border rounded px-2"
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-orange-500 text-white px-3 py-1 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
