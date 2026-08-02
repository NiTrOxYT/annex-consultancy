"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { 
  ArrowUpRight, Globe, Sparkle, Checks, IdentificationCard, ShieldCheck, 
  GraduationCap, ArrowRight, BookOpen, CurrencyInr, Airplane, FileText, 
  ChatTeardropText, Question, CheckCircle, MapPin, CaretDown, Star, Phone
} from "@phosphor-icons/react";
import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/animated-counter";
import { SectionReveal } from "@/components/section-reveal";
import { TopCollegesSection } from "@/components/top-colleges";
import { HomeCmsBanner } from "@/components/home-cms-banner";
import { FAQSchema } from "@/components/seo/structured-data";

// Seed images
const HERO_IMAGE = "/images/hero.webp";
const DEST_UK = "/images/uk.webp";
const DEST_AU = "/images/australia.webp";
const DEST_EU = "/images/europe.webp";
const DEST_DXB = "/images/dubai.webp";
const DEST_IT = "/images/italy.webp";

const destinations = [
  { name: "United Kingdom", image: DEST_UK, slug: "uk", universities: "80+ Universities", intake: "Sept / Jan", pswr: "2 - 3 Years" },
  { name: "Australia", image: DEST_AU, slug: "australia", universities: "40+ Universities", intake: "Feb / July", pswr: "2 - 4 Years" },
  { name: "Canada", image: DEST_EU, slug: "canada", universities: "60+ Colleges/Varsities", intake: "Sept / Jan / May", pswr: "Up to 3 Years" },
  { name: "United States", image: HERO_IMAGE, slug: "usa", universities: "100+ Universities", intake: "Fall / Spring", pswr: "1 - 3 Years (STEM)" },
  { name: "Germany", image: DEST_EU, slug: "germany", universities: "35+ Universities", intake: "Oct / April", pswr: "1.5 Years" },
  { name: "Europe & Italy", image: DEST_IT, slug: "italy", universities: "25+ Public Varsities", intake: "Sept / Oct", pswr: "1 - 2 Years" },
  { name: "Dubai (UAE)", image: DEST_DXB, slug: "dubai", universities: "20+ Branch Campuses", intake: "Rolling Intakes", pswr: "Available" },
];

const HOMEPAGE_FAQS = [
  {
    question: "Why should I hire a professional study abroad consultancy like Annex Consultancy?",
    answer: "Navigating international university admissions, financial documentation, statement of purpose (SOP) drafting, and student visa regulations requires specialized domain expertise. Annex Consultancy provides end-to-end guidance from profile evaluation to post-arrival support, maintaining a 98.4% visa approval rate across UK, Australia, Canada, USA, Germany, and Europe."
  },
  {
    question: "What services are included in Annex Consultancy's overseas education counseling?",
    answer: "Our comprehensive overseas counseling includes: 1) One-on-one career counseling & profile evaluation, 2) University shortlisting based on budget and academic standing, 3) SOP, LOR, and Resume editing by experienced copywriters, 4) Application tracking and offer letter confirmation, 5) Scholarship & education loan guidance, 6) Student visa interview preparation & file submission, and 7) Pre-departure orientation and accommodation assistance."
  },
  {
    question: "Can I study abroad on a 100% scholarship or grant?",
    answer: "Yes. Many study abroad destinations offer full tuition waivers and regional government grants. For example, Italian public universities offer DSU scholarships covering 100% tuition plus annual stipends up to €7,000. German public universities offer zero tuition fee education. Annex Consultancy identifies and applies for eligible merit-based and need-based scholarships for every client."
  },
  {
    question: "What are the minimum IELTS/PTE score requirements for Master's programs abroad?",
    answer: "Generally, UK, Australian, Canadian, and US universities require an overall IELTS score of 6.5 (with no band under 6.0) or a PTE score of 58–64 for Postgraduate programs. Undergraduate programs usually accept IELTS 6.0 or PTE 52. Several UK and European universities also offer IELTS waivers based on Class 12th English marks (70%+)."
  },
  {
    question: "How long does the student visa application process take?",
    answer: "Student visa processing timelines vary by country: UK Student Visas take 3–4 weeks (Priority options available); Australian Student Visas take 4–8 weeks; Canadian Study Permits take 6–12 weeks; German Student Visas take 6–10 weeks; and Schengen/Italy visas take 3–6 weeks. We recommend starting your application 6 to 8 months before your target intake."
  },
  {
    question: "What are the post-study work permit (PSWR) rights in popular study abroad destinations?",
    answer: "Post-Study Work Rights allow international graduates to gain valuable global work experience: UK offers 2 years (3 years for PhD); Australia offers 2 to 4 years depending on degree level; Canada offers PGWP up to 3 years; USA offers 1 year OPT (extended to 3 years for STEM graduates); Germany offers 18 months; and Ireland offers 2 years for Master's graduates."
  },
  {
    question: "Does Annex Consultancy assist with education loans and financial proof documentation?",
    answer: "Yes. We work closely with leading nationalized banks, private financial institutions, and NBFCs to assist students in securing collateral and non-collateral education loans. We also guide you on exact embassy financial requirements, including CAS, GIC (Canada), Blocked Account (Germany), and liquid asset proofing."
  },
  {
    question: "What is the difference between undergraduate and postgraduate admission requirements?",
    answer: "Undergraduate admissions require Class 10/12 transcripts, SAT/ACT (for select US colleges), IELTS/PTE, and personal essays. Postgraduate admissions require a 3 or 4-year Bachelor's degree (GPA 2.8+ or 60%+), GRE/GMAT (for specific business or engineering schools), Statement of Purpose (SOP), 2-3 Letters of Recommendation (LORs), and updated CV."
  },
  {
    question: "When should I start preparing for my study abroad application?",
    answer: "The ideal timeline is 8 to 12 months prior to your target intake (Fall/September or Spring/January). This allows sufficient time for standardized language exams (IELTS/PTE), university research, SOP editing, application submissions, scholarship deadlines, and visa processing."
  },
  {
    question: "Does Annex Consultancy provide post-arrival assistance in the destination country?",
    answer: "Absolutes. Our relationship does not end with visa approval. We assist students with airport pickup arrangements, temporary student housing & accommodation guidance, SIM card activation, student bank account setup, and part-time job search tips in cities across the UK, Australia, Canada, Europe, and Dubai."
  }
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <FAQSchema faqs={HOMEPAGE_FAQS} />
      <Navigation />

      <main className="flex-grow pt-24 md:pt-28">
        <HomeCmsBanner />

        {/* SECTION 1: HERO SECTION */}
        <section className="relative pb-20 md:pb-28 overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

              {/* Left Column: H1 Heading, Subhead, CTA */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline/80 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-6"
                >
                  <Sparkle size={12} className="text-gold" weight="fill" />
                  India's Trusted Overseas Education Consultancy
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.05 }}
                  className="font-display font-bold text-3xl sm:text-4xl md:text-6xl text-primary tracking-tighter leading-[1.05] max-w-2xl mb-6"
                >
                  Global Education &<br />Study Abroad Consultancy.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-base md:text-lg text-slate-600 leading-relaxed max-w-[54ch] mb-8"
                >
                  Empowering ambitious students to secure admissions, 100% scholarships, and high-visa-success placements in top universities across the UK, Australia, Canada, USA, Germany, Europe, and Dubai.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 }}
                  className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-8"
                >
                  <Link href="/contact" className="w-full sm:w-auto">
                    <Button variant="primary" size="lg" className="w-full sm:w-auto">
                      Book Free Counseling Session
                    </Button>
                  </Link>
                  <Link href="/study-abroad" className="w-full sm:w-auto">
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                      Explore Country Guides
                    </Button>
                  </Link>
                </motion.div>

                {/* Micro Trust Badge */}
                <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 pt-4 border-t border-hairline/60 w-full max-w-xl">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Checks size={16} className="text-emerald-600" /> 98.4% Visa Success
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Checks size={16} className="text-emerald-600" /> 150+ Varsity Partners
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Checks size={16} className="text-emerald-600" /> ₹5 Cr+ Scholarships Secured
                  </span>
                </div>
              </div>

              {/* Right Column: Hero Image */}
              <div className="lg:col-span-5 relative w-full flex justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="relative w-full aspect-[4/3] bg-subtle-gray border border-hairline/80 p-2 rounded-[2rem]"
                >
                  <div className="relative w-full h-full overflow-hidden rounded-[calc(2rem-0.5rem)] border border-hairline/40">
                    <Image
                      src={HERO_IMAGE}
                      alt="Annex Overseas Education Student Success"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover brightness-[0.98]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2: STATS & COUNTER BAR */}
        <section className="border-y border-hairline/80 bg-subtle-gray py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <AnimatedCounter value={1000} suffix="+" />
                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mt-1">Students Enrolled</p>
              </div>
              <div>
                <AnimatedCounter value={150} suffix="+" />
                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mt-1">Global University Partners</p>
              </div>
              <div>
                <AnimatedCounter value={98} suffix="%" />
                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mt-1">Visa Approval Rate</p>
              </div>
              <div>
                <AnimatedCounter value={15} suffix=" Cr+ Scholarships" />
                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mt-1">Total Disbursed</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: END-TO-END OVERSEAS SERVICES (NLP & ENTITIES RICH) */}
        <SectionReveal className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary bg-subtle-gray px-3 py-1 rounded-full border border-hairline">
                Comprehensive Overseas Counseling
              </span>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-primary tracking-tight mt-4">
                End-to-End Overseas Education & University Admission Services
              </h2>
              <p className="text-slate-600 text-sm md:text-base mt-4">
                From choosing the right degree program to receiving your student visa and stepping onto campus, Annex Consultancy guides you through every step of international higher education.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Service 1 */}
              <Card className="p-8 hover:shadow-lg transition-all duration-300 border-hairline">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 text-primary">
                  <Globe size={24} weight="bold" />
                </div>
                <h3 className="font-display font-bold text-xl text-primary mb-3">
                  1. Profile Evaluation & Career Counseling
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  We analyze your academic history, GPA, work experience, and financial budget to match your profile with top-tier universities in Canada, UK, USA, Australia, and Europe.
                </p>
                <ul className="space-y-2 text-xs text-slate-500">
                  <li className="flex items-center gap-2"><Checks size={14} className="text-emerald-600" /> One-on-one expert counseling</li>
                  <li className="flex items-center gap-2"><Checks size={14} className="text-emerald-600" /> Course & career pathway mapping</li>
                </ul>
              </Card>

              {/* Service 2 */}
              <Card className="p-8 hover:shadow-lg transition-all duration-300 border-hairline">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 text-primary">
                  <BookOpen size={24} weight="bold" />
                </div>
                <h3 className="font-display font-bold text-xl text-primary mb-3">
                  2. University & Course Shortlisting
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Select from over 150 accredited global universities offering Bachelor’s, Master’s, MBA, and STEM degrees with high post-study work permit opportunities.
                </p>
                <ul className="space-y-2 text-xs text-slate-500">
                  <li className="flex items-center gap-2"><Checks size={14} className="text-emerald-600" /> Direct varsity partner applications</li>
                  <li className="flex items-center gap-2"><Checks size={14} className="text-emerald-600" /> Fast-track offer letter processing</li>
                </ul>
              </Card>

              {/* Service 3 */}
              <Card className="p-8 hover:shadow-lg transition-all duration-300 border-hairline">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 text-primary">
                  <FileText size={24} weight="bold" />
                </div>
                <h3 className="font-display font-bold text-xl text-primary mb-3">
                  3. SOP, LOR & Application Drafting
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Our professional editorial team reviews and refines your Statement of Purpose (SOP), Letters of Recommendation (LORs), and Academic CV to satisfy strict admission committees.
                </p>
                <ul className="space-y-2 text-xs text-slate-500">
                  <li className="flex items-center gap-2"><Checks size={14} className="text-emerald-600" /> Plagiarism-free customized SOPs</li>
                  <li className="flex items-center gap-2"><Checks size={14} className="text-emerald-600" /> Optimized for university rubrics</li>
                </ul>
              </Card>

              {/* Service 4 */}
              <Card className="p-8 hover:shadow-lg transition-all duration-300 border-hairline">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 text-primary">
                  <ShieldCheck size={24} weight="bold" />
                </div>
                <h3 className="font-display font-bold text-xl text-primary mb-3">
                  4. Student Visa Assistance & Filings
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Navigate complex visa protocols including UK CAS, Canadian SPP/SDS, Australian GTE/GST, German Blocked Account, and US F-1 visa interview prep with 98.4% success.
                </p>
                <ul className="space-y-2 text-xs text-slate-500">
                  <li className="flex items-center gap-2"><Checks size={14} className="text-emerald-600" /> Mock visa interview practice</li>
                  <li className="flex items-center gap-2"><Checks size={14} className="text-emerald-600" /> Financial proof verification</li>
                </ul>
              </Card>

              {/* Service 5 */}
              <Card className="p-8 hover:shadow-lg transition-all duration-300 border-hairline">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 text-primary">
                  <CurrencyInr size={24} weight="bold" />
                </div>
                <h3 className="font-display font-bold text-xl text-primary mb-3">
                  5. Scholarships & Education Loans
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Maximize your funding through merit-based scholarships, government bursaries (like Italian DSU grants), and low-interest collateral/non-collateral education loans.
                </p>
                <ul className="space-y-2 text-xs text-slate-500">
                  <li className="flex items-center gap-2"><Checks size={14} className="text-emerald-600" /> Up to 100% tuition fee waivers</li>
                  <li className="flex items-center gap-2"><Checks size={14} className="text-emerald-600" /> Bank tie-ups for fast loan disbursal</li>
                </ul>
              </Card>

              {/* Service 6 */}
              <Card className="p-8 hover:shadow-lg transition-all duration-300 border-hairline">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 text-primary">
                  <Airplane size={24} weight="bold" />
                </div>
                <h3 className="font-display font-bold text-xl text-primary mb-3">
                  6. Pre-Departure & Post-Arrival Care
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  We prepare you for life abroad with flight bookings, temporary student housing options, airport pickups, bank account setup, and guidance on local part-time job rules.
                </p>
                <ul className="space-y-2 text-xs text-slate-500">
                  <li className="flex items-center gap-2"><Checks size={14} className="text-emerald-600" /> Accommodation assistance</li>
                  <li className="flex items-center gap-2"><Checks size={14} className="text-emerald-600" /> Student community network access</li>
                </ul>
              </Card>
            </div>
          </div>
        </SectionReveal>

        {/* SECTION 4: STUDY ABROAD DESTINATIONS GRID */}
        <SectionReveal className="py-20 bg-subtle-gray border-y border-hairline/80">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary bg-white px-3 py-1 rounded-full border border-hairline">
                  Top Destinations
                </span>
                <h2 className="font-display font-bold text-3xl md:text-5xl text-primary tracking-tight mt-3">
                  Explore Top Overseas Study Destinations
                </h2>
              </div>
              <Link href="/study-abroad">
                <Button variant="outline" size="sm" className="gap-2">
                  View All Countries <ArrowRight size={14} />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((dest) => (
                <Link key={dest.slug} href={`/study-abroad/${dest.slug}`} className="group">
                  <Card className="overflow-hidden border-hairline hover:shadow-xl transition-all duration-300 bg-white">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={dest.image}
                        alt={`Study in ${dest.name} - Annex Consultancy`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="text-[10px] uppercase tracking-wider font-semibold bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                          {dest.universities}
                        </span>
                        <h3 className="font-display font-bold text-2xl mt-1 text-white">{dest.name}</h3>
                      </div>
                    </div>
                    <div className="p-5 space-y-2 text-xs text-slate-600">
                      <div className="flex justify-between border-b border-hairline/60 pb-2">
                        <span className="text-slate-400 font-medium">Major Intakes:</span>
                        <span className="font-bold text-slate-800">{dest.intake}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Post-Study Work Right:</span>
                        <span className="font-bold text-emerald-700">{dest.pswr}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* SECTION 5: TOP COLLEGES & VARSITY PARTNERS */}
        <TopCollegesSection country="all" />

        {/* SECTION 6: INFORMATION GAIN COMPARISON MATRIX */}
        <SectionReveal className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary bg-subtle-gray px-3 py-1 rounded-full border border-hairline">
                Transparency & Value
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-primary tracking-tight mt-3">
                Why Choose Annex Consultancy vs. Generic Educational Agencies
              </h2>
              <p className="text-slate-600 text-sm mt-3">
                We believe in ethical counseling, transparent documentation, and individualized university placement strategies.
              </p>
            </div>

            <div className="overflow-x-auto border border-hairline rounded-2xl shadow-sm bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-primary text-white text-xs uppercase tracking-wider font-semibold">
                    <th className="p-4 border-b border-hairline/20">Feature / Service Standard</th>
                    <th className="p-4 border-b border-hairline/20">Annex Consultancy</th>
                    <th className="p-4 border-b border-hairline/20 text-slate-300">Generic Local Agents</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline/60">
                  <tr className="hover:bg-subtle-gray/50">
                    <td className="p-4 font-bold text-slate-800">University Selection</td>
                    <td className="p-4 text-emerald-700 font-bold flex items-center gap-1.5">
                      <CheckCircle size={16} className="text-emerald-600" /> Customized based on student GPA, budget & PR goals
                    </td>
                    <td className="p-4 text-slate-500">Pushes fixed commission-heavy colleges</td>
                  </tr>
                  <tr className="hover:bg-subtle-gray/50">
                    <td className="p-4 font-bold text-slate-800">SOP & Essay Guidance</td>
                    <td className="p-4 text-emerald-700 font-bold flex items-center gap-1.5">
                      <CheckCircle size={16} className="text-emerald-600" /> Bespoke 100% original drafting by senior editors
                    </td>
                    <td className="p-4 text-slate-500">Copy-pasted generic templates</td>
                  </tr>
                  <tr className="hover:bg-subtle-gray/50">
                    <td className="p-4 font-bold text-slate-800">Scholarship Application Support</td>
                    <td className="p-4 text-emerald-700 font-bold flex items-center gap-1.5">
                      <CheckCircle size={16} className="text-emerald-600" /> Dedicated filing for Italian DSU, merit waivers & bursaries
                    </td>
                    <td className="p-4 text-slate-500">No scholarship guidance provided</td>
                  </tr>
                  <tr className="hover:bg-subtle-gray/50">
                    <td className="p-4 font-bold text-slate-800">Visa Success Track Record</td>
                    <td className="p-4 text-emerald-700 font-bold flex items-center gap-1.5">
                      <CheckCircle size={16} className="text-emerald-600" /> 98.4% success with mock embassy interviews
                    </td>
                    <td className="p-4 text-slate-500">High rejection rates due to weak file prep</td>
                  </tr>
                  <tr className="hover:bg-subtle-gray/50">
                    <td className="p-4 font-bold text-slate-800">Post-Arrival Student Support</td>
                    <td className="p-4 text-emerald-700 font-bold flex items-center gap-1.5">
                      <CheckCircle size={16} className="text-emerald-600" /> Housing, bank account, SIM card & job guidance
                    </td>
                    <td className="p-4 text-slate-500">Service stops after visa stamp</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </SectionReveal>

        {/* SECTION 7: FREQUENTLY ASKED QUESTIONS (FAQ) & SCHEMA */}
        <SectionReveal className="py-20 bg-subtle-gray border-t border-hairline/80">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary bg-white px-3 py-1 rounded-full border border-hairline">
                Got Questions?
              </span>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-primary tracking-tight mt-3">
                Frequently Asked Questions About Studying Abroad
              </h2>
              <p className="text-slate-600 text-sm mt-3">
                Clear, expert answers to help you plan your international academic journey with confidence.
              </p>
            </div>

            <div className="space-y-4">
              {HOMEPAGE_FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={faq.question}
                    className="border border-hairline rounded-2xl overflow-hidden bg-white shadow-2xs transition-all duration-200"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-display font-bold text-base md:text-lg text-primary hover:text-slate-900 cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <CaretDown
                        size={18}
                        className={`text-slate-400 shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-hairline/40 pt-3 animate-fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </SectionReveal>

        {/* SECTION 8: FINAL CALL-TO-ACTION */}
        <section className="py-20 bg-primary text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center relative z-10">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/80 bg-white/10 px-3.5 py-1 rounded-full border border-white/20">
              Start Your Journey Today
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white tracking-tight mt-4 mb-6">
              Ready to Secure Your Admission & Student Visa?
            </h2>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
              Book a complimentary 1-on-1 counseling session with our certified overseas education advisors. Get your profile evaluated in 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-slate-100 font-bold">
                  Book Free Counseling Session
                </Button>
              </Link>
              <a 
                href="https://wa.me/918910882334" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors"
              >
                <Phone size={18} weight="fill" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
