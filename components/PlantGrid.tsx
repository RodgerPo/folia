"use client";

import { useState } from "react";
import { Plant } from "@prisma/client";
import PlantCard from "./PlantCard";
import PlantSearchModal from "./PlantSearchModal";

export default function PlantGrid({ plants }: { plants: Plant[] }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">My Plants</h1>
          <p className="text-stone-400 text-sm mt-1">
            {plants.length === 0 ? "No plants yet" : `${plants.length} plant${plants.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          + Add plant
        </button>
      </div>

      {plants.length === 0 ? (
        <div className="text-center py-24 text-stone-400">
          <div className="text-6xl mb-4">🌱</div>
          <p className="text-lg font-medium text-stone-500">Your collection is empty</p>
          <p className="text-sm mt-1">Search for a plant above to get started</p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-6 bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            Add your first plant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      )}

      {modalOpen && <PlantSearchModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
