"use client";

import Link from "next/link";
import Image from "next/image";
import { Plant } from "@prisma/client";
import { getFallbackImage } from "@/lib/plant-images";

function getWateringBadge(lastWatered: Date | null, frequencyDays: number) {
  if (!lastWatered) {
    return { label: "Not yet watered", bg: "var(--cream-200)", color: "var(--ink-500)" };
  }
  const due = new Date(lastWatered);
  due.setDate(due.getDate() + frequencyDays);
  const daysUntilDue = Math.ceil((due.getTime() - Date.now()) / 86_400_000);

  if (daysUntilDue > 2) return { label: `Water in ${daysUntilDue}d`, bg: "var(--sage-100)", color: "var(--sage-600)" };
  if (daysUntilDue > 0) return { label: `Water in ${daysUntilDue}d`, bg: "var(--gold-100)", color: "var(--gold-400)" };
  return { label: "Water now", bg: "var(--red-100)", color: "var(--red-500)" };
}

export default function PlantCard({ plant }: { plant: Plant }) {
  const badge = getWateringBadge(plant.lastWatered, plant.wateringFrequencyDays);

  return (
    <Link
      href={`/plants/${plant.id}`}
      style={{
        display: "block", textDecoration: "none", color: "inherit",
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 16, overflow: "hidden",
        boxShadow: "var(--shadow-card)",
        transition: "box-shadow 200ms, transform 200ms",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "var(--shadow-raised)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "var(--shadow-card)";
      }}
    >
      <div style={{ width: "100%", aspectRatio: "1", background: "#EEEADE", position: "relative", overflow: "hidden" }}>
        <Image
          src={plant.imageUrl ?? getFallbackImage(plant.name)}
          alt={plant.name}
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 500, color: "var(--ink-900)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {plant.name}
        </div>
        {plant.scientificName && (
          <div style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 13, color: "var(--ink-500)", marginBottom: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {plant.scientificName}
          </div>
        )}
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "3px 10px", borderRadius: 999,
          fontSize: 12, fontWeight: 500,
          background: badge.bg, color: badge.color,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", opacity: .75, display: "inline-block" }} />
          {badge.label}
        </span>
      </div>
    </Link>
  );
}
