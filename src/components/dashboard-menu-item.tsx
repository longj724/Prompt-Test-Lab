"use client";

// External Dependencies
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Internal Dependencies
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function DashboardMenuItem() {
  const pathname = usePathname();
  const isDashboardRoute = pathname === "/dashboard";

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className={cn(isDashboardRoute && "active")}
        tooltip="Dashboard"
      >
        <Link href="/dashboard" className="flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
