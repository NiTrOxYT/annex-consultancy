"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Sparkle, ShieldCheck, FileText, Database, Lock, ShareNetwork, Cookie, MapPin, Phone, Envelope } from "@phosphor-icons/react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

export default function PrivacyPolicy() {
  const lastUpdated = "June 16, 2026";

  const policySections = [
    {
      id: "data-collection",
      icon: <Database size={20} className="text-primary" weight="bold" />,
      title: "Data Collection & Student Inquiries",
      content: "We collect personal information that you voluntarily provide to us when you register interest, schedule a consultation, or submit inquiries. This includes your full name, email address, phone number, academic history, standardized test scores (IELTS/PTE), and desired study destination.",
    },
    {
      id: "contact-forms",
      icon: <FileText size={20} className="text-primary" weight="bold" />,
      title: "Contact Forms & Communications",
      content: "When you contact us through our website's booking forms or support channels, we capture the data submitted to respond to your queries. This interaction metadata helps us prepare relevant placement suggestions before our first counseling session.",
    },
    {
      id: "application-assistance",
      icon: <ShareNetwork size={20} className="text-primary" weight="bold" />,
      title: "Application Assistance & Sharing",
      content: "To guide your admissions successfully, we process and organize academic transcripts, letters of recommendation, portfolios, and passport details. When authorized by you, this secure data is shared with our official partner colleges and universities in the UK, Australia, Europe, Dubai, and India to process admission requests.",
    },
    {
      id: "cookies-analytics",
      icon: <Cookie size={20} className="text-primary" weight="bold" />,
      title: "Cookies & Analytics",
      content: "We utilize cookies and tracking technologies to analyze web traffic, understand page preferences, and optimize your navigation experience. You can choose to opt-out or modify these trackers at any time by visiting our Cookie Settings page.",
    },
    {
      id: "data-protection",
      icon: <Lock size={20} className="text-primary" weight="bold" />,
      title: "Data Protection & Document Safety",
      content: "Annex employs industry-standard administrative, technical, and physical security measures to safeguard your personal credentials and uploaded documents against unauthorized access, alteration, disclosure, or destruction.",
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
              Privacy & Trust
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tighter leading-none mb-6">
              Privacy Policy
            </h1>
            <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-[60ch] mb-4">
              Learn how Annex Education Consultancy handles your personal data, inquiries, and application credentials to ensure a safe transition to your dream educational destination.
            </p>
            <p className="text-xs font-mono-data text-slate-400">
              Last Updated: {lastUpdated}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Policy Details Column */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              {policySections.map((section, index) => (
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

              <section className="bg-subtle-gray/40 border border-hairline/80 rounded-2xl p-6 md:p-8 mt-4">
                <h3 className="font-display font-bold text-lg text-primary mb-3 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-gold" weight="fill" />
                  Your Rights and Choices
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  As an applicant, you reserve the right to review the documents we store, request correction of inaccurate data, or ask for deletion of your consultation files once your admission or visa cycle completes. For inquiries regarding data records, contact our privacy compliance desk.
                </p>
              </section>
            </div>

            {/* Offices & Contacts Column */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <Card className="h-auto">
                <CardTitle className="text-sm uppercase tracking-wider text-slate-400 mb-6">Contact & Offices</CardTitle>
                <div className="flex flex-col gap-6">
                  {/* Nepal Head Office */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={16} className="text-primary" />
                      <h4 className="text-sm font-bold text-primary">Nepal Office (HQ)</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed pl-6">
                      Kathmandu Head Office<br />
                      New Baneshwor, Kathmandu, Nepal<br />
                      <span className="font-mono-data">TEL: +977-1-4780516</span><br />
                      <span className="font-mono-data">MAIL: info@annexconsultant.com</span>
                    </p>
                  </div>

                  {/* India Branch Office */}
                  <div className="border-t border-hairline pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={16} className="text-primary" />
                      <h4 className="text-sm font-bold text-primary">India Office</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed pl-6">
                      99/1/2, Girish Ghosh Rd<br />
                      Belur Math, Ghusuri<br />
                      Howrah, West Bengal 711202, India<br />
                      <span className="font-mono-data">TEL: +91-33-XXXXXXXX</span><br />
                      <span className="font-mono-data">MAIL: india@annexconsultant.com</span>
                    </p>
                  </div>

                  {/* Compliance Contact */}
                  <div className="border-t border-hairline pt-6 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Envelope size={16} className="text-primary" />
                      <h4 className="text-sm font-bold text-primary">Data Desk</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed pl-6">
                      For data privacy requests or file cleanup:
                      <span className="block font-semibold text-primary font-mono-data mt-1">
                        privacy@annexconsultant.com
                      </span>
                    </p>
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
