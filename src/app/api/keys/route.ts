// External Dependencies
import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";

// Internal Dependencies
import { db } from "@/server/db";
import { apiKeys } from "@/server/db/schema";
import { encrypt } from "@/lib/encryption";
import { requireAuth } from "@/lib/require-auth";

const saveKeySchema = z.object({
  provider: z.enum(["google", "anthropic", "openai"]),
  key: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await requireAuth();

  const { provider, key } = (await req.json()) as z.infer<typeof saveKeySchema>;
  const encryptedKey = encrypt(key);

  switch (provider) {
    case "google":
      await db
        .insert(apiKeys)
        .values({
          userId: session.user.id,
          encryptedGoogleKey: encryptedKey,
        })
        .onConflictDoUpdate({
          target: [apiKeys.userId],
          set: {
            encryptedGoogleKey: encryptedKey,
          },
        });
      break;
    case "anthropic":
      await db
        .insert(apiKeys)
        .values({
          userId: session.user.id,
          encryptedAnthropicKey: encryptedKey,
        })
        .onConflictDoUpdate({
          target: [apiKeys.userId],
          set: {
            encryptedAnthropicKey: encryptedKey,
          },
        });
      break;
    case "openai":
      await db
        .insert(apiKeys)
        .values({
          userId: session.user.id,
          encryptedOpenAIKey: encryptedKey,
        })
        .onConflictDoUpdate({
          target: [apiKeys.userId],
          set: {
            encryptedOpenAIKey: encryptedKey,
          },
        });
      break;
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await requireAuth();

  const keys = await db.query.apiKeys.findFirst({
    where: eq(apiKeys.userId, session.user.id),
  });

  return NextResponse.json({ keys });
}
