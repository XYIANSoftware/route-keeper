import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-green-100 to-green-300 dark:from-gray-900 dark:to-gray-800">
      <section className="text-center mb-8">
        <h1 className="text-4xl font-extrabold mb-2">RouteKeeper</h1>
        <p className="text-lg mb-4">The mobile-first drive tracker for truckers</p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-2 bg-green-700 text-white rounded shadow hover:bg-green-800 transition"
          >
            Login
          </Link>
          <Link
            href="/login"
            className="px-6 py-2 bg-white text-green-700 border border-green-700 rounded shadow hover:bg-green-50 transition"
          >
            Sign Up
          </Link>
        </div>
      </section>
      <section className="w-full max-w-2xl grid gap-6">
        <div className="bg-white dark:bg-gray-900 rounded shadow p-6">
          <h2 className="text-xl font-bold mb-2">Why RouteKeeper?</h2>
          <ul className="list-disc list-inside text-left">
            <li>Track drives and stops with ease</li>
            <li>Mobile-first, works anywhere</li>
            <li>PrimeReact-powered UI</li>
            <li>Secure, fast, and ready for the road</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
