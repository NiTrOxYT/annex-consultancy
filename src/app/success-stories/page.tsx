"use client";

import * as React from "react";
import { Sparkle, GraduationCap, CheckCircle } from "@phosphor-icons/react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

interface SuccessStudent {
  name: string;
  destination: string;
  university: string;
  course: string;
  year: number;
  quote: string;
}

const successStudents: SuccessStudent[] = [
  {
    name: "Roshan Shrestha",
    destination: "UK",
    university: "University of Westminster",
    course: "MSc Finance & Accounting",
    year: 2025,
    quote: "Annex made my UK visa process completely seamless. Their counselors were extremely transparent and supported me at every step.",
  },
  {
    name: "Pooja Karki",
    destination: "Australia",
    university: "Deakin University",
    course: "Bachelors in Information Technology",
    year: 2025,
    quote: "The test prep classes for PTE at Annex are exceptional. I scored a 79 overall, which helped me secure my scholarship.",
  },
  {
    name: "Aashish Bhandari",
    destination: "Italy",
    university: "University of Milan",
    course: "MSc Computer Science",
    year: 2024,
    quote: "Highly recommended for state university placements in Italy. They helped me secure my tuition waivers and study grants.",
  },
  {
    name: "Sarita Adhikari",
    destination: "UK",
    university: "Cardiff University",
    course: "MBA Global Management",
    year: 2025,
    quote: "Annex has excellent counselor connections. They helped me structure my admission essay and mock interview prep correctly.",
  },
  {
    name: "Niranjan Chaudhary",
    destination: "Australia",
    university: "Macquarie University",
    course: "Master of Cyber Security",
    year: 2024,
    quote: "I am grateful for the detailed document verification and visa application assistance. Highly professional guidance.",
  },
  {
    name: "Pratiksha Giri",
    destination: "Italy",
    university: "Sapienza University of Rome",
    course: "Bachelors in Bioinformatics",
    year: 2025,
    quote: "Pre-enrollment and scholarship declaration steps for Italy were extremely complex, but the Annex team managed it all.",
  },
];

export default function SuccessStories() {
  const [filter, setFilter] = React.useState<string>("All");
  const filteredStudents = filter === "All"
    ? successStudents
    : successStudents.filter((s) => s.destination.toLowerCase() === filter.toLowerCase());

  return (
    <>
      <Navigation />

      <main className="flex-grow pt-32 pb-24 bg-white text-left">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline/80 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-6">
              <Sparkle size={12} className="text-gold" weight="fill" />
              Visa Approvals
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tighter leading-none mb-6">
              Placed by Annex.
            </h1>
            <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-[55ch]">
              Discover placement achievements and feedback from students who successfully transitioned to leading global campuses.
            </p>
          </div>

          {/* Filtering Buttons */}
          <div className="flex flex-wrap gap-2.5 mb-12">
            {["All", "UK", "Australia", "Italy"].map((country) => (
              <button
                key={country}
                onClick={() => setFilter(country)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                  filter === country
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-slate-500 border-hairline hover:bg-subtle-gray"
                }`}
              >
                {country} Placements
              </button>
            ))}
          </div>

          {/* Placements Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.name} className="flex flex-col justify-between min-h-[320px]">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                      <GraduationCap size={18} weight="bold" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono-data uppercase tracking-wider text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full font-bold">
                      <CheckCircle size={10} weight="fill" /> Visa Approved
                    </span>
                  </div>
                  <CardTitle className="text-lg mb-1">{student.name}</CardTitle>
                  <p className="text-xs font-semibold text-slate-400 mb-4">{student.university} &middot; {student.destination}</p>
                  
                  <p className="text-sm text-slate-600 italic leading-relaxed">
                    &ldquo;{student.quote}&rdquo;
                  </p>
                </div>

                <div className="border-t border-hairline pt-4 flex justify-between items-center text-[10px] font-mono-data text-slate-400 font-semibold">
                  <span>COURSE: {student.course.toUpperCase()}</span>
                  <span>YEAR: {student.year}</span>
                </div>
              </Card>
            ))}
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}
