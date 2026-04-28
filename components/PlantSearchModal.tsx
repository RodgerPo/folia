"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PlantSearchResult } from "@/lib/perenual";
import { getFallbackImage } from "@/lib/plant-images";

export default function PlantSearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlantSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<PlantSearchResult | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounce: wait 300ms after the user stops typing before searching
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/plants/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  async function handleAdd() {
    if (!selected) return;
    setSaving(true);
    try {
      await fetch("/api/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selected.name,
          scientificName: selected.scientificName,
          wateringFrequencyDays: selected.wateringFrequencyDays,
          light: selected.light,
          perenualId: selected.perenualId,
        }),
      });
      router.refresh(); // re-fetches the dashboard server component
      onClose();
    } catch {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Add a plant</h2>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl leading-none">×</button>
          </div>

          <input
            ref={inputRef}
            type="text"
            placeholder="Search for a plant..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-green-300"
          />

          {/* Search results */}
          {!selected && (
            <div className="mt-3 max-h-64 overflow-y-auto space-y-1">
              {loading && (
                <p className="text-sm text-stone-400 py-4 text-center">Searching...</p>
              )}
              {!loading && query.length >= 2 && results.length === 0 && (
                <p className="text-sm text-stone-400 py-4 text-center">No plants found</p>
              )}
              {results.map((plant) => (
                <button
                  key={plant.perenualId}
                  onClick={() => setSelected(plant)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-stone-50 text-left"
                >
                  <Image
                    src={plant.thumbnailUrl ?? getFallbackImage(plant.name)}
                    alt={plant.name}
                    width={40}
                    height={40}
                    className="rounded-lg object-cover w-10 h-10"
                  />
                  <div>
                    <p className="text-sm font-medium text-stone-800">{plant.name}</p>
                    {plant.scientificName && (
                      <p className="text-xs text-stone-400 italic">{plant.scientificName}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Care profile preview */}
          {selected && (
            <div className="mt-4 bg-stone-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-stone-800">{selected.name}</p>
                  {selected.scientificName && (
                    <p className="text-xs text-stone-400 italic">{selected.scientificName}</p>
                  )}
                </div>
                <button onClick={() => setSelected(null)} className="text-xs text-stone-400 hover:text-stone-600">Change</button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm text-stone-600 pt-1">
                <div><span className="text-stone-400 block text-xs">Watering</span>Every {selected.wateringFrequencyDays} days</div>
                <div><span className="text-stone-400 block text-xs">Light</span>{selected.light}</div>
                <div><span className="text-stone-400 block text-xs">Cycle</span>{selected.cycle}</div>
              </div>
              <button
                onClick={handleAdd}
                disabled={saving}
                className="mt-2 w-full bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
              >
                {saving ? "Adding..." : "Add to collection"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
