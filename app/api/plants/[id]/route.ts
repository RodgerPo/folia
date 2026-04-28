import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

async function getAuthorizedPlant(clerkId: string, plantId: string) {
  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return null;

  const plant = await prisma.plant.findFirst({
    where: { id: plantId, userId: user.id },
  });
  return plant;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  const plant = await getAuthorizedPlant(clerkId, id);
  if (!plant) return new Response("Not found", { status: 404 });

  const healthLogs = await prisma.healthLog.findMany({
    where: { plantId: id },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ ...plant, healthLogs });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  const plant = await getAuthorizedPlant(clerkId, id);
  if (!plant) return new Response("Not found", { status: 404 });

  const body = await req.json();
  const updated = await prisma.plant.update({
    where: { id },
    data: {
      wateringFrequencyDays: body.wateringFrequencyDays ?? plant.wateringFrequencyDays,
      lastWatered: body.lastWatered ? new Date(body.lastWatered) : plant.lastWatered,
    },
  });

  return Response.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  const plant = await getAuthorizedPlant(clerkId, id);
  if (!plant) return new Response("Not found", { status: 404 });

  await prisma.plant.delete({ where: { id } });
  return Response.json({ ok: true });
}
