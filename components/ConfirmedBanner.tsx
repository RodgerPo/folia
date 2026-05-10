"use client";

import { useEffect, useState } from "react";

export default function ConfirmedBanner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
      background: "var(--sage-500)", color: "var(--cream-50)",
      padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 500,
      boxShadow: "var(--shadow-raised)", zIndex: 200, whiteSpace: "nowrap",
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      Plant marked as watered
    </div>
  );
}
