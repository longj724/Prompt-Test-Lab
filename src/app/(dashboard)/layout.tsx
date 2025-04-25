import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/user-info";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SidebarTestResults } from "@/components/sidebar-test-results";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  console.log(user);

  if (!user) {
    redirect("/sign-in");
  }

  const userData = {
    name: user.name ?? "",
    email: user.email ?? "",
    image: user.image ?? "",
    id: user.id ?? "",
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen w-full">
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
              <SidebarTestResults />
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <NavUser {...userData} />
          </SidebarFooter>
        </Sidebar>
        <div className="flex w-full justify-center overflow-auto p-6">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
