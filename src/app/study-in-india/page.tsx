"use client";

import { motion } from "motion/react";
import { Sparkle, Checks, ArrowUpRight } from "@phosphor-icons/react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { TopCollegesSection } from "@/components/top-colleges";

const indiaUniversities = [
  {
    name: "Sharda University",
    location: "Greater Noida, Delhi NCR",
    highlights: ["150+ global academic tie-ups", "Highest placement index in Delhi NCR", "A+ NAAC Accredited"],
    courses: "BTech, MBA, MBBS, BBA",
  },
  {
    name: "Lovely Professional University (LPU)",
    location: "Jalandhar, Punjab",
    highlights: ["Top ranks in NIRF rankings", "State-of-the-art tech campus", "High placement packages"],
    courses: "BTech CSE, BPharmacy, MBA",
  },
  {
    name: "Kalinga Institute of Industrial Technology (KIIT)",
    location: "Bhubaneswar, Odisha",
    highlights: ["Institution of Eminence status", "Ranked high in QS rankings", "Naac A++ status"],
    courses: "BTech, MCA, MBA",
  },
];

const admissionSteps = [
  { step: "01", title: "Course Selection", desc: "Select eligible streams under AICTE, UGC, or MCI directories." },
  { step: "02", title: "Eligibility Mapping", desc: "Verify class 12 or graduation scores match intake criteria." },
  { step: "03", title: "Offer Issuance", desc: "Receive immediate provisional admission quotes from partners." },
  { step: "04", title: "Visa / NoC Processing", desc: "Annex structures your necessary student NoC approvals." },
];

export default function StudyInIndia() {
  return (
    <>
      <Navigation />

      <main className="flex-grow pt-32 pb-24 bg-white text-left">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Split Screen Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            {/* Left column */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline/80 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-6">
                <Sparkle size={12} className="text-gold" weight="fill" />
                Domestic Placements
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tighter leading-none mb-6">
                Study in India.
              </h1>
              <p className="text-base md:text-lg text-slate-500 leading-relaxed mb-8 max-w-[55ch]">
                Access highly credited technical and medical state universities in India. We represent premium partner campuses that hold NAAC A+ and A++ accrediting certifications.
              </p>
              
              {/* Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "NAAC A+ & A++ Accredited Universities",
                  "Fully English Medium Programs",
                  "UGC, AICTE, and MCI Directories Recognized",
                  "Direct Provisional Offer Letters"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <Checks size={12} />
                    </span>
                    <span className="text-xs font-semibold text-slate-600 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right column: Highlights Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <Card className="min-h-[110px] p-4 flex flex-col justify-between" outerClassName="border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Accreditation</span>
                <span className="text-lg font-bold text-primary mt-2">NAAC A++ Status</span>
              </Card>
              <Card className="min-h-[110px] p-4 flex flex-col justify-between" outerClassName="border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Academic Scope</span>
                <span className="text-lg font-bold text-primary mt-2">150+ Programs</span>
              </Card>
              <Card className="min-h-[110px] p-4 flex flex-col justify-between" outerClassName="border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Success Rate</span>
                <span className="text-lg font-bold text-primary mt-2">100% Placements</span>
              </Card>
              <Card className="min-h-[110px] p-4 flex flex-col justify-between" outerClassName="border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Consultation</span>
                <span className="text-lg font-bold text-primary mt-2">Free NoC Help</span>
              </Card>
            </div>
          </div>

          {/* Dynamic Colleges Directory */}
          <div className="mb-20">
            <TopCollegesSection country="india" />
          </div>

          {/* Process Timeline */}
          <section className="mb-20 border-t border-hairline pt-16">
            <h2 className="font-display font-bold text-2xl text-primary tracking-tight mb-12">
              Admission Process Flow
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {admissionSteps.map((step) => (
                <div key={step.step} className="flex flex-col gap-3">
                  <span className="font-mono-data text-3xl font-bold text-gold/60">{step.step}</span>
                  <h4 className="font-display font-bold text-lg text-primary">{step.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[28ch]">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Banner */}
          <div className="bg-primary text-white p-12 rounded-[2rem] text-center flex flex-col items-center">
            <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-4">Book your seat for the next session</h3>
            <p className="text-sm text-slate-300 max-w-[45ch] mb-8">Annex secures pre-admission clearances and hostel arrangements directly for students.</p>
            <a href="/contact">
              <Button variant="gold" size="md">Book Consultation</Button>
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
