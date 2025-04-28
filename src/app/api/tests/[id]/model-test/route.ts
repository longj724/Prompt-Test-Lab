// External Dependencies
import { NextResponse } from "next/server";
import { z } from "zod";
import { anthropic } from "@ai-sdk/anthropic";
import { eq } from "drizzle-orm";
import { generateText } from "ai";
import { type LanguageModelV1 } from "@ai-sdk/provider";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";

// Internal Dependencies
import { db } from "@/server/db";
import { modelTests, messages, responses, tests } from "@/server/db/schema";
import { modelToProviderMap } from "@/lib/utils";
import { requireAuth } from "@/lib/requireAuth";

const createModelTestSchema = z.object({
  model: z.string(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();

    const { id } = await params;
    const body = (await request.json()) as unknown;

    const { model } = createModelTestSchema.parse(body);

    const test = await db.query.tests.findFirst({
      where: eq(tests.id, id),
      with: {
        modelTests: {
          with: {
            messages: true,
          },
        },
      },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    const [modelTest] = await db
      .insert(modelTests)
      .values({
        testId: test.id,
        model,
      })
      .returning();

    if (!modelTest) {
      return NextResponse.json(
        { error: "Failed to create model test" },
        { status: 500 },
      );
    }

    const sourceMessages = test.modelTests[0]?.messages ?? [];

    const createdMessages = await db
      .insert(messages)
      .values(
        sourceMessages.map((msg) => ({
          modelTestId: modelTest.id,
          content: msg.content,
          included: msg.included,
        })),
      )
      .returning();

    const provider =
      modelToProviderMap[model as keyof typeof modelToProviderMap];

    let modelProvider: LanguageModelV1;
    switch (provider) {
      case "openai":
        modelProvider = openai(model);
        break;
      case "anthropic":
        modelProvider = anthropic(model);
        break;
      case "google":
        modelProvider = google(model);
        break;
    }

    const responsePromises = createdMessages.map(async (message) => {
      const { text } = await generateText({
        model: modelProvider,
        prompt: message.content,
        system: test.systemPrompt,
      });

      return db.insert(responses).values({
        messageId: message.id,
        model,
        content: text,
      });
    });

    await Promise.all(responsePromises);

    return NextResponse.json({ id: modelTest.id });
  } catch (error) {
    console.error("Error creating model test:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request format", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create model test" },
      { status: 500 },
    );
  }
}
