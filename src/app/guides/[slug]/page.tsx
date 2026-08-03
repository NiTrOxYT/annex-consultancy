import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Sparkle, CheckCircle, BookOpen, Phone } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { QuickSummary } from "@/components/seo/quick-summary";
import { HowToSchema } from "@/components/seo/extended-schemas";
import { FAQSchema } from "@/components/seo/structured-data";

interface GuideDetail {
  slug: string;
  title: string;
  category: string;
  lastUpdated: string;
  readingTime: number;
  overview: string;
  takeaways: string[];
  entities: { name: string; url?: string }[];
  sections: { heading: string; body: string }[];
  faqs: { question: string; answer: string }[];
}

const guidesDataMap: Record<string, GuideDetail> = {
  "study-abroad-guide": {
    slug: "study-abroad-guide",
    title: "The Ultimate Master Guide to Studying Abroad",
    category: "Overseas Education Pillar",
    lastUpdated: "August 2026",
    readingTime: 8,
    overview: "Studying abroad is one of the most transformative decisions of your academic and professional life. This comprehensive guide breaks down university selection, document preparation, tuition budgeting, visa filings, and landing arrangements.",
    takeaways: [
      "Begin profile auditing 8-12 months before your target intake",
      "Shortlist universities based on academic GPA, budget, and post-study work permit rights",
      "Draft bespoke, plagiarism-free Statements of Purpose (SOP)",
      "Secure early offer letters to lock in university merit scholarships",
      "Prepare mandatory financial proofing (UK CAS, Canada GIC, German Blocked Account)"
    ],
    entities: [
      { name: "IELTS / PTE", url: "/test-preparation" },
      { name: "SOP Guidance", url: "/guides/sop-writing-guide" },
      { name: "GIC Deposit", url: "/glossary/gic" },
      { name: "CAS Letter", url: "/glossary/cas" }
    ],
    sections: [
      {
        heading: "1. Profile Assessment & Target Shortlisting",
        body: "Begin by auditing your academic standing (GPA/percentage), standardized test scores (IELTS/PTE), backlog history, and financial budget. Match your profile with safety, target, and reach universities offering high post-study work permit rights."
      },
      {
        heading: "2. Document Preparation & Statement of Purpose (SOP)",
        body: "Your SOP is your personal narrative to admission committees. Focus on academic motivations, relevant projects, career goals, and specific reasons for choosing the target university."
      },
      {
        heading: "3. Admission Offer Acceptance & Visa Dossier",
        body: "Upon receiving your conditional or unconditional offer letter, deposit the initial fee to secure your CAS (UK), I-20 (USA), or Letter of Acceptance (Canada). Prepare GIC or Blocked Account proofing for embassy submission."
      }
    ],
    faqs: [
      { question: "How early should I start my study abroad application?", answer: "Start 8 to 12 months prior to your target intake to allow ample time for test preparation, SOP editing, and visa processing." }
    ]
  },
  "student-visa-guide": {
    slug: "student-visa-guide",
    title: "Global Student Visa Approval Playbook",
    category: "Visa & Immigration",
    lastUpdated: "August 2026",
    readingTime: 6,
    overview: "Navigating international student visas requires complete accuracy. Learn the exact financial proofing, health checks, and embassy interview techniques for UK, Australia, Canada, USA, Germany, and Europe.",
    takeaways: [
      "UK Student Visas require a valid 14-digit CAS electronic reference",
      "Canadian SDS Study Permits require IELTS 6.5+ and CAD $20,635 GIC deposit",
      "Australian Genuine Student (GS) criteria require 3 months bank history",
      "German Student Visas require an official €11,208 Sperrkonto Blocked Account",
      "Mock embassy interview prep significantly increases first-time visa approval"
    ],
    entities: [
      { name: "CAS Reference", url: "/glossary/cas" },
      { name: "GIC Requirement", url: "/glossary/gic" },
      { name: "German Blocked Account", url: "/glossary/blocked-account" },
      { name: "Canada PGWP", url: "/glossary/pgwp" }
    ],
    sections: [
      {
        heading: "1. UK Student Visa (CAS & Priority Options)",
        body: "The UK Student Visa requires 70 points under the point-based system (50 points for CAS, 10 for English, 10 for financial maintenance). Standard processing takes 3 weeks."
      },
      {
        heading: "2. Canadian Study Permit (GIC & SDS)",
        body: "Canadian Study Permits under SDS require IELTS 6.5+, a CAD $20,635 GIC deposit, and upfront medical exam certificates."
      }
    ],
    faqs: [
      { question: "What is Annex Consultancy's visa approval rate?", answer: "We sustain a 98.4% visa approval record through mock interview practice and meticulous file verification." }
    ]
  }
};

export async function generateStaticParams() {
  return [
    { slug: "study-abroad-guide" },
    { slug: "student-visa-guide" }
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolved = await params;
  const slugKey = (resolved?.slug || "").toLowerCase();
  const guide = guidesDataMap[slugKey];
  if (!guide) return { title: "Guide Not Found | Annex Consultancy" };

  return {
    title: `${guide.title} | Annex Consultancy Pillar Guide`,
    description: `${guide.overview.substring(0, 155)}...`,
    alternates: {
      canonical: `https://annex-consultancy.com/guides/${guide.slug}`,
    },
  };
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params;
  const slugKey = (resolved?.slug || "").toLowerCase();
  const guide = guidesDataMap[slugKey];
  if (!guide) notFound();

  const howToSteps = guide.sections.map((sec) => ({
    name: sec.heading,
    text: sec.body,
  }));

  return (
    <>
      <HowToSchema
        name={guide.title}
        description={guide.overview}
        steps={howToSteps}
      />
      <FAQSchema faqs={guide.faqs} />
      <Navigation />

      <main className="flex-grow pt-24 md:pt-28 bg-white">
        <Breadcrumbs
          items={[
            { name: "Pillar Guides", url: "https://annex-consultancy.com/guides" },
            { name: guide.title, url: `https://annex-consultancy.com/guides/${guide.slug}` }
          ]}
        />

        {/* HERO */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
              <BookOpen size={14} className="text-primary" /> {guide.category}
            </span>

            <h1 className="font-display font-bold text-4xl md:text-6xl text-primary tracking-tight">
              {guide.title}
            </h1>

            <p className="text-base md:text-lg text-slate-600 max-w-3xl leading-relaxed">
              {guide.overview}
            </p>
          </div>
        </section>

        {/* EXECUTIVE SUMMARY / QUICK SUMMARY */}
        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <QuickSummary
              readingTimeMinutes={guide.readingTime}
              lastUpdated={guide.lastUpdated}
              keyTakeaways={guide.takeaways}
              entities={guide.entities}
            />
          </div>
        </section>

        {/* CONTENT SECTIONS */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-10">
            {guide.sections.map((sec, i) => (
              <div key={i} className="space-y-3">
                <h2 className="font-display font-bold text-2xl text-primary">{sec.heading}</h2>
                <p className="text-slate-700 text-sm md:text-base leading-relaxed">{sec.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-white text-center">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-4">
            <h2 className="font-display font-bold text-3xl text-white">Need Expert One-on-One Guidance?</h2>
            <p className="text-slate-300 text-xs md:text-sm max-w-xl mx-auto">
              Connect with our QEAC-certified counseling team for document auditing and university applications.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="lg" className="bg-white text-primary hover:bg-slate-100 font-bold">
                Book Free Counseling Session
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
