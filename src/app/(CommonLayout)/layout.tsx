import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/src/components/Pages/shared/Navbar";
import Footer from "@/src/components/Pages/HomePage/Footer";
import { getUser } from "@/src/services/auth/action";

import React from "react";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   const user = await getUser();

  return (
    <div className="min-h-screen flex flex-col">
     <Navbar user={user} />
      <main className="flex-grow">
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </main>
      <Footer />
    </div>
  );
}

