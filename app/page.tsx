import Link from "next/link";

const categories = [
  {
    title: "Appliances",
    text: "Refrigerators, washers, dryers, dishwashers, ovens, ranges, ice makers, microwaves, and other household equipment.",
  },
  {
    title: "Electronics & AV",
    text: "Televisions, computers, laptops, tablets, phones, receivers, amplifiers, soundbars, speakers, and related electronics.",
  },
  {
    title: "Game Consoles",
    text: "PlayStation, Xbox, Nintendo, handheld systems, Steam Deck, HDMI failures, power faults, and charging issues.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-orange-500/50 bg-zinc-950 p-8 shadow-2xl md:p-14">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-orange-500">
            ArmorTech IQ
          </p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Start with a clearer repair path before buying parts or replacing the device.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            Submit the device type and symptoms to receive a preliminary diagnosis,
            likely failure causes, practical cost ranges, parts direction, and the
            recommended next step. Results are based on the information provided and
            are intended to help you make a better repair decision.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/iq/start"
              className="rounded-xl bg-orange-500 px-7 py-4 font-black text-black hover:bg-orange-600"
            >
              Start Diagnosis
            </Link>
            <a
              href="https://armortechrepair.com/contact"
              className="rounded-xl border border-white/20 px-7 py-4 font-black hover:border-orange-500 hover:text-orange-500"
            >
              Contact ArmorTech
            </a>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-3xl font-black">Supported diagnosis categories</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {categories.map((category) => (
              <article
                key={category.title}
                className="rounded-2xl border border-white/10 bg-zinc-950 p-6"
              >
                <h3 className="text-xl font-black text-orange-500">
                  {category.title}
                </h3>
                <p className="mt-3 leading-7 text-zinc-300">{category.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black">What you receive</h2>
            <ul className="mt-4 space-y-3 text-zinc-300">
              <li>Likely causes ranked by the symptoms you submit</li>
              <li>Estimated DIY and professional service ranges</li>
              <li>Parts direction when a safe, reasonable path is available</li>
              <li>A recommendation to repair, inspect further, or replace</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black">Important limitation</h2>
            <p className="mt-4 leading-7 text-zinc-300">
              ArmorTech IQ provides preliminary guidance, not a guaranteed diagnosis.
              Stop using equipment that presents smoke, burning odor, exposed wiring,
              overheating, gas, refrigerant, water near energized components, or other
              immediate safety risks.
            </p>
          </article>
        </section>
      </section>
    </main>
  );
}
