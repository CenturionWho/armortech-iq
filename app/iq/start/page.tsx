"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

////////////////////////////////////////////////////////////////////////////////
// DATASET DEFINITIONS
////////////////////////////////////////////////////////////////////////////////

const DIAGNOSTIC_FEE_LABEL = "$25 diagnostic fee";

type DiagnosisMode = "needsDiagnosis" | "knownProblem";

type FormDataState = {
  fullName: string;
  email: string;
  phone: string;
  category: string;
  deviceType: string;
  brand: string;
  modelNumber: string;
  serialNumber: string;
  symptom: string;
  knownProblem: string;
  issue: string;
};

const categories: Record<string, string[]> = {
  Appliances: [
    "Refrigerator",
    "Washer",
    "Dryer",
    "Dishwasher",
    "Oven/Range",
    "Microwave",
    "Ice Maker",
    "Freezer",
    "Cooktop",
    "Garbage Disposal",
  ],
  Electronics: [
    "Television",
    "Desktop PC",
    "Laptop",
    "Tablet",
    "Phone",
    "Stereo Receiver",
    "Amplifier",
    "Soundbar",
    "Speakers",
  ],
  "Game Consoles": [
    "Original Xbox",
    "Xbox 360",
    "Xbox 360 S",
    "Xbox 360 E",
    "Xbox One",
    "Xbox One S",
    "Xbox One X",
    "Xbox Series S",
    "Xbox Series X",
    "PlayStation 1",
    "PlayStation 2",
    "PlayStation 2 Slim",
    "PlayStation 3",
    "PlayStation 3 Slim",
    "PlayStation 3 Super Slim",
    "PlayStation 4",
    "PlayStation 4 Slim",
    "PlayStation 4 Pro",
    "PlayStation 5 Disc Edition",
    "PlayStation 5 Digital Edition",
    "PlayStation 5 Slim Disc",
    "PlayStation 5 Slim Digital",
    "Nintendo NES",
    "Super Nintendo",
    "Nintendo 64",
    "Nintendo GameCube",
    "Nintendo Wii",
    "Nintendo Wii U",
    "Nintendo Switch",
    "Nintendo Switch Lite",
    "Nintendo Switch OLED",
    "Nintendo Switch 2",
    "Game Boy",
    "Game Boy Color",
    "Game Boy Advance",
    "Game Boy Advance SP",
    "Nintendo DS",
    "Nintendo DS Lite",
    "Nintendo DSi",
    "Nintendo 2DS",
    "Nintendo 3DS",
    "New Nintendo 3DS",
    "Sega Genesis",
    "Sega Saturn",
    "Sega Dreamcast",
    "Steam Deck",
    "ASUS ROG Ally",
    "Lenovo Legion Go",
    "Other Console",
  ],
};

const brandOptions: Record<string, string[]> = {
  Appliances: [
    "Whirlpool",
    "Maytag",
    "KitchenAid",
    "Amana",
    "JennAir",
    "Roper",
    "Admiral",
    "GE",
    "GE Profile",
    "Café",
    "Hotpoint",
    "Haier",
    "LG",
    "Samsung",
    "Frigidaire",
    "Electrolux",
    "Kenmore",
    "Bosch",
    "Thermador",
    "Miele",
    "Sub-Zero",
    "Wolf",
    "Viking",
    "Dacor",
    "Fisher & Paykel",
    "Speed Queen",
    "Midea",
    "Hisense",
    "Insignia",
    "Magic Chef",
    "Danby",
    "Galanz",
    "Sharp",
    "Toshiba",
    "Panasonic",
    "Scotsman",
    "Hoshizaki",
    "Manitowoc",
    "Ice-O-Matic",
    "NewAir",
    "EdgeStar",
    "U-Line",
    "Rovsun",
    "Other / Not Listed",
  ],
  Electronics: [
    "Samsung",
    "LG",
    "Sony",
    "TCL",
    "Hisense",
    "Vizio",
    "Insignia",
    "RCA",
    "Sharp",
    "Toshiba",
    "Panasonic",
    "Dell",
    "HP",
    "Lenovo",
    "Apple",
    "ASUS",
    "Acer",
    "MSI",
    "Onkyo",
    "Denon",
    "Yamaha",
    "Marantz",
    "Pioneer",
    "Sony Audio",
    "Bose",
    "JBL",
    "Klipsch",
    "Other / Not Listed",
  ],
  "Game Consoles": [
    "Microsoft",
    "Sony",
    "Nintendo",
    "Valve",
    "ASUS",
    "Lenovo",
    "Sega",
    "Atari",
    "Other / Not Listed",
  ],
};

const symptomOptions: Record<string, string[]> = {
  "Refrigerator": [
    "Not cooling",
    "Leaking water",
    "Ice maker not working",
    "Noisy operation"
  ],
  "Washer": [
    "Won’t start",
    "Not draining",
    "Shaking or banging"
  ],
  "Dryer": [
    "No heat",
    "Won’t start",
    "Taking too long to dry"
  ],
  "Dishwasher": [
    "No power",
    "Not draining",
    "Leaking"
  ],
  "Oven/Range": [
    "Oven not heating",
    "Burner not working"
  ],
  "Microwave": [
    "Not heating",
    "No power"
  ],
  "Ice Maker": [
    "Not making ice",
    "Leaking"
  ],
  "Freezer": [
    "Not freezing",
    "Frost buildup"
  ],
  "Television": [
    "No power",
    "Backlight but no picture",
    "Sound but no picture",
    "Lines on screen"
  ],
  "Desktop PC": [
    "No power",
    "Turns on but no display"
  ],
  "Laptop": [
    "No power",
    "Cracked screen",
    "Overheating"
  ],
  "Tablet": [
    "Cracked screen",
    "Not charging"
  ],
  "Phone": [
    "Not charging",
    "Cracked screen"
  ],
  "Stereo Receiver": [
    "No power",
    "Goes into protect mode"
  ],
  "Amplifier": [
    "No sound",
    "Distorted sound"
  ],
  "Soundbar": [
    "No power",
    "No sound"
  ],
  "Game Console": [
    "HDMI port issues",
    "No power",
    "Overheating",
    "Disc drive issue"
  ]
};

const emptyFormData: FormDataState = {
  fullName: "",
  email: "",
  phone: "",
  category: "",
  deviceType: "",
  brand: "",
  modelNumber: "",
  serialNumber: "",
  symptom: "",
  knownProblem: "",
  issue: "",
};

function isGameConsole(deviceType: string) {
  return categories["Game Consoles"].includes(deviceType);
}

////////////////////////////////////////////////////////////////////////////////
// COMPONENT
////////////////////////////////////////////////////////////////////////////////

export default function StartDiagnosis() {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [partRequestSent, setPartRequestSent] = useState(false);
  const [requestingPart, setRequestingPart] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [lastError, setLastError] = useState("");
  const [diagnosisMode, setDiagnosisMode] = useState<DiagnosisMode>("needsDiagnosis");
  const [formData, setFormData] = useState<FormDataState>(emptyFormData);

  const selectedProfileKey = isGameConsole(formData.deviceType)
    ? "Game Console"
    : formData.deviceType;
  const deviceTypes = formData.category ? categories[formData.category] || [] : [];
  const symptoms = symptomOptions[selectedProfileKey] || [];

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleModeChange(mode: DiagnosisMode) {
    setDiagnosisMode(mode);
    setSubmitted(false);
    setPartRequestSent(false);
    setLastError("");
    setFormData((previous) => ({
      ...previous,
      symptom: "",
      knownProblem: "",
    }));
  }

  function handleCategoryChange(e: ChangeEvent<HTMLSelectElement>) {
    const category = e.target.value;

    setFormData((previous) => ({
      ...previous,
      category,
      deviceType: "",
      brand: "",
      modelNumber: "",
      serialNumber: "",
      symptom: "",
      knownProblem: "",
    }));
  }

  function handleDeviceTypeChange(e: ChangeEvent<HTMLSelectElement>) {
    const deviceType = e.target.value;

    setFormData((previous) => ({
      ...previous,
      deviceType,
      symptom: "",
      knownProblem: "",
    }));
  }

  async function startStripeCheckout(submissionIdToPay: string) {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        submissionId: submissionIdToPay,
        customerEmail: formData.email,
        fullName: formData.fullName,
        deviceType: formData.deviceType,
      }),
    });

    const checkoutData = await response.json();

    if (!response.ok || !checkoutData.url) {
      throw new Error(checkoutData.error || "Unable to start Stripe checkout.");
    }

    window.location.href = checkoutData.url;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setLastError("");
    setPartRequestSent(false);

    try {
      const finalSymptom =
        diagnosisMode === "knownProblem" ? formData.knownProblem : formData.symptom;

      const paymentStatus = diagnosisMode === "needsDiagnosis" ? "unpaid" : "not_required";

      const submitResponse = await fetch("/api/diagnosis-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          category: formData.category,
          device_type: formData.deviceType,
          brand: formData.brand,
          model_number: formData.modelNumber.trim(),
          serial_number: formData.serialNumber.trim(),
          symptom: finalSymptom,
          issue_description: formData.issue.trim(),
          diagnosis_mode: diagnosisMode,
          parts_notes: `Brand: ${formData.brand}, Device: ${formData.deviceType}, Model: ${formData.modelNumber}, Serial: ${formData.serialNumber}`,
          payment_status: paymentStatus,
        }),
      });

      const submitData = await submitResponse.json();

      if (!submitResponse.ok) {
        throw new Error(submitData.error || "Submission failed.");
      }

      if (!submitData.submissionId) {
        throw new Error("Submission saved, but no submission ID was returned.");
      }

      setSubmissionId(submitData.submissionId);

      if (diagnosisMode === "needsDiagnosis") {
        await startStripeCheckout(submitData.submissionId);
        return;
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Diagnostic submission failed:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again or contact ArmorTech.";
      setLastError(message);
      alert(message);
    } finally {
      setSaving(false);
    }
  }

  async function handlePartRequest() {
    if (!submissionId) {
      alert("Missing submission ID. Please submit the request again.");
      return;
    }

    setRequestingPart(true);
    setLastError("");

    try {
      const response = await fetch("/api/part-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          diagnosisSubmissionId: submissionId,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          category: formData.category,
          deviceType: formData.deviceType,
          brand: formData.brand,
          modelNumber: formData.modelNumber,
          serialNumber: formData.serialNumber,
          symptom:
            diagnosisMode === "needsDiagnosis"
              ? formData.symptom
              : formData.knownProblem,
          recommendedPart: "Technician verification requested",
          estimatedDiyCost: "Manual quote required",
          proServiceRange: "Manual quote required",
          customerNotes: formData.issue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Part quote request failed.");
      }

      setPartRequestSent(true);
    } catch (error) {
      console.error("Part quote request failed:", error);
      const message =
        error instanceof Error ? error.message : "Part quote request failed.";
      setLastError(message);
      alert(message);
    } finally {
      setRequestingPart(false);
    }
  }

  function resetForm() {
    setSubmitted(false);
    setSaving(false);
    setPartRequestSent(false);
    setRequestingPart(false);
    setSubmissionId(null);
    setLastError("");
    setDiagnosisMode("needsDiagnosis");
    setFormData(emptyFormData);
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-8">
      <div className="mx-auto max-w-3xl">
        <section className="mb-8 rounded-xl border border-orange-500 bg-zinc-950 p-6">
          <p className="text-sm uppercase tracking-wide text-orange-500">
            ArmorTech IQ
          </p>
          <h1 className="mt-2 text-4xl font-bold">Start Diagnostic</h1>
          <p className="mt-3 text-zinc-300">
            Submit your device information first. Paid diagnostic requests are saved, then sent to Stripe, then unlocked on the results page after payment.
          </p>
        </section>

        {lastError ? (
          <div className="mb-6 rounded-lg border border-red-500 bg-red-950/40 p-4 text-red-200">
            {lastError}
          </div>
        ) : null}

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-xl border border-zinc-700 bg-zinc-950 p-4 space-y-4">
              <p className="font-semibold text-orange-500">Choose your request type</p>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-800 bg-black p-4">
                <input
                  type="radio"
                  name="diagnosisMode"
                  value="needsDiagnosis"
                  checked={diagnosisMode === "needsDiagnosis"}
                  onChange={() => handleModeChange("needsDiagnosis")}
                  className="mt-1"
                />
                <span>
                  <span className="font-semibold">Needs Diagnosis</span>
                  <span className="block text-sm text-zinc-400">
                    Enter the device details, continue to payment, then receive likely cause, cost ranges, part direction, and next step.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-800 bg-black p-4">
                <input
                  type="radio"
                  name="diagnosisMode"
                  value="knownProblem"
                  checked={diagnosisMode === "knownProblem"}
                  onChange={() => handleModeChange("knownProblem")}
                  className="mt-1"
                />
                <span>
                  <span className="font-semibold">I Know the Problem</span>
                  <span className="block text-sm text-zinc-400">
                    Use this for part quote requests, manual review, or known failures. This path does not unlock an automated diagnostic result.
                  </span>
                </span>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="fullName"
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full rounded bg-zinc-900 p-3 text-white border border-zinc-700"
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded bg-zinc-900 p-3 text-white border border-zinc-700"
                required
              />
            </div>

            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded bg-zinc-900 p-3 text-white border border-zinc-700"
              required
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              className="w-full rounded bg-zinc-900 p-3 text-white border border-zinc-700"
              required
            >
              <option value="">Select Category</option>
              {Object.keys(categories).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {formData.category ? (
              <select
                name="deviceType"
                value={formData.deviceType}
                onChange={handleDeviceTypeChange}
                className="w-full rounded bg-zinc-900 p-3 text-white border border-zinc-700"
                required
              >
                <option value="">Select Device Type</option>
                {deviceTypes.map((deviceType) => (
                  <option key={deviceType} value={deviceType}>
                    {deviceType}
                  </option>
                ))}
              </select>
            ) : null}

            {formData.category ? (
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full rounded bg-zinc-900 p-3 text-white border border-zinc-700"
                required
              >
                <option value="">Select Brand</option>
                {(brandOptions[formData.category] || []).map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            ) : null}

            {formData.deviceType ? (
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="modelNumber"
                  type="text"
                  placeholder="Model Number"
                  value={formData.modelNumber}
                  onChange={handleChange}
                  className="w-full rounded bg-zinc-900 p-3 text-white border border-zinc-700"
                  required
                />

                <input
                  name="serialNumber"
                  type="text"
                  placeholder="Serial Number (optional)"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  className="w-full rounded bg-zinc-900 p-3 text-white border border-zinc-700"
                />
              </div>
            ) : null}

            {diagnosisMode === "needsDiagnosis" ? (
              formData.deviceType ? (
                symptoms.length > 0 ? (
                  <select
                    name="symptom"
                    value={formData.symptom}
                    onChange={handleChange}
                    className="w-full rounded bg-zinc-900 p-3 text-white border border-zinc-700"
                    required
                  >
                    <option value="">Select Main Symptom</option>
                    {symptoms.map((symptom) => (
                      <option key={symptom} value={symptom}>
                        {symptom}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name="symptom"
                    type="text"
                    placeholder="Describe the main symptom"
                    value={formData.symptom}
                    onChange={handleChange}
                    className="w-full rounded bg-zinc-900 p-3 text-white border border-zinc-700"
                    required
                  />
                )
              ) : null
            ) : (
              <input
                name="knownProblem"
                type="text"
                placeholder="Describe the known problem or requested part"
                value={formData.knownProblem}
                onChange={handleChange}
                className="w-full rounded bg-zinc-900 p-3 text-white border border-zinc-700"
                required
              />
            )}

            <textarea
              name="issue"
              rows={5}
              placeholder="Describe the issue in your own words..."
              value={formData.issue}
              onChange={handleChange}
              className="w-full rounded bg-zinc-900 p-3 text-white border border-zinc-700"
              required
            />

            {diagnosisMode === "needsDiagnosis" ? (
              <div className="rounded-xl border border-orange-500 bg-zinc-950 p-4 text-sm text-zinc-300">
                <p className="mb-1 font-semibold text-orange-500">
                  Diagnostic flow
                </p>
                <p>
                  Your request is saved first. Then you pay the {DIAGNOSTIC_FEE_LABEL}. After payment, ArmorTech IQ redirects you to your results page.
                </p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={saving}
              className="rounded bg-orange-500 px-6 py-3 font-semibold text-black hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-300"
            >
              {saving
                ? diagnosisMode === "needsDiagnosis"
                  ? "Saving and opening payment..."
                  : "Submitting..."
                : diagnosisMode === "needsDiagnosis"
                  ? "Continue to Payment — $25"
                  : "Submit Request"}
            </button>
          </form>
        ) : (
          <div className="space-y-5 rounded-xl border border-orange-500 bg-zinc-950 p-6">
            <h2 className="text-2xl font-bold text-orange-500">
              Request Submitted
            </h2>

            <p>
              Thank you, <span className="font-semibold">{formData.fullName}</span>. ArmorTech received your request.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-400">Mode</p>
                <p>{diagnosisMode === "needsDiagnosis" ? "Needs Diagnosis" : "Known Problem"}</p>
              </div>

              <div>
                <p className="text-sm text-zinc-400">Category</p>
                <p>{formData.category}</p>
              </div>

              <div>
                <p className="text-sm text-zinc-400">Device Type</p>
                <p>{formData.deviceType}</p>
              </div>

              <div>
                <p className="text-sm text-zinc-400">Brand</p>
                <p>{formData.brand}</p>
              </div>

              <div>
                <p className="text-sm text-zinc-400">Model</p>
                <p>{formData.modelNumber}</p>
              </div>

              <div>
                <p className="text-sm text-zinc-400">Serial</p>
                <p>{formData.serialNumber || "Not provided"}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-zinc-400">
                {diagnosisMode === "needsDiagnosis" ? "Symptom" : "Known Problem"}
              </p>
              <p>
                {diagnosisMode === "needsDiagnosis"
                  ? formData.symptom
                  : formData.knownProblem}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-400">Your Description</p>
              <p>{formData.issue}</p>
            </div>

            {diagnosisMode === "knownProblem" ? (
              <div className="space-y-3 rounded-xl border border-orange-500 bg-black p-4">
                <h3 className="text-xl font-bold text-orange-500">
                  Request Compatible Part Quote
                </h3>

                <p className="text-zinc-300">
                  ArmorTech will verify the correct replacement part using your brand, model number, and serial number before quoting or ordering.
                </p>

                {partRequestSent ? (
                  <p className="font-semibold text-green-400">
                    Part quote request sent. ArmorTech will verify compatibility and contact you.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handlePartRequest}
                    disabled={requestingPart}
                    className="rounded bg-orange-500 px-6 py-3 font-semibold text-black hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-300"
                  >
                    {requestingPart ? "Sending Request..." : "Request Compatible Part Quote"}
                  </button>
                )}
              </div>
            ) : null}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="rounded bg-orange-500 px-6 py-3 font-semibold text-black hover:bg-orange-600"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
