import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkle, FileText, DownloadSimple, ArrowRight, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Free Study Abroad Student Resources, Checklists & SOP Templates",
  description: "Download free SOP writing guides, student visa document checklists, GIC/Blocked account guides, and university admission timelines.",
  alternates: {
    canonical: "https://annex-consultancy.com/resources",
  },
};

const resources = [
  { title: "Master SOP Drafting Checklist", type: "PDF Guide", desc: "Step-by-step framework to draft a compelling, plagiarism-free Statement of Purpose for UK, US, and Canadian universities." },
  { title: "UK Student Visa CAS Checklist", type: "Document", desc: "Comprehensive checklist of financial proofing, TB tests, and CAS issuance steps for UK Student Visas." },
  { title: "German Blocked Account & APS Guide", type: "PDF Guide", desc: "Detailed breakdown of APS certificate verification and Expatrio/Coracle blocked account deposits." },
  { title: "Italian DSU Scholarship Checklist", type: "Guide", desc: "Complete guide on family income certification, CIMEA statement of comparability, and Italian state university pre-enrollment." }
];

export default function ResourceCenterPage() {
  return (
    <>
      <Navigation />
      <main className="flex-grow pt-24 md:pt-28 bg-white">
        <Breadcrumbs items={[{ name: "Resource Center", url: "https://annex-consultancy.com/resources" }]} />

        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkle size={14} className="text-amber-500" weight="fill" />
              Student Toolkit
            </span>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tight">
              Free Study Abroad Student Resources
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Essential checklists, templates, and guides to help you navigate your international university admission and visa journey.
            </p>
          </div>
        </section>

        <section className="pb-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {resources.map((res, i) => (
                <Card key={i} className="p-8 border-hairline bg-subtle-gray/30 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <FileText size={24} weight="bold" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                      {res.type}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-primary">{res.title}</CardTitle>
                  <CardDescription className="text-slate-600 text-xs leading-relaxed">{res.desc}</CardDescription>
                  <Link href="/contact" className="inline-block pt-2">
                    <Button variant="primary" size="sm" className="gap-2 text-xs font-bold">
                      <DownloadSimple size={16} /> Request Free Guide
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
