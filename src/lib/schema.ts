import { z } from "zod";

export const messageSchema = z.object({
  id: z.string(),
  content: z.string().min(1, "Message content is required"),
  createdAt: z.date(),
  included: z.boolean().default(true),
});

export type Message = z.infer<typeof messageSchema>;

export const generateMessagesSchema = z.object({
  count: z.number().min(1).max(10),
  systemPrompt: z.string().min(1, "System prompt is required").optional(),
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
