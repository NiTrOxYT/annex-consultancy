"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Envelope, LockKey, ArrowRight, Warning, GraduationCap } from "@phosphor-icons/react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function StudentLogin() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Check if student is already logged in
  React.useEffect(() => {
    const checkSession = async () => {
      // Check impersonation first
      if (typeof window !== "undefined") {
        const impersonatedId = sessionStorage.getItem("annex_impersonate_student_id");
        if (impersonatedId) {
          router.push("/student/dashboard");
          return;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Double check status is active
        const { data: student } = await supabase
          .from("students")
          .select("status")
          .eq("id", session.user.id)
          .single();

        if (student && student.status === "Active") {
          router.push("/student/dashboard");
        }
      }
    };
    checkSession();
  }, [router]);

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
      // 1. Sign in with password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error("Login failed. No user found.");
      }

      // 2. Fetch student profile to verify status
      const { data: student, error: dbError } = await supabase
        .from("students")
        .select("status, name")
        .eq("id", authData.user.id)
        .single();

      if (dbError) {
        // User authenticated but no student record - maybe admin or non-student user
        await supabase.auth.signOut();
        throw new Error("This account is not configured as a student profile. Please contact Admin.");
      }

      if (student.status !== "Active") {
        // Disabled student account
        await supabase.auth.signOut();
        throw new Error("Your student portal account has been disabled. Please contact your counselor.");
      }

      // Clean up any old impersonation state
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("annex_impersonate_student_id");
      }

      // Success, route to dashboard
      router.push("/student/dashboard");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />

      <main className="flex-grow pt-32 pb-24 bg-white min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-subtle-gray border border-hairline/80 text-primary mb-4">
              <GraduationCap size={28} className="text-primary" weight="fill" />
            </div>
            <h1 className="font-display font-bold text-3xl text-primary tracking-tight mb-2">
              Student Portal
            </h1>
            <p className="text-slate-500 text-sm">
              Annex Consultancy Educational Portal
            </p>
          </div>

          <Card className="shadow-xl">
            <CardHeader className="text-center pb-2">
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>
                Sign in to view your progress, documents, and chat with your counselor.
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
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-full border border-hairline focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-sm transition-all bg-white"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Password
                    </label>
                  </div>
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

                <div className="text-center mt-6">
                  <p className="text-xs text-slate-400">
                    Credentials are generated and reset only by your assigned counselor.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
}
