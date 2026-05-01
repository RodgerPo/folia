"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeletePlantButton({ plantId }: { plantId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setDeleting(true);
    await fetch(`/api/plants/${plantId}`, { method: "DELETE" });
    router.push("/dashboard");
    router.refresh();
  }

  if (confirming) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 14, color: "var(--ink-500)" }}>Remove this plant?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{ fontSize: 13, fontWeight: 500, background: "var(--red-500)", color: "#fff", border: "none", cursor: "pointer", padding: "7px 14px", borderRadius: 10, opacity: deleting ? .5 : 1 }}
        >
          {deleting ? "Removing…" : "Yes, remove"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          style={{ fontSize: 13, color: "var(--ink-500)", background: "none", border: "none", cursor: "pointer" }}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      style={{ fontSize: 14, fontWeight: 500, background: "var(--red-100)", color: "var(--red-500)", border: "none", cursor: "pointer", padding: "10px 18px", borderRadius: 12 }}
    >
      Remove plant
    </button>
  );
}
