import React, { useEffect, useState } from "react";
import axios from "axios";

function Sidebar({ chatId, setChatId, startNewChat }) {
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/chats")
      .then((response) => {
        setChatList(response.data);
      })
      .catch((error) => console.error(error));
  }, [chatId]);

  return (
    <aside
      className="w-64 h-screen shadow-md flex flex-col justify-between"
      style={{ backgroundColor: "#251952" }}
    >
      <div className="p-6">
        <h1 className="text-xl text-white font-bold mb-4">Chatbot Dashboard</h1>
        <button
          onClick={startNewChat}
          className="w-full bg-blue-500 text-white p-2 rounded mb-4"
        >
          + New Chat
        </button>
        <nav className="space-y-2">
          {/* Dynamic chat list */}
          {chatList.length > 0 && (
            <ul className="bg-gray-800 rounded p-2">
              {chatList.map((chat) => (
                <li
                  key={chat.chat_id}
                  onClick={() => setChatId(chat.chat_id)}
                  className={`p-2 cursor-pointer text-white rounded ${
                    chatId === chat.chat_id
                      ? "bg-blue-500"
                      : "hover:bg-gray-700"
                  }`}
                >
                  Chat {chat.chat_id.slice(-4)}{" "}
                  {/* Show last 4 chars of chat_id */}
                </li>
              ))}
            </ul>
          )}

          {/* Static menu items */}
          <a
            href="#"
            className="flex items-center p-2 text-white hover:bg-blue-500 rounded"
          >
            <span className="mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 9.5L12 3l9 6.5v9.5a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4H9v4a2 2 0 01-2 2H3a2 2 0 01-2-2V9.5z"
                />
              </svg>
            </span>
            <span>My Chatbots</span>
          </a>
          <a
            href="#"
            className="flex items-center p-2 text-white hover:bg-blue-500 rounded"
          >
            <span className="mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12l-3-3m0 0l-3 3m3-3v12M5 12a7 7 0 0114 0v4a2 2 0 01-2 2H7a2 2 0 01-2-2v-4z"
                />
              </svg>
            </span>
            <span>View Chatbot</span>
          </a>
          {/* Add other static menu items here */}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
