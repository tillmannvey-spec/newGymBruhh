export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-8">
      <div className="max-w-md w-full space-y-6 rounded-xl bg-white shadow-lg p-6">
        <h1 className="text-3xl font-bold text-slate-900">GymBruhh</h1>
        <p className="text-slate-600">
          🚀 Next.js 14 + TailwindCSS läuft!  
          Wenn du diesen Text siehst und die Styles aktiv sind, funktioniert alles.
        </p>

        <button className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
          Test-Button (Hover mich!)
        </button>

        <div className="space-y-2">
          <p className="text-slate-700 font-medium">Tailwind Test:</p>
          <ul className="list-disc list-inside text-slate-600">
            <li>Hintergrund hellgrau</li>
            <li>Karte mit Schatten</li>
            <li>Blauer Button mit Hover-Effekt</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
