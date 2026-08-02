"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkle, Calculator, ArrowRight, CheckCircle, CurrencyInr } from "@phosphor-icons/react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

interface ToolConfig {
  slug: string;
  name: string;
  desc: string;
}

const toolConfigs: Record<string, ToolConfig> = {
  "tuition-calculator": {
    slug: "tuition-calculator",
    name: "Study Abroad Budget & Tuition Calculator",
    desc: "Calculate total tuition fees, living expenses, health insurance, and visa proof deposits based on destination country.",
  },
  "ielts-band-calculator": {
    slug: "ielts-band-calculator",
    name: "IELTS Overall Band Score Calculator",
    desc: "Input your Listening, Reading, Writing, and Speaking sectional scores to calculate your official rounded IELTS Overall Band.",
  },
  "gpa-converter": {
    slug: "gpa-converter",
    name: "Indian Percentage to US 4.0 / European GPA Converter",
    desc: "Convert Indian 10-point CGPA or high school percentage into US 4.0 scale and ECTS grade equivalents.",
  },
  "country-comparator": {
    slug: "country-comparator",
    name: "Interactive Country Comparator Tool",
    desc: "Compare tuition budgets, post-study work rights, and intake deadlines side-by-side.",
  }
};

export default function InteractiveToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const resolved = React.use(params);
  const toolKey = (resolved?.tool || "").toLowerCase();
  const config = toolConfigs[toolKey] || toolConfigs["tuition-calculator"];

  // State for IELTS Calculator
  const [listening, setListening] = React.useState(6.5);
  const [reading, setReading] = React.useState(6.5);
  const [writing, setWriting] = React.useState(6.0);
  const [speaking, setSpeaking] = React.useState(6.5);

  const ieltsOverall = React.useMemo(() => {
    const raw = (listening + reading + writing + speaking) / 4;
    const decimal = raw % 1;
    let rounded = Math.floor(raw);
    if (decimal >= 0.75) rounded += 1;
    else if (decimal >= 0.25) rounded += 0.5;
    return rounded;
  }, [listening, reading, writing, speaking]);

  // State for Budget Calculator
  const [destCountry, setDestCountry] = React.useState("uk");
  const [durationYears, setDurationYears] = React.useState(1);

  const budgetResult = React.useMemo(() => {
    let tuitionAnnual = 15000;
    let livingAnnual = 12000;
    let currency = "£";

    if (destCountry === "canada") {
      tuitionAnnual = 22000;
      livingAnnual = 20635;
      currency = "CAD $";
    } else if (destCountry === "australia") {
      tuitionAnnual = 32000;
      livingAnnual = 24505;
      currency = "A$";
    } else if (destCountry === "usa") {
      tuitionAnnual = 35000;
      livingAnnual = 15000;
      currency = "$";
    } else if (destCountry === "germany") {
      tuitionAnnual = 500;
      livingAnnual = 11208;
      currency = "€";
    } else if (destCountry === "italy") {
      tuitionAnnual = 1500;
      livingAnnual = 6000;
      currency = "€";
    }

    const totalTuition = tuitionAnnual * durationYears;
    const totalLiving = livingAnnual * durationYears;
    const grandTotal = totalTuition + totalLiving;

    return { currency, tuitionAnnual, livingAnnual, totalTuition, totalLiving, grandTotal };
  }, [destCountry, durationYears]);

  return (
    <>
      <Navigation />
      <main className="flex-grow pt-24 md:pt-28 bg-white text-left">
        <Breadcrumbs
          items={[
            { name: "Tools", url: "https://annex-consultancy.com/tools" },
            { name: config.name, url: `https://annex-consultancy.com/tools/${config.slug}` },
          ]}
        />

        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
              <Calculator size={14} className="text-primary" /> Interactive Tool
            </span>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tight">
              {config.name}
            </h1>
            <p className="text-slate-600 text-sm md:text-base max-w-3xl leading-relaxed">
              {config.desc}
            </p>
          </div>
        </section>

        {/* CALCULATOR WORKSPACE */}
        <section className="pb-20 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            {toolKey === "ielts-band-calculator" ? (
              <Card className="p-8 border-hairline bg-subtle-gray/30 space-y-6">
                <CardTitle className="text-2xl font-bold text-primary">Input Sectional Band Scores</CardTitle>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-700 block mb-2">Listening: {listening}</label>
                    <input
                      type="range"
                      min="4"
                      max="9"
                      step="0.5"
                      value={listening}
                      onChange={(e) => setListening(parseFloat(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-700 block mb-2">Reading: {reading}</label>
                    <input
                      type="range"
                      min="4"
                      max="9"
                      step="0.5"
                      value={reading}
                      onChange={(e) => setReading(parseFloat(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-700 block mb-2">Writing: {writing}</label>
                    <input
                      type="range"
                      min="4"
                      max="9"
                      step="0.5"
                      value={writing}
                      onChange={(e) => setWriting(parseFloat(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-700 block mb-2">Speaking: {speaking}</label>
                    <input
                      type="range"
                      min="4"
                      max="9"
                      step="0.5"
                      value={speaking}
                      onChange={(e) => setSpeaking(parseFloat(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-primary text-white text-center space-y-2 mt-6">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-300">Calculated Overall IELTS Band</span>
                  <div className="font-display font-bold text-5xl text-white">{ieltsOverall}</div>
                  <p className="text-xs text-slate-300 pt-1">
                    {ieltsOverall >= 6.5 ? "✓ Meets Master's degree benchmark for UK, Canada & Australia" : "Needs preparation to hit 6.5+ band target"}
                  </p>
                </div>
              </Card>
            ) : (
              <Card className="p-8 border-hairline bg-subtle-gray/30 space-y-6">
                <CardTitle className="text-2xl font-bold text-primary">Budget & Cost Planner</CardTitle>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-700 block mb-2">Target Destination</label>
                    <select
                      value={destCountry}
                      onChange={(e) => setDestCountry(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-hairline bg-white text-xs outline-none font-bold"
                    >
                      <option value="uk">United Kingdom</option>
                      <option value="canada">Canada</option>
                      <option value="australia">Australia</option>
                      <option value="usa">United States</option>
                      <option value="germany">Germany</option>
                      <option value="italy">Italy (State Rates)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-700 block mb-2">Program Duration (Years)</label>
                    <select
                      value={durationYears}
                      onChange={(e) => setDurationYears(parseInt(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-hairline bg-white text-xs outline-none font-bold"
                    >
                      <option value={1}>1 Year (Master's)</option>
                      <option value={2}>2 Years (Master's / PG)</option>
                      <option value={3}>3 Years (Bachelor's)</option>
                      <option value={4}>4 Years (Bachelor's STEM)</option>
                    </select>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-hairline space-y-3">
                  <div className="flex justify-between border-b border-hairline pb-2 text-xs">
                    <span className="text-slate-500 font-medium">Estimated Tuition ({durationYears} Yr):</span>
                    <span className="font-bold text-slate-900">{budgetResult.currency} {budgetResult.totalTuition.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-hairline pb-2 text-xs">
                    <span className="text-slate-500 font-medium">Estimated Living Cost ({durationYears} Yr):</span>
                    <span className="font-bold text-slate-900">{budgetResult.currency} {budgetResult.totalLiving.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-1">
                    <span className="font-bold text-primary">Grand Total Cost Estimate:</span>
                    <span className="font-bold text-emerald-700">{budgetResult.currency} {budgetResult.grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <Link href="/contact">
                    <Button variant="primary" size="lg" className="font-bold">
                      Get Exact University Cost Breakdown
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
