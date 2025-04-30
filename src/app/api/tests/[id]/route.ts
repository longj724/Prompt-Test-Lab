// External Dependencies
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Internal Dependencies
import { db } from "@/server/db";
import { tests } from "@/server/db/schema";
import { requireAuth } from "@/lib/requireAuth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();

    const { id } = await params;

    const test = await db.query.tests.findFirst({
      where: eq(tests.id, id),
      with: {
        modelTests: {
          with: {
            messages: {
              with: {
                responses: true,
              },
            },
          },
        },
      },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    const result = {
      id: test.id,
      name: test.name,
      systemPrompt: test.systemPrompt,
      modelTests: test.modelTests.map((modelTest) => ({
        id: modelTest.id,
        model: modelTest.model,
        messages: modelTest.messages.map((message) => ({
          id: message.id,
          content: message.content,
          createdAt: message.createdAt,
          included: message.included,
          responses: message.responses.map((response) => ({
            id: response.id,
            model: response.model,
            content: response.content,
            timestamp: response.createdAt,
            notes: response.notes,
          })),
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();

    const { id } = await params;

    await db.delete(tests).where(eq(tests.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting test:", error);
    return NextResponse.json(
      { error: "Failed to delete test" },
      { status: 500 },
    );
  }
}
