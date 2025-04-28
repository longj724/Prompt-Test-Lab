// External Dependencies
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

const apiKeySchema = z.object({
  id: z.string(),
  userId: z.string(),
  createdAt: z.string(),
  encryptedOpenAIKey: z.string().nullable(),
  encryptedAnthropicKey: z.string().nullable(),
  encryptedGoogleKey: z.string().nullable(),
});

export type ApiKey = z.infer<typeof apiKeySchema>;

const apiKeysResponseSchema = z.object({
  key: apiKeySchema,
});

export type ApiKeysResponse = z.infer<typeof apiKeysResponseSchema>;

const apiKeyUpdateResponseSchema = z.object({
  success: z.boolean(),
  key: apiKeySchema,
});

export function useApiKeys() {
  return useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const response = await fetch("/api/keys");
      const data: unknown = await response.json();
      return apiKeysResponseSchema.parse(data);
    },
  });
}

export function useAddApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      provider,
      key,
    }: {
      provider: "openai" | "anthropic" | "google";
      key: string;
    }) => {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ provider, key }),
      });

      if (!response.ok) {
        throw new Error("Failed to add API key");
      }

      const data: unknown = await response.json();
      return apiKeyUpdateResponseSchema.parse(data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (provider: "openai" | "anthropic" | "google") => {
      const response = await fetch(`/api/keys/${provider}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete API key");
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });
}
