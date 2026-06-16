"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Sparkle, Warning, Handshake, Compass, UserCheck, Receipt, Envelope } from "@phosphor-icons/react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

export default function TermsOfService() {
  const lastUpdated = "June 16, 2026";

  const termsSections = [
    {
      id: "consultancy-services",
      icon: <Handshake size={20} className="text-primary" weight="bold" />,
      title: "1. Educational Consultancy Services",
      content: "Annex provides placement advisory, course selection counseling, and career profiling to assist students planning to study in India or abroad (including the UK, Australia, Europe, Dubai, and Italy). Our counselors offer guidance based on available university programs, eligibility criteria, and academic match.",
    },
    {
      id: "admission-guidance",
      icon: <Compass size={20} className="text-primary" weight="bold" />,
      title: "2. Admission Guidance & Counseling",
      content: "Our staff will guide you through the process of compiling transcripts, writing statements of purpose, acquiring recommendations, and submitting university applications. While we verify document compliance, the final decision to offer admission lies solely with the target academic institution.",
    },
    {
      id: "visa-assistance",
      icon: <UserCheck size={20} className="text-primary" weight="bold" />,
      title: "3. Visa Advisory Assistance",
      content: "Annex provides student visa guidance, including document checklist review, financial document orientation, and mock visa interviews. All visa applications are evaluated and determined by the respective government's embassy or consulate immigration authorities.",
    },
    {
      id: "student-responsibilities",
      icon: <UserCheck size={20} className="text-primary" weight="bold" />,
      title: "4. Student Responsibilities",
      content: "Students are required to provide complete, authentic, and verifiable transcripts, certificates, passport information, and financial records. Annex bears no liability for applications rejected due to inaccurate, forged, or delayed submissions.",
    },
    {
      id: "payment-terms",
      icon: <Receipt size={20} className="text-primary" weight="bold" />,
      title: "5. Payment & Service Terms",
      content: "Consulting fees, coaching class fees (IELTS, PTE, CMAT), and any related application processing fees must be paid in full according to our invoice terms. Refunds for test prep courses and application consulting packages are governed by our specific course registration policy, provided at the time of payment.",
    },
  ];

  return (
    <>
      <Navigation />

      <main className="flex-grow pt-32 pb-24 bg-white text-left">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline/80 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-6">
              <Sparkle size={12} className="text-gold" weight="fill" />
              Service Standards
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tighter leading-none mb-6">
              Terms of Service
            </h1>
            <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-[60ch] mb-4">
              Please read our terms of service carefully before registering for counseling sessions, test prep classes, or university placement applications.
            </p>
            <p className="text-xs font-mono-data text-slate-400">
              Last Updated: {lastUpdated}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Terms List Column */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              {termsSections.map((section) => (
                <section key={section.id} className="border-b border-hairline/60 pb-8 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-subtle-gray flex items-center justify-center border border-hairline/60">
                      {section.icon}
                    </div>
                    <h2 className="font-display font-bold text-xl text-primary tracking-tight">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed pl-12">
                    {section.content}
                  </p>
                </section>
              ))}
            </div>

            {/* Disclaimer & Contact Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Critical Disclaimer Card */}
              <Card outerClassName="border-gold/30" className="bg-amber-50/10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                    <Warning size={18} weight="fill" />
                  </div>
                  <CardTitle className="text-sm uppercase tracking-wider text-amber-800">Critical Disclaimer</CardTitle>
                </div>
                <CardDescription className="text-slate-700 font-medium leading-relaxed text-xs">
                  <strong>Admissions & Visas Are Not Guaranteed:</strong> Annex Education Consultancy assists students in matching with colleges and compiling compliance checklists. However, university admissions and visa approvals are decided independently and exclusively by the admissions boards of the respective universities and the immigration desks of the respective embassies. Annex offers no guarantee of placement or visa success.
                </CardDescription>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardTitle className="text-sm uppercase tracking-wider text-slate-400 mb-6">Terms Inquiries</CardTitle>
                <div className="flex flex-col gap-4">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    If you have any questions regarding these terms, payment guidelines, or service limitations, please contact our support desk:
                  </p>
                  
                  <div className="flex items-center gap-3 border-t border-hairline pt-4">
                    <Envelope size={16} className="text-primary shrink-0" />
                    <div className="text-xs font-mono-data text-slate-600">
                      <span className="block font-semibold text-primary">support@annexconsultant.com</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 leading-relaxed">
                    Annex Education Consultancy reserves the right to modify these terms. Continued collaboration after changes implies acceptance of modified service conditions.
                  </div>
                </div>
              </Card>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
