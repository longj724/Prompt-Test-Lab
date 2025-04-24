import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { messages, responses, tests } from "@/db/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { messageSchema } from "@/lib/client-schemas";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const createTestSchema = z.object({
  name: z.string().min(1),
  systemPrompt: z.string().min(1),
  model: z.enum(["gpt-4", "gpt-3.5-turbo", "claude-3"]),
  messages: z.array(messageSchema),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      systemPrompt,
      model,
      messages: testMessages,
    } = createTestSchema.parse(body);

    // Create test
    const [test] = await db
      .insert(tests)
      .values({
        name,
        systemPrompt,
        model,
      })
      .returning();

    // Create messages
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

    // Generate responses based on the model
    const responsePromises = createdMessages.map(async (message) => {
      let response: string;

      if (model === "claude-3") {
        const result = await anthropic.messages.create({
          model: "claude-3-opus-20240229",
          system: systemPrompt,
          messages: [{ role: "user", content: message.content }],
        });
        response = result.content[0].text;
      } else {
        const result = await openai.chat.completions.create({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message.content },
          ],
        });
        response = result.choices[0]?.message?.content ?? "";
      }

      return db.insert(responses).values({
        messageId: message.id,
        model,
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
