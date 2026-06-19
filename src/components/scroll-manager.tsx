"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { ArrowUp } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";

export function ScrollManager() {
  const pathname = usePathname();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  const isDashboard = pathname.startsWith("/student") || pathname.startsWith("/admin") || pathname.startsWith("/career-portal");

  useEffect(() => {
    if (isDashboard) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Check for low-power or low-end device (less than 4 cores)
    const isLowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    if (isLowPower) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Scroll listener for scroll top button & progress indicator
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Update progress percentage
      if (docHeight > 0) {
        setScrollProgress((scrollY / docHeight) * 100);
      }
      
      // Show/hide scroll top button
      if (scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Setup ResizeObserver to listen for DOM size changes and trigger resize
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });
    
    if (document.body) {
      resizeObserver.observe(document.body);
    }

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [isDashboard]);

  // Recalculate and reset scroll/resize on page transition
  useEffect(() => {
    if (isDashboard || !lenisRef.current) return;

    // Let the DOM repaint, then trigger resize and scroll to top/current hash
    const timer = setTimeout(() => {
      lenisRef.current?.resize();
    }, 120);

    return () => clearTimeout(timer);
  }, [pathname, isDashboard]);

  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.0 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isDashboard) return null;

  return (
    <>
      {/* Scroll Progress Bar at the top of the viewport */}
      <div 
        className="fixed top-0 left-0 h-[2.5px] bg-gold z-[100] transition-all duration-75 pointer-events-none" 
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Back to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-primary text-white hover:bg-primary/95 border border-hairline/10 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.18)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer select-none transition-all duration-200"
            aria-label="Back to top"
          >
            <ArrowUp size={16} weight="bold" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
