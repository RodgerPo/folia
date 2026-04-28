import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getFallbackImage } from "@/lib/plant-images";
import DeletePlantButton from "@/components/DeletePlantButton";

export default async function PlantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const { id } = await params;

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) redirect("/sign-in");

  const plant = await prisma.plant.findFirst({
    where: { id, userId: user.id },
  });
  if (!plant) notFound();

  const careItems = [
    { label: "Watering", value: `Every ${plant.wateringFrequencyDays} days` },
    { label: "Light", value: plant.light ?? "—" },
    { label: "Humidity", value: plant.humidity ?? "—" },
    { label: "Soil", value: plant.soil ?? "—" },
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* Back link */}
      <Link href="/dashboard" className="text-sm text-stone-400 hover:text-stone-600 transition-colors mb-6 inline-block">
        ← Back to collection
      </Link>

      {/* Plant header */}
      <div className="flex gap-6 items-start mb-8">
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-stone-100">
          <Image
            src={plant.imageUrl ?? getFallbackImage(plant.name)}
            alt={plant.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <h1 className="text-2xl font-serif font-semibold text-stone-800">{plant.name}</h1>
          {plant.scientificName && (
            <p className="text-stone-400 italic mt-0.5">{plant.scientificName}</p>
          )}
          <div className="mt-4">
            <DeletePlantButton plantId={plant.id} />
          </div>
        </div>
      </div>

      {/* Care profile */}
      <section className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">Care profile</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {careItems.map((item) => (
            <div key={item.label}>
              <p className="text-xs text-stone-400 mb-1">{item.label}</p>
              <p className="text-sm text-stone-700 font-medium">{item.value}</p>
            </div>
          ))}
        </div>
        {plant.careSummary && (
          <p className="mt-4 text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-4">{plant.careSummary}</p>
        )}
      </section>

      {/* Health log — coming in Stage 4 */}
      <section className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">Health log</h2>
        <p className="text-sm text-stone-400">Health logging coming soon.</p>
      </section>

      {/* AI chat — coming in Stage 5 */}
      <section className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">Ask about this plant</h2>
        <p className="text-sm text-stone-400">AI chat coming soon.</p>
      </section>
    </main>
  );
}
