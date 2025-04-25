"use client";

import { useTestResult } from "@/hooks/useTestResult";
import { useUpdateResponse } from "@/hooks/useUpdateResponse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useParams } from "next/navigation";

const TestResultsPage = () => {
  const { id } = useParams();
  const { data: test, isLoading } = useTestResult(id as string);
  const updateResponse = useUpdateResponse();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

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

  console.log("test is", test);

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

  const handleNotesChange = async (responseId: string, notes: string) => {
    try {
      await updateResponse.mutateAsync({ responseId, notes });
      toast.success("Notes updated");
    } catch (error) {
      toast.error("Failed to update notes");
    }
  };

  return (
    <div className="container mx-auto space-y-6 py-8">
      <div>
        <h1 className="mb-2 text-2xl font-bold">{test.name}</h1>
        <p className="text-muted-foreground">{test.systemPrompt}</p>
      </div>

      <Tabs defaultValue={models[0]} onValueChange={setSelectedModel}>
        <TabsList>
          {models.map((model) => (
            <TabsTrigger key={model} value={model}>
              {model}
            </TabsTrigger>
          ))}
        </TabsList>

        {models.map((model) => (
          <TabsContent key={model} value={model}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {test.messages.map((message) => {
                const result = message.results?.find((r) => r.model === model);
                if (!result) return null;

                return (
                  <Card key={`${message.id}-${model}`}>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        User Message
                      </CardTitle>
                      <p className="mt-2">{message.content}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="mb-2 text-sm font-medium">
                          AI Response
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {result.response}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Textarea
                          placeholder="Add notes..."
                          className="mt-2 h-20"
                          defaultValue={result.notes}
                          onChange={(e) =>
                            handleNotesChange(result.id, e.target.value)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TestResultsPage;
