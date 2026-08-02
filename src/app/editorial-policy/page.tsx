import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkle, ShieldCheck, Checks, Heart, LockKey } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Editorial Policy & E-E-A-T Quality Standards | Annex Consultancy",
  description: "Annex Consultancy's editorial policy, fact-checking standards, counselor certification verification, and student privacy policy.",
  alternates: {
    canonical: "https://annex-consultancy.com/editorial-policy",
  },
};

export default function EditorialPolicyPage() {
  return (
    <>
      <Navigation />
      <main className="flex-grow pt-24 md:pt-28 bg-white text-left">
        <Breadcrumbs items={[{ name: "Editorial Policy", url: "https://annex-consultancy.com/editorial-policy" }]} />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="max-w-3xl mb-14 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
              <ShieldCheck size={14} className="text-emerald-600" /> Trust & E-E-A-T Standards
            </span>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tight">
              Editorial Policy & Review Standards
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Annex Consultancy is committed to absolute accuracy, transparency, and ethical integrity across all published study abroad guides, tuition benchmarks, and visa information.
            </p>
          </div>

          <div className="max-w-4xl space-y-10">
            <Card className="p-8 border-hairline bg-white space-y-3">
              <h2 className="font-display font-bold text-xl text-primary">1. Certified Education Counselor Review</h2>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                All guides, visa requirement breakdowns, and university statistics published on annex-consultancy.com are authored or reviewed by certified overseas education advisors (including QEAC-certified principal counselors).
              </p>
            </Card>

            <Card className="p-8 border-hairline bg-white space-y-3">
              <h2 className="font-display font-bold text-xl text-primary">2. Fact-Checking & Policy Currency</h2>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                Study abroad regulations, GIC deposits, Blocked Account benchmarks, and visa policies (such as UK CAS or Canadian SDS rules) change frequently. We review and update our knowledge hub content on a monthly basis.
              </p>
            </Card>

            <Card className="p-8 border-hairline bg-white space-y-3">
              <h2 className="font-display font-bold text-xl text-primary">3. Ethical Counseling Pledge</h2>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                We maintain complete independence in university recommendations. We do not promote unaccredited institutions or mislead students regarding post-study work permit entitlements.
              </p>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
