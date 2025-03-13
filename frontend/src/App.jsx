import { useState } from "react";

import "./App.css";
import Chat from "./components/Chat";

function App() {
  return (
    <div className="relative w-full bg-[#09032e] overflow-hidden ">
      {/* Chat Component */}
      <div className="relative z-20">
        <Chat />
      </div>
    </div>
  );
}

export default App;
