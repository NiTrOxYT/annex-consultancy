# Annex Consultancy Platform Project Memory

This directory acts as the permanent knowledge base for the **Annex Educational Consultancy Platform**. It tracks architecture, database relations, routing, authentication, and layout standards to ensure design consistency and prevent code duplication.

---

## 1. Project Overview
* **Project Name:** Annex Consultancy
* **Purpose:** A premium overseas education consultancy portal. Helps students check eligibility, book consultations, upload documents, check visa timelines, chat with counselors, and refer friends.
* **Business Model:** Structured lead intake and counseling, career preparation services, and student placement analytics.
* **Main Users:**
  1. **Public Users:** Prospective students exploring destinations, courses, and calculating study-abroad eligibility.
  2. **Standard Students:** Enrolled candidates tracking admissions (offers, visa checkpoints, document checks) and referrals.
  3. **Career Candidates:** Candidates doing career training and placement.
  4. **Counselors / Admins:** Staff managing student records, leads registry, daily followup queue, timelines, and bookings.

---

## 2. Folder Structure
* `src/app/` — App Router pages, page views, and `/api/` endpoints.
* `src/components/` — Reusable components, branding assets, custom widgets, and calculators.
* `src/lib/` — Singleton clients (Supabase client, email relay helpers, RBAC validator).
* `supabase/` — Database schemas (`schema.sql`) and migrations history files.
* `memory/` — Permanent brain files (this directory).
* `public/` — Branding images, icons, and logos.

---

## 3. Database
Supabase PostgreSQL database schemas:
* `public.students` — Profiles for candidates tracking intakes and assignments.
* `public.counselors` — Counselors designations, active status, and RBAC roles references.
* `public.referrals` & `public.referral_rewards` — Student referral program ledger.
* `public.eligibility_leads` — Leads captured via the study-abroad calculator wizard.
* `public.eligibility_matches` — Academic university matching snapshots with admission chances.
* `public.eligibility_assignments` — Counselor lead transfer history logs.
* `public.eligibility_reminders` — Day 1, 3, 7, 14 outreach follow-up reminders.
* `public.eligibility_activities` — Audit trail logs for lead actions.
* `public.eligibility_notes` — Counselor timeline notes on leads.

---

## 4. APIs
* `/api/eligibility/check` (POST) — Evaluates profile match scores, routes to least-loaded counselor, schedules reminders, and generates WhatsApp redirects.
* `/api/admin/eligibility-leads` (GET/PATCH) — Fetches leads list with filters/search, updates lead status/priority/counselor, logs transfers, response times, and bulk operations.
* `/api/admin/eligibility-notes` (GET/POST) — Adds and fetches notes.
* `/api/admin/eligibility-analytics` (GET) — Funnel counts, average/fastest/slowest response times, counselor workloads, and lead source quality metrics.
* `/api/admin/followups-today` (GET) — Returns due and overdue outreach tasks.
* `/api/referrals` & `/api/admin/referrals` — Standard referral checks and payouts approvals.

---

## 5. Admin Dashboard
The admin portal dashboard contains:
* **Counselor Workload Widget:** Interactive panels displaying active, hot, overdue, and due today leads assigned per counselor.
* **Lead Source Quality Analytics:** Metrics table tracking counts, conversion rates, and enrollment rates for Google, Facebook, Instagram, Referral, Direct, and Organic SEO channels.
* **Response Time KPIs:** Displays average response time, fastest counselor, and slowest counselor.
* **Filters Toolbar:** Search and filter by country, intake, counselor, date range, lead score, priority, and status.
* **Bulk Action Controls:** Dropdowns to bulk-assign counselors or bulk-edit status of selected leads.
* **Export CSV Control:** Generates downloadable `Annex_Eligibility_Leads_YYYY-MM-DD.csv` for selected or filtered leads.
* **Daily Follow-Up Queue:** Action lists showing overdue, today, and tomorrow follow-up checklists for the counselor.
* **Expandable Lead Detail Card:** Integrates academic details, university matches, notes adding, checklist reminders toggling, assignment transfers, and activity timelines.

---

## 6. Student Dashboard
The student portal dashboard contains:
* **Calculator Wizard (`/study-abroad-eligibility`):** Step-by-step profile inputs (Destination -> Academics -> Budget -> Lead Capture -> Results) revealing matches only after lead capture.
* **Matches Results Display:** Renders Top Match Score, Safe/Target/Ambitious chance badges, and direct messaging CTAs.
* **Referrals Tab:** Controls for unique code/links copying, stats summary, and payout history.

---

## 7. Features
* **Duplicate Lead Protection:** Updates current lead profiles and assessments if submitted within a 30-day window instead of polluting CRM.
* **Least-loaded Router:** Routes new leads to active counselors with the lowest active student count.
* **Referrals Auto-Sync:** Automated trigger functions updating referral status as referred student progresses.

---

## 8. Active Tasks
* [x] Add Lead Priority score values (High/Medium/Low) based on match scores and budget limits.
* [x] Create Lead Ownership History assignments table (`eligibility_assignments`).
* [x] Track First Response Time (first_contacted_at, response_time_minutes).
* [x] Display Counselor Workload Widgets on Admin panel.
* [x] Create Daily Follow-Up Queue API and dashboard checklist panel.
* [x] Enforce Email Capture before calculator matches display.
* [x] Track and show Lead Source Quality Analytics.
* [x] Build bulk assignment, status edits, and selective CSV exports in Admin registry.
* [x] Implement Admission Chance Categories (Safe, Target, Ambitious) for university matches.

---

## 9. Pending Tasks
* None. All requirements successfully implemented.

---

## 10. Known Issues
* None. Compilation is clean.

---

## 11. Changelog
* **2026-06-21:** Implemented referral program student tab redesign, created trigger-based database referral status updates mapping standard student stages, and resolved phosphor icon imports compilation blocker.
* **2026-06-22T02:55:52+05:30:** Implemented final approval requirements. Created `eligibility-leads`, `eligibility-notes`, and `eligibility-analytics` APIs. Implemented multi-step calculator wizard UI at `/study-abroad-eligibility` with email capture before results, admission chance categories, and booking/WhatsApp CTAs. Added Leads registry tab to Admin dashboard with workload cards, source quality table, daily follow-up queue, bulk actions, CSV exports, notes timeline, and reminders checklist.
* **2026-06-22T03:11:31+05:30:** Added `Eligibility Leads` as a standalone permission key to the `ALL_PERMISSIONS` array reference, and mapped the eligibility dashboard tab authorization check to it.

