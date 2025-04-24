import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateResponseData {
  responseId: string;
  rating?: number;
  notes?: string;
}

interface ResponseData {
  id: string;
  rating?: number;
  notes?: string;
}

export function useUpdateResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateResponseData) => {
      const response = await fetch("/api/tests/responses", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update response");
      }

      const responseData: unknown = await response.json();
      return responseData as ResponseData;
    },
    onSuccess: (_, variables) => {
      // Invalidate the test result query to refetch the updated data
      void queryClient.invalidateQueries({
        queryKey: ["test-result"],
      });
    },
  });
}
