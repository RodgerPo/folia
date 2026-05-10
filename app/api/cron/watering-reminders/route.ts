import { prisma } from "@/lib/prisma";
import { sendWateringReminder } from "@/lib/resend";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) return new Response("NEXT_PUBLIC_APP_URL not set", { status: 500 });

  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  // Fetch all plants that have been watered at least once, with their user
  const plants = await prisma.plant.findMany({
    where: { lastWatered: { not: null } },
    include: {
      user: true,
      wateringReminders: {
        where: { sentAt: { gte: startOfToday } },
        take: 1,
      },
    },
  });

  // Filter to plants that are due today (or overdue) and haven't had a reminder sent today
  const duePlants = plants.filter((plant) => {
    if (!plant.lastWatered) return false;
    if (plant.wateringReminders.length > 0) return false; // already emailed today

    const nextDue = new Date(plant.lastWatered);
    nextDue.setDate(nextDue.getDate() + plant.wateringFrequencyDays);
    return nextDue <= now;
  });

  if (duePlants.length === 0) {
    return Response.json({ sent: 0, message: "No plants due today" });
  }

  // Group due plants by user
  const byUser = new Map<string, { email: string; plants: typeof duePlants }>();
  for (const plant of duePlants) {
    const entry = byUser.get(plant.userId) ?? { email: plant.user.email, plants: [] };
    entry.plants.push(plant);
    byUser.set(plant.userId, entry);
  }

  let emailsSent = 0;

  for (const { email, plants: userPlants } of byUser.values()) {
    // Create a WateringReminder record per plant (gives each a unique token)
    const reminders = await Promise.all(
      userPlants.map((plant) =>
        prisma.wateringReminder.create({
          data: {
            plantId: plant.id,
            scheduledFor: now,
            sentAt: now,
          },
        })
      )
    );

    const plantEntries = userPlants.map((plant, i) => {
      const nextDue = new Date(plant.lastWatered!);
      nextDue.setDate(nextDue.getDate() + plant.wateringFrequencyDays);
      const daysOverdue = Math.max(
        0,
        Math.floor((now.getTime() - nextDue.getTime()) / 86_400_000)
      );
      return { name: plant.name, token: reminders[i].token, daysOverdue };
    });

    try {
      await sendWateringReminder({ to: email, plants: plantEntries, appUrl });
      emailsSent++;
    } catch (err) {
      console.error(`Failed to send reminder to ${email}:`, err);
    }
  }

  return Response.json({
    sent: emailsSent,
    plantsReminded: duePlants.length,
  });
}
