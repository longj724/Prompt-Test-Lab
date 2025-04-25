import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { tests } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const test = await db.query.tests.findFirst({
      where: eq(tests.id, params.id),
      with: {
        messages: {
          with: {
            responses: true,
          },
        },
      },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    // Transform the data to match our TestResult type
    const result = {
      id: test.id,
      name: test.name,
      systemPrompt: test.systemPrompt,
      model: test.model,
      messages: test.messages.map((message) => ({
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        included: message.included,
        results: message.responses.map((response) => ({
          model: response.model,
          response: response.content,
          timestamp: response.createdAt,
          rating: response.rating,
          notes: response.notes,
        })),
      })),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching test:", error);
    return NextResponse.json(
      { error: "Failed to fetch test" },
      { status: 500 },
    );
  }
}
