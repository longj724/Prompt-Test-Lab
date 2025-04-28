"use client";

// External Dependencies
import { useState } from "react";
import { Search, AlertTriangle } from "lucide-react";
import Link from "next/link";

// Internal Dependencies
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TestCard } from "@/components/test-card";
import { useTests } from "@/hooks/use-tests";
import { useApiKeys } from "@/hooks/use-api-keys";
import { ApiKeysDialog } from "@/components/api-keys-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DashboardPage() {
  const { data: tests, isLoading, error } = useTests();
  const { data: apiKeys } = useApiKeys();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<
    "newest" | "oldest" | "name-asc" | "name-desc"
  >("newest");

  const filteredAndSortedTests =
    tests
      ?.filter(
        (test) =>
          (test.name ?? "").toLowerCase().includes(search.toLowerCase()) ??
          test.systemPrompt.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => {
        switch (sort) {
          case "newest":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "oldest":
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          case "name-asc":
            return (a.name ?? "").localeCompare(b.name ?? "");
          case "name-desc":
            return (b.name ?? "").localeCompare(a.name ?? "");
          default:
            return 0;
        }
      }) ?? [];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="w-full">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight">
              Your Tests
            </h1>
            <p className="text-muted-foreground">
              Manage and view all your prompt tests
            </p>
          </div>
          <div className="flex items-center gap-2">
            {apiKeys?.key && <ApiKeysDialog />}
            <Button asChild size="lg" className="hover:cursor-pointer">
              <Link href="/dashboard/new-test">+ New Test</Link>
            </Button>
          </div>
        </div>

        {!apiKeys?.key && (
          <Alert className="mt-6 border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-500/30 dark:bg-blue-900/30 dark:text-blue-300 [&>svg]:text-blue-500 dark:[&>svg]:text-blue-400">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-blue-900 dark:text-blue-300">
              No API Keys Found
            </AlertTitle>
            <AlertDescription className="mt-2 flex items-center justify-between [&>span]:text-blue-800 dark:[&>span]:text-blue-300">
              <span>
                You need to add API keys before you can start testing with
                different providers.
              </span>
              <ApiKeysDialog
                trigger={
                  <Button
                    // variant="outline"
                    size="sm"
                    className="ml-4 border-blue-500 whitespace-nowrap hover:cursor-pointer dark:border-blue-400"
                  >
                    Add Keys
                  </Button>
                }
              />
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search tests..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={sort}
            onValueChange={(value) => setSort(value as typeof sort)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Sort: Newest</SelectItem>
              <SelectItem value="oldest">Sort: Oldest</SelectItem>
              <SelectItem value="name-asc">Sort: Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Sort: Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="min-h-[200px]">
        {isLoading ? (
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-muted-foreground">Loading tests...</p>
          </div>
        ) : error ? (
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-destructive">
              Failed to load tests. Please try again.
            </p>
          </div>
        ) : filteredAndSortedTests.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-muted-foreground">
              {search
                ? "No tests found matching your search."
                : "No tests created yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedTests.map((test) => (
              <TestCard
                key={test.id}
                id={test.id}
                name={test.name ?? "Untitled Test"}
                systemPrompt={test.systemPrompt}
                createdAt={test.createdAt}
                messageCount={test.messageCount}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
