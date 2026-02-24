export const runtime = 'edge';
import "../globals.css";
import { Metadata } from "next";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  metadataBase: new URL("https://datapols.com"),
  icons: {
    icon: "/logosev.svg",
    shortcut: "/logosev.svg",
    apple: "/logosev.svg",
  },
  title: {
    default: "Data Politic - News",
    template: "%s | Data Politic",
  },
  description: "Հայաստանի և աշխարհի ամենաթարմ նորությունները: Մնացեք տեղեկացված Data Politic-ի հետ:",
  keywords: ["լուրեր", "նորություններ", "նորություն", "news", "armenia", "politics", "data politic"],
  authors: [{ name: "Data Politic" }],
  openGraph: {
    type: "website",
    siteName: "Data Politic",
    title: "Data Politic - News",
    description: "Հայաստանի և աշխարհի ամենաթարմ նորությունները: Մնացեք տեղեկացված Data Politic-ի հետ:",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Data Politic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Politic - News",
    description: "Հայաստանի և աշխարհի ամենաթարմ նորությունները: Մնացեք տեղեկացված Data Politic-ի հետ:",
    images: ["/logo.jpg"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        style={{
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <ClientLayout lang={lang}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}