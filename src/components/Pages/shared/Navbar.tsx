"use client";

import { useEffect, useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { motion } from "framer-motion";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { logout } from "@/src/services/auth/action";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LogOut, 
  User as UserIcon, 
  LayoutDashboard, 
  Ticket, 
  HelpCircle, 
  Sparkles, 
  Wind, 
  ShieldCheck, 
  ChevronDown,
  Bell,
  Map,
  Calendar,
  Info,
  Smartphone as PhoneIcon,
  BookOpen
} from "lucide-react";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  className?: string;
  user?: {
    name: string;
    email?: string;
    role: "ADMIN" | "OPERATOR" | "PASSENGER";
    profileImage?: string;
  } | null;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
}

const Navbar = ({
  user,
  logo = {
    url: "/",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "BusHub",
  },
  className,
}: NavbarProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menu: MenuItem[] = [
    { title: "Home", url: "/" },
    { title: "Find Buses", url: "/find-buses" },
    { 
      title: "Services", 
      url: "#",
      items: [
        { title: "VIP Sleeper", url: "/services/vip", description: "Premium sleeper buses with extra comfort.", icon: <Sparkles className="w-4 h-4" /> },
        { title: "Executive AC", url: "/services/ac", description: "Standard luxury AC travel.", icon: <Wind className="w-4 h-4" /> },
        { title: "Economy", url: "/services/economy", description: "Affordable inter-city travel.", icon: <ShieldCheck className="w-4 h-4" /> },
      ]
    },
    {
      title: "Explore",
      url: "#",
      items: [
        { title: "Travel Guides", url: "/blog", description: "Tips and guides for your next trip.", icon: <Map className="w-4 h-4" /> },
        { title: "Schedules", url: "/schedules", description: "Check all bus timings and stops.", icon: <Calendar className="w-4 h-4" /> },
        { title: "Help Center", url: "/help", description: "Need help? We are here 24/7.", icon: <HelpCircle className="w-4 h-4" /> },
        { title: "Mobile App", url: "/app", description: "Download for better experience.", icon: <PhoneIcon className="w-4 h-4" /> },
      ]
    },
    { title: "Routes", url: "/routes" },
    { title: "About", url: "/about" },
    { title: "Contact", url: "/contact" },
  ];

  if (user) {
    menu.push({ title: "My Bookings", url: "/my-bookings" });
    menu.push({ title: "Support", url: "/support" });
  }

  const dashboardUrl =
    user?.role === "ADMIN"
      ? "/admin-dashboard"
      : user?.role === "OPERATOR"
      ? "/operator-dashboard"
      : "/passenger-dashboard";

  return (
    <header
      className={cn(
        "sticky top-0 z-[100] w-full border-b border-border bg-background/80 backdrop-blur-md transition-all duration-300",
        scrolled ? "py-2 shadow-xl" : "py-4",
        className
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-12">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={logo.url}
              className="flex items-center gap-2 group"
            >
              <div className="relative w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
                <img src={logo.src} className="w-6 h-6 brightness-0 invert" alt={logo.alt} />
              </div>
              <span className="text-2xl font-bold text-foreground tracking-tight">
                {logo.title}
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <NavigationMenu>
                <NavigationMenuList className="gap-1">
                  {menu.map((item, idx) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      {renderMenuItem(item)}
                    </motion.div>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Action Section */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  className="p-2 text-slate-400 hover:text-amber-500 transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
                </motion.button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all outline-none"
                    >
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.role}</p>
                      </div>
                      <Avatar className="w-8 h-8 border border-slate-100">
                        <AvatarImage src={user.profileImage} />
                        <AvatarFallback className="bg-amber-100 text-amber-700 font-bold text-xs">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl border-slate-100 mt-2">
                    <DropdownMenuLabel className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.profileImage} />
                          <AvatarFallback className="bg-amber-500 text-white font-bold">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate w-32">{user.email || 'passenger@hub.com'}</p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <a href={dashboardUrl} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-amber-50 focus:bg-amber-50 group">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-white">
                          <LayoutDashboard className="w-4 h-4 text-slate-600 group-hover:text-amber-600" />
                        </div>
                        <span className="font-semibold text-slate-700 group-hover:text-amber-700">Dashboard</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="/profile" className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-amber-50 focus:bg-amber-50 group">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-white">
                          <UserIcon className="w-4 h-4 text-slate-600 group-hover:text-amber-600" />
                        </div>
                        <span className="font-semibold text-slate-700 group-hover:text-amber-700">My Profile</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="/my-bookings" className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-amber-50 focus:bg-amber-50 group">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-white">
                          <Ticket className="w-4 h-4 text-slate-600 group-hover:text-amber-600" />
                        </div>
                        <span className="font-semibold text-slate-700 group-hover:text-amber-700">Bookings</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <form action={logout}>
                        <button type="submit" className="w-full flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-rose-50 focus:bg-rose-50 group">
                          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center group-hover:bg-white">
                            <LogOut className="w-4 h-4 text-rose-600" />
                          </div>
                          <span className="font-semibold text-rose-700">Sign Out</span>
                        </button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button asChild variant="ghost" className="text-slate-600 font-medium hover:text-amber-600 hover:bg-amber-50 rounded-xl">
                  <a href="/login">Login</a>
                </Button>
                <Button asChild className="bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-xl px-6 shadow-lg shadow-amber-200 border-none transition-all hover:scale-105 active:scale-95">
                  <a href="/register">Sign Up</a>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center justify-between lg:hidden">
            <motion.a
              whileHover={{ scale: 1.08 }}
              href={logo.url}
              className="flex items-center gap-2"
            >
              <img src={logo.src} className="max-h-9" alt={logo.alt} />
              <span className="font-black text-gray-900 text-xl">{logo.title}</span>
            </motion.a>

            {isHydrated && (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild suppressHydrationWarning>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                  </motion.button>
                </SheetTrigger>

                <SheetContent className="bg-white border-l border-gray-200 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="text-gray-900 text-xl">
                      <motion.span className="text-amber-600 font-black">
                        {logo.title}
                      </motion.span>
                    </SheetTitle>
                  </SheetHeader>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col gap-6 p-4 mt-8"
                  >
                    <Accordion type="single" collapsible className="flex w-full flex-col gap-1">
                      {menu.map((item, idx) => (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          {renderMobileMenuItem(item, () => setIsOpen(false))}
                        </motion.div>
                      ))}
                    </Accordion>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="border-t border-gray-200 pt-4 flex flex-col gap-3"
                    >
                      {user ? (
                        <>
                          <Button
                            asChild
                            variant="outline"
                            className="w-full border-amber-400/60 text-amber-600 hover:border-amber-500 hover:bg-amber-50 rounded-xl font-bold"
                            onClick={() => setIsOpen(false)}
                          >
                            <a href={dashboardUrl}>Dashboard</a>
                          </Button>
                          <form action={logout}>
                            <button
                              type="submit"
                              onClick={() => setIsOpen(false)}
                              className="w-full py-2.5 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-400"
                            >
                              Sign Out
                            </button>
                          </form>
                        </>
                      ) : (
                        <>
                          <Button
                            asChild
                            variant="outline"
                            className="w-full border-amber-400/60 text-amber-600 hover:border-amber-500 hover:bg-amber-50 rounded-xl font-bold"
                            onClick={() => setIsOpen(false)}
                          >
                            <a href="/login">Login</a>
                          </Button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-2.5 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-200"
                            onClick={() => {
                              setIsOpen(false);
                              window.location.href = "/register";
                            }}
                          >
                            Sign Up
                          </motion.button>
                        </>
                      )}
                    </motion.div>
                  </motion.div>
                </SheetContent>
              </Sheet>
            )}

            {!isHydrated && (
              <Button variant="outline" size="icon" disabled>
                <Menu className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger className="text-foreground hover:text-amber-600 data-[state=open]:text-amber-600 data-[state=open]:bg-amber-50/50 hover:bg-amber-50/50 rounded-xl transition-all duration-300 font-medium text-sm bg-transparent border-none outline-none px-4 py-2">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="bg-card border border-border rounded-[32px] shadow-2xl overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-6 grid gap-4",
              item.title === "Explore" ? "w-[600px] grid-cols-2" : "w-[400px] grid-cols-1"
            )}
          >
            {item.title === "Explore" && (
              <div className="col-span-1 bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <h4 className="font-bold text-2xl mb-3 leading-tight">Summer <span className="text-amber-500">Sale!</span></h4>
                  <p className="text-slate-300 text-sm font-normal leading-relaxed mb-8">Get up to 30% off on all AC routes this weekend. Book now and save big.</p>
                </div>
                <Button size="sm" className="bg-amber-500 text-white hover:bg-amber-400 font-semibold text-sm h-10 px-6 rounded-xl border-none w-fit shadow-lg shadow-amber-500/20">
                  Explore Deals
                </Button>
              </div>
            )}
            <div className={cn("grid gap-2", item.title === "Explore" ? "col-span-1" : "col-span-1")}>
              {item.items.map((subItem) => (
                <NavigationMenuLink key={subItem.title} asChild>
                  <SubMenuLink item={subItem} />
                </NavigationMenuLink>
              ))}
            </div>
          </motion.div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-xl bg-transparent px-4 text-sm font-medium text-foreground transition-all duration-300 hover:text-amber-600 hover:bg-amber-50/50"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem, onClose: () => void) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-gray-200">
        <AccordionTrigger className="text-lg font-bold text-gray-900 hover:text-amber-600 hover:no-underline py-3 px-2 rounded-lg hover:bg-amber-50 transition-colors">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2 space-y-2 pl-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} onClose={onClose} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <motion.a
      key={item.title}
      href={item.url}
      onClick={onClose}
      className="block text-lg font-bold text-gray-900 hover:text-amber-600 transition-colors px-3 py-3 rounded-lg hover:bg-amber-50"
      whileHover={{ x: 8 }}
      whileTap={{ scale: 0.95 }}
    >
      {item.title}
    </motion.a>
  );
};

const SubMenuLink = ({ item, onClose }: { item: MenuItem; onClose?: () => void }) => {
  return (
    <motion.a
      className="flex flex-row items-center gap-4 rounded-2xl p-3 leading-none no-underline transition-all outline-none select-none hover:bg-amber-50 text-slate-600 hover:text-amber-700 group"
      href={item.url}
      onClick={onClose}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-amber-600 transition-colors shadow-sm">
        {item.icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
          {item.title}
        </div>
        {item.description && (
          <p className="text-xs leading-snug text-slate-400 group-hover:text-slate-500 transition-colors mt-0.5 line-clamp-1">
            {item.description}
          </p>
        )}
      </div>
    </motion.a>
  );
};

export { Navbar };