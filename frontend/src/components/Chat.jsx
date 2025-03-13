import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Ask from "./Ask";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Copy, Volume2 } from "lucide-react";
import Sidebar2 from "./Sidebar2";

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

  const handleSubmit = async (e, document_id) => {
    e.preventDefault();

    if (!messages.trim()) return;

    // try {
    //   // fetch context from FastAPI
    //   const contextResponse = await axios.post(
    //     "http://127.0.0.1:8000/context",
    //     {
    //       question: messages,
    //       document_id: document_id
    //     }
    //   );
    // } catch (error) {}

    try {
      const contextResponse = await axios.post(
        "http://127.0.0.1:8000/context",
        {
          question: messages,
          document_id: document_id,
        }
      );

      const context = contextResponse.data.context;

      // cmbain context with messages
      const userMessageContext = `Based on this document: ${context}\n Provide a concise and well-structured answer as a tutor explaining key points to a student.Summarize only the essential details in a clear and precise manner.\n Question: ${messages} Answer:`;
      const response = await axios.post("http://localhost:5000/chat", {
        chat_id: chatId,
        message: { role: "user", content: userMessageContext },
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
      {/* <div
        style={{ width: "300px" }}
        className="bg-[#251952] text-white shadow-lg flex-shrink-0"
      >
        <Sidebar
          chatId={chatId}
          setChatId={setChatId}
          startNewChat={startNewChat}
        />
      </div> */}

      <Sidebar2
        chatId={chatId}
        setChatId={setChatId}
        startNewChat={startNewChat}
      />

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
        <div className="p-4">
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
