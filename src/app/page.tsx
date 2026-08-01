"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight, Globe, Sparkle, Checks, IdentificationCard, ShieldCheck, GraduationCap, ArrowRight } from "@phosphor-icons/react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/animated-counter";
import { SectionReveal } from "@/components/section-reveal";
import { TopCollegesSection } from "@/components/top-colleges";

// Seed images
const HERO_IMAGE = "/images/hero.webp";
const DEST_UK = "/images/uk.webp";
const DEST_AU = "/images/australia.webp";
const DEST_EU = "/images/europe.webp";
const DEST_DXB = "/images/dubai.webp";
const DEST_IT = "/images/italy.webp";

const destinations = [
  { name: "United Kingdom", image: DEST_UK, slug: "uk", universities: "80+ Universities" },
  { name: "Australia", image: DEST_AU, slug: "australia", universities: "40+ Universities" },
  { name: "Europe", image: DEST_EU, slug: "europe", universities: "120+ Universities" },
  { name: "Dubai", image: DEST_DXB, slug: "dubai", universities: "15+ Branches" },
  { name: "Italy", image: DEST_IT, slug: "italy", universities: "30+ State Universities" },
];

const testimonials = [
  {
    quote: "Annex made my UK visa process completely seamless. Their counselors were extremely transparent and supported me at every step.",
    student: "Roshan Shrestha",
    meta: "MSc Finance, University of Westminster",
  },
  {
    quote: "The test prep classes for PTE at Annex are exceptional. I scored a 79 overall, which helped me secure my scholarship in Australia.",
    student: "Pooja Karki",
    meta: "Bachelors in IT, Deakin University",
  },
  {
    quote: "Highly recommended for state university placements in Italy. They helped me secure my tuition waivers and study grants.",
    student: "Aashish Bhandari",
    meta: "MSc Computer Science, University of Milan",
  },
];

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <>
      <Navigation />

      <main className="flex-grow">
        {/* Asymmetric Hero Section */}
        <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

              {/* Left Column: Heading, Subhead, CTA */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline/80 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-6"
                >
                  <Sparkle size={12} className="text-gold" weight="fill" />
                  Your Global Education Journey
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display font-bold text-4xl md:text-6xl text-primary tracking-tighter leading-[1.05] max-w-2xl mb-6"
                >
                  Global education.<br />Uncompromised guidance.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-base md:text-lg text-slate-500 leading-relaxed max-w-[48ch] mb-8"
                >
                  Secure placements at world-class universities in the UK, Australia, Europe, and beyond. Fully managed by certified professionals.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                  <Link href="/contact" className="w-full sm:w-auto">
                    <Button variant="primary" size="lg" className="w-full sm:w-auto">
                      Book Consultation
                    </Button>
                  </Link>
                  <Link href="/study-abroad" className="w-full sm:w-auto">
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                      Explore Destinations
                    </Button>
                  </Link>
                </motion.div>
              </div>

              {/* Right Column: Framed Image (Double Bezel) */}
              <div className="lg:col-span-5 relative w-full flex justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full aspect-[4/3] bg-subtle-gray border border-hairline/80 p-2 rounded-[2rem]"
                >
                  <div className="relative w-full h-full overflow-hidden rounded-[calc(2rem-0.5rem)] border border-hairline/40">
                    <Image
                      src={HERO_IMAGE}
                      alt="Student studying abroad"
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

        {/* University Partners & Trust metrics */}
        <SectionReveal>
          <section className="py-12 border-t border-b border-hairline bg-subtle-gray/20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              {/* Logo Row */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Placements at top global universities
                </span>
                <div className="flex flex-wrap items-center gap-x-12 gap-y-6 opacity-60 grayscale">
                  <span className="font-display font-bold text-lg tracking-tight text-primary">University of Oxford</span>
                  <span className="font-display font-bold text-lg tracking-tight text-primary">Melbourne</span>
                  <span className="font-display font-bold text-lg tracking-tight text-primary">Sapienza Rome</span>
                  <span className="font-display font-bold text-lg tracking-tight text-primary">LSE</span>
                </div>
              </div>

              {/* Monospace Statistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-hairline/60 pt-8 text-left">
                <div>
                  <p className="font-mono-data text-3xl font-bold text-primary">
                    <AnimatedCounter value={99} suffix="%" />
                  </p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Visa Success Rate</p>
                </div>
                <div>
                  <p className="font-mono-data text-3xl font-bold text-primary">
                    <AnimatedCounter value={5000} suffix="+" />
                  </p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Happy Alumni</p>
                </div>
                <div>
                  <p className="font-mono-data text-3xl font-bold text-primary">
                    <AnimatedCounter value={8} suffix="+" />
                  </p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Countries Served</p>
                </div>
                <div>
                  <p className="font-mono-data text-3xl font-bold text-primary">
                    <AnimatedCounter value={150} suffix="+" />
                  </p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">University Partners</p>
                </div>
              </div>
            </div>
          </section>
        </SectionReveal>

        {/* Study Abroad Eligibility Calculator Banner */}
        <SectionReveal>
          <section className="py-24 bg-white border-b border-hairline overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Column: The Value Pitch */}
                <div className="lg:col-span-5 flex flex-col items-start text-left">
                  <h2 className="font-display font-bold text-3xl md:text-5xl text-primary tracking-tight leading-[1.1] mb-6">
                    Know your admission chances. Instantly.
                  </h2>
                  <p className="text-base text-slate-500 leading-relaxed max-w-[45ch] mb-8">
                    Assess your profile against global standards to get matched universities, admission chance categories, and scholarship estimates.
                  </p>
                  
                  {/* Checklist */}
                  <ul className="flex flex-col gap-4 mb-8 w-full">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                        <Checks size={12} weight="bold" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-primary leading-tight">Academic Match Score</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Instant feedback calibrated against your GPA and academic qualifications.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                        <Checks size={12} weight="bold" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-primary leading-tight">Admission Chances Categorization</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Clear classification of target universities into Safe, Target, and Ambitious matches.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                        <Checks size={12} weight="bold" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-primary leading-tight">Scholarship Projections</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Accurate projections for tuition fee waivers and academic grants.</p>
                      </div>
                    </li>
                  </ul>
                  
                  <Link href="/study-abroad-eligibility" className="w-full sm:w-auto">
                    <Button variant="primary" size="lg" className="w-full sm:w-auto">
                      Check Your Eligibility
                    </Button>
                  </Link>
                </div>
                
                {/* Right Column: Premium Mockup Card */}
                <div className="lg:col-span-7 relative w-full flex justify-center">
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-xl bg-subtle-gray border border-hairline/80 p-2 rounded-[2rem] shadow-[0_24px_48px_-15px_rgba(15,23,42,0.08)]"
                  >
                    <div className="relative w-full bg-slate-900 border border-hairline/40 rounded-[calc(2rem-0.5rem)] text-white p-6 md:p-8 h-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden">
                      {/* Background Ambient Glow */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent)] pointer-events-none" />
                      
                      {/* Mockup Header */}
                      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
                          <span className="font-mono-data text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                            ANNEX CORE ENGINE v2.4
                          </span>
                        </div>
                        <span className="text-[9px] font-mono-data px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider">
                          ACTIVE ASSESSMENT
                        </span>
                      </div>
                      
                      {/* Mockup Body Content */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-8">
                        {/* Circular Score Gauge */}
                        <div className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/5 rounded-2xl">
                          <div className="relative w-32 h-32 flex items-center justify-center">
                            {/* SVG Gauge */}
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                              <circle
                                cx="64"
                                cy="64"
                                r="48"
                                className="stroke-white/5"
                                strokeWidth="8"
                                fill="transparent"
                              />
                              <circle
                                cx="64"
                                cy="64"
                                r="48"
                                className="stroke-gold"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 48}
                                strokeDashoffset={2 * Math.PI * 48 * (1 - 0.88)}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="text-center z-10">
                              <span className="font-display font-extrabold text-3xl text-white tracking-tight leading-none block">
                                88%
                              </span>
                              <span className="font-mono-data text-[8px] text-slate-400 tracking-widest uppercase font-bold mt-1 block">
                                MATCH SCORE
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Chance & Scholarship Projections */}
                        <div className="flex flex-col gap-3 text-left">
                          <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-1">
                            <span className="text-[10px] font-mono-data text-slate-400 font-bold uppercase tracking-wider">
                              Chance Classification
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Safe
                              </span>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gold/20 text-gold border border-gold/30">
                                Target
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-300 mt-1">
                              Matched with 6 premium universities
                            </span>
                          </div>
                          
                          <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-1">
                            <span className="text-[10px] font-mono-data text-slate-400 font-bold uppercase tracking-wider">
                              Est. Scholarship Waiver
                            </span>
                            <span className="text-lg font-bold font-display text-gold tracking-tight">
                              £6,500 - £12,000
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Based on GPA and course alignment
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Verified Checks Footer inside mockup */}
                      <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                            <span className="text-emerald-500">✓</span> Academic Calibration
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                            <span className="text-emerald-500">✓</span> Test Score Alignment
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                            <span className="text-emerald-500">✓</span> Budget Matrix Matched
                          </span>
                        </div>
                        <Link href="/study-abroad-eligibility" className="group flex items-center gap-1 text-xs font-mono-data font-bold text-gold hover:text-white transition-colors uppercase tracking-wider">
                          Calculate <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                      
                    </div>
                  </motion.div>
                </div>
                
              </div>
            </div>
          </section>
        </SectionReveal>

        {/* Study Destinations Section */}
        <SectionReveal>
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
                <div className="text-left">
                  <h2 className="font-display font-bold text-3xl md:text-4xl text-primary tracking-tight mb-4">
                    Find your destination.
                  </h2>
                  <p className="text-sm text-slate-500 max-w-[50ch]">
                    Choose from prestigious educational hubs across Europe, the United Kingdom, and the Pacific.
                  </p>
                </div>
                <Link href="/study-abroad" className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:text-gold transition-colors mt-4 md:mt-0">
                  All Destinations <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Destination grids (offset layout) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {destinations.map((dest, i) => (
                  <Link key={dest.name} href={`/study-abroad/${dest.slug}`} className="group">
                    <div className="relative w-full aspect-[3/4] bg-subtle-gray border border-hairline/80 p-1.5 rounded-2xl transition-transform duration-300 group-hover:-translate-y-1">
                      <div className="relative w-full h-full overflow-hidden rounded-[calc(1rem-0.125rem)] border border-hairline/40">
                        <Image
                          src={dest.image}
                          alt={dest.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-95"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-left">
                          <p className="text-xs font-mono-data text-gold font-semibold uppercase tracking-wider mb-0.5">
                            {dest.universities}
                          </p>
                          <h4 className="font-display font-bold text-lg text-white tracking-tight">
                            {dest.name}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </SectionReveal>

        {/* Why Annex (Bento Grid) */}
        <SectionReveal>
          <section className="py-24 border-t border-hairline bg-subtle-gray/20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-left">
              <h2 className="font-display font-bold text-3xl md:text-4xl text-primary tracking-tight mb-16 text-center">
                The Annex advantage.
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bento Card 1: 2-column wide */}
                <div className="md:col-span-2">
                  <Card hoverable={true} className="flex flex-col justify-between h-full min-h-[300px]">
                    <div className="mb-6">
                      <div className="w-10 h-10 rounded-full bg-primary/5 border border-hairline flex items-center justify-center text-primary mb-6">
                        <IdentificationCard size={20} weight="bold" />
                      </div>
                      <CardTitle className="text-xl mb-2">Certified Counselors</CardTitle>
                      <CardDescription className="max-w-md">
                        Our experts hold QEAC certification and professional credentials, ensuring your profile is assessed with high international accuracy.
                      </CardDescription>
                    </div>
                    <div className="border-t border-hairline/60 pt-4 flex justify-between items-center text-xs font-mono-data text-slate-400">
                      <span>SECTOR STATUS: CERTIFIED</span>
                      <span>99% ALIGNMENT</span>
                    </div>
                  </Card>
                </div>

                {/* Bento Card 2: 1-column */}
                <div>
                  <Card hoverable={true} className="flex flex-col justify-between h-full min-h-[300px] bg-slate-50 border-slate-100">
                    <div className="mb-6">
                      <div className="w-10 h-10 rounded-full bg-primary/5 border border-hairline flex items-center justify-center text-primary mb-6">
                        <Checks size={20} weight="bold" />
                      </div>
                      <CardTitle className="text-xl mb-2">Managed Flow</CardTitle>
                      <CardDescription>
                        From test preparation to landing services, we manage application documentation, interviews, and visa steps.
                      </CardDescription>
                    </div>
                    <div className="border-t border-hairline/60 pt-4 flex justify-between items-center text-xs font-mono-data text-slate-400">
                      <span>100% COMPLETE</span>
                    </div>
                  </Card>
                </div>

                {/* Bento Card 3: 1-column with Gold Accent */}
                <div>
                  <Card hoverable={true} className="flex flex-col justify-between h-full min-h-[300px]">
                    <div className="mb-6">
                      <div className="w-10 h-10 rounded-full bg-primary/5 border border-hairline flex items-center justify-center text-primary mb-6">
                        <Globe size={20} weight="bold" />
                      </div>
                      <CardTitle className="text-xl mb-2">Global Scholarships</CardTitle>
                      <CardDescription>
                        We identify fee waivers and scholarship grants that align with your financial targets.
                      </CardDescription>
                    </div>
                    <div className="border-t border-hairline/60 pt-4 flex justify-between items-center text-xs font-mono-data text-gold font-bold">
                      <span>GOLD STATUS INTAKE</span>
                    </div>
                  </Card>
                </div>

                {/* Bento Card 4: 2-column wide */}
                <div className="md:col-span-2">
                  <Card hoverable={true} className="flex flex-col justify-between h-full min-h-[300px]">
                    <div className="mb-6">
                      <div className="w-10 h-10 rounded-full bg-primary/5 border border-hairline flex items-center justify-center text-primary mb-6">
                        <ShieldCheck size={20} weight="bold" />
                      </div>
                      <CardTitle className="text-xl mb-2">99% Visa Record</CardTitle>
                      <CardDescription className="max-w-md">
                        Through detailed mock interviews and thorough document auditing, we maintain one of the highest visa approval rates in the region.
                      </CardDescription>
                    </div>
                    <div className="border-t border-hairline/60 pt-4 flex justify-between items-center text-xs font-mono-data text-slate-400">
                      <span>SYSTEM SECURITY: HIGH</span>
                      <span>VERIFICATION RATIO</span>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </SectionReveal>

        {/* Services Section */}
        <SectionReveal>
          <section className="py-24 bg-white border-b border-hairline">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <h2 className="font-display font-bold text-3xl md:text-4xl text-primary tracking-tight mb-16 text-center">
                Our comprehensive services.
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div>
                  <h3 className="font-display font-bold text-lg text-primary mb-2">1. Profile Assessment</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    We analyze your academic metrics, financial profile, and future prospects to align you with the right programs.
                  </p>
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-primary mb-2">2. Application Management</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    We review, structure, and submit your documentation, drafts, letters of recommendation, and intake statements.
                  </p>
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-primary mb-2">3. Visa Consultation</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    We arrange comprehensive mock interview drills and audit financial declarations before submission.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </SectionReveal>

        {/* Featured Universities Section */}
        <SectionReveal>
          <TopCollegesSection country="all" featuredOnly={true} limit={6} showControls={false} />
        </SectionReveal>

        {/* Student Success Stories (Carousel / Quote Wall) */}
        <SectionReveal>
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
              <h2 className="font-display font-bold text-3xl md:text-4xl text-primary tracking-tight mb-16">
                Placed by Annex.
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {testimonials.map((test, i) => (
                  <div key={test.student} className="border-l-2 border-gold/40 pl-6 py-2">
                    <p className="text-base text-slate-700 italic leading-relaxed mb-4">
                      &ldquo;{test.quote}&rdquo;
                    </p>
                    <div>
                      <h5 className="font-display font-bold text-sm text-primary">{test.student}</h5>
                      <p className="text-xs text-slate-400 font-semibold">{test.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </SectionReveal>

        {/* Consultation Call to Action */}
        <SectionReveal>
          <section className="py-24 bg-primary text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1),transparent)] pointer-events-none" />
            <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center">
              <h2 className="font-display font-bold text-3xl md:text-5xl text-white tracking-tight leading-none mb-6">
                Plan your global education.
              </h2>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-[45ch] mb-8">
                Speak with QEAC certified counselors and discover your admission scholarship options.
              </p>
              <Link href="/contact">
                <Button variant="gold" size="lg">
                  Book Consultation
                </Button>
              </Link>
            </div>
          </section>
        </SectionReveal>
      </main>

      <Footer />
    </>
  );
}
