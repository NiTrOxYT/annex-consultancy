"use client";

import * as React from "react";

interface AnnexLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function AnnexLogo({
  size = 36,
  showText = true,
  className = ""
}: AnnexLogoProps) {
  return (
    <div className={`flex items-center gap-2 md:gap-2.5 select-none ${className}`}>
      <img
        src="/images/logo.jpeg"
        alt="ANNEX Consultancy"
        width={size}
        height={size}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: "contain",
          imageRendering: "crisp-edges",
        }}
        className="shrink-0 transition-transform duration-300 group-hover:scale-[1.03]"
        onError={(e) => {
          // Fallback: hide broken image gracefully
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      {showText && (
        <span className="font-display font-bold tracking-tight text-primary text-sm sm:text-base md:text-lg lg:text-xl transition-colors hidden sm:inline-block">
          ANNEX
        </span>
      )}
    </div>
  );
}
