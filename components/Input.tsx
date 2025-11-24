"use client";

import * as React from "react";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Input({ className, ...rest }: Props) {
  return (
    <textarea
      {...rest}
      className={
        "w-full rounded-xl border border-[#2b2e3c] bg-[#050813] px-3 py-2 " +
        "text-sm text-[#e2e4f0] placeholder:text-[#6b7087] " +
        "focus:outline-none focus:border-[#f1d9a5] focus:ring-1 focus:ring-[#f1d9a5] " +
        "min-h-[80px] " +
        (className ?? "")
      }
    />
  );
}
