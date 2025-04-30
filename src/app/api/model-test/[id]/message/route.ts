// External Dependencies
import { z } from "zod";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

// Internal Dependencies
import { db } from "@/server/db";
import { modelTests, messages, responses } from "@/server/db/schema";
import { requireAuth } from "@/lib/requireAuth";
import { generateAIResponse } from "@/lib/generateAIResponse";

const messageSchema = z.object({
  content: z.string().min(1),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth();

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

    const text = await generateAIResponse({
      model: modelTest.model,
      message: message.content,
      systemPrompt: modelTest.test.systemPrompt,
      userId: session.user.id,
      temperature: 0.7,
    });

    await db.insert(responses).values({
      messageId: message.id,
      model: modelTest.model,
      content: text ?? "",
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
