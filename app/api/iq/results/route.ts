import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStoreHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
};

export async function GET(request: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Payment processing is not configured." },
        { status: 500, headers: noStoreHeaders }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400, headers: noStoreHeaders }
      );
    }

    const stripe = new Stripe(stripeSecretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (
      session.mode !== "payment" ||
      session.metadata?.source !== "armortech-iq"
    ) {
      return NextResponse.json(
        { error: "Invalid ArmorTech IQ payment session." },
        { status: 400, headers: noStoreHeaders }
      );
    }

    const submissionId = session.metadata.submission_id;

    if (!submissionId) {
      return NextResponse.json(
        { error: "Missing diagnostic submission metadata." },
        { status: 400, headers: noStoreHeaders }
      );
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { paid: false },
        { headers: noStoreHeaders }
      );
    }

    const supabase = createSupabaseAdmin();

    const { error: updateError } = await supabase
      .from("diagnosis_submissions")
      .update({ payment_status: "paid" })
      .eq("id", submissionId);

    if (updateError) {
      console.error("Payment status update failed:", updateError);
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
        { status: 404, headers: noStoreHeaders }
      );
    }

    return NextResponse.json(
      {
        paid: true,
        ...submission,
      },
      { headers: noStoreHeaders }
    );
  } catch (error) {
    console.error("IQ results route failed:", error);

    return NextResponse.json(
      { error: "Unable to load diagnostic results." },
      { status: 500, headers: noStoreHeaders }
    );
  }
}
