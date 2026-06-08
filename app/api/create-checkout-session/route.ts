import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "ArmorTech IQ Diagnostic Fee",
            },
            unit_amount: 4500,
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/iq/start?payment=success",
      cancel_url: "http://localhost:3000/iq/start?payment=cancelled",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Stripe session creation failed" },
      { status: 500 }
    );
  }
}