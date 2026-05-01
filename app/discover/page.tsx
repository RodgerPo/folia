import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { getPlantOfTheDay } from "@/lib/perenual";
import { getFallbackImage } from "@/lib/plant-images";
import Nav from "@/components/Nav";

export default async function DiscoverPage() {
  const { userId } = await auth();
  const isLoggedIn = !!userId;
  const plant = await getPlantOfTheDay();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {isLoggedIn ? (
        <Nav active="discover" />
      ) : (
        <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(245,240,232,.94)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)", height: 64, display: "flex", alignItems: "center" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, color: "var(--accent)", textDecoration: "none" }}>Folia</Link>
            <Link href="/sign-up" style={{ fontSize: 14, fontWeight: 500, background: "var(--accent)", color: "var(--cream-50)", textDecoration: "none", padding: "10px 18px", borderRadius: 12 }}>Get started</Link>
          </div>
        </nav>
      )}

      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "56px 32px 80px" }}>
        {plant ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>

            {/* Left: sticky image */}
            <div style={{ position: "sticky", top: 88 }}>
              <div style={{ width: "100%", aspectRatio: "1", background: "#EEEADE", borderRadius: 28, overflow: "hidden", display: "flex", alignItems: "flex-end", justifyContent: "center", boxShadow: "var(--shadow-raised)", position: "relative" }}>
                <Image src={getFallbackImage(plant.name)} alt={plant.name} fill style={{ objectFit: "cover", objectPosition: "center" }} />
              </div>
            </div>

            {/* Right: content */}
            <div style={{ paddingTop: 4 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 500, letterSpacing: ".08em", textTransform: "uppercase" as const, color: "var(--gold-400)", background: "var(--gold-100)", padding: "5px 12px", borderRadius: 999, marginBottom: 20 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#8C6A28" stroke="none"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
                Plant of the day
              </div>

              <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(32px,4vw,48px)", letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--ink-900)", marginBottom: 6 }}>
                {plant.name}
              </h1>
              {plant.scientificName && (
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "var(--ink-500)", marginBottom: 28 }}>
                  {plant.scientificName}
                </p>
              )}

              {/* Care stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 36 }}>
                {[
                  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D5A3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>, label: "Watering", value: `Every ${plant.wateringFrequencyDays} days` },
                  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D5A3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="7.05" y2="7.05"/><line x1="16.95" y1="16.95" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>, label: "Light", value: plant.light },
                  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D5A3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>, label: "Cycle", value: plant.cycle },
                ].map((s) => (
                  <div key={s.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "18px 16px", boxShadow: "var(--shadow-card)" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>{s.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase" as const, color: "var(--ink-500)", marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-900)", lineHeight: 1.4 }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href={isLoggedIn ? "/dashboard" : "/sign-up"} style={{ fontSize: 15, fontWeight: 500, background: "var(--accent)", color: "var(--cream-50)", textDecoration: "none", padding: "14px 28px", borderRadius: 16, display: "inline-flex", alignItems: "center" }}>
                  Add to my collection
                </Link>
                <Link href="/discover" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 15, fontWeight: 500, background: "var(--cream-200)", color: "var(--ink-900)", textDecoration: "none", padding: "14px 28px", borderRadius: 16 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                  Refresh
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--ink-500)" }}>
            <p>Could not load a plant today. Try again later.</p>
            <Link href="/dashboard" style={{ marginTop: 16, display: "inline-block", fontSize: 14, color: "var(--accent)", textDecoration: "none" }}>Go to my plants</Link>
          </div>
        )}
      </main>
    </div>
  );
}
