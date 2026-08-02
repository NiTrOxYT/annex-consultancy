import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkle, Calculator, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Interactive Study Abroad Calculators & Tools | Annex Consultancy",
  description: "Free study abroad calculators: Tuition & Budget Calculator, IELTS Overall Band Score Calculator, GPA Converter, and Country Comparison Tool.",
  alternates: {
    canonical: "https://annex-consultancy.com/tools",
  },
};

const toolsList = [
  { slug: "tuition-calculator", name: "Study Abroad Budget & Tuition Calculator", desc: "Calculate estimated tuition fees, living costs, health insurance, and proof of funds required per destination." },
  { slug: "ielts-band-calculator", name: "IELTS Band Score Calculator", desc: "Calculate your overall IELTS Band Score based on listening, reading, writing, and speaking section scores." },
  { slug: "gpa-converter", name: "Indian Percentage to US/European GPA Converter", desc: "Convert Class 12 / Bachelor's percentage or 10-point CGPA to 4.0 US GPA scale and European ECTS grading." },
  { slug: "country-comparator", name: "Interactive Country Selector & Comparator", desc: "Filter and compare destinations by tuition budget, post-study work visa rights, and major intakes." }
];

export default function ToolsDirectoryPage() {
  return (
    <>
      <Navigation />
      <main className="flex-grow pt-24 md:pt-28 bg-white">
        <Breadcrumbs items={[{ name: "Interactive Tools", url: "https://annex-consultancy.com/tools" }]} />

        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkle size={14} className="text-amber-500" weight="fill" />
              Student Calculators
            </span>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tight">
              Interactive Study Abroad Tools
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Use our free, crawlable interactive calculators to plan your budget, convert GPA scores, and compute IELTS benchmarks.
            </p>
          </div>
        </section>

        <section className="pb-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {toolsList.map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group">
                  <Card className="p-8 border-hairline hover:shadow-lg transition-all duration-300 bg-white h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <Calculator size={24} weight="bold" />
                      </div>
                      <CardTitle className="text-xl font-bold text-primary group-hover:text-slate-900 transition-colors">
                        {tool.name}
                      </CardTitle>
                      <CardDescription className="text-slate-600 text-xs leading-relaxed">
                        {tool.desc}
                      </CardDescription>
                    </div>
                    <div className="pt-6 flex items-center gap-2 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                      Open Calculator <ArrowRight size={14} />
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
