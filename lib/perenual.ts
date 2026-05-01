const BASE_URL = "https://perenual.com/api";
const API_KEY = process.env.PERENUAL_API_KEY;

export type PlantSearchResult = {
  perenualId: number;
  name: string;
  scientificName: string;
  wateringFrequencyDays: number;
  light: string;
  cycle: string;
  thumbnailUrl: string | null;
};

// Perenual returns paywall strings instead of null on free-tier fields.
// Treat any value containing "Upgrade" as missing data.
function clean(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.toLowerCase().includes("upgrade")) return null;
  return value;
}

// Perenual uses strings like "Frequent" / "Average" / "Minimum" for watering.
// We convert these to a number of days that makes sense for a reminder schedule.
function mapWateringToDays(watering: string | null | undefined): number {
  switch (watering?.toLowerCase()) {
    case "frequent":  return 2;
    case "average":   return 7;
    case "minimum":   return 14;
    case "none":      return 30;
    default:          return 7;
  }
}

function normalizePlant(plant: {
  id: number;
  common_name: string;
  scientific_name: string[] | null;
  watering: string | null;
  sunlight: string[] | null;
  cycle: string | null;
  default_image: { thumbnail: string } | null;
}): PlantSearchResult {
  return {
    perenualId: plant.id,
    name: plant.common_name ?? "Unknown Plant",
    scientificName: clean(plant.scientific_name?.[0]) ?? "",
    wateringFrequencyDays: mapWateringToDays(clean(plant.watering)),
    light: clean(plant.sunlight?.[0]) ?? "Unknown",
    cycle: clean(plant.cycle) ?? "Unknown",
    thumbnailUrl: plant.default_image?.thumbnail?.includes("upgrade_access") ? null : (plant.default_image?.thumbnail ?? null),
  };
}

export async function searchPlants(query: string): Promise<PlantSearchResult[]> {
  if (!API_KEY) throw new Error("Missing PERENUAL_API_KEY");

  const url = `${BASE_URL}/species-list?key=${API_KEY}&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) throw new Error(`Perenual search failed: ${res.status}`);

  const json = await res.json();
  const data = json.data ?? [];

  return data.map(normalizePlant);
}

// Returns a deterministic "plant of the day" — same plant all day, changes daily.
// Cached for 24 hours so it only costs one API request per day.
export async function getPlantOfTheDay(): Promise<PlantSearchResult | null> {
  if (!API_KEY) return null;

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  const page = (dayOfYear % 10) + 1;
  const index = dayOfYear % 10;

  const url = `${BASE_URL}/species-list?key=${API_KEY}&page=${page}&indoor=1`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) return null;

  const json = await res.json();
  const data = json.data ?? [];
  if (!data.length) return null;

  return normalizePlant(data[index % data.length]);
}
