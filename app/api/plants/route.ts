import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { generateCareSupplement } from "@/lib/anthropic";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return new Response("User not found", { status: 404 });

  const plants = await prisma.plant.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(plants);
}

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return new Response("User not found", { status: 404 });

  const body = await req.json();
  const { name, scientificName, wateringFrequencyDays, light, perenualId } = body;

  if (!name) return new Response("Plant name is required", { status: 400 });

  const plant = await prisma.plant.create({
    data: {
      userId: user.id,
      name,
      scientificName: scientificName ?? null,
      wateringFrequencyDays: wateringFrequencyDays ?? 7,
      light: light ?? null,
      perenualId: perenualId ?? null,
    },
  });

  try {
    const supplement = await generateCareSupplement(name, scientificName ?? null);
    const enriched = await prisma.plant.update({
      where: { id: plant.id },
      data: supplement,
    });
    return Response.json(enriched, { status: 201 });
  } catch (err) {
    console.error("Care supplement generation failed:", err);
    return Response.json(plant, { status: 201 });
  }
}
