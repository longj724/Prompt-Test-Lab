// External Dependencies
import { NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { anthropic } from "@ai-sdk/anthropic";
import { eq } from "drizzle-orm";
import { generateText } from "ai";

// Internal Dependencies
import { db } from "@/server/db";
import { modelTests, messages, responses, tests } from "@/server/db/schema";
import { modelToProviderMap } from "@/lib/utils";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const createModelTestSchema = z.object({
  model: z.string(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
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

    if (provider === "openai") {
      const responsePromises = createdMessages.map(async (message) => {
        const result = await openai.chat.completions.create({
          model: model,
          messages: [
            { role: "system", content: test.systemPrompt },
            { role: "user", content: message.content },
          ],
        });
        const response = result.choices[0]?.message?.content ?? "";

        return db.insert(responses).values({
          messageId: message.id,
          model,
          content: response,
        });
      });

      await Promise.all(responsePromises);
    } else if (provider === "anthropic") {
      const responsePromises = createdMessages.map(async (message) => {
        const { text } = await generateText({
          model: anthropic(model),
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
    }

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
