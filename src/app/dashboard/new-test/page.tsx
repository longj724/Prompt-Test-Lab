"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Pencil, Trash2, X, Check, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type Message, generateMessagesSchema } from "@/lib/client-schemas";
import { useGenerateMessages } from "@/hooks/useGenerateMessages";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const promptSchema = z.object({
  name: z.string().min(1, "Name is required"),
  systemPrompt: z.string().min(1, "System prompt is required"),
  model: z.string(),
});

const messagesFormSchema = generateMessagesSchema.pick({ count: true });
type MessagesFormData = z.infer<typeof messagesFormSchema>;
type PromptFormData = z.infer<typeof promptSchema>;

export default function NewTestPage() {
  const searchParams = useSearchParams();
  const initialName = searchParams.get("name") ?? "";
  const initialSystemPrompt = searchParams.get("systemPrompt") ?? "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newMessageContent, setNewMessageContent] = useState("");

  const promptForm = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      name: initialName,
      systemPrompt: initialSystemPrompt,
      model: "gpt-4o-mini",
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

  const onPromptSubmit = async (data: PromptFormData) => {
    try {
      // TODO: Implement API call to save the prompt
      console.log("Saving prompt:", data);
      toast.success("Prompt saved successfully");
    } catch (error) {
      console.error("Failed to save prompt:", error);
      toast.error("Failed to save prompt");
    }
  };

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
        {/* Left Column - System Prompt */}
        <div className="border-r pr-8">
          <div>
            <h1 className="mb-8 text-2xl font-semibold">
              Create System Prompt
            </h1>
            <Form {...promptForm}>
              <form
                onSubmit={promptForm.handleSubmit(onPromptSubmit)}
                className="space-y-6"
              >
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
                          <SelectItem value="gpt-4.1-nano">
                            OpenAI GPT-4.1-nano
                          </SelectItem>
                          <SelectItem value="gpt-4o-mini">
                            OpenAI GPT-4o-mini
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
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
                    const response = await fetch("/api/tests", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        name: formData.name,
                        systemPrompt: formData.systemPrompt,
                        model: formData.model,
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
                    toast.success("Test created successfully");
                    router.push(`/dashboard/test-results/${data.id}`);
                  } catch (error) {
                    console.error("Failed to create test:", error);
                    toast.error("Failed to create test");
                  }
                }}
              >
                Run Test
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
                    <CardContent className="p-4">
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
