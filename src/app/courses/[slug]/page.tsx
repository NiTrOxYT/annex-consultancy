import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Sparkle, Checks, CheckCircle, GraduationCap, CurrencyInr, Calendar, Phone, ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { EducationalOccupationalProgramSchema } from "@/components/seo/extended-schemas";
import { FAQSchema } from "@/components/seo/structured-data";

interface CourseHubDetail {
  slug: string;
  name: string;
  category: string;
  overview: string;
  avgFees: string;
  avgDuration: string;
  avgSalary: string;
  bestDestinations: string[];
  careerRoles: string[];
  eligibility: string[];
  faqs: { question: string; answer: string }[];
}

const coursesHubData: Record<string, CourseHubDetail> = {
  "mba-abroad": {
    slug: "mba-abroad",
    name: "MBA & Business Management Abroad",
    category: "Business Administration",
    overview: "Pursuing an MBA abroad equips professionals with strategic leadership, corporate finance, and international business management expertise. Top destinations offer 1-year intensive MBAs and STEM-designated management options.",
    avgFees: "$20,000 - $60,000 per year",
    avgDuration: "1 - 2 Years",
    avgSalary: "$85,000 - $130,000 per year",
    bestDestinations: ["United Kingdom", "United States", "Canada", "Australia", "Germany", "Dubai"],
    careerRoles: ["Management Consultant", "Investment Banker", "Product Manager", "Chief Operations Officer"],
    eligibility: ["Bachelor's degree with 60%+ GPA", "2-3 years work experience (preferred for top B-Schools)", "IELTS 6.5+ or PTE 60+", "GMAT / GRE (Waivers available)"],
    faqs: [
      { question: "Can I get an MBA abroad without work experience?", answer: "Yes! Many universities in the UK, Australia, and Canada offer Master in Management (MiM) or specialized MBAs for fresh graduates." }
    ]
  },
  "computer-science-abroad": {
    slug: "computer-science-abroad",
    name: "Computer Science & IT Degrees Abroad",
    category: "Information Technology",
    overview: "Computer Science is one of the highest-paid degree choices globally. Specializations include Software Engineering, Cloud Computing, Cybersecurity, and Artificial Intelligence.",
    avgFees: "$18,000 - $45,000 per year",
    avgDuration: "1 - 4 Years",
    avgSalary: "$75,000 - $120,000 per year",
    bestDestinations: ["United States", "Canada", "Germany", "United Kingdom", "Australia"],
    careerRoles: ["Full Stack Software Engineer", "Cloud Architect", "Cybersecurity Specialist", "AI Researcher"],
    eligibility: ["BSc in Computer Science, IT, or Mathematics background", "IELTS 6.5 / PTE 58+", "Strong coding/logic foundation"],
    faqs: [
      { question: "Is Computer Science eligible for STEM OPT extension in the USA?", answer: "Yes, Computer Science programs carry official STEM designation granting 3 years of OPT work rights." }
    ]
  },
  "data-science-abroad": {
    slug: "data-science-abroad",
    name: "Data Science & Big Data Master's Abroad",
    category: "Analytics & AI",
    overview: "Data Science degrees combine statistics, machine learning, and business intelligence to solve complex enterprise problems.",
    avgFees: "$16,000 - $42,000 per year",
    avgDuration: "1 - 2 Years",
    avgSalary: "$80,000 - $125,000 per year",
    bestDestinations: ["United Kingdom", "Germany", "United States", "Canada", "Australia", "Italy"],
    careerRoles: ["Data Scientist", "Machine Learning Engineer", "BI Analyst", "Data Engineer"],
    eligibility: ["Quantitative degree background", "IELTS 6.5+", "Python / SQL familiarity"],
    faqs: [
      { question: "Are scholarships available for Data Science programs?", answer: "Yes, merit scholarships and Italian DSU regional grants apply for eligible Data Science Master's applicants." }
    ]
  }
};

export async function generateStaticParams() {
  return [
    { slug: "mba-abroad" },
    { slug: "computer-science-abroad" },
    { slug: "data-science-abroad" }
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolved = await params;
  const slugKey = (resolved?.slug || "").toLowerCase();
  const course = coursesHubData[slugKey];
  if (!course) return { title: "Course Not Found | Annex Consultancy" };

  return {
    title: `${course.name} Guide | Top Universities, Salary & Visas`,
    description: `Complete guide to studying ${course.name}. Compare tuition costs, career scope, admission eligibility, and top global university options.`,
    alternates: {
      canonical: `https://annex-consultancy.com/courses/${course.slug}`,
    },
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params;
  const slugKey = (resolved?.slug || "").toLowerCase();
  const course = coursesHubData[slugKey];
  if (!course) notFound();

  return (
    <>
      <EducationalOccupationalProgramSchema
        name={course.name}
        description={course.overview}
        educationalCredentialAwarded="Bachelor's / Master's Degree"
      />
      <FAQSchema faqs={course.faqs} />
      <Navigation />

      <main className="flex-grow pt-24 md:pt-28 bg-white">
        <Breadcrumbs
          items={[
            { name: "Courses Directory", url: "https://annex-consultancy.com/courses" },
            { name: course.name, url: `https://annex-consultancy.com/courses/${course.slug}` },
          ]}
        />

        {/* HERO */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkle size={14} className="text-amber-500" weight="fill" />
              {course.category}
            </span>

            <h1 className="font-display font-bold text-4xl md:text-6xl text-primary">
              {course.name}
            </h1>

            <p className="text-base md:text-lg text-slate-600 max-w-3xl leading-relaxed">
              {course.overview}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/contact">
                <Button variant="primary" size="lg">
                  Apply for {course.name}
                </Button>
              </Link>
              <a href="https://wa.me/918910882334" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg" className="gap-2">
                  <Phone size={18} /> WhatsApp Counseling
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
                <CurrencyInr size={28} className="text-primary mx-auto mb-2" />
                <span className="text-xs text-slate-400 font-bold uppercase">Average Fees</span>
                <p className="font-display font-bold text-lg text-primary mt-1">{course.avgFees}</p>
              </Card>

              <Card className="p-6 border-hairline bg-white">
                <Calendar size={28} className="text-primary mx-auto mb-2" />
                <span className="text-xs text-slate-400 font-bold uppercase">Duration</span>
                <p className="font-display font-bold text-lg text-primary mt-1">{course.avgDuration}</p>
              </Card>

              <Card className="p-6 border-hairline bg-white">
                <GraduationCap size={28} className="text-emerald-700 mx-auto mb-2" />
                <span className="text-xs text-slate-400 font-bold uppercase">Average Global Salary</span>
                <p className="font-display font-bold text-lg text-emerald-800 mt-1">{course.avgSalary}</p>
              </Card>
            </div>
          </div>
        </section>

        {/* DESTINATIONS & ELIGIBILITY */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              <div className="space-y-6">
                <h2 className="font-display font-bold text-2xl md:text-3xl text-primary">
                  Top Study Destinations
                </h2>
                <div className="flex flex-wrap gap-3">
                  {course.bestDestinations.map((dest, i) => (
                    <span key={i} className="px-4 py-2 rounded-xl bg-subtle-gray border border-hairline font-bold text-sm text-slate-800">
                      {dest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="font-display font-bold text-2xl md:text-3xl text-primary">
                  Eligibility Criteria
                </h2>
                <div className="space-y-3">
                  {course.eligibility.map((req, i) => (
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
