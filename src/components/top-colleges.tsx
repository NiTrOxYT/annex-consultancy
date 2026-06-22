"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkle, MapPin, Calendar, Clock, BookOpen, 
  ArrowRight, MagnifyingGlass, Star, ArrowUpRight, 
  X, CheckCircle, WarningCircle, Trophy, Globe, UserCheck
} from "@phosphor-icons/react";
import { supabase } from "@/lib/supabase";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface University {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  country: string;
  city: string;
  category: string;
  course_type: string;
  ranking: number | null;
  ranking_source: string;
  rating: number;
  total_fees: string;
  application_deadline: string;
  intake: string;
  cutoff: string;
  website_url: string;
  description: string;
  featured: boolean;
  published: boolean;
  created_at: string;
  views_count: number;
  clicks_count: number;
}

interface TopCollegesSectionProps {
  country: string; // e.g. 'uk', 'australia', 'europe', 'dubai', 'italy', 'india', 'abroad', 'all'
  featuredOnly?: boolean;
  limit?: number;
  showControls?: boolean;
}

// Full seed/fallback data set mirroring original static data
const FALLBACK_UNIVERSITIES: Omit<University, "id" | "created_at" | "views_count" | "clicks_count">[] = []; /* [
  // UK
  {
    name: "University of Westminster",
    slug: "university-of-westminster",
    logo_url: "https://picsum.photos/seed/westminster/120/120",
    country: "United Kingdom",
    city: "London",
    category: "MBA",
    course_type: "Postgraduate",
    ranking: 701,
    ranking_source: "QS World Rankings",
    rating: 4.4,
    total_fees: "£15,000 - £22,000 per year",
    application_deadline: "June 30",
    intake: "September / January",
    cutoff: "IELTS 6.5",
    website_url: "https://www.westminster.ac.uk",
    description: "A vibrant international institution in the heart of London, offering world-class facilities and strong links to global industries.",
    featured: true,
    published: true
  },
  {
    name: "Coventry University",
    slug: "coventry-university",
    logo_url: "https://picsum.photos/seed/coventry/120/120",
    country: "United Kingdom",
    city: "Coventry",
    category: "Engineering",
    course_type: "Undergraduate",
    ranking: 601,
    ranking_source: "QS World Rankings",
    rating: 4.2,
    total_fees: "£12,000 - £18,000 per year",
    application_deadline: "July 15",
    intake: "September / January",
    cutoff: "IELTS 6.0",
    website_url: "https://www.coventry.ac.uk",
    description: "Renowned for its forward-thinking approach, Coventry offers excellent applied sciences and engineering courses with global recognition.",
    featured: false,
    published: true
  },
  {
    name: "University of Hertfordshire",
    slug: "university-of-hertfordshire",
    logo_url: "https://picsum.photos/seed/hertfordshire/120/120",
    country: "United Kingdom",
    city: "Hatfield",
    category: "BCA",
    course_type: "Undergraduate",
    ranking: 801,
    ranking_source: "QS World Rankings",
    rating: 4.1,
    total_fees: "£11,000 - £16,000 per year",
    application_deadline: "June 30",
    intake: "September / January",
    cutoff: "IELTS 6.0",
    website_url: "https://www.herts.ac.uk",
    description: "Located close to London, Hertfordshire focuses on business, computer applications, and career-oriented pathways.",
    featured: false,
    published: true
  },
  {
    name: "Cardiff University",
    slug: "cardiff-university",
    logo_url: "https://picsum.photos/seed/cardiff/120/120",
    country: "United Kingdom",
    city: "Cardiff",
    category: "MBBS",
    course_type: "Undergraduate",
    ranking: 154,
    ranking_source: "QS World Rankings",
    rating: 4.6,
    total_fees: "£18,000 - £26,000 per year",
    application_deadline: "June 1",
    intake: "September",
    cutoff: "IELTS 7.0",
    website_url: "https://www.cardiff.ac.uk",
    description: "A prestigious Russell Group member offering top-tier medical training, state-of-the-art laboratories, and clinical placement programs.",
    featured: true,
    published: true
  },
  // Australia
  {
    name: "Macquarie University",
    slug: "macquarie-university",
    logo_url: "https://picsum.photos/seed/macquarie/120/120",
    country: "Australia",
    city: "Sydney",
    category: "MBA",
    course_type: "Postgraduate",
    ranking: 130,
    ranking_source: "QS World Rankings",
    rating: 4.5,
    total_fees: "A$38,000 - A$46,000 per year",
    application_deadline: "November 30",
    intake: "February / July",
    cutoff: "PTE 65 / IELTS 6.5",
    website_url: "https://www.mq.edu.au",
    description: "A progressive research university in Sydney, highly rated for business administration, post-study placements, and innovation.",
    featured: true,
    published: true
  },
  {
    name: "Deakin University",
    slug: "deakin-university",
    logo_url: "https://picsum.photos/seed/deakin/120/120",
    country: "Australia",
    city: "Melbourne",
    category: "BCA",
    course_type: "Undergraduate",
    ranking: 233,
    ranking_source: "QS World Rankings",
    rating: 4.3,
    total_fees: "A$30,000 - A$37,000 per year",
    application_deadline: "December 15",
    intake: "February / July",
    cutoff: "IELTS 6.0",
    website_url: "https://www.deakin.edu.au",
    description: "Deakin combines outstanding education with industry-ready internships and strong post-study work rights pathways in Melbourne.",
    featured: false,
    published: true
  },
  {
    name: "Griffith University",
    slug: "griffith-university",
    logo_url: "https://picsum.photos/seed/griffith/120/120",
    country: "Australia",
    city: "Brisbane",
    category: "Engineering",
    course_type: "Undergraduate",
    ranking: 240,
    ranking_source: "QS World Rankings",
    rating: 4.2,
    total_fees: "A$32,000 - A$39,000 per year",
    application_deadline: "November 15",
    intake: "February / July",
    cutoff: "IELTS 6.0",
    website_url: "https://www.griffith.edu.au",
    description: "Highly student-focused, Griffith offers excellent programs in software engineering, environmental science, and creative arts.",
    featured: false,
    published: true
  },
  {
    name: "University of Wollongong",
    slug: "university-of-wollongong",
    logo_url: "https://picsum.photos/seed/wollongong/120/120",
    country: "Australia",
    city: "Wollongong",
    category: "BBA",
    course_type: "Undergraduate",
    ranking: 162,
    ranking_source: "QS World Rankings",
    rating: 4.4,
    total_fees: "A$28,000 - A$35,000 per year",
    application_deadline: "October 30",
    intake: "February / July / November",
    cutoff: "IELTS 6.0",
    website_url: "https://www.uow.edu.au",
    description: "UOW is globally ranked among the top modern institutions, offering exceptional business studies and scenic campus environments.",
    featured: false,
    published: true
  },
  // Europe
  {
    name: "IU University of Applied Sciences",
    slug: "iu-university-germany",
    logo_url: "https://picsum.photos/seed/iu/120/120",
    country: "Germany",
    city: "Bad Honnef",
    category: "MBA",
    course_type: "Postgraduate",
    ranking: 500,
    ranking_source: "CHE Excellence",
    rating: 4.3,
    total_fees: "€3,500 - €7,000 per year",
    application_deadline: "Flexible",
    intake: "September / March",
    cutoff: "IELTS 6.0 / MOI",
    website_url: "https://www.iu.org",
    description: "Germany’s largest university of applied sciences, specializing in affordable, English-taught business management and tech programs.",
    featured: true,
    published: true
  },
  {
    name: "Toulouse Business School",
    slug: "tbs-education-france",
    logo_url: "https://picsum.photos/seed/tbs/120/120",
    country: "France",
    city: "Toulouse",
    category: "BBA",
    course_type: "Undergraduate",
    ranking: 100,
    ranking_source: "Financial Times",
    rating: 4.4,
    total_fees: "€9,000 - €12,000 per year",
    application_deadline: "June 15",
    intake: "September / January",
    cutoff: "IELTS 6.0",
    website_url: "https://www.tbs-education.com",
    description: "A triple-accredited (AACSB, AMBA, EQUIS) business school located in the vibrant aerospace hub of Toulouse, France.",
    featured: false,
    published: true
  },
  {
    name: "Geneva Business School",
    slug: "geneva-business-school",
    logo_url: "https://picsum.photos/seed/gbs/120/120",
    country: "Spain",
    city: "Barcelona",
    category: "BBA",
    course_type: "Undergraduate",
    ranking: 150,
    ranking_source: "CEOWORLD Magazine",
    rating: 4.2,
    total_fees: "€10,500 - €13,000 per year",
    application_deadline: "July 30",
    intake: "September / February",
    cutoff: "IELTS 6.0",
    website_url: "https://gbsge.com",
    description: "Offers high-end, practical business administration courses taught completely in English in Barcelona and Geneva.",
    featured: false,
    published: true
  },
  // Dubai
  {
    name: "Heriot-Watt University Dubai",
    slug: "heriot-watt-dubai",
    logo_url: "https://picsum.photos/seed/heriot/120/120",
    country: "United Arab Emirates",
    city: "Dubai",
    category: "Engineering",
    course_type: "Undergraduate",
    ranking: 256,
    ranking_source: "QS World Rankings",
    rating: 4.4,
    total_fees: "AED 55,000 - AED 70,000 per year",
    application_deadline: "August 15",
    intake: "September / January",
    cutoff: "IELTS 6.0",
    website_url: "https://www.hw.ac.uk/dubai.htm",
    description: "A premier British university branch campus in Dubai, specializing in robotics, civil engineering, and digital systems.",
    featured: true,
    published: true
  },
  {
    name: "Middlesex University Dubai",
    slug: "middlesex-dubai",
    logo_url: "https://picsum.photos/seed/middlesex/120/120",
    country: "United Arab Emirates",
    city: "Dubai",
    category: "BCA",
    course_type: "Undergraduate",
    ranking: 700,
    ranking_source: "QS World Rankings",
    rating: 4.3,
    total_fees: "AED 48,000 - AED 62,000 per year",
    application_deadline: "August 20",
    intake: "September / January / May",
    cutoff: "IELTS 6.0",
    website_url: "https://www.mdx.ac.ae",
    description: "Offering highly credited UK credentials with immediate pathways to transfer to the parent campus in London.",
    featured: false,
    published: true
  },
  // Italy
  {
    name: "University of Milan",
    slug: "university-of-milan",
    logo_url: "https://picsum.photos/seed/milan/120/120",
    country: "Italy",
    city: "Milan",
    category: "MBBS",
    course_type: "Undergraduate",
    ranking: 276,
    ranking_source: "QS World Rankings",
    rating: 4.5,
    total_fees: "€800 - €3,000 per year",
    application_deadline: "September only",
    intake: "September only",
    cutoff: "IMAT Entrance Exam",
    website_url: "https://www.unimi.it",
    description: "Historic public institution offering top-tier English-taught medical programs (IMAT) at highly subsidized state rates.",
    featured: true,
    published: true
  },
  {
    name: "Sapienza University of Rome",
    slug: "sapienza-university-of-rome",
    logo_url: "https://picsum.photos/seed/sapienza/120/120",
    country: "Italy",
    city: "Rome",
    category: "BCA",
    course_type: "Undergraduate",
    ranking: 134,
    ranking_source: "QS World Rankings",
    rating: 4.6,
    total_fees: "€1,000 - €2,900 per year",
    application_deadline: "September only",
    intake: "September only",
    cutoff: "IELTS 6.0 / SAT",
    website_url: "https://www.uniroma1.it",
    description: "One of the oldest and largest universities in Europe, providing prestigious studies in software architectures and data science.",
    featured: true,
    published: true
  },
  // India
  {
    name: "Sharda University",
    slug: "sharda-university",
    logo_url: "https://picsum.photos/seed/sharda/120/120",
    country: "India",
    city: "Greater Noida, Delhi NCR",
    category: "Engineering",
    course_type: "Undergraduate",
    ranking: 87,
    ranking_source: "NIRF India",
    rating: 4.5,
    total_fees: "₹150,000 - ₹250,000 per year",
    application_deadline: "June / July",
    intake: "June / July",
    cutoff: "SUAT / JEE Main",
    website_url: "https://www.sharda.ac.in",
    description: "A premier multi-disciplinary campus in Delhi NCR holding NAAC A+ accreditation, with massive global industry tie-ups.",
    featured: true,
    published: true
  },
  {
    name: "Lovely Professional University (LPU)",
    slug: "lovely-professional-university",
    logo_url: "https://picsum.photos/seed/lpu/120/120",
    country: "India",
    city: "Jalandhar, Punjab",
    category: "MBA",
    course_type: "Postgraduate",
    ranking: 32,
    ranking_source: "NIRF India",
    rating: 4.4,
    total_fees: "₹160,000 - ₹280,000 per year",
    application_deadline: "June / July",
    intake: "June / July",
    cutoff: "LPUNEST / CAT / MAT",
    website_url: "https://www.lpu.in",
    description: "Renowned for its hyper-modern infrastructure, tech focus, and record-breaking multinational student placements.",
    featured: true,
    published: true
  },
  {
    name: "Kalinga Institute of Industrial Technology (KIIT)",
    slug: "kalinga-institute",
    logo_url: "https://picsum.photos/seed/kiit/120/120",
    country: "India",
    city: "Bhubaneswar, Odisha",
    category: "Engineering",
    course_type: "Undergraduate",
    ranking: 16,
    ranking_source: "NIRF India",
    rating: 4.7,
    total_fees: "₹180,000 - ₹340,000 per year",
    application_deadline: "June / July",
    intake: "June / July",
    cutoff: "KIITEE Exam",
    website_url: "https://www.kiit.ac.in",
    description: "Holds NAAC A++ accreditation and Institution of Eminence status, offering unmatched infrastructure and 100% placement guarantees.",
    featured: true,
    published: true
  }
] */ ;

const categories = ["Engineering", "MBA", "MBBS", "BCA", "BBA", "Nursing"];

export function TopCollegesSection({ country, featuredOnly = false, limit, showControls = true }: TopCollegesSectionProps) {
  const [dbUnis, setDbUnis] = React.useState<University[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState("Engineering");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortByRank, setSortByRank] = React.useState<"asc" | "desc">("asc");
  const [selectedUni, setSelectedUni] = React.useState<University | null>(null);

  // Load and filter data
  React.useEffect(() => {
    async function loadUniversities() {
      setLoading(true);
      try {
        let query = supabase
          .from("universities")
          .select("*")
          .eq("published", true);

        if (featuredOnly) {
          query = query.eq("featured", true);
        }

        const { data, error } = await query;

        if (error) throw error;
        if (data) {
          setDbUnis(data);
        }
      } catch (err) {
        console.error("Failed to load universities from database:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUniversities();
  }, [featuredOnly]);

  // Filtering by Country (Case Insensitive mapping)
  const filteredByCountry = React.useMemo(() => {
    const searchCountry = country.toLowerCase();
    
    return dbUnis.filter(uni => {
      const uCountry = uni.country.toLowerCase();
      
      if (searchCountry === "all") return true;
      if (searchCountry === "india") return uCountry === "india";
      
      if (searchCountry === "abroad") {
        return uCountry !== "india";
      }
      
      if (searchCountry === "uk") {
        return uCountry === "united kingdom" || uCountry === "uk";
      }
      
      if (searchCountry === "dubai") {
        return uCountry === "united arab emirates" || uCountry === "dubai" || uCountry === "uae";
      }
      
      // Australia, Italy, Europe
      if (searchCountry === "europe") {
        return ["germany", "france", "spain", "italy", "switzerland", "netherlands"].includes(uCountry);
      }
      
      return uCountry === searchCountry;
    });
  }, [dbUnis, country]);

  // Filtering by Category, Search Query, and Sorting by Ranking
  const displayUnis = React.useMemo(() => {
    let result = filteredByCountry;

    if (showControls) {
      result = result.filter(uni => {
        const matchesCategory = uni.category && uni.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch = 
          uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (uni.city && uni.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
          uni.country.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesCategory && matchesSearch;
      });
    }

    result = [...result].sort((a, b) => {
      const rankA = a.ranking === null || a.ranking === undefined ? Infinity : a.ranking;
      const rankB = b.ranking === null || b.ranking === undefined ? Infinity : b.ranking;
      
      if (sortByRank === "asc") {
        return rankA - rankB;
      } else {
        if (rankA === Infinity) return 1;
        if (rankB === Infinity) return -1;
        return rankB - rankA;
      }
    });

    if (limit) {
      result = result.slice(0, limit);
    }

    return result;
  }, [filteredByCountry, selectedCategory, searchQuery, sortByRank, showControls, limit]);

  // Analytics Increment for views
  const handleOpenModal = async (uni: University) => {
    setSelectedUni(uni);
    
    // Don't track if it's fallback local ID
    if (uni.id.startsWith("fallback-")) return;
    try {
      await supabase
        .from("universities")
        .update({ views_count: uni.views_count + 1 })
        .eq("id", uni.id);
      
      // Optimistic increment in local state so charts update
      setDbUnis(prev => prev.map(item => item.id === uni.id ? { ...item, views_count: item.views_count + 1 } : item));
    } catch (err) {
      console.error("Error logging view event:", err);
    }
  };

  // Analytics Increment for clicks
  const handleApplyClick = async (uni: University) => {
    if (uni.id.startsWith("fallback-")) return;
    try {
      await supabase
        .from("universities")
        .update({ clicks_count: uni.clicks_count + 1 })
        .eq("id", uni.id);
      
      // Optimistic local state update
      setDbUnis(prev => prev.map(item => item.id === uni.id ? { ...item, clicks_count: item.clicks_count + 1 } : item));
    } catch (err) {
      console.error("Error logging click event:", err);
    }
  };

  return (
    <section className="py-20 border-t border-hairline bg-white text-left">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-subtle-gray border border-hairline/80 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-4">
              <Trophy size={12} className="text-gold" weight="fill" />
              Institutions Directory
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-primary tracking-tight leading-none">
              Top Affiliated Universities & Colleges.
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xl">
              Explore and filter premium partner institutions. Filter by stream categories to compare world rankings, annual intakes, and study costs.
            </p>
          </div>
          
          {/* Controls */}
          {showControls && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 border border-hairline bg-white rounded-full max-w-xs focus-within:ring-2 focus-within:ring-primary/20">
                <MagnifyingGlass size={16} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search colleges..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-xs focus:outline-none w-40 text-slate-800"
                />
              </div>
              
              <button 
                onClick={() => setSortByRank(prev => prev === "asc" ? "desc" : "asc")}
                className="px-4 py-2 bg-subtle-gray border border-hairline rounded-full text-xs font-semibold text-slate-600 hover:text-primary flex items-center gap-1.5 transition-colors cursor-pointer select-none"
              >
                <Trophy size={14} className="text-gold" /> 
                Rank: {sortByRank === "asc" ? "Best First" : "Lowest First"}
              </button>
            </div>
          )}
        </div>

        {/* Tab-based Category Selector */}
        {showControls && (
          <div className="flex flex-wrap gap-2 mb-8 border-b border-hairline/60 pb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-subtle-gray text-slate-500 hover:bg-slate-100/60 hover:text-primary border border-hairline"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Main Grid View */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="flex flex-col justify-between min-h-[340px]">
                <div className="mb-6">
                  {/* Top Badges Row */}
                  <div className="flex justify-between items-start gap-4 mb-6">
                    <Skeleton className="w-12 h-12 rounded-xl bg-slate-100" />
                    <div className="flex flex-col items-end gap-1.5">
                      <Skeleton className="w-20 h-5 rounded-full bg-slate-100" />
                      <Skeleton className="w-12 h-4 bg-slate-100" />
                    </div>
                  </div>
                  {/* Title & Location */}
                  <Skeleton className="w-3/4 h-6 mb-2 bg-slate-100" />
                  <Skeleton className="w-1/2 h-4 mb-6 bg-slate-100" />
                  {/* Details block / dead text */}
                  <div className="space-y-2">
                    <Skeleton className="w-full h-3.5 bg-slate-100" />
                    <Skeleton className="w-5/6 h-3.5 bg-slate-100" />
                    <Skeleton className="w-2/3 h-3.5 bg-slate-100" />
                  </div>
                </div>
                <Skeleton className="w-full h-11 bg-slate-100 rounded-full mt-auto" />
              </Card>
            ))}
          </div>
        ) : displayUnis.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-hairline rounded-[2rem] text-slate-400 text-xs font-semibold">
            No universities matching "{selectedCategory}" found under this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayUnis.map((uni) => (
              <Card key={uni.id} className="flex flex-col justify-between min-h-[340px] hover:shadow-lg hover:border-slate-300 transition-all duration-300">
                <div className="mb-6">
                  {/* Top Badges */}
                  <div className="flex justify-between items-start gap-4 mb-4">
                    {uni.logo_url ? (
                      <img 
                        src={uni.logo_url} 
                        alt={uni.name} 
                        className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-hairline p-1"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 font-bold border border-hairline">UNI</div>
                    )}
                    
                    <div className="flex flex-col items-end gap-1.5">
                      {uni.ranking ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/20 text-[10px] font-bold text-slate-700">
                          <Trophy size={10} className="text-gold" weight="fill" />
                          Rank #{uni.ranking}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-400">
                          Rank N/A
                        </span>
                      )}
                      
                      <span className="flex items-center gap-0.5 text-xs text-amber-500 font-bold font-mono-data">
                        <Star size={12} weight="fill" />
                        {Number(uni.rating).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Title & Info */}
                  <div className="cursor-pointer" onClick={() => handleOpenModal(uni)}>
                    <CardTitle className="text-lg hover:text-gold transition-colors flex items-start gap-1 line-clamp-2">
                      {uni.name}
                    </CardTitle>
                    <span className="text-xs font-mono-data text-slate-400 flex items-center gap-1 mt-1.5 mb-4">
                      <MapPin size={12} className="text-slate-400" />
                      {uni.city}, {uni.country}
                    </span>
                    {uni.description && (
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                        {uni.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Metrics */}
                <div className="border-t border-hairline/60 pt-4 mt-auto">
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-xs font-mono-data text-slate-500 mb-6">
                    <span className="flex items-center gap-1.5 truncate"><Clock size={12} /> Intake: {uni.intake || "Sep/Jan"}</span>
                    <span className="flex items-center gap-1.5 truncate"><Calendar size={12} /> Deadline: {uni.application_deadline || "N/A"}</span>
                    <span className="flex items-center gap-1.5 truncate"><BookOpen size={12} /> Cutoff: {uni.cutoff || "IELTS 6.0"}</span>
                    <span className="flex items-center gap-1.5 truncate text-primary font-bold"><Globe size={12} /> Fees: {uni.total_fees || "N/A"}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Link href={`/contact?ref=${encodeURIComponent(uni.name)}`} className="w-full">
                      <Button 
                        onClick={() => handleApplyClick(uni)}
                        variant="gold" 
                        size="sm" 
                        className="w-full text-xs font-bold uppercase tracking-wider py-2"
                      >
                        Apply Now
                      </Button>
                    </Link>
                    <button 
                      onClick={() => handleOpenModal(uni)}
                      className="px-4 py-2 border border-primary/20 hover:border-primary text-primary hover:bg-slate-50 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer select-none text-center"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!showControls && (
          <div className="flex justify-center mt-12">
            <Link href="/study-abroad">
              <Button 
                variant="gold" 
                size="lg" 
                className="text-xs font-bold uppercase tracking-widest px-8 py-4 flex items-center gap-2"
              >
                Explore All Partner Universities
                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        )}

      </div>

      {/* Dynamic Detailed Modal */}
      <AnimatePresence>
        {selectedUni && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-hairline p-1.5 rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-white border border-hairline/40 p-6 md:p-8 rounded-[calc(2rem-0.375rem)] relative">
                <button 
                  onClick={() => setSelectedUni(null)} 
                  className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer z-10"
                >
                  <X size={20} />
                </button>

                {/* Header */}
                <div className="flex gap-4 items-start border-b border-hairline pb-6 mb-6">
                  {selectedUni.logo_url ? (
                    <img 
                      src={selectedUni.logo_url} 
                      alt="" 
                      className="w-16 h-16 rounded-2xl object-contain bg-slate-50 border border-hairline p-1"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-xs text-slate-400 font-bold border border-hairline">UNI</div>
                  )}
                  <div>
                    <h3 className="font-display font-bold text-xl md:text-2xl text-primary leading-tight">
                      {selectedUni.name}
                    </h3>
                    <p className="text-xs font-mono-data text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin size={12} /> {selectedUni.city}, {selectedUni.country}
                    </p>
                  </div>
                </div>

                {/* Grid info metrics */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-50 border border-hairline rounded-xl p-3">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Course Category</span>
                    <span className="text-xs font-semibold text-primary">{selectedUni.category}</span>
                  </div>
                  <div className="bg-slate-50 border border-hairline rounded-xl p-3">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Study Level</span>
                    <span className="text-xs font-semibold text-primary">{selectedUni.course_type}</span>
                  </div>
                  <div className="bg-slate-50 border border-hairline rounded-xl p-3 col-span-2 md:col-span-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">World Ranking</span>
                    <span className="text-xs font-semibold text-primary">
                      {selectedUni.ranking ? `#${selectedUni.ranking} (${selectedUni.ranking_source || "QS"})` : "N/A"}
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-hairline rounded-xl p-3">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Annual Fees</span>
                    <span className="text-xs font-bold text-slate-600">{selectedUni.total_fees || "N/A"}</span>
                  </div>
                  <div className="bg-slate-50 border border-hairline rounded-xl p-3">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Intake Cycles</span>
                    <span className="text-xs font-semibold text-slate-600">{selectedUni.intake || "N/A"}</span>
                  </div>
                  <div className="bg-slate-50 border border-hairline rounded-xl p-3">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Cutoff Requirement</span>
                    <span className="text-xs font-semibold text-slate-600">{selectedUni.cutoff || "N/A"}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">University Profile</span>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                    {selectedUni.description || "No detailed university profile has been configured for this institution yet. Contact our consultants for placement guidelines and course requirements."}
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 border-t border-hairline pt-6 justify-between items-stretch sm:items-center">
                  {selectedUni.website_url ? (
                    <a 
                      href={selectedUni.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-primary flex items-center gap-1 transition-colors self-center py-2"
                    >
                      Visit Official Website <ArrowUpRight size={14} />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-300 py-2">No external website registered</span>
                  )}
                  
                  <div className="flex gap-3">
                    <Link href={`/contact?ref=${encodeURIComponent(selectedUni.name)}`}>
                      <Button 
                        onClick={() => {
                          handleApplyClick(selectedUni);
                          setSelectedUni(null);
                        }}
                        variant="gold" 
                        size="sm" 
                        className="text-xs font-bold uppercase tracking-wider"
                      >
                        Apply Now
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="text-xs font-bold uppercase tracking-wider"
                      >
                        Book Consultation
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
