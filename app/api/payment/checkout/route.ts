// app/api/payment/checkout/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn("[Stripe] STRIPE_SECRET_KEY 未設定，/api/payment/checkout 將無法正常運作");
}

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20",
    })
  : null;

/**
 * 建立 Stripe Checkout Session 並導向付款頁
 * GET /api/payment/checkout?plan=pro|master
 */
export async function GET(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { ok: false, error: "Stripe 尚未設定（缺少 STRIPE_SECRET_KEY）" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const plan = (searchParams.get("plan") || "pro").toLowerCase();

  let priceId = "";
  if (plan === "master") {
    priceId = process.env.STRIPE_PRICE_MASTER || "";
  } else {
    // 預設走 PRO
    priceId = process.env.STRIPE_PRICE_PRO || "";
  }

  if (!priceId) {
    return NextResponse.json(
      { ok: false, error: "對應方案的 Stripe 價格代碼未設定" },
      { status: 500 }
    );
  }

  const origin =
    req.headers.get("origin") ?? new URL(req.url).origin ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    // 成功或取消後回到網站
    success_url: `${origin}/pricing/success?sessionId={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing/cancel`,
    metadata: {
      plan,
    },
  });

  if (!session.url) {
    return NextResponse.json(
      { ok: false, error: "Stripe 未回傳付款頁網址" },
      { status: 500 }
    );
  }

  return NextResponse.redirect(session.url, { status: 303 });
}
