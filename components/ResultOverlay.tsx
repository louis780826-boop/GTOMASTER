"use client";

import React from "react";
import clsx from "clsx";

interface ResultOverlayProps {
  visible: boolean;
  title?: string;
  content?: string;
  onClose: () => void;
}

/**
 * ResultOverlay
 * 黑金精品彈窗 UI
 * - 霧面深黑透明背景
 * - 中心卡片黑金 Premium 風格
 * - 不動功能，只升級外觀
 */

export default function ResultOverlay({
  visible,
  title = "結果",
  content = "",
  onClose,
}: ResultOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className="
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/60 backdrop-blur-sm
        animate-fadeIn
      "
    >
      <div
        className="
          w-[90%] max-w-md rounded-xl p-6
          bg-[#0F1117]/95
          border border-[#d5b26e40]
          shadow-[0_0_25px_rgba(255,215,130,0.15)]
          animate-pop
        "
      >
        {/* Title */}
        <h2
          className="
            text-xl font-bold text-center mb-3 text-[#d5b26e]
            drop-shadow-[0_0_6px_rgba(255,215,130,0.25)]
          "
        >
          {title}
        </h2>

        {/* Divider */}
        <div className="mx-auto mb-4 h-[2px] w-20 bg-gradient-to-r from-[#d5b26e] to-[#926b3a] rounded-full" />

        {/* Content */}
        <p className="text-gray-200 text-center whitespace-pre-line leading-relaxed">
          {content}
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="
            w-full mt-6 py-2 rounded-lg font-semibold
            bg-[#0D0F15]
            text-[#d5b26e]
            border border-[#d5b26e50]
            hover:bg-[#1b1d22]
            hover:border-[#d5b26e80]
            hover:shadow-[0_0_12px_rgba(255,215,130,0.2)]
            transition-all
          "
        >
          關閉
        </button>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes pop {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-pop {
          animation: pop 0.2s ease-out;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
