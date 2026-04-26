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

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    register: {
      title: string;
      url: string;
    };
  };
}

const Navbar = ({
  logo = {
    url: "/",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "BusHub",
  },
  menu = [
    { title: "Home", url: "/" },
    { title: "About", url: "/about" },
    { title: "Find Buses", url: "/find-buses" },
    { title: "Routes", url: "/routes" },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    register: { title: "Register", url: "/register" },
  },
  className,
}: NavbarProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <section className={cn("relative", className)}>
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/25 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200" />

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,180,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <nav className="relative z-10 py-4 md:py-6">
        <div className="container">
          {/* Desktop Menu */}
          <div className="hidden items-center justify-between lg:flex">
            {/* Left: Logo + Menu */}
            <div className="flex items-center gap-12">
              {/* Logo */}
              <motion.a
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                href={logo.url}
                className="flex items-center gap-3 group relative"
              >
                <div className="relative">
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(251, 191, 36, 0)",
                        "0 0 40px rgba(251, 191, 36, 0.3)",
                        "0 0 20px rgba(251, 191, 36, 0)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-400 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <img
                    src={logo.src}
                    className="max-h-10 relative"
                    alt={logo.alt}
                  />
                </div>
                <motion.span
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-2xl font-black bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-clip-text text-transparent bg-200 tracking-tighter"
                >
                  {logo.title}
                </motion.span>
              </motion.a>

              {/* Navigation Menu */}
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item, idx) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: -15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                    >
                      {renderMenuItem(item)}
                    </motion.div>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Right: Auth Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-3 items-center"
            >
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-amber-400/50 text-amber-400 hover:border-amber-400 hover:bg-amber-400/10 rounded-xl font-bold text-base"
                >
                  <a href={auth.login.url}>{auth.login.title}</a>
                </Button>
              </motion.div>
              {/* <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
                <motion.button
                  className="px-6 py-2.5 rounded-xl font-bold text-black text-base bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all duration-300 relative overflow-hidden group shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40"
                  onClick={() => window.location.href = auth.register.url}
                >
                  <motion.div
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                  <span className="relative flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    {auth.register.title}
                  </span>
                </motion.button>
              </motion.div> */}
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
  <Button
    asChild
    className="px-6 py-2.5 rounded-xl font-bold text-black text-base bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40"
  >
    <a href={auth.register.url} className="flex items-center gap-2">
      <Zap className="w-4 h-4" />
      {auth.register.title}
    </a>
  </Button>
</motion.div>
            </motion.div>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center justify-between lg:hidden">
            {/* Logo */}
            <motion.a
              whileHover={{ scale: 1.08 }}
              href={logo.url}
              className="flex items-center gap-2"
            >
              <img src={logo.src} className="max-h-9" alt={logo.alt} />
              <span className="font-black text-white text-xl">{logo.title}</span>
            </motion.a>

            {/* Menu Toggle */}
            {isHydrated && (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild suppressHydrationWarning>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-xl border border-amber-400/50 text-amber-400 hover:bg-amber-400/10 transition-colors"
                  >
                    {isOpen ? (
                      <X className="size-6" />
                    ) : (
                      <Menu className="size-6" />
                    )}
                  </motion.button>
                </SheetTrigger>

                <SheetContent className="bg-white border-l border-slate-200 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="text-slate-900 text-xl">
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
                    {/* Mobile Menu Items */}
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

                    {/* Auth Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="border-t border-slate-200 pt-4 flex flex-col gap-3"
                    >
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-amber-400/50 text-amber-400 hover:border-amber-400 hover:bg-amber-400/10 rounded-xl font-bold"
                        onClick={() => setIsOpen(false)}
                      >
                        <a href={auth.login.url}>{auth.login.title}</a>
                      </Button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2.5 rounded-xl font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20"
                        onClick={() => {
                          setIsOpen(false);
                          window.location.href = auth.register.url;
                        }}
                      >
                        {auth.register.title}
                      </motion.button>
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
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger className="text-slate-700 hover:text-amber-600 data-[state=open]:text-amber-600 data-[state=open]:bg-amber-100 hover:bg-amber-50 rounded-lg transition-all duration-200 font-semibold">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="bg-white/95 backdrop-blur-xl border border-amber-400/30 rounded-2xl shadow-2xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 space-y-2"
          >
            {item.items.map((subItem, idx) => (
              <motion.div
                key={subItem.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <NavigationMenuLink asChild className="w-full">
                  <SubMenuLink item={subItem} />
                </NavigationMenuLink>
              </motion.div>
            ))}
          </motion.div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-11 w-max items-center justify-center rounded-lg bg-transparent px-5 py-2 text-sm font-bold text-slate-700 transition-all duration-200 hover:text-amber-600 hover:bg-amber-100 relative"
      >
        <span className="relative z-10">{item.title}</span>
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem, onClose: () => void) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-slate-200">
        <AccordionTrigger className="text-lg font-bold text-slate-900 hover:text-amber-600 hover:no-underline py-3 px-2 rounded-lg hover:bg-amber-50 transition-colors">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2 space-y-2 pl-2">
          {item.items.map((subItem) => (
            <SubMenuLink
              key={subItem.title}
              item={subItem}
              onClose={onClose}
            />
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
      className="block text-lg font-bold text-slate-900 hover:text-amber-600 transition-colors px-3 py-3 rounded-lg hover:bg-amber-50"
      whileHover={{ x: 8 }}
      whileTap={{ scale: 0.95 }}
    >
      {item.title}
    </motion.a>
  );
};

const SubMenuLink = ({
  item,
  onClose,
}: {
  item: MenuItem;
  onClose?: () => void;
}) => {
  return (
    <motion.a
      className="flex flex-row gap-3 rounded-xl p-4 leading-none no-underline transition-all outline-none select-none hover:bg-amber-100 text-slate-700 hover:text-slate-900 group"
      href={item.url}
      onClick={onClose}
      whileHover={{ x: 8 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="text-amber-600 group-hover:scale-125 transition-transform"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {item.icon}
      </motion.div>
      <div>
        <div className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
          {item.title}
        </div>
        {item.description && (
          <p className="text-sm leading-snug text-slate-600 group-hover:text-slate-700 transition-colors">
            {item.description}
          </p>
        )}
      </div>
    </motion.a>
  );
};

export { Navbar };