import { X } from "lucide-react";
import React from "react";

export default function Card({ setShowCard }) {
  const handleRedirect = () => {
    window.location.href = " http://localhost:3001";
  };

  return (
    <div className="relative w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <div className=" ">
        <button
          className="absolute top-1 right-2 p-2"
          onClick={() => setShowCard(false)}
        >
          <X size={20} className="text-white" />
        </button>
      </div>
      <div className="">
        <ul className="text-white mt-4">
          <li className="text-white mb-2 bg-blue-700  hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">
            Chat Bot
          </li>
          <li
            onClick={handleRedirect}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center"
          >
            AI-mentor
          </li>
        </ul>
      </div>
    </div>
  );
}
