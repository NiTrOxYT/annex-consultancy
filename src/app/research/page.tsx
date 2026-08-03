import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkle, ChartBar, ArrowRight, FileText } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Original Study Abroad Research & Industry Reports | Annex Consultancy",
  description: "Independent international education research hub. Access original reports on global tuition benchmarks, visa processing timelines, and scholarship availability.",
  alternates: {
    canonical: "https://annex-consultancy.com/research",
  },
};

const researchReports = [
  { slug: "global-tuition-benchmarks-2026", title: "Global Study Abroad Tuition & Living Cost Index 2026", desc: "Original benchmarking analysis comparing annual tuition fees, living expenses, and currency inflation across UK, Canada, Australia, USA, Germany, and Europe." },
  { slug: "visa-processing-timeline-analysis", title: "International Student Visa Processing Timeline Report", desc: "Empirical analysis evaluating UK CAS issuance, Canadian SDS Study Permits, Australian GS assessments, and German Blocked Account processing times." },
  { slug: "scholarship-availability-index", title: "Global Higher Education Scholarship Availability Index", desc: "Comprehensive research report analyzing full tuition waiver grants, Italian DSU stipends, and university merit bursary disbursal rates." }
];

export default function ResearchHubPage() {
  return (
    <>
      <Navigation />
      <main className="flex-grow pt-24 md:pt-28 bg-white">
        <Breadcrumbs items={[{ name: "Research Center", url: "https://annex-consultancy.com/research" }]} />

        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkle size={14} className="text-amber-500" weight="fill" />
              Original Intelligence
            </span>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tight">
              International Education Research Center
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Original research, empirical data analysis, and industry benchmark reports produced by Annex Consultancy's education intelligence team.
            </p>
          </div>
        </section>

        <section className="pb-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {researchReports.map((report) => (
                <Link key={report.slug} href={`/research/${report.slug}`} className="group">
                  <Card className="p-8 border-hairline hover:shadow-lg transition-all duration-300 bg-white h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <ChartBar size={24} weight="bold" />
                      </div>
                      <CardTitle className="text-xl font-bold text-primary group-hover:text-slate-900 transition-colors">
                        {report.title}
                      </CardTitle>
                      <CardDescription className="text-slate-600 text-xs leading-relaxed">
                        {report.desc}
                      </CardDescription>
                    </div>
                    <div className="pt-6 flex items-center gap-2 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                      Read Full Research Report <ArrowRight size={14} />
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
