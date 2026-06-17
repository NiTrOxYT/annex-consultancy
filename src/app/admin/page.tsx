"use client";

import * as React from "react";
import { 
  Sparkle, ShieldCheck, SignOut, Trash, Plus, FileText, 
  Calendar, Users, Eye, CheckCircle, XCircle, ChartBar, 
  Download, MagnifyingGlass, Funnel, ArrowSquareOut, Globe, 
  Warning, Check, X, SpinnerGap, GraduationCap, Star, Copy,
  User, Paperclip, PaperPlaneRight, Gear, UploadSimple, Lock, Clock, Checks,
  ChatCircleDots
} from "@phosphor-icons/react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
const sessionlessClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

const STAGES = [
  "Consultation",
  "Documents Collection",
  "University Shortlisting",
  "Application Submission",
  "Offer Letter Received",
  "Tuition Payment",
  "Visa Processing",
  "Visa Approved",
  "Enrolled"
];

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
  const [activeTab, setActiveTab] = React.useState<"bookings" | "universities" | "blog" | "stories" | "students" | "chat" | "counselors">("bookings");

  // Loaders & table existence flags
  const [loading, setLoading] = React.useState(false);
  const [uniTableExists, setUniTableExists] = React.useState<boolean | null>(null);
  const [postsTableExists, setPostsTableExists] = React.useState<boolean | null>(null);
  const [storiesTableExists, setStoriesTableExists] = React.useState<boolean | null>(null);

  // Student Portal Tab states
  const [students, setStudents] = React.useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = React.useState<any | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = React.useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = React.useState(false);
  const [editingStudent, setEditingStudent] = React.useState<any | null>(null);
  const [studentSearch, setStudentSearch] = React.useState("");
  const [studentDestFilter, setStudentDestFilter] = React.useState("All");
  const [studentStatusFilter, setStudentStatusFilter] = React.useState("All");
  const [pendingDocsCount, setPendingDocsCount] = React.useState(0);

  // Admin Chat Center states
  const [conversations, setConversations] = React.useState<any[]>([]);
  const [activeChatStudentId, setActiveChatStudentId] = React.useState<string | null>(null);
  const [chatCenterMessages, setChatCenterMessages] = React.useState<any[]>([]);
  const [chatCenterSearch, setChatCenterSearch] = React.useState("");
  const [sendingAdminChat, setSendingAdminChat] = React.useState(false);
  const [adminChatText, setAdminChatText] = React.useState("");
  const [adminChatFile, setAdminChatFile] = React.useState<File | null>(null);
  const [chatCenterHasMore, setChatCenterHasMore] = React.useState(false);

  // Audit modal internal states
  const [auditTab, setAuditTab] = React.useState<"progress" | "documents" | "offers" | "visa" | "chat" | "logs">("progress");
  const [auditTasks, setAuditTasks] = React.useState<any[]>([]);
  const [auditDocs, setAuditDocs] = React.useState<any[]>([]);
  const [auditOffers, setAuditOffers] = React.useState<any[]>([]);
  const [auditVisa, setAuditVisa] = React.useState<any>(null);
  const [auditMessages, setAuditMessages] = React.useState<any[]>([]);
  const [auditLogs, setAuditLogs] = React.useState<any[]>([]);

  // Task creation/editing state in audit sheet
  const [newTaskTitle, setNewTaskTitle] = React.useState("");
  const [newTaskDesc, setNewTaskDesc] = React.useState("");
  const [addingTask, setAddingTask] = React.useState(false);

  // Document feedback input state in audit sheet
  const [docFeedbackId, setDocFeedbackId] = React.useState<string | null>(null);
  const [docFeedbackText, setDocFeedbackText] = React.useState("");

  // Offer letter upload state in audit sheet
  const [adminOfferType, setAdminOfferType] = React.useState("Conditional Offer");
  const [adminOfferFile, setAdminOfferFile] = React.useState<File | null>(null);
  const [uploadingOffer, setUploadingOffer] = React.useState(false);

  // Visa stage modification state in audit sheet
  const [adminVisaStatus, setAdminVisaStatus] = React.useState("Application Started");
  const [adminVisaDetails, setAdminVisaDetails] = React.useState("");
  const [updatingVisa, setUpdatingVisa] = React.useState(false);

  // Chat reply state in audit sheet
  const [adminReplyText, setAdminReplyText] = React.useState("");
  const [adminReplyFile, setAdminReplyFile] = React.useState<File | null>(null);
  const [sendingReply, setSendingReply] = React.useState(false);

  // Student Creation/Editing Form
  const [studentForm, setStudentForm] = React.useState({
    name: "",
    email: "",
    password: "", // Only for new student creation
    phone: "",
    destination: "UK",
    intake: "",
    counselor: "Annex Counselor",
    counselor_id: "",
    status: "Active",
    academic_details: "",
    preferred_course: "",
    emergency_contact: "",
    passport_details: "",
    current_stage: "Consultation"
  });
  const [savingStudent, setSavingStudent] = React.useState(false);

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

  // System Health States
  const [healthStatus, setHealthStatus] = React.useState({
    supabase: "checking", // "connected" | "failed" | "checking"
    realtime: "checking", // "connected" | "failed" | "checking"
    email: "checking",    // "connected" | "failed" | "checking"
    emailProviderName: "", // "Resend", "Brevo", or "Mocked (Local Console)"
    storage: "checking",   // "connected" | "failed" | "checking"
  });

  // Counselor Management States
  const [counselors, setCounselors] = React.useState<any[]>([]);
  const [isCounselorModalOpen, setIsCounselorModalOpen] = React.useState(false);
  const [editingCounselor, setEditingCounselor] = React.useState<any | null>(null);
  const [counselorForm, setCounselorForm] = React.useState({
    full_name: "",
    email: "",
    phone: "",
    designation: "",
    avatar_url: "",
    is_active: true
  });
  const [savingCounselor, setSavingCounselor] = React.useState(false);
  const [uploadingCounselorAvatar, setUploadingCounselorAvatar] = React.useState(false);

  // Messaging Center filter states
  const [chatCounselorFilter, setChatCounselorFilter] = React.useState("All");
  const [chatActiveOnlyFilter, setChatActiveOnlyFilter] = React.useState(false);

  const checkSystemHealth = React.useCallback(async () => {
    // 1. Supabase Check
    let supabaseStatus = "connected";
    try {
      const { error } = await supabase.from("students").select("id").limit(1);
      if (error) throw error;
    } catch (err) {
      console.error("[Diagnostic] Health check: Supabase connection failed", err);
      supabaseStatus = "failed";
    }

    // 2. Storage Check
    let storageStatus = "connected";
    try {
      const { error } = await supabase.storage.from("student-files").list("", { limit: 1 });
      if (error) throw error;
    } catch (err) {
      console.error("[Diagnostic] Health check: Supabase Storage list failed", err);
      storageStatus = "failed";
    }

    // 3. Email Check via POST /api/send-chat-notification (action: "health")
    let emailStatus = "connected";
    let providerName = "Mocked (Local Console)";
    try {
      const res = await fetch("/api/send-chat-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "health" }),
      });
      if (!res.ok) throw new Error("HTTP error " + res.status);
      const data = await res.json();
      if (data.success) {
        providerName = data.provider;
      } else {
        emailStatus = "failed";
      }
    } catch (err) {
      console.error("[Diagnostic] Health check: Email API connection failed", err);
      emailStatus = "failed";
    }

    setHealthStatus(prev => ({
      ...prev,
      supabase: supabaseStatus,
      email: emailStatus,
      emailProviderName: providerName,
      storage: storageStatus,
    }));
  }, []);

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

  const fetchConversations = React.useCallback(async () => {
    try {
      const { data: convs, error: convErr } = await supabase
        .from("student_conversations")
        .select(`
          *,
          students (
            name,
            email,
            counselor,
            counselor_id,
            status,
            counselors (
              full_name,
              email,
              designation
            )
          )
        `)
        .order("last_activity_at", { ascending: false });

      if (convErr) throw convErr;

      const { data: studs, error: studErr } = await supabase
        .from("students")
        .select(`
          id,
          name,
          email,
          counselor,
          counselor_id,
          status,
          created_at,
          counselors (
            full_name,
            email,
            designation
          )
        `)
        .eq("status", "Active");

      if (studErr) throw studErr;

      const studentMap = new Map(studs?.map(s => [s.id, s]) || []);
      
      const mergedConvs = (convs || []).map(c => {
        studentMap.delete(c.student_id);
        return {
          ...c,
          student: c.students
        };
      });

      studentMap.forEach(s => {
        mergedConvs.push({
          student_id: s.id,
          last_message: "No messages yet",
          last_sender_type: null,
          last_activity_at: s.created_at || new Date(0).toISOString(),
          unread_count_admin: 0,
          unread_count_student: 0,
          student: s
        });
      });

      mergedConvs.sort((a, b) => new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime());
      setConversations(mergedConvs);
    } catch (err: any) {
      console.error("Error fetching conversations:", err.message);
    }
  }, []);

  const loadAdminChatMessages = React.useCallback(async (studentIdVal: string, offsetVal = 0) => {
    try {
      const { data, error } = await supabase
        .from("student_messages")
        .select(`
          *,
          message_attachments (*)
        `)
        .eq("student_id", studentIdVal)
        .order("created_at", { ascending: false })
        .range(offsetVal, offsetVal + 20 - 1);

      if (error) throw error;

      const newMsgs = data || [];
      const hasMore = newMsgs.length === 20;
      setChatCenterHasMore(hasMore);

      const reversedNewMsgs = [...newMsgs].reverse();

      if (offsetVal > 0) {
        setChatCenterMessages(prev => [...reversedNewMsgs, ...prev]);
      } else {
        setChatCenterMessages(reversedNewMsgs);
      }
    } catch (err: any) {
      console.error("Error loading admin chat messages:", err.message);
    }
  }, []);

  const markAdminMessagesAsRead = React.useCallback(async (studentIdVal: string) => {
    try {
      await supabase
        .from("student_messages")
        .update({ status: "read" })
        .eq("student_id", studentIdVal)
        .eq("sender_type", "student")
        .neq("status", "read");

      await supabase
        .from("student_conversations")
        .update({ unread_count_admin: 0 })
        .eq("student_id", studentIdVal);

      fetchConversations();
    } catch (err: any) {
      console.error("Error updating unread count:", err.message);
    }
  }, [fetchConversations]);

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

    // 5. Fetch Students
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*, counselors(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setStudents(data || []);

      // Count documents pending review
      const { count: docsCount } = await supabase
        .from("student_documents")
        .select("*", { count: "exact", head: true })
        .eq("status", "Pending Review");
      setPendingDocsCount(docsCount || 0);

    } catch (err: any) {
      console.error("Error loading students/counts:", err.message);
    }
    
    // 6. Fetch Chat Conversations
    try {
      await fetchConversations();
    } catch (err: any) {
      console.error("Error loading chat conversations in fetchAllData:", err.message);
    }

    // 7. Fetch Counselors
    try {
      const { data, error } = await supabase
        .from("counselors")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setCounselors(data || []);
    } catch (err: any) {
      console.error("Error loading counselors:", err.message);
    }
    
    setLoading(false);
  }, [fetchConversations]);

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, fetchAllData]);

  // System Health check and realtime diagnostics subscription
  React.useEffect(() => {
    if (!isAuthenticated) return;

    checkSystemHealth();

    console.log(`[Diagnostic] Initializing admin health check channel`);
    const healthChannel = supabase
      .channel("admin_health_check")
      .on("system" as any, { event: "presence" }, () => {})
      .subscribe((status, err) => {
        console.log(`[Diagnostic] Realtime health check channel connection status change: ${status}`);
        if (status === "SUBSCRIBED") {
          setHealthStatus(prev => ({ ...prev, realtime: "connected" }));
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error(`[Diagnostic] Realtime health check connection error:`, err);
          setHealthStatus(prev => ({ ...prev, realtime: "failed" }));
        }
      });

    return () => {
      console.log(`[Diagnostic] Cleaning up admin health check channel`);
      supabase.removeChannel(healthChannel);
    };
  }, [isAuthenticated, checkSystemHealth]);

  // Realtime subscription for Chat Center
  React.useEffect(() => {
    if (activeTab !== "chat" || !isAuthenticated) return;

    console.log(`[Diagnostic] Subscribing to admin realtime channels`);
    // 1. Subscribe to student_messages realtime events
    const messagesChannel = supabase
      .channel("admin_chat_messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "student_messages" },
        async (payload) => {
          console.log(`[Diagnostic] Admin received realtime message event: ${payload.eventType}`, payload);
          if (payload.eventType === "INSERT") {
            const newMsg = payload.new;
            const { data: atts } = await supabase
              .from("message_attachments")
              .select("*")
              .eq("message_id", newMsg.id);
            newMsg.message_attachments = atts || [];

            if (activeChatStudentId && newMsg.student_id === activeChatStudentId) {
              setChatCenterMessages(prev => {
                // Filter out duplicate IDs or matching optimistic messages
                const filtered = prev.filter(m => {
                  if (m.is_optimistic && m.sender_type === newMsg.sender_type && m.message === newMsg.message) {
                    console.log(`[Diagnostic] De-duplicating matched admin optimistic message`);
                    return false;
                  }
                  if (m.id === newMsg.id) return false;
                  return true;
                });
                return [...filtered, newMsg];
              });
              await markAdminMessagesAsRead(activeChatStudentId);
            }
            fetchConversations();
          } else if (payload.eventType === "UPDATE") {
            const updatedMsg = payload.new;
            const { data: atts } = await supabase
              .from("message_attachments")
              .select("*")
              .eq("message_id", updatedMsg.id);
            updatedMsg.message_attachments = atts || [];

            if (activeChatStudentId && updatedMsg.student_id === activeChatStudentId) {
              setChatCenterMessages(prev => prev.map(m => m.id === updatedMsg.id ? { ...m, ...updatedMsg } : m));
            }
            fetchConversations();
          } else if (payload.eventType === "DELETE") {
            const deletedId = payload.old.id;
            setChatCenterMessages(prev => prev.filter(m => m.id !== deletedId));
            fetchConversations();
          }
        }
      )
      .subscribe((status, err) => {
        console.log(`[Diagnostic] Realtime messagesChannel status: ${status}`);
        if (err) console.error(`[Diagnostic] Realtime messagesChannel error:`, err);
      });

    // 2. Subscribe to student_conversations realtime events
    const conversationsChannel = supabase
      .channel("admin_conversations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "student_conversations" },
        () => {
          fetchConversations();
        }
      )
      .subscribe((status, err) => {
        console.log(`[Diagnostic] Realtime conversationsChannel status: ${status}`);
        if (err) console.error(`[Diagnostic] Realtime conversationsChannel error:`, err);
      });

    return () => {
      console.log(`[Diagnostic] Unsubscribing from admin realtime channels`);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(conversationsChannel);
    };
  }, [activeTab, isAuthenticated, activeChatStudentId, fetchConversations, markAdminMessagesAsRead]);

  // Mark messages as read when a conversation is opened in Chat Center
  React.useEffect(() => {
    if (activeTab === "chat" && activeChatStudentId) {
      loadAdminChatMessages(activeChatStudentId);
      markAdminMessagesAsRead(activeChatStudentId);
    }
  }, [activeTab, activeChatStudentId, markAdminMessagesAsRead]);

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
      alert("Error deleting success story: " + err.message);
    }
  };

  // ----------------------------------------------------
  // STUDENT PORTAL ADMIN ACTIONS
  // ----------------------------------------------------
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStudent(true);
    try {
      if (editingStudent) {
        // Update existing student
        const { error } = await supabase
          .from("students")
          .update({
            name: studentForm.name,
            phone: studentForm.phone,
            destination: studentForm.destination,
            intake: studentForm.intake,
            counselor: studentForm.counselor,
            counselor_id: studentForm.counselor_id || null,
            status: studentForm.status,
            academic_details: studentForm.academic_details,
            preferred_course: studentForm.preferred_course,
            emergency_contact: studentForm.emergency_contact,
            passport_details: studentForm.passport_details,
            current_stage: studentForm.current_stage,
            last_activity: new Date().toISOString()
          })
          .eq("id", editingStudent.id);
        
        if (error) throw error;
        
        // Log admin action
        await supabase.from("student_activity_logs").insert({
          student_id: editingStudent.id,
          action: "Profile Edited by Admin",
          details: `Admin updated fields. Counselor assigned: ${studentForm.counselor}.`
        });

        showToast("Student profile updated successfully");
      } else {
        // Create new student
        if (!studentForm.password) {
          throw new Error("Password is required for new students.");
        }

        // 1. Sign up via sessionless client so admin is NOT logged out!
        const { data: authData, error: authError } = await sessionlessClient.auth.signUp({
          email: studentForm.email,
          password: studentForm.password
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("Could not create user account in Supabase Auth.");

        const studentId = authData.user.id;

        // 2. Insert profile record
        const { error: dbError } = await supabase
          .from("students")
          .insert([{
            id: studentId,
            name: studentForm.name,
            email: studentForm.email,
            phone: studentForm.phone,
            destination: studentForm.destination,
            intake: studentForm.intake,
            counselor: studentForm.counselor,
            counselor_id: studentForm.counselor_id || null,
            status: studentForm.status,
            academic_details: studentForm.academic_details,
            preferred_course: studentForm.preferred_course,
            emergency_contact: studentForm.emergency_contact,
            passport_details: studentForm.passport_details,
            current_stage: studentForm.current_stage
          }]);

        if (dbError) throw dbError;

        // 3. Initialize default visa status stage
        await supabase.from("student_visa_status").insert([{
          student_id: studentId,
          status: "Application Started",
          details: "Visa process has been initialized by counselor."
        }]);

        // 4. Log admin action
        await supabase.from("student_activity_logs").insert({
          student_id: studentId,
          action: "Account Created",
          details: "Student credentials and profile generated by Admin."
        });

        // 5. Send welcome notification
        await supabase.from("student_notifications").insert([{
          student_id: studentId,
          title: "Welcome to Annex Consultancy!",
          content: "Your student portal is ready. Check your progress and message your counselor here."
        }]);

        showToast("Student created successfully!");
      }
      setIsStudentModalOpen(false);
      setEditingStudent(null);
      fetchAllData();
    } catch (err: any) {
      alert("Error saving student: " + err.message);
    } finally {
      setSavingStudent(false);
    }
  };

  const toggleStudentStatus = async (student: any) => {
    const newStatus = student.status === "Active" ? "Disabled" : "Active";
    try {
      const { error } = await supabase
        .from("students")
        .update({ status: newStatus })
        .eq("id", student.id);
      if (error) throw error;
      
      await supabase.from("student_activity_logs").insert({
        student_id: student.id,
        action: newStatus === "Disabled" ? "Account Disabled" : "Account Enabled",
        details: "Admin updated account activation status."
      });

      showToast(`Student account marked as ${newStatus}`);
      fetchAllData();
    } catch (err: any) {
      alert("Error toggling account status: " + err.message);
    }
  };

  const resetStudentPassword = async (student: any) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(student.email, {
        redirectTo: `${window.location.origin}/student-login`
      });
      if (error) throw error;
      showToast(`Password reset email triggered for ${student.email}`);
    } catch (err: any) {
      alert("Error sending password reset: " + err.message);
    }
  };

  const loginAsStudent = (student: any) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("annex_impersonate_student_id", student.id);
      window.open("/student/dashboard", "_blank");
    }
  };

  const deleteStudent = async (studentId: string) => {
    if (!confirm("Are you sure you want to delete this student profile? This deletes all associated tasks, documents, offer letters, chat messages, and logs. (Profile deletion will cascade on Supabase).")) return;
    try {
      const { error } = await supabase.from("students").delete().eq("id", studentId);
      if (error) throw error;
      showToast("Student profile deleted successfully");
      fetchAllData();
    } catch (err: any) {
      alert("Error deleting student profile: " + err.message);
    }
  };

  const handleSaveCounselor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!counselorForm.full_name || !counselorForm.email) {
      alert("Name and Email are required.");
      return;
    }

    setSavingCounselor(true);
    try {
      if (editingCounselor) {
        // Update existing counselor
        const { error } = await supabase
          .from("counselors")
          .update({
            full_name: counselorForm.full_name,
            email: counselorForm.email,
            phone: counselorForm.phone || null,
            designation: counselorForm.designation || null,
            avatar_url: counselorForm.avatar_url || null,
            is_active: counselorForm.is_active
          })
          .eq("id", editingCounselor.id);

        if (error) throw error;
        showToast("Counselor profile updated successfully");
      } else {
        // Create new counselor
        const { error } = await supabase
          .from("counselors")
          .insert([{
            full_name: counselorForm.full_name,
            email: counselorForm.email,
            phone: counselorForm.phone || null,
            designation: counselorForm.designation || null,
            avatar_url: counselorForm.avatar_url || null,
            is_active: counselorForm.is_active
          }]);

        if (error) throw error;
        showToast("Counselor created successfully!");
      }
      setIsCounselorModalOpen(false);
      setEditingCounselor(null);
      setCounselorForm({
        full_name: "",
        email: "",
        phone: "",
        designation: "",
        avatar_url: "",
        is_active: true
      });
      fetchAllData();
    } catch (err: any) {
      alert("Error saving counselor: " + err.message);
    } finally {
      setSavingCounselor(false);
    }
  };

  const toggleCounselorStatus = async (counselor: any) => {
    const newStatus = !counselor.is_active;
    try {
      const { error } = await supabase
        .from("counselors")
        .update({ is_active: newStatus })
        .eq("id", counselor.id);
      if (error) throw error;

      showToast(`Counselor status marked as ${newStatus ? "Active" : "Inactive"}`);
      fetchAllData();
    } catch (err: any) {
      alert("Error toggling counselor status: " + err.message);
    }
  };

  const deleteCounselor = async (counselorId: string) => {
    if (!confirm("Are you sure you want to delete this counselor? Students assigned to this counselor will be set to Unassigned.")) return;
    try {
      const { error } = await supabase.from("counselors").delete().eq("id", counselorId);
      if (error) throw error;
      showToast("Counselor deleted successfully");
      fetchAllData();
    } catch (err: any) {
      alert("Error deleting counselor: " + err.message);
    }
  };

  const handleCounselorAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCounselorAvatar(true);
    try {
      const fileExt = file.name.split(".").pop();
      const randomName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `counselors/avatars/${randomName}`;

      const { error: uploadErr } = await supabase.storage
        .from("student-files")
        .upload(filePath, file);
      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage
        .from("student-files")
        .getPublicUrl(filePath);

      setCounselorForm(prev => ({ ...prev, avatar_url: publicUrl }));
      showToast("Avatar uploaded successfully");
    } catch (err: any) {
      alert("Error uploading avatar: " + err.message);
    } finally {
      setUploadingCounselorAvatar(false);
    }
  };

  const handleSendAdminChatReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminChatText.trim() && !adminChatFile || !activeChatStudentId) return;

    setSendingAdminChat(true);
    const originalText = adminChatText;
    const tempId = `temp-${Date.now()}`;
    const attachmentPlaceholderName = adminChatFile ? adminChatFile.name : null;

    // Create optimistic message
    const optimisticMsg = {
      id: tempId,
      student_id: activeChatStudentId,
      sender_type: "counselor",
      message: originalText || `Attachment: ${attachmentPlaceholderName}`,
      attachment_url: null,
      attachment_name: attachmentPlaceholderName,
      status: "sending",
      created_at: new Date().toISOString(),
      is_optimistic: true
    };

    console.log(`[Diagnostic] Admin Chat Center optimistic message added:`, optimisticMsg);
    setChatCenterMessages(prev => [...prev, optimisticMsg]);

    try {
      let attachmentUrl = null;
      let attachmentName = null;

      if (adminChatFile) {
        const fileExt = adminChatFile.name.split(".").pop();
        const randomName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${activeChatStudentId}/chat_attachments/${randomName}`;

        const { error: uploadErr } = await supabase.storage
          .from("student-files")
          .upload(filePath, adminChatFile);
        if (uploadErr) throw uploadErr;

        const { data: { publicUrl } } = supabase.storage
          .from("student-files")
          .getPublicUrl(filePath);
        attachmentUrl = publicUrl;
        attachmentName = adminChatFile.name;
      }

      const { data: newMsg, error } = await supabase
        .from("student_messages")
        .insert([{
          student_id: activeChatStudentId,
          sender_type: "counselor",
          message: originalText || `Attachment: ${attachmentName}`,
          attachment_url: attachmentUrl,
          attachment_name: attachmentName,
          status: "sent"
        }])
        .select()
        .single();
      if (error) throw error;
      console.log(`[Diagnostic] Supabase database admin insert succeeded:`, newMsg);

      if (adminChatFile && attachmentUrl && newMsg) {
        await supabase
          .from("message_attachments")
          .insert({
            message_id: newMsg.id,
            file_url: attachmentUrl,
            file_name: attachmentName,
            file_type: adminChatFile.type,
            file_size: adminChatFile.size
          });
      }

      setAdminChatText("");
      setAdminChatFile(null);
      
      // Update optimistic message with actual message returned from database
      setChatCenterMessages(prev => prev.map(m => m.id === tempId ? { ...newMsg, message_attachments: [] } : m));
      await fetchConversations();

      fetch("/api/send-chat-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          senderType: "counselor",
          studentId: activeChatStudentId,
          messageContent: originalText || `Attachment: ${attachmentName}`,
          counselorName: "Annex Counselor"
        })
      }).catch(err => console.error("Email notification error:", err));

    } catch (err: any) {
      console.error(`[Diagnostic] Supabase database admin insert failed:`, err);
      // Mark optimistic message as failed
      setChatCenterMessages(prev => prev.map(m => m.id === tempId ? { ...m, status: "failed" } : m));
      alert("Error sending reply: " + err.message);
    } finally {
      setSendingAdminChat(false);
    }
  };

  const openAuditModal = async (student: any) => {
    setSelectedStudent(student);
    setAuditTab("progress");
    setIsAuditModalOpen(true);
    await loadAuditDetails(student.id);
  };

  const loadAuditDetails = async (id: string) => {
    try {
      const { data: t } = await supabase.from("student_tasks").select("*").eq("student_id", id).order("created_at", { ascending: true });
      setAuditTasks(t || []);

      const { data: d } = await supabase.from("student_documents").select("*").eq("student_id", id).order("uploaded_at", { ascending: false });
      setAuditDocs(d || []);

      const { data: o } = await supabase.from("student_offer_letters").select("*").eq("student_id", id).order("uploaded_at", { ascending: false });
      setAuditOffers(o || []);

      const { data: v } = await supabase.from("student_visa_status").select("*").eq("student_id", id).maybeSingle();
      setAuditVisa(v);
      if (v) {
        setAdminVisaStatus(v.status);
        setAdminVisaDetails(v.details || "");
      } else {
        setAdminVisaStatus("Application Started");
        setAdminVisaDetails("");
      }

      const { data: m } = await supabase.from("student_messages").select("*").eq("student_id", id).order("created_at", { ascending: true });
      setAuditMessages(m || []);

      const { data: l } = await supabase.from("student_activity_logs").select("*").eq("student_id", id).order("created_at", { ascending: false });
      setAuditLogs(l || []);
    } catch (err: any) {
      console.error("Error loading student audit details:", err.message);
    }
  };

  // Audit Actions
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedStudent) return;
    setAddingTask(true);
    try {
      const { error } = await supabase
        .from("student_tasks")
        .insert([{
          student_id: selectedStudent.id,
          title: newTaskTitle,
          description: newTaskDesc
        }]);
      if (error) throw error;
      
      setNewTaskTitle("");
      setNewTaskDesc("");
      showToast("Task assigned successfully");
      
      await supabase.from("student_notifications").insert([{
        student_id: selectedStudent.id,
        title: "New Task Assigned",
        content: `Your counselor assigned a new task: "${newTaskTitle}"`
      }]);

      await supabase.from("student_activity_logs").insert({
        student_id: selectedStudent.id,
        action: "Task Assigned",
        details: `Task: ${newTaskTitle}`
      });

      await loadAuditDetails(selectedStudent.id);
    } catch (err: any) {
      alert("Error adding task: " + err.message);
    } finally {
      setAddingTask(false);
    }
  };

  const approveTask = async (taskId: string, title: string) => {
    try {
      const { error } = await supabase
        .from("student_tasks")
        .update({ approved: true })
        .eq("id", taskId);
      if (error) throw error;
      showToast("Task completion approved");

      await supabase.from("student_notifications").insert([{
        student_id: selectedStudent.id,
        title: "Task Approved",
        content: `Your counselor verified and approved: "${title}"`
      }]);

      await supabase.from("student_activity_logs").insert({
        student_id: selectedStudent.id,
        action: "Task Approved",
        details: `Task: ${title}`
      });

      await loadAuditDetails(selectedStudent.id);
    } catch (err: any) {
      alert("Error approving task: " + err.message);
    }
  };

  const updateDocStatus = async (docId: string, status: string, feedback: string = "") => {
    try {
      const { error } = await supabase
        .from("student_documents")
        .update({ status, feedback: feedback || null })
        .eq("id", docId);
      if (error) throw error;
      showToast(`Document marked as ${status}`);

      const docRecord = auditDocs.find(d => d.id === docId);
      await supabase.from("student_notifications").insert([{
        student_id: selectedStudent.id,
        title: `Document ${status}`,
        content: `Your upload for "${docRecord?.document_type}" was marked as ${status}.`
      }]);

      await supabase.from("student_activity_logs").insert({
        student_id: selectedStudent.id,
        action: `Document ${status}`,
        details: `Document type: ${docRecord?.document_type}. Feedback: ${feedback || "None"}`
      });

      setDocFeedbackId(null);
      setDocFeedbackText("");
      await loadAuditDetails(selectedStudent.id);
    } catch (err: any) {
      alert("Error updating document status: " + err.message);
    }
  };

  const handleUploadOfferLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminOfferFile || !selectedStudent) return;
    setUploadingOffer(true);
    try {
      const fileExt = adminOfferFile.name.split(".").pop();
      const randomName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${selectedStudent.id}/offers/${adminOfferType.toLowerCase().replace(/[^a-z0-9]+/g, "-")}_${randomName}`;

      const { error: uploadErr } = await supabase.storage
        .from("student-files")
        .upload(filePath, adminOfferFile);
      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage
        .from("student-files")
        .getPublicUrl(filePath);

      const { error: dbErr } = await supabase
        .from("student_offer_letters")
        .insert([{
          student_id: selectedStudent.id,
          letter_type: adminOfferType,
          file_url: publicUrl,
          file_name: adminOfferFile.name
        }]);
      if (dbErr) throw dbErr;

      await supabase.from("student_notifications").insert([{
        student_id: selectedStudent.id,
        title: "New Admission Offer Document",
        content: `Your counselor uploaded your "${adminOfferType}" letter.`
      }]);

      await supabase.from("student_activity_logs").insert({
        student_id: selectedStudent.id,
        action: "Offer Letter Issued",
        details: `Type: ${adminOfferType}, File: ${adminOfferFile.name}`
      });

      setAdminOfferFile(null);
      showToast("Offer letter issued successfully");
      await loadAuditDetails(selectedStudent.id);
    } catch (err: any) {
      alert("Error uploading offer letter: " + err.message);
    } finally {
      setUploadingOffer(false);
    }
  };

  const handleUpdateVisaStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setUpdatingVisa(true);
    try {
      let error;
      if (auditVisa) {
        const res = await supabase
          .from("student_visa_status")
          .update({ status: adminVisaStatus, details: adminVisaDetails, updated_at: new Date().toISOString() })
          .eq("student_id", selectedStudent.id);
        error = res.error;
      } else {
        const res = await supabase
          .from("student_visa_status")
          .insert([{ student_id: selectedStudent.id, status: adminVisaStatus, details: adminVisaDetails }]);
        error = res.error;
      }
      
      if (error) throw error;

      // Update general stage as well
      let studentStage = "Visa Processing";
      if (adminVisaStatus === "Visa Approved") {
        studentStage = "Visa Approved";
      }
      await supabase.from("students").update({ current_stage: studentStage }).eq("id", selectedStudent.id);

      await supabase.from("student_notifications").insert([{
        student_id: selectedStudent.id,
        title: "Visa Status Progressed",
        content: `Your visa application step was updated to: ${adminVisaStatus}`
      }]);

      await supabase.from("student_activity_logs").insert({
        student_id: selectedStudent.id,
        action: "Visa Stage Updated",
        details: `New Stage: ${adminVisaStatus}. Details: ${adminVisaDetails}`
      });

      showToast("Visa status timeline modified");
      await loadAuditDetails(selectedStudent.id);
    } catch (err: any) {
      alert("Error updating visa status: " + err.message);
    } finally {
      setUpdatingVisa(false);
    }
  };

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() && !adminReplyFile || !selectedStudent) return;
    setSendingReply(true);
    const originalText = adminReplyText;
    const tempId = `temp-${Date.now()}`;
    const attachmentPlaceholderName = adminReplyFile ? adminReplyFile.name : null;

    // Create optimistic message
    const optimisticMsg = {
      id: tempId,
      student_id: selectedStudent.id,
      sender_type: "counselor",
      message: originalText || `Attachment: ${attachmentPlaceholderName}`,
      attachment_url: null,
      attachment_name: attachmentPlaceholderName,
      status: "sending",
      created_at: new Date().toISOString(),
      is_optimistic: true
    };

    console.log(`[Diagnostic] Admin Audit optimistic message added:`, optimisticMsg);
    setAuditMessages(prev => [...prev, optimisticMsg]);

    try {
      let fileUrl = null;
      let fileName = null;

      if (adminReplyFile) {
        const fileExt = adminReplyFile.name.split(".").pop();
        const randomName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${selectedStudent.id}/chat_attachments/${randomName}`;

        const { error: uploadErr } = await supabase.storage
          .from("student-files")
          .upload(filePath, adminReplyFile);
        if (uploadErr) throw uploadErr;

        const { data: { publicUrl } } = supabase.storage
          .from("student-files")
          .getPublicUrl(filePath);
        fileUrl = publicUrl;
        fileName = adminReplyFile.name;
      }

      const { data: newMsg, error } = await supabase
        .from("student_messages")
        .insert([{
          student_id: selectedStudent.id,
          sender_type: "counselor",
          message: originalText || `Attachment: ${fileName}`,
          attachment_url: fileUrl,
          attachment_name: fileName,
          status: "sent"
        }])
        .select()
        .single();
      if (error) throw error;
      console.log(`[Diagnostic] Supabase database admin audit insert succeeded:`, newMsg);

      await supabase.from("student_notifications").insert([{
        student_id: selectedStudent.id,
        title: "New Message from Counselor",
        content: originalText.substring(0, 80)
      }]);

      setAdminReplyText("");
      setAdminReplyFile(null);
      showToast("Reply sent to student");

      // Replace optimistic message in state
      setAuditMessages(prev => prev.map(m => m.id === tempId ? { ...newMsg, message_attachments: [] } : m));

      // Trigger server-side email notification
      fetch("/api/send-chat-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          senderType: "counselor",
          studentId: selectedStudent.id,
          messageContent: originalText || `Attachment: ${fileName}`,
          counselorName: "Annex Counselor"
        })
      }).catch(err => console.error("Email notification error:", err));

    } catch (err: any) {
      console.error(`[Diagnostic] Supabase database admin audit insert failed:`, err);
      // Mark optimistic message as failed
      setAuditMessages(prev => prev.map(m => m.id === tempId ? { ...m, status: "failed" } : m));
      alert("Error sending reply: " + err.message);
    } finally {
      setSendingReply(false);
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
              { id: "students", label: `Students (${students.length})` },
              { id: "counselors", label: `Counselors (${counselors.length})` },
              { id: "chat", label: "Messaging" },
              { id: "universities", label: `Universities (${universities.length})` },
              { id: "blog", label: `Blog posts (${posts.length})` },
              { id: "stories", label: `Success stories (${stories.length})` }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              const unreadCount = tab.id === "chat" 
                ? conversations.reduce((sum, c) => sum + (c.unread_count_admin || 0), 0)
                : 0;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive ? "bg-primary text-white" : "text-slate-500 hover:text-primary hover:bg-slate-50"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.id === "chat" && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[15px] text-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
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

            {/* Student Portal & Counselor Overview grid */}
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Student Portal & Counselor Metrics</span>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Students", value: students.length, icon: <Users size={18} className="text-primary" weight="bold" />, bg: "bg-slate-50 border-slate-100" },
                  { label: "Total Counselors", value: counselors.length, icon: <User size={18} className="text-blue-600" weight="bold" />, bg: "bg-blue-50/20 border-blue-100/60" },
                  { label: "Active Conversations", value: conversations.filter(c => c.last_message !== "No messages yet").length, icon: <ChatCircleDots size={18} className="text-emerald-600" weight="bold" />, bg: "bg-emerald-50/20 border-emerald-100/60" },
                  { label: "Unread Messages", value: conversations.reduce((sum, c) => sum + (c.unread_count_admin || 0), 0), icon: <Clock size={18} className="text-red-600" weight="bold" />, bg: "bg-red-50/20 border-red-100/60" }
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
            </div>

            {/* Sub-panels (Quick Actions / Analytics Insights) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Quick Actions Column */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <Card>
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

                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-sm uppercase tracking-wider text-slate-400 m-0">System Health Diagnostics</CardTitle>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={checkSystemHealth} 
                      className="h-7 px-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
                    >
                      <SpinnerGap className={healthStatus.supabase === "checking" ? "animate-spin" : ""} size={12} />
                      Re-Check
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Supabase connection indicator */}
                    <div className="p-3 border border-hairline/80 rounded-xl bg-slate-50 flex items-center justify-between gap-2.5 hover:shadow-sm transition-all">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Supabase DB</span>
                        <span className="text-[9px] text-slate-400 truncate">Database API Connection</span>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          healthStatus.supabase === "connected" ? "bg-emerald-500 animate-pulse" : 
                          healthStatus.supabase === "failed" ? "bg-red-500 animate-pulse" : "bg-yellow-500 animate-bounce"
                        }`} />
                        <span className="text-[10px] font-semibold text-slate-600">
                          {healthStatus.supabase === "connected" ? "OK" : 
                           healthStatus.supabase === "failed" ? "Failed" : "Checking"}
                        </span>
                      </div>
                    </div>

                    {/* Realtime connection indicator */}
                    <div className="p-3 border border-hairline/80 rounded-xl bg-slate-50 flex items-center justify-between gap-2.5 hover:shadow-sm transition-all">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Realtime</span>
                        <span className="text-[9px] text-slate-400 truncate">Websocket Channels</span>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          healthStatus.realtime === "connected" ? "bg-emerald-500 animate-pulse" : 
                          healthStatus.realtime === "failed" ? "bg-red-500 animate-pulse" : "bg-yellow-500 animate-bounce"
                        }`} />
                        <span className="text-[10px] font-semibold text-slate-600">
                          {healthStatus.realtime === "connected" ? "OK" : 
                           healthStatus.realtime === "failed" ? "Failed" : "Checking"}
                        </span>
                      </div>
                    </div>

                    {/* Email connection indicator */}
                    <div className="p-3 border border-hairline/80 rounded-xl bg-slate-50 flex items-center justify-between gap-2.5 col-span-2 hover:shadow-sm transition-all">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email Service</span>
                        <span className="text-[9px] text-slate-400 truncate">
                          {healthStatus.emailProviderName ? `Provider: ${healthStatus.emailProviderName}` : "Checking API config..."}
                        </span>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          healthStatus.email === "connected" ? "bg-emerald-500 animate-pulse" : 
                          healthStatus.email === "failed" ? "bg-red-500 animate-pulse" : "bg-yellow-500 animate-bounce"
                        }`} />
                        <span className="text-[10px] font-semibold text-slate-600">
                          {healthStatus.email === "connected" ? "Active" : 
                           healthStatus.email === "failed" ? "Failed" : "Checking"}
                        </span>
                      </div>
                    </div>

                    {/* Storage connection indicator */}
                    <div className="p-3 border border-hairline/80 rounded-xl bg-slate-50 flex items-center justify-between gap-2.5 col-span-2 hover:shadow-sm transition-all">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Storage Buckets</span>
                        <span className="text-[9px] text-slate-400 truncate">student-files bucket list</span>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          healthStatus.storage === "connected" ? "bg-emerald-500 animate-pulse" : 
                          healthStatus.storage === "failed" ? "bg-red-500 animate-pulse" : "bg-yellow-500 animate-bounce"
                        }`} />
                        <span className="text-[10px] font-semibold text-slate-600">
                          {healthStatus.storage === "connected" ? "OK" : 
                           healthStatus.storage === "failed" ? "Failed" : "Checking"}
                        </span>
                      </div>
                    </div>
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

        {activeTab === "students" && (
          <section className="flex flex-col gap-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-2xl text-primary">Student Management</h2>
                <p className="text-xs text-slate-400 mt-1">Generate login credentials, manage profiles, track visa lodgements, and review uploaded documents.</p>
              </div>
              <Button 
                onClick={() => {
                  setEditingStudent(null);
                  setStudentForm({
                    name: "",
                    email: "",
                    password: "",
                    phone: "",
                    destination: "UK",
                    intake: "",
                    counselor: "Annex Counselor",
                    counselor_id: "",
                    status: "Active",
                    academic_details: "",
                    preferred_course: "",
                    emergency_contact: "",
                    passport_details: "",
                    current_stage: "Consultation"
                  });
                  setIsStudentModalOpen(true);
                }} 
                variant="primary" 
                size="sm" 
                className="flex items-center gap-1"
              >
                <Plus size={14} /> Add Student
              </Button>
            </div>

            {/* Dashboard metrics cards */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              {[
                { label: "Total Students", value: students.length, icon: <Users size={18} className="text-primary" weight="bold" />, bg: "bg-slate-50 border-slate-100" },
                { label: "Active Students", value: students.filter(s => s.status === "Active").length, icon: <CheckCircle size={18} className="text-emerald-600" weight="bold" />, bg: "bg-emerald-50/20 border-emerald-100/60" },
                { label: "Visa Approved", value: students.filter(s => s.current_stage === "Visa Approved").length, icon: <Sparkle size={18} className="text-gold" weight="bold" />, bg: "bg-amber-50/20 border-amber-100/60" },
                { label: "Enrolled Students", value: students.filter(s => s.current_stage === "Enrolled").length, icon: <GraduationCap size={18} className="text-purple-600" weight="bold" />, bg: "bg-purple-50/20 border-purple-100/60" },
                { label: "Pending Documents", value: pendingDocsCount, icon: <FileText size={18} className="text-blue-600" weight="bold" />, bg: "bg-blue-50/20 border-blue-100/60" },
                { label: "Pending Applications", value: students.filter(s => s.current_stage === "Application Submission").length, icon: <Clock size={18} className="text-yellow-600" weight="bold" />, bg: "bg-yellow-50/20 border-yellow-100/60" }
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

            {/* Filter controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-50 border border-hairline p-4 rounded-2xl">
              <div className="flex flex-grow max-w-md items-center gap-2.5 px-3 py-2 border border-hairline rounded-xl bg-white focus-within:ring-2 focus-within:ring-primary/20">
                <MagnifyingGlass size={16} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by student name, email, phone..." 
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="text-xs w-full focus:outline-none text-slate-800 bg-transparent"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select 
                  value={studentDestFilter}
                  onChange={(e) => setStudentDestFilter(e.target.value)}
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
                  value={studentStatusFilter}
                  onChange={(e) => setStudentStatusFilter(e.target.value)}
                  className="px-3 py-1.5 border border-hairline bg-white rounded-xl text-xs text-slate-600 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
            </div>

            {/* Directory Table */}
            {loading ? (
              <div className="text-center py-12 text-slate-400 text-xs font-semibold">Loading students...</div>
            ) : students.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-hairline rounded-2xl text-slate-400 text-xs font-semibold">
                No students created yet. Click "Add Student" to create one.
              </div>
            ) : (
              <div className="border border-hairline rounded-2xl overflow-x-auto bg-white font-sans text-slate-700">
                <table className="w-full text-left border-collapse text-xs min-w-[950px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-hairline text-slate-500 font-bold uppercase tracking-wider">
                      <th className="p-4">Name</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Destination</th>
                      <th className="p-4">Intake</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Counselor</th>
                      <th className="p-4">Last Activity</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {students
                      .filter(s => {
                        const matchesSearch = 
                          s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          (s.phone && s.phone.includes(studentSearch));
                        
                        const matchesDest = studentDestFilter === "All" || s.destination === studentDestFilter;
                        const matchesStatus = studentStatusFilter === "All" || s.status === studentStatusFilter;

                        return matchesSearch && matchesDest && matchesStatus;
                      })
                      .map(student => (
                        <tr key={student.id} className="hover:bg-subtle-gray/30">
                          <td className="p-4 font-semibold text-primary">
                            {student.name}<br />
                            <span className="text-[10px] text-slate-400 font-normal">{student.email}</span>
                          </td>
                          <td className="p-4 font-mono-data text-slate-600">
                            {student.phone || "N/A"}
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-primary">{student.destination || "N/A"}</span>
                          </td>
                          <td className="p-4 font-semibold text-slate-500">
                            {student.intake || "N/A"}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              student.status === "Active"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-red-50 text-red-600 border-red-100"
                            }`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="p-4 text-slate-600 font-medium">
                            {student.counselors?.full_name || student.counselor || "Annex Counselor"}
                          </td>
                          <td className="p-4 font-mono-data text-slate-400">
                            {student.last_activity ? new Date(student.last_activity).toLocaleDateString() : "N/A"}
                          </td>
                          <td className="p-4 text-right flex justify-end gap-1.5 items-center h-full">
                            <button
                              onClick={() => openAuditModal(student)}
                              className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-50 rounded transition-colors cursor-pointer"
                              title="Audit File / View details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingStudent(student);
                                setStudentForm({
                                  name: student.name,
                                  email: student.email,
                                  password: "",
                                  phone: student.phone || "",
                                  destination: student.destination || "UK",
                                  intake: student.intake || "",
                                  counselor: student.counselor || "Annex Counselor",
                                  counselor_id: student.counselor_id || "",
                                  status: student.status || "Active",
                                  academic_details: student.academic_details || "",
                                  preferred_course: student.preferred_course || "",
                                  emergency_contact: student.emergency_contact || "",
                                  passport_details: student.passport_details || "",
                                  current_stage: student.current_stage || "Consultation"
                                });
                                setIsStudentModalOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-50 rounded transition-colors cursor-pointer"
                              title="Edit profile"
                            >
                              <Gear size={16} />
                            </button>
                            <button
                              onClick={() => loginAsStudent(student)}
                              className="px-2.5 py-1.5 bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10 rounded-full text-[10px] font-bold transition-colors cursor-pointer"
                              title="Login As Student"
                            >
                              Login As
                            </button>
                            <button
                              onClick={() => resetStudentPassword(student)}
                              className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-50 rounded transition-colors cursor-pointer"
                              title="Send Password Reset Email"
                            >
                              <Lock size={16} />
                            </button>
                            <button
                              onClick={() => toggleStudentStatus(student)}
                              className={`p-1.5 rounded transition-colors cursor-pointer ${
                                student.status === "Active" ? "text-red-500 hover:bg-red-50" : "text-emerald-500 hover:bg-emerald-50"
                              }`}
                              title={student.status === "Active" ? "Disable Account" : "Activate Account"}
                            >
                              {student.status === "Active" ? <XCircle size={16} /> : <CheckCircle size={16} />}
                            </button>
                            <button
                              onClick={() => deleteStudent(student.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title="Delete Student"
                            >
                              <Trash size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            )}

            {/* Student Analytics dashboard section */}
            <div className="mt-8">
              <h3 className="font-display font-bold text-lg text-primary mb-4">Student Analytics Insights</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Stage wise Funnel Breakdown */}
                <Card className="lg:col-span-2">
                  <CardTitle className="text-xs uppercase tracking-wider text-slate-400 mb-4">Milestone Conversion Funnel</CardTitle>
                  <div className="space-y-3.5">
                    {STAGES.map((stage) => {
                      const count = students.filter(s => s.current_stage === stage).length;
                      const maxStudents = students.length || 1;
                      const barPercent = Math.max(5, Math.round((count / maxStudents) * 100));

                      return (
                        <div key={stage} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-primary">{stage}</span>
                            <span className="font-mono-data text-slate-500">{count} students</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${barPercent}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Country breakdown & visa rates */}
                <div className="space-y-6">
                  
                  {/* Country breakdown */}
                  <Card>
                    <CardTitle className="text-xs uppercase tracking-wider text-slate-400 mb-4">Destination Countries</CardTitle>
                    <div className="space-y-2.5">
                      {(Object.entries(
                        students.reduce((acc, s) => {
                          if (s.destination) acc[s.destination] = (acc[s.destination] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ) as [string, number][])
                        .sort((a,b) => b[1] - a[1])
                        .map(([dest, count]) => (
                          <div key={dest} className="flex justify-between items-center text-xs border-b border-hairline/60 pb-2 last:border-0 last:pb-0">
                            <span className="font-semibold text-primary">{dest}</span>
                            <span className="font-mono-data text-slate-500 font-bold">{count} students</span>
                          </div>
                        ))}
                      {students.length === 0 && <span className="text-xs text-slate-400">No data.</span>}
                    </div>
                  </Card>

                  {/* Visa success metrics */}
                  <Card>
                    <CardTitle className="text-xs uppercase tracking-wider text-slate-400 mb-3">Visa Lodgement Analysis</CardTitle>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 border border-hairline rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Visa Success Rate</p>
                          <p className="text-2xl font-bold text-primary mt-1 font-display">
                            {(() => {
                              const approvedCount = students.filter(s => s.current_stage === "Visa Approved").length;
                              const processedCount = students.filter(s => ["Visa Processing", "Visa Approved", "Enrolled"].includes(s.current_stage)).length;
                              if (processedCount === 0) return "100%";
                              return `${Math.round((approvedCount / processedCount) * 100)}%`;
                            })()}
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                          <Check size={20} weight="bold" />
                        </div>
                      </div>
                    </div>
                  </Card>

                </div>

              </div>
            </div>

          </section>
        )}

        {activeTab === "counselors" && (
          <section className="flex flex-col gap-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-2xl text-primary">Counselor Directory</h2>
                <p className="text-xs text-slate-400 mt-1">Manage admissions counselors, view workload distributions, and update staff active status.</p>
              </div>
              <Button 
                onClick={() => {
                  setEditingCounselor(null);
                  setCounselorForm({
                    full_name: "",
                    email: "",
                    phone: "",
                    designation: "",
                    avatar_url: "",
                    is_active: true
                  });
                  setIsCounselorModalOpen(true);
                }} 
                variant="primary" 
                size="sm" 
                className="flex items-center gap-1"
              >
                <Plus size={14} /> Add Counselor
              </Button>
            </div>

            {/* Counselors List metrics cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Counselors", value: counselors.length, icon: <User size={18} className="text-primary" weight="bold" />, bg: "bg-slate-50 border-slate-100" },
                { label: "Active Counselors", value: counselors.filter(c => c.is_active).length, icon: <CheckCircle size={18} className="text-emerald-600" weight="bold" />, bg: "bg-emerald-50/20 border-emerald-100/60" },
                { label: "Inactive Staff", value: counselors.filter(c => !c.is_active).length, icon: <XCircle size={18} className="text-red-600" weight="bold" />, bg: "bg-red-50/20 border-red-100/60" },
                { label: "Assigned Students", value: students.filter(s => s.counselor_id).length, icon: <GraduationCap size={18} className="text-purple-600" weight="bold" />, bg: "bg-purple-50/20 border-purple-100/60" }
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

            {/* Directory Table */}
            {loading ? (
              <div className="text-center py-12 text-slate-400 text-xs font-semibold">Loading counselors...</div>
            ) : counselors.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-hairline rounded-2xl text-slate-400 text-xs font-semibold">
                No counselors created yet. Click "Add Counselor" to register staff.
              </div>
            ) : (
              <div className="border border-hairline rounded-2xl overflow-x-auto bg-white font-sans text-slate-700">
                <table className="w-full text-left border-collapse text-xs min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-hairline text-slate-500 font-bold uppercase tracking-wider">
                      <th className="p-4">Name</th>
                      <th className="p-4">Designation</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Assigned Students</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Last Activity</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {counselors.map(c => {
                      const studentCount = students.filter(s => s.counselor_id === c.id).length;
                      
                      // Calculate computed Last Activity
                      // Find student IDs assigned to this counselor
                      const assignedStudentIds = students.filter(s => s.counselor_id === c.id).map(s => s.id);
                      // Find conversations of these students
                      const counselorConversations = conversations.filter(conv => assignedStudentIds.includes(conv.student_id));
                      // Get the max last_activity_at or fall back to counselor created_at
                      const activities = counselorConversations
                        .map(conv => conv.last_activity_at ? new Date(conv.last_activity_at).getTime() : 0)
                        .filter(time => time > 0);
                      
                      const maxActivityTime = activities.length > 0 ? Math.max(...activities) : 0;
                      const lastActivityFormatted = maxActivityTime > 0 
                        ? new Date(maxActivityTime).toLocaleDateString()
                        : "No recent activity";

                      return (
                        <tr key={c.id} className="hover:bg-subtle-gray/30">
                          <td className="p-4 font-semibold text-primary">
                            <div className="flex items-center gap-3">
                              {c.avatar_url ? (
                                <img 
                                  src={c.avatar_url} 
                                  alt={c.full_name} 
                                  className="w-8 h-8 rounded-full object-cover border border-hairline shadow-sm"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center font-bold">
                                  {c.full_name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <span className="text-xs font-bold text-primary block">{c.full_name}</span>
                                <span className="text-[10px] text-slate-400 font-normal font-mono-data">{c.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-600 font-medium">{c.designation || "Counselor"}</td>
                          <td className="p-4 font-mono-data text-slate-500">{c.phone || "N/A"}</td>
                          <td className="p-4 font-bold text-primary">{studentCount} students</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              c.is_active
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-red-50 text-red-600 border-red-100"
                            }`}>
                              {c.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="p-4 font-mono-data text-slate-400">{lastActivityFormatted}</td>
                          <td className="p-4 text-right flex justify-end gap-1.5 items-center h-full">
                            <button
                              onClick={() => {
                                setEditingCounselor(c);
                                setCounselorForm({
                                  full_name: c.full_name,
                                  email: c.email,
                                  phone: c.phone || "",
                                  designation: c.designation || "",
                                  avatar_url: c.avatar_url || "",
                                  is_active: c.is_active
                                });
                                setIsCounselorModalOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-50 rounded transition-colors cursor-pointer"
                              title="Edit profile"
                            >
                              <Gear size={16} />
                            </button>
                            <button
                              onClick={() => toggleCounselorStatus(c)}
                              className={`p-1.5 rounded transition-colors cursor-pointer ${
                                c.is_active ? "text-red-500 hover:bg-red-50" : "text-emerald-500 hover:bg-emerald-50"
                              }`}
                            >
                              {c.is_active ? (
                                <span title="Disable counselor">
                                  <XCircle size={16} />
                                </span>
                              ) : (
                                <span title="Activate counselor">
                                  <CheckCircle size={16} />
                                </span>
                              )}
                            </button>
                            <button
                              onClick={() => deleteCounselor(c.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title="Delete Counselor"
                            >
                              <Trash size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === "chat" && (
          <section className="flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="font-display font-bold text-2xl text-primary">Chat Center</h2>
              <p className="text-xs text-slate-400 mt-1">Real-time messaging platform with students. Answer queries, review attachments, and manage communications.</p>
            </div>

            <div className="flex bg-white border border-hairline rounded-3xl h-[650px] overflow-hidden">
              {/* Left Panel: Conversations List */}
              <div className="w-full md:w-80 border-r border-hairline flex flex-col shrink-0 bg-slate-50/20">
                <div className="p-4 border-b border-hairline bg-slate-50/50 flex flex-col gap-2">
                  <div className="flex items-center gap-2.5 px-3 py-2 border border-hairline rounded-xl bg-white focus-within:ring-2 focus-within:ring-primary/20">
                    <MagnifyingGlass size={16} className="text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search students or messages..." 
                      value={chatCenterSearch}
                      onChange={(e) => setChatCenterSearch(e.target.value)}
                      className="text-xs w-full focus:outline-none text-slate-800 bg-transparent"
                    />
                    {chatCenterSearch && (
                      <button onClick={() => setChatCenterSearch("")} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  
                  {/* Counselor & Active Filters */}
                  <div className="flex gap-2">
                    <select
                      value={chatCounselorFilter}
                      onChange={(e) => setChatCounselorFilter(e.target.value)}
                      className="flex-grow px-2.5 py-1.5 border border-hairline bg-white rounded-xl text-[10px] font-semibold text-slate-600 focus:outline-none cursor-pointer min-w-0"
                    >
                      <option value="All">All Counselors</option>
                      <option value="Unassigned">Unassigned</option>
                      {counselors.map(c => (
                        <option key={c.id} value={c.id}>{c.full_name}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setChatActiveOnlyFilter(!chatActiveOnlyFilter)}
                      className={`px-3 py-1.5 border rounded-xl text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                        chatActiveOnlyFilter 
                          ? "bg-primary border-primary text-white" 
                          : "bg-white border-hairline text-slate-500 hover:text-primary hover:bg-slate-50"
                      }`}
                    >
                      Active Only
                    </button>
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto divide-y divide-hairline/60">
                  {conversations
                    .filter(c => {
                      if (!c.student) return false;
                      
                      // 1. Search query filter
                      const searchLower = chatCenterSearch.toLowerCase();
                      const nameMatch = c.student.name.toLowerCase().includes(searchLower);
                      const emailMatch = c.student.email.toLowerCase().includes(searchLower);
                      const msgMatch = c.last_message && c.last_message.toLowerCase().includes(searchLower);
                      if (chatCenterSearch && !nameMatch && !emailMatch && !msgMatch) return false;

                      // 2. Counselor filter
                      if (chatCounselorFilter !== "All") {
                        if (chatCounselorFilter === "Unassigned") {
                          if (c.student.counselor_id) return false;
                        } else {
                          if (c.student.counselor_id !== chatCounselorFilter) return false;
                        }
                      }

                      // 3. Active only filter
                      if (chatActiveOnlyFilter && c.last_message === "No messages yet") {
                        return false;
                      }

                      return true;
                    })
                    .map(c => {
                      const isSelected = activeChatStudentId === c.student_id;
                      const relativeTime = c.last_activity_at && c.last_activity_at !== new Date(0).toISOString()
                        ? new Date(c.last_activity_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : "";
                      
                      const assignedCounselorName = c.student.counselors?.full_name || c.student.counselor || "Unassigned";

                      return (
                        <button 
                          key={c.student_id}
                          onClick={() => {
                            setActiveChatStudentId(c.student_id);
                          }}
                          className={`w-full text-left p-4 flex items-start gap-3 transition-colors cursor-pointer ${
                            isSelected ? "bg-primary/5 text-primary" : "hover:bg-slate-50/60"
                          }`}
                        >
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {c.student.name.charAt(0)}
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                              <h4 className="text-xs font-bold truncate pr-2">{c.student.name}</h4>
                              <span className="text-[9px] text-slate-400 font-mono-data">{relativeTime}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate mb-0.5">{c.student.email}</p>
                            
                            {/* Assigned Counselor display */}
                            <p className="text-[9px] text-primary/70 font-semibold mb-1 truncate">
                              Counselor: {assignedCounselorName}
                            </p>
                            
                            <p className="text-[11px] text-slate-500 truncate leading-tight">{c.last_message}</p>
                          </div>
                          {c.unread_count_admin > 0 && (
                            <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[15px] text-center shrink-0 self-center animate-pulse">
                              {c.unread_count_admin}
                            </span>
                          )}
                        </button>
                      );
                    })}

                  {conversations.filter(c => {
                    if (!c.student) return false;
                    
                    const searchLower = chatCenterSearch.toLowerCase();
                    const nameMatch = c.student.name.toLowerCase().includes(searchLower);
                    const emailMatch = c.student.email.toLowerCase().includes(searchLower);
                    const msgMatch = c.last_message && c.last_message.toLowerCase().includes(searchLower);
                    if (chatCenterSearch && !nameMatch && !emailMatch && !msgMatch) return false;

                    if (chatCounselorFilter !== "All") {
                      if (chatCounselorFilter === "Unassigned") {
                        if (c.student.counselor_id) return false;
                      } else {
                        if (c.student.counselor_id !== chatCounselorFilter) return false;
                      }
                    }

                    if (chatActiveOnlyFilter && c.last_message === "No messages yet") {
                      return false;
                    }

                    return true;
                  }).length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-xs font-medium">No matching conversations.</div>
                  )}
                </div>
              </div>

              {/* Right Panel: Chat Thread Viewport */}
              <div className="flex-grow flex flex-col justify-between bg-slate-50/30">
                {!activeChatStudentId ? (
                  <div className="flex-grow flex flex-col items-center justify-center text-slate-400 p-8">
                    <ChatCircleDots size={48} className="text-slate-300 mb-3" />
                    <h3 className="font-bold text-sm text-slate-500">Select a Conversation</h3>
                    <p className="text-xs mt-1 max-w-xs text-center leading-normal">
                      Choose a student from the left panel to load their message timeline, review attachment files, and send counselor replies.
                    </p>
                  </div>
                ) : (
                  (() => {
                    const activeConv = conversations.find(c => c.student_id === activeChatStudentId);
                    const activeStudent = activeConv?.student;
                    
                    return (
                      <>
                        {/* Thread Header */}
                        <div className="p-4 border-b border-hairline bg-white flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)] shrink-0">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold">
                              {activeStudent?.name?.charAt(0) || "S"}
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-primary">{activeStudent?.name}</h3>
                              <p className="text-[10px] text-slate-400 font-medium">
                                {activeStudent?.email} &middot; counselor: {activeStudent?.counselor || "Annex Team"}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (activeStudent) openAuditModal(activeStudent);
                            }}
                            className="px-3.5 py-1.5 border border-hairline hover:bg-slate-50 rounded-full text-xs font-bold text-slate-600 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            Open Student File <ArrowSquareOut size={12} />
                          </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-grow p-6 overflow-y-auto space-y-4 flex flex-col">
                          {chatCenterHasMore && (
                            <button 
                              type="button" 
                              onClick={() => loadAdminChatMessages(activeChatStudentId, chatCenterMessages.length)}
                              className="mx-auto block text-xs font-semibold text-primary/80 hover:text-primary bg-primary/5 hover:bg-primary/10 px-3.5 py-1.5 rounded-full transition-all border border-primary/10 cursor-pointer mb-2"
                            >
                              Load Older Messages
                            </button>
                          )}

                          {chatCenterMessages.length === 0 ? (
                            <div className="my-auto text-center text-slate-400 py-12">
                              <ChatCircleDots size={48} className="mx-auto text-slate-300 mb-3" />
                              <h3 className="font-bold text-sm text-slate-500">No Messages Yet</h3>
                              <p className="text-xs mt-1 max-w-xs mx-auto leading-normal">
                                Send the first message to initiate contact or schedule worksheets.
                              </p>
                            </div>
                          ) : (
                            chatCenterMessages.map((msg, index) => {
                              const isCounselor = msg.sender_type === "counselor" || msg.sender_type === "admin";
                              return (
                                <div 
                                  key={msg.id || index}
                                  className={`flex flex-col max-w-[75%] ${
                                    isCounselor ? "self-end items-end" : "self-start items-start"
                                  }`}
                                >
                                  <div className={`p-4 rounded-3xl text-sm leading-relaxed ${
                                    isCounselor 
                                      ? "bg-primary text-white rounded-br-none" 
                                      : "bg-white border border-hairline/60 text-slate-800 rounded-bl-none shadow-sm"
                                  }`}>
                                    
                                    {/* Text Message */}
                                    <p className="whitespace-pre-wrap">{msg.message}</p>

                                    {/* Attachment Block */}
                                    {msg.attachment_url && (
                                      <div className="mt-2.5">
                                        {/\.(jpeg|jpg|gif|png|webp)$/i.test(msg.attachment_name || "") ? (
                                          <div className="relative rounded-lg overflow-hidden border border-hairline max-w-[240px] bg-slate-100/10">
                                            <img 
                                              src={msg.attachment_url} 
                                              alt={msg.attachment_name} 
                                              className="w-full h-auto object-cover max-h-[180px] hover:scale-102 transition-all cursor-pointer"
                                              onClick={() => window.open(msg.attachment_url, "_blank")}
                                            />
                                            <div className="p-2 bg-black/60 backdrop-blur-sm absolute bottom-0 inset-x-0 flex items-center justify-between text-[10px] text-white">
                                              <span className="truncate pr-2">{msg.attachment_name}</span>
                                              <a href={msg.attachment_url} download={msg.attachment_name} className="hover:text-gold shrink-0">
                                                <Download size={12} />
                                              </a>
                                            </div>
                                          </div>
                                        ) : (
                                          <a 
                                            href={msg.attachment_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`p-3 rounded-xl flex items-center gap-2.5 text-xs border ${
                                              isCounselor 
                                                ? "bg-white/10 border-white/20 text-white hover:bg-white/20" 
                                                : "bg-slate-50 border-hairline text-slate-600 hover:bg-slate-100"
                                            } transition-colors`}
                                          >
                                            <FileText size={16} />
                                            <div className="text-left overflow-hidden">
                                              <p className="font-bold truncate max-w-[150px]">{msg.attachment_name}</p>
                                              <p className="text-[9px] opacity-75">Document attachment</p>
                                            </div>
                                            <ArrowSquareOut size={12} className="ml-auto shrink-0" />
                                          </a>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1.5 mt-1">
                                    <span className="text-[9px] text-slate-400">
                                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {isCounselor && (
                                      <span className="flex items-center">
                                        {msg.status === "read" ? (
                                          <Checks size={14} className="text-emerald-400" weight="bold" />
                                        ) : msg.status === "sending" ? (
                                          <SpinnerGap size={14} className="text-slate-400 animate-spin" />
                                        ) : msg.status === "failed" ? (
                                          <span title="Failed to send">
                                            <XCircle size={14} className="text-red-500" />
                                          </span>
                                        ) : (
                                          <Check size={14} className="text-slate-400" />
                                        )}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Message Input form */}
                        <form onSubmit={handleSendAdminChatReply} className="p-4 border-t border-hairline bg-white flex items-end gap-3.5 shrink-0">
                          
                          {/* File Attachment input */}
                          <div className="relative shrink-0">
                            <label className={`w-11 h-11 rounded-full border border-hairline flex items-center justify-center cursor-pointer transition-colors ${
                              adminChatFile ? "bg-primary/10 border-primary/20 text-primary" : "text-slate-400 hover:text-primary hover:bg-slate-50"
                            }`} title="Add Attachment">
                              <Paperclip size={18} />
                              <input 
                                type="file" 
                                className="hidden" 
                                onChange={(e) => e.target.files && setAdminChatFile(e.target.files[0])}
                                disabled={sendingAdminChat}
                              />
                            </label>
                            {adminChatFile && (
                              <button 
                                type="button" 
                                onClick={() => setAdminChatFile(null)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                              >
                                <X size={10} weight="bold" />
                              </button>
                            )}
                          </div>

                          {/* Text entry field */}
                          <div className="flex-grow">
                            {adminChatFile && (
                              <div className="text-[10px] bg-slate-50 border border-hairline px-3 py-1 rounded-t-xl text-slate-500 truncate max-w-md">
                                Attachment queue: <span className="font-semibold text-primary">{adminChatFile.name}</span>
                              </div>
                            )}
                            <textarea
                              rows={1}
                              value={adminChatText}
                              onChange={(e) => setAdminChatText(e.target.value)}
                              placeholder="Type your reply to student..."
                              className={`w-full border border-hairline px-4.5 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm transition-all resize-none bg-white ${
                                adminChatFile ? "rounded-b-2xl border-t-0" : "rounded-2xl"
                              }`}
                              disabled={sendingAdminChat}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendAdminChatReply(e);
                                }
                              }}
                            />
                          </div>

                          <Button 
                            type="submit" 
                            disabled={sendingAdminChat} 
                            className="rounded-full w-11 h-11 p-0 flex items-center justify-center shrink-0"
                          >
                            {sendingAdminChat ? (
                              <SpinnerGap size={18} className="animate-spin text-white" />
                            ) : (
                              <PaperPlaneRight size={18} weight="fill" />
                            )}
                          </Button>

                        </form>
                      </>
                    );
                  })()
                )}
              </div>
            </div>
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

      {/* 5. ADD/EDIT STUDENT MODAL */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <Card className="max-w-2xl w-full p-6 relative bg-white shadow-2xl">
            <button onClick={() => setIsStudentModalOpen(false)} className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer">
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 mb-6 border-b border-hairline pb-4">
              <User size={22} className="text-primary" />
              <div>
                <CardTitle className="text-lg">{editingStudent ? "Edit Student Profile" : "Register New Student"}</CardTitle>
                <CardDescription className="text-xs">Setup credentials, counselor allocation, and academic particulars.</CardDescription>
              </div>
            </div>
            <form onSubmit={handleSaveStudent} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase tracking-wider">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={studentForm.name} 
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} 
                    className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase tracking-wider">Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    disabled={!!editingStudent}
                    value={studentForm.email} 
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} 
                    className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              {!editingStudent && (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase tracking-wider">Temporary Password *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Min 6 characters"
                    value={studentForm.password} 
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })} 
                    className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white font-mono-data"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase tracking-wider">Phone Number</label>
                  <input 
                    type="text" 
                    value={studentForm.phone} 
                    onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })} 
                    className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase tracking-wider">Destination Country *</label>
                  <select 
                    value={studentForm.destination} 
                    onChange={(e) => setStudentForm({ ...studentForm, destination: e.target.value })} 
                    className="px-3.5 py-2 border border-hairline bg-white rounded-xl text-xs text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="UK">UK</option>
                    <option value="Australia">Australia</option>
                    <option value="Europe">Europe</option>
                    <option value="Dubai">Dubai</option>
                    <option value="Italy">Italy</option>
                    <option value="India">India</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase tracking-wider">Target Intake Cycle</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sept 2026"
                    value={studentForm.intake} 
                    onChange={(e) => setStudentForm({ ...studentForm, intake: e.target.value })} 
                    className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase tracking-wider">Assigned Counselor *</label>
                  <select 
                    value={studentForm.counselor_id || ""} 
                    onChange={(e) => {
                      const idVal = e.target.value;
                      const selected = counselors.find(c => c.id === idVal);
                      setStudentForm({ 
                        ...studentForm, 
                        counselor_id: idVal,
                        counselor: selected ? selected.full_name : "Annex Counselor"
                      });
                    }} 
                    className="px-3.5 py-2 border border-hairline bg-white rounded-xl text-xs text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="">Select Counselor</option>
                    {counselors.filter(c => c.is_active).map(c => (
                      <option key={c.id} value={c.id}>{c.full_name} ({c.designation})</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase tracking-wider">Journey Stage *</label>
                  <select 
                    value={studentForm.current_stage} 
                    onChange={(e) => setStudentForm({ ...studentForm, current_stage: e.target.value })} 
                    className="px-3.5 py-2 border border-hairline bg-white rounded-xl text-xs text-slate-800 focus:outline-none cursor-pointer"
                  >
                    {STAGES.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase tracking-wider">Account Status *</label>
                  <select 
                    value={studentForm.status} 
                    onChange={(e) => setStudentForm({ ...studentForm, status: e.target.value })} 
                    className="px-3.5 py-2 border border-hairline bg-white rounded-xl text-xs text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase tracking-wider">Academic scores / details</label>
                <textarea 
                  rows={2} 
                  value={studentForm.academic_details} 
                  onChange={(e) => setStudentForm({ ...studentForm, academic_details: e.target.value })} 
                  className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white resize-none"
                  placeholder="Qualifications, IELTS scores, GPA background"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="font-bold text-primary uppercase tracking-wider">Emergency Contact details</label>
                  <input 
                    type="text" 
                    value={studentForm.emergency_contact} 
                    onChange={(e) => setStudentForm({ ...studentForm, emergency_contact: e.target.value })} 
                    className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase tracking-wider">Passport details</label>
                  <input 
                    type="text" 
                    value={studentForm.passport_details} 
                    onChange={(e) => setStudentForm({ ...studentForm, passport_details: e.target.value })} 
                    className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-hairline pt-4 mt-2">
                <Button type="submit" variant="primary" size="sm" disabled={savingStudent}>
                  {savingStudent ? "Saving..." : "Save Student"}
                </Button>
                <Button type="button" onClick={() => setIsStudentModalOpen(false)} variant="ghost" size="sm">Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* 5b. ADD/EDIT COUNSELOR MODAL */}
      {isCounselorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <Card className="max-w-md w-full p-6 relative bg-white shadow-2xl">
            <button onClick={() => setIsCounselorModalOpen(false)} className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer">
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 mb-6 border-b border-hairline pb-4 text-slate-700">
              <User size={22} className="text-primary" />
              <div>
                <CardTitle className="text-lg">{editingCounselor ? "Edit Counselor Profile" : "Add New Counselor"}</CardTitle>
                <CardDescription className="text-xs">Setup details and profile settings for Annex Consultancy counselors.</CardDescription>
              </div>
            </div>
            <form onSubmit={handleSaveCounselor} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1 text-xs text-slate-700">
              
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase tracking-wider">Full Name *</label>
                <input 
                  type="text" 
                  value={counselorForm.full_name} 
                  onChange={(e) => setCounselorForm({ ...counselorForm, full_name: e.target.value })} 
                  className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase tracking-wider">Email Address *</label>
                <input 
                  type="email" 
                  value={counselorForm.email} 
                  onChange={(e) => setCounselorForm({ ...counselorForm, email: e.target.value })} 
                  className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase tracking-wider">Phone Number</label>
                <input 
                  type="text" 
                  value={counselorForm.phone} 
                  onChange={(e) => setCounselorForm({ ...counselorForm, phone: e.target.value })} 
                  className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase tracking-wider">Designation</label>
                <input 
                  type="text" 
                  value={counselorForm.designation} 
                  onChange={(e) => setCounselorForm({ ...counselorForm, designation: e.target.value })} 
                  className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white"
                  placeholder="e.g. Senior Admission Counselor"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase tracking-wider">Profile Photo (Avatar)</label>
                <div className="flex items-center gap-3">
                  {counselorForm.avatar_url ? (
                    <img 
                      src={counselorForm.avatar_url} 
                      alt="Avatar Preview" 
                      className="w-10 h-10 rounded-full object-cover border border-hairline"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-400">
                      ?
                    </div>
                  )}
                  <div className="flex-grow">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleCounselorAvatarUpload} 
                      disabled={uploadingCounselorAvatar}
                      className="hidden" 
                      id="counselorAvatarFileInput"
                    />
                    <label 
                      htmlFor="counselorAvatarFileInput"
                      className="px-3 py-2 border border-hairline rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider text-[10px]"
                    >
                      {uploadingCounselorAvatar ? (
                        <>
                          <SpinnerGap className="animate-spin text-slate-400" size={14} />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <UploadSimple size={14} />
                          Upload Image
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="counselorActive" 
                  checked={counselorForm.is_active} 
                  onChange={(e) => setCounselorForm({ ...counselorForm, is_active: e.target.checked })} 
                  className="w-4 h-4 text-primary cursor-pointer border-hairline rounded"
                />
                <label htmlFor="counselorActive" className="text-xs font-bold text-primary uppercase tracking-wider cursor-pointer">Active Counselor</label>
              </div>

              <div className="flex justify-end gap-3 border-t border-hairline pt-4 mt-2">
                <Button type="submit" variant="primary" size="sm" disabled={savingCounselor}>
                  {savingCounselor ? (
                    <>
                      <SpinnerGap className="animate-spin" size={14} />
                      Saving...
                    </>
                  ) : "Save Record"}
                </Button>
                <Button type="button" onClick={() => setIsCounselorModalOpen(false)} variant="ghost" size="sm">Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* 6. STUDENT PORTAL AUDIT WORKSPACE (MODAL) */}
      {isAuditModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in text-slate-700">
          <Card className="max-w-5xl w-full h-[85vh] p-0 relative bg-white shadow-2xl flex flex-col justify-between overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-hairline bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                  <User size={22} weight="fill" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-primary leading-tight">{selectedStudent.name}</h3>
                  <p className="text-xs text-slate-400 font-medium">{selectedStudent.email} &middot; counselor: {selectedStudent.counselor}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full">
                  {selectedStudent.current_stage}
                </span>
                <button 
                  onClick={() => setIsAuditModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Internal Navigation */}
            <div className="px-5 border-b border-hairline flex gap-4 text-xs font-bold uppercase tracking-wider text-slate-400 py-3 bg-white">
              {[
                { id: "progress", label: "Tasks & Progress" },
                { id: "documents", label: "Documents Collection" },
                { id: "offers", label: "Offer Letters" },
                { id: "visa", label: "Visa Timeline" },
                { id: "chat", label: "Counselor Chat" },
                { id: "logs", label: "Activity Logs" }
              ].map(subTab => (
                <button 
                  key={subTab.id}
                  onClick={() => setAuditTab(subTab.id as any)}
                  className={`pb-1 cursor-pointer transition-all ${
                    auditTab === subTab.id ? "text-primary border-b-2 border-primary" : "hover:text-primary"
                  }`}
                >
                  {subTab.label}
                </button>
              ))}
            </div>

            {/* Modal Content Scroll viewport */}
            <div className="flex-grow p-6 overflow-y-auto bg-slate-50/50 text-xs">
              
              {/* TAB A: TASKS & PROGRESS */}
              {auditTab === "progress" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Left: Task lists */}
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="font-bold text-sm text-primary mb-2">Assigned Tasks checklist</h4>
                    {auditTasks.length === 0 ? (
                      <p className="text-slate-400 py-6 text-center border border-dashed border-hairline rounded-xl bg-white">No tasks assigned.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {auditTasks.map(task => (
                          <div key={task.id} className="p-4 bg-white border border-hairline rounded-xl flex items-center justify-between gap-4">
                            <div>
                              <h5 className={`font-bold ${task.completed ? "line-through text-slate-400" : "text-primary"}`}>{task.title}</h5>
                              {task.description && <p className="text-[11px] text-slate-500 mt-0.5">{task.description}</p>}
                            </div>
                            <div className="shrink-0 flex items-center gap-2">
                              {task.approved ? (
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Approved</span>
                              ) : task.completed ? (
                                <Button 
                                  onClick={() => approveTask(task.id, task.title)} 
                                  variant="primary" 
                                  className="text-[10px] py-1 px-3"
                                >
                                  Approve Completion
                                </Button>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Required</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Add new task */}
                  <div className="bg-white border border-hairline rounded-2xl p-4.5 h-fit">
                    <h4 className="font-bold text-sm text-primary mb-4">Assign New Task</h4>
                    <form onSubmit={handleAddTask} className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Task Title *</label>
                        <input 
                          type="text" 
                          required
                          value={newTaskTitle} 
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          placeholder="e.g. Upload IELTS Certificate" 
                          className="px-3.5 py-2 border border-hairline rounded-xl text-xs outline-none focus:border-primary bg-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Description</label>
                        <textarea 
                          rows={3} 
                          value={newTaskDesc}
                          onChange={(e) => setNewTaskDesc(e.target.value)}
                          placeholder="Specify requirements, links, or templates." 
                          className="px-3.5 py-2 border border-hairline rounded-xl text-xs outline-none focus:border-primary resize-none bg-white"
                        />
                      </div>
                      <Button type="submit" disabled={addingTask} className="w-full text-xs py-2">
                        {addingTask ? "Assigning..." : "Assign Task"}
                      </Button>
                    </form>
                  </div>

                </div>
              )}

              {/* TAB B: DOCUMENTS REVIEW */}
              {auditTab === "documents" && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-primary">Verification Checklist</h4>
                  
                  {auditDocs.length === 0 ? (
                    <div className="py-12 border border-dashed border-hairline rounded-2xl bg-white text-center text-slate-400">
                      <FileText size={32} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-xs">No documents uploaded by student yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {auditDocs.map(doc => (
                        <div key={doc.id} className="p-4 bg-white border border-hairline rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm transition-shadow">
                          
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/5 text-primary flex items-center justify-center border border-primary/10 shrink-0">
                              <FileText size={18} weight="fill" />
                            </div>
                            <div>
                              <h5 className="font-bold text-primary">{doc.document_type}</h5>
                              <p className="text-[11px] text-slate-500 truncate max-w-[300px] sm:max-w-xl">{doc.file_name}</p>
                              {doc.feedback && (
                                <p className="text-[10px] text-red-600 bg-red-50 p-2 rounded-xl mt-1 border border-red-100 max-w-lg">
                                  <strong>Feedback:</strong> {doc.feedback}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 sm:self-center ml-12 sm:ml-0 shrink-0">
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                              doc.status === "Approved" 
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                                : doc.status === "Rejected"
                                ? "bg-red-50 text-red-600 border-red-200"
                                : doc.status === "Requires Correction"
                                ? "bg-amber-50 text-amber-600 border-amber-200"
                                : "bg-blue-50 text-blue-600 border-blue-200"
                            }`}>
                              {doc.status}
                            </span>
                            
                            <a 
                              href={doc.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="px-3.5 py-1.5 border border-hairline hover:bg-slate-50 rounded-full text-xs font-bold text-slate-600 flex items-center gap-1 transition-colors"
                            >
                              View file <ArrowSquareOut size={12} />
                            </a>

                            {docFeedbackId === doc.id ? (
                              <div className="flex items-center gap-2">
                                <input 
                                  type="text" 
                                  placeholder="Provide feedback..." 
                                  value={docFeedbackText}
                                  onChange={(e) => setDocFeedbackText(e.target.value)}
                                  className="px-2 py-1.5 border border-hairline rounded-lg text-xs outline-none bg-white"
                                />
                                <Button onClick={() => updateDocStatus(doc.id, "Requires Correction", docFeedbackText)} variant="secondary" className="text-[10px] py-1 px-2.5">Send</Button>
                                <button onClick={() => setDocFeedbackId(null)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
                              </div>
                            ) : (
                              <>
                                <button 
                                  onClick={() => updateDocStatus(doc.id, "Approved")}
                                  className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/10 cursor-pointer"
                                  disabled={doc.status === "Approved"}
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => setDocFeedbackId(doc.id)}
                                  className="px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm shadow-red-600/10 cursor-pointer"
                                  disabled={doc.status === "Rejected"}
                                >
                                  Request correction
                                </button>
                              </>
                            )}
                          </div>

                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* TAB C: OFFER LETTERS */}
              {auditTab === "offers" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Left list of offer letters */}
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="font-bold text-sm text-primary mb-2">Issued Offer Documents</h4>
                    {auditOffers.length === 0 ? (
                      <p className="text-slate-400 py-6 text-center border border-dashed border-hairline rounded-xl bg-white">No offer letters issued yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {auditOffers.map(letter => (
                          <div key={letter.id} className="p-4 bg-white border border-hairline rounded-xl flex items-center justify-between gap-4">
                            <div className="flex items-start gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-primary/5 border border-primary/10 text-primary flex items-center justify-center shrink-0">
                                <FileText size={16} weight="fill" />
                              </div>
                              <div className="min-w-0">
                                <h5 className="font-bold text-primary truncate">{letter.letter_type}</h5>
                                <p className="text-[10px] text-slate-400 truncate mt-0.5">{letter.file_name}</p>
                              </div>
                            </div>
                            <a 
                              href={letter.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-slate-400 hover:text-primary shrink-0"
                            >
                              <ArrowSquareOut size={16} />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Upload form */}
                  <div className="bg-white border border-hairline rounded-2xl p-4.5 h-fit text-xs">
                    <h4 className="font-bold text-sm text-primary mb-4">Upload Offer / Receipt</h4>
                    <form onSubmit={handleUploadOfferLetter} className="space-y-4">
                      
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Document Type *</label>
                        <select 
                          value={adminOfferType}
                          onChange={(e) => setAdminOfferType(e.target.value)}
                          className="px-3.5 py-2 border border-hairline rounded-xl bg-white text-xs text-slate-800 focus:outline-none cursor-pointer"
                        >
                          <option value="Conditional Offer">Conditional Offer</option>
                          <option value="Unconditional Offer">Unconditional Offer</option>
                          <option value="CAS Letter">CAS Letter</option>
                          <option value="Admission Letter">Admission Letter</option>
                          <option value="Tuition Receipt">Tuition Receipt</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">File Attachment *</label>
                        <input 
                          type="file"
                          required
                          onChange={(e) => e.target.files && setAdminOfferFile(e.target.files[0])}
                          className="px-3 py-2 border border-hairline rounded-xl text-xs bg-white text-slate-500 focus:outline-none"
                        />
                      </div>

                      <Button type="submit" disabled={uploadingOffer} className="w-full text-xs py-2.5">
                        {uploadingOffer ? "Uploading..." : "Issue Document"}
                      </Button>

                    </form>
                  </div>

                </div>
              )}

              {/* TAB D: VISA STATUS */}
              {auditTab === "visa" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Left visa timeline visualization */}
                  <div className="md:col-span-2 space-y-4 bg-white border border-hairline p-5 rounded-2xl h-fit">
                    <h4 className="font-bold text-sm text-primary mb-4">Visa Progress Timeline</h4>
                    <div className="relative pl-6 flex flex-col gap-5 py-2">
                      <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-100" />
                      {[
                        "Application Started",
                        "Documents Submitted",
                        "Biometrics Scheduled",
                        "Biometrics Completed",
                        "Visa Decision Pending",
                        "Visa Approved"
                      ].map((step, index) => {
                        const visaSteps = [
                          "Application Started",
                          "Documents Submitted",
                          "Biometrics Scheduled",
                          "Biometrics Completed",
                          "Visa Decision Pending",
                          "Visa Approved"
                        ];
                        const currentVisaIndex = auditVisa ? visaSteps.indexOf(auditVisa.status) : 0;
                        const isPassed = index < currentVisaIndex;
                        const isCurrent = index === currentVisaIndex;

                        return (
                          <div key={step} className="relative z-10 flex items-start gap-3 text-left">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                              isPassed 
                                ? "bg-emerald-500 border-emerald-500 text-white" 
                                : isCurrent
                                ? "bg-primary border-primary text-white scale-105"
                                : "bg-white border-slate-200 text-slate-400"
                            }`}>
                              {isPassed ? <Check size={10} weight="bold" /> : <span className="text-[9px] font-bold">{index + 1}</span>}
                            </div>
                            <div>
                              <p className={`text-xs font-bold ${isCurrent ? "text-primary font-black" : "text-slate-500"}`}>{step}</p>
                              {isCurrent && auditVisa?.details && <p className="text-[10px] text-slate-400 mt-0.5">{auditVisa.details}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right visa modifier form */}
                  <div className="bg-white border border-hairline rounded-2xl p-4.5 h-fit text-xs">
                    <h4 className="font-bold text-sm text-primary mb-4">Update Visa Milestone</h4>
                    <form onSubmit={handleUpdateVisaStatus} className="space-y-4">
                      
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Active Stage *</label>
                        <select 
                          value={adminVisaStatus}
                          onChange={(e) => setAdminVisaStatus(e.target.value)}
                          className="px-3.5 py-2 border border-hairline rounded-xl bg-white text-xs text-slate-800 focus:outline-none cursor-pointer"
                        >
                          <option value="Application Started">Application Started</option>
                          <option value="Documents Submitted">Documents Submitted</option>
                          <option value="Biometrics Scheduled">Biometrics Scheduled</option>
                          <option value="Biometrics Completed">Biometrics Completed</option>
                          <option value="Visa Decision Pending">Visa Decision Pending</option>
                          <option value="Visa Approved">Visa Approved</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Milestone Notes</label>
                        <textarea 
                          rows={3} 
                          value={adminVisaDetails}
                          onChange={(e) => setAdminVisaDetails(e.target.value)}
                          placeholder="e.g. Scheduled for VFS Kathmandu at 10 AM." 
                          className="px-3.5 py-2 border border-hairline rounded-xl text-xs outline-none focus:border-primary resize-none bg-white"
                        />
                      </div>

                      <Button type="submit" disabled={updatingVisa} className="w-full text-xs py-2.5">
                        {updatingVisa ? "Updating..." : "Update Visa Status"}
                      </Button>

                    </form>
                  </div>

                </div>
              )}

              {/* TAB E: MESSAGING CHAT */}
              {auditTab === "chat" && (
                <div className="bg-white border border-hairline rounded-2xl h-[450px] flex flex-col justify-between overflow-hidden">
                  
                  {/* Messages container */}
                  <div className="flex-grow p-4 overflow-y-auto bg-slate-50/50 space-y-3 flex flex-col">
                    {auditMessages.length === 0 ? (
                      <p className="text-slate-400 py-6 text-center my-auto">No chat history with this student.</p>
                    ) : (
                      auditMessages.map(msg => {
                        const isStudent = msg.sender_type === "student";
                        return (
                          <div 
                            key={msg.id}
                            className={`flex flex-col max-w-[75%] ${
                              isStudent ? "self-start items-start" : "self-end items-end"
                            }`}
                          >
                            <div className={`p-3 rounded-2xl text-[11px] leading-relaxed ${
                              isStudent 
                                ? "bg-white border border-hairline/80 text-slate-800 rounded-bl-none shadow-sm"
                                : "bg-primary text-white rounded-br-none"
                            }`}>
                              <p className="whitespace-pre-wrap">{msg.message}</p>
                              {msg.attachment_url && (
                                <a 
                                  href={msg.attachment_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className={`mt-2 p-1.5 rounded-lg flex items-center gap-1.5 text-[10px] border ${
                                    isStudent 
                                      ? "bg-slate-50 border-hairline text-slate-600 hover:bg-slate-100"
                                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                                  }`}
                                >
                                  <Paperclip size={12} />
                                  <span className="truncate max-w-[150px] font-bold">{msg.attachment_name}</span>
                                </a>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[8px] text-slate-400">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {!isStudent && (
                                <span className="flex items-center">
                                  {msg.status === "read" ? (
                                    <Checks size={10} className="text-emerald-400" weight="bold" />
                                  ) : msg.status === "sending" ? (
                                    <SpinnerGap size={10} className="text-slate-400 animate-spin" />
                                  ) : msg.status === "failed" ? (
                                    <span title="Failed to send">
                                      <XCircle size={10} className="text-red-500" />
                                    </span>
                                  ) : (
                                    <Check size={10} className="text-slate-400" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Send Reply box */}
                  <form onSubmit={handleSendAdminReply} className="p-3.5 border-t border-hairline bg-white flex items-end gap-3.5">
                    
                    {/* File Attachment selector */}
                    <div className="relative shrink-0">
                      <label className={`w-9 h-9 rounded-full border border-hairline flex items-center justify-center cursor-pointer transition-colors ${
                        adminReplyFile ? "bg-primary/10 border-primary/20 text-primary" : "text-slate-400 hover:text-primary hover:bg-slate-50"
                      }`} title="Add Attachment">
                        <Paperclip size={16} />
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => e.target.files && setAdminReplyFile(e.target.files[0])}
                          disabled={sendingReply}
                        />
                      </label>
                      {adminReplyFile && (
                        <button 
                          type="button" 
                          onClick={() => setAdminReplyFile(null)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                        >
                          <X size={8} weight="bold" />
                        </button>
                      )}
                    </div>

                    <div className="flex-grow">
                      {adminReplyFile && (
                        <div className="text-[9px] bg-slate-50 border border-hairline px-2.5 py-0.5 rounded-t-xl text-slate-500 truncate max-w-sm">
                          Attached: <span className="font-semibold text-primary">{adminReplyFile.name}</span>
                        </div>
                      )}
                      <textarea
                        rows={1}
                        value={adminReplyText}
                        onChange={(e) => setAdminReplyText(e.target.value)}
                        placeholder="Type counselor reply..."
                        className={`w-full border border-hairline px-3.5 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-xs transition-all resize-none bg-white ${
                          adminReplyFile ? "rounded-b-xl border-t-0" : "rounded-xl"
                        }`}
                        disabled={sendingReply}
                      />
                    </div>

                    <Button type="submit" disabled={sendingReply} className="w-9 h-9 p-0 rounded-full flex items-center justify-center shrink-0">
                      {sendingReply ? (
                        <SpinnerGap size={14} className="animate-spin text-white" />
                      ) : (
                        <PaperPlaneRight size={14} weight="fill" />
                      )}
                    </Button>

                  </form>
                </div>
              )}

              {/* TAB F: ACTIVITY LOGS */}
              {auditTab === "logs" && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-primary">File Activity Logs</h4>
                  {auditLogs.length === 0 ? (
                    <p className="text-slate-400 py-6 text-center border border-dashed border-hairline rounded-xl bg-white">No historical actions logged.</p>
                  ) : (
                    <div className="border border-hairline rounded-2xl bg-white divide-y divide-hairline">
                      {auditLogs.map(log => (
                        <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-600 font-medium">
                          <div>
                            <span className="font-bold text-primary uppercase tracking-wide text-[9px] bg-slate-100 px-2 py-0.5 rounded-md mr-2">
                              {log.action}
                            </span>
                            <span>{log.details || "No details log."}</span>
                          </div>
                          <span className="font-mono-data text-[10px] text-slate-400 shrink-0">
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-hairline bg-slate-50 flex justify-end gap-3 shrink-0">
              <Button onClick={() => setIsAuditModalOpen(false)} variant="ghost" size="sm">Close Workspace</Button>
            </div>

          </Card>
        </div>
      )}
    </main>
  );
}
