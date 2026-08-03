import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkle, GraduationCap, ArrowRight, CurrencyInr } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Global Scholarships Directory & Financial Aid | Annex Consultancy",
  description: "Search 100+ international study scholarships, government grants, and university tuition waivers (Italian DSU, UK Chevening, Australia Go8 Bursaries, DAAD Germany).",
  alternates: {
    canonical: "https://annex-consultancy.com/scholarships",
  },
};

const scholarshipList = [
  { slug: "italian-dsu-scholarship", title: "Italian DSU Regional Scholarship", country: "Italy", coverage: "100% Tuition + €7,000 Stipend", desc: "Regional government grant for public state universities covering full tuition, free canteen, and cash living allowance based on family income." },
  { slug: "uk-chevening-scholarship", title: "UK Chevening Scholarships", country: "United Kingdom", coverage: "100% Full Funding", desc: "UK Government's global scholarship program offering full tuition, monthly living allowance, and return flights for Master's programs." },
  { slug: "australia-go8-merit-bursary", title: "Australia Go8 International Merit Bursary", country: "Australia", coverage: "15% - 50% Tuition Waiver", desc: "Merit-based fee reductions awarded by Group of Eight universities to qualified international Master's and Bachelor's applicants." },
  { slug: "daad-germany-scholarship", title: "DAAD Postgraduate Scholarships", country: "Germany", coverage: "€934/month Stipend + Insurance", desc: "German Academic Exchange Service grants for Master's and PhD students at public German universities." }
];

export default function ScholarshipsDirectoryPage() {
  return (
    <>
      <Navigation />
      <main className="flex-grow pt-24 md:pt-28 bg-white">
        <Breadcrumbs items={[{ name: "Scholarships Directory", url: "https://annex-consultancy.com/scholarships" }]} />

        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkle size={14} className="text-amber-500" weight="fill" />
              Scholarship Intelligence
            </span>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tight">
              Global Study Abroad Scholarships Directory
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Explore government grants, merit-based tuition waivers, and financial aid opportunities to fund your overseas degree.
            </p>
          </div>
        </section>

        <section className="pb-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {scholarshipList.map((sch) => (
                <Link key={sch.slug} href={`/scholarships/${sch.slug}`} className="group">
                  <Card className="p-8 border-hairline hover:shadow-lg transition-all duration-300 bg-white h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                          <GraduationCap size={24} weight="bold" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                          {sch.coverage}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-bold text-primary group-hover:text-slate-900 transition-colors">
                        {sch.title}
                      </CardTitle>
                      <CardDescription className="text-slate-600 text-xs leading-relaxed">
                        {sch.desc}
                      </CardDescription>
                    </div>
                    <div className="pt-6 flex items-center gap-2 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                      View Eligibility & Application Steps <ArrowRight size={14} />
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
