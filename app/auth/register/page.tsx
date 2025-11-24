"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { saveNickname } from "@/lib/storage";

export default function RegisterPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = nickname.trim();
    if (!trimmed) {
      setError("請輸入暱稱，之後會顯示在右上角 FREE+ 區域。");
      return;
    }
    saveNickname(trimmed);
    router.push("/practice");
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="card-frame">
        <div className="card-inner border-gto bg-surface-elevated p-6">
          <h1 className="mb-2 text-lg font-semibold text-white">免費註冊</h1>
          <p className="mb-4 text-xs text-gray-400">
            目前為本地示意版：暱稱會存到瀏覽器 localStorage，右上角會顯示 FREE+ 暱稱，並帶你回到訓練頁面。
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="mb-1 block text-[11px] text-gray-300">
                暱稱（之後會顯示為 FREE+ 暱稱）
              </label>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full rounded-lg border border-gto bg-black/60 px-3 py-2 text-xs text-gray-100 outline-none focus:border-amber-300"
                placeholder="例如：WeiLun、PokerWolf..."
              />
            </div>
            {error && (
              <div className="rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-[11px] text-red-200">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full rounded-full border border-amber-300/80 bg-gradient-to-r from-amber-300/40 to-amber-200/20 px-4 py-2 text-[11px] font-semibold text-amber-50 hover:from-amber-300/50 hover:to-amber-200/30"
            >
              註冊並開始訓練
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
