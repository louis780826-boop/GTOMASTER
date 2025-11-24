"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTier } from "../../../lib/tier/useTier";

export default function PricingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setTier } = useTier();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const sessionId = searchParams.get("sessionId");
    if (!sessionId) {
      setStatus("error");
      setMessage("缺少 sessionId 參數，無法確認付款狀態。");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/payment/verify?sessionId=${sessionId}`);
        const data = await res.json();
        if (!data.ok || !data.paid) {
          setStatus("error");
          setMessage(data.error || "付款尚未完成，請稍後再試或聯繫我。");
          return;
        }

        if (data.tier === "PRO" || data.tier === "MASTER") {
          setTier(data.tier);
        }

        setStatus("ok");
        setMessage(
          data.tier === "MASTER"
            ? "已成功升級為 MASTER 方案！"
            : "已成功升級為 PRO 方案！"
        );

        // 3 秒後自動回 Dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("確認付款狀態時發生錯誤。");
      }
    };

    verify();
  }, [searchParams, router, setTier]);

  return (
    <main className="min-h-screen bg-[#05060a] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full border border-yellow-500/40 rounded-2xl bg-black/40 p-6 text-center">
        {status === "loading" && (
          <>
            <p className="text-yellow-200 text-lg font-semibold mb-2">
              確認付款中…
            </p>
            <p className="text-sm text-gray-300">
              正在向 Stripe 查詢付款狀態，請稍候。
            </p>
          </>
        )}

        {status === "ok" && (
          <>
            <p className="text-yellow-200 text-lg font-semibold mb-2">
              {message}
            </p>
            <p className="text-sm text-gray-300 mb-4">
              3 秒後會自動帶你回到 Dashboard，你也可以手動點下面按鈕。
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-sm font-semibold"
            >
              立刻前往 Dashboard
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <p className="text-red-400 text-lg font-semibold mb-2">
              付款狀態確認失敗
            </p>
            <p className="text-sm text-gray-300 mb-4">{message}</p>
            <button
              onClick={() => router.push("/pricing")}
              className="px-4 py-2 rounded-xl border border-yellow-500/60 text-yellow-200 text-sm"
            >
              回到方案頁
            </button>
          </>
        )}
      </div>
    </main>
  );
}
