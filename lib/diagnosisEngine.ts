import "server-only";

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

export type DiagnosticFields = {
  diagnosis_result: string;
  estimated_range: string;
  recommended_next_step: string;
  diy_part: string;
  diy_cost_range: string;
  pro_service_range: string;
};

type DiagnosticInput = {
  category: string;
  deviceType: string;
  symptom: string;
};

export function buildDiagnosticResult({
  category,
  deviceType,
  symptom,
}: DiagnosticInput): DiagnosticFields {
  const profileKey = category === "Game Consoles" ? "Game Console" : deviceType;
  const profile = diagnosisData[profileKey];
  const detail = profile?.symptoms[symptom];

  const diyCostRange = detail?.diyCostRange || "Manual quote required";
  const proServiceRange = detail?.proServiceRange || "Manual quote required";

  return {
    diagnosis_result:
      detail?.description ||
      "Manual technician review required based on the submitted details.",
    estimated_range:
      detail?.diyCostRange ||
      detail?.proServiceRange ||
      "Manual quote required",
    recommended_next_step:
      profile?.nextStep ||
      "ArmorTech will review the model, symptom, and customer notes before recommending parts or repair steps.",
    diy_part:
      detail?.diyPart ||
      "Technician verification required before ordering parts.",
    diy_cost_range: diyCostRange,
    pro_service_range: proServiceRange,
  };
}
