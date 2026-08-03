import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Sparkle, CheckCircle, GraduationCap, CurrencyInr, Calendar, Phone, ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FAQSchema } from "@/components/seo/structured-data";

interface ScholarshipDetail {
  slug: string;
  title: string;
  country: string;
  coverage: string;
  deadline: string;
  overview: string;
  eligibility: string[];
  documentsRequired: string[];
  officialSource: string;
  faqs: { question: string; answer: string }[];
}

const scholarshipDataMap: Record<string, ScholarshipDetail> = {
  "italian-dsu-scholarship": {
    slug: "italian-dsu-scholarship",
    title: "Italian DSU Regional Scholarship Guide",
    country: "Italy",
    coverage: "100% Tuition Waiver + Free Canteen + €7,000 Annual Cash Stipend",
    deadline: "August / September (Annual Deadline)",
    overview: "The DSU (Diritto allo Studio Universitario) is a financial need grant awarded by regional Italian governments to enrolled students at public state universities in regions like Lombardy, Lazio, Veneto, and Tuscany.",
    eligibility: [
      "Family income within regional ISEE Parificato threshold (approx < €25,000/year)",
      "Unconditional or conditional offer from an Italian public university",
      "Valid passport and apostilled family composition documents"
    ],
    documentsRequired: [
      "Family Income Certificate (Apostilled & Translated into Italian)",
      "Property Ownership / Lease Documents",
      "ISEE Parificato declaration from official CAF office in Italy",
      "University Pre-Enrollment Summary"
    ],
    officialSource: "Regional Italian DSU Portals (e.g. EDISU, DSU Toscana, Disco Lazio)",
    faqs: [
      { question: "Do I need top marks to qualify for DSU?", answer: "First-year DSU qualification is based on financial need (ISEE Parificato), not high competitive entrance marks." }
    ]
  },
  "uk-chevening-scholarship": {
    slug: "uk-chevening-scholarship",
    title: "UK Chevening Scholarships Guide",
    country: "United Kingdom",
    coverage: "100% Full Tuition + Monthly Living Stipend + Return Flights",
    deadline: "November (Annual Global Deadline)",
    overview: "Chevening is the UK Government's international awards program funded by the Foreign, Commonwealth & Development Office (FCDO) offering full funding for 1-year Master's degrees at any UK university.",
    eligibility: [
      "Minimum 2 years (2,800 hours) of work experience",
      "Unconditional offer from at least one UK university by July deadline",
      "Return to home country for minimum 2 years post-graduation"
    ],
    documentsRequired: [
      "2 Reference Letters (Academic & Professional)",
      "4 Chevening Essays (Leadership, Networking, Study in UK, Career Plan)",
      "Passport and Degree Transcripts"
    ],
    officialSource: "www.chevening.org",
    faqs: [
      { question: "What work experience counts for Chevening?", answer: "Full-time, part-time, voluntary, and paid or unpaid internships all count towards the 2,800-hour requirement." }
    ]
  }
};

export async function generateStaticParams() {
  return [
    { slug: "italian-dsu-scholarship" },
    { slug: "uk-chevening-scholarship" }
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolved = await params;
  const slugKey = (resolved?.slug || "").toLowerCase();
  const sch = scholarshipDataMap[slugKey];
  if (!sch) return { title: "Scholarship Not Found | Annex Consultancy" };

  return {
    title: `${sch.title} | Coverage, Eligibility & Application`,
    description: `Complete guide to ${sch.title} in ${sch.country}. Check funding amount, eligibility rules, required documents, and official application links.`,
    alternates: {
      canonical: `https://annex-consultancy.com/scholarships/${sch.slug}`,
    },
  };
}

export default async function ScholarshipDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params;
  const slugKey = (resolved?.slug || "").toLowerCase();
  const sch = scholarshipDataMap[slugKey];
  if (!sch) notFound();

  return (
    <>
      <FAQSchema faqs={sch.faqs} />
      <Navigation />

      <main className="flex-grow pt-24 md:pt-28 bg-white">
        <Breadcrumbs
          items={[
            { name: "Scholarships", url: "https://annex-consultancy.com/scholarships" },
            { name: sch.title, url: `https://annex-consultancy.com/scholarships/${sch.slug}` }
          ]}
        />

        {/* HERO */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
              <GraduationCap size={14} className="text-primary" /> {sch.country} Scholarship
            </span>

            <h1 className="font-display font-bold text-4xl md:text-6xl text-primary tracking-tight">
              {sch.title}
            </h1>

            <p className="text-base md:text-lg text-slate-600 max-w-3xl leading-relaxed">
              {sch.overview}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/contact">
                <Button variant="primary" size="lg">
                  Apply for {sch.country} Scholarships
                </Button>
              </Link>
              <a href="https://wa.me/918910882334" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg" className="gap-2">
                  <Phone size={18} /> Scholarship Counseling
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* METRICS */}
        <section className="py-10 bg-subtle-gray border-y border-hairline">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
              <Card className="p-6 border-hairline bg-white">
                <CurrencyInr size={28} className="text-emerald-700 mx-auto mb-2" />
                <span className="text-xs text-slate-400 font-bold uppercase">Funding Coverage</span>
                <p className="font-display font-bold text-lg text-emerald-800 mt-1">{sch.coverage}</p>
              </Card>

              <Card className="p-6 border-hairline bg-white">
                <Calendar size={28} className="text-primary mx-auto mb-2" />
                <span className="text-xs text-slate-400 font-bold uppercase">Application Deadline</span>
                <p className="font-display font-bold text-lg text-primary mt-1">{sch.deadline}</p>
              </Card>
            </div>
          </div>
        </section>

        {/* ELIGIBILITY & DOCUMENTS */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              <div className="space-y-6">
                <h2 className="font-display font-bold text-2xl md:text-3xl text-primary">
                  Eligibility Criteria
                </h2>
                <div className="space-y-3">
                  {sch.eligibility.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-subtle-gray border border-hairline">
                      <CheckCircle size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="font-display font-bold text-2xl md:text-3xl text-primary">
                  Required Application Documents
                </h2>
                <div className="space-y-3">
                  {sch.documentsRequired.map((doc, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-subtle-gray border border-hairline">
                      <CheckCircle size={20} className="text-primary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-slate-700">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
