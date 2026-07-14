import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://iq.armortechrepair.com"),
  title: {
    default: "ArmorTech IQ | Professional Repair Diagnosis",
    template: "%s | ArmorTech IQ",
  },
  description:
    "Preliminary repair diagnosis, likely causes, cost ranges, parts direction, and recommended next steps for appliances, electronics, computers, televisions, and game consoles.",
  applicationName: "ArmorTech IQ",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "ArmorTech IQ",
    title: "ArmorTech IQ | Professional Repair Diagnosis",
    description:
      "Professional preliminary repair guidance for appliances, electronics, computers, televisions, and game consoles.",
    url: "https://iq.armortechrepair.com",
  },
  robots: { index: true, follow: true },
};

const ecosystemLinks = [
  ["Repair", "https://armortechrepair.com"],
  ["Solutions", "https://armortech-solutions.com"],
  ["Labs", "https://armortechlabs.com"],
  ["Protect", "https://armortechprotect.com"],
  ["Shop", "https://armortechrepair.shop"],
  ["My Account", "https://armortechrepair.com/login"],
] as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-white">
        <header className="border-b border-white/10 bg-black/95 px-5 py-4">
          <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
            <Link href="/" className="font-black tracking-wide text-orange-500">
              ARMORTECH IQ
            </Link>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-zinc-300">
              {ecosystemLinks.map(([label, href]) => (
                <a key={label} href={href} className="hover:text-orange-500">
                  {label}
                </a>
              ))}
            </div>
            <Link
              href="/iq/start"
              className="rounded-lg bg-orange-500 px-4 py-2 font-bold text-black hover:bg-orange-600"
            >
              Start Diagnosis
            </Link>
          </nav>
        </header>

        {children}

        <footer className="border-t border-white/10 bg-zinc-950 px-6 py-10 text-zinc-300">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
            <div>
              <h2 className="font-black text-white">ArmorTech IQ</h2>
              <p className="mt-2 max-w-xl text-sm leading-6">
                Preliminary repair guidance does not replace hands-on inspection,
                manufacturer service information, electrical safety procedures, or a
                qualified technician when the failure presents a safety risk.
              </p>
            </div>
            <address className="not-italic md:text-right">
              <strong className="text-orange-500">ArmorTech Headquarters</strong>
              <br />719 Hope Rd, Stamps, AR 71860
              <br />
              <a href="tel:2282155595" className="hover:text-orange-500">
                228-215-5595
              </a>
              <br />
              <a
                href="mailto:service@armortechrepair.com"
                className="hover:text-orange-500"
              >
                service@armortechrepair.com
              </a>
            </address>
          </div>
        </footer>
      </body>
    </html>
  );
}
