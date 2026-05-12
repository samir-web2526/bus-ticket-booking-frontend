"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { PanelLeft } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

const SidebarContext = React.createContext<{
  state: "open" | "closed"
  open: boolean
  setOpen: (open: boolean) => void
} | undefined>(undefined)

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  ({ defaultOpen = false, open, onOpenChange, className, ...props }, ref) => {
    const [_open, _setOpen] = React.useState(defaultOpen)
    const isControlled = open !== undefined && onOpenChange !== undefined

    React.useEffect(() => {
      if (isControlled) {
        _setOpen(open!)
      }
    }, [open, isControlled])

    const handleToggle = React.useCallback(() => {
      if (isControlled) {
        onOpenChange?.(!open)
      } else {
        _setOpen(open => !open)
      }
    }, [isControlled, open, onOpenChange])

    const state = open ?? _open
    const contextValue = React.useMemo(() => ({
      state: state ? "open" : "closed",
      open: state,
      setOpen: handleToggle,
    }), [state, handleToggle])

    return (
      <SidebarContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-sidebar="sidebar"
          data-state={state}
          className={cn(
            "group peer hidden md:group-data-[state=collapsed]:sidebar-collapsed data-[state=collapsed]:sidebar-collapsed",
            className
          )}
          {...props}
        />
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="sidebar-inner"
      className={cn(
        "flex h-full w-full flex-col gap-0 bg-background",
        className
      )}
      {...props}
    />
  )
})
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="sidebar-header"
      className={cn(
        "flex h-16 shrink-0 items-center gap-2 border-b border-border px-6",
        className
      )}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="sidebar-footer"
      className={cn(
        "flex h-16 shrink-0 items-center gap-2 border-t border-border px-6",
        className
      )}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="sidebar-trigger"
      className={cn(
        "h-7 w-7 rounded-md border border-border bg-background hover:bg-muted",
        className
      )}
      onClick={() => {
        state === "open" ? contextValue?.setOpen(false) : contextValue?.setOpen(true)
      }}
      {...props}
    />
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="sidebar-rail"
      className={cn(
        "absolute inset-y -z-20 hidden h-full w-[3px] transition-all ease-linear lg:block",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "flex-1 min-h-[calc(100vh-4rem)] bg-background",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      data-sidebar="sidebar-input"
      className={cn(
        "h-8 w-full rounded-md border border-border bg-background px-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="sidebar-group"
      className={cn("relative flex w-full min-w-0 flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="sidebar-group-label"
      className={cn(
        "flex h-8 shrink-0 items-center gap-2 px-2 text-xs font-medium text-sidebar-foreground/70",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      data-sidebar="sidebar-group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground/70 transition-colors hover:text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      data-sidebar="sidebar-menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  )
})
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      data-sidebar="menu-item"
      className={cn(
        "group/menu-item relative flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
  }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      ref={ref}
      data-sidebar="menu-button"
      className={cn(
        "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

function useSidebar() {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  SidebarInput,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
}
