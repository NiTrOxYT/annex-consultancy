"use client";

import Link from "next/link";
import { Sparkle, ArrowRight, BookOpen, Clock, Globe } from "@phosphor-icons/react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { TopCollegesSection } from "@/components/top-colleges";

const countries = [
  {
    name: "United Kingdom",
    slug: "uk",
    desc: "Study in world-class research institutions in London, Oxford, and across the UK. Famous for fast-track 1-year Masters degrees.",
    universities: "80+ Partners",
    intake: "Sep / Jan",
  },
  {
    name: "Australia",
    slug: "australia",
    desc: "Earn globally recognized credentials in top urban hubs like Sydney and Melbourne. Post-study work pathways available.",
    universities: "40+ Partners",
    intake: "Feb / Jul",
  },
  {
    name: "Europe",
    slug: "europe",
    desc: "Access prestigious English-taught programs across France, Germany, and Spain. Affordable fees and rich cultural exposure.",
    universities: "120+ Partners",
    intake: "Sep / Oct",
  },
  {
    name: "Dubai",
    slug: "dubai",
    desc: "Earn degrees from top-tier international branch universities in a fast-growing financial hub with flexible visa processes.",
    universities: "15+ Partners",
    intake: "Sep / Jan",
  },
  {
    name: "Italy",
    slug: "italy",
    desc: "Access low-cost, state-funded English programs in ancient universities. Strong scholarship availability and tuition waivers.",
    universities: "30+ Partners",
    intake: "Sep / Oct",
  },
];

export default function StudyAbroadIndex() {
  return (
    <>
      <Navigation />

      <main className="flex-grow pt-32 pb-24 bg-white text-left">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Header */}
          <div className="max-w-3xl mb-20">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline/80 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-6">
              <Sparkle size={12} className="text-gold" weight="fill" />
              Study Destinations
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tighter leading-none mb-6">
              Select your academic hub.
            </h1>
            <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-[55ch]">
              We facilitate placement options across leading countries, managing application requirements and credential translations directly.
            </p>
          </div>

          {/* Grid of Countries */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countries.map((country) => (
              <Card key={country.slug} className="flex flex-col justify-between min-h-[300px]">
                <div className="mb-6">
                  <span className="text-xs font-mono-data text-gold font-bold uppercase tracking-wider mb-2 block">
                    {country.universities}
                  </span>
                  <CardTitle className="text-xl mb-3">{country.name}</CardTitle>
                  <CardDescription className="mb-4">
                    {country.desc}
                  </CardDescription>
                </div>
                
                <div className="border-t border-hairline/60 pt-4 mt-auto">
                  <div className="flex justify-between items-center text-xs font-mono-data text-slate-500 mb-4">
                    <span className="flex items-center gap-1"><Clock size={12} /> INTAKE: {country.intake}</span>
                    <span className="flex items-center gap-1"><BookOpen size={12} /> VERIFIED PATH</span>
                  </div>
                  <Link href={`/study-abroad/${country.slug}`} className="group w-full inline-flex items-center justify-between text-xs font-bold uppercase tracking-wider text-primary hover:text-gold transition-colors">
                    Explore Admissions <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </Card>
            ))}
          </section>

          {/* Dynamic Colleges Directory */}
          <div className="mt-16 border-t border-hairline pt-16">
            <TopCollegesSection country="abroad" />
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
