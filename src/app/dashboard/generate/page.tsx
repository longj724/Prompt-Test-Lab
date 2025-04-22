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
} from "@/components/ui/form";
import { Pencil, Trash2, X, Check } from "lucide-react";
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
      setMessages(generatedMessages);
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Generate User Messages</h1>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="mb-2 text-xl font-semibold">System Prompt</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {LEGAL_DOCUMENT_SUMMARIZER_PROMPT}
          </p>
        </CardContent>
      </Card>

      {/* Message Generation Controls */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
          <div className="flex items-center gap-4">
            <FormField
              control={form.control}
              name="count"
              render={({ field }) => (
                <FormItem className="max-w-xs flex-1">
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="How many messages?"
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
            <Button
              type="submit"
              disabled={generateMutation.isPending}
              className="hover:cursor-pointer"
            >
              {generateMutation.isPending ? "Generating..." : "Generate"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Generated Messages List */}
      <div className="space-y-4">
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
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
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
                        className="hover:cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(message.id)}
                        className="hover:cursor-pointer"
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
