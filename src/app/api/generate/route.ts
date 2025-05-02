// External Dependencies
import { NextResponse } from "next/server";
import { z } from "zod";

// Internal Dependencies
import {
  generateMessagesSchema,
  generateApiResponseSchema,
} from "@/lib/client-schemas";
import { requireAuth } from "@/lib/require-auth";
import { generateAIResponse } from "@/lib/generate-ai-response";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();

    const body = (await request.json()) as z.infer<
      typeof generateMessagesSchema
    >;
    const { count, systemPrompt } = generateMessagesSchema.parse(body);

    const result = await generateAIResponse({
      model: body?.model ?? "gpt-4o-mini-2024-07-18",
      message: `Generate ${count} different example user messages that might be asked given the system prompt above. Format the response as a JSON object with a 'messages' array where each message has a 'content' property. For example: {"messages": [{"content": "message 1"}, {"content": "message 2"}]}`,
      systemPrompt,
      userId: session.user.id,
      temperature: 0.7,
      responseFormat: { type: "json_object" },
    });

    if (result === "") {
      throw new Error("Unable to generate messages");
    }

    try {
      if (!result) {
        throw new Error("Unable to generate messages");
      }

      const parsedResult = generateApiResponseSchema.parse(JSON.parse(result));

      const messages = parsedResult.messages.map((message) => ({
        id: crypto.randomUUID(),
        content: message.content,
        createdAt: new Date(),
        included: true,
      }));

      return NextResponse.json(messages);
    } catch (error) {
      console.error("Error parsing OpenAI response:", result);
      throw new Error("Invalid response format from OpenAI");
    }
  } catch (error) {
    console.error("Error generating messages:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request format", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate messages",
      },
      { status: 500 },
    );
  }
}
