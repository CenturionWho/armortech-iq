"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

////////////////////////////////////////////////////////////////////////////////
// DATASET DEFINITIONS
////////////////////////////////////////////////////////////////////////////////

const DIAGNOSTIC_FEE_LABEL = "diagnostic fee";

type SymptomInfo = {
  description: string;
  diyPart: string;
  diyCostRange: string;
  proServiceRange: string;
};

type DiagnosisProfile = {
  symptoms: Record<string, SymptomInfo>;
  nextStep: string;
};

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

const diagnosisData: Record<string, DiagnosisProfile> = {
  Refrigerator: {
    symptoms: {
      "Not cooling": {
        description:
          "Likely causes include dirty condenser coils, failed evaporator fan, failed condenser fan, start relay fault, sealed-system issue, thermistor fault, or control-board failure.",
        diyPart: "Start relay, thermistor, condenser fan motor, evaporator fan motor",
        diyCostRange: "$25–$180",
        proServiceRange: "$150–$450+",
      },
      "Leaking water": {
        description:
          "Likely causes include a clogged defrost drain, cracked water line, loose filter housing, frozen drain tube, or leaking water inlet valve.",
        diyPart: "Drain tube kit, water inlet valve, water line, filter housing",
        diyCostRange: "$15–$150",
        proServiceRange: "$125–$350",
      },
      "Ice maker not working": {
        description:
          "Likely causes include a frozen fill tube, failed inlet valve, bad ice maker assembly, door-switch issue, or control-board fault.",
        diyPart: "Ice maker assembly, inlet valve, door switch, fill tube heater",
        diyCostRange: "$45–$220",
        proServiceRange: "$175–$400",
      },
      "Noisy operation": {
        description:
          "Likely causes include evaporator fan contact with ice, worn condenser fan, compressor vibration, or failing fan motor bearings.",
        diyPart: "Evaporator fan motor, condenser fan motor, fan blade",
        diyCostRange: "$35–$160",
        proServiceRange: "$150–$350",
      },
    },
    nextStep:
      "Verify fan operation, inspect frost pattern, clean condenser coils, check temperature sensors, and confirm compressor/start-device behavior before ordering parts.",
  },
  Washer: {
    symptoms: {
      "Won’t start": {
        description:
          "Likely causes include a failed lid lock, bad door switch, control-board issue, wiring fault, tripped breaker, or failed user interface.",
        diyPart: "Lid lock, door switch, control board, user interface board",
        diyCostRange: "$25–$250",
        proServiceRange: "$125–$375",
      },
      "Not draining": {
        description:
          "Likely causes include clogged pump filter, blocked drain hose, failed drain pump, debris in the pump, or control issue preventing pump activation.",
        diyPart: "Drain pump, drain hose, pump filter assembly",
        diyCostRange: "$25–$150",
        proServiceRange: "$125–$325",
      },
      "Shaking or banging": {
        description:
          "Likely causes include unbalanced load, worn suspension rods, failed shocks, damaged tub springs, or unlevel installation.",
        diyPart: "Suspension rods, shocks, tub springs, leveling feet",
        diyCostRange: "$45–$180",
        proServiceRange: "$175–$375",
      },
    },
    nextStep:
      "Run manufacturer diagnostics, check stored error codes, inspect drain path, verify lid lock operation, and inspect suspension before quoting parts.",
  },
  Dryer: {
    symptoms: {
      "No heat": {
        description:
          "Likely causes include a blown thermal fuse, failed heating element, bad high-limit thermostat, failed cycling thermostat, clogged vent, or gas valve coil failure.",
        diyPart: "Thermal fuse, heating element, thermostat kit, gas valve coils",
        diyCostRange: "$15–$120",
        proServiceRange: "$125–$325",
      },
      "Won’t start": {
        description:
          "Likely causes include a bad door switch, blown thermal fuse, broken belt switch, failed start switch, motor issue, or control-board fault.",
        diyPart: "Door switch, thermal fuse, belt switch, start switch",
        diyCostRange: "$10–$150",
        proServiceRange: "$125–$350",
      },
      "Taking too long to dry": {
        description:
          "Likely causes include restricted venting, weak heating circuit, cycling thermostat fault, clogged lint path, or overloaded drum.",
        diyPart: "Vent cleaning kit, thermostat kit, heating element",
        diyCostRange: "$15–$120",
        proServiceRange: "$125–$300",
      },
    },
    nextStep:
      "Check airflow first, inspect vent restriction, then test thermal fuse, heater circuit, thermostats, and motor circuit.",
  },
  Dishwasher: {
    symptoms: {
      "No power": {
        description:
          "Likely causes include tripped breaker, failed junction-box connection, bad door latch, failed control board, blown thermal fuse, or wiring fault.",
        diyPart: "Door latch, thermal fuse, control board, junction box harness",
        diyCostRange: "$20–$220",
        proServiceRange: "$125–$375",
      },
      "Not draining": {
        description:
          "Likely causes include clogged filter, blocked drain hose, failed drain pump, stuck check valve, or garbage-disposal knockout issue.",
        diyPart: "Drain pump, drain hose, check valve, filter assembly",
        diyCostRange: "$25–$150",
        proServiceRange: "$125–$325",
      },
      "Leaking": {
        description:
          "Likely causes include door gasket failure, loose hose, cracked sump, bad inlet valve, spray-arm issue, or over-sudsing.",
        diyPart: "Door gasket, inlet valve, sump seal, spray arm",
        diyCostRange: "$20–$180",
        proServiceRange: "$150–$400",
      },
    },
    nextStep:
      "Inspect the filter and drain path, check the door gasket, verify inlet/drain operation, and test the control circuit if no power is present.",
  },
  "Oven/Range": {
    symptoms: {
      "Oven not heating": {
        description:
          "Likely causes include failed bake element, bad igniter, temperature sensor fault, control relay issue, or wiring failure.",
        diyPart: "Bake element, igniter, temperature sensor, control board",
        diyCostRange: "$25–$220",
        proServiceRange: "$150–$375",
      },
      "Burner not working": {
        description:
          "Likely causes include failed surface element, bad infinite switch, damaged receptacle block, igniter fault, or valve issue depending on electric/gas model.",
        diyPart: "Surface element, infinite switch, receptacle block, igniter",
        diyCostRange: "$20–$180",
        proServiceRange: "$125–$325",
      },
    },
    nextStep:
      "Confirm model number and fuel type, then test elements/igniters, temperature sensor resistance, switches, relays, and wiring under proper safety procedures.",
  },
  Microwave: {
    symptoms: {
      "Not heating": {
        description:
          "Likely causes include failed magnetron, high-voltage diode, capacitor, transformer/inverter fault, or door-switch issue. High-voltage microwave work is not recommended as DIY.",
        diyPart: "High-voltage diode, magnetron, capacitor, door switch",
        diyCostRange: "$10–$180",
        proServiceRange: "$150–$375",
      },
      "No power": {
        description:
          "Likely causes include blown line fuse, bad door switch, failed thermal cutout, control-board issue, or power-supply fault.",
        diyPart: "Line fuse, door switch, thermal cutout, control board",
        diyCostRange: "$5–$180",
        proServiceRange: "$125–$350",
      },
    },
    nextStep:
      "Microwave high-voltage sections can retain lethal charge. Technician review is strongly recommended before opening or replacing internal parts.",
  },
  "Ice Maker": {
    symptoms: {
      "Not making ice": {
        description:
          "Likely causes include water supply issue, bad inlet valve, failed ice maker module, temperature issue, or frozen fill tube.",
        diyPart: "Inlet valve, ice maker assembly, fill tube heater",
        diyCostRange: "$45–$250",
        proServiceRange: "$175–$450",
      },
      "Leaking": {
        description:
          "Likely causes include loose water line, cracked reservoir, failed inlet valve, misaligned fill tube, or drain issue.",
        diyPart: "Water line, inlet valve, reservoir, drain tube",
        diyCostRange: "$15–$180",
        proServiceRange: "$150–$375",
      },
    },
    nextStep:
      "Confirm water supply, inspect fill tube and valve, verify freezer/ice-maker temperature, and test harvest/fill cycle.",
  },
  Freezer: {
    symptoms: {
      "Not freezing": {
        description:
          "Likely causes include dirty condenser coils, evaporator fan failure, sealed-system issue, thermostat/thermistor issue, or defrost failure.",
        diyPart: "Thermistor, evaporator fan, start relay, defrost heater",
        diyCostRange: "$25–$180",
        proServiceRange: "$150–$500+",
      },
      "Frost buildup": {
        description:
          "Likely causes include failed defrost heater, defrost thermostat, control-board fault, damaged gasket, or air leak.",
        diyPart: "Defrost heater, defrost thermostat, door gasket, control board",
        diyCostRange: "$25–$220",
        proServiceRange: "$150–$425",
      },
    },
    nextStep:
      "Inspect gasket, fan, frost pattern, defrost circuit, and temperature sensors before quoting parts.",
  },
  Television: {
    symptoms: {
      "No power": {
        description:
          "Likely causes include failed power supply board, shorted main board, standby circuit fault, blown fuse, or panel-related protection fault.",
        diyPart: "Power supply board, main board, fuse after diagnosis",
        diyCostRange: "$40–$200",
        proServiceRange: "$125–$350",
      },
      "Backlight but no picture": {
        description:
          "Likely causes include T-Con board fault, main board issue, panel driver issue, or failed panel/tab bond. Panel faults are often not economical.",
        diyPart: "T-Con board, main board after verification",
        diyCostRange: "$30–$180",
        proServiceRange: "$125–$325",
      },
      "Sound but no picture": {
        description:
          "Likely causes include failed LED backlights, LED driver issue, power supply fault, or panel backlight circuit failure.",
        diyPart: "LED backlight strip kit, power supply board",
        diyCostRange: "$35–$160",
        proServiceRange: "$175–$450",
      },
      "Lines on screen": {
        description:
          "Likely causes include panel damage, T-Con issue, loose ribbon cable, or tab-bond failure. Physical panel faults are usually not repairable economically.",
        diyPart: "T-Con board or ribbon reseat after verification",
        diyCostRange: "$25–$120",
        proServiceRange: "$100–$275 diagnostic/board-level review",
      },
    },
    nextStep:
      "Confirm model number, power behavior, flashlight test, standby LED behavior, and photos of the screen before ordering TV boards or backlights.",
  },
  "Desktop PC": {
    symptoms: {
      "No power": {
        description:
          "Likely causes include failed power supply, front-panel switch issue, shorted motherboard, failed GPU, or loose internal power connection.",
        diyPart: "ATX power supply, power switch lead, CMOS battery",
        diyCostRange: "$10–$150",
        proServiceRange: "$75–$250",
      },
      "Turns on but no display": {
        description:
          "Likely causes include RAM seating issue, failed GPU, BIOS/CMOS issue, motherboard fault, or monitor/cable problem.",
        diyPart: "RAM, GPU, CMOS battery, display cable",
        diyCostRange: "$5–$300+",
        proServiceRange: "$75–$300",
      },
    },
    nextStep:
      "Test with known-good PSU/display cable, reseat RAM/GPU, clear CMOS, and check diagnostic LEDs/beep codes.",
  },
  Laptop: {
    symptoms: {
      "No power": {
        description:
          "Likely causes include failed charger, DC jack fault, battery issue, motherboard power rail fault, liquid damage, or shorted component.",
        diyPart: "Charger, DC jack, battery after verification",
        diyCostRange: "$25–$180",
        proServiceRange: "$75–$350+",
      },
      "Cracked screen": {
        description:
          "Likely repair path is LCD/eDP panel replacement. Correct panel depends on exact model, resolution, connector, and refresh rate.",
        diyPart: "Replacement LCD/eDP display panel",
        diyCostRange: "$45–$250",
        proServiceRange: "$125–$350",
      },
      "Overheating": {
        description:
          "Likely causes include clogged heatsink, dried thermal paste, failing fan, dust buildup, or firmware/power management issue.",
        diyPart: "Thermal paste, fan, heatsink assembly",
        diyCostRange: "$10–$120",
        proServiceRange: "$75–$225",
      },
    },
    nextStep:
      "Verify charger output, inspect DC jack, check board for shorts/liquid damage, and confirm exact model before ordering parts.",
  },
  Tablet: {
    symptoms: {
      "Cracked screen": {
        description:
          "Likely repair path is digitizer, LCD, or full display assembly replacement depending on model construction.",
        diyPart: "Digitizer, LCD, or full display assembly",
        diyCostRange: "$35–$250",
        proServiceRange: "$100–$350",
      },
      "Not charging": {
        description:
          "Likely causes include dirty charge port, damaged port, battery issue, charging IC fault, or board-level damage.",
        diyPart: "Charge port, battery, flex cable after verification",
        diyCostRange: "$15–$120",
        proServiceRange: "$75–$275+",
      },
    },
    nextStep:
      "Clean and inspect the charge port, test with known-good cable/brick, check battery condition, and verify exact model before parts.",
  },
  Phone: {
    symptoms: {
      "Not charging": {
        description:
          "Likely causes include compacted debris in the port, worn charge port, bad battery, charging IC fault, or liquid damage.",
        diyPart: "Charge port flex, battery, cleaning tools",
        diyCostRange: "$10–$120",
        proServiceRange: "$60–$250+",
      },
      "Cracked screen": {
        description:
          "Likely repair path is screen assembly replacement. Pricing depends heavily on model and screen grade.",
        diyPart: "Screen assembly with adhesive/seal",
        diyCostRange: "$35–$300+",
        proServiceRange: "$90–$450+",
      },
    },
    nextStep:
      "Confirm exact model, screen grade preference, Face ID/biometric condition, and whether liquid or prior repair is involved.",
  },
  "Stereo Receiver": {
    symptoms: {
      "No power": {
        description:
          "Likely causes include blown fuse, standby power supply fault, shorted output stage, protection circuit fault, or transformer issue.",
        diyPart: "Fuse only after short testing, power supply components",
        diyCostRange: "$5–$120",
        proServiceRange: "$100–$350+",
      },
      "Goes into protect mode": {
        description:
          "Likely causes include shorted speaker wiring, failed output transistors, DC offset, overheated amplifier channel, or power supply issue.",
        diyPart: "Output transistors, emitter resistors, capacitors after diagnosis",
        diyCostRange: "$20–$180",
        proServiceRange: "$125–$450+",
      },
    },
    nextStep:
      "Disconnect speakers, test for shorts/DC offset, inspect power supply rails, and diagnose amplifier channels before replacing boards.",
  },
  Amplifier: {
    symptoms: {
      "No sound": {
        description:
          "Likely causes include input/preamp fault, relay issue, failed output stage, bad solder joints, or power supply fault.",
        diyPart: "Speaker relay, capacitors, output components after diagnosis",
        diyCostRange: "$10–$160",
        proServiceRange: "$100–$400+",
      },
      "Distorted sound": {
        description:
          "Likely causes include failing capacitors, bad output transistors, cold solder joints, dirty controls, or speaker/load issue.",
        diyPart: "Capacitors, potentiometer cleaner, output components",
        diyCostRange: "$10–$200",
        proServiceRange: "$100–$450+",
      },
    },
    nextStep:
      "Test inputs, speaker load, DC offset, power rails, and output stage before quoting board-level repair.",
  },
  Soundbar: {
    symptoms: {
      "No power": {
        description:
          "Likely causes include failed power adapter, internal power supply fault, main board failure, or button/control issue.",
        diyPart: "Power adapter, power supply board after verification",
        diyCostRange: "$20–$120",
        proServiceRange: "$75–$250",
      },
      "No sound": {
        description:
          "Likely causes include input setting issue, HDMI ARC/eARC issue, firmware issue, speaker amp fault, or main board problem.",
        diyPart: "HDMI cable, power adapter, main board after verification",
        diyCostRange: "$10–$150",
        proServiceRange: "$75–$275",
      },
    },
    nextStep:
      "Verify source/input settings, test optical/HDMI/Bluetooth, inspect power supply, and update firmware if applicable.",
  },
  "Game Console": {
    symptoms: {
      "HDMI port issues": {
        description:
          "Likely causes include damaged HDMI port pins, lifted pads, cracked solder joints, HDMI encoder/retimer failure, or board damage from impact.",
        diyPart: "HDMI port, HDMI retimer/encoder after board-level diagnosis",
        diyCostRange: "$10–$60",
        proServiceRange: "$90–$200+",
      },
      "No power": {
        description:
          "Likely causes include failed power supply, shorted motherboard rail, liquid damage, bad USB-C/charge port, or damaged power button circuit depending on console.",
        diyPart: "Power supply, USB-C port, fuse, power button flex after verification",
        diyCostRange: "$15–$120",
        proServiceRange: "$75–$300+",
      },
      "Overheating": {
        description:
          "Likely causes include dust-clogged heatsink, failed fan, dried thermal compound, poor liquid metal contact on PS5, or blocked airflow.",
        diyPart: "Fan, thermal paste, heatsink cleaning supplies",
        diyCostRange: "$10–$100",
        proServiceRange: "$75–$225",
      },
      "Disc drive issue": {
        description:
          "Likely causes include failed laser, drive motor, rollers, drive board pairing issue, or mechanical obstruction.",
        diyPart: "Laser deck, drive motor, rollers, drive assembly after verification",
        diyCostRange: "$20–$120",
        proServiceRange: "$90–$250+",
      },
    },
    nextStep:
      "Confirm console model, inspect HDMI/USB ports under magnification, test power rails, clean cooling system, and avoid board-level work without proper tools.",
  },
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

function getProfile(deviceType: string): DiagnosisProfile | null {
  if (!deviceType) return null;
  if (isGameConsole(deviceType)) return diagnosisData["Game Console"];
  return diagnosisData[deviceType] || null;
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

  const selectedProfile = getProfile(formData.deviceType);
  const deviceTypes = formData.category ? categories[formData.category] || [] : [];
  const symptoms = selectedProfile ? Object.keys(selectedProfile.symptoms) : [];

  const symptomDetail =
    diagnosisMode === "needsDiagnosis" && formData.symptom
      ? selectedProfile?.symptoms[formData.symptom]
      : undefined;

  const diagnosis = symptomDetail?.description || "Manual technician review required based on the submitted details.";
  const diyPart = symptomDetail?.diyPart || "Technician verification required before ordering parts.";
  const diyCostRange = symptomDetail?.diyCostRange || "Manual quote required";
  const proServiceRange = symptomDetail?.proServiceRange || "Manual quote required";
  const nextStep = selectedProfile?.nextStep || "ArmorTech will review the model, symptom, and customer notes before recommending parts or repair steps.";
  const estimatedRange = diyCostRange || proServiceRange || "Manual quote required";

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
          diagnosis_result: diagnosisMode === "needsDiagnosis" ? diagnosis : "",
          estimated_range: diagnosisMode === "needsDiagnosis" ? estimatedRange : "",
          recommended_next_step: diagnosisMode === "needsDiagnosis" ? nextStep : "",
          diy_part: diagnosisMode === "needsDiagnosis" ? diyPart : "",
          diy_cost_range: diagnosisMode === "needsDiagnosis" ? diyCostRange : "",
          pro_service_range: diagnosisMode === "needsDiagnosis" ? proServiceRange : "",
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
          recommendedPart: diagnosisMode === "needsDiagnosis" ? diyPart : "Technician verification requested",
          estimatedDiyCost: diagnosisMode === "needsDiagnosis" ? diyCostRange : "Manual quote required",
          proServiceRange: diagnosisMode === "needsDiagnosis" ? proServiceRange : "Manual quote required",
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
                  ? "Continue to Payment"
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
