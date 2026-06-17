"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { List, X, CaretDown, GraduationCap } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Study Abroad",
    href: "/study-abroad",
    dropdown: [
      { label: "United Kingdom", href: "/study-abroad/uk" },
      { label: "Australia", href: "/study-abroad/australia" },
      { label: "Europe", href: "/study-abroad/europe" },
      { label: "Dubai", href: "/study-abroad/dubai" },
      { label: "Italy", href: "/study-abroad/italy" },
    ],
  },

  { label: "Study in India", href: "/study-in-india" },

  // ADD THIS
  { label: "Training & Placement", href: "/training-placement" },

  {
    label: "Test Prep",
    href: "/test-preparation",
    dropdown: [
      { label: "IELTS", href: "/test-preparation/ielts" },
      { label: "PTE", href: "/test-preparation/pte" },
      { label: "CMAT", href: "/test-preparation/cmat" },
      { label: "Computer Courses", href: "/test-preparation/computer-courses" },
    ],
  },

  { label: "Success Stories", href: "/success-stories" },
  { label: "Blog", href: "/blog" },
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

  React.useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <>
      {/* Floating Glass Pill Navigation Bar */}
      <header className="fixed top-0 inset-x-0 z-40 px-4 pt-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          {/* Main floating pill */}
          <div className="w-full flex items-center justify-between bg-white/70 backdrop-blur-xl border border-hairline/80 px-6 py-3.5 rounded-full shadow-[0_8px_32px_rgba(15,23,42,0.04)]">
            <Link href="/" className="flex items-center gap-2 group">
              <GraduationCap size={26} className="text-primary transition-transform duration-300 group-hover:rotate-12" weight="fill" />
              <span className="font-display font-bold text-lg tracking-tight text-primary">
                ANNEX
              </span>
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                if (link.dropdown) {
                  return (
                    <div
                      key={link.label}
                      className="relative group py-2"
                      onMouseEnter={() => setActiveDropdown(link.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-primary transition-colors cursor-pointer">
                        {link.label}
                        <CaretDown size={14} className="text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === link.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-52 pointer-events-auto"
                          >
                            <div className="bg-white border border-hairline p-2.5 rounded-2xl shadow-lg flex flex-col gap-1">
                              {link.dropdown.map((sub) => (
                                <Link
                                  key={sub.label}
                                  href={sub.href}
                                  className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-primary hover:bg-subtle-gray transition-colors",
                                    pathname === sub.href && "text-primary bg-subtle-gray"
                                  )}
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium text-slate-600 hover:text-primary transition-colors",
                      pathname === link.href && "text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <Link href="/student-login">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-gold to-yellow-500 text-primary font-semibold hover:scale-105 transition-all duration-300 shadow-md"
                >
                  🎓 Student Portal
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="sm">Book Consultation</Button>
              </Link>
            </div>

            {/* Mobile Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-subtle-gray transition-colors text-slate-600 hover:text-primary cursor-pointer"
            >
              {isOpen ? <X size={20} /> : <List size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white/95 backdrop-blur-2xl z-30 lg:hidden flex flex-col pt-32 px-8 pb-12"
          >
            <div className="flex-grow flex flex-col gap-6 overflow-y-auto">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col gap-2"
                >
                  {link.dropdown ? (
                    <>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {link.label}
                      </span>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 pl-2">
                        {link.dropdown.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="text-base font-semibold text-slate-600 hover:text-primary"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-xl font-bold font-display tracking-tight text-slate-700 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.05 }}
              className="flex flex-col gap-3 border-t border-hairline pt-6 mt-6"
            >
              <Link href="/student-login" className="w-full">
                <Button variant="outline" className="w-full text-center">
                  Student Login
                </Button>
              </Link>
              <Link href="/contact" className="w-full">
                <Button variant="primary" className="w-full text-center">
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
