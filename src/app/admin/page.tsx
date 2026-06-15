"use client";

import * as React from "react";
import { Sparkle, ShieldCheck, SignOut, Trash, Plus, FileText, Calendar, Users, Eye, CheckCircle, XCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

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

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [authError, setAuthError] = React.useState("");
  
  // Dashboard Tabs
  const [activeTab, setActiveTab] = React.useState<"bookings" | "universities" | "cms">("bookings");

  // Data states
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Auth Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "annex-admin2026") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid admin access key.");
    }
  };

  // Fetch Bookings
  const fetchBookings = React.useCallback(async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setBookings(data || []);
      } else {
        // Fallback localStorage read
        const local = JSON.parse(localStorage.getItem("annex_bookings") || "[]");
        // Sort descending
        local.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setBookings(local);
      }
    } catch (err: any) {
      console.error("Error loading bookings:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated, fetchBookings]);

  // Update Booking Status
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from("bookings")
          .update({ status: newStatus })
          .eq("id", id);
        if (error) throw error;
      } else {
        const local = JSON.parse(localStorage.getItem("annex_bookings") || "[]");
        const updated = local.map((b: any) => (b.id === id ? { ...b, status: newStatus } : b));
        localStorage.setItem("annex_bookings", JSON.stringify(updated));
      }
      fetchBookings();
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    }
  };

  // Delete Booking
  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from("bookings").delete().eq("id", id);
        if (error) throw error;
      } else {
        const local = JSON.parse(localStorage.getItem("annex_bookings") || "[]");
        const updated = local.filter((b: any) => b.id !== id);
        localStorage.setItem("annex_bookings", JSON.stringify(updated));
      }
      fetchBookings();
    } catch (err: any) {
      alert("Error deleting record: " + err.message);
    }
  };

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
    <main className="min-h-[100dvh] bg-white text-left flex flex-col">
      {/* Admin Navbar */}
      <header className="border-b border-hairline px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck size={24} className="text-primary" weight="fill" />
            <span className="font-display font-bold text-lg text-primary tracking-tight">ANNEX ADMIN</span>
          </div>
          
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
                activeTab === "bookings" ? "bg-primary text-white" : "text-slate-500 hover:text-primary"
              }`}
            >
              Consultations ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab("universities")}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
                activeTab === "universities" ? "bg-primary text-white" : "text-slate-500 hover:text-primary"
              }`}
            >
              Universities
            </button>
            <button
              onClick={() => setActiveTab("cms")}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
                activeTab === "cms" ? "bg-primary text-white" : "text-slate-500 hover:text-primary"
              }`}
            >
              CMS Articles
            </button>
          </nav>
        </div>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-primary transition-colors cursor-pointer"
        >
          <SignOut size={16} /> Sign Out
        </button>
      </header>

      {/* Main Panel Content */}
      <div className="flex-grow p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {activeTab === "bookings" && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-xl text-primary">Intake Pipelines & Booking Calendar</h2>
                <p className="text-xs text-slate-400 mt-1">Student booking leads captured from public consultation forms.</p>
              </div>
              <Button variant="secondary" size="sm" onClick={fetchBookings}>Refresh Records</Button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-400 text-xs font-semibold">Loading data...</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-hairline rounded-2xl text-slate-400 text-xs font-semibold">
                No active consultation bookings yet.
              </div>
            ) : (
              <div className="border border-hairline rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-subtle-gray border-b border-hairline text-slate-500 font-bold uppercase tracking-wider">
                      <th className="p-4">Student</th>
                      <th className="p-4">Destination</th>
                      <th className="p-4">Preferred Date/Time</th>
                      <th className="p-4">Notes</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {bookings.map((booking) => (
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
                        <td className="p-4 max-w-[200px] truncate text-slate-500" title={booking.notes}>
                          {booking.notes || "None"}
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
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => updateStatus(booking.id, "Confirmed")}
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors cursor-pointer"
                            title="Confirm"
                          >
                            <CheckCircle size={16} weight="fill" />
                          </button>
                          <button
                            onClick={() => updateStatus(booking.id, "Cancelled")}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Cancel"
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
          </section>
        )}

        {activeTab === "universities" && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-xl text-primary">University Management</h2>
                <p className="text-xs text-slate-400 mt-1">Manage global university placement partner records.</p>
              </div>
              <Button variant="primary" size="sm" className="flex items-center gap-1">
                <Plus size={14} /> Add University
              </Button>
            </div>
            
            <div className="p-6 border border-dashed border-hairline rounded-2xl text-center text-slate-400 text-xs font-semibold">
              University directory operations are linked directly to Supabase table updates.
            </div>
          </section>
        )}

        {activeTab === "cms" && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-xl text-primary">CMS Articles</h2>
                <p className="text-xs text-slate-400 mt-1">Manage blog articles and success placement story grids.</p>
              </div>
              <Button variant="primary" size="sm" className="flex items-center gap-1">
                <Plus size={14} /> New Post
              </Button>
            </div>

            <div className="p-6 border border-dashed border-hairline rounded-2xl text-center text-slate-400 text-xs font-semibold">
              Post publishing triggers and draft saves are linked directly to public.posts.
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
