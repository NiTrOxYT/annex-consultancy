"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { 
  GraduationCap, CheckCircle, Clock, ChatTeardropText, 
  FileArrowUp, FileText, SignOut, Calendar, User, 
  PaperPlaneRight, Paperclip, ArrowSquareOut, WarningCircle, 
  UploadSimple, Check, X, SpinnerGap, Bell, ArrowLeft,
  CalendarCheck, ShieldWarning, ChatCircleDots, Gear, Checks, Download,
  VideoCamera, Phone, MapPin
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from "@/components/ui/card";

// Stages of application progress
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

// Document categories student can upload
const DOC_TYPES = [
  "Passport",
  "Academic Certificates",
  "IELTS / PTE",
  "SOP",
  "LOR",
  "Financial Documents",
  "Visa Documents"
];

export default function StudentDashboard() {
  const router = useRouter();
  
  // Impersonation & User State
  const [studentId, setStudentId] = React.useState<string | null>(null);
  const [isImpersonating, setIsImpersonating] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [studentData, setStudentData] = React.useState<any>(null);
  const [activeTab, setActiveTab] = React.useState<"dashboard" | "documents" | "offers" | "visa" | "chat" | "appointments" | "profile">("dashboard");

  // Dashboard Sub-states
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [documents, setDocuments] = React.useState<any[]>([]);
  const [offerLetters, setOfferLetters] = React.useState<any[]>([]);
  const [visaStatus, setVisaStatus] = React.useState<any>(null);
  const [messages, setMessages] = React.useState<any[]>([]);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [meetings, setMeetings] = React.useState<any[]>([]);
  const [hasMoreMessages, setHasMoreMessages] = React.useState(false);

  // Forms / Actions state
  const [uploadingDoc, setUploadingDoc] = React.useState<string | null>(null);
  const [chatMessage, setChatMessage] = React.useState("");
  const [chatFile, setChatFile] = React.useState<File | null>(null);
  const [sendingMessage, setSendingMessage] = React.useState(false);
  
  // Reschedule Form state
  const [rescheduleBookingId, setRescheduleBookingId] = React.useState<string | null>(null);
  const [newDate, setNewDate] = React.useState("");
  const [newTime, setNewTime] = React.useState("");
  const [rescheduleNotes, setRescheduleNotes] = React.useState("");
  const [rescheduling, setRescheduling] = React.useState(false);

  // Profile Edit State
  const [profileForm, setProfileForm] = React.useState({
    phone: "",
    academic_details: "",
    preferred_course: "",
    emergency_contact: "",
    passport_details: ""
  });
  const [savingProfile, setSavingProfile] = React.useState(false);
  const [profileMsg, setProfileMsg] = React.useState<string | null>(null);

  // Document preview state
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [previewName, setPreviewName] = React.useState<string | null>(null);

  const CHAT_LIMIT = 20;

  const loadChatMessages = React.useCallback(async (studentIdVal: string, offsetVal = 0) => {
    try {
      const { data, error } = await supabase
        .from("student_messages")
        .select(`
          *,
          message_attachments (*)
        `)
        .eq("student_id", studentIdVal)
        .order("created_at", { ascending: false })
        .range(offsetVal, offsetVal + CHAT_LIMIT - 1);

      if (error) throw error;

      const newMsgs = data || [];
      const hasMore = newMsgs.length === CHAT_LIMIT;
      setHasMoreMessages(hasMore);

      const reversedNewMsgs = [...newMsgs].reverse();

      if (offsetVal > 0) {
        setMessages(prev => [...reversedNewMsgs, ...prev]);
      } else {
        setMessages(reversedNewMsgs);
      }
    } catch (err: any) {
      console.error("Error loading chat messages:", err.message);
    }
  }, []);

  const markMessagesAsRead = React.useCallback(async (studentIdVal: string) => {
    try {
      const { error: updateErr } = await supabase
        .from("student_messages")
        .update({ status: "read" })
        .eq("student_id", studentIdVal)
        .eq("sender_type", "counselor")
        .neq("status", "read");

      if (updateErr) throw updateErr;

      await supabase
        .from("student_conversations")
        .update({ unread_count_student: 0 })
        .eq("student_id", studentIdVal);
    } catch (err: any) {
      console.error("Error marking messages as read:", err.message);
    }
  }, []);

  // Initialize and load session/impersonation details
  React.useEffect(() => {
    const initializePortal = async () => {
      setLoading(true);
      try {
        let activeStudentId: string | null = null;
        let adminMode = false;

        if (typeof window !== "undefined") {
          const impersonatedId = sessionStorage.getItem("annex_impersonate_student_id");
          if (impersonatedId) {
            activeStudentId = impersonatedId;
            adminMode = true;
            setIsImpersonating(true);
          }
        }

        if (!activeStudentId) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            // Resolve auth user ID → students.id via auth_user_id column
            const { data: studentRecord } = await supabase
              .from("students")
              .select("id")
              .eq("auth_user_id", session.user.id)
              .single();
            if (studentRecord) {
              activeStudentId = studentRecord.id;
            } else {
              console.error("[Diagnostic] No student record found for auth_user_id:", session.user.id);
            }
          }
        }

        if (!activeStudentId) {
          router.push("/student-login");
          return;
        }

        setStudentId(activeStudentId);
        await loadStudentData(activeStudentId);
      } catch (err) {
        console.error("Portal initialization error:", err);
      } finally {
        setLoading(false);
      }
    };
    initializePortal();
  }, [router]);

  // Realtime chat subscription effect
  React.useEffect(() => {
    if (!studentId) return;

    console.log(`[Diagnostic] Subscribing to realtime channel student_chat_messages:${studentId}`);
    const channel = supabase
      .channel(`student_chat_messages:${studentId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "student_messages",
          filter: `student_id=eq.${studentId}`,
        },
        async (payload) => {
          console.log(`[Diagnostic] Real-time message event: ${payload.eventType}`, payload);
          if (payload.eventType === "INSERT") {
            const newMsg = payload.new;
            // Fetch attachments if any exist
            const { data: atts } = await supabase
              .from("message_attachments")
              .select("*")
              .eq("message_id", newMsg.id);
            newMsg.message_attachments = atts || [];

            setMessages(prev => {
              // Filter out duplicate IDs or matching optimistic messages
              const filtered = prev.filter(m => {
                if (m.is_optimistic && m.sender_type === newMsg.sender_type && m.message === newMsg.message) {
                  console.log(`[Diagnostic] De-duplicating matched optimistic message`);
                  return false;
                }
                if (m.id === newMsg.id) return false;
                return true;
              });
              return [...filtered, newMsg];
            });

            // If active tab is chat and it's a counselor message, mark as read
            if (activeTab === "chat" && newMsg.sender_type === "counselor") {
              await markMessagesAsRead(studentId);
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedMsg = payload.new;
            const { data: atts } = await supabase
              .from("message_attachments")
              .select("*")
              .eq("message_id", updatedMsg.id);
            updatedMsg.message_attachments = atts || [];

            setMessages(prev => prev.map(m => m.id === updatedMsg.id ? { ...m, ...updatedMsg } : m));
          } else if (payload.eventType === "DELETE") {
            const deletedId = payload.old.id;
            setMessages(prev => prev.filter(m => m.id !== deletedId));
          }
        }
      )
      .subscribe((status, err) => {
        console.log(`[Diagnostic] Realtime Channel connection status change: ${status}`);
        if (err) {
          console.error(`[Diagnostic] Realtime Channel connection error:`, err);
        }
      });

    return () => {
      console.log(`[Diagnostic] Cleaning up/unsubscribing channel for studentId: ${studentId}`);
      supabase.removeChannel(channel);
    };
  }, [studentId, activeTab, markMessagesAsRead]);

  // Realtime subscription for meetings
  React.useEffect(() => {
    if (!studentId) return;

    console.log(`[Diagnostic] Subscribing to realtime meetings channel for studentId: ${studentId}`);
    const meetingsChannel = supabase
      .channel(`student_meetings:${studentId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "meetings",
          filter: `student_id=eq.${studentId}`,
        },
        async (payload) => {
          console.log(`[Diagnostic] Real-time meetings event: ${payload.eventType}`, payload);
          // Refresh all meetings on any change
          const { data: refreshedMeetings } = await supabase
            .from("meetings")
            .select("*, counselors(full_name)")
            .eq("student_id", studentId)
            .order("scheduled_at", { ascending: true });
          setMeetings(refreshedMeetings || []);
        }
      )
      .subscribe((status, err) => {
        console.log(`[Diagnostic] Realtime meetings channel status: ${status}`);
        if (err) console.error(`[Diagnostic] Realtime meetings channel error:`, err);
      });

    return () => {
      console.log(`[Diagnostic] Cleaning up meetings channel for studentId: ${studentId}`);
      supabase.removeChannel(meetingsChannel);
    };
  }, [studentId]);

  // Mark messages as read when Chat tab is opened
  React.useEffect(() => {
    if (activeTab === "chat" && studentId) {
      markMessagesAsRead(studentId);
    }
  }, [activeTab, studentId, markMessagesAsRead]);

  // Load everything for the specific student ID
  const loadStudentData = async (id: string) => {
    try {
      // 1. Fetch Student Info (including assigned counselor profile details)
      const { data: student, error: studentErr } = await supabase
        .from("students")
        .select("*, counselors(*)")
        .eq("id", id)
        .single();
      
      if (studentErr) throw studentErr;
      setStudentData(student);
      setProfileForm({
        phone: student.phone || "",
        academic_details: student.academic_details || "",
        preferred_course: student.preferred_course || "",
        emergency_contact: student.emergency_contact || "",
        passport_details: student.passport_details || ""
      });

      // 2. Fetch Tasks
      const { data: studentTasks } = await supabase
        .from("student_tasks")
        .select("*")
        .eq("student_id", id)
        .order("created_at", { ascending: true });
      setTasks(studentTasks || []);

      // 3. Fetch Documents
      const { data: studentDocs } = await supabase
        .from("student_documents")
        .select("*")
        .eq("student_id", id)
        .order("uploaded_at", { ascending: false });
      setDocuments(studentDocs || []);

      // 4. Fetch Offer Letters
      const { data: studentOffers } = await supabase
        .from("student_offer_letters")
        .select("*")
        .eq("student_id", id)
        .order("uploaded_at", { ascending: false });
      setOfferLetters(studentOffers || []);

      // 5. Fetch Visa Timeline
      const { data: studentVisa } = await supabase
        .from("student_visa_status")
        .select("*")
        .eq("student_id", id)
        .maybeSingle();
      setVisaStatus(studentVisa);

      // 6. Fetch Messages
      await loadChatMessages(id);

      // 7. Fetch Notifications
      const { data: studentNotifs } = await supabase
        .from("student_notifications")
        .select("*")
        .eq("student_id", id)
        .order("created_at", { ascending: false });
      setNotifications(studentNotifs || []);

      // 8. Fetch Meetings (from meetings table, with counselor join)
      const { data: studentMeetings } = await supabase
        .from("meetings")
        .select("*, counselors(full_name)")
        .eq("student_id", id)
        .order("scheduled_at", { ascending: true });
      setMeetings(studentMeetings || []);
    } catch (err: any) {
      console.error("Error loading student data:", err.message);
    }
  };

  // Sign out / Exit impersonation handler
  const handleLogout = async () => {
    if (isImpersonating) {
      sessionStorage.removeItem("annex_impersonate_student_id");
      router.push("/admin");
    } else {
      await supabase.auth.signOut();
      router.push("/student-login");
    }
  };

  // Mark task completed
  const handleToggleTask = async (taskId: string, currentCompleted: boolean) => {
    try {
      const { error } = await supabase
        .from("student_tasks")
        .update({ completed: !currentCompleted })
        .eq("id", taskId);
      if (error) throw error;
      
      // Update UI
      setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !currentCompleted } : t));
      
      // Log Activity
      await supabase.from("student_activity_logs").insert({
        student_id: studentId,
        action: `Task ${!currentCompleted ? 'Completed' : 'Reopened'}`,
        details: `Task ID: ${taskId}`
      });
    } catch (err: any) {
      alert("Error updating task: " + err.message);
    }
  };

  // Upload/Replace student document
  const handleUploadDocument = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    // File size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit.");
      return;
    }

    setUploadingDoc(type);
    try {
      const fileExt = file.name.split(".").pop();
      const randomName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${studentId}/documents/${type.toLowerCase().replace(/[^a-z0-9]+/g, "-")}_${randomName}`;

      // 1. Upload to Supabase Storage Bucket
      const { data: storageData, error: uploadErr } = await supabase.storage
        .from("student-files")
        .upload(filePath, file);

      if (uploadErr) {
        throw new Error("Failed to upload to storage. Check if 'student-files' bucket is initialized.");
      }

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("student-files")
        .getPublicUrl(filePath);

      // 3. Upsert row in student_documents
      const existingDoc = documents.find(d => d.document_type === type);
      
      if (existingDoc) {
        const { error: dbErr } = await supabase
          .from("student_documents")
          .update({
            file_url: publicUrl,
            file_name: file.name,
            status: "Pending Review",
            feedback: null,
            uploaded_at: new Date().toISOString()
          })
          .eq("id", existingDoc.id);
        if (dbErr) throw dbErr;
      } else {
        const { error: dbErr } = await supabase
          .from("student_documents")
          .insert({
            student_id: studentId,
            document_type: type,
            file_url: publicUrl,
            file_name: file.name,
            status: "Pending Review"
          });
        if (dbErr) throw dbErr;
      }

      // Refresh Data
      await loadStudentData(studentId!);
      
      // Log activity
      await supabase.from("student_activity_logs").insert({
        student_id: studentId,
        action: "Document Uploaded",
        details: `Type: ${type}, File: ${file.name}`
      });

    } catch (err: any) {
      alert(err.message || "Error uploading document.");
    } finally {
      setUploadingDoc(null);
    }
  };

  // Send counselor chat message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() && !chatFile) return;

    setSendingMessage(true);
    const originalMsgText = chatMessage;
    const tempId = `temp-${Date.now()}`;
    const attachmentPlaceholderName = chatFile ? chatFile.name : null;

    // Create optimistic message
    const optimisticMsg = {
      id: tempId,
      student_id: studentId,
      sender_type: "student",
      message: originalMsgText || `Uploaded attachment: ${attachmentPlaceholderName}`,
      attachment_url: null,
      attachment_name: attachmentPlaceholderName,
      status: "sending",
      created_at: new Date().toISOString(),
      is_optimistic: true
    };

    console.log(`[Diagnostic] Optimistic message added:`, optimisticMsg);
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      let attachmentUrl = null;
      let attachmentName = null;

      // Upload file if selected
      if (chatFile) {
        const fileExt = chatFile.name.split(".").pop();
        const randomName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${studentId}/chat_attachments/${randomName}`;

        const { data: storageData, error: uploadErr } = await supabase.storage
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
      const { data: insertedMsg, error: msgErr } = await supabase
        .from("student_messages")
        .insert({
          student_id: studentId,
          sender_type: "student",
          message: originalMsgText || `Uploaded attachment: ${attachmentName}`,
          attachment_url: attachmentUrl,
          attachment_name: attachmentName,
          status: "sent"
        })
        .select()
        .single();
      
      if (msgErr) throw msgErr;
      console.log(`[Diagnostic] Supabase database insert succeeded:`, insertedMsg);

      // Insert message attachments mapping if exists
      if (chatFile && attachmentUrl && insertedMsg) {
        await supabase
          .from("message_attachments")
          .insert({
            message_id: insertedMsg.id,
            file_url: attachmentUrl,
            file_name: attachmentName,
            file_type: chatFile.type,
            file_size: chatFile.size
          });
      }

      setChatMessage("");
      setChatFile(null);
      
      // Update the optimistic message with the database inserted message, resolving status
      setMessages(prev => prev.map(m => m.id === tempId ? { ...insertedMsg, message_attachments: [] } : m));

      // Trigger server-side email notification
      fetch("/api/send-chat-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          senderType: "student",
          studentId: studentId,
          messageContent: originalMsgText || `Uploaded attachment: ${attachmentName}`
        })
      }).catch(err => console.error("Email notification trigger failed:", err));

      // Log activity
      await supabase.from("student_activity_logs").insert({
        student_id: studentId,
        action: "Message Sent",
        details: originalMsgText.substring(0, 50) || `Attachment: ${attachmentName}`
      });
      
    } catch (err: any) {
      console.error(`[Diagnostic] Supabase database insert failed:`, err);
      // Mark optimistic message as failed
      setMessages(prev => prev.map(m => m.id === tempId ? { ...m, status: "failed" } : m));
      alert("Error sending message: " + err.message);
    } finally {
      setSendingMessage(false);
    }
  };

  // Reschedule requested meeting
  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleBookingId || !newDate || !newTime) return;

    setRescheduling(true);
    try {
      const selectedMeeting = meetings.find(m => m.id === rescheduleBookingId);
      const scheduledAt = new Date(`${newDate}T${newTime}`).toISOString();
      const updatedDescription = `${selectedMeeting?.description || ""}\n[Student Reschedule Request: ${newDate} at ${newTime}. Note: ${rescheduleNotes}]`.trim();

      const { error } = await supabase
        .from("meetings")
        .update({
          scheduled_at: scheduledAt,
          status: "Rescheduled",
          description: updatedDescription
        })
        .eq("id", rescheduleBookingId);
      
      if (error) throw error;

      alert("Reschedule request submitted successfully. Counselor will review it shortly.");
      
      // Send reschedule email / API call
      fetch("/api/send-meeting-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updated",
          studentId: studentId,
          meetingData: {
            title: selectedMeeting?.title || "Counseling Session",
            scheduled_at: scheduledAt,
            meeting_link: selectedMeeting?.meeting_link || undefined,
            meeting_type: selectedMeeting?.meeting_type || "Google Meet",
            duration_minutes: selectedMeeting?.duration_minutes || 30
          }
        })
      }).catch(err => console.error("Meeting reschedule email error:", err));

      setRescheduleBookingId(null);
      setNewDate("");
      setNewTime("");
      setRescheduleNotes("");
      
      await loadStudentData(studentId!);

      // Log Activity
      await supabase.from("student_activity_logs").insert({
        student_id: studentId,
        action: "Meeting Rescheduled",
        details: `Student rescheduled meeting "${selectedMeeting?.title || ""}" to ${newDate} at ${newTime}.`
      });

      // Notification
      await supabase.from("student_notifications").insert([{
        student_id: studentId,
        title: "Meeting Rescheduled",
        content: `You rescheduled "${selectedMeeting?.title || ""}" to ${new Date(scheduledAt).toLocaleString()}.`
      }]);

    } catch (err: any) {
      alert("Error requesting reschedule: " + err.message);
    } finally {
      setRescheduling(false);
    }
  };

  // Save student profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const { error } = await supabase
        .from("students")
        .update({
          phone: profileForm.phone,
          academic_details: profileForm.academic_details,
          preferred_course: profileForm.preferred_course,
          emergency_contact: profileForm.emergency_contact,
          passport_details: profileForm.passport_details,
          last_activity: new Date().toISOString()
        })
        .eq("id", studentId);

      if (error) throw error;
      setProfileMsg("Profile updated successfully!");
      await loadStudentData(studentId!);

      // Log Activity
      await supabase.from("student_activity_logs").insert({
        student_id: studentId,
        action: "Profile Updated",
        details: "Student modified profile parameters"
      });

    } catch (err: any) {
      setProfileMsg("Error updating profile: " + err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  // Mark notification as read
  const handleReadNotification = async (notifId: string) => {
    try {
      const { error } = await supabase
        .from("student_notifications")
        .update({ read: true })
        .eq("id", notifId);
      if (error) throw error;
      setNotifications(notifications.map(n => n.id === notifId ? { ...n, read: true } : n));
    } catch (err: any) {
      console.error("Error marking notification read:", err.message);
    }
  };

  // Calculate overall progress percentage
  const currentStageIndex = studentData ? STAGES.indexOf(studentData.current_stage) : 0;
  const progressPercent = Math.round(((currentStageIndex + 1) / STAGES.length) * 100);

  // Find nearest upcoming meeting
  const upcomingMeeting = React.useMemo(() => {
    const activeMeetings = meetings.filter(m => (m.status === "Scheduled" || m.status === "Rescheduled") && new Date(m.scheduled_at) > new Date());
    if (activeMeetings.length === 0) return null;
    return [...activeMeetings].sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())[0];
  }, [meetings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <SpinnerGap size={40} className="animate-spin text-primary" />
        <p className="text-slate-500 text-sm mt-4 font-medium">Loading Student Portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row">
      
      {/* Impersonating Alert Header */}
      {isImpersonating && (
        <div className="fixed top-0 inset-x-0 z-50 bg-red-600 text-white py-2.5 px-6 flex items-center justify-between text-xs font-semibold shadow-md">
          <div className="flex items-center gap-2">
            <ShieldWarning size={16} />
            <span>ADMIN MODE: Impersonating Student {studentData?.name} ({studentData?.email})</span>
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

      {/* Sidebar Navigation */}
      <aside className={`w-full md:w-64 bg-white border-r border-hairline/80 flex flex-col shrink-0 ${isImpersonating ? "pt-12" : ""}`}>
        <div className="p-6 border-b border-hairline/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
            <GraduationCap size={22} weight="fill" />
          </div>
          <div className="overflow-hidden">
            <h2 className="font-display font-bold text-base text-primary truncate">ANNEX</h2>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Student Portal</p>
          </div>
        </div>

        {/* Tab Items */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {[
            { id: "dashboard", label: "Dashboard", icon: User },
            { id: "documents", label: "Document Center", icon: FileArrowUp },
            { id: "offers", label: "Offer Letters", icon: FileText },
            { id: "visa", label: "Visa Timeline", icon: Calendar },
            { id: "chat", label: "Counselor Chat", icon: ChatCircleDots },
            { id: "appointments", label: "Scheduled Meetings", icon: CalendarCheck },
            { id: "profile", label: "My Profile", icon: Gear }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setPreviewUrl(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/10" 
                    : "text-slate-600 hover:text-primary hover:bg-subtle-gray"
                }`}
              >
                <Icon size={18} weight={isActive ? "fill" : "regular"} />
                <span>{tab.label}</span>
                
                {/* Notification bubble for Chat or Notifications count */}
                {tab.id === "chat" && (() => {
                  const unreadCount = messages.filter(m => m.sender_type === "counselor" && m.status !== "read").length;
                  if (unreadCount === 0) return null;
                  return (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[18px] text-center animate-pulse">
                      {unreadCount}
                    </span>
                  );
                })()}
              </button>
            );
          })}
        </nav>

        {/* User profile details in sidebar footer */}
        <div className="p-4 border-t border-hairline/60 bg-subtle-gray/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs uppercase text-primary shrink-0">
              {studentData?.name?.charAt(0) || "S"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-primary truncate leading-tight">{studentData?.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{studentData?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
            title="Log Out"
          >
            <SignOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-grow p-6 md:p-10 overflow-y-auto max-w-6xl mx-auto w-full ${isImpersonating ? "pt-20" : ""}`}>
        
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            
            {/* Header section */}
            <div className="bg-white border border-hairline/80 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="font-display font-bold text-2xl md:text-3xl text-primary tracking-tight mb-2">
                  Welcome back, {studentData?.name}!
                </h1>
                <p className="text-slate-500 text-sm md:text-base">
                  Track and manage your application process to study in <span className="font-bold text-primary">{studentData?.destination || "your dream country"}</span>.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <div className="px-4 py-2 rounded-2xl bg-subtle-gray border border-hairline/60 text-xs font-semibold">
                  <span className="text-slate-400 mr-1.5 uppercase tracking-wider text-[9px]">Intake:</span> 
                  <span className="text-primary">{studentData?.intake || "N/A"}</span>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-subtle-gray border border-hairline/60 text-xs font-semibold">
                  <span className="text-slate-400 mr-1.5 uppercase tracking-wider text-[9px]">Counselor:</span> 
                  <span className="text-primary">{studentData?.counselor || "Annex Team"}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar & Stage display */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Application Journey</CardTitle>
                    <CardDescription>Visual progress of your consultancy onboarding milestones</CardDescription>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold font-display text-primary">{progressPercent}%</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Completed</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Horizontal Progress Meter */}
                <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>

                {/* Visual Timeline Stepper */}
                <div className="block md:hidden">
                  {/* Vertical Stepper for Mobile */}
                  <div className="relative pl-6 border-l border-slate-200 space-y-4 py-2 ml-3">
                    {STAGES.map((stage, idx) => {
                      const isDone = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      const isUpcoming = idx > currentStageIndex;
                      
                      return (
                        <div key={stage} className="relative flex items-start gap-4">
                          {/* Stepper Dot */}
                          <div className={`absolute -left-[30px] w-4 h-4 rounded-full border border-slate-350 bg-white flex items-center justify-center transition-all ${
                            isDone 
                              ? "bg-emerald-500 border-emerald-500 text-white" 
                              : isCurrent 
                              ? "bg-primary border-primary text-white scale-110 shadow-sm" 
                              : "text-slate-400"
                          }`}>
                            {isDone && <Check size={8} weight="bold" className="text-white" />}
                            {isCurrent && <Clock size={8} weight="bold" className="text-white animate-pulse" />}
                          </div>
                          
                          <div className={`flex-grow p-4 rounded-2xl border transition-all ${
                            isDone 
                              ? "bg-emerald-50/20 border-emerald-100/60 text-emerald-800" 
                              : isCurrent 
                              ? "bg-primary text-white border-primary shadow-sm" 
                              : "bg-white border-hairline/80 text-slate-500"
                          }`}>
                            <span className="text-[9px] uppercase font-bold tracking-wider opacity-70 block mb-1">Stage {idx + 1}</span>
                            <span className="text-xs font-bold leading-tight break-words">{stage}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="hidden md:block">
                  {/* Horizontal Scrollable Stepper for Desktop */}
                  <div className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin">
                    {STAGES.map((stage, idx) => {
                      const isDone = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      const isUpcoming = idx > currentStageIndex;
                      
                      return (
                        <div 
                          key={stage} 
                          className={`snap-align-start flex-grow shrink-0 w-[170px] p-4 rounded-2xl border flex flex-col justify-between min-h-[105px] gap-2 transition-all ${
                            isDone 
                              ? "bg-emerald-50/20 border-emerald-100 text-emerald-800 shadow-[0_2px_8px_rgba(16,185,129,0.02)]" 
                              : isCurrent 
                              ? "bg-primary text-white border-primary shadow-md scale-102 font-medium" 
                              : "bg-white border-hairline/85 text-slate-400"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">Stage {idx + 1}</span>
                            {isDone && <CheckCircle size={15} className="text-emerald-500 shrink-0" weight="fill" />}
                            {isCurrent && <Clock size={15} className="text-white shrink-0 animate-pulse" weight="fill" />}
                          </div>
                          <span className="text-xs font-bold leading-tight break-words pr-1 mt-2">{stage}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Meeting Widget */}
            {upcomingMeeting && (
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-md border border-slate-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                      Upcoming Consultation
                    </span>
                    <span className="text-xs text-slate-300 flex items-center gap-1">
                      <Clock size={14} />
                      {upcomingMeeting.duration_minutes} mins
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg md:text-xl tracking-tight text-white">
                      {upcomingMeeting.title}
                    </h3>
                    {upcomingMeeting.description && (
                      <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 max-w-xl">
                        {upcomingMeeting.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-slate-400" />
                      <span>
                        {new Date(upcomingMeeting.scheduled_at).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        at{" "}
                        {new Date(upcomingMeeting.scheduled_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-slate-400" />
                      <span>{upcomingMeeting.counselors?.full_name || "Annex Counselor"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                  {upcomingMeeting.meeting_link ? (
                    <a
                      href={upcomingMeeting.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-grow md:flex-grow-0 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-all text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/30"
                    >
                      Join Meeting
                      <ArrowSquareOut size={13} />
                    </a>
                  ) : (
                    <span className="text-xs font-medium text-slate-400 italic bg-slate-800 px-4 py-2.5 rounded-full border border-slate-700">
                      Link will be shared shortly
                    </span>
                  )}
                  <button
                    onClick={() => setActiveTab("appointments")}
                    className="flex-grow md:flex-grow-0 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-full transition-all text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    View All
                  </button>
                </div>
              </div>
            )}

            {/* Split layout: Pending tasks & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Tasks List */}
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Tasks checklist</CardTitle>
                  <CardDescription>Action items allocated by your counselor</CardDescription>
                </CardHeader>
                <CardContent>
                  {tasks.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">
                      <CheckCircle size={36} className="mx-auto text-emerald-500 mb-2 opacity-50" />
                      <p className="text-sm">All caught up! No tasks currently assigned.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tasks.map(task => (
                        <div 
                          key={task.id} 
                          className={`flex items-center gap-3.5 p-4 rounded-2xl border transition-all ${
                            task.completed 
                              ? "bg-slate-50/50 border-hairline/40 opacity-75" 
                              : "bg-white border-hairline hover:border-slate-300"
                          }`}
                        >
                          <button 
                            onClick={() => handleToggleTask(task.id, task.completed)}
                            className="cursor-pointer shrink-0"
                            disabled={task.approved}
                          >
                            {task.completed ? (
                              <CheckCircle size={24} className="text-emerald-500" weight="fill" />
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-slate-300 hover:border-primary transition-colors" />
                            )}
                          </button>

                          <div className="flex-grow">
                            <h4 className={`text-sm font-bold ${task.completed ? "line-through text-slate-400" : "text-primary"}`}>
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
                            )}
                          </div>

                          {/* Approval Status Chip */}
                          <div className="shrink-0 text-right">
                            {task.approved ? (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                                Verified
                              </span>
                            ) : task.completed ? (
                              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                                Pending Approval
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                Required
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Notification feed */}
              <Card>
                <CardHeader>
                  <CardTitle>In-App Alerts & Messages</CardTitle>
                  <CardDescription>Recent notification updates for approvals, chat replies, and timelines</CardDescription>
                </CardHeader>
                <CardContent>
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">
                      <Bell size={36} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-sm">No new notification alerts.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                      {notifications.map(notif => (
                        <div 
                          key={notif.id}
                          onClick={() => !notif.read && handleReadNotification(notif.id)}
                          className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-colors cursor-pointer ${
                            notif.read 
                              ? "bg-white border-hairline/60 text-slate-600" 
                              : "bg-primary/5 border-primary/20 text-primary"
                          }`}
                        >
                          <Bell size={18} className="mt-0.5 shrink-0" weight={notif.read ? "regular" : "fill"} />
                          <div className="flex-grow">
                            <h4 className="text-sm font-bold">{notif.title}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{notif.content}</p>
                            <span className="text-[10px] text-slate-400 block mt-2">
                              {new Date(notif.created_at).toLocaleDateString()} at {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {!notif.read && (
                            <span className="w-2.5 h-2.5 bg-primary rounded-full shrink-0 mt-1.5" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>

          </div>
        )}

        {/* TAB 2: DOCUMENT CENTER */}
        {activeTab === "documents" && (
          <div className="space-y-8">
            <div className="max-w-3xl">
              <h1 className="font-display font-bold text-2xl md:text-3xl text-primary tracking-tight mb-2">
                Document Upload Center
              </h1>
              <p className="text-slate-500 text-sm">
                Upload your files in high-resolution (max 10MB, PDF/JPG/PNG). Your counselor reviews files instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Document items checklist */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Mandatory Application Documents</CardTitle>
                  <CardDescription>Please upload your credentials under the respective categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-hairline">
                    {DOC_TYPES.map(type => {
                      const fileRecord = documents.find(d => d.document_type === type);
                      const isUploading = uploadingDoc === type;
                      
                      return (
                        <div key={type} className="py-4.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          
                          {/* File status indicators */}
                          <div className="flex items-start gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                              fileRecord?.status === "Approved" 
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                                : fileRecord?.status === "Rejected"
                                ? "bg-red-50 text-red-600 border border-red-100"
                                : fileRecord?.status === "Requires Correction"
                                ? "bg-amber-50 text-amber-600 border border-amber-100"
                                : fileRecord 
                                ? "bg-blue-50 text-blue-600 border border-blue-100 animate-pulse"
                                : "bg-slate-100 text-slate-400 border border-slate-200"
                            }`}>
                              <FileText size={18} weight="fill" />
                            </div>

                            <div>
                              <h4 className="text-sm font-bold text-primary">{type}</h4>
                              {fileRecord ? (
                                <div className="space-y-1 mt-1">
                                  <p className="text-xs text-slate-500 truncate max-w-[250px] sm:max-w-[400px]">
                                    {fileRecord.file_name}
                                  </p>
                                  {fileRecord.feedback && (
                                    <p className="text-xs text-red-600 font-medium bg-red-50 p-2 rounded-xl mt-1 border border-red-100">
                                      Counselor Feed: {fileRecord.feedback}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-xs text-slate-400 mt-0.5">Not uploaded yet</p>
                              )}
                            </div>
                          </div>

                          {/* Status and Action Buttons */}
                          <div className="flex items-center gap-2.5 sm:self-center ml-12 sm:ml-0">
                            
                            {fileRecord && (
                              <>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                                  fileRecord.status === "Approved" 
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                                    : fileRecord.status === "Rejected"
                                    ? "bg-red-50 text-red-600 border-red-200"
                                    : fileRecord.status === "Requires Correction"
                                    ? "bg-amber-50 text-amber-600 border-amber-200"
                                    : "bg-blue-50 text-blue-600 border-blue-200"
                                }`}>
                                  {fileRecord.status}
                                </span>

                                <button
                                  onClick={() => { setPreviewUrl(fileRecord.file_url); setPreviewName(fileRecord.file_name); }}
                                  className="px-3 py-1.5 rounded-full border border-hairline hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
                                >
                                  Preview
                                </button>
                                <a 
                                  href={fileRecord.file_url} 
                                  download
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-full border border-hairline hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors flex items-center gap-1"
                                >
                                  <ArrowSquareOut size={12} />
                                  Get
                                </a>
                              </>
                            )}

                            {/* Uploader Input Wrapper */}
                            <label className={`relative px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                              isImpersonating 
                                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" 
                                : isUploading
                                ? "bg-slate-50 border-slate-200"
                                : fileRecord 
                                ? "bg-white border-hairline hover:border-slate-300 text-slate-600" 
                                : "bg-primary text-white border-primary hover:bg-primary/95 shadow-sm"
                            }`}>
                              {isUploading ? (
                                <SpinnerGap size={14} className="animate-spin text-primary" />
                              ) : (
                                <UploadSimple size={14} />
                              )}
                              <span>{isUploading ? "Uploading..." : fileRecord ? "Replace" : "Upload File"}</span>
                              <input 
                                type="file" 
                                className="hidden" 
                                onChange={(e) => handleUploadDocument(e, type)}
                                disabled={isUploading || isImpersonating}
                              />
                            </label>

                          </div>

                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Inline file preview block */}
              {previewUrl && (
                <Card className="md:col-span-2 border-primary/40 bg-slate-50/50">
                  <CardHeader className="flex flex-row items-center justify-between border-b border-hairline/60 pb-3">
                    <div>
                      <CardTitle>File Previewer</CardTitle>
                      <CardDescription className="truncate max-w-[300px] sm:max-w-xl">{previewName}</CardDescription>
                    </div>
                    <button 
                      onClick={() => { setPreviewUrl(null); setPreviewName(null); }}
                      className="p-1 rounded-full hover:bg-slate-200 transition-colors text-slate-500 cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </CardHeader>
                  <CardContent className="pt-6 flex justify-center min-h-[400px]">
                    {previewUrl.toLowerCase().match(/\.(jpeg|jpg|gif|png|webp)/) || previewUrl.includes("chat_attachments") || previewUrl.includes("documents") ? (
                      <div className="relative max-w-full max-h-[600px] border border-hairline rounded-2xl overflow-hidden shadow-inner">
                        <img 
                          src={previewUrl} 
                          alt="Document Preview" 
                          className="object-contain max-h-[500px] w-auto h-auto max-w-full"
                          onError={(e) => {
                            // Fallback if image tag fails or is actually a PDF
                            (e.target as HTMLElement).style.display = 'none';
                            const iframe = document.getElementById('preview-iframe');
                            if (iframe) iframe.style.display = 'block';
                          }}
                        />
                        <iframe 
                          id="preview-iframe"
                          src={`https://docs.google.com/gview?url=${encodeURIComponent(previewUrl)}&embedded=true`}
                          className="w-full h-[500px] border-0 hidden"
                        />
                      </div>
                    ) : (
                      <iframe 
                        src={`https://docs.google.com/gview?url=${encodeURIComponent(previewUrl)}&embedded=true`}
                        className="w-full h-[500px] border border-hairline rounded-2xl shadow-inner bg-white"
                      />
                    )}
                  </CardContent>
                </Card>
              )}

            </div>
          </div>
        )}

        {/* TAB 3: OFFER LETTER CENTER */}
        {activeTab === "offers" && (
          <div className="space-y-8">
            <div className="max-w-3xl">
              <h1 className="font-display font-bold text-2xl md:text-3xl text-primary tracking-tight mb-2">
                Offer Letter Center
              </h1>
              <p className="text-slate-500 text-sm">
                Access your conditional/unconditional offers, CAS validation sheets, and receipts uploaded by Annex counselors.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Documents Issued by Universities</CardTitle>
                <CardDescription>Review and download formal admission sheets</CardDescription>
              </CardHeader>
              <CardContent>
                {offerLetters.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <FileText size={48} className="mx-auto text-slate-300 mb-3" />
                    <h3 className="font-bold text-base text-slate-500">No Offer Letters Yet</h3>
                    <p className="text-sm mt-1">Your counselor will upload offer letters once received from universities.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {offerLetters.map(letter => (
                      <div 
                        key={letter.id} 
                        className="bg-white border border-hairline/80 p-5 rounded-2xl flex items-start justify-between gap-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-primary/5 text-primary border border-primary/10 flex items-center justify-center shrink-0">
                            <FileText size={22} weight="fill" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-primary">{letter.letter_type}</h4>
                            <p className="text-xs text-slate-500 truncate max-w-[200px] mt-0.5">{letter.file_name}</p>
                            <span className="text-[10px] text-slate-400 block mt-2">
                              Uploaded {new Date(letter.uploaded_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => { setPreviewUrl(letter.file_url); setPreviewName(letter.file_name); }}
                            className="px-3 py-1.5 rounded-full border border-hairline hover:bg-slate-50 text-xs font-semibold text-slate-600 cursor-pointer"
                          >
                            Preview
                          </button>
                          <a 
                            href={letter.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-full border border-hairline text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors"
                            title="Download"
                          >
                            <ArrowSquareOut size={16} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reuse inline file previewer for offer letters */}
            {previewUrl && (
              <Card className="border-primary/40 bg-slate-50/50">
                <CardHeader className="flex flex-row items-center justify-between border-b border-hairline/60 pb-3">
                  <div>
                    <CardTitle>File Previewer</CardTitle>
                    <CardDescription className="truncate max-w-[300px] sm:max-w-xl">{previewName}</CardDescription>
                  </div>
                  <button 
                    onClick={() => { setPreviewUrl(null); setPreviewName(null); }}
                    className="p-1 rounded-full hover:bg-slate-200 transition-colors text-slate-500 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </CardHeader>
                <CardContent className="pt-6 flex justify-center min-h-[400px]">
                  <iframe 
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(previewUrl)}&embedded=true`}
                    className="w-full h-[500px] border border-hairline rounded-2xl shadow-inner bg-white"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* TAB 4: VISA TIMELINE */}
        {activeTab === "visa" && (
          <div className="space-y-8">
            <div className="max-w-3xl">
              <h1 className="font-display font-bold text-2xl md:text-3xl text-primary tracking-tight mb-2">
                Visa Timeline Tracker
              </h1>
              <p className="text-slate-500 text-sm">
                Live visa processing dashboard. Counselors update status instantly upon submission milestones.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Visa Lodgement Milestones</CardTitle>
                <CardDescription>Track the live status of your student visa application</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 pb-8">
                
                {/* Visual Timeline Steps */}
                <div className="relative pl-8 sm:pl-0 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-8 py-8">
                  
                  {/* Decorative connection bar on desktop */}
                  <div className="hidden sm:block absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 z-0" />
                  
                  {/* Decorative connection bar on mobile */}
                  <div className="sm:hidden absolute left-3.5 top-8 bottom-8 w-0.5 bg-slate-100 z-0" />

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
                    const currentVisaIndex = visaStatus ? visaSteps.indexOf(visaStatus.status) : 0;
                    
                    const isPassed = index < currentVisaIndex;
                    const isCurrent = index === currentVisaIndex;
                    
                    return (
                      <div key={step} className="relative z-10 flex sm:flex-col items-center sm:text-center gap-3 sm:w-1/6">
                        
                        {/* Dot indicator */}
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          isPassed 
                            ? "bg-emerald-500 border-emerald-500 text-white" 
                            : isCurrent
                            ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/25"
                            : "bg-white border-slate-200 text-slate-400"
                        }`}>
                          {isPassed ? (
                            <Check size={14} weight="bold" />
                          ) : (
                            <span className="text-xs font-bold">{index + 1}</span>
                          )}
                        </div>

                        {/* Title text */}
                        <div>
                          <p className={`text-xs font-bold sm:mt-1 ${
                            isCurrent ? "text-primary font-black scale-102" : "text-slate-500"
                          }`}>
                            {step}
                          </p>
                          {isCurrent && visaStatus?.details && (
                            <span className="text-[10px] text-slate-400 block max-w-[120px] mx-auto leading-tight mt-1">
                              {visaStatus.details}
                            </span>
                          )}
                        </div>

                      </div>
                    );
                  })}

                </div>

                <div className="mt-8 p-4.5 bg-subtle-gray/60 border border-hairline/80 rounded-2xl max-w-xl mx-auto text-center text-xs text-slate-500">
                  Visa updates are managed securely by our documentation office. Status last modified on {" "}
                  <span className="font-bold text-primary">
                    {visaStatus ? new Date(visaStatus.updated_at).toLocaleDateString() : "N/A"}
                  </span>.
                </div>

              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 5: COUNSELOR CHAT */}
        {activeTab === "chat" && (
          <div className="space-y-8">
            <div className="max-w-3xl">
              <h1 className="font-display font-bold text-2xl md:text-3xl text-primary tracking-tight mb-2">
                Counselor Messaging
              </h1>
              <p className="text-slate-500 text-sm">
                Chat securely with your counselor. Upload worksheets, ask query status, and skip email loops.
              </p>
            </div>

            <Card className="max-w-4xl h-[650px] flex flex-col justify-between p-0 overflow-hidden">
              
              {/* Header inside chat box */}
              <div className="p-4 border-b border-hairline bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {studentData?.counselors?.avatar_url ? (
                    <img 
                      src={studentData.counselors.avatar_url} 
                      alt={studentData.counselors.full_name} 
                      className="w-10 h-10 rounded-full object-cover border border-hairline/80 shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold shrink-0">
                      {studentData?.counselors?.full_name?.charAt(0) || "C"}
                    </div>
                  )}
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Your Counselor</span>
                    <h3 className="text-sm font-bold text-primary -mt-0.5">
                      {studentData?.counselors?.full_name || studentData?.counselor || "Annex Counselor"}
                    </h3>
                    {studentData?.counselors ? (
                      <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1.5 flex-wrap">
                        <span>{studentData.counselors.designation}</span>
                        <span className="text-slate-300">&bull;</span>
                        <a href={`mailto:${studentData.counselors.email}`} className="text-primary hover:underline">{studentData.counselors.email}</a>
                      </p>
                    ) : (
                      <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                        Counselor Assigned
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Chat messages viewport */}
              <div className="flex-grow p-6 overflow-y-auto bg-slate-50/50 space-y-4 flex flex-col">
                {hasMoreMessages && (
                  <button 
                    type="button" 
                    onClick={() => loadChatMessages(studentId!, messages.length)}
                    className="mx-auto block text-xs font-semibold text-primary/80 hover:text-primary bg-primary/5 hover:bg-primary/10 px-3.5 py-1.5 rounded-full transition-all border border-primary/10 cursor-pointer mb-2"
                  >
                    Load Older Messages
                  </button>
                )}

                {messages.length === 0 ? (
                  <div className="my-auto text-center text-slate-400 py-12">
                    <ChatCircleDots size={48} className="mx-auto text-slate-300 mb-3" />
                    <h3 className="font-bold text-base text-slate-500">Start the Conversation</h3>
                    <p className="text-xs mt-1 max-w-sm mx-auto">
                      Send a message to your assigned counselor. You can upload academic profiles, marksheets or questions.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isStudent = msg.sender_type === "student";
                    return (
                      <div 
                        key={msg.id || index}
                        className={`flex flex-col max-w-[75%] ${
                          isStudent ? "self-end items-end" : "self-start items-start"
                        }`}
                      >
                        <div className={`p-4 rounded-3xl text-sm leading-relaxed ${
                          isStudent 
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
                                    isStudent 
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
                          {isStudent && (
                            <span className="flex items-center">
                              {msg.status === "read" ? (
                                <Checks size={14} className="text-emerald-400" weight="bold" />
                              ) : msg.status === "sending" ? (
                                <SpinnerGap size={14} className="text-slate-400 animate-spin" />
                              ) : msg.status === "failed" ? (
                                <span title="Failed to send. Click to retry or check connection.">
                                  <WarningCircle size={14} className="text-red-500" />
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

              {/* Chat entry form */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-hairline bg-white flex items-end gap-3.5">
                
                {/* File Attachment input */}
                <div className="relative shrink-0">
                  <label className={`w-11 h-11 rounded-full border border-hairline flex items-center justify-center cursor-pointer transition-colors ${
                    chatFile ? "bg-primary/10 border-primary/20 text-primary" : "text-slate-400 hover:text-primary hover:bg-slate-50"
                  }`} title="Add Attachment">
                    <Paperclip size={18} />
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => e.target.files && setChatFile(e.target.files[0])}
                      disabled={isImpersonating || sendingMessage}
                    />
                  </label>
                  {chatFile && (
                    <button 
                      type="button" 
                      onClick={() => setChatFile(null)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                    >
                      <X size={10} weight="bold" />
                    </button>
                  )}
                </div>

                {/* Text entry field */}
                <div className="flex-grow">
                  {chatFile && (
                    <div className="text-[10px] bg-slate-50 border border-hairline px-3 py-1 rounded-t-xl text-slate-500 truncate max-w-md">
                      Attachment queue: <span className="font-semibold text-primary">{chatFile.name}</span>
                    </div>
                  )}
                  <textarea
                    rows={1}
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message to counselor..."
                    className={`w-full border border-hairline px-4.5 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm transition-all resize-none bg-white ${
                      chatFile ? "rounded-b-2xl border-t-0" : "rounded-2xl"
                    }`}
                    disabled={isImpersonating || sendingMessage}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={sendingMessage || isImpersonating} 
                  className="rounded-full w-11 h-11 p-0 flex items-center justify-center shrink-0"
                >
                  {sendingMessage ? (
                    <SpinnerGap size={18} className="animate-spin text-white" />
                  ) : (
                    <PaperPlaneRight size={18} weight="fill" />
                  )}
                </Button>

              </form>

            </Card>
          </div>
        )}

        {/* TAB 6: APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div className="space-y-8">
            <div className="max-w-3xl">
              <h1 className="font-display font-bold text-2xl md:text-3xl text-primary tracking-tight mb-2">
                Scheduled Meetings & Consultations
              </h1>
              <p className="text-slate-500 text-sm">
                View scheduled counseling sessions, click online meeting links, or request reschedule coordinates.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Meetings grid list */}
              <div className="lg:col-span-2 space-y-4">
                {meetings.length === 0 ? (
                  <Card className="py-12 text-center text-slate-400">
                    <CalendarCheck size={48} className="mx-auto text-slate-300 mb-3" />
                    <h3 className="font-bold text-base text-slate-500">No Meetings Slotted</h3>
                    <p className="text-sm mt-1">Wait for your counselor to schedule a meeting or check back later.</p>
                  </Card>
                ) : (
                  meetings.map(appt => {
                    const isUpcoming = appt.status === "Scheduled" || appt.status === "Rescheduled";
                    return (
                      <Card key={appt.id} className={appt.status === "Cancelled" ? "opacity-60" : ""}>
                        <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-primary/5 text-primary border border-primary/10 flex items-center justify-center shrink-0">
                              <Calendar size={22} weight="fill" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-sm font-bold text-primary">{appt.title}</h4>
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                  appt.status === "Completed" 
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                                    : appt.status === "Cancelled"
                                    ? "bg-red-50 text-red-600 border-red-200"
                                    : appt.status === "Rescheduled"
                                    ? "bg-amber-50 text-amber-600 border-amber-200"
                                    : "bg-blue-50 text-blue-600 border-blue-200"
                                }`}>
                                  {appt.status}
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-slate-600">
                                {new Date(appt.scheduled_at).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(appt.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({appt.duration_minutes} mins)
                              </p>
                              {appt.description && (
                                <p className="text-xs text-slate-500 whitespace-pre-wrap max-w-xl">{appt.description}</p>
                              )}
                              <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 pt-1">
                                <span>Type: <strong className="text-slate-600">{appt.meeting_type}</strong></span>
                                <span>•</span>
                                <span>Counselor: <strong className="text-slate-600">{appt.counselors?.full_name || "Annex Team"}</strong></span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 mt-3 sm:mt-0">
                            {isUpcoming && appt.meeting_link && (
                              <a 
                                href={appt.meeting_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex-grow sm:flex-grow-0 px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/10 animate-fade-in"
                              >
                                Join Meet
                                <ArrowSquareOut size={12} />
                              </a>
                            )}

                            {isUpcoming && (
                              <button
                                onClick={() => { 
                                  const d = new Date(appt.scheduled_at);
                                  setRescheduleBookingId(appt.id); 
                                  setNewDate(d.toLocaleDateString('en-CA')); 
                                  setNewTime(d.toTimeString().substring(0, 5));
                                }}
                                className="flex-grow sm:flex-grow-0 px-4 py-2 border border-hairline hover:bg-slate-50 text-slate-600 rounded-full text-xs font-bold transition-colors cursor-pointer"
                              >
                                Reschedule
                              </button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>

              {/* Rescheduling Input panel */}
              {rescheduleBookingId && (
                <Card className="h-fit border-primary/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Reschedule Meeting</CardTitle>
                      <button 
                        onClick={() => setRescheduleBookingId(null)}
                        className="p-1 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <CardDescription>Request a modified timing slot for this meeting</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleReschedule} className="space-y-4">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Preferred Date</label>
                        <input 
                          type="date"
                          required
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="w-full border border-hairline px-3.5 py-2 rounded-xl text-xs outline-none focus:border-primary"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Preferred Time</label>
                        <input 
                          type="time"
                          required
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                          className="w-full border border-hairline px-3.5 py-2 rounded-xl text-xs outline-none focus:border-primary"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reason / Notes</label>
                        <textarea 
                          rows={3}
                          value={rescheduleNotes}
                          onChange={(e) => setRescheduleNotes(e.target.value)}
                          placeholder="e.g. Exam dates changed"
                          className="w-full border border-hairline px-3.5 py-2 rounded-xl text-xs outline-none focus:border-primary resize-none"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={rescheduling || isImpersonating} 
                        className="w-full text-xs py-2.5 flex items-center justify-center gap-1.5"
                      >
                        {rescheduling ? (
                          <SpinnerGap size={14} className="animate-spin text-white" />
                        ) : (
                          <>
                            <CalendarCheck size={14} />
                            Request Reschedule
                          </>
                        )}
                      </Button>

                    </form>
                  </CardContent>
                </Card>
              )}

            </div>
          </div>
        )}

        {/* TAB 7: PROFILE */}
        {activeTab === "profile" && (
          <div className="space-y-8">
            <div className="max-w-3xl">
              <h1 className="font-display font-bold text-2xl md:text-3xl text-primary tracking-tight mb-2">
                My Student Profile
              </h1>
              <p className="text-slate-500 text-sm">
                Maintain and verify your academic particulars, preferred curriculum targets, and emergency contacts.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Main profile form card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>Keep this sheet complete for swift university applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    {profileMsg && (
                      <div className={`p-3 border rounded-2xl flex items-center gap-2 text-xs font-semibold ${
                        profileMsg.includes("success") 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                          : "bg-red-50 border-red-200 text-red-700"
                      }`}>
                        <CheckCircle size={16} />
                        <span>{profileMsg}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">FullName (Admin Locked)</label>
                        <input 
                          type="text" 
                          disabled 
                          value={studentData?.name || ""} 
                          className="w-full border border-hairline/60 px-4 py-2.5 rounded-full text-sm bg-slate-50 text-slate-400 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address (Admin Locked)</label>
                        <input 
                          type="text" 
                          disabled 
                          value={studentData?.email || ""} 
                          className="w-full border border-hairline/60 px-4 py-2.5 rounded-full text-sm bg-slate-50 text-slate-400 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Number</label>
                        <input 
                          type="text" 
                          placeholder="+977 980-000000"
                          value={profileForm.phone} 
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full border border-hairline px-4 py-2.5 rounded-full text-sm outline-none focus:border-primary"
                          disabled={isImpersonating}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Passport Number & Details</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Passport ID: 1234567, Exp: 2030-10-10"
                          value={profileForm.passport_details} 
                          onChange={(e) => setProfileForm({ ...profileForm, passport_details: e.target.value })}
                          className="w-full border border-hairline px-4 py-2.5 rounded-full text-sm outline-none focus:border-primary"
                          disabled={isImpersonating}
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Academic Background & Scores</label>
                        <textarea 
                          rows={3}
                          placeholder="e.g. +2 GPA: 3.65, IELTS Overall: 7.5 (L:8, R:7.5, W:7, S:7)"
                          value={profileForm.academic_details} 
                          onChange={(e) => setProfileForm({ ...profileForm, academic_details: e.target.value })}
                          className="w-full border border-hairline px-4.5 py-3 rounded-2xl text-sm outline-none focus:border-primary resize-none"
                          disabled={isImpersonating}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Preferred Courses & Majors</label>
                        <input 
                          type="text" 
                          placeholder="e.g. MSc Data Science, MBA Finance"
                          value={profileForm.preferred_course} 
                          onChange={(e) => setProfileForm({ ...profileForm, preferred_course: e.target.value })}
                          className="w-full border border-hairline px-4 py-2.5 rounded-full text-sm outline-none focus:border-primary"
                          disabled={isImpersonating}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Emergency Contact coordinates</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Ram Prasad (Father) - +977 9851000000"
                          value={profileForm.emergency_contact} 
                          onChange={(e) => setProfileForm({ ...profileForm, emergency_contact: e.target.value })}
                          className="w-full border border-hairline px-4 py-2.5 rounded-full text-sm outline-none focus:border-primary"
                          disabled={isImpersonating}
                        />
                      </div>

                    </div>

                    <Button 
                      type="submit" 
                      disabled={savingProfile || isImpersonating} 
                      className="flex items-center gap-2"
                    >
                      {savingProfile ? "Saving Details..." : "Save Profile"}
                      {savingProfile && <SpinnerGap size={16} className="animate-spin text-white" />}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Side profile meta info */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Destination Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-slate-50 border border-hairline rounded-2xl flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 rounded-full bg-primary/5 border border-primary/10 text-primary flex items-center justify-center mb-2.5">
                        <GraduationCap size={28} weight="fill" />
                      </div>
                      <h4 className="text-sm font-bold text-primary">{studentData?.destination || "Destination Country"}</h4>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Study Target Location</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold py-1 border-b border-hairline/60">
                        <span className="text-slate-400 uppercase tracking-wider text-[9px]">Admission Intake</span>
                        <span className="text-primary">{studentData?.intake || "N/A"}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold py-1 border-b border-hairline/60">
                        <span className="text-slate-400 uppercase tracking-wider text-[9px]">Status</span>
                        <span className="text-emerald-600">{studentData?.status}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold py-1">
                        <span className="text-slate-400 uppercase tracking-wider text-[9px]">Account Created</span>
                        <span className="text-primary">{studentData ? new Date(studentData.created_at).toLocaleDateString() : "N/A"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
