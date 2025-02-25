import React, { useState } from "react";
import Sidebar from "./Sidebar";

function Chat() {
  const [messages, setMessages] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = async (e) => {
    console.log(messages);

    e.preventDefault();

    if (!messages.trim()) return;

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: { role: "user", content: messages } }),
      });

      const data = await response.json();
      setChatHistory([
        ...chatHistory,
        { type: "user", text: messages },
        { type: "ai", text: data.text },
      ]);
      console.log(chatHistory);

      setMessages("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="chat-container">
      <Sidebar></Sidebar>
      <div className="chat-history">
        {chatHistory.map((chat, index) => {
          return (
            <div
              className={`p-2 mb-2 rounded ${
                chat.type === "user"
                  ? "bg-blue-100 ml-auto"
                  : "bg-gray-100 mr-auto"
              }`}
              key={index}
            >
              {chat.text}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={messages}
          onChange={(e) => setMessages(e.target.value)}
          placeholder="Ask anything..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
