"use client";

import { useState } from "react";
import { register } from "../../utils/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [err, setErr] = useState("");

  function handleRegister() {
    const e = register(username, password);
    if (e) setErr(e);
    else router.push("/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-6">
      <div className="max-w-sm w-full bg-[#111113] border border-[#2a2a2a] rounded-xl p-6 shadow-[0_0_12px_rgba(255,215,100,0.15)] space-y-6">

        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-[#FFD966] to-[#CFA63A] text-transparent bg-clip-text">
          註冊 FREE+
        </h1>

        <input
          className="w-full p-3 bg-[#0e0e10] rounded-md border border-[#444] text-sm focus:outline-none"
          placeholder="使用者名稱"
          value={username}
          onChange={(e) => setU(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 bg-[#0e0e10] rounded-md border border-[#444] text-sm"
          placeholder="密碼"
          value={password}
          onChange={(e) => setP(e.target.value)}
        />

        {err && <div className="text-red-400 text-sm text-center">{err}</div>}

        <button
          onClick={handleRegister}
          className="w-full py-3 bg-gradient-to-br from-[#FFD966] to-[#CFA63A] text-black rounded-md font-bold shadow-[0_0_10px_rgba(255,215,100,0.4)]"
        >
          註冊
        </button>

        <button
          onClick={() => router.push("/login")}
          className="w-full py-2 text-sm text-gray-400 hover:text-[#FFD966]"
        >
          已經有帳號？登入 →
        </button>
      </div>
    </div>
  );
}
