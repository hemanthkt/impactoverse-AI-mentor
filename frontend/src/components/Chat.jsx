import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Ask from "./Ask";

function Chat() {
  const [sidebarWidth, setSidebarWidth] = useState(300); // Initial width of sidebar
  const [isDragging, setIsDragging] = useState(false);
  const [messages, setMessages] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newWidth = Math.max(200, Math.min(e.clientX, 500)); // Constrain width between 200px and 500px
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleSubmit = async (e) => {
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
      setMessages("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen w-full bg-transparent">
      {/* Sidebar */}
      <div
        style={{ width: `${sidebarWidth}px` }}
        className="bg-[#251952] text-white shadow-lg flex-shrink-0"
      >
        <Sidebar />
      </div>

      {/* Draggable Partition */}
      <div
        className="w-2 bg-[#251952] hover:bg-gray-400 cursor-ew-resize"
        onMouseDown={handleMouseDown}
      ></div>

      {/* Chat Panel */}
      <div className="flex flex-col flex-grow bg-white/10 backdrop-blur-md ">
        <div className="flex-1 p-4 overflow-y-auto shadow-inner ">
          {/* Chat Messages Placeholder */}
          <div className="text-gray-500 text-center">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex ${
                  chat.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-4 mb-2 max-w-xs rounded-lg text-sm ${
                    chat.type === "user"
                      ? "bg-blue-400/70 backdrop-blur-lg text-white"
                      : "bg-gray-200/70 backdrop-blur-lg text-gray-800"
                  }`}
                >
                  {chat.text}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Ask Section */}
        <div className="p-4 shadow-lg  bg-white/20 backdrop-blur-md ">
          <Ask
            handleSubmit={handleSubmit}
            messages={messages}
            setMessages={setMessages}
          />
        </div>
      </div>
    </div>
  );
}

export default Chat;



