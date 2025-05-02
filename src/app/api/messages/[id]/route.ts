// External Dependencies
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Internal Dependencies
import { db } from "@/server/db";
import { messages } from "@/server/db/schema";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await db.delete(messages).where(eq(messages.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 },
    );
  }
}
