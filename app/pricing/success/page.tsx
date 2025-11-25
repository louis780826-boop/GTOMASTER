"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessInner() {
  const params = useSearchParams();
  const session_id = params.get("session_id");

  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold mb-4">付款成功！</h1>
      <p className="text-lg">Session ID: {session_id}</p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <SuccessInner />
    </Suspense>
  );
}
