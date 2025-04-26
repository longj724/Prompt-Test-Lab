"use client";

import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export function DashboardMenuItem() {
  const pathname = usePathname();
  const isDashboardRoute = pathname === "/dashboard";

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isDashboardRoute}
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
