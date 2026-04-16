/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "./ui/tooltip";

export default function SidebarClient(props: any) {
  return (
    <TooltipProvider>
      <AppSidebar {...props} />
    </TooltipProvider>
  );
}