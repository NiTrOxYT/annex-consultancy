import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Sparkle, Checks, ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { TopCollegesSection } from "@/components/top-colleges";
import { SectionReveal } from "@/components/section-reveal";

interface CountryDetails {
  name: string;
  tagline: string;
  desc: string;
  image: string;
  requirements: string[];
  intakes: string[];
  fees: string;
  livingCost: string;
  universities: string[];
}

const countryData: Record<string, CountryDetails> = {
  uk: {
    name: "United Kingdom",
    tagline: "Accelerated degree structures and world-renowned research.",
    desc: "The UK is one of the most popular study destinations, offering 1-year Masters programs and 3-year Bachelors programs. Annex helps you connect with top Russell Group universities and local campuses.",
    image: "/images/uk.webp",
    requirements: [
      "IELTS 6.0 - 6.5 (or equivalent PTE score)",
      "Academic score: Minimum 60% or 2.8 CGPA",
      "No gap restriction for qualified profiles",
    ],
    intakes: ["September / October", "January / February"],
    fees: "£12,000 - £26,000 per year",
    livingCost: "£10,000 - £12,000 per year",
    universities: [
      "University of Westminster, London",
      "Coventry University, Coventry",
      "University of Hertfordshire, Hatfield",
      "Cardiff University, Cardiff",
    ],
  },
  australia: {
    name: "Australia",
    tagline: "Top tier academic programs paired with rich post-study pathways.",
    desc: "Earn degrees at Group of Eight universities or leading regional campuses. Australia provides excellent opportunities for post-study work rights (PSWR) in cities like Melbourne, Sydney, and Brisbane.",
    image: "/images/australia.webp",
    requirements: [
      "IELTS 6.0 - 7.0 (or equivalent PTE score)",
      "Academic score: Minimum 65% or 3.0 CGPA",
      "Thorough financial documentation (3 months history)",
    ],
    intakes: ["February / March", "July / August", "November (limited)"],
    fees: "A$22,000 - A$42,000 per year",
    livingCost: "A$21,041 - A$25,000 per year",
    universities: [
      "Macquarie University, Sydney",
      "Deakin University, Melbourne",
      "Griffith University, Brisbane",
      "University of Wollongong, Wollongong",
    ],
  },
  europe: {
    name: "Europe",
    tagline: "Affordable premium English programs across historic campuses.",
    desc: "Study in leading economic hubs like Germany, France, or Spain. European state institutions offer highly subsidized education, while English-taught streams make degrees fully accessible to Nepalese learners.",
    image: "/images/europe.webp",
    requirements: [
      "IELTS 6.0 - 6.5 (some public institutions waive it with MOI)",
      "Academic score: Minimum 55% or 2.5 CGPA",
      "Proof of blocked account or financial sponsorship",
    ],
    intakes: ["September / October", "March / April"],
    fees: "€1,500 - €12,000 per year",
    livingCost: "€8,000 - €11,000 per year",
    universities: [
      "IU University of Applied Sciences, Germany",
      "Toulouse Business School, France",
      "Geneva Business School, Spain",
      "Schiller International University, Germany",
    ],
  },
  dubai: {
    name: "Dubai",
    tagline: "Study at top global branch campuses in an international hub.",
    desc: "Dubai offers global university branch campuses with identical degree credentials. Features flexible student visa sponsorship and immediate pathway transitions to mother campuses in the UK or Australia.",
    image: "/images/dubai.webp",
    requirements: [
      "IELTS 5.5 - 6.0 (Waiver options available on high high-school scores)",
      "Academic score: Minimum 50% or 2.2 CGPA",
      "Simplified financial verification process",
    ],
    intakes: ["September", "January", "May"],
    fees: "AED 35,000 - AED 75,000 per year",
    livingCost: "AED 24,000 - AED 36,000 per year",
    universities: [
      "Heriot-Watt University Dubai",
      "Middlesex University Dubai",
      "University of Birmingham Dubai",
      "Manipal Academy of Higher Education Dubai",
    ],
  },
  italy: {
    name: "Italy",
    tagline: "Highly subsidized state universities and generous study grants.",
    desc: "Italy stands out for offering low-cost English-taught degrees at historic public universities. Annex provides complete support with pre-enrollment steps, DSU scholarship declarations, and visa filing.",
    image: "/images/italy.webp",
    requirements: [
      "IELTS 6.0 minimum (or verified English Medium of Instruction certificate)",
      "Academic score: Minimum 55% in high school/Bachelors",
      "Italian declaration of value (DoV) or CIMEA certificate",
    ],
    intakes: ["September / October only"],
    fees: "€800 - €3,000 per year (State rates)",
    livingCost: "€5,000 - €7,000 per year",
    universities: [
      "University of Milan, Milan",
      "Sapienza University of Rome, Rome",
      "University of Bologna, Bologna",
      "Polytechnic University of Turin, Turin",
    ],
  },
};

// Next.js static params generation for routing validation
export async function generateStaticParams() {
  return [
    { country: "uk" },
    { country: "australia" },
    { country: "europe" },
    { country: "dubai" },
    { country: "italy" },
  ];
}

interface PageProps {
  params: Promise<{ country: string }>;
}

export default async function CountryPage({ params }: PageProps) {
  const { country } = await params;
  const data = countryData[country.toLowerCase()];

  if (!data) {
    notFound();
  }

  return (
    <>
      <Navigation />

      <main className="flex-grow pt-32 pb-24 bg-white text-left">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Back button */}
          <Link href="/study-abroad" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-primary transition-colors mb-12">
            <ArrowLeft size={12} /> Back to Destinations
          </Link>

          {/* Desktop Left / Right Split Layout */}
          <SectionReveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
              
              {/* Left Column: Heading and Requirements */}
              <div className="lg:col-span-7 flex flex-col gap-8">
                
                {/* Heading Block */}
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline/80 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-6">
                    <Sparkle size={12} className="text-gold" weight="fill" />
                    Admissions Guide
                  </div>
                  <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tighter leading-none mb-6">
                    Study in {data.name}.
                  </h1>
                  <p className="text-base md:text-lg text-slate-500 leading-relaxed">
                    {data.tagline} {data.desc}
                  </p>
                </div>

                {/* Requirements Card */}
                <Card className="flex flex-col justify-start">
                  <CardTitle className="text-lg mb-6 border-b border-hairline pb-4">Entry Requirements</CardTitle>
                  <ul className="flex flex-col gap-4">
                    {data.requirements.map((req) => (
                      <li key={req} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0 mt-0.5">
                          <Checks size={12} />
                        </span>
                        <span className="text-sm text-slate-600 font-medium leading-relaxed">{req}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

              </div>

              {/* Right Column: Hero Image & Quick Metrics */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Premium Destination Hero Image */}
                <div className="relative w-full aspect-[16/10] bg-subtle-gray border border-hairline/80 p-2 rounded-[2rem]">
                  <div className="relative w-full h-full overflow-hidden rounded-[calc(2rem-0.5rem)] border border-hairline/40">
                    <Image
                      src={data.image}
                      alt={`Study in ${data.name}`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover brightness-[0.98]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
                  </div>
                </div>

                <Card className="h-auto">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Intake Cycles
                  </CardTitle>
                  <div className="font-display font-bold text-xl text-primary leading-tight">
                    {data.intakes.join(" / ")}
                  </div>
                </Card>

                <Card className="h-auto">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Average Tuition Fee
                  </CardTitle>
                  <div className="font-mono-data text-xl font-bold text-primary leading-tight">
                    {data.fees}
                  </div>
                </Card>

                <Card className="h-auto">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Est. Living Cost
                  </CardTitle>
                  <div className="font-mono-data text-xl font-bold text-primary leading-tight">
                    {data.livingCost}
                  </div>
                </Card>

              </div>

            </div>
          </SectionReveal>

          {/* Universities list */}
          <SectionReveal delay={0.05}>
            <div className="mb-16">
              <TopCollegesSection country={country} />
            </div>
          </SectionReveal>

          {/* CTA Box */}
          <SectionReveal delay={0.1}>
            <div className="bg-primary text-white p-12 rounded-[2rem] text-center flex flex-col items-center">
              <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-4">Start your {data.name} enrollment today</h3>
              <p className="text-sm text-slate-300 max-w-[45ch] mb-8">We offer full-cycle application routing, credential validation, and visa briefing.</p>
              <Link href="/contact">
                <Button variant="gold" size="md">Book Consultation</Button>
              </Link>
            </div>
          </SectionReveal>

        </div>
      </main>

      <Footer />
    </>
  );
}
