import { Poppins, Geist_Mono } from "next/font/google"

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, poppins.variable)}
    >

      <body suppressHydrationWarning>
        <TooltipProvider>
          <ThemeProvider>
            {children}
            <Toaster position="top-center" richColors /> {/* ✅ add */}
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}