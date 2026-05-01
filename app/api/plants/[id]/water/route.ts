import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return new Response("Unauthorized", { status: 401 });

  const plant = await prisma.plant.findFirst({ where: { id, userId: user.id } });
  if (!plant) return new Response("Not found", { status: 404 });

  const body = await req.json().catch(() => ({}));
  const wateredAt = body.wateredAt ? new Date(body.wateredAt) : new Date();

  const [event] = await prisma.$transaction([
    prisma.wateringEvent.create({ data: { plantId: id, wateredAt } }),
    prisma.plant.update({ where: { id }, data: { lastWatered: wateredAt } }),
  ]);

  return Response.json(event, { status: 201 });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return new Response("Unauthorized", { status: 401 });

  const plant = await prisma.plant.findFirst({ where: { id, userId: user.id } });
  if (!plant) return new Response("Not found", { status: 404 });

  const events = await prisma.wateringEvent.findMany({
    where: { plantId: id },
    orderBy: { wateredAt: "desc" },
    take: 30,
  });

  return Response.json(events);
}
