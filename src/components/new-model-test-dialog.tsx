// External Dependencies
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

// Internal Dependencies
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApiKeys } from "@/hooks/use-api-keys";
interface NewModelTestDialogProps {
  testId: string;
  children: React.ReactNode;
}

const modelTestResponseSchema = z.object({
  id: z.string(),
});

type ModelTestResponse = z.infer<typeof modelTestResponseSchema>;

export function NewModelTestDialog({
  testId,
  children,
}: NewModelTestDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const queryClient = useQueryClient();
  const { data: apiKeys } = useApiKeys();

  const createModelTest = useMutation({
    mutationFn: async (model: string): Promise<ModelTestResponse> => {
      const response = await fetch(`/api/tests/${testId}/model-test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model }),
      });

      if (!response.ok) {
        throw new Error("Failed to create model test");
      }

      const data = (await response.json()) as z.infer<
        typeof modelTestResponseSchema
      >;
      return modelTestResponseSchema.parse(data);
    },
    onSuccess: () => {
      setIsOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["test-result", testId] });
      toast.success("New model test created successfully");
    },
    onError: () => {
      toast.error("Failed to create model test");
    },
  });

  const handleSubmit = () => {
    if (!selectedModel) {
      toast.error("Please select a model");
      return;
    }

    createModelTest.mutate(selectedModel);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Run Test with New Model</DialogTitle>
          <DialogDescription>
            Select a model to run this test with. This will create a new test
            run with the selected model.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>OpenAI</SelectLabel>
                <SelectItem
                  value="gpt-4.1-nano-2025-04-14"
                  disabled={!apiKeys?.keys.encryptedOpenAIKey}
                >
                  GPT-4.1-nano
                </SelectItem>
                <SelectItem
                  value="gpt-4o-mini-2024-07-18"
                  disabled={!apiKeys?.keys.encryptedOpenAIKey}
                >
                  GPT-4o-mini
                </SelectItem>
                <SelectItem
                  value="gpt-4o-2024-08-06"
                  disabled={!apiKeys?.keys.encryptedOpenAIKey}
                >
                  GPT-4o
                </SelectItem>
                <SelectItem
                  value="gpt-4.1-2025-04-14"
                  disabled={!apiKeys?.keys.encryptedOpenAIKey}
                >
                  GPT-4.1
                </SelectItem>
                <SelectItem
                  value="o3-2025-04-16"
                  disabled={!apiKeys?.keys.encryptedOpenAIKey}
                >
                  o3
                </SelectItem>
                <SelectItem value="o4-mini-2025-04-16">o4-mini</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Anthropic</SelectLabel>
                <SelectItem
                  value="claude-3-opus-latest"
                  disabled={!apiKeys?.keys.encryptedAnthropicKey}
                >
                  Claude 3 Opus
                </SelectItem>
                <SelectItem
                  value="claude-3-7-sonnet-latest"
                  disabled={!apiKeys?.keys.encryptedAnthropicKey}
                >
                  Claude 3.7 Sonnet
                </SelectItem>
                <SelectItem
                  value="claude-3-5-sonnet-latest"
                  disabled={!apiKeys?.keys.encryptedAnthropicKey}
                >
                  Claude 3.5 Sonnet
                </SelectItem>
                <SelectItem
                  value="claude-3-5-haiku-latest"
                  disabled={!apiKeys?.keys.encryptedAnthropicKey}
                >
                  Claude 3.5 Haiku
                </SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Google</SelectLabel>
                <SelectItem
                  value="gemini-1.5-pro-latest"
                  disabled={!apiKeys?.keys.encryptedGoogleKey}
                >
                  Gemini 1.5 Pro
                </SelectItem>
                <SelectItem
                  value="gemini-1.5-flash-latest"
                  disabled={!apiKeys?.keys.encryptedGoogleKey}
                >
                  Gemini 1.5 Flash
                </SelectItem>
                <SelectItem
                  value="gemini-2.0-flash-latest"
                  disabled={!apiKeys?.keys.encryptedGoogleKey}
                >
                  Gemini 2.0 Flash
                </SelectItem>
                <SelectItem
                  value="gemini-2.0-flash-lite-latest"
                  disabled={!apiKeys?.keys.encryptedGoogleKey}
                >
                  Gemini 2.0 Flash Lite
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createModelTest.isPending}
              className="cursor-pointer"
            >
              {createModelTest.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                "Run Test"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
