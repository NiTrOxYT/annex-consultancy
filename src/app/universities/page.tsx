import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkle, GraduationCap, MapPin } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { TopCollegesSection } from "@/components/top-colleges";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Global Universities Directory | Study Abroad Partner Institutions",
  description: "Explore 150+ top-ranked accredited universities across UK, Australia, Canada, USA, Germany, Europe, and Dubai. Filter by ranking, tuition, and courses.",
  alternates: {
    canonical: "https://annex-consultancy.com/universities",
  },
};

export default function UniversitiesDirectoryPage() {
  return (
    <>
      <Navigation />
      <main className="flex-grow pt-24 md:pt-28 bg-white">
        <Breadcrumbs items={[{ name: "Universities Directory", url: "https://annex-consultancy.com/universities" }]} />

        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkle size={14} className="text-amber-500" weight="fill" />
              Global Directory
            </span>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tight">
              Top Ranked Partner Universities
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Explore leading universities offering high-demand undergraduate and postgraduate degrees with scholarship options and post-study work permits.
            </p>
          </div>
        </section>

        <TopCollegesSection country="all" showControls={true} />
      </main>
      <Footer />
    </>
  );
}
