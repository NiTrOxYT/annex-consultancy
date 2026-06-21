# Annex Consultancy Routing Map

This document catalogs all user-accessible frontend routes, dynamic page layouts, backend API endpoints, middleware filters, and authorization policies.

---

## 1. Middleware Configuration
The routing router is guarded on the server side by `src/middleware.ts`:
* **Path Matcher:** Targets `/admin/:path+` (e.g. `/admin/students`, `/admin/settings`, etc.).
* **Bypass Routes:** Explicitly excludes the landing page `/admin`, `/admin/login`, and `/admin/access-denied`.
* **Verification Actions:**
  1. Checks for cookie `annex_admin_token`.
  2. Bypasses checks if the cookie matches `ADMIN_PASSWORD` (legacy super-admin).
  3. Otherwise, calls `/api/admin/rbac?action=get-current-user-perms` using authorization header. If unauthorized, redirects to `/admin?error=session-invalid`.
  4. Resolves the requested tab segments (e.g., `/admin/students` -> `students` segment) to database permissions (e.g. "Students"). If the counselor lacks that permission, redirects to `/admin?error=access-denied`.

---

## 2. Frontend Page Routes

| Route Pattern | Component File | Auth Required | Purpose |
|---|---|---|---|
| `/` | `src/app/page.tsx` | None | Primary portal landing page |
| `/about` | `src/app/about/page.tsx` | None | Agency background, staff listings, philosophy |
| `/contact` | `src/app/contact/page.tsx` | None | Contact forms, location details, booking inputs |
| `/cookie-settings` | `src/app/cookie-settings/page.tsx` | None | Cookie configuration editor |
| `/privacy-policy` | `src/app/privacy-policy/page.tsx` | None | User privacy statements |
| `/terms-of-service` | `src/app/terms-of-service/page.tsx` | None | Standard consultancy user agreement |
| `/blog` | `src/app/blog/page.tsx` | None | Resource blogs and news items |
| `/success-stories` | `src/app/success-stories/page.tsx` | None | Student testimonials, university admissions |
| `/study-in-india` | `src/app/study-in-india/page.tsx` | None | Placements guides for universities in India |
| `/study-abroad` | `src/app/study-abroad/page.tsx` | None | Global study abroad countries directory |
| `/study-abroad/[country]`| `src/app/study-abroad/[country]/page.tsx` | None | Specific country admissions specifications |
| `/test-preparation` | `src/app/test-preparation/page.tsx` | None | Redirects to `/test-preparation/ielts` |
| `/test-preparation/[course]`| `src/app/test-preparation/[course]/page.tsx` | None | Dynamic test preparation info (IELTS, PTE, CMAT) |
| `/training-placement` | `src/app/training-placement/page.tsx` | None | Career placement landing page and leads capturer |
| `/student-login` | `src/app/student-login/page.tsx` | None | Authentication login form for candidates |
| `/student/dashboard` | `src/app/student/dashboard/page.tsx` | Candidate Session | Student Portal with stage trackers, doc slots, chat |
| `/career-portal` | `src/app/career-portal/page.tsx` | Placement Session | Career student portal with task lists, files, chat |
| `/admin` | `src/app/admin/page.tsx` | Counselor Session | Core admin controller home panel |
| `/admin/[tab]` | `src/app/admin/[tab]/page.tsx` | Counselor Session | Dynamic tabs router for counselor panel |

---

## 3. Serverless API Routes

| API Endpoint | Route File | Method | Auth Required | Purpose |
|---|---|---|---|---|
| `/api/admin/notifications` | `src/app/api/admin/notifications/route.ts` | `GET` | Admin / Counselor | Fetch settings settings, preference lists, delivery logs |
| | | `POST` | Admin / Counselor | Update notification settings or student settings values |
| `/api/admin/rbac` | `src/app/api/admin/rbac/route.ts` | `GET` | Admin / Counselor | Retrieve session permissions, roles default matrix, overrides |
| | | `POST` | Admin / Counselor | Create roles, assign overrides, provision counselor accounts |
| `/api/cron/notifications` | `src/app/api/cron/notifications/route.ts` | `GET` | Cron Secret / Admin | Schedule trigger checking documents and consultations |
| `/api/send-student-notification` | `src/app/api/send-student-notification/route.ts` | `POST` | Admin / Counselor | Trigger notification updates for visa, docs, meetings |
| `/api/send-career-notification` | `src/app/api/send-career-notification/route.ts` | `POST` | Admin / Counselor | Career placement notifications dispatch controller |
| `/api/send-chat-notification` | `src/app/api/send-chat-notification/route.ts` | `POST` | Active Client | Send emails when student or counselor post chat messages |
| `/api/send-meeting-notification` | `src/app/api/send-meeting-notification/route.ts` | `POST` | Counselor / System | Trigger meeting notifications for scheduling, edits, reminders |
| `/api/test-email` | `src/app/api/test-email/route.ts` | `POST` | Admin | Verify email settings parameters via test relays |
| `/api/career-auth-debug` | `src/app/api/career-auth-debug/route.ts` | `GET` | None (Diagnostic) | Validate database auth linkage profiles |
| `/api/email-debug` | `src/app/api/email-debug/route.ts` | `GET` | None (Diagnostic) | Confirm Brevo mailing connection status parameters |
| `/api/email-status` | `src/app/api/email-status/route.ts` | `GET` | None (Diagnostic) | Retrieve status values for mail variables |
