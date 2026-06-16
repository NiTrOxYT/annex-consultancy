"use client";

import * as React from "react";
import { 
  Sparkle, ShieldCheck, SignOut, Trash, Plus, FileText, 
  Calendar, Users, Eye, CheckCircle, XCircle, ChartBar, 
  Download, MagnifyingGlass, Funnel, ArrowSquareOut, Globe, 
  Warning, Check, X, SpinnerGap, GraduationCap, Star, Copy
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  study_level: string;
  destination: string;
  notes: string;
  status: string;
  created_at: string;
}

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

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  category: string; // Blog category
  tags: string;
  author: string;
  published: boolean;
  published_date: string | null;
  created_at: string;
}

interface SuccessStory {
  id: string;
  name: string;
  destination: string;
  university: string;
  course: string;
  quote: string;
  year: number;
  student_photo_url: string;
  success_metrics: string;
  published: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [authError, setAuthError] = React.useState("");
  const [checkingAuth, setCheckingAuth] = React.useState(true);
  
  // Dashboard Tabs
  const [activeTab, setActiveTab] = React.useState<"bookings" | "universities" | "blog" | "stories">("bookings");

  // Loaders & table existence flags
  const [loading, setLoading] = React.useState(false);
  const [uniTableExists, setUniTableExists] = React.useState<boolean | null>(null);
  const [postsTableExists, setPostsTableExists] = React.useState<boolean | null>(null);
  const [storiesTableExists, setStoriesTableExists] = React.useState<boolean | null>(null);

  // Booking states
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = React.useState(false);
  
  // Search & Filter states for Bookings
  const [searchQuery, setSearchQuery] = React.useState("");
  const [destinationFilter, setDestinationFilter] = React.useState("All");
  const [statusFilter, setStatusFilter] = React.useState("All");

  // Toast Notification State
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // University Tab states
  const [universities, setUniversities] = React.useState<University[]>([]);
  const [isUniModalOpen, setIsUniModalOpen] = React.useState(false);
  const [editingUni, setEditingUni] = React.useState<University | null>(null);
  const [uniSearch, setUniSearch] = React.useState("");
  const [uniCountryFilter, setUniCountryFilter] = React.useState("All");
  const [uniCategoryFilter, setUniCategoryFilter] = React.useState("All");
  const [uniPublishedFilter, setUniPublishedFilter] = React.useState("All");
  const [uniSortBy, setUniSortBy] = React.useState<"ranking_asc" | "ranking_desc" | "newest">("ranking_asc");
  const [uniPage, setUniPage] = React.useState(1);
  const uniPerPage = 10;
  const [uniForm, setUniForm] = React.useState({
    name: "",
    slug: "",
    logo_url: "",
    country: "",
    city: "",
    category: "Engineering",
    course_type: "Undergraduate",
    ranking: "",
    ranking_source: "",
    rating: "4.5",
    total_fees: "",
    application_deadline: "",
    intake: "",
    cutoff: "",
    website_url: "",
    description: "",
    featured: false,
    published: true
  });

  // Blog CMS Tab states
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [isPostModalOpen, setIsPostModalOpen] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<Post | null>(null);
  const [blogSearch, setBlogSearch] = React.useState("");
  const [blogCategoryFilter, setBlogCategoryFilter] = React.useState("All");
  const [postModalTab, setPostModalTab] = React.useState<"edit" | "preview">("edit");
  const [postForm, setPostForm] = React.useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image_url: "",
    category: "University Guide",
    tags: "",
    author: "Annex Team",
    published: false
  });

  // Success Stories CMS Tab states
  const [stories, setStories] = React.useState<SuccessStory[]>([]);
  const [isStoryModalOpen, setIsStoryModalOpen] = React.useState(false);
  const [editingStory, setEditingStory] = React.useState<SuccessStory | null>(null);
  const [storySearch, setStorySearch] = React.useState("");
  const [storyCountryFilter, setStoryCountryFilter] = React.useState("All");
  const [storyForm, setStoryForm] = React.useState({
    name: "",
    destination: "",
    university: "",
    course: "",
    quote: "",
    year: new Date().getFullYear().toString(),
    student_photo_url: "",
    success_metrics: "",
    published: false
  });

  // Check auth persistence on mount
  React.useEffect(() => {
    try {
      const persisted = sessionStorage.getItem("annex_admin_authenticated");
      if (persisted === "true") {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Auth state loading error:", e);
    } finally {
      setCheckingAuth(false);
    }
  }, []);

  // Auto-logout after 10 minutes of inactivity
  React.useEffect(() => {
    if (!isAuthenticated) return;

    let inactivityTimer: NodeJS.Timeout;
    const TIMEOUT_DURATION = 10 * 60 * 1000; // 10 minutes

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        handleSignOut();
        alert("You have been logged out automatically due to 10 minutes of inactivity.");
      }, TIMEOUT_DURATION);
    };

    const activityEvents = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    activityEvents.forEach(event => {
      window.addEventListener(event, resetInactivityTimer);
    });

    resetInactivityTimer();

    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [isAuthenticated]);

  // Auth Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const secretKey = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (!secretKey) {
      setAuthError("Admin credentials are not configured on the server environment.");
      return;
    }
    if (password === secretKey) {
      setIsAuthenticated(true);
      setAuthError("");
      try {
        sessionStorage.setItem("annex_admin_authenticated", "true");
      } catch (e) {
        console.error("Auth persistence failed:", e);
      }
    } else {
      setAuthError("Invalid admin access key.");
    }
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setPassword("");
    try {
      sessionStorage.removeItem("annex_admin_authenticated");
    } catch (e) {
      console.error("Sign out storage error:", e);
    }
  };

  // Fetch Database tables
  const fetchAllData = React.useCallback(async () => {
    setLoading(true);
    
    // 1. Fetch Bookings
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setBookings(data || []);
    } catch (err: any) {
      console.error("Error loading bookings:", err.message);
    }

    // 2. Fetch Universities
    try {
      const { data, error } = await supabase
        .from("universities")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        if (error.code === "42P01" || error.message.includes("does not exist")) {
          setUniTableExists(false);
        } else {
          throw error;
        }
      } else {
        setUniversities(data || []);
        setUniTableExists(true);
      }
    } catch (err: any) {
      console.error("Error loading universities:", err.message);
    }

    // 3. Fetch Blog Posts
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        if (error.code === "42P01" || error.message.includes("does not exist")) {
          setPostsTableExists(false);
        } else {
          throw error;
        }
      } else {
        setPosts(data || []);
        setPostsTableExists(true);
      }
    } catch (err: any) {
      console.error("Error loading blog posts:", err.message);
    }

    // 4. Fetch Success Stories
    try {
      const { data, error } = await supabase
        .from("success_stories")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        if (error.code === "42P01" || error.message.includes("does not exist")) {
          setStoriesTableExists(false);
        } else {
          throw error;
        }
      } else {
        setStories(data || []);
        setStoriesTableExists(true);
      }
    } catch (err: any) {
      console.error("Error loading success stories:", err.message);
    }

    setLoading(false);
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, fetchAllData]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // ----------------------------------------------------
  // BOOKINGS LOGIC
  // ----------------------------------------------------
  const updateBookingStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
      showToast(`Booking marked as ${newStatus}`);
      fetchAllData();
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      const { error } = await supabase.from("bookings").delete().eq("id", id);
      if (error) throw error;
      showToast("Consultation booking deleted");
      fetchAllData();
    } catch (err: any) {
      alert("Error deleting record: " + err.message);
    }
  };

  // ----------------------------------------------------
  // UNIVERSITIES CRUD
  // ----------------------------------------------------
  const handleSaveUni = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const generatedSlug = uniForm.slug || uniForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const rankingVal = uniForm.ranking ? parseInt(uniForm.ranking) : null;
      const ratingVal = uniForm.rating ? parseFloat(uniForm.rating) : 4.5;

      const payload = {
        name: uniForm.name,
        slug: generatedSlug,
        logo_url: uniForm.logo_url || null,
        country: uniForm.country,
        city: uniForm.city,
        category: uniForm.category,
        course_type: uniForm.course_type,
        ranking: rankingVal,
        ranking_source: uniForm.ranking_source || null,
        rating: ratingVal,
        total_fees: uniForm.total_fees || null,
        application_deadline: uniForm.application_deadline || null,
        intake: uniForm.intake || null,
        cutoff: uniForm.cutoff || null,
        website_url: uniForm.website_url || null,
        description: uniForm.description || null,
        featured: uniForm.featured,
        published: uniForm.published
      };

      if (editingUni) {
        const { error } = await supabase
          .from("universities")
          .update(payload)
          .eq("id", editingUni.id);
        
        if (error) throw error;
        showToast("University updated successfully");
      } else {
        const { error } = await supabase
          .from("universities")
          .insert([payload]);
        
        if (error) throw error;
        showToast("University added successfully");
      }
      setIsUniModalOpen(false);
      setEditingUni(null);
      fetchAllData();
    } catch (err: any) {
      alert("Error saving university: " + err.message);
    }
  };

  const toggleFeaturedUni = async (id: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from("universities")
        .update({ featured: !currentFeatured })
        .eq("id", id);
      if (error) throw error;
      showToast(`University marked as ${!currentFeatured ? "Featured" : "Regular"}`);
      fetchAllData();
    } catch (err: any) {
      alert("Error updating featured status: " + err.message);
    }
  };

  const togglePublishedUni = async (id: string, currentPublished: boolean) => {
    try {
      const { error } = await supabase
        .from("universities")
        .update({ published: !currentPublished })
        .eq("id", id);
      if (error) throw error;
      showToast(`University status marked as ${!currentPublished ? "Published" : "Draft"}`);
      fetchAllData();
    } catch (err: any) {
      alert("Error updating published status: " + err.message);
    }
  };

  const handleDuplicateUni = async (uni: University) => {
    try {
      const duplicatedName = `${uni.name} - Copy`;
      const duplicatedSlug = `${uni.slug}-copy-${Math.floor(Math.random() * 1000)}`;
      
      const payload = {
        name: duplicatedName,
        slug: duplicatedSlug,
        logo_url: uni.logo_url || null,
        country: uni.country,
        city: uni.city,
        category: uni.category,
        course_type: uni.course_type,
        ranking: uni.ranking,
        ranking_source: uni.ranking_source || null,
        rating: uni.rating,
        total_fees: uni.total_fees || null,
        application_deadline: uni.application_deadline || null,
        intake: uni.intake || null,
        cutoff: uni.cutoff || null,
        website_url: uni.website_url || null,
        description: uni.description || null,
        featured: uni.featured,
        published: false // Duplicate starts as draft/unpublished
      };

      const { error } = await supabase
        .from("universities")
        .insert([payload]);
      
      if (error) throw error;
      showToast(`Duplicated "${uni.name}" as draft`);
      fetchAllData();
    } catch (err: any) {
      alert("Error duplicating university: " + err.message);
    }
  };

  const handleDeleteUni = async (id: string) => {
    if (!confirm("Are you sure you want to delete this university?")) return;
    try {
      const { error } = await supabase.from("universities").delete().eq("id", id);
      if (error) throw error;
      showToast("University deleted successfully");
      fetchAllData();
    } catch (err: any) {
      alert("Error deleting university: " + err.message);
    }
  };

  // ----------------------------------------------------
  // BLOG CMS CRUD
  // ----------------------------------------------------
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const publishedDate = postForm.published ? new Date().toISOString() : null;

      if (editingPost) {
        const { error } = await supabase
          .from("posts")
          .update({
            title: postForm.title,
            slug: postForm.slug,
            excerpt: postForm.excerpt,
            content: postForm.content,
            featured_image_url: postForm.featured_image_url,
            category: postForm.category,
            tags: postForm.tags,
            author: postForm.author,
            published: postForm.published,
            published_date: publishedDate
          })
          .eq("id", editingPost.id);
        
        if (error) throw error;
        showToast("Article updated successfully");
      } else {
        const { error } = await supabase
          .from("posts")
          .insert([{
            title: postForm.title,
            slug: postForm.slug,
            excerpt: postForm.excerpt,
            content: postForm.content,
            featured_image_url: postForm.featured_image_url,
            category: postForm.category,
            tags: postForm.tags,
            author: postForm.author,
            published: postForm.published,
            published_date: publishedDate
          }]);
        
        if (error) throw error;
        showToast("Article created successfully");
      }
      setIsPostModalOpen(false);
      setEditingPost(null);
      fetchAllData();
    } catch (err: any) {
      alert("Error saving article: " + err.message);
    }
  };

  const togglePublishPost = async (id: string, currentPublished: boolean) => {
    try {
      const publishedDate = !currentPublished ? new Date().toISOString() : null;
      const { error } = await supabase
        .from("posts")
        .update({ published: !currentPublished, published_date: publishedDate })
        .eq("id", id);
      if (error) throw error;
      showToast(`Article marked as ${!currentPublished ? "Published" : "Draft"}`);
      fetchAllData();
    } catch (err: any) {
      alert("Error updating published status: " + err.message);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
      showToast("Article deleted successfully");
      fetchAllData();
    } catch (err: any) {
      alert("Error deleting article: " + err.message);
    }
  };

  // ----------------------------------------------------
  // SUCCESS STORIES CRUD
  // ----------------------------------------------------
  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStory) {
        const { error } = await supabase
          .from("success_stories")
          .update({
            name: storyForm.name,
            destination: storyForm.destination,
            university: storyForm.university,
            course: storyForm.course,
            quote: storyForm.quote,
            year: parseInt(storyForm.year) || new Date().getFullYear(),
            student_photo_url: storyForm.student_photo_url,
            success_metrics: storyForm.success_metrics,
            published: storyForm.published
          })
          .eq("id", editingStory.id);
        
        if (error) throw error;
        showToast("Success story updated successfully");
      } else {
        const { error } = await supabase
          .from("success_stories")
          .insert([{
            name: storyForm.name,
            destination: storyForm.destination,
            university: storyForm.university,
            course: storyForm.course,
            quote: storyForm.quote,
            year: parseInt(storyForm.year) || new Date().getFullYear(),
            student_photo_url: storyForm.student_photo_url,
            success_metrics: storyForm.success_metrics,
            published: storyForm.published
          }]);
        
        if (error) throw error;
        showToast("Success story created successfully");
      }
      setIsStoryModalOpen(false);
      setEditingStory(null);
      fetchAllData();
    } catch (err: any) {
      alert("Error saving story: " + err.message);
    }
  };

  const togglePublishStory = async (id: string, currentPublished: boolean) => {
    try {
      const { error } = await supabase
        .from("success_stories")
        .update({ published: !currentPublished })
        .eq("id", id);
      if (error) throw error;
      showToast(`Success story marked as ${!currentPublished ? "Published" : "Draft"}`);
      fetchAllData();
    } catch (err: any) {
      alert("Error updating published status: " + err.message);
    }
  };

  const handleDeleteStory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this success story?")) return;
    try {
      const { error } = await supabase.from("success_stories").delete().eq("id", id);
      if (error) throw error;
      showToast("Success story deleted successfully");
      fetchAllData();
    } catch (err: any) {
      alert("Error deleting story: " + err.message);
    }
  };

  // ----------------------------------------------------
  // DYNAMIC STATISTICS & ANALYTICS CALCULATIONS
  // ----------------------------------------------------
  const totalRequests = bookings.length;
  const today = new Date();
  const bookingsToday = bookings.filter(b => {
    if (!b.created_at) return false;
    const bDate = new Date(b.created_at);
    return bDate.getDate() === today.getDate() &&
           bDate.getMonth() === today.getMonth() &&
           bDate.getFullYear() === today.getFullYear();
  }).length;

  const publishedPostsCount = posts.filter(p => p.published).length;
  const publishedStoriesCount = stories.filter(s => s.published).length;

  const getMostSelected = (arr: string[]) => {
    if (arr.length === 0) return "N/A";
    const map: Record<string, number> = {};
    let maxElement = arr[0], maxCount = 1;
    for (let i = 0; i < arr.length; i++) {
      const el = arr[i];
      if (map[el] == null) map[el] = 1;
      else map[el]++;
      if (map[el] > maxCount) {
        maxElement = el;
        maxCount = map[el];
      }
    }
    return `${maxElement} (${maxCount})`;
  };

  const mostSelectedDestination = getMostSelected(bookings.map(b => b.destination));
  const mostSelectedStudyLevel = getMostSelected(bookings.map(b => b.study_level));

  // ----------------------------------------------------
  // FILTERING LOGIC
  // ----------------------------------------------------
  // Bookings filter
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDestination = destinationFilter === "All" || b.destination === destinationFilter;
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    
    return matchesSearch && matchesDestination && matchesStatus;
  });

  // Universities filter, sort & pagination
  const filteredUnis = React.useMemo(() => {
    return universities
      .filter(u => {
        const matchesSearch = 
          u.name.toLowerCase().includes(uniSearch.toLowerCase()) ||
          u.city.toLowerCase().includes(uniSearch.toLowerCase()) ||
          u.country.toLowerCase().includes(uniSearch.toLowerCase());
        
        const matchesCountry = uniCountryFilter === "All" || u.country === uniCountryFilter;
        const matchesCategory = uniCategoryFilter === "All" || u.category === uniCategoryFilter;
        
        const matchesPublished = 
          uniPublishedFilter === "All" 
            ? true 
            : uniPublishedFilter === "Published" 
            ? u.published === true 
            : u.published === false;
            
        return matchesSearch && matchesCountry && matchesCategory && matchesPublished;
      })
      .sort((a, b) => {
        if (uniSortBy === "newest") {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        
        const rankA = a.ranking === null || a.ranking === undefined ? Infinity : a.ranking;
        const rankB = b.ranking === null || b.ranking === undefined ? Infinity : b.ranking;
        
        if (uniSortBy === "ranking_asc") {
          return rankA - rankB;
        } else {
          if (rankA === Infinity) return 1;
          if (rankB === Infinity) return -1;
          return rankB - rankA;
        }
      });
  }, [universities, uniSearch, uniCountryFilter, uniCategoryFilter, uniPublishedFilter, uniSortBy]);
  
  React.useEffect(() => {
    setUniPage(1);
  }, [uniSearch, uniCountryFilter, uniCategoryFilter, uniPublishedFilter, uniSortBy]);

  const totalUniPages = Math.ceil(filteredUnis.length / uniPerPage) || 1;
  const paginatedUnis = filteredUnis.slice((uniPage - 1) * uniPerPage, uniPage * uniPerPage);
  const uniqueCountries = Array.from(new Set(universities.map(u => u.country)));
  const uniqueCategories = Array.from(new Set(universities.map(u => u.category)));

  // Blog posts filter
  const filteredPosts = posts.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(blogSearch.toLowerCase()) ||
      p.tags.toLowerCase().includes(blogSearch.toLowerCase());

    const matchesCategory = blogCategoryFilter === "All" || p.category === blogCategoryFilter;

    return matchesSearch && matchesCategory;
  });
  const uniqueBlogCategories = Array.from(new Set(posts.map(p => p.category)));

  // Success Stories filter
  const filteredStories = stories.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(storySearch.toLowerCase()) ||
      s.university.toLowerCase().includes(storySearch.toLowerCase()) ||
      s.course.toLowerCase().includes(storySearch.toLowerCase());

    const matchesCountry = storyCountryFilter === "All" || s.destination === storyCountryFilter;

    return matchesSearch && matchesCountry;
  });
  const uniqueStoryCountries = Array.from(new Set(stories.map(s => s.destination)));

  // Combined Recent Activity Feed (Unified bookings, blog posts, success stories)
  const combinedActivity = React.useMemo(() => {
    const actBookings = bookings.map(b => ({
      id: b.id,
      type: "Booking",
      title: b.name,
      meta: `Booked for ${b.destination}`,
      date: b.created_at
    }));

    const actPosts = posts.map(p => ({
      id: p.id,
      type: "Blog",
      title: p.title,
      meta: `Article created by ${p.author}`,
      date: p.created_at
    }));

    const actStories = stories.map(s => ({
      id: s.id,
      type: "Success",
      title: s.name,
      meta: `Placed at ${s.university} (${s.destination})`,
      date: s.created_at
    }));

    return [...actBookings, ...actPosts, ...actStories]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [bookings, posts, stories]);

  // Export CSV Helper
  const exportToCSV = () => {
    if (filteredBookings.length === 0) return;
    const headers = ["ID", "Name", "Email", "Phone", "Preferred Date", "Preferred Time", "Study Level", "Destination", "Notes", "Status", "Created At"];
    const rows = filteredBookings.map(b => [
      b.id,
      `"${b.name.replace(/"/g, '""')}"`,
      `"${b.email.replace(/"/g, '""')}"`,
      `"${b.phone.replace(/"/g, '""')}"`,
      b.preferred_date,
      b.preferred_time,
      `"${b.study_level.replace(/"/g, '""')}"`,
      `"${b.destination.replace(/"/g, '""')}"`,
      `"${(b.notes || "").replace(/"/g, '""')}"`,
      b.status,
      b.created_at
    ]);
    
    const csvString = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `annex_consultations_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("CSV file exported successfully");
  };

  if (checkingAuth) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center bg-subtle-gray/30">
        <div className="flex flex-col items-center gap-2">
          <SpinnerGap className="animate-spin text-primary" size={32} />
          <span className="text-xs font-semibold text-slate-500 font-mono-data">Loading security settings...</span>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center bg-subtle-gray/30 px-6 py-12">
        <Card className="max-w-md w-full p-8 bg-white">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-4">
              <ShieldCheck size={24} weight="bold" />
            </div>
            <CardTitle className="text-xl">Annex Admin Portal</CardTitle>
            <CardDescription className="mt-1">Enter your admin access credentials below.</CardDescription>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {authError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-xs font-semibold text-red-600">
                {authError}
              </div>
            )}
            <div className="flex flex-col gap-2 text-left">
              <label htmlFor="pass" className="text-xs font-bold text-primary uppercase tracking-wider">Access Key</label>
              <input
                type="password"
                id="pass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-3 border border-hairline rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white"
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" variant="primary" className="w-full mt-2">
              Verify Key
            </Button>
          </form>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-white text-left flex flex-col relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-primary text-white border border-hairline/20 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in-up">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-gold">
            <Check size={14} weight="bold" />
          </div>
          <div className="text-xs font-semibold">{toastMessage}</div>
          <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white ml-2 cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Admin Navbar */}
      <header className="border-b border-hairline px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white sticky top-0 z-30 shadow-[0_1px_3px_rgba(15,23,42,0.02)]">
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck size={24} className="text-primary" weight="fill" />
            <span className="font-display font-bold text-lg text-primary tracking-tight">ANNEX ADMIN</span>
          </div>
          
          <nav className="flex gap-1 sm:gap-2">
            {[
              { id: "bookings", label: `Consultations (${bookings.length})` },
              { id: "universities", label: `Universities (${universities.length})` },
              { id: "blog", label: `Blog posts (${posts.length})` },
              { id: "stories", label: `Success stories (${stories.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
                  activeTab === tab.id ? "bg-primary text-white" : "text-slate-500 hover:text-primary hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <button onClick={handleSignOut} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-primary transition-colors cursor-pointer">
          <SignOut size={16} /> Sign Out
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {activeTab === "bookings" && (
          <section className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-2xl text-primary leading-tight">Admin dashboard.</h2>
                <p className="text-xs text-slate-400 mt-1">Overview of booking requests and published CMS content.</p>
              </div>
              <Button variant="secondary" size="sm" onClick={fetchAllData} className="flex items-center gap-1.5">
                <SpinnerGap className={loading ? "animate-spin" : ""} size={14} /> Refresh Data
              </Button>
            </div>

            {/* Dashboard Overview grid */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              {[
                { label: "Total Bookings", value: totalRequests, icon: <Users size={18} className="text-primary" weight="bold" />, bg: "bg-slate-50 border-slate-100" },
                { label: "New Bookings Today", value: bookingsToday, icon: <Calendar size={18} className="text-yellow-600" weight="bold" />, bg: "bg-yellow-50/20 border-yellow-100/60" },
                { label: "Total Blog Posts", value: posts.length, icon: <FileText size={18} className="text-blue-600" weight="bold" />, bg: "bg-blue-50/20 border-blue-100/60" },
                { label: "Published Blogs", value: publishedPostsCount, icon: <CheckCircle size={18} className="text-green-600" weight="bold" />, bg: "bg-green-50/20 border-green-100/60" },
                { label: "Total Stories", value: stories.length, icon: <GraduationCap size={18} className="text-purple-600" weight="bold" />, bg: "bg-purple-50/20 border-purple-100/60" },
                { label: "Published Stories", value: publishedStoriesCount, icon: <Sparkle size={18} className="text-gold" weight="bold" />, bg: "bg-amber-50/20 border-amber-100/60" }
              ].map((stat, idx) => (
                <div key={idx} className={`border rounded-2xl p-4 flex flex-col justify-between min-h-[90px] ${stat.bg}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{stat.label}</span>
                    {stat.icon}
                  </div>
                  <span className="text-2xl font-bold font-mono-data text-primary mt-2">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Sub-panels (Quick Actions / Analytics Insights) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Quick Actions Column */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <Card className="h-full">
                  <CardTitle className="text-sm uppercase tracking-wider text-slate-400 mb-4">Quick Access Links</CardTitle>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <a 
                      href="https://analytics.google.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-4 border border-hairline hover:border-primary rounded-xl bg-slate-50 hover:bg-slate-100/30 transition-all text-center gap-2 group"
                    >
                      <ChartBar size={20} className="text-primary group-hover:scale-105 transition-transform" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Google Analytics</span>
                    </a>
                    
                    <a 
                      href="https://clarity.microsoft.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-4 border border-hairline hover:border-primary rounded-xl bg-slate-50 hover:bg-slate-100/30 transition-all text-center gap-2 group"
                    >
                      <Eye size={20} className="text-primary group-hover:scale-105 transition-transform" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Microsoft Clarity</span>
                    </a>

                    <a 
                      href="https://supabase.com/dashboard" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-4 border border-hairline hover:border-primary rounded-xl bg-slate-50 hover:bg-slate-100/30 transition-all text-center gap-2 group"
                    >
                      <Globe size={20} className="text-primary group-hover:scale-105 transition-transform" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Supabase DB</span>
                    </a>
                  </div>
                </Card>
              </div>

              {/* Analytics Insights */}
              <div className="lg:col-span-7">
                <Card className="h-full">
                  <CardTitle className="text-sm uppercase tracking-wider text-slate-400 mb-4">Booking Insights</CardTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-hairline rounded-xl p-4 flex flex-col justify-between">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Most Selected Destination</span>
                      <span className="text-sm font-semibold text-primary mt-1">{mostSelectedDestination}</span>
                    </div>
                    <div className="bg-slate-50 border border-hairline rounded-xl p-4 flex flex-col justify-between">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Most Selected Study Level</span>
                      <span className="text-sm font-semibold text-primary mt-1">{mostSelectedStudyLevel}</span>
                    </div>
                  </div>
                </Card>
              </div>

            </div>

            {/* Main Area: Bookings list & timeline Activity feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Consultation Requests list */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-slate-50 border border-hairline p-4 rounded-2xl">
                  <div className="flex flex-grow max-w-md items-center gap-2.5 px-3 py-2 border border-hairline rounded-xl bg-white focus-within:ring-2 focus-within:ring-primary/20">
                    <MagnifyingGlass size={16} className="text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search bookings..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-xs w-full focus:outline-none text-slate-800 bg-transparent"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <select 
                      value={destinationFilter} 
                      onChange={(e) => setDestinationFilter(e.target.value)}
                      className="px-3 py-1.5 border border-hairline bg-white rounded-xl text-xs text-slate-600 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Destinations</option>
                      <option value="UK">UK</option>
                      <option value="Australia">Australia</option>
                      <option value="Europe">Europe</option>
                      <option value="Dubai">Dubai</option>
                      <option value="Italy">Italy</option>
                      <option value="India">India</option>
                    </select>

                    <select 
                      value={statusFilter} 
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-1.5 border border-hairline bg-white rounded-xl text-xs text-slate-600 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <Button onClick={exportToCSV} variant="secondary" size="sm" className="flex items-center gap-1">
                      <Download size={14} /> Export CSV
                    </Button>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-12 text-slate-400 text-xs font-semibold">Loading data...</div>
                ) : filteredBookings.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-hairline rounded-2xl text-slate-400 text-xs font-semibold">
                    No matching consultation bookings found.
                  </div>
                ) : (
                  <div className="border border-hairline rounded-2xl overflow-x-auto bg-white">
                    <table className="w-full text-left border-collapse text-xs min-w-[700px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-hairline text-slate-500 font-bold uppercase tracking-wider">
                          <th className="p-4">Student</th>
                          <th className="p-4">Destination</th>
                          <th className="p-4">Preferred Date/Time</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hairline">
                        {filteredBookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-subtle-gray/30">
                            <td className="p-4 font-semibold text-primary">
                              {booking.name}<br />
                              <span className="text-[10px] text-slate-400 font-normal">{booking.email} | {booking.phone}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-mono-data text-gold font-bold">{booking.destination}</span> &middot; {booking.study_level}
                            </td>
                            <td className="p-4 font-mono-data">
                              {booking.preferred_date} @ {booking.preferred_time}
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                booking.status === "Confirmed"
                                  ? "bg-green-50 text-green-600 border border-green-100"
                                  : booking.status === "Cancelled"
                                  ? "bg-red-50 text-red-600 border border-red-100"
                                  : "bg-yellow-50 text-yellow-600 border border-yellow-100"
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="p-4 text-right flex justify-end gap-2 items-center">
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setIsNotesModalOpen(true);
                                }}
                                className="p-1 text-slate-500 hover:text-primary hover:bg-slate-50 rounded transition-colors cursor-pointer"
                                title="View details"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => updateBookingStatus(booking.id, "Confirmed")}
                                className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors cursor-pointer"
                                title="Confirm Booking"
                                disabled={booking.status === "Confirmed"}
                              >
                                <CheckCircle size={16} weight="fill" />
                              </button>
                              <button
                                onClick={() => updateBookingStatus(booking.id, "Cancelled")}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                title="Cancel Booking"
                                disabled={booking.status === "Cancelled"}
                              >
                                <XCircle size={16} weight="fill" />
                              </button>
                              <button
                                onClick={() => deleteBooking(booking.id)}
                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Unified Recent Activity Feed */}
              <div className="lg:col-span-4">
                <Card className="h-full">
                  <CardTitle className="text-sm uppercase tracking-wider text-slate-400 mb-6">Recent Activity Feed</CardTitle>
                  <div className="flex flex-col gap-4">
                    {combinedActivity.map((act) => (
                      <div key={act.id} className="flex gap-3 items-start border-b border-hairline/60 pb-3 last:border-0 last:pb-0">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          act.type === "Booking" ? "bg-primary" : act.type === "Blog" ? "bg-blue-500" : "bg-purple-500"
                        }`} />
                        <div className="flex-grow min-w-0">
                          <p className="text-xs font-semibold text-primary truncate" title={act.title}>{act.title}</p>
                          <p className="text-[10px] text-slate-400">
                            {act.meta} &bull; {new Date(act.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase shrink-0 ${
                          act.type === "Booking" ? "bg-slate-100 text-slate-600" : act.type === "Blog" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                        }`}>
                          {act.type}
                        </span>
                      </div>
                    ))}
                    {combinedActivity.length === 0 && (
                      <div className="text-slate-400 text-xs py-4 text-center">No recent actions logged.</div>
                    )}
                  </div>
                </Card>
              </div>

            </div>
          </section>
        )}

        {activeTab === "universities" && (
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-2xl text-primary">University Management</h2>
                <p className="text-xs text-slate-400 mt-1">Coordinate placement details and country tags.</p>
              </div>
              {uniTableExists && (
                <Button 
                  onClick={() => {
                    setEditingUni(null);
                    setUniForm({
                      name: "",
                      slug: "",
                      logo_url: "",
                      country: "",
                      city: "",
                      category: "Engineering",
                      course_type: "Undergraduate",
                      ranking: "",
                      ranking_source: "",
                      rating: "4.5",
                      total_fees: "",
                      application_deadline: "",
                      intake: "",
                      cutoff: "",
                      website_url: "",
                      description: "",
                      featured: false,
                      published: true
                    });
                    setIsUniModalOpen(true);
                  }} 
                  variant="primary" 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <Plus size={14} /> Add University
                </Button>
              )}
            </div>

            {loading && universities.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs font-semibold">Loading universities...</div>
            ) : uniTableExists === false ? (
              <Card outerClassName="border-amber-200" className="bg-amber-50/10">
                <div className="flex items-center gap-2 mb-4">
                  <Warning size={18} className="text-amber-600" weight="fill" />
                  <CardTitle className="text-sm uppercase text-amber-800 tracking-wider">Universities Table Missing</CardTitle>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mb-2">
                  The database relation <strong>public.universities</strong> is missing or misaligned. Please execute the SQL scripts in your Supabase console to seed the table structures properly.
                </p>
              </Card>
            ) : (
              <>
                {/* Metrics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Total Universities", value: universities.length, icon: <GraduationCap size={18} className="text-primary" weight="bold" />, bg: "bg-slate-50 border-slate-100" },
                    { label: "Published Universities", value: universities.filter(u => u.published).length, icon: <CheckCircle size={18} className="text-green-600" weight="bold" />, bg: "bg-green-50/20 border-green-100/60" },
                    { label: "Draft Universities", value: universities.filter(u => !u.published).length, icon: <FileText size={18} className="text-slate-400" weight="bold" />, bg: "bg-slate-50 border-slate-100" },
                    { label: "Featured Universities", value: universities.filter(u => u.featured).length, icon: <Star size={18} className="text-amber-500" weight="fill" />, bg: "bg-amber-50/20 border-amber-100/60" }
                  ].map((stat, idx) => (
                    <div key={idx} className={`border rounded-2xl p-4 flex flex-col justify-between min-h-[90px] ${stat.bg}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{stat.label}</span>
                        {stat.icon}
                      </div>
                      <span className="text-2xl font-bold font-mono-data text-primary mt-2">{stat.value}</span>
                    </div>
                  ))}
                </div>

                {/* Filters Row */}
                <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center bg-slate-50 border border-hairline p-4 rounded-2xl">
                  <div className="flex flex-grow max-w-md items-center gap-2.5 px-3 py-2 border border-hairline rounded-xl bg-white focus-within:ring-2 focus-within:ring-primary/20">
                    <MagnifyingGlass size={16} className="text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search universities..." 
                      value={uniSearch}
                      onChange={(e) => setUniSearch(e.target.value)}
                      className="text-xs w-full focus:outline-none text-slate-800 bg-transparent"
                    />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <select 
                      value={uniCountryFilter} 
                      onChange={(e) => setUniCountryFilter(e.target.value)}
                      className="px-3 py-1.5 border border-hairline bg-white rounded-xl text-xs text-slate-600 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Countries</option>
                      {uniqueCountries.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>

                    <select 
                      value={uniCategoryFilter} 
                      onChange={(e) => setUniCategoryFilter(e.target.value)}
                      className="px-3 py-1.5 border border-hairline bg-white rounded-xl text-xs text-slate-600 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Categories</option>
                      {["Engineering", "MBA", "MBBS", "BCA", "BBA", "Nursing"].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>

                    <select 
                      value={uniPublishedFilter} 
                      onChange={(e) => setUniPublishedFilter(e.target.value)}
                      className="px-3 py-1.5 border border-hairline bg-white rounded-xl text-xs text-slate-600 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>

                    <select 
                      value={uniSortBy} 
                      onChange={(e) => setUniSortBy(e.target.value as any)}
                      className="px-3 py-1.5 border border-hairline bg-white rounded-xl text-xs text-slate-600 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="ranking_asc">Sort: Best Rank (Top first)</option>
                      <option value="ranking_desc">Sort: Lowest Rank</option>
                      <option value="newest">Sort: Newest Added</option>
                    </select>
                  </div>
                </div>

                {filteredUnis.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-hairline rounded-2xl text-slate-400 text-xs font-semibold">
                    No university records configured yet.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="border border-hairline rounded-2xl overflow-x-auto bg-white">
                      <table className="w-full text-left border-collapse text-xs min-w-[950px]">
                        <thead>
                          <tr className="bg-slate-50 border-b border-hairline text-slate-500 font-bold uppercase tracking-wider">
                            <th className="p-4">Logo</th>
                            <th className="p-4">University Name</th>
                            <th className="p-4">Country</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Ranking</th>
                            <th className="p-4">Fees</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-hairline">
                          {paginatedUnis.map((uni) => (
                            <tr key={uni.id} className="hover:bg-subtle-gray/30">
                              <td className="p-4">
                                {uni.logo_url ? (
                                  <img src={uni.logo_url} alt="" className="w-8 h-8 rounded-lg object-contain bg-slate-50 border border-hairline" />
                                ) : (
                                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[9px] text-slate-400 font-bold">UNI</div>
                                )}
                              </td>
                              <td className="p-4 font-semibold text-primary">
                                {uni.name}<br />
                                {uni.website_url && (
                                  <a href={uni.website_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary flex items-center gap-0.5 text-[10px] font-normal mt-0.5 font-mono-data">
                                    {uni.website_url.replace(/^https?:\/\/(www\.)?/, "")} <ArrowSquareOut size={10} />
                                  </a>
                                )}
                              </td>
                              <td className="p-4">
                                <span className="font-semibold">{uni.city}</span>, {uni.country}
                              </td>
                              <td className="p-4">
                                <span className="bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded text-[10px] font-bold">{uni.category}</span>
                                <span className="text-[10px] text-slate-400 block mt-1">{uni.course_type}</span>
                              </td>
                              <td className="p-4">
                                {uni.ranking ? (
                                  <span className="font-semibold font-mono-data text-primary">#{uni.ranking}<br/>
                                    <span className="text-[9px] font-normal text-slate-400 font-sans">{uni.ranking_source || "Ranked"}</span>
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-normal">N/A</span>
                                )}
                              </td>
                              <td className="p-4 font-semibold text-slate-600">
                                {uni.total_fees || "N/A"}<br />
                                <span className="text-[10px] text-slate-400 font-normal">{uni.intake || "N/A"}</span>
                              </td>
                              <td className="p-4">
                                <button
                                  onClick={() => togglePublishedUni(uni.id, uni.published)}
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                                    uni.published ? "bg-green-50 text-green-600 border-green-100 hover:bg-green-100/30" : "bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200/30"
                                  }`}
                                >
                                  {uni.published ? "Published" : "Draft"}
                                </button>
                              </td>
                              <td className="p-4 text-right flex justify-end gap-2 items-center h-full mt-2">
                                <button
                                  onClick={() => {
                                    setEditingUni(uni);
                                    setUniForm({
                                      name: uni.name,
                                      slug: uni.slug || "",
                                      logo_url: uni.logo_url || "",
                                      country: uni.country,
                                      city: uni.city || "",
                                      category: uni.category || "Engineering",
                                      course_type: uni.course_type || "Undergraduate",
                                      ranking: uni.ranking ? uni.ranking.toString() : "",
                                      ranking_source: uni.ranking_source || "",
                                      rating: uni.rating ? uni.rating.toString() : "4.5",
                                      total_fees: uni.total_fees || "",
                                      application_deadline: uni.application_deadline || "",
                                      intake: uni.intake || "",
                                      cutoff: uni.cutoff || "",
                                      website_url: uni.website_url || "",
                                      description: uni.description || "",
                                      featured: uni.featured || false,
                                      published: uni.published || false
                                    });
                                    setIsUniModalOpen(true);
                                  }}
                                  className="p-1 text-slate-500 hover:text-primary hover:bg-slate-50 rounded transition-colors cursor-pointer"
                                  title="Edit university"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => handleDuplicateUni(uni)}
                                  className="p-1 text-slate-500 hover:text-primary hover:bg-slate-50 rounded transition-colors cursor-pointer"
                                  title="Duplicate university"
                                >
                                  <Copy size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteUni(uni.id)} 
                                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {totalUniPages > 1 && (
                      <div className="flex items-center justify-between border-t border-hairline pt-4 px-2">
                        <span className="text-xs text-slate-500">
                          Showing Page <strong className="font-mono-data">{uniPage}</strong> of <strong className="font-mono-data">{totalUniPages}</strong> ({filteredUnis.length} universities)
                        </span>
                        
                        <div className="flex gap-2">
                          <Button disabled={uniPage === 1} onClick={() => setUniPage(p => Math.max(1, p - 1))} variant="secondary" size="sm">Previous</Button>
                          <Button disabled={uniPage === totalUniPages} onClick={() => setUniPage(p => Math.min(totalUniPages, p + 1))} variant="secondary" size="sm">Next</Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Admin Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                  <Card>
                    <CardTitle className="text-sm uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                      <Eye size={16} /> Most Viewed Universities
                    </CardTitle>
                    <div className="flex flex-col gap-3">
                      {([...universities].sort((a,b) => b.views_count - a.views_count).slice(0, 5)).map((u, i) => (
                        <div key={u.id} className="flex justify-between items-center text-xs border-b border-hairline/60 pb-2 last:border-0 last:pb-0">
                          <span className="font-semibold text-primary">{i+1}. {u.name}</span>
                          <span className="font-mono-data text-slate-500 font-bold">{u.views_count} views</span>
                        </div>
                      ))}
                      {universities.length === 0 && <span className="text-xs text-slate-400">No records found.</span>}
                    </div>
                  </Card>

                  <Card>
                    <CardTitle className="text-sm uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                      <Sparkle size={16} /> Most Clicked Apply Buttons
                    </CardTitle>
                    <div className="flex flex-col gap-3">
                      {([...universities].sort((a,b) => b.clicks_count - a.clicks_count).slice(0, 5)).map((u, i) => (
                        <div key={u.id} className="flex justify-between items-center text-xs border-b border-hairline/60 pb-2 last:border-0 last:pb-0">
                          <span className="font-semibold text-primary">{i+1}. {u.name}</span>
                          <span className="font-mono-data text-slate-500 font-bold">{u.clicks_count} clicks</span>
                        </div>
                      ))}
                      {universities.length === 0 && <span className="text-xs text-slate-400">No records found.</span>}
                    </div>
                  </Card>

                  <Card>
                    <CardTitle className="text-sm uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                      <Globe size={16} /> Country Distribution
                    </CardTitle>
                    <div className="flex flex-col gap-3">
                      {Object.entries(
                        universities.reduce((acc, u) => {
                          acc[u.country] = (acc[u.country] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      )
                        .sort((a, b) => b[1] - a[1])
                        .map(([country, count]) => (
                          <div key={country} className="flex justify-between items-center text-xs border-b border-hairline/60 pb-2 last:border-0 last:pb-0">
                            <span className="font-semibold text-primary">{country}</span>
                            <span className="font-mono-data text-slate-500 font-bold">{count} {count === 1 ? "university" : "universities"}</span>
                          </div>
                        ))}
                      {universities.length === 0 && <span className="text-xs text-slate-400">No records found.</span>}
                    </div>
                  </Card>

                  <Card>
                    <CardTitle className="text-sm uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                      <GraduationCap size={16} /> Category Breakdown
                    </CardTitle>
                    <div className="flex flex-col gap-3">
                      {Object.entries(
                        universities.reduce((acc, u) => {
                          acc[u.category] = (acc[u.category] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      )
                        .sort((a, b) => b[1] - a[1])
                        .map(([category, count]) => (
                          <div key={category} className="flex justify-between items-center text-xs border-b border-hairline/60 pb-2 last:border-0 last:pb-0">
                            <span className="font-semibold text-primary">{category}</span>
                            <span className="font-mono-data text-slate-500 font-bold">{count} {count === 1 ? "college" : "colleges"}</span>
                          </div>
                        ))}
                      {universities.length === 0 && <span className="text-xs text-slate-400">No records found.</span>}
                    </div>
                  </Card>
                </div>
              </>
            )}
          </section>
        )}

        {activeTab === "blog" && (
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-2xl text-primary">Blog Posts</h2>
                <p className="text-xs text-slate-400 mt-1">Manage public articles and insights.</p>
              </div>
              {postsTableExists && (
                <Button 
                  onClick={() => {
                    setEditingPost(null);
                    setPostForm({
                      title: "",
                      slug: "",
                      excerpt: "",
                      content: "",
                      featured_image_url: "",
                      category: "University Guide",
                      tags: "",
                      author: "Annex Team",
                      published: false
                    });
                    setPostModalTab("edit");
                    setIsPostModalOpen(true);
                  }}
                  variant="primary" 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <Plus size={14} /> New Article
                </Button>
              )}
            </div>

            {loading && posts.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs font-semibold">Loading Blog CMS...</div>
            ) : postsTableExists === false ? (
              <Card outerClassName="border-amber-200" className="bg-amber-50/10">
                <div className="flex items-center gap-2 mb-4">
                  <Warning size={18} className="text-amber-600" weight="fill" />
                  <CardTitle className="text-sm uppercase text-amber-800 tracking-wider">Posts Table Missing</CardTitle>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  The database table <strong>public.posts</strong> is missing. Apply the migration SQL scripts to proceed.
                </p>
              </Card>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-slate-50 border border-hairline p-4 rounded-2xl">
                  <div className="flex flex-grow max-w-md items-center gap-2.5 px-3 py-2 border border-hairline rounded-xl bg-white focus-within:ring-2 focus-within:ring-primary/20">
                    <MagnifyingGlass size={16} className="text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search articles..." 
                      value={blogSearch}
                      onChange={(e) => setBlogSearch(e.target.value)}
                      className="text-xs w-full focus:outline-none text-slate-800 bg-transparent"
                    />
                  </div>
                  
                  <select 
                    value={blogCategoryFilter} 
                    onChange={(e) => setBlogCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 border border-hairline bg-white rounded-xl text-xs text-slate-600 font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    {uniqueBlogCategories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {filteredPosts.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-hairline rounded-2xl text-slate-400 text-xs font-semibold">
                    No articles found matching filters.
                  </div>
                ) : (
                  <div className="border border-hairline rounded-2xl overflow-x-auto bg-white">
                    <table className="w-full text-left border-collapse text-xs min-w-[800px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-hairline text-slate-500 font-bold uppercase tracking-wider">
                          <th className="p-4">Cover</th>
                          <th className="p-4">Article</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Tags</th>
                          <th className="p-4">Author</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hairline">
                        {filteredPosts.map((post) => (
                          <tr key={post.id} className="hover:bg-subtle-gray/30">
                            <td className="p-4">
                              {post.featured_image_url ? (
                                <img src={post.featured_image_url} alt="" className="w-12 h-8 rounded object-cover border border-hairline bg-slate-50" />
                              ) : (
                                <div className="w-12 h-8 rounded bg-slate-100 flex items-center justify-center text-[8px] text-slate-400 font-bold">IMG</div>
                              )}
                            </td>
                            <td className="p-4 font-semibold text-primary max-w-[250px] truncate" title={post.title}>
                              {post.title}<br />
                              <span className="text-[10px] text-slate-400 font-mono-data font-normal">slug: {post.slug}</span>
                            </td>
                            <td className="p-4">
                              <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded text-[10px] font-bold">{post.category}</span>
                            </td>
                            <td className="p-4 max-w-[150px] truncate">
                              {post.tags ? (
                                <div className="flex flex-wrap gap-1">
                                  {post.tags.split(",").map(tag => (
                                    <span key={tag} className="bg-slate-100 text-[9px] text-slate-500 px-1 py-0.5 rounded-md font-semibold">{tag.trim()}</span>
                                  ))}
                                </div>
                              ) : "-"}
                            </td>
                            <td className="p-4">{post.author}</td>
                            <td className="p-4">
                              <button
                                onClick={() => togglePublishPost(post.id, post.published)}
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                                  post.published ? "bg-green-50 text-green-600 border-green-100 hover:bg-green-100/30" : "bg-yellow-50 text-yellow-600 border-yellow-100 hover:bg-yellow-100/30"
                                }`}
                                title={post.published ? "Mark Draft" : "Publish"}
                              >
                                {post.published ? "Published" : "Draft"}
                              </button>
                            </td>
                            <td className="p-4 text-right flex justify-end gap-2 items-center h-full mt-1.5">
                              <button
                                onClick={() => {
                                  setEditingPost(post);
                                  setPostForm({
                                    title: post.title,
                                    slug: post.slug,
                                    excerpt: post.excerpt || "",
                                    content: post.content,
                                    featured_image_url: post.featured_image_url || "",
                                    category: post.category,
                                    tags: post.tags || "",
                                    author: post.author || "Annex Team",
                                    published: post.published
                                  });
                                  setPostModalTab("edit");
                                  setIsPostModalOpen(true);
                                }}
                                className="p-1 text-slate-500 hover:text-primary hover:bg-slate-50 rounded transition-colors cursor-pointer"
                              >
                                <Eye size={16} />
                              </button>
                              <button onClick={() => handleDeletePost(post.id)} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer">
                                <Trash size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {activeTab === "stories" && (
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-2xl text-primary">Success Stories</h2>
                <p className="text-xs text-slate-400 mt-1">Manage public placements and test prep testimonials.</p>
              </div>
              {storiesTableExists && (
                <Button 
                  onClick={() => {
                    setEditingStory(null);
                    setStoryForm({
                      name: "",
                      destination: "",
                      university: "",
                      course: "",
                      quote: "",
                      year: new Date().getFullYear().toString(),
                      student_photo_url: "",
                      success_metrics: "",
                      published: false
                    });
                    setIsStoryModalOpen(true);
                  }}
                  variant="primary" 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <Plus size={14} /> New Story
                </Button>
              )}
            </div>

            {loading && stories.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs font-semibold">Loading Stories CMS...</div>
            ) : storiesTableExists === false ? (
              <Card outerClassName="border-amber-200" className="bg-amber-50/10">
                <div className="flex items-center gap-2 mb-4">
                  <Warning size={18} className="text-amber-600" weight="fill" />
                  <CardTitle className="text-sm uppercase text-amber-800 tracking-wider">Stories Table Missing</CardTitle>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  The database table <strong>public.success_stories</strong> is missing. Run the SQL script to seed it.
                </p>
              </Card>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-slate-50 border border-hairline p-4 rounded-2xl">
                  <div className="flex flex-grow max-w-md items-center gap-2.5 px-3 py-2 border border-hairline rounded-xl bg-white focus-within:ring-2 focus-within:ring-primary/20">
                    <MagnifyingGlass size={16} className="text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search success stories..." 
                      value={storySearch}
                      onChange={(e) => setStorySearch(e.target.value)}
                      className="text-xs w-full focus:outline-none text-slate-800 bg-transparent"
                    />
                  </div>
                  
                  <select 
                    value={storyCountryFilter} 
                    onChange={(e) => setStoryCountryFilter(e.target.value)}
                    className="px-3 py-1.5 border border-hairline bg-white rounded-xl text-xs text-slate-600 font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Placements</option>
                    {uniqueStoryCountries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {filteredStories.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-hairline rounded-2xl text-slate-400 text-xs font-semibold">
                    No success stories found matching filters.
                  </div>
                ) : (
                  <div className="border border-hairline rounded-2xl overflow-x-auto bg-white">
                    <table className="w-full text-left border-collapse text-xs min-w-[850px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-hairline text-slate-500 font-bold uppercase tracking-wider">
                          <th className="p-4">Photo</th>
                          <th className="p-4">Student Name</th>
                          <th className="p-4">Placement Details</th>
                          <th className="p-4">Tuition / Success Metric</th>
                          <th className="p-4">Intake Year</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hairline">
                        {filteredStories.map((story) => (
                          <tr key={story.id} className="hover:bg-subtle-gray/30">
                            <td className="p-4">
                              {story.student_photo_url ? (
                                <img src={story.student_photo_url} alt="" className="w-8 h-8 rounded-full object-cover border border-hairline bg-slate-50" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[8px] text-slate-400 font-bold">STU</div>
                              )}
                            </td>
                            <td className="p-4 font-semibold text-primary">{story.name}</td>
                            <td className="p-4">
                              <span className="font-semibold">{story.university}</span> &middot; <span className="font-mono-data text-gold font-bold">{story.destination}</span><br />
                              <span className="text-[10px] text-slate-400">{story.course}</span>
                            </td>
                            <td className="p-4 font-semibold text-slate-600">{story.success_metrics || "Standard Visa"}</td>
                            <td className="p-4 font-mono-data font-semibold">{story.year}</td>
                            <td className="p-4">
                              <button
                                onClick={() => togglePublishStory(story.id, story.published)}
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                                  story.published ? "bg-green-50 text-green-600 border-green-100 hover:bg-green-100/30" : "bg-yellow-50 text-yellow-600 border-yellow-100 hover:bg-yellow-100/30"
                                }`}
                                title={story.published ? "Mark Draft" : "Publish"}
                              >
                                {story.published ? "Published" : "Draft"}
                              </button>
                            </td>
                            <td className="p-4 text-right flex justify-end gap-2 items-center h-full mt-2">
                              <button
                                onClick={() => {
                                  setEditingStory(story);
                                  setStoryForm({
                                    name: story.name,
                                    destination: story.destination,
                                    university: story.university,
                                    course: story.course,
                                    quote: story.quote,
                                    year: story.year.toString(),
                                    student_photo_url: story.student_photo_url || "",
                                    success_metrics: story.success_metrics || "",
                                    published: story.published
                                  });
                                  setIsStoryModalOpen(true);
                                }}
                                className="p-1 text-slate-500 hover:text-primary hover:bg-slate-50 rounded transition-colors cursor-pointer"
                              >
                                <Eye size={16} />
                              </button>
                              <button onClick={() => handleDeleteStory(story.id)} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer">
                                <Trash size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </div>

      {/* MODALS */}
      {/* 1. VIEW BOOKING DETAILS MODAL */}
      {isNotesModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <Card className="max-w-2xl w-full p-6 relative bg-white shadow-2xl">
            <button onClick={() => setIsNotesModalOpen(false)} className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer">
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 mb-6 border-b border-hairline pb-4">
              <FileText size={22} className="text-primary" />
              <div>
                <CardTitle className="text-lg">Consultation Request Details</CardTitle>
                <CardDescription className="text-xs">Submission ID: {selectedBooking.id}</CardDescription>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs md:text-sm">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Student Name</label>
                <p className="font-semibold text-primary">{selectedBooking.name}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status</label>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedBooking.status === "Confirmed" ? "bg-green-50 text-green-600 border border-green-100" : selectedBooking.status === "Cancelled" ? "bg-red-50 text-red-600 border border-red-100" : "bg-yellow-50 text-yellow-600 border border-yellow-100"
                }`}>{selectedBooking.status}</span>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email</label>
                <p className="font-mono-data text-slate-600">{selectedBooking.email}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone</label>
                <p className="font-mono-data text-slate-600">{selectedBooking.phone}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Preferred Slot</label>
                <p className="text-slate-600">{selectedBooking.preferred_date} @ {selectedBooking.preferred_time}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Destination Details</label>
                <p className="text-slate-600">{selectedBooking.study_level} to {selectedBooking.destination}</p>
              </div>
            </div>
            <div className="mb-6">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Notes & Transcripts Background</label>
              <div className="p-4 bg-slate-50 border border-hairline rounded-xl text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                {selectedBooking.notes || "No additional information provided."}
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-hairline pt-4">
              {selectedBooking.status !== "Confirmed" && <Button onClick={() => { updateBookingStatus(selectedBooking.id, "Confirmed"); setSelectedBooking(null); setIsNotesModalOpen(false); }} variant="primary" size="sm">Confirm</Button>}
              {selectedBooking.status !== "Cancelled" && <Button onClick={() => { updateBookingStatus(selectedBooking.id, "Cancelled"); setSelectedBooking(null); setIsNotesModalOpen(false); }} variant="secondary" size="sm">Cancel</Button>}
              <Button onClick={() => setIsNotesModalOpen(false)} variant="ghost" size="sm">Close</Button>
            </div>
          </Card>
        </div>
      )}

      {/* 2. ADD/EDIT UNIVERSITY MODAL */}
      {isUniModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <Card className="max-w-2xl w-full p-6 relative bg-white shadow-2xl">
            <button onClick={() => setIsUniModalOpen(false)} className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer">
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 mb-6 border-b border-hairline pb-4">
              <Globe size={22} className="text-primary" />
              <div>
                <CardTitle className="text-lg">{editingUni ? "Edit University" : "Add New University"}</CardTitle>
                <CardDescription className="text-xs">Configure university profiles, categories, entry requirements, and rankings.</CardDescription>
              </div>
            </div>
            <form onSubmit={handleSaveUni} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">University Name *</label>
                  <input 
                    type="text" 
                    value={uniForm.name} 
                    onChange={(e) => {
                      const nameVal = e.target.value;
                      const slugVal = nameVal.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                      setUniForm({ ...uniForm, name: nameVal, slug: slugVal });
                    }} 
                    className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" 
                    required 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">URL Slug (Auto)</label>
                  <input 
                    type="text" 
                    value={uniForm.slug} 
                    onChange={(e) => setUniForm({ ...uniForm, slug: e.target.value })} 
                    className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-slate-50 font-mono-data" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Logo URL</label>
                  <input 
                    type="text" 
                    value={uniForm.logo_url} 
                    onChange={(e) => setUniForm({ ...uniForm, logo_url: e.target.value })} 
                    className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" 
                    placeholder="https://" 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Website URL</label>
                  <input 
                    type="url" 
                    value={uniForm.website_url} 
                    onChange={(e) => setUniForm({ ...uniForm, website_url: e.target.value })} 
                    className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" 
                    placeholder="https://" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Country *</label>
                  <input 
                    type="text" 
                    value={uniForm.country} 
                    onChange={(e) => setUniForm({ ...uniForm, country: e.target.value })} 
                    className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" 
                    required 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">City *</label>
                  <input 
                    type="text" 
                    value={uniForm.city} 
                    onChange={(e) => setUniForm({ ...uniForm, city: e.target.value })} 
                    className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Category *</label>
                  <select 
                    value={uniForm.category} 
                    onChange={(e) => setUniForm({ ...uniForm, category: e.target.value })} 
                    className="px-3 py-1.5 border border-hairline bg-white rounded-xl text-xs text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="MBA">MBA</option>
                    <option value="MBBS">MBBS</option>
                    <option value="BCA">BCA</option>
                    <option value="BBA">BBA</option>
                    <option value="Nursing">Nursing</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Course Level *</label>
                  <select 
                    value={uniForm.course_type} 
                    onChange={(e) => setUniForm({ ...uniForm, course_type: e.target.value })} 
                    className="px-3 py-1.5 border border-hairline bg-white rounded-xl text-xs text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">World Ranking</label>
                  <input 
                    type="number" 
                    value={uniForm.ranking} 
                    onChange={(e) => setUniForm({ ...uniForm, ranking: e.target.value })} 
                    className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" 
                    placeholder="e.g. 154" 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Ranking Source</label>
                  <input 
                    type="text" 
                    value={uniForm.ranking_source} 
                    onChange={(e) => setUniForm({ ...uniForm, ranking_source: e.target.value })} 
                    className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" 
                    placeholder="e.g. QS Rankings" 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Rating (1-5)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="1" 
                    max="5" 
                    value={uniForm.rating} 
                    onChange={(e) => setUniForm({ ...uniForm, rating: e.target.value })} 
                    className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Total Fees Range</label>
                  <input 
                    type="text" 
                    value={uniForm.total_fees} 
                    onChange={(e) => setUniForm({ ...uniForm, total_fees: e.target.value })} 
                    className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" 
                    placeholder="e.g. £15,000 - £22,000 per year" 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Application Deadline</label>
                  <input 
                    type="text" 
                    value={uniForm.application_deadline} 
                    onChange={(e) => setUniForm({ ...uniForm, application_deadline: e.target.value })} 
                    className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" 
                    placeholder="e.g. June 30" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Intake Cycles</label>
                  <input 
                    type="text" 
                    value={uniForm.intake} 
                    onChange={(e) => setUniForm({ ...uniForm, intake: e.target.value })} 
                    className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" 
                    placeholder="e.g. September / January" 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Entry Cutoff / Score</label>
                  <input 
                    type="text" 
                    value={uniForm.cutoff} 
                    onChange={(e) => setUniForm({ ...uniForm, cutoff: e.target.value })} 
                    className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" 
                    placeholder="e.g. IELTS 6.5 / 75% in 10+2" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Description</label>
                <textarea 
                  value={uniForm.description} 
                  onChange={(e) => setUniForm({ ...uniForm, description: e.target.value })} 
                  className="px-3 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white min-h-[80px] resize-none" 
                  placeholder="Provide a detailed description of the campus, unique programs, and student facilities."
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="featured" 
                    checked={uniForm.featured} 
                    onChange={(e) => setUniForm({ ...uniForm, featured: e.target.checked })} 
                    className="w-4 h-4 text-primary cursor-pointer border-hairline rounded" 
                  />
                  <label htmlFor="featured" className="text-[10px] font-bold text-primary uppercase tracking-wider cursor-pointer">Featured Partner</label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="published" 
                    checked={uniForm.published} 
                    onChange={(e) => setUniForm({ ...uniForm, published: e.target.checked })} 
                    className="w-4 h-4 text-primary cursor-pointer border-hairline rounded" 
                  />
                  <label htmlFor="published" className="text-[10px] font-bold text-primary uppercase tracking-wider cursor-pointer">Published / Active</label>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-hairline pt-4 mt-2">
                <Button type="submit" variant="primary" size="sm">Save Record</Button>
                <Button type="button" onClick={() => setIsUniModalOpen(false)} variant="ghost" size="sm">Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* 3. ADD/EDIT BLOG POST MODAL */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="max-w-2xl w-full p-6 relative bg-white shadow-2xl flex flex-col">
            <button onClick={() => setIsPostModalOpen(false)} className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer z-10">
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 mb-4 border-b border-hairline pb-3">
              <FileText size={22} className="text-primary" />
              <div>
                <CardTitle className="text-lg">{editingPost ? "Edit Blog Article" : "Create Blog Article"}</CardTitle>
                <CardDescription className="text-xs">Publish articles directly onto the public Annex Journal page.</CardDescription>
              </div>
            </div>
            
            {/* Inner modal tabs */}
            <div className="flex gap-4 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 border-b border-hairline/40 pb-2">
              <button type="button" onClick={() => setPostModalTab("edit")} className={`pb-1 cursor-pointer transition-all ${postModalTab === "edit" ? "text-primary border-b-2 border-primary" : "hover:text-primary"}`}>Edit Content</button>
              <button type="button" onClick={() => setPostModalTab("preview")} className={`pb-1 cursor-pointer transition-all ${postModalTab === "preview" ? "text-primary border-b-2 border-primary" : "hover:text-primary"}`}>Live Preview</button>
            </div>

            {postModalTab === "edit" ? (
              <form onSubmit={handleSavePost} className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Title *</label>
                    <input 
                      type="text" 
                      value={postForm.title} 
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        const slugVal = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                        setPostForm({ ...postForm, title: newTitle, slug: slugVal });
                      }} 
                      className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" 
                      required 
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider">URL Slug (Auto)</label>
                    <input type="text" value={postForm.slug} onChange={(e) => setPostForm({ ...postForm, slug: e.target.value })} className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none text-slate-800 bg-slate-50 font-mono-data" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Category *</label>
                    <select value={postForm.category} onChange={(e) => setPostForm({ ...postForm, category: e.target.value })} className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none text-slate-800 bg-white cursor-pointer">
                      <option value="University Guide">University Guide</option>
                      <option value="Visa Guide">Visa Guide</option>
                      <option value="Intake Alert">Intake Alert</option>
                      <option value="News & Events">News & Events</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Author *</label>
                    <input type="text" value={postForm.author} onChange={(e) => setPostForm({ ...postForm, author: e.target.value })} className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none text-slate-800 bg-white" required />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Cover Image URL</label>
                  <input type="text" value={postForm.featured_image_url} onChange={(e) => setPostForm({ ...postForm, featured_image_url: e.target.value })} className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none text-slate-800 bg-white" placeholder="https://" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Tags (Comma-separated)</label>
                  <input type="text" value={postForm.tags} onChange={(e) => setPostForm({ ...postForm, tags: e.target.value })} className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none text-slate-800 bg-white" placeholder="UK, Admissions, Visa" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Summary Excerpt *</label>
                  <input type="text" value={postForm.excerpt} onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })} className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none text-slate-800 bg-white" required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Content Body *</label>
                  <textarea value={postForm.content} onChange={(e) => setPostForm({ ...postForm, content: e.target.value })} className="px-3 py-2 border border-hairline rounded-xl text-xs focus:outline-none text-slate-800 bg-white min-h-[140px] resize-none" required />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" id="published" checked={postForm.published} onChange={(e) => setPostForm({ ...postForm, published: e.target.checked })} className="w-4 h-4 text-primary cursor-pointer border-hairline rounded" />
                  <label htmlFor="published" className="text-xs font-bold text-primary uppercase tracking-wider cursor-pointer">Publish immediately</label>
                </div>
                <div className="flex justify-end gap-3 border-t border-hairline pt-4 mt-2">
                  <Button type="submit" variant="primary" size="sm">Save Record</Button>
                  <Button type="button" onClick={() => setIsPostModalOpen(false)} variant="ghost" size="sm">Cancel</Button>
                </div>
              </form>
            ) : (
              /* BLOG PREVIEW */
              <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
                {postForm.featured_image_url && <img src={postForm.featured_image_url} alt="" className="w-full h-40 object-cover rounded-2xl border border-hairline" />}
                <div>
                  <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">{postForm.category}</span>
                  <h1 className="font-display font-bold text-2xl text-primary mt-2">{postForm.title || "Untitled Article"}</h1>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono-data">BY {postForm.author.toUpperCase()}</p>
                </div>
                {postForm.excerpt && <p className="text-xs font-semibold text-slate-500 italic border-l-2 border-primary pl-3 py-0.5">{postForm.excerpt}</p>}
                <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap pt-2 border-t border-hairline/60">{postForm.content || "Write content to see preview."}</div>
                <div className="flex justify-end gap-2 border-t border-hairline pt-4 mt-2">
                  <Button onClick={() => setPostModalTab("edit")} variant="secondary" size="sm">Back to Edit</Button>
                  <Button onClick={() => setIsPostModalOpen(false)} variant="ghost" size="sm">Close</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* 4. ADD/EDIT SUCCESS STORY MODAL */}
      {isStoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="max-w-md w-full p-6 relative bg-white shadow-2xl">
            <button onClick={() => setIsStoryModalOpen(false)} className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer">
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 mb-6 border-b border-hairline pb-4">
              <GraduationCap size={22} className="text-primary" />
              <div>
                <CardTitle className="text-lg">{editingStory ? "Edit Success Story" : "Add Success Story"}</CardTitle>
                <CardDescription className="text-xs">Publish student placement records and approvals.</CardDescription>
              </div>
            </div>
            <form onSubmit={handleSaveStory} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Student Name *</label>
                  <input type="text" value={storyForm.name} onChange={(e) => setStoryForm({ ...storyForm, name: e.target.value })} className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Destination Country *</label>
                  <input type="text" value={storyForm.destination} onChange={(e) => setStoryForm({ ...storyForm, destination: e.target.value })} className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" placeholder="e.g. UK, Australia" required />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">University Placed *</label>
                <input type="text" value={storyForm.university} onChange={(e) => setStoryForm({ ...storyForm, university: e.target.value })} className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Course *</label>
                  <input type="text" value={storyForm.course} onChange={(e) => setStoryForm({ ...storyForm, course: e.target.value })} className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Intake Year *</label>
                  <input type="number" value={storyForm.year} onChange={(e) => setStoryForm({ ...storyForm, year: e.target.value })} className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" required />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Success Metrics / Scores</label>
                <input type="text" value={storyForm.success_metrics} onChange={(e) => setStoryForm({ ...storyForm, success_metrics: e.target.value })} className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" placeholder="e.g. PTE 79 Overall, IELTS 7.5" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Student Photo URL</label>
                <input type="text" value={storyForm.student_photo_url} onChange={(e) => setStoryForm({ ...storyForm, student_photo_url: e.target.value })} className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" placeholder="https://" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Testimonial Quote *</label>
                <textarea value={storyForm.quote} onChange={(e) => setStoryForm({ ...storyForm, quote: e.target.value })} className="px-3 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white min-h-[100px] resize-none" required />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="storyPublished" checked={storyForm.published} onChange={(e) => setStoryForm({ ...storyForm, published: e.target.checked })} className="w-4 h-4 text-primary cursor-pointer border-hairline rounded" />
                <label htmlFor="storyPublished" className="text-xs font-bold text-primary uppercase tracking-wider cursor-pointer">Publish immediately</label>
              </div>
              <div className="flex justify-end gap-3 border-t border-hairline pt-4 mt-2">
                <Button type="submit" variant="primary" size="sm">Save Record</Button>
                <Button type="button" onClick={() => setIsStoryModalOpen(false)} variant="ghost" size="sm">Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </main>
  );
}
