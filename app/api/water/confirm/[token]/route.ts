import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const reminder = await prisma.wateringReminder.findUnique({
    where: { token },
  });

  if (!reminder) redirect("/dashboard?confirmed=notfound");
  if (reminder.confirmedAt) redirect("/dashboard?confirmed=already");

  const now = new Date();

  await prisma.$transaction([
    prisma.wateringReminder.update({
      where: { token },
      data: { confirmedAt: now },
    }),
    prisma.plant.update({
      where: { id: reminder.plantId },
      data: { lastWatered: now },
    }),
    prisma.wateringEvent.create({
      data: { plantId: reminder.plantId, wateredAt: now },
    }),
  ]);

  redirect("/dashboard?confirmed=1");
}
