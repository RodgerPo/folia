import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function LandingPage() {
  const { userId } = await auth();
  const isLoggedIn = !!userId;

  return (
    <main className="min-h-screen bg-stone-50 flex flex-col">
      {/* Nav */}
      <header className="max-w-5xl mx-auto w-full px-4 h-14 flex items-center justify-between">
        <span className="text-green-800 font-semibold text-lg tracking-tight">Folia</span>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link href="/discover" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
                Discover a plant
              </Link>
              <Link href="/dashboard" className="text-sm bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-xl transition-colors">
                My plants
              </Link>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
                Sign in
              </Link>
              <Link href="/sign-up" className="text-sm bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-xl transition-colors">
                Get started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="text-6xl mb-6">🌿</div>
        <h1 className="text-4xl sm:text-5xl font-semibold text-stone-800 max-w-xl leading-tight">
          Your plants, cared for with intention
        </h1>
        <p className="mt-5 text-lg text-stone-500 max-w-md">
          Track your houseplant collection, log health observations, and get AI-powered care advice — all in one place.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-3 rounded-xl transition-colors">
                Go to my plants
              </Link>
              <Link href="/discover" className="border border-stone-200 hover:border-stone-300 text-stone-700 font-medium px-6 py-3 rounded-xl transition-colors">
                Discover a plant
              </Link>
            </>
          ) : (
            <>
              <Link href="/sign-up" className="bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-3 rounded-xl transition-colors">
                Start for free
              </Link>
              <Link href="/sign-in" className="border border-stone-200 hover:border-stone-300 text-stone-700 font-medium px-6 py-3 rounded-xl transition-colors">
                Sign in
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto w-full px-4 pb-24 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: "🔍", title: "Search & add plants", description: "Find any houseplant and get an instant care profile with watering schedule and light requirements." },
          { icon: "📋", title: "Health log", description: "Log observations about your plants and get AI analysis with specific care recommendations." },
          { icon: "💧", title: "Watering reminders", description: "Receive a daily email digest when plants are due for watering, with one-click confirmation." },
        ].map((feature) => (
          <div key={feature.title} className="bg-white rounded-2xl border border-stone-200 p-6">
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="font-semibold text-stone-800 mb-2">{feature.title}</h3>
            <p className="text-sm text-stone-500 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
