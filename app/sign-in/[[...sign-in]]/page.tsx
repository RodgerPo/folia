import Link from "next/link";
import Image from "next/image";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>

      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(245,240,232,.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)", height: 64, display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, color: "var(--accent)", textDecoration: "none" }}>Folia</Link>
          <Link href="/sign-up" style={{ fontSize: 14, fontWeight: 500, background: "var(--accent)", color: "var(--cream-50)", textDecoration: "none", padding: "10px 18px", borderRadius: 12 }}>Get started</Link>
        </div>
      </nav>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 64px)" }}>
        <div style={{ background: "#EEEADE", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", padding: "48px 40px 0", overflow: "hidden" }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, color: "var(--sage-600)", textAlign: "center", maxWidth: 320, lineHeight: 1.45, marginBottom: 32 }}>
            &ldquo;The quiet act of tending to a plant is its own kind of mindfulness.&rdquo;
          </p>
          <div style={{ width: "80%", maxWidth: 340, position: "relative", aspectRatio: "1" }}>
            <Image src="/plants/Fiddle Leaf Fig.png" alt="Fiddle Leaf Fig" fill style={{ objectFit: "cover", objectPosition: "center" }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 40px" }}>
          <SignIn
            appearance={{
              variables: {
                colorPrimary: "#3D5A3E",
                colorBackground: "#FDFBF7",
                colorInputBackground: "#EDE8DC",
                colorInputText: "#1E2A1E",
                borderRadius: "12px",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
