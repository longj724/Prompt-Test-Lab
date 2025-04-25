"use client";

import { Search } from "lucide-react";
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
import Link from "next/link";
import { useTests } from "@/hooks/use-tests";
import { useState } from "react";

export default function DashboardPage() {
  const { data: tests, isLoading, error } = useTests();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<
    "newest" | "oldest" | "name-asc" | "name-desc"
  >("newest");

  const filteredAndSortedTests =
    tests
      ?.filter(
        (test) =>
          test.name?.toLowerCase().includes(search.toLowerCase()) ||
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
            return a.name?.localeCompare(b.name ?? "") ?? 0;
          case "name-desc":
            return b.name?.localeCompare(a.name ?? "") ?? 0;
          default:
            return 0;
        }
      }) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Tests</h1>
          <p className="text-muted-foreground">
            Manage and view all your prompt tests
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/dashboard/new-test">+ New Test</Link>
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4">
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

      {isLoading ? (
        <div className="text-muted-foreground text-center">
          Loading tests...
        </div>
      ) : error ? (
        <div className="text-destructive text-center">
          Failed to load tests. Please try again.
        </div>
      ) : filteredAndSortedTests.length === 0 ? (
        <div className="text-muted-foreground text-center">
          {search
            ? "No tests found matching your search."
            : "No tests created yet."}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedTests.map((test) => (
            <TestCard key={test.id} {...test} />
          ))}
        </div>
      )}
    </div>
  );
}
