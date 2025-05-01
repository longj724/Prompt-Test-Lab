// External Dependencies
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DeleteMessageResponse {
  success: boolean;
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete message");
      }

      return (await response.json()) as DeleteMessageResponse;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["test-result"] });
    },
  });
}
