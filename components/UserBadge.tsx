// components/UserBadge.tsx
"use client";

import React from "react";

interface UserBadgeProps {
  username: string;
  tier: "FREE+";
}

export default function UserBadge({ username, tier }: UserBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="px-2 py-1 rounded-md text-[11px] font-bold tracking-wide bg-gradient-to-r from-[#FFD966] to-[#CFA63A] text-black shadow-[0_0_8px_rgba(255,215,100,0.6)]">
        {tier}
      </div>
      <span className="text-xs text-gray-200">{username}</span>
    </div>
  );
}
