# Annex Consultancy Dependency Map

This document catalogues the files inside the Annex Consultancy codebase, mapping their relationships, critical impact scopes, and integration paths.

---

## 1. Monolithic Component Interfaces (High Impact)
These files represent key client-side UI pages. Modifications here carry significant risk as they integrate data fetching, real-time messaging subscriptions, document uploads, and state trackers in large monolithic blocks.

### A. Admin Dashboard Portal
* **File Path:** [`src/app/admin/page.tsx`](file:///Users/sourik/projects/Annex/src/app/admin/page.tsx)
* **Direct Import Dependencies:**
  * `src/lib/supabase.ts` — Client database queries
  * `src/components/navigation.tsx` & `src/components/footer.tsx` — Navigation layouts
  * `src/components/ui/card.tsx` & `src/components/ui/button.tsx` — Core visual containers
  * Phosphor Icons (`@phosphor-icons/react`)
* **Downstream Consumers:**
  * [`src/app/admin/[tab]/page.tsx`](file:///Users/sourik/projects/Annex/src/app/admin/%5Btab%5D/page.tsx) (Dynamic routing tab wrapper)
* **Risk Scope:** High. Contains more than 6,800 lines of React/Tailwind code managing the entire administration workspace.

### B. Student Dashboard Portal
* **File Path:** [`src/app/student/dashboard/page.tsx`](file:///Users/sourik/projects/Annex/src/app/student/dashboard/page.tsx)
* **Direct Import Dependencies:**
  * `src/lib/supabase.ts`
  * Phosphor Icons
  * `src/components/ui/card.tsx`
  * `src/components/ui/button.tsx`
* **Risk Scope:** Medium-High. Drives document updates, chat exchanges, and stage trackers for enrolled study-abroad candidates.

### C. Career placement dashboard Portal
* **File Path:** [`src/app/career-portal/page.tsx`](file:///Users/sourik/projects/Annex/src/app/career-portal/page.tsx)
* **Direct Import Dependencies:**
  * `src/lib/supabase.ts`
  * Phosphor Icons
  * `src/components/ui/card.tsx`
  * `src/components/ui/button.tsx`
* **Risk Scope:** Medium-High. Manages training tasks, mentoring schedules, and resume reviews for career placement students.

---

## 2. Utility & Configuration Services (Core System Files)
These files implement standard client connections and API utilities. Avoid editing these files unless changing global parameters, as it can cause application-wide database or SMTP connection failures.

### A. Supabase Client Configurations
* **Files:** [`src/lib/supabase.ts`](file:///Users/sourik/projects/Annex/src/lib/supabase.ts) (Anon client) & [`src/lib/supabaseAdmin.ts`](file:///Users/sourik/projects/Annex/src/lib/supabaseAdmin.ts) (RLS Bypass Admin client)
* **Risk Scope:** Critical. Breaks all database interactions if misconfigured.

### B. Email Despatch Engine
* **File Path:** [`src/lib/email.ts`](file:///Users/sourik/projects/Annex/src/lib/email.ts)
* **Direct Dependencies:** `nodemailer` SMTP client, Brevo server parameters.
* **Risk Scope:** Critical. Drives all automated notifications, chat messages, and meeting update alerts.

### C. RBAC Guard Validator
* **File Path:** [`src/lib/adminAuth.ts`](file:///Users/sourik/projects/Annex/src/lib/adminAuth.ts)
* **Risk Scope:** High. Protects counselor/admin API controllers and enforces RBAC rules.

---

## 3. Global Interceptors
* **File Path:** [`src/middleware.ts`](file:///Users/sourik/projects/Annex/src/middleware.ts)
* **Downstream Consumers:** Intercepts every route matching `/admin/:path+`.
* **Risk Scope:** High. Any compile error or response rejection inside middleware blocks access to the counselor workspace.
