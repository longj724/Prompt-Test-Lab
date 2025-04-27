"use client";

// External Dependencies
import { ChevronRight, TestTubesIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Internal Dependencies
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { useTests } from "@/hooks/use-tests";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SidebarTestResults() {
  const { data: tests, isLoading } = useTests();
  const pathname = usePathname();
  const currentTestId = pathname?.split("/").pop();
  const isTestResultsPage = pathname?.startsWith("/test-results");

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <TestTubesIcon />
            <span>Test Results</span>
            <ChevronRight className="ml-auto" />
          </SidebarMenuButton>
          <div className="px-4 py-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <Collapsible
        asChild
        className="group/collapsible"
        defaultOpen={isTestResultsPage}
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={"Test Results"}
              className="cursor-pointer"
            >
              <TestTubesIcon />
              <span>Test Results</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {tests?.map((test) => (
                <SidebarMenuSubItem key={test.id}>
                  <SidebarMenuSubButton
                    asChild
                    className={cn(
                      "transition-colors",
                      test.id === currentTestId && "active",
                      "hover:bg-[#4f46e5]",
                    )}
                  >
                    <Link
                      href={`/test-results/${test.id}`}
                      className="cursor-pointer"
                    >
                      <span>{test.name ?? `Test ${test.id.slice(0, 8)}`}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
}
