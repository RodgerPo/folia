const SAMPLE_IMAGES = [
  "Monstera.png",
  "Pothos.png",
  "Snake Plant.png",
  "Fiddle Leaf Fig.png",
  "Aloe Vera.png",
  "Bird of Paradise.png",
  "Calathea.png",
  "Dracaena.png",
  "Peace Lily.png",
  "Philodendron.png",
  "Rubber Plant.png",
  "Spider Plant.png",
  "ZZ Plant.png",
];

// Maps partial name matches to specific sample images
const NAME_MAP: Record<string, string> = {
  "monstera":           "Monstera.png",
  "pothos":             "Pothos.png",
  "snake plant":        "Snake Plant.png",
  "fiddle leaf":        "Fiddle Leaf Fig.png",
  "aloe vera":          "Aloe Vera.png",
  "aloe":               "Aloe Vera.png",
  "bird of paradise":   "Bird of Paradise.png",
  "calathea":           "Calathea.png",
  "dracaena":           "Dracaena.png",
  "peace lily":         "Peace Lily.png",
  "philodendron":       "Philodendron.png",
  "rubber plant":       "Rubber Plant.png",
  "rubber tree":        "Rubber Plant.png",
  "spider plant":       "Spider Plant.png",
  "zz plant":           "ZZ Plant.png",
  "zamioculcas":        "ZZ Plant.png",
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
