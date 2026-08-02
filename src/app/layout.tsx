import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Clarity from "@/components/clarity";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ScrollManager } from "@/components/scroll-manager";
import { OrganizationSchema, LocalBusinessSchema } from "@/components/seo/structured-data";
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
  metadataBase: new URL("https://annex-consultancy.com"),
  title: {
    default: "Annex Consultancy | Best Study Abroad & Overseas Education Consultants",
    template: "%s | Annex Consultancy",
  },
  description: "Premier global education consultancy helping students secure overseas admissions, 100% scholarship guidance, student visas, and post-study work permits for UK, Australia, USA, Canada, Germany, Europe, Dubai & Italy.",
  keywords: [
    "Study Abroad Consultancy",
    "Overseas Education Consultants",
    "Student Visa Consultants",
    "Study in UK",
    "Study in Australia",
    "Study in Canada",
    "Study in Germany",
    "University Admissions Guidance",
    "SOP & LOR Writing Services",
    "IELTS PTE Test Preparation",
    "Abroad Study Consultants Kolkata India"
  ],
  authors: [{ name: "Annex Educational Consultancy", url: "https://annex-consultancy.com" }],
  creator: "Annex Consultancy",
  publisher: "Annex Consultancy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://annex-consultancy.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Annex Consultancy | Best Study Abroad & Overseas Education Consultants",
    description: "Premier global education consultancy helping students secure overseas admissions, scholarships, visas, and placements in top global universities.",
    url: "https://annex-consultancy.com",
    siteName: "Annex Consultancy",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://annex-consultancy.com/images/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Annex Consultancy - Overseas Education Experts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Annex Consultancy | Best Study Abroad & Overseas Education Consultants",
    description: "Premier global education consultancy helping students secure overseas admissions, scholarships, visas, and placements.",
    images: ["https://annex-consultancy.com/images/logo.jpeg"],
  },
  icons: {
    icon: "/images/logo.jpeg",
    shortcut: "/images/logo.jpeg",
    apple: "/images/logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <OrganizationSchema />
        <LocalBusinessSchema />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-800 selection:bg-primary selection:text-white flex flex-col min-h-screen`}
      >
        <ScrollManager />
        {children}
        <Clarity />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"} />
      </body>
    </html>
  );
}
