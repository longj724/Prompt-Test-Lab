// External Dependencies
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const testSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  systemPrompt: z.string(),
  createdAt: z.string(),
  messageCount: z.number(),
});

type Test = z.infer<typeof testSchema>;

export function useTests() {
  return useQuery<Test[]>({
    queryKey: ["tests"],
    queryFn: async () => {
      const response = await fetch("/api/tests");
      if (!response.ok) {
        throw new Error("Failed to fetch tests");
      }
      const data: unknown = await response.json();
      return z.array(testSchema).parse(data);
    },
  });
}
