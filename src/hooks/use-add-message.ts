// External Dependencies
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Internal Dependencies
import { type Message } from "@/lib/client-schemas";

interface AddMessageVariables {
  modelTestId: string;
  content: string;
  testId: string;
}

export function useAddMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ modelTestId, content }: AddMessageVariables) => {
      const response = await fetch(`/api/model-test/${modelTestId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to add message");
      }

      return (await response.json()) as Promise<Message>;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["test-result", variables.testId],
      });
    },
  });
}
