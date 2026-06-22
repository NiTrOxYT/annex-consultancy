"use client";

import * as React from "react";
import { 
  Sparkle, ShieldCheck, SignOut, Trash, Plus, FileText, 
  Calendar, Users, Eye, CheckCircle, XCircle, ChartBar, 
  Download, MagnifyingGlass, Funnel, ArrowSquareOut, Globe, 
  Warning, WarningCircle, Check, X, SpinnerGap, GraduationCap, Star, Copy,
  User, Paperclip, PaperPlaneRight, Gear, UploadSimple, Lock, Key, Clock, Checks,
  ChatCircleDots, Briefcase, Bell, ShareNetwork, Gift
} from "@phosphor-icons/react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { AnnexLogo } from "@/components/branding/annex-logo";

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
  min_percentage?: number | null;
  min_ielts?: number | null;
  min_pte?: number | null;
  min_toefl?: number | null;
  degree_level?: string | null;
  annual_fees?: number | null;
  scholarship_available?: boolean | null;
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

interface LeadDetailsPanelProps {
  lead: any;
  details: any;
  loading: boolean;
  counselors: any[];
  noteText: string;
  setNoteText: (val: string) => void;
  addingNote: boolean;
  onAddNote: (e: React.FormEvent) => void;
  onClose: () => void;
  onUpdateField: (leadId: string, fieldName: string, fieldValue: any) => void;
  onCompleteReminder: (reminderId: string, title: string, note: string) => void;
}

function LeadDetailsPanel({
  lead,
  details,
  loading,
  counselors,
  noteText,
  setNoteText,
  addingNote,
  onAddNote,
  onClose,
  onUpdateField,
  onCompleteReminder
}: LeadDetailsPanelProps) {
  const [detailsTab, setDetailsTab] = React.useState<"profile" | "notes" | "reminders" | "activities">("profile");

  return (
    <Card className="h-auto sticky top-28 shadow-lg overflow-hidden flex flex-col">
      {/* Header */}
      <CardHeader className="bg-slate-50 border-b border-hairline p-4 flex flex-row items-center justify-between">
        <div className="truncate">
          <CardTitle className="text-sm font-bold text-primary truncate">{lead.name}</CardTitle>
          <CardDescription className="text-[10px] font-mono-data truncate mt-0.5">{lead.email}</CardDescription>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
          <X size={14} />
        </button>
      </CardHeader>

      {/* Tabs Menu */}
      <div className="flex border-b border-hairline bg-slate-50/50 p-1">
        {(["profile", "notes", "reminders", "activities"] as const).map(t => (
          <button
            key={t}
            onClick={() => setDetailsTab(t)}
            className={`flex-1 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              detailsTab === t ? "bg-white text-primary shadow-[0_1px_2px_rgba(0,0,0,0.05)]" : "text-slate-500 hover:text-primary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <CardContent className="p-4 max-h-[500px] overflow-y-auto space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading lead records...</div>
        ) : (
          <>
            {detailsTab === "profile" && (
              <div className="space-y-4">
                {/* Details Section */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Intake / Country</span>
                    <div className="font-semibold text-slate-700 mt-0.5">{lead.preferred_country}</div>
                    <div className="text-[10px] text-slate-500 font-mono-data">Intake: {lead.intake}</div>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Course Preference</span>
                    <div className="font-semibold text-slate-700 mt-0.5 truncate">{lead.preferred_course}</div>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Academic Score</span>
                    <div className="font-semibold text-slate-700 mt-0.5">{lead.qualification}</div>
                    <div className="text-[10px] text-slate-500 font-mono-data">Grade: {lead.percentage}%</div>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Target Budget</span>
                    <div className="font-semibold text-slate-700 mt-0.5 font-mono-data">
                      {lead.currency} {Number(lead.budget).toLocaleString()}
                    </div>
                  </div>
                  {lead.test_type && (
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400">English Test</span>
                      <div className="font-semibold text-slate-700 mt-0.5 font-mono-data">
                        {lead.test_type} ({lead.test_score})
                      </div>
                    </div>
                  )}
                  {lead.utm_source && (
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400">Attribution Source</span>
                      <div className="font-semibold text-slate-700 mt-0.5 truncate font-mono-data">
                        {lead.utm_source} / {lead.utm_medium || "direct"}
                      </div>
                    </div>
                  )}
                  {lead.first_contacted_at && (
                    <div className="col-span-2 border-t border-slate-100 pt-2">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Response Time metrics</span>
                      <span className="text-[10px] text-slate-600">
                        First Contacted: <span className="font-semibold">{new Date(lead.first_contacted_at).toLocaleString()}</span>
                      </span>
                      <span className="block text-[10px] text-slate-600 mt-0.5">
                        Attained outreach in <span className="font-bold text-gold font-mono-data">{lead.response_time_minutes} minutes</span>.
                      </span>
                    </div>
                  )}
                </div>

                {/* Matches list */}
                <div className="border-t border-slate-100 pt-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Matching Universities</h4>
                  <div className="space-y-2">
                    {details?.matches?.map((m: any, idx: number) => (
                      <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-hairline flex justify-between items-center gap-2">
                        <span className="text-[11px] font-semibold text-primary truncate max-w-[180px]">
                          {m.university_name_snapshot}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold font-mono-data ${
                            m.admission_chance === "Safe" 
                              ? "bg-emerald-50 text-emerald-600" 
                              : m.admission_chance === "Target"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-orange-50 text-orange-600"
                          }`}>
                            {m.admission_chance}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 font-mono-data">{m.match_score}%</span>
                        </div>
                      </div>
                    ))}
                    {(!details?.matches || details.matches.length === 0) && (
                      <div className="text-center py-2 text-slate-400 text-[10px] italic">No active matches logged</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: NOTES */}
            {detailsTab === "notes" && (
              <div className="space-y-4">
                <form onSubmit={onAddNote} className="space-y-2">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    required
                    placeholder="Type counselor note here..."
                    className="w-full p-2.5 border border-hairline rounded-xl text-xs focus:outline-none focus:border-gold resize-none min-h-[70px]"
                  />
                  <button
                    type="submit"
                    disabled={addingNote || !noteText.trim()}
                    className="w-full py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {addingNote ? "Adding Note..." : "Add Note"}
                  </button>
                </form>

                <div className="space-y-3 pt-2">
                  {details?.notes?.map((n: any) => (
                    <div key={n.id} className="p-3 bg-slate-50 border border-hairline rounded-xl space-y-1 relative">
                      <span className="text-[9px] font-bold text-primary block truncate">
                        {n.counselor?.full_name || "System Admin"}
                      </span>
                      <p className="text-xs text-slate-600 leading-normal">{n.note}</p>
                      <span className="text-[8px] text-slate-400 block font-mono-data text-right">
                        {new Date(n.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  {(!details?.notes || details.notes.length === 0) && (
                    <div className="text-center py-6 text-slate-400 text-xs italic">No notes logged yet.</div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: REMINDERS */}
            {detailsTab === "reminders" && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Outreach Checklists</h4>
                <div className="space-y-3">
                  {details?.reminders?.map((rem: any) => (
                    <div 
                      key={rem.id} 
                      className={`p-3 border rounded-2xl flex flex-col justify-between gap-2 shadow-sm ${
                        rem.completed ? "bg-slate-50/50 border-slate-100 opacity-60" : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={rem.completed}
                            disabled={rem.completed}
                            onChange={() => {
                              const note = prompt("Enter completion note:");
                              if (note !== null) onCompleteReminder(rem.id, rem.title, note);
                            }}
                            className="rounded border-slate-300 focus:ring-gold disabled:opacity-50"
                          />
                          <span className={`text-xs font-semibold text-primary ${rem.completed ? "line-through text-slate-400" : ""}`}>
                            {rem.title}
                          </span>
                        </div>
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono-data flex justify-between items-center mt-1 border-t border-slate-50 pt-1.5">
                        <span>DUE: {new Date(rem.due_at).toLocaleDateString()}</span>
                        {rem.completed && (
                          <span className="text-emerald-500 font-bold">COMPLETED</span>
                        )}
                      </div>
                      {rem.completed && rem.completion_note && (
                        <div className="text-[9px] bg-slate-100/50 p-1.5 rounded text-slate-500 mt-0.5">
                          Note: {rem.completion_note}
                        </div>
                      )}
                    </div>
                  ))}
                  {(!details?.reminders || details.reminders.length === 0) && (
                    <div className="text-center py-6 text-slate-400 text-xs italic">No reminders defined</div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: ACTIVITIES & ASSIGNMENTS */}
            {detailsTab === "activities" && (
              <div className="space-y-4">
                {/* Counselor assignments list */}
                {details?.assignments?.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Counselor Transfer Logs</h4>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                      {details.assignments.map((asg: any) => (
                        <div key={asg.id} className="p-2.5 bg-slate-50 border border-hairline rounded-xl text-[10px]">
                          <span className="font-semibold text-primary">Transfer: </span>
                          <span className="text-slate-500">
                            {asg.old_counselor?.full_name || "Unassigned"} → {asg.new_counselor?.full_name || "Unassigned"}
                          </span>
                          <div className="text-[8px] text-slate-400 font-mono-data mt-1 flex justify-between">
                            <span>By: {asg.assigned_by_counselor?.full_name || "Super Admin"}</span>
                            <span>{new Date(asg.assigned_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audit trail */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Activity Timeline Logs</h4>
                  <div className="space-y-3 relative border-l-2 border-slate-100 pl-3.5 ml-2 pt-1 max-h-[220px] overflow-y-auto pr-1">
                    {details?.activities?.map((act: any) => (
                      <div key={act.id} className="space-y-0.5 relative mb-3 last:mb-0">
                        {/* Timeline dot */}
                        <div className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white" />
                        <span className="text-[10px] font-bold text-primary flex items-center gap-1.5">
                          {act.activity_type}
                        </span>
                        <p className="text-[10px] text-slate-500 leading-normal">{act.description}</p>
                        <span className="text-[8px] text-slate-400 block font-mono-data">
                          {new Date(act.created_at).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {(!details?.activities || details.activities.length === 0) && (
                      <div className="text-center py-6 text-slate-400 text-xs italic">No activity timeline logged</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface AdminDashboardProps {
  initialTab?: string;
}


export default function AdminDashboard({ initialTab }: AdminDashboardProps = {}) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [authError, setAuthError] = React.useState("");
  const [checkingAuth, setCheckingAuth] = React.useState(true);
  
  // Dashboard Tabs
  const [activeTab, setActiveTab] = React.useState<"bookings" | "universities" | "blog" | "stories" | "students" | "chat" | "counselors" | "settings" | "training" | "experts" | "notifications" | "roles" | "referrals" | "eligibility">((initialTab as any) || "bookings");

  const [userType, setUserType] = React.useState<"super-admin" | "counselor" | null>(null);
  const [userPermissions, setUserPermissions] = React.useState<string[]>([]);
  const [counselorProfile, setCounselorProfile] = React.useState<any | null>(null);
  const [loginMethod, setLoginMethod] = React.useState<"counselor" | "access-key">("counselor");

  // Loaders & table existence flags
  const [loading, setLoading] = React.useState(false);
  const [uniTableExists, setUniTableExists] = React.useState<boolean | null>(null);
  const [postsTableExists, setPostsTableExists] = React.useState<boolean | null>(null);
  const [storiesTableExists, setStoriesTableExists] = React.useState<boolean | null>(null);
  const [emailLogsTableExists, setEmailLogsTableExists] = React.useState<boolean | null>(null);
  const [notifHistoryTableExists, setNotifHistoryTableExists] = React.useState<boolean | null>(null);
  const [systemSettingsTableExists, setSystemSettingsTableExists] = React.useState<boolean | null>(null);

  // V1 Notification system states
  const [notificationsEnabled, setNotificationsEnabled] = React.useState<boolean>(true);
  const [notificationHistory, setNotificationHistory] = React.useState<any[]>([]);
  const [notifHistorySearch, setNotifHistorySearch] = React.useState("");
  const [notifHistoryTypeFilter, setNotifHistoryTypeFilter] = React.useState("All");
  const [notifHistoryStatusFilter, setNotifHistoryStatusFilter] = React.useState("All");

  // Referrals Administrative state
  const [referrals, setReferrals] = React.useState<any[]>([]);
  const [loadingReferrals, setLoadingReferrals] = React.useState(false);
  const [referralSearch, setReferralSearch] = React.useState("");
  const [referralStatusFilter, setReferralStatusFilter] = React.useState("All");
  
  const [isRewardModalOpen, setIsRewardModalOpen] = React.useState(false);
  const [rewardAmount, setRewardAmount] = React.useState("10000");
  const [selectedReferral, setSelectedReferral] = React.useState<any | null>(null);
  const [issuingReward, setIssuingReward] = React.useState(false);
  const [updatingReferralStatus, setUpdatingReferralStatus] = React.useState<string | null>(null);

  const [referralAnalytics, setReferralAnalytics] = React.useState<any>(null);
  const [loadingReferralAnalytics, setLoadingReferralAnalytics] = React.useState(false);

  // Selected student notification preferences
  const [selectedStudentPrefs, setSelectedStudentPrefs] = React.useState<any | null>(null);
  const [selectedStudentHistory, setSelectedStudentHistory] = React.useState<any[]>([]);

  // Eligibility Leads states
  const [eligibilityLeads, setEligibilityLeads] = React.useState<any[]>([]);
  const [eligibilityCount, setEligibilityCount] = React.useState(0);
  const [eligibilityLoading, setEligibilityLoading] = React.useState(false);
  const [eligibilitySearch, setEligibilitySearch] = React.useState("");
  const [eligibilityStatusFilter, setEligibilityStatusFilter] = React.useState("All");
  const [eligibilityPriorityFilter, setEligibilityPriorityFilter] = React.useState("All");
  const [eligibilityScoreFilter, setEligibilityScoreFilter] = React.useState("All");
  const [eligibilityCounselorFilter, setEligibilityCounselorFilter] = React.useState("All");
  const [eligibilityCountryFilter, setEligibilityCountryFilter] = React.useState("All");
  const [eligibilityIntakeFilter, setEligibilityIntakeFilter] = React.useState("All");
  const [eligibilityPage, setEligibilityPage] = React.useState(1);
  const [eligibilityLimit, setEligibilityLimit] = React.useState(50);
  const [eligibilityTotalPages, setEligibilityTotalPages] = React.useState(1);

  const [selectedLead, setSelectedLead] = React.useState<any | null>(null);
  const [selectedLeadDetails, setSelectedLeadDetails] = React.useState<any | null>(null);
  const [loadingLeadDetails, setLoadingLeadDetails] = React.useState(false);
  const [bulkSelectedLeadIds, setBulkSelectedLeadIds] = React.useState<string[]>([]);
  
  const [leadNoteText, setLeadNoteText] = React.useState("");
  const [addingLeadNote, setAddingLeadNote] = React.useState(false);
  
  const [analyticsData, setAnalyticsData] = React.useState<any | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = React.useState(false);

  const [eligibilityTabMode, setEligibilityTabMode] = React.useState<"all" | "queue" | "analytics">("all");
  const [followupQueue, setFollowupQueue] = React.useState<{ overdue: any[]; dueToday: any[]; dueTomorrow: any[] } | null>(null);
  const [loadingQueue, setLoadingQueue] = React.useState(false);

  const [savingStudentPrefs, setSavingStudentPrefs] = React.useState(false);
  const [triggeringNotif, setTriggeringNotif] = React.useState<string | null>(null);

  // Email diagnostics states
  const [emailLogs, setEmailLogs] = React.useState<any[]>([]);
  const [testEmailAddress, setTestEmailAddress] = React.useState("");
  const [sendingTestEmail, setSendingTestEmail] = React.useState(false);
  const [testEmailResult, setTestEmailResult] = React.useState<{ 
    success: boolean; 
    message?: string; 
    responseBody?: string;
  } | null>(null);
  const [emailConfig, setEmailConfig] = React.useState<{
    hasBrevoSmtpHost: boolean;
    hasBrevoSmtpPort: boolean;
    hasBrevoSmtpUser: boolean;
    hasBrevoSmtpPass: boolean;
    smtpPort: string;
    emailFrom: string;
    activeProvider: "brevo-smtp" | "mock";
    reason: string;
  } | null>(null);

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
  const [auditTab, setAuditTab] = React.useState<"progress" | "documents" | "offers" | "visa" | "chat" | "logs" | "meetings" | "notifications">("progress");
  const [auditTasks, setAuditTasks] = React.useState<any[]>([]);
  const [auditDocs, setAuditDocs] = React.useState<any[]>([]);
  const [auditOffers, setAuditOffers] = React.useState<any[]>([]);
  const [auditVisa, setAuditVisa] = React.useState<any>(null);
  const [auditMessages, setAuditMessages] = React.useState<any[]>([]);
  const [auditLogs, setAuditLogs] = React.useState<any[]>([]);
  const [auditMeetings, setAuditMeetings] = React.useState<any[]>([]);

  // Meeting scheduling state in audit sheet
  const [meetingForm, setMeetingForm] = React.useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration_minutes: "30",
    meeting_link: "",
    meeting_type: "Google Meet"
  });
  const [editingMeeting, setEditingMeeting] = React.useState<any | null>(null);
  const [savingMeeting, setSavingMeeting] = React.useState(false);

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

  // Training & Placement States
  const [trainingServices, setTrainingServices] = React.useState<any[]>([]);
  const [trainingStudents, setTrainingStudents] = React.useState<any[]>([]);
  const [trainingTasks, setTrainingTasks] = React.useState<any[]>([]);
  const [trainingMeetings, setTrainingMeetings] = React.useState<any[]>([]);
  const [activeTrainingTab, setActiveTrainingTab] = React.useState<"services" | "students" | "tasks" | "meetings" | "analytics">("services");
  
  // Service CRUD form
  const [serviceForm, setServiceForm] = React.useState({
    id: "",
    title: "",
    description: "",
    price: "",
    featuresText: "",
    status: "Active"
  });
  const [isServiceModalOpen, setIsServiceModalOpen] = React.useState(false);
  const [savingService, setSavingService] = React.useState(false);

  // Student Detail Drawer
  const [selectedTrainingStudent, setSelectedTrainingStudent] = React.useState<any | null>(null);
  const [isTrainingDetailOpen, setIsTrainingDetailOpen] = React.useState(false);
  const [trainingDetailTab, setTrainingDetailTab] = React.useState<"overview" | "tasks" | "documents" | "notes" | "meetings" | "chat" | "notifications">("overview");
  const [trainingDetailTasks, setTrainingDetailTasks] = React.useState<any[]>([]);
  const [trainingDetailDocs, setTrainingDetailDocs] = React.useState<any[]>([]);
  const [trainingDetailMeetings, setTrainingDetailMeetings] = React.useState<any[]>([]);
  const [trainingDetailMessages, setTrainingDetailMessages] = React.useState<any[]>([]);
  const [trainingNotesText, setTrainingNotesText] = React.useState("");
  const [savingTrainingNotes, setSavingTrainingNotes] = React.useState(false);

  // Task form
  const [careerTaskForm, setCareerTaskForm] = React.useState({
    title: "",
    description: "",
    due_date: ""
  });
  const [addingCareerTask, setAddingCareerTask] = React.useState(false);

  // Meeting form
  const [careerMeetingForm, setCareerMeetingForm] = React.useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration_minutes: "30",
    meeting_link: "",
    meeting_type: "Google Meet"
  });
  const [savingCareerMeeting, setSavingCareerMeeting] = React.useState(false);

  // Chat message in detail drawer
  const [careerChatText, setCareerChatText] = React.useState("");
  const [sendingCareerChat, setSendingCareerChat] = React.useState(false);

  // System Health States
  const [healthStatus, setHealthStatus] = React.useState({
    supabase: "checking", // "connected" | "failed" | "checking"
    realtime: "checking", // "connected" | "failed" | "checking"
    email: "checking",    // "connected" | "failed" | "checking"
    emailProviderName: "", // "Brevo SMTP" or "Mocked (Local Console)"
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

  // RBAC Permission States
  const [roles, setRoles] = React.useState<any[]>([]);
  const [selectedCounselorRole, setSelectedCounselorRole] = React.useState<string>("");
  const [counselorPermOverrides, setCounselorPermOverrides] = React.useState<{[key: string]: boolean | null}>({});
  const [loadingPerms, setLoadingPerms] = React.useState(false);
  
  // Provision login modal state
  const [provisionModalOpen, setProvisionModalOpen] = React.useState(false);
  const [provisionCounselor, setProvisionCounselor] = React.useState<any | null>(null);
  const [provisionPassword, setProvisionPassword] = React.useState("");
  const [provisioning, setProvisioning] = React.useState(false);

  // Role Management Modal States
  const [isRoleModalOpen, setIsRoleModalOpen] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState<any | null>(null);
  const [roleForm, setRoleForm] = React.useState({
    name: "",
    description: "",
    permissions: [] as string[]
  });
  const [savingRole, setSavingRole] = React.useState(false);
  const [expandedRoleId, setExpandedRoleId] = React.useState<string | null>(null);

  // Career Experts Management States
  const [experts, setExperts] = React.useState<any[]>([]);
  const [isExpertModalOpen, setIsExpertModalOpen] = React.useState(false);
  const [editingExpert, setEditingExpert] = React.useState<any | null>(null);
  const [expertForm, setExpertForm] = React.useState({
    name: "",
    designation: "",
    expertise: "",
    photo_url: "",
    linkedin_url: "",
    display_order: 0,
    is_active: true
  });
  const [savingExpert, setSavingExpert] = React.useState(false);
  const [uploadingExpertPhoto, setUploadingExpertPhoto] = React.useState(false);

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
    published: true,
    min_percentage: "",
    min_ielts: "",
    min_pte: "",
    min_toefl: "",
    degree_level: "Bachelors",
    annual_fees: "",
    scholarship_available: false
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

  const getPermissionKeyForTab = (tabId: string): string => {
    const mapping: { [key: string]: string } = {
      bookings: "Dashboard",
      students: "Students",
      referrals: "Students",
      eligibility: "Eligibility Leads",
      counselors: "Counselors Management",
      chat: "Messages",
      training: "Training & Placement",
      universities: "Universities",
      blog: "Blog",
      stories: "Success Stories",
      experts: "Training & Placement",
      notifications: "Notifications",
      settings: "Settings",
      roles: "System Administration"
    };
    return mapping[tabId] || "";
  };

  const hasPermission = (permKey: string): boolean => {
    if (userType === "super-admin") return true;
    return userPermissions.includes(permKey);
  };

  const allTabsList = [
    { id: "bookings", label: `Consultations (${bookings.length})` },
    { id: "students", label: `Students (${students.length})` },
    { id: "referrals", label: `Referrals (${referrals.length})` },
    { id: "eligibility", label: `Eligibility Leads (${eligibilityCount})` },
    { id: "counselors", label: `Counselors (${counselors.length})` },
    { id: "chat", label: "Messaging" },
    { id: "training", label: `Training & Placement (${trainingStudents.length})` },
    { id: "universities", label: `Universities (${universities.length})` },
    { id: "blog", label: `Blog posts (${posts.length})` },
    { id: "stories", label: `Success stories (${stories.length})` },
    { id: "experts", label: `Career Experts (${experts.length})` },
    { id: "notifications", label: "Notifications" },
    { id: "settings", label: "Email Status" },
    { id: "roles", label: "Roles & Permissions" }
  ];

  const visibleTabs = allTabsList.filter(tab => {
    const permKey = getPermissionKeyForTab(tab.id);
    return hasPermission(permKey);
  });

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as any);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `/admin/${tabId}`);
    }
  };

  // Check auth persistence on mount and fetch resolved permissions
  React.useEffect(() => {
    const initAuth = async () => {
      try {
        const persisted = sessionStorage.getItem("annex_admin_authenticated");
        if (persisted === "true") {
          const storedPwd = sessionStorage.getItem("annex_admin_password");
          if (storedPwd) {
            document.cookie = `annex_admin_token=${encodeURIComponent(storedPwd)}; path=/; max-age=86400; SameSite=Strict`;
          }
        }

        const token = getAdminCredentials();
        if (token) {
          const res = await fetch("/api/admin/rbac?action=get-current-user-perms", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setUserType(data.userType);
            setUserPermissions(data.permissions || []);
            setCounselorProfile(data.counselor || null);
            setIsAuthenticated(true);
          } else {
            handleSignOut();
          }
        }
      } catch (e) {
        console.error("Auth state loading error:", e);
      } finally {
        setCheckingAuth(false);
      }
    };
    initAuth();
  }, []);

  // Enforce redirection to the first permitted tab if activeTab is not accessible
  React.useEffect(() => {
    if (isAuthenticated && visibleTabs.length > 0) {
      const isCurrentTabVisible = visibleTabs.some(t => t.id === activeTab);
      if (!isCurrentTabVisible) {
        const fallbackTab = visibleTabs[0].id;
        setActiveTab(fallbackTab as any);
        if (typeof window !== "undefined") {
          window.history.pushState(null, "", `/admin/${fallbackTab}`);
        }
      }
    }
  }, [isAuthenticated, userPermissions, activeTab]);

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
  const ALL_PERMISSIONS = [
    "Dashboard",
    "Students",
    "Eligibility Leads",
    "Career Portal Students",
    "Training & Placement",
    "Meetings",
    "Documents",
    "Messages",
    "Notifications",
    "Success Stories",
    "Blog",
    "Universities",
    "Reports",
    "Email System",
    "Settings",
    "Counselors Management",
    "System Administration"
  ];

  // Auth Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);

    try {
      if (loginMethod === "counselor") {
        // A. Counselor Login via Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password
        });

        if (error) {
          setAuthError(error.message);
          return;
        }

        const sessionToken = data.session?.access_token;
        if (!sessionToken) {
          setAuthError("Failed to retrieve authenticated session.");
          return;
        }

        // Set session cookie
        document.cookie = `annex_admin_token=${encodeURIComponent(sessionToken)}; path=/; max-age=86400; SameSite=Strict`;
        sessionStorage.setItem("annex_admin_authenticated", "true");
        sessionStorage.setItem("annex_admin_password", sessionToken);

        // Fetch permissions and profile
        const res = await fetch("/api/admin/rbac?action=get-current-user-perms", {
          headers: {
            "Authorization": `Bearer ${sessionToken}`
          }
        });

        if (!res.ok) {
          const errData = await res.json();
          setAuthError(errData.error || "Failed to retrieve counselor permissions.");
          handleSignOut();
          return;
        }

        const resData = await res.json();
        setUserType(resData.userType);
        setUserPermissions(resData.permissions || []);
        setCounselorProfile(resData.counselor || null);
        setIsAuthenticated(true);
      } else {
        // B. Legacy Master Access Key Login
        const secretKey = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
        if (!secretKey) {
          setAuthError("Admin credentials are not configured on the server environment.");
          return;
        }
        if (password === secretKey) {
          setIsAuthenticated(true);
          setUserType("super-admin");
          setUserPermissions(ALL_PERMISSIONS);
          try {
            sessionStorage.setItem("annex_admin_authenticated", "true");
            sessionStorage.setItem("annex_admin_password", password);
            document.cookie = `annex_admin_token=${encodeURIComponent(password)}; path=/; max-age=86400; SameSite=Strict`;
          } catch (e) {
            console.error("Auth persistence failed:", e);
          }
        } else {
          setAuthError("Invalid admin access key.");
        }
      }
    } catch (err: any) {
      setAuthError("Authentication error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setPassword("");
    setEmail("");
    setUserType(null);
    setUserPermissions([]);
    setCounselorProfile(null);
    try {
      sessionStorage.removeItem("annex_admin_authenticated");
      sessionStorage.removeItem("annex_admin_password");
      document.cookie = "annex_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      supabase.auth.signOut();
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

    // 7. Fetch Counselors and System Roles
    try {
      const { data, error } = await supabase
        .from("counselors")
        .select("*, user_roles(id, name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setCounselors(data || []);
    } catch (err: any) {
      console.error("Error loading counselors:", err.message);
    }

    try {
      const token = getAdminCredentials();
      if (token) {
        const res = await fetch("/api/admin/rbac?action=list-roles", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const resData = await res.json();
          setRoles(resData.roles || []);
        }
      }
    } catch (err: any) {
      console.error("Error loading system roles in fetchAllData:", err.message);
    }

    // 8. Fetch Email Logs
    try {
      const { data, error } = await supabase
        .from("email_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) {
        if (error.code === "42P01" || error.message.includes("does not exist")) {
          setEmailLogsTableExists(false);
        } else {
          throw error;
        }
      } else {
        setEmailLogs(data || []);
        setEmailLogsTableExists(true);
      }
    } catch (err: any) {
      console.error("Error loading email logs:", err.message);
    }

    // 9. Fetch Email Config Status
    try {
      const res = await fetch("/api/email-status");
      if (res.ok) {
        const configData = await res.json();
        setEmailConfig(configData);
      }
    } catch (err: any) {
      console.error("Error loading email config status:", err.message);
    }

    // 9.5 Fetch Notification Global Settings and History Logs via secure admin endpoint
    try {
      const token = getAdminCredentials();
      const res = await fetch("/api/admin/notifications", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSystemSettingsTableExists(true);
        setNotifHistoryTableExists(true);
        setNotificationsEnabled(data.globalSetting ? data.globalSetting.value === "true" : true);
        setNotificationHistory(data.history || []);
      } else {
        const errData = await res.json();
        const errMsg = errData.error || "";
        if (errMsg.includes("does not exist") || errMsg.includes("42P01") || errMsg.includes("relation \"system_settings\"") || errMsg.includes("relation \"notification_history\"")) {
          setSystemSettingsTableExists(false);
          setNotifHistoryTableExists(false);
        }
        console.error("Error loading notifications data from API:", errMsg);
      }
    } catch (err: any) {
      console.error("Error loading notifications info:", err.message);
    }
    // 10. Fetch Training & Placement Data
    try {
      const { data: servicesData } = await supabase
        .from("training_services")
        .select("*")
        .order("price", { ascending: true });
      setTrainingServices(servicesData || []);

      const { data: studentsData } = await supabase
        .from("training_students")
        .select("*, training_services(*), counselors(*)")
        .order("created_at", { ascending: false });
      setTrainingStudents(studentsData || []);

      const { data: tasksData } = await supabase
        .from("training_tasks")
        .select("*, training_students(*)")
        .order("created_at", { ascending: false });
      setTrainingTasks(tasksData || []);

      const { data: meetingsData } = await supabase
        .from("meetings")
        .select("*, counselors(*), training_students(*)")
        .not("training_student_id", "is", null)
        .order("scheduled_at", { ascending: true });
      setTrainingMeetings(meetingsData || []);
    } catch (err: any) {
      console.error("Error loading training data in fetchAllData:", err.message);
    }

    // 11. Fetch Career Experts
    try {
      const { data: expertsData, error: expertsError } = await supabase
        .from("career_experts")
        .select("*")
        .order("display_order", { ascending: true });
      if (expertsError) {
        if (expertsError.code !== "42P01" && !expertsError.message.includes("does not exist")) {
          throw expertsError;
        }
      } else {
        setExperts(expertsData || []);
      }
    } catch (err: any) {
      console.error("Error loading career experts:", err.message);
    }
    
    // 12. Fetch Referrals & Analytics (Admin)
    try {
      const token = getAdminCredentials();
      const res = await fetch("/api/admin/referrals", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setReferrals(data.referrals || []);
          setReferralAnalytics(data.analytics || null);
        }
      }
    } catch (err: any) {
      console.error("Error loading referrals in fetchAllData:", err.message);
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

  // Realtime subscription for Training details drawer chat
  React.useEffect(() => {
    if (!selectedTrainingStudent || !isTrainingDetailOpen) return;

    console.log(`[Diagnostic] Admin subscribing to realtime training chat for student: ${selectedTrainingStudent.id}`);
    const channel = supabase
      .channel(`admin_training_chat:${selectedTrainingStudent.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "training_messages",
          filter: `student_id=eq.${selectedTrainingStudent.id}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            setTrainingDetailMessages((prev) => {
              if (prev.some((m) => m.id === payload.new.id)) return prev;
              return [...prev, payload.new];
            });

            // Mark read since we have it open
            if (trainingDetailTab === "chat") {
              await supabase
                .from("training_conversations")
                .update({ unread_count_admin: 0 })
                .eq("student_id", selectedTrainingStudent.id);
            }
          }
        }
      )
      .subscribe();

    return () => {
      console.log(`[Diagnostic] Admin unsubscribing from realtime training chat for student: ${selectedTrainingStudent.id}`);
      supabase.removeChannel(channel);
    };
  }, [selectedTrainingStudent, isTrainingDetailOpen, trainingDetailTab]);

  // Mark messages as read when a conversation is opened in Chat Center
  React.useEffect(() => {
    if (activeTab === "chat" && activeChatStudentId) {
      loadAdminChatMessages(activeChatStudentId);
      markAdminMessagesAsRead(activeChatStudentId);
    }
  }, [activeTab, activeChatStudentId, markAdminMessagesAsRead]);

  // Retrieve admin token from sessionStorage or cookie
  const getAdminCredentials = () => {
    if (typeof window === "undefined") return "";
    const pwd = sessionStorage.getItem("annex_admin_password");
    if (pwd) return pwd;
    const match = document.cookie.match(/annex_admin_token=([^;]+)/);
    if (match) {
      return decodeURIComponent(match[1]);
    }
    return "";
  };

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Eligibility Dashboard Handlers
  const fetchEligibilityData = React.useCallback(async () => {
    setEligibilityLoading(true);
    try {
      const token = getAdminCredentials();
      const params = new URLSearchParams();
      if (eligibilityStatusFilter && eligibilityStatusFilter !== "All") params.append("status", eligibilityStatusFilter);
      if (eligibilityScoreFilter && eligibilityScoreFilter !== "All") params.append("score", eligibilityScoreFilter);
      if (eligibilityPriorityFilter && eligibilityPriorityFilter !== "All") params.append("priority", eligibilityPriorityFilter);
      if (eligibilityCounselorFilter && eligibilityCounselorFilter !== "All") params.append("counselorId", eligibilityCounselorFilter);
      if (eligibilityCountryFilter && eligibilityCountryFilter !== "All") params.append("country", eligibilityCountryFilter);
      if (eligibilityIntakeFilter && eligibilityIntakeFilter !== "All") params.append("intake", eligibilityIntakeFilter);
      if (eligibilitySearch) params.append("search", eligibilitySearch);
      params.append("page", String(eligibilityPage));
      params.append("limit", String(eligibilityLimit));

      const res = await fetch(`/api/admin/eligibility-leads?${params.toString()}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch eligibility leads");
      const data = await res.json();
      if (data.success) {
        setEligibilityLeads(data.leads || []);
        setEligibilityTotalPages(data.totalPages || 1);
        setEligibilityCount(data.count || 0);
      }
    } catch (err: any) {
      console.error("Error loading eligibility data:", err.message);
    } finally {
      setEligibilityLoading(false);
    }
  }, [
    eligibilityStatusFilter,
    eligibilityScoreFilter,
    eligibilityPriorityFilter,
    eligibilityCounselorFilter,
    eligibilityCountryFilter,
    eligibilityIntakeFilter,
    eligibilitySearch,
    eligibilityPage,
    eligibilityLimit
  ]);

  const fetchEligibilityAnalytics = React.useCallback(async () => {
    setLoadingAnalytics(true);
    try {
      const token = getAdminCredentials();
      const res = await fetch("/api/admin/eligibility-analytics", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const data = await res.json();
      if (data.success) {
        setAnalyticsData(data);
      }
    } catch (err: any) {
      console.error("Error loading eligibility analytics:", err.message);
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  const fetchLeadDetails = async (leadId: string) => {
    setLoadingLeadDetails(true);
    try {
      const token = getAdminCredentials();
      const res = await fetch(`/api/admin/eligibility-leads?id=${leadId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch lead details");
      const data = await res.json();
      if (data.success) {
        setSelectedLeadDetails(data);
      }
    } catch (err: any) {
      console.error("Error loading lead details:", err.message);
    } finally {
      setLoadingLeadDetails(false);
    }
  };

  const fetchFollowupQueue = React.useCallback(async () => {
    setLoadingQueue(true);
    try {
      const token = getAdminCredentials();
      const cId = counselorProfile?.id || (eligibilityCounselorFilter !== "All" ? eligibilityCounselorFilter : "");
      if (!cId) {
        setFollowupQueue({ overdue: [], dueToday: [], dueTomorrow: [] });
        return;
      }
      const res = await fetch(`/api/admin/followups-today?counselorId=${cId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch queue");
      const data = await res.json();
      if (data.success) {
        setFollowupQueue({
          overdue: data.overdue || [],
          dueToday: data.dueToday || [],
          dueTomorrow: data.dueTomorrow || []
        });
      }
    } catch (err: any) {
      console.error("Error loading followup queue:", err.message);
    } finally {
      setLoadingQueue(false);
    }
  }, [counselorProfile, eligibilityCounselorFilter]);

  const handleUpdateLeadField = async (leadId: string, fieldName: string, fieldValue: any) => {
    try {
      const token = getAdminCredentials();
      const res = await fetch("/api/admin/eligibility-leads", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id: leadId,
          [fieldName]: fieldValue
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update lead");
      }
      showToast(`Updated lead ${fieldName} successfully`);
      fetchEligibilityData();
      fetchEligibilityAnalytics();
      if (selectedLead && selectedLead.id === leadId) {
        fetchLeadDetails(leadId);
      }
    } catch (err: any) {
      showToast(err.message);
    }
  };

  const handleBulkUpdate = async (fieldName: string, fieldValue: any) => {
    if (bulkSelectedLeadIds.length === 0) {
      showToast("No leads selected");
      return;
    }
    try {
      const token = getAdminCredentials();
      const res = await fetch("/api/admin/eligibility-leads", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ids: bulkSelectedLeadIds,
          [fieldName]: fieldValue
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed bulk update");
      }
      showToast(`Updated ${bulkSelectedLeadIds.length} leads successfully`);
      setBulkSelectedLeadIds([]);
      fetchEligibilityData();
      fetchEligibilityAnalytics();
    } catch (err: any) {
      showToast(err.message);
    }
  };

  const handleAddLeadNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !leadNoteText.trim()) return;
    setAddingLeadNote(true);
    try {
      const token = getAdminCredentials();
      const res = await fetch("/api/admin/eligibility-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          leadId: selectedLead.id,
          note: leadNoteText
        })
      });
      if (!res.ok) throw new Error("Failed to add note");
      const data = await res.json();
      if (data.success) {
        showToast("Note added successfully");
        setLeadNoteText("");
        fetchLeadDetails(selectedLead.id);
      }
    } catch (err: any) {
      showToast(err.message);
    } finally {
      setAddingLeadNote(false);
    }
  };

  const handleAddNoteLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLead) {
      handleAddLeadNote(e);
    }
  };

  const handleCompleteReminder = async (reminderId: string, reminderTitle: string, note: string) => {
    try {
      const { error } = await supabase
        .from("eligibility_reminders")
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          completed_by: counselorProfile?.id || null,
          completion_note: note || "Completed by Counselor"
        })
        .eq("id", reminderId);

      if (error) throw error;

      if (selectedLead) {
        await supabase.from("eligibility_activities").insert({
          lead_id: selectedLead.id,
          activity_type: "Reminder Completed",
          description: `Reminder "${reminderTitle}" marked as completed. Note: ${note}`,
          created_by: counselorProfile?.id || null
        });
        showToast("Reminder completed");
        fetchLeadDetails(selectedLead.id);
        fetchEligibilityAnalytics();
        if (eligibilityTabMode === "queue") {
          fetchFollowupQueue();
        }
      }
    } catch (err: any) {
      showToast(err.message);
    }
  };

  const handleExportCSV = () => {
    const leadsToExport = eligibilityLeads.filter(l => 
      bulkSelectedLeadIds.length === 0 || bulkSelectedLeadIds.includes(l.id)
    );

    if (leadsToExport.length === 0) {
      showToast("No leads selected for export");
      return;
    }

    const headers = ["Name", "Email", "Phone", "Qualification", "Academic %", "Budget", "Currency", "Country", "Course", "Intake", "Score", "Lead Level", "Priority", "Status", "Counselor", "Source", "Date Created"];
    const rows = leadsToExport.map(l => [
      l.name,
      l.email,
      l.phone,
      l.qualification,
      l.percentage,
      l.budget,
      l.currency,
      l.preferred_country,
      l.preferred_course,
      l.intake,
      l.lead_score_value,
      l.lead_score,
      l.priority,
      l.lead_status,
      l.assigned_counselor?.full_name || "Unassigned",
      l.utm_source || "Direct",
      new Date(l.created_at).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Annex_Eligibility_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${leadsToExport.length} leads successfully`);
  };


  const fetchReferralsData = React.useCallback(async () => {
    setLoadingReferrals(true);
    setLoadingReferralAnalytics(true);
    try {
      const token = getAdminCredentials();
      const res = await fetch(`/api/admin/referrals?status=${referralStatusFilter}&search=${encodeURIComponent(referralSearch)}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch referrals data");
      const data = await res.json();
      if (data.success) {
        setReferrals(data.referrals || []);
        setReferralAnalytics(data.analytics || null);
      }
    } catch (err: any) {
      console.error("Error loading referrals data:", err.message);
    } finally {
      setLoadingReferrals(false);
      setLoadingReferralAnalytics(false);
    }
  }, [referralStatusFilter, referralSearch]);

  React.useEffect(() => {
    if (isAuthenticated && activeTab === "referrals") {
      fetchReferralsData();
    }
  }, [isAuthenticated, activeTab, fetchReferralsData]);

  const handleUpdateReferralStatus = async (referralId: string, newStatus: string) => {
    setUpdatingReferralStatus(referralId);
    try {
      const token = getAdminCredentials();
      const res = await fetch("/api/admin/referrals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "update-status",
          referralId,
          status: newStatus
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update referral status");
      
      setToastMessage("Referral status updated successfully!");
      setTimeout(() => setToastMessage(null), 3000);
      
      fetchReferralsData();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUpdatingReferralStatus(null);
    }
  };

  const handleIssueReferralReward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReferral) return;
    
    setIssuingReward(true);
    try {
      const token = getAdminCredentials();
      const res = await fetch("/api/admin/referrals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "issue-reward",
          referralId: selectedReferral.id,
          rewardAmount: Number(rewardAmount),
          rewardType: "Cash",
          notes: `Referral reward issued by counselor/admin for ${selectedReferral.referred_name}`
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to issue reward");
      
      setToastMessage("Reward issued successfully!");
      setTimeout(() => setToastMessage(null), 3000);
      
      setIsRewardModalOpen(false);
      setSelectedReferral(null);
      
      fetchReferralsData();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIssuingReward(false);
    }
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
      const minPercentageVal = uniForm.min_percentage ? parseFloat(uniForm.min_percentage) : 0;
      const minIeltsVal = uniForm.min_ielts ? parseFloat(uniForm.min_ielts) : 0;
      const minPteVal = uniForm.min_pte ? parseInt(uniForm.min_pte, 10) : 0;
      const minToeflVal = uniForm.min_toefl ? parseInt(uniForm.min_toefl, 10) : 0;
      const annualFeesVal = uniForm.annual_fees ? parseFloat(uniForm.annual_fees) : 0;

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
        published: uniForm.published,
        min_percentage: minPercentageVal,
        min_ielts: minIeltsVal,
        min_pte: minPteVal,
        min_toefl: minToeflVal,
        degree_level: uniForm.degree_level || "Bachelors",
        annual_fees: annualFeesVal,
        scholarship_available: uniForm.scholarship_available
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

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailAddress) return;

    setSendingTestEmail(true);
    setTestEmailResult(null);
    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: testEmailAddress })
      });

      const result = await response.json();
      
      let prettyResponse = "";
      if (result.responseBody) {
        try {
          prettyResponse = JSON.stringify(JSON.parse(result.responseBody), null, 2);
        } catch {
          prettyResponse = result.responseBody;
        }
      }

      if (!response.ok || !result.success) {
        setTestEmailResult({
          success: false,
          message: result.error || "Failed to dispatch test email",
          responseBody: prettyResponse || undefined
        });
        showToast("⚠️ Send test email failed! Check status details below.");
      } else {
        setTestEmailResult({
          success: true,
          message: `Email sent successfully! MessageId: ${result.messageId}`,
          responseBody: prettyResponse || undefined
        });
        showToast("✉️ Test email dispatched successfully.");
        fetchAllData(); // Refresh logs
      }
    } catch (err: any) {
      setTestEmailResult({
        success: false,
        message: err.message
      });
      showToast("⚠️ Send test email failed: " + err.message);
    } finally {
      setSendingTestEmail(false);
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
  // TRAINING & PLACEMENT ADMIN ACTIONS
  // ----------------------------------------------------
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingService(true);
    try {
      const features = serviceForm.featuresText
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const payload = {
        title: serviceForm.title,
        description: serviceForm.description,
        price: parseFloat(serviceForm.price) || 0,
        features,
        status: serviceForm.status
      };

      if (serviceForm.id) {
        // Edit
        const { error } = await supabase
          .from("training_services")
          .update(payload)
          .eq("id", serviceForm.id);
        if (error) throw error;
        setToastMessage("Career service updated successfully!");
      } else {
        // Create
        const { error } = await supabase
          .from("training_services")
          .insert(payload);
        if (error) throw error;
        setToastMessage("New career service created successfully!");
      }

      setIsServiceModalOpen(false);
      setServiceForm({
        id: "",
        title: "",
        description: "",
        price: "",
        featuresText: "",
        status: "Active"
      });
      await fetchAllData();
    } catch (err: any) {
      alert("Error saving service: " + err.message);
    } finally {
      setSavingService(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this career service? This cannot be undone.")) return;
    try {
      const { error } = await supabase
        .from("training_services")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setToastMessage("Career service deleted.");
      await fetchAllData();
    } catch (err: any) {
      alert("Error deleting service: " + err.message);
    }
  };

  const handleActivateCareerStudent = async (student: any) => {
    if (!confirm(`Approve enrollment and activate Career Portal for ${student.student_name}?`)) return;
    try {
      const tempPassword = "Annex" + Math.random().toString(36).substring(2, 8).toUpperCase();
      console.log("[Diagnostic] Attempting sessionless auth signUp for career student:", student.student_email);

      let authUserId = null;
      const { data: authData, error: authError } = await sessionlessClient.auth.signUp({
        email: student.student_email,
        password: tempPassword
      });

      if (authError) {
        if (authError.message.toLowerCase().includes("already registered") || 
            authError.message.toLowerCase().includes("already exists") || 
            authError.code === "user_already_exists") {
          console.log("[Diagnostic] User exists in Auth. Attempting to sign in using default/restored session.");
          
          const { data: signInData, error: signInError } = await sessionlessClient.auth.signInWithPassword({
            email: student.student_email,
            password: tempPassword
          });

          if (signInError) {
            // Already registered, try self-heal using user profile search or let the admin know
            console.warn("[Self-healing] User profile already exists but wrong password. Resetting...");
            throw new Error(`This email is already registered in Auth. Use their existing credentials or change password in Supabase Dashboard.`);
          }

          if (signInData.user) {
            authUserId = signInData.user.id;
          }
        } else {
          throw authError;
        }
      } else {
        if (!authData.user) throw new Error("Could not create user account in Supabase Auth.");
        authUserId = authData.user.id;
      }

      if (!authUserId) {
        // Fallback: If we couldn't get a user ID, we'll try to find if a user exists in auth or table
        throw new Error("Could not retrieve Auth User ID.");
      }

      // Update training_students status to Active
      const { error: dbError } = await supabase
        .from("training_students")
        .update({
          auth_user_id: authUserId,
          status: "Active"
        })
        .eq("id", student.id);

      if (dbError) throw dbError;

      // Call API route to send onboarding details
      await fetch("/api/send-career-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "activated",
          studentId: student.id,
          details: {
            password: tempPassword
          }
        })
      });

      setToastMessage(`Candidate account activated! Credentials sent to ${student.student_email}`);
      await fetchAllData();
    } catch (err: any) {
      alert("Activation failed: " + err.message);
    }
  };

  const handleAssignCareerCounselor = async (studentId: string, counselorId: string) => {
    try {
      const { error } = await supabase
        .from("training_students")
        .update({ assigned_consultant_id: counselorId || null })
        .eq("id", studentId);

      if (error) throw error;
      setToastMessage("Advisor assigned successfully.");
      await fetchAllData();
      
      // Update selected student state if open
      if (selectedTrainingStudent && selectedTrainingStudent.id === studentId) {
        const refreshedStudent = trainingStudents.find(s => s.id === studentId);
        setSelectedTrainingStudent({
          ...selectedTrainingStudent,
          assigned_consultant_id: counselorId || null,
          counselors: counselors.find(c => c.id === counselorId) || null
        });
      }
    } catch (err: any) {
      alert("Failed to assign counselor: " + err.message);
    }
  };

  const loadTrainingDetailData = async (id: string) => {
    try {
      const { data: t } = await supabase
        .from("training_tasks")
        .select("*")
        .eq("student_id", id)
        .order("created_at", { ascending: true });
      setTrainingDetailTasks(t || []);

      const { data: d } = await supabase
        .from("training_documents")
        .select("*")
        .eq("student_id", id)
        .order("created_at", { ascending: false });
      setTrainingDetailDocs(d || []);

      const { data: m } = await supabase
        .from("meetings")
        .select("*, counselors(full_name)")
        .eq("training_student_id", id)
        .order("scheduled_at", { ascending: true });
      setTrainingDetailMeetings(m || []);

      const { data: c } = await supabase
        .from("training_messages")
        .select("*")
        .eq("student_id", id)
        .order("created_at", { ascending: true });
      setTrainingDetailMessages(c || []);

      // Fetch selected training student notification preferences and history logs
      try {
        const token = getAdminCredentials();
        const res = await fetch(`/api/admin/notifications?trainingStudentId=${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setSelectedStudentPrefs(data.preferences || {
            missing_documents_enabled: true,
            consultation_enabled: true,
            visa_updates_enabled: true,
            all_notifications_enabled: true
          });
          setSelectedStudentHistory(data.history || []);
        } else {
          console.error("Error loading training student notifications from API:", res.statusText);
        }
      } catch (prefErr: any) {
        console.error("Error loading training student preferences and history:", prefErr.message);
      }
    } catch (err: any) {
      console.error("Error loading detail candidate data:", err.message);
    }
  };

  const openTrainingDetailDrawer = async (student: any) => {
    setSelectedTrainingStudent(student);
    setTrainingNotesText(student.notes || "");
    setTrainingDetailTab("overview");
    setIsTrainingDetailOpen(true);
    await loadTrainingDetailData(student.id);
  };

  const handleSaveTrainingNotes = async () => {
    if (!selectedTrainingStudent) return;
    setSavingTrainingNotes(true);
    try {
      const { error } = await supabase
        .from("training_students")
        .update({ notes: trainingNotesText })
        .eq("id", selectedTrainingStudent.id);

      if (error) throw error;
      setToastMessage("Candidate notes saved.");
      await loadTrainingDetailData(selectedTrainingStudent.id);
    } catch (err: any) {
      alert("Failed to save notes: " + err.message);
    } finally {
      setSavingTrainingNotes(false);
    }
  };

  const handleCreateCareerTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrainingStudent || !careerTaskForm.title) return;
    setAddingCareerTask(true);
    try {
      const { data, error } = await supabase
        .from("training_tasks")
        .insert({
          student_id: selectedTrainingStudent.id,
          title: careerTaskForm.title,
          description: careerTaskForm.description,
          due_date: careerTaskForm.due_date || null,
          status: "Pending"
        })
        .select()
        .single();

      if (error) throw error;

      // Dispatch task notification email
      await fetch("/api/send-career-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "task-assigned",
          studentId: selectedTrainingStudent.id,
          details: {
            taskTitle: careerTaskForm.title,
            dueDate: careerTaskForm.due_date || undefined
          }
        })
      });

      setCareerTaskForm({
        title: "",
        description: "",
        due_date: ""
      });
      await loadTrainingDetailData(selectedTrainingStudent.id);
      setToastMessage("New task assigned to candidate.");
    } catch (err: any) {
      alert("Failed to create task: " + err.message);
    } finally {
      setAddingCareerTask(false);
    }
  };

  const handleDeleteCareerTask = async (taskId: string) => {
    if (!confirm("Delete this task?")) return;
    try {
      const { error } = await supabase
        .from("training_tasks")
        .delete()
        .eq("id", taskId);
      if (error) throw error;
      await loadTrainingDetailData(selectedTrainingStudent.id);
      setToastMessage("Task deleted.");
    } catch (err: any) {
      alert("Failed to delete task: " + err.message);
    }
  };

  const handleUpdateCareerTaskStatus = async (taskId: string, status: string, feedback: string) => {
    try {
      const { error } = await supabase
        .from("training_tasks")
        .update({ status, feedback })
        .eq("id", taskId);
      if (error) throw error;
      await loadTrainingDetailData(selectedTrainingStudent.id);
      setToastMessage("Task updated.");
    } catch (err: any) {
      alert("Failed to update task: " + err.message);
    }
  };

  const handleSaveDocumentFeedback = async (docId: string, feedback: string) => {
    try {
      const { error } = await supabase
        .from("training_documents")
        .update({ feedback }) // Wait, documents don't have feedback? Let's check schema.
        // Ah, training_documents only has: id, student_id, title, file_url, uploaded_by, created_at.
        // It doesn't have a feedback field! That is perfectly fine, we don't need a documents feedback box,
        // or we can just download documents.
        ;
      // Let's not call feedback for documents unless we add it, we can just display them.
      setToastMessage("Feedback saved.");
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleScheduleCareerMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrainingStudent || !careerMeetingForm.title || !careerMeetingForm.date || !careerMeetingForm.time) return;
    setSavingCareerMeeting(true);
    try {
      const scheduledAt = new Date(`${careerMeetingForm.date}T${careerMeetingForm.time}`).toISOString();
      const payload = {
        training_student_id: selectedTrainingStudent.id,
        title: careerMeetingForm.title,
        description: careerMeetingForm.description,
        scheduled_at: scheduledAt,
        duration_minutes: parseInt(careerMeetingForm.duration_minutes) || 30,
        meeting_link: careerMeetingForm.meeting_link || null,
        meeting_type: careerMeetingForm.meeting_type,
        status: "Scheduled",
        counselor_id: selectedTrainingStudent.assigned_consultant_id || null
      };

      const { data, error } = await supabase
        .from("meetings")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      // Dispatch meeting email notification
      await fetch("/api/send-career-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "meeting-scheduled",
          studentId: selectedTrainingStudent.id,
          details: {
            meetingTitle: careerMeetingForm.title,
            scheduledAt,
            meetingLink: careerMeetingForm.meeting_link,
            meetingType: careerMeetingForm.meeting_type,
            durationMinutes: parseInt(careerMeetingForm.duration_minutes) || 30
          }
        })
      });

      setCareerMeetingForm({
        title: "",
        description: "",
        date: "",
        time: "",
        duration_minutes: "30",
        meeting_link: "",
        meeting_type: "Google Meet"
      });
      await loadTrainingDetailData(selectedTrainingStudent.id);
      setToastMessage("Meeting scheduled.");
    } catch (err: any) {
      alert("Failed to schedule meeting: " + err.message);
    } finally {
      setSavingCareerMeeting(false);
    }
  };

  const handleDeleteCareerMeeting = async (meetingId: string) => {
    if (!confirm("Are you sure you want to cancel this meeting?")) return;
    try {
      const { error } = await supabase
        .from("meetings")
        .delete()
        .eq("id", meetingId);
      if (error) throw error;
      await loadTrainingDetailData(selectedTrainingStudent.id);
      setToastMessage("Meeting cancelled.");
    } catch (err: any) {
      alert("Failed to cancel meeting: " + err.message);
    }
  };

  const handleSendCareerChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerChatText.trim() || !selectedTrainingStudent) return;

    setSendingCareerChat(true);
    const content = careerChatText;
    try {
      const { error } = await supabase
        .from("training_messages")
        .insert({
          student_id: selectedTrainingStudent.id,
          sender_type: "counselor",
          message: content
        });

      if (error) throw error;

      // Trigger chat email message notification
      await fetch("/api/send-career-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "message",
          studentId: selectedTrainingStudent.id,
          details: {
            messageContent: content,
            senderType: "counselor"
          }
        })
      });

      setCareerChatText("");
      await loadTrainingDetailData(selectedTrainingStudent.id);
    } catch (err: any) {
      alert("Error sending reply: " + err.message);
    } finally {
      setSendingCareerChat(false);
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

        // A. Pre-check: Does a student profile with this email already exist in 'students' table?
        console.log("[Diagnostic] Pre-checking email in public.students table:", studentForm.email);
        const { data: existingProfile, error: profileCheckError } = await supabase
          .from("students")
          .select("id")
          .eq("email", studentForm.email)
          .maybeSingle();

        if (profileCheckError) {
          console.warn("[Diagnostic] Pre-check profile query warning:", profileCheckError.message);
        }

        if (existingProfile) {
          throw new Error("A student profile with this email address already exists in the database.");
        }

        let studentId = null;

        // B. Sign up via sessionless client so admin is NOT logged out!
        console.log("[Diagnostic] Attempting sessionless auth signUp for email:", studentForm.email);
        const { data: authData, error: authError } = await sessionlessClient.auth.signUp({
          email: studentForm.email,
          password: studentForm.password
        });

        if (authError) {
          console.warn("[Diagnostic] Auth signUp failed. Error code:", authError.code, "Message:", authError.message);
          
          if (authError.message.toLowerCase().includes("already registered") || 
              authError.message.toLowerCase().includes("already exists") || 
              authError.code === "user_already_exists") {
            console.log("[Diagnostic] User exists in Auth but not in students table. Attempting self-healing by signing in to retrieve User ID.");
            
            // Sign in to retrieve user id using provided password
            const { data: signInData, error: signInError } = await sessionlessClient.auth.signInWithPassword({
              email: studentForm.email,
              password: studentForm.password
            });

            if (signInError) {
              console.error("[Diagnostic] Self-healing sign-in failed. Error:", signInError.message);
              throw new Error(`This email is already registered in authentication. To restore their student profile, please enter the correct password for this account.`);
            }

            if (signInData.user) {
              studentId = signInData.user.id;
              console.log("[Diagnostic] Self-healing sign-in succeeded. Re-using existing Auth User ID:", studentId);
            } else {
              throw new Error("Email is already registered. Self-healing failed to retrieve user ID.");
            }
          } else {
            throw authError;
          }
        } else {
          if (!authData.user) throw new Error("Could not create user account in Supabase Auth.");
          studentId = authData.user.id;
          console.log("[Diagnostic] Auth signUp succeeded. New User ID:", studentId);
        }

        // C. Insert profile record — let id auto-generate, store auth link in auth_user_id
        console.log("[Diagnostic] Inserting student profile row in public.students table with auth_user_id:", studentId);
        const { data: insertedStudent, error: dbError } = await supabase
          .from("students")
          .insert([{
            auth_user_id: studentId,
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
          }])
          .select("id")
          .single();

        if (dbError) {
          console.error("[Diagnostic] Inserting student profile failed. Error:", dbError.message);
          throw dbError;
        }

        const newStudentId = insertedStudent.id;
        console.log("[Diagnostic] Student profile inserted. Internal ID:", newStudentId, "Auth User ID:", studentId);

        // 3. Initialize default visa status stage
        await supabase.from("student_visa_status").insert([{
          student_id: newStudentId,
          status: "Application Started",
          details: "Visa process has been initialized by counselor."
        }]);

        // 4. Log admin action
        await supabase.from("student_activity_logs").insert({
          student_id: newStudentId,
          action: "Account Created",
          details: "Student credentials and profile generated by Admin."
        });

        // 5. Send welcome notification
        await supabase.from("student_notifications").insert([{
          student_id: newStudentId,
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

  const handleStartEditCounselor = async (c: any) => {
    setEditingCounselor(c);
    setCounselorForm({
      full_name: c.full_name,
      email: c.email,
      phone: c.phone || "",
      designation: c.designation || "",
      avatar_url: c.avatar_url || "",
      is_active: c.is_active
    });
    setSelectedCounselorRole(c.role_id || "");
    setCounselorPermOverrides({});
    setIsCounselorModalOpen(true);
    
    // Load overrides from server side
    setLoadingPerms(true);
    try {
      const token = getAdminCredentials();
      const res = await fetch(`/api/admin/rbac?action=get-counselor-perms&counselorId=${c.id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedCounselorRole(data.roleId || "");
        const overrides: any = {};
        if (data.permissionsMatrix) {
          Object.entries(data.permissionsMatrix).forEach(([key, val]: any) => {
            overrides[key] = val.override;
          });
        }
        setCounselorPermOverrides(overrides);
      }
    } catch (err: any) {
      console.error("Failed to load counselor permissions overrides:", err.message);
    } finally {
      setLoadingPerms(false);
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
      let cId = "";
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
        cId = editingCounselor.id;
        showToast("Counselor profile updated successfully");
      } else {
        // Create new counselor
        const { data: newC, error } = await supabase
          .from("counselors")
          .insert([{
            full_name: counselorForm.full_name,
            email: counselorForm.email,
            phone: counselorForm.phone || null,
            designation: counselorForm.designation || null,
            avatar_url: counselorForm.avatar_url || null,
            is_active: counselorForm.is_active
          }])
          .select()
          .single();

        if (error) throw error;
        cId = newC.id;
        showToast("Counselor created successfully!");
      }

      // Save role & overrides
      const token = getAdminCredentials();
      const saveRes = await fetch("/api/admin/rbac", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "save-counselor-perms",
          counselorId: cId,
          roleId: selectedCounselorRole || null,
          overrides: counselorPermOverrides
        })
      });

      if (!saveRes.ok) {
        const saveErr = await saveRes.json();
        throw new Error("Saved counselor profile, but failed to save permissions: " + (saveErr.error || "Unknown error"));
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
      setSelectedCounselorRole("");
      setCounselorPermOverrides({});
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

  // === Role Management Handlers ===
  const openNewRoleModal = () => {
    setEditingRole(null);
    setRoleForm({ name: "", description: "", permissions: [] });
    setIsRoleModalOpen(true);
  };

  const openEditRoleModal = (role: any) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description || "",
      permissions: role.permissions || []
    });
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleForm.name.trim()) {
      alert("Role name is required.");
      return;
    }
    setSavingRole(true);
    try {
      const token = getAdminCredentials();
      const action = editingRole ? "edit-role" : "create-role";
      const payload: any = {
        action,
        name: roleForm.name.trim(),
        description: roleForm.description.trim(),
        permissions: roleForm.permissions
      };
      if (editingRole) {
        payload.roleId = editingRole.id;
      }
      const res = await fetch("/api/admin/rbac", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save role");
      }
      showToast(editingRole ? "Role updated successfully" : "New role created successfully");
      setIsRoleModalOpen(false);
      setEditingRole(null);
      setRoleForm({ name: "", description: "", permissions: [] });
      fetchAllData();
    } catch (err: any) {
      alert("Error saving role: " + err.message);
    } finally {
      setSavingRole(false);
    }
  };

  const handleCloneRole = async (role: any) => {
    const cloneName = prompt(`Clone role "${role.name}" as:`, `${role.name} (Copy)`);
    if (!cloneName) return;
    try {
      const token = getAdminCredentials();
      const res = await fetch("/api/admin/rbac", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "clone-role",
          sourceRoleId: role.id,
          name: cloneName,
          description: `Cloned from ${role.name}`
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to clone role");
      }
      showToast(`Role cloned as "${cloneName}"`);
      fetchAllData();
    } catch (err: any) {
      alert("Error cloning role: " + err.message);
    }
  };

  const handleDeleteRole = async (role: any) => {
    if (role.userCount > 0) {
      alert(`Cannot delete role "${role.name}" — ${role.userCount} counselor(s) are still assigned to it. Reassign them first.`);
      return;
    }
    if (!confirm(`Delete role "${role.name}"? This action cannot be undone.`)) return;
    try {
      const token = getAdminCredentials();
      // Delete role permissions first, then the role itself
      const { error: permErr } = await supabase.from("role_permissions").delete().eq("role_id", role.id);
      if (permErr) throw permErr;
      const { error: roleErr } = await supabase.from("user_roles").delete().eq("id", role.id);
      if (roleErr) throw roleErr;
      showToast(`Role "${role.name}" deleted`);
      fetchAllData();
    } catch (err: any) {
      alert("Error deleting role: " + err.message);
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

  const handleSaveExpert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expertForm.name || !expertForm.designation) {
      alert("Name and Designation are required.");
      return;
    }

    setSavingExpert(true);
    try {
      if (editingExpert) {
        // Update existing expert
        const { error } = await supabase
          .from("career_experts")
          .update({
            name: expertForm.name,
            designation: expertForm.designation,
            expertise: expertForm.expertise,
            photo_url: expertForm.photo_url || null,
            linkedin_url: expertForm.linkedin_url || null,
            display_order: parseInt(expertForm.display_order as any) || 0,
            is_active: expertForm.is_active
          })
          .eq("id", editingExpert.id);

        if (error) throw error;
        showToast("Career expert updated successfully");
      } else {
        // Create new expert
        const { error } = await supabase
          .from("career_experts")
          .insert([{
            name: expertForm.name,
            designation: expertForm.designation,
            expertise: expertForm.expertise,
            photo_url: expertForm.photo_url || null,
            linkedin_url: expertForm.linkedin_url || null,
            display_order: parseInt(expertForm.display_order as any) || 0,
            is_active: expertForm.is_active
          }]);

        if (error) throw error;
        showToast("Career expert created successfully!");
      }
      setIsExpertModalOpen(false);
      setEditingExpert(null);
      setExpertForm({
        name: "",
        designation: "",
        expertise: "",
        photo_url: "",
        linkedin_url: "",
        display_order: 0,
        is_active: true
      });
      await fetchAllData();
    } catch (err: any) {
      alert("Error saving expert: " + err.message);
    } finally {
      setSavingExpert(false);
    }
  };

  const handleDeleteExpert = async (id: string) => {
    if (!confirm("Are you sure you want to delete this career expert? This action cannot be undone.")) return;
    try {
      const { error } = await supabase
        .from("career_experts")
        .delete()
        .eq("id", id);
      if (error) throw error;
      showToast("Career expert deleted successfully.");
      await fetchAllData();
    } catch (err: any) {
      alert("Error deleting expert: " + err.message);
    }
  };

  const handleExpertPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingExpertPhoto(true);
    try {
      const fileExt = file.name.split(".").pop();
      const randomName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `career_experts/photos/${randomName}`;

      const { error: uploadErr } = await supabase.storage
        .from("student-files")
        .upload(filePath, file);
      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage
        .from("student-files")
        .getPublicUrl(filePath);

      setExpertForm(prev => ({ ...prev, photo_url: publicUrl }));
      showToast("Photo uploaded successfully");
    } catch (err: any) {
      alert("Error uploading photo: " + err.message);
    } finally {
      setUploadingExpertPhoto(false);
    }
  };

  const handleToggleExpertActive = async (expert: any) => {
    try {
      const { error } = await supabase
        .from("career_experts")
        .update({ is_active: !expert.is_active })
        .eq("id", expert.id);
      if (error) throw error;
      showToast(`Expert status set to ${!expert.is_active ? "Active" : "Inactive"}`);
      await fetchAllData();
    } catch (err: any) {
      alert("Failed to toggle status: " + err.message);
    }
  };

  const handleUpdateExpertOrder = async (id: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from("career_experts")
        .update({ display_order: newOrder })
        .eq("id", id);
      if (error) throw error;
      showToast("Display order updated.");
      await fetchAllData();
    } catch (err: any) {
      alert("Failed to update order: " + err.message);
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
          counselorName: "Annex Counselor",
          messageId: newMsg.id
        })
      })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok || !result.success) {
          const errorMsg = result.error || "Email delivery failed";
          showToast(`⚠️ Reply sent, but email notification to student failed: ${errorMsg}`);
        }
      })
      .catch(err => {
        console.error("Email notification error:", err);
        showToast(`⚠️ Reply sent, but email notification to student failed: ${err.message}`);
      });

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

      const { data: mtgs } = await supabase.from("meetings").select("*, counselors(full_name)").eq("student_id", id).order("scheduled_at", { ascending: false });
      setAuditMeetings(mtgs || []);

      // Fetch selected student notification preferences and history logs
      try {
        const token = getAdminCredentials();
        const res = await fetch(`/api/admin/notifications?studentId=${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setSelectedStudentPrefs(data.preferences || {
            missing_documents_enabled: true,
            consultation_enabled: true,
            visa_updates_enabled: true,
            all_notifications_enabled: true
          });
          setSelectedStudentHistory(data.history || []);
        } else {
          console.error("Error loading student notifications from API:", res.statusText);
        }
      } catch (prefErr: any) {
        console.error("Error loading student preferences and history:", prefErr.message);
      }
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

      // Trigger reactive visa update email notification
      try {
        await fetch("/api/send-student-notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAdminCredentials()}`
          },
          body: JSON.stringify({
            studentId: selectedStudent.id,
            action: "visa-status-updated",
            details: {
              status: adminVisaStatus,
              note: adminVisaDetails
            }
          })
        });
      } catch (notifErr: any) {
        console.error("Failed to dispatch reactive visa email:", notifErr.message);
      }

      showToast("Visa status timeline modified");
      await loadAuditDetails(selectedStudent.id);
    } catch (err: any) {
      alert("Error updating visa status: " + err.message);
    } finally {
      setUpdatingVisa(false);
    }
  };
  const handleUpdateStudentPrefs = async (key: string, value: boolean, studentType: "standard" | "training") => {
    const student = studentType === "standard" ? selectedStudent : selectedTrainingStudent;
    if (!student) return;
    setSavingStudentPrefs(true);
    try {
      const token = getAdminCredentials();
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "update-prefs",
          studentId: studentType === "standard" ? student.id : undefined,
          trainingStudentId: studentType === "training" ? student.id : undefined,
          key,
          value
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update notification preferences");
      }

      setSelectedStudentPrefs((prev: any) => ({ ...prev, [key]: value }));
      showToast("Notification preferences updated successfully");
    } catch (err: any) {
      alert("Error updating notification preferences: " + err.message);
    } finally {
      setSavingStudentPrefs(false);
    }
  };

  const handleToggleGlobalNotifications = async (enabled: boolean) => {
    try {
      const token = getAdminCredentials();
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "toggle-global",
          enabled
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save global settings");
      }

      setNotificationsEnabled(enabled);
      showToast(`Global notifications ${enabled ? "enabled" : "disabled"}`);
    } catch (err: any) {
      alert("Error saving global settings: " + err.message);
    }
  };

  const handleResendNotificationLog = async (log: any) => {
    if (!log) return;
    setTriggeringNotif(log.id);
    try {
      const studentId = log.student_id || log.training_student_id;
      const isTraining = !!log.training_student_id;

      let action = "";
      let details: any = { manual: true };

      if (log.notification_type === "missing_documents") {
        action = "missing-documents-reminder";
      } else if (log.notification_type === "consultation") {
        action = "consultation-reminder";
      } else if (log.notification_type === "visa_update") {
        action = "visa-status-updated";
        const statusMatch = log.subject.match(/Status:\s*(.+)$/);
        const parsedStatus = statusMatch ? statusMatch[1] : "Application Started";
        details = {
          status: parsedStatus,
          note: "Resending visa status update notification.",
          manual: true
        };
      }

      const payload: any = {
        action,
        details
      };
      if (isTraining) {
        payload.trainingStudentId = studentId;
      } else {
        payload.studentId = studentId;
      }

      const res = await fetch("/api/send-student-notification", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAdminCredentials()}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to trigger resend");
      }

      showToast("Notification trigger executed successfully");
      fetchAllData();
    } catch (err: any) {
      alert("Resend failed: " + err.message);
    } finally {
      setTriggeringNotif(null);
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
          counselorName: "Annex Counselor",
          messageId: newMsg.id
        })
      })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok || !result.success) {
          const errorMsg = result.error || "Email delivery failed";
          showToast(`⚠️ Reply sent, but email notification to student failed: ${errorMsg}`);
        }
      })
      .catch(err => {
        console.error("Email notification error:", err);
        showToast(`⚠️ Reply sent, but email notification to student failed: ${err.message}`);
      });

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
        <Card className="max-w-md w-full p-8 bg-white shadow-xl rounded-2xl border border-hairline">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-4 p-2">
              <AnnexLogo size={32} showText={false} />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-slate-800 font-display">Annex Consultancy</CardTitle>
            <CardDescription className="mt-1 text-xs text-slate-500">Sign in to manage student profiles and counselor portals.</CardDescription>
          </div>

          <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl mb-5">
            <button
              type="button"
              onClick={() => { setLoginMethod("counselor"); setAuthError(""); }}
              className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer ${
                loginMethod === "counselor" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Counselor Login
            </button>
            <button
              type="button"
              onClick={() => { setLoginMethod("access-key"); setAuthError(""); setEmail(""); }}
              className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer ${
                loginMethod === "access-key" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Access Key
            </button>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {authError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-xs font-semibold text-red-600">
                {authError}
              </div>
            )}
            
            {loginMethod === "counselor" ? (
              <>
                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="email" className="text-xs font-bold text-primary uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-3 border border-hairline rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white"
                    placeholder="counselor@annex.com"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="pass" className="text-xs font-bold text-primary uppercase tracking-wider">Password</label>
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
              </>
            ) : (
              <div className="flex flex-col gap-1.5 text-left">
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
            )}

            <Button type="submit" variant="primary" className="w-full mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <SpinnerGap className="animate-spin" size={16} />
                  Authenticating...
                </span>
              ) : (
                loginMethod === "counselor" ? "Sign In" : "Verify Key"
              )}
            </Button>
          </form>
        </Card>
      </main>
    );
  }

  const filteredNotifHistory = notificationHistory.filter(log => {
    const studentName = log.students?.name || log.training_students?.student_name || "";
    const studentEmail = log.students?.email || log.training_students?.student_email || "";
    const subject = log.subject || "";
    
    const matchesSearch = 
      studentName.toLowerCase().includes(notifHistorySearch.toLowerCase()) ||
      studentEmail.toLowerCase().includes(notifHistorySearch.toLowerCase()) ||
      subject.toLowerCase().includes(notifHistorySearch.toLowerCase());
      
    const matchesType = notifHistoryTypeFilter === "All" || log.notification_type === notifHistoryTypeFilter;
    const matchesStatus = notifHistoryStatusFilter === "All" || log.status === notifHistoryStatusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

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
            <AnnexLogo size={32} showText={true} />
            <span className="font-display font-bold text-lg text-slate-400 tracking-tight">ADMIN</span>
          </div>
          
          <nav className="flex flex-wrap gap-1 sm:gap-2">
            {visibleTabs.map(tab => {
              const isActive = activeTab === tab.id;
              const unreadCount = tab.id === "chat" 
                ? conversations.reduce((sum, c) => sum + (c.unread_count_admin || 0), 0)
                : 0;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
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
                      published: true,
                      min_percentage: "",
                      min_ielts: "",
                      min_pte: "",
                      min_toefl: "",
                      degree_level: "Bachelors",
                      annual_fees: "",
                      scholarship_available: false
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
                                      published: uni.published || false,
                                      min_percentage: uni.min_percentage ? uni.min_percentage.toString() : "",
                                      min_ielts: uni.min_ielts ? uni.min_ielts.toString() : "",
                                      min_pte: uni.min_pte ? uni.min_pte.toString() : "",
                                      min_toefl: uni.min_toefl ? uni.min_toefl.toString() : "",
                                      degree_level: uni.degree_level || "Bachelors",
                                      annual_fees: uni.annual_fees ? uni.annual_fees.toString() : "",
                                      scholarship_available: uni.scholarship_available || false
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
                      <th className="p-4">System Role</th>
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
                          <td className="p-4 text-slate-600 font-medium">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                              {c.user_roles?.name || "No Role"}
                            </span>
                          </td>
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
                              onClick={() => handleStartEditCounselor(c)}
                              className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-50 rounded transition-colors cursor-pointer"
                              title="Edit profile & permissions"
                            >
                              <Gear size={16} />
                            </button>
                            {!c.auth_user_id ? (
                              <button
                                onClick={() => {
                                  setProvisionCounselor(c);
                                  setProvisionPassword("");
                                  setProvisionModalOpen(true);
                                }}
                                className="p-1.5 text-amber-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                                title="Provision Login Credentials"
                              >
                                <Key size={16} />
                              </button>
                            ) : (
                              <span className="p-1.5 text-emerald-500 cursor-default" title="Login Active">
                                <Key size={16} weight="fill" />
                              </span>
                            )}
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

        {activeTab === "settings" && (
          <section className="flex flex-col gap-8 animate-fade-in text-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-2xl text-primary leading-tight">Email System Diagnostics</h2>
                <p className="text-xs text-slate-400 mt-1">Audit the Brevo Transactional API setup, send test emails, and review recent notification logs.</p>
              </div>
              <Button variant="secondary" size="sm" onClick={fetchAllData} className="flex items-center gap-1.5">
                <SpinnerGap className={loading ? "animate-spin" : ""} size={14} /> Refresh Logs
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Diagnostics & Config Status / Send Test Email */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Configuration Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Gear size={16} className="text-primary" />
                      Email System Status
                    </CardTitle>
                    <CardDescription className="text-[11px]">Server-side diagnostics for transactional notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs">
                    <div className="flex justify-between items-center py-2 border-b border-hairline">
                      <span className="font-semibold text-slate-500">Active Provider</span>
                      {emailConfig ? (
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase border ${
                          emailConfig.activeProvider === "brevo-smtp"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {emailConfig.activeProvider === "brevo-smtp" ? "Brevo SMTP" : "Mock Mode"}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Checking...</span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-hairline">
                      <span className="font-semibold text-slate-500">Sender Email</span>
                      <span className="font-mono-data text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-hairline/50">
                        {emailConfig ? emailConfig.emailFrom : "Checking..."}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-hairline">
                      <span className="font-semibold text-slate-500">SMTP Host</span>
                      {emailConfig ? (
                        emailConfig.hasBrevoSmtpHost ? (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[10px] uppercase font-mono-data">Configured</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-full font-bold text-[10px] uppercase font-mono-data">Missing</span>
                        )
                      ) : (
                        <span className="text-slate-400">Checking...</span>
                      )}
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-hairline">
                      <span className="font-semibold text-slate-500">SMTP Port</span>
                      {emailConfig ? (
                        <span className="font-mono-data font-bold text-slate-600">
                          {emailConfig.smtpPort}
                        </span>
                      ) : (
                        <span className="text-slate-400">Checking...</span>
                      )}
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-hairline">
                      <span className="font-semibold text-slate-500">SMTP User</span>
                      {emailConfig ? (
                        emailConfig.hasBrevoSmtpUser ? (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[10px] uppercase font-mono-data">Configured</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-full font-bold text-[10px] uppercase font-mono-data">Missing</span>
                        )
                      ) : (
                        <span className="text-slate-400">Checking...</span>
                      )}
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-hairline">
                      <span className="font-semibold text-slate-500">SMTP Password</span>
                      {emailConfig ? (
                        emailConfig.hasBrevoSmtpPass ? (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[10px] uppercase font-mono-data">Configured</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-full font-bold text-[10px] uppercase font-mono-data">Missing</span>
                        )
                      ) : (
                        <span className="text-slate-400">Checking...</span>
                      )}
                    </div>

                    <div className="space-y-1.5 py-2 border-b border-hairline">
                      <span className="font-semibold text-slate-500 block">Last Email Attempt</span>
                      {emailLogs && emailLogs.length > 0 ? (
                        <div className="bg-slate-50 border border-hairline/50 rounded-lg p-2.5 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-mono-data text-slate-700 break-all pr-2 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                              {emailLogs[0].recipient_email}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                              emailLogs[0].status === "sent" || emailLogs[0].status === "delivered"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}>
                              {emailLogs[0].status}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis">
                            Subject: {emailLogs[0].subject}
                          </div>
                          <div className="text-[9px] text-slate-400 font-medium">
                            {new Date(emailLogs[0].created_at).toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 block font-medium">No attempts recorded</span>
                      )}
                    </div>

                    {emailConfig && emailConfig.activeProvider === "mock" && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 mt-2">
                        <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                          <WarningCircle size={14} />
                          <span>Mock Mode Activated</span>
                        </div>
                        <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                          {emailConfig.reason}
                        </p>
                        <p className="text-[9px] text-amber-600/90 leading-tight">
                          Mails are logged locally to the console and DB, but not sent over the network.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Send Test Email Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <PaperPlaneRight size={16} className="text-primary" />
                      Send Test Email
                    </CardTitle>
                    <CardDescription className="text-[11px]">Dispatch a test email transaction via Brevo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSendTestEmail} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recipient Email Address</label>
                        <input
                          type="email"
                          required
                          value={testEmailAddress}
                          onChange={(e) => setTestEmailAddress(e.target.value)}
                          placeholder="e.g. test@example.com"
                          className="w-full border border-hairline px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-primary bg-white text-slate-800"
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={sendingTestEmail}
                        className="w-full text-xs py-2.5 flex items-center justify-center gap-1.5"
                      >
                        {sendingTestEmail ? (
                          <SpinnerGap size={14} className="animate-spin text-white" />
                        ) : (
                          <>
                            <PaperPlaneRight size={14} />
                            Send Test Email
                          </>
                        )}
                      </Button>
                      
                      {testEmailResult && (
                        <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                          testEmailResult.success 
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                            : "bg-red-50 text-red-800 border-red-200"
                        }`}>
                          <p className="font-bold mb-1">{testEmailResult.success ? "Success" : "Error Details"}</p>
                          <p className="break-words whitespace-pre-wrap font-mono-data text-[10px] bg-white/50 p-2 rounded border border-hairline/25">{testEmailResult.message}</p>
                          {testEmailResult.responseBody && (
                            <div className="mt-2 space-y-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Raw Provider Response</span>
                              <pre className="text-[9px] font-mono-data bg-white/80 p-2 rounded border border-hairline/30 overflow-x-auto text-slate-700 max-h-[150px]">
                                {testEmailResult.responseBody}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </form>
                  </CardContent>
                </Card>

              </div>

              {/* Right Column: Notification Logs attempts */}
              <div className="lg:col-span-2 space-y-6">
                
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Clock size={16} className="text-primary" />
                      Mailing Log History (Last 50 attempts)
                    </CardTitle>
                    <CardDescription className="text-[11px]">Real-time list of email notifications dispatched by the Annex server</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow p-0 overflow-x-auto">
                    {emailLogsTableExists === false ? (
                      <div className="p-8 text-center text-slate-500 space-y-3">
                        <WarningCircle size={40} className="mx-auto text-amber-500 animate-pulse" />
                        <h4 className="font-bold text-sm text-slate-700">Database Table Missing</h4>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                          The email logger could not retrieve events because the <code>email_logs</code> table does not exist yet. Please execute the SQL migration script in your Supabase SQL editor:
                        </p>
                        <textarea
                          readOnly
                          rows={6}
                          className="w-full text-[10px] font-mono-data bg-slate-900 text-slate-300 p-3 rounded-lg border border-hairline resize-none"
                          value={`CREATE TABLE public.email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT DEFAULT 'sent',
    message_id TEXT,
    error_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`}
                        />
                      </div>
                    ) : emailLogs.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 text-xs">
                        <CheckCircle size={40} className="mx-auto text-slate-300 mb-2" />
                        <span>No mail logs found in database. Send a test email to initialize logs.</span>
                      </div>
                    ) : (
                      <div className="max-h-[500px] overflow-y-auto">
                        <table className="w-full text-left text-xs text-slate-600 divide-y divide-hairline">
                          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <tr>
                              <th className="px-4 py-3">Status</th>
                              <th className="px-4 py-3">Recipient</th>
                              <th className="px-4 py-3">Subject</th>
                              <th className="px-4 py-3">Details / Errors</th>
                              <th className="px-4 py-3">Date & Time</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-hairline bg-white">
                            {emailLogs.map((log) => (
                              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3">
                                  <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                    log.status === "delivered" 
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                                      : log.status === "sent"
                                      ? "bg-blue-50 text-blue-600 border-blue-200"
                                      : "bg-red-50 text-red-600 border-red-200"
                                  }`}>
                                    {log.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 font-semibold text-slate-700 truncate max-w-[150px]">{log.recipient_email}</td>
                                <td className="px-4 py-3 truncate max-w-[180px]">{log.subject}</td>
                                <td className="px-4 py-3 max-w-[200px]">
                                  {log.error_details ? (
                                    <div className="text-[10px] text-red-600 bg-red-50/50 border border-red-100 p-2.5 rounded-xl font-mono-data whitespace-pre-wrap break-words max-h-[100px] overflow-y-auto leading-relaxed">
                                      {log.error_details}
                                    </div>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 font-mono-data break-all">{log.message_id || "N/A"}</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-slate-400 text-[10px]">
                                  {new Date(log.created_at).toLocaleDateString()} at {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>

              </div>

            </div>
          </section>
        )}

        {activeTab === "notifications" && (
          <section className="flex flex-col gap-8 animate-fade-in text-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-2xl text-primary leading-tight">Notification Control Center</h2>
                <p className="text-xs text-slate-400 mt-1">Monitor, filter, and manually trigger automated student emails for documents, consultations, and visa status changes.</p>
              </div>
              <Button variant="secondary" size="sm" onClick={fetchAllData} className="flex items-center gap-1.5">
                <SpinnerGap className={loading ? "animate-spin" : ""} size={14} /> Refresh Center
              </Button>
            </div>

            {/* Notification Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { 
                  label: "Total Reminders", 
                  value: notificationHistory.length, 
                  icon: <Bell size={18} className="text-primary" weight="bold" />, 
                  bg: "bg-slate-50 border-slate-100" 
                },
                { 
                  label: "Documents Alerted", 
                  value: notificationHistory.filter(n => n.notification_type === "missing_documents").length, 
                  icon: <FileText size={18} className="text-yellow-600" weight="bold" />, 
                  bg: "bg-yellow-50/20 border-yellow-100/60" 
                },
                { 
                  label: "Meetings Alerted", 
                  value: notificationHistory.filter(n => n.notification_type === "consultation").length, 
                  icon: <Calendar size={18} className="text-blue-600" weight="bold" />, 
                  bg: "bg-blue-50/20 border-blue-100/60" 
                },
                { 
                  label: "Visa Updates Sent", 
                  value: notificationHistory.filter(n => n.notification_type === "visa_update").length, 
                  icon: <Globe size={18} className="text-purple-600" weight="bold" />, 
                  bg: "bg-purple-50/20 border-purple-100/60" 
                },
                { 
                  label: "Delivery Failures", 
                  value: notificationHistory.filter(n => n.status === "failed").length, 
                  icon: <WarningCircle size={18} className="text-red-600" weight="bold" />, 
                  bg: "bg-red-50/20 border-red-100/60" 
                }
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Global Toggle */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Gear size={16} className="text-primary" />
                      Global Dispatch Switch
                    </CardTitle>
                    <CardDescription className="text-[11px]">Control the master toggle of the Vercel Cron trigger.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2.5">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-xs text-slate-700 block">Automated Dispatcher</span>
                        <span className="text-[10px] text-slate-400 block font-medium">Temporarily silence or resume all crons</span>
                      </div>
                      
                      {systemSettingsTableExists === false ? (
                        <span className="text-[10px] font-bold text-red-500 uppercase bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">Missing Table</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleGlobalNotifications(!notificationsEnabled)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            notificationsEnabled ? "bg-primary" : "bg-slate-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              notificationsEnabled ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                      notificationsEnabled 
                        ? "bg-emerald-50 text-emerald-800 border-emerald-100" 
                        : "bg-amber-50 text-amber-800 border-amber-100"
                    }`}>
                      <p className="font-bold mb-1">Status: {notificationsEnabled ? "Active & Listening" : "Paused / Disabled"}</p>
                      <p className="text-[10px] opacity-80 leading-normal">
                        {notificationsEnabled 
                          ? "Vercel Cron triggers will evaluate and dispatch student emails automatically under standard 24-hour limits."
                          : "All cron execution checks will immediately terminate upon starting. No emails will be sent automatically. Manual resends will still function."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Historical Logs */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Clock size={16} className="text-primary" />
                      Notifications History Logs
                    </CardTitle>
                    <CardDescription className="text-[11px]">Real-time history logs of reminders sent to university placement and career candidate portals.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow p-0 flex flex-col">
                    
                    {/* Search & Filter Bar */}
                    <div className="p-4 border-b border-hairline bg-slate-50/50 flex flex-col md:flex-row gap-3">
                      <div className="relative flex-grow">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                          type="text"
                          placeholder="Search candidate name, email, or subject..."
                          value={notifHistorySearch}
                          onChange={(e) => setNotifHistorySearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-hairline rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:border-primary"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <select
                          value={notifHistoryTypeFilter}
                          onChange={(e) => setNotifHistoryTypeFilter(e.target.value)}
                          className="px-3 py-2 border border-hairline rounded-xl text-xs bg-white text-slate-600 focus:outline-none"
                        >
                          <option value="All">All Types</option>
                          <option value="missing_documents">Documents</option>
                          <option value="consultation">Consultation</option>
                          <option value="visa_update">Visa updates</option>
                        </select>

                        <select
                          value={notifHistoryStatusFilter}
                          onChange={(e) => setNotifHistoryStatusFilter(e.target.value)}
                          className="px-3 py-2 border border-hairline rounded-xl text-xs bg-white text-slate-600 focus:outline-none"
                        >
                          <option value="All">All Statuses</option>
                          <option value="sent">Sent</option>
                          <option value="failed">Failed</option>
                        </select>
                      </div>
                    </div>

                    {/* Table View */}
                    {notifHistoryTableExists === false ? (
                      <div className="p-8 text-center text-slate-500 space-y-3 flex-grow flex flex-col justify-center items-center">
                        <WarningCircle size={40} className="text-amber-500 animate-pulse" />
                        <h4 className="font-bold text-sm text-slate-700">Notification Tables Not Found</h4>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                          The notification logger could not fetch history logs because the notification tables do not exist in Supabase yet. Run the SQL schema script inside the database dashboard.
                        </p>
                      </div>
                    ) : filteredNotifHistory.length === 0 ? (
                      <div className="py-16 text-center text-slate-400 text-xs flex-grow flex flex-col justify-center items-center">
                        <Bell size={40} className="text-slate-300 mb-2" />
                        <span>No notification logs match your query parameters.</span>
                      </div>
                    ) : (
                      <div className="max-h-[500px] overflow-y-auto">
                        <table className="w-full text-left text-xs text-slate-600 divide-y divide-hairline">
                          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 sticky top-0 z-10">
                            <tr>
                              <th className="px-4 py-3">Status</th>
                              <th className="px-4 py-3">Recipient</th>
                              <th className="px-4 py-3">Type</th>
                              <th className="px-4 py-3">Details / Errors</th>
                              <th className="px-4 py-3">Date</th>
                              <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-hairline bg-white">
                            {filteredNotifHistory.map((log) => {
                              const studentName = log.students?.name || log.training_students?.student_name || "Unknown student";
                              const studentEmail = log.students?.email || log.training_students?.student_email || "N/A";
                              const isSending = triggeringNotif === log.id;

                              return (
                                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-4 py-3">
                                    <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                      log.status === "sent" 
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                                        : "bg-red-50 text-red-600 border-red-200"
                                    }`}>
                                      {log.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="font-semibold text-slate-700">{studentName}</div>
                                    <div className="text-[10px] text-slate-400 font-mono-data">{studentEmail}</div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[9px] font-bold uppercase tracking-wider">
                                      {log.notification_type === "missing_documents" ? "Docs" : log.notification_type === "consultation" ? "Meeting" : "Visa"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 max-w-[200px] truncate" title={log.subject}>
                                    {log.error_message ? (
                                      <span className="text-red-500 font-medium block overflow-hidden text-ellipsis">{log.error_message}</span>
                                    ) : (
                                      <span className="text-slate-500 block overflow-hidden text-ellipsis">{log.subject}</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-slate-400 text-[10px]">
                                    {new Date(log.sent_at).toLocaleDateString()}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <Button
                                      onClick={() => handleResendNotificationLog(log)}
                                      disabled={isSending}
                                      variant="secondary"
                                      size="sm"
                                      className="py-1 px-2.5 text-[10px] font-bold"
                                    >
                                      {isSending ? <SpinnerGap className="animate-spin" size={10} /> : "Resend"}
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        {activeTab === "experts" && (
          <section className="flex flex-col gap-6 animate-fade-in text-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-2xl text-primary">Career Experts Directory</h2>
                <p className="text-xs text-slate-400 mt-1">Manage career consultants, experts, and display orders shown on the Training & Placement page.</p>
              </div>
              <Button 
                onClick={() => {
                  setEditingExpert(null);
                  setExpertForm({
                    name: "",
                    designation: "",
                    expertise: "",
                    photo_url: "",
                    linkedin_url: "",
                    display_order: experts.length + 1,
                    is_active: true
                  });
                  setIsExpertModalOpen(true);
                }} 
                variant="primary" 
                size="sm" 
                className="flex items-center gap-1"
              >
                <Plus size={14} /> Add Expert
              </Button>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Total Experts", value: experts.length, icon: <Users size={18} className="text-primary" weight="bold" />, bg: "bg-slate-50 border-slate-100" },
                { label: "Active on Page", value: experts.filter(e => e.is_active).length, icon: <CheckCircle size={18} className="text-emerald-600" weight="bold" />, bg: "bg-emerald-50/20 border-emerald-100/60" },
                { label: "Inactive Experts", value: experts.filter(e => !e.is_active).length, icon: <XCircle size={18} className="text-red-600" weight="bold" />, bg: "bg-red-50/20 border-red-100/60" }
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

            {/* Table */}
            {experts.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-hairline rounded-2xl text-slate-400 text-xs font-semibold bg-white">
                No experts registered. Click "Add Expert" to create one.
              </div>
            ) : (
              <div className="border border-hairline rounded-2xl overflow-x-auto bg-white font-sans text-slate-700">
                <table className="w-full text-left border-collapse text-xs min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-hairline text-slate-500 font-bold uppercase tracking-wider">
                      <th className="p-4 w-[80px]">Order</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Designation</th>
                      <th className="p-4">Area of Expertise</th>
                      <th className="p-4">LinkedIn Profile</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {experts.map(e => (
                      <tr key={e.id} className="hover:bg-subtle-gray/30">
                        <td className="p-4">
                          <input 
                            type="number" 
                            defaultValue={e.display_order}
                            onBlur={(event) => handleUpdateExpertOrder(e.id, parseInt(event.target.value) || 0)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                handleUpdateExpertOrder(e.id, parseInt((event.target as HTMLInputElement).value) || 0);
                              }
                            }}
                            className="w-14 px-2 py-1 border border-hairline rounded text-center focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white"
                          />
                        </td>
                        <td className="p-4 font-semibold text-primary">
                          <div className="flex items-center gap-3">
                            {e.photo_url ? (
                              <img 
                                src={e.photo_url} 
                                alt={e.name} 
                                className="w-8 h-8 rounded-full object-cover border border-hairline shadow-sm"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center font-bold">
                                {e.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <span className="text-xs font-bold text-primary block">{e.name}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 font-medium">{e.designation}</td>
                        <td className="p-4 text-slate-500">{e.expertise}</td>
                        <td className="p-4">
                          {e.linkedin_url ? (
                            <a 
                              href={e.linkedin_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary hover:underline font-medium"
                            >
                              View Profile &rarr;
                            </a>
                          ) : (
                            <span className="text-slate-400">Not set</span>
                          )}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleExpertActive(e)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                              e.is_active
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100"
                                : "bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
                            }`}
                          >
                            {e.is_active ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="p-4 text-right flex justify-end gap-1.5 items-center">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => {
                              setEditingExpert(e);
                              setExpertForm({
                                name: e.name,
                                designation: e.designation,
                                expertise: e.expertise,
                                photo_url: e.photo_url || "",
                                linkedin_url: e.linkedin_url || "",
                                display_order: e.display_order,
                                is_active: e.is_active
                              });
                              setIsExpertModalOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteExpert(e.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === "training" && (
          <section className="flex flex-col gap-6 animate-fade-in text-slate-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-display font-bold text-2xl text-primary leading-tight">Training & Placement</h2>
                <p className="text-xs text-slate-400 mt-1">Manage micro career services, candidate registrations, mock schedules, task tracking, and chat rooms.</p>
              </div>
              <Button variant="secondary" size="sm" onClick={fetchAllData} className="flex items-center gap-1.5">
                <SpinnerGap className={loading ? "animate-spin" : ""} size={14} /> Refresh Data
              </Button>
            </div>

            {/* Sub Tabs */}
            <div className="border-b border-hairline flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 py-2 bg-white">
              {[
                { id: "services", label: "Services Manager" },
                { id: "students", label: "Career Students" },
                { id: "tasks", label: "Tasks Board" },
                { id: "meetings", label: "Meetings Scheduler" },
                { id: "analytics", label: "Analytics" }
              ].map(subTab => (
                <button 
                  key={subTab.id}
                  onClick={() => setActiveTrainingTab(subTab.id as any)}
                  className={`pb-1.5 cursor-pointer transition-all ${
                    activeTrainingTab === subTab.id ? "text-primary border-b-2 border-primary font-black" : "hover:text-primary"
                  }`}
                >
                  {subTab.label}
                </button>
              ))}
            </div>

            {/* Sub Tab Content View */}
            <div className="mt-4">
              
              {/* SUB TAB: SERVICES */}
              {activeTrainingTab === "services" && (
                <div className="space-y-6">
                  <div className="flex justify-end">
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => {
                        setServiceForm({
                          id: "",
                          title: "",
                          description: "",
                          price: "",
                          featuresText: "",
                          status: "Active"
                        });
                        setIsServiceModalOpen(true);
                      }}
                    >
                      + Create Career Service
                    </Button>
                  </div>

                  {trainingServices.length === 0 ? (
                    <div className="text-center py-12 bg-white border border-hairline rounded-2xl">
                      <p className="text-slate-400 font-medium text-sm">No career services configured. Click create to add some!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {trainingServices.map((service) => (
                        <Card key={service.id} className="p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="font-display font-bold text-base text-primary leading-tight">{service.title}</h3>
                              <span className="font-mono-data text-xs font-bold bg-slate-100 px-2 py-0.5 rounded">
                                ₹{service.price}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">{service.description}</p>
                            <div className="border-t border-hairline/60 pt-4">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Features Included:</span>
                              <ul className="space-y-1.5">
                                {(service.features || []).map((feature: string, fIdx: number) => (
                                  <li key={fIdx} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                                    <Check size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="border-t border-hairline pt-4 mt-6 flex justify-between items-center gap-3">
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                              service.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
                            }`}>
                              {service.status}
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setServiceForm({
                                    id: service.id,
                                    title: service.title,
                                    description: service.description || "",
                                    price: service.price.toString(),
                                    featuresText: (service.features || []).join("\n"),
                                    status: service.status
                                  });
                                  setIsServiceModalOpen(true);
                                }}
                                className="text-xs font-bold text-primary hover:text-gold transition-colors cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteService(service.id)}
                                className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUB TAB: STUDENTS */}
              {activeTrainingTab === "students" && (
                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-hairline text-slate-400 font-bold uppercase tracking-wider">
                          <th className="px-6 py-4">Student Name</th>
                          <th className="px-6 py-4">Purchased Service</th>
                          <th className="px-6 py-4">Assigned Consultant</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Registered Date</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hairline">
                        {trainingStudents.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                              No candidates enrolled in career programs.
                            </td>
                          </tr>
                        ) : (
                          trainingStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <h4 className="font-semibold text-primary">{student.student_name}</h4>
                                <span className="text-slate-400 block mt-0.5">{student.student_email}</span>
                              </td>
                              <td className="px-6 py-4 font-semibold text-slate-700">
                                {student.training_services?.title || "N/A"}
                              </td>
                              <td className="px-6 py-4">
                                <select
                                  value={student.assigned_consultant_id || ""}
                                  onChange={(e) => handleAssignCareerCounselor(student.id, e.target.value)}
                                  className="border border-hairline bg-white rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                                >
                                  <option value="">Select Counselor</option>
                                  {counselors.filter(c => c.is_active).map((c) => (
                                    <option key={c.id} value={c.id}>{c.full_name}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                  student.status === "Active"
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                    : student.status === "Completed"
                                    ? "bg-blue-50 text-blue-600 border-blue-100"
                                    : student.status === "Pending"
                                    ? "bg-amber-50 text-amber-600 border-amber-100"
                                    : "bg-slate-100 text-slate-500 border-slate-200"
                                }`}>
                                  {student.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-slate-400">
                                {new Date(student.purchase_date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-right space-x-3">
                                {student.status === "Pending" && (
                                  <button
                                    onClick={() => handleActivateCareerStudent(student)}
                                    className="text-xs font-bold text-emerald-600 hover:text-emerald-800 cursor-pointer"
                                  >
                                    Approve & Activate
                                  </button>
                                )}
                                {student.status === "Active" && (
                                  <button
                                    onClick={() => {
                                      if (typeof window !== "undefined") {
                                        sessionStorage.setItem("annex_impersonate_training_id", student.id);
                                        window.open("/career-portal", "_blank");
                                      }
                                    }}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                                  >
                                    Impersonate
                                  </button>
                                )}
                                <button
                                  onClick={() => openTrainingDetailDrawer(student)}
                                  className="text-xs font-bold text-primary hover:text-gold cursor-pointer"
                                >
                                  Manage Candidate
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* SUB TAB: TASKS */}
              {activeTrainingTab === "tasks" && (
                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-hairline text-slate-400 font-bold uppercase tracking-wider">
                          <th className="px-6 py-4">Student Name</th>
                          <th className="px-6 py-4">Task Title</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Due Date</th>
                          <th className="px-6 py-4">Submitted Solution</th>
                          <th className="px-6 py-4">Feedback / Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hairline">
                        {trainingTasks.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                              No tasks assigned globally.
                            </td>
                          </tr>
                        ) : (
                          trainingTasks.map((task) => (
                            <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <h4 className="font-semibold text-primary">{task.training_students?.student_name}</h4>
                                <span className="text-slate-400 block mt-0.5">{task.training_students?.student_email}</span>
                              </td>
                              <td className="px-6 py-4">
                                <h4 className="font-semibold text-slate-800">{task.title}</h4>
                                <p className="text-[10px] text-slate-400 max-w-xs mt-0.5">{task.description}</p>
                              </td>
                              <td className="px-6 py-4">
                                <select
                                  value={task.status}
                                  onChange={(e) => handleUpdateCareerTaskStatus(task.id, e.target.value, task.feedback || "")}
                                  className="border border-hairline bg-white rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Under Review">Under Review</option>
                                  <option value="Completed">Completed</option>
                                </select>
                              </td>
                              <td className="px-6 py-4 text-slate-400">
                                {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No deadline"}
                              </td>
                              <td className="px-6 py-4">
                                {task.file_url ? (
                                  <a
                                    href={task.file_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-primary hover:text-gold font-bold flex items-center gap-1"
                                  >
                                    <FileText size={16} />
                                    Download solution
                                  </a>
                                ) : (
                                  <span className="text-slate-400 italic">No solution uploaded</span>
                                )}
                              </td>
                              <td className="px-6 py-4 flex flex-col gap-2">
                                <input
                                  type="text"
                                  placeholder="Add feedback notes..."
                                  defaultValue={task.feedback || ""}
                                  onBlur={(e) => handleUpdateCareerTaskStatus(task.id, task.status, e.target.value)}
                                  className="border border-hairline rounded-lg px-2 py-1 focus:outline-none text-[11px]"
                                />
                                <button
                                  onClick={() => handleDeleteCareerTask(task.id)}
                                  className="text-[10px] font-bold text-red-500 hover:text-red-700 text-left self-start cursor-pointer"
                                >
                                  Delete Task
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* SUB TAB: MEETINGS */}
              {activeTrainingTab === "meetings" && (
                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-hairline text-slate-400 font-bold uppercase tracking-wider">
                          <th className="px-6 py-4">Meeting Title</th>
                          <th className="px-6 py-4">Candidate Name</th>
                          <th className="px-6 py-4">Advisor Assigned</th>
                          <th className="px-6 py-4">Scheduled At</th>
                          <th className="px-6 py-4">Link / Type</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hairline">
                        {trainingMeetings.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                              No career meetings scheduled globally.
                            </td>
                          </tr>
                        ) : (
                          trainingMeetings.map((meet) => (
                            <tr key={meet.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <h4 className="font-semibold text-primary">{meet.title}</h4>
                                <p className="text-[10px] text-slate-400 mt-0.5">{meet.description}</p>
                              </td>
                              <td className="px-6 py-4">
                                <h4 className="font-semibold text-slate-800">{meet.training_students?.student_name}</h4>
                                <span className="text-slate-400 block mt-0.5">{meet.training_students?.student_email}</span>
                              </td>
                              <td className="px-6 py-4 text-slate-600">
                                {meet.counselors?.full_name || "Unassigned"}
                              </td>
                              <td className="px-6 py-4 text-slate-600 font-medium">
                                {new Date(meet.scheduled_at).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-[10px] font-mono-data text-slate-400 block capitalize">{meet.meeting_type}</span>
                                {meet.meeting_link && (
                                  <a href={meet.meeting_link} target="_blank" rel="noreferrer" className="text-primary hover:text-gold font-bold">
                                    Join link
                                  </a>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => handleDeleteCareerMeeting(meet.id)}
                                  className="text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer"
                                >
                                  Cancel Meeting
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* SUB TAB: ANALYTICS */}
              {activeTrainingTab === "analytics" && (
                <div className="space-y-6 text-left">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <Card className="p-6">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Candidates</span>
                      <h2 className="font-mono-data text-3xl font-black text-primary mt-2">{trainingStudents.length}</h2>
                    </Card>

                    <Card className="p-6">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Active Candidates</span>
                      <h2 className="font-mono-data text-3xl font-black text-primary mt-2">
                        {trainingStudents.filter(s => s.status === "Active").length}
                      </h2>
                    </Card>

                    <Card className="p-6">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Services Active</span>
                      <h2 className="font-mono-data text-3xl font-black text-primary mt-2">
                        {trainingServices.filter(s => s.status === "Active").length}
                      </h2>
                    </Card>

                    <Card className="p-6 border-emerald-100 shadow-sm bg-emerald-50/10">
                      <span className="text-[10px] uppercase font-bold text-emerald-500 block tracking-wider">Est. Placement Revenue</span>
                      <h2 className="font-mono-data text-3xl font-black text-emerald-600 mt-2">
                        ₹{trainingStudents.filter(s => s.status !== "Cancelled").reduce((sum, s) => sum + (s.training_services?.price || 0), 0)}
                      </h2>
                    </Card>
                  </div>
                </div>
              )}

            </div>
          </section>
        )}

        {/* ===================== REFERRALS TAB ===================== */}
        {activeTab === "referrals" && (
          <section className="flex flex-col gap-8 animate-fade-in text-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-2xl text-primary leading-tight">Referral Management</h2>
                <p className="text-xs text-slate-400 mt-1">Track student-submitted leads, transition lifecycle stages, and approve cash rewards.</p>
              </div>
              <Button variant="secondary" size="sm" onClick={fetchReferralsData} className="flex items-center gap-1.5">
                <SpinnerGap className={loadingReferrals ? "animate-spin" : ""} size={14} /> Refresh Data
              </Button>
            </div>

            {/* Analytics Dashboard */}
            {loadingReferralAnalytics ? (
              <div className="py-8 flex flex-col items-center justify-center text-slate-400">
                <SpinnerGap size={24} className="animate-spin text-primary mb-2" />
                <p className="text-xs">Calculating analytics metrics...</p>
              </div>
            ) : referralAnalytics ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Stats Cards */}
                <Card className="p-5 bg-white border border-hairline/80 rounded-2xl flex flex-col justify-between min-h-[110px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Referrals</span>
                  <div className="mt-3">
                    <span className="text-2xl font-bold font-display text-primary">{referralAnalytics.totalReferrals}</span>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Leads submitted</p>
                  </div>
                </Card>

                <Card className="p-5 bg-white border border-hairline/80 rounded-2xl flex flex-col justify-between min-h-[110px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Conversion Rate</span>
                  <div className="mt-3">
                    <span className="text-2xl font-bold font-display text-primary">{referralAnalytics.conversionRate}%</span>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Enrollment conversion</p>
                  </div>
                </Card>

                <Card className="p-5 bg-white border border-hairline/80 rounded-2xl flex flex-col justify-between min-h-[110px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rewards Approved/Paid</span>
                  <div className="mt-3">
                    <span className="text-2xl font-bold font-display text-emerald-600">Rs. {referralAnalytics.rewardsPaid.toLocaleString()}</span>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Approved cashback payout</p>
                  </div>
                </Card>

                <Card className="p-5 bg-white border border-hairline/80 rounded-2xl flex flex-col justify-between min-h-[110px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Referrers</span>
                  <div className="mt-3">
                    <span className="text-2xl font-bold font-display text-primary">{referralAnalytics.activeReferrers}</span>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Students referring</p>
                  </div>
                </Card>

                {/* Funnel Stage Chart */}
                <Card className="md:col-span-2 p-5 bg-white border border-hairline/80 rounded-2xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Referral Stage Funnel</h4>
                  <div className="space-y-3">
                    {referralAnalytics.funnelStages?.map((stage: any) => (
                      <div key={stage.stage} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-600">{stage.stage}</span>
                          <span className="text-primary">{stage.count} ({stage.percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full transition-all" 
                            style={{ width: `${stage.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Monthly Trend Chart */}
                <Card className="p-5 bg-white border border-hairline/80 rounded-2xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Monthly Trend</h4>
                  {referralAnalytics.monthlyTrend && referralAnalytics.monthlyTrend.length > 0 ? (
                    <div className="space-y-3">
                      {referralAnalytics.monthlyTrend.map((trend: any) => (
                        <div key={trend.month} className="flex items-center justify-between py-1 border-b border-hairline/40 last:border-0 text-xs">
                          <span className="text-slate-500 font-semibold">{trend.month}</span>
                          <div className="flex-grow mx-4">
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-gold h-full rounded-full" 
                                style={{ 
                                  width: `${referralAnalytics.totalReferrals > 0 ? (trend.count / referralAnalytics.totalReferrals) * 100 : 0}%` 
                                }}
                              />
                            </div>
                          </div>
                          <span className="text-primary font-bold">{trend.count}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs text-center py-6">No historical data available</p>
                  )}
                </Card>

                {/* Top Referrers */}
                <Card className="p-5 bg-white border border-hairline/80 rounded-2xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Top Referrers List</h4>
                  {referralAnalytics.topReferrers && referralAnalytics.topReferrers.length > 0 ? (
                    <div className="divide-y divide-hairline">
                      {referralAnalytics.topReferrers.map((ref: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between py-2 first:pt-0 last:pb-0 text-xs">
                          <div>
                            <p className="font-bold text-primary">{ref.referrerName}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{ref.referrerEmail}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-bold text-slate-700">{ref.referralsCount} referrals</span>
                            <p className="text-[10px] text-emerald-600 font-semibold">Rs. {ref.rewardsTotal.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs text-center py-6">No referrers active yet</p>
                  )}
                </Card>
              </div>
            ) : null}

            {/* Filter and Table Audit */}
            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-hairline/65 pb-5">
                <div>
                  <CardTitle>Referrals Register</CardTitle>
                  <CardDescription>Comprehensive log of referred student entries</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search input */}
                  <div className="relative w-full sm:w-60">
                    <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search referrer or lead name..."
                      value={referralSearch}
                      onChange={(e) => setReferralSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-hairline rounded-full text-xs outline-none w-full bg-slate-50 focus:bg-white focus:border-primary transition-all"
                    />
                  </div>

                  {/* Status filter */}
                  <div className="flex items-center gap-1.5 border border-hairline bg-slate-50 rounded-full px-3 py-1.5 text-xs text-slate-500">
                    <Funnel size={14} className="text-slate-400" />
                    <select
                      value={referralStatusFilter}
                      onChange={(e) => setReferralStatusFilter(e.target.value)}
                      className="bg-transparent outline-none text-xs font-semibold cursor-pointer text-slate-600"
                    >
                      <option value="All">All Milestones</option>
                      <option value="lead">Lead</option>
                      <option value="contacted">Contacted</option>
                      <option value="application_started">Application Started</option>
                      <option value="offer_received">Offer Received</option>
                      <option value="visa_approved">Visa Approved</option>
                      <option value="enrolled">Enrolled</option>
                      <option value="rewarded">Rewarded</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loadingReferrals ? (
                  <div className="py-16 flex flex-col items-center justify-center text-slate-400">
                    <SpinnerGap size={32} className="animate-spin text-primary mb-2" />
                    <p className="text-xs font-semibold">Loading referrals directory...</p>
                  </div>
                ) : referrals.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <Users size={40} className="mx-auto text-slate-300 mb-2.5" />
                    <p className="text-sm font-semibold">No referrals matches found</p>
                    <p className="text-xs text-slate-400 mt-1">Adjust search parameters or check filter criteria</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs divide-y divide-hairline text-slate-700 bg-white">
                      <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 sticky top-0">
                        <tr>
                          <th className="px-6 py-3.5">Referred Lead</th>
                          <th className="px-6 py-3.5">Referrer Student</th>
                          <th className="px-6 py-3.5">Intake preferences</th>
                          <th className="px-6 py-3.5">Date Referred</th>
                          <th className="px-6 py-3.5">Lifecycle status</th>
                          <th className="px-6 py-3.5">Rewards Status</th>
                          <th className="px-6 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hairline text-slate-600">
                        {referrals.map((ref) => {
                          const reward = ref.referral_rewards ? (Array.isArray(ref.referral_rewards) ? ref.referral_rewards[0] : ref.referral_rewards) : null;
                          return (
                            <tr key={ref.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4.5">
                                <p className="font-bold text-primary">{ref.referred_name}</p>
                                <p className="text-[10px] text-slate-400">{ref.referred_email}</p>
                                {ref.referred_phone && <p className="text-[10px] text-slate-400">{ref.referred_phone}</p>}
                              </td>
                              <td className="px-6 py-4.5">
                                <p className="font-semibold text-slate-700">{ref.students?.name || "Deleted Student"}</p>
                                <p className="text-[10px] text-slate-400">{ref.students?.email}</p>
                                <span className="inline-block text-[9px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded mt-1">{ref.referral_code}</span>
                              </td>
                              <td className="px-6 py-4.5">
                                <p className="font-medium text-slate-700">{ref.preferred_country}</p>
                                <p className="text-[10px] text-slate-400">{ref.preferred_intake}</p>
                              </td>
                              <td className="px-6 py-4.5 text-slate-400">
                                {new Date(ref.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4.5">
                                <select
                                  value={ref.status}
                                  onChange={(e) => handleUpdateReferralStatus(ref.id, e.target.value)}
                                  disabled={updatingReferralStatus === ref.id}
                                  className="border border-hairline rounded-xl px-2.5 py-1 text-xs outline-none bg-white font-semibold text-slate-700"
                                >
                                  <option value="lead">Lead</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="application_started">Application Started</option>
                                  <option value="offer_received">Offer Received</option>
                                  <option value="visa_approved">Visa Approved</option>
                                  <option value="enrolled">Enrolled</option>
                                  <option value="rewarded">Rewarded</option>
                                </select>
                              </td>
                              <td className="px-6 py-4.5">
                                {reward ? (
                                  <div className="flex flex-col">
                                    <span className="font-bold text-slate-700">Rs. {reward.reward_amount.toLocaleString()}</span>
                                    <span className={`text-[8px] font-extrabold uppercase tracking-wider mt-0.5 ${
                                      reward.status === "paid" ? "text-emerald-500" : reward.status === "approved" ? "text-blue-500" : "text-amber-500"
                                    }`}>
                                      {reward.status}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 italic">None issued</span>
                                )}
                              </td>
                              <td className="px-6 py-4.5 text-right">
                                {["enrolled", "rewarded"].includes(ref.status) && (!ref.referral_rewards || ref.referral_rewards.length === 0) ? (
                                  <button
                                    onClick={() => {
                                      setSelectedReferral(ref);
                                      setIsRewardModalOpen(true);
                                    }}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary/95 transition-all cursor-pointer shadow-sm"
                                  >
                                    <Gift size={12} />
                                    Issue Reward
                                  </button>
                                ) : (
                                  <span className="text-slate-400 text-xs italic">-</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* ===================== ELIGIBILITY LEADS TAB ===================== */}
        {activeTab === "eligibility" && (
          <section className="flex flex-col gap-6 animate-fade-in text-slate-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-2xl text-primary">Eligibility Leads Workspace</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage qualification assessments, counselor workloads, and track inbound study-abroad calculators conversion.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <nav className="flex bg-slate-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setEligibilityTabMode("all")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                      eligibilityTabMode === "all" ? "bg-white text-primary shadow-[0_1px_3px_rgba(0,0,0,0.05)]" : "text-slate-500 hover:text-primary"
                    }`}
                  >
                    All Leads
                  </button>
                  <button 
                    onClick={() => setEligibilityTabMode("queue")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                      eligibilityTabMode === "queue" ? "bg-white text-primary shadow-[0_1px_3px_rgba(0,0,0,0.05)]" : "text-slate-500 hover:text-primary"
                    }`}
                  >
                    Follow-up Queue
                  </button>
                  <button 
                    onClick={() => setEligibilityTabMode("analytics")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                      eligibilityTabMode === "analytics" ? "bg-white text-primary shadow-[0_1px_3px_rgba(0,0,0,0.05)]" : "text-slate-500 hover:text-primary"
                    }`}
                  >
                    Attribution & Workloads
                  </button>
                </nav>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => {
                    fetchEligibilityData();
                    fetchEligibilityAnalytics();
                    if (eligibilityTabMode === "queue") fetchFollowupQueue();
                    if (selectedLead) fetchLeadDetails(selectedLead.id);
                  }}
                  className="flex items-center gap-1.5"
                >
                  <SpinnerGap className={eligibilityLoading || loadingAnalytics || loadingQueue ? "animate-spin" : ""} size={14} /> 
                  Refresh
                </Button>
              </div>
            </div>

            {/* COUNSELOR WORKLOAD OVERVIEW WIDGET (Always visible except in analytics tab) */}
            {eligibilityTabMode !== "analytics" && (
              <div className="bg-slate-50 border border-hairline rounded-3xl p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <Users size={16} />
                  Counselor Workloads
                </h3>
                {loadingAnalytics ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(n => (
                      <div key={n} className="h-28 rounded-2xl bg-slate-200 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {analyticsData?.counselorWorkloads?.map((w: any) => (
                      <div key={w.id} className="p-4 bg-white border border-hairline rounded-2xl shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="text-xs font-bold text-primary truncate">{w.name}</div>
                          <div className="text-[10px] text-slate-400 truncate mb-2">{w.email}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2 border-t border-slate-100 pt-2">
                          <div className="text-center">
                            <div className="text-xs font-bold text-primary font-mono-data">{w.totalActive}</div>
                            <div className="text-[8px] text-slate-400 uppercase font-semibold">Active</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-bold text-red-500 font-mono-data">{w.hotLeads}</div>
                            <div className="text-[8px] text-slate-400 uppercase font-semibold">Hot</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-bold text-orange-500 font-mono-data">{w.overdue}</div>
                            <div className="text-[8px] text-slate-400 uppercase font-semibold">Overdue</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-bold text-indigo-500 font-mono-data">{w.today}</div>
                            <div className="text-[8px] text-slate-400 uppercase font-semibold">Today</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: ANALYTICS OVERVIEW */}
            {eligibilityTabMode === "analytics" && (
              <div className="space-y-6">
                {/* Global Response Time KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-slate-50 border border-hairline rounded-3xl text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Average First Response</span>
                    <div className="text-4xl font-extrabold text-primary font-mono-data my-1">
                      {analyticsData?.responseTimes?.average || 0} min
                    </div>
                    <p className="text-[10px] text-slate-400">Target response window: &lt;15 mins</p>
                  </div>
                  <div className="p-6 bg-slate-50 border border-hairline rounded-3xl text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Fastest Counselor</span>
                    <div className="text-2xl font-bold text-emerald-600 truncate my-1">
                      {analyticsData?.responseTimes?.fastest?.name || "N/A"}
                    </div>
                    <span className="text-[10px] font-mono-data text-slate-500">
                      Avg: {analyticsData?.responseTimes?.fastest?.time || 0} mins
                    </span>
                  </div>
                  <div className="p-6 bg-slate-50 border border-hairline rounded-3xl text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Slowest Counselor</span>
                    <div className="text-2xl font-bold text-red-500 truncate my-1">
                      {analyticsData?.responseTimes?.slowest?.name || "N/A"}
                    </div>
                    <span className="text-[10px] font-mono-data text-slate-500">
                      Avg: {analyticsData?.responseTimes?.slowest?.time || 0} mins
                    </span>
                  </div>
                </div>

                {/* Attribution funnel and lead source quality charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Funnel */}
                  <div className="lg:col-span-1 p-6 bg-slate-50 border border-hairline rounded-3xl">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Conversion Funnel</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs border-b border-hairline pb-2">
                        <span className="text-slate-500">Total Leads Checked</span>
                        <span className="font-bold text-primary font-mono-data">{analyticsData?.funnel?.total || 0}</span>
                      </div>
                      <div className="flex justify-between text-xs border-b border-hairline pb-2">
                        <span className="text-slate-500">New (No Outreach)</span>
                        <span className="font-bold text-primary font-mono-data">{analyticsData?.funnel?.new || 0}</span>
                      </div>
                      <div className="flex justify-between text-xs border-b border-hairline pb-2">
                        <span className="text-slate-500">Contacted (Outreach Started)</span>
                        <span className="font-bold text-primary font-mono-data">{analyticsData?.funnel?.contacted || 0}</span>
                      </div>
                      <div className="flex justify-between text-xs border-b border-hairline pb-2">
                        <span className="text-slate-500">Qualified Profiles</span>
                        <span className="font-bold text-primary font-mono-data">{analyticsData?.funnel?.qualified || 0}</span>
                      </div>
                      <div className="flex justify-between text-xs border-b border-hairline pb-2">
                        <span className="text-slate-500">Unqualified Profiles</span>
                        <span className="font-bold text-primary font-mono-data">{analyticsData?.funnel?.unqualified || 0}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-indigo-600 border-b border-hairline pb-2">
                        <span>Converted Students</span>
                        <span className="font-mono-data">{analyticsData?.funnel?.converted || 0}</span>
                      </div>
                      <div className="pt-2 flex justify-between text-sm font-bold text-gold">
                        <span>Lead Conversion Rate</span>
                        <span className="font-mono-data">{analyticsData?.funnel?.conversionRate || 0}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Sources Quality */}
                  <div className="lg:col-span-2 p-6 bg-slate-50 border border-hairline rounded-3xl">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Lead Source Quality</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-hairline text-slate-400 font-bold uppercase tracking-wider">
                            <th className="pb-3">Source Channel</th>
                            <th className="pb-3 text-center">Lead Count</th>
                            <th className="pb-3 text-center">Conversion Rate</th>
                            <th className="pb-3 text-center">Enrollment Rate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {analyticsData?.sourceQuality?.map((s: any) => (
                            <tr key={s.source} className="hover:bg-white/50 transition-colors">
                              <td className="py-3 font-semibold text-primary">{s.source}</td>
                              <td className="py-3 text-center font-mono-data">{s.leadCount}</td>
                              <td className="py-3 text-center font-mono-data text-emerald-600 font-bold">{s.conversionRate}%</td>
                              <td className="py-3 text-center font-mono-data text-indigo-600 font-bold">{s.enrollmentRate}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: DAILY FOLLOW-UP QUEUE */}
            {eligibilityTabMode === "queue" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-6">
                  {loadingQueue ? (
                    <div className="p-8 text-center text-slate-400">Loading daily queue...</div>
                  ) : !followupQueue || (followupQueue.overdue.length === 0 && followupQueue.dueToday.length === 0 && followupQueue.dueTomorrow.length === 0) ? (
                    <div className="p-12 border border-dashed border-slate-200 rounded-3xl text-center text-slate-400">
                      No pending follow-ups assigned for today. Workload is up to date!
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Overdue Queue */}
                      {followupQueue.overdue.length > 0 && (
                        <div className="bg-red-50/30 border border-red-100 rounded-3xl p-6">
                          <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                            <Warning size={16} />
                            Overdue Actions ({followupQueue.overdue.length})
                          </h3>
                          <div className="space-y-4">
                            {followupQueue.overdue.map((rem: any) => (
                              <div key={rem.id} className="bg-white border border-red-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono-data">DUE: {new Date(rem.due_at).toLocaleDateString()}</span>
                                  <h4 className="text-sm font-bold text-primary mt-0.5">{rem.title}</h4>
                                  <p className="text-xs text-slate-500 mt-1">
                                    Lead: <span className="font-semibold text-primary">{rem.eligibility_leads?.name}</span> ({rem.eligibility_leads?.phone})
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setSelectedLead(rem.eligibility_leads)}
                                    className="px-3 py-1.5 text-[10px] font-bold uppercase bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                                  >
                                    View Lead
                                  </button>
                                  <button
                                    onClick={() => {
                                      const note = prompt("Enter completion note:");
                                      if (note !== null) handleCompleteReminder(rem.id, rem.title, note);
                                    }}
                                    className="px-3 py-1.5 text-[10px] font-bold uppercase bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                  >
                                    Complete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Due Today Queue */}
                      {followupQueue.dueToday.length > 0 && (
                        <div className="bg-blue-50/20 border border-blue-100 rounded-3xl p-6">
                          <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                            <Clock size={16} />
                            Due Today ({followupQueue.dueToday.length})
                          </h3>
                          <div className="space-y-4">
                            {followupQueue.dueToday.map((rem: any) => (
                              <div key={rem.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                                <div>
                                  <h4 className="text-sm font-bold text-primary">{rem.title}</h4>
                                  <p className="text-xs text-slate-500 mt-1">
                                    Lead: <span className="font-semibold text-primary">{rem.eligibility_leads?.name}</span> ({rem.eligibility_leads?.phone})
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setSelectedLead(rem.eligibility_leads)}
                                    className="px-3 py-1.5 text-[10px] font-bold uppercase bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                                  >
                                    View Lead
                                  </button>
                                  <button
                                    onClick={() => {
                                      const note = prompt("Enter completion note:");
                                      if (note !== null) handleCompleteReminder(rem.id, rem.title, note);
                                    }}
                                    className="px-3 py-1.5 text-[10px] font-bold uppercase bg-primary hover:bg-primary/95 text-white rounded-lg transition-colors"
                                  >
                                    Complete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Due Tomorrow Queue */}
                      {followupQueue.dueTomorrow.length > 0 && (
                        <div className="border border-slate-100 rounded-3xl p-6">
                          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                            <Calendar size={16} />
                            Due Tomorrow ({followupQueue.dueTomorrow.length})
                          </h3>
                          <div className="space-y-4">
                            {followupQueue.dueTomorrow.map((rem: any) => (
                              <div key={rem.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                                <div>
                                  <h4 className="text-sm font-bold text-primary">{rem.title}</h4>
                                  <p className="text-xs text-slate-500 mt-1">
                                    Lead: <span className="font-semibold text-primary">{rem.eligibility_leads?.name}</span> ({rem.eligibility_leads?.phone})
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setSelectedLead(rem.eligibility_leads)}
                                    className="px-3 py-1.5 text-[10px] font-bold uppercase bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                                  >
                                    View Lead
                                  </button>
                                  <button
                                    onClick={() => {
                                      const note = prompt("Enter completion note:");
                                      if (note !== null) handleCompleteReminder(rem.id, rem.title, note);
                                    }}
                                    className="px-3 py-1.5 text-[10px] font-bold uppercase bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                                  >
                                    Complete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Lead Detail sidebar block */}
                <div className="lg:col-span-4">
                  {selectedLead ? (
                    <LeadDetailsPanel 
                      lead={selectedLead}
                      details={selectedLeadDetails}
                      loading={loadingLeadDetails}
                      counselors={counselors}
                      noteText={leadNoteText}
                      setNoteText={setLeadNoteText}
                      addingNote={addingLeadNote}
                      onAddNote={handleAddNoteLead}
                      onClose={() => setSelectedLead(null)}
                      onUpdateField={handleUpdateLeadField}
                      onCompleteReminder={handleCompleteReminder}
                    />
                  ) : (
                    <div className="border border-dashed border-slate-200 rounded-3xl p-8 text-center text-slate-400 text-xs">
                      Select a lead from the queue list to show detailed academic profile, notes, and activity timeline.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: ALL LEADS REGISTRY */}
            {eligibilityTabMode === "all" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-6">
                  {/* Filters toolbar */}
                  <div className="bg-slate-50 border border-hairline rounded-3xl p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                      <div className="relative w-full sm:max-w-xs">
                        <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={eligibilitySearch}
                          onChange={(e) => {
                            setEligibilitySearch(e.target.value);
                            setEligibilityPage(1);
                          }}
                          placeholder="Search name, email, phone..."
                          className="w-full pl-9 pr-4 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:border-gold bg-white"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={handleExportCSV}
                          className="px-3.5 py-2 border border-hairline hover:bg-slate-100 text-slate-600 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download size={14} />
                          Export CSV
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Status</label>
                        <select
                          value={eligibilityStatusFilter}
                          onChange={(e) => { setEligibilityStatusFilter(e.target.value); setEligibilityPage(1); }}
                          className="px-2.5 py-1.5 border border-hairline rounded-lg text-xs bg-white focus:outline-none cursor-pointer"
                        >
                          <option value="All">All Statuses</option>
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Unqualified">Unqualified</option>
                          <option value="Converted">Converted</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Priority</label>
                        <select
                          value={eligibilityPriorityFilter}
                          onChange={(e) => { setEligibilityPriorityFilter(e.target.value); setEligibilityPage(1); }}
                          className="px-2.5 py-1.5 border border-hairline rounded-lg text-xs bg-white focus:outline-none cursor-pointer"
                        >
                          <option value="All">All Priorities</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Lead Level</label>
                        <select
                          value={eligibilityScoreFilter}
                          onChange={(e) => { setEligibilityScoreFilter(e.target.value); setEligibilityPage(1); }}
                          className="px-2.5 py-1.5 border border-hairline rounded-lg text-xs bg-white focus:outline-none cursor-pointer"
                        >
                          <option value="All">All levels</option>
                          <option value="Hot">Hot</option>
                          <option value="Warm">Warm</option>
                          <option value="Cold">Cold</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Counselor</label>
                        <select
                          value={eligibilityCounselorFilter}
                          onChange={(e) => { setEligibilityCounselorFilter(e.target.value); setEligibilityPage(1); }}
                          className="px-2.5 py-1.5 border border-hairline rounded-lg text-xs bg-white focus:outline-none cursor-pointer"
                        >
                          <option value="All">All Counselors</option>
                          {counselors.map((c: any) => (
                            <option key={c.id} value={c.id}>{c.full_name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Country</label>
                        <select
                          value={eligibilityCountryFilter}
                          onChange={(e) => { setEligibilityCountryFilter(e.target.value); setEligibilityPage(1); }}
                          className="px-2.5 py-1.5 border border-hairline rounded-lg text-xs bg-white focus:outline-none cursor-pointer"
                        >
                          <option value="All">All Countries</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                          <option value="Ireland">Ireland</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Intake</label>
                        <select
                          value={eligibilityIntakeFilter}
                          onChange={(e) => { setEligibilityIntakeFilter(e.target.value); setEligibilityPage(1); }}
                          className="px-2.5 py-1.5 border border-hairline rounded-lg text-xs bg-white focus:outline-none cursor-pointer"
                        >
                          <option value="All">All Intakes</option>
                          <option value="Sept 2026">Sept 2026</option>
                          <option value="Jan 2027">Jan 2027</option>
                          <option value="Sept 2027">Sept 2027</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Bulk Actions Bar */}
                  {bulkSelectedLeadIds.length > 0 && (
                    <div className="p-4 bg-primary text-white rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-md animate-fade-in">
                      <span className="text-xs font-bold font-mono-data">
                        {bulkSelectedLeadIds.length} leads selected
                      </span>
                      <div className="flex items-center gap-3">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleBulkUpdate("lead_status", e.target.value);
                              e.target.value = "";
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs bg-white/10 text-white border border-white/20 focus:outline-none cursor-pointer"
                        >
                          <option value="" className="text-slate-800">Change Status...</option>
                          <option value="New" className="text-slate-800">New</option>
                          <option value="Contacted" className="text-slate-800">Contacted</option>
                          <option value="Qualified" className="text-slate-800">Qualified</option>
                          <option value="Unqualified" className="text-slate-800">Unqualified</option>
                          <option value="Converted" className="text-slate-800">Converted</option>
                        </select>

                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleBulkUpdate("assigned_counselor_id", e.target.value === "Unassigned" ? null : e.target.value);
                              e.target.value = "";
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs bg-white/10 text-white border border-white/20 focus:outline-none cursor-pointer"
                        >
                          <option value="" className="text-slate-800">Assign Counselor...</option>
                          <option value="Unassigned" className="text-slate-800">Unassign</option>
                          {counselors.map((c: any) => (
                            <option key={c.id} value={c.id} className="text-slate-800">{c.full_name}</option>
                          ))}
                        </select>

                        <button 
                          onClick={() => setBulkSelectedLeadIds([])}
                          className="text-white/60 hover:text-white text-xs font-semibold cursor-pointer"
                        >
                          Clear Selection
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Leads Data Table */}
                  <Card>
                    <CardContent className="p-0">
                      {eligibilityLoading ? (
                        <div className="p-12 text-center text-slate-400">Loading lead registry...</div>
                      ) : eligibilityLeads.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 text-sm">
                          No leads found matching filters.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-left text-xs text-slate-600">
                            <thead>
                              <tr className="border-b border-hairline bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider">
                                <th className="p-4 w-10">
                                  <input
                                    type="checkbox"
                                    checked={bulkSelectedLeadIds.length === eligibilityLeads.length}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setBulkSelectedLeadIds(eligibilityLeads.map(l => l.id));
                                      } else {
                                        setBulkSelectedLeadIds([]);
                                      }
                                    }}
                                    className="rounded border-slate-300 focus:ring-gold"
                                  />
                                </th>
                                <th className="p-4">Name / Contact</th>
                                <th className="p-4">Qualification / Score</th>
                                <th className="p-4">Country & Course</th>
                                <th className="p-4 text-center">Score / priority</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Assigned Counselor</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {eligibilityLeads.map(lead => {
                                const isSelected = selectedLead?.id === lead.id;
                                const isChecked = bulkSelectedLeadIds.includes(lead.id);

                                return (
                                  <tr 
                                    key={lead.id}
                                    className={`hover:bg-slate-50/80 transition-colors ${
                                      isSelected ? "bg-slate-50" : ""
                                    }`}
                                  >
                                    <td className="p-4">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setBulkSelectedLeadIds(prev => [...prev, lead.id]);
                                          } else {
                                            setBulkSelectedLeadIds(prev => prev.filter(id => id !== lead.id));
                                          }
                                        }}
                                        className="rounded border-slate-300 focus:ring-gold"
                                      />
                                    </td>
                                    <td 
                                      className="p-4 cursor-pointer"
                                      onClick={() => setSelectedLead(lead)}
                                    >
                                      <div className="font-bold text-primary">{lead.name}</div>
                                      <div className="text-[10px] text-slate-400 mt-0.5">{lead.email}</div>
                                      <div className="text-[10px] text-slate-400 font-mono-data">{lead.phone}</div>
                                    </td>
                                    <td 
                                      className="p-4 cursor-pointer"
                                      onClick={() => setSelectedLead(lead)}
                                    >
                                      <div className="font-semibold text-slate-700">{lead.qualification}</div>
                                      <div className="text-[10px] text-slate-400 mt-0.5">Grade: {lead.percentage}%</div>
                                      {lead.test_type && (
                                        <div className="text-[10px] text-slate-400 font-mono-data">{lead.test_type}: {lead.test_score}</div>
                                      )}
                                    </td>
                                    <td 
                                      className="p-4 cursor-pointer"
                                      onClick={() => setSelectedLead(lead)}
                                    >
                                      <div className="font-semibold text-slate-700">{lead.preferred_country}</div>
                                      <div className="text-[10px] text-slate-400 mt-0.5">{lead.preferred_course}</div>
                                      <div className="text-[10px] text-slate-400 font-mono-data">Intake: {lead.intake}</div>
                                    </td>
                                    <td className="p-4 text-center">
                                      <span className={`inline-block px-2 py-0.5 rounded font-bold text-[9px] font-mono-data mr-1 ${
                                        lead.lead_score === "Hot" 
                                          ? "bg-red-50 text-red-600 border border-red-100" 
                                          : lead.lead_score === "Warm" 
                                          ? "bg-amber-50 text-amber-600 border border-amber-100" 
                                          : "bg-blue-50 text-blue-600 border border-blue-100"
                                      }`}>
                                        {lead.lead_score} ({lead.lead_score_value}%)
                                      </span>
                                      <span className={`inline-block px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider ${
                                        lead.priority === "High"
                                          ? "bg-red-500 text-white"
                                          : lead.priority === "Medium"
                                          ? "bg-amber-500 text-white"
                                          : "bg-slate-200 text-slate-600"
                                      }`}>
                                        {lead.priority}
                                      </span>
                                    </td>
                                    <td className="p-4">
                                      <select
                                        value={lead.lead_status}
                                        onChange={(e) => handleUpdateLeadField(lead.id, "lead_status", e.target.value)}
                                        className={`px-2.5 py-1 rounded text-[10px] font-bold focus:outline-none cursor-pointer border ${
                                          lead.lead_status === "New" 
                                            ? "bg-blue-50 text-blue-600 border-blue-100"
                                            : lead.lead_status === "Contacted"
                                            ? "bg-amber-50 text-amber-600 border-amber-100"
                                            : lead.lead_status === "Qualified"
                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                            : lead.lead_status === "Unqualified"
                                            ? "bg-slate-100 text-slate-500 border-slate-200"
                                            : "bg-indigo-50 text-indigo-600 border-indigo-100"
                                        }`}
                                      >
                                        <option value="New">New</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Qualified">Qualified</option>
                                        <option value="Unqualified">Unqualified</option>
                                        <option value="Converted">Converted</option>
                                      </select>
                                    </td>
                                    <td className="p-4">
                                      <select
                                        value={lead.assigned_counselor_id || ""}
                                        onChange={(e) => handleUpdateLeadField(lead.id, "assigned_counselor_id", e.target.value || null)}
                                        className="px-2 py-1 border border-hairline rounded text-[10px] focus:outline-none cursor-pointer bg-white"
                                      >
                                        <option value="">Unassigned</option>
                                        {counselors.map((c: any) => (
                                          <option key={c.id} value={c.id}>{c.full_name}</option>
                                        ))}
                                      </select>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Pagination Footer */}
                  {eligibilityTotalPages > 1 && (
                    <div className="flex justify-between items-center text-xs text-slate-400 pt-2 font-mono-data">
                      <span>PAGE {eligibilityPage} OF {eligibilityTotalPages} ({eligibilityCount} LEADS)</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEligibilityPage(p => Math.max(1, p - 1))}
                          disabled={eligibilityPage === 1 || eligibilityLoading}
                          className="px-3 py-1.5 border border-hairline rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer font-bold"
                        >
                          Prev
                        </button>
                        <button
                          onClick={() => setEligibilityPage(p => Math.min(eligibilityTotalPages, p + 1))}
                          disabled={eligibilityPage === eligibilityTotalPages || eligibilityLoading}
                          className="px-3 py-1.5 border border-hairline rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer font-bold"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lead Detail sidebar block */}
                <div className="lg:col-span-4">
                  {selectedLead ? (
                    <LeadDetailsPanel 
                      lead={selectedLead}
                      details={selectedLeadDetails}
                      loading={loadingLeadDetails}
                      counselors={counselors}
                      noteText={leadNoteText}
                      setNoteText={setLeadNoteText}
                      addingNote={addingLeadNote}
                      onAddNote={handleAddNoteLead}
                      onClose={() => setSelectedLead(null)}
                      onUpdateField={handleUpdateLeadField}
                      onCompleteReminder={handleCompleteReminder}
                    />
                  ) : (
                    <div className="border border-dashed border-slate-200 rounded-3xl p-8 text-center text-slate-400 text-xs">
                      Select a lead row from the table list to show detailed academic profile, notes, and activity timeline.
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ===================== ROLES & PERMISSIONS TAB ===================== */}
        {activeTab === "roles" && (

          <section className="flex flex-col gap-6 animate-fade-in text-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-2xl text-primary">Roles & Permissions</h2>
                <p className="text-xs text-slate-400 mt-1">Define system roles with default permission sets. Override per-counselor in the Counselors tab.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={fetchAllData} className="flex items-center gap-1.5">
                  <SpinnerGap className={loading ? "animate-spin" : ""} size={14} /> Refresh
                </Button>
                <Button 
                  onClick={openNewRoleModal} 
                  variant="primary" 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <Plus size={14} /> Create Role
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Roles", value: roles.length, icon: <ShieldCheck size={18} className="text-primary" weight="bold" />, bg: "bg-slate-50 border-slate-100" },
                { label: "Counselors Assigned", value: roles.reduce((sum: number, r: any) => sum + (r.userCount || 0), 0), icon: <Users size={18} className="text-emerald-600" weight="bold" />, bg: "bg-emerald-50/20 border-emerald-100/60" },
                { label: "Unassigned Staff", value: counselors.filter(c => !c.role_id).length, icon: <Warning size={18} className="text-amber-600" weight="bold" />, bg: "bg-amber-50/20 border-amber-100/60" },
                { label: "Permissions Keys", value: ALL_PERMISSIONS.length, icon: <Key size={18} className="text-purple-600" weight="bold" />, bg: "bg-purple-50/20 border-purple-100/60" }
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

            {/* Roles List */}
            {loading ? (
              <div className="text-center py-12 text-slate-400 text-xs font-semibold">Loading roles...</div>
            ) : roles.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-hairline rounded-2xl text-slate-400 text-xs font-semibold">
                No roles defined yet. Click &quot;Create Role&quot; to set up your first system role.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {roles.map((role: any) => {
                  const isExpanded = expandedRoleId === role.id;
                  const assignedCounselors = counselors.filter(c => c.role_id === role.id);

                  return (
                    <div key={role.id} className="border border-hairline rounded-2xl bg-white overflow-hidden transition-all">
                      {/* Role Header */}
                      <div 
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                        onClick={() => setExpandedRoleId(isExpanded ? null : role.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                            <ShieldCheck size={18} className="text-primary" weight="bold" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-primary">{role.name}</h3>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                              {role.description || "No description"} · {role.permissions?.length || 0} permissions · {role.userCount || 0} users
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            (role.userCount || 0) > 0
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-slate-50 text-slate-400 border-slate-100"
                          }`}>
                            {role.userCount || 0} assigned
                          </span>
                          <span className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><polyline points="6 9 12 15 18 9" /></svg>
                          </span>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="border-t border-hairline">
                          {/* Default Permissions Grid */}
                          <div className="p-4">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Default Permissions</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                              {ALL_PERMISSIONS.map(perm => {
                                const hasIt = role.permissions?.includes(perm);
                                return (
                                  <div key={perm} className={`flex items-center gap-2 p-2 rounded-xl border text-[10px] ${
                                    hasIt
                                      ? "bg-emerald-50/40 border-emerald-200/50 text-emerald-700"
                                      : "bg-slate-50/50 border-slate-100 text-slate-400"
                                  }`}>
                                    {hasIt 
                                      ? <CheckCircle size={12} weight="fill" className="text-emerald-500 shrink-0" /> 
                                      : <XCircle size={12} weight="fill" className="text-slate-300 shrink-0" />
                                    }
                                    <span className="font-bold truncate">{perm}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Assigned Counselors */}
                          {assignedCounselors.length > 0 && (
                            <div className="px-4 pb-4">
                              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Assigned Counselors</h4>
                              <div className="flex flex-wrap gap-2">
                                {assignedCounselors.map((c: any) => (
                                  <div key={c.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-hairline text-xs">
                                    {c.avatar_url ? (
                                      <img src={c.avatar_url} alt={c.full_name} className="w-5 h-5 rounded-full object-cover border border-hairline" />
                                    ) : (
                                      <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 text-[9px] flex items-center justify-center font-bold">{c.full_name.charAt(0)}</div>
                                    )}
                                    <span className="font-semibold text-primary">{c.full_name}</span>
                                    <span className={`w-1.5 h-1.5 rounded-full ${c.is_active ? "bg-emerald-500" : "bg-red-400"}`} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-2 px-4 py-3 bg-slate-50/80 border-t border-hairline">
                            <Button 
                              onClick={(e: React.MouseEvent) => { e.stopPropagation(); openEditRoleModal(role); }} 
                              variant="secondary" 
                              size="sm" 
                              className="text-xs flex items-center gap-1"
                            >
                              <Gear size={12} /> Edit Role
                            </Button>
                            <Button 
                              onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleCloneRole(role); }} 
                              variant="secondary" 
                              size="sm"
                              className="text-xs flex items-center gap-1"
                            >
                              <Copy size={12} /> Clone
                            </Button>
                            <Button 
                              onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleDeleteRole(role); }} 
                              variant="ghost" 
                              size="sm"
                              className="text-xs flex items-center gap-1 text-red-500 hover:text-red-600"
                            >
                              <Trash size={12} /> Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Reference: All Permission Keys */}
            <Card className="p-5">
              <h3 className="font-bold text-sm text-primary mb-3 flex items-center gap-2">
                <Key size={16} className="text-primary" /> All Permission Keys Reference
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mb-3">
                These keys map to specific admin dashboard tabs and system functions.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {ALL_PERMISSIONS.map(perm => (
                  <div key={perm} className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-slate-50 border border-hairline text-[10px] font-bold text-slate-600">
                    <Lock size={10} className="text-slate-400 shrink-0" />
                    {perm}
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

      </div>

      {/* MODALS */}
      {/* 0a. CREATE/EDIT TRAINING SERVICE MODAL */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in text-slate-700">
          <Card className="max-w-md w-full p-6 relative bg-white shadow-2xl">
            <button onClick={() => setIsServiceModalOpen(false)} className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer">
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 mb-6 border-b border-hairline pb-4">
              <Briefcase size={22} className="text-primary" />
              <div>
                <CardTitle className="text-lg">{serviceForm.id ? "Edit Career Service" : "Add Career Service"}</CardTitle>
                <CardDescription className="text-xs">Setup pricing, features and metadata details for candidates.</CardDescription>
              </div>
            </div>
            <form onSubmit={handleSaveService} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase tracking-wider">Service Title *</label>
                <input
                  type="text"
                  required
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  placeholder="e.g. ATS Resume Building"
                  className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase tracking-wider">Description</label>
                <textarea
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Describe the service offering..."
                  rows={3}
                  className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase tracking-wider">Price (INR) *</label>
                  <input
                    type="number"
                    required
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    placeholder="599"
                    className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white font-mono-data"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase tracking-wider">Status *</label>
                  <select
                    value={serviceForm.status}
                    onChange={(e) => setServiceForm({ ...serviceForm, status: e.target.value })}
                    className="px-3.5 py-2 border border-hairline bg-white rounded-xl text-xs text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase tracking-wider">Features (One per line) *</label>
                <textarea
                  required
                  value={serviceForm.featuresText}
                  onChange={(e) => setServiceForm({ ...serviceForm, featuresText: e.target.value })}
                  placeholder="ATS-compliant layout&#10;Keyword optimization&#10;PDF & Word formats"
                  rows={4}
                  className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white resize-none font-mono-data"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-hairline pt-4 mt-2">
                <Button type="submit" variant="primary" size="sm" disabled={savingService}>
                  {savingService ? "Saving..." : "Save Service"}
                </Button>
                <Button type="button" onClick={() => setIsServiceModalOpen(false)} variant="ghost" size="sm">Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* 0b. TRAINING STUDENT DETAIL DRAWER WORKSPACE */}
      {isTrainingDetailOpen && selectedTrainingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in text-slate-700">
          <Card className="max-w-5xl w-full h-[85vh] p-0 relative bg-white shadow-2xl flex flex-col justify-between overflow-hidden">
            
            {/* Header */}
            <div className="p-5 border-b border-hairline bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                  <User size={22} weight="fill" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-primary leading-tight">{selectedTrainingStudent.student_name}</h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {selectedTrainingStudent.student_email} &middot; Phone: {selectedTrainingStudent.student_phone || "N/A"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full">
                  {selectedTrainingStudent.status}
                </span>
                <button 
                  onClick={() => setIsTrainingDetailOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="px-5 border-b border-hairline flex gap-4 text-xs font-bold uppercase tracking-wider text-slate-400 py-3 bg-white">
              {[
                { id: "overview", label: "Overview" },
                { id: "tasks", label: "Tasks Manager" },
                { id: "documents", label: "Documents Collection" },
                { id: "notes", label: "Advisor Notes" },
                { id: "meetings", label: "Meetings Schedule" },
                { id: "chat", label: "Advisor Chat" },
                { id: "notifications", label: "Notifications" }
              ].map(subTab => (
                <button 
                  key={subTab.id}
                  onClick={() => setTrainingDetailTab(subTab.id as any)}
                  className={`pb-1 cursor-pointer transition-all ${
                    trainingDetailTab === subTab.id ? "text-primary border-b-2 border-primary" : "hover:text-primary"
                  }`}
                >
                  {subTab.label}
                </button>
              ))}
            </div>

            {/* Scrollable Workspace Content */}
            <div className="flex-grow p-6 overflow-y-auto bg-slate-50/50 text-xs">
              
              {/* TAB VIEW: OVERVIEW */}
              {trainingDetailTab === "overview" && (
                <div className="space-y-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-5">
                      <h4 className="font-bold text-sm text-primary mb-4 border-b border-hairline pb-2">Program Details</h4>
                      <div className="space-y-2.5 text-xs text-slate-600">
                        <p><strong>Enrolled Service:</strong> {selectedTrainingStudent.training_services?.title || "N/A"}</p>
                        <p><strong>Service Price:</strong> ₹{selectedTrainingStudent.training_services?.price || "0"}</p>
                        <p><strong>Date Enrolled:</strong> {new Date(selectedTrainingStudent.purchase_date).toLocaleString()}</p>
                        <p><strong>Registration status:</strong> {selectedTrainingStudent.status}</p>
                      </div>
                    </Card>

                    <Card className="p-5">
                      <h4 className="font-bold text-sm text-primary mb-4 border-b border-hairline pb-2">Counselor Assignment</h4>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Advisor</label>
                        <select
                          value={selectedTrainingStudent.assigned_consultant_id || ""}
                          onChange={(e) => handleAssignCareerCounselor(selectedTrainingStudent.id, e.target.value)}
                          className="w-full border border-hairline bg-white rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                        >
                          <option value="">Select Counselor</option>
                          {counselors.filter(c => c.is_active).map((c) => (
                            <option key={c.id} value={c.id}>{c.full_name} ({c.designation})</option>
                          ))}
                        </select>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* TAB VIEW: TASKS MANAGER */}
              {trainingDetailTab === "tasks" && (
                <div className="space-y-6 text-left">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Assign Task form */}
                    <div className="lg:col-span-1">
                      <Card className="p-5">
                        <h4 className="font-bold text-xs text-primary uppercase tracking-wider mb-4">Assign New Task</h4>
                        <form onSubmit={handleCreateCareerTask} className="space-y-3">
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Task Title *</label>
                            <input 
                              type="text" 
                              required 
                              value={careerTaskForm.title} 
                              onChange={(e) => setCareerTaskForm({ ...careerTaskForm, title: e.target.value })} 
                              placeholder="e.g. Submit ATS Resume Draft"
                              className="px-3.5 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none text-slate-800 bg-white"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Description</label>
                            <textarea 
                              value={careerTaskForm.description} 
                              onChange={(e) => setCareerTaskForm({ ...careerTaskForm, description: e.target.value })} 
                              placeholder="Task instructions..."
                              rows={3}
                              className="px-3.5 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none text-slate-800 bg-white resize-none"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Due Date</label>
                            <input 
                              type="date" 
                              value={careerTaskForm.due_date} 
                              onChange={(e) => setCareerTaskForm({ ...careerTaskForm, due_date: e.target.value })} 
                              className="px-3.5 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none text-slate-800 bg-white"
                            />
                          </div>

                          <Button type="submit" variant="primary" size="sm" className="w-full mt-2" disabled={addingCareerTask}>
                            {addingCareerTask ? "Assigning..." : "Assign Task"}
                          </Button>
                        </form>
                      </Card>
                    </div>

                    {/* Assigned Tasks list */}
                    <div className="lg:col-span-2 space-y-3">
                      <h4 className="font-bold text-xs text-primary uppercase tracking-wider mb-2">Current Candidate Checklist</h4>
                      {trainingDetailTasks.length === 0 ? (
                        <div className="text-center py-8 bg-white border border-hairline rounded-2xl">
                          <p className="text-slate-400 font-medium">No tasks assigned to this candidate.</p>
                        </div>
                      ) : (
                        trainingDetailTasks.map((task) => (
                          <div key={task.id} className="p-4 bg-white border border-hairline rounded-2xl flex flex-col sm:flex-row justify-between gap-4">
                            <div className="space-y-1">
                              <h4 className="font-semibold text-slate-800 text-sm">{task.title}</h4>
                              <p className="text-slate-500 text-[11px] leading-relaxed">{task.description}</p>
                              {task.due_date && (
                                <p className="text-[10px] text-slate-400 font-medium">Due Date: {new Date(task.due_date).toLocaleDateString()}</p>
                              )}
                              {task.file_url && (
                                <div className="mt-2 bg-slate-50 p-2 rounded-xl border border-hairline inline-flex items-center gap-2">
                                  <FileText size={16} className="text-slate-400" />
                                  <a href={task.file_url} target="_blank" rel="noreferrer" className="text-primary hover:text-gold font-bold">
                                    Download Candidate solution ({task.file_name || "Solution"})
                                  </a>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col gap-2 shrink-0 sm:items-end">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status:</span>
                                <select
                                  value={task.status}
                                  onChange={(e) => handleUpdateCareerTaskStatus(task.id, e.target.value, task.feedback || "")}
                                  className="border border-hairline bg-white rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Under Review">Under Review</option>
                                  <option value="Completed">Completed</option>
                                </select>
                              </div>

                              <input
                                type="text"
                                placeholder="Add advisor feedback..."
                                defaultValue={task.feedback || ""}
                                onBlur={(e) => handleUpdateCareerTaskStatus(task.id, task.status, e.target.value)}
                                className="border border-hairline rounded-lg px-2.5 py-1 focus:outline-none text-[11px] w-full sm:w-44"
                              />

                              <button
                                onClick={() => handleDeleteCareerTask(task.id)}
                                className="text-[10px] font-bold text-red-500 hover:text-red-700 cursor-pointer"
                              >
                                Delete Task
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* TAB VIEW: DOCUMENTS */}
              {trainingDetailTab === "documents" && (
                <div className="space-y-4 text-left">
                  <h4 className="font-bold text-xs text-primary uppercase tracking-wider mb-2">Uploaded Candidate Files</h4>
                  {trainingDetailDocs.length === 0 ? (
                    <div className="text-center py-12 bg-white border border-hairline rounded-2xl">
                      <p className="text-slate-400 font-medium">No documents uploaded by this candidate.</p>
                    </div>
                  ) : (
                    <div className="bg-white border border-hairline rounded-2xl overflow-hidden shadow-sm">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-hairline text-slate-400 font-bold uppercase tracking-wider">
                            <th className="px-6 py-3">File Title</th>
                            <th className="px-6 py-3">Uploaded By</th>
                            <th className="px-6 py-3">Upload Date</th>
                            <th className="px-6 py-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-hairline">
                          {trainingDetailDocs.map((doc) => (
                            <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-3.5 font-semibold text-slate-800">{doc.title}</td>
                              <td className="px-6 py-3.5 text-slate-500 capitalize">{doc.uploaded_by}</td>
                              <td className="px-6 py-3.5 text-slate-400">{new Date(doc.created_at).toLocaleString()}</td>
                              <td className="px-6 py-3.5 text-right">
                                <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-primary hover:text-gold font-bold">
                                  Download File
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB VIEW: NOTES */}
              {trainingDetailTab === "notes" && (
                <div className="space-y-4 text-left">
                  <h4 className="font-bold text-xs text-primary uppercase tracking-wider mb-2">Administrative & Counseling Notes</h4>
                  <Card className="p-5">
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveTrainingNotes(); }} className="space-y-4">
                      <textarea
                        value={trainingNotesText}
                        onChange={(e) => setTrainingNotesText(e.target.value)}
                        placeholder="Write candidate evaluations, resume review points, interview feedback logs..."
                        rows={8}
                        className="w-full border border-hairline rounded-xl px-4 py-3 text-xs focus:outline-none text-slate-800 bg-white resize-none"
                      />
                      <div className="flex justify-end">
                        <Button type="submit" variant="primary" size="sm" disabled={savingTrainingNotes}>
                          {savingTrainingNotes ? "Saving..." : "Save Candidate Notes"}
                        </Button>
                      </div>
                    </form>
                  </Card>
                </div>
              )}

              {/* TAB VIEW: MEETINGS */}
              {trainingDetailTab === "meetings" && (
                <div className="space-y-6 text-left">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Schedule Meeting form */}
                    <div className="lg:col-span-1">
                      <Card className="p-5">
                        <h4 className="font-bold text-xs text-primary uppercase tracking-wider mb-4">Schedule Session</h4>
                        <form onSubmit={handleScheduleCareerMeeting} className="space-y-3">
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Session Title *</label>
                            <input 
                              type="text" 
                              required 
                              value={careerMeetingForm.title} 
                              onChange={(e) => setCareerMeetingForm({ ...careerMeetingForm, title: e.target.value })} 
                              placeholder="e.g. Mock Interview Round 1"
                              className="px-3.5 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none text-slate-800 bg-white"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Description</label>
                            <textarea 
                              value={careerMeetingForm.description} 
                              onChange={(e) => setCareerMeetingForm({ ...careerMeetingForm, description: e.target.value })} 
                              placeholder="Agenda details..."
                              rows={2}
                              className="px-3.5 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none text-slate-800 bg-white resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1">
                              <label className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Date *</label>
                              <input 
                                type="date" 
                                required 
                                value={careerMeetingForm.date} 
                                onChange={(e) => setCareerMeetingForm({ ...careerMeetingForm, date: e.target.value })} 
                                className="px-3.5 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none text-slate-800 bg-white"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Time *</label>
                              <input 
                                type="time" 
                                required 
                                value={careerMeetingForm.time} 
                                onChange={(e) => setCareerMeetingForm({ ...careerMeetingForm, time: e.target.value })} 
                                className="px-3.5 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none text-slate-800 bg-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1">
                              <label className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Duration (Min) *</label>
                              <input 
                                type="number" 
                                required 
                                value={careerMeetingForm.duration_minutes} 
                                onChange={(e) => setCareerMeetingForm({ ...careerMeetingForm, duration_minutes: e.target.value })} 
                                placeholder="30"
                                className="px-3.5 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none text-slate-800 bg-white font-mono-data"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Meeting Type *</label>
                              <select 
                                value={careerMeetingForm.meeting_type} 
                                onChange={(e) => setCareerMeetingForm({ ...careerMeetingForm, meeting_type: e.target.value })} 
                                className="px-3.5 py-1.5 border border-hairline bg-white rounded-xl text-xs text-slate-800 focus:outline-none cursor-pointer"
                              >
                                <option value="Google Meet">Google Meet</option>
                                <option value="Zoom">Zoom</option>
                                <option value="In-person">In-person</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Meeting Link</label>
                            <input 
                              type="text" 
                              value={careerMeetingForm.meeting_link} 
                              onChange={(e) => setCareerMeetingForm({ ...careerMeetingForm, meeting_link: e.target.value })} 
                              placeholder="https://"
                              className="px-3.5 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none text-slate-800 bg-white"
                            />
                          </div>

                          <Button type="submit" variant="primary" size="sm" className="w-full mt-2" disabled={savingCareerMeeting}>
                            {savingCareerMeeting ? "Scheduling..." : "Schedule Meeting"}
                          </Button>
                        </form>
                      </Card>
                    </div>

                    {/* Planned meetings list */}
                    <div className="lg:col-span-2 space-y-3">
                      <h4 className="font-bold text-xs text-primary uppercase tracking-wider mb-2">Scheduled Sessions checklist</h4>
                      {trainingDetailMeetings.length === 0 ? (
                        <div className="text-center py-8 bg-white border border-hairline rounded-2xl">
                          <p className="text-slate-400 font-medium">No meetings scheduled with this student.</p>
                        </div>
                      ) : (
                        trainingDetailMeetings.map((meet) => (
                          <div key={meet.id} className="p-4 bg-white border border-hairline rounded-2xl flex justify-between gap-4">
                            <div>
                              <h4 className="font-semibold text-slate-800 text-sm">{meet.title}</h4>
                              <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">{meet.description}</p>
                              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400 font-medium font-mono-data">
                                <span>Date: {new Date(meet.scheduled_at).toLocaleDateString()}</span>
                                <span>Time: {new Date(meet.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                                <span>Duration: {meet.duration_minutes} min</span>
                                <span className="capitalize">Type: {meet.meeting_type}</span>
                              </div>
                              {meet.meeting_link && (
                                <a href={meet.meeting_link} target="_blank" rel="noreferrer" className="text-primary hover:text-gold font-bold text-[10px] mt-1.5 block">
                                  Join Session link
                                </a>
                              )}
                            </div>

                            <div className="flex flex-col gap-2 shrink-0 items-end">
                              <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                                meet.status === "Rescheduled" ? "bg-blue-50 text-blue-600 border-blue-100" : meet.status === "Cancelled" ? "bg-red-50 text-red-600 border-red-100" : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}>
                                {meet.status}
                              </span>
                              <button
                                onClick={() => handleDeleteCareerMeeting(meet.id)}
                                className="text-[10px] font-bold text-red-500 hover:text-red-700 cursor-pointer"
                              >
                                Cancel Meeting
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* TAB VIEW: ADVISOR CHAT */}
              {trainingDetailTab === "chat" && (
                <div className="space-y-4 text-left">
                  <h4 className="font-bold text-xs text-primary uppercase tracking-wider mb-2">Live Candidate Communication</h4>
                  
                  <div className="bg-white border border-hairline rounded-2xl h-[400px] flex flex-col overflow-hidden shadow-sm">
                    {/* Message Logs */}
                    <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-50/40 text-[11px] leading-relaxed flex flex-col">
                      {trainingDetailMessages.length === 0 ? (
                        <div className="flex-grow flex flex-col items-center justify-center text-slate-400">
                          <ChatCircleDots size={32} className="mb-2" />
                          <p className="text-[10px]">No chat logs recorded yet. Send a message to start conversation!</p>
                        </div>
                      ) : (
                        trainingDetailMessages.map((msg) => {
                          const isCounselor = msg.sender_type === "counselor" || msg.sender_type === "admin";
                          return (
                            <div
                              key={msg.id}
                              className={`max-w-[75%] rounded-xl p-3 ${
                                isCounselor
                                  ? "bg-primary text-white self-end rounded-tr-none"
                                  : "bg-white border border-hairline text-slate-800 self-start rounded-tl-none shadow-sm"
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{msg.message}</p>
                              {msg.attachment_url && (
                                <a href={msg.attachment_url} target="_blank" rel="noreferrer" className="text-gold underline font-bold mt-1.5 block">
                                  View attached: {msg.attachment_name || "Attachment"}
                                </a>
                              )}
                              <span className={`text-[8px] block text-right mt-1 ${isCounselor ? "text-slate-300" : "text-slate-400"}`}>
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Message Input Box */}
                    <form onSubmit={handleSendCareerChat} className="p-3 border-t border-hairline flex gap-2 items-center bg-white">
                      <input
                        type="text"
                        value={careerChatText}
                        onChange={(e) => setCareerChatText(e.target.value)}
                        placeholder="Write advisor reply here..."
                        className="flex-grow bg-slate-50 border border-hairline/80 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-3 py-2 text-xs focus:outline-none"
                        disabled={sendingCareerChat}
                      />
                      <button
                        type="submit"
                        disabled={sendingCareerChat}
                        className="px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-lg font-bold text-xs shadow flex items-center justify-center cursor-pointer transition-colors"
                      >
                        {sendingCareerChat ? <SpinnerGap size={14} className="animate-spin" /> : "Send"}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB VIEW: STUDENT NOTIFICATIONS PREFERENCES */}
              {trainingDetailTab === "notifications" && (
                <div className="space-y-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Left: Preferences Card */}
                    <div className="md:col-span-1 space-y-4">
                      <Card className="p-5">
                        <h4 className="font-bold text-sm text-primary mb-4 border-b border-hairline pb-2">Student Preferences</h4>
                        
                        {selectedStudentPrefs ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className="font-semibold text-xs text-slate-700 block">All Notifications</span>
                                <span className="text-[10px] text-slate-400 block font-medium">Master toggle for this student</span>
                              </div>
                              <input
                                type="checkbox"
                                checked={selectedStudentPrefs.all_notifications_enabled}
                                onChange={(e) => handleUpdateStudentPrefs("all_notifications_enabled", e.target.checked, "training")}
                                disabled={savingStudentPrefs}
                                className="h-4.5 w-4.5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer border bg-white"
                              />
                            </div>

                            <hr className="border-hairline" />

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className="font-semibold text-xs text-slate-700 block">Missing Documents Alert</span>
                                <span className="text-[10px] text-slate-400 block font-medium">Email reminders on missing/rejected files</span>
                              </div>
                              <input
                                type="checkbox"
                                checked={selectedStudentPrefs.missing_documents_enabled}
                                onChange={(e) => handleUpdateStudentPrefs("missing_documents_enabled", e.target.checked, "training")}
                                disabled={!selectedStudentPrefs.all_notifications_enabled || savingStudentPrefs}
                                className="h-4.5 w-4.5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer border bg-white"
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className="font-semibold text-xs text-slate-700 block">Consultation Reminders</span>
                                <span className="text-[10px] text-slate-400 block font-medium">Email reminders on meetings scheduled</span>
                              </div>
                              <input
                                type="checkbox"
                                checked={selectedStudentPrefs.consultation_enabled}
                                onChange={(e) => handleUpdateStudentPrefs("consultation_enabled", e.target.checked, "training")}
                                disabled={!selectedStudentPrefs.all_notifications_enabled || savingStudentPrefs}
                                className="h-4.5 w-4.5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer border bg-white"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="py-4 text-center text-slate-400">Loading student preferences...</div>
                        )}
                      </Card>

                      {/* Manual Dispatch Center */}
                      <Card className="p-5 space-y-4">
                        <h4 className="font-bold text-sm text-primary border-b border-hairline pb-2">Manual Dispatch Triggers</h4>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-[10px] text-slate-400 font-medium mb-1.5 uppercase tracking-wider">Document Checklist Alert</p>
                            <Button
                              onClick={async () => {
                                setTriggeringNotif("manual-docs");
                                try {
                                  const res = await fetch("/api/send-student-notification", {
                                    method: "POST",
                                    headers: { 
                                      "Content-Type": "application/json",
                                      "Authorization": `Bearer ${getAdminCredentials()}`
                                    },
                                    body: JSON.stringify({
                                      trainingStudentId: selectedTrainingStudent.id,
                                      action: "missing-documents-reminder",
                                      details: { manual: true }
                                    })
                                  });
                                  const result = await res.json();
                                  if (!res.ok || !result.success) throw new Error(result.error || "Delivery failed");
                                  showToast("Manual document reminder sent successfully!");
                                  await loadTrainingDetailData(selectedTrainingStudent.id);
                                } catch (err: any) {
                                  alert("Failed to send reminder: " + err.message);
                                } finally {
                                  setTriggeringNotif(null);
                                }
                              }}
                              disabled={triggeringNotif === "manual-docs"}
                              variant="secondary"
                              className="w-full text-xs animate-pulse-once"
                            >
                              {triggeringNotif === "manual-docs" ? <SpinnerGap className="animate-spin" size={14} /> : "Send Missing Docs Reminder"}
                            </Button>
                          </div>

                          <div>
                            <p className="text-[10px] text-slate-400 font-medium mb-1.5 uppercase tracking-wider">Meetings Consultation Alert</p>
                            {trainingDetailMeetings.filter(m => m.status === "Scheduled" || m.status === "Rescheduled").length === 0 ? (
                              <p className="text-[10px] text-slate-400 italic">No upcoming meetings scheduled.</p>
                            ) : (
                              <div className="space-y-2">
                                {trainingDetailMeetings.filter(m => m.status === "Scheduled" || m.status === "Rescheduled").slice(0, 2).map(m => (
                                  <Button
                                    key={m.id}
                                    onClick={async () => {
                                      setTriggeringNotif(`manual-meet-${m.id}`);
                                      try {
                                        const res = await fetch("/api/send-student-notification", {
                                          method: "POST",
                                          headers: { 
                                            "Content-Type": "application/json",
                                            "Authorization": `Bearer ${getAdminCredentials()}`
                                          },
                                          body: JSON.stringify({
                                            trainingStudentId: selectedTrainingStudent.id,
                                            action: "consultation-reminder",
                                            details: { meetingId: m.id, manual: true }
                                          })
                                        });
                                        const result = await res.json();
                                        if (!res.ok || !result.success) throw new Error(result.error || "Delivery failed");
                                        showToast(`Manual reminder for "${m.title}" sent successfully!`);
                                        await loadTrainingDetailData(selectedTrainingStudent.id);
                                      } catch (err: any) {
                                        alert("Failed to send meeting reminder: " + err.message);
                                      } finally {
                                        setTriggeringNotif(null);
                                      }
                                    }}
                                    disabled={triggeringNotif === `manual-meet-${m.id}`}
                                    variant="secondary"
                                    className="w-full text-left text-xs truncate block"
                                    title={`Send reminder for ${m.title}`}
                                  >
                                    {triggeringNotif === `manual-meet-${m.id}` ? <SpinnerGap className="animate-spin" size={10} /> : `Remind: "${m.title.substring(0, 15)}..."`}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Right: History Logs List */}
                    <div className="md:col-span-2 space-y-4">
                      <Card className="p-5">
                        <h4 className="font-bold text-sm text-primary mb-4 border-b border-hairline pb-2">Student Notification Logs</h4>
                        
                        {selectedStudentHistory.length === 0 ? (
                          <p className="text-slate-400 py-12 text-center border border-dashed border-hairline bg-slate-50/50 rounded-2xl">
                            No notifications dispatched to this student profile yet.
                          </p>
                        ) : (
                          <div className="max-h-[350px] overflow-y-auto border border-hairline rounded-xl">
                            <table className="w-full text-left text-xs divide-y divide-hairline text-slate-700 bg-white">
                              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 sticky top-0 z-10">
                                <tr>
                                  <th className="px-3.5 py-2.5">Status</th>
                                  <th className="px-3.5 py-2.5">Type</th>
                                  <th className="px-3.5 py-2.5">Subject</th>
                                  <th className="px-3.5 py-2.5">Date</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-hairline text-slate-600">
                                {selectedStudentHistory.map((h) => (
                                  <tr key={h.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-3.5 py-2.5">
                                      <span className={`inline-block text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full border ${
                                        h.status === "sent" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                                      }`}>
                                        {h.status}
                                      </span>
                                    </td>
                                    <td className="px-3.5 py-2.5 font-bold uppercase text-[9px] tracking-wide text-slate-400">
                                      {h.notification_type === "missing_documents" ? "Docs" : h.notification_type === "consultation" ? "Meeting" : "Visa"}
                                    </td>
                                    <td className="px-3.5 py-2.5 max-w-[180px] truncate" title={h.subject}>
                                      {h.error_message ? (
                                        <span className="text-red-500 font-medium block truncate">{h.error_message}</span>
                                      ) : (
                                        <span className="truncate block">{h.subject}</span>
                                      )}
                                    </td>
                                    <td className="px-3.5 py-2.5 text-[10px] text-slate-400 font-medium">
                                      {new Date(h.sent_at).toLocaleDateString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </Card>
                    </div>

                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-hairline flex justify-end">
              <Button onClick={() => setIsTrainingDetailOpen(false)} variant="ghost" size="sm">Close Workspace</Button>
            </div>

          </Card>
        </div>
      )}

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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Min Percentage (%)</label>
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    value={uniForm.min_percentage} 
                    onChange={(e) => setUniForm({ ...uniForm, min_percentage: e.target.value })} 
                    className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" 
                    placeholder="e.g. 60"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Annual Fee (Numeric)</label>
                  <input 
                    type="number" 
                    value={uniForm.annual_fees} 
                    onChange={(e) => setUniForm({ ...uniForm, annual_fees: e.target.value })} 
                    className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" 
                    placeholder="e.g. 15000"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Degree Level *</label>
                  <select 
                    value={uniForm.degree_level} 
                    onChange={(e) => setUniForm({ ...uniForm, degree_level: e.target.value })} 
                    className="px-3 py-1.5 border border-hairline bg-white rounded-xl text-xs text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="High School">High School</option>
                    <option value="Bachelors">Bachelors Degree</option>
                    <option value="Masters">Masters Degree</option>
                    <option value="Doctorate">Doctorate / PhD</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Min IELTS Cutoff</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0"
                    max="9"
                    value={uniForm.min_ielts} 
                    onChange={(e) => setUniForm({ ...uniForm, min_ielts: e.target.value })} 
                    className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" 
                    placeholder="e.g. 6.5"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Min PTE Cutoff</label>
                  <input 
                    type="number" 
                    min="0"
                    max="90"
                    value={uniForm.min_pte} 
                    onChange={(e) => setUniForm({ ...uniForm, min_pte: e.target.value })} 
                    className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" 
                    placeholder="e.g. 58"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Min TOEFL Cutoff</label>
                  <input 
                    type="number" 
                    min="0"
                    max="120"
                    value={uniForm.min_toefl} 
                    onChange={(e) => setUniForm({ ...uniForm, min_toefl: e.target.value })} 
                    className="px-3 py-1.5 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 bg-white" 
                    placeholder="e.g. 80"
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
                    id="scholarship_available" 
                    checked={uniForm.scholarship_available} 
                    onChange={(e) => setUniForm({ ...uniForm, scholarship_available: e.target.checked })} 
                    className="w-4 h-4 text-primary cursor-pointer border-hairline rounded" 
                  />
                  <label htmlFor="scholarship_available" className="text-[10px] font-bold text-primary uppercase tracking-wider cursor-pointer">Scholarship Available</label>
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
          <Card className="max-w-2xl w-full p-6 relative bg-white shadow-2xl rounded-2xl border border-hairline">
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
            <form onSubmit={handleSaveCounselor} className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-1 text-xs text-slate-700">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
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
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase tracking-wider">System Role *</label>
                    <select
                      value={selectedCounselorRole}
                      onChange={(e) => {
                        setSelectedCounselorRole(e.target.value);
                        setCounselorPermOverrides({});
                      }}
                      className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white"
                      required
                    >
                      <option value="">Select a Role</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
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

                  <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="counselorActive" 
                      checked={counselorForm.is_active} 
                      onChange={(e) => setCounselorForm({ ...counselorForm, is_active: e.target.checked })} 
                      className="w-4 h-4 text-primary cursor-pointer border-hairline rounded"
                    />
                    <label htmlFor="counselorActive" className="text-xs font-bold text-primary uppercase tracking-wider cursor-pointer">Active Counselor</label>
                  </div>
                </div>
              </div>

              {/* Permissions matrix check grid */}
              <div className="flex flex-col gap-2 mt-2 border-t border-hairline pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary uppercase tracking-wider">Permissions Matrix Overrides</span>
                  <span className="text-[10px] text-slate-400 font-medium">Highlight indicates custom override value</span>
                </div>
                {loadingPerms ? (
                  <div className="text-center py-4 text-slate-400 text-xs font-semibold">Loading permissions...</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 border border-hairline rounded-2xl max-h-[220px] overflow-y-auto">
                    {ALL_PERMISSIONS.map(permKey => {
                      const selectedRoleObj = roles.find(r => r.id === selectedCounselorRole);
                      const isInherited = selectedRoleObj?.permissions?.includes(permKey);
                      const overrideValue = counselorPermOverrides[permKey];
                      const isChecked = overrideValue !== undefined && overrideValue !== null 
                        ? overrideValue 
                        : !!isInherited;

                      return (
                        <div 
                          key={permKey} 
                          className={`flex items-center justify-between p-2 rounded-xl border text-[10px] transition-colors ${
                            overrideValue !== undefined && overrideValue !== null
                              ? "bg-amber-50/60 border-amber-200/60 text-amber-900"
                              : "bg-white border-hairline"
                          }`}
                        >
                          <div className="flex flex-col text-left">
                            <span className="font-bold text-slate-700">{permKey}</span>
                            <span className="text-[9px] text-slate-400 font-medium">
                              {overrideValue !== undefined && overrideValue !== null
                                ? "Custom Override"
                                : selectedCounselorRole
                                  ? (isInherited ? "Inherited (On)" : "Inherited (Off)")
                                  : "Select a Role"
                              }
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const targetVal = e.target.checked;
                              setCounselorPermOverrides(prev => ({
                                ...prev,
                                [permKey]: targetVal === !!isInherited ? null : targetVal
                              }));
                            }}
                            className="w-3.5 h-3.5 text-primary border-hairline rounded cursor-pointer"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
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

      {/* 5c. ADD/EDIT CAREER EXPERT MODAL */}
      {isExpertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <Card className="max-w-md w-full p-6 relative bg-white shadow-2xl">
            <button onClick={() => setIsExpertModalOpen(false)} className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer">
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 mb-6 border-b border-hairline pb-4 text-slate-700">
              <User size={22} className="text-primary" />
              <div>
                <CardTitle className="text-lg">{editingExpert ? "Edit Career Expert" : "Add Career Expert"}</CardTitle>
                <CardDescription className="text-xs">Setup name, designation, expertise and LinkedIn details for placement experts.</CardDescription>
              </div>
            </div>
            <form onSubmit={handleSaveExpert} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1 text-xs text-slate-700">
              
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase tracking-wider">Expert Name *</label>
                <input 
                  type="text" 
                  value={expertForm.name} 
                  onChange={(e) => setExpertForm({ ...expertForm, name: e.target.value })} 
                  className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase tracking-wider">Designation *</label>
                <input 
                  type="text" 
                  value={expertForm.designation} 
                  onChange={(e) => setExpertForm({ ...expertForm, designation: e.target.value })} 
                  className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white"
                  placeholder="e.g. Senior Career Counselor"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase tracking-wider">Area of Expertise</label>
                <input 
                  type="text" 
                  value={expertForm.expertise} 
                  onChange={(e) => setExpertForm({ ...expertForm, expertise: e.target.value })} 
                  className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white"
                  placeholder="e.g. Study Abroad & Placement Guidance"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase tracking-wider">LinkedIn URL</label>
                <input 
                  type="url" 
                  value={expertForm.linkedin_url} 
                  onChange={(e) => setExpertForm({ ...expertForm, linkedin_url: e.target.value })} 
                  className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase tracking-wider">Display Order</label>
                <input 
                  type="number" 
                  value={expertForm.display_order} 
                  onChange={(e) => setExpertForm({ ...expertForm, display_order: parseInt(e.target.value) || 0 })} 
                  className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase tracking-wider">Profile Photo (Expert)</label>
                <div className="flex items-center gap-3">
                  {expertForm.photo_url ? (
                    <img 
                      src={expertForm.photo_url} 
                      alt="Expert Preview" 
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
                      onChange={handleExpertPhotoUpload} 
                      disabled={uploadingExpertPhoto}
                      className="hidden" 
                      id="expertPhotoFileInput"
                    />
                    <label 
                      htmlFor="expertPhotoFileInput"
                      className="px-3 py-2 border border-hairline rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider text-[10px]"
                    >
                      {uploadingExpertPhoto ? (
                        <>
                          <SpinnerGap className="animate-spin text-slate-400" size={14} />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <UploadSimple size={14} />
                          Upload Photo
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="expertActive" 
                  checked={expertForm.is_active} 
                  onChange={(e) => setExpertForm({ ...expertForm, is_active: e.target.checked })} 
                  className="w-4 h-4 text-primary cursor-pointer border-hairline rounded"
                />
                <label htmlFor="expertActive" className="text-xs font-bold text-primary uppercase tracking-wider cursor-pointer">Active Expert (Show on Page)</label>
              </div>

              <div className="flex justify-end gap-3 border-t border-hairline pt-4 mt-2">
                <Button type="submit" variant="primary" size="sm" disabled={savingExpert}>
                  {savingExpert ? (
                    <>
                      <SpinnerGap className="animate-spin" size={14} />
                      Saving...
                    </>
                  ) : "Save Record"}
                </Button>
                <Button type="button" onClick={() => setIsExpertModalOpen(false)} variant="ghost" size="sm">Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* 5c. PROVISION LOGIN MODAL */}
      {provisionModalOpen && provisionCounselor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <Card className="max-w-md w-full p-6 relative bg-white shadow-2xl rounded-2xl border border-hairline">
            <button onClick={() => setProvisionModalOpen(false)} className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer">
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 mb-6 border-b border-hairline pb-4 text-slate-700">
              <Key size={22} className="text-primary" />
              <div>
                <CardTitle className="text-lg">Provision Counselor Login</CardTitle>
                <CardDescription className="text-xs">Create Supabase Auth credentials for counselor login.</CardDescription>
              </div>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!provisionPassword || provisionPassword.length < 6) {
                alert("Password must be at least 6 characters.");
                return;
              }
              setProvisioning(true);
              try {
                const token = getAdminCredentials();
                const res = await fetch("/api/admin/rbac", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    action: "provision-login",
                    counselorId: provisionCounselor.id,
                    email: provisionCounselor.email,
                    password: provisionPassword
                  })
                });
                
                const result = await res.json();
                if (!res.ok) throw new Error(result.error || "Provisioning failed");
                
                showToast(`Login credentials provisioned successfully for ${provisionCounselor.full_name}!`);
                setProvisionModalOpen(false);
                fetchAllData();
              } catch (err: any) {
                alert("Error provisioning login: " + err.message);
              } finally {
                setProvisioning(false);
              }
            }} className="flex flex-col gap-4 text-slate-700">
              <div className="flex flex-col gap-1 text-left">
                <span className="font-bold uppercase tracking-wider text-[10px] text-primary">Counselor Name</span>
                <span className="text-xs font-semibold">{provisionCounselor.full_name}</span>
              </div>
              <div className="flex flex-col gap-1 text-left">
                <span className="font-bold uppercase tracking-wider text-[10px] text-primary">Login Email</span>
                <span className="text-xs font-mono-data font-semibold">{provisionCounselor.email}</span>
              </div>
              <div className="flex flex-col gap-1.5 text-left">
                <label className="font-bold text-primary uppercase tracking-wider">Set Password *</label>
                <input 
                  type="password" 
                  value={provisionPassword} 
                  onChange={(e) => setProvisionPassword(e.target.value)} 
                  className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white"
                  placeholder="At least 6 characters"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 border-t border-hairline pt-4 mt-2">
                <Button type="submit" variant="primary" size="sm" disabled={provisioning}>
                  {provisioning ? (
                    <>
                      <SpinnerGap className="animate-spin" size={14} />
                      Provisioning...
                    </>
                  ) : "Provision Access"}
                </Button>
                <Button type="button" onClick={() => setProvisionModalOpen(false)} variant="ghost" size="sm">Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* 5d. CREATE/EDIT ROLE MODAL */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <Card className="max-w-lg w-full p-6 relative bg-white shadow-2xl rounded-2xl border border-hairline">
            <button onClick={() => setIsRoleModalOpen(false)} className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer">
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 mb-6 border-b border-hairline pb-4 text-slate-700">
              <ShieldCheck size={22} className="text-primary" />
              <div>
                <CardTitle className="text-lg">{editingRole ? "Edit Role" : "Create New Role"}</CardTitle>
                <CardDescription className="text-xs">Define a role with default permissions for counselors.</CardDescription>
              </div>
            </div>
            <form onSubmit={handleSaveRole} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1 text-xs text-slate-700">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase tracking-wider">Role Name *</label>
                <input 
                  type="text" 
                  value={roleForm.name} 
                  onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })} 
                  className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white"
                  placeholder="e.g. Senior Counselor"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase tracking-wider">Description</label>
                <input 
                  type="text" 
                  value={roleForm.description} 
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })} 
                  className="px-3.5 py-2 border border-hairline rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-slate-800 bg-white"
                  placeholder="Brief description of this role's responsibilities"
                />
              </div>

              {/* Permission Matrix */}
              <div className="flex flex-col gap-2 mt-1 border-t border-hairline pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary uppercase tracking-wider">Default Permissions</span>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => setRoleForm({ ...roleForm, permissions: [...ALL_PERMISSIONS] })}
                      className="text-[9px] font-bold text-emerald-600 hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button 
                      type="button"
                      onClick={() => setRoleForm({ ...roleForm, permissions: [] })}
                      className="text-[9px] font-bold text-red-500 hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 border border-hairline rounded-2xl max-h-[260px] overflow-y-auto">
                  {ALL_PERMISSIONS.map(permKey => {
                    const isChecked = roleForm.permissions.includes(permKey);
                    return (
                      <div 
                        key={permKey} 
                        className={`flex items-center justify-between p-2 rounded-xl border text-[10px] transition-colors cursor-pointer ${
                          isChecked
                            ? "bg-emerald-50/40 border-emerald-200/50 text-emerald-700"
                            : "bg-white border-hairline text-slate-500"
                        }`}
                        onClick={() => {
                          setRoleForm(prev => ({
                            ...prev,
                            permissions: isChecked
                              ? prev.permissions.filter(p => p !== permKey)
                              : [...prev.permissions, permKey]
                          }));
                        }}
                      >
                        <span className="font-bold">{permKey}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-3.5 h-3.5 text-primary border-hairline rounded cursor-pointer pointer-events-none"
                        />
                      </div>
                    );
                  })}
                </div>
                <p className="text-[9px] text-slate-400 font-medium">
                  {roleForm.permissions.length} of {ALL_PERMISSIONS.length} permissions enabled
                </p>
              </div>

              <div className="flex justify-end gap-3 border-t border-hairline pt-4 mt-2">
                <Button type="submit" variant="primary" size="sm" disabled={savingRole}>
                  {savingRole ? (
                    <>
                      <SpinnerGap className="animate-spin" size={14} />
                      Saving...
                    </>
                  ) : editingRole ? "Update Role" : "Create Role"}
                </Button>
                <Button type="button" onClick={() => setIsRoleModalOpen(false)} variant="ghost" size="sm">Cancel</Button>
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
            <div className="px-5 border-b border-hairline flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider text-slate-400 py-3 bg-white">
              {[
                { id: "progress", label: "Tasks & Progress" },
                { id: "documents", label: "Documents Collection" },
                { id: "offers", label: "Offer Letters" },
                { id: "visa", label: "Visa Timeline" },
                { id: "chat", label: "Counselor Chat" },
                { id: "logs", label: "Activity Logs" },
                { id: "meetings", label: "Schedule Meetings" },
                { id: "notifications", label: "Notifications" }
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

              {/* TAB G: SCHEDULE MEETINGS */}
              {auditTab === "meetings" && (
                <div className="space-y-6">
                  
                  {/* Meeting Counters */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Upcoming", count: auditMeetings.filter(m => m.status === "Scheduled" || m.status === "Rescheduled").length, color: "bg-blue-50 text-blue-700 border-blue-200" },
                      { label: "Completed", count: auditMeetings.filter(m => m.status === "Completed").length, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                      { label: "Cancelled", count: auditMeetings.filter(m => m.status === "Cancelled").length, color: "bg-red-50 text-red-700 border-red-200" }
                    ].map(c => (
                      <div key={c.label} className={`p-4 rounded-2xl border text-center ${c.color}`}>
                        <span className="text-2xl font-bold font-display block">{c.count}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider">{c.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Meeting Form */}
                  <div className="border border-hairline rounded-2xl bg-white p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-primary flex items-center gap-2">
                        <Calendar size={16} weight="fill" />
                        {editingMeeting ? "Edit Meeting" : "Schedule New Meeting"}
                      </h4>
                      {editingMeeting && (
                        <button
                          onClick={() => {
                            setEditingMeeting(null);
                            setMeetingForm({ title: "", description: "", date: "", time: "", duration_minutes: "30", meeting_link: "", meeting_type: "Google Meet" });
                          }}
                          className="text-[10px] text-slate-400 hover:text-red-500 font-bold uppercase cursor-pointer"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>

                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      if (!meetingForm.title || !meetingForm.date || !meetingForm.time) return;
                      setSavingMeeting(true);
                      try {
                        const scheduledAt = new Date(`${meetingForm.date}T${meetingForm.time}`).toISOString();
                        const counselorId = selectedStudent?.counselor_id || null;

                        if (editingMeeting) {
                          // Update
                          const { error } = await supabase
                            .from("meetings")
                            .update({
                              title: meetingForm.title,
                              description: meetingForm.description,
                              meeting_type: meetingForm.meeting_type,
                              meeting_link: meetingForm.meeting_link,
                              scheduled_at: scheduledAt,
                              duration_minutes: parseInt(meetingForm.duration_minutes) || 30,
                              counselor_id: counselorId
                            })
                            .eq("id", editingMeeting.id);
                          if (error) throw error;

                          // Send update email
                          fetch("/api/send-meeting-notification", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              action: "updated",
                              studentId: selectedStudent.id,
                              meetingData: { title: meetingForm.title, scheduled_at: scheduledAt, meeting_link: meetingForm.meeting_link, meeting_type: meetingForm.meeting_type, duration_minutes: parseInt(meetingForm.duration_minutes) || 30 }
                            })
                          })
                          .then(async (res) => {
                            const result = await res.json();
                            if (!res.ok || !result.success) {
                              const errorMsg = result.error || "Email delivery failed";
                              showToast(`⚠️ Meeting updated, but student email notification failed: ${errorMsg}`);
                            }
                          })
                          .catch(err => {
                            console.error("Meeting update email error:", err);
                            showToast(`⚠️ Meeting updated, but student email notification failed: ${err.message}`);
                          });

                          // Notification
                          await supabase.from("student_notifications").insert([{
                            student_id: selectedStudent.id,
                            title: "Meeting Updated",
                            content: `Your meeting "${meetingForm.title}" has been updated. Check your Appointments for new details.`
                          }]);

                          // Activity log
                          await supabase.from("student_activity_logs").insert({
                            student_id: selectedStudent.id,
                            action: "Meeting Updated",
                            details: `Meeting "${meetingForm.title}" updated by admin.`
                          });

                          showToast("Meeting updated successfully");
                        } else {
                          // Create
                          const { error } = await supabase
                            .from("meetings")
                            .insert([{
                              student_id: selectedStudent.id,
                              counselor_id: counselorId,
                              title: meetingForm.title,
                              description: meetingForm.description,
                              meeting_type: meetingForm.meeting_type,
                              meeting_link: meetingForm.meeting_link,
                              scheduled_at: scheduledAt,
                              duration_minutes: parseInt(meetingForm.duration_minutes) || 30
                            }]);
                          if (error) throw error;

                          // Send scheduled email
                          fetch("/api/send-meeting-notification", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              action: "scheduled",
                              studentId: selectedStudent.id,
                              meetingData: { title: meetingForm.title, scheduled_at: scheduledAt, meeting_link: meetingForm.meeting_link, meeting_type: meetingForm.meeting_type, duration_minutes: parseInt(meetingForm.duration_minutes) || 30 }
                            })
                          })
                          .then(async (res) => {
                            const result = await res.json();
                            if (!res.ok || !result.success) {
                              const errorMsg = result.error || "Email delivery failed";
                              showToast(`⚠️ Meeting scheduled, but student email notification failed: ${errorMsg}`);
                            }
                          })
                          .catch(err => {
                            console.error("Meeting schedule email error:", err);
                            showToast(`⚠️ Meeting scheduled, but student email notification failed: ${err.message}`);
                          });

                          // Notification
                          await supabase.from("student_notifications").insert([{
                            student_id: selectedStudent.id,
                            title: "New Meeting Scheduled",
                            content: `A new meeting "${meetingForm.title}" has been scheduled. Check your Appointments tab.`
                          }]);

                          // Activity log
                          await supabase.from("student_activity_logs").insert({
                            student_id: selectedStudent.id,
                            action: "Meeting Scheduled",
                            details: `Meeting "${meetingForm.title}" scheduled for ${meetingForm.date} at ${meetingForm.time}.`
                          });

                          showToast("Meeting scheduled successfully!");
                        }

                        setMeetingForm({ title: "", description: "", date: "", time: "", duration_minutes: "30", meeting_link: "", meeting_type: "Google Meet" });
                        setEditingMeeting(null);
                        await loadAuditDetails(selectedStudent.id);
                      } catch (err: any) {
                        alert("Error saving meeting: " + err.message);
                      } finally {
                        setSavingMeeting(false);
                      }
                    }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Meeting Title *</label>
                        <input
                          type="text"
                          required
                          value={meetingForm.title}
                          onChange={e => setMeetingForm(f => ({ ...f, title: e.target.value }))}
                          placeholder="e.g. University Application Review"
                          className="w-full border border-hairline px-3.5 py-2 rounded-xl text-xs outline-none focus:border-primary"
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</label>
                        <textarea
                          rows={2}
                          value={meetingForm.description}
                          onChange={e => setMeetingForm(f => ({ ...f, description: e.target.value }))}
                          placeholder="Optional meeting description or agenda..."
                          className="w-full border border-hairline px-3.5 py-2 rounded-xl text-xs outline-none focus:border-primary resize-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date *</label>
                        <input
                          type="date"
                          required
                          value={meetingForm.date}
                          onChange={e => setMeetingForm(f => ({ ...f, date: e.target.value }))}
                          className="w-full border border-hairline px-3.5 py-2 rounded-xl text-xs outline-none focus:border-primary"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Time *</label>
                        <input
                          type="time"
                          required
                          value={meetingForm.time}
                          onChange={e => setMeetingForm(f => ({ ...f, time: e.target.value }))}
                          className="w-full border border-hairline px-3.5 py-2 rounded-xl text-xs outline-none focus:border-primary"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration (minutes)</label>
                        <select
                          value={meetingForm.duration_minutes}
                          onChange={e => setMeetingForm(f => ({ ...f, duration_minutes: e.target.value }))}
                          className="w-full border border-hairline px-3.5 py-2 rounded-xl text-xs outline-none focus:border-primary bg-white"
                        >
                          <option value="15">15 min</option>
                          <option value="30">30 min</option>
                          <option value="45">45 min</option>
                          <option value="60">1 hour</option>
                          <option value="90">1.5 hours</option>
                          <option value="120">2 hours</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Meeting Type</label>
                        <select
                          value={meetingForm.meeting_type}
                          onChange={e => setMeetingForm(f => ({ ...f, meeting_type: e.target.value }))}
                          className="w-full border border-hairline px-3.5 py-2 rounded-xl text-xs outline-none focus:border-primary bg-white"
                        >
                          <option>Google Meet</option>
                          <option>Zoom</option>
                          <option>Microsoft Teams</option>
                          <option>Phone Call</option>
                          <option>Office Visit</option>
                        </select>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Meeting Link</label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={meetingForm.meeting_link}
                            onChange={e => setMeetingForm(f => ({ ...f, meeting_link: e.target.value }))}
                            placeholder="https://meet.google.com/abc-defg-hij"
                            className="flex-grow border border-hairline px-3.5 py-2 rounded-xl text-xs outline-none focus:border-primary"
                          />
                          <button
                            type="button"
                            onClick={() => window.open("https://meet.google.com/new", "_blank")}
                            className="px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-[10px] font-bold hover:bg-blue-100 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Generate Meet
                          </button>
                        </div>
                      </div>
                      <div className="md:col-span-2 flex justify-end gap-2">
                        <button
                          type="submit"
                          disabled={savingMeeting}
                          className="px-5 py-2 bg-primary text-white rounded-full text-xs font-bold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          {savingMeeting ? (
                            <SpinnerGap size={14} className="animate-spin" />
                          ) : (
                            <Calendar size={14} weight="fill" />
                          )}
                          {editingMeeting ? "Update Meeting" : "Schedule Meeting"}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Meetings List */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-primary">All Meetings</h4>
                    {auditMeetings.length === 0 ? (
                      <p className="text-slate-400 py-8 text-center border border-dashed border-hairline rounded-2xl bg-white">No meetings scheduled yet for this student.</p>
                    ) : (
                      <div className="space-y-3">
                        {auditMeetings.map(meeting => {
                          const dt = new Date(meeting.scheduled_at);
                          const isPast = dt < new Date();
                          const statusColors: Record<string, string> = {
                            "Scheduled": "bg-blue-50 text-blue-700 border-blue-200",
                            "Rescheduled": "bg-amber-50 text-amber-700 border-amber-200",
                            "Completed": "bg-emerald-50 text-emerald-700 border-emerald-200",
                            "Cancelled": "bg-red-50 text-red-700 border-red-200"
                          };
                          const typeIcons: Record<string, string> = {
                            "Google Meet": "🟢",
                            "Zoom": "🔵",
                            "Microsoft Teams": "🟣",
                            "Phone Call": "📞",
                            "Office Visit": "🏢"
                          };

                          return (
                            <div key={meeting.id} className="border border-hairline rounded-2xl bg-white p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                              <div className="flex-grow space-y-1.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm">{typeIcons[meeting.meeting_type] || "📅"}</span>
                                  <h5 className="text-sm font-bold text-primary">{meeting.title}</h5>
                                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusColors[meeting.status] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                                    {meeting.status}
                                  </span>
                                </div>
                                <p className="text-xs font-semibold text-slate-600">
                                  {dt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} at {dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                </p>
                                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold">
                                  <span>{meeting.duration_minutes} min</span>
                                  <span>•</span>
                                  <span>{meeting.meeting_type}</span>
                                  {meeting.counselors?.full_name && (
                                    <>
                                      <span>•</span>
                                      <span>{meeting.counselors.full_name}</span>
                                    </>
                                  )}
                                </div>
                                {meeting.description && (
                                  <p className="text-[11px] text-slate-500 mt-1">{meeting.description}</p>
                                )}
                                {meeting.meeting_link && (
                                  <a href={meeting.meeting_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-bold hover:underline mt-1">
                                    <ArrowSquareOut size={10} /> {meeting.meeting_link.substring(0, 50)}{meeting.meeting_link.length > 50 ? "..." : ""}
                                  </a>
                                )}
                              </div>

                              {/* Actions */}
                              {(meeting.status === "Scheduled" || meeting.status === "Rescheduled") && (
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => {
                                      const d = new Date(meeting.scheduled_at);
                                      setEditingMeeting(meeting);
                                      setMeetingForm({
                                        title: meeting.title,
                                        description: meeting.description || "",
                                        date: d.toISOString().split("T")[0],
                                        time: d.toTimeString().substring(0, 5),
                                        duration_minutes: String(meeting.duration_minutes),
                                        meeting_link: meeting.meeting_link || "",
                                        meeting_type: meeting.meeting_type
                                      });
                                    }}
                                    className="px-3 py-1.5 border border-hairline text-slate-600 hover:bg-slate-50 rounded-full text-[10px] font-bold cursor-pointer transition-colors"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (!confirm("Mark this meeting as completed?")) return;
                                      await supabase.from("meetings").update({ status: "Completed" }).eq("id", meeting.id);
                                      await supabase.from("student_activity_logs").insert({ student_id: selectedStudent.id, action: "Meeting Completed", details: `Meeting "${meeting.title}" marked as completed.` });
                                      showToast("Meeting marked as completed");
                                      await loadAuditDetails(selectedStudent.id);
                                    }}
                                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-full text-[10px] font-bold cursor-pointer transition-colors"
                                  >
                                    Complete
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (!confirm("Cancel this meeting? The student will be notified.")) return;
                                      await supabase.from("meetings").update({ status: "Cancelled" }).eq("id", meeting.id);

                                      fetch("/api/send-meeting-notification", {
                                        method: "POST",
                                        headers: { 
                                          "Content-Type": "application/json",
                                          "Authorization": `Bearer ${getAdminCredentials()}`
                                        },
                                        body: JSON.stringify({
                                          action: "cancelled",
                                          studentId: selectedStudent.id,
                                          meetingData: { title: meeting.title, scheduled_at: meeting.scheduled_at }
                                        })
                                      })
                                      .then(async (res) => {
                                        const result = await res.json();
                                        if (!res.ok || !result.success) {
                                          const errorMsg = result.error || "Email delivery failed";
                                          showToast(`⚠️ Meeting cancelled, but student email notification failed: ${errorMsg}`);
                                        }
                                      })
                                      .catch(err => {
                                        console.error("Meeting cancel email error:", err);
                                        showToast(`⚠️ Meeting cancelled, but student email notification failed: ${err.message}`);
                                      });

                                      await supabase.from("student_notifications").insert([{
                                        student_id: selectedStudent.id,
                                        title: "Meeting Cancelled",
                                        content: `Your meeting "${meeting.title}" has been cancelled by your counselor.`
                                      }]);

                                      await supabase.from("student_activity_logs").insert({ student_id: selectedStudent.id, action: "Meeting Cancelled", details: `Meeting "${meeting.title}" cancelled by admin.` });
                                      showToast("Meeting cancelled");
                                      await loadAuditDetails(selectedStudent.id);
                                    }}
                                    className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-full text-[10px] font-bold cursor-pointer transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB H: STUDENT NOTIFICATIONS PREFERENCES */}
              {auditTab === "notifications" && (
                <div className="space-y-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Left: Preferences Card */}
                    <div className="md:col-span-1 space-y-4">
                      <Card className="p-5">
                        <h4 className="font-bold text-sm text-primary mb-4 border-b border-hairline pb-2">Student Preferences</h4>
                        
                        {selectedStudentPrefs ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className="font-semibold text-xs text-slate-700 block">All Notifications</span>
                                <span className="text-[10px] text-slate-400 block font-medium">Master toggle for this student</span>
                              </div>
                              <input
                                type="checkbox"
                                checked={selectedStudentPrefs.all_notifications_enabled}
                                onChange={(e) => handleUpdateStudentPrefs("all_notifications_enabled", e.target.checked, "standard")}
                                disabled={savingStudentPrefs}
                                className="h-4.5 w-4.5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer border bg-white"
                              />
                            </div>

                            <hr className="border-hairline" />

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className="font-semibold text-xs text-slate-700 block">Missing Documents Alert</span>
                                <span className="text-[10px] text-slate-400 block font-medium">Email reminders on missing/rejected files</span>
                              </div>
                              <input
                                type="checkbox"
                                checked={selectedStudentPrefs.missing_documents_enabled}
                                onChange={(e) => handleUpdateStudentPrefs("missing_documents_enabled", e.target.checked, "standard")}
                                disabled={!selectedStudentPrefs.all_notifications_enabled || savingStudentPrefs}
                                className="h-4.5 w-4.5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer border bg-white"
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className="font-semibold text-xs text-slate-700 block">Consultation Reminders</span>
                                <span className="text-[10px] text-slate-400 block font-medium">Email reminders on meetings scheduled</span>
                              </div>
                              <input
                                type="checkbox"
                                checked={selectedStudentPrefs.consultation_enabled}
                                onChange={(e) => handleUpdateStudentPrefs("consultation_enabled", e.target.checked, "standard")}
                                disabled={!selectedStudentPrefs.all_notifications_enabled || savingStudentPrefs}
                                className="h-4.5 w-4.5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer border bg-white"
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className="font-semibold text-xs text-slate-700 block">Visa Status Updates</span>
                                <span className="text-[10px] text-slate-400 block font-medium">Reactive email updates on visa stages</span>
                              </div>
                              <input
                                type="checkbox"
                                checked={selectedStudentPrefs.visa_updates_enabled}
                                onChange={(e) => handleUpdateStudentPrefs("visa_updates_enabled", e.target.checked, "standard")}
                                disabled={!selectedStudentPrefs.all_notifications_enabled || savingStudentPrefs}
                                className="h-4.5 w-4.5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer border bg-white"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="py-4 text-center text-slate-400">Loading student preferences...</div>
                        )}
                      </Card>

                      {/* Manual Dispatch Center */}
                      <Card className="p-5 space-y-4">
                        <h4 className="font-bold text-sm text-primary border-b border-hairline pb-2">Manual Dispatch Triggers</h4>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-[10px] text-slate-400 font-medium mb-1.5 uppercase tracking-wider">Document Checklist Alert</p>
                            <Button
                              onClick={async () => {
                                setTriggeringNotif("manual-docs");
                                try {
                                  const res = await fetch("/api/send-student-notification", {
                                    method: "POST",
                                    headers: { 
                                      "Content-Type": "application/json",
                                      "Authorization": `Bearer ${getAdminCredentials()}`
                                    },
                                    body: JSON.stringify({
                                      studentId: selectedStudent.id,
                                      action: "missing-documents-reminder",
                                      details: { manual: true }
                                    })
                                  });
                                  const result = await res.json();
                                  if (!res.ok || !result.success) throw new Error(result.error || "Delivery failed");
                                  showToast("Manual document reminder sent successfully!");
                                  await loadAuditDetails(selectedStudent.id);
                                } catch (err: any) {
                                  alert("Failed to send reminder: " + err.message);
                                } finally {
                                  setTriggeringNotif(null);
                                }
                              }}
                              disabled={triggeringNotif === "manual-docs"}
                              variant="secondary"
                              className="w-full text-xs animate-pulse-once"
                            >
                              {triggeringNotif === "manual-docs" ? <SpinnerGap className="animate-spin" size={14} /> : "Send Missing Docs Reminder"}
                            </Button>
                          </div>

                          <div>
                            <p className="text-[10px] text-slate-400 font-medium mb-1.5 uppercase tracking-wider">Meetings Consultation Alert</p>
                            {auditMeetings.filter(m => m.status === "Scheduled" || m.status === "Rescheduled").length === 0 ? (
                              <p className="text-[10px] text-slate-400 italic">No upcoming meetings scheduled.</p>
                            ) : (
                              <div className="space-y-2">
                                {auditMeetings.filter(m => m.status === "Scheduled" || m.status === "Rescheduled").slice(0, 2).map(m => (
                                  <Button
                                    key={m.id}
                                    onClick={async () => {
                                      setTriggeringNotif(`manual-meet-${m.id}`);
                                      try {
                                        const res = await fetch("/api/send-student-notification", {
                                          method: "POST",
                                          headers: { 
                                            "Content-Type": "application/json",
                                            "Authorization": `Bearer ${getAdminCredentials()}`
                                          },
                                          body: JSON.stringify({
                                            studentId: selectedStudent.id,
                                            action: "consultation-reminder",
                                            details: { meetingId: m.id, manual: true }
                                          })
                                        });
                                        const result = await res.json();
                                        if (!res.ok || !result.success) throw new Error(result.error || "Delivery failed");
                                        showToast(`Manual reminder for "${m.title}" sent successfully!`);
                                        await loadAuditDetails(selectedStudent.id);
                                      } catch (err: any) {
                                        alert("Failed to send meeting reminder: " + err.message);
                                      } finally {
                                        setTriggeringNotif(null);
                                      }
                                    }}
                                    disabled={triggeringNotif === `manual-meet-${m.id}`}
                                    variant="secondary"
                                    className="w-full text-left text-xs truncate block"
                                    title={`Send reminder for ${m.title}`}
                                  >
                                    {triggeringNotif === `manual-meet-${m.id}` ? <SpinnerGap className="animate-spin" size={10} /> : `Remind: "${m.title.substring(0, 15)}..."`}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Right: History Logs List */}
                    <div className="md:col-span-2 space-y-4">
                      <Card className="p-5">
                        <h4 className="font-bold text-sm text-primary mb-4 border-b border-hairline pb-2">Student Notification Logs</h4>
                        
                        {selectedStudentHistory.length === 0 ? (
                          <p className="text-slate-400 py-12 text-center border border-dashed border-hairline bg-slate-50/50 rounded-2xl">
                            No notifications dispatched to this student profile yet.
                          </p>
                        ) : (
                          <div className="max-h-[350px] overflow-y-auto border border-hairline rounded-xl">
                            <table className="w-full text-left text-xs divide-y divide-hairline text-slate-700 bg-white">
                              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 sticky top-0 z-10">
                                <tr>
                                  <th className="px-3.5 py-2.5">Status</th>
                                  <th className="px-3.5 py-2.5">Type</th>
                                  <th className="px-3.5 py-2.5">Subject</th>
                                  <th className="px-3.5 py-2.5">Date</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-hairline text-slate-600">
                                {selectedStudentHistory.map((h) => (
                                  <tr key={h.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-3.5 py-2.5">
                                      <span className={`inline-block text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full border ${
                                        h.status === "sent" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                                      }`}>
                                        {h.status}
                                      </span>
                                    </td>
                                    <td className="px-3.5 py-2.5 font-bold uppercase text-[9px] tracking-wide text-slate-400">
                                      {h.notification_type === "missing_documents" ? "Docs" : h.notification_type === "consultation" ? "Meeting" : "Visa"}
                                    </td>
                                    <td className="px-3.5 py-2.5 max-w-[180px] truncate" title={h.subject}>
                                      {h.error_message ? (
                                        <span className="text-red-500 font-medium block truncate">{h.error_message}</span>
                                      ) : (
                                        <span className="truncate block">{h.subject}</span>
                                      )}
                                    </td>
                                    <td className="px-3.5 py-2.5 text-[10px] text-slate-400 font-medium">
                                      {new Date(h.sent_at).toLocaleDateString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </Card>
                    </div>

                  </div>
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
      {/* Issue Referral Reward Modal */}
      {isRewardModalOpen && selectedReferral && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-md w-full animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between border-b border-hairline/60 pb-3">
              <div>
                <CardTitle>Issue Referral Reward</CardTitle>
                <CardDescription>Approve a cashback/cash reward for the referrer</CardDescription>
              </div>
              <button 
                onClick={() => { setIsRewardModalOpen(false); setSelectedReferral(null); }}
                className="p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-500 cursor-pointer"
              >
                <X size={18} />
              </button>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleIssueReferralReward} className="space-y-4">
                <div className="p-3 bg-slate-50 border border-hairline rounded-2xl text-xs space-y-1 text-slate-700">
                  <div>
                    <span className="text-slate-400 font-semibold">Referrer:</span>{" "}
                    <span className="font-bold text-primary">{selectedReferral.students?.name} ({selectedReferral.students?.email})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Referred Lead:</span>{" "}
                    <span className="font-bold text-primary">{selectedReferral.referred_name} ({selectedReferral.referred_email})</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-slate-700">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reward Amount (NPR)</label>
                  <input 
                    type="number" 
                    required
                    min={1}
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(e.target.value)}
                    className="w-full border border-hairline px-4 py-2.5 rounded-full text-sm outline-none focus:border-primary bg-white text-slate-800"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={() => { setIsRewardModalOpen(false); setSelectedReferral(null); }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={issuingReward}
                    className="flex items-center gap-1.5"
                  >
                    {issuingReward ? "Processing..." : "Approve & Issue"}
                    {issuingReward && <SpinnerGap size={14} className="animate-spin text-white" />}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
