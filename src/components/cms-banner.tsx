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
  const [bannerData, setBannerData] = React.useState<{ desktop: any; mobile: any; active: any } | null>(null);
  const [dismissed, setDismissed] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBanners = async () => {
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

        const validList = list.filter((b: any) => b.is_active !== false);

        // Find desktop specific match
        const desktopMatch = validList.find((b: any) =>
          (!b.display_location || b.display_location === location || b.display_location === "global" || b.display_location === "All") &&
          (b.target_device === "desktop" || !b.target_device || (b.desktop_image_url && !b.mobile_image_url))
        ) || (validList.length > 0 ? validList[0] : null);

        // Find mobile specific match
        const mobileMatch = validList.find((b: any) =>
          (!b.display_location || b.display_location === location || b.display_location === "global" || b.display_location === "All") &&
          (b.target_device === "mobile" || b.mobile_image_url)
        ) || desktopMatch;

        const mainActive = mobileMatch || desktopMatch;

        if (mainActive) {
          setBannerData({ desktop: desktopMatch, mobile: mobileMatch, active: mainActive });
        } else {
          setBannerData(null);
        }
      } catch (err) {
        console.warn("[CMS Banner] Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [location]);

  if (loading || dismissed || !bannerData || !bannerData.active) {
    return null;
  }

  const { desktop, mobile, active } = bannerData;

  const fallbackSrc = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop";

  const rawDesktop = (desktop?.desktop_image_url || active?.desktop_image_url || active?.image_url || "").trim();
  const rawMobile = (mobile?.mobile_image_url || active?.mobile_image_url || active?.image_url || rawDesktop).trim();

  const finalDesktop = rawDesktop || rawMobile || fallbackSrc;
  const finalMobile = rawMobile || rawDesktop || fallbackSrc;

  const handleClick = () => {
    const link = (active?.link_url || "").trim();
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
  };

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-md border border-hairline/80 group bg-slate-950 min-h-[140px] md:min-h-[180px] w-full">
        
        {/* Banner Clickable Wrapper */}
        <div 
          onClick={handleClick}
          className="block relative w-full cursor-pointer overflow-hidden min-h-[140px] md:min-h-[180px]"
        >
          {/* DESKTOP BANNER IMAGE (Shown on screen sizes >= 768px) */}
          <img
            src={finalDesktop}
            alt={active.title || "Promotional Banner"}
            className="hidden md:block w-full h-auto min-h-[180px] max-h-[360px] object-cover rounded-2xl md:rounded-3xl transition-transform duration-500 group-hover:scale-[1.01]"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackSrc;
            }}
          />

          {/* MOBILE BANNER IMAGE (Shown on screen sizes < 768px) */}
          <img
            src={finalMobile}
            alt={active.title || "Promotional Banner"}
            className="block md:hidden w-full h-auto min-h-[140px] max-h-[260px] object-cover rounded-2xl transition-transform duration-500 group-hover:scale-[1.01]"
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
