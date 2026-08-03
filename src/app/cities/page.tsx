import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkle, MapPin, ArrowRight, Building } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Global Student Cities Directory | Cost of Living & Housing",
  description: "Explore global student city profiles: London, Toronto, Sydney, Melbourne, Berlin, Rome, and Dubai. Compare monthly budgets, student housing, and part-time jobs.",
  alternates: {
    canonical: "https://annex-consultancy.com/cities",
  },
};

const citiesList = [
  { slug: "london", name: "London", country: "United Kingdom", budget: "£1,300 - £1,600 / mo", desc: "Global academic, financial, and cultural hub hosting top Russell Group universities and vibrant student communities." },
  { slug: "toronto", name: "Toronto", country: "Canada", budget: "CAD $1,800 - $2,200 / mo", desc: "Canada's financial capital with top public polytechnics, diverse multicultural neighborhoods, and tech hubs." },
  { slug: "sydney", name: "Sydney", country: "Australia", budget: "A$1,900 - A$2,400 / mo", desc: "Coastal metropolis featuring Group of Eight campuses, high part-time wages, and temperate lifestyle." },
  { slug: "berlin", name: "Berlin", country: "Germany", budget: "€950 - €1,200 / mo", desc: "Europe's startup and engineering center offering low-cost living and tuition-free public universities." }
];

export default function CitiesDirectoryPage() {
  return (
    <>
      <Navigation />
      <main className="flex-grow pt-24 md:pt-28 bg-white">
        <Breadcrumbs items={[{ name: "Student Cities", url: "https://annex-consultancy.com/cities" }]} />

        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkle size={14} className="text-amber-500" weight="fill" />
              City Intelligence
            </span>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tight">
              Global Student Cities Directory
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Explore student cost of living benchmarks, housing options, public transport, and part-time job opportunities across top study destinations.
            </p>
          </div>
        </section>

        <section className="pb-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {citiesList.map((city) => (
                <Link key={city.slug} href={`/cities/${city.slug}`} className="group">
                  <Card className="p-8 border-hairline hover:shadow-lg transition-all duration-300 bg-white h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                          <MapPin size={24} weight="bold" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-subtle-gray text-slate-700 border border-hairline px-2.5 py-1 rounded-full">
                          {city.budget}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-bold text-primary group-hover:text-slate-900 transition-colors">
                        {city.name}, {city.country}
                      </CardTitle>
                      <CardDescription className="text-slate-600 text-xs leading-relaxed">
                        {city.desc}
                      </CardDescription>
                    </div>
                    <div className="pt-6 flex items-center gap-2 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                      View City Guide & Living Expenses <ArrowRight size={14} />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
