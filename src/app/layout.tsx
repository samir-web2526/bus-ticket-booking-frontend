import { Geist_Mono, Nunito_Sans, Outfit } from "next/font/google"

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner"; // ✅ add

const outfitHeading = Outfit({subsets:['latin'],variable:'--font-heading'});
const nunitoSans = Nunito_Sans({subsets:['latin'],variable:'--font-sans'})
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
      className={cn("antialiased", fontMono.variable, "font-sans", nunitoSans.variable, outfitHeading.variable)}
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