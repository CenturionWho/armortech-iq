import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function createSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function GET(request: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);
    const supabase = createSupabaseAdmin();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const submissionId = session.metadata?.submission_id;

    if (!submissionId) {
      return NextResponse.json(
        { error: "Missing diagnostic submission metadata." },
        { status: 400 }
      );
    }

    const paid = session.payment_status === "paid";

    if (paid) {
      const { error: updateError } = await supabase
        .from("diagnosis_submissions")
        .update({
          payment_status: "paid",
          stripe_checkout_session_id: sessionId,
        })
        .eq("id", submissionId);

      if (updateError) {
        console.error("Payment status update failed:", updateError);
      }
    }

    const { data: submission, error: fetchError } = await supabase
      .from("diagnosis_submissions")
      .select(
        `
        id,
        full_name,
        email,
        phone,
        category,
        device_type,
        brand,
        model_number,
        serial_number,
        symptom,
        issue_description,
        diagnosis_result,
        estimated_range,
        recommended_next_step,
        diy_part,
        diy_cost_range,
        pro_service_range,
        payment_status
      `
      )
      .eq("id", submissionId)
      .single();

    if (fetchError || !submission) {
      console.error("Diagnostic result fetch failed:", fetchError);

      return NextResponse.json(
        { error: "Diagnostic submission not found." },
        { status: 404 }
      );
    }

    const paymentConfirmed =
      paid || submission.payment_status === "paid";

    return NextResponse.json({
      paid: paymentConfirmed,
      ...submission,
    });
  } catch (error) {
    console.error("IQ results route failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load diagnostic results.",
      },
      { status: 500 }
    );
  }
}