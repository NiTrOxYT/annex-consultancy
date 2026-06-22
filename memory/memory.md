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
* `public.universities` — Main repository of institutions with matching criteria parameters (`min_percentage`, `min_ielts`, `min_pte`, `min_toefl`, `annual_fees`, `degree_level`, `scholarship_available`, `featured`, `published`).
* `public.shortlist_requests` — Database ledger tracking premium counselor shortlist requests, matching leads with counselors across statuses (`Requested`, `In Review`, `Generated`, `Delivered`).


---

## 4. APIs
* `/api/eligibility/check` (POST) — Evaluates profile match scores, routes to least-loaded counselor, schedules reminders, and generates WhatsApp redirects.
* `/api/admin/eligibility-leads` (GET/PATCH) — Fetches leads list with filters/search, updates lead status/priority/counselor, logs transfers, response times, and bulk operations.
* `/api/admin/eligibility-notes` (GET/POST) — Adds and fetches notes.
* `/api/admin/eligibility-analytics` (GET) — Funnel counts, average/fastest/slowest response times, counselor workloads, and lead source quality metrics.
* `/api/admin/followups-today` (GET) — Returns due and overdue outreach tasks.
* `/api/referrals` & `/api/admin/referrals` — Standard referral checks and payouts approvals.
* `/api/eligibility/shortlist-request` (POST) — Submits student profile for shortlist review.
* `/api/admin/shortlist-requests` (GET/POST/PATCH) — Loads student shortlist queue, handles PDF generation uploads to private storage bucket, and tracks delivery status updates.

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
* **Expandable Lead Detail Card:** Integrates academic details, university matches, notes adding, checklist reminders toggling, assignment transfers, activity timelines, and shortlist review controls.
* **Shortlist Requests Tab:** Dedicated queue displaying student profile parameters, counselor allocations, requested date, and status tags, with responsive detail view drawer for custom counselor workflow operations.
* **Shortlist Analytics Panel:** Renders total requested, total generated, total delivered, delivery rates, consultation conversion percentage, and top requested destinations/courses graphs.

---

## 6. Student Dashboard
The student portal dashboard contains:
* **Calculator Wizard (`/study-abroad-eligibility`):** Step-by-step profile inputs (Destination -> Academics -> Budget -> Lead Capture -> Results) revealing matches only after lead capture.
* **Matches Results Display:** Renders Top Match Score, Safe/Target/Ambitious chance badges, and direct messaging CTAs.
* **Counselor Shortlist Request:** Integrates Step 5 "Request Counselor-Reviewed Shortlist" CTA card, rendering assigned counselor's contact information (Name, Phone, WhatsApp) and expected delivery window once submitted.
* **Referrals Tab:** Controls for unique code/links copying, stats summary, and payout history.

---

## 7. Results Preview & Conversion Optimization
To increase lead conversion rates, the Study Abroad Eligibility Calculator uses a "value first" results preview strategy on Step 4 (Contact Capture Page):
* **UX Flow & Curiosity Teaser:** After completing step 3, the matching engine runs in `previewOnly` mode, returning real matching university snapshots. In Step 4, users see a **✓ Profile Evaluated** badge revealing the count of matching universities.
* **Teaser Card Treatment:** Matches are displayed in a blurred, non-interactive visual teaser (`blur-[1px] opacity-60`). University names are masked using a word-masking algorithm (e.g. `University of Milan` -> `U********* of M****`), and match scores, chances, and scholarships are replaced with lock symbols (`🔒 Hidden`).
* **Premium Unlock Overlay:** A lock overlay outlines the premium features unlocked upon form submission.
* **Mobile Responsiveness:** To maintain form visibility above the fold, mobile layouts collapse blurred teasers under an accordion panel.
* **Conversion Analytics:** Firing unique session IDs tracks `preview_viewed` on Step 4 view and `results_unlocked` on submit, calculating the **Preview Conversion Rate** in the Admin Dashboard funnel block.

---

## 8. Features
* **Duplicate Lead Protection:** Updates current lead profiles and assessments if submitted within a 30-day window instead of polluting CRM.
* **Least-loaded Router:** Routes new leads to active counselors with the lowest active student count.
* **Referrals Auto-Sync:** Automated trigger functions updating referral status as referred student progresses.
* **Single Source of Truth matching:** Universities database table holds structured matching parameters. No hardcoded or mock fallback datasets. The eligibility API routes profile assessments through a 100-point scoring algorithm with regex fallback patterns.

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
* **2026-06-22T03:16:28+05:30:** Scanned the codebase for hardcoded admin password checks. Added the server-side secure `ADMIN_PASSWORD` variable to `.env.local` and `.env.example` mapping to `annex-admin2026`.
* **2026-06-22T03:28:00+05:30:** Integrated the Study Abroad Eligibility Calculator onto the home page (`src/app/page.tsx`) using a high-end visual mockup card demonstrating admission chances (Safe, Target, Ambitious) and scholarship estimates. Added the link to the floating glass pill navigation menu (`src/components/navigation.tsx`). Verified compilation and builds cleanly.
* **2026-06-22T03:33:00+05:30:** Configured Open Graph, Twitter, Canonical, Robots, and metadataBase parameters in the root layout (`src/app/layout.tsx`). Aligned all favicon/icon paths under `public/` and `src/app/` to point to `public/branding/annex-logo.png`. Audited metadata and deleted conflicting `src/app/opengraph-image.png`. Verified compilation and production builds cleanly.
* **2026-06-22T03:39:00+05:30:** Redesigned and rebuilt the navigation bar (`src/components/navigation.tsx`) based on business value page classification. Consolidated 11 top-level links/buttons into 4 clean dropdowns (mega menus for Destinations and Programs, standard dropdown for Resources, and unified Portals logins) with clear CTA conversion priorities: Primary Revenue (Book Consultation solid button) and Lead Generation (Check Eligibility outline gold button). Verified compilation and production builds cleanly.
* **2026-06-22T16:04:00+05:30:** Rebuilt the university matching engine to make `public.universities` the single source of truth. Added migration `011_university_matching_criteria.sql` to introduce numeric criteria columns (`min_percentage`, `min_ielts`, `min_pte`, `min_toefl`, `annual_fees`, `degree_level`, `scholarship_available`) and corresponding indexes. Upgraded the backend eligibility checking API (`/api/eligibility/check`) to run dynamic matches using a 100-point weighted scoring engine with regex fallbacks. Rebuilt Admin CMS modal in `src/app/admin/page.tsx` with inputs for all new parameters. Refactored `<TopCollegesSection>` in `src/components/top-colleges.tsx` to remove fallback arrays and support `featuredOnly`, `limit`, and `showControls` properties, and integrated the featured colleges grid on the homepage. Verified compilation and production builds cleanly.
* **2026-06-22T16:21:00+05:30:** Implemented Results Preview (Blurred Teaser) conversion optimization. Created SQL migration `012_eligibility_preview_analytics.sql` for `eligibility_preview_logs` table, updated `schema.sql`, added `/api/eligibility/track` tracking route, updated `/api/eligibility/check` route with `previewOnly` bypass mode, refactored `/api/admin/eligibility-analytics` to calculate Preview Viewed -> Submission conversion rates, updated calculator component `src/components/EligibilityCalculator.tsx` to render two-column desktop/accordion mobile previews, and updated admin dashboard funnel stats. Verified TypeScript compilation and production builds cleanly.
* **2026-06-22T22:15:00+05:30:** Implemented Counselor-Reviewed Shortlist System. Replaced calculator Step 5 CTA with "Request Counselor-Reviewed Shortlist", and updated the Success UI to explicitly display Name, Phone, and WhatsApp fields of the assigned counselor. Built a dedicated "Shortlist Requests" sub-tab in the counselor dashboard supporting filters, row drawers, PDF generation actions (saved to storage bucket), and "Mark Delivered" status controls. Created a Shortlist Performance metrics analytics dashboard grid displaying total requests, generated count, delivered count, delivery rate, consultation conversion rate, and top requested country/course distribution tables. Verified that TypeScript compile and production builds run successfully.
* **2026-06-22T22:30:00+05:30:** Removed user-visible "lead" terminology from all user-facing pages on the website. Substituted references with customer-centric terms such as "profile", "referral", "registration", and "application" across the calculator flow, student dashboard referrals tab, and training services enrollment forms, while preserving internal variable/DB naming and admin portal visibility of "lead". Verified TypeScript builds compile cleanly.



