# Annex Consultancy Architecture Map

This document describes the architectural layout, component layers, network flows, database interfaces, and security authorization boundaries of the Annex Consultancy platform.

---

## 1. Architectural Blueprint

The application is structured around a decoupled **Next.js & Supabase** hybrid model:

```
[ Web Browser (Chrome, Safari, Firefox) ]
                  │
                  │ HTTPS (JSON / SQL Client Actions)
                  v
       +──────────────────────────────────────+
       |             Next.js App              |
       |  (Serverless Pages, Layouts, APIs)   |
       +───────┬──────────────────────┬───────+
               │                      │
               │ Direct SQL / RLS     │ Send Emails (SMTP)
               v                      v
+──────────────────────────+  +───────────────────+
|      Supabase Cloud      |  |    Brevo SMTP     |
| (PostgreSQL & Storage)   |  |   Mailing Relay   |
+──────────────────────────+  +───────────────────+
```

---

## 2. Core Architectural Layers

### A. Presentation Layer (Frontend Client)
* **Single Page Layout:** Uses Next.js App Router layout components (`src/app/layout.tsx`).
* **Interactive Dashboard Controllers:** Both standard students (`/student/dashboard/page.tsx`), career candidates (`/career-portal/page.tsx`), and administrators (`/admin/page.tsx`) load dashboard panels that handle routing locally using hash state tabs.
* **Transitions & Flow:** Managed by `motion` package animations and smooth scroll hooks powered by Lenis Scroll Engine.

### B. Business Logic & Controller Layer (Serverless API Handlers)
* **Location:** Located in route handlers under `/src/app/api/`.
* **RBAC Controls:** Check counselor auth tokens against Postgres tables using `has_counselor_permission` database functions.
* **Notification Despatchers:** Connect system event updates (such as file uploads or visa status transitions) to custom HTML mailing engines.

### C. Data Persistence & Storage Layer (Supabase / Postgres)
* **Public Database Schema:** Hosted on Supabase Cloud. Declares 30 distinct tables tracking candidates, placements, bookings, roles, permissions overrides, and email transaction history logs.
* **Object Storage:** Relies on the `student-files` Supabase storage bucket to persist applicant documents, academic results, and offer letters.

---

## 3. Communication & Data Integration Flows

### Direct client-to-BaaS connection
For public actions (such as booking consultations) or authenticated student actions (fetching task tables), the browser connects directly to the Supabase database using the Anon client:
```
[Browser client] ──> [Supabase Anon API] ──> [PostgreSQL Table]
```
Access is governed by Row-Level Security (RLS) rules verifying the user's Auth User ID against the table rows.

### Authenticated API Route proxies
For operations requiring service-role privileges (such as assigning new counselor roles, provisioning client credentials, or bulk notifications), the frontend communicates with the serverless API routes:
```
[Browser client] ──> [Next.js Route Handler] ──> [Supabase Service Client]
```
The Next.js route first executes session and role validation before communicating with the database.
