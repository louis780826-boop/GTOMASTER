"use client";

import React from "react";

const HexCoach: React.FC = () => {
  return (
    <div className="hex-coach-wrapper">
      <div className="hex-coach-frame">
        <div className="hex-coach-core">
          <svg
            width="46"
            height="46"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d8b565"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="7" r="4"></circle>
            <path d="M5.5 21c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HexCoach;
