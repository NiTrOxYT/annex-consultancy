"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  CheckCircle,
  Clock,
  ChatTeardropText,
  FileArrowUp,
  FileText,
  SignOut,
  Calendar,
  User,
  PaperPlaneRight,
  Paperclip,
  ArrowSquareOut,
  WarningCircle,
  UploadSimple,
  Check,
  X,
  SpinnerGap,
  Bell,
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  ShieldWarning,
  ChatCircleDots,
  Gear,
  Checks,
  Download,
  VideoCamera,
  Phone,
  Envelope,
  LockKey,
  Warning
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from "@/components/ui/card";

// Auth / Login Sub-component
function CareerPortalLogin({
  onLoginSuccess,
}: {
  onLoginSuccess: (studentId: string, email: string) => void;
}) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      console.log("[Diagnostic] Attempting Auth sign-in for Career student:", email);
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error("Login failed. User profile not retrieved.");
      }

      const userId = authData.user.id;

      // Query training_students profile
      const { data: student, error: dbError } = await supabase
        .from("training_students")
        .select("id, status")
        .eq("auth_user_id", userId)
        .single();

      if (dbError) {
        await supabase.auth.signOut();
        if (dbError.code === "PGRST116") {
          throw new Error("This account is not configured as a Career Portal profile. Please contact Admin.");
        } else {
          throw new Error(`Unable to fetch your profile: ${dbError.message}`);
        }
      }

      if (student.status !== "Active" && student.status !== "Completed") {
        await supabase.auth.signOut();
        throw new Error(`Your portal access is currently ${student.status}. Please contact support.`);
      }

      onLoginSuccess(student.id, email);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full px-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-subtle-gray border border-hairline/80 text-primary mb-4">
          <BriefcaseIcon size={28} className="text-primary" />
        </div>
        <h1 className="font-display font-bold text-3xl text-primary tracking-tight mb-2">
          Career Portal
        </h1>
        <p className="text-slate-500 text-sm">
          Training & Placement System Portal
        </p>
      </div>

      <Card className="shadow-xl">
        <CardHeader className="text-center pb-2">
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Access tasks, documents, schedulers, and chat with your advisor.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4 pt-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-600">
                <Warning size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Envelope size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="candidate@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-full border border-hairline focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-sm transition-all bg-white"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <LockKey size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-full border border-hairline focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-sm transition-all bg-white"
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-4 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
              {!loading && <ArrowRight size={16} />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper icon wrapper since Briefcase is not directly imported as lowercase
function BriefcaseIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="currentColor"
      className={className}
    >
      <path d="M216,72H176V56a24,24,0,0,0-24-24H104A24,24,0,0,0,80,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72ZM96,56a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8V72H96ZM216,200H40V88H216V200Z" />
    </svg>
  );
}

export default function CareerPortalPage() {
  const router = useRouter();

  // Impersonation & Profile States
  const [studentId, setStudentId] = React.useState<string | null>(null);
  const [isImpersonating, setIsImpersonating] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [studentData, setStudentData] = React.useState<any>(null);
  const [activeTab, setActiveTab] = React.useState<
    "dashboard" | "tasks" | "documents" | "meetings" | "chat" | "profile"
  >("dashboard");

  // Portal states
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [documents, setDocuments] = React.useState<any[]>([]);
  const [meetings, setMeetings] = React.useState<any[]>([]);
  const [messages, setMessages] = React.useState<any[]>([]);
  
  // Action triggers
  const [uploadingDoc, setUploadingDoc] = React.useState(false);
  const [submittingTaskFile, setSubmittingTaskFile] = React.useState<string | null>(null);
  const [chatMessage, setChatMessage] = React.useState("");
  const [chatFile, setChatFile] = React.useState<File | null>(null);
  const [sendingMessage, setSendingMessage] = React.useState(false);

  // Reschedule requested meeting
  const [rescheduleMeetingId, setRescheduleMeetingId] = React.useState<string | null>(null);
  const [newDate, setNewDate] = React.useState("");
  const [newTime, setNewTime] = React.useState("");
  const [rescheduleNotes, setRescheduleNotes] = React.useState("");
  const [rescheduling, setRescheduling] = React.useState(false);

  // Profile Edit State
  const [phone, setPhone] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [savingProfile, setSavingProfile] = React.useState(false);
  const [profileMsg, setProfileMsg] = React.useState<string | null>(null);

  // Load complete student details
  const loadPortalData = async (id: string) => {
    try {
      // 1. Student details
      const { data: student, error: studentErr } = await supabase
        .from("training_students")
        .select("*, training_services(*), counselors(*)")
        .eq("id", id)
        .single();

      if (studentErr) throw studentErr;
      setStudentData(student);
      setPhone(student.student_phone || "");
      setNotes(student.notes || "");

      // 2. Tasks
      const { data: trainingTasks } = await supabase
        .from("training_tasks")
        .select("*")
        .eq("student_id", id)
        .order("created_at", { ascending: true });
      setTasks(trainingTasks || []);

      // 3. Documents
      const { data: trainingDocs } = await supabase
        .from("training_documents")
        .select("*")
        .eq("student_id", id)
        .order("created_at", { ascending: false });
      setDocuments(trainingDocs || []);

      // 4. Meetings
      const { data: trainingMeetings } = await supabase
        .from("meetings")
        .select("*, counselors(full_name)")
        .eq("training_student_id", id)
        .order("scheduled_at", { ascending: true });
      setMeetings(trainingMeetings || []);

      // 5. Messages
      const { data: trainingMsgs } = await supabase
        .from("training_messages")
        .select("*")
        .eq("student_id", id)
        .order("created_at", { ascending: true });
      setMessages(trainingMsgs || []);
    } catch (err: any) {
      console.error("Error loading portal data:", err.message);
    }
  };

  // Run initialization
  React.useEffect(() => {
    const checkState = async () => {
      setLoading(true);
      try {
        let activeStudentId: string | null = null;

        // Impersonation detection
        if (typeof window !== "undefined") {
          const impersonatedId = sessionStorage.getItem("annex_impersonate_training_id");
          if (impersonatedId) {
            activeStudentId = impersonatedId;
            setIsImpersonating(true);
          }
        }

        // Standard auth session lookup
        if (!activeStudentId) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { data: record } = await supabase
              .from("training_students")
              .select("id")
              .eq("auth_user_id", session.user.id)
              .single();
            if (record) {
              activeStudentId = record.id;
            }
          }
        }

        if (activeStudentId) {
          setStudentId(activeStudentId);
          await loadPortalData(activeStudentId);
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };
    checkState();
  }, []);

  // Realtime subscription for Chat, Tasks, and Meetings
  React.useEffect(() => {
    if (!studentId) return;

    // Chat subscription
    const chatChannel = supabase
      .channel(`training_chat:${studentId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "training_messages",
          filter: `student_id=eq.${studentId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => {
              if (prev.some((m) => m.id === payload.new.id)) return prev;
              return [...prev, payload.new];
            });

            // Mark read if chat is active
            if (activeTab === "chat" && payload.new.sender_type !== "student") {
              supabase
                .from("training_conversations")
                .update({ unread_count_student: 0 })
                .eq("student_id", studentId)
                .then(() => {});
            }
          }
        }
      )
      .subscribe();

    // Tasks subscription
    const tasksChannel = supabase
      .channel(`training_tasks_ref:${studentId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "training_tasks",
          filter: `student_id=eq.${studentId}`,
        },
        () => {
          supabase
            .from("training_tasks")
            .select("*")
            .eq("student_id", studentId)
            .order("created_at", { ascending: true })
            .then(({ data }) => {
              if (data) setTasks(data);
            });
        }
      )
      .subscribe();

    // Meetings subscription
    const meetingsChannel = supabase
      .channel(`training_meetings_ref:${studentId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "meetings",
          filter: `training_student_id=eq.${studentId}`,
        },
        () => {
          supabase
            .from("meetings")
            .select("*, counselors(full_name)")
            .eq("training_student_id", studentId)
            .order("scheduled_at", { ascending: true })
            .then(({ data }) => {
              if (data) setMeetings(data);
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(meetingsChannel);
    };
  }, [studentId, activeTab]);

  // Mark chat conversations unread to 0 when opening chat tab
  React.useEffect(() => {
    if (activeTab === "chat" && studentId) {
      supabase
        .from("training_conversations")
        .update({ unread_count_student: 0 })
        .eq("student_id", studentId)
        .then(() => {});
    }
  }, [activeTab, studentId]);

  const handleLogout = async () => {
    if (isImpersonating) {
      sessionStorage.removeItem("annex_impersonate_training_id");
      router.push("/admin");
    } else {
      await supabase.auth.signOut();
      window.location.reload();
    }
  };

  const handleLoginSuccess = (id: string, email: string) => {
    setStudentId(id);
    loadPortalData(id);
  };

  // Upload document center files
  const handleUploadDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !studentId) return;
    const file = e.target.files[0];

    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit.");
      return;
    }

    setUploadingDoc(true);
    try {
      const fileExt = file.name.split(".").pop();
      const randomName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${studentId}/career_documents/${randomName}`;

      const { error: uploadErr } = await supabase.storage
        .from("student-files")
        .upload(filePath, file);

      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage
        .from("student-files")
        .getPublicUrl(filePath);

      const { error: dbErr } = await supabase
        .from("training_documents")
        .insert({
          student_id: studentId,
          title: file.name,
          file_url: publicUrl,
          uploaded_by: "student",
        });

      if (dbErr) throw dbErr;

      await loadPortalData(studentId);
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploadingDoc(false);
    }
  };

  // Task solution files
  const handleUploadTaskFile = async (e: React.ChangeEvent<HTMLInputElement>, taskId: string) => {
    if (!e.target.files || e.target.files.length === 0 || !studentId) return;
    const file = e.target.files[0];

    submittingTaskFile === null && setSubmittingTaskFile(taskId);
    try {
      const fileExt = file.name.split(".").pop();
      const randomName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${studentId}/task_solutions/${taskId}_${randomName}`;

      const { error: uploadErr } = await supabase.storage
        .from("student-files")
        .upload(filePath, file);

      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage
        .from("student-files")
        .getPublicUrl(filePath);

      // Update task parameters
      const { error: dbErr } = await supabase
        .from("training_tasks")
        .update({
          file_url: publicUrl,
          file_name: file.name,
          status: "Under Review",
        })
        .eq("id", taskId);

      if (dbErr) throw dbErr;

      // Send career task completed/submitted notification
      const taskObj = tasks.find((t) => t.id === taskId);
      await fetch("/api/send-career-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "task-completed",
          studentId: studentId,
          details: {
            taskTitle: taskObj?.title || "Career checklist item",
          },
        }),
      });

      await loadPortalData(studentId);
    } catch (err: any) {
      alert("Task solution submit failed: " + err.message);
    } finally {
      setSubmittingTaskFile(null);
    }
  };

  // Send message in Chat
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() && !chatFile || !studentId) return;

    setSendingMessage(true);
    const content = chatMessage;
    try {
      let attachmentUrl = null;
      let attachmentName = null;

      if (chatFile) {
        const fileExt = chatFile.name.split(".").pop();
        const randomName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${studentId}/career_chat_attachments/${randomName}`;

        const { error: uploadErr } = await supabase.storage
          .from("student-files")
          .upload(filePath, chatFile);

        if (uploadErr) throw uploadErr;

        const { data: { publicUrl } } = supabase.storage
          .from("student-files")
          .getPublicUrl(filePath);

        attachmentUrl = publicUrl;
        attachmentName = chatFile.name;
      }

      // Insert message
      const { error: dbErr } = await supabase
        .from("training_messages")
        .insert({
          student_id: studentId,
          sender_type: "student",
          message: content || `Sent attachment: ${attachmentName}`,
          attachment_url: attachmentUrl,
          attachment_name: attachmentName,
        });

      if (dbErr) throw dbErr;

      // Trigger message notification email
      await fetch("/api/send-career-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "message",
          studentId: studentId,
          details: {
            messageContent: content || `Sent attachment: ${attachmentName}`,
            senderType: "student",
          },
        }),
      });

      setChatMessage("");
      setChatFile(null);
      await loadPortalData(studentId);
    } catch (err: any) {
      alert("Error sending message: " + err.message);
    } finally {
      setSendingMessage(false);
    }
  };

  // Reschedule handler
  const handleRequestReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleMeetingId || !newDate || !newTime || !studentId) return;

    setRescheduling(true);
    try {
      const scheduledAt = new Date(`${newDate}T${newTime}`).toISOString();
      const selectedMeet = meetings.find((m) => m.id === rescheduleMeetingId);
      const updatedDescription = `${
        selectedMeet?.description || ""
      }\n[Candidate Reschedule Request: ${newDate} at ${newTime}. Reason: ${rescheduleNotes}]`.trim();

      const { error } = await supabase
        .from("meetings")
        .update({
          scheduled_at: scheduledAt,
          status: "Rescheduled",
          description: updatedDescription,
        })
        .eq("id", rescheduleMeetingId);

      if (error) throw error;

      alert("Reschedule request submitted successfully!");

      // Dispatch meeting reschedule notification email
      await fetch("/api/send-career-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "meeting-scheduled",
          studentId: studentId,
          details: {
            meetingTitle: `${selectedMeet?.title || "Session"} (Rescheduled Request)`,
            scheduledAt,
            meetingLink: selectedMeet?.meeting_link,
            meetingType: selectedMeet?.meeting_type,
            durationMinutes: selectedMeet?.duration_minutes,
          },
        }),
      });

      setRescheduleMeetingId(null);
      setNewDate("");
      setNewTime("");
      setRescheduleNotes("");
      await loadPortalData(studentId);
    } catch (err: any) {
      alert("Failed to submit reschedule request: " + err.message);
    } finally {
      setRescheduling(false);
    }
  };

  // Update profile handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return;

    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const { error } = await supabase
        .from("training_students")
        .update({
          student_phone: phone,
          notes: notes,
        })
        .eq("id", studentId);

      if (error) throw error;
      setProfileMsg("Profile updated successfully!");
      await loadPortalData(studentId);
    } catch (err: any) {
      setProfileMsg("Error updating profile: " + err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <SpinnerGap size={40} className="animate-spin text-primary" />
        <p className="text-slate-500 text-sm mt-4 font-medium">Loading Career Portal...</p>
      </div>
    );
  }

  // Render Login page if not authenticated
  if (!studentId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <CareerPortalLogin onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // Calculate task counts
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Retrieve counselor advisor profile details
  const counselorObj = studentData?.counselors;
  const serviceObj = studentData?.training_services;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row">
      {/* Impersonating Header */}
      {isImpersonating && (
        <div className="fixed top-0 inset-x-0 z-50 bg-red-600 text-white py-2.5 px-6 flex items-center justify-between text-xs font-semibold shadow-md">
          <div className="flex items-center gap-2">
            <ShieldWarning size={16} />
            <span>ADMIN IMPERSONATING: {studentData?.student_name} ({studentData?.student_email})</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white text-red-600 hover:bg-red-50 transition-colors px-3 py-1 rounded-full font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft size={12} weight="bold" />
            Exit Impersonation
          </button>
        </div>
      )}

      {/* Left Sidebar Navigation */}
      <aside className={`w-full md:w-64 bg-white border-r border-hairline/80 flex flex-col shrink-0 ${isImpersonating ? "pt-12" : ""}`}>
        <div className="p-6 border-b border-hairline/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
            <BriefcaseIcon size={20} className="text-white" />
          </div>
          <div className="overflow-hidden">
            <h2 className="font-display font-bold text-base text-primary truncate">ANNEX CAREERS</h2>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Placement Portal</p>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {[
            { id: "dashboard", label: "Dashboard", icon: User },
            { id: "tasks", label: "Task List", icon: Checks },
            { id: "documents", label: "Documents Center", icon: FileArrowUp },
            { id: "meetings", label: "Scheduled Meetings", icon: CalendarCheck },
            { id: "chat", label: "Advisor Chat", icon: ChatCircleDots },
            { id: "profile", label: "Candidate Profile", icon: Gear },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon size={18} weight={isActive ? "fill" : "regular"} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-hairline/60">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer"
          >
            <SignOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto min-h-screen">
        <div className="max-w-5xl mx-auto text-left">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-primary to-[#1c3c69] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                  <BriefcaseIcon size={240} />
                </div>
                <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-2">
                  Welcome back, {studentData?.student_name}!
                </h1>
                <p className="text-slate-300 text-sm max-w-xl">
                  Track your micro career services, complete tasks assigned by your career advisor, and view dynamic outcomes.
                </p>
                <div className="mt-6 inline-block bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/10">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Enrolled Service:</span>
                  <span className="text-sm font-bold text-gold">{serviceObj?.title || "Placement Consulting"}</span>
                </div>
              </div>

              {/* Progress and Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Career Goals Progress</span>
                        <h3 className="font-mono-data text-3xl font-bold text-primary mt-1">{progressPercent}%</h3>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                        <CheckCircle size={22} weight="fill" />
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <span className="text-xs text-slate-400 mt-3 block">{completedTasks} of {totalTasks} Tasks Completed</span>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Assigned Advisor</span>
                        <h3 className="font-display font-bold text-lg text-primary mt-1">
                          {counselorObj?.full_name || "Unassigned"}
                        </h3>
                        {counselorObj?.email && (
                          <span className="text-xs text-slate-500 block mt-1">{counselorObj.email}</span>
                        )}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center shrink-0">
                        <User size={20} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Next Scheduled Meeting</span>
                        {meetings.filter((m) => m.status === "Scheduled" || m.status === "Rescheduled").length > 0 ? (
                          (() => {
                            const nextMeet = meetings.filter((m) => m.status === "Scheduled" || m.status === "Rescheduled")[0];
                            return (
                              <div className="mt-2">
                                <h4 className="font-display font-bold text-sm text-primary">{nextMeet.title}</h4>
                                <span className="text-xs text-slate-500 block mt-0.5">
                                  {new Date(nextMeet.scheduled_at).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                                </span>
                              </div>
                            );
                          })()
                        ) : (
                          <h4 className="font-display font-medium text-slate-400 text-sm mt-3">No upcoming sessions</h4>
                        )}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                        <CalendarCheck size={20} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tasks Summary Card */}
              <div className="bg-white border border-hairline/80 rounded-3xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-display font-bold text-lg text-primary">Pending Tasks</h3>
                    <p className="text-xs text-slate-500 mt-1">Submit your task drafts or mock session files.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("tasks")}
                    className="text-xs font-bold text-primary hover:text-gold transition-colors flex items-center gap-1"
                  >
                    View All Tasks <ArrowRight size={14} />
                  </button>
                </div>

                {tasks.filter((t) => t.status !== "Completed").length === 0 ? (
                  <div className="text-center py-8 bg-subtle-gray rounded-2xl border border-hairline border-dashed">
                    <CheckCircle size={32} className="text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 font-medium">All tasks caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks
                      .filter((t) => t.status !== "Completed")
                      .slice(0, 3)
                      .map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-4 bg-slate-50 border border-hairline/60 rounded-xl"
                        >
                          <div>
                            <h4 className="text-sm font-semibold text-primary">{task.title}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No deadline"}
                            </p>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              task.status === "Under Review"
                                ? "bg-amber-50 text-amber-600 border-amber-100"
                                : task.status === "In Progress"
                                ? "bg-blue-50 text-blue-600 border-blue-100"
                                : "bg-slate-100 text-slate-500 border-slate-200"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TASKS */}
          {activeTab === "tasks" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display font-bold text-2xl text-primary">Your Tasks</h1>
                <p className="text-sm text-slate-500 mt-1">Upload files or review comments from your career advisor.</p>
              </div>

              {tasks.length === 0 ? (
                <div className="text-center py-16 bg-white border border-hairline rounded-3xl">
                  <Checks size={48} className="text-slate-300 mx-auto mb-4" />
                  <h3 className="font-display font-bold text-lg text-primary">No tasks assigned yet</h3>
                  <p className="text-sm text-slate-500 mt-1">Your advisor will add tasks once they assess your profile.</p>
                </div>
              ) : (
                <div className="bg-white border border-hairline rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-hairline text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          <th className="px-6 py-4">Task</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Due Date</th>
                          <th className="px-6 py-4">Solution / Attachment</th>
                          <th className="px-6 py-4">Advisor Review</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hairline">
                        {tasks.map((task) => (
                          <tr key={task.id} className="text-sm hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-5">
                              <h4 className="font-semibold text-primary">{task.title}</h4>
                              <p className="text-xs text-slate-400 mt-1 max-w-xs">{task.description}</p>
                            </td>
                            <td className="px-6 py-5">
                              <span
                                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                  task.status === "Completed"
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                    : task.status === "Under Review"
                                    ? "bg-amber-50 text-amber-600 border-amber-100"
                                    : task.status === "In Progress"
                                    ? "bg-blue-50 text-blue-600 border-blue-100"
                                    : "bg-slate-100 text-slate-500 border-slate-200"
                                }`}
                              >
                                {task.status}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-xs text-slate-500">
                              {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}
                            </td>
                            <td className="px-6 py-5">
                              {task.file_url ? (
                                <div className="space-y-1">
                                  <a
                                    href={task.file_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-gold transition-colors"
                                  >
                                    <FileText size={16} />
                                    <span className="truncate max-w-[120px]">{task.file_name || "Submitted File"}</span>
                                  </a>
                                  {task.status !== "Completed" && (
                                    <div className="relative mt-1">
                                      <input
                                        type="file"
                                        id={`re-upload-${task.id}`}
                                        className="hidden"
                                        onChange={(e) => handleUploadTaskFile(e, task.id)}
                                      />
                                      <label
                                        htmlFor={`re-upload-${task.id}`}
                                        className="text-[10px] font-bold uppercase text-slate-400 hover:text-primary cursor-pointer tracking-wider"
                                      >
                                        Re-Upload
                                      </label>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="relative">
                                  <input
                                    type="file"
                                    id={`upload-${task.id}`}
                                    className="hidden"
                                    onChange={(e) => handleUploadTaskFile(e, task.id)}
                                    disabled={submittingTaskFile !== null}
                                  />
                                  <label
                                    htmlFor={`upload-${task.id}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-hairline/80 hover:border-primary/20 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                                  >
                                    {submittingTaskFile === task.id ? (
                                      <SpinnerGap size={14} className="animate-spin text-primary" />
                                    ) : (
                                      <UploadSimple size={14} className="text-slate-400" />
                                    )}
                                    Submit Solution
                                  </label>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-5">
                              {task.feedback ? (
                                <div className="p-2.5 bg-slate-50 border border-hairline/60 rounded-xl max-w-xs text-xs text-slate-600">
                                  {task.feedback}
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400 italic">No feedback comments yet</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-display font-bold text-2xl text-primary">Documents Center</h1>
                  <p className="text-sm text-slate-500 mt-1">Upload resumes, portfolios, certificates, or letters.</p>
                </div>
                <div className="relative">
                  <input
                    type="file"
                    id="doc-upload"
                    className="hidden"
                    onChange={handleUploadDoc}
                    disabled={uploadingDoc}
                  />
                  <label
                    htmlFor="doc-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/95 shadow-sm rounded-full text-sm font-semibold cursor-pointer transition-all"
                  >
                    {uploadingDoc ? (
                      <SpinnerGap size={16} className="animate-spin" />
                    ) : (
                      <UploadSimple size={16} />
                    )}
                    Upload Document
                  </label>
                </div>
              </div>

              {documents.length === 0 ? (
                <div className="text-center py-16 bg-white border border-hairline rounded-3xl">
                  <FileArrowUp size={48} className="text-slate-300 mx-auto mb-4" />
                  <h3 className="font-display font-bold text-lg text-primary">No documents uploaded yet</h3>
                  <p className="text-sm text-slate-500 mt-1">Use the button above to upload credentials files.</p>
                </div>
              ) : (
                <div className="bg-white border border-hairline rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-hairline text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          <th className="px-6 py-4">Document Title</th>
                          <th className="px-6 py-4">Uploaded By</th>
                          <th className="px-6 py-4">Upload Date</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hairline">
                        {documents.map((doc) => (
                          <tr key={doc.id} className="text-sm hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2.5">
                                <FileText size={20} className="text-slate-400" />
                                <span className="font-semibold text-primary">{doc.title}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500 font-medium capitalize">
                              {doc.uploaded_by}
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-400">
                              {new Date(doc.created_at).toLocaleString([], { dateStyle: "medium" })}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <a
                                href={doc.file_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-gold transition-colors"
                              >
                                Download <Download size={14} />
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MEETINGS */}
          {activeTab === "meetings" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display font-bold text-2xl text-primary">Scheduled Meetings</h1>
                <p className="text-sm text-slate-500 mt-1">View scheduled mentoring sessions and request rescheduling.</p>
              </div>

              {meetings.length === 0 ? (
                <div className="text-center py-16 bg-white border border-hairline rounded-3xl">
                  <CalendarCheck size={48} className="text-slate-300 mx-auto mb-4" />
                  <h3 className="font-display font-bold text-lg text-primary">No meetings scheduled</h3>
                  <p className="text-sm text-slate-500 mt-1">Your advisor will schedule mock rounds or roadmaps here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {meetings.map((meet) => {
                    const scheduledDate = new Date(meet.scheduled_at);
                    const isPassed = scheduledDate < new Date();
                    return (
                      <Card key={meet.id} className={`${isPassed ? "opacity-65" : "border-primary/10 shadow-sm"}`}>
                        <CardHeader className="pb-3 text-left">
                          <div className="flex justify-between items-start">
                            <div>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                  meet.status === "Rescheduled"
                                    ? "bg-blue-50 text-blue-600 border-blue-100"
                                    : meet.status === "Cancelled"
                                    ? "bg-red-50 text-red-600 border-red-100"
                                    : meet.status === "Completed"
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                    : "bg-slate-100 text-slate-600 border-slate-200"
                                }`}
                              >
                                {meet.status}
                              </span>
                              <CardTitle className="text-base font-bold text-primary mt-2">{meet.title}</CardTitle>
                              <CardDescription className="text-xs text-slate-500 mt-1">{meet.description}</CardDescription>
                            </div>
                            <span className="text-xs font-mono-data text-slate-400 capitalize bg-slate-50 px-2 py-0.5 rounded">
                              {meet.meeting_type}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-left">
                          <div className="bg-slate-50 p-3.5 rounded-xl border border-hairline/60 space-y-2 text-xs text-slate-600">
                            <p>
                              <strong>Advisor:</strong> {meet.counselors?.full_name || "Assigned Consultant"}
                            </p>
                            <p>
                              <strong>Date:</strong> {scheduledDate.toLocaleDateString("en-US", { dateStyle: "long" })}
                            </p>
                            <p>
                              <strong>Time:</strong> {scheduledDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                            <p>
                              <strong>Duration:</strong> {meet.duration_minutes} minutes
                            </p>
                          </div>

                          {meet.meeting_link && (meet.status === "Scheduled" || meet.status === "Rescheduled") && (
                            <a
                              href={meet.meeting_link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                            >
                              <VideoCamera size={16} />
                              Join Meeting
                            </a>
                          )}

                          {!isPassed && (meet.status === "Scheduled" || meet.status === "Rescheduled") && (
                            <Button
                              variant="secondary"
                              className="w-full text-xs font-semibold py-2"
                              onClick={() => {
                                setRescheduleMeetingId(meet.id);
                                setNewDate(scheduledDate.toISOString().split("T")[0]);
                                setNewTime(scheduledDate.toTimeString().split(" ")[0].substring(0, 5));
                              }}
                            >
                              Request Reschedule
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Reschedule Request Modal */}
              <AnimatePresence>
                {rescheduleMeetingId && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setRescheduleMeetingId(null)}
                      className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
                    />

                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="relative w-full max-w-md bg-white border border-hairline shadow-2xl rounded-3xl p-6 z-10 text-left"
                    >
                      <button
                        onClick={() => setRescheduleMeetingId(null)}
                        className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                      >
                        <X size={16} />
                      </button>

                      <h3 className="font-display font-bold text-xl text-primary mb-1">
                        Request Reschedule
                      </h3>
                      <p className="text-xs text-slate-500 mb-4">
                        Provide a new date and time for review.
                      </p>

                      <form onSubmit={handleRequestReschedule} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">New Date</label>
                          <input
                            type="date"
                            required
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="w-full border border-hairline/80 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">New Time</label>
                          <input
                            type="time"
                            required
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            className="w-full border border-hairline/80 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Reason / Notes</label>
                          <textarea
                            value={rescheduleNotes}
                            onChange={(e) => setRescheduleNotes(e.target.value)}
                            placeholder="Brief reason for requesting change..."
                            rows={3}
                            className="w-full border border-hairline/80 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3 py-2 text-sm focus:outline-none resize-none"
                          />
                        </div>

                        <Button
                          variant="primary"
                          type="submit"
                          disabled={rescheduling}
                          className="w-full mt-2"
                        >
                          {rescheduling ? "Submitting..." : "Submit Reschedule Request"}
                        </Button>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* TAB 5: MESSAGES */}
          {activeTab === "chat" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display font-bold text-2xl text-primary">Consultant Chat</h1>
                <p className="text-sm text-slate-500 mt-1">Communicate directly with your assigned career advisor.</p>
              </div>

              <div className="bg-white border border-hairline rounded-3xl h-[600px] flex flex-col shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="px-6 py-4 bg-slate-50 border-b border-hairline flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {(counselorObj?.full_name || "A")[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-primary">{counselorObj?.full_name || "Career Advisor"}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Your assigned mentor</span>
                    </div>
                  </div>
                </div>

                {/* Chat Messages List */}
                <div className="flex-grow p-6 overflow-y-auto space-y-4 flex flex-col bg-slate-50/30">
                  {messages.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-slate-400">
                      <ChatCircleDots size={40} className="mb-2" />
                      <p className="text-xs">No chat logs recorded. Say hello to get started!</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isStudent = msg.sender_type === "student";
                      return (
                        <div
                          key={msg.id}
                          className={`max-w-[70%] rounded-2xl p-4 text-sm leading-relaxed ${
                            isStudent
                              ? "bg-primary text-white self-end rounded-tr-none"
                              : "bg-white border border-hairline text-slate-800 self-start rounded-tl-none shadow-sm"
                          }`}
                        >
                          <p className="white-space-pre-wrap">{msg.message}</p>
                          {msg.attachment_url && (
                            <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between gap-4">
                              <a
                                href={msg.attachment_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold underline truncate hover:text-white transition-all"
                              >
                                <Paperclip size={14} />
                                {msg.attachment_name || "Attachment"}
                              </a>
                            </div>
                          )}
                          <span className={`text-[9px] block text-right mt-1.5 ${isStudent ? "text-slate-300" : "text-slate-400"}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Input form */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-hairline flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="file"
                      id="chat-file-upload"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setChatFile(e.target.files[0]);
                        }
                      }}
                    />
                    <label
                      htmlFor="chat-file-upload"
                      className="p-2.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer block"
                    >
                      <Paperclip size={20} />
                    </label>
                  </div>

                  {chatFile && (
                    <div className="bg-slate-100 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 border">
                      <span className="truncate max-w-[100px] font-semibold">{chatFile.name}</span>
                      <button onClick={() => setChatFile(null)} className="text-red-500">
                        <X size={12} />
                      </button>
                    </div>
                  )}

                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type message here..."
                    className="flex-grow bg-slate-50 border border-hairline/80 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                    disabled={sendingMessage}
                  />

                  <button
                    type="submit"
                    disabled={sendingMessage}
                    className="p-2.5 bg-primary hover:bg-primary/95 text-white shadow rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                  >
                    {sendingMessage ? (
                      <SpinnerGap size={18} className="animate-spin" />
                    ) : (
                      <PaperPlaneRight size={18} />
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 6: PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display font-bold text-2xl text-primary">Candidate Profile</h1>
                <p className="text-sm text-slate-500 mt-1">Keep your contact coordinates and target details up to date.</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>Update details visible to your assigned consultant advisor.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    {profileMsg && (
                      <div
                        className={`p-3 border rounded-2xl flex items-start gap-2 text-xs ${
                          profileMsg.includes("Error")
                            ? "bg-red-50 border-red-200 text-red-600"
                            : "bg-emerald-50 border-emerald-200 text-emerald-600"
                        }`}
                      >
                        <WarningCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{profileMsg}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Candidate Name</label>
                        <input
                          type="text"
                          disabled
                          value={studentData?.student_name || ""}
                          className="w-full bg-slate-100 border border-hairline rounded-xl px-3 py-2 text-sm text-slate-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                        <input
                          type="email"
                          disabled
                          value={studentData?.student_email || ""}
                          className="w-full bg-slate-100 border border-hairline rounded-xl px-3 py-2 text-sm text-slate-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-hairline/80 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3 py-2.5 text-sm focus:outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Target / Message Notes</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        className="w-full border border-hairline/80 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3 py-2.5 text-sm focus:outline-none bg-white resize-none"
                      />
                    </div>

                    <Button
                      variant="primary"
                      type="submit"
                      disabled={savingProfile}
                      className="mt-2"
                    >
                      {savingProfile ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
