"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  ArrowRight, 
  GraduationCap, 
  Globe, 
  Coins, 
  Phone, 
  Envelope, 
  User, 
  CheckCircle, 
  Sparkle, 
  WhatsappLogo, 
  Info,
  Calendar,
  ClipboardText
} from "@phosphor-icons/react";

interface UniversityMatch {
  university_id: string;
  university_name_snapshot: string;
  match_score: number;
  admission_chance: "Safe" | "Target" | "Ambitious";
  scholarship_estimate: string | null;
  logo_url: string | null;
}

interface ApiResponse {
  success: boolean;
  leadId: string;
  matchScore: number;
  leadScore: string;
  priority: string;
  matches: UniversityMatch[];
  whatsappRedirectUrl: string;
}

function CalculatorContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Destination & Course
    preferredCountry: "United Kingdom",
    preferredCourse: "Business",
    intake: "Sept 2026",
    // Step 2: Academics
    qualification: "Bachelors",
    percentage: "",
    testType: "IELTS",
    testScore: "",
    // Step 3: Budget
    currency: "INR",
    budget: "",
    // Step 4: Lead Capture
    name: "",
    email: "",
    phone: "",
    referralCode: ""
  });

  // Response State
  const [results, setResults] = useState<ApiResponse | null>(null);

  // Prefill referral code and UTMs on load
  useEffect(() => {
    const rc = searchParams.get("rc") || searchParams.get("ref") || searchParams.get("referral") || "";
    if (rc) {
      setFormData(prev => ({ ...prev, referralCode: rc }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setError(null);

    // Validations per step
    if (step === 1) {
      if (!formData.preferredCountry || !formData.preferredCourse || !formData.intake) {
        setError("Please fill out all fields in this step.");
        return;
      }
    } else if (step === 2) {
      const pct = Number(formData.percentage);
      if (!formData.percentage || isNaN(pct) || pct < 0 || pct > 100) {
        setError("Please enter a valid academic percentage (0-100).");
        return;
      }
      if (formData.testType !== "None") {
        const score = Number(formData.testScore);
        if (!formData.testScore || isNaN(score) || score <= 0) {
          setError("Please enter your English test score.");
          return;
        }
      }
    } else if (step === 3) {
      const bdg = Number(formData.budget);
      if (!formData.budget || isNaN(bdg) || bdg <= 0) {
        setError("Please enter a valid budget amount.");
        return;
      }
    }

    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Step 4 validations
    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    setLoading(true);

    try {
      const utmSource = searchParams.get("utm_source") || "";
      const utmMedium = searchParams.get("utm_medium") || "";
      const utmCampaign = searchParams.get("utm_campaign") || "";
      const referrer = typeof document !== "undefined" ? document.referrer : "";

      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        qualification: formData.qualification,
        percentage: Number(formData.percentage),
        budget: Number(formData.budget),
        currency: formData.currency,
        preferredCountry: formData.preferredCountry,
        preferredCourse: formData.preferredCourse,
        testType: formData.testType === "None" ? null : formData.testType,
        testScore: formData.testType === "None" ? null : Number(formData.testScore),
        intake: formData.intake,
        referralCode: formData.referralCode.trim() || null,
        utmSource,
        utmMedium,
        utmCampaign,
        referrer
      };

      const res = await fetch("/api/eligibility/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please check your inputs.");
      }

      setResults(data);
      setStep(5); // Show results step
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Title block */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gold/10 text-gold mb-3">
          <Sparkle size={14} className="animate-pulse" />
          Annex Consultancy Lead Engine
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight font-display">
          Study Abroad Eligibility Calculator
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
          Evaluate your academic profile and budget parameters to discover your admissions chances at top global universities in 60 seconds.
        </p>
      </div>

      {/* Progress Tracker */}
      {step < 5 && (
        <div className="mb-8 max-w-md mx-auto">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-2 font-mono-data">
            <span>STEP {step} OF 4</span>
            <span>{Math.round(((step - 1) / 3) * 100)}% COMPLETE</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gold transition-all duration-500 ease-out"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2 max-w-lg mx-auto animate-fade-in">
          <Info size={18} className="shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Calculator Body Card */}
      <div className="bg-white rounded-3xl border border-hairline shadow-xl overflow-hidden min-h-[400px] flex flex-col">
        {step === 1 && (
          <div className="p-6 md:p-10 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                  <Globe size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary font-display">Destination & Course</h2>
                  <p className="text-xs text-slate-400">Select where and what you want to study</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="country-select" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Preferred Destination</label>
                  <select
                    id="country-select"
                    name="preferredCountry"
                    value={formData.preferredCountry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-hairline focus:border-gold focus:outline-none bg-subtle-gray text-slate-800 font-medium transition-colors"
                  >
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="Ireland">Ireland</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="course-select" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Course Category</label>
                  <select
                    id="course-select"
                    name="preferredCourse"
                    value={formData.preferredCourse}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-hairline focus:border-gold focus:outline-none bg-subtle-gray text-slate-800 font-medium transition-colors"
                  >
                    <option value="Business">Business & Management</option>
                    <option value="Engineering">Engineering & Tech</option>
                    <option value="Computer Science">Computer Science & AI</option>
                    <option value="MBBS">MBBS & Medicine</option>
                    <option value="Law">Law & Legal Studies</option>
                    <option value="Art & Design">Art & Design</option>
                    <option value="Social Sciences">Social Sciences</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="intake-select" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Intake</label>
                  <select
                    id="intake-select"
                    name="intake"
                    value={formData.intake}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-hairline focus:border-gold focus:outline-none bg-subtle-gray text-slate-800 font-medium transition-colors"
                  >
                    <option value="Sept 2026">September 2026 (Fall)</option>
                    <option value="Jan 2027">January 2027 (Spring)</option>
                    <option value="Sept 2027">September 2027 (Fall)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                id="step1-next"
                onClick={handleNext}
                className="px-6 py-3 bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl flex items-center gap-2 shadow-md transition-all hover:translate-x-0.5"
              >
                Continue Profile
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-6 md:p-10 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary font-display">Academic Background</h2>
                  <p className="text-xs text-slate-400">Tell us about your qualification and test scores</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="qual-select" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Highest Qualification</label>
                  <select
                    id="qual-select"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-hairline focus:border-gold focus:outline-none bg-subtle-gray text-slate-800 font-medium transition-colors"
                  >
                    <option value="Bachelors">Bachelors Degree</option>
                    <option value="High School">High School (Grade 12)</option>
                    <option value="+2">+2 (NEB Nepal / CBSE India)</option>
                    <option value="Masters">Masters Degree</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="percentage-input" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Academic Score (%)</label>
                  <input
                    type="number"
                    id="percentage-input"
                    name="percentage"
                    value={formData.percentage}
                    onChange={handleChange}
                    placeholder="e.g. 78"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 rounded-xl border border-hairline focus:border-gold focus:outline-none bg-subtle-gray text-slate-800 font-medium transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="test-select" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Language Proficiency Test</label>
                  <select
                    id="test-select"
                    name="testType"
                    value={formData.testType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-hairline focus:border-gold focus:outline-none bg-subtle-gray text-slate-800 font-medium transition-colors"
                  >
                    <option value="IELTS">IELTS Academic</option>
                    <option value="PTE">PTE Academic</option>
                    <option value="TOEFL">TOEFL iBT</option>
                    <option value="Duolingo">Duolingo Test</option>
                    <option value="None">Not Taken Yet</option>
                  </select>
                </div>

                {formData.testType !== "None" && (
                  <div className="space-y-2 animate-fade-in">
                    <label htmlFor="score-input" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      {formData.testType} Overall Score
                    </label>
                    <input
                      type="number"
                      id="score-input"
                      name="testScore"
                      step="0.1"
                      value={formData.testScore}
                      onChange={handleChange}
                      placeholder={formData.testType === "IELTS" ? "e.g. 6.5" : formData.testType === "PTE" ? "e.g. 62" : "e.g. 95"}
                      className="w-full px-4 py-3 rounded-xl border border-hairline focus:border-gold focus:outline-none bg-subtle-gray text-slate-800 font-medium transition-colors"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-3 border border-hairline text-slate-500 hover:text-slate-800 font-semibold rounded-xl flex items-center gap-2 transition-colors"
              >
                <ArrowLeft size={18} />
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl flex items-center gap-2 shadow-md transition-all hover:translate-x-0.5"
              >
                Budget Settings
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-6 md:p-10 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                  <Coins size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary font-display">Budget & Financials</h2>
                  <p className="text-xs text-slate-400">Input your target budget parameters</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label htmlFor="currency-select" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Currency</label>
                  <select
                    id="currency-select"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-hairline focus:border-gold focus:outline-none bg-subtle-gray text-slate-800 font-medium transition-colors"
                  >
                    <option value="INR">INR (₹ Rupees)</option>
                    <option value="NPR">NPR (Rs. Rupees)</option>
                    <option value="USD">USD ($ Dollars)</option>
                    <option value="GBP">GBP (£ Pounds)</option>
                    <option value="AUD">AUD ($ Dollars)</option>
                    <option value="EUR">EUR (€ Euros)</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="budget-input" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Annual Tuition & Living Budget</label>
                  <input
                    type="number"
                    id="budget-input"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder={
                      formData.currency === "INR" 
                        ? "e.g. 1500000 (15 Lakhs)" 
                        : formData.currency === "NPR" 
                        ? "e.g. 2000000 (20 Lakhs)" 
                        : "e.g. 18000"
                    }
                    className="w-full px-4 py-3 rounded-xl border border-hairline focus:border-gold focus:outline-none bg-subtle-gray text-slate-800 font-medium transition-colors"
                  />
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                    <Info size={12} />
                    For premium visa chances, a budget exceeding ₹15 Lakhs (or $15k equivalent) is recommended.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-3 border border-hairline text-slate-500 hover:text-slate-800 font-semibold rounded-xl flex items-center gap-2 transition-colors"
              >
                <ArrowLeft size={18} />
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl flex items-center gap-2 shadow-md transition-all hover:translate-x-0.5"
              >
                View Matches
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <form onSubmit={handleSubmit} className="p-6 md:p-10 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                  <Sparkle size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary font-display">Calculate & Secure Results</h2>
                  <p className="text-xs text-slate-400">Unlock your university matches and chances</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600 leading-relaxed">
                  <span className="font-bold text-primary block mb-0.5">Profile Evaluation Computed!</span>
                  We have mapped your inputs. Submit your contact details below to log your lead record and instantly reveal your customized university matching results dashboard.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name-input" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      id="name-input"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-hairline focus:border-gold focus:outline-none bg-subtle-gray text-slate-800 font-medium transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email-input" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Envelope size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      id="email-input"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="johndoe@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-hairline focus:border-gold focus:outline-none bg-subtle-gray text-slate-800 font-medium transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone-input" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Phone Number</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      id="phone-input"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+977-9800000000"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-hairline focus:border-gold focus:outline-none bg-subtle-gray text-slate-800 font-medium transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="ref-input" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Referral Code (Optional)</label>
                  <div className="relative">
                    <ClipboardText size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      id="ref-input"
                      name="referralCode"
                      value={formData.referralCode}
                      onChange={handleChange}
                      placeholder="ANNEX-XXXX"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-hairline focus:border-gold focus:outline-none bg-subtle-gray text-slate-800 font-medium transition-colors font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center gap-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="px-5 py-3 border border-hairline text-slate-500 hover:text-slate-800 font-semibold rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <ArrowLeft size={18} />
                Back
              </button>
              <button
                type="submit"
                id="capture-form-submit"
                disabled={loading}
                className="px-6 py-3 bg-gold hover:bg-gold/95 text-primary font-bold rounded-xl flex items-center gap-2 shadow-md transition-all hover:translate-x-0.5 disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    Submit & View Results
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: Results Display */}
        {step === 5 && results && (
          <div className="p-6 md:p-10 flex-1 flex flex-col justify-between animate-fade-in">
            <div>
              {/* Score summary panel */}
              <div className="bg-primary text-white rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute right-0 top-0 w-32 h-32 bg-gold/10 rounded-full translate-x-12 -translate-y-12 blur-2xl" />
                <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-white/5 rounded-full translate-y-12 blur-3xl" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center relative">
                  <div className="md:col-span-2 space-y-2 text-center md:text-left">
                    <span className="text-[10px] font-bold text-gold uppercase tracking-widest font-mono-data">MATCH EVALUATION READY</span>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">
                      Congratulations, {formData.name}!
                    </h2>
                    <p className="text-xs text-slate-300 max-w-md">
                      Based on your {formData.qualification} profile ({formData.percentage}%) and {formData.preferredCourse} preference, we found compatible matching institutions in the {formData.preferredCountry}.
                    </p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
                    <span className="text-slate-300 text-[10px] font-semibold block uppercase tracking-wider">Top Match Score</span>
                    <div className="text-4xl font-extrabold text-gold font-mono-data my-1">
                      {results.matchScore}%
                    </div>
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium font-mono-data">
                      {results.leadScore} Lead Profile
                    </span>
                  </div>
                </div>
              </div>

              {/* Matching Universities list */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-primary font-display">Your Matching Universities</h3>
                    <p className="text-xs text-slate-400">Pre-filtered by course level and country matches</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 font-mono-data bg-slate-100 px-2.5 py-1 rounded-lg">
                    {results.matches.length} INSTITUTIONS
                  </span>
                </div>

                {results.matches.length === 0 ? (
                  <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-sm">
                    No exact university matches found for your budget and cutoffs. Contact our counselors to explore alternative pathways.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.matches.map((uni, idx) => (
                      <div 
                        key={uni.university_id || idx}
                        className="p-4 rounded-2xl border border-hairline bg-subtle-gray hover:border-gold transition-all duration-300 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-bold text-sm text-primary line-clamp-1">{uni.university_name_snapshot}</h4>
                            <span className="text-xs font-mono font-bold text-gold shrink-0">{uni.match_score}% Match</span>
                          </div>

                          <div className="flex items-center gap-1.5 mb-3">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono-data ${
                              uni.admission_chance === "Safe" 
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                                : uni.admission_chance === "Target"
                                ? "bg-amber-50 text-amber-600 border border-amber-100"
                                : "bg-orange-50 text-orange-600 border border-orange-100"
                            }`}>
                              {uni.admission_chance} Chance
                            </span>
                            <span className="text-[10px] text-slate-400">• {formData.preferredCountry}</span>
                          </div>
                        </div>

                        {uni.scholarship_estimate && (
                          <div className="text-[10px] bg-white border border-slate-100 text-slate-500 py-1.5 px-2.5 rounded-lg flex items-center gap-1 mt-1 font-medium">
                            <Sparkle size={12} className="text-gold" />
                            {uni.scholarship_estimate}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Chance Categories Legend Box */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-8 flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-2">
                  <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-600">Admission Chance Legend</h5>
                    <p className="text-[10px] text-slate-400 max-w-sm mt-0.5 leading-relaxed">
                      Chances are calculated against qualification cutoffs, budget requirements, and program availability.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    Safe (80%+)
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    Target (60–79%)
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                    Ambitious (&lt;60%)
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs Footer */}
            <div className="border-t border-hairline pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h4 className="text-sm font-bold text-primary text-center sm:text-left">Need assistance matching your profile?</h4>
                <p className="text-xs text-slate-400 text-center sm:text-left">Your assigned study counselor is ready to review your files.</p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
                <a
                  href={`/contact?email=${encodeURIComponent(formData.email)}&name=${encodeURIComponent(formData.name)}&phone=${encodeURIComponent(formData.phone)}&country=${encodeURIComponent(formData.preferredCountry)}`}
                  className="px-5 py-3 border border-hairline hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-semibold rounded-xl text-xs text-center transition-colors w-full sm:w-auto"
                >
                  Book 1-on-1 Consultation
                </a>
                
                {results.whatsappRedirectUrl && (
                  <a
                    href={results.whatsappRedirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs text-center flex items-center justify-center gap-2 shadow-sm transition-all hover:translate-y-[-1px] w-full sm:w-auto"
                  >
                    <WhatsappLogo size={18} weight="fill" />
                    Message Counselor
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EligibilityCalculator() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto text-center py-20">
        <span className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-gold animate-spin inline-block mb-3" />
        <p className="text-slate-400 text-sm">Initializing eligibility workspace...</p>
      </div>
    }>
      <CalculatorContent />
    </Suspense>
  );
}
