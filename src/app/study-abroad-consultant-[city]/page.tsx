import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Sparkle, Checks, CheckCircle, MapPin, Phone, ShieldCheck, GraduationCap } from "@phosphor-icons/react/dist/ssr";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { CityLocalBusinessSchema } from "@/components/seo/extended-schemas";
import { FAQSchema } from "@/components/seo/structured-data";

interface CitySEOData {
  citySlug: string;
  cityName: string;
  regionName: string;
  seoTitle: string;
  seoDesc: string;
  heading: string;
  subhead: string;
  localAddress: string;
  phone: string;
  landmarks: string[];
  faqs: { question: string; answer: string }[];
}

const cityDataMap: Record<string, CitySEOData> = {
  kolkata: {
    citySlug: "kolkata",
    cityName: "Kolkata",
    regionName: "West Bengal",
    seoTitle: "Best Study Abroad Consultants in Kolkata | Overseas Education Experts",
    seoDesc: "Top overseas education & study abroad consultants in Kolkata. 98.4% student visa success rate for UK, Australia, Canada, USA, Germany, Europe, and Dubai.",
    heading: "Best Study Abroad Consultants in Kolkata",
    subhead: "Empowering Kolkata's ambitious students to secure admissions, 100% scholarships, and student visas at leading global universities.",
    localAddress: "99/1/2, Girish Ghosh Rd, Belur Math, Howrah / Kolkata Region, West Bengal 711202",
    phone: "+91 89108 82334",
    landmarks: ["Near Belur Math", "Howrah Railway Station Junction", "Salt Lake Tech Hub", "Park Street / Camac Street"],
    faqs: [
      { question: "Where is Annex Consultancy's office located in Kolkata?", answer: "Our main regional office is located near Belur Math, serving students across Kolkata, Howrah, Salt Lake, and North/South 24 Parganas." },
      { question: "Do you offer in-person and online counseling in Kolkata?", answer: "Yes, students and parents can visit our office or book an online video counseling session for document evaluation." }
    ]
  },
  howrah: {
    citySlug: "howrah",
    cityName: "Howrah",
    regionName: "West Bengal",
    seoTitle: "Study Abroad Consultants in Howrah | Overseas University Admission",
    seoDesc: "Leading overseas education consultants in Howrah. Expert guidance for student visas, university admissions, SOP drafting, and scholarships.",
    heading: "Study Abroad & Overseas Education Consultants in Howrah",
    subhead: "Direct admission guidance for students in Howrah seeking undergraduate and Master's degrees in the UK, Australia, Europe, and USA.",
    localAddress: "99/1/2, Girish Ghosh Rd, Belur Math, Howrah, West Bengal 711202",
    phone: "+91 89108 82334",
    landmarks: ["Girish Ghosh Road", "Bally Ghat", "Howrah Station"],
    faqs: [
      { question: "Can Annex Consultancy help Howrah students with education loans?", answer: "Yes, we tie up with major nationalized banks and NBFCs to process collateral and non-collateral education loans." }
    ]
  },
  siliguri: {
    citySlug: "siliguri",
    cityName: "Siliguri",
    regionName: "North Bengal",
    seoTitle: "Study Abroad Consultants in Siliguri | Overseas Education Guidance",
    seoDesc: "Top overseas study consultants in Siliguri & North Bengal. Certified counseling for UK, Australia, Canada, Germany, and Italian scholarships.",
    heading: "Top Overseas Study Consultants in Siliguri",
    subhead: "Connecting North Bengal students with world-class higher education, 100% scholarship guidance, and student visa filing.",
    localAddress: "Annex Consultancy North Bengal Desk, Siliguri, West Bengal",
    phone: "+91 89108 82334",
    landmarks: ["Sevoke Road", "Hill Cart Road", "Bagdogra Hub"],
    faqs: [
      { question: "How can students from Siliguri access Annex Consultancy?", answer: "Siliguri students can schedule direct virtual video sessions or phone consultations with our senior counselors." }
    ]
  },
  patna: {
    citySlug: "patna",
    cityName: "Patna",
    regionName: "Bihar",
    seoTitle: "Best Overseas Education Consultants in Patna | Study Abroad",
    seoDesc: "Trusted study abroad consultants for students in Patna & Bihar. Specialist guidance for UK, Australia, Canada, USA, and European varsities.",
    heading: "Best Overseas Education Consultants in Patna",
    subhead: "Guiding Bihar's talented students to secure admissions and high-visa-success placements in top international universities.",
    localAddress: "Annex Consultancy Regional Counseling Hub, Patna, Bihar",
    phone: "+91 89108 82334",
    landmarks: ["Boring Road", "Fraser Road", "Bailey Road"],
    faqs: [
      { question: "Does Annex Consultancy assist Patna students with Italian DSU scholarships?", answer: "Yes, we handle complete DSU scholarship applications, family income verification, and CIMEA documents." }
    ]
  },
  bhubaneswar: {
    citySlug: "bhubaneswar",
    cityName: "Bhubaneswar",
    regionName: "Odisha",
    seoTitle: "Study Abroad Consultants in Bhubaneswar | Global Education",
    seoDesc: "Premier study abroad consultants in Bhubaneswar. High visa success for UK, Australia, Canada, USA, and Germany.",
    heading: "Study Abroad & Visa Consultants in Bhubaneswar",
    subhead: "Helping students across Odisha achieve their dream of international degrees with full visa and scholarship support.",
    localAddress: "Annex Consultancy Odisha Counseling Hub, Bhubaneswar",
    phone: "+91 89108 82334",
    landmarks: ["Saheed Nagar", "Janpath", "Patia IT Zone"],
    faqs: [
      { question: "What is your visa success rate for students from Odisha?", answer: "We maintain a 98.4% visa approval record through thorough document checks and mock embassy interviews." }
    ]
  },
  guwahati: {
    citySlug: "guwahati",
    cityName: "Guwahati",
    regionName: "Assam & North East",
    seoTitle: "Best Study Abroad Consultants in Guwahati | Overseas Education",
    seoDesc: "Leading overseas education consultants in Guwahati & North East India. Counseling for UK, Canada, Australia, Europe, and Dubai.",
    heading: "Best Overseas Education Consultants in Guwahati",
    subhead: "Empowering students in Assam and North East India to step onto global university campuses.",
    localAddress: "Annex Consultancy North East Desk, Guwahati, Assam",
    phone: "+91 89108 82334",
    landmarks: ["GS Road", "Zoo Road", "Ganeshguri"],
    faqs: [
      { question: "Do you assist Guwahati students with IELTS / PTE waivers?", answer: "Yes, we evaluate Class 12 English marks for IELTS waivers at top UK and European partner universities." }
    ]
  }
};

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const resolved = await params;
  const cityKey = (resolved?.city || "").toLowerCase();
  const data = cityDataMap[cityKey];
  if (!data) return { title: "City Guide Not Found | Annex Consultancy" };

  return {
    title: data.seoTitle,
    description: data.seoDesc,
    alternates: {
      canonical: `https://annex-consultancy.com/study-abroad-consultant-${data.citySlug}`,
    },
    openGraph: {
      title: data.seoTitle,
      description: data.seoDesc,
      url: `https://annex-consultancy.com/study-abroad-consultant-${data.citySlug}`,
    },
  };
}

export default async function CityLandingPage({ params }: { params: Promise<{ city: string }> }) {
  const resolved = await params;
  const cityKey = (resolved?.city || "").toLowerCase();
  const data = cityDataMap[cityKey];
  if (!data) notFound();

  return (
    <>
      <CityLocalBusinessSchema cityName={data.cityName} citySlug={data.citySlug} />
      <FAQSchema faqs={data.faqs} />
      <Navigation />

      <main className="flex-grow pt-24 md:pt-28 bg-white">
        <Breadcrumbs
          items={[
            { name: "Local Offices", url: "https://annex-consultancy.com/contact" },
            { name: `Study Abroad Consultant ${data.cityName}`, url: `https://annex-consultancy.com/study-abroad-consultant-${data.citySlug}` }
          ]}
        />

        {/* HERO */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline text-xs font-bold uppercase tracking-wider text-primary">
              <MapPin size={14} className="text-primary" /> {data.cityName}, {data.regionName}
            </span>

            <h1 className="font-display font-bold text-4xl md:text-6xl text-primary tracking-tight">
              {data.heading}
            </h1>

            <p className="text-base md:text-lg text-slate-600 max-w-3xl leading-relaxed">
              {data.subhead}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/contact">
                <Button variant="primary" size="lg">
                  Book Counseling in {data.cityName}
                </Button>
              </Link>
              <a href="https://wa.me/918910882334" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg" className="gap-2">
                  <Phone size={18} /> Call / WhatsApp {data.phone}
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* LOCAL FEATURES */}
        <section className="py-16 bg-subtle-gray border-y border-hairline">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8 border-hairline bg-white space-y-3">
                <ShieldCheck size={28} className="text-primary" />
                <h3 className="font-bold text-lg text-primary">98.4% Visa Success</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Rigorous file preparation, GIC / Blocked account guidance, and mock embassy interview simulations for students in {data.cityName}.
                </p>
              </Card>

              <Card className="p-8 border-hairline bg-white space-y-3">
                <GraduationCap size={28} className="text-emerald-700" />
                <h3 className="font-bold text-lg text-primary">100% Scholarship Support</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Filing for UK Chevening, Australian Go8 bursaries, and Italian DSU regional scholarships (€7,000 annual grant).
                </p>
              </Card>

              <Card className="p-8 border-hairline bg-white space-y-3">
                <MapPin size={28} className="text-primary" />
                <h3 className="font-bold text-lg text-primary">Local Landmark Coverage</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Conveniently assisting students near {data.landmarks.join(", ")}.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-6">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-primary text-center">
              Frequently Asked Questions in {data.cityName}
            </h2>
            <div className="space-y-4">
              {data.faqs.map((faq, i) => (
                <div key={i} className="p-5 rounded-2xl border border-hairline bg-subtle-gray/30 space-y-2">
                  <h3 className="font-bold text-base text-primary">{faq.question}</h3>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
