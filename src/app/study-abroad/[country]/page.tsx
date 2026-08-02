import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Sparkle, Checks, ArrowLeft, CheckCircle, CurrencyInr, Calendar, GraduationCap, ShieldCheck, Phone } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { TopCollegesSection } from "@/components/top-colleges";
import { SectionReveal } from "@/components/section-reveal";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FAQSchema } from "@/components/seo/structured-data";

interface CountryDetails {
  slug: string;
  name: string;
  tagline: string;
  desc: string;
  image: string;
  seoTitle: string;
  seoDesc: string;
  requirements: string[];
  intakes: string[];
  fees: string;
  livingCost: string;
  pswr: string;
  universities: string[];
  popularCourses: string[];
  scholarships: string[];
  faqs: { question: string; answer: string }[];
}

const countryData: Record<string, CountryDetails> = {
  uk: {
    slug: "uk",
    name: "United Kingdom",
    tagline: "1-Year Master's Degrees, Russell Group Varsities & Graduate Work Visa.",
    desc: "The UK remains a top global study destination, offering intensive 1-year Master's programs, 3-year Bachelor's degrees, and a 2-year Post-Study Graduate Work Visa. Annex Consultancy assists with Russell Group applications, CAS issuance, and UK Student Visa processing.",
    image: "/images/uk.webp",
    seoTitle: "Study in UK Guide | Admissions, Scholarships & Student Visa Consultants",
    seoDesc: "Complete guide to study in the UK for international students. Get expert counseling for top UK universities, 1-year Master's programs, CAS, scholarships, and 2-year Graduate Route visa.",
    requirements: [
      "IELTS 6.0 - 6.5 overall (or equivalent PTE 58-64 / TOEFL)",
      "Academic score: Minimum 60% or 2.8 CGPA",
      "Class 12th English 70%+ eligible for IELTS Waiver at select varsities",
      "Statement of Purpose (SOP) & 2 Academic/Professional LORs",
    ],
    intakes: ["September / October (Major)", "January / February (Secondary)"],
    fees: "£12,000 - £26,000 per year",
    livingCost: "£10,000 - £13,000 per year",
    pswr: "2 Years Graduate Route (3 Years for PhD)",
    universities: [
      "University of Westminster, London",
      "Coventry University, Coventry",
      "University of Hertfordshire, Hatfield",
      "Cardiff University, Wales",
      "University of Greenwich, London",
      "University of East London"
    ],
    popularCourses: [
      "MSc Data Science & Artificial Intelligence",
      "MBA & International Business Management",
      "MSc Finance & Investment Banking",
      "MSc Public Health & Healthcare Management",
      "BSc Computer Science & Cybersecurity"
    ],
    scholarships: [
      "Chevening Scholarships (Full tuition + living costs)",
      "GREAT Scholarships (£10,000 fee reduction)",
      "Vice-Chancellor's Excellence Merit Scholarships",
      "Automatic University International Bursaries (£1,500 - £4,000)"
    ],
    faqs: [
      {
        question: "Can I study in the UK without taking IELTS?",
        answer: "Yes. Many UK partner universities grant IELTS waivers to students who achieved 70%+ in Class 12th English or completed their Bachelor's degree in an English Medium of Instruction (MOI) institution."
      },
      {
        question: "What is the CAS letter in the UK student visa process?",
        answer: "CAS stands for Confirmation of Acceptance for Studies. It is an electronic document issued by your UK university once you accept an unconditional offer and deposit your initial tuition fee. You need CAS to submit your UK Student Visa application."
      },
      {
        question: "How long can I stay in the UK after completing my degree?",
        answer: "Under the UK Graduate Route Visa, international students completing an undergraduate or Master's degree can stay and work in the UK for 2 years (3 years for PhD graduates)."
      }
    ]
  },
  australia: {
    slug: "australia",
    name: "Australia",
    tagline: "Group of Eight Universities, World-Class Research & Flexible Work Rights.",
    desc: "Australia offers globally accredited degrees from Group of Eight (Go8) and regional universities. Benefit from flexible part-time work rights (48 hours per fortnight) and up to 4 years of Post-Study Work Rights (PSWR).",
    image: "/images/australia.webp",
    seoTitle: "Study in Australia Guide | University Admissions & Visa Consultants",
    seoDesc: "Study in Australia with Annex Consultancy. Learn about Group of Eight universities, tuition fees, GTE/GST visa requirements, scholarships, and post-study work permits.",
    requirements: [
      "IELTS 6.0 - 7.0 (or equivalent PTE 52-65)",
      "Academic score: Minimum 65% or 3.0 CGPA",
      "Genuine Student (GS) criteria & financial proofing (3 months history)",
      "Health insurance (OSHC) for duration of stay"
    ],
    intakes: ["February / March (Main)", "July / August", "November (Special Intake)"],
    fees: "A$22,000 - A$45,000 per year",
    livingCost: "A$24,505 per year (Department of Home Affairs standard)",
    pswr: "2 to 4 Years (depending on qualification and regional location)",
    universities: [
      "Macquarie University, Sydney",
      "Deakin University, Melbourne",
      "Griffith University, Brisbane",
      "University of Wollongong",
      "La Trobe University, Melbourne",
      "Western Sydney University"
    ],
    popularCourses: [
      "Master of Information Technology / Data Analytics",
      "Master of Professional Accounting (MPA)",
      "Master of Nursing & Public Health",
      "Bachelor of Engineering (Honours)",
      "Master of Business Administration (MBA)"
    ],
    scholarships: [
      "Australia Awards Scholarships",
      "Destination Australia Scholarships (Regional study grants)",
      "International Vice-Chancellor's Merit Bursaries (15% - 50% tuition reduction)"
    ],
    faqs: [
      {
        question: "What is the Genuine Student (GS) requirement for Australian Visas?",
        answer: "The Genuine Student (GS) assessment evaluates your genuine intention to obtain a high-quality Australian qualification, reviewing your educational background, future career pathway, and financial stability."
      },
      {
        question: "How many hours can international students work in Australia?",
        answer: "International students on Subclass 500 visa can work up to 48 hours per fortnight during study semesters and unlimited hours during official university breaks."
      }
    ]
  },
  canada: {
    slug: "canada",
    name: "Canada",
    tagline: "Top Public Colleges, SPP/SDS Pathways & Post-Graduation Work Permits.",
    desc: "Canada is renowned for affordable tuition, welcoming multicultural communities, and direct Post-Graduation Work Permit (PGWP) pathways leading to permanent residency (PR).",
    image: "/images/europe.webp",
    seoTitle: "Study in Canada | Admissions, PGWP & Student Visa Consultants",
    seoDesc: "Guide to studying in Canada. University admissions, SPP colleges, GIC financial requirements, Study Permits, and PGWP post-graduation work rights.",
    requirements: [
      "IELTS Academic: Overall 6.5 with no band less than 6.0 (or PTE 60+)",
      "Academic Score: Minimum 55% - 65% in Class 12 / Bachelor's",
      "Guaranteed Investment Certificate (GIC) of CAD $20,635",
      "Clear medical checkup and biometrics"
    ],
    intakes: ["September (Fall)", "January (Winter)", "May (Spring/Summer)"],
    fees: "CAD $16,000 - $35,000 per year",
    livingCost: "CAD $20,635 per year (GIC benchmark)",
    pswr: "Up to 3 Years Post-Graduation Work Permit (PGWP)",
    universities: [
      "Seneca Polytechnic, Toronto",
      "Conestoga College, Kitchener",
      "Humber College, Toronto",
      "University of Windsor, Ontario",
      "Douglas College, Vancouver"
    ],
    popularCourses: [
      "Post-Graduate Certificate in Wireless Information Networking",
      "Diploma in Computer Programming & Software Engineering",
      "Master of Applied Computing",
      "Post-Graduate Diploma in Supply Chain Management"
    ],
    scholarships: [
      "Vanier Canada Graduate Scholarships",
      "Ontario Graduate Scholarship (OGS)",
      "Institutional International Entrance Awards (CAD $1,000 - $5,000)"
    ],
    faqs: [
      {
        question: "What is GIC in the Canadian Study Permit process?",
        answer: "GIC (Guaranteed Investment Certificate) is a mandatory financial deposit (CAD $20,635) made into a Canadian bank (e.g. Scotiabank, CIBC) to prove you have adequate living expense funds for your first year."
      }
    ]
  },
  usa: {
    slug: "usa",
    name: "United States",
    tagline: "Ivy League Prestige, STEM OPT 3-Year Extension & Global Career Exposure.",
    desc: "The United States hosts the world's leading research institutions. STEM-designated degree programs offer up to 3 years of Optional Practical Training (OPT) post-graduation.",
    image: "/images/hero.webp",
    seoTitle: "Study in USA Guide | University Admissions & F-1 Visa Consultants",
    seoDesc: "Study in the USA with Annex Consultancy. Learn about STEM OPT extensions, F-1 visa interviews, GRE/GMAT waivers, scholarships, and top US university admissions.",
    requirements: [
      "IELTS 6.5 - 7.5 / TOEFL 80 - 100 / PTE 58 - 68",
      "GRE / GMAT scores (Waivers available at select universities)",
      "GPA: 3.0+ on a 4.0 scale (approx 65%+ in Indian system)",
      "Form I-20 financial proof & DS-160 F-1 visa interview"
    ],
    intakes: ["Fall (August / September)", "Spring (January)"],
    fees: "$20,000 - $55,000 per year",
    livingCost: "$12,000 - $18,000 per year",
    pswr: "1 Year OPT + 2 Year STEM Extension (Total 3 Years)",
    universities: [
      "Northeastern University, Boston",
      "University of Texas at Dallas",
      "Arizona State University",
      "Stevens Institute of Technology",
      "University of Illinois Chicago"
    ],
    popularCourses: [
      "MS in Computer Science & Artificial Intelligence",
      "MS in Business Analytics & Data Science",
      "MS in Management Information Systems (MIS)",
      "MBA (STEM Designated)"
    ],
    scholarships: [
      "Fulbright-Nehru Master's Fellowships",
      "University Graduate Teaching / Research Assistantships (TA/RA)",
      "Dean's Merit Entrance Scholarships"
    ],
    faqs: [
      {
        question: "What is STEM OPT in the US education system?",
        answer: "STEM OPT allows international graduates of Science, Technology, Engineering, and Mathematics degrees to extend their post-graduation Optional Practical Training (OPT) by an additional 24 months, total 36 months."
      }
    ]
  },
  germany: {
    slug: "germany",
    name: "Germany",
    tagline: "Tuition-Free Public Varsities, Engineering Hub & 18-Month Work Visa.",
    desc: "Germany is Europe's economic engine, offering high-quality English-taught Master's degrees at public universities with zero or minimal tuition fees.",
    image: "/images/europe.webp",
    seoTitle: "Study in Germany Guide | Tuition-Free Admissions & Visa Consultants",
    seoDesc: "Study in Germany tuition-free. Expert assistance for public university admissions, APS certificates, Blocked Accounts, and 18-month post-study visas.",
    requirements: [
      "IELTS 6.5 or TOEFL 90 (English taught programs)",
      "Academic score: Minimum 70% or 3.0 CGPA for Public Universities",
      "APS Certificate (mandatory for Indian applicants)",
      "Blocked Account of €11,208 for 1 year living expenses"
    ],
    intakes: ["Winter (September / October - Main)", "Summer (March / April)"],
    fees: "€0 - €3,000 per year (Public Varsities Tuition-Free)",
    livingCost: "€11,208 per year (Blocked Account requirement)",
    pswr: "18 Months Post-Study Work Permit",
    universities: [
      "Technical University of Munich (TUM)",
      "RWTH Aachen University",
      "IU University of Applied Sciences",
      "Schiller International University",
      "SRH Berlin University of Applied Sciences"
    ],
    popularCourses: [
      "MSc Automotive Engineering & Robotics",
      "MSc Renewable Energy Systems",
      "MSc Data Engineering",
      "MBA in International Management"
    ],
    scholarships: [
      "DAAD Scholarships (Full stipend + travel allowance)",
      "Heinrich Böll Foundation Grants",
      "Deutschlandstipendium (€300 per month)"
    ],
    faqs: [
      {
        question: "Are German public universities really tuition-free?",
        answer: "Yes! Most public universities in Germany charge zero tuition fees for both domestic and international students. Students only pay a minor semester contribution (€150 - €350) which includes public transit passes."
      }
    ]
  },
  italy: {
    slug: "italy",
    name: "Italy",
    tagline: "State Institutions, 100% DSU Scholarships & Schengen Access.",
    desc: "Italy stands out for low-cost English-taught degrees at historic state universities combined with generous regional DSU scholarships covering tuition and living stipends.",
    image: "/images/italy.webp",
    seoTitle: "Study in Italy Guide | DSU Scholarships & University Admission Consultants",
    seoDesc: "Study in Italy with Annex Consultancy. Learn about Italian public universities, DSU scholarships (€7,000 stipend), CIMEA verification, and Schengen visa guidance.",
    requirements: [
      "IELTS 6.0 minimum or English Medium of Instruction (MOI) certificate",
      "Academic Score: Minimum 55% in Class 12th or Bachelor's",
      "CIMEA Statement of Comparability / Declaration of Value (DoV)",
      "Family Income proof for DSU scholarship application"
    ],
    intakes: ["September / October (Single Annual Intake)"],
    fees: "€500 - €2,500 per year (Public State Rates)",
    livingCost: "€5,000 - €7,000 per year (Covered by DSU Scholarship)",
    pswr: "1 Year Post-Study Work Permit (Extendable)",
    universities: [
      "University of Milan",
      "Sapienza University of Rome",
      "University of Padua",
      "Politecnico di Milano",
      "University of Bologna"
    ],
    popularCourses: [
      "MSc Computer Science & Data Science",
      "MSc Sustainable Architecture",
      "MSc Biomedical Engineering",
      "Bachelor/Master in International Economics & Business"
    ],
    scholarships: [
      "DSU Regional Scholarship (100% Tuition Waiver + Free Canteen + €7,000 Annual Cash Stipend)",
      "Invest Your Talent in Italy (IYT) Scholarship",
      "Italian Government MAECI Scholarships"
    ],
    faqs: [
      {
        question: "What is the DSU Scholarship in Italy?",
        answer: "The DSU (Diritto allo Studio Universitario) is a regional Italian government scholarship awarded based on family income. It covers 100% of university tuition fees, provides free accommodation/meals, and grants a cash stipend of up to €7,000 per year."
      }
    ]
  }
};

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = countryData[resolvedParams.country.toLowerCase()];
  if (!data) {
    return {
      title: "Country Guide Not Found | Annex Consultancy",
    };
  }

  return {
    title: data.seoTitle,
    description: data.seoDesc,
    alternates: {
      canonical: `https://annex-consultancy.com/study-abroad/${data.slug}`,
    },
    openGraph: {
      title: data.seoTitle,
      description: data.seoDesc,
      url: `https://annex-consultancy.com/study-abroad/${data.slug}`,
      images: [{ url: `https://annex-consultancy.com${data.image}` }],
    },
  };
}

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const resolvedParams = await params;
  const countryKey = resolvedParams.country.toLowerCase();
  const data = countryData[countryKey];

  if (!data) {
    notFound();
  }

  return (
    <>
      <FAQSchema faqs={data.faqs} />
      <Navigation />

      <main className="flex-grow pt-24 md:pt-28 bg-white">
        <Breadcrumbs
          items={[
            { name: "Study Abroad", url: "https://annex-consultancy.com/study-abroad" },
            { name: data.name, url: `https://annex-consultancy.com/study-abroad/${data.slug}` },
          ]}
        />

        {/* HERO SECTION */}
        <section className="relative pb-16 pt-4 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
                  <Sparkle size={14} className="text-amber-500" weight="fill" />
                  Destination Guide
                </span>
                
                <h1 className="font-display font-bold text-4xl md:text-6xl text-primary tracking-tight">
                  Study in {data.name}
                </h1>
                
                <p className="text-lg md:text-xl font-medium text-slate-700 leading-snug">
                  {data.tagline}
                </p>
                
                <p className="text-slate-600 text-base leading-relaxed">
                  {data.desc}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link href="/contact">
                    <Button variant="primary" size="lg">
                      Apply for {data.name} Admissions
                    </Button>
                  </Link>
                  <a href="https://wa.me/918910882334" target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="lg" className="gap-2">
                      <Phone size={18} /> WhatsApp Counseling
                    </Button>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 relative">
                <div className="relative w-full aspect-[4/3] bg-subtle-gray border border-hairline p-2 rounded-[2rem]">
                  <div className="relative w-full h-full overflow-hidden rounded-[calc(2rem-0.5rem)]">
                    <Image
                      src={data.image}
                      alt={`Study in ${data.name}`}
                      fill
                      priority
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* KEY HIGHLIGHTS METRICS */}
        <section className="py-12 bg-subtle-gray border-y border-hairline">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <Card className="p-6 border-hairline bg-white">
                <CurrencyInr size={28} className="text-primary mx-auto mb-2" />
                <span className="text-xs text-slate-400 font-bold uppercase">Estimated Annual Tuition</span>
                <p className="font-display font-bold text-lg text-primary mt-1">{data.fees}</p>
              </Card>

              <Card className="p-6 border-hairline bg-white">
                <Calendar size={28} className="text-primary mx-auto mb-2" />
                <span className="text-xs text-slate-400 font-bold uppercase">Living Expenses</span>
                <p className="font-display font-bold text-lg text-primary mt-1">{data.livingCost}</p>
              </Card>

              <Card className="p-6 border-hairline bg-white">
                <GraduationCap size={28} className="text-emerald-700 mx-auto mb-2" />
                <span className="text-xs text-slate-400 font-bold uppercase">Post-Study Work Permit</span>
                <p className="font-display font-bold text-lg text-emerald-800 mt-1">{data.pswr}</p>
              </Card>
            </div>
          </div>
        </section>

        {/* REQUIREMENTS & INTAKES */}
        <SectionReveal className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Requirements */}
              <div className="space-y-6">
                <h2 className="font-display font-bold text-2xl md:text-3xl text-primary">
                  Admission & Visa Requirements for {data.name}
                </h2>
                <div className="space-y-3">
                  {data.requirements.map((req, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-subtle-gray border border-hairline">
                      <CheckCircle size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-slate-700">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Intakes & Popular Courses */}
              <div className="space-y-6">
                <h2 className="font-display font-bold text-2xl md:text-3xl text-primary">
                  Popular Degree Programs & Intakes
                </h2>
                <Card className="p-6 border-hairline space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Intakes</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {data.intakes.map((intake, idx) => (
                        <span key={idx} className="px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full">
                          {intake}
                        </span>
                      ))}
                    </div>
                  </div>
                  {data.popularCourses && (
                    <div className="border-t border-hairline pt-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">In-Demand Courses</span>
                      <ul className="mt-2 space-y-2 text-xs font-semibold text-slate-700">
                        {data.popularCourses.map((c, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Checks size={14} className="text-primary" /> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              </div>

            </div>
          </div>
        </SectionReveal>

        {/* UNIVERSITIES LIST */}
        <SectionReveal className="py-16 bg-subtle-gray border-t border-hairline">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="font-display font-bold text-2xl md:text-4xl text-primary mb-8 text-center">
              Top Recognized Universities in {data.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.universities.map((uni, idx) => (
                <Card key={idx} className="p-5 border-hairline bg-white flex items-center gap-3">
                  <GraduationCap size={24} className="text-primary shrink-0" />
                  <span className="font-bold text-sm text-slate-800">{uni}</span>
                </Card>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* FAQ SECTION */}
        {data.faqs && data.faqs.length > 0 && (
          <SectionReveal className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-primary mb-8 text-center">
                Frequently Asked Questions — Study in {data.name}
              </h2>
              <div className="space-y-4">
                {data.faqs.map((faq, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-hairline bg-subtle-gray/40 space-y-2">
                    <h3 className="font-display font-bold text-base text-primary">{faq.question}</h3>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
        )}

        {/* CTA */}
        <section className="py-16 bg-primary text-white text-center">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-6">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white">
              Start Your {data.name} University Application Today
            </h2>
            <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto">
              Connect with our certified admissions counselors for profile evaluation, SOP drafting, scholarship applications, and visa filings.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="lg" className="bg-white text-primary hover:bg-slate-100 font-bold">
                Book Consultation Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
