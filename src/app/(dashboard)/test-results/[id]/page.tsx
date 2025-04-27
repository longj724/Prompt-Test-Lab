"use client";

// External Dependencies
import { Plus, Copy, Search } from "lucide-react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Internal Dependencies
import { useTestResult } from "@/hooks/useTestResult";
import { useUpdateResponse } from "@/hooks/useUpdateResponse";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { NewModelTestDialog } from "@/components/new-model-test-dialog";
import { modelApiNameToDisplayName } from "@/lib/utils";
import { useAddMessage } from "@/hooks/useAddMessage";

const TestResultsPage = () => {
  const { id } = useParams();
  const { data: test, isLoading } = useTestResult(id as string);
  const updateResponse = useUpdateResponse();
  const [selectedModelTestId, setSelectedModelTestId] = useState<string | null>(
    null,
  );
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [isAddingMessage, setIsAddingMessage] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const addMessage = useAddMessage();

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-6 py-8">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold">Test not found</h1>
      </div>
    );
  }

  // Set initial selected model test if not set
  if (!selectedModelTestId && test.modelTests.length > 0) {
    setSelectedModelTestId(test.modelTests[0]?.id ?? null);
  }

  const selectedModelTest = test.modelTests.find(
    (mt) => mt.id === selectedModelTestId,
  );

  // Set initial selected message if not set
  if (
    selectedModelTest &&
    Array.isArray(selectedModelTest.messages) &&
    selectedModelTest.messages.length > 0 &&
    !selectedMessageId
  ) {
    setSelectedMessageId(selectedModelTest.messages[0]?.id ?? null);
  }

  const selectedMessage =
    selectedModelTest && Array.isArray(selectedModelTest.messages)
      ? selectedModelTest.messages.find((m) => m.id === selectedMessageId)
      : undefined;

  const selectedResponse =
    selectedMessage && Array.isArray(selectedMessage.responses)
      ? selectedMessage.responses.find(
          (r) => r.model === selectedModelTest?.model,
        )
      : undefined;

  const filteredMessages =
    selectedModelTest?.messages.filter((message) =>
      message.content.toLowerCase().includes(searchQuery.toLowerCase()),
    ) ?? [];

  const formatDate = (timestamp: string) =>
    new Date(timestamp).toISOString().split("T")[0];

  const handleCopyResponse = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Response copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy response");
    }
  };

  const handleAddMessage = async () => {
    if (!selectedModelTestId || !newMessage.trim()) return;

    try {
      await addMessage.mutateAsync({
        modelTestId: selectedModelTestId,
        content: newMessage.trim(),
      });
      setNewMessage("");
      setIsAddingMessage(false);
      toast.success("Message tested successfully");
    } catch (error) {
      toast.error("Failed to add message");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">{test.name}</h1>
        <Card className="mt-4">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  System Prompt:
                </CardTitle>
                <p className="mt-2 text-sm">{test.systemPrompt}</p>
              </div>
              <Button
                size="sm"
                className="cursor-pointer"
                onClick={() =>
                  router.push(
                    `/dashboard/new-test?systemPrompt=${encodeURIComponent(test.systemPrompt)}`,
                  )
                }
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Prompt To New Test
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="mb-4">
        <Tabs
          value={selectedModelTestId ?? undefined}
          onValueChange={setSelectedModelTestId}
        >
          <div className="flex items-center justify-between">
            <TabsList className="bg-muted text-muted-foreground h-9 p-1">
              {test.modelTests.map((modelTest) => (
                <TabsTrigger
                  key={modelTest.id}
                  value={modelTest.id}
                  className="ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground relative h-7 rounded-sm px-3 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow"
                >
                  {modelApiNameToDisplayName[modelTest.model]}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex gap-2">
              <Dialog open={isAddingMessage} onOpenChange={setIsAddingMessage}>
                <DialogTrigger asChild>
                  <Button size="sm" className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Test Message
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Message to Test</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Textarea
                      placeholder="Enter your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleAddMessage}
                        disabled={!newMessage.trim() || addMessage.isPending}
                        className="cursor-pointer"
                      >
                        {addMessage.isPending ? "Testing..." : "Test Message"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <NewModelTestDialog testId={test.id}>
                <Button size="sm" className="cursor-pointer">
                  <Plus className="mr-2 h-4 w-4" />
                  Run Test With New Model
                </Button>
              </NewModelTestDialog>
            </div>
          </div>
        </Tabs>
      </div>

      {/* Messages and Responses Section */}
      <div className="rounded-lg border">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              {selectedModelTest?.messages.length ?? 0}{" "}
              {(selectedModelTest?.messages.length ?? 0) === 1
                ? "message"
                : "messages"}{" "}
              tested
            </span>
          </div>
          {/* <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <span>Test run:</span>
            <time>
              {selectedModelTest?.createdAt
                ? formatDate(selectedModelTest.createdAt)
                : "-"}
            </time>
          </div> */}
        </div>

        <div className="grid grid-cols-[350px_1fr]">
          {/* Left Panel - Message List */}
          <div className="border-r">
            <div className="border-b p-4">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Search messages..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="h-[600px]">
              <div className="space-y-px">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "hover:bg-muted/50 cursor-pointer p-4 transition-colors",
                      selectedMessageId === message.id && "bg-muted",
                    )}
                    onClick={() => setSelectedMessageId(message.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                        <span className="text-sm">U</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm">
                          {message.content}
                        </p>
                        <time className="text-muted-foreground mt-1 block text-xs">
                          {formatDate(message.createdAt)}
                        </time>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Response Details */}
          <div>
            <ScrollArea className="h-[600px]">
              {selectedMessage && (
                <div className="space-y-6 p-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                      <span className="text-sm">U</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">{selectedMessage.content}</p>
                      <time className="text-muted-foreground mt-1 block text-xs">
                        {formatDate(selectedMessage.createdAt)}
                      </time>
                    </div>
                  </div>

                  {selectedResponse && (
                    <div>
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                          <span className="text-primary text-sm">AI</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {
                                modelApiNameToDisplayName[
                                  selectedModelTest?.model ?? ""
                                ]
                              }{" "}
                              Response
                            </span>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="cursor-pointer gap-2"
                                onClick={() => {
                                  if (selectedResponse.content) {
                                    void handleCopyResponse(
                                      selectedResponse.content,
                                    );
                                  }
                                }}
                              >
                                <Copy className="h-4 w-4" />
                                Copy
                              </Button>
                            </div>
                          </div>
                          <div className="prose prose-sm max-w-none">
                            <p className="whitespace-pre-wrap">
                              {selectedResponse.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResultsPage;
