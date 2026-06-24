import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type DiagnosisSubmitPayload = {
  full_name?: string;
  email?: string;
  phone?: string;
  category?: string;
  device_type?: string;
  brand?: string;
  model_number?: string;
  serial_number?: string;
  symptom?: string;
  issue_description?: string;
  diagnosis_result?: string;
  estimated_range?: string;
  recommended_next_step?: string;
  diy_part?: string;
  diy_cost_range?: string;
  pro_service_range?: string;
  parts_notes?: string;
  payment_status?: string;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DiagnosisSubmitPayload;

    const requiredFields: string[] = [];

    if (!clean(body.full_name)) requiredFields.push("full_name");
    if (!clean(body.email)) requiredFields.push("email");
    if (!clean(body.phone)) requiredFields.push("phone");
    if (!clean(body.category)) requiredFields.push("category");
    if (!clean(body.device_type)) requiredFields.push("device_type");
    if (!clean(body.brand)) requiredFields.push("brand");
    if (!clean(body.model_number)) requiredFields.push("model_number");
    if (!clean(body.symptom)) requiredFields.push("symptom");

    if (requiredFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${requiredFields.join(", ")}` },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
      .from("diagnosis_submissions")
      .insert({
        full_name: clean(body.full_name),
        email: clean(body.email),
        phone: clean(body.phone),
        category: clean(body.category),
        device_type: clean(body.device_type),
        brand: clean(body.brand),
        model_number: clean(body.model_number),
        serial_number: clean(body.serial_number),
        symptom: clean(body.symptom),
        issue_description: clean(body.issue_description),
        diagnosis_result: clean(body.diagnosis_result),
        estimated_range: clean(body.estimated_range),
        recommended_next_step: clean(body.recommended_next_step),
        diy_part: clean(body.diy_part),
        diy_cost_range: clean(body.diy_cost_range),
        pro_service_range: clean(body.pro_service_range),
        parts_notes: clean(body.parts_notes),
        payment_status: clean(body.payment_status) || "unpaid",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Diagnosis submit insert failed:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      submissionId: data.id,
    });
  } catch (error) {
    console.error("Diagnosis submit route failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Diagnosis submission failed.",
      },
      { status: 500 }
    );
  }
}