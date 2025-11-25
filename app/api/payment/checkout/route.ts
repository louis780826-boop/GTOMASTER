import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const plan = searchParams.get("plan"); // "pro" | "master"

    let priceId: string | null = null;

    if (plan === "pro") {
      priceId = process.env.STRIPE_PRICE_PRO || null;
    } else if (plan === "master") {
      priceId = process.env.STRIPE_PRICE_MASTER || null;
    }

    if (!priceId) {
      return NextResponse.json(
        { ok: false, error: "無效的方案，請稍後再試。" },
        { status: 400 }
      );
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/pricing/success?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing/cancel`,
    });

    if (!session.url) {
      return NextResponse.json(
        { ok: false, error: "無法建立結帳連結，請稍後再試。" },
        { status: 500 }
      );
    }

    // 讓瀏覽器直接跳轉到 Stripe 結帳頁
    return NextResponse.redirect(session.url, { status: 303 });
  } catch (err) {
    console.error("[CHECKOUT_ERROR]", err);
    return NextResponse.json(
      { ok: false, error: "建立結帳連結時發生錯誤。" },
      { status: 500 }
    );
  }
}
