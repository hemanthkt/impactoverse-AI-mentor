import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Ask from "./Ask";

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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar className="w-1/4 bg-white shadow-lg"></Sidebar>
      {/* Chat history and input */}
      <div className="flex flex-col w-3/4 p-6">
        <div className="flex-1 overscroll-y-auto mb-4 space-y-4">
          {chatHistory.map((chat, index) => {
            return (
              <div
                key={index}
                className={`flex ${
                  chat.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-2 mb-2 rounded ${
                    chat.type === "user"
                      ? "bg-blue-100 ml-auto"
                      : "bg-gray-100 mr-auto"
                  }`}
                >
                  {chat.text}
                </div>
              </div>
            );
          })}
        </div>
        <Ask
          handleSubmit={handleSubmit}
          messages={messages}
          setMessages={setMessages}
        ></Ask>
      </div>
    </div>
  );
}

export default Chat;
