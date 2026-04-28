import Link from "next/link";
import Image from "next/image";
import { Plant } from "@prisma/client";
import { getFallbackImage } from "@/lib/plant-images";

function getWateringBadge(lastWatered: Date | null, frequencyDays: number) {
  if (!lastWatered) {
    return { label: "Not yet watered", className: "bg-stone-100 text-stone-500" };
  }

  const now = new Date();
  const due = new Date(lastWatered);
  due.setDate(due.getDate() + frequencyDays);
  const daysUntilDue = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilDue > 2) {
    return { label: `Water in ${daysUntilDue}d`, className: "bg-green-100 text-green-700" };
  } else if (daysUntilDue > 0) {
    return { label: `Water in ${daysUntilDue}d`, className: "bg-amber-100 text-amber-700" };
  } else {
    return { label: "Water now", className: "bg-red-100 text-red-600" };
  }
}

export default function PlantCard({ plant }: { plant: Plant }) {
  const badge = getWateringBadge(plant.lastWatered, plant.wateringFrequencyDays);

  return (
    <Link href={`/plants/${plant.id}`} className="group block rounded-2xl overflow-hidden bg-white border border-stone-200 hover:border-green-300 hover:shadow-md transition-all duration-200">
      <div className="aspect-square bg-stone-50 relative">
        <Image
          src={plant.imageUrl ?? getFallbackImage(plant.name)}
          alt={plant.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-serif text-stone-800 font-medium truncate">{plant.name}</h3>
        {plant.scientificName && (
          <p className="text-sm text-stone-400 italic truncate">{plant.scientificName}</p>
        )}
        <span className={`mt-3 inline-block text-xs font-medium px-2 py-1 rounded-full ${badge.className}`}>
          {badge.label}
        </span>
      </div>
    </Link>
  );
}
