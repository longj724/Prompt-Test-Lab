import { z } from "zod";

export const messageSchema = z.object({
  id: z.string(),
  content: z.string().min(1, "Message content is required"),
  included: z.boolean().default(true),
});

export type Message = z.infer<typeof messageSchema>;

export const generateMessagesSchema = z.object({
  count: z.number().min(1).max(10),
  systemPrompt: z.string().min(1, "System prompt is required"),
});

export const generateApiResponseSchema = z.object({
  messages: z.array(
    z.object({
      content: z.string(),
    }),
  ),
});

export type GenerateApiResponse = z.infer<typeof generateApiResponseSchema>;

export const errorResponseSchema = z.object({
  error: z.string().optional(),
});

export const testResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  systemPrompt: z.string(),
  model: z.string(),
  messages: z.array(
    z.object({
      id: z.string(),
      content: z.string(),
      createdAt: z.coerce.date(),
      included: z.boolean(),
      results: z
        .array(
          z.object({
            id: z.string(),
            model: z.string(),
            response: z.string(),
            timestamp: z.coerce.date(),
            notes: z.string().optional(),
          }),
        )
        .optional(),
    }),
  ),
});

export type TestResult = z.infer<typeof testResultSchema>;

export const modelApiNameToDisplayName: Record<string, string> = {
  "gpt-4o-mini-2024-07-18": "GPT-4o-mini",
  "gpt-4.1-nano-2025-04-14": "GPT-4.1-nano",
};
