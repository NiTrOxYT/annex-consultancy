"use client";

import * as React from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sparkle, CheckCircle, Warning, SpinnerGap } from "@phosphor-icons/react";

export default function ReferralLandingPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = React.use(params);
  const code = resolvedParams.code;

  const [loading, setLoading] = React.useState(true);
  const [validCode, setValidCode] = React.useState(false);
  const [referrerName, setReferrerName] = React.useState("");
  const [referrerId, setReferrerId] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    preferredCountry: "United Kingdom",
    preferredIntake: "Autumn 2026",
    notes: ""
  });

  React.useEffect(() => {
    const validateReferral = async () => {
      try {
        const res = await fetch(`/api/referrals?code=${encodeURIComponent(code)}`);
        if (!res.ok) throw new Error("Validation failed");
        const data = await res.json();
        
        if (data.success && data.valid) {
          setValidCode(true);
          setReferrerName(data.referrerName);
          setReferrerId(data.referrerId);
        } else {
          setValidCode(false);
        }
      } catch (err) {
        console.error("Error validating referral code:", err);
        setValidCode(false);
      } finally {
        setLoading(false);
      }
    };

    validateReferral();
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validCode) {
      setErrorMsg("Cannot submit: Referral code is invalid.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referrerCode: code,
          referredName: form.name,
          referredEmail: form.email,
          referredPhone: form.phone || null,
          preferredCountry: form.preferredCountry,
          preferredIntake: form.preferredIntake,
          notes: form.notes || null
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit referral");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navigation />

      <main className="flex-grow pt-32 pb-24 bg-slate-50 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-xl w-full">
          
          {loading ? (
            <Card className="p-12 text-center flex flex-col items-center justify-center gap-4 bg-white shadow-xl rounded-3xl border border-hairline">
              <SpinnerGap size={36} className="animate-spin text-primary" />
              <p className="text-slate-500 text-sm font-medium">Validating referral link...</p>
            </Card>
          ) : submitted ? (
            <Card className="p-8 md:p-12 text-center flex flex-col items-center justify-center bg-white shadow-xl rounded-3xl border border-hairline animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6">
                <CheckCircle size={36} weight="fill" />
              </div>
              <CardTitle className="text-2xl md:text-3xl font-display font-bold text-primary tracking-tight mb-4">
                Thank you! 🎉
              </CardTitle>
              <CardDescription className="text-slate-500 text-sm md:text-base leading-relaxed max-w-sm mb-8 mx-auto">
                Your details have been registered under **{referrerName}**'s referral. An admissions counselor from **Annex Consultancy** will contact you shortly to begin your global education process.
              </CardDescription>
              <div className="flex gap-4 w-full">
                <Link href="/" className="flex-1">
                  <Button variant="primary" className="w-full">
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card className="bg-white shadow-xl rounded-3xl border border-hairline p-6 md:p-10 text-left">
              <div className="mb-8 border-b border-hairline pb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline/80 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-4">
                  <Sparkle size={12} className="text-gold" weight="fill" />
                  Annex Consultancy Referrals
                </div>
                
                {validCode ? (
                  <div>
                    <h1 className="font-display font-bold text-2xl md:text-3xl text-primary tracking-tight mb-2">
                      Get Started with Annex.
                    </h1>
                    <p className="text-slate-500 text-xs md:text-sm">
                      You were referred by <span className="font-bold text-primary">{referrerName}</span>. Fill out this quick form, and we'll guide you step-by-step.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                    <Warning size={20} className="text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-red-800 uppercase tracking-wide">Invalid Referral Code</h4>
                      <p className="text-[11px] text-red-600 mt-0.5">
                        This referral code (**{code}**) is not valid or has expired. Please verify with your referrer and try again.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {validCode && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-600">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-xs font-bold text-primary uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="px-4 py-2.5 border border-hairline rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-xs font-bold text-primary uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="px-4 py-2.5 border border-hairline rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-xs font-bold text-primary uppercase tracking-wider">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="px-4 py-2.5 border border-hairline rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white"
                      placeholder="+977 98XXXXXXXX"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="country" className="text-xs font-bold text-primary uppercase tracking-wider">Preferred Destination</label>
                      <select
                        id="country"
                        value={form.preferredCountry}
                        onChange={(e) => setForm({ ...form, preferredCountry: e.target.value })}
                        className="px-4 py-2.5 border border-hairline rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 cursor-pointer"
                      >
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Europe">Europe</option>
                        <option value="Dubai">Dubai</option>
                        <option value="Italy">Italy</option>
                        <option value="India">India</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="intake" className="text-xs font-bold text-primary uppercase tracking-wider">Preferred Intake</label>
                      <select
                        id="intake"
                        value={form.preferredIntake}
                        onChange={(e) => setForm({ ...form, preferredIntake: e.target.value })}
                        className="px-4 py-2.5 border border-hairline rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 cursor-pointer"
                      >
                        <option value="Autumn 2026">Autumn 2026</option>
                        <option value="Spring 2027">Spring 2027</option>
                        <option value="Autumn 2027">Autumn 2027</option>
                        <option value="Spring 2028">Spring 2028</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="notes" className="text-xs font-bold text-primary uppercase tracking-wider">Notes / Questions</label>
                    <textarea
                      id="notes"
                      rows={3}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      className="px-4 py-2.5 border border-hairline rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white"
                      placeholder="Share any specific course interests or scholarship queries..."
                    />
                  </div>

                  <Button type="submit" variant="primary" className="w-full mt-3" disabled={submitting}>
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <SpinnerGap className="animate-spin" size={16} />
                        Submitting Referral...
                      </span>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </form>
              )}

              {!validCode && (
                <div className="mt-6 text-center">
                  <Link href="/">
                    <Button variant="secondary" className="w-full">
                      Go to Home
                    </Button>
                  </Link>
                </div>
              )}

            </Card>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
