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
  model: z.string().optional(),
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
  modelTests: z.array(
    z.object({
      id: z.string(),
      model: z.string(),
      createdAt: z.string(),
      temperature: z.string().min(0).max(1),
      messages: z.array(
        z.object({
          id: z.string(),
          content: z.string(),
          createdAt: z.string(),
          included: z.boolean(),
          responses: z.array(
            z.object({
              id: z.string(),
              model: z.string(),
              content: z.string(),
              timestamp: z.coerce.date(),
              notes: z.string().optional(),
            }),
          ),
        }),
      ),
    }),
  ),
});

export type TestResult = z.infer<typeof testResultSchema>;

export const modelDisplayNames = [
  "GPT-4o mini",
  "GPT-4.1 nano",
  "GPT-4o",
  "o4-mini",
  "GPT-4.1",
  "o3",
  "Claude 3.7 Sonnet",
  "Claude 3.5 Sonnet",
  "Claude 3.5 Haiku",
  "Claude 3 Opus",
];

export const modelApiNames = [
  "gpt-4o-mini-2024-07-18",
  "gpt-4.1-nano-2025-04-14",
  "gpt-4o-2024-08-06",
  "o4-mini-2025-04-16",
  "gpt-4.1-2025-04-14",
  "o3-2025-04-16",
  "claude-3-7-sonnet-latest",
  "claude-3-5-sonnet-latest",
  "claude-3-5-haiku-latest",
  "claude-3-opus-latest",
];
