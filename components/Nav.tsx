import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function Nav({ active }: { active?: "plants" | "discover" }) {
  const { userId } = await auth();
  const initials = ""; // UserButton handles the avatar — we use it directly

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(245,240,232,.94)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)", height: 64,
      display: "flex", alignItems: "center",
    }}>
      <div className="nav-row">
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <Link href="/dashboard" style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, color: "var(--accent)", textDecoration: "none" }}>
            Folia
          </Link>
          <div style={{ display: "flex", gap: 6 }}>
            <Link
              href="/dashboard"
              style={{
                fontSize: 14, fontWeight: 500, textDecoration: "none",
                padding: "7px 13px", borderRadius: 12,
                background: active === "plants" ? "var(--accent-light)" : "transparent",
                color: active === "plants" ? "var(--accent)" : "var(--ink-500)",
              }}
            >
              My Plants
            </Link>
            <Link
              href="/discover"
              style={{
                fontSize: 14, fontWeight: 500, textDecoration: "none",
                padding: "7px 13px", borderRadius: 12,
                background: active === "discover" ? "var(--accent-light)" : "transparent",
                color: active === "discover" ? "var(--accent)" : "var(--ink-500)",
              }}
            >
              Discover
            </Link>
          </div>
        </div>
        <UserButton
          appearance={{
            elements: {
              avatarBox: { width: 34, height: 34 },
              userButtonAvatarBox: { width: 34, height: 34 },
            },
          }}
        />
      </div>
    </nav>
  );
}
