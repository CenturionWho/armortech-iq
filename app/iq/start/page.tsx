"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

// Category → device list
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
    // Xbox family
    "Original Xbox",
    "Xbox 360",
    "Xbox 360 S",
    "Xbox 360 E",
    "Xbox One",
    "Xbox One S",
    "Xbox One X",
    "Xbox Series S",
    "Xbox Series X",
    // PlayStation family
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
    "PlayStation 5 Slim Disc Edition",
    "PlayStation 5 Slim Digital Edition",
    // Nintendo family
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
    // Handheld & retro
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
    // Other
    "Sega Genesis",
    "Sega Saturn",
    "Sega Dreamcast",
    "Steam Deck",
    "ASUS ROG Ally",
    "Lenovo Legion Go",
    "Other Console",
  ],
};

// Brand options by category
const brandOptions: Record<string, string[]> = {
  Appliances: [
    "Whirlpool", "Maytag", "KitchenAid", "Amana", "JennAir", "Roper",
    "Admiral", "GE", "GE Profile", "Café", "Hotpoint", "Haier", "LG", "Samsung",
    "Frigidaire", "Electrolux", "Kenmore", "Bosch", "Thermador", "Miele",
    "Sub-Zero", "Wolf", "Viking", "Dacor", "Fisher & Paykel", "Speed Queen",
    "Midea", "Hisense", "Insignia", "Magic Chef", "Danby", "Galanz", "Sharp",
    "Toshiba", "Panasonic", "Scotsman", "Hoshizaki", "Manitowoc",
    "Ice-O-Matic", "NewAir", "EdgeStar", "U-Line", "Rovsun", "Other / Not Listed",
  ],
  Electronics: [
    "Samsung", "LG", "Sony", "TCL", "Hisense", "Vizio", "Insignia",
    "RCA", "Sharp", "Toshiba", "Panasonic", "Dell", "HP", "Lenovo", "Apple",
    "ASUS", "Acer", "MSI", "Onkyo", "Denon", "Yamaha", "Marantz", "Pioneer",
    "Sony Audio", "Bose", "JBL", "Klipsch", "Other / Not Listed",
  ],
  "Game Consoles": [
    "Microsoft", "Sony", "Nintendo", "Valve", "ASUS", "Lenovo", "Sega",
    "Atari", "Other / Not Listed",
  ],
};

// Detailed diagnosis data for each device type and symptom
const diagnosisData: Record<
  string,
  {
    symptoms: Record<
      string,
      {
        description: string;
        diyPart: string;
        diyCostRange: string;
        proServiceRange: string;
      }
    >;
    nextStep: string;
  }
> = {
  // Appliances
  Refrigerator: {
    symptoms: {
      "Not cooling": {
        description:
          "Possible causes include improper installation location, blocked vents or dirty condenser coils, unlevel installation, or incorrect temperature settings:contentReference[oaicite:2]{index=2}.",
        diyPart: "Condenser fan motor, start relay, temperature sensor",
        diyCostRange: "$40 – $150",
        proServiceRange: "$150 – $400",
      },
      "Leaking water": {
        description:
          "Could be due to a clogged drain line, cracked water line, worn door seal, or faulty inlet valve or drain pan:contentReference[oaicite:3]{index=3}.",
        diyPart: "Drain tube kit, door gasket, water inlet valve",
        diyCostRange: "$20 – $120",
        proServiceRange: "$125 – $300",
      },
      "Noisy operation": {
        description:
          "Loud noises often come from worn condenser or evaporator fan motors, compressor vibration, or ice buildup causing rattling:contentReference[oaicite:4]{index=4}.",
        diyPart: "Evaporator fan motor, condenser fan motor",
        diyCostRange: "$40 – $150",
        proServiceRange: "$150 – $350",
      },
      "Frost buildup": {
        description:
          "Frost can form if warm air enters through a damaged door seal or if the defrost timer, heater, or thermostat fails:contentReference[oaicite:5]{index=5}.",
        diyPart: "Defrost heater, thermostat, defrost timer",
        diyCostRange: "$30 – $180",
        proServiceRange: "$150 – $400",
      },
      "Ice maker not working": {
        description:
          "May be caused by clogged or frozen water lines, a faulty water inlet valve, or a malfunctioning ice maker module.",
        diyPart: "Water inlet valve, ice maker assembly",
        diyCostRange: "$60 – $200",
        proServiceRange: "$150 – $400",
      },
      "Power issue": {
        description:
          "If the refrigerator doesn’t run, check the power source, start relay, compressor, or main control board:contentReference[oaicite:6]{index=6}.",
        diyPart: "Start relay, capacitor, main control board",
        diyCostRange: "$50 – $250",
        proServiceRange: "$200 – $500",
      },
    },
    nextStep:
      "Technician should verify compressor and fan operation, inspect door seals, test defrost system and control boards.",
  },
  Washer: {
    symptoms: {
      "Won’t start": {
        description:
          "Faulty lid switch, broken timer or control board, or a tripped breaker/unplugged machine:contentReference[oaicite:7]{index=7}.",
        diyPart: "Lid switch, control board",
        diyCostRange: "$25 – $200",
        proServiceRange: "$125 – $350",
      },
      "Loud spin cycle": {
        description:
          "Unbalanced load, worn shock absorbers, or damaged suspension rods:contentReference[oaicite:8]{index=8}.",
        diyPart: "Shock absorbers, suspension rod kit",
        diyCostRange: "$40 – $120",
        proServiceRange: "$150 – $400",
      },
      "Leaking water": {
        description:
          "Worn door boot seal, faulty drain pump, or cracked hoses:contentReference[oaicite:9]{index=9}.",
        diyPart: "Door gasket, drain pump, hoses",
        diyCostRange: "$20 – $150",
        proServiceRange: "$125 – $300",
      },
      "Not draining": {
        description:
          "Clogged drain pump filter, blocked drain hose, or failed drain pump:contentReference[oaicite:10]{index=10}.",
        diyPart: "Drain pump, drain hose",
        diyCostRange: "$30 – $120",
        proServiceRange: "$125 – $300",
      },
      "Grinding or squealing noise": {
        description:
          "Worn drive belt, damaged motor coupling, or bearing failure:contentReference[oaicite:11]{index=11}.",
        diyPart: "Drive belt, motor coupling",
        diyCostRange: "$25 – $80",
        proServiceRange: "$150 – $400",
      },
      "Excessive vibration": {
        description:
          "Uneven floors or worn shock absorbers/leveling legs:contentReference[oaicite:12]{index=12}.",
        diyPart: "Shock absorbers, leveling legs",
        diyCostRange: "$40 – $120",
        proServiceRange: "$150 – $350",
      },
      "Not spinning": {
        description:
          "Broken lid switch, faulty motor or belt, or clogged drain pump:contentReference[oaicite:13]{index=13}.",
        diyPart: "Lid switch, drive belt, motor",
        diyCostRange: "$25 – $200",
        proServiceRange: "$150 – $400",
      },
      "Slow or no fill": {
        description:
          "Clogged inlet screens, faulty water inlet valve, or low water pressure:contentReference[oaicite:14]{index=14}.",
        diyPart: "Water inlet valve",
        diyCostRange: "$30 – $100",
        proServiceRange: "$125 – $250",
      },
      "Door won’t unlock": {
        description:
          "Faulty door lock or control board error:contentReference[oaicite:15]{index=15}.",
        diyPart: "Door lock latch, control board",
        diyCostRange: "$30 – $200",
        proServiceRange: "$150 – $350",
      },
      "Smells bad": {
        description:
          "Mold or detergent residue; run a cleaning cycle with vinegar and baking soda:contentReference[oaicite:16]{index=16}.",
        diyPart: "Affresh cleaner tablets",
        diyCostRange: "$5 – $20",
        proServiceRange: "$50 – $100 (cleaning service)",
      },
    },
    nextStep:
      "Technician should test lid lock, inspect belts and motor, flush drain pump and hoses, check shock absorbers, and run diagnostic codes.",
  },
  Dryer: {
    symptoms: {
      "No heat": {
        description:
          "Burned-out heating element or blown thermal fuse; check lint buildup and gas coils:contentReference[oaicite:17]{index=17}.",
        diyPart: "Heating element, thermal fuse, gas valve coils",
        diyCostRange: "$15 – $80",
        proServiceRange: "$125 – $300",
      },
      "Won’t start": {
        description:
          "Power supply issues (tripped breaker or loose plug), thermal fuse or door switch failure:contentReference[oaicite:18]{index=18}.",
        diyPart: "Thermal fuse, door switch",
        diyCostRange: "$10 – $40",
        proServiceRange: "$125 – $300",
      },
      "Runs but clothes stay wet": {
        description:
          "Clogged lint screen, blocked exhaust duct, failed heating element, or weak gas coils:contentReference[oaicite:19]{index=19}.",
        diyPart: "Lint screen, heating element, gas valve coils",
        diyCostRange: "$10 – $80",
        proServiceRange: "$125 – $300",
      },
      "Loud or strange noises": {
        description:
          "Failed drum seal or glide bearing; worn rollers, idler pulley, or blower wheel:contentReference[oaicite:20]{index=20}.",
        diyPart: "Drum bearings, rollers, idler pulley",
        diyCostRange: "$20 – $80",
        proServiceRange: "$150 – $350",
      },
      "Shuts off too soon": {
        description:
          "Clogged exhaust vent causing overheating, faulty timer or motor relay, or door strike issues:contentReference[oaicite:21]{index=21}.",
        diyPart: "Timer, motor relay, door strike",
        diyCostRange: "$15 – $60",
        proServiceRange: "$150 – $300",
      },
      "Overheats": {
        description:
          "Faulty thermostat or heating element can cause overheating:contentReference[oaicite:22]{index=22}.",
        diyPart: "High-limit thermostat, heating element",
        diyCostRange: "$10 – $50",
        proServiceRange: "$150 – $300",
      },
      "Doesn’t tumble": {
        description:
          "Broken drive belt or faulty motor:contentReference[oaicite:23]{index=23}.",
        diyPart: "Drive belt, motor",
        diyCostRange: "$15 – $200",
        proServiceRange: "$150 – $350",
      },
    },
    nextStep:
      "Technician should check heating element/gas coils, test thermal fuses and thermostats, clean venting system, inspect drum bearings and motor.",
  },
  Dishwasher: {
    symptoms: {
      "Not draining": {
        description:
          "Clogged or kinked drain hose, blocked filters, faulty drain pump or valve, garbage disposal or sink drain blockages, and clogged air gaps:contentReference[oaicite:24]{index=24}.",
        diyPart: "Drain hose, filter kit, drain pump",
        diyCostRange: "$15 – $120",
        proServiceRange: "$100 – $300",
      },
      "Leaves dishes dirty": {
        description:
          "Clogged spray arms, low water temperature, wrong detergent, or insufficient water pressure. Clean filters and spray arms, use proper detergent.",
        diyPart: "Spray arms, filter kit",
        diyCostRange: "$15 – $60",
        proServiceRange: "$100 – $250",
      },
      "Leaking water": {
        description:
          "Worn door seal, loose hose connections, or cracked tub; inspect seals and hoses.",
        diyPart: "Door gasket, hose clamps",
        diyCostRange: "$20 – $100",
        proServiceRange: "$125 – $300",
      },
      "Stops mid-cycle": {
        description:
          "Faulty door latch, overheating, or control board problems; ensure proper latching, check for error codes.",
        diyPart: "Door latch, control board",
        diyCostRange: "$20 – $200",
        proServiceRange: "$150 – $350",
      },
    },
    nextStep:
      "Technician should clear blockages, check filters and spray arms, test pump and valve, inspect door latch, and diagnose control board.",
  },
  "Oven/Range": {
    symptoms: {
      "Not heating": {
        description:
          "Burned-out elements, faulty igniter, defective temperature sensor, or control board problems:contentReference[oaicite:25]{index=25}.",
        diyPart: "Bake/broil element, igniter, temperature sensor",
        diyCostRange: "$20 – $120",
        proServiceRange: "$150 – $400",
      },
      "Door won’t close": {
        description:
          "Damaged hinges, worn gasket, or misaligned door:contentReference[oaicite:26]{index=26}.",
        diyPart: "Door hinges, gasket",
        diyCostRange: "$20 – $70",
        proServiceRange: "$150 – $250",
      },
      "Uneven cooking": {
        description:
          "Malfunctioning convection fan, faulty thermostat or sensor, damaged elements, or poor calibration:contentReference[oaicite:27]{index=27}.",
        diyPart: "Convection fan, thermostat, bake element",
        diyCostRange: "$25 – $120",
        proServiceRange: "$150 – $350",
      },
      "Won’t turn on": {
        description:
          "Tripped breaker/fuse, faulty power cord, malfunctioning control board, or internal fuses:contentReference[oaicite:28]{index=28}.",
        diyPart: "Control board, power cord",
        diyCostRange: "$50 – $200",
        proServiceRange: "$150 – $400",
      },
      "Self-cleaning not working": {
        description:
          "Clogged vents, broken door lock, blown thermal fuse, or faulty control board:contentReference[oaicite:29]{index=29}.",
        diyPart: "Thermal fuse, door lock",
        diyCostRange: "$20 – $70",
        proServiceRange: "$150 – $350",
      },
      "Strange noises": {
        description:
          "Loose fan blades, failing fan or motor, or normal thermal expansion:contentReference[oaicite:30]{index=30}.",
        diyPart: "Convection fan, motor",
        diyCostRange: "$25 – $100",
        proServiceRange: "$150 – $350",
      },
      "Light not working": {
        description:
          "Burned-out bulb, faulty socket or wiring, or control switch failure:contentReference[oaicite:31]{index=31}.",
        diyPart: "Oven light bulb, socket",
        diyCostRange: "$5 – $30",
        proServiceRange: "$75 – $150",
      },
    },
    nextStep:
      "Technician should test elements and igniters, calibrate sensors, inspect hinges and gaskets, evaluate control boards and fuses.",
  },
  Television: {
    symptoms: {
      "Blank or no picture": {
        description:
          "Often indicates a power supply failure after a surge; capacitors or power boards may need replacement:contentReference[oaicite:32]{index=32}.",
        diyPart: "Power supply board",
        diyCostRange: "$60 – $150",
        proServiceRange: "$150 – $350",
      },
      "Blue/green/black screen": {
        description:
          "Usually caused by incorrect input selection or loose cables; check HDMI and switch to correct input:contentReference[oaicite:33]{index=33}.",
        diyPart: "High-speed HDMI cable",
        diyCostRange: "$10 – $30",
        proServiceRange: "$75 – $150",
      },
      "Image pixelates": {
        description:
          "Weak signal or slow internet speed can cause pixelation; improve network speeds or streaming quality:contentReference[oaicite:34]{index=34}.",
        diyPart: "Signal amplifier or faster router",
        diyCostRange: "$30 – $150",
        proServiceRange: "$75 – $150",
      },
      "Grainy screen": {
        description:
          "A new TV may look grainy if sharpness is too high; lower the sharpness setting:contentReference[oaicite:35]{index=35}.",
        diyPart: "None (settings adjustment)",
        diyCostRange: "$0",
        proServiceRange: "$75 – $100 (calibration)",
      },
      "4K content blurry": {
        description:
          "Wrong picture mode or HDMI version; use Movie/Cinema mode and HDMI 2.0+:contentReference[oaicite:36]{index=36}.",
        diyPart: "HDMI 2.1 cable",
        diyCostRange: "$10 – $30",
        proServiceRange: "$75 – $150 (calibration)",
      },
      "Image out of proportion": {
        description:
          "Incorrect aspect ratio or overscan; adjust screen settings or use proper resolution:contentReference[oaicite:37]{index=37}.",
        diyPart: "None (settings adjustment)",
        diyCostRange: "$0",
        proServiceRange: "$75 – $150 (calibration)",
      },
      "No sound": {
        description:
          "Check volume and audio settings; may need new speakers or audio board.",
        diyPart: "Speakers or audio board",
        diyCostRange: "$25 – $100",
        proServiceRange: "$100 – $250",
      },
    },
    nextStep:
      "Technician should test power supply board, verify signal input and cables, test T-con and main boards, calibrate picture settings, and inspect backlights.",
  },
  "Desktop PC": {
    symptoms: {
      "Won’t start": {
        description:
          "A glitch or corrupt file can prevent booting:contentReference[oaicite:38]{index=38}.",
        diyPart: "PSU tester or replacement PSU",
        diyCostRange: "$20 – $120",
        proServiceRange: "$75 – $200",
      },
      Overheating: {
        description:
          "Running too many apps or a clogged cooling system causes overheating:contentReference[oaicite:39]{index=39}.",
        diyPart: "Thermal paste, CPU fan, heatsink",
        diyCostRange: "$10 – $50",
        proServiceRange: "$100 – $250",
      },
      "No network connection": {
        description:
          "Outdated Wi-Fi drivers can prevent connecting:contentReference[oaicite:40]{index=40}.",
        diyPart: "Wi-Fi card or USB adapter",
        diyCostRange: "$15 – $60",
        proServiceRange: "$75 – $150",
      },
      "Slow performance": {
        description:
          "Virus infections, full storage, or corrupt registry slow down PCs:contentReference[oaicite:41]{index=41}.",
        diyPart: "RAM upgrade, SSD, virus removal",
        diyCostRange: "$30 – $150",
        proServiceRange: "$100 – $250",
      },
      "Freezing screen": {
        description:
          "Corrupt system or program files cause freezes:contentReference[oaicite:42]{index=42}.",
        diyPart: "RAM or storage replacement, OS reinstall",
        diyCostRange: "$30 – $200",
        proServiceRange: "$100 – $250",
      },
      "Strange noises": {
        description:
          "Strange noises signal hardware failures:contentReference[oaicite:43]{index=43}.",
        diyPart: "Case fans, HDD, PSU",
        diyCostRange: "$10 – $100",
        proServiceRange: "$75 – $200",
      },
    },
    nextStep:
      "Technician should test PSU and motherboard, clean fans and heatsinks, update drivers, scan for malware, and check memory/storage integrity.",
  },
  Laptop: {
    symptoms: {
      "Won’t start": {
        description:
          "Battery or charger failure, motherboard issue, or corrupted OS.",
        diyPart: "Laptop battery, charger, motherboard",
        diyCostRange: "$30 – $200",
        proServiceRange: "$100 – $300",
      },
      Overheating: {
        description:
          "Dust-clogged vents or degraded thermal paste lead to overheating.",
        diyPart: "Thermal paste, cooling fan, laptop cooler",
        diyCostRange: "$10 – $60",
        proServiceRange: "$100 – $250",
      },
      "Keyboard not working": {
        description:
          "Spilled liquid or damaged keys can render the keyboard unresponsive.",
        diyPart: "Replacement keyboard",
        diyCostRange: "$20 – $80",
        proServiceRange: "$75 – $150",
      },
      "Broken screen": {
        description:
          "A cracked LCD or damaged hinge results in a black or distorted display.",
        diyPart: "Laptop screen assembly",
        diyCostRange: "$40 – $200",
        proServiceRange: "$150 – $350",
      },
      "Slow performance": {
        description:
          "Full storage, low RAM, or outdated HDD can cause slow performance.",
        diyPart: "SSD upgrade, RAM upgrade",
        diyCostRange: "$30 – $150",
        proServiceRange: "$100 – $250",
      },
      "Battery not charging": {
        description:
          "Faulty charging port or degraded battery cells prevent charging.",
        diyPart: "Battery, DC jack",
        diyCostRange: "$30 – $100",
        proServiceRange: "$75 – $200",
      },
    },
    nextStep:
      "Technician should test charger and DC jack, clean cooling system, replace battery or keyboard, and suggest RAM/SSD upgrades.",
  },
  Phone: {
    symptoms: {
      "Slow performance": {
        description:
          "Full RAM and many apps slow the phone; close unused apps and clear cache:contentReference[oaicite:44]{index=44}.",
        diyPart: "None (clear apps, reset)",
        diyCostRange: "$0",
        proServiceRange: "$75 – $100 (optimization)",
      },
      "Poor battery life": {
        description:
          "Dim screen, turn off GPS, Wi-Fi, and Bluetooth, and check which apps drain battery:contentReference[oaicite:45]{index=45}.",
        diyPart: "New battery",
        diyCostRange: "$30 – $90",
        proServiceRange: "$75 – $150",
      },
      Overheating: {
        description:
          "Battery or charger issues can cause overheating:contentReference[oaicite:46]{index=46}.",
        diyPart: "New charger or battery",
        diyCostRange: "$20 – $60",
        proServiceRange: "$75 – $150",
      },
      "Full storage": {
        description:
          "Too many photos, songs, and apps fill storage:contentReference[oaicite:47]{index=47}.",
        diyPart: "Cloud storage or SD card",
        diyCostRange: "$10 – $50",
        proServiceRange: "$75 – $150",
      },
      "App crashes/freezes": {
        description:
          "Buggy apps or low memory cause frequent crashes; update or reinstall.",
        diyPart: "None (update apps)",
        diyCostRange: "$0",
        proServiceRange: "$50 – $100",
      },
      "Phone won’t charge": {
        description:
          "Damaged charging port, faulty cable, or worn battery prevent charging.",
        diyPart: "Charging port or battery",
        diyCostRange: "$15 – $60",
        proServiceRange: "$75 – $150",
      },
      "Connectivity issues": {
        description:
          "Network outages, wrong settings, or hardware faults cause connectivity issues.",
        diyPart: "Wi-Fi antenna, SIM tray",
        diyCostRange: "$10 – $50",
        proServiceRange: "$75 – $150",
      },
    },
    nextStep:
      "Technician should check battery health, inspect charging port, reset network settings, and run diagnostics for memory or storage.",
  },
  "Stereo Receiver": {
    symptoms: {
      "No sound or poor sound": {
        description:
          "Sound distortion or no output stems from speaker or audio output problems:contentReference[oaicite:48]{index=48}.",
        diyPart: "Speaker wires, speaker terminals",
        diyCostRange: "$10 – $50",
        proServiceRange: "$75 – $200",
      },
      "Connectivity issues": {
        description:
          "Difficulty connecting devices or unstable Bluetooth/Wi-Fi may come from loose connections or interference:contentReference[oaicite:49]{index=49}.",
        diyPart: "HDMI cables, Bluetooth module",
        diyCostRange: "$10 – $40",
        proServiceRange: "$75 – $150",
      },
      "Power issues": {
        description:
          "Intermittent or no power points to blown fuses, faulty power cords, or power surges:contentReference[oaicite:50]{index=50}.",
        diyPart: "Fuse, power supply module",
        diyCostRange: "$5 – $40",
        proServiceRange: "$100 – $300",
      },
      "Control malfunction": {
        description:
          "Unresponsive buttons or remote control failures indicate control board problems:contentReference[oaicite:51]{index=51}.",
        diyPart: "Control board, IR receiver",
        diyCostRange: "$15 – $80",
        proServiceRange: "$100 – $250",
      },
    },
    nextStep:
      "Technician should test receiver power supply, inspect fuses and wiring, verify speaker connections, update firmware, and replace faulty control boards.",
  },
  "Game Console": {
    symptoms: {
      "HDMI port issues": {
        description:
          "No display or flickering screen arises from loose connections, bent pins, or damaged HDMI ports:contentReference[oaicite:52]{index=52}.",
        diyPart: "HDMI port replacement kit",
        diyCostRange: "$10 – $40",
        proServiceRange: "$100 – $200",
      },
      "Disc read errors": {
        description:
          "Dirty or scratched discs, faulty disc drives, or dust buildup cause read errors:contentReference[oaicite:53]{index=53}.",
        diyPart: "Disc drive laser, replacement drive",
        diyCostRange: "$20 – $80",
        proServiceRange: "$100 – $250",
      },
      Overheating: {
        description:
          "Dust-clogged vents or failing fans cause shutdowns and heat:contentReference[oaicite:54]{index=54}.",
        diyPart: "Cooling fan, thermal pads",
        diyCostRange: "$10 – $40",
        proServiceRange: "$100 – $200",
      },
      "Controller problems": {
        description:
          "Stick drift, unresponsive buttons, or connectivity issues result from wear or dirt:contentReference[oaicite:55]{index=55}.",
        diyPart: "Controller joystick modules, button membranes",
        diyCostRange: "$5 – $30",
        proServiceRange: "$75 – $120",
      },
      "Software glitches": {
        description:
          "Outdated firmware or corrupted files cause crashes and freezes:contentReference[oaicite:56]{index=56}.",
        diyPart: "Software update, memory reset",
        diyCostRange: "$0 – $20",
        proServiceRange: "$50 – $120",
      },
      "Power supply problems": {
        description:
          "Consoles that won’t turn on or randomly shut off may have faulty power cords or internal power supplies:contentReference[oaicite:57]{index=57}.",
        diyPart: "Power supply unit",
        diyCostRange: "$20 – $60",
        proServiceRange: "$100 – $200",
      },
      "Slow performance": {
        description:
          "Slow loading or long boot times often stem from full storage or outdated hardware:contentReference[oaicite:58]{index=58}.",
        diyPart: "SSD upgrade",
        diyCostRange: "$40 – $120",
        proServiceRange: "$100 – $200",
      },
      "Wi‑Fi issues": {
        description:
          "Connectivity problems arise from faulty Wi-Fi modules or outdated firmware:contentReference[oaicite:59]{index=59}.",
        diyPart: "Wi-Fi module",
        diyCostRange: "$10 – $30",
        proServiceRange: "$100 – $200",
      },
    },
    nextStep:
      "Technician should inspect and replace HDMI ports, clean dust and verify cooling, test disc drives, update firmware, examine power supplies, and troubleshoot Wi-Fi modules.",
  },
};

export default function StartDiagnosis() {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [paying, setPaying] = useState(false);

  // Form state includes new fields
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    category: "",
    deviceType: "",
    brand: "",
    modelNumber: "",
    serialNumber: "",
    symptom: "",
    issue: "",
  });

  // Reset dependent fields when category changes
  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFormData({
      ...formData,
      category: e.target.value,
      deviceType: "",
      brand: "",
      modelNumber: "",
      serialNumber: "",
      symptom: "",
    });
  }

  // Reset symptom when device type changes
  function handleDeviceTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFormData({
      ...formData,
      deviceType: e.target.value,
      symptom: "",
    });
  }

  // Generic form change handler
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

  // Determine selected diagnosis profile (consoles share same profile)
  const consoleModels = categories["Game Consoles"];
  const selectedProfile = consoleModels.includes(formData.deviceType)
    ? diagnosisData["Game Console"]
    : diagnosisData[formData.deviceType];

  // Get lists based on selections
  const deviceTypes = formData.category ? categories[formData.category] || [] : [];
  const symptoms = selectedProfile ? Object.keys(selectedProfile.symptoms) : [];

  // Calculate diagnostic output values
  const symptomDetail = selectedProfile?.symptoms[formData.symptom];
  const diagnosis = symptomDetail?.description || "";
  const diyPart = symptomDetail?.diyPart || "";
  const diyCostRange = symptomDetail?.diyCostRange || "";
  const proServiceRange = symptomDetail?.proServiceRange || "";
  const nextStep = selectedProfile?.nextStep || "Technician evaluation required.";
  const estimatedRange = diyCostRange; // reusing cost range for display

  // Submit form: save to Supabase
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from("diagnosis_submissions").insert({
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      category: formData.category,
      device_type: formData.deviceType,
      brand: formData.brand,
      model_number: formData.modelNumber,
      serial_number: formData.serialNumber,
      symptom: formData.symptom,
      issue_description: formData.issue,
      diagnosis_result: diagnosis,
      estimated_range: estimatedRange,
      recommended_next_step: nextStep,
      diy_part: diyPart,
      diy_cost_range: diyCostRange,
      pro_service_range: proServiceRange,
      parts_notes:
        `Brand: ${formData.brand}, Device: ${formData.deviceType}, Model: ${formData.modelNumber}, Serial: ${formData.serialNumber}`,
      payment_status: "unpaid",
    });

    setSaving(false);

    if (error) {
      alert("Submission failed: " + error.message);
      return;
    }

    setSubmitted(true);
  }

  // Handle Stripe checkout
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
          Intelligent diagnostic intake for appliances, electronics, and game consoles.
        </p>

        {submitted ? (
          // Display diagnosis summary
          <div className="bg-zinc-900 border border-orange-500 rounded p-6 space-y-5">
            <h2 className="text-2xl font-bold">Diagnosis Ready</h2>
            <p>
              Thank you,{" "}
              <span className="font-semibold">{formData.fullName}</span>.
            </p>
            <div>
              <p className="text-gray-400 text-sm">Category</p>
              <p className="font-semibold">{formData.category}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Device Type</p>
              <p className="font-semibold">{formData.deviceType}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Brand</p>
              <p>{formData.brand}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Model</p>
              <p>{formData.modelNumber}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Symptom</p>
              <p>{formData.symptom}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Description</p>
              <p>{diagnosis}</p>
            </div>
            <div className="bg-black border border-zinc-700 rounded p-4">
              <p className="text-gray-400 text-sm mb-1">DIY Part Suggestion</p>
              <p>{diyPart}</p>
            </div>
            <div className="bg-black border border-zinc-700 rounded p-4">
              <p className="text-gray-400 text-sm mb-1">DIY Cost Range</p>
              <p>{diyCostRange}</p>
            </div>
            <div className="bg-black border border-zinc-700 rounded p-4">
              <p className="text-gray-400 text-sm mb-1">Pro Service Range</p>
              <p>{proServiceRange}</p>
            </div>
            <div className="bg-black border border-zinc-700 rounded p-4">
              <p className="text-gray-400 text-sm mb-1">Recommended Next Step</p>
              <p>{nextStep}</p>
            </div>
            <p className="text-sm text-gray-400">
              Note: This preliminary diagnosis is provided as a guideline. Prices vary by region and availability.
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
          // Diagnostic intake form
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

            {/* Category */}
            <select
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
              required
            >
              <option value="">Select Category</option>
              {Object.keys(categories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Device Type */}
            {formData.category && (
              <select
                name="deviceType"
                value={formData.deviceType}
                onChange={handleDeviceTypeChange}
                className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
                required
              >
                <option value="">Select Device Type</option>
                {deviceTypes.map((device) => (
                  <option key={device} value={device}>
                    {device}
                  </option>
                ))}
              </select>
            )}

            {/* Brand */}
            {formData.category && (
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
                required
              >
                <option value="">Select Brand</option>
                {(brandOptions[formData.category] || []).map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            )}

            {/* Model & Serial */}
            {formData.deviceType && (
              <>
                <input
                  name="modelNumber"
                  type="text"
                  placeholder="Model Number (required for parts)"
                  value={formData.modelNumber}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
                  required
                />
                <input
                  name="serialNumber"
                  type="text"
                  placeholder="Serial Number (optional)"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
                />
              </>
            )}

            {/* Symptom */}
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

            {/* Issue Description */}
            <textarea
              name="issue"
              rows={6}
              placeholder="Describe the issue in your own words..."
              value={formData.issue}
              onChange={handleChange}
              className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
              required
            />

            {/* Submit Button */}
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