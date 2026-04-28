const SAMPLE_IMAGES = [
  "Monstera.png",
  "Pothos.png",
  "Snake Plant.png",
  "Fiddle Leaf Fig.png",
];

// Maps partial name matches to specific sample images
const NAME_MAP: Record<string, string> = {
  "monstera":        "Monstera.png",
  "pothos":          "Pothos.png",
  "snake plant":     "Snake Plant.png",
  "fiddle leaf":     "Fiddle Leaf Fig.png",
};

// Returns a /plants/... path for use in next/image src
export function getFallbackImage(plantName: string): string {
  const lower = plantName.toLowerCase();

  for (const [key, filename] of Object.entries(NAME_MAP)) {
    if (lower.includes(key)) {
      return `/plants/${encodeURIComponent(filename)}`;
    }
  }

  // For unmatched plants, cycle through the 4 images based on the name
  let hash = 0;
  for (let i = 0; i < plantName.length; i++) {
    hash = (hash + plantName.charCodeAt(i)) % SAMPLE_IMAGES.length;
  }
  return `/plants/${encodeURIComponent(SAMPLE_IMAGES[hash])}`;
}
