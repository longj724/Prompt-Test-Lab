"use client";

// External Dependencies
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

// Internal Dependencies
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteTest } from "@/hooks/use-tests";

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
  const deleteTest = useDeleteTest();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    try {
      await deleteTest.mutateAsync(id);
      toast.success("Test deleted successfully");
    } catch (error) {
      toast.error("Failed to delete test");
    }
  };

  return (
    <Card
      className="hover:bg-muted/50 flex cursor-pointer flex-col justify-between transition-colors"
      onClick={() => router.push(`/test-results/${id}`)}
    >
      <div>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold">{name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {messageCount} {messageCount === 1 ? "message" : "messages"}{" "}
                tested
              </Badge>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Test</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this test? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={(e) => e.stopPropagation()}
                      className="hover:cursor-pointer hover:bg-white hover:text-black"
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive hover:bg-destructive/90 text-white hover:cursor-pointer"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
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
