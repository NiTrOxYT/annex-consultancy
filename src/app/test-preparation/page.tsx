"use client";

import * as React from "react";
import { Sparkle, Checks, Clock, BookOpen, User } from "@phosphor-icons/react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

interface CourseDetail {
  title: string;
  duration: string;
  timing: string;
  fees: string;
  overview: string;
  syllabus: string[];
  testStructure: string[];
}

const courses: Record<string, CourseDetail> = {
  ielts: {
    title: "IELTS Preparation",
    duration: "6 Weeks",
    timing: "Daily (7:00 AM - 9:00 AM or 4:00 PM - 6:00 PM)",
    fees: "NPR 8,500 (Including materials)",
    overview: "The International English Language Testing System (IELTS) is the global benchmark for English language assessment. We run intensive prep cycles focusing on all four bands.",
    syllabus: [
      "Academic Reading techniques and vocabulary expansion",
      "Writing task 1 (data analysis) & task 2 (essay structuring)",
      "Listening practice with global accent familiarity drills",
      "One-on-one speaking drills mimicking real interviewers",
    ],
    testStructure: [
      "Listening: 30 minutes (4 sections, 40 questions)",
      "Reading: 60 minutes (3 sections, 40 questions)",
      "Writing: 60 minutes (2 tasks)",
      "Speaking: 11-14 minutes (3 parts)",
    ],
  },
  pte: {
    title: "PTE Academic Preparation",
    duration: "6 Weeks",
    timing: "Daily (8:00 AM - 10:00 AM or 2:00 PM - 4:00 PM)",
    fees: "NPR 9,000 (Including mock software keys)",
    overview: "Pearson Test of English Academic is a computer-delivered test assessing reading, writing, listening, and speaking skills under automated algorithms. We simulate identical testing setups.",
    syllabus: [
      "AI scoring tricks for Speaking (Read Aloud, Repeat Sentence)",
      "Summarizing written texts and essay prompts with templates",
      "Listening: Write from Dictation, Fill in Blanks",
      "Full-length mock tests on standardized portal systems",
    ],
    testStructure: [
      "Speaking & Writing: 54-67 minutes",
      "Reading: 29-30 minutes",
      "Listening: 30-43 minutes",
    ],
  },
  cmat: {
    title: "CMAT Preparation",
    duration: "8 Weeks",
    timing: "Daily (7:30 AM - 10:30 AM)",
    fees: "NPR 10,000 (Including study guide keys)",
    overview: "Central Management Admission Test (CMAT) conducted by Tribhuvan University is the gatekeeper for MBA, BBA, and BIM programs. We structure detailed quantitative and verbal logic drills.",
    syllabus: [
      "Quantitative Ability (Math shortcut formulas, shortcuts)",
      "Verbal Ability (Vocabulary, grammatical corrections)",
      "Logical Reasoning (Sequencing, patterns, logic matrices)",
      "General Awareness (National and global affairs updates)",
    ],
    testStructure: [
      "Verbal Section (25 questions)",
      "Quantitative Section (25 questions)",
      "Logical Reasoning (25 questions)",
      "General Awareness (25 questions)",
    ],
  },
  computer: {
    title: "IT & Computer Courses",
    duration: "4 - 12 Weeks (Varies by track)",
    timing: "Flexible batches (Morning to Evening)",
    fees: "Varies (Starting NPR 6,000)",
    overview: "Earn skills in web development, database management, and programming logic. These courses prepare students for technical university intakes.",
    syllabus: [
      "Front-End Web Design (HTML, CSS, JS foundations)",
      "Python programming logic & database management",
      "Graphic Design (Photoshop, Illustrator branding principles)",
      "Office Packages & technical reporting write-ups",
    ],
    testStructure: [
      "Practical project evaluations",
      "Structured lab exercises",
      "Annex course completion credentials",
    ],
  },
};

export default function TestPrep() {
  const [activeTab, setActiveTab] = React.useState<"ielts" | "pte" | "cmat" | "computer">("ielts");
  const currentCourse = courses[activeTab];

  return (
    <>
      <Navigation />

      <main className="flex-grow pt-32 pb-24 bg-white text-left">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline/80 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-6">
              <Sparkle size={12} className="text-gold" weight="fill" />
              Academic Classes
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tighter leading-none mb-6">
              Test preparation programs.
            </h1>
            <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-[55ch]">
              We run focused classes led by experienced faculties. Includes weekly mock assessments, digital portal credentials, and course handouts.
            </p>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="border-b border-hairline mb-12 flex gap-4 overflow-x-auto pb-1.5">
            {Object.keys(courses).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`px-4 py-2 border-b-2 font-display font-bold text-sm tracking-tight transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === key
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {courses[key].title.split(" ")[0]} Prep
              </button>
            ))}
          </div>

          {/* Course Details Block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            {/* Left: Overview and Syllabus */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div>
                <h2 className="font-display font-bold text-2xl text-primary mb-4">
                  {currentCourse.title}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed max-w-[65ch]">
                  {currentCourse.overview}
                </p>
              </div>

              <Card className="h-auto">
                <CardTitle className="text-lg mb-6 border-b border-hairline pb-4">
                  Curriculum & Focus Areas
                </CardTitle>
                <ul className="flex flex-col gap-4">
                  {currentCourse.syllabus.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0 mt-0.5">
                        <Checks size={12} />
                      </span>
                      <span className="text-sm text-slate-600 font-medium leading-normal">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Right: Quick parameters */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <Card className="h-auto">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Class Duration
                </CardTitle>
                <div className="flex items-center gap-2 font-display font-bold text-lg text-primary leading-tight">
                  <Clock size={16} /> {currentCourse.duration}
                </div>
              </Card>

              <Card className="h-auto">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Daily Timing
                </CardTitle>
                <div className="flex items-center gap-2 font-display font-bold text-sm text-primary leading-snug">
                  <BookOpen size={16} className="shrink-0" /> {currentCourse.timing}
                </div>
              </Card>

              <Card className="h-auto">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Standard Fees
                </CardTitle>
                <div className="font-mono-data text-base font-bold text-primary leading-tight">
                  {currentCourse.fees}
                </div>
              </Card>

              <Card className="h-auto">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Weekly Mock Tests
                </CardTitle>
                <div className="text-sm font-semibold text-slate-600 leading-normal">
                  Mock tests held every Friday and Saturday under real testing environments.
                </div>
              </Card>
            </div>
          </div>

          {/* CTA Box */}
          <div className="bg-primary text-white p-12 rounded-[2rem] text-center flex flex-col items-center">
            <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-4">Secure your seat for the next batch</h3>
            <p className="text-sm text-slate-300 max-w-[45ch] mb-8">Annex schedules new prep batches every Sunday. Enroll today to access our library keys.</p>
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
