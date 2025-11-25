"use client";

import { Toaster } from "@workspace/ui/components/sonner";
import { ThemeProvider } from "next-themes";

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    disableTransitionOnChange
    enableSystem
  >
    {children}
    <Toaster />
  </ThemeProvider>
);
