import { auth } from "@clerk/nextjs/server";
import { searchPlants } from "@/lib/perenual";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return Response.json([]);
  }

  try {
    const results = await searchPlants(query);
    return Response.json(results);
  } catch (err) {
    console.error("Plant search error:", err);
    return new Response("Search failed", { status: 500 });
  }
}
