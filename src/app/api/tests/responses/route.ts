// External Dependencies
import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";

// Internal Dependencies
import { requireAuth } from "@/lib/requireAuth";
import { db } from "@/server/db";
import { responses } from "@/server/db/schema";

const updateResponseSchema = z.object({
  responseId: z.string(),
  rating: z.number().min(1).max(5).optional(),
  notes: z.string().optional(),
});

export async function PATCH(request: Request) {
  try {
    await requireAuth();

    const body = (await request.json()) as z.infer<typeof updateResponseSchema>;
    const { responseId, rating, notes } = updateResponseSchema.parse(body);

    const [updatedResponse] = await db
      .update(responses)
      .set({
        ...(rating !== undefined && { rating }),
        ...(notes !== undefined && { notes }),
      })
      .where(eq(responses.id, responseId))
      .returning();

    if (!updatedResponse) {
      return NextResponse.json(
        { error: "Response not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedResponse);
  } catch (error) {
    console.error("Error updating response:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request format", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update response" },
      { status: 500 },
    );
  }
}
