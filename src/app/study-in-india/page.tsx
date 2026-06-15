"use client";

import { motion } from "motion/react";
import { Sparkle, Checks, ArrowUpRight } from "@phosphor-icons/react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

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
          
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline/80 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-6">
              <Sparkle size={12} className="text-gold" weight="fill" />
              Domestic Placements
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tighter leading-none mb-6">
              Study in India.
            </h1>
            <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-[55ch]">
              Access highly credited technical and medical state universities in India. We represent premium partner campuses that hold NAAC A+ accrediting certifications.
            </p>
          </div>

          {/* India Universities Directory */}
          <section className="mb-20">
            <h2 className="font-display font-bold text-2xl text-primary tracking-tight mb-8">
              Affiliated & Partner Universities
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {indiaUniversities.map((uni) => (
                <Card key={uni.name} className="flex flex-col justify-between min-h-[350px]">
                  <div className="mb-6">
                    <span className="text-xs font-mono-data text-slate-400 uppercase tracking-wider block mb-1">
                      {uni.location}
                    </span>
                    <CardTitle className="text-xl mb-4">{uni.name}</CardTitle>
                    <ul className="flex flex-col gap-2.5">
                      {uni.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2">
                          <span className="w-4.5 h-4.5 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0 mt-0.5">
                            <Checks size={10} />
                          </span>
                          <span className="text-xs text-slate-600 leading-normal">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-hairline/60 pt-4 mt-auto flex flex-col gap-1.5 text-xs font-mono-data text-slate-500">
                    <span>COURSES: {uni.courses}</span>
                    <span>INTAKE: June / July</span>
                  </div>
                </Card>
              ))}
            </div>
          </section>

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
