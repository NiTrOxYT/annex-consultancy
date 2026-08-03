import React from "react";
import Link from "next/link";
import { Clock, Calendar, CheckCircle, Tag } from "@phosphor-icons/react/dist/ssr";

export interface QuickSummaryProps {
  title?: string;
  readingTimeMinutes?: number;
  lastUpdated?: string;
  keyTakeaways: string[];
  entities?: { name: string; url?: string }[];
}

export function QuickSummary({
  title = "Key Takeaways — At a Glance",
  readingTimeMinutes = 5,
  lastUpdated = "August 2026",
  keyTakeaways,
  entities = [],
}: QuickSummaryProps) {
  return (
    <div className="my-8 p-6 md:p-8 rounded-3xl bg-subtle-gray/70 border border-hairline shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-hairline/80">
        <span className="font-display font-bold text-lg text-primary flex items-center gap-2">
          <CheckCircle size={22} className="text-emerald-600" />
          {title}
        </span>
        <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold">
          <span className="flex items-center gap-1">
            <Clock size={14} className="text-slate-400" /> {readingTimeMinutes} min read
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} className="text-slate-400" /> Updated: {lastUpdated}
          </span>
        </div>
      </div>

      <ul className="mt-4 space-y-2.5 text-xs md:text-sm text-slate-700 font-medium">
        {keyTakeaways.map((takeaway, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
            <span>{takeaway}</span>
          </li>
        ))}
      </ul>

      {entities.length > 0 && (
        <div className="mt-5 pt-4 border-t border-hairline/60 flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
            <Tag size={12} /> Key Entities:
          </span>
          {entities.map((ent, idx) => (
            ent.url ? (
              <Link
                key={idx}
                href={ent.url}
                className="text-xs font-bold text-primary hover:underline bg-white px-2.5 py-0.5 rounded-md border border-hairline"
              >
                {ent.name}
              </Link>
            ) : (
              <span
                key={idx}
                className="text-xs font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded-md border border-hairline"
              >
                {ent.name}
              </span>
            )
          ))}
        </div>
      )}
    </div>
  );
}
