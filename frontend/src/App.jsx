import { useState } from "react";

import "./App.css";
import Chat from "./components/Chat";

function App() {
  return (
    <div className="relative w-full bg-[#251952] overflow-hidden">
      {/* SVG Background */}
      <svg
        className="absolute top-0 left-0 w-full h-full z-10"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 805 676"
        fill="none"
      >
        <g filter="url(#filter0_f_4_22)">
          <path
            d="M384.545 304.5C384.545 353.929 284.766 467 237.545 467C190.325 467 201.045 353.929 201.045 304.5C201.045 255.071 247.325 215 294.545 215C341.766 215 384.545 255.071 384.545 304.5Z"
            fill="url(#paint0_linear_4_22)"
          />
          <path
            d="M583.546 289.5C583.546 338.929 630.766 475.5 583.546 475.5C536.325 475.5 400.045 338.929 400.045 289.5C400.045 240.071 446.325 200 493.545 200C540.766 200 583.546 240.071 583.546 289.5Z"
            fill="url(#paint1_linear_4_22)"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_4_22"
            x="0"
            y="0"
            width="804.532"
            height="675.5"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="100"
              result="effect1_foregroundBlur_4_22"
            />
          </filter>
          <linearGradient
            id="paint0_linear_4_22"
            x1="366.773"
            y1="274.5"
            x2="366.773"
            y2="526.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.169288" stopColor="#E1A543" />
            <stop offset="1" stopColor="#FF4FE2" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_4_22"
            x1="325.952"
            y1="268.908"
            x2="325.952"
            y2="520.908"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.169288" stopColor="#7343E1" />
            <stop offset="1" stopColor="#FF4FE2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Chat Component */}
      <div className="relative z-20">
        <Chat />
      </div>
    </div>
  );
}

export default App;
