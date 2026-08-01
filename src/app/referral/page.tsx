"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { 
  Gift, ShareNetwork, UserPlus, CurrencyInr, 
  ArrowRight, Sparkle, ShieldCheck, UserCheck, 
  SpinnerGap, CheckCircle, Copy, Share
} from "@phosphor-icons/react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ReferralPage() {
  // Public Referral Submission Form State
  const [referrerName, setReferrerName] = React.useState("");
  const [referrerEmail, setReferrerEmail] = React.useState("");
  const [referrerPhone, setReferrerPhone] = React.useState("");
  
  const [referredName, setReferredName] = React.useState("");
  const [referredEmail, setReferredEmail] = React.useState("");
  const [referredPhone, setReferredPhone] = React.useState("");
  const [destination, setDestination] = React.useState("India");
  
  const [submitting, setSubmitting] = React.useState(false);
  const [submittedSuccess, setSubmittedSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmitReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referrerCode: referrerEmail || referrerPhone,
          referrerName,
          referrerEmail,
          referrerPhone,
          referredName,
          referredEmail,
          referredPhone,
          preferredCountry: destination
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit referral");

      setSubmittedSuccess(true);
    } catch (err: any) {
      setSubmittedSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navigation />

      <main className="flex-grow pt-28 pb-20">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-8 pb-16 bg-white border-b border-hairline/80">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
              
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/15 border border-gold/40 text-xs font-bold text-slate-900 uppercase tracking-widest"
              >
                <Gift size={16} className="text-primary" weight="bold" />
                <span>ANNEX REFERRAL PROGRAM</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-primary tracking-tight leading-[1.1]"
              >
                Share Opportunity.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-slate-800 to-gold">
                  Earn Up to ₹10,000 Cash.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-slate-600 leading-relaxed"
              >
                Know a friend or family member aiming to study abroad or in India? Refer them to Annex Consultancy. When your referred student enrolls, you receive a cash payout of up to ₹10,000.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-4 pt-2"
              >
                <a
                  href="#refer-form"
                  className="px-6 py-3.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary/95 transition-all shadow-md flex items-center gap-2"
                >
                  Refer a Friend Now <ArrowRight size={16} weight="bold" />
                </a>
                <Link
                  href="/student-login"
                  className="px-6 py-3.5 rounded-full bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all border border-hairline flex items-center gap-2"
                >
                  Student Portal Login &rarr;
                </Link>
              </motion.div>

            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20 max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="font-display font-bold text-3xl text-primary">How Referral Rewards Work</h2>
            <p className="text-slate-500 text-sm">Three simple steps to start earning rewards for helping students achieve their global education goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: ShareNetwork,
                title: "Submit Friend Details",
                desc: "Fill in your details and your friend's contact information in the quick form below."
              },
              {
                step: "02",
                icon: UserCheck,
                title: "Free Counseling & Admission",
                desc: "Our expert counselors guide your friend through course shortlisting, university applications, and admission."
              },
              {
                step: "03",
                icon: CurrencyInr,
                title: "Claim ₹10,000 Payout",
                desc: "Once your friend successfully enrolls, your ₹10,000 cash reward is transferred directly to your bank account."
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card key={idx} className="border border-hairline hover:shadow-lg transition-all rounded-3xl p-8 relative bg-white flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                        <Icon size={24} weight="bold" />
                      </div>
                      <span className="font-mono-data text-2xl font-bold text-slate-300">{item.step}</span>
                    </div>
                    <h3 className="font-bold text-xl text-primary mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* REFERRAL FORM SECTION */}
        <section id="refer-form" className="py-12 max-w-4xl mx-auto px-6">
          <Card className="border border-hairline/80 rounded-3xl p-8 md:p-12 shadow-xl bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full font-mono-data">
                Quick Referral Submission
              </span>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-primary">Submit a Referral</h2>
              <p className="text-slate-500 text-xs md:text-sm">
                Enter your details and your friend's contact information. We will handle the rest!
              </p>
            </div>

            {submittedSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-8 text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle size={32} weight="fill" />
                </div>
                <h3 className="font-bold text-2xl text-emerald-950">Referral Received! 🎉</h3>
                <p className="text-xs md:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Thank you! Our counseling team will contact <strong>{referredName}</strong> shortly. We will keep you updated on reward progress.
                </p>
                <Button 
                  onClick={() => {
                    setSubmittedSuccess(false);
                    setReferredName("");
                    setReferredEmail("");
                    setReferredPhone("");
                  }} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 border-emerald-300 text-emerald-900 hover:bg-emerald-100"
                >
                  Refer Another Student
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmitReferral} className="space-y-6 text-xs">
                
                {/* Referrer (Your Details) */}
                <div className="bg-slate-50/80 p-5 rounded-2xl border border-hairline/60 space-y-4">
                  <h4 className="font-bold text-primary text-xs uppercase tracking-wider flex items-center gap-2">
                    <UserCheck size={18} className="text-primary" weight="bold" /> Your Details (Referrer)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={referrerName}
                        onChange={(e) => setReferrerName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full px-3.5 py-2 border border-hairline rounded-xl outline-none focus:ring-1 focus:ring-primary/20 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={referrerEmail}
                        onChange={(e) => setReferrerEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="w-full px-3.5 py-2 border border-hairline rounded-xl outline-none focus:ring-1 focus:ring-primary/20 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={referrerPhone}
                        onChange={(e) => setReferrerPhone(e.target.value)}
                        placeholder="+91 / Phone"
                        className="w-full px-3.5 py-2 border border-hairline rounded-xl outline-none focus:ring-1 focus:ring-primary/20 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Referred Friend Details */}
                <div className="bg-slate-50/80 p-5 rounded-2xl border border-hairline/60 space-y-4">
                  <h4 className="font-bold text-primary text-xs uppercase tracking-wider flex items-center gap-2">
                    <UserPlus size={18} className="text-primary" weight="bold" /> Friend's Details (Referred Student)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Friend's Full Name *</label>
                      <input
                        type="text"
                        required
                        value={referredName}
                        onChange={(e) => setReferredName(e.target.value)}
                        placeholder="Friend's Name"
                        className="w-full px-3.5 py-2 border border-hairline rounded-xl outline-none focus:ring-1 focus:ring-primary/20 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Friend's Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={referredPhone}
                        onChange={(e) => setReferredPhone(e.target.value)}
                        placeholder="Friend's Phone Number"
                        className="w-full px-3.5 py-2 border border-hairline rounded-xl outline-none focus:ring-1 focus:ring-primary/20 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Friend's Email Address</label>
                      <input
                        type="email"
                        value={referredEmail}
                        onChange={(e) => setReferrerEmail(e.target.value)}
                        placeholder="friend@email.com"
                        className="w-full px-3.5 py-2 border border-hairline rounded-xl outline-none focus:ring-1 focus:ring-primary/20 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Preferred Destination</label>
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full px-3.5 py-2 border border-hairline rounded-xl outline-none bg-white font-semibold cursor-pointer"
                      >
                        <option value="India">Study in India</option>
                        <option value="UK">UK</option>
                        <option value="Australia">Australia</option>
                        <option value="Europe">Europe</option>
                        <option value="Dubai">Dubai</option>
                        <option value="Italy">Italy</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={submitting}
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold text-sm rounded-full shadow-md hover:bg-primary/95 flex items-center justify-center gap-2"
                  >
                    {submitting ? <SpinnerGap size={18} className="animate-spin" /> : <Gift size={18} weight="bold" />}
                    <span>{submitting ? "Submitting Referral..." : "Submit & Claim Reward"}</span>
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </section>

      </main>

      <Footer />
    </div>
  );
}
