"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { List, X, CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnnexLogo } from "@/components/branding/annex-logo";

// Reorganized content data mapped by business value
const destinationItems = {
  international: [
    { label: "United Kingdom", href: "/study-abroad/uk", desc: "Top Russell Group admissions & CAS validation." },
    { label: "Australia", href: "/study-abroad/australia", desc: "Go8 university admissions & visa assistance." },
    { label: "Europe", href: "/study-abroad/europe", desc: "English-taught degrees & tuition waivers." },
    { label: "Dubai", href: "/study-abroad/dubai", desc: "Global branch campus study programs." },
    { label: "Italy", href: "/study-abroad/italy", desc: "State universities & regional study grants." },
  ],
  domestic: [
    { label: "Study in India", href: "/study-in-india", desc: "Admissions to premier medical & engineering institutes." }
  ]
};

const programItems = {
  prep: [
    { label: "IELTS Coaching", href: "/test-preparation/ielts", desc: "Strategic exam prep with certified trainers." },
    { label: "PTE Coaching", href: "/test-preparation/pte", desc: "Pearson Test of English score-maximizer modules." },
    { label: "CMAT Prep", href: "/test-preparation/cmat", desc: "Coaching for university entrance business math." },
    { label: "Computer Courses", href: "/test-preparation/computer-courses", desc: "Programming & office productivity training." }
  ],
  career: [
    { label: "Training & Placement", href: "/training-placement", desc: "Resume reviews, interview drills, & job placements." }
  ]
};

const resourceItems = [
  { label: "Success Stories", href: "/success-stories", desc: "Student placement records & visa success testimonials." },
  { label: "Expert Resource Blog", href: "/blog", desc: "Latest overseas intake updates & study guides." }
];

const portalItems = [
  { label: "🎓 Student Portal", href: "/student-login", desc: "Track admissions, check visa status, & chat with counselors." },
  { label: "💼 Career Portal", href: "/career-portal", desc: "Milestones, tasks, & corporate training dashboard." }
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const [openMobileSection, setOpenMobileSection] = React.useState<string | null>(null);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
    setOpenMobileSection(null);
  }, [pathname]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileSection = (section: string) => {
    setOpenMobileSection(openMobileSection === section ? null : section);
  };

  return (
    <>
      {/* Floating Glass Pill Navigation Bar */}
      <header className={cn(
        "fixed top-0 inset-x-0 z-40 px-4 transition-all duration-300 pointer-events-none",
        isScrolled ? "pt-2" : "pt-6"
      )}>
        <div className="max-w-[1700px] mx-auto pointer-events-auto">
          <div className={cn(
            "w-full flex items-center justify-between border border-hairline/80 px-8 rounded-full transition-all duration-300",
            isScrolled
              ? "bg-white/95 backdrop-blur-2xl py-2.5 shadow-[0_12px_36px_rgba(15,23,42,0.08)] border-slate-200/90"
              : "bg-white/70 backdrop-blur-xl py-3.5 shadow-[0_8px_32px_rgba(15,23,42,0.04)]"
          )}>

            {/* Logo */}
            <div className="shrink-0">
              <Link href="/" className="flex items-center group">
                <AnnexLogo size={38} showText={true} />
              </Link>
            </div>

            {/* Desktop Menu links (Clean, uncluttered top-level layout) */}
            <nav className="hidden xl:flex items-center gap-6 2xl:gap-8 px-6">
              
              {/* Destinations Mega Menu */}
              <div
                className="relative py-2"
                onMouseEnter={() => setActiveDropdown("destinations")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={cn(
                  "flex items-center gap-1 text-sm font-medium transition-colors cursor-pointer relative py-1 group/btn",
                  activeDropdown === "destinations" || pathname.startsWith("/study") ? "text-primary font-semibold" : "text-slate-600 hover:text-primary"
                )}>
                  Destinations
                  <CaretDown size={14} className={cn("text-slate-400 transition-transform duration-200", activeDropdown === "destinations" && "rotate-180")} />
                  {pathname.startsWith("/study") && (
                    <motion.div
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>

                <AnimatePresence>
                  {activeDropdown === "destinations" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-2 pointer-events-auto z-50"
                    >
                      <div className="bg-white border border-hairline p-5 rounded-2xl shadow-xl flex gap-8 w-[480px]">
                        <div className="flex-1 flex flex-col gap-3">
                          <span className="text-[10px] font-mono-data text-slate-400 uppercase tracking-widest font-bold border-b border-hairline/60 pb-1.5 text-left">
                            International Study
                          </span>
                          <div className="flex flex-col gap-1 text-left">
                            {destinationItems.international.map(sub => (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                className="group/item flex flex-col p-1.5 rounded-xl hover:bg-subtle-gray transition-colors"
                              >
                                <span className="text-xs font-bold text-slate-800 group-hover/item:text-primary transition-colors">
                                  {sub.label}
                                </span>
                                <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                                  {sub.desc}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                        <div className="w-[180px] shrink-0 flex flex-col gap-3 border-l border-hairline/60 pl-6">
                          <span className="text-[10px] font-mono-data text-slate-400 uppercase tracking-widest font-bold border-b border-hairline/60 pb-1.5 text-left">
                            Domestic Placements
                          </span>
                          <div className="text-left">
                            {destinationItems.domestic.map(sub => (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                className="group/item flex flex-col p-1.5 rounded-xl hover:bg-subtle-gray transition-colors"
                              >
                                <span className="text-xs font-bold text-slate-800 group-hover/item:text-primary transition-colors">
                                  {sub.label}
                                </span>
                                <span className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                                  {sub.desc}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Programs Mega Menu */}
              <div
                className="relative py-2"
                onMouseEnter={() => setActiveDropdown("programs")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={cn(
                  "flex items-center gap-1 text-sm font-medium transition-colors cursor-pointer relative py-1 group/btn",
                  activeDropdown === "programs" || pathname.startsWith("/test-preparation") || pathname === "/training-placement" ? "text-primary font-semibold" : "text-slate-600 hover:text-primary"
                )}>
                  Programs
                  <CaretDown size={14} className={cn("text-slate-400 transition-transform duration-200", activeDropdown === "programs" && "rotate-180")} />
                  {(pathname.startsWith("/test-preparation") || pathname === "/training-placement") && (
                    <motion.div
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>

                <AnimatePresence>
                  {activeDropdown === "programs" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-2 pointer-events-auto z-50"
                    >
                      <div className="bg-white border border-hairline p-5 rounded-2xl shadow-xl flex gap-8 w-[480px]">
                        <div className="flex-1 flex flex-col gap-3">
                          <span className="text-[10px] font-mono-data text-slate-400 uppercase tracking-widest font-bold border-b border-hairline/60 pb-1.5 text-left">
                            Test Preparation
                          </span>
                          <div className="flex flex-col gap-1 text-left">
                            {programItems.prep.map(sub => (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                className="group/item flex flex-col p-1.5 rounded-xl hover:bg-subtle-gray transition-colors"
                              >
                                <span className="text-xs font-bold text-slate-800 group-hover/item:text-primary transition-colors">
                                  {sub.label}
                                </span>
                                <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                                  {sub.desc}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                        <div className="w-[180px] shrink-0 flex flex-col gap-3 border-l border-hairline/60 pl-6">
                          <span className="text-[10px] font-mono-data text-slate-400 uppercase tracking-widest font-bold border-b border-hairline/60 pb-1.5 text-left">
                            Career Services
                          </span>
                          <div className="text-left">
                            {programItems.career.map(sub => (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                className="group/item flex flex-col p-1.5 rounded-xl hover:bg-subtle-gray transition-colors"
                              >
                                <span className="text-xs font-bold text-slate-800 group-hover/item:text-primary transition-colors">
                                  {sub.label}
                                </span>
                                <span className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                                  {sub.desc}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Resources Dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={() => setActiveDropdown("resources")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={cn(
                  "flex items-center gap-1 text-sm font-medium transition-colors cursor-pointer relative py-1 group/btn",
                  activeDropdown === "resources" || pathname === "/success-stories" || pathname === "/blog" ? "text-primary font-semibold" : "text-slate-600 hover:text-primary"
                )}>
                  Resources
                  <CaretDown size={14} className={cn("text-slate-400 transition-transform duration-200", activeDropdown === "resources" && "rotate-180")} />
                  {(pathname === "/success-stories" || pathname === "/blog") && (
                    <motion.div
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>

                <AnimatePresence>
                  {activeDropdown === "resources" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-60 pointer-events-auto z-50"
                    >
                      <div className="bg-white border border-hairline p-2 rounded-2xl shadow-xl flex flex-col gap-1 text-left">
                        {resourceItems.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="group/item flex flex-col p-2.5 rounded-xl hover:bg-subtle-gray transition-colors"
                          >
                            <span className="text-xs font-bold text-slate-800 group-hover/item:text-primary transition-colors">
                              {sub.label}
                            </span>
                            <span className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">
                              {sub.desc}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* About Link */}
              <Link
                href="/about"
                className={cn(
                  "text-sm font-medium transition-colors relative py-1 group",
                  pathname === "/about" ? "text-primary font-semibold" : "text-slate-600 hover:text-primary"
                )}
              >
                About
                {pathname === "/about" && (
                  <motion.div
                    layoutId="activeNavLine"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>

            </nav>

            {/* Header Action Buttons (CRO & Portal logins collapse) */}
            <div className="hidden xl:flex items-center gap-4 shrink-0">
              
              {/* Unified Portals Dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={() => setActiveDropdown("portals")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-primary transition-colors cursor-pointer py-1.5 px-3 rounded-full hover:bg-subtle-gray transition-colors duration-200">
                  Portals Login
                  <CaretDown size={12} className={cn("text-slate-400 transition-transform duration-200", activeDropdown === "portals" && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {activeDropdown === "portals" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full pt-2 w-64 pointer-events-auto z-50"
                    >
                      <div className="bg-white border border-hairline p-2 rounded-2xl shadow-xl flex flex-col gap-1 text-left">
                        {portalItems.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="group/item flex flex-col p-2.5 rounded-xl hover:bg-subtle-gray transition-colors"
                          >
                            <span className="text-xs font-bold text-slate-800 group-hover/item:text-primary transition-colors">
                              {sub.label}
                            </span>
                            <span className="text-[9px] text-slate-400 mt-0.5">
                              {sub.desc}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-[1px] h-4 bg-hairline/60" />

              {/* Secondary CTA: Eligibility Calculator */}
              <Link href="/study-abroad-eligibility">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gold text-primary font-bold hover:bg-gold/5 hover:border-gold shadow-sm text-xs px-3.5 py-1.5"
                >
                  📋 Check Eligibility
                </Button>
              </Link>

              {/* Primary CTA: Consultation Bookings */}
              <Link href="/contact">
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-primary text-white font-semibold shadow-md text-xs px-3.5 py-1.5"
                >
                  Book Consultation
                </Button>
              </Link>
            </div>

            {/* Mobile Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden ml-auto p-2 rounded-full hover:bg-subtle-gray"
            >
              {isOpen ? <X size={20} /> : <List size={20} />}
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay with Accordions */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white/95 backdrop-blur-2xl z-30 xl:hidden flex flex-col pt-32 px-6 pb-12"
          >
            <div className="flex-grow flex flex-col gap-3 overflow-y-auto pr-1">
              
              {/* Destinations Section */}
              <div className="border-b border-hairline/60 py-2">
                <button
                  onClick={() => toggleMobileSection("destinations")}
                  className="flex items-center justify-between w-full text-lg font-bold font-display tracking-tight text-slate-800 text-left py-2"
                >
                  <span>Destinations</span>
                  <CaretDown size={18} className={cn("text-slate-400 transition-transform duration-200", openMobileSection === "destinations" && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {openMobileSection === "destinations" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-3 flex flex-col gap-1.5 mt-1 pb-3"
                    >
                      <span className="text-[9px] font-mono-data text-slate-400 uppercase tracking-widest font-bold block mt-1">
                        International Placements
                      </span>
                      {destinationItems.international.map(sub => (
                        <Link key={sub.label} href={sub.href} className="text-sm font-semibold text-slate-600 py-1.5 hover:text-primary">
                          {sub.label}
                        </Link>
                      ))}
                      <span className="text-[9px] font-mono-data text-slate-400 uppercase tracking-widest font-bold block mt-2">
                        Domestic Placements
                      </span>
                      {destinationItems.domestic.map(sub => (
                        <Link key={sub.label} href={sub.href} className="text-sm font-semibold text-slate-600 py-1.5 hover:text-primary">
                          {sub.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Programs Section */}
              <div className="border-b border-hairline/60 py-2">
                <button
                  onClick={() => toggleMobileSection("programs")}
                  className="flex items-center justify-between w-full text-lg font-bold font-display tracking-tight text-slate-800 text-left py-2"
                >
                  <span>Programs</span>
                  <CaretDown size={18} className={cn("text-slate-400 transition-transform duration-200", openMobileSection === "programs" && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {openMobileSection === "programs" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-3 flex flex-col gap-1.5 mt-1 pb-3"
                    >
                      <span className="text-[9px] font-mono-data text-slate-400 uppercase tracking-widest font-bold block mt-1">
                        Test Preparation
                      </span>
                      {programItems.prep.map(sub => (
                        <Link key={sub.label} href={sub.href} className="text-sm font-semibold text-slate-600 py-1.5 hover:text-primary">
                          {sub.label}
                        </Link>
                      ))}
                      <span className="text-[9px] font-mono-data text-slate-400 uppercase tracking-widest font-bold block mt-2">
                        Career Placements
                      </span>
                      {programItems.career.map(sub => (
                        <Link key={sub.label} href={sub.href} className="text-sm font-semibold text-slate-600 py-1.5 hover:text-primary">
                          {sub.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Resources Section */}
              <div className="border-b border-hairline/60 py-2">
                <button
                  onClick={() => toggleMobileSection("resources")}
                  className="flex items-center justify-between w-full text-lg font-bold font-display tracking-tight text-slate-800 text-left py-2"
                >
                  <span>Resources</span>
                  <CaretDown size={18} className={cn("text-slate-400 transition-transform duration-200", openMobileSection === "resources" && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {openMobileSection === "resources" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-3 flex flex-col gap-1 mt-1 pb-3"
                    >
                      {resourceItems.map(sub => (
                        <Link key={sub.label} href={sub.href} className="text-sm font-semibold text-slate-600 py-1.5 hover:text-primary">
                          {sub.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Portals Section Accordion */}
              <div className="border-b border-hairline/60 py-2">
                <button
                  onClick={() => toggleMobileSection("portals")}
                  className="flex items-center justify-between w-full text-lg font-bold font-display tracking-tight text-slate-800 text-left py-2"
                >
                  <span>Portals Access</span>
                  <CaretDown size={18} className={cn("text-slate-400 transition-transform duration-200", openMobileSection === "portals" && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {openMobileSection === "portals" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-3 flex flex-col gap-1 mt-1 pb-3"
                    >
                      {portalItems.map(sub => (
                        <Link key={sub.label} href={sub.href} className="text-sm font-semibold text-slate-600 py-1.5 hover:text-primary">
                          {sub.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Simple About Link */}
              <div className="py-3">
                <Link
                  href="/about"
                  className="text-lg font-bold font-display tracking-tight text-slate-800"
                >
                  About Us
                </Link>
              </div>

            </div>

            {/* CTAs Stack at bottom of mobile menu */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-3 border-t border-hairline/60 pt-6 mt-6 shrink-0"
            >
              <Link href="/study-abroad-eligibility" className="w-full">
                <Button variant="outline" size="md" className="w-full text-center border-gold text-primary font-bold bg-gold/5">
                  📋 Check Eligibility Calculator
                </Button>
              </Link>
              <Link href="/contact" className="w-full">
                <Button variant="primary" size="md" className="w-full text-center bg-primary text-white">
                  Book Consultation
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
