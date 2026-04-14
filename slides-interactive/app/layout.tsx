import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "MLPC 2026 Task 3 - Qualitative Analysis",
  description: "Interactive slides for Sound Event Detection data exploration",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <TooltipProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <NuqsAdapter>{children}</NuqsAdapter>
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
