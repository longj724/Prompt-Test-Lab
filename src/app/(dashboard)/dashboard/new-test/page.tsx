"use client";

// External Dependencies
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2, X, Check, Plus, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

// Internal Dependencies
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type Message, generateMessagesSchema } from "@/lib/client-schemas";
import { useGenerateMessages } from "@/hooks/use-generate-messages";
import { Textarea } from "@/components/ui/textarea";
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

const promptSchema = z.object({
  name: z.string().min(1, "Name is required"),
  systemPrompt: z.string().min(1, "System prompt is required"),
  model: z.string(),
  temperature: z.coerce.number().min(0).max(1),
});

const messagesFormSchema = generateMessagesSchema.pick({ count: true });
type MessagesFormData = z.infer<typeof messagesFormSchema>;
type PromptFormData = z.infer<typeof promptSchema>;

export default function NewTestPage() {
  const searchParams = useSearchParams();
  const initialName = searchParams.get("name") ?? "";
  const systemPromptParam = searchParams.get("systemPrompt");
  const queryClient = useQueryClient();
  const [isRunningTest, setIsRunningTest] = useState(false);
  const { data: apiKeys } = useApiKeys();

  const [messages, setMessages] = useState<Message[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newMessageContent, setNewMessageContent] = useState("");

  const promptForm = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      name: initialName,
      systemPrompt: systemPromptParam ?? "",
      model: "gpt-4o-mini-2024-07-18",
      temperature: 0.7,
    },
  });

  const messagesForm = useForm<MessagesFormData>({
    resolver: zodResolver(messagesFormSchema),
    defaultValues: {
      count: 5,
    },
  });

  const generateMutation = useGenerateMessages();
  const router = useRouter();

  const onGenerateSubmit = async (data: MessagesFormData) => {
    const systemPrompt = promptForm.getValues("systemPrompt");
    if (!systemPrompt) {
      toast.error("Please enter a system prompt first");
      return;
    }

    try {
      const generatedMessages = await generateMutation.mutateAsync({
        count: data.count,
        systemPrompt,
        model: promptForm.getValues("model"),
      });
      setMessages((prev) => [...prev, ...generatedMessages]);
      toast.success(`Generated ${generatedMessages.length} messages`);
    } catch (_) {
      toast.error(`Failed to generate messages`);
    }
  };

  const handleDelete = (id: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
    toast.success("Message deleted");
  };

  const handleEdit = (id: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === id ? { ...message, content: newContent } : message,
      ),
    );
    setEditingId(null);
    toast.success("Message updated");
  };

  const handleCreateMessage = () => {
    if (!newMessageContent.trim()) {
      toast.error("Message content cannot be empty");
      return;
    }

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: newMessageContent.trim(),
      included: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setNewMessageContent("");
    setIsCreateDialogOpen(false);
    toast.success("Message created");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-2 gap-8">
        <div className="border-r pr-8">
          <div>
            <h1 className="mb-8 text-2xl font-semibold">
              Create System Prompt
            </h1>
            <Form {...promptForm}>
              <form className="space-y-6">
                <FormField
                  control={promptForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Legal Document Summarizer"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={promptForm.control}
                  name="systemPrompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>System Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g. You are a helpful assistant that summarizes legal documents..."
                          className="min-h-[400px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={promptForm.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
                            <SelectItem
                              value="o4-mini-2025-04-16"
                              disabled={!apiKeys?.keys.encryptedOpenAIKey}
                            >
                              o4-mini
                            </SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Anthropic</SelectLabel>
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
                            <SelectItem
                              value="claude-3-5-opus-latest"
                              disabled={!apiKeys?.keys.encryptedAnthropicKey}
                            >
                              Claude 3.5 Opus
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={promptForm.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperature</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="1"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </div>

        {/* Right Column - Message Generation */}
        <div className="pl-8">
          <div>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Generate User Messages</h2>
              <Button
                variant="default"
                className="hover:cursor-pointer"
                disabled={isRunningTest}
                onClick={async () => {
                  const formData = promptForm.getValues();
                  if (
                    !formData.name ||
                    !formData.systemPrompt ||
                    !formData.model
                  ) {
                    toast.error("Please fill in all required fields");
                    return;
                  }
                  if (messages.length === 0) {
                    toast.error("Please generate or add some messages first");
                    return;
                  }
                  try {
                    setIsRunningTest(true);
                    const response = await fetch("/api/tests", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        name: formData.name,
                        systemPrompt: formData.systemPrompt,
                        model: formData.model,
                        temperature: formData.temperature,
                        messages: messages,
                      }),
                    });
                    if (!response.ok) {
                      throw new Error("Failed to create test");
                    }
                    const rawData: unknown = await response.json();
                    const data = {
                      id: String((rawData as { id: unknown }).id),
                    };

                    await queryClient.invalidateQueries({
                      queryKey: ["tests"],
                    });

                    toast.success("Test created successfully");
                    router.push(`/test-results/${data.id}`);
                  } catch (error) {
                    console.error("Failed to create test:", error);
                    toast.error("Failed to create test");
                  } finally {
                    setIsRunningTest(false);
                  }
                }}
              >
                {isRunningTest ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Test...
                  </>
                ) : (
                  "Run Test"
                )}
              </Button>
            </div>
            <p className="text-muted-foreground mb-6">
              Generated messages are potential user queries that might be asked
              given your system prompt.
            </p>

            <div className="mb-8">
              <Form {...messagesForm}>
                <form
                  onSubmit={messagesForm.handleSubmit(onGenerateSubmit)}
                  className="flex items-center gap-4"
                >
                  <div className="flex items-center gap-4">
                    <FormLabel className="text-sm font-medium whitespace-nowrap">
                      How many messages?
                    </FormLabel>
                    <FormField
                      control={messagesForm.control}
                      name="count"
                      render={({ field }) => (
                        <FormItem className="w-20">
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={10}
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={generateMutation.isPending}
                    className="hover:cursor-pointer"
                    variant="default"
                  >
                    {generateMutation.isPending ? "Generating..." : "Generate"}
                  </Button>
                </form>
              </Form>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Generated Messages ({messages.length})
                </h3>
                <Dialog
                  open={isCreateDialogOpen}
                  onOpenChange={setIsCreateDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:cursor-pointer"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Manual
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Message</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Enter your message content..."
                        value={newMessageContent}
                        onChange={(e) => setNewMessageContent(e.target.value)}
                        className="min-h-[150px]"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsCreateDialogOpen(false)}
                          className="hover:cursor-pointer"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCreateMessage}
                          className="hover:cursor-pointer"
                        >
                          Create
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {generateMutation.isPending ? (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex animate-pulse space-x-4">
                      <div className="flex-1 space-y-4 py-1">
                        <div className="bg-muted h-4 w-3/4 rounded"></div>
                        <div className="space-y-2">
                          <div className="bg-muted h-4 rounded"></div>
                          <div className="bg-muted h-4 w-5/6 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : messages.length > 0 ? (
                messages.map((message) => (
                  <Card key={message.id}>
                    <CardContent className="px-4 py-2">
                      <div className="flex justify-between gap-4">
                        <div className="flex-1">
                          {editingId === message.id ? (
                            <div className="space-y-2">
                              <Textarea
                                defaultValue={message.content}
                                className="min-h-[100px]"
                                id={`edit-${message.id}`}
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const textarea = document.getElementById(
                                      `edit-${message.id}`,
                                    ) as HTMLTextAreaElement;
                                    if (textarea) {
                                      handleEdit(message.id, textarea.value);
                                    }
                                  }}
                                  className="hover:cursor-pointer"
                                >
                                  <Check className="mr-1 h-4 w-4" />
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingId(null)}
                                  className="hover:cursor-pointer"
                                >
                                  <X className="mr-1 h-4 w-4" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p>{message.content}</p>
                          )}
                        </div>
                        {editingId !== message.id && (
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setEditingId(message.id)}
                              className="h-8 w-8 hover:cursor-pointer"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(message.id)}
                              className="h-8 w-8 hover:cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-muted-foreground p-4 text-center">
                    No messages generated yet. Click the Generate button to
                    create some example messages.
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
