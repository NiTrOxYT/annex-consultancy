import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkle, Scales, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Study Abroad Country & Degree Comparison Tool | Annex Consultancy",
  description: "Compare study abroad destinations side-by-side. Tuition fees, living costs, post-study work permits, PR pathways, and university rankings.",
  alternates: {
    canonical: "https://annex-consultancy.com/compare",
  },
};

const comparisonsList = [
  { slug: "canada-vs-australia", title: "Study in Canada vs Australia", desc: "Compare tuition fees, PGWP vs PSWR work rights, GIC vs GS requirements, and PR immigration pathways." },
  { slug: "uk-vs-canada", title: "Study in UK vs Canada", desc: "Compare 1-year Master's in the UK vs 2-year Master's in Canada, Graduate Route vs PGWP visas, and living costs." },
  { slug: "germany-vs-italy", title: "Study in Germany vs Italy", desc: "Compare tuition-free German public universities vs Italian state universities with 100% DSU scholarships." },
  { slug: "mba-uk-vs-mba-canada", title: "MBA in UK vs MBA in Canada", desc: "Compare business school entry criteria, GMAT requirements, fees, average salaries, and post-MBA work permits." },
  { slug: "ielts-vs-pte", title: "IELTS Academic vs PTE Academic", desc: "Compare test formats, scoring difficulty, university acceptance, and preparation strategies." },
  { slug: "sds-vs-non-sds", title: "Canada SDS vs Non-SDS Study Permit", desc: "Compare Student Direct Stream (SDS) visa processing times, financial proofing, and success rates." }
];

export default function CompareDirectoryPage() {
  return (
    <>
      <Navigation />
      <main className="flex-grow pt-24 md:pt-28 bg-white">
        <Breadcrumbs items={[{ name: "Comparisons", url: "https://annex-consultancy.com/compare" }]} />

        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkle size={14} className="text-amber-500" weight="fill" />
              Decision Guides
            </span>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tight">
              Study Abroad Comparison Directory
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Make informed decisions with side-by-side comparisons of tuition costs, visa work rights, living expenses, and academic systems.
            </p>
          </div>
        </section>

        <section className="pb-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {comparisonsList.map((comp) => (
                <Link key={comp.slug} href={`/compare/${comp.slug}`} className="group">
                  <Card className="p-8 border-hairline hover:shadow-lg transition-all duration-300 bg-white h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <Scales size={24} weight="bold" />
                      </div>
                      <CardTitle className="text-xl font-bold text-primary group-hover:text-slate-900 transition-colors">
                        {comp.title}
                      </CardTitle>
                      <CardDescription className="text-slate-600 text-xs leading-relaxed">
                        {comp.desc}
                      </CardDescription>
                    </div>
                    <div className="pt-6 flex items-center gap-2 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                      View Full Comparison <ArrowRight size={14} />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
