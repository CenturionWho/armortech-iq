"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  deviceType: string;
  symptom: string;
  issue: string;
};

const diagnosisRules: Record<string, Record<string, string>> = {
  Refrigerator: {
    "Not cooling":
      "Possible compressor, start relay, evaporator fan, condenser fan, sealed system, or control board issue.",
    "Leaking water":
      "Possible clogged drain line, cracked water line, inlet valve, ice maker leak, or drain pan issue.",
    "Making noise":
      "Possible evaporator fan, condenser fan, compressor vibration, ice buildup, or loose panel.",
    "Ice maker issue":
      "Possible water valve, ice maker module, frozen fill tube, sensor, or control board issue.",
    "Power issue":
      "Possible control board, outlet, fuse, wiring harness, or power supply failure.",
  },
  Washer: {
    "Not draining":
      "Possible drain pump, clogged hose, lid lock, pressure switch, or control board issue.",
    "Not spinning":
      "Possible lid lock, belt, motor, clutch, rotor/stator, or control board issue.",
    "Leaking water":
      "Possible door boot, drain hose, water valve, tub seal, or dispenser housing issue.",
    "Won’t start":
      "Possible lid lock, control board, start switch, door switch, or power issue.",
    "Making noise":
      "Possible bearings, suspension rods, drain pump, motor, or foreign object inside tub.",
  },
  Dryer: {
    "No heat":
      "Possible heating element, thermal fuse, thermostat, igniter, gas valve coils, or control board issue.",
    "Won’t start":
      "Possible door switch, thermal fuse, start switch, belt switch, motor, or control board issue.",
    "Making noise":
      "Possible rollers, idler pulley, belt, blower wheel, or motor bearing issue.",
    "Takes too long":
      "Possible clogged vent, weak heating element, thermostat, moisture sensor, or airflow restriction.",
  },
  Television: {
    "No picture":
      "Possible backlight failure, T-Con board, main board, panel issue, or power supply issue.",
    "No power":
      "Possible power supply board, main board, fuse, shorted LED strip, or standby circuit issue.",
    "Lines on screen":
      "Possible panel failure, T-Con board, ribbon cable, tab bond, or main board issue.",
    "Sound no picture":
      "Likely backlight failure, LED driver issue, power board issue, or panel fault.",
  },
  "Game Console": {
    "No power":
      "Possible power supply, shorted motherboard, damaged power button, fuse, or liquid damage.",
    "No display":
      "Possible HDMI port, HDMI retimer, encoder IC, damaged pads, or board-level issue.",
    Overheating:
      "Possible dust buildup, bad fan, dried thermal paste, APU issue, or blocked ventilation.",
    "Disc issue":
      "Possible disc drive, laser, rollers, drive board, or firmware pairing issue.",
  },
  Computer: {
    "No power":
      "Possible charger, DC jack, power button, motherboard, battery, or power rail issue.",
    "No display":
      "Possible RAM, screen, GPU, motherboard, display cable, or BIOS issue.",
    "Slow performance":
      "Possible failing drive, low RAM, malware, overheating, or operating system issue.",
    "Won’t boot":
      "Possible SSD/HDD failure, corrupt Windows install, RAM issue, BIOS issue, or motherboard failure.",
  },
  "Board Level Repair": {
    "No power":
      "Possible shorted component, blown fuse, failed IC, bad MOSFET, or damaged power rail.",
    "Liquid damage":
      "Possible corrosion, shorted capacitor, damaged connector, failed IC, or trace damage.",
    "Burn marks":
      "Possible failed power circuit, overvoltage, shorted component, or board-level failure.",
    "Connector damage":
      "Possible damaged port, lifted pads, broken traces, or solder joint failure.",
  },
};

export default function StartDiagnosis() {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [paying, setPaying] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    deviceType: "",
    symptom: "",
    issue: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  const symptoms = formData.deviceType
    ? Object.keys(diagnosisRules[formData.deviceType] || {})
    : [];

  function getDiagnosis() {
    if (!formData.deviceType || !formData.symptom) {
      return "More information is needed to generate a diagnosis.";
    }

    return (
      diagnosisRules[formData.deviceType]?.[formData.symptom] ||
      "Technician review is needed before confirming the repair path."
    );
  }

  function getPriceRange() {
    switch (formData.deviceType) {
      case "Refrigerator":
        return "$125 - $500+ depending on whether it is a fan, board, compressor, or sealed system issue.";
      case "Washer":
        return "$125 - $400 depending on pump, lid lock, valve, motor, or board failure.";
      case "Dryer":
        return "$125 - $350 depending on heating circuit, fuse, motor, or airflow issue.";
      case "Television":
        return "$150 - $500 depending on board repair, backlights, panel condition, or size.";
      case "Game Console":
        return "$75 - $250 depending on HDMI, power, overheating, or board-level damage.";
      case "Computer":
        return "$75 - $300 depending on software, storage, charging port, screen, or motherboard issue.";
      case "Board Level Repair":
        return "$75 - $500 depending on diagnostic time, parts availability, soldering difficulty, and board damage.";
      default:
        return "$100 - $500 depending on device type, parts, and repair complexity.";
    }
  }

  function getNextStep() {
    switch (formData.deviceType) {
      case "Refrigerator":
        return "Technician should verify fan operation, compressor activity, frost pattern, thermistors, and board output.";
      case "Washer":
        return "Technician should check drain, spin cycle, lid lock, error codes, pressure system, and motor circuit.";
      case "Dryer":
        return "Technician should test thermal fuse, element, thermostat, airflow, motor, and control voltage.";
      case "Television":
        return "Technician should test standby voltage, backlight voltage, flashlight image, T-Con response, and panel condition.";
      case "Game Console":
        return "Technician should inspect HDMI, power rails, liquid damage, fan activity, and board-level shorts.";
      case "Computer":
        return "Technician should test charger, battery, RAM, storage drive, BIOS behavior, and motherboard power rails.";
      case "Board Level Repair":
        return "Technician should perform visual inspection, diode mode checks, short detection, power injection, and microscope inspection.";
      default:
        return "Technician review is recommended before quoting final repair cost.";
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const diagnosis = getDiagnosis();
    const priceRange = getPriceRange();
    const nextStep = getNextStep();

    const { error } = await supabase.from("diagnosis_submissions").insert({
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      device_type: formData.deviceType,
      symptom: formData.symptom,
      issue_description: formData.issue,
      diagnosis_result: diagnosis,
      estimated_range: priceRange,
      recommended_next_step: nextStep,
      payment_status: "unpaid",
    });

    setSaving(false);

    if (error) {
      alert(JSON.stringify(error, null, 2));
      console.error(error);
      return;
    }

    setSubmitted(true);
  }

  async function handlePayment() {
    setPaying(true);

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
    });

    const data = await res.json();

    setPaying(false);

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Unable to start Stripe checkout.");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">ArmorTech IQ</h1>

        <p className="text-gray-400 mb-8">
          Smart repair intake and preliminary diagnosis
        </p>

        {submitted ? (
          <div className="bg-zinc-900 border border-orange-500 rounded p-6 space-y-5">
            <h2 className="text-2xl font-bold">Diagnosis Ready</h2>

            <p>
              Thank you,{" "}
              <span className="font-semibold">{formData.fullName}</span>.
            </p>

            <div>
              <p className="text-gray-400 text-sm">Device Type</p>
              <p className="font-semibold">{formData.deviceType}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Main Symptom</p>
              <p>{formData.symptom}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Customer Description</p>
              <p>{formData.issue}</p>
            </div>

            <div className="bg-black border border-zinc-700 rounded p-4">
              <p className="text-gray-400 text-sm mb-1">ArmorTech IQ Result</p>
              <p>{getDiagnosis()}</p>
            </div>

            <div className="bg-black border border-zinc-700 rounded p-4">
              <p className="text-gray-400 text-sm mb-1">Estimated Range</p>
              <p>{getPriceRange()}</p>
            </div>

            <div className="bg-black border border-zinc-700 rounded p-4">
              <p className="text-gray-400 text-sm mb-1">
                Recommended Next Step
              </p>
              <p>{getNextStep()}</p>
            </div>

            <p className="text-sm text-gray-400">
              This is a preliminary diagnosis only. Final pricing and repair
              approval require technician review.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setSubmitted(false)}
                className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded font-semibold"
              >
                Edit Information
              </button>

              <button
                onClick={handlePayment}
                disabled={paying}
                className="bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-700 px-6 py-3 rounded font-semibold border border-zinc-600"
              >
                {paying ? "Opening Checkout..." : "Pay $45 Diagnostic Fee"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
              required
            />

            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
              required
            />

            <select
              name="deviceType"
              value={formData.deviceType}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  deviceType: e.target.value,
                  symptom: "",
                });
              }}
              className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
              required
            >
              <option value="">Select Device Type</option>
              {Object.keys(diagnosisRules).map((device) => (
                <option key={device} value={device}>
                  {device}
                </option>
              ))}
            </select>

            {formData.deviceType && (
              <select
                name="symptom"
                value={formData.symptom}
                onChange={handleChange}
                className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
                required
              >
                <option value="">Select Main Symptom</option>
                {symptoms.map((symptom) => (
                  <option key={symptom} value={symptom}>
                    {symptom}
                  </option>
                ))}
              </select>
            )}

            <textarea
              name="issue"
              rows={6}
              placeholder="Describe the issue in your own words..."
              value={formData.issue}
              onChange={handleChange}
              className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
              required
            />

            <button
              type="submit"
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-700 px-6 py-3 rounded font-semibold"
            >
              {saving ? "Saving..." : "Continue"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}