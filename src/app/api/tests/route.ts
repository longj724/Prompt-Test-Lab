// External Dependencies
import { NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

// Internal Dependencies
import { db } from "@/server/db";
import { messages, responses, tests } from "@/server/db/schema";
import { messageSchema } from "@/lib/client-schemas";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const modelToProviderMap = {
  "gpt-4o-mini-2024-07-18": "openai",
  "gpt-4.1-nano-2025-04-14": "openai",
  "gpt-4o-2024-08-06": "openai",
  "o4-mini-2025-04-16": "openai",
  "gpt-4.1-2025-04-14": "openai",
  "o3-2025-04-16": "openai",
  "claude-3-7-sonnet-latest": "anthropic",
  "claude-3-5-sonnet-latest": "anthropic",
  "claude-3-5-haiku-latest": "anthropic",
  "claude-3-opus-latest": "anthropic",
};

const createTestSchema = z.object({
  name: z.string().min(1),
  systemPrompt: z.string().min(1),
  model: z.string(),
  messages: z.array(messageSchema),
});

export async function GET() {
  try {
    const allTests = await db.query.tests.findMany({
      with: {
        messages: true,
      },
      orderBy: (tests, { desc }) => [desc(tests.createdAt)],
    });

    const formattedTests = allTests.map((test) => ({
      id: test.id,
      name: test.name,
      systemPrompt: test.systemPrompt,
      createdAt: test.createdAt,
      messageCount: test.messages.length,
    }));

    return NextResponse.json(formattedTests);
  } catch (error) {
    console.error("Error fetching tests:", error);
    return NextResponse.json(
      { error: "Failed to fetch tests" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as z.infer<typeof createTestSchema>;

    const {
      name,
      systemPrompt,
      model,
      messages: testMessages,
    } = createTestSchema.parse(body);

    const [test] = await db
      .insert(tests)
      .values({
        name,
        systemPrompt,
        model,
      })
      .returning();

    if (!test) {
      return NextResponse.json(
        { error: "Failed to create test" },
        { status: 500 },
      );
    }

    const createdMessages = await db
      .insert(messages)
      .values(
        testMessages.map((msg) => ({
          testId: test.id,
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
            { role: "system", content: systemPrompt },
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
          system: systemPrompt,
        });

        return db.insert(responses).values({
          messageId: message.id,
          model,
          content: text,
        });
      });

      await Promise.all(responsePromises);
    }
    return NextResponse.json({ id: test.id });
  } catch (error) {
    console.error("Error creating test:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request format", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create test" },
      { status: 500 },
    );
  }
}
