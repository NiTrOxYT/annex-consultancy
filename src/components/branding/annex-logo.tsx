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
  // Map size to a responsive variant if not specified
  return (
    <div className={`flex items-center gap-2 md:gap-2.5 select-none ${className}`}>
      <img
        src="/branding/annex-logo.png"
        alt="Annex International Educational Consultancy"
        width={size}
        height={size}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: "contain",
          imageRendering: "crisp-edges",
        }}
        className="shrink-0 transition-transform duration-300 group-hover:scale-[1.03]"
      />
      {showText && (
        <span className="font-display font-bold tracking-tight text-primary text-sm sm:text-base md:text-lg lg:text-xl transition-colors hidden sm:inline-block">
          ANNEX
        </span>
      )}
    </div>
  );
}
