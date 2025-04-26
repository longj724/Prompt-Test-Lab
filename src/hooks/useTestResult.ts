// External Dependencies
import { useQuery } from "@tanstack/react-query";
import { type z } from "zod";

// Internal Dependencies
import { type TestResult, type testResultSchema } from "@/lib/client-schemas";

export function useTestResult(testId: string) {
  return useQuery<TestResult>({
    queryKey: ["test-result", testId],
    queryFn: async () => {
      const response = await fetch(`/api/tests/${testId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch test result");
      }

      const data = (await response.json()) as z.infer<typeof testResultSchema>;
      return data;
    },
  });
}
