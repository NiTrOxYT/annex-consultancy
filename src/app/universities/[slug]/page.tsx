import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Sparkle, Checks, CheckCircle, GraduationCap, CurrencyInr, Calendar, Phone, Trophy, MapPin } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { CollegeOrUniversitySchema } from "@/components/seo/extended-schemas";
import { FAQSchema } from "@/components/seo/structured-data";

interface UniversityDetail {
  slug: string;
  name: string;
  country: string;
  city: string;
  ranking: string;
  fees: string;
  intakes: string;
  overview: string;
  popularCourses: string[];
  requirements: string[];
  scholarships: string[];
  faqs: { question: string; answer: string }[];
}

const universitiesData: Record<string, UniversityDetail> = {
  "university-of-westminster": {
    slug: "university-of-westminster",
    name: "University of Westminster",
    country: "United Kingdom",
    city: "London",
    ranking: "Top 700 QS World Rankings",
    fees: "£15,000 - £22,000 / year",
    intakes: "September / January",
    overview: "Located in central London, the University of Westminster offers industry-accredited Master's and Bachelor's degree programs with extensive career links.",
    popularCourses: ["MBA", "MSc Finance", "MSc Data Science", "BA Fashion Business"],
    requirements: ["Minimum 60% in Bachelor's / Class 12", "IELTS 6.5 (or Class 12 English 70% Waiver)", "Statement of Purpose (SOP)"],
    scholarships: ["International Vice-Chancellor's Scholarship (£2,000 - £5,000)"],
    faqs: [
      { question: "Is University of Westminster in central London?", answer: "Yes, its main campuses are located in Regent Street, Cavendish, and Marylebone in central London." }
    ]
  },
  "macquarie-university": {
    slug: "macquarie-university",
    name: "Macquarie University",
    country: "Australia",
    city: "Sydney",
    ranking: "Top 130 QS World Rankings",
    fees: "A$38,000 - A$46,000 / year",
    intakes: "February / July",
    overview: "Macquarie University in Sydney is famous for its high-tech campus, world-class business school, and strong graduate employment outcomes.",
    popularCourses: ["Master of Data Science", "Master of Business Analytics", "Bachelor of IT"],
    requirements: ["Minimum 65% academic score", "IELTS 6.5 with no band < 6.0", "GTE Genuine Student Assessment"],
    scholarships: ["Vice-Chancellor's International Scholarship (A$10,000 fee reduction)"],
    faqs: [
      { question: "Does Macquarie University offer post-study work visas?", answer: "Yes, eligible graduates can apply for 2 to 4 years of Australian Post-Study Work Rights." }
    ]
  },
  "university-of-toronto": {
    slug: "university-of-toronto",
    name: "University of Toronto",
    country: "Canada",
    city: "Toronto",
    ranking: "Top 21 QS World Rankings",
    fees: "CAD $45,000 - $65,000 / year",
    intakes: "September (Fall)",
    overview: "Canada's top-ranked research university offering elite programs in Computer Science, Business Administration, Engineering, and Medicine.",
    popularCourses: ["Master of Applied Computing", "Rotman MBA", "Bachelor of Computer Science"],
    requirements: ["GPA 3.3+ / 75%+", "IELTS 7.0 (no band < 6.5)", "GRE / GMAT for competitive programs"],
    scholarships: ["Lester B. Pearson International Scholarship (Full Tuition & Living)"],
    faqs: [
      { question: "Are graduates eligible for PGWP in Canada?", answer: "Yes, graduates receive up to 3 years of Post-Graduation Work Permit." }
    ]
  },
  "tum-germany": {
    slug: "tum-germany",
    name: "Technical University of Munich (TUM)",
    country: "Germany",
    city: "Munich",
    ranking: "Top 37 QS World Rankings",
    fees: "€0 Tuition (Semester contribution €150)",
    intakes: "Winter (October)",
    overview: "One of Europe's top technical universities, renowned for engineering, robotics, AI, and industry partnerships with BMW, Siemens, and Audi.",
    popularCourses: ["MSc Robotics & Cognition", "MSc Data Engineering", "MSc Mechanical Engineering"],
    requirements: ["Academic GPA 3.0+ / 75%+", "IELTS 6.5 / TOEFL 88", "APS Certificate (India applicants)"],
    scholarships: ["DAAD Postgraduate Scholarships", "Deutschlandstipendium"],
    faqs: [
      { question: "Is tuition free at TUM for international students?", answer: "Public degrees at TUM are largely tuition-free with only small administrative semester fees." }
    ]
  }
};

export async function generateStaticParams() {
  return [
    { slug: "university-of-westminster" },
    { slug: "macquarie-university" },
    { slug: "university-of-toronto" },
    { slug: "tum-germany" }
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolved = await params;
  const slugKey = (resolved?.slug || "").toLowerCase();
  const uni = universitiesData[slugKey];
  if (!uni) return { title: "University Not Found | Annex Consultancy" };

  return {
    title: `${uni.name} Admissions Guide | Ranking, Fees, Courses & Scholarships`,
    description: `Complete admissions guide for ${uni.name} in ${uni.city}, ${uni.country}. Check tuition fees, QS ranking, entry requirements, and scholarship assistance.`,
    alternates: {
      canonical: `https://annex-consultancy.com/universities/${uni.slug}`,
    },
  };
}

export default async function UniversityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params;
  const slugKey = (resolved?.slug || "").toLowerCase();
  const uni = universitiesData[slugKey];
  if (!uni) notFound();

  return (
    <>
      <CollegeOrUniversitySchema
        name={uni.name}
        url={`https://annex-consultancy.com/universities/${uni.slug}`}
        country={uni.country}
        city={uni.city}
        description={uni.overview}
      />
      <FAQSchema faqs={uni.faqs} />
      <Navigation />

      <main className="flex-grow pt-24 md:pt-28 bg-white">
        <Breadcrumbs
          items={[
            { name: "Universities", url: "https://annex-consultancy.com/universities" },
            { name: uni.name, url: `https://annex-consultancy.com/universities/${uni.slug}` },
          ]}
        />

        {/* HERO */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold text-primary">
              <MapPin size={14} className="text-primary" /> {uni.city}, {uni.country}
            </div>

            <h1 className="font-display font-bold text-4xl md:text-6xl text-primary">
              {uni.name}
            </h1>

            <p className="text-base md:text-lg text-slate-600 max-w-3xl leading-relaxed">
              {uni.overview}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href={`/contact?ref=${encodeURIComponent(uni.name)}`}>
                <Button variant="primary" size="lg">
                  Apply to {uni.name}
                </Button>
              </Link>
              <a href="https://wa.me/918910882334" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg" className="gap-2">
                  <Phone size={18} /> WhatsApp Inquiry
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* METRICS */}
        <section className="py-10 bg-subtle-gray border-y border-hairline">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <Card className="p-6 border-hairline bg-white">
                <Trophy size={28} className="text-amber-500 mx-auto mb-2" />
                <span className="text-xs text-slate-400 font-bold uppercase">World Ranking</span>
                <p className="font-display font-bold text-lg text-primary mt-1">{uni.ranking}</p>
              </Card>

              <Card className="p-6 border-hairline bg-white">
                <CurrencyInr size={28} className="text-primary mx-auto mb-2" />
                <span className="text-xs text-slate-400 font-bold uppercase">Tuition Fees</span>
                <p className="font-display font-bold text-lg text-primary mt-1">{uni.fees}</p>
              </Card>

              <Card className="p-6 border-hairline bg-white">
                <Calendar size={28} className="text-emerald-700 mx-auto mb-2" />
                <span className="text-xs text-slate-400 font-bold uppercase">Major Intakes</span>
                <p className="font-display font-bold text-lg text-emerald-800 mt-1">{uni.intakes}</p>
              </Card>
            </div>
          </div>
        </section>

        {/* COURSES & REQUIREMENTS */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              <div className="space-y-6">
                <h2 className="font-display font-bold text-2xl md:text-3xl text-primary">
                  Popular Degree Offerings
                </h2>
                <div className="space-y-3">
                  {uni.popularCourses.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-subtle-gray border border-hairline">
                      <GraduationCap size={20} className="text-primary shrink-0" />
                      <span className="text-sm font-bold text-slate-800">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="font-display font-bold text-2xl md:text-3xl text-primary">
                  Entry Requirements
                </h2>
                <div className="space-y-3">
                  {uni.requirements.map((req, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-subtle-gray border border-hairline">
                      <CheckCircle size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-slate-700">{req}</span>
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
