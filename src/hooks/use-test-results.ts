// External Dependencies
import { useQuery } from "@tanstack/react-query";
import { type Rating } from "@/server/db/schema";

interface Response {
  id: string;
  model: string;
  content: string;
  rating?: Rating;
  notes?: string;
  createdAt: string;
}

interface Message {
  id: string;
  content: string;
  responses: Response[];
  createdAt: string;
}

interface ModelTest {
  id: string;
  model: string;
  temperature: number;
  messages: Message[];
  createdAt: string;
}

interface TestResult {
  id: string;
  name: string;
  systemPrompt: string;
  modelTests: ModelTest[];
  createdAt: string;
}

export function useTestResult(id: string) {
  return useQuery({
    queryKey: ["test-result", id],
    queryFn: async () => {
      const response = await fetch(`/api/tests/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch test result");
      }
      return (await response.json()) as TestResult;
    },
  });
}
