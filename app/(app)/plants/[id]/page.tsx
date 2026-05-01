import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getFallbackImage } from "@/lib/plant-images";
import DeletePlantButton from "@/components/DeletePlantButton";
import WaterButton from "@/components/WaterButton";
import HealthLogForm from "@/components/HealthLogForm";
import HealthLogList from "@/components/HealthLogList";

export default async function PlantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) redirect("/sign-in");

  const plant = await prisma.plant.findFirst({
    where: { id, userId: user.id },
    include: { healthLogs: { orderBy: { createdAt: "desc" } } },
  });
  if (!plant) notFound();

  const { healthLogs, ...p } = plant;

  const careStats = [
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D5A3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>, label: "Watering", value: `Every ${p.wateringFrequencyDays} days` },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D5A3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="7.05" y2="7.05"/><line x1="16.95" y1="16.95" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>, label: "Light", value: p.light ?? "—" },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D5A3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>, label: "Humidity", value: p.humidity ?? "—" },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D5A3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, label: "Soil", value: p.soil ?? "—" },
  ];

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "48px 32px 96px" }}>

      {/* Detail header */}
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 56, alignItems: "start", marginBottom: 56 }}>
        <div style={{ width: "100%", aspectRatio: "1", background: "#EEEADE", borderRadius: 28, overflow: "hidden", position: "sticky", top: 88, boxShadow: "var(--shadow-raised)" }}>
          <Image
            src={p.imageUrl ?? getFallbackImage(p.name)}
            alt={p.name}
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
        <div style={{ paddingTop: 4 }}>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(30px,4vw,46px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--ink-900)", marginBottom: 4 }}>
            {p.name}
          </h1>
          {p.scientificName && (
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "var(--ink-500)", marginBottom: 18 }}>
              {p.scientificName}
            </p>
          )}
          <div style={{ marginBottom: 20 }}>
            <WaterButton plantId={p.id} lastWatered={p.lastWatered} wateringFrequencyDays={p.wateringFrequencyDays} />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
            <DeletePlantButton plantId={p.id} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500, color: "var(--ink-500)", textDecoration: "none" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              My Plants
            </Link>
          </div>
        </div>
      </div>

      {/* Care profile */}
      <div style={{ marginBottom: 56 }}>
        <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--ink-900)", marginBottom: 24, paddingBottom: 14, borderBottom: "1px solid var(--divider)" }}>
          Care profile
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
          {careStats.map((s) => (
            <div key={s.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 18px", boxShadow: "var(--shadow-card)" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>{s.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase" as const, color: "var(--ink-500)", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: "var(--ink-900)", lineHeight: 1.35 }}>{s.value}</div>
            </div>
          ))}
        </div>
        {p.careSummary && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "22px 24px", fontSize: 14, lineHeight: 1.75, color: "var(--ink-700)", boxShadow: "var(--shadow-card)" }}>
            <strong style={{ fontWeight: 600, color: "var(--ink-900)" }}>Care summary. </strong>{p.careSummary}
          </div>
        )}
      </div>

      {/* Health log */}
      <div style={{ marginBottom: 56 }}>
        <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--ink-900)", marginBottom: 24, paddingBottom: 14, borderBottom: "1px solid var(--divider)" }}>
          Health log
        </h2>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, boxShadow: "var(--shadow-card)", marginBottom: 28 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-900)", marginBottom: 12 }}>Log an observation</div>
          <HealthLogForm plantId={p.id} />
        </div>
        <HealthLogList logs={healthLogs} />
      </div>

      {/* Ask about this plant */}
      <div>
        <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--ink-900)", marginBottom: 24, paddingBottom: 14, borderBottom: "1px solid var(--divider)" }}>
          Ask about this plant
        </h2>
        <div style={{ background: "var(--surface-subtle)", border: "1.5px dashed var(--border)", borderRadius: 16, padding: "40px 32px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".08em", textTransform: "uppercase" as const, color: "var(--ink-300)", background: "var(--cream-200)", padding: "4px 10px", borderRadius: 999 }}>Coming soon</div>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 500, color: "var(--ink-500)", fontStyle: "italic" }}>Chat with an AI botanist</p>
          <p style={{ fontSize: 14, color: "var(--ink-500)", maxWidth: 360, lineHeight: 1.6 }}>
            Ask anything about {p.name} — why a leaf is yellowing, when to repot, how to propagate. Powered by your health log and care profile.
          </p>
          <button disabled style={{ fontSize: 14, fontWeight: 500, background: "var(--cream-200)", color: "var(--ink-700)", border: "none", padding: "10px 18px", borderRadius: 12, opacity: .5, cursor: "not-allowed" }}>
            Ask a question
          </button>
        </div>
      </div>

    </main>
  );
}
