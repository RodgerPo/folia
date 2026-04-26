import { headers } from "next/headers";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

type ClerkUserCreatedEvent = {
  type: string;
  data: {
    id: string;
    primary_email_address_id: string;
    email_addresses: { id: string; email_address: string }[];
  };
};

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let event: ClerkUserCreatedEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserCreatedEvent;
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  if (event.type === "user.created") {
    const { id: clerkId, primary_email_address_id, email_addresses } = event.data;
    const email = email_addresses.find((e) => e.id === primary_email_address_id)?.email_address;

    if (!email) {
      return new Response("No primary email found", { status: 400 });
    }

    await prisma.user.upsert({
      where: { clerkId },
      update: {},
      create: { clerkId, email },
    });
  }

  return new Response("OK", { status: 200 });
}
