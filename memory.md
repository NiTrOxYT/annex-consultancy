# Codebase Memory: Annex Consultancy Platform

This document serves as the permanent core intelligence brain for the **Annex Educational Consultancy Platform**. It outlines the design decisions, system architectures, database relationships, routing topologies, data flows, and configuration setups for developers and system maintainers.

---

## 1. Project Overview & Business Purpose
The **Annex Educational Consultancy** system is a modern, high-end platform designed to streamline student consultation, admissions, visa tracking, and test preparation. It serves three distinct user classes:
1. **Public Users:** Prospective students exploring overseas study destinations (UK, Australia, Europe, Dubai, Italy), studying in India, success stories, blog posts, test preparation courses (IELTS, PTE, CMAT), and booking admissions consultations.
2. **Standard Students:** Formally enrolled candidates seeking overseas admissions. They upload documents, track application milestones (e.g. conditional offers, unconditional offers, CAS letters), verify visa progression stages, participate in counselor messaging, and manage scheduled consultations.
3. **Career (Training & Placement) Students:** Candidates enrolled in specialized training and career services. They manage course tasks, upload resumes/qualifications, view scheduled placement prep meetings, and chat with placement mentors.
4. **Counselors & Administrative Staff (Admin Panel):** Employees managing bookings, student progression, document checking, visa updates, CMS (universities, blog posts, success stories, career experts), role-based permissions (RBAC), and email dispatch settings.

---

## 2. Tech Stack Summary
* **Frontend Framework:** Next.js v16.2.9 (App Router) & React v19.2.4
* **Database & BaaS:** Supabase (PostgreSQL, Realtime replication, Storage buckets)
* **Authentication:** Supabase Auth (Cookie-based middleware protection, custom triggers)
* **Styling & Theme:** Tailwind CSS v4.0.0 (using `@tailwindcss/postcss` and PostCSS v8, Geist Font families)
* **Animations:** Motion (formerly Framer Motion, specifically `motion/react`)
* **Scroll Engineering:** Lenis (Smooth Scroll client provider with device performance detection)
* **Outbound Notifications:** Nodemailer & Brevo SMTP integration with transactional logging
* **Diagnostic & Analytics:** Google Analytics (`@next/third-parties/google`), Microsoft Clarity script injection

---

## 3. Repository Structure
The repository is structured as a standard Next.js App Router application:
* `/src`
  * `/app` — Application routing directory (pages, API routes, layouts, CSS files)
  * `/components` — Reusable visual components and UI library wrappers
  * `/lib` — Configuration clients and helper libraries (Supabase, email, auth, utilities)
* `/supabase`
  * `schema.sql` — Main database schema declaration including tables, triggers, and storage buckets
  * `/migrations` — Database migration history files (001-007)
* `/public` — Public static assets (images, logos)
* `Audit-reports` — Security reports and vulnerability auditing details

---

## 4. System Architecture
The application follows a secure web app architecture integrating a client frontend with serverless API route handlers and a PostgreSQL backend via Supabase.

```
+-------------------------------------------------------------+
|                        Browser Client                       |
|   (Next.js Client Components, Motion React, Lenis Scroll)    |
+------------------------------+------------------------------+
                               |
                        HTTPS (REST / JSON)
                               |
                               v
+-------------------------------------------------------------+
|                      Next.js API Layer                      |
| (verifyAdminSession Middleware / Brevo SMTP Nodemailer engine) |
+------------------------------+------------------------------+
                               |
                   PostgreSQL / Storage Commands
                               |
                               v
+-------------------------------------------------------------+
|                    Supabase Cloud Backend                   |
|   (PostgreSQL DB, RLS Policies, Storage bucket, Realtime)   |
+-------------------------------------------------------------+
```

---

## 5. Routing Map (Routes Table)

| Route | File Path | Access/Auth Required | Purpose |
|---|---|---|---|
| `/` | `src/app/page.tsx` | Public | Asymmetric homepage with trust metrics, destination cards, bento features |
| `/about` | `src/app/about/page.tsx` | Public | Agency history, mission statement, values, team bios |
| `/contact` | `src/app/contact/page.tsx` | Public | Interactive contact form and admissions booking portal |
| `/cookie-settings` | `src/app/cookie-settings/page.tsx` | Public | Dynamic Cookie preferences tracking |
| `/privacy-policy` | `src/app/privacy-policy/page.tsx` | Public | Standard company privacy disclosures |
| `/terms-of-service` | `src/app/terms-of-service/page.tsx` | Public | Company terms and regulations agreement |
| `/blog` | `src/app/blog/page.tsx` | Public | News, student guides, resource directories |
| `/success-stories` | `src/app/success-stories/page.tsx` | Public | Alumni testimonials, placement metrics, study countries |
| `/study-in-india` | `src/app/study-in-india/page.tsx` | Public | Specialized placements for Indian Universities |
| `/study-abroad` | `src/app/study-abroad/page.tsx` | Public | Directory of all supported study countries |
| `/study-abroad/[country]`| `src/app/study-abroad/[country]/page.tsx` | Public | Country-specific admissions guides (e.g. UK, AU) |
| `/test-preparation` | `src/app/test-preparation/page.tsx` | Public | Redirects to `/test-preparation/ielts` |
| `/test-preparation/[course]`| `src/app/test-preparation/[course]/page.tsx` | Public | Dynamic preparation details (IELTS, PTE, CMAT) |
| `/training-placement` | `src/app/training-placement/page.tsx` | Public | Career services lead intake |
| `/student-login` | `src/app/student-login/page.tsx` | Public | Student Portal login interface |
| `/student/dashboard` | `src/app/student/dashboard/page.tsx` | Authenticated (Student) | Standard student portal dashboard |
| `/career-portal` | `src/app/career-portal/page.tsx` | Authenticated (Career Student) | Career training student portal dashboard |
| `/admin` | `src/app/admin/page.tsx` | Authenticated (Admin/Counselor)| Monolithic Admin Panel dashboard |
| `/admin/[tab]` | `src/app/admin/[tab]/page.tsx` | Authenticated (Admin/Counselor)| Dynamic routing wrapper for Admin tab views |

---

## 6. Frontend Architecture
The client interface leverages modern UI conventions:
* **Layout Structure (`src/app/layout.tsx`):** Sets Geist Sans/Mono fonts globally, mounts the custom `ScrollManager`, injects `Clarity` analytics, and includes the `GoogleAnalytics` tracker.
* **Navigation Components (`src/components/navigation.tsx`, `src/components/footer.tsx`):** Shared responsive elements with micro-animations.
* **Bento Grid Layouts:** Leveraged heavily on the homepage and student portal views using high contrast borders, light cards (`bg-white`), and monospace data widgets.
* **State Management:** Local React state (`useState`, `useRef`, `useContext`) is used for UI and tabs. Direct Supabase real-time client subscriptions keep chat logs, task tables, and counselor interactions synchronized instantly without page refreshes.

---

## 7. Backend Architecture
The backend is completely serverless, residing inside Next.js serverless route handlers:
* **RBAC Route Guarding:** Handled via a robust middleware validator `verifyAdminSession(...)` inside `/src/lib/adminAuth.ts`. It parses `annex_admin_token` cookies, JWT header Bearers, or API keys, checks them against the database `counselors` profile linked via `auth_user_id`, and determines if the current session possesses the required permissions.
* **Email Engine:** Node-based mailing system utilizing `nodemailer` to relay structured HTML emails using Brevo SMTP details. It logs all delivered mails in the `email_logs` table for administrative verification.

---

## 8. Database Architecture
Annex uses Supabase (Postgres) with Row Level Security (RLS) policies configured for user safety.

### Entity Relationship Mapping
```
   +----------------------+               +-----------------------+
   |      counselors      | <-----------+ |      user_roles       |
   +----------+-----------+               +-----------+-----------+
              |                                       |
              | 1:N                                   | 1:N
              v                                       v
   +----------+-----------+               +-----------+-----------+
   |       students       |               |   role_permissions    |
   +----+-----+-----+-----+               +-----------------------+
        |     |     |
    1:N | 1:N | 1:N | 1:N
        |     |     +-------------------------+
        |     |                               |
        v     v                               v
+-------+--+ +----+-----+                 +---+----+
| documents| |messages  |                 |meetings|
+----------+ +----------+                 +---+----+
                                              ^
   +----------------------+                   |
   |  training_students   | +-----------------+ 1:N (training_student_id)
   +----+-----+-----+-----+
        |     |     |
    1:N | 1:N | 1:N |
        |     |     +-------------------------+
        |     |                               |
        v     v                               v
+-------+--+ +----+-----+                 +---+----+
|  tasks   | |messages  |                 |docs    |
+----------+ +----------+                 +--------+
```

---

## 9. Authentication & Impersonation Flows
1. **Student Login:** Done via `supabase.auth.signInWithPassword` using email and password. Success redirects to `/student/dashboard` or `/career-portal`.
2. **Counselor Login:** Done by setting a custom cookie `annex_admin_token` when checking passwords. The system supports super-admin passkey bypass checking using `ADMIN_PASSWORD` (non-public secret) or JWT tokens mapping to `auth.users` linked to counselors profiles.
3. **Impersonation Support:** Admins can impersonate students. It is currently driven by writing student IDs in client-side `sessionStorage` keys `annex_impersonate_student_id` or `annex_impersonate_training_id`. If set, the portal falls back to queries targeted to that student. (Hardening is proposed in Phase 1 to move verification server-side).

---

## 10. API Route Inventory

| Method | Route | Purpose | Authorized User Class |
|---|---|---|---|
| `GET` | `/api/admin/notifications` | Fetches notification settings, global switches, preferences, audit histories | Admin/Counselor |
| `POST` | `/api/admin/notifications` | Updates system setting values (action: `toggle-global`), student variables (action: `update-prefs`)| Admin/Counselor |
| `GET` | `/api/admin/rbac` | Gets user permissions, role mappings, counselor overrides | Admin/Counselor |
| `POST` | `/api/admin/rbac` | Configures roles (action: `create-role`/`edit-role`), overrides, provisions logins | Admin/Counselor |
| `GET` | `/api/cron/notifications` | Triggers scheduler checking missing files or upcoming consultations | Vercel Cron/Admin Key |
| `POST` | `/api/send-student-notification`| Sends notification updates for visa, missing documents, consultations | Admin/Counselor |
| `POST` | `/api/send-career-notification` | Sends notifications for placement services, tasks, activation details | Admin/Counselor |
| `POST` | `/api/send-chat-notification` | Dispatches emails when chats are sent between students and counselors | Student or Counselor |
| `POST` | `/api/send-meeting-notification`| Triggers scheduling, cancel, update alerts or reminder scans | Admin or System Cron |
| `POST` | `/api/test-email` | Sends diagnostic HTML emails to confirm SMTP parameters | Admin |
| `GET` | `/api/career-auth-debug` | Evaluates link issues between auth and training students | Public/Diagnostic |
| `GET` | `/api/email-debug` | Diagnostic test verifying Brevo server parameters | Public/Diagnostic |
| `GET` | `/api/email-status` | Diagnostic tool returning environment variable status | Public/Diagnostic |

---

## 11. Data Flow Diagrams

### Consultation Booking Flow
1. User completes fields in `/contact` consultation form.
2. React client fires insert command directly into `bookings` table.
3. RLS policy `Allow public insert on bookings` resolves to true. Record is saved.
4. Admin panel listens in real-time, refreshing the bookings table instantly.

### Automated Cron Check Flow (Missing Documents)
1. External cron service calls `/api/cron/notifications` with `Authorization: Bearer <CRON_SECRET>`.
2. Handler checks database settings key `notifications_enabled` in `system_settings`.
3. If true, query active students. Check if documents matching mandatory set (Passport, SOP, LOR, etc.) are present in `student_documents`.
4. If missing, check `notification_history` to verify if a notification was sent in the last 24 hours.
5. If no cooldown is active, SMTP engine dispatches warning email. Log the transaction as "sent" in `notification_history`.

---

## 12. Environment Configurations & Secrets
* `NEXT_PUBLIC_SUPABASE_URL` - Supabase host URL.
* `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key allowing database read/write queries.
* `SUPABASE_SERVICE_ROLE_KEY` - Bypass RLS key used strictly on server-side handlers.
* `ADMIN_PASSWORD` - Secret master credential for administrative bypass and configuration updates.
* `CRON_SECRET` - Shared token protecting scheduling API calls.
* `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - Brevo connection credentials.
* `NEXT_PUBLIC_GA_ID` - Google Analytics identification token.
* `NEXT_PUBLIC_CLARITY_ID` - Clarity session recorder token.

---

## 13. System Health & Technical Debt
* **Impending Debug Deletions:** Diagnostic pages (`/api/career-auth-debug`, `/api/email-debug`, `/api/email-status`) bypass authorization, creating data leakage targets. A remediation plan (`SECURITY_FIX_PLAN.md`) is active to restrict or remove these endpoints.
* **Large Monolithic Codebases:** `src/app/admin/page.tsx` and `src/app/student/dashboard/page.tsx` represent huge page sizes (520KB and 110KB). Refactoring these into segmented files under component folders would increase build speed and maintainability.
* **Impersonation Vulnerability:** Checking `sessionStorage` values for student identities allows clients to query other records. Moving validation to server-side tokens is a planned Phase 1 goal.

---

## 14. Development & Deployment Processes
* **Local Run:** Start dev environment with `npm run dev` or `pnpm dev`. Local credentials can be defined in a `.env.local` file.
* **Database Updates:** Database tables and variables are declared in `supabase/schema.sql` and run sequentially using migrations (`supabase/migrations/*`).
* **Deployments:** The application is built and hosted via Vercel (`vercel.json`), reading build variables from the environment panel.
