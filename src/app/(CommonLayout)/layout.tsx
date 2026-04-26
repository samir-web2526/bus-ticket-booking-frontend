
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/src/components/Pages/shared/Navbar";
import { getUser } from "@/src/services/auth/action";

import React from "react";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   const user = await getUser();

  return (
    <div className="max-w-7xl mx-auto">
     <Navbar user={user} />
      <TooltipProvider>{children}</TooltipProvider>
    </div>
  );
}
