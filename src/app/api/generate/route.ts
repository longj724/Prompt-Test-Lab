import OpenAI from "openai";
import {
  generateMessagesSchema,
  generateApiResponseSchema,
} from "@/lib/schema";
import { NextResponse } from "next/server";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { count, systemPrompt } = generateMessagesSchema.parse(body);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Generate ${count} different example user messages that might be asked given the system prompt above. Format the response as a JSON object with a 'messages' array where each message has a 'content' property. For example: {"messages": [{"content": "message 1"}, {"content": "message 2"}]}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    console.log("response is", response);

    const result = response.choices[0]?.message?.content ?? "";

    if (result === "") {
      throw new Error("Unable to generate messages");
    }

    try {
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
