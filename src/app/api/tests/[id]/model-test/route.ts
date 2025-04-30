// External Dependencies
import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";

// Internal Dependencies
import { db } from "@/server/db";
import { modelTests, messages, responses, tests } from "@/server/db/schema";
import { requireAuth } from "@/lib/requireAuth";
import { generateAIResponse } from "@/lib/generateAIResponse";

const createModelTestSchema = z.object({
  model: z.string(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth();

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

    const responsePromises = createdMessages.map(async (message) => {
      const content = await generateAIResponse({
        model,
        message: message.content,
        systemPrompt: test.systemPrompt,
        userId: session.user.id,
        temperature: 0.7,
      });

      return db.insert(responses).values({
        messageId: message.id,
        model,
        content: content ?? "",
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
