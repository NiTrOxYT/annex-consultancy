"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { X } from "@phosphor-icons/react";
import { supabase } from "@/lib/supabase";

interface CmsBannerProps {
  location: "homepage" | "student_dashboard" | "referral_page" | "global";
  className?: string;
  onSelectTab?: (tab: string) => void;
}

const DEFAULT_BANNER = {
  id: "default-banner",
  title: "Annex Educational Consultancy",
  display_location: "homepage",
  target_device: "all",
  desktop_image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop",
  mobile_image_url: "https://res.cloudinary.com/dcmbneyre/image/upload/v1785691570/70A612D1-8AD5-4EC7-93D7-5BC1DBB5820C_bf8kj5.png",
  link_url: "/contact",
  is_active: true
};

export function CmsBanner({ location, className = "", onSelectTab }: CmsBannerProps) {
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
        ) || validList[0] || DEFAULT_BANNER;

        // Find mobile specific match
        const mobileMatch = validList.find((b: any) =>
          (!b.display_location || b.display_location === location || b.display_location === "global" || b.display_location === "All") &&
          (b.target_device === "mobile" || b.mobile_image_url)
        ) || desktopMatch || DEFAULT_BANNER;

        const mainActive = mobileMatch || desktopMatch || DEFAULT_BANNER;

        setBannerData({ desktop: desktopMatch, mobile: mobileMatch, active: mainActive });
      } catch (err) {
        console.warn("[CMS Banner] Fetch error:", err);
        setBannerData({ desktop: DEFAULT_BANNER, mobile: DEFAULT_BANNER, active: DEFAULT_BANNER });
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

  const fallbackSrc = DEFAULT_BANNER.desktop_image_url;

  const rawDesktop = (desktop?.desktop_image_url || active?.desktop_image_url || active?.image_url || "").trim();
  const rawMobile = (mobile?.mobile_image_url || active?.mobile_image_url || active?.image_url || rawDesktop).trim();

  const finalDesktop = rawDesktop || rawMobile || fallbackSrc;
  const finalMobile = rawMobile || rawDesktop || fallbackSrc;

  const handleClick = () => {
    const link = (active?.link_url || "").trim();
    if (link.startsWith("http")) {
      window.open(link, "_blank");
    } else if (onSelectTab) {
      onSelectTab("referrals");
    } else if (link && link !== "/" && link !== "referrals" && link !== "/referrals") {
      router.push(link);
    } else {
      router.push("/referral");
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
          <picture className="w-full h-full">
            <source media="(min-width: 768px)" srcSet={finalDesktop} />
            <img
              src={finalMobile}
              alt={active.title || "Promotional Banner"}
              className="w-full h-auto min-h-[140px] max-h-[360px] object-cover rounded-2xl md:rounded-3xl transition-transform duration-500 group-hover:scale-[1.01]"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackSrc;
              }}
            />
          </picture>
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
