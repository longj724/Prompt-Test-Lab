"use client";

import { Copy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreatePrompt } from "@/hooks/use-create-prompt";
import { Card, CardContent } from "@/components/ui/card";

export default function NewTestPage() {
  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
    handleCancel,
    resetForm,
  } = useCreatePrompt();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formData.systemPrompt);
      // TODO: Show success toast
    } catch (error) {
      // TODO: Show error toast
      console.error("Failed to copy to clipboard:", error);
    }
  };

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Create System Prompt
        </h1>
        <p className="text-muted-foreground mt-2">
          Design a system prompt that will be used to test AI model responses.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Prompt Name
              </label>
              <Input
                id="name"
                placeholder="e.g. Legal Document Summarizer"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
              {errors.name && (
                <p className="text-destructive text-sm">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="systemPrompt" className="text-sm font-medium">
                System Prompt
              </label>
              <div className="relative">
                <Textarea
                  id="systemPrompt"
                  placeholder="e.g. You are a helpful assistant that summarizes legal documents..."
                  className="min-h-[200px] resize-y pr-12"
                  value={formData.systemPrompt}
                  onChange={(e) => updateField("systemPrompt", e.target.value)}
                />
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleCopy}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateField("systemPrompt", "")}
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span className="sr-only">Reset</span>
                  </Button>
                </div>
              </div>
              {errors.systemPrompt && (
                <p className="text-destructive text-sm">
                  {errors.systemPrompt}
                </p>
              )}
              <p className="text-muted-foreground text-xs">
                0 tokens (estimated)
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="model" className="text-sm font-medium">
                Default Test Model
              </label>
              <Select
                value={formData.model}
                onValueChange={(value) => updateField("model", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">OpenAI GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">
                    OpenAI GPT-3.5 Turbo
                  </SelectItem>
                  <SelectItem value="claude-3">Anthropic Claude 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-end gap-4">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="hover:cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          onClick={() => handleSubmit("save")}
          disabled={isSubmitting}
          className="hover:cursor-pointer"
        >
          Save
        </Button>
        <Button
          variant="default"
          className="bg-green-600 hover:cursor-pointer hover:bg-green-700"
          onClick={() => handleSubmit("continue")}
          disabled={isSubmitting}
        >
          Continue to Message Generation
        </Button>
      </div>
    </div>
  );
}
