"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Why are the leaves yellowing?",
  "When should I repot?",
  "How do I propagate it?",
];

export default function ChatPanel({ plantId, plantName, initialHistory = [] }: { plantId: string; plantName: string; initialHistory?: Message[] }) {
  const [history, setHistory] = useState<Message[]>(initialHistory);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  async function send(overrideMessage?: string) {
    const message = (overrideMessage ?? input).trim();
    if (!message || streaming) return;

    const userMsg: Message = { role: "user", content: message };
    const nextHistory = [...history, userMsg];

    setHistory([...nextHistory, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch(`/api/plants/${plantId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      setHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: data.text };
        return updated;
      });
    } catch {
      setHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: "Something went wrong. Please try again." };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>

      {/* Suggestion chips — only shown before first message */}
      {history.length === 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {SUGGESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              style={{
                fontSize: 12, color: "var(--ink-700)",
                background: "var(--cream-200)", border: "1px solid var(--border)",
                borderRadius: 999, padding: "6px 14px", cursor: "pointer",
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Message history */}
      {history.length > 0 && (
        <div style={{
          display: "flex", flexDirection: "column", gap: 12,
          maxHeight: 420, overflowY: "auto",
          marginBottom: 16, padding: "2px 0",
        }}>
          {history.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "80%",
                padding: "10px 14px",
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: msg.role === "user" ? "var(--accent)" : "var(--sage-100)",
                color: msg.role === "user" ? "var(--cream-50)" : "var(--sage-600)",
                fontSize: 14, lineHeight: 1.65,
              }}>
                {msg.content
                  ? msg.content
                  : streaming && i === history.length - 1
                    ? <span style={{ opacity: 0.4 }}>▋</span>
                    : null}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input row */}
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask anything about your ${plantName}…`}
          rows={2}
          disabled={streaming}
          style={{
            flex: 1, borderRadius: 12, border: "1px solid var(--border)",
            background: "var(--surface-subtle)", padding: "10px 14px",
            fontSize: 14, color: "var(--ink-900)", resize: "none",
            outline: "none", fontFamily: "inherit", lineHeight: 1.5,
            opacity: streaming ? 0.6 : 1, boxSizing: "border-box",
          }}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || streaming}
          style={{
            flexShrink: 0, width: 42, height: 42,
            background: "var(--accent)", color: "var(--cream-50)",
            border: "none", borderRadius: 12,
            cursor: !input.trim() || streaming ? "not-allowed" : "pointer",
            opacity: !input.trim() || streaming ? 0.4 : 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "opacity 150ms",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
      <p style={{ fontSize: 11, color: "var(--ink-300)", marginTop: 8, margin: "8px 0 0" }}>
        Enter to send · Shift+Enter for new line · History resets on page refresh
      </p>
    </div>
  );
}
