"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkle,
  ArrowRight,
  Checks,
  Briefcase,
  Users,
  Target,
  ChartLineUp,
  X,
  ShieldCheck,
  Envelope,
  User,
  Phone,
  ChatCenteredText,
  BookmarkSimple,
  LinkedinLogo
} from "@phosphor-icons/react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionReveal } from "@/components/section-reveal";
import { AnimatedCounter } from "@/components/animated-counter";
import { supabase } from "@/lib/supabase";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  status: string;
}

interface CareerExpert {
  id: string;
  name: string;
  designation: string;
  expertise: string;
  photo_url?: string;
  linkedin_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

const DEFAULT_SERVICES: Omit<Service, "id">[] = [
  {
    title: "ATS Resume Building",
    description: "Professional ATS-friendly resume creation and optimization to pass recruiter screening filters.",
    price: 599,
    features: [
      "ATS-compliant layout and formatting",
      "Keyword optimization for your target role",
      "Delivered in PDF and editable Word format",
      "Includes 1 round of revision review",
      "Modern layout options designed for readability"
    ],
    status: "Active"
  },
  {
    title: "LinkedIn Profile Optimization",
    description: "Upgrade your professional profile to attract recruiters and rank higher in search results.",
    price: 399,
    features: [
      "Headline & summary rewriting",
      "Skill alignment & profile SEO audit",
      "Custom cover banner asset suggestions",
      "Content & post networking guide",
      "Tips to increase profile impressions by 3x"
    ],
    status: "Active"
  },
  {
    title: "Mock Interview Session",
    description: "Practice with a career advisor in a live, realistic interview simulation with detailed review feedback.",
    price: 999,
    features: [
      "45-minute 1-on-1 virtual interview",
      "Tailored questions based on your field",
      "In-depth analysis of body language & answers",
      "Post-interview detailed performance scorecard",
      "Recording access for self-evaluation"
    ],
    status: "Active"
  },
  {
    title: "Job Placement Assistance",
    description: "End-to-end guidance including direct referrals, interview scheduling, and premium mentoring.",
    price: 1499,
    features: [
      "Direct referrals to partner HR networks",
      "Dedicated career advisor & weekly alerts",
      "Unlimited mock interviews & salary support",
      "Priority dashboard features inside student portal",
      "Continuous feedback loops until placement"
    ],
    status: "Active"
  },
  {
    title: "Career Guidance Session",
    description: "Unravel your ideal career path and resolve dilemmas with industry roadmap experts.",
    price: 499,
    features: [
      "30-minute 1-on-1 counselor session",
      "Skill gap analysis & industry matching",
      "Personalized 12-month action plan roadmap",
      "Q&A session covering major sectors",
      "Advice on further degrees & certifications"
    ],
    status: "Active"
  },
  {
    title: "Interview Prep Masterclass",
    description: "A comprehensive video masterclass covering HR strategies, templates, and salary negotiation.",
    price: 799,
    features: [
      "2-hour masterclass recording access",
      "HR answer templates for common questions",
      "Salary negotiation frameworks & tips",
      "Self-introduction script template builders",
      "PDF prep cheat sheets & checklist guides"
    ],
    status: "Active"
  }
];

const testimonials = [
  {
    quote: "The ATS Resume Building service transformed my applications. Within two weeks of updating my CV, I received callbacks from three MNCs.",
    name: "Sumit Thapa",
    role: "Frontend Engineer at Cloud Tech",
    service: "ATS Resume Building"
  },
  {
    quote: "The mock interview session was exactly what I needed. The realistic simulations helped me overcome my anxiety, and the detailed review pinpointed errors in my pitch.",
    name: "Nisha Gurung",
    role: "Marketing Specialist",
    service: "Mock Interview Session"
  },
  {
    quote: "Thanks to the Placement Assistance team at Annex, I secured an analyst role at a leading consulting firm right after completing my graduation.",
    name: "Rajesh Shrestha",
    role: "Business Analyst",
    service: "Job Placement Assistance"
  }
];

const faqs = [
  {
    question: "How do I access the Career Portal?",
    answer: "Once you enroll in any of our services and your payment or enrollment is approved by our administration, we will set up your temporary credentials and email them to you. You can then log in via our /career-portal."
  },
  {
    question: "What makes a resume ATS-friendly?",
    answer: "An ATS (Applicant Tracking System) scans resumes for specific keywords, formatting styles, and headings. We design your resume using parsing-optimized layouts and insert keywords relevant to your industry to ensure you bypass these automatic filters."
  },
  {
    question: "How are the mock interviews conducted?",
    answer: "Mock interviews are conducted online via video conferencing (Google Meet or Zoom). Your assigned consultant will structure the session to mirror a real job interview, ask industry-specific questions, and give you immediate constructive feedback."
  },
  {
    question: "Can I request changes to my resume after delivery?",
    answer: "Yes, our ATS Resume Building service includes a round of revision within 7 days of receiving the draft. We work with you to fine-tune the content so you are 100% satisfied."
  }
];

export default function TrainingPlacementPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  // Experts State
  const [experts, setExperts] = useState<CareerExpert[]>([]);
  const [loadingExperts, setLoadingExperts] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        // Fetch from Supabase
        const { data, error } = await supabase
          .from("training_services")
          .select("*")
          .eq("status", "Active")
          .order("price", { ascending: true });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setServices(data);
        } else {
          // If empty, let's seed the database so it works out-of-the-box
          console.log("Seeding default services...");
          const { data: insertedData, error: insertError } = await supabase
            .from("training_services")
            .insert(DEFAULT_SERVICES)
            .select();

          if (insertError) {
            console.error("Seeding failed:", insertError.message);
            // Fallback to static defaults
            setServices(DEFAULT_SERVICES.map((s, idx) => ({ ...s, id: `mock-${idx}` })) as Service[]);
          } else if (insertedData) {
            setServices(insertedData);
          }
        }
      } catch (err) {
        console.error("Failed to load services:", err);
        // Fallback to static defaults
        setServices(DEFAULT_SERVICES.map((s, idx) => ({ ...s, id: `mock-${idx}` })) as Service[]);
      } finally {
        setLoading(false);
      }
    }

    async function loadExperts() {
      try {
        setLoadingExperts(true);
        const { data, error } = await supabase
          .from("career_experts")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (error) {
          throw error;
        }

        if (data) {
          setExperts(data);
        }
      } catch (err) {
        console.error("Failed to load career experts:", err);
      } finally {
        setLoadingExperts(false);
      }
    }

    loadServices();
    loadExperts();
  }, []);

  const openEnrollmentModal = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
    setShowSuccessScreen(false);
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !selectedService) return;

    try {
      setIsSubmittingLead(true);

      // 1. Insert lead into training_students table
      const { data: studentData, error: studentError } = await supabase
        .from("training_students")
        .insert([
          {
            service_id: selectedService.id,
            student_name: name,
            student_email: email,
            student_phone: phone,
            status: "Pending",
            notes: notes || `Interested in: ${selectedService.title}`,
          }
        ])
        .select()
        .single();

      if (studentError) {
        throw studentError;
      }

      // 2. Trigger Brevo Email Notification via the API route
      try {
        await fetch("/api/send-career-notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "lead",
            studentId: studentData.id,
            details: {
              leadName: name,
              leadEmail: email,
              leadPhone: phone,
              serviceTitle: selectedService.title,
            }
          }),
        });
      } catch (emailErr) {
        console.error("Failed to dispatch email lead notification:", emailErr);
      }

      setShowSuccessScreen(true);
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setNotes("");
    } catch (err: any) {
      alert(`Error submitting application: ${err.message}`);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <>
      <Navigation />

      <main className="flex-grow">
        {/* Dynamic Premium Hero Section */}
        <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(11,31,58,0.02),transparent)] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left text block */}
              <div className="lg:col-span-7 text-left flex flex-col items-start">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline/80 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-6"
                >
                  <Sparkle size={12} className="text-gold" weight="fill" />
                  Career Accelerator Services
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display font-bold text-4xl md:text-6xl text-primary tracking-tighter leading-[1.05] max-w-2xl mb-6"
                >
                  Elevate your profile.<br />Unlock global careers.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-base md:text-lg text-slate-500 leading-relaxed max-w-[48ch] mb-8"
                >
                  Supercharge your resume, optimize your professional presence, and secure direct placement opportunities with elite consulting programs.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                  <a href="#services" className="w-full sm:w-auto">
                    <Button variant="primary" size="lg" className="w-full sm:w-auto">
                      Explore Services
                    </Button>
                  </a>
                  <a href="/career-portal" className="w-full sm:w-auto">
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                      Access Portal
                    </Button>
                  </a>
                </motion.div>
              </div>

              {/* Right Hero Visual Card */}
              <div className="lg:col-span-5 relative w-full flex justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full aspect-[4/3] bg-subtle-gray border border-hairline/80 p-2 rounded-[2rem]"
                >
                  <div className="relative w-full h-full overflow-hidden rounded-[calc(2rem-0.5rem)] border border-hairline/40 bg-gradient-to-br from-[#0B1F3A] to-[#1e3a5f] flex flex-col justify-between p-8 text-white">
                    <div className="flex justify-between items-start">
                      <Briefcase size={40} className="text-gold" weight="light" />
                      <div className="text-right">
                        <span className="text-[10px] tracking-widest font-semibold uppercase text-slate-400">Services Active</span>
                        <h4 className="font-mono-data text-2xl font-bold text-white mt-1">06</h4>
                      </div>
                    </div>

                    <div className="text-left">
                      <span className="text-[10px] tracking-widest font-semibold uppercase text-gold">Placement Dashboard</span>
                      <h3 className="font-display font-bold text-2xl md:text-3xl text-white mt-1 leading-snug">
                        Ready to apply?
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 max-w-[280px]">
                        Get 1-on-1 mentorship, automated tracking progress, and credentials activation.
                      </p>
                    </div>

                    <div className="border-t border-slate-700/50 pt-4 flex justify-between items-center text-xs font-mono-data text-slate-400">
                      <span>PLACEMENT SUCCESS RATE: 92%</span>
                      <span>ACTIVE BUCKET</span>
                    </div>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* Real-time stats section */}
        <SectionReveal>
          <section className="py-12 border-t border-b border-hairline bg-subtle-gray/30">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
                <div>
                  <p className="font-mono-data text-3xl font-bold text-primary">
                    <AnimatedCounter value={92} suffix="%" />
                  </p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Placement Success</p>
                </div>
                <div>
                  <p className="font-mono-data text-3xl font-bold text-primary">
                    <AnimatedCounter value={1200} suffix="+" />
                  </p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Careers Upgraded</p>
                </div>
                <div>
                  <p className="font-mono-data text-3xl font-bold text-primary">
                    <AnimatedCounter value={15} suffix="+" />
                  </p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Industry Advisors</p>
                </div>
                <div>
                  <p className="font-mono-data text-3xl font-bold text-primary">₹2.4M</p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Avg. Salary Bump</p>
                </div>
              </div>
            </div>
          </section>
        </SectionReveal>

        {/* Dynamic Services Cards */}
        <SectionReveal>
          <section id="services" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="font-display font-bold text-3xl md:text-4xl text-primary tracking-tight mb-4">
                  Tailored micro career services.
                </h2>
                <p className="text-sm text-slate-500">
                  Choose the exact services you need. Select an option to enroll and activate your dashboard.
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex flex-col h-full bg-white border border-hairline/80 p-8 rounded-2xl min-h-[350px]">
                      <div className="mb-6 flex-grow">
                        <div className="flex justify-between items-start mb-4">
                          <Skeleton className="w-40 h-6 bg-slate-100" />
                          <Skeleton className="w-16 h-8 bg-slate-100 rounded-lg" />
                        </div>
                        <Skeleton className="w-full h-4 mb-2 bg-slate-100" />
                        <Skeleton className="w-3/4 h-4 mb-6 bg-slate-100" />
                        <div className="border-t border-hairline pt-6">
                          <Skeleton className="w-28 h-3.5 mb-3 bg-slate-100" />
                          <div className="space-y-2.5">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="flex items-center gap-2">
                                <Skeleton className="w-3.5 h-3.5 rounded-full bg-slate-100 shrink-0" />
                                <Skeleton className="w-4/5 h-3.5 bg-slate-100" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Skeleton className="w-full h-11 bg-slate-100 rounded-full mt-6" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services.map((service, idx) => (
                    <motion.div
                      key={service.id || idx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      className="flex flex-col h-full bg-white border border-hairline/80 hover:border-primary/20 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group text-left"
                    >
                      <div className="mb-6 flex-grow">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-display font-bold text-xl text-primary leading-tight group-hover:text-gold transition-colors">
                            {service.title}
                          </h3>
                          <span className="font-mono-data text-lg font-bold text-primary bg-subtle-gray px-3 py-1 rounded-lg">
                            ₹{service.price}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                          {service.description}
                        </p>
                        
                        <div className="border-t border-hairline pt-6">
                          <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3">What is included:</p>
                          <ul className="space-y-2.5">
                            {service.features.map((feature, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-600">
                                <Checks size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        className="w-full mt-6"
                        onClick={() => openEnrollmentModal(service)}
                      >
                        Enroll Now
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </SectionReveal>

        {/* Meet Our Career Experts Section */}
        <SectionReveal>
          <section className="py-24 bg-white border-t border-hairline">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="font-display font-bold text-3xl md:text-4xl text-primary tracking-tight mb-4 animate-fade-in">
                  Meet Our Career Experts
                </h2>
                <p className="text-sm text-slate-500 max-w-[60ch] mx-auto leading-relaxed">
                  Learn from industry veterans dedicated to optimizing your professional roadmap, resume, and placement success.
                </p>
              </div>

              {loadingExperts ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="bg-subtle-gray border border-hairline/80 p-1.5 rounded-[1.5rem] h-[340px]">
                      <div className="bg-white border border-hairline/40 p-8 rounded-[calc(1.5rem-0.375rem)] h-full flex flex-col items-center justify-between">
                        <Skeleton className="w-24 h-24 rounded-full bg-slate-100 mb-6 shrink-0" />
                        <Skeleton className="h-6 w-32 bg-slate-100 mb-3 shrink-0" />
                        <Skeleton className="h-4 w-24 bg-slate-100 mb-4 shrink-0" />
                        <Skeleton className="h-3.5 w-40 bg-slate-100 mb-2 shrink-0" />
                        <Skeleton className="h-3.5 w-36 bg-slate-100 mb-auto shrink-0" />
                        <Skeleton className="h-8 w-8 rounded-full bg-slate-100 mt-4 shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : experts.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-subtle-gray/30 rounded-2xl border border-hairline/60 max-w-md mx-auto">
                  <Users size={48} className="mx-auto mb-3 opacity-40 text-primary" />
                  <p className="text-sm font-semibold text-slate-500">No career experts listed at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
                  {experts.map((expert, idx) => (
                    <motion.a
                      key={expert.id}
                      href={expert.linkedin_url || undefined}
                      target={expert.linkedin_url ? "_blank" : undefined}
                      rel={expert.linkedin_url ? "noopener noreferrer" : undefined}
                      onClick={(e) => {
                        if (!expert.linkedin_url) {
                          e.preventDefault();
                        }
                      }}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      className={`group flex ${expert.linkedin_url ? "cursor-pointer" : "cursor-default"}`}
                    >
                      <div className="bg-subtle-gray border border-hairline/80 p-1.5 rounded-[1.5rem] w-full transition-all duration-300 group-hover:border-primary/20 group-hover:shadow-lg">
                        <div className="bg-white border border-hairline/40 p-6 md:p-8 rounded-[calc(1.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_8px_rgba(15,23,42,0.01)] h-full flex flex-col items-center text-center relative overflow-hidden">
                          <div className="absolute inset-0 rounded-[calc(1.5rem-0.375rem)] bg-gradient-to-b from-primary/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                          {/* Circular profile image with fallback */}
                          <div className="relative w-24 h-24 rounded-full overflow-hidden mb-6 border-2 border-hairline group-hover:border-gold transition-colors duration-300 shrink-0">
                            {expert.photo_url ? (
                              <img
                                src={expert.photo_url}
                                alt={expert.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const fallback = e.currentTarget.parentElement?.querySelector('.avatar-fallback') as HTMLElement;
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div
                              className="avatar-fallback w-full h-full bg-slate-100 flex items-center justify-center text-primary font-bold text-2xl"
                              style={{ display: expert.photo_url ? 'none' : 'flex' }}
                            >
                              {expert.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </div>
                          </div>

                          <h3 className="font-display font-bold text-lg text-primary mb-1 group-hover:text-gold transition-colors duration-300">
                            {expert.name}
                          </h3>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                            {expert.designation}
                          </p>
                          <p className="text-sm text-slate-500 leading-relaxed max-w-[24ch]">
                            {expert.expertise}
                          </p>

                          {expert.linkedin_url && (
                            <div className="mt-auto pt-6 text-slate-400 group-hover:text-primary transition-colors duration-300">
                              <div className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center group-hover:border-primary transition-all duration-300 bg-subtle-gray/30 group-hover:bg-primary/5">
                                <LinkedinLogo size={16} weight="fill" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              )}
            </div>
          </section>
        </SectionReveal>

        {/* Advantage / Benefits Section */}
        <SectionReveal>
          <section className="py-24 border-t border-hairline bg-subtle-gray/20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="font-display font-bold text-3xl md:text-4xl text-primary tracking-tight mb-4">
                  Structured placement methodology.
                </h2>
                <p className="text-sm text-slate-500">
                  How we guide you from enrollment to career success.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <Card hoverable className="p-8">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-6">
                    <Target size={20} weight="bold" />
                  </div>
                  <CardTitle className="text-lg mb-2">1. Registration & Assessment</CardTitle>
                  <CardDescription>
                    Apply online and complete your onboarding profile. Your consultant reviews your current credentials and assigns personalized goals.
                  </CardDescription>
                </Card>

                <Card hoverable className="p-8">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-6">
                    <Users size={20} weight="bold" />
                  </div>
                  <CardTitle className="text-lg mb-2">2. Mentorship & Prep Checklists</CardTitle>
                  <CardDescription>
                    Log in to your portal to access specialized assignments, complete resume updates, schedule mock interviews, and message your advisor in real-time.
                  </CardDescription>
                </Card>

                <Card hoverable className="p-8">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-6">
                    <ChartLineUp size={20} weight="bold" />
                  </div>
                  <CardTitle className="text-lg mb-2">3. Referral & Placements</CardTitle>
                  <CardDescription>
                    Leverage Annex partners and corporate networks. We push optimized resumes directly to top hiring managers to guarantee interviews.
                  </CardDescription>
                </Card>
              </div>
            </div>
          </section>
        </SectionReveal>

        {/* Testimonials */}
        <SectionReveal>
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <h2 className="font-display font-bold text-3xl md:text-4xl text-primary tracking-tight mb-16 text-center">
                Student success stories.
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {testimonials.map((test, i) => (
                  <div key={i} className="border-l-2 border-gold/40 pl-6 py-2">
                    <p className="text-base text-slate-700 italic leading-relaxed mb-4">
                      &ldquo;{test.quote}&rdquo;
                    </p>
                    <div>
                      <h5 className="font-display font-bold text-sm text-primary">{test.name}</h5>
                      <p className="text-xs text-slate-400 font-semibold">{test.role}</p>
                      <span className="inline-block bg-subtle-gray text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded mt-2 border border-hairline">
                        {test.service}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </SectionReveal>

        {/* FAQs */}
        <SectionReveal>
          <section className="py-24 border-t border-hairline bg-subtle-gray/10">
            <div className="max-w-4xl mx-auto px-6 text-left">
              <h2 className="font-display font-bold text-3xl text-primary tracking-tight mb-12 text-center">
                Frequently asked questions.
              </h2>
              <div className="space-y-6">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-white border border-hairline/80 p-6 rounded-2xl">
                    <h4 className="font-display font-bold text-base text-primary mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </SectionReveal>
      </main>

      {/* Modal for Enrollment */}
      <AnimatePresence>
        {isModalOpen && selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-white border border-hairline shadow-2xl rounded-3xl p-8 z-10 overflow-hidden text-left"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>

              {!showSuccessScreen ? (
                <>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-hairline/80 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-4">
                    <BookmarkSimple size={12} className="text-gold" />
                    Enrollment Registration
                  </div>

                  <h3 className="font-display font-bold text-2xl text-primary mb-1">
                    Enroll in {selectedService.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-6">
                    Fill out the form below to register as a career candidate.
                  </p>

                  <form onSubmit={handleEnrollSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500 tracking-wider mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Roshan Shrestha"
                          className="w-full pl-10 pr-4 py-2.5 bg-subtle-gray border border-hairline/80 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500 tracking-wider mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Envelope size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="roshan@gmail.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-subtle-gray border border-hairline/80 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500 tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+977 9801234567"
                          className="w-full pl-10 pr-4 py-2.5 bg-subtle-gray border border-hairline/80 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500 tracking-wider mb-1.5">
                        Notes / Additional Info
                      </label>
                      <div className="relative">
                        <ChatCenteredText size={16} className="absolute left-4 top-3 text-slate-400" />
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Let us know your target role, years of experience, or expectations..."
                          rows={3}
                          className="w-full pl-10 pr-4 py-2.5 bg-subtle-gray border border-hairline/80 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmittingLead}
                      className="w-full py-3 mt-4"
                    >
                      {isSubmittingLead ? "Submitting Application..." : "Submit Enrollment Application"}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                    <ShieldCheck size={36} />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-primary mb-2">
                    Application Received!
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 leading-relaxed max-w-sm mx-auto">
                    Your details for <strong>{selectedService.title}</strong> have been registered. A career advisor will review your application and send your portal login credentials via email within 24 hours.
                  </p>
                  <Button
                    variant="primary"
                    className="w-full max-w-xs"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}