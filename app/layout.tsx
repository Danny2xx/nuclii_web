import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";

import { SiteAnalytics } from "@/components/analytics/site-analytics";
import { CookieBanner } from "@/components/consent/cookie-banner";
import { PageShell } from "@/components/layout/PageShell";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

// Display headline font — minimal geometric sans, quiet and serious
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display-src",
  display: "swap",
});

const siteTitle = "nuclii · more than memories.";
// the hero line; link previews show it under the title
const siteDescription =
  "Turn any idea into an experience, fill the room with the people it's for. Then, do it again.";

export const metadata: Metadata = {
  metadataBase: new URL("https://nuclii.co.uk"),
  // one fixed lime icon on every browser and device. The "-v2" file names are
  // new URLs, so browsers that saved the old cycling icon fetch this one fresh
  // (app/favicon.ico still answers the default /favicon.ico request).
  icons: {
    icon: [
      { url: "/icons/nuclii-icon-v2-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/nuclii-icon-v2-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/nuclii-icon-v2-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/nuclii-apple-touch-v2.png", sizes: "180x180", type: "image/png" }],
  },
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    type: "website",
    url: "/",
    siteName: "nuclii",
    locale: "en_GB",
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${jakartaSans.variable} ${sora.variable}`}
      data-scroll-behavior="smooth"
      data-theme="dark"
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <PageShell>{children}</PageShell>
        <CookieBanner />
        <Suspense fallback={null}>
          <SiteAnalytics />
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
