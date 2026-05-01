import Anthropic from "@anthropic-ai/sdk";
import type { Plant } from "@prisma/client";

const client = new Anthropic();

export async function analyzeHealthLog(plant: Plant, note: string): Promise<string> {
  const system = `You are a plant care expert. The user is logging an observation about their ${plant.name}${plant.scientificName ? ` (${plant.scientificName})` : ""}. Their care profile says: watering every ${plant.wateringFrequencyDays} days, ${plant.light ?? "unknown light"}, ${plant.soil ?? "unknown soil"}, ${plant.humidity ?? "unknown humidity"}. Analyze their observation, flag anything concerning, and suggest one specific action. Keep your response under 100 words. Respond in plain prose only — no markdown, no headers, no bullet points, no bold or italic text.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 256,
    system,
    messages: [{ role: "user", content: note }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type from Claude");
  return content.text;
}

export async function generateCareSupplement(
  name: string,
  scientificName: string | null
): Promise<{ careSummary: string; soil: string; humidity: string }> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 200,
    messages: [
      {
        role: "user",
        content: `For a ${name}${scientificName ? ` (${scientificName})` : ""}, respond with only this JSON and nothing else:
{"careSummary": "one sentence care tip, max 30 words", "soil": "3-5 word soil description", "humidity": "Low, Medium, or High"}`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type from Claude");

  try {
    const raw = content.text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    const parsed = JSON.parse(raw);
    return {
      careSummary: parsed.careSummary ?? "",
      soil: parsed.soil ?? "",
      humidity: parsed.humidity ?? "",
    };
  } catch {
    return { careSummary: "", soil: "", humidity: "" };
  }
}
