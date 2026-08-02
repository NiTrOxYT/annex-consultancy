import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkle, BookOpen, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Popular Courses Abroad | MBA, Computer Science, Data Science & Engineering",
  description: "Discover top-rated degree programs abroad for international students. Compare MBA, Data Science, Computer Science, Nursing, and Engineering degrees.",
  alternates: {
    canonical: "https://annex-consultancy.com/courses",
  },
};

const courseList = [
  { slug: "mba-abroad", name: "MBA & Business Management", desc: "Top global business schools offering 1 & 2-year MBA degrees with STEM extensions.", count: "120+ Programs" },
  { slug: "computer-science-abroad", name: "Computer Science & Software", desc: "In-demand computing, AI, and cybersecurity programs with high global salaries.", count: "150+ Programs" },
  { slug: "data-science-abroad", name: "Data Science & Analytics", desc: "Big Data, Machine Learning, and Predictive Analytics Master's programs.", count: "90+ Programs" },
  { slug: "nursing-abroad", name: "Nursing & Healthcare", desc: "Accredited healthcare and clinical nursing degrees with direct PR job pathways.", count: "70+ Programs" },
  { slug: "engineering-abroad", name: "Engineering & Robotics", desc: "Mechanical, Civil, Automotive, and Robotics degrees at top technical universities.", count: "110+ Programs" }
];

export default function CoursesDirectoryPage() {
  return (
    <>
      <Navigation />
      <main className="flex-grow pt-24 md:pt-28 bg-white">
        <Breadcrumbs items={[{ name: "Courses Directory", url: "https://annex-consultancy.com/courses" }]} />

        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkle size={14} className="text-amber-500" weight="fill" />
              Degree Directory
            </span>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tight">
              Top In-Demand Courses Abroad
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Find the perfect degree program aligned with your career goals, budget, and post-study work permit rights.
            </p>
          </div>
        </section>

        <section className="pb-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courseList.map((course) => (
                <Link key={course.slug} href={`/courses/${course.slug}`} className="group">
                  <Card className="p-8 border-hairline hover:shadow-lg transition-all duration-300 bg-white h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <BookOpen size={24} weight="bold" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        {course.count}
                      </span>
                      <CardTitle className="text-xl font-bold text-primary group-hover:text-slate-900 transition-colors">
                        {course.name}
                      </CardTitle>
                      <CardDescription className="text-slate-600 text-xs leading-relaxed">
                        {course.desc}
                      </CardDescription>
                    </div>
                    <div className="pt-6 flex items-center gap-2 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                      Explore Degree Guide <ArrowRight size={14} />
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
