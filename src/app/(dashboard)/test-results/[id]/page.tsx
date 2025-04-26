"use client";

// External Dependencies
import { Plus, ChevronDown, Copy } from "lucide-react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Internal Dependencies
import { useTestResult } from "@/hooks/useTestResult";
import { useUpdateResponse } from "@/hooks/useUpdateResponse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { modelApiNameToDisplayName } from "@/lib/client-schemas";

const TestResultsPage = () => {
  const { id } = useParams();
  const { data: test, isLoading } = useTestResult(id as string);
  const updateResponse = useUpdateResponse();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const router = useRouter();

  // Initialize closedResponses with all message IDs to hide them by default
  const [closedResponses, setClosedResponses] = useState<Set<string>>(() => {
    if (!test) return new Set();
    return new Set(test.messages.map((m) => m.id));
  });

  const toggleResponse = (messageId: string) => {
    setClosedResponses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

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

  // const handleNotesChange = async (responseId: string, notes: string) => {
  //   try {
  //     await updateResponse.mutateAsync({ responseId, notes });
  //     toast.success("Notes updated");
  //   } catch (error) {
  //     toast.error("Failed to update notes");
  //   }
  // };

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

      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Tabs
            defaultValue={models[0]}
            className="flex-1"
            onValueChange={setSelectedModel}
          >
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
              <Button size="sm" className="mb-2 cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                Run Test With New Model
              </Button>
            </div>

            {models.map((model) => (
              <TabsContent key={model} value={model} className="mt-6">
                <div className="space-y-6">
                  {test.messages.map((message) => {
                    const result = message.results?.find(
                      (r) => r.model === model,
                    );
                    if (!result) return null;

                    const isClosed = closedResponses.has(message.id);

                    return (
                      <Card key={`${message.id}-${model}`}>
                        <CardContent className="pt-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                              <span className="text-sm">U</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="mb-0.5 text-sm font-medium">
                                User Message
                              </div>
                              <p className="text-sm">{message.content}</p>
                            </div>
                          </div>

                          <Collapsible
                            open={!isClosed}
                            onOpenChange={() => toggleResponse(message.id)}
                          >
                            <CollapsibleContent>
                              <div className="mt-4 flex items-start space-x-3">
                                <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                                  <span className="text-primary text-sm">
                                    AI
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="mb-0.5 text-sm font-medium">
                                    AI Response
                                  </div>
                                  <p className="text-sm whitespace-pre-wrap">
                                    {result.response}
                                  </p>
                                </div>
                              </div>
                            </CollapsibleContent>

                            <div className="mt-3 flex items-center justify-center border-t pt-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="cursor-pointer gap-2"
                                onClick={() => toggleResponse(message.id)}
                              >
                                {isClosed ? "Show Response" : "Hide Response"}
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform ${
                                    !isClosed ? "rotate-180" : ""
                                  }`}
                                />
                              </Button>
                            </div>
                          </Collapsible>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TestResultsPage;
