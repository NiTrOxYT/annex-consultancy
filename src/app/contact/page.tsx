"use client";

import * as React from "react";
import { Sparkle, Checks, Phone, Envelope, MapPin, SpinnerGap } from "@phosphor-icons/react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { LocalBusinessSchema } from "@/components/seo/structured-data";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export default function Contact() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    preferred_date: "",
    preferred_time: "",
    study_level: "Undergraduate",
    destination: "UK",
    notes: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name || !formData.email || !formData.phone || !formData.preferred_date || !formData.preferred_time) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      if (isSupabaseConfigured()) {
        const { error: dbError } = await supabase
          .from("bookings")
          .insert([
            {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              preferred_date: formData.preferred_date,
              preferred_time: formData.preferred_time,
              study_level: formData.study_level,
              destination: formData.destination,
              notes: formData.notes,
            },
          ]);

        if (dbError) throw dbError;
      } else {
        const existing = JSON.parse(localStorage.getItem("annex_bookings") || "[]");
        existing.push({
          id: Date.now().toString(),
          ...formData,
          created_at: new Date().toISOString(),
        });
        localStorage.setItem("annex_bookings", JSON.stringify(existing));
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        preferred_date: "",
        preferred_time: "",
        study_level: "Undergraduate",
        destination: "UK",
        notes: "",
      });
    } catch (err: any) {
      console.error("Booking error:", err);
      setError(err.message || "Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LocalBusinessSchema />
      <Navigation />

      <main className="flex-grow pt-24 md:pt-28 pb-24 bg-white text-left">
        <Breadcrumbs items={[{ name: "Contact Us", url: "https://annex-consultancy.com/contact" }]} />

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline/80 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-6">
              <Sparkle size={12} className="text-gold" weight="fill" />
              Local & Global Consultations
            </div>
            <h1 className="font-display font-bold text-4xl md:text-6xl text-primary tracking-tight leading-[1.08] mb-6">
              Book Your Free Overseas Counseling Session.
            </h1>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              Connect with our certified study abroad advisors. Whether in person at our office or via online video consultation, we evaluate your profile in 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-7">
              <Card className="p-8 md:p-10 border-hairline/80 shadow-md">
                <CardTitle className="text-2xl font-bold text-primary mb-2">Schedule Free Appointment</CardTitle>
                <CardDescription className="mb-8 text-xs text-slate-500">
                  Select your preferred date and time slot for a personalized session.
                </CardDescription>

                {success ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-lg">
                      <Checks size={24} className="text-emerald-600" />
                      Consultation Request Confirmed!
                    </div>
                    <p className="text-xs leading-relaxed">
                      Thank you for scheduling with Annex Consultancy. Our senior admissions advisor will call you to confirm your slot and review your academic documents.
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSuccess(false)}
                      className="mt-2 text-xs"
                    >
                      Book Another Session
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-4 py-3 rounded-xl border border-hairline bg-subtle-gray/30 text-xs outline-none focus:border-primary transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Phone / WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl border border-hairline bg-subtle-gray/30 text-xs outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="rahul@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-hairline bg-subtle-gray/30 text-xs outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Preferred Country *</label>
                        <select
                          value={formData.destination}
                          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-hairline bg-white text-xs outline-none focus:border-primary transition-colors font-medium"
                        >
                          <option value="UK">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="Canada">Canada</option>
                          <option value="USA">United States</option>
                          <option value="Germany">Germany</option>
                          <option value="Italy">Italy (DSU Scholarship)</option>
                          <option value="Dubai">Dubai (UAE)</option>
                          <option value="Europe">Other Europe</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Target Degree *</label>
                        <select
                          value={formData.study_level}
                          onChange={(e) => setFormData({ ...formData, study_level: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-hairline bg-white text-xs outline-none focus:border-primary transition-colors font-medium"
                        >
                          <option value="Undergraduate">Undergraduate (Bachelor's)</option>
                          <option value="Postgraduate">Postgraduate (Master's / MBA)</option>
                          <option value="Diploma">Diploma / Post-Grad Cert</option>
                          <option value="PhD">Doctorate / PhD</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Preferred Date *</label>
                        <input
                          type="date"
                          required
                          value={formData.preferred_date}
                          onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-hairline bg-subtle-gray/30 text-xs outline-none focus:border-primary transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Preferred Time Slot *</label>
                        <select
                          value={formData.preferred_time}
                          onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-hairline bg-white text-xs outline-none focus:border-primary transition-colors font-medium"
                        >
                          <option value="">Select Time Slot</option>
                          <option value="11:00 AM">11:00 AM - 12:00 PM</option>
                          <option value="02:00 PM">02:00 PM - 03:00 PM</option>
                          <option value="04:00 PM">04:00 PM - 05:00 PM</option>
                          <option value="06:00 PM">06:00 PM - 07:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Academic Background / Notes</label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Mention your percentage, GPA, IELTS score (if taken), or specific course preference..."
                        className="w-full px-4 py-3 rounded-xl border border-hairline bg-subtle-gray/30 text-xs outline-none focus:border-primary transition-colors resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={loading}
                      className="w-full font-bold"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <SpinnerGap size={18} className="animate-spin" /> Confirming Booking...
                        </span>
                      ) : (
                        "Confirm Free Counseling Slot"
                      )}
                    </Button>
                  </form>
                )}
              </Card>
            </div>

            {/* Right Column: NAP & Office Details */}
            <div className="lg:col-span-5 space-y-8">
              <Card className="p-8 border-hairline bg-subtle-gray/50 space-y-6">
                <CardTitle className="text-xl font-bold text-primary">Head Office Contact Details</CardTitle>
                
                <div className="space-y-4 text-xs text-slate-700">
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-slate-900">India Office Address</span>
                      99/1/2, Girish Ghosh Rd, Belur Math, Ghusuri, Howrah, West Bengal 711202, India
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-primary shrink-0" />
                    <div>
                      <span className="font-bold block text-slate-900">Direct Phone / WhatsApp</span>
                      <a href="tel:+918910882334" className="hover:text-primary transition-colors">+91 89108 82334</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Envelope size={20} className="text-primary shrink-0" />
                    <div>
                      <span className="font-bold block text-slate-900">Official Email</span>
                      <a href="mailto:business@annex-consultancy.com" className="hover:text-primary transition-colors">business@annex-consultancy.com</a>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8 border-hairline bg-white space-y-4">
                <CardTitle className="text-lg font-bold text-primary">Working Hours</CardTitle>
                <div className="space-y-2 text-xs text-slate-600 font-medium">
                  <div className="flex justify-between border-b border-hairline pb-2">
                    <span>Monday - Saturday</span>
                    <span className="font-bold text-primary">9:30 AM - 6:30 PM IST</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>Sunday</span>
                    <span className="text-slate-400">Closed (Online Assistance)</span>
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
