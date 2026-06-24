"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type DiagnosticResult = {
  paid: boolean;
  id?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  category?: string;
  device_type?: string;
  brand?: string;
  model_number?: string;
  serial_number?: string | null;
  symptom?: string;
  issue_description?: string;
  diagnosis_result?: string;
  estimated_range?: string;
  recommended_next_step?: string;
  diy_part?: string;
  diy_cost_range?: string;
  pro_service_range?: string;
  payment_status?: string;
};

function ResultsContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResult() {
      if (!sessionId) {
        setError("Missing payment session. Please contact ArmorTech.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/iq/results?session_id=${encodeURIComponent(sessionId)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load diagnostic results.");
        }

        setResult(data);
      } catch (err) {
        console.error("Results load failed:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load diagnostic results."
        );
      } finally {
        setLoading(false);
      }
    }

    loadResult();
  }, [sessionId]);

  async function requestPartQuote() {
    if (!result) return;

    try {
      const response = await fetch("/api/part-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          diagnosisSubmissionId: result.id || null,
          fullName: result.full_name || "",
          email: result.email || "",
          phone: result.phone || "",
          category: result.category || "",
          deviceType: result.device_type || "",
          brand: result.brand || "",
          modelNumber: result.model_number || "",
          serialNumber: result.serial_number || "",
          symptom: result.symptom || "",
          recommendedPart: result.diy_part || "",
          estimatedDiyCost: result.diy_cost_range || "",
          proServiceRange: result.pro_service_range || "",
          customerNotes:
            "Customer requested a part quote from the paid IQ results page.",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Part request failed.");
      }

      alert("Part request sent. ArmorTech will review and follow up.");
    } catch (err) {
      console.error("Part request failed:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Part request failed. Please contact ArmorTech."
      );
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-orange-500">
            Loading Your Diagnostic Results...
          </h1>
          <p className="mt-4 text-zinc-300">
            Please wait while ArmorTech IQ confirms your payment.
          </p>
        </div>
      </main>
    );
  }

  if (error || !result) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <div className="mx-auto max-w-3xl rounded-xl border border-orange-500 bg-zinc-950 p-6">
          <h1 className="text-3xl font-bold text-orange-500">
            Payment Received
          </h1>

          <p className="mt-4 text-zinc-200">
            {error ||
              "Your payment was received, but your results could not be displayed automatically."}
          </p>

          <p className="mt-4 text-zinc-400">
            ArmorTech still has your diagnostic request. We will review it
            manually if the results page does not load.
          </p>
        </div>
      </main>
    );
  }

  if (!result.paid) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <div className="mx-auto max-w-3xl rounded-xl border border-zinc-700 bg-zinc-950 p-6">
          <h1 className="text-3xl font-bold text-orange-500">
            Results Locked
          </h1>

          <p className="mt-4 text-zinc-300">
            Payment has not been confirmed yet. If your card was charged, wait a
            moment and refresh this page.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-xl border border-orange-500 bg-zinc-950 p-6">
          <p className="text-sm uppercase tracking-wide text-orange-500">
            Payment Confirmed
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            ArmorTech IQ Diagnostic Results
          </h1>

          <p className="mt-4 text-zinc-300">
            These results are based on the information submitted. Final repair
            pricing, parts availability, and board-level faults may require
            manual ArmorTech review.
          </p>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold text-orange-500">
            Customer / Device
          </h2>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <p>
              <span className="font-semibold">Name:</span>{" "}
              {result.full_name || "Not provided"}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {result.email || "Not provided"}
            </p>
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              {result.phone || "Not provided"}
            </p>
            <p>
              <span className="font-semibold">Category:</span>{" "}
              {result.category || "Not provided"}
            </p>
            <p>
              <span className="font-semibold">Device:</span>{" "}
              {result.device_type || "Not provided"}
            </p>
            <p>
              <span className="font-semibold">Brand:</span>{" "}
              {result.brand || "Not provided"}
            </p>
            <p>
              <span className="font-semibold">Model:</span>{" "}
              {result.model_number || "Not provided"}
            </p>
            <p>
              <span className="font-semibold">Serial:</span>{" "}
              {result.serial_number || "Not provided"}
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold text-orange-500">
            Reported Symptom
          </h2>

          <p className="mt-4 text-zinc-200">
            {result.symptom || "No symptom provided."}
          </p>

          {result.issue_description ? (
            <p className="mt-4 text-zinc-400">{result.issue_description}</p>
          ) : null}
        </section>

        <section className="rounded-xl border border-orange-500 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold text-orange-500">Likely Cause</h2>

          <p className="mt-4 text-zinc-200">
            {result.diagnosis_result ||
              "Manual technician review is required for this issue."}
          </p>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold text-orange-500">
            Estimated Ranges
          </h2>

          <div className="mt-4 space-y-3">
            <p>
              <span className="font-semibold">Overall Estimate:</span>{" "}
              {result.estimated_range || "Manual review required"}
            </p>
            <p>
              <span className="font-semibold">DIY Part Range:</span>{" "}
              {result.diy_cost_range || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Pro Service Range:</span>{" "}
              {result.pro_service_range || "N/A"}
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold text-orange-500">
            Suggested Part / Repair Direction
          </h2>

          <p className="mt-4 text-zinc-200">
            {result.diy_part ||
              "Part recommendation requires technician verification."}
          </p>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold text-orange-500">
            Recommended Next Step
          </h2>

          <p className="mt-4 text-zinc-200">
            {result.recommended_next_step ||
              "ArmorTech will review your request and contact you if more information is needed."}
          </p>
        </section>

        <section className="rounded-xl border border-orange-500 bg-orange-500 p-6 text-black">
          <h2 className="text-2xl font-bold">Need ArmorTech to Source It?</h2>

          <p className="mt-3">
            Request a part quote and ArmorTech will verify compatibility before
            recommending or sourcing the part.
          </p>

          <button
            type="button"
            onClick={requestPartQuote}
            className="mt-5 rounded-lg bg-black px-5 py-3 font-bold text-white hover:bg-zinc-900"
          >
            Request Part Quote
          </button>
        </section>
      </div>
    </main>
  );
}

export default function IQResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black p-6 text-white">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-orange-500">
              Loading Results...
            </h1>
          </div>
        </main>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}