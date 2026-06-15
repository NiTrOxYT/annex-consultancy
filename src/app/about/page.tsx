"use client";

import { motion } from "motion/react";
import { Sparkle, ShieldCheck, Target, Heart } from "@phosphor-icons/react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

const teamMembers = [
  {
    name: "Subas Chandra Thapa",
    role: "Managing Director / Principal Counselor",
    meta: "QEAC Certified No. M108",
  },
  {
    name: "Sonia Regmi",
    role: "Head of Admissions",
    meta: "Senior Education Advisor",
  },
  {
    name: "Dr. Prabhat Adhikari",
    role: "Advisory Board Member",
    meta: "Academic Relations Specialist",
  },
];

const offices = [
  {
    branch: "Head Office (Kathmandu)",
    address: "New Baneshwor, Kathmandu, Nepal",
    phone: "+977-1-4780516",
    email: "kathmandu@annexconsultant.com",
  },
  {
    branch: "India Office",
    address: "99/1/2, Girish Ghosh Rd, Belur Math, Ghusuri, Howrah, West Bengal 711202, India",
    phone: "+91-33-XXXXXXXX",
    email: "india@annexconsultant.com",
  },
  {
    branch: "Liaison Office (Sydney)",
    address: "George Street, Sydney, NSW, Australia",
    phone: "+61-2-9281-2292",
    email: "sydney@annexconsultant.com",
  },
];

export default function About() {
  return (
    <>
      <Navigation />

      <main className="flex-grow pt-32 pb-24 bg-white text-left">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Header */}
          <div className="max-w-3xl mb-20">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline/80 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-6">
              <Sparkle size={12} className="text-gold" weight="fill" />
              Company Story
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tighter leading-none mb-6">
              Empowering global educational placements.
            </h1>
            <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-[55ch]">
              Founded with the vision of offering high-transparency guidance, Annex has been placed in the center of global student counseling for over 15 years.
            </p>
          </div>

          {/* Core Values / Mission & Vision */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            <div className="flex flex-col items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <Target size={18} weight="bold" />
              </div>
              <h3 className="font-display font-bold text-lg text-primary">Our Mission</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[32ch]">
                To provide verified, uncompromised student placements that elevate career opportunities globally.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <ShieldCheck size={18} weight="bold" />
              </div>
              <h3 className="font-display font-bold text-lg text-primary">Transparency</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[32ch]">
                We maintain an honest record of university conditions, cost breakdowns, and visa expectations.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <Heart size={18} weight="bold" />
              </div>
              <h3 className="font-display font-bold text-lg text-primary">Student Focus</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[32ch]">
                We support learners pre-departure and during their arrival adjustment at host campuses.
              </p>
            </div>
          </section>

          {/* Team Members Section */}
          <section className="mb-24">
            <h2 className="font-display font-bold text-3xl text-primary tracking-tight mb-12">
              Our principal team.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <Card key={member.name} className="flex flex-col justify-between min-h-[180px]">
                  <div className="mb-4">
                    <CardTitle className="text-base mb-1">{member.name}</CardTitle>
                    <p className="text-xs font-semibold text-slate-500">{member.role}</p>
                  </div>
                  <div className="border-t border-hairline pt-3 text-xs font-mono-data text-gold font-semibold">
                    {member.meta}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Offices List */}
          <section>
            <h2 className="font-display font-bold text-3xl text-primary tracking-tight mb-12">
              Global locations.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offices.map((office) => (
                <Card key={office.branch} className="flex flex-col justify-between min-h-[200px]">
                  <div>
                    <CardTitle className="text-lg mb-2">{office.branch}</CardTitle>
                    <CardDescription className="mb-4">
                      {office.address}
                    </CardDescription>
                  </div>
                  <div className="border-t border-hairline pt-4 flex flex-col gap-1 text-xs font-mono-data text-slate-500">
                    <span>TEL: {office.phone}</span>
                    <span>MAIL: {office.email}</span>
                  </div>
                </Card>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}
