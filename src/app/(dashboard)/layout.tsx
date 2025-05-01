// External Dependencies
import { redirect } from "next/navigation";

// Internal Dependencies
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/user-info";
import { auth } from "@/lib/auth";
import { SidebarTestResults } from "@/components/sidebar-test-results";
import { DashboardMenuItem } from "@/components/dashboard-menu-item";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

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
          <SidebarHeader className="mt-2 flex flex-row items-center justify-center gap-2">
            <img
              src="/prompt-test-lab-icon.svg"
              alt="Prompt Test Lab Logo"
              className="h-6 w-6"
            />
            <span className="font-semibold">Prompt Test Lab</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <DashboardMenuItem />
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
