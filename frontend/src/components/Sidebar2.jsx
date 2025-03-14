import { Button } from "@material-tailwind/react";
import axios from "axios";
import {
  MoreVertical,
  ChevronLast,
  ChevronFirst,
  ClipboardPen,
} from "lucide-react";
import { useContext, createContext, useState, useEffect } from "react";

const SidebarContext = createContext();

export default function Sidebar2({ chatId, setChatId, startNewChat }) {
  const [expanded, setExpanded] = useState(true);
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
      className={`h-screen transition-all duration-300 ${
        expanded ? "w-[260px]" : "w-[60px]"
      }`}
    >
      <nav
        className={`h-full flex flex-col bg-[#09032e] border-r shadow-sm transition-all duration-300 ${
          expanded ? "w-[260px]" : "w-[60px]"
        }`}
      >
        <div className="p-4 pb-2 flex justify-between items-center ">
          <div className="flex flex-row items-center gap-2">
            <img
              src="https://www.impactoverse.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcolored_white.279e09d9.png&w=384&q=75"
              className={`overflow-hidden transition-all ${
                expanded ? "w-32" : "w-0"
              }`}
              alt=""
            />

            <button
              onClick={startNewChat}
              className={`text-white rounded mb-4 mt-3 px-3 hover:bg-[#2b245d] ${
                expanded ? "visible" : "hidden"
              }`}
            >
              <ClipboardPen />
            </button>

            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1 rounded-lg   px-1 text-white hover:bg-[#2b245d] "
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <div
            className="overflow-y-auto"
            style={{ scrollbarColor: "gray transparent" }}
          >
            <nav className="space-y-2">
              {/* Dynamic chat list */}

              {chatList.length > 0 && (
                <ul>
                  {chatList.map((chat) => (
                    <div
                      className={` transition-all duration-300 ${
                        expanded ? "visible" : "hidden"
                      }`}
                    >
                      <li
                        key={chat.chat_id}
                        onClick={() => setChatId(chat.chat_id)}
                        className={` flex justify-start p-3 mx-3   cursor-pointer text-sm text-white rounded ${
                          chatId === chat.chat_id
                            ? "bg-blue-500"
                            : "hover:bg-[#2b245d]"
                        }`}
                      >
                        Chat {chat.chat_id.slice(-4)}{" "}
                        {/* Show last 4 chars of chat_id */}
                      </li>
                    </div>
                  ))}
                </ul>
              )}
            </nav>
          </div>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }
    `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-indigo-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
