import SidebarClient from "@/components/sidebar-client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getUser } from "@/src/services/auth/action";


import { redirect } from "next/navigation";


export default async function DashboardLayout({
  admin,
  operator,
  passenger,
}: {
  admin: React.ReactNode;
  operator: React.ReactNode;
  passenger: React.ReactNode;
}) {
  const user = await getUser();
  console.log("user",user);
  if (!user) redirect("/login");

  const roleLabel = {
    ADMIN: "Admin Panel",
    OPERATOR: "Operator Panel",
    PASSENGER: "Passenger Panel",
  }

  return (
    <SidebarProvider>
      <SidebarClient
        userRole={user.role}
        userName={user.name}
        userEmail={user.email}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{roleLabel[user.role]}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          {user.role === "ADMIN" && admin}
          {user.role === "OPERATOR" && operator}
          {user.role === "PASSENGER" && passenger}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

