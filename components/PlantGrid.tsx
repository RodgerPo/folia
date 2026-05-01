"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plant } from "@prisma/client";
import PlantCard from "./PlantCard";
import PlantSearchModal from "./PlantSearchModal";

function getStats(plants: Plant[]) {
  const now = Date.now();
  let needsWater = 0;
  let overdue = 0;
  for (const p of plants) {
    if (!p.lastWatered) continue;
    const due = new Date(p.lastWatered);
    due.setDate(due.getDate() + p.wateringFrequencyDays);
    const days = Math.ceil((due.getTime() - now) / 86_400_000);
    if (days <= 0) overdue++;
    else if (days <= 2) needsWater++;
  }
  return { total: plants.length, needsWater, overdue };
}

export default function PlantGrid({ plants }: { plants: Plant[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const stats = getStats(plants);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(28px,3vw,38px)", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink-900)" }}>
          My Plants
        </h1>
        <button
          onClick={() => setModalOpen(true)}
          style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 500, background: "var(--accent)", color: "var(--cream-50)", border: "none", cursor: "pointer", padding: "10px 18px", borderRadius: 12 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add a plant
        </button>
      </div>

      {/* Stats bar */}
      {plants.length > 0 && (
        <div style={{ display: "flex", gap: 16, marginBottom: 40, flexWrap: "wrap" }}>
          {[
            { dot: "var(--sage-500)", label: `${stats.total} plant${stats.total === 1 ? "" : "s"}` },
            { dot: "var(--gold-300)", label: `${stats.needsWater} need${stats.needsWater === 1 ? "s" : ""} water` },
            { dot: "var(--red-500)", label: `${stats.overdue} overdue` },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 999, padding: "7px 16px", fontSize: 13, fontWeight: 500, color: "var(--ink-700)", boxShadow: "var(--shadow-card)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
              {s.label}
            </div>
          ))}
        </div>
      )}

      {/* Grid */}
      {plants.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 40px", textAlign: "center" }}>
          <div style={{ width: 180, height: 180, background: "#EEEADE", borderRadius: "50%", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden", marginBottom: 28, position: "relative" }}>
            <Image src="/plants/Pothos.png" alt="" fill style={{ objectFit: "cover", objectPosition: "center" }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 500, color: "var(--ink-900)", marginBottom: 10 }}>No plants yet</h2>
          <p style={{ fontSize: 14, color: "var(--ink-500)", maxWidth: 280, lineHeight: 1.65, marginBottom: 24 }}>
            Add your first plant and start building your care journal. It only takes a moment.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            style={{ fontSize: 15, fontWeight: 500, background: "var(--accent)", color: "var(--cream-50)", border: "none", cursor: "pointer", padding: "14px 28px", borderRadius: 16 }}
          >
            Add your first plant
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 20 }}>
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      )}

      {/* Discover nudge */}
      {plants.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "48px 0 32px" }}>
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-500)", whiteSpace: "nowrap" }}>Explore</span>
            <div style={{ flex: 1, height: 1, background: "var(--divider)" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 28px", boxShadow: "var(--shadow-card)", gap: 20, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 500, color: "var(--ink-900)", marginBottom: 5 }}>Discover new plants</div>
              <div style={{ fontSize: 14, color: "var(--ink-500)" }}>A new plant of the day — with full care guides.</div>
            </div>
            <Link href="/discover" style={{ fontSize: 14, fontWeight: 500, background: "var(--cream-200)", color: "var(--ink-900)", textDecoration: "none", padding: "10px 18px", borderRadius: 12 }}>
              See today&apos;s plant →
            </Link>
          </div>
        </>
      )}

      {modalOpen && <PlantSearchModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
