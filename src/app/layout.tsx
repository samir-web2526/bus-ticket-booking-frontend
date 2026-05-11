import { Inter, Sora, Geist_Mono } from "next/font/google"

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner"; // ✅ add

const sora = Sora({ subsets: ['latin'], variable: '--font-heading' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
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
      className={cn("antialiased", fontMono.variable, inter.variable, sora.variable)}
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