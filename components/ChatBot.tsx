// components/Chatbot.tsx

import { useState } from "react";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const Chatbot = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    const response = await fetch(
      "https://nextjs-library-eta.vercel.app/api/dialogflow-webhook",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queryInput: { text: { text: input, languageCode: "en" } },
        }),
      }
    );

    const data = await response.json();
    const botMessage: Message = { text: data.fulfillmentText || 'Sorry, I did not understand that.', sender: 'bot' };
    setMessages((prev) => [...prev, botMessage]);
    setInput("");
  };

  if (!isOpen) return null; // Don't render the chatbot if not open

  return (
    <div className="fixed bottom-0 right-0 m-4 w-80 h-96 border border-gray-300 rounded-lg p-4 bg-white shadow-md z-50">
      {" "}
      {/* Added z-50 */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        &times; {/* Close button */}
      </button>
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-2 py-1 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow border border-gray-300 rounded-l-lg p-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white rounded-r-lg px-4 py-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
