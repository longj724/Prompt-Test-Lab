// External Dependencies
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

// Internal Dependencies
import {
  type Message,
  type generateMessagesSchema,
} from "@/lib/client-schemas";

const errorResponseSchema = z.object({
  error: z.string().optional(),
});

type GenerateMessagesInput = z.infer<typeof generateMessagesSchema>;

async function generateMessages(
  input: GenerateMessagesInput,
): Promise<Message[]> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = errorResponseSchema.parse(await response.json());
    throw new Error(data.error ?? "Failed to generate messages");
  }

  return (await response.json()) as Promise<Message[]>;
}

export function useGenerateMessages() {
  return useMutation({
    mutationFn: generateMessages,
  });
}
