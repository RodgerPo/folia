import type { HealthLog } from "@prisma/client";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export default function HealthLogList({ logs }: { logs: HealthLog[] }) {
  if (!logs.length) {
    return (
      <p style={{ fontSize: 14, color: "var(--ink-500)" }}>
        No observations yet. Log your first one above.
      </p>
    );
  }

  return (
    <div>
      {logs.map((log) => (
        <div key={log.id} style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 20, padding: "20px 0", borderBottom: "1px solid var(--divider)" }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-500)", paddingTop: 1 }}>{formatDate(log.createdAt)}</div>
          <div>
            <p style={{ fontSize: 14, color: "var(--ink-700)", lineHeight: 1.7, marginBottom: log.aiAnalysis ? 14 : 0 }}>{log.note}</p>
            {log.aiAnalysis && (
              <div style={{ background: "var(--sage-100)", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" as const, color: "var(--sage-600)", marginBottom: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.88 5.76L20 10l-6.12 1.24L12 17l-1.88-5.76L4 10l6.12-1.24z"/></svg>
                  AI analysis
                </div>
                <p style={{ fontSize: 13, color: "var(--sage-600)", lineHeight: 1.65 }}>{log.aiAnalysis}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
