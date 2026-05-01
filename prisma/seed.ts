import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// All dates relative to the seed date so badge states are always realistic.
function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(9, 0, 0, 0);
  return d;
}

const PLANTS = [
  {
    name: "Monstera",
    scientificName: "Monstera deliciosa",
    wateringFrequencyDays: 7,
    lastWatered: daysAgo(3),      // due in 4 days → green badge
    light: "partial shade",
    soil: "Well-draining peat mix",
    humidity: "High",
    careSummary: "Thrives in bright indirect light with consistent moisture. Wipe leaves monthly to keep them dust-free and photosynthesising well.",
    location: "indoor",
    potSize: "large",
    wateringDaysAgo: [3, 10, 17, 24],
    logs: [
      { daysAgo: 2, note: "New leaf unfurling on the east side — the fenestrations are already forming nicely.", aiAnalysis: "This is a healthy growth sign. The fenestrations forming early suggest your light levels are ideal. Continue current care." },
      { daysAgo: 9, note: "Noticed a small yellowing patch on one of the lower leaves.", aiAnalysis: "Lower leaf yellowing on Monstera is typically natural senescence rather than a problem. If it's isolated to one or two older leaves, no action needed. Check that the pot isn't sitting in water." },
      { daysAgo: 21, note: "Repotted into a larger pot with fresh peat mix. Roots were circling the old container.", aiAnalysis: "Good timing on the repot. Give it two to three weeks to settle before resuming any fertilising. Slight drooping in the next few days is normal — it will recover." },
      { daysAgo: 35, note: "Misted the aerial roots and wiped the large leaves. Looking very glossy.", aiAnalysis: "Misting aerial roots encourages them to seek moisture and can improve overall vigour. Regular leaf wiping helps photosynthesis — keep it up." },
    ],
  },
  {
    name: "Pothos",
    scientificName: "Epipremnum aureum",
    wateringFrequencyDays: 7,
    lastWatered: daysAgo(10),     // overdue by 3 days → red badge
    light: "partial shade",
    soil: "Standard potting mix",
    humidity: "Medium",
    careSummary: "One of the most adaptable houseplants. Tolerates low light and irregular watering, but grows fastest in bright indirect light with weekly watering.",
    location: "indoor",
    potSize: "small",
    wateringDaysAgo: [10, 17, 24, 31],
    logs: [
      { daysAgo: 1, note: "Leaves looking slightly limp and the soil is bone dry. Clearly overdue for water.", aiAnalysis: "Limp leaves and dry soil confirm this plant needs watering immediately. Give it a thorough soak until water drains from the bottom, then let it drain fully before returning to its spot." },
      { daysAgo: 12, note: "A couple of leaves have small brown tips. Not sure if it's the dry air or overwatering.", aiAnalysis: "Brown tips on Pothos usually point to low humidity or inconsistent watering rather than overwatering. Try placing a tray of pebbles and water nearby, and stick to a consistent weekly watering schedule." },
      { daysAgo: 28, note: "Trimmed back some leggy vines and put the cuttings in water to propagate.", aiAnalysis: "Pothos cuttings root easily in water. Change the water every few days and move to soil once roots reach 2–3 cm. Trimming encourages bushier growth on the parent plant." },
    ],
  },
  {
    name: "Fiddle Leaf Fig",
    scientificName: "Ficus lyrata",
    wateringFrequencyDays: 10,
    lastWatered: daysAgo(0),      // watered today → green badge
    light: "full sun",
    soil: "Fast-draining loamy mix",
    humidity: "Medium",
    careSummary: "Needs bright, consistent light and doesn't like being moved. Water only when the top 5 cm of soil is dry, and avoid cold draughts.",
    location: "indoor",
    potSize: "large",
    wateringDaysAgo: [0, 10, 20, 30],
    logs: [
      { daysAgo: 3, note: "Moved it slightly closer to the south-facing window. Fingers crossed it doesn't sulk.", aiAnalysis: "Fiddle Leaf Figs are sensitive to position changes and may drop a leaf or two in protest. Keep it in the new spot consistently rather than moving it back — it will adjust within two to three weeks." },
      { daysAgo: 15, note: "Two leaves dropped overnight. The soil feels fine and I haven't changed anything.", aiAnalysis: "Sudden leaf drop without obvious cause often follows a recent position change, temperature fluctuation, or draught. Check for cold air from nearby vents or windows. If conditions are stable, it should settle." },
      { daysAgo: 22, note: "New growth bud visible at the top — a tight reddish sheath just starting to open.", aiAnalysis: "A new growth bud is a great sign that your plant has settled and is healthy. Avoid disturbing it during this period. Ensure light remains consistent and hold off on repotting until the leaf is fully open." },
      { daysAgo: 40, note: "Dusted all the large leaves with a damp cloth. They were quite dusty.", aiAnalysis: "Dust on Fiddle Leaf Fig leaves significantly reduces their ability to absorb light. Monthly wiping is genuinely beneficial for this plant — well done for keeping up with it." },
    ],
  },
  {
    name: "Snake Plant",
    scientificName: "Dracaena trifasciata",
    wateringFrequencyDays: 14,
    lastWatered: null,            // never watered → "Not yet watered" badge
    light: "full sun",
    soil: "Sandy well-draining mix",
    humidity: "Low",
    careSummary: "Extremely drought tolerant. Water only when soil is completely dry — every two to three weeks in summer, monthly in winter. Overwatering is the main risk.",
    location: "indoor",
    potSize: "medium",
    wateringDaysAgo: [],
    logs: [
      { daysAgo: 5, note: "Just added this to my collection. Looks healthy, nice upright leaves with no blemishes.", aiAnalysis: "Good start. Snake Plants are very hardy and require little attention. Let the soil dry out completely between waterings and avoid placing it in a draughty spot. It will thrive with minimal intervention." },
      { daysAgo: 1, note: "Checking the soil — still completely dry even after a week. Is that normal?", aiAnalysis: "Completely normal for Snake Plant. Their succulent leaves store water and they genuinely prefer dry conditions. Wait until the soil is dry all the way down before watering, which can easily take two to three weeks indoors." },
    ],
  },
  {
    name: "Calathea",
    scientificName: "Calathea orbifolia",
    wateringFrequencyDays: 7,
    lastWatered: daysAgo(6),      // due tomorrow → amber badge
    light: "shade",
    soil: "Peat and perlite mix",
    humidity: "High",
    careSummary: "Prefers consistently moist soil and high humidity. Use filtered or room-temperature water — tap water with fluoride can cause brown leaf edges.",
    location: "indoor",
    potSize: "medium",
    wateringDaysAgo: [6, 13, 20, 27],
    logs: [
      { daysAgo: 4, note: "Leaves are praying upright in the evening — really beautiful to watch.", aiAnalysis: "The nyctinastic movement (leaves raising at night) is a sign of a healthy, happy Calathea. This behaviour is driven by light changes and is completely normal. Your care routine is working well." },
      { daysAgo: 11, note: "Some brown edges appearing on two leaves. I use tap water.", aiAnalysis: "Brown edges on Calathea are a classic sign of fluoride or chlorine sensitivity. Switch to filtered water or leave tap water in an open container overnight before using it. Affected leaves won't recover but new growth should come in clean." },
      { daysAgo: 18, note: "Bought a small pebble tray and placed it under the pot. Humidity in this room is low.", aiAnalysis: "A pebble tray is a good solution for Calathea humidity needs. Make sure the pot sits above the waterline, not in it. A humidifier nearby would be even more effective if brown edges persist." },
      { daysAgo: 30, note: "New leaf unfurling — it's tightly rolled and a slightly lighter green than the others.", aiAnalysis: "Healthy new growth. New Calathea leaves emerge rolled and lighter in colour — they darken as they open. Avoid touching or unrolling it. Keep humidity high and it should open fully within a week." },
    ],
  },
  {
    name: "ZZ Plant",
    scientificName: "Zamioculcas zamiifolia",
    wateringFrequencyDays: 14,
    lastWatered: daysAgo(7),      // due in 7 days → green badge
    light: "shade",
    soil: "Well-draining succulent mix",
    humidity: "Low",
    careSummary: "Nearly indestructible. Stores water in its rhizomes, so it tolerates drought well. Water every two weeks in summer and monthly in winter.",
    location: "indoor",
    potSize: "medium",
    wateringDaysAgo: [7, 21, 35],
    logs: [
      { daysAgo: 8, note: "One stem is leaning noticeably to one side. Should I stake it?", aiAnalysis: "ZZ Plants lean toward their light source. Try rotating the pot 180 degrees — it will straighten out over the next few weeks as it adjusts. Staking is not necessary and can damage the rhizomes if done incorrectly." },
      { daysAgo: 20, note: "Yellow leaf at the base of one stem. The rest looks fine.", aiAnalysis: "A single yellow leaf on a ZZ Plant is almost always normal senescence, especially on lower or older stems. If it's isolated, simply remove it. Only worry if multiple stems are yellowing simultaneously, which could indicate overwatering." },
      { daysAgo: 45, note: "This plant is thriving despite my neglect. Haven't watered it in three weeks.", aiAnalysis: "ZZ Plants genuinely thrive on minimal attention. Their rhizomes store significant water reserves. Three weeks between waterings in a typical indoor environment is perfectly fine — in fact, overwatering is a far greater risk than underwatering for this species." },
    ],
  },
];

async function main() {
  const user = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });

  if (!user) {
    console.log("No users found. Sign up at the app first, then run the seed.");
    return;
  }

  console.log(`Seeding for user: ${user.email}`);

  // Remove any previously seeded plants to allow re-runs
  const seededNames = PLANTS.map((p) => p.name);
  await prisma.plant.deleteMany({
    where: { userId: user.id, name: { in: seededNames } },
  });

  for (const data of PLANTS) {
    const plant = await prisma.plant.create({
      data: {
        userId: user.id,
        name: data.name,
        scientificName: data.scientificName,
        wateringFrequencyDays: data.wateringFrequencyDays,
        lastWatered: data.lastWatered,
        light: data.light,
        soil: data.soil,
        humidity: data.humidity,
        careSummary: data.careSummary,
        location: data.location,
        potSize: data.potSize,
      },
    });

    // Health logs
    for (const log of data.logs) {
      await prisma.healthLog.create({
        data: {
          plantId: plant.id,
          note: log.note,
          aiAnalysis: log.aiAnalysis,
          createdAt: daysAgo(log.daysAgo),
        },
      });
    }

    // Watering history
    for (const n of data.wateringDaysAgo) {
      await prisma.wateringEvent.create({
        data: {
          plantId: plant.id,
          wateredAt: daysAgo(n),
        },
      });
    }

    console.log(`  ✓ ${data.name}`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
