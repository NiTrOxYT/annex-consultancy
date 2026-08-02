import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkle, BookOpen, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Pillar Knowledge Guides | Study Abroad, Visas & SOP Masterclass",
  description: "Exhaustive 2,000+ word study abroad guides: Complete Study Abroad Guide, Student Visa Masterclass, Scholarship Directory, and SOP Drafting Framework.",
  alternates: {
    canonical: "https://annex-consultancy.com/guides",
  },
};

const guidesList = [
  { slug: "study-abroad-guide", title: "Complete Overseas Education Master Guide", desc: "Step-by-step masterclass covering profile evaluation, university shortlisting, entrance exams, CAS/GIC filings, and landing support." },
  { slug: "student-visa-guide", title: "Global Student Visa Approval Playbook", desc: "Exhaustive guide to UK Student Visas, Canadian Study Permits, Australian Subclass 500, US F-1 interview prep, and German Blocked Accounts." },
  { slug: "scholarship-guide", title: "100% Scholarship & Financial Aid Guide", desc: "How to secure Italian DSU grants (€7,000 annual stipend), UK Chevening, Australian Go8 bursaries, and merit fee waivers." },
  { slug: "sop-writing-guide", title: "SOP & LOR Statement Writing Framework", desc: "Proven editorial guide to writing original, plagiarism-free Statements of Purpose that satisfy top university admission committees." }
];

export default function GuidesDirectoryPage() {
  return (
    <>
      <Navigation />
      <main className="flex-grow pt-24 md:pt-28 bg-white">
        <Breadcrumbs items={[{ name: "Pillar Guides", url: "https://annex-consultancy.com/guides" }]} />

        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkle size={14} className="text-amber-500" weight="fill" />
              Pillar Guides
            </span>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tight">
              Master Study Abroad Knowledge Hub
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Exhaustive, expert-authored pillar guides detailing every step of international higher education and visa filings.
            </p>
          </div>
        </section>

        <section className="pb-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {guidesList.map((guide) => (
                <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group">
                  <Card className="p-8 border-hairline hover:shadow-lg transition-all duration-300 bg-white h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <BookOpen size={24} weight="bold" />
                      </div>
                      <CardTitle className="text-xl font-bold text-primary group-hover:text-slate-900 transition-colors">
                        {guide.title}
                      </CardTitle>
                      <CardDescription className="text-slate-600 text-xs leading-relaxed">
                        {guide.desc}
                      </CardDescription>
                    </div>
                    <div className="pt-6 flex items-center gap-2 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                      Read Full Masterclass <ArrowRight size={14} />
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
