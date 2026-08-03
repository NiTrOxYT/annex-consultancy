import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkle, Bookmark, ArrowRight, Tag } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { DefinedTermSetSchema } from "@/components/seo/extended-schemas";

export const metadata: Metadata = {
  title: "A-Z Study Abroad Glossary & Knowledge Base | Annex Consultancy",
  description: "Comprehensive A-Z dictionary of international education terms, visas, scholarships, and admission entities (CAS, GIC, PGWP, PSWR, DSU, Blocked Account, APS).",
  alternates: {
    canonical: "https://annex-consultancy.com/glossary",
  },
};

export const glossaryTermsList = [
  { slug: "cas", name: "CAS (Confirmation of Acceptance for Studies)", category: "United Kingdom", desc: "Official electronic reference number issued by UK universities required for submitting a UK Student Visa application." },
  { slug: "gic", name: "GIC (Guaranteed Investment Certificate)", category: "Canada", desc: "Mandatory CAD $20,635 financial deposit in a Canadian bank demonstrating first-year living expense funds for Study Permits." },
  { slug: "pgwp", name: "PGWP (Post-Graduation Work Permit)", category: "Canada", desc: "Work permit allowing eligible international graduates from Canadian DLI institutions to work in Canada for up to 3 years." },
  { slug: "pswr", name: "PSWR (Post-Study Work Right)", category: "Australia / UK", desc: "Post-study visa allowing international graduates to live and gain professional work experience for 2 to 4 years." },
  { slug: "dsu", name: "DSU Scholarship (Diritto allo Studio Universitario)", category: "Italy", desc: "Regional Italian government financial need grant offering 100% tuition waiver, free canteen meals, and up to €7,000 cash stipend." },
  { slug: "blocked-account", name: "Sperrkonto (German Blocked Account)", category: "Germany", desc: "Mandatory German bank account containing €11,208 to prove living funds for German Student Visas." },
  { slug: "aps", name: "APS Certificate (Akademische Prüfstelle)", category: "Germany", desc: "Mandatory academic document verification certificate required for Indian applicants applying to German universities." },
  { slug: "sds", name: "SDS (Student Direct Stream)", category: "Canada", desc: "Accelerated study permit processing stream for international students with GIC and IELTS 6.5+ qualifications." },
  { slug: "ucas", name: "UCAS (Universities and Colleges Admissions Service)", category: "United Kingdom", desc: "Centralized application portal for undergraduate admissions at universities across the United Kingdom." },
  { slug: "moi", name: "MOI (Medium of Instruction Certificate)", category: "Global", desc: "Official letter from your university verifying that your prior degree was taught entirely in English, used for IELTS waivers." }
];

export default function GlossaryHubPage() {
  const schemaTerms = glossaryTermsList.map((t) => ({
    name: t.name,
    description: t.desc,
    url: `https://annex-consultancy.com/glossary/${t.slug}`,
  }));

  return (
    <>
      <DefinedTermSetSchema terms={schemaTerms} />
      <Navigation />
      <main className="flex-grow pt-24 md:pt-28 bg-white">
        <Breadcrumbs items={[{ name: "A-Z Glossary", url: "https://annex-consultancy.com/glossary" }]} />

        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkle size={14} className="text-amber-500" weight="fill" />
              Entity Knowledge Base
            </span>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tight">
              Study Abroad A–Z Glossary & Terminology Hub
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Clear, expert definitions and entity relationships for essential international education, visa, scholarship, and immigration terms.
            </p>
          </div>
        </section>

        <section className="pb-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {glossaryTermsList.map((item) => (
                <Link key={item.slug} href={`/glossary/${item.slug}`} className="group">
                  <Card className="p-7 border-hairline hover:shadow-lg transition-all duration-300 bg-white h-full flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                          {item.category}
                        </span>
                        <Bookmark size={20} className="text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                      <CardTitle className="text-lg font-bold text-primary group-hover:text-slate-900 transition-colors">
                        {item.name}
                      </CardTitle>
                      <CardDescription className="text-slate-600 text-xs leading-relaxed">
                        {item.desc}
                      </CardDescription>
                    </div>
                    <div className="pt-4 flex items-center gap-2 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                      Read Full Definition & Guide <ArrowRight size={14} />
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
