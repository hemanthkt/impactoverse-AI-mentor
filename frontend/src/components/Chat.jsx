// import React, { useState, useEffect } from "react";
// import Sidebar from "./Sidebar";
// import Ask from "./Ask";

// function Chat() {
//   const [sidebarWidth, setSidebarWidth] = useState(300); // Initial width of sidebar
//   const [isDragging, setIsDragging] = useState(false);
//   const [messages, setMessages] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);

//   const handleMouseDown = () => {
//     setIsDragging(true);
//   };

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       if (isDragging) {
//         const newWidth = Math.max(200, Math.min(e.clientX, 500)); // Constrain width between 200px and 500px
//         setSidebarWidth(newWidth);
//       }
//     };

//     const handleMouseUp = () => {
//       if (isDragging) {
//         setIsDragging(false);
//       }
//     };

//     if (isDragging) {
//       window.addEventListener("mousemove", handleMouseMove);
//       window.addEventListener("mouseup", handleMouseUp);
//     }

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isDragging]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!messages.trim()) return;

//     try {
//       const response = await fetch("http://localhost:5000/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ message: { role: "user", content: messages } }),
//       });

//       const data = await response.json();
//       setChatHistory([
//         ...chatHistory,
//         { type: "user", text: messages },
//         { type: "ai", text: data.text },
//       ]);
//       setMessages("");
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="flex h-screen w-full bg-transparent">
//       {/* Sidebar */}
//       <div
//         style={{ width: `${sidebarWidth}px` }}
//         className="bg-[#251952] text-white shadow-lg flex-shrink-0"
//       >
//         <Sidebar />
//       </div>

//       {/* Draggable Partition */}
//       <div
//         className="w-2 bg-[#251952] hover:bg-gray-400 cursor-ew-resize"
//         onMouseDown={handleMouseDown}
//       ></div>

//       {/* Chat Panel */}
//       <div className="flex flex-col flex-grow bg-white/10 backdrop-blur-md ">
//         <div className="flex-1 p-4 overflow-y-auto shadow-inner ">
//           {/* Chat Messages Placeholder */}
//           <div className="text-gray-500 text-center">
//             {chatHistory.map((chat, index) => (
//               <div
//                 key={index}
//                 className={`flex ${
//                   chat.type === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`p-4 mb-2 max-w-xs rounded-lg text-sm ${
//                     chat.type === "user"
//                       ? "bg-blue-400/70 backdrop-blur-lg text-white"
//                       : "bg-gray-200/70 backdrop-blur-lg text-gray-800"
//                   }`}
//                 >
//                   {chat.text}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//         {/* Ask Section */}
//         <div className="p-4 shadow-lg  bg-white/20 backdrop-blur-md ">
//           <Ask
//             handleSubmit={handleSubmit}
//             messages={messages}
//             setMessages={setMessages}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Chat;


import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Ask from "./Ask";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Copy, Volume2 } from "lucide-react";

function Chat() {
  const [messages, setMessages] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatId, setChatId] = useState(null); // Track current chat session

  useEffect(() => {
    if (chatId) {
      // Fetch chat history using Axios
      axios
        .get(`http://localhost:5000/chats/${chatId}`)
        .then((response) => {
          const formattedHistory = response.data.map((msg) => ({
            type: msg.type, // 'user' or 'ai'
            text: msg.content,
          }));
          setChatHistory(formattedHistory);
        })
        .catch((error) => console.error("Error fetching chat history:", error));
    }
  }, [chatId]);

  const startNewChat = () => {
    const newChatId = uuidv4();
    setChatId(newChatId); // Clear current chat
    setChatHistory([]); // Clear previous chat history
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!messages.trim()) return;

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        chat_id: chatId,
        message: { role: "user", content: messages },
      });

      const { text } = response.data;

      setChatHistory([
        ...chatHistory,
        { type: "user", text: messages },
        { type: "ai", text },
      ]);

      setMessages("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  const handlePlay = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const renderFormattedText = (text) => {
    // Markdown-like formatting:
    const formattedText = text
      .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>") // Bold and Italic
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*(.+?)\*/g, "<em>$1</em>") // Italics
      .replace(/### (.+?)(?:\r\n|\r|\n|$)/g, "<h3>$1</h3>") // Header level 3
      .replace(/(?:\r\n|\r|\n)/g, "<br>") // Newlines
      .replace(/- (.+?)(?=<br>|$)/g, "<li>$1</li>") // Bullet points
      .replace(/<li>.+<\/li>/g, "<ul>$&</ul>"); // Wrap list items in <ul>
  
    return { __html: formattedText };
  };



  return (
    <div className="flex h-screen w-full bg-transparent">
      {/* Sidebar */}
      <div
        style={{ width: "300px" }}
        className="bg-[#251952] text-white shadow-lg flex-shrink-0"
      >
        <Sidebar
          chatId={chatId}
          setChatId={setChatId}
          startNewChat={startNewChat}
        />
      </div>

      {/* Draggable Partition */}
      <div className="w-2 bg-[#251952] hover:bg-gray-400 cursor-ew-resize"></div>

      {/* Chat Panel */}
      <div className="flex flex-col flex-grow bg-white/10 backdrop-blur-md">
        <div className="flex-1 p-4 overflow-y-auto shadow-inner">
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
      className={`relative p-4 mb-2 ${
        chat.type === "user"
          ? "bg-blue-400/70 backdrop-blur-lg text-white max-w-xs"
          : "bg-gray-200/70 backdrop-blur-lg text-gray-800 max-w-md"
      } rounded-lg text-sm`}
    >
                  {chat.type === "ai" ? (
                    <div
                      dangerouslySetInnerHTML={renderFormattedText(chat.text)}
                    />
                  ) : (
                    chat.text
                  )}
                  {chat.type === "ai" && (
                    <div className="absolute top-1 right-2 flex space-x-2">
                      <button
                        onClick={() => handleCopy(chat.text)}
                        className="text-gray-600 hover:text-gray-800"
                        title="Copy"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => handlePlay(chat.text)}
                        className="text-gray-600 hover:text-gray-800"
                        title="Play Audio"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ask Section */}
        <div className="p-4 shadow-lg bg-white/20 backdrop-blur-md">
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





