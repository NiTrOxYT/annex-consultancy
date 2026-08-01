"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { X } from "@phosphor-icons/react";
import { supabase } from "@/lib/supabase";

export function HomeCmsBanner() {
  const router = useRouter();
  const [banners, setBanners] = React.useState<any[]>([]);
  const [dismissed, setDismissed] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Check sessionStorage
    if (typeof window !== "undefined") {
      const isDismissed = sessionStorage.getItem("annex_home_banner_dismissed");
      if (isDismissed === "true") {
        setDismissed(true);
      }
    }

    const loadBanners = async () => {
      try {
        const { data, error } = await supabase
          .from("cms_banners")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          setBanners(data);
        } else {
          const local = typeof window !== "undefined" ? localStorage.getItem("annex_cms_banners") : null;
          if (local) {
            const parsed = JSON.parse(local);
            setBanners(Array.isArray(parsed) ? parsed.filter((b: any) => b.is_active !== false) : []);
          } else {
            setBanners([]);
          }
        }
      } catch (err) {
        const local = typeof window !== "undefined" ? localStorage.getItem("annex_cms_banners") : null;
        if (local) {
          const parsed = JSON.parse(local);
          setBanners(Array.isArray(parsed) ? parsed.filter((b: any) => b.is_active !== false) : []);
        } else {
          setBanners([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadBanners();
  }, []);

  // If dismissed, loading, or NO banner is uploaded, render NOTHING
  if (loading || dismissed || !banners || banners.length === 0) {
    return null;
  }

  const activeBanner = banners[0]; // Active promotional banner
  if (!activeBanner || activeBanner.is_active === false) return null;

  const rawDesktop = (activeBanner.desktop_image_url || activeBanner.image_url || "").trim();
  const rawMobile = (activeBanner.mobile_image_url || "").trim();
  const desktopImg = rawDesktop || rawMobile;
  const mobileImg = rawMobile || rawDesktop;

  if (!desktopImg && !mobileImg) return null;

  const handleBannerClick = () => {
    const link = activeBanner.link_url || "";
    if (link.startsWith("http")) {
      window.open(link, "_blank");
    } else if (link && link !== "/" && link !== "referrals") {
      router.push(link);
    } else {
      router.push("/referral");
    }
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("annex_home_banner_dismissed", "true");
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-2 animate-fade-in">
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-md border border-hairline/80 group bg-white">
        <div 
          onClick={handleBannerClick}
          className="block relative w-full min-h-[140px] overflow-hidden bg-white cursor-pointer"
        >
          <picture className="block w-full">
            {desktopImg && <source media="(min-width: 768px)" srcSet={desktopImg} />}
            <img 
              src={mobileImg || desktopImg} 
              alt="Promotional Banner" 
              className="w-full h-auto min-h-[140px] max-h-[400px] object-contain rounded-2xl md:rounded-3xl block"
              onError={(e) => {
                e.currentTarget.onerror = null;
                if (desktopImg && e.currentTarget.src !== desktopImg) {
                  e.currentTarget.src = desktopImg;
                }
              }}
            />
          </picture>
        </div>

        {/* Close / Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors cursor-pointer z-30 shadow-md border border-white/20"
          title="Dismiss Banner"
        >
          <X size={16} weight="bold" />
        </button>
      </div>
    </section>
  );
}
