import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type CheckoutRequest = {
  submissionId?: string;
  customerEmail?: string;
  fullName?: string;
  deviceType?: string;
};

function getBaseUrl(request: Request) {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.SITE_URL ||
    process.env.APP_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host");

  const proto =
    request.headers.get("x-forwarded-proto") || "https";

  if (host) {
    return `${proto}://${host}`;
  }

  return "https://iq.armortechrepair.com";
}

function getDiagnosticFeeCents() {
  const configuredAmount = process.env.DIAGNOSTIC_FEE_CENTS;

  if (!configuredAmount) {
    return 4500;
  }

  const parsedAmount = Number(configuredAmount);

  if (!Number.isFinite(parsedAmount) || parsedAmount < 100) {
    return 4500;
  }

  return Math.round(parsedAmount);
}

export async function POST(request: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    const body = (await request.json()) as CheckoutRequest;

    if (!body.submissionId) {
      return NextResponse.json(
        { error: "Missing submissionId. Submit the diagnosis form first." },
        { status: 400 }
      );
    }

    const baseUrl = getBaseUrl(request);
    const diagnosticFeeCents = getDiagnosticFeeCents();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: body.customerEmail || undefined,
      phone_number_collection: {
        enabled: true,
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "ArmorTech IQ Diagnostic Fee",
              description:
                "Unlocks diagnostic details, DIY part suggestions, cost ranges, and recommended next steps.",
            },
            unit_amount: diagnosticFeeCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/iq/results?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/iq/start?payment=cancelled&submission_id=${encodeURIComponent(
        body.submissionId
      )}`,
      metadata: {
        source: "armortech-iq",
        submission_id: body.submissionId,
        customer_email: body.customerEmail || "",
        full_name: body.fullName || "",
        device_type: body.deviceType || "",
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout session creation failed:", error);

    return NextResponse.json(
      { error: "Stripe session creation failed" },
      { status: 500 }
    );
  }
}