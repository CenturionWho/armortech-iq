import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const DIAGNOSTIC_FEE_CENTS = 2500;

type CheckoutRequest = {
  submissionId?: string;
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

export async function POST(request: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Payment processing is not configured." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as CheckoutRequest;

    if (!body.submissionId) {
      return NextResponse.json(
        { error: "Missing submissionId. Submit the diagnosis form first." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();
    const { data: submission, error: submissionError } = await supabase
      .from("diagnosis_submissions")
      .select("id, email, full_name, device_type, payment_status")
      .eq("id", body.submissionId)
      .single();

    if (submissionError || !submission) {
      return NextResponse.json(
        { error: "Diagnostic submission not found." },
        { status: 404 }
      );
    }

    if (submission.payment_status === "paid") {
      return NextResponse.json(
        { error: "This diagnostic has already been paid." },
        { status: 409 }
      );
    }

    if (submission.payment_status !== "unpaid") {
      return NextResponse.json(
        { error: "This request does not require diagnostic payment." },
        { status: 400 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);
    const baseUrl = getBaseUrl(request);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: submission.email || undefined,
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
            unit_amount: DIAGNOSTIC_FEE_CENTS,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/iq/results?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/iq/start?payment=cancelled&submission_id=${encodeURIComponent(
        submission.id
      )}`,
      metadata: {
        source: "armortech-iq",
        submission_id: submission.id,
        customer_email: submission.email || "",
        full_name: submission.full_name || "",
        device_type: submission.device_type || "",
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
      { error: "Stripe session creation failed." },
      { status: 500 }
    );
  }
}
