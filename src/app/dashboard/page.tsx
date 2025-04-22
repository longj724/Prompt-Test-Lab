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

// Mock data for testing
const mockTests = [
  {
    id: "1",
    name: "Legal Document Summarizer",
    createdAt: new Date("2024-03-15"),
    messageCount: 5,
    description:
      "Summarizes legal documents by breaking down complex language into clear, concise points about the main purpose, key obligations, important dates.",
    systemPrompt:
      "You are a helpful assistant that summarizes legal documents. Break down complex legal language into clear points about: 1) Main purpose 2) Key obligations 3) Important dates 4) Potential risks...",
  },
  {
    id: "2",
    name: "Creative Story Generator",
    createdAt: new Date("2024-03-10"),
    messageCount: 8,
    description:
      "Generates engaging short stories based on user-provided themes, characters, and settings with creative plot twists and emotional impact.",
    systemPrompt:
      "You are a creative writing assistant. Generate engaging stories that incorporate: 1) User-provided themes 2) Character development 3) Vivid settings 4) Emotional resonance...",
  },
  {
    id: "3",
    name: "Technical Documentation Assistant",
    createdAt: new Date("2024-03-05"),
    messageCount: 12,
    description:
      "Creates clear API documentation and code examples for developers based on technical specifications and programming languages.",
    systemPrompt:
      "You are a technical documentation expert. Create clear documentation that includes: 1) API endpoints 2) Request/response examples 3) Code snippets 4) Best practices...",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Your Test Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage and view all your prompt tests
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/dashboard/new">+ New Test</Link>
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input placeholder="Search tests..." className="pl-9" />
        </div>
        <Select defaultValue="newest">
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockTests.map((test) => (
          <TestCard key={test.id} {...test} />
        ))}
      </div>
    </div>
  );
}
