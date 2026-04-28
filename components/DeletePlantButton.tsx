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
      <div className="flex items-center gap-2">
        <span className="text-sm text-stone-500">Remove this plant?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
        >
          {deleting ? "Removing..." : "Yes, remove"}
        </button>
        <button onClick={() => setConfirming(false)} className="text-sm text-stone-400 hover:text-stone-600">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-sm text-stone-400 hover:text-red-500 transition-colors"
    >
      Remove plant
    </button>
  );
}
