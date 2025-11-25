import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // ← 這行是重點

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return NextResponse.json({ ok: false, error: "missing_session_id" });
  }

  // 你原本的 Stripe 驗證邏輯放這裡
  return NextResponse.json({
    ok: true,
    session_id,
  });
}
