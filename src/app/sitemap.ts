import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://annex-consultancy.com";
  const now = new Date();

  // Primary Static Routes with specific priorities & change frequencies
  const primaryRoutes: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    { path: "/study-abroad", priority: 0.9, changeFrequency: "daily" },
    { path: "/study-abroad-eligibility", priority: 0.9, changeFrequency: "daily" },
    { path: "/training-placement", priority: 0.9, changeFrequency: "weekly" },
    { path: "/universities", priority: 0.9, changeFrequency: "daily" },
    { path: "/courses", priority: 0.9, changeFrequency: "daily" },
    { path: "/compare", priority: 0.9, changeFrequency: "daily" },
    { path: "/tools", priority: 0.9, changeFrequency: "daily" },
    { path: "/guides", priority: 0.9, changeFrequency: "daily" },
    { path: "/about", priority: 0.8, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.8, changeFrequency: "weekly" },
    { path: "/success-stories", priority: 0.8, changeFrequency: "weekly" },
    { path: "/test-preparation", priority: 0.8, changeFrequency: "weekly" },
    { path: "/faq", priority: 0.8, changeFrequency: "daily" },
    { path: "/resources", priority: 0.8, changeFrequency: "weekly" },
    { path: "/editorial-policy", priority: 0.7, changeFrequency: "monthly" },
    { path: "/referral", priority: 0.8, changeFrequency: "weekly" },
    { path: "/refer", priority: 0.8, changeFrequency: "weekly" },
    { path: "/career-portal", priority: 0.8, changeFrequency: "weekly" },
    { path: "/study-in-india", priority: 0.8, changeFrequency: "weekly" },
    { path: "/blog", priority: 0.8, changeFrequency: "daily" },
    { path: "/privacy-policy", priority: 0.3, changeFrequency: "monthly" },
    { path: "/terms-of-service", priority: 0.3, changeFrequency: "monthly" },
    { path: "/cookie-settings", priority: 0.3, changeFrequency: "monthly" },
  ];

  // Destination Country Routes
  const countrySlugs = ["uk", "australia", "canada", "usa", "germany", "europe", "italy", "dubai"];

  // Programmatic Courses & Countries
  const progCountries = ["canada", "uk", "australia", "usa", "germany", "italy", "dubai"];
  const progCourses = ["mba", "computer-science", "data-science", "nursing", "engineering", "business", "finance", "architecture"];
  
  const progCourseEntries: MetadataRoute.Sitemap = [];
  for (const c of progCountries) {
    for (const crs of progCourses) {
      progCourseEntries.push({
        url: `${baseUrl}/study-in-${c}/${crs}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }
  }

  // Comparisons
  const comparisonSlugs = ["canada-vs-australia", "uk-vs-canada", "germany-vs-italy"];
  const comparisonEntries: MetadataRoute.Sitemap = comparisonSlugs.map((slug) => ({
    url: `${baseUrl}/compare/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Tools
  const toolSlugs = ["tuition-calculator", "ielts-band-calculator", "gpa-converter", "country-comparator"];
  const toolEntries: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Guides
  const guideSlugs = ["study-abroad-guide", "student-visa-guide"];
  const guideEntries: MetadataRoute.Sitemap = guideSlugs.map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // University Detail Slugs
  const uniSlugs = ["university-of-westminster", "macquarie-university", "university-of-toronto", "tum-germany"];
  const uniEntries: MetadataRoute.Sitemap = uniSlugs.map((slug) => ({
    url: `${baseUrl}/universities/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Course Detail Hub Slugs
  const courseHubSlugs = ["mba-abroad", "computer-science-abroad", "data-science-abroad"];
  const courseHubEntries: MetadataRoute.Sitemap = courseHubSlugs.map((slug) => ({
    url: `${baseUrl}/courses/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Local SEO Cities
  const citySlugs = ["kolkata", "howrah", "siliguri", "patna", "bhubaneswar", "guwahati"];
  const cityEntries: MetadataRoute.Sitemap = citySlugs.map((city) => ({
    url: `${baseUrl}/study-abroad-consultant-${city}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Test Preparation Course Routes
  const testPrepCourses = ["ielts", "pte", "cmat", "computer-courses"];

  const primaryEntries: MetadataRoute.Sitemap = primaryRoutes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const countryEntries: MetadataRoute.Sitemap = countrySlugs.map((slug) => ({
    url: `${baseUrl}/study-abroad/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const testPrepEntries: MetadataRoute.Sitemap = testPrepCourses.map((course) => ({
    url: `${baseUrl}/test-preparation/${course}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic Supabase Entries
  let dbUniEntries: MetadataRoute.Sitemap = [];
  let dbBlogEntries: MetadataRoute.Sitemap = [];

  try {
    const { data: unis } = await supabase
      .from("universities")
      .select("slug, country, updated_at, created_at")
      .eq("published", true);

    if (unis && unis.length > 0) {
      dbUniEntries = unis.map((u: any) => ({
        url: `${baseUrl}/universities/${u.slug}`,
        lastModified: u.updated_at ? new Date(u.updated_at) : u.created_at ? new Date(u.created_at) : now,
        changeFrequency: "weekly",
        priority: 0.9,
      }));
    }
  } catch (err) {
    console.error("Sitemap DB University query fallback:", err);
  }

  try {
    const { data: blogs } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, created_at")
      .eq("published", true);

    if (blogs && blogs.length > 0) {
      dbBlogEntries = blogs.map((b: any) => ({
        url: `${baseUrl}/blog/${b.slug}`,
        lastModified: b.updated_at ? new Date(b.updated_at) : b.created_at ? new Date(b.created_at) : now,
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error("Sitemap DB Blog query fallback:", err);
  }

  // Deduplicate entries
  const allEntries = [
    ...primaryEntries,
    ...countryEntries,
    ...progCourseEntries,
    ...comparisonEntries,
    ...toolEntries,
    ...guideEntries,
    ...uniEntries,
    ...courseHubEntries,
    ...cityEntries,
    ...testPrepEntries,
    ...dbUniEntries,
    ...dbBlogEntries,
  ];

  const uniqueMap = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of allEntries) {
    if (!uniqueMap.has(entry.url)) {
      uniqueMap.set(entry.url, entry);
    }
  }

  return Array.from(uniqueMap.values());
}
