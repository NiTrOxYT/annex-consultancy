import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkle, Newspaper, ShieldCheck, Certificate, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Media Center, Press Releases & Certifications | Annex Consultancy",
  description: "Official press releases, media announcements, counselor QEAC certifications, and institutional university partner updates for Annex Consultancy.",
  alternates: {
    canonical: "https://annex-consultancy.com/media",
  },
};

const mediaAnnouncements = [
  {
    title: "Annex Consultancy Expands Free University Counseling Services in Kolkata & Eastern India",
    date: "July 2026",
    category: "Press Release",
    desc: "Annex Consultancy announces expanded direct university partnership agreements for 2026/2027 academic intakes, offering 100% free counseling and visa assistance."
  },
  {
    title: "QEAC & British Council Certified Counselors Pass Annual Compliance Audit",
    date: "June 2026",
    category: "Certification",
    desc: "All senior education advisors at Annex Consultancy completed recertification in UK, Australian, and Canadian international education regulations."
  },
  {
    title: "Annex Launches Interactive Student Eligibility & Tuition Calculator Platform",
    date: "May 2026",
    category: "Platform Launch",
    desc: "Students can now instantly compute overseas tuition fees, living costs, IELTS band scores, and visa eligibility online."
  }
];

export default function MediaCenterPage() {
  return (
    <>
      <Navigation />
      <main className="flex-grow pt-24 md:pt-28 bg-white">
        <Breadcrumbs items={[{ name: "Media Center", url: "https://annex-consultancy.com/media" }]} />

        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
              <ShieldCheck size={14} className="text-emerald-600" />
              Digital PR & Newsroom
            </span>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tight">
              Media Center & Official Press Releases
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Official press announcements, institutional partner updates, and certified counselor credentials from Annex Consultancy.
            </p>
          </div>
        </section>

        <section className="pb-20 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-8">
            {mediaAnnouncements.map((item, i) => (
              <Card key={i} className="p-8 border-hairline bg-white space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{item.date}</span>
                </div>
                <CardTitle className="text-xl font-bold text-primary">{item.title}</CardTitle>
                <CardDescription className="text-slate-600 text-xs md:text-sm leading-relaxed">
                  {item.desc}
                </CardDescription>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
