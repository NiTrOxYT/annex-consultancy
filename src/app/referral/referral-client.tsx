"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { 
  Gift, CurrencyInr, Users, CheckCircle, ArrowRight, CaretDown, 
  Sparkle, ShieldCheck, GraduationCap, Bank, Lightning, Headset, 
  PaperPlaneRight, Globe, Paperclip, SpinnerGap, PhoneCall, EnvelopeSimple, User, MapPin
} from "@phosphor-icons/react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// ==========================================
// 1. HERO SECTION
// ==========================================
function ReferralHero() {
  const scrollToForm = () => {
    const formElem = document.getElementById("referral-form-section");
    if (formElem) {
      formElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-hairline/60">
      {/* Subtle Background Elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/60 text-purple-700 text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs"
            >
              <Sparkle size={14} className="text-amber-500" weight="fill" />
              <span>ANNEX Official Referral Program</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-primary tracking-tight leading-[1.08] mb-6"
            >
              Refer Friends.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-primary to-amber-600">
                Earn ₹10,000.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mb-8"
            >
              Know someone planning to study in India or abroad? Refer them to ANNEX Consultancy and receive <strong className="text-primary font-bold">₹10,000</strong> for every successful admission.*
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Button
                onClick={scrollToForm}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto shadow-md shadow-primary/10 flex items-center justify-center gap-2 text-base font-bold px-8"
              >
                <span>Start Referring Now</span>
                <ArrowRight size={18} weight="bold" />
              </Button>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base">
                  Contact Us
                </Button>
              </Link>
            </motion.div>

            {/* Quick Proof Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-10 pt-6 border-t border-hairline/80 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium"
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-500" weight="fill" />
                <span>No Registration Fee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-500" weight="fill" />
                <span>Unlimited Referrals</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-500" weight="fill" />
                <span>Direct Bank Payout</span>
              </div>
            </motion.div>
          </div>

          {/* Right Hero Illustration / Card Banner */}
          <div className="lg:col-span-5 relative w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative rounded-3xl bg-gradient-to-br from-primary via-slate-900 to-purple-950 p-8 text-white shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-gold/20 rounded-full blur-2xl pointer-events-none" />

              {/* Reward Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold text-slate-950 text-xs font-mono-data font-bold uppercase tracking-wider mb-6 shadow-sm">
                <Gift size={16} weight="fill" />
                <span>Reward Bonus</span>
              </div>

              {/* Large Reward Typography */}
              <div className="space-y-1 mb-6">
                <span className="text-xs uppercase tracking-widest text-slate-300 font-bold block">Cash Reward Per Student</span>
                <h3 className="font-display font-bold text-5xl sm:text-6xl text-gold tracking-tight">
                  ₹10,000
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-6">
                Earn guaranteed cash bonuses when your referred friends complete university enrolment through ANNEX Consultancy.
              </p>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Target Destination</span>
                  <span className="font-bold text-white">India & Global</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Payout Frequency</span>
                  <span className="font-bold text-emerald-400">On Enrolment</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Eligibility</span>
                  <span className="font-bold text-white">Students, Parents, Alumni</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ==========================================
// 2. HOW IT WORKS (3 STEPS)
// ==========================================
function ReferralSteps() {
  const steps = [
    {
      num: "01",
      title: "Refer a Friend",
      subtitle: "Share their basic details",
      desc: "Fill out our quick referral form with your friend's contact information and study preferences.",
      icon: Users
    },
    {
      num: "02",
      title: "We Counsel",
      subtitle: "Our experts guide them",
      desc: "Our senior education counselors assist them with university selection, applications, and visa processing.",
      icon: Headset
    },
    {
      num: "03",
      title: "You Earn",
      subtitle: "Receive ₹10,000 reward",
      desc: "Once your friend successfully enrolls at their chosen university, your ₹10,000 reward is disbursed.",
      icon: Gift
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-hairline/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-mono-data font-bold tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
            Simple 3-Step Process
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-primary tracking-tight mt-4">
            How The Referral Program Works
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Helping your friends get into top universities is simple, transparent, and rewarding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="relative bg-slate-50 border border-hairline p-8 rounded-3xl text-left hover:shadow-lg hover:-translate-y-1 transition-all group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Icon size={28} weight="fill" />
                  </div>
                  <span className="text-3xl font-display font-bold text-slate-300 font-mono-data">
                    {step.num}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl text-primary mb-1">{step.title}</h3>
                <span className="text-xs font-bold text-purple-700 block mb-3">{step.subtitle}</span>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 3. REWARD HIGHLIGHT SECTION
// ==========================================
function RewardSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-slate-900 to-purple-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase font-mono-data font-bold tracking-widest bg-gold text-slate-950 px-3.5 py-1 rounded-full">
              Unlimited Earnings
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight leading-tight">
              Earn ₹10,000 Per Successful Referral
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              There is no cap on how much you can earn. Refer 5 friends and earn ₹50,000. Refer 10 friends and earn ₹1,000,000!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {[
                "No registration fee required",
                "Unlimited referrals allowed",
                "Fast & secure payout process",
                "Trusted education consultancy"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <CheckCircle size={20} className="text-gold shrink-0" weight="fill" />
                  <span className="text-xs sm:text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl text-center w-full max-w-md shadow-2xl relative">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-300 block mb-2">Reward Per Admission</span>
              <h3 className="font-display font-bold text-6xl text-gold font-mono-data tracking-tight mb-3">
                ₹10,000
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Directly transferred to your bank account or UPI upon student university enrolment confirmation.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ==========================================
// 4. WHY REFER ANNEX (BENEFITS)
// ==========================================
function ReferralBenefits() {
  const benefits = [
    { title: "Trusted by Students", desc: "Thousands of students successfully placed in premier institutions.", icon: ShieldCheck },
    { title: "Experienced Counselors", desc: "Certified education advisors with 10+ years of domain expertise.", icon: Users },
    { title: "University Partnerships", desc: "Direct tie-ups with leading Indian & international universities.", icon: Bank },
    { title: "Fast Application Support", desc: "Accelerated application processing & quick admission offers.", icon: Lightning },
    { title: "Visa Guidance", desc: "End-to-end documentation validation & visa interview preparation.", icon: GraduationCap },
    { title: "End-to-End Assistance", desc: "Complete support from university selection to accommodation.", icon: Headset }
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-hairline/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-mono-data font-bold tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
            Why Choose Us
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-primary tracking-tight mt-4">
            Why Refer ANNEX Consultancy?
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Your friends are in safe hands with our certified education experts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white border border-hairline p-6 rounded-2xl shadow-2xs hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Icon size={24} weight="bold" />
                </div>
                <h3 className="font-bold text-base text-primary mb-1.5">{benefit.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{benefit.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 5. REFERRAL FORM SECTION
// ==========================================
function ReferralForm() {
  const [form, setForm] = React.useState({
    referrer_name: "",
    referrer_email: "",
    referrer_phone: "",
    referrer_city: "",
    student_name: "",
    student_phone: "",
    preferred_country: "India",
    message: ""
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.referrer_name || !form.referrer_phone || !form.student_name || !form.student_phone) {
      alert("Please fill in all required fields marked with *");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/referral/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit referral");
      
      setSubmitted(true);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="referral-form-section" className="py-20 bg-white border-b border-hairline/60">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-mono-data font-bold tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
            Submit Your Referral
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-primary tracking-tight mt-4">
            Refer A Student Today
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Fill out the form below with your details and your friend's contact information.
          </p>
        </div>

        <Card className="p-8 sm:p-10 shadow-xl border border-hairline bg-white rounded-3xl">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle size={36} weight="fill" />
              </div>
              <h3 className="font-display font-bold text-2xl text-primary">Referral Submitted Successfully!</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                Thank you for referring your friend. Our senior counselors will contact them shortly. You can track your reward status with our team.
              </p>
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    referrer_name: "",
                    referrer_email: "",
                    referrer_phone: "",
                    referrer_city: "",
                    student_name: "",
                    student_phone: "",
                    preferred_country: "India",
                    message: ""
                  });
                }}
                variant="outline"
                className="mt-4"
              >
                Submit Another Referral
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Your Details */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-primary uppercase tracking-wider border-b border-hairline pb-2 flex items-center gap-2">
                  <User size={18} className="text-purple-600" /> Your Information (Referrer)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.referrer_name}
                      onChange={(e) => setForm({ ...form, referrer_name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="px-4 py-2.5 rounded-xl border border-hairline text-xs outline-none focus:ring-1 focus:ring-primary/20 bg-slate-50/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={form.referrer_phone}
                      onChange={(e) => setForm({ ...form, referrer_phone: e.target.value })}
                      placeholder="e.g. +91 9876543210"
                      className="px-4 py-2.5 rounded-xl border border-hairline text-xs outline-none focus:ring-1 focus:ring-primary/20 bg-slate-50/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      value={form.referrer_email}
                      onChange={(e) => setForm({ ...form, referrer_email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className="px-4 py-2.5 rounded-xl border border-hairline text-xs outline-none focus:ring-1 focus:ring-primary/20 bg-slate-50/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">City</label>
                    <input
                      type="text"
                      value={form.referrer_city}
                      onChange={(e) => setForm({ ...form, referrer_city: e.target.value })}
                      placeholder="e.g. Mumbai, New Delhi"
                      className="px-4 py-2.5 rounded-xl border border-hairline text-xs outline-none focus:ring-1 focus:ring-primary/20 bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Student Details */}
              <div className="space-y-4 pt-4">
                <h4 className="font-bold text-sm text-primary uppercase tracking-wider border-b border-hairline pb-2 flex items-center gap-2">
                  <GraduationCap size={18} className="text-purple-600" /> Student's Information (Referred)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Student Name *</label>
                    <input
                      type="text"
                      required
                      value={form.student_name}
                      onChange={(e) => setForm({ ...form, student_name: e.target.value })}
                      placeholder="e.g. Priya Patel"
                      className="px-4 py-2.5 rounded-xl border border-hairline text-xs outline-none focus:ring-1 focus:ring-primary/20 bg-slate-50/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Student Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={form.student_phone}
                      onChange={(e) => setForm({ ...form, student_phone: e.target.value })}
                      placeholder="e.g. +91 9123456789"
                      className="px-4 py-2.5 rounded-xl border border-hairline text-xs outline-none focus:ring-1 focus:ring-primary/20 bg-slate-50/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">Preferred Study Destination</label>
                    <select
                      value={form.preferred_country}
                      onChange={(e) => setForm({ ...form, preferred_country: e.target.value })}
                      className="px-4 py-2.5 rounded-xl border border-hairline text-xs outline-none bg-white font-semibold cursor-pointer"
                    >
                      <option value="India">Study in India</option>
                      <option value="UK">United Kingdom (UK)</option>
                      <option value="Australia">Australia</option>
                      <option value="Europe">Europe</option>
                      <option value="Dubai">Dubai</option>
                      <option value="Italy">Italy</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">Additional Message / Course Preference</label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Mention any preferred course (e.g. B.Tech, MBA, MBBS) or specific university request..."
                      className="px-4 py-2.5 rounded-xl border border-hairline text-xs outline-none focus:ring-1 focus:ring-primary/20 bg-slate-50/50 resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  variant="primary"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2 font-bold text-sm shadow-md"
                >
                  {submitting ? <SpinnerGap size={18} className="animate-spin" /> : <PaperPlaneRight size={18} weight="bold" />}
                  <span>{submitting ? "Submitting Referral..." : "Submit Referral Now"}</span>
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </section>
  );
}

// ==========================================
// 6. FAQ ACCORDION SECTION
// ==========================================
function ReferralFAQ() {
  const [openIdx, setOpenIdx] = React.useState<number | null>(0);

  const faqs = [
    {
      q: "Who can participate in the referral program?",
      a: "Anyone! Current students, alumni, parents, and general public can refer students to ANNEX Consultancy. No prior registration is required to start referring."
    },
    {
      q: "When do I receive the ₹10,000 cash reward?",
      a: "The ₹10,000 cash reward is disbursed directly to your bank account or UPI after your referred student successfully completes their university enrolment and tuition fee payment."
    },
    {
      q: "Is there any limit on how many students I can refer?",
      a: "No! There is absolutely no limit. You will earn ₹10,000 for every single student who successfully enrolls through ANNEX Consultancy."
    },
    {
      q: "Can I refer multiple students at the same time?",
      a: "Yes, you can submit as many student referrals as you like by filling out the referral form multiple times or contacting our referral support team."
    },
    {
      q: "How do payouts work?",
      a: "Once enrolment is confirmed by our operations team, you will be notified via phone/email and requested to provide your UPI ID or bank details for direct transfer."
    }
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-hairline/60">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-mono-data font-bold tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
            Frequently Asked Questions
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-primary tracking-tight mt-4">
            Got Questions? We Have Answers.
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="bg-white border border-hairline rounded-2xl overflow-hidden transition-all shadow-2xs">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-primary hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <CaretDown size={18} className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-5 text-xs sm:text-sm text-slate-500 leading-relaxed border-t border-hairline/40 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 7. FINAL CTA SECTION
// ==========================================
function ReferralCTA() {
  const scrollToForm = () => {
    const formElem = document.getElementById("referral-form-section");
    if (formElem) {
      formElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-primary to-purple-950 text-white text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 space-y-6">
        <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight">
          Ready to Earn ₹10,000?
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Start referring today and help students achieve their dream higher education with certified expert guidance.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button
            onClick={scrollToForm}
            variant="primary"
            size="lg"
            className="bg-gold text-slate-950 hover:bg-amber-400 font-bold px-8 shadow-lg"
          >
            Start Referring Today
          </Button>
          <Link href="/contact">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Talk to Counselor
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// MAIN REFERRAL PAGE CLIENT
// ==========================================
export default function ReferralPageClient() {
  return (
    <>
      <Navigation />
      <main className="flex-grow">
        <ReferralHero />
        <ReferralSteps />
        <RewardSection />
        <ReferralBenefits />
        <ReferralForm />
        <ReferralFAQ />
        <ReferralCTA />
      </main>
      <Footer />
    </>
  );
}
