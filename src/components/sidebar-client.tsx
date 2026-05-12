"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  Home, 
  Bus, 
  Users, 
  Settings, 
  LogOut, 
  User, 
  Shield, 
  Calendar, 
  MapPin, 
  TrendingUp,
  Activity,
  DollarSign,
  Clock,
  Star,
  FileText,
  HelpCircle,
  ChevronRight,
  Bell,
  Search,
  Filter
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar"

interface SidebarClientProps {
  userRole: string
}

export default function SidebarClient({ userRole }: SidebarClientProps) {
  const router = useRouter()

  // Role-based navigation items
  const getNavigationItems = () => {
    switch (userRole) {
      case 'ADMIN':
        return [
          { title: 'Dashboard', url: '/admin-dashboard', icon: Home },
          { title: 'Buses', url: '/admin-dashboard/buses', icon: Bus },
          { title: 'Operators', url: '/admin-dashboard/operators', icon: Users },
          { title: 'Passengers', url: '/admin-dashboard/passengers', icon: User },
          { title: 'Routes', url: '/admin-dashboard/routes', icon: MapPin },
          { title: 'Bookings', url: '/admin-dashboard/bookings', icon: Calendar },
          { title: 'Analytics', url: '/admin-dashboard/analytics', icon: TrendingUp },
          { title: 'Settings', url: '/admin-dashboard/settings', icon: Settings },
        ]
      case 'OPERATOR':
        return [
          { title: 'Dashboard', url: '/operator-dashboard', icon: Home },
          { title: 'My Buses', url: '/operator-dashboard/buses', icon: Bus },
          { title: 'Add Bus', url: '/operator-dashboard/create-bus', icon: Plus },
          { title: 'Passengers', url: '/operator-dashboard/passengers', icon: Users },
          { title: 'Bookings', url: '/operator-dashboard/bookings', icon: Calendar },
          { title: 'Earnings', url: '/operator-dashboard/earnings', icon: DollarSign },
          { title: 'Settings', url: '/operator-dashboard/settings', icon: Settings },
        ]
      case 'PASSENGER':
        return [
          { title: 'Dashboard', url: '/passenger-dashboard', icon: Home },
          { title: 'Find Buses', url: '/passenger-dashboard/find-buses', icon: Search },
          { title: 'My Bookings', url: '/passenger-dashboard/bookings', icon: Calendar },
          { title: 'Booking History', url: '/passenger-dashboard/history', icon: Clock },
          { title: 'Payment', url: '/passenger-dashboard/payment', icon: DollarSign },
          { title: 'Profile', url: '/passenger-dashboard/profile', icon: User },
          { title: 'Settings', url: '/passenger-dashboard/settings', icon: Settings },
        ]
      default:
        return []
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <div className="text-base font-semibold">Bus Booking</div>
            <div className="text-xs text-muted-foreground capitalize">{userRole.toLowerCase()} Panel</div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarMenu>
            {userRole === 'ADMIN' && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/admin-dashboard/create-bus" className="flex items-center gap-3">
                      <Bus className="h-4 w-4" />
                      <span>Add Bus</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/admin-dashboard/create-operator" className="flex items-center gap-3">
                      <Users className="h-4 w-4" />
                      <span>Add Operator</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
            {userRole === 'OPERATOR' && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/operator-dashboard/create-bus" className="flex items-center gap-3">
                    <Plus className="h-4 w-4" />
                    <span>Add New Bus</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full justify-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">John Doe</span>
                      <span className="text-xs text-muted-foreground capitalize">{userRole.toLowerCase()}</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <a href={`/${userRole.toLowerCase()}-dashboard/profile`} className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={`/${userRole.toLowerCase()}-dashboard/settings`} className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </a>
                </DropdownMenuItem>
                {userRole === 'ADMIN' && (
                  <DropdownMenuItem asChild>
                    <a href="/admin-dashboard/system-settings" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>System Settings</span>
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => {
                    // Handle logout logic here
                    router.push('/login')
                  }}
                  className="flex items-center gap-2 text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Notifications */}
        <div className="mt-4">
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Notifications</div>
                  <Badge variant="destructive" className="ml-auto">3</Badge>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
