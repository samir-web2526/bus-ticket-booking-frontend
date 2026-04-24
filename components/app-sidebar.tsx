"use client";

import * as React from "react";
import {
  BookOpen,
  LayoutDashboard,
  CalendarDays,
  UserCircle,
  Tag,
  Search,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";


// ─── ADMIN NAV ───────────────────────────────────────────
// const ADMIN_NAV = [
//   {
//     title: "Overview",
//     url: "/dashboard",
//     icon: React.createElement(LayoutDashboard),
//     isActive: true,
//     items: [
//       {
//         title: "All Bookings",
//         url: "/dashboard/bookings",
//         icon: React.createElement(CalendarDays),
//       },
//       {
//         title: "All Buses",
//         url: "/dashboard/buses",
//         icon: React.createElement(Tag),
//       },
//       {
//         title: "All Operators",
//         url: "/dashboard/operators",
//         icon: React.createElement(UserCircle),
//       },
//       {
//         title: "All Passangers",
//         url: "/dashboard/passangers",
//         icon: React.createElement(UserCircle),
//       },
//       {
//         title: "My Profile",
//         url: "/dashboard/me",
//         icon: React.createElement(UserCircle),
//       },
//     ],
//   },
// ];

// // ─── OPERATOR NAV ───────────────────────────────────────
// const OPERATOR_NAV = [
//   {
//     title: "Overview",
//     url: "/dashboard",
//     icon: React.createElement(LayoutDashboard),
//     isActive: true,
//     items: [
//       {
//         title: "My Buses",
//         url: "/dashboard/buses",
//         icon: React.createElement(Tag),
//       },
//       {
//         title: "Passangers",
//         url: "/dashboard/passangers",
//         icon: React.createElement(UserCircle),
//       },
//       {
//         title: "My Profile",
//         url: "/dashboard/me",
//         icon: React.createElement(UserCircle),
//       },
//     ],
//   },
// ];

// // ─── PASSANGER NAV ─────────────────────────────────────
// const PASSANGER_NAV = [
//   {
//     title: "Overview",
//     url: "/dashboard",
//     icon: React.createElement(LayoutDashboard),
//     isActive: true,
//     items: [
//       {
//         title: "Find Bus",
//         url: "/dashboard/find-bus",
//         icon: React.createElement(Search),
//       },
//       {
//         title: "My Bookings",
//         url: "/dashboard/bookings",
//         icon: React.createElement(CalendarDays),
//       },
//       {
//         title: "My Profile",
//         url: "/dashboard/me",
//         icon: React.createElement(UserCircle),
//       },
//     ],
//   },
// ];

const ADMIN_NAV = [
  {
    title: "Overview",
    url: "/admin-dashboard",
    icon: React.createElement(LayoutDashboard),
    isActive: true,
    items: [
      { title: "All Bookings", url: "/admin-dashboard/bookings", icon: React.createElement(CalendarDays) },
      { title: "All Buses", url: "/admin-dashboard/buses", icon: React.createElement(Tag) },
      {title: "Create Route", url: "/admin-dashboard/create-route", icon: React.createElement(Tag)},
      {title: "Create Bus", url: "/admin-dashboard/create-bus", icon: React.createElement(Tag)},
      {title: "Create Schedule", url: "/admin-dashboard/create-schedule", icon: React.createElement(Tag)},
      { title: "All Operators", url: "/admin-dashboard/operators", icon: React.createElement(UserCircle) },
      { title: "All Passengers", url: "/admin-dashboard/passengers", icon: React.createElement(UserCircle) },
      { title: "My Profile", url: "/admin-dashboard/me", icon: React.createElement(UserCircle) },
    ],
  },
];

const OPERATOR_NAV = [
  {
    title: "Overview",
    url: "/operator-dashboard",
    icon: React.createElement(LayoutDashboard),
    isActive: true,
    items: [
      { title: "My Buses", url: "/operator-dashboard/buses", icon: React.createElement(Tag) },
      { title: "Passengers", url: "/operator-dashboard/passengers", icon: React.createElement(UserCircle) },
      { title: "My Profile", url: "/operator-dashboard/me", icon: React.createElement(UserCircle) },
    ],
  },
];

const PASSENGER_NAV = [
  {
    title: "Overview",
    url: "/passenger-dashboard",
    icon: React.createElement(LayoutDashboard),
    isActive: true,
    items: [
      { title: "Find Bus", url: "/passenger-dashboard/find-bus", icon: React.createElement(Search) },
      { title: "My Bookings", url: "/passenger-dashboard/bookings", icon: React.createElement(CalendarDays) },
      { title: "My Profile", url: "/passenger-dashboard/me", icon: React.createElement(UserCircle) },
    ],
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole: "ADMIN" | "OPERATOR" | "PASSENGER";
  userName: string;
  userEmail: string;
}


export function AppSidebar({
  userRole,
  userName,
  userEmail,
  ...props
}: AppSidebarProps) {
  let navItem = null;
  if (userRole === "ADMIN") {
    navItem = ADMIN_NAV;
  } else if (userRole === "OPERATOR") {
    navItem = OPERATOR_NAV;
  } else {
    navItem = PASSENGER_NAV;
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* ── Logo ── */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <BookOpen className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">Bus Ticket Booking</span>
                  <span className="truncate text-xs text-muted-foreground capitalize">
                    {userRole} Dashboard
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Nav Items (role-based) ── */}
      <SidebarContent>
        <NavMain items={navItem} />
      </SidebarContent>

      {/* ── User Info ── */}
      <SidebarFooter>
        <NavUser
          user={{
            name: userName,
            email: userEmail,
            avatar: "",
          }}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
