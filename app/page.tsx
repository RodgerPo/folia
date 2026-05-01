import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

export default async function LandingPage() {
  const { userId } = await auth();
  const isLoggedIn = !!userId;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(245,240,232,.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)", height: 64,
        display: "flex", alignItems: "center",
      }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, color: "var(--accent)" }}>Folia</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {isLoggedIn ? (
              <>
                <Link href="/discover" style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-700)", textDecoration: "none", padding: "10px 18px", borderRadius: 12 }}>Discover</Link>
                <Link href="/dashboard" style={{ fontSize: 14, fontWeight: 500, background: "var(--accent)", color: "var(--cream-50)", textDecoration: "none", padding: "10px 18px", borderRadius: 12 }}>My Plants</Link>
              </>
            ) : (
              <>
                <Link href="/sign-in" style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-700)", textDecoration: "none", padding: "10px 18px", borderRadius: 12 }}>Sign in</Link>
                <Link href="/sign-up" style={{ fontSize: 14, fontWeight: 500, background: "var(--accent)", color: "var(--cream-50)", textDecoration: "none", padding: "10px 18px", borderRadius: 12 }}>Get started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ borderBottom: "1px solid var(--divider)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", gap: 64, minHeight: "calc(100vh - 64px)", padding: "80px 0" }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 20 }}>Plant care, reimagined</p>
              <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(38px,5vw,64px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--ink-900)", marginBottom: 22 }}>
                Your plants,<br />cared for with<br />intention.
              </h1>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--ink-700)", marginBottom: 36, maxWidth: 460 }}>
                Track every plant in your home, log what you observe, and get gentle AI-powered advice — all in one calm, thoughtful place.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href={isLoggedIn ? "/dashboard" : "/sign-up"} style={{ fontSize: 15, fontWeight: 500, background: "var(--accent)", color: "var(--cream-50)", textDecoration: "none", padding: "14px 28px", borderRadius: 16, display: "inline-flex", alignItems: "center" }}>
                  {isLoggedIn ? "Go to my plants" : "Start for free"}
                </Link>
                <Link href={isLoggedIn ? "/discover" : "/sign-in"} style={{ fontSize: 15, fontWeight: 500, background: "var(--cream-200)", color: "var(--ink-900)", textDecoration: "none", padding: "14px 28px", borderRadius: 16, display: "inline-flex", alignItems: "center" }}>
                  {isLoggedIn ? "Discover a plant" : "Sign in"}
                </Link>
              </div>
            </div>

            <div style={{ position: "relative" }}>
              <div style={{ width: "100%", aspectRatio: "1", maxWidth: 480, marginLeft: "auto", background: "#EEEADE", borderRadius: 32, overflow: "hidden", position: "relative" }}>
                <Image src="/plants/Monstera.png" alt="Monstera" fill style={{ objectFit: "cover", objectPosition: "center" }} />
              </div>
              <div style={{ position: "absolute", bottom: 60, left: -28, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 16px", boxShadow: "var(--shadow-raised)", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D5A3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-900)" }}>Water today</div>
                  <div style={{ fontSize: 11, color: "var(--ink-500)" }}>Monstera is thirsty</div>
                </div>
              </div>
              <div style={{ position: "absolute", top: 56, right: -16, maxWidth: 180, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 16px", boxShadow: "var(--shadow-raised)", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--gold-100)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8C6A28" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.88 5.76L20 10l-6.12 1.24L12 17l-1.88-5.76L4 10l6.12-1.24z"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-900)" }}>AI tip ready</div>
                  <div style={{ fontSize: 11, color: "var(--ink-500)" }}>For Fiddle Leaf Fig</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ borderBottom: "1px solid var(--divider)", padding: "96px 0" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px" }}>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>Everything you need</p>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(26px,3vw,36px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 56 }}>
            A calmer way<br />to care for plants
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {[
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3D5A3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>, title: "Search & add plants", desc: "Browse thousands of species. Add plants to your collection with one tap, and get their full care profile instantly." },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3D5A3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, title: "Health log", desc: "Write observations as you notice them. Your log builds a meaningful record — and AI reads it to give better advice." },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3D5A3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>, title: "Watering reminders", desc: "Gentle reminders when each plant needs water, based on its species and how it's been doing." },
            ].map((f) => (
              <div key={f.title} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "32px 28px", boxShadow: "var(--shadow-card)" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink-900)", marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "var(--ink-700)", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ borderBottom: "1px solid var(--divider)", padding: "96px 0" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px" }}>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>How it works</p>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(26px,3vw,36px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.2 }}>Simple from day one</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 40, marginTop: 56 }}>
            {[
              { num: "01", title: "Add your plants", desc: "Search by common name or species. We pull in the care profile so you don't have to." },
              { num: "02", title: "Log observations", desc: "Notice a new leaf? Yellowing? Write a quick note. Your log builds a picture over time." },
              { num: "03", title: "Get better advice", desc: "AI reads your logs and each plant's profile to give you genuinely useful, personalised tips." },
            ].map((s) => (
              <div key={s.num}>
                <div style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 48, fontWeight: 400, color: "var(--sage-100)", lineHeight: 1, marginBottom: 16 }}>{s.num}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink-900)", marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "var(--ink-700)", lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 0 96px", borderBottom: "1px solid var(--divider)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ background: "var(--sage-500)", borderRadius: 28, padding: "64px 56px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(26px,3vw,38px)", lineHeight: 1.2, color: "var(--cream-50)", marginBottom: 12 }}>
                Ready to start caring<br />with intention?
              </div>
              <div style={{ fontSize: 15, color: "rgba(245,240,232,.72)" }}>Free to start. No credit card required.</div>
            </div>
            <Link href="/sign-up" style={{ fontSize: 15, fontWeight: 600, background: "var(--cream-50)", color: "var(--accent)", textDecoration: "none", padding: "14px 28px", borderRadius: 16, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center" }}>
              Start for free →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "32px 0" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "var(--accent)" }}>Folia</span>
          <span style={{ fontSize: 13, color: "var(--ink-500)" }}>© 2026 Folia. Made with care.</span>
        </div>
      </footer>

    </div>
  );
}
