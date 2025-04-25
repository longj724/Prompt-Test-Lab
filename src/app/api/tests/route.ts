import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/server/db";
import { messages, responses, tests } from "@/server/db/schema";
import OpenAI from "openai";
import { messageSchema } from "@/lib/client-schemas";
import { type Model } from "@/server/db/schema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const createTestSchema = z.object({
  name: z.string().min(1),
  systemPrompt: z.string().min(1),
  model: z.enum(["gpt-4o-mini", "gpt-4.1-nano"]),
  messages: z.array(messageSchema),
});

const modelDisplayNameToApiName: Record<string, Model> = {
  "gpt-4o-mini": "gpt-4o-mini-2024-07-18",
  "gpt-4.1-nano": "gpt-4.1-nano-2025-04-14",
};

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
        model: modelDisplayNameToApiName[model] as string,
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

    const responsePromises = createdMessages.map(async (message) => {
      const result = await openai.chat.completions.create({
        model: modelDisplayNameToApiName[model] as string,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message.content },
        ],
      });
      const response = result.choices[0]?.message?.content ?? "";

      console.log("response is", response);

      return db.insert(responses).values({
        messageId: message.id,
        model: modelDisplayNameToApiName[model]!,
        content: response,
      });
    });

    await Promise.all(responsePromises);

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
