import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Sparkle, CheckCircle, Scales, Phone, ArrowLeft, XCircle } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FAQSchema } from "@/components/seo/structured-data";

interface ComparisonDetail {
  slug: string;
  title: string;
  optionA: string;
  optionB: string;
  overview: string;
  tableData: { feature: string; valA: string; valB: string }[];
  prosA: string[];
  prosB: string[];
  recommendation: string;
  faqs: { question: string; answer: string }[];
}

const comparisonDataMap: Record<string, ComparisonDetail> = {
  "canada-vs-australia": {
    slug: "canada-vs-australia",
    title: "Study in Canada vs Study in Australia",
    optionA: "Canada",
    optionB: "Australia",
    overview: "Both Canada and Australia are world-renowned study abroad destinations offering high academic standards, strong post-study work permits, and permanent residency (PR) pathways.",
    tableData: [
      { feature: "Average Annual Tuition", valA: "CAD $16,000 - $35,000", valB: "A$22,000 - $45,000" },
      { feature: "Living Expenses (Benchmark)", valA: "CAD $20,635 / year (GIC)", valB: "A$24,505 / year" },
      { feature: "Post-Study Work Rights", valA: "Up to 3 Years (PGWP)", valB: "2 to 4 Years (PSWR)" },
      { feature: "Part-Time Work Hours", valA: "20 hours / week during term", valB: "48 hours / fortnight" },
      { feature: "Climate & Lifestyle", valA: "Cold winters, snowy summers", valB: "Warm temperate / sunny coastal" }
    ],
    prosA: ["Lower tuition fees at public polytechnics", "PGWP open to broad public college degrees", "Express Entry PR point calculation"],
    prosB: ["Higher part-time hourly wages", "Group of Eight top-100 global varsities", "Post-study work rights extended in regional cities"],
    recommendation: "Choose Canada if you prefer cost-effective diploma/degree options with structured PR pathways. Choose Australia if you prioritize top global university rankings, warm weather, and high part-time earnings.",
    faqs: [
      { question: "Is it easier to get a student visa for Canada or Australia?", answer: "Both countries require comprehensive financial proofing. Canada requires a CAD $20,635 GIC deposit, while Australia requires 3 months of bank history under Genuine Student (GS) criteria." }
    ]
  },
  "uk-vs-canada": {
    slug: "uk-vs-canada",
    title: "Study in UK vs Study in Canada",
    optionA: "United Kingdom",
    optionB: "Canada",
    overview: "Comparing 1-year Master's programs in the UK versus 2-year Master's degrees in Canada.",
    tableData: [
      { feature: "Master's Degree Duration", valA: "1 Year (Accelerated)", valB: "2 Years" },
      { feature: "Tuition Cost Total", valA: "£12,000 - £26,000 (1 Year total)", valB: "CAD $32,000 - $60,000 (2 Years total)" },
      { feature: "Work Permit Visa", valA: "2 Years Graduate Route", valB: "Up to 3 Years PGWP" },
      { feature: "Language Test Waiver", valA: "Class 12th English 70%+ eligible", valB: "Strict IELTS 6.5 minimum" }
    ],
    prosA: ["Fast 1-year Master's saves living costs", "IELTS waivers based on Class 12 English", "Close proximity to European markets"],
    prosB: ["3-year PGWP work permit for 2-year degrees", "Clearer Express Entry PR immigration pathways", "Welcoming multicultural cities"],
    recommendation: "Choose the UK if you want to complete your Master's in 1 year and start earning sooner. Choose Canada if your priority is securing long-term post-graduation work rights and PR.",
    faqs: [
      { question: "Can I save money with a 1-year UK Master's?", answer: "Yes! Paying 1 year of living expenses in the UK is often significantly cheaper than paying 2 years of living expenses in Canada." }
    ]
  },
  "germany-vs-italy": {
    slug: "germany-vs-italy",
    title: "Study in Germany vs Study in Italy",
    optionA: "Germany",
    optionB: "Italy",
    overview: "Comparing tuition-free German public universities with Italian state universities offering 100% DSU scholarships.",
    tableData: [
      { feature: "Public University Tuition", valA: "€0 Tuition (Free)", valB: "€800 - €2,500 / year (Subsidized)" },
      { feature: "Scholarship Availability", valA: "DAAD / Merit Stipends", valB: "DSU Scholarship (100% Fee + €7,000 Stipend)" },
      { feature: "Living Expense Deposit", valA: "€11,208 Blocked Account mandatory", valB: "Family income evaluation for DSU grant" },
      { feature: "Post-Study Work Permit", valA: "18 Months", valB: "12 Months (Extendable)" }
    ],
    prosA: ["Europe's strongest engineering & industrial economy", "Zero tuition fees across public universities", "18-month job seeker visa"],
    prosB: ["DSU scholarships cover full tuition + €7,000 cash grant", "Historic public universities in Rome, Milan, Padua", "Schengen travel access"],
    recommendation: "Choose Germany if you have strong technical GPA and can deposit the €11,208 Blocked Account. Choose Italy if you qualify for DSU financial need scholarships.",
    faqs: [
      { question: "Do I need to learn German or Italian for English-taught degrees?", answer: "No, classes are taught entirely in English, though learning basic local language helps for daily life and part-time jobs." }
    ]
  }
};

export async function generateStaticParams() {
  return [
    { comparison: "canada-vs-australia" },
    { comparison: "uk-vs-canada" },
    { comparison: "germany-vs-italy" }
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ comparison: string }> }): Promise<Metadata> {
  const resolved = await params;
  const compKey = (resolved?.comparison || "").toLowerCase();
  const data = comparisonDataMap[compKey];
  if (!data) return { title: "Comparison Not Found | Annex Consultancy" };

  return {
    title: `${data.title} | Tuition, Visas & Cost Comparison`,
    description: `Side-by-side comparison of ${data.title}. Compare tuition fees, living costs, post-study work permits, and recommendations.`,
    alternates: {
      canonical: `https://annex-consultancy.com/compare/${data.slug}`,
    },
  };
}

export default async function ComparisonDetailPage({ params }: { params: Promise<{ comparison: string }> }) {
  const resolved = await params;
  const compKey = (resolved?.comparison || "").toLowerCase();
  const data = comparisonDataMap[compKey];
  if (!data) notFound();

  return (
    <>
      <FAQSchema faqs={data.faqs} />
      <Navigation />

      <main className="flex-grow pt-24 md:pt-28 bg-white">
        <Breadcrumbs
          items={[
            { name: "Comparisons", url: "https://annex-consultancy.com/compare" },
            { name: data.title, url: `https://annex-consultancy.com/compare/${data.slug}` }
          ]}
        />

        {/* HERO */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
              <Scales size={14} className="text-primary" /> Side-by-Side Comparison
            </span>

            <h1 className="font-display font-bold text-4xl md:text-6xl text-primary tracking-tight">
              {data.title}
            </h1>

            <p className="text-base md:text-lg text-slate-600 max-w-3xl leading-relaxed">
              {data.overview}
            </p>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="overflow-x-auto border border-hairline rounded-2xl shadow-sm bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-primary text-white text-xs uppercase tracking-wider font-semibold">
                    <th className="p-4 border-b border-hairline/20">Comparison Feature</th>
                    <th className="p-4 border-b border-hairline/20">{data.optionA}</th>
                    <th className="p-4 border-b border-hairline/20">{data.optionB}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline/60">
                  {data.tableData.map((row, i) => (
                    <tr key={i} className="hover:bg-subtle-gray/40">
                      <td className="p-4 font-bold text-slate-800">{row.feature}</td>
                      <td className="p-4 font-semibold text-primary">{row.valA}</td>
                      <td className="p-4 font-semibold text-slate-700">{row.valB}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* PROS & RECOMMENDATION */}
        <section className="py-16 bg-subtle-gray border-t border-hairline">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <Card className="p-8 border-hairline bg-white space-y-4">
                <h2 className="font-bold text-xl text-primary">Why Choose {data.optionA}?</h2>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  {data.prosA.map((p, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-emerald-600 shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-8 border-hairline bg-white space-y-4">
                <h2 className="font-bold text-xl text-primary">Why Choose {data.optionB}?</h2>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  {data.prosB.map((p, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-emerald-600 shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </Card>

            </div>

            <Card className="p-8 border-hairline bg-primary text-white space-y-3">
              <h2 className="font-display font-bold text-2xl text-white">Annex Consultancy Verdict</h2>
              <p className="text-sm text-slate-200 leading-relaxed">{data.recommendation}</p>
              <div className="pt-2">
                <Link href="/contact">
                  <Button variant="primary" size="lg" className="bg-white text-primary hover:bg-slate-100 font-bold">
                    Get Personal Profile Evaluation
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
