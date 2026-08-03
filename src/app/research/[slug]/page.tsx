import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Sparkle, ChartBar, FileText, CheckCircle, DownloadSimple, Phone } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { QuickSummary } from "@/components/seo/quick-summary";
import { FAQSchema } from "@/components/seo/structured-data";

interface ResearchReportDetail {
  slug: string;
  title: string;
  publishedDate: string;
  methodology: string;
  sources: string[];
  takeaways: string[];
  sections: { heading: string; body: string }[];
  faqs: { question: string; answer: string }[];
}

const researchDataMap: Record<string, ResearchReportDetail> = {
  "global-tuition-benchmarks-2026": {
    slug: "global-tuition-benchmarks-2026",
    title: "Global Study Abroad Tuition & Living Cost Index 2026",
    publishedDate: "August 2026",
    methodology: "Data aggregated from 150+ accredited partner university fee schedules, official embassy living maintenance figures (UK Home Office, IRCC Canada, Australian Home Affairs, German Sperrkonto), and verified exchange rates.",
    sources: ["UK Home Office Guidance 2026", "IRCC Canada Study Permit Provisions", "Australian Department of Home Affairs", "German Federal Foreign Office"],
    takeaways: [
      "German public universities remain the lowest tuition option (€0 - €300 semester contribution)",
      "UK 1-year Master's programs offer the lowest total living cost duration compared to 2-year degrees",
      "Canada GIC benchmark stands at CAD $20,635 per year",
      "Australian living cost benchmark stands at A$24,505 per year"
    ],
    sections: [
      {
        heading: "1. Executive Summary & Market Findings",
        body: "Annual tuition costs for international students vary significantly across major study abroad destinations. While US and Australian universities represent higher upfront fees, European state institutions and Italian DSU scholarships provide subsidized alternatives."
      },
      {
        heading: "2. Total Cost of Attendance Breakdown",
        body: "Total cost of attendance includes tuition fees, mandatory health insurance (e.g. OSHC in Australia, NHS Surcharge in UK), living accommodation, and student visa application fees."
      }
    ],
    faqs: [
      { question: "How often is the Tuition Benchmark updated?", answer: "Annex Consultancy's research team updates fee schedules and living cost benchmarks every 6 months." }
    ]
  },
  "visa-processing-timeline-analysis": {
    slug: "visa-processing-timeline-analysis",
    title: "International Student Visa Processing Timeline Report",
    publishedDate: "August 2026",
    methodology: "Empirical tracking of 1,000+ student visa applications processed by Annex Consultancy across UK, Canada, Australia, Germany, and Schengen/Italy embassies.",
    sources: ["VFS Global Processing Updates", "TLScontact Analytics", "Official Embassy Visa Bulletins"],
    takeaways: [
      "UK Student Visas average 15-20 working days standard turnaround",
      "Canadian SDS Study Permits average 4-8 weeks processing",
      "Australian Subclass 500 visas average 3-6 weeks with completed GTE/GS verification",
      "German Student Visas require 6-10 weeks for embassy verification"
    ],
    sections: [
      {
        heading: "1. Turnaround Performance by Embassy",
        body: "Priority and Super Priority processing streams in the UK allow visa decisions within 5 working days or 24 hours, whereas German and Schengen student visas follow strict paper-dossier verification schedules."
      }
    ],
    faqs: [
      { question: "Can visa processing be expedited?", answer: "Yes, select destinations like the UK offer Priority and Super Priority processing streams for urgent intakes." }
    ]
  }
};

export async function generateStaticParams() {
  return [
    { slug: "global-tuition-benchmarks-2026" },
    { slug: "visa-processing-timeline-analysis" }
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolved = await params;
  const slugKey = (resolved?.slug || "").toLowerCase();
  const report = researchDataMap[slugKey];
  if (!report) return { title: "Report Not Found | Annex Consultancy" };

  return {
    title: `${report.title} | Annex Research Center`,
    description: `${report.methodology.substring(0, 155)}...`,
    alternates: {
      canonical: `https://annex-consultancy.com/research/${report.slug}`,
    },
  };
}

export default async function ResearchReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params;
  const slugKey = (resolved?.slug || "").toLowerCase();
  const report = researchDataMap[slugKey];
  if (!report) notFound();

  return (
    <>
      <FAQSchema faqs={report.faqs} />
      <Navigation />

      <main className="flex-grow pt-24 md:pt-28 bg-white">
        <Breadcrumbs
          items={[
            { name: "Research Center", url: "https://annex-consultancy.com/research" },
            { name: report.title, url: `https://annex-consultancy.com/research/${report.slug}` }
          ]}
        />

        {/* HERO */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
                <ChartBar size={14} className="text-primary" /> Original Research Report
              </span>
              <span className="text-xs text-slate-400 font-semibold">Published: {report.publishedDate}</span>
            </div>

            <h1 className="font-display font-bold text-4xl md:text-6xl text-primary tracking-tight">
              {report.title}
            </h1>
          </div>
        </section>

        {/* SUMMARY BOX */}
        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <QuickSummary
              title="Research Executive Summary"
              readingTimeMinutes={6}
              lastUpdated={report.publishedDate}
              keyTakeaways={report.takeaways}
            />
          </div>
        </section>

        {/* METHODOLOGY & CONTENT */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-10">
            <Card className="p-8 border-hairline bg-subtle-gray/40 space-y-3">
              <h2 className="font-display font-bold text-xl text-primary">Research Methodology & Sourcing</h2>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{report.methodology}</p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                {report.sources.map((s, i) => (
                  <span key={i} className="bg-white px-2.5 py-1 rounded-md border border-hairline">
                    Source: {s}
                  </span>
                ))}
              </div>
            </Card>

            {report.sections.map((sec, i) => (
              <div key={i} className="space-y-3">
                <h2 className="font-display font-bold text-2xl text-primary">{sec.heading}</h2>
                <p className="text-slate-700 text-sm md:text-base leading-relaxed">{sec.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
