import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Sparkle, Checks, CheckCircle, GraduationCap, CurrencyInr, Calendar, Phone, ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { EducationalOccupationalProgramSchema, CollegeOrUniversitySchema } from "@/components/seo/extended-schemas";
import { FAQSchema } from "@/components/seo/structured-data";

interface ProgrammaticData {
  countryName: string;
  courseName: string;
  seoTitle: string;
  seoDesc: string;
  overview: string;
  avgFees: string;
  avgDuration: string;
  avgSalary: string;
  topVarsities: string[];
  eligibility: string[];
  careerOpportunities: string[];
  faqs: { question: string; answer: string }[];
}

const countryNames: Record<string, string> = {
  canada: "Canada",
  uk: "United Kingdom",
  australia: "Australia",
  usa: "United States",
  germany: "Germany",
  italy: "Italy",
  dubai: "Dubai (UAE)"
};

const courseNames: Record<string, string> = {
  mba: "MBA & Management",
  "computer-science": "Computer Science & IT",
  "data-science": "Data Science & AI",
  nursing: "Nursing & Healthcare",
  engineering: "Engineering & Robotics",
  business: "Business & Commerce",
  finance: "Finance & Accounting",
  architecture: "Architecture & Design"
};

export async function generateStaticParams() {
  const countries = ["canada", "uk", "australia", "usa", "germany", "italy", "dubai"];
  const courses = ["mba", "computer-science", "data-science", "nursing", "engineering", "business", "finance", "architecture"];
  
  const params: { country: string; course: string }[] = [];
  for (const country of countries) {
    for (const course of courses) {
      params.push({ country, course });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; course: string }> }): Promise<Metadata> {
  const resolved = await params;
  const countryKey = (resolved?.country || "").toLowerCase();
  const courseKey = (resolved?.course || "").toLowerCase();
  const cName = countryNames[countryKey];
  const crsName = courseNames[courseKey];

  if (!cName || !crsName) {
    return { title: "Programmatic Study Guide Not Found | Annex Consultancy" };
  }

  const title = `Study ${crsName} in ${cName} | Top Universities, Fees, Visas & Scholarships`;
  const description = `Complete guide to studying ${crsName} in ${cName}. Compare tuition fees, top ranked universities, admission requirements, scholarships, and post-study work permits.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://annex-consultancy.com/study-in-${countryKey}/${courseKey}`,
    },
    openGraph: {
      title,
      description,
      url: `https://annex-consultancy.com/study-in-${countryKey}/${courseKey}`,
    },
  };
}

export default async function ProgrammaticCoursePage({ params }: { params: Promise<{ country: string; course: string }> }) {
  const resolved = await params;
  const countryKey = (resolved?.country || "").toLowerCase();
  const courseKey = (resolved?.course || "").toLowerCase();
  const cName = countryNames[countryKey];
  const crsName = courseNames[courseKey];

  if (!cName || !crsName) {
    notFound();
  }

  const programData: ProgrammaticData = {
    countryName: cName,
    courseName: crsName,
    seoTitle: `Study ${crsName} in ${cName}`,
    seoDesc: `Get expert guidance for pursuing ${crsName} in ${cName}.`,
    overview: `Pursuing ${crsName} in ${cName} provides international students with access to world-class academic research, high-paying career opportunities, and direct post-study work permits. Annex Consultancy helps you secure admission to top-tier universities in ${cName} with scholarship support.`,
    avgFees: countryKey === "germany" ? "€0 - €3,000 / year (Public)" : countryKey === "italy" ? "€800 - €2,500 / year (State Rates)" : "15,000 - 35,000 per year",
    avgDuration: courseKey === "mba" ? "1 - 2 Years" : "1 - 4 Years",
    avgSalary: "$65,000 - $110,000 per year",
    topVarsities: [
      `University of ${cName} Partner Campus A`,
      `Institute of Technology ${cName}`,
      `Global Metropolitan University ${cName}`,
      `National Academy of ${crsName}`
    ],
    eligibility: [
      "Minimum 60% or 2.8+ GPA in previous degree / High School",
      "IELTS 6.5 overall (or PTE 58+ / TOEFL 80+)",
      "Statement of Purpose (SOP) tailored for " + crsName,
      "2 Letters of Recommendation (LORs)"
    ],
    careerOpportunities: [
      `${crsName} Specialist / Consultant`,
      "Senior Project Manager",
      "Global Corporate Analyst",
      "Research & Innovation Officer"
    ],
    faqs: [
      {
        question: `What are the career prospects after studying ${crsName} in ${cName}?`,
        answer: `Graduates of ${crsName} in ${cName} enjoy high employment rates and competitive salaries due to strong industry demand and post-study work permit policies.`
      },
      {
        question: `Can I get scholarships for ${crsName} in ${cName}?`,
        answer: `Yes, international students applying for ${crsName} can qualify for university entrance bursaries, merit scholarships, and regional government grants.`
      }
    ]
  };

  return (
    <>
      <EducationalOccupationalProgramSchema
        name={`${crsName} in ${cName}`}
        description={programData.overview}
        providerName="Annex Consultancy"
      />
      <FAQSchema faqs={programData.faqs} />
      <Navigation />

      <main className="flex-grow pt-24 md:pt-28 bg-white">
        <Breadcrumbs
          items={[
            { name: "Study Abroad", url: "https://annex-consultancy.com/study-abroad" },
            { name: `Study in ${cName}`, url: `https://annex-consultancy.com/study-abroad/${countryKey}` },
            { name: crsName, url: `https://annex-consultancy.com/study-in-${countryKey}/${courseKey}` }
          ]}
        />

        {/* HERO SECTION */}
        <section className="relative pb-16 pt-4 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
                <Sparkle size={14} className="text-amber-500" weight="fill" />
                Degree & Career Guide
              </span>
              
              <h1 className="font-display font-bold text-4xl md:text-6xl text-primary tracking-tight">
                Study {crsName} in {cName}
              </h1>

              <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                {programData.overview}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/contact">
                  <Button variant="primary" size="lg">
                    Apply for {crsName} in {cName}
                  </Button>
                </Link>
                <a href="https://wa.me/918910882334" target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="lg" className="gap-2">
                    <Phone size={18} /> Chat on WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* PROGRAM METRICS */}
        <section className="py-12 bg-subtle-gray border-y border-hairline">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <Card className="p-6 border-hairline bg-white">
                <CurrencyInr size={28} className="text-primary mx-auto mb-2" />
                <span className="text-xs text-slate-400 font-bold uppercase">Estimated Tuition Fee</span>
                <p className="font-display font-bold text-lg text-primary mt-1">{programData.avgFees}</p>
              </Card>

              <Card className="p-6 border-hairline bg-white">
                <Calendar size={28} className="text-primary mx-auto mb-2" />
                <span className="text-xs text-slate-400 font-bold uppercase">Program Duration</span>
                <p className="font-display font-bold text-lg text-primary mt-1">{programData.avgDuration}</p>
              </Card>

              <Card className="p-6 border-hairline bg-white">
                <GraduationCap size={28} className="text-emerald-700 mx-auto mb-2" />
                <span className="text-xs text-slate-400 font-bold uppercase">Average Graduate Salary</span>
                <p className="font-display font-bold text-lg text-emerald-800 mt-1">{programData.avgSalary}</p>
              </Card>
            </div>
          </div>
        </section>

        {/* ELIGIBILITY & CAREERS */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h2 className="font-display font-bold text-2xl md:text-3xl text-primary">
                  Admission Requirements for {crsName}
                </h2>
                <div className="space-y-3">
                  {programData.eligibility.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-subtle-gray border border-hairline">
                      <CheckCircle size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-slate-700">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="font-display font-bold text-2xl md:text-3xl text-primary">
                  Career Scope & Job Roles
                </h2>
                <div className="space-y-3">
                  {programData.careerOpportunities.map((career, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-subtle-gray border border-hairline">
                      <Checks size={20} className="text-primary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-slate-700">{career}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-16 bg-subtle-gray border-t border-hairline">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-primary mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {programData.faqs.map((faq, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-hairline bg-white space-y-2">
                  <h3 className="font-display font-bold text-base text-primary">{faq.question}</h3>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
