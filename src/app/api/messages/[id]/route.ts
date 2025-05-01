// External Dependencies
import { eq } from "drizzle-orm";
import { z } from "zod";
import { NextResponse } from "next/server";

// Internal Dependencies
import { db } from "@/server/db";
import { messages } from "@/server/db/schema";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = z.string().parse(params.id);

    await db.delete(messages).where(eq(messages.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 },
    );
  }
}
