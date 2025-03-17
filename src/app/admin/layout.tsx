import { PageBreadcrumb } from "~/layout/page-breadcrumb";
import { ModeToggle } from "~/components/ui/mode-toggle";
import { Separator } from "~/components/ui/separator";
import { GalleryVerticalEnd } from "lucide-react";
import { NavUser } from "~/layout/nav-user";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { Menu } from "~/layout/menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "~/components/ui/sidebar";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <div>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>

                  <span className="font-semibold">Brand Panel Admin</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent className="gap-0">
            <SidebarGroup>
              <Menu />
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <NavUser
              user={{
                avatar: null,
                email: session.user.email ?? "admin@gmail.com",
                name: session.user.name ?? "Admin",
              }}
            />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="h-screen overflow-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <PageBreadcrumb />
            </div>
            <ModeToggle />
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
