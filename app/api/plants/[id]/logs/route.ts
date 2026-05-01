import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { analyzeHealthLog } from "@/lib/anthropic";

async function getAuthorizedPlant(clerkId: string, plantId: string) {
  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return null;
  return prisma.plant.findFirst({ where: { id: plantId, userId: user.id } });
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  const plant = await getAuthorizedPlant(clerkId, id);
  if (!plant) return new Response("Not found", { status: 404 });

  const logs = await prisma.healthLog.findMany({
    where: { plantId: id },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(logs);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  const plant = await getAuthorizedPlant(clerkId, id);
  if (!plant) return new Response("Not found", { status: 404 });

  const body = await req.json();
  const { note } = body;
  if (!note?.trim()) return new Response("Note is required", { status: 400 });

  const log = await prisma.healthLog.create({
    data: { plantId: id, note: note.trim() },
  });

  let aiAnalysis: string | null = null;
  try {
    aiAnalysis = await analyzeHealthLog(plant, note.trim());
    await prisma.healthLog.update({ where: { id: log.id }, data: { aiAnalysis } });
  } catch (err) {
    console.error("Health log AI analysis failed:", err);
  }

  return Response.json({ ...log, aiAnalysis }, { status: 201 });
}
