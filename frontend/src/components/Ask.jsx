import React from "react";

function Ask({ handleSubmit, messages, setMessages }) {
  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={messages}
          onChange={(e) => setMessages(e.target.value)}
          placeholder="Ask anything..."
        />
        <button
          type="submit"
          className="px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Ask;