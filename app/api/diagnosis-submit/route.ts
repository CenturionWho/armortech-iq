import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  buildDiagnosticResult,
  type DiagnosticFields,
} from "@/lib/diagnosisEngine";

export const runtime = "nodejs";

type DiagnosisMode = "needsDiagnosis" | "knownProblem";

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
  diagnosis_mode?: DiagnosisMode;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

const emptyDiagnostic: DiagnosticFields = {
  diagnosis_result: "",
  estimated_range: "",
  recommended_next_step: "",
  diy_part: "",
  diy_cost_range: "",
  pro_service_range: "",
};

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
    if (!clean(body.issue_description)) requiredFields.push("issue_description");

    if (requiredFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${requiredFields.join(", ")}` },
        { status: 400 }
      );
    }

    const diagnosisMode: DiagnosisMode =
      body.diagnosis_mode === "knownProblem"
        ? "knownProblem"
        : "needsDiagnosis";

    const category = clean(body.category);
    const deviceType = clean(body.device_type);
    const symptom = clean(body.symptom);

    const diagnostic =
      diagnosisMode === "needsDiagnosis"
        ? buildDiagnosticResult({
            category,
            deviceType,
            symptom,
          })
        : emptyDiagnostic;

    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
      .from("diagnosis_submissions")
      .insert({
        full_name: clean(body.full_name),
        email: clean(body.email),
        phone: clean(body.phone),
        category,
        device_type: deviceType,
        brand: clean(body.brand),
        model_number: clean(body.model_number),
        serial_number: clean(body.serial_number),
        symptom,
        issue_description: clean(body.issue_description),
        ...diagnostic,
        parts_notes: `Brand: ${clean(body.brand)}, Device: ${deviceType}, Model: ${clean(
          body.model_number
        )}, Serial: ${clean(body.serial_number)}`,
        payment_status:
          diagnosisMode === "needsDiagnosis" ? "unpaid" : "not_required",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Diagnosis submit insert failed:", error);

      return NextResponse.json(
        { error: "Unable to save the diagnostic request." },
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
      { error: "Diagnosis submission failed." },
      { status: 500 }
    );
  }
}
