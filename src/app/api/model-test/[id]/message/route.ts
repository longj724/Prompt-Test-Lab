// External Dependencies
import { z } from "zod";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import OpenAI from "openai";
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

// Internal Dependencies
import { modelToProviderMap } from "@/lib/utils";
import { db } from "@/server/db";
import { modelTests, messages, responses } from "@/server/db/schema";

const messageSchema = z.object({
  content: z.string().min(1),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
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
        modelTestId: params.id,
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

    let response = "";
    if (provider === "openai") {
      const result = await openai.chat.completions.create({
        model: modelTest.model,
        messages: [
          { role: "system", content: modelTest.test.systemPrompt },
          { role: "user", content: message.content },
        ],
      });
      response = result.choices[0]?.message?.content ?? "";

      await db.insert(responses).values({
        messageId: message.id,
        model: modelTest.model,
        content: response,
      });
    } else if (provider === "anthropic") {
      const { text } = await generateText({
        model: anthropic(modelTest.model),
        prompt: message.content,
        system: modelTest.test.systemPrompt,
      });

      response = text;

      await db.insert(responses).values({
        messageId: message.id,
        model: modelTest.model,
        content: text,
      });
    }

    return NextResponse.json({ message, response });
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
