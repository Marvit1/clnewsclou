"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import { Providers } from "@/components/Providers";
import React from "react";

export default function ClientLayout({
    children,
    lang,
}: {
    children: React.ReactNode;
    lang: string;
}) {
    return (
        <Providers>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                }}
            >
                <Header />
                <main style={{ flex: 1 }}>{children}</main>
                <Footer />
                <AdBanner position="footer" />
            </div>
        </Providers>
    );
}
