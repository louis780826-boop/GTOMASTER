// app/api/payment/verify/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn("[Stripe] STRIPE_SECRET_KEY 未設定，/api/payment/verify 將無法正常運作");
}

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20",
    })
  : null;

/**
 * 驗證 Stripe Checkout Session
 * GET /api/payment/verify?sessionId=cs_xxx
 * 回傳 { ok, paid, tier }
 * 如已付款，順便在 cookie 設置 tier，之後前端再寫入 localStorage
 */
export async function GET(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { ok: false, error: "Stripe 尚未設定（缺少 STRIPE_SECRET_KEY）" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json(
      { ok: false, error: "缺少 sessionId" },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const paid =
      session.payment_status === "paid" ||
      session.status === "complete" ||
      (session.subscription ? true : false);

    const plan = (session.metadata?.plan as string | undefined) || "pro";

    let tier: "FREE" | "PRO" | "MASTER" = "FREE";
    if (paid) {
      tier = plan === "master" ? "MASTER" : "PRO";
    }

    const res = NextResponse.json({
      ok: true,
      paid,
      tier,
    });

    if (paid) {
      // 在 cookie 裡先存一份，之後前端會再寫入 localStorage
      res.cookies.set("gto_master_tier", tier, {
        maxAge: 60 * 60 * 24 * 60, // 60 天
        path: "/",
      });
    }

    return res;
  } catch (err) {
    console.error("[Stripe verify] error", err);
    return NextResponse.json(
      { ok: false, error: "查詢付款狀態失敗" },
      { status: 500 }
    );
  }
}
