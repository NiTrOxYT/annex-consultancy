"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { List, X, CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnnexLogo } from "@/components/branding/annex-logo";

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
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Floating Glass Pill Navigation Bar */}
      <header className={cn(
        "fixed top-0 inset-x-0 z-40 px-4 transition-all duration-300 pointer-events-none",
        isScrolled ? "pt-2" : "pt-6"
      )}>
        <div className="max-w-[1700px] mx-auto pointer-events-auto">
          {/* Main floating pill */}
          <div className={cn(
            "w-full flex items-center border border-hairline/80 px-8 rounded-full transition-all duration-300",
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

            {/* Desktop Menu */}
            <nav className="hidden xl:flex flex-1 justify-center items-center gap-8 2xl:gap-10 px-6">
              {navLinks.map((link) => {
                const isDropdownActive = link.dropdown?.some(sub => pathname === sub.href) || false;
                const isActive = link.dropdown 
                  ? isDropdownActive
                  : (pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/")));

                if (link.dropdown) {
                  return (
                    <div
                      key={link.label}
                      className="relative group py-2"
                      onMouseEnter={() => setActiveDropdown(link.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button className={cn(
                        "flex items-center gap-1 text-sm font-medium transition-colors cursor-pointer relative py-1 group/btn",
                        isActive ? "text-primary font-semibold" : "text-slate-600 hover:text-primary"
                      )}>
                        {link.label}
                        <CaretDown size={14} className="text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
                        
                        {/* Hover line if not active */}
                        {!isActive && (
                          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary/20 scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-center" />
                        )}
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="activeNavLine"
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
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
                      "text-sm font-medium transition-colors relative py-1 group",
                      isActive ? "text-primary font-semibold" : "text-slate-600 hover:text-primary"
                    )}
                  >
                    {link.label}
                    {/* Hover line if not active */}
                    {!isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                    )}
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavLine"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden xl:flex items-center gap-2.5 shrink-0">
              <Link href="/student-login">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-gold to-yellow-500 text-primary font-semibold shadow-md text-xs px-3 py-1.5"
                >
                  🎓 Student Portal
                </Button>
              </Link>
              <Link href="/career-portal">
                <Button
                  size="sm"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-md text-xs px-3 py-1.5"
                >
                  💼 Career Portal
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="sm" className="text-xs px-3 py-1.5">
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
                            className="text-base font-semibold text-slate-600 hover:text-primary py-2.5 flex items-center min-h-[44px] w-full"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-xl font-bold font-display tracking-tight text-slate-700 hover:text-primary py-2.5 flex items-center min-h-[44px] w-full"
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
              className="flex flex-col gap-2.5 border-t border-hairline pt-6 mt-6"
            >
              <Link href="/student-login" className="w-full">
                <Button variant="outline" size="md" className="w-full text-center">
                  Student Portal Login
                </Button>
              </Link>
              <Link href="/career-portal" className="w-full">
                <Button variant="outline" size="md" className="w-full text-center bg-slate-900 text-white border-none hover:bg-slate-800">
                  Career Portal Login
                </Button>
              </Link>
              <Link href="/contact" className="w-full">
                <Button variant="primary" size="md" className="w-full text-center">
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
