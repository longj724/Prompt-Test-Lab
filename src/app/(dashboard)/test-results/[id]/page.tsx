"use client";

// External Dependencies
import { Plus, Copy, Search } from "lucide-react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

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
import { modelApiNameToDisplayName } from "@/lib/client-schemas";

const TestResultsPage = () => {
  const { id } = useParams();
  const { data: test, isLoading } = useTestResult(id as string);
  const updateResponse = useUpdateResponse();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

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

  const models = Array.from(
    new Set(
      test.messages
        .flatMap((m) => m.results ?? [])
        .map((result) => result.model),
    ),
  );

  // Set initial selected message if not set
  if (!selectedMessageId && test?.messages.length > 0) {
    setSelectedMessageId(test?.messages[0]?.id ?? null);
  }

  const selectedMessage = test?.messages.find(
    (m) => m.id === selectedMessageId,
  );
  const selectedResult = selectedMessage?.results?.find(
    (r) => r.model === (selectedModel ?? models[0]),
  );

  const filteredMessages = test.messages.filter((message) =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDate = (timestamp: string) =>
    new Date(timestamp).toISOString().split("T")[0];

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
        <Tabs defaultValue={models[0]} onValueChange={setSelectedModel}>
          <div className="flex items-center justify-between">
            <TabsList className="bg-muted text-muted-foreground h-9 p-1">
              {models.map((model) => (
                <TabsTrigger
                  key={model}
                  value={model}
                  className="ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground relative h-7 rounded-sm px-3 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow"
                >
                  {modelApiNameToDisplayName[model]}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button size="sm" className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Run Test With New Model
            </Button>
          </div>
        </Tabs>
      </div>

      {/* Messages and Responses Section */}
      <div className="rounded-lg border">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              {test.messages.length}{" "}
              {test.messages.length === 1 ? "message" : "messages"} tested
            </span>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <span>Test run:</span>
            <time>{new Date().toLocaleDateString()}</time>
          </div>
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

                  {selectedResult && (
                    <div>
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                          <span className="text-primary text-sm">AI</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {modelApiNameToDisplayName[selectedResult.model]}{" "}
                              Response
                            </span>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="cursor-pointer gap-2"
                              >
                                <Copy className="h-4 w-4" />
                                Copy
                              </Button>
                            </div>
                          </div>
                          <div className="prose prose-sm max-w-none">
                            <p className="whitespace-pre-wrap">
                              {selectedResult.response}
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
