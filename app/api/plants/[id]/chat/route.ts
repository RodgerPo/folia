import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const client = new Anthropic();

type HistoryMessage = { role: "user" | "assistant"; content: string };

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return new Response("Unauthorized", { status: 401 });

  const plant = await prisma.plant.findFirst({
    where: { id, userId: user.id },
    include: { healthLogs: { orderBy: { createdAt: "desc" }, take: 20 } },
  });
  if (!plant) return new Response("Not found", { status: 404 });

  const body = await req.json();
  const message: string = body.message?.trim();
  const history: HistoryMessage[] = body.history ?? [];
  if (!message) return new Response("Message required", { status: 400 });

  const logContext = plant.healthLogs.length
    ? plant.healthLogs
        .map((l) => {
          const date = new Date(l.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          return `[${date}] ${l.note}${l.aiAnalysis ? ` (AI note: ${l.aiAnalysis})` : ""}`;
        })
        .join("\n")
    : "No observations logged yet.";

  const setupContext = [
    plant.location ? `Location: ${plant.location}` : null,
    plant.potSize ? `Pot size: ${plant.potSize}` : null,
  ].filter(Boolean).join(", ");

  const system = [
    `You are a plant care assistant for the Folia app. You ONLY answer questions about ${plant.name}${plant.scientificName ? ` (${plant.scientificName})` : ""} or plant care in general. If the user asks about anything unrelated to plants or gardening, respond only with: "I can only help with questions about your plants. What would you like to know about ${plant.name}?"`,
    `Care profile: watering every ${plant.wateringFrequencyDays} days, light: ${plant.light ?? "unknown"}, soil: ${plant.soil ?? "unknown"}, humidity: ${plant.humidity ?? "unknown"}${setupContext ? `, ${setupContext}` : ""}.`,
    `Health log history:\n${logContext}`,
    `Give concise, practical advice. Keep responses under 150 words unless the user asks for detail. Respond in plain prose — no markdown, no bullet points, no headers, no bold or italic text.`,
  ].join("\n\n");

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    system,
    messages: [
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: message },
    ],
  });

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let fullText = "";
      try {
        for await (const chunk of stream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            fullText += chunk.delta.text;
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        // Persist both sides of the exchange after streaming completes
        await prisma.chatMessage.createMany({
          data: [
            { plantId: id, role: "user", content: message },
            { plantId: id, role: "assistant", content: fullText },
          ],
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
