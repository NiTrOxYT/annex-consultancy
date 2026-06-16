import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Clarity from "@/components/clarity";
import { GoogleAnalytics } from "@next/third-parties/google";
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
  title: "Annex Education Consultancy | Premium Study Abroad & Test Prep",
  description: "Annex is a premium, modern education consultancy providing expert study abroad guidance for the UK, Australia, Europe, Dubai, and Italy, along with IELTS, PTE, and CMAT test preparation.",
  openGraph: {
    title: "Annex Education Consultancy",
    description: "Premium global education placement and admissions counseling.",
    type: "website",
    locale: "en_US",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Clarity />

        <GoogleAnalytics

          gaId={process.env.NEXT_PUBLIC_GA_ID!}

        />
        <GoogleAnalytics

          gaId={process.env.NEXT_PUBLIC_GA_ID!}

        />
      </body>
    </html>
  );
}
