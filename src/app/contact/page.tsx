"use client";

import * as React from "react";
import { Sparkle, Checks, Phone, Envelope, MapPin, SpinnerGap } from "@phosphor-icons/react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

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

    // Simple validation
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
        // LocalStorage Fallback for local dev testing
        const existing = JSON.parse(localStorage.getItem("annex_bookings") || "[]");
        existing.push({
          id: crypto.randomUUID(),
          ...formData,
          status: "Pending",
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
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />

      <main className="flex-grow pt-32 pb-24 bg-white text-left">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline/80 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-6">
              <Sparkle size={12} className="text-gold" weight="fill" />
              Get In Touch
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tighter leading-none mb-6">
              Book a consultation.
            </h1>
            <p className="text-base md:text-lg text-slate-500 leading-relaxed">
              Schedule a focused study abroad or test prep consultation. Speak with our certified global academic advisors.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-8">
              <Card className="p-6 md:p-8">
                {success ? (
                  <div className="text-center py-12 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 border border-green-100 flex items-center justify-center mb-4">
                      <Checks size={24} weight="bold" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-primary mb-2">Booking Submitted Successfully</h3>
                    <p className="text-sm text-slate-500 max-w-[40ch] mb-6">
                      Thank you. Our counseling coordinators will review your preferences and contact you via email or phone to confirm the schedule.
                    </p>
                    <Button variant="secondary" onClick={() => setSuccess(false)}>
                      Book Another Consultation
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {error && (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-xs font-bold text-primary uppercase tracking-wider">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="px-4 py-3 border border-hairline rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800"
                          placeholder="Your full name"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-xs font-bold text-primary uppercase tracking-wider">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="px-4 py-3 border border-hairline rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800"
                          placeholder="name@email.com"
                          required
                        />
                      </div>

                      {/* Phone */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor="phone" className="text-xs font-bold text-primary uppercase tracking-wider">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="px-4 py-3 border border-hairline rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800"
                          placeholder="+977-9800000000"
                          required
                        />
                      </div>

                      {/* Study Level */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor="study_level" className="text-xs font-bold text-primary uppercase tracking-wider">
                          Current Education Level
                        </label>
                        <select
                          id="study_level"
                          value={formData.study_level}
                          onChange={(e) => setFormData({ ...formData, study_level: e.target.value })}
                          className="px-4 py-3 border border-hairline rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 cursor-pointer"
                        >
                          <option>High School</option>
                          <option>Undergraduate</option>
                          <option>Postgraduate</option>
                          <option>Test Prep Only</option>
                        </select>
                      </div>

                      {/* Study Destination */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor="destination" className="text-xs font-bold text-primary uppercase tracking-wider">
                          Target Destination
                        </label>
                        <select
                          id="destination"
                          value={formData.destination}
                          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                          className="px-4 py-3 border border-hairline rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 cursor-pointer"
                        >
                          <option>UK</option>
                          <option>Australia</option>
                          <option>Europe</option>
                          <option>Dubai</option>
                          <option>Italy</option>
                          <option>India</option>
                        </select>
                      </div>

                      {/* Booking Date */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor="preferred_date" className="text-xs font-bold text-primary uppercase tracking-wider">
                          Preferred Date *
                        </label>
                        <input
                          type="date"
                          id="preferred_date"
                          value={formData.preferred_date}
                          onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                          className="px-4 py-3 border border-hairline rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800"
                          required
                        />
                      </div>

                      {/* Booking Time */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor="preferred_time" className="text-xs font-bold text-primary uppercase tracking-wider">
                          Preferred Time *
                        </label>
                        <input
                          type="time"
                          id="preferred_time"
                          value={formData.preferred_time}
                          onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                          className="px-4 py-3 border border-hairline rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800"
                          required
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="notes" className="text-xs font-bold text-primary uppercase tracking-wider">
                        Additional Information
                      </label>
                      <textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="px-4 py-3 border border-hairline rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 min-h-[120px] resize-none"
                        placeholder="Detail your academic scores, target intakes, or IELTS / PTE levels..."
                      />
                    </div>

                    <Button type="submit" variant="primary" disabled={loading} className="w-full md:w-max mt-4">
                      {loading ? (
                        <>
                          <SpinnerGap className="animate-spin" size={16} /> Submitting...
                        </>
                      ) : (
                        "Submit Booking Request"
                      )}
                    </Button>
                  </form>
                )}
              </Card>
            </div>

            {/* Sidebar Column: Contact Info */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <Card className="h-auto">
                <CardTitle className="text-sm uppercase tracking-wider text-slate-400 mb-6">Office Locations</CardTitle>
                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-primary">Kathmandu Office</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        New Baneshwor, Kathmandu, Nepal<br />
                        Near Baneshwor Plaza
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 border-t border-hairline pt-4">
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-primary">India Office</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        99/1/2, Girish Ghosh Rd<br />
                        Belur Math, Ghusuri<br />
                        Howrah, West Bengal 711202<br />
                        India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 border-t border-hairline pt-4">
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <Phone size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-primary">Phone Inquiries</h4>
                      <p className="text-xs font-mono-data text-slate-500 mt-1">+977-1-4780516</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <Envelope size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-primary">Email Support</h4>
                      <p className="text-xs font-mono-data text-slate-500 mt-1">info@annexconsultant.com</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="h-auto">
                <CardTitle className="text-sm uppercase tracking-wider text-slate-400 mb-4">Admissions Timeline</CardTitle>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We schedule consultations Monday through Friday from 9:00 AM to 5:00 PM. Weekend session requests can be coordinated dynamically for remote students.
                </p>
              </Card>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
