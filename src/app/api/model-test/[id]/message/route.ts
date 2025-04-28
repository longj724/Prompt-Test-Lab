// External Dependencies
import { z } from "zod";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { type LanguageModelV1 } from "@ai-sdk/provider";
import { google } from "@ai-sdk/google";

// Internal Dependencies
import { modelToProviderMap } from "@/lib/utils";
import { db } from "@/server/db";
import { modelTests, messages, responses } from "@/server/db/schema";
import { requireAuth } from "@/lib/requireAuth";

const messageSchema = z.object({
  content: z.string().min(1),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();

    const { id } = await params;
    const body = (await request.json()) as z.infer<typeof messageSchema>;
    const { content } = messageSchema.parse(body);

    const modelTest = await db.query.modelTests.findFirst({
      where: eq(modelTests.id, id),
      with: {
        test: true,
      },
    });

    if (!modelTest) {
      return NextResponse.json(
        { error: "Model test not found" },
        { status: 404 },
      );
    }

    const [message] = await db
      .insert(messages)
      .values({
        content,
        modelTestId: modelTest.id,
      })
      .returning();

    if (!message) {
      return NextResponse.json(
        { error: "Failed to create message" },
        { status: 500 },
      );
    }

    const provider =
      modelToProviderMap[modelTest.model as keyof typeof modelToProviderMap];

    let modelProvider: LanguageModelV1;
    switch (provider) {
      case "openai":
        modelProvider = openai(modelTest.model);
        break;
      case "anthropic":
        modelProvider = anthropic(modelTest.model);
        break;
      case "google":
        modelProvider = google(modelTest.model);
        break;
    }

    const { text } = await generateText({
      model: modelProvider,
      prompt: message.content,
      system: modelTest.test.systemPrompt,
    });

    db.insert(responses).values({
      messageId: message.id,
      model: modelTest.model,
      content: text,
    });

    return NextResponse.json({ message, response: text });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
