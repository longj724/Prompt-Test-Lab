"use client";

import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface TestCardProps {
  id: string;
  name: string;
  createdAt: Date;
  messageCount: number;
  systemPrompt: string;
}

function generateDescription(systemPrompt: string): string {
  // Take the first sentence or first 150 characters, whichever is shorter
  const sentences = systemPrompt.split(/[.!?]/);
  const firstSentence = sentences[0] ?? systemPrompt;
  return firstSentence.length > 150
    ? firstSentence.slice(0, 147) + "..."
    : firstSentence;
}

export function TestCard({
  id,
  name,
  createdAt,
  messageCount,
  systemPrompt,
}: TestCardProps) {
  const router = useRouter();
  const description = generateDescription(systemPrompt);

  return (
    <Card
      className="hover:bg-muted/50 transition-colors hover:cursor-pointer"
      onClick={() => router.push(`/dashboard/test-results/${id}`)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{name}</CardTitle>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>
                Created{" "}
                {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>
                  {messageCount} {messageCount === 1 ? "message" : "messages"}{" "}
                  tested
                </span>
              </div>
            </div>
          </div>
          <Badge variant="secondary">
            {messageCount} {messageCount === 1 ? "Test" : "Tests"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {description}
        </p>
        {/* <div className="bg-muted rounded-md p-3">
          <p className="text-muted-foreground line-clamp-3 font-mono text-xs">
            {systemPrompt}
          </p>
        </div> */}
      </CardContent>
    </Card>
  );
}
