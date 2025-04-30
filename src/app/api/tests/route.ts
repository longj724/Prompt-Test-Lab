// External Dependencies
import { NextResponse } from "next/server";
import { z } from "zod";

// Internal Dependencies
import { db } from "@/server/db";
import { messages, modelTests, responses, tests } from "@/server/db/schema";
import { messageSchema } from "@/lib/client-schemas";
import { requireAuth } from "@/lib/requireAuth";
import { generateAIResponse } from "@/lib/generateAIResponse";

const createTestSchema = z.object({
  messages: z.array(messageSchema),
  model: z.string(),
  name: z.string().min(1),
  systemPrompt: z.string().min(1),
  temperature: z.number().min(0).max(1),
});

export async function GET() {
  try {
    await requireAuth();

    const allTests = await db.query.tests.findMany({
      with: {
        modelTests: {
          with: {
            messages: true,
          },
        },
      },
      orderBy: (tests, { desc }) => [desc(tests.createdAt)],
    });

    const formattedTests = allTests.map((test) => ({
      id: test.id,
      name: test.name,
      systemPrompt: test.systemPrompt,
      createdAt: test.createdAt,
      messageCount: test.modelTests.reduce(
        (acc, mt) => acc + mt.messages.length,
        0,
      ),
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
    const session = await requireAuth();

    const body = (await request.json()) as z.infer<typeof createTestSchema>;

    const {
      messages: testMessages,
      model,
      name,
      systemPrompt,
      temperature,
    } = createTestSchema.parse(body);

    const [test] = await db
      .insert(tests)
      .values({
        name,
        systemPrompt,
      })
      .returning();

    if (!test) {
      return NextResponse.json(
        { error: "Failed to create test" },
        { status: 500 },
      );
    }

    const [modelTest] = await db
      .insert(modelTests)
      .values({
        testId: test.id,
        model,
        temperature: temperature.toString(),
      })
      .returning();

    if (!modelTest) {
      return NextResponse.json(
        { error: "Failed to create model test" },
        { status: 500 },
      );
    }

    const createdMessages = await db
      .insert(messages)
      .values(
        testMessages.map((msg) => ({
          modelTestId: modelTest.id,
          content: msg.content,
          included: msg.included,
        })),
      )
      .returning();

    const responsePromises = createdMessages.map(async (message) => {
      const text = await generateAIResponse({
        model,
        message: message.content,
        systemPrompt,
        userId: session.user.id,
        temperature,
      });

      return db.insert(responses).values({
        messageId: message.id,
        model,
        content: text ?? "",
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
