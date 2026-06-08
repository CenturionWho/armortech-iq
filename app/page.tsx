export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-6xl font-bold mb-4">
        ArmorTech IQ
      </h1>

      <p className="text-xl text-gray-400 mb-8">
        Know Before You Repair
      </p>
<button></button>
      <a
        href="/iq/start"
        className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-lg text-lg font-semibold"
      >
        Start Diagnosis
      </a>
    </main>
  );
}