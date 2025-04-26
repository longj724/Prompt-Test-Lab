"use client";

// External Dependencies
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

// Internal Dependencies
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TestCardProps {
  id: string;
  name: string;
  createdAt: string;
  messageCount: number;
  systemPrompt: string;
}

export function TestCard({
  id,
  name,
  createdAt,
  messageCount,
  systemPrompt,
}: TestCardProps) {
  const router = useRouter();

  return (
    <Card
      className="hover:bg-muted/50 flex cursor-pointer flex-col justify-between transition-colors"
      onClick={() => router.push(`/test-results/${id}`)}
    >
      <div>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold">{name}</CardTitle>
            <Badge variant="secondary" className="ml-2">
              {messageCount} {messageCount === 1 ? "message" : "messages"}{" "}
              tested
            </Badge>
          </div>
          <div className="text-muted-foreground text-sm">
            Created{" "}
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </div>
        </CardHeader>
      </div>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {systemPrompt}
        </p>
      </CardContent>
    </Card>
  );
}
