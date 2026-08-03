import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Sparkle, CheckCircle, MapPin, CurrencyInr, House, Train, Briefcase, Phone } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FAQSchema } from "@/components/seo/structured-data";

interface CityDetail {
  slug: string;
  name: string;
  country: string;
  monthlyBudget: string;
  housingCost: string;
  transportCost: string;
  overview: string;
  topUniversities: string[];
  partTimeJobs: string[];
  faqs: { question: string; answer: string }[];
}

const cityDataMap: Record<string, CityDetail> = {
  london: {
    slug: "london",
    name: "London",
    country: "United Kingdom",
    monthlyBudget: "£1,334 - £1,600 / month",
    housingCost: "£800 - £1,100 / month (Shared Student Flat / PBSA)",
    transportCost: "£100 - £150 / month (Student Oyster Card 30% discount)",
    overview: "London is consistently ranked as the world's #1 student city by QS. Home to world-class institutions like Imperial College, UCL, King's College, and Queen Mary, it offers unparalleled networking, global financial services, and cultural exposure.",
    topUniversities: ["University of Westminster", "Imperial College London", "King's College London", "Queen Mary University of London"],
    partTimeJobs: ["Retail & Hospitality Assistant", "University Student Ambassador", "Tutoring & Academic Assisting", "Event Logistics"],
    faqs: [
      { question: "How many hours can I work part-time in London on a student visa?", answer: "International students on a UK Student Visa can work up to 20 hours per week during term time and full-time during official university holidays." }
    ]
  },
  toronto: {
    slug: "toronto",
    name: "Toronto",
    country: "Canada",
    monthlyBudget: "CAD $1,800 - $2,200 / month",
    housingCost: "CAD $1,000 - $1,400 / month (Shared Room / Off-Campus Apartment)",
    transportCost: "CAD $128 / month (TTC Post-Secondary Pass)",
    overview: "Toronto is Canada's economic epicenter, combining financial services, technology hubs, and healthcare research. It offers diverse multicultural communities and top public institutions.",
    topUniversities: ["University of Toronto", "York University", "TMU (Ryerson)", "Seneca Polytechnic"],
    partTimeJobs: ["Campus Assistant", "Customer Service Specialist", "Retail Store Representative", "Logistics & Delivery Support"],
    faqs: [
      { question: "Is living in Toronto expensive for international students?", answer: "While housing costs are higher than smaller Canadian cities, Toronto offers competitive part-time wages ($16.55+/hr) and extensive public transport networks." }
    ]
  }
};

export async function generateStaticParams() {
  return [
    { slug: "london" },
    { slug: "toronto" }
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolved = await params;
  const slugKey = (resolved?.slug || "").toLowerCase();
  const city = cityDataMap[slugKey];
  if (!city) return { title: "City Not Found | Annex Consultancy" };

  return {
    title: `Student Living in ${city.name}, ${city.country} | Budget & Housing`,
    description: `Complete student guide to ${city.name}. Monthly cost of living: ${city.monthlyBudget}. Top universities, student housing, public transport, and part-time jobs.`,
    alternates: {
      canonical: `https://annex-consultancy.com/cities/${city.slug}`,
    },
  };
}

export default async function CityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params;
  const slugKey = (resolved?.slug || "").toLowerCase();
  const city = cityDataMap[slugKey];
  if (!city) notFound();

  return (
    <>
      <FAQSchema faqs={city.faqs} />
      <Navigation />

      <main className="flex-grow pt-24 md:pt-28 bg-white">
        <Breadcrumbs
          items={[
            { name: "Student Cities", url: "https://annex-consultancy.com/cities" },
            { name: `${city.name}, ${city.country}`, url: `https://annex-consultancy.com/cities/${city.slug}` }
          ]}
        />

        {/* HERO */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
              <MapPin size={14} className="text-primary" /> {city.country}
            </span>

            <h1 className="font-display font-bold text-4xl md:text-6xl text-primary tracking-tight">
              Student Guide to {city.name}
            </h1>

            <p className="text-base md:text-lg text-slate-600 max-w-3xl leading-relaxed">
              {city.overview}
            </p>
          </div>
        </section>

        {/* COST BENCHMARKS */}
        <section className="py-10 bg-subtle-gray border-y border-hairline">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <Card className="p-6 border-hairline bg-white">
                <CurrencyInr size={28} className="text-emerald-700 mx-auto mb-2" />
                <span className="text-xs text-slate-400 font-bold uppercase">Estimated Monthly Budget</span>
                <p className="font-display font-bold text-base text-slate-900 mt-1">{city.monthlyBudget}</p>
              </Card>

              <Card className="p-6 border-hairline bg-white">
                <House size={28} className="text-primary mx-auto mb-2" />
                <span className="text-xs text-slate-400 font-bold uppercase">Average Housing Cost</span>
                <p className="font-display font-bold text-base text-slate-900 mt-1">{city.housingCost}</p>
              </Card>

              <Card className="p-6 border-hairline bg-white">
                <Train size={28} className="text-amber-600 mx-auto mb-2" />
                <span className="text-xs text-slate-400 font-bold uppercase">Public Transport</span>
                <p className="font-display font-bold text-base text-slate-900 mt-1">{city.transportCost}</p>
              </Card>
            </div>
          </div>
        </section>

        {/* TOP UNIVERSITIES & PART-TIME JOBS */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              <div className="space-y-6">
                <h2 className="font-display font-bold text-2xl md:text-3xl text-primary">
                  Top Universities in {city.name}
                </h2>
                <div className="space-y-3">
                  {city.topUniversities.map((uni, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-subtle-gray border border-hairline font-bold text-sm text-primary">
                      <CheckCircle size={18} className="text-emerald-600" />
                      <span>{uni}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="font-display font-bold text-2xl md:text-3xl text-primary">
                  Part-Time Job Opportunities
                </h2>
                <div className="space-y-3">
                  {city.partTimeJobs.map((job, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-subtle-gray border border-hairline font-bold text-sm text-slate-800">
                      <Briefcase size={18} className="text-primary" />
                      <span>{job}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
