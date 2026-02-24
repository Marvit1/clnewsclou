"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import CookieNotice from "@/components/CookieNotice";
import PopupAd from "@/components/PopupAd";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <ThemeProvider>
                    <LanguageProvider>
                        {children}
                        <Toaster />
                        <Sonner />
                        <CookieNotice />
                        <PopupAd />
                    </LanguageProvider>
                </ThemeProvider>
            </TooltipProvider>
        </QueryClientProvider>
    );
}
