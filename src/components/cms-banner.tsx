"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { X } from "@phosphor-icons/react";
import { supabase } from "@/lib/supabase";

interface CmsBannerProps {
  location: "homepage" | "student_dashboard" | "referral_page" | "global";
  className?: string;
}

export function CmsBanner({ location, className = "" }: CmsBannerProps) {
  const router = useRouter();
  const [banner, setBanner] = React.useState<any | null>(null);
  const [dismissed, setDismissed] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const storageKey = `annex_banner_dismissed_${location}`;
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem(storageKey) === "true") {
        setDismissed(true);
      }
    }

    const fetchBanner = async () => {
      try {
        const { data, error } = await supabase
          .from("cms_banners")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        let list = data || [];
        if (!list || list.length === 0) {
          const local = typeof window !== "undefined" ? localStorage.getItem("annex_cms_banners") : null;
          list = local ? JSON.parse(local) : [];
        }

        // Find active banner for location
        const match = list.find((b: any) => 
          b.is_active !== false && 
          (!b.display_location || b.display_location === location || b.display_location === "global" || b.display_location === "All")
        ) || (list.length > 0 ? list[0] : null);

        setBanner(match || null);
      } catch (err) {
        console.warn("[CMS Banner] Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [location]);

  if (loading || dismissed || !banner || banner.is_active === false) {
    return null;
  }

  const desktopSrc = (banner.desktop_image_url || banner.image_url || banner.mobile_image_url || "").trim();
  const mobileSrc = (banner.mobile_image_url || banner.image_url || banner.desktop_image_url || "").trim();
  const fallbackSrc = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop";

  const finalDesktop = desktopSrc || fallbackSrc;
  const finalMobile = mobileSrc || desktopSrc || fallbackSrc;

  const handleClick = () => {
    const link = (banner.link_url || "").trim();
    if (!link) return;
    if (link.startsWith("http")) {
      window.open(link, "_blank");
    } else {
      router.push(link);
    }
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`annex_banner_dismissed_${location}`, "true");
    }
  };

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-md border border-hairline/80 group bg-slate-900">
        
        {/* Banner Clickable Wrapper */}
        <div 
          onClick={handleClick}
          className="block relative w-full cursor-pointer overflow-hidden"
        >
          {/* DESKTOP BANNER IMAGE (Shown on screen sizes >= 768px) */}
          <img
            src={finalDesktop}
            alt={banner.title || "Promotional Banner"}
            className="hidden md:block w-full h-auto min-h-[160px] max-h-[360px] object-cover rounded-2xl md:rounded-3xl transition-transform duration-500 group-hover:scale-[1.01]"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackSrc;
            }}
          />

          {/* MOBILE BANNER IMAGE (Shown on screen sizes < 768px) */}
          <img
            src={finalMobile}
            alt={banner.title || "Promotional Banner"}
            className="block md:hidden w-full h-auto min-h-[130px] max-h-[260px] object-cover rounded-2xl transition-transform duration-500 group-hover:scale-[1.01]"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackSrc;
            }}
          />
        </div>

        {/* Close / Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white/90 hover:text-white backdrop-blur-md transition-colors cursor-pointer z-30 shadow-md border border-white/20"
          title="Dismiss Banner"
        >
          <X size={15} weight="bold" />
        </button>
      </div>
    </div>
  );
}


