import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkle, ShieldCheck, Target, Heart, CheckCircle, GraduationCap, Globe, Users, Building, Phone, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { SectionReveal } from "@/components/section-reveal";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "About Annex Consultancy | Certified Overseas Education & Study Abroad Experts",
  description: "Learn about Annex Consultancy's mission, QEAC-certified counseling team, ethical admission methodology, and 98.4% visa approval record for global university admissions.",
  alternates: {
    canonical: "https://annex-consultancy.com/about",
  },
  openGraph: {
    title: "About Annex Consultancy | Certified Overseas Education & Study Abroad Experts",
    description: "Learn about Annex Consultancy's mission, certified counseling team, ethical admission methodology, and global university partnerships.",
    url: "https://annex-consultancy.com/about",
  },
};

interface CareerExpert {
  id: string;
  name: string;
  designation: string;
  expertise: string;
  photo_url?: string;
  linkedin_url?: string;
  display_order: number;
  is_active: boolean;
}

const offices = [
  {
    branch: "India Corporate Office",
    address: "99/1/2, Girish Ghosh Rd, Belur Math, Ghusuri, Howrah, West Bengal 711202, India",
    phone: "+91 89108 82334",
    email: "business@annex-consultancy.com",
  },
  {
    branch: "Kathmandu Regional Office",
    address: "New Baneshwor, Kathmandu, Nepal",
    phone: "+91 89108 82334",
    email: "business@annex-consultancy.com",
  },
  {
    branch: "Australia Liaison Office",
    address: "George Street, Sydney, NSW, Australia",
    phone: "+61-2-9281-2292",
    email: "sydney@annexconsultant.com",
  },
];

export default async function About() {
  let teamMembers: CareerExpert[] = [];

  try {
    const { data } = await supabase
      .from("career_experts")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (data && data.length > 0) {
      teamMembers = data;
    }
  } catch (err) {
    console.error("Error fetching career_experts for About page:", err);
  }

  return (
    <>
      <Navigation />

      <main className="flex-grow pt-24 md:pt-28 bg-white text-left">
        <Breadcrumbs items={[{ name: "About Us", url: "https://annex-consultancy.com/about" }]} />

        {/* HERO SECTION */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <SectionReveal>
            <div className="max-w-3xl mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-[10px] uppercase tracking-[0.2em] font-bold text-primary mb-6">
                <Sparkle size={12} className="text-amber-500" weight="fill" />
                About Annex Consultancy
              </div>
              <h1 className="font-display font-bold text-4xl md:text-6xl text-primary tracking-tight leading-[1.08] mb-6">
                Architects of Global Academic Excellence.
              </h1>
              <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                Founded with a vision of ethical, student-first education counseling, Annex Consultancy has empowered over 1,000 students to achieve their dreams of studying in top-ranked global universities across the UK, Australia, Canada, USA, Germany, Europe, and Dubai.
              </p>
            </div>
          </SectionReveal>

          {/* MISSION & VISION GRID */}
          <SectionReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <Card className="p-8 border-hairline bg-white space-y-3">
                <ShieldCheck size={28} className="text-primary" />
                <CardTitle className="text-xl font-bold text-primary">Ethical Counseling</CardTitle>
                <CardDescription className="text-slate-600 text-xs leading-relaxed">
                  We never push high-commission substandard institutions. Every university recommendation is strictly aligned with the student's academic GPA, budget, and long-term career goals.
                </CardDescription>
              </Card>

              <Card className="p-8 border-hairline bg-white space-y-3">
                <Target size={28} className="text-primary" />
                <CardTitle className="text-xl font-bold text-primary">High Visa Success</CardTitle>
                <CardDescription className="text-slate-600 text-xs leading-relaxed">
                  Our certified visa team conducts rigorous mock interview sessions, financial proof verifications, and SOP editorial reviews, sustaining a 98.4% visa approval record.
                </CardDescription>
              </Card>

              <Card className="p-8 border-hairline bg-white space-y-3">
                <Heart size={28} className="text-primary" />
                <CardTitle className="text-xl font-bold text-primary">Post-Arrival Guidance</CardTitle>
                <CardDescription className="text-slate-600 text-xs leading-relaxed">
                  Our commitment extends beyond visa issuance. We assist students with flight bookings, temporary student housing, airport reception, SIM cards, and student bank accounts.
                </CardDescription>
              </Card>
            </div>
          </SectionReveal>

          {/* OUR 6-STAGE METHODOLOGY */}
          <SectionReveal className="mb-20 bg-subtle-gray p-8 md:p-12 rounded-3xl border border-hairline">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary bg-white px-3 py-1 rounded-full border border-hairline">
                Tested Methodology
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-primary tracking-tight mt-3">
                Our 6-Step Admission & Visa Framework
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-white border border-hairline space-y-2">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">Step 1</span>
                <h3 className="font-bold text-base text-primary">Comprehensive Profile Audit</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Evaluation of academic GPA, standardized test scores (IELTS/PTE), backlog review, and budget assessment.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-hairline space-y-2">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">Step 2</span>
                <h3 className="font-bold text-base text-primary">Strategic University Shortlisting</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Selecting target, reach, and safety universities with high post-study work permit opportunities.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-hairline space-y-2">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">Step 3</span>
                <h3 className="font-bold text-base text-primary">Bespoke SOP & Documentation</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Professional editorial crafting of Statement of Purpose (SOP), Letters of Recommendation (LORs), and Academic Resume.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-hairline space-y-2">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">Step 4</span>
                <h3 className="font-bold text-base text-primary">Scholarship & Financial Aid</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Filing for merit waivers, regional bursaries (e.g. Italian DSU grants), and education loan bank tie-ups.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-hairline space-y-2">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">Step 5</span>
                <h3 className="font-bold text-base text-primary">Student Visa Dossier & Mock Prep</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Formulating GIC, Blocked Accounts, CAS approvals, and high-precision embassy visa interview simulations.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-hairline space-y-2">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">Step 6</span>
                <h3 className="font-bold text-base text-primary">Pre-Departure & Landing Support</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Orientation sessions on foreign currency exchange, student housing, airport pickup, and part-time job rules.</p>
              </div>
            </div>
          </SectionReveal>

          {/* DYNAMIC CERTIFIED TEAM FROM CAREER_EXPERTS TABLE */}
          <SectionReveal className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary bg-subtle-gray px-3 py-1 rounded-full border border-hairline">
                Certified Advisors
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-primary tracking-tight mt-3">
                Meet Our Leadership & Education Counselors
              </h2>
            </div>

            {teamMembers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member) => (
                  <Card key={member.id} className="p-8 border-hairline bg-white text-center space-y-3 hover:shadow-md transition-shadow flex flex-col justify-between items-center">
                    <div className="space-y-3 w-full">
                      {member.photo_url ? (
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-20 h-20 rounded-full object-cover border-2 border-primary/20 mx-auto shadow-sm"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-primary/10 text-primary font-display font-bold text-2xl flex items-center justify-center mx-auto border-2 border-primary/20">
                          {member.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-display font-bold text-lg text-primary">{member.name}</h3>
                        <p className="text-xs font-semibold text-slate-700 mt-1">{member.designation}</p>
                      </div>
                      {member.expertise && (
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                          {member.expertise}
                        </span>
                      )}
                    </div>
                    {member.linkedin_url && (
                      <div className="pt-2">
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-slate-900 transition-colors"
                        >
                          <LinkedinLogo size={16} weight="fill" /> LinkedIn Profile
                        </a>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-subtle-gray rounded-2xl border border-hairline max-w-md mx-auto">
                <p className="text-xs font-semibold text-slate-600">Counselor directory currently updating.</p>
              </div>
            )}
          </SectionReveal>

          {/* OFFICE LOCATIONS */}
          <SectionReveal className="mb-16">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary bg-subtle-gray px-3 py-1 rounded-full border border-hairline">
                Global Network
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-primary tracking-tight mt-3">
                Our Office Locations
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {offices.map((office, idx) => (
                <Card key={idx} className="p-6 border-hairline bg-white space-y-3">
                  <Building size={24} className="text-primary" />
                  <h3 className="font-bold text-base text-primary">{office.branch}</h3>
                  <p className="text-xs text-slate-600">{office.address}</p>
                  <div className="pt-2 text-xs font-semibold text-slate-700 space-y-1">
                    <p>Phone: {office.phone}</p>
                    <p>Email: {office.email}</p>
                  </div>
                </Card>
              ))}
            </div>
          </SectionReveal>

          {/* CTA */}
          <SectionReveal>
            <div className="p-10 rounded-3xl bg-primary text-white text-center space-y-4">
              <h2 className="font-display font-bold text-2xl md:text-4xl text-white">
                Ready for Honest, Unbiased Study Abroad Counseling?
              </h2>
              <p className="text-slate-300 text-xs md:text-sm max-w-xl mx-auto">
                Schedule a 1-on-1 counseling session with our QEAC-certified team today.
              </p>
              <Link href="/contact" className="inline-block">
                <Button variant="primary" size="lg" className="bg-white text-primary hover:bg-slate-100 font-bold">
                  Book Free Session Now
                </Button>
              </Link>
            </div>
          </SectionReveal>

        </div>
      </main>

      <Footer />
    </>
  );
}
