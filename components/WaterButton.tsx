"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  plantId: string;
  lastWatered: Date | null;
  wateringFrequencyDays: number;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

function toInputValue(date: Date | null) {
  if (!date) return "";
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function WaterButton({ plantId, lastWatered, wateringFrequencyDays }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dateValue, setDateValue] = useState(toInputValue(lastWatered));

  async function patch(body: Record<string, unknown>) {
    setLoading(true);
    await fetch(`/api/plants/${plantId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.refresh();
    setLoading(false);
    setEditing(false);
  }

  function markToday() {
    patch({ lastWatered: new Date().toISOString() });
  }

  function saveEdit() {
    if (!dateValue) return;
    patch({ lastWatered: new Date(dateValue).toISOString() });
  }

  function clearWatering() {
    patch({ lastWatered: null });
  }

  if (editing) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <input
          type="date"
          value={dateValue}
          max={toInputValue(new Date())}
          onChange={(e) => setDateValue(e.target.value)}
          style={{
            fontSize: 14, border: "1px solid var(--border)", borderRadius: 10,
            padding: "8px 12px", background: "var(--surface-subtle)",
            color: "var(--ink-900)", fontFamily: "inherit", outline: "none",
          }}
        />
        <button
          onClick={saveEdit}
          disabled={loading || !dateValue}
          style={{
            fontSize: 13, fontWeight: 500, background: "var(--accent)",
            color: "var(--cream-50)", border: "none", cursor: loading ? "not-allowed" : "pointer",
            padding: "8px 14px", borderRadius: 10, opacity: loading ? 0.6 : 1,
          }}
        >
          Save
        </button>
        <button
          onClick={() => { setEditing(false); setDateValue(toInputValue(lastWatered)); }}
          style={{ fontSize: 13, color: "var(--ink-500)", background: "none", border: "none", cursor: "pointer" }}
        >
          Cancel
        </button>
      </div>
    );
  }

  if (lastWatered) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "var(--accent-light)", color: "var(--sage-600)",
          borderRadius: 999, padding: "7px 14px", fontSize: 13, fontWeight: 500,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
          Watered {formatDate(lastWatered)}
        </div>
        <button
          onClick={() => { setEditing(true); setDateValue(toInputValue(lastWatered)); }}
          title="Edit date"
          style={{ fontSize: 12, color: "var(--ink-500)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}
        >
          Edit
        </button>
        <button
          onClick={clearWatering}
          disabled={loading}
          title="Remove watering record"
          style={{ fontSize: 12, color: "var(--red-500)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, opacity: loading ? 0.5 : 1 }}
        >
          Remove
        </button>
        <button
          onClick={markToday}
          disabled={loading}
          style={{
            fontSize: 13, fontWeight: 500, background: "var(--accent)",
            color: "var(--cream-50)", border: "none", cursor: loading ? "not-allowed" : "pointer",
            padding: "7px 14px", borderRadius: 10, opacity: loading ? 0.6 : 1,
          }}
        >
          Water again
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={markToday}
      disabled={loading}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        fontSize: 14, fontWeight: 500, background: "var(--accent)",
        color: "var(--cream-50)", border: "none", cursor: loading ? "not-allowed" : "pointer",
        padding: "10px 20px", borderRadius: 12, opacity: loading ? 0.6 : 1,
        transition: "opacity 150ms",
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
      {loading ? "Saving…" : "Mark as watered"}
    </button>
  );
}
