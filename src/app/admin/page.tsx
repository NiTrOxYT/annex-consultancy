"use client";

import * as React from "react";
import { 
  Sparkle, ShieldCheck, SignOut, Trash, Plus, FileText, 
  Calendar, Users, Eye, CheckCircle, XCircle, ChartBar, 
  Download, MagnifyingGlass, Funnel, ArrowSquareOut, Globe, 
  Warning, Check, X, SpinnerGap, GraduationCap
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
  country: string;
  website?: string;
  status?: string;
  created_at?: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string; // "Blog" | "Success Story"
  student_name?: string | null;
  university_placed?: string | null;
  visa_year?: number | null;
  published: boolean;
  author: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [authError, setAuthError] = React.useState("");
  const [checkingAuth, setCheckingAuth] = React.useState(true);
  
  // Dashboard Tabs
  const [activeTab, setActiveTab] = React.useState<"bookings" | "universities" | "cms">("bookings");

  // Booking states
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = React.useState(false);
  
  // Search & Filter states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [destinationFilter, setDestinationFilter] = React.useState("All");
  const [statusFilter, setStatusFilter] = React.useState("All");

  // Toast Notification State
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // University Tab states
  const [universities, setUniversities] = React.useState<University[]>([]);
  const [uniLoading, setUniLoading] = React.useState(false);
  const [uniTableExists, setUniTableExists] = React.useState<boolean | null>(null);
  const [uniError, setUniError] = React.useState<string | null>(null);
  const [isUniModalOpen, setIsUniModalOpen] = React.useState(false);
  const [editingUni, setEditingUni] = React.useState<University | null>(null);
  const [uniForm, setUniForm] = React.useState({
    name: "",
    country: "",
    website: "",
    status: "Active"
  });

  // CMS Tab states
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [cmsLoading, setCmsLoading] = React.useState(false);
  const [postsTableExists, setPostsTableExists] = React.useState<boolean | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<Post | null>(null);
  const [cmsTab, setCmsTab] = React.useState<"All" | "Blog" | "Success Story">("All");
  const [postForm, setPostForm] = React.useState({
    title: "",
    content: "",
    excerpt: "",
    category: "Blog",
    student_name: "",
    university_placed: "",
    visa_year: new Date().getFullYear().toString(),
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

  // Auth Handler
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

  // Sign out Handler
  const handleSignOut = () => {
    setIsAuthenticated(false);
    setPassword("");
    try {
      sessionStorage.removeItem("annex_admin_authenticated");
    } catch (e) {
      console.error("Sign out storage error:", e);
    }
  };

  // Fetch Bookings
  const fetchBookings = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err: any) {
      console.error("Error loading bookings:", err.message);
      showToast("Error loading bookings: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Universities
  const fetchUniversities = async () => {
    setUniLoading(true);
    setUniError(null);
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
      setUniError(err.message);
    } finally {
      setUniLoading(false);
    }
  };

  // Fetch Posts (CMS)
  const fetchPosts = async () => {
    setCmsLoading(true);
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
      console.error("Error loading CMS posts:", err.message);
    } finally {
      setCmsLoading(false);
    }
  };

  // Trigger loading when authenticated or tab switches
  React.useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === "bookings") {
        fetchBookings();
      } else if (activeTab === "universities") {
        fetchUniversities();
      } else if (activeTab === "cms") {
        fetchPosts();
      }
    }
  }, [isAuthenticated, activeTab, fetchBookings]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Update Booking Status
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
      showToast(`Booking marked as ${newStatus}`);
      fetchBookings();
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    }
  };

  // Delete Booking
  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      const { error } = await supabase.from("bookings").delete().eq("id", id);
      if (error) throw error;
      showToast("Consultation booking deleted");
      fetchBookings();
    } catch (err: any) {
      alert("Error deleting record: " + err.message);
    }
  };

  // Save University CRUD
  const handleSaveUni = async (e: React.FormEvent) => {
    e.preventDefault();
    setUniLoading(true);
    setUniError(null);
    try {
      if (editingUni) {
        const { error } = await supabase
          .from("universities")
          .update({
            name: uniForm.name,
            country: uniForm.country,
            website: uniForm.website,
            status: uniForm.status
          })
          .eq("id", editingUni.id);
        
        if (error) throw error;
        showToast("University updated successfully");
      } else {
        const { error } = await supabase
          .from("universities")
          .insert([{
            name: uniForm.name,
            country: uniForm.country,
            website: uniForm.website,
            status: uniForm.status
          }]);
        
        if (error) throw error;
        showToast("University added successfully");
      }
      setIsUniModalOpen(false);
      setUniForm({ name: "", country: "", website: "", status: "Active" });
      setEditingUni(null);
      fetchUniversities();
    } catch (err: any) {
      console.error("Error saving university:", err.message);
      setUniError(err.message);
    } finally {
      setUniLoading(false);
    }
  };

  // Delete University CRUD
  const handleDeleteUni = async (id: string) => {
    if (!confirm("Are you sure you want to delete this university record?")) return;
    setUniLoading(true);
    try {
      const { error } = await supabase.from("universities").delete().eq("id", id);
      if (error) throw error;
      showToast("University deleted successfully");
      fetchUniversities();
    } catch (err: any) {
      alert("Error deleting university: " + err.message);
    } finally {
      setUniLoading(false);
    }
  };

  // Save CMS Post
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setCmsLoading(true);
    try {
      const slug = postForm.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      if (editingPost) {
        const { error } = await supabase
          .from("posts")
          .update({
            title: postForm.title,
            slug,
            content: postForm.content,
            excerpt: postForm.excerpt,
            category: postForm.category,
            student_name: postForm.category === "Success Story" ? postForm.student_name : null,
            university_placed: postForm.category === "Success Story" ? postForm.university_placed : null,
            visa_year: postForm.category === "Success Story" ? parseInt(postForm.visa_year) || null : null,
            published: postForm.published
          })
          .eq("id", editingPost.id);
        
        if (error) throw error;
        showToast("Article updated successfully");
      } else {
        const { error } = await supabase
          .from("posts")
          .insert([{
            title: postForm.title,
            slug,
            content: postForm.content,
            excerpt: postForm.excerpt,
            category: postForm.category,
            student_name: postForm.category === "Success Story" ? postForm.student_name : null,
            university_placed: postForm.category === "Success Story" ? postForm.university_placed : null,
            visa_year: postForm.category === "Success Story" ? parseInt(postForm.visa_year) || null : null,
            published: postForm.published
          }]);
        
        if (error) throw error;
        showToast("Article created successfully");
      }
      setIsPostModalOpen(false);
      setPostForm({
        title: "",
        content: "",
        excerpt: "",
        category: "Blog",
        student_name: "",
        university_placed: "",
        visa_year: new Date().getFullYear().toString(),
        published: false
      });
      setEditingPost(null);
      fetchPosts();
    } catch (err: any) {
      alert("Error saving article: " + err.message);
    } finally {
      setCmsLoading(false);
    }
  };

  // Delete CMS Post
  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    setCmsLoading(true);
    try {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
      showToast("Article deleted successfully");
      fetchPosts();
    } catch (err: any) {
      alert("Error deleting article: " + err.message);
    } finally {
      setCmsLoading(false);
    }
  };

  // Dynamic Statistics Calculations (Dashboard Overview)
  const totalRequests = bookings.length;
  const pendingRequests = bookings.filter(b => b.status === "Pending").length;
  const confirmedRequests = bookings.filter(b => b.status === "Confirmed").length;
  const cancelledRequests = bookings.filter(b => b.status === "Cancelled").length;
  
  const today = new Date();
  const todayRequests = bookings.filter(b => {
    if (!b.created_at) return false;
    const bDate = new Date(b.created_at);
    return bDate.getDate() === today.getDate() &&
           bDate.getMonth() === today.getMonth() &&
           bDate.getFullYear() === today.getFullYear();
  }).length;

  const monthRequests = bookings.filter(b => {
    if (!b.created_at) return false;
    const bDate = new Date(b.created_at);
    return bDate.getMonth() === today.getMonth() &&
           bDate.getFullYear() === today.getFullYear();
  }).length;

  // Filter and Search logic
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDestination = destinationFilter === "All" || b.destination === destinationFilter;
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    
    return matchesSearch && matchesDestination && matchesStatus;
  });

  // Export to CSV Function
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

  // Analytics Helpers
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

  const destinations = bookings.map(b => b.destination);
  const studyLevels = bookings.map(b => b.study_level);

  const mostSelectedDestination = getMostSelected(destinations);
  const mostSelectedStudyLevel = getMostSelected(studyLevels);

  // Filtered lists for CMS
  const filteredPosts = posts.filter(p => {
    if (cmsTab === "All") return true;
    return p.category === cmsTab;
  });

  // Loading indicator for authorization gates
  if (checkingAuth) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center bg-subtle-gray/30">
        <div className="flex flex-col items-center gap-2">
          <SpinnerGap className="animate-spin text-primary" size={32} />
          <span className="text-xs font-semibold text-slate-500 font-mono-data">Loading security keys...</span>
        </div>
      </main>
    );
  }

  // Unauthenticated view (Login Gate)
  if (!isAuthenticated) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center bg-subtle-gray/30 px-6 py-12">
        <Card className="max-w-md w-full p-8">
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
                className="px-4 py-3 border border-hairline rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800"
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
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-primary text-white border border-hairline/20 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in-up">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-gold">
            <Check size={14} weight="bold" />
          </div>
          <div className="text-xs font-semibold">{toastMessage}</div>
          <button 
            onClick={() => setToastMessage(null)} 
            className="text-white/60 hover:text-white ml-2 transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Admin Navbar */}
      <header className="border-b border-hairline px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white sticky top-0 z-30">
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck size={24} className="text-primary" weight="fill" />
            <span className="font-display font-bold text-lg text-primary tracking-tight">ANNEX ADMIN</span>
          </div>
          
          <nav className="flex gap-2">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
                activeTab === "bookings" ? "bg-primary text-white" : "text-slate-500 hover:text-primary hover:bg-slate-50"
              }`}
            >
              Consultations ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab("universities")}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
                activeTab === "universities" ? "bg-primary text-white" : "text-slate-500 hover:text-primary hover:bg-slate-50"
              }`}
            >
              Universities
            </button>
            <button
              onClick={() => setActiveTab("cms")}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
                activeTab === "cms" ? "bg-primary text-white" : "text-slate-500 hover:text-primary hover:bg-slate-50"
              }`}
            >
              CMS Articles
            </button>
          </nav>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-primary transition-colors cursor-pointer"
        >
          <SignOut size={16} /> Sign Out
        </button>
      </header>

      {/* Main Panel Content */}
      <div className="flex-grow p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {activeTab === "bookings" && (
          <section className="flex flex-col gap-8">
            
            {/* Dashboard Headers */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-2xl text-primary leading-tight">Admin dashboard.</h2>
                <p className="text-xs text-slate-400 mt-1">Real-time consultation overview and booking pipelines.</p>
              </div>
              <Button variant="secondary" size="sm" onClick={fetchBookings} className="flex items-center gap-1.5">
                <SpinnerGap className={loading ? "animate-spin" : ""} size={14} /> Refresh Data
              </Button>
            </div>

            {/* Grid 1: Statistic Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              {[
                { label: "Total Requests", value: totalRequests, icon: <Users size={20} className="text-primary" weight="bold" />, bg: "bg-slate-50 border-slate-100" },
                { label: "Pending Requests", value: pendingRequests, icon: <Calendar size={20} className="text-yellow-600" weight="bold" />, bg: "bg-yellow-50/20 border-yellow-100/60" },
                { label: "Confirmed Requests", value: confirmedRequests, icon: <CheckCircle size={20} className="text-green-600" weight="bold" />, bg: "bg-green-50/20 border-green-100/60" },
                { label: "Cancelled Requests", value: cancelledRequests, icon: <XCircle size={20} className="text-red-600" weight="bold" />, bg: "bg-red-50/20 border-red-100/60" },
                { label: "Today's Requests", value: todayRequests, icon: <Sparkle size={20} className="text-gold" weight="bold" />, bg: "bg-amber-50/20 border-amber-100/60" },
                { label: "This Month's", value: monthRequests, icon: <FileText size={20} className="text-indigo-600" weight="bold" />, bg: "bg-indigo-50/20 border-indigo-100/60" }
              ].map((stat, idx) => (
                <div key={idx} className={`border rounded-2xl p-4 flex flex-col justify-between min-h-[100px] ${stat.bg}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{stat.label}</span>
                    {stat.icon}
                  </div>
                  <span className="text-2xl font-bold font-mono-data text-primary mt-2">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Grid 2: Sub-panels (Widgets / Analytics) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Analytics Section links */}
              <div className="lg:col-span-4">
                <Card className="h-full">
                  <CardTitle className="text-sm uppercase tracking-wider text-slate-400 mb-4">External Analytics Links</CardTitle>
                  <div className="flex flex-col gap-3">
                    <a 
                      href="https://analytics.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border border-hairline hover:border-primary rounded-xl bg-slate-50 hover:bg-slate-100/50 transition-all text-xs font-bold text-slate-600 hover:text-primary group"
                    >
                      <span className="flex items-center gap-2">
                        <ChartBar size={16} className="text-primary" /> Google Analytics
                      </span>
                      <ArrowSquareOut size={14} className="text-slate-400 group-hover:text-primary" />
                    </a>
                    <a 
                      href="https://clarity.microsoft.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border border-hairline hover:border-primary rounded-xl bg-slate-50 hover:bg-slate-100/50 transition-all text-xs font-bold text-slate-600 hover:text-primary group"
                    >
                      <span className="flex items-center gap-2">
                        <Eye size={16} className="text-primary" /> Microsoft Clarity
                      </span>
                      <ArrowSquareOut size={14} className="text-slate-400 group-hover:text-primary" />
                    </a>
                  </div>
                </Card>
              </div>

              {/* Analytics Widget Cards (Submissions, top destination etc) */}
              <div className="lg:col-span-8">
                <Card className="h-full">
                  <CardTitle className="text-sm uppercase tracking-wider text-slate-400 mb-6">Analytics Widget Summary</CardTitle>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border-r border-hairline last:border-0 pr-6">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Submissions</label>
                      <span className="text-xl font-bold font-mono-data text-primary">{totalRequests}</span>
                    </div>
                    <div className="border-r border-hairline last:border-0 pr-6">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Top Destination</label>
                      <span className="text-sm font-semibold text-primary">{mostSelectedDestination}</span>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Top Education Level</label>
                      <span className="text-sm font-semibold text-primary">{mostSelectedStudyLevel}</span>
                    </div>
                  </div>
                </Card>
              </div>

            </div>

            {/* Grid 3: Main Tables & Recent Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Bookings list */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                
                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-slate-50 border border-hairline p-4 rounded-2xl">
                  <div className="flex flex-grow max-w-md items-center gap-2.5 px-3 py-2 border border-hairline rounded-xl bg-white focus-within:ring-2 focus-within:ring-primary/20">
                    <MagnifyingGlass size={16} className="text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search name, email, phone..." 
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
                  
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Destination filter */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 border border-hairline bg-white rounded-xl text-xs text-slate-600 font-semibold cursor-pointer">
                      <Funnel size={14} className="text-slate-400" />
                      <select 
                        value={destinationFilter} 
                        onChange={(e) => setDestinationFilter(e.target.value)}
                        className="bg-transparent focus:outline-none cursor-pointer"
                      >
                        <option value="All">All Destinations</option>
                        <option value="UK">UK</option>
                        <option value="Australia">Australia</option>
                        <option value="Europe">Europe</option>
                        <option value="Dubai">Dubai</option>
                        <option value="Italy">Italy</option>
                        <option value="India">India</option>
                      </select>
                    </div>

                    {/* Status filter */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 border border-hairline bg-white rounded-xl text-xs text-slate-600 font-semibold cursor-pointer">
                      <Funnel size={14} className="text-slate-400" />
                      <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-transparent focus:outline-none cursor-pointer"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* CSV Export Button */}
                    <Button onClick={exportToCSV} variant="secondary" size="sm" className="flex items-center gap-1">
                      <Download size={14} /> Export CSV
                    </Button>
                  </div>
                </div>

                {/* Table */}
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
                                title="View details & notes"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => updateStatus(booking.id, "Confirmed")}
                                className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors cursor-pointer"
                                title="Confirm Booking"
                                disabled={booking.status === "Confirmed"}
                              >
                                <CheckCircle size={16} weight="fill" />
                              </button>
                              <button
                                onClick={() => updateStatus(booking.id, "Cancelled")}
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

              {/* Right Column: Recent Activity timeline */}
              <div className="lg:col-span-4">
                <Card className="h-full">
                  <CardTitle className="text-sm uppercase tracking-wider text-slate-400 mb-6">Recent Activity Feed</CardTitle>
                  <div className="flex flex-col gap-4">
                    {bookings.slice(0, 5).map((b) => (
                      <div key={b.id} className="flex gap-3 items-start border-b border-hairline/60 pb-3 last:border-0 last:pb-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <div className="flex-grow min-w-0">
                          <p className="text-xs font-semibold text-primary truncate">{b.name}</p>
                          <p className="text-[10px] text-slate-400">
                            {b.destination} &bull; {b.preferred_date}
                          </p>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                          b.status === "Confirmed"
                            ? "bg-green-50 text-green-600 border border-green-100"
                            : b.status === "Cancelled"
                            ? "bg-red-50 text-red-600 border border-red-100"
                            : "bg-yellow-50 text-yellow-600 border border-yellow-100"
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                    {bookings.length === 0 && (
                      <div className="text-slate-400 text-xs py-4 text-center">No recent activity.</div>
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
                <p className="text-xs text-slate-400 mt-1">Manage global university placement partner records.</p>
              </div>
              {uniTableExists && (
                <Button 
                  onClick={() => {
                    setEditingUni(null);
                    setUniForm({ name: "", country: "", website: "", status: "Active" });
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

            {uniLoading && (
              <div className="text-center py-12 text-slate-400 text-xs font-semibold">Loading universities...</div>
            )}

            {!uniLoading && uniTableExists === false && (
              <div className="flex flex-col gap-6">
                <Card outerClassName="border-amber-200" className="bg-amber-50/10">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                      <Warning size={18} weight="fill" />
                    </div>
                    <CardTitle className="text-sm uppercase tracking-wider text-amber-800">Table Missing Warning</CardTitle>
                  </div>
                  <p className="text-xs md:text-sm text-slate-700 leading-relaxed mb-4">
                    The Supabase connection is successful, but the table <strong>public.universities</strong> does not exist in your database schema, or is missing required columns.
                  </p>
                  
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed select-all">
                    <pre>{`-- SQL Migration Code
CREATE TABLE IF NOT EXISTS public.universities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    country TEXT NOT NULL,
    website TEXT,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and policies
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on universities" ON public.universities FOR SELECT USING (true);
CREATE POLICY "Allow admin operations on universities" ON public.universities FOR ALL TO authenticated USING (true) WITH CHECK (true);`}</pre>
                  </div>
                </Card>

                {/* Local Fallback Layout for display consistency */}
                <div className="border border-dashed border-hairline p-12 rounded-2xl text-center">
                  <Globe size={32} className="text-slate-300 mx-auto mb-3" />
                  <h3 className="font-display font-semibold text-sm text-slate-500 mb-1">CRUD Placeholder Dashboard</h3>
                  <p className="text-xs text-slate-400 max-w-[40ch] mx-auto">
                    Once you apply the migration SQL in your Supabase SQL Editor, refresh this page to access full University CRUD actions.
                  </p>
                </div>
              </div>
            )}

            {!uniLoading && uniTableExists === true && (
              <>
                {uniError && (uniError.includes("website") || uniError.includes("column") || uniError.includes("status")) ? (
                  <Card outerClassName="border-amber-200" className="bg-amber-50/10 mb-4">
                    <div className="flex items-center gap-2.5 mb-2">
                      <Warning size={18} className="text-amber-600" weight="fill" />
                      <CardTitle className="text-xs uppercase tracking-wider text-amber-800">Schema Upgrade Required</CardTitle>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed mb-3">
                      The universities table exists but is missing the required columns <code>website</code> or <code>status</code>. Execute this SQL query in your Supabase console to upgrade your table:
                    </p>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed select-all">
                      <pre>{`ALTER TABLE public.universities ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.universities ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';`}</pre>
                    </div>
                  </Card>
                ) : null}

                {universities.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-hairline rounded-2xl text-slate-400 text-xs font-semibold">
                    No university records found. Click "Add University" to seed data.
                  </div>
                ) : (
                  <div className="border border-hairline rounded-2xl overflow-x-auto bg-white">
                    <table className="w-full text-left border-collapse text-xs min-w-[600px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-hairline text-slate-500 font-bold uppercase tracking-wider">
                          <th className="p-4">University Name</th>
                          <th className="p-4">Country</th>
                          <th className="p-4">Website</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hairline">
                        {universities.map((uni) => (
                          <tr key={uni.id} className="hover:bg-subtle-gray/30">
                            <td className="p-4 font-semibold text-primary">{uni.name}</td>
                            <td className="p-4">{uni.country}</td>
                            <td className="p-4">
                              {uni.website ? (
                                <a 
                                  href={uni.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-primary hover:underline flex items-center gap-1 font-mono-data text-[10px]"
                                >
                                  {uni.website} <ArrowSquareOut size={10} />
                                </a>
                              ) : (
                                <span className="text-slate-400">N/A</span>
                              )}
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                uni.status === "Active" || !uni.status
                                  ? "bg-green-50 text-green-600 border border-green-100"
                                  : "bg-slate-50 text-slate-500 border border-slate-200"
                              }`}>
                                {uni.status || "Active"}
                              </span>
                            </td>
                            <td className="p-4 text-right flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingUni(uni);
                                  setUniForm({
                                    name: uni.name,
                                    country: uni.country,
                                    website: uni.website || "",
                                    status: uni.status || "Active"
                                  });
                                  setIsUniModalOpen(true);
                                }}
                                className="p-1 text-slate-500 hover:text-primary hover:bg-slate-50 rounded transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Eye size={16} />
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
                )}
              </>
            )}
          </section>
        )}

        {activeTab === "cms" && (
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-2xl text-primary">CMS Articles</h2>
                <p className="text-xs text-slate-400 mt-1">Manage educational blogs and student visa success story publications.</p>
              </div>
              {postsTableExists && (
                <Button 
                  onClick={() => {
                    setEditingPost(null);
                    setPostForm({
                      title: "",
                      content: "",
                      excerpt: "",
                      category: "Blog",
                      student_name: "",
                      university_placed: "",
                      visa_year: new Date().getFullYear().toString(),
                      published: false
                    });
                    setIsPostModalOpen(true);
                  }}
                  variant="primary" 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <Plus size={14} /> New Post
                </Button>
              )}
            </div>

            {/* Filter Tabs */}
            {postsTableExists && (
              <div className="flex border-b border-hairline gap-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                {(["All", "Blog", "Success Story"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setCmsTab(tab)}
                    className={`py-2 px-1 border-b-2 cursor-pointer transition-all ${
                      cmsTab === tab ? "border-primary text-primary" : "border-transparent hover:text-primary"
                    }`}
                  >
                    {tab} Posts
                  </button>
                ))}
              </div>
            )}

            {cmsLoading && (
              <div className="text-center py-12 text-slate-400 text-xs font-semibold">Loading CMS data...</div>
            )}

            {!cmsLoading && postsTableExists === false && (
              <div className="flex flex-col gap-6">
                <Card outerClassName="border-amber-200" className="bg-amber-50/10">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                      <Warning size={18} weight="fill" />
                    </div>
                    <CardTitle className="text-sm uppercase tracking-wider text-amber-800">Table Missing Warning</CardTitle>
                  </div>
                  <p className="text-xs md:text-sm text-slate-700 leading-relaxed mb-4">
                    The Supabase connection is successful, but the table <strong>public.posts</strong> does not exist in your database schema.
                  </p>
                  
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed select-all">
                    <pre>{`-- SQL Migration Code
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image TEXT,
    category TEXT NOT NULL, -- "Blog", "Success Story"
    student_name TEXT,
    university_placed TEXT,
    visa_year INTEGER,
    published BOOLEAN DEFAULT false,
    author TEXT DEFAULT 'Annex Team',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and policies
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on published posts" ON public.posts FOR SELECT USING (published = true);
CREATE POLICY "Allow admin operations on posts" ON public.posts FOR ALL TO authenticated USING (true) WITH CHECK (true);`}</pre>
                  </div>
                </Card>

                {/* Local Fallback Layout */}
                <div className="border border-dashed border-hairline p-12 rounded-2xl text-center">
                  <FileText size={32} className="text-slate-300 mx-auto mb-3" />
                  <h3 className="font-display font-semibold text-sm text-slate-500 mb-1">CMS Placeholder Dashboard</h3>
                  <p className="text-xs text-slate-400 max-w-[40ch] mx-auto">
                    Once you apply the schema SQL in your Supabase console, refresh this page to load details.
                  </p>
                </div>
              </div>
            )}

            {!cmsLoading && postsTableExists === true && (
              <>
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-hairline rounded-2xl text-slate-400 text-xs font-semibold">
                    No articles found matching filters. Create your first post!
                  </div>
                ) : (
                  <div className="border border-hairline rounded-2xl overflow-x-auto bg-white">
                    <table className="w-full text-left border-collapse text-xs min-w-[650px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-hairline text-slate-500 font-bold uppercase tracking-wider">
                          <th className="p-4">Article Title</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Author</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hairline">
                        {filteredPosts.map((post) => (
                          <tr key={post.id} className="hover:bg-subtle-gray/30">
                            <td className="p-4 font-semibold text-primary">
                              {post.title}<br />
                              <span className="text-[10px] text-slate-400 font-normal">slug: {post.slug}</span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                post.category === "Success Story" 
                                  ? "bg-purple-50 text-purple-600 border border-purple-100" 
                                  : "bg-blue-50 text-blue-600 border border-blue-100"
                              }`}>
                                {post.category}
                              </span>
                            </td>
                            <td className="p-4">{post.author}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                post.published
                                  ? "bg-green-50 text-green-600 border border-green-100"
                                  : "bg-yellow-50 text-yellow-600 border border-yellow-100"
                              }`}>
                                {post.published ? "Published" : "Draft"}
                              </span>
                            </td>
                            <td className="p-4 text-right flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingPost(post);
                                  setPostForm({
                                    title: post.title,
                                    content: post.content,
                                    excerpt: post.excerpt || "",
                                    category: post.category,
                                    student_name: post.student_name || "",
                                    university_placed: post.university_placed || "",
                                    visa_year: (post.visa_year || new Date().getFullYear()).toString(),
                                    published: post.published
                                  });
                                  setIsPostModalOpen(true);
                                }}
                                className="p-1 text-slate-500 hover:text-primary hover:bg-slate-50 rounded transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleDeletePost(post.id)}
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
              </>
            )}
          </section>
        )}
      </div>

      {/* MODAL 1: View Booking Notes Dialog */}
      {isNotesModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="max-w-2xl w-full p-6 relative bg-white shadow-2xl">
            <button 
              onClick={() => setIsNotesModalOpen(false)}
              className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-2 mb-6 border-b border-hairline pb-4">
              <FileText size={22} className="text-primary" />
              <div>
                <CardTitle className="text-lg">Consultation Request Details</CardTitle>
                <CardDescription className="text-xs">Submission ID: {selectedBooking.id}</CardDescription>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Student Name</label>
                <p className="text-sm font-semibold text-primary">{selectedBooking.name}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status</label>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedBooking.status === "Confirmed"
                    ? "bg-green-50 text-green-600 border border-green-100"
                    : selectedBooking.status === "Cancelled"
                    ? "bg-red-50 text-red-600 border border-red-100"
                    : "bg-yellow-50 text-yellow-600 border border-yellow-100"
                }`}>
                  {selectedBooking.status}
                </span>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email</label>
                <p className="text-sm font-mono-data text-slate-600">{selectedBooking.email}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone</label>
                <p className="text-sm font-mono-data text-slate-600">{selectedBooking.phone}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Preferred Date/Time</label>
                <p className="text-sm text-slate-600">{selectedBooking.preferred_date} @ {selectedBooking.preferred_time}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Study Level & Destination</label>
                <p className="text-sm text-slate-600">{selectedBooking.study_level} to {selectedBooking.destination}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Notes & Academic Background</label>
              <div className="p-4 bg-slate-50 border border-hairline rounded-xl text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                {selectedBooking.notes || "No additional information provided."}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 border-t border-hairline pt-4">
              {selectedBooking.status !== "Confirmed" && (
                <Button 
                  onClick={() => {
                    updateStatus(selectedBooking.id, "Confirmed");
                    setSelectedBooking(prev => prev ? { ...prev, status: "Confirmed" } : null);
                  }} 
                  variant="primary" 
                  size="sm"
                >
                  Confirm Booking
                </Button>
              )}
              {selectedBooking.status !== "Cancelled" && (
                <Button 
                  onClick={() => {
                    updateStatus(selectedBooking.id, "Cancelled");
                    setSelectedBooking(prev => prev ? { ...prev, status: "Cancelled" } : null);
                  }} 
                  variant="secondary" 
                  size="sm"
                >
                  Cancel Booking
                </Button>
              )}
              <Button onClick={() => setIsNotesModalOpen(false)} variant="ghost" size="sm">Close</Button>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL 2: Add/Edit University Dialog */}
      {isUniModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="max-w-md w-full p-6 relative bg-white shadow-2xl">
            <button 
              onClick={() => setIsUniModalOpen(false)}
              className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-2 mb-6 border-b border-hairline pb-4">
              <Globe size={22} className="text-primary" />
              <div>
                <CardTitle className="text-lg">{editingUni ? "Edit University" : "Add New University"}</CardTitle>
                <CardDescription className="text-xs">Provide official placement partner information below.</CardDescription>
              </div>
            </div>

            <form onSubmit={handleSaveUni} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="uniName" className="text-[10px] font-bold text-primary uppercase tracking-wider">University Name *</label>
                <input 
                  type="text" 
                  id="uniName"
                  value={uniForm.name}
                  onChange={(e) => setUniForm({ ...uniForm, name: e.target.value })}
                  placeholder="e.g. University of Greenwich"
                  className="px-3 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="uniCountry" className="text-[10px] font-bold text-primary uppercase tracking-wider">Country *</label>
                <input 
                  type="text" 
                  id="uniCountry"
                  value={uniForm.country}
                  onChange={(e) => setUniForm({ ...uniForm, country: e.target.value })}
                  placeholder="e.g. United Kingdom"
                  className="px-3 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="uniWebsite" className="text-[10px] font-bold text-primary uppercase tracking-wider">Website URL</label>
                <input 
                  type="url" 
                  id="uniWebsite"
                  value={uniForm.website}
                  onChange={(e) => setUniForm({ ...uniForm, website: e.target.value })}
                  placeholder="e.g. https://www.gre.ac.uk"
                  className="px-3 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="uniStatus" className="text-[10px] font-bold text-primary uppercase tracking-wider">Status</label>
                <select
                  id="uniStatus"
                  value={uniForm.status}
                  onChange={(e) => setUniForm({ ...uniForm, status: e.target.value })}
                  className="px-3 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 border-t border-hairline pt-4 mt-2">
                <Button type="submit" variant="primary" size="sm">
                  {uniLoading ? "Saving..." : "Save Record"}
                </Button>
                <Button type="button" onClick={() => setIsUniModalOpen(false)} variant="ghost" size="sm">Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* MODAL 3: Add/Edit CMS Post Dialog */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="max-w-lg w-full p-6 relative bg-white shadow-2xl">
            <button 
              onClick={() => setIsPostModalOpen(false)}
              className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-2 mb-6 border-b border-hairline pb-4">
              <FileText size={22} className="text-primary" />
              <div>
                <CardTitle className="text-lg">{editingPost ? "Edit CMS Article" : "Create CMS Article"}</CardTitle>
                <CardDescription className="text-xs">Publish a new blog or success story to the public grids.</CardDescription>
              </div>
            </div>

            <form onSubmit={handleSavePost} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="postTitle" className="text-[10px] font-bold text-primary uppercase tracking-wider">Title *</label>
                <input 
                  type="text" 
                  id="postTitle"
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                  placeholder="e.g. Navigating Visa Options for Australia in 2026"
                  className="px-3 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="postCategory" className="text-[10px] font-bold text-primary uppercase tracking-wider">Category</label>
                <select
                  id="postCategory"
                  value={postForm.category}
                  onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                  className="px-3 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white cursor-pointer"
                >
                  <option value="Blog">Blog Post</option>
                  <option value="Success Story">Success Story</option>
                </select>
              </div>

              {postForm.category === "Success Story" && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="studentName" className="text-[10px] font-bold text-primary uppercase tracking-wider">Student Name *</label>
                    <input 
                      type="text" 
                      id="studentName"
                      value={postForm.student_name}
                      onChange={(e) => setPostForm({ ...postForm, student_name: e.target.value })}
                      placeholder="e.g. Aarav Sharma"
                      className="px-3 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white"
                      required={postForm.category === "Success Story"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="uniPlaced" className="text-[10px] font-bold text-primary uppercase tracking-wider">University *</label>
                    <input 
                      type="text" 
                      id="uniPlaced"
                      value={postForm.university_placed}
                      onChange={(e) => setPostForm({ ...postForm, university_placed: e.target.value })}
                      placeholder="e.g. Uni of Melbourne"
                      className="px-3 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white"
                      required={postForm.category === "Success Story"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="visaYear" className="text-[10px] font-bold text-primary uppercase tracking-wider">Visa Year *</label>
                    <input 
                      type="number" 
                      id="visaYear"
                      value={postForm.visa_year}
                      onChange={(e) => setPostForm({ ...postForm, visa_year: e.target.value })}
                      placeholder="2026"
                      className="px-3 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white"
                      required={postForm.category === "Success Story"}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="postExcerpt" className="text-[10px] font-bold text-primary uppercase tracking-wider">Summary Excerpt</label>
                <input 
                  type="text" 
                  id="postExcerpt"
                  value={postForm.excerpt}
                  onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                  placeholder="Short one-line description of the post..."
                  className="px-3 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="postContent" className="text-[10px] font-bold text-primary uppercase tracking-wider">Content Body *</label>
                <textarea 
                  id="postContent"
                  value={postForm.content}
                  onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                  placeholder="Write full article here..."
                  className="px-3 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white min-h-[120px] resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="postPublished"
                  checked={postForm.published}
                  onChange={(e) => setPostForm({ ...postForm, published: e.target.checked })}
                  className="w-4 h-4 text-primary border-hairline rounded focus:ring-primary/20 cursor-pointer"
                />
                <label htmlFor="postPublished" className="text-xs font-bold text-primary uppercase tracking-wider cursor-pointer">
                  Publish Article (make visible publicly)
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-hairline pt-4 mt-2">
                <Button type="submit" variant="primary" size="sm">
                  {cmsLoading ? "Saving..." : "Save Article"}
                </Button>
                <Button type="button" onClick={() => setIsPostModalOpen(false)} variant="ghost" size="sm">Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </main>
  );
}
