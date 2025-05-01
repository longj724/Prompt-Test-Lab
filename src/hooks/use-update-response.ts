import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type Rating } from "@/server/db/schema";

interface UpdateResponseData {
  responseId: string;
  rating?: Rating;
  notes?: string;
}

interface ResponseError {
  message: string;
}

interface UpdateResponseResponse {
  id: string;
  rating?: Rating;
  notes?: string;
}

export function useUpdateResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ responseId, rating, notes }: UpdateResponseData) => {
      const response = await fetch("/api/tests/responses", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          responseId,
          rating,
          notes,
        }),
      });

      if (!response.ok) {
        const error = (await response.json()) as ResponseError;
        throw new Error(error.message ?? "Failed to update response");
      }

      return response.json() as Promise<UpdateResponseResponse>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["test-result"] });
      toast.success("Response updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to update response");
    },
  });
}
