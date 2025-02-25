import React from "react";

function Ask({ handleSubmit, messages, setMessages }) {
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={messages}
        onChange={(e) => setMessages(e.target.value)}
        placeholder="Ask anything..."
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default Ask;
