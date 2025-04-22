import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface TestCardProps {
  id: string;
  name: string;
  createdAt: Date;
  messageCount: number;
  description: string;
  systemPrompt: string;
}

export function TestCard({
  name,
  createdAt,
  messageCount,
  description,
  systemPrompt,
}: TestCardProps) {
  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{name}</CardTitle>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>
                Created {formatDistanceToNow(createdAt, { addSuffix: true })}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{messageCount} messages tested</span>
              </div>
            </div>
          </div>
          <Badge variant="secondary">{messageCount} Tests</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {description}
        </p>
        <div className="bg-muted rounded-md p-3">
          <p className="text-muted-foreground line-clamp-3 font-mono text-xs">
            {systemPrompt}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
