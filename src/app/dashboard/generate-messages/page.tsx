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
import { type Message, generateMessagesSchema } from "@/lib/schema";
import { useGenerateMessages } from "@/hooks/useGenerateMessages";
import { type z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const LEGAL_DOCUMENT_SUMMARIZER_PROMPT = `You are a helpful assistant that summarizes legal documents. You break down complex legal language into clear, concise points that anyone can understand. When summarizing, focus on these key aspects:
1. Main purpose or subject of the document
2. Key obligations for all parties involved
3. Important deadlines or dates
4. Potential consequences or penalties`;

const formSchema = generateMessagesSchema.pick({ count: true });
type FormData = z.infer<typeof formSchema>;

export default function GenerateMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newMessageContent, setNewMessageContent] = useState("");
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      count: 5,
    },
  });

  const generateMutation = useGenerateMessages();

  async function onSubmit(data: FormData) {
    try {
      const generatedMessages = await generateMutation.mutateAsync({
        count: data.count,
        systemPrompt: LEGAL_DOCUMENT_SUMMARIZER_PROMPT,
      });
      setMessages((prev) => [...prev, ...generatedMessages]);
      toast.success(`Generated ${generatedMessages.length} messages`);
    } catch (_) {
      toast.error(`Failed to generate messages`);
    }
  }

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
      createdAt: new Date(),
      included: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setNewMessageContent("");
    setIsCreateDialogOpen(false);
    toast.success("Message created");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-2xl font-semibold">
          Legal Document Summarizer
        </h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {LEGAL_DOCUMENT_SUMMARIZER_PROMPT}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">Generate User Messages</h2>
        <p className="text-muted-foreground mb-6">
          Generated messages are potential user queries that might be asked
          given your system prompt.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-4">
              <FormLabel className="text-sm font-medium whitespace-nowrap">
                How many messages?
              </FormLabel>
              <FormField
                control={form.control}
                name="count"
                render={({ field }) => (
                  <FormItem className="w-20">
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
              No messages generated yet. Click the Generate button to create
              some example messages.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
