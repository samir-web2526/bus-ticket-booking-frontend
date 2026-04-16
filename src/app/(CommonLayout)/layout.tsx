
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/src/components/Pages/shared/Navbar";

import React from "react";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-7xl mx-auto">
      <Navbar
        // user={
        //   user ? { name: user.name, email: user.email, role: user.role } : null
        // }
      />
      <TooltipProvider>{children}</TooltipProvider>
    </div>
  );
}
