"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Globe, Sparkle, Checks, IdentificationCard, ShieldCheck, GraduationCap, ArrowRight } from "@phosphor-icons/react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

// Seed images
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop";
const DEST_UK =
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop";
const DEST_AU = "https://images.unsplash.com/photo-1524820197278-540916411e20?q=80&w=600&auto=format&fit=crop";
const DEST_EU = "https://images.unsplash.com/photo-1473951574080-01fe45ec8643?q=80&w=600&auto=format&fit=crop";
const DEST_DXB = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600&auto=format&fit=crop";
const DEST_IT = "https://images.unsplash.com/photo-1499002238440-d264edd596ec?q=80&w=600&auto=format&fit=crop";

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
                    <img
                      src={HERO_IMAGE}
                      alt="Student studying abroad"
                      className="object-cover w-full h-full brightness-[0.98]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* University Partners & Trust metrics */}
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
                <p className="font-mono-data text-3xl font-bold text-primary">99%</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Visa Success Rate</p>
              </div>
              <div>
                <p className="font-mono-data text-3xl font-bold text-primary">5,000+</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Happy Alumni</p>
              </div>
              <div>
                <p className="font-mono-data text-3xl font-bold text-primary">15+</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Years of Service</p>
              </div>
              <div>
                <p className="font-mono-data text-3xl font-bold text-primary">150+</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">University Partners</p>
              </div>
            </div>
          </div>
        </section>

        {/* Study Destinations Section */}
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
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out brightness-95"
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

        {/* Why Annex (Bento Grid) */}
        <section className="py-24 border-t border-hairline bg-subtle-gray/20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-left">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-primary tracking-tight mb-16 text-center">
              The Annex advantage.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bento Card 1: 2-column wide */}
              <div className="md:col-span-2">
                <Card className="flex flex-col justify-between h-full min-h-[300px]">
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
                <Card className="flex flex-col justify-between h-full min-h-[300px] bg-slate-50 border-slate-100">
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
                <Card className="flex flex-col justify-between h-full min-h-[300px]">
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
                <Card className="flex flex-col justify-between h-full min-h-[300px]">
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

        {/* Services Section */}
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

        {/* Student Success Stories (Carousel / Quote Wall) */}
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

        {/* Consultation Call to Action */}
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
      </main>

      <Footer />
    </>
  );
}
