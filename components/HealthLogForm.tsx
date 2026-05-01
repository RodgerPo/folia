"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HealthLogForm({ plantId }: { plantId: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/plants/${plantId}/logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });

      if (!res.ok) throw new Error("Failed to save log");

      setNote("");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Describe what you're observing… (e.g. new leaf unfurling, yellowing on lower leaves)"
        rows={3}
        disabled={loading}
        style={{
          width: "100%", borderRadius: 12, border: "1px solid var(--border)",
          background: "var(--surface-subtle)", padding: "12px 16px",
          fontSize: 14, color: "var(--ink-900)", resize: "none",
          outline: "none", fontFamily: "inherit", lineHeight: 1.6,
          opacity: loading ? 0.6 : 1, boxSizing: "border-box",
        }}
      />
      {error && <p style={{ fontSize: 12, color: "var(--red-500)", margin: 0 }}>{error}</p>}
      <button
        type="submit"
        disabled={loading || !note.trim()}
        style={{
          alignSelf: "flex-start", fontSize: 14, fontWeight: 500,
          background: "var(--accent)", color: "var(--cream-50)",
          border: "none", cursor: loading || !note.trim() ? "not-allowed" : "pointer",
          padding: "10px 20px", borderRadius: 12,
          opacity: loading || !note.trim() ? 0.5 : 1,
          transition: "opacity 150ms",
        }}
      >
        {loading ? "Analyzing…" : "Log observation"}
      </button>
    </form>
  );
}
