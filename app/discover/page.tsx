import Link from "next/link";
import Image from "next/image";
import { getPlantOfTheDay } from "@/lib/perenual";
import { getFallbackImage } from "@/lib/plant-images";

export default async function DiscoverPage() {
  const plant = await getPlantOfTheDay();

  return (
    <main className="max-w-xl mx-auto px-4 py-16">
      <Link href="/dashboard" className="text-sm text-stone-400 hover:text-stone-600 transition-colors mb-8 inline-block">
        ← Back to my plants
      </Link>

      <p className="text-xs font-semibold text-green-700 uppercase tracking-widest mb-3">Plant of the day</p>

      {plant ? (
        <>
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-stone-100 mb-8">
            <Image
              src={getFallbackImage(plant.name)}
              alt={plant.name}
              fill
              className="object-cover"
            />
          </div>

          <h1 className="text-3xl font-serif font-semibold text-stone-800">{plant.name}</h1>
          {plant.scientificName && (
            <p className="text-stone-400 italic mt-1">{plant.scientificName}</p>
          )}

          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              { label: "Watering", value: `Every ${plant.wateringFrequencyDays} days` },
              { label: "Light", value: plant.light },
              { label: "Cycle", value: plant.cycle },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl border border-stone-200 p-4">
                <p className="text-xs text-stone-400 mb-1">{item.label}</p>
                <p className="text-sm font-medium text-stone-700">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <Link
              href="/dashboard"
              className="flex-1 text-center bg-green-700 hover:bg-green-800 text-white font-medium py-3 rounded-xl transition-colors text-sm"
            >
              Add to my collection
            </Link>
            <Link
              href="/discover"
              className="px-4 text-center border border-stone-200 hover:border-stone-300 text-stone-600 font-medium py-3 rounded-xl transition-colors text-sm"
            >
              Refresh
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-16 text-stone-400">
          <p>Could not load a plant today. Try again later.</p>
          <Link href="/dashboard" className="mt-4 inline-block text-sm text-green-700 hover:underline">
            Go to my plants
          </Link>
        </div>
      )}
    </main>
  );
}
