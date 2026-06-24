import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type PartRequestPayload = {
  diagnosisSubmissionId?: string | null;
  fullName?: string;
  email?: string;
  phone?: string;
  category?: string;
  deviceType?: string;
  brand?: string;
  modelNumber?: string;
  serialNumber?: string;
  symptom?: string;
  recommendedPart?: string;
  estimatedDiyCost?: string;
  proServiceRange?: string;
  customerNotes?: string;
};

function normalize(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function nullable(value: unknown) {
  const clean = normalize(value);
  return clean.length > 0 ? clean : null;
}

function escapeHtml(value: unknown) {
  return normalize(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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

function getNotifyRecipients() {
  const notifyEmail = process.env.ARMORTECH_NOTIFY_EMAIL;

  if (!notifyEmail) return [];

  return notifyEmail
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PartRequestPayload;

    const cleaned = {
      diagnosisSubmissionId: nullable(body.diagnosisSubmissionId),
      fullName: normalize(body.fullName),
      email: normalize(body.email),
      phone: normalize(body.phone),
      category: normalize(body.category),
      deviceType: normalize(body.deviceType),
      brand: normalize(body.brand),
      modelNumber: normalize(body.modelNumber),
      serialNumber: normalize(body.serialNumber),
      symptom: normalize(body.symptom),
      recommendedPart: normalize(body.recommendedPart),
      estimatedDiyCost: normalize(body.estimatedDiyCost),
      proServiceRange: normalize(body.proServiceRange),
      customerNotes: normalize(body.customerNotes),
    };

    const missingFields: string[] = [];

    if (!cleaned.fullName) missingFields.push("fullName");
    if (!cleaned.email) missingFields.push("email");
    if (!cleaned.phone) missingFields.push("phone");
    if (!cleaned.deviceType) missingFields.push("deviceType");
    if (!cleaned.brand) missingFields.push("brand");
    if (!cleaned.modelNumber) missingFields.push("modelNumber");
    if (!cleaned.symptom) missingFields.push("symptom");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    const { data: partRequest, error: insertError } = await supabase
      .from("part_requests")
      .insert({
        diagnosis_submission_id: cleaned.diagnosisSubmissionId,
        full_name: cleaned.fullName,
        email: cleaned.email,
        phone: cleaned.phone,
        category: cleaned.category,
        device_type: cleaned.deviceType,
        brand: cleaned.brand,
        model_number: cleaned.modelNumber,
        serial_number: cleaned.serialNumber,
        symptom: cleaned.symptom,
        recommended_part:
          cleaned.recommendedPart || "Technician verification needed",
        estimated_diy_cost: cleaned.estimatedDiyCost,
        pro_service_range: cleaned.proServiceRange,
        customer_notes: cleaned.customerNotes,
        status: "quote_requested",
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Supabase part request insert failed:", insertError);
      return NextResponse.json(
        { error: "Part request could not be saved." },
        { status: 500 }
      );
    }

    let notificationSent = false;
    let notificationError: string | null = null;

    const resendApiKey = process.env.RESEND_API_KEY;
    const notifyRecipients = getNotifyRecipients();
    const resendFrom =
      process.env.RESEND_FROM || "ArmorTech IQ <onboarding@resend.dev>";

    if (resendApiKey && notifyRecipients.length > 0) {
      try {
        const resend = new Resend(resendApiKey);

        await resend.emails.send({
          from: resendFrom,
          to: notifyRecipients,
          subject: `New ArmorTech Part Request - ${cleaned.deviceType}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
              <h2>New ArmorTech IQ Part Request</h2>

              <p><strong>Part Request ID:</strong> ${escapeHtml(partRequest?.id)}</p>
              <p><strong>Diagnosis Submission ID:</strong> ${
                cleaned.diagnosisSubmissionId
                  ? escapeHtml(cleaned.diagnosisSubmissionId)
                  : "Not linked"
              }</p>

              <hr />

              <h3>Customer</h3>
              <p><strong>Name:</strong> ${escapeHtml(cleaned.fullName)}</p>
              <p><strong>Email:</strong> ${escapeHtml(cleaned.email)}</p>
              <p><strong>Phone:</strong> ${escapeHtml(cleaned.phone)}</p>

              <hr />

              <h3>Device</h3>
              <p><strong>Category:</strong> ${escapeHtml(cleaned.category || "Not provided")}</p>
              <p><strong>Device:</strong> ${escapeHtml(cleaned.deviceType)}</p>
              <p><strong>Brand:</strong> ${escapeHtml(cleaned.brand)}</p>
              <p><strong>Model:</strong> ${escapeHtml(cleaned.modelNumber)}</p>
              <p><strong>Serial:</strong> ${escapeHtml(cleaned.serialNumber || "Not provided")}</p>
              <p><strong>Symptom / Known Problem:</strong> ${escapeHtml(cleaned.symptom)}</p>

              <hr />

              <h3>Part / Quote Details</h3>
              <p><strong>Recommended Part:</strong> ${escapeHtml(
                cleaned.recommendedPart || "Technician verification needed"
              )}</p>
              <p><strong>Estimated DIY Cost:</strong> ${escapeHtml(cleaned.estimatedDiyCost || "N/A")}</p>
              <p><strong>Pro Service Range:</strong> ${escapeHtml(cleaned.proServiceRange || "N/A")}</p>

              <h3>Customer Notes</h3>
              <p>${escapeHtml(cleaned.customerNotes || "No additional notes provided.")}</p>
            </div>
          `,
        });

        notificationSent = true;
      } catch (emailError) {
        console.error("Part request notification failed:", emailError);
        notificationError =
          emailError instanceof Error
            ? emailError.message
            : "Part request saved, but notification failed.";
      }
    } else {
      notificationError =
        "Part request saved, but RESEND_API_KEY or ARMORTECH_NOTIFY_EMAIL is missing.";
    }

    return NextResponse.json({
      success: true,
      partRequestId: partRequest?.id ?? null,
      notificationSent,
      notificationError,
    });
  } catch (error) {
    console.error("Part request route failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Part request failed.",
      },
      { status: 500 }
    );
  }
}