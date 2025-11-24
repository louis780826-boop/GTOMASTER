"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { loadNickname, saveNickname } from "@/lib/storage";

export default function LoginPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadNickname();
    if (stored) {
      setHint(`已偵測到現有暱稱：${stored}（送出後會直接沿用）`);
      setNickname(stored);
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = nickname.trim();
    if (trimmed) {
      saveNickname(trimmed);
    }
    router.push("/practice");
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="card-frame">
        <div className="card-inner border-gto bg-surface-elevated p-6 text-xs text-gray-300">
          <h1 className="mb-2 text-lg font-semibold text-white">登入</h1>
          <p className="mb-3 text-[11px] text-gray-400">
            簡化示意版登入：只要設定暱稱，就會在右上角顯示 FREE+ 暱稱，作為之後串接真正帳號系統的 placeholder。
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-[11px] text-gray-300">
                暱稱
              </label>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full rounded-lg border border-gto bg-black/60 px-3 py-2 text-xs text-gray-100 outline-none focus:border-amber-300"
              />
            </div>
            {hint && (
              <div className="rounded-lg border border-gto bg-black/50 px-3 py-2 text-[11px] text-gray-400">
                {hint}
              </div>
            )}
            <button
              type="submit"
              className="w-full rounded-full border border-amber-300/80 bg-gradient-to-r from-amber-300/40 to-amber-200/20 px-4 py-2 text-[11px] font-semibold text-amber-50 hover:from-amber-300/50 hover:to-amber-200/30"
            >
              登入並前往訓練頁
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
