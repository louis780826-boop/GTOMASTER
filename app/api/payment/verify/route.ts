import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { ok: false, error: "缺少 sessionId" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.status !== "complete") {
      return NextResponse.json(
        { ok: false, error: "付款尚未完成" },
        { status: 400 }
      );
    }

    // 這邊可以之後再接真正的會員升級邏輯
    // 目前先根據 price 判斷是 PRO 還是 MASTER
    const lineItemPrice = (session as any).line_items?.[0]?.price?.id;
    let plan: "PRO" | "MASTER" | "UNKNOWN" = "UNKNOWN";

    if (lineItemPrice === process.env.STRIPE_PRICE_PRO) {
      plan = "PRO";
    } else if (lineItemPrice === process.env.STRIPE_PRICE_MASTER) {
      plan = "MASTER";
    }

    return NextResponse.json({
      ok: true,
      sessionId,
      plan,
    });
  } catch (err) {
    console.error("[VERIFY_ERROR]", err);
    return NextResponse.json(
      { ok: false, error: "驗證付款時發生錯誤。" },
      { status: 500 }
    );
  }
}
