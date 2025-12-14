import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subtotal, orderData } = body;

    // ✅ Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(subtotal * 100), // cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        orderName: orderData?.orderName || "N/A",
      },
    });
 

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err: any) {
    console.error("❌ Error creating PaymentIntent:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}