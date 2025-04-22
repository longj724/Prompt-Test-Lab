import { LayoutDashboard, FileText } from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen">
        <Sidebar collapsible="icon">
          <SidebarHeader className="flex items-center gap-2">
            <span className="font-semibold">Prompt Test Lab</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive tooltip="Dashboard">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Test Results">
                  <Link
                    href="/test-results"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Test Results</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
