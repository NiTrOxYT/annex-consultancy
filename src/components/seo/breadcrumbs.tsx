import React from "react";
import Link from "next/link";
import { CaretRight, House } from "@phosphor-icons/react/dist/ssr";
import { BreadcrumbSchema } from "./structured-data";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const fullItems = [
    { name: "Home", url: "https://annex-consultancy.com" },
    ...items,
  ];

  return (
    <>
      <BreadcrumbSchema items={fullItems} />
      <nav aria-label="Breadcrumb" className="w-full py-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ol className="flex items-center flex-wrap gap-2 text-xs font-semibold text-slate-500">
          <li className="inline-flex items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-slate-500 hover:text-primary transition-colors"
            >
              <House size={14} className="text-slate-400" />
              <span>Home</span>
            </Link>
          </li>
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={item.url} className="inline-flex items-center gap-2">
                <CaretRight size={12} className="text-slate-400 shrink-0" />
                {isLast ? (
                  <span className="text-primary font-bold tracking-tight" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url.replace("https://annex-consultancy.com", "") || "/"}
                    className="text-slate-500 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
