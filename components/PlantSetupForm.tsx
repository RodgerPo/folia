"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  plantId: string;
  location: string | null;
  potSize: string | null;
};

const LOCATIONS = [
  { value: "indoor", label: "Indoor" },
  { value: "outdoor", label: "Outdoor" },
  { value: "patio", label: "Patio / Balcony" },
];

const POT_SIZES = [
  { value: "small", label: "Small", sub: "< 15 cm" },
  { value: "medium", label: "Medium", sub: "15–25 cm" },
  { value: "large", label: "Large", sub: "> 25 cm" },
];

export default function PlantSetupForm({ plantId, location, potSize }: Props) {
  const router = useRouter();
  const [loc, setLoc] = useState(location ?? "");
  const [size, setSize] = useState(potSize ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isDirty = loc !== (location ?? "") || size !== (potSize ?? "");

  async function save() {
    if (!isDirty) return;
    setSaving(true);
    await fetch(`/api/plants/${plantId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location: loc || null, potSize: size || null }),
    });
    router.refresh();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function Toggle({ value, label, sub, selected, onSelect }: { value: string; label: string; sub?: string; selected: boolean; onSelect: () => void }) {
    return (
      <button
        type="button"
        onClick={onSelect}
        style={{
          flex: 1, padding: "10px 12px", borderRadius: 12, cursor: "pointer",
          border: selected ? "2px solid var(--accent)" : "1px solid var(--border)",
          background: selected ? "var(--accent-light)" : "var(--surface)",
          color: selected ? "var(--sage-600)" : "var(--ink-700)",
          fontWeight: selected ? 600 : 400, fontSize: 13,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          transition: "all 120ms",
        }}
      >
        {label}
        {sub && <span style={{ fontSize: 11, opacity: 0.6, fontWeight: 400 }}>{sub}</span>}
      </button>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-500)", marginBottom: 8, letterSpacing: ".04em", textTransform: "uppercase" as const }}>Location</div>
        <div style={{ display: "flex", gap: 8 }}>
          {LOCATIONS.map((l) => (
            <Toggle key={l.value} value={l.value} label={l.label} selected={loc === l.value} onSelect={() => setLoc(l.value)} />
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-500)", marginBottom: 8, letterSpacing: ".04em", textTransform: "uppercase" as const }}>Pot size</div>
        <div style={{ display: "flex", gap: 8 }}>
          {POT_SIZES.map((p) => (
            <Toggle key={p.value} value={p.value} label={p.label} sub={p.sub} selected={size === p.value} onSelect={() => setSize(p.value)} />
          ))}
        </div>
      </div>

      {isDirty && (
        <button
          onClick={save}
          disabled={saving}
          style={{
            alignSelf: "flex-start", fontSize: 13, fontWeight: 500,
            background: "var(--accent)", color: "var(--cream-50)",
            border: "none", cursor: saving ? "not-allowed" : "pointer",
            padding: "8px 16px", borderRadius: 10, opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? "Saving…" : saved ? "Saved" : "Save setup"}
        </button>
      )}
    </div>
  );
}
