"use client";

import * as React from "react";
import Link from "next/link";
import { X, Gift } from "@phosphor-icons/react";
import { supabase } from "@/lib/supabase";

export function HomeTopReferralBanner() {
  const [banner, setBanner] = React.useState<any | null>(null);
  const [dismissed, setDismissed] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    // Check session dismissal
    if (typeof window !== "undefined") {
      const isDismissed = sessionStorage.getItem("annex_home_banner_dismissed");
      if (isDismissed === "true") {
        setDismissed(true);
        return;
      }
    }

    const fetchBanner = async () => {
      try {
        const { data, error } = await supabase
          .from("cms_banners")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          setBanner(data[0]);
        } else {
          const local = typeof window !== "undefined" ? localStorage.getItem("annex_cms_banners") : null;
          if (local && JSON.parse(local).length > 0) {
            setBanner(JSON.parse(local)[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching homepage banner:", err);
      } finally {
        setLoaded(true);
      }
    };

    fetchBanner();
  }, []);

  if (dismissed) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("annex_home_banner_dismissed", "true");
    }
  };

  const rawDesktop = banner?.desktop_image_url || banner?.image_url || "";
  const rawMobile = banner?.mobile_image_url || rawDesktop || "";

  const linkUrl = banner?.link_url && banner.link_url !== "referrals" && banner.link_url !== "/referrals" && banner.link_url.startsWith("http")
    ? banner.link_url
    : "/referral";

  return (
    <div className="w-full bg-slate-950 text-white relative pt-24 pb-2 border-b border-white/10 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-xl border border-white/10 group">
          
          <Link href={linkUrl} className="block relative w-full overflow-hidden bg-slate-950">
            {rawDesktop ? (
              <>
                {/* Desktop PC Banner Image (Aspect 4:1 - object-contain NO CROP) */}
                <div className="hidden md:block w-full aspect-[4/1] max-h-[260px] relative bg-slate-950">
                  <img
                    src={rawDesktop}
                    alt="Referral Program Banner"
                    className="w-full h-full object-contain object-center rounded-2xl"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                {/* Mobile Banner Image (Aspect 2:1 - object-contain NO CROP) */}
                <div className="block md:hidden w-full aspect-[2/1] max-h-[240px] relative bg-slate-950">
                  <img
                    src={rawMobile || rawDesktop}
                    alt="Referral Program Banner Mobile"
                    className="w-full h-full object-contain object-center rounded-2xl"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </>
            ) : (
              /* Fallback Styled Banner if no image uploaded yet */
              <div className="p-6 md:p-8 bg-gradient-to-r from-primary via-slate-900 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-md">
                    <Gift size={24} weight="bold" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-gold/20 text-gold px-2.5 py-0.5 rounded-full font-mono-data">
                      Exclusive Ambassador Program
                    </span>
                    <h3 className="font-display font-bold text-lg md:text-xl text-white mt-1">
                      Refer Friends & Earn Up to ₹10,000 Cash Reward!
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Know students planning for higher studies? Refer them to Annex and get rewarded on enrollment.
                    </p>
                  </div>
                </div>
                <span className="px-5 py-2.5 rounded-full bg-gold text-slate-950 font-bold text-xs hover:bg-yellow-400 transition-all shadow-md shrink-0">
                  Claim Reward &rarr;
                </span>
              </div>
            )}
          </Link>

          {/* Dismiss Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 hover:bg-black text-white/80 hover:text-white backdrop-blur-md transition-colors cursor-pointer z-30 border border-white/20"
            title="Dismiss Banner"
          >
            <X size={16} weight="bold" />
          </button>

        </div>
      </div>
    </div>
  );
}
