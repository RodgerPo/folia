import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PlantGrid from "@/components/PlantGrid";
import ConfirmedBanner from "@/components/ConfirmedBanner";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ confirmed?: string }>;
}) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) redirect("/sign-in");

  const plants = await prisma.plant.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const { confirmed } = await searchParams;

  return (
    <main className="mob-px" style={{ maxWidth: 1120, margin: "0 auto", padding: "48px 32px 80px" }}>
      {confirmed === "1" && <ConfirmedBanner />}
      <PlantGrid plants={plants} />
    </main>
  );
}
