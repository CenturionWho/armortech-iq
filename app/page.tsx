import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="border border-zinc-800 bg-zinc-950 rounded-2xl p-8 md:p-12">
          <p className="text-orange-500 font-semibold mb-3">ArmorTech IQ</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Smart Repair Diagnosis for Appliances, Electronics, and Consoles
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-3xl">
            Answer a few questions about your device. ArmorTech IQ uses expert
            datasets to generate a preliminary diagnosis, DIY parts suggestion,
            cost ranges, and recommended next steps.
          </p>
          <Link
            href="/iq/start"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-black font-bold px-8 py-4 rounded-lg"
          >
            Start Diagnosis
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
            <h2 className="font-bold text-xl mb-2">Appliances</h2>
            <p className="text-gray-400">
              Refrigerators, washers, dryers, dishwashers, ovens/ranges, ice
              makers, microwaves, cooktops, garbage disposals.
            </p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
            <h2 className="font-bold text-xl mb-2">Electronics & AV</h2>
            <p className="text-gray-400">
              TVs, desktop PCs, laptops, tablets, smartphones, stereo receivers,
              amplifiers, soundbars, speakers.
            </p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
            <h2 className="font-bold text-xl mb-2">Game Consoles</h2>
            <p className="text-gray-400">
              Xbox, PlayStation, Nintendo, Sega, handhelds, Steam Deck, and more.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}