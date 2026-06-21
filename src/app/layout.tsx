import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Clarity from "@/components/clarity";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ScrollManager } from "@/components/scroll-manager";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://annex-consultancy.vercel.app"),
  title: "Annex Consultancy | Study Abroad Experts for UK, Australia, Europe & Italy",
  description: "Premium education consultancy helping students secure admissions, scholarships, visas, and placements at leading global universities.",
  alternates: {
    canonical: "https://annex-consultancy.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Annex Consultancy | Study Abroad Experts for UK, Australia, Europe & Italy",
    description: "Premium education consultancy helping students secure admissions, scholarships, visas, and placements at leading global universities.",
    url: "https://annex-consultancy.vercel.app",
    siteName: "Annex Consultancy",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://annex-consultancy.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Annex Consultancy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Annex Consultancy | Study Abroad Experts for UK, Australia, Europe & Italy",
    description: "Premium education consultancy helping students secure admissions, scholarships, visas, and placements at leading global universities.",
    images: ["https://annex-consultancy.vercel.app/og-image.png"],
  },
  icons: {
    icon: "/branding/annex-logo.png",
    shortcut: "/branding/annex-logo.png",
    apple: "/branding/annex-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <ScrollManager />
        {children}
        <Clarity />

        <GoogleAnalytics

          gaId={process.env.NEXT_PUBLIC_GA_ID!}

        />
      </body>
    </html>
  );
}
