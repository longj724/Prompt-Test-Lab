// External Dependencies
import { z } from "zod";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Internal Dependencies
import { requireAuth } from "@/lib/require-auth";
import { db } from "@/server/db";
import { apiKeys } from "@/server/db/schema";

const deleteKeySchema = z.object({
  provider: z.enum(["google", "anthropic", "openai"]),
});

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const session = await requireAuth();

  const { provider } = await params;

  switch (provider) {
    case "google":
      await db
        .update(apiKeys)
        .set({ encryptedGoogleKey: null })
        .where(eq(apiKeys.userId, session.user.id));
      break;
    case "anthropic":
      await db
        .update(apiKeys)
        .set({ encryptedAnthropicKey: null })
        .where(eq(apiKeys.userId, session.user.id));
      break;
    case "openai":
      await db
        .update(apiKeys)
        .set({ encryptedOpenAIKey: null })
        .where(eq(apiKeys.userId, session.user.id));
      break;
    default:
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
