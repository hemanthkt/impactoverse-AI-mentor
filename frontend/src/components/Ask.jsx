import React from "react";

function Ask({ handleSubmit, messages, setMessages }) {
  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={messages}
          onChange={(e) => setMessages(e.target.value)}
          placeholder="Ask anything..."
        />
        <button
          type="submit"
          className="px-4 text-white rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition duration-300 drop-shadow-md"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Ask;