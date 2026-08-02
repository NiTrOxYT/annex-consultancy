import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkle, CaretDown, Phone } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FAQSchema } from "@/components/seo/structured-data";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Study Abroad & Visas",
  description: "Comprehensive study abroad FAQ hub. Get clear answers on university admissions, student visas, scholarships, IELTS requirements, and financial proofing.",
  alternates: {
    canonical: "https://annex-consultancy.com/faq",
  },
};

const MASTER_FAQS = [
  {
    category: "Admissions & Applications",
    question: "What documents are required to apply to overseas universities?",
    answer: "Generally, you need: 1) High school and college marksheets/transcripts, 2) Passport copy, 3) Statement of Purpose (SOP), 4) 2-3 Letters of Recommendation (LORs), 5) Standardized test scorecards (IELTS/PTE/TOEFL/GRE/GMAT), and 6) Updated Academic Resume."
  },
  {
    category: "Student Visas & Work Rights",
    question: "What is the success rate of student visas processed by Annex Consultancy?",
    answer: "Annex Consultancy maintains a 98.4% visa approval record across UK, Australia, Canada, USA, Germany, and Europe through meticulous document auditing and mock embassy interview prep."
  },
  {
    category: "Scholarships & Financial Aid",
    question: "How can I apply for 100% scholarships or Italian DSU grants?",
    answer: "DSU regional scholarships in Italy cover 100% tuition fees, free canteen meals, and up to €7,000 annual cash stipends based on family income evaluation. Annex Consultancy assists with full DSU document preparation, CIMEA comparability, and university pre-enrollments."
  },
  {
    category: "Test Preparation & Waivers",
    question: "Can I get an IELTS waiver for studying abroad?",
    answer: "Yes, select universities in the UK, Australia, and Europe grant IELTS waivers if you scored 70%+ in Class 12th English or studied in an English Medium of Instruction (MOI) institution."
  }
];

export default function FAQHubPage() {
  return (
    <>
      <FAQSchema faqs={MASTER_FAQS} />
      <Navigation />
      <main className="flex-grow pt-24 md:pt-28 bg-white">
        <Breadcrumbs items={[{ name: "FAQ Knowledge Hub", url: "https://annex-consultancy.com/faq" }]} />

        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkle size={14} className="text-amber-500" weight="fill" />
              Knowledge Hub
            </span>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tight">
              Study Abroad FAQ Knowledge Hub
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Find answers to common questions about international university admissions, visa applications, scholarship criteria, and post-study work permits.
            </p>
          </div>
        </section>

        <section className="pb-20 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-6">
            {MASTER_FAQS.map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl border border-hairline bg-subtle-gray/30 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                  {faq.category}
                </span>
                <h2 className="font-display font-bold text-lg text-primary">{faq.question}</h2>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
