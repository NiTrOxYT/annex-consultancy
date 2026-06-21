# Annex Consultancy Database Map

This document catalogues all PostgreSQL database tables, describing their attributes, target types, check constraints, foreign-key relationships, and indexes.

---

## 1. Table Definitions Map

### A. Consultation Bookings Table
* **Table Name:** `public.bookings`
* **Purpose:** Stores inquiries and admissions consultation requests submitted via the contact form.
* **Fields:**
  * `id` (UUID, Primary Key): Default `gen_random_uuid()`
  * `name` (TEXT, Not Null)
  * `email` (TEXT, Not Null)
  * `phone` (TEXT, Not Null)
  * `preferred_date` (DATE, Not Null)
  * `preferred_time` (TIME, Not Null)
  * `study_level` (TEXT, Not Null) — e.g. "Undergraduate", "Postgraduate"
  * `destination` (TEXT, Not Null) — e.g. "UK", "Australia"
  * `subject_interest` (TEXT, Nullable)
  * `notes` (TEXT, Nullable)
  * `status` (TEXT): Default `'Pending'`
  * `created_at` (TIMESTAMPTZ): Default `now()`

### B. Universities CMS Table
* **Table Name:** `public.universities`
* **Purpose:** Catalog of global university partners displayed on destinations pages.
* **Fields:**
  * `id` (UUID, Primary Key)
  * `name` (TEXT, Unique, Not Null)
  * `slug` (TEXT, Unique, Not Null)
  * `logo_url` (TEXT, Nullable)
  * `country` (TEXT, Not Null)
  * `city` (TEXT, Not Null)
  * `category` (TEXT, Not Null) — e.g. 'Engineering', 'MBBS'
  * `course_type` (TEXT): Default `'Undergraduate'`
  * `ranking` (INTEGER, Nullable)
  * `ranking_source` (TEXT, Nullable)
  * `rating` (NUMERIC): Default `4.5`
  * `total_fees` (TEXT, Nullable)
  * `application_deadline` (TEXT, Nullable)
  * `intake` (TEXT, Nullable)
  * `cutoff` (TEXT, Nullable)
  * `website_url` (TEXT, Nullable)
  * `description` (TEXT, Nullable)
  * `featured` (BOOLEAN): Default `false`
  * `published` (BOOLEAN): Default `true`
  * `created_at` (TIMESTAMPTZ): Default `now()`

### C. CMS Posts Table
* **Table Name:** `public.posts`
* **Purpose:** CMS database table for blog posts.
* **Fields:**
  * `id` (UUID, Primary Key)
  * `title` (TEXT, Not Null)
  * `slug` (TEXT, Unique, Not Null)
  * `excerpt` (TEXT, Nullable)
  * `content` (TEXT, Not Null)
  * `featured_image_url` (TEXT, Nullable)
  * `category` (TEXT, Not Null) — "Blog" or "Success Story" (legacy support)
  * `tags` (TEXT, Nullable) — Comma-separated
  * `author` (TEXT): Default `'Annex Team'`
  * `published` (BOOLEAN): Default `false`
  * `published_date` (TIMESTAMPTZ, Nullable)
  * `created_at` (TIMESTAMPTZ): Default `now()`

### D. Success Stories Table
* **Table Name:** `public.success_stories`
* **Purpose:** CMS table storing student placements testimonials.
* **Fields:**
  * `id` (UUID, Primary Key)
  * `name` (TEXT, Not Null)
  * `destination` (TEXT, Not Null) — country name
  * `university` (TEXT, Not Null)
  * `course` (TEXT, Not Null)
  * `quote` (TEXT, Not Null) — testimonial content
  * `year` (INTEGER, Not Null) — intake year
  * `student_photo_url` (TEXT, Nullable)
  * `success_metrics` (TEXT, Nullable) — e.g. "IELTS 8.0"
  * `published` (BOOLEAN): Default `false`
  * `created_at` (TIMESTAMPTZ): Default `now()`

### E. Standard Students Table
* **Table Name:** `public.students`
* **Purpose:** Core profile tracker for overseas study applicants.
* **Fields:**
  * `id` (UUID, Primary Key)
  * `name` (TEXT, Not Null)
  * `email` (TEXT, Unique, Not Null)
  * `phone` (TEXT, Nullable)
  * `destination` (TEXT, Nullable)
  * `intake` (TEXT, Nullable)
  * `status` (TEXT): Default `'Active'`
  * `counselor` (TEXT): Default `'Annex Counselor'`
  * `last_activity` (TIMESTAMPTZ): Default `now()`
  * `academic_details` (TEXT, Nullable)
  * `preferred_course` (TEXT, Nullable)
  * `emergency_contact` (TEXT, Nullable)
  * `passport_details` (TEXT, Nullable)
  * `current_stage` (TEXT): Default `'Consultation'`
  * `created_at` (TIMESTAMPTZ): Default `now()`
  * `auth_user_id` (UUID, Unique, Nullable): Foreign Key referencing `auth.users(id)`
  * `counselor_id` (UUID, Nullable): Foreign Key referencing `public.counselors(id)`

### F. Counselors Table
* **Table Name:** `public.counselors`
* **Purpose:** Profile records for consultancy counselors and administrative staff.
* **Fields:**
  * `id` (UUID, Primary Key)
  * `full_name` (TEXT, Not Null)
  * `email` (TEXT, Unique, Not Null)
  * `phone` (TEXT, Nullable)
  * `designation` (TEXT, Nullable)
  * `avatar_url` (TEXT, Nullable)
  * `is_active` (BOOLEAN): Default `true`
  * `created_at` (TIMESTAMPTZ): Default `now()`
  * `role_id` (UUID, Nullable): Foreign Key referencing `public.user_roles(id)`
  * `auth_user_id` (UUID, Unique, Nullable): Foreign Key referencing `auth.users(id)`

### G. Scheduled Meetings Table
* **Table Name:** `public.meetings`
* **Purpose:** Scheduled consultations and session details.
* **Fields:**
  * `id` (UUID, Primary Key)
  * `student_id` (UUID, Nullable): Foreign Key referencing `public.students(id)` ON DELETE CASCADE
  * `counselor_id` (UUID, Nullable): Foreign Key referencing `public.counselors(id)` ON DELETE SET NULL
  * `training_student_id` (UUID, Nullable): Foreign Key referencing `public.training_students(id)` ON DELETE CASCADE
  * `title` (TEXT, Not Null)
  * `description` (TEXT, Nullable)
  * `meeting_type` (TEXT): Default `'Google Meet'`
  * `meeting_link` (TEXT, Nullable)
  * `scheduled_at` (TIMESTAMPTZ, Not Null)
  * `duration_minutes` (INTEGER): Default `30`
  * `status` (TEXT): Default `'Scheduled'`
  * `created_at` (TIMESTAMPTZ): Default `now()`

### H. Career Training Students Table
* **Table Name:** `public.training_students`
* **Purpose:** Profile records for career placement training candidates.
* **Fields:**
  * `id` (UUID, Primary Key)
  * `service_id` (UUID, Nullable): Foreign Key referencing `public.training_services(id)`
  * `student_name` (TEXT, Not Null)
  * `student_email` (TEXT, Not Null)
  * `student_phone` (TEXT, Nullable)
  * `purchase_date` (TIMESTAMPTZ): Default `now()`
  * `assigned_consultant_id` (UUID, Nullable): Foreign Key referencing `public.counselors(id)`
  * `status` (TEXT): Default `'Pending'`
  * `notes` (TEXT, Nullable)
  * `created_at` (TIMESTAMPTZ): Default `now()`
  * `auth_user_id` (UUID, Unique, Nullable): Foreign Key referencing `auth.users(id)`

### I. Notification Preferences Table
* **Table Name:** `public.notification_preferences`
* **Purpose:** Toggle preferences mapping subscription alerts for students/candidates.
* **Fields:**
  * `id` (UUID, Primary Key)
  * `student_id` (UUID, Nullable): Foreign Key referencing `public.students(id)` ON DELETE CASCADE
  * `training_student_id` (UUID, Nullable): Foreign Key referencing `public.training_students(id)` ON DELETE CASCADE
  * `missing_documents_enabled` (BOOLEAN): Default `true`
  * `consultation_enabled` (BOOLEAN): Default `true`
  * `visa_updates_enabled` (BOOLEAN): Default `true`
  * `all_notifications_enabled` (BOOLEAN): Default `true`
  * `created_at` (TIMESTAMPTZ): Default `now()`
  * `updated_at` (TIMESTAMPTZ): Default `now()`
* **Constraints:** `check_preferences_only_one_student` (verifies exactly one client ID is populated)

### J. Notification History Table
* **Table Name:** `public.notification_history`
* **Purpose:** Audit history logs for all dispatched alerts, used to enforce cooldown gates.
* **Fields:**
  * `id` (UUID, Primary Key)
  * `student_id` (UUID, Nullable): Foreign Key referencing `public.students(id)` ON DELETE CASCADE
  * `training_student_id` (UUID, Nullable): Foreign Key referencing `public.training_students(id)` ON DELETE CASCADE
  * `notification_type` (TEXT, Not Null) — e.g. 'missing_documents', 'consultation'
  * `subject` (TEXT, Not Null)
  * `status` (TEXT): Default `'sent'`
  * `sent_at` (TIMESTAMPTZ): Default `now()`
  * `error_message` (TEXT, Nullable)
  * `created_at` (TIMESTAMPTZ): Default `now()`
* **Constraints:** `check_history_only_one_student` (verifies exactly one client ID is populated)

---

## 2. Shared Assets Tables (Shorthand)
* `public.student_tasks` -> Task boards linked to `students` profile.
* `public.student_documents` -> PDF/image uploads slots (status, feedback) linked to `students`.
* `public.student_messages` -> Chat lines logs between counselor and student.
* `public.student_offer_letters` -> PDF URLs (CAS, admission letters) linked to `students`.
* `public.student_visa_status` -> Tracking stage detail linked to `students`.
* `public.student_conversations` -> Dynamic counter records for unread chat lines.
* `public.message_attachments` -> Metadata maps for files uploaded inside chat.
* `public.message_notifications` -> Dispatch history for offline chat alerts.
* `public.email_logs` -> Nodemailer SMTP transaction outputs logs.
* `public.training_services` -> Details and pricing options for career services.
* `public.training_tasks` -> Milestones assigned to placement candidate portfolios.
* `public.training_documents` -> Credentials uploads (resumes) linked to career candidates.
* `public.training_messages` -> Career training client-mentor chat lines logs.
* `public.training_conversations` -> Career portal unread counters maps.
* `public.career_experts` -> Profile listings of mock training mentors.
* `public.system_settings` -> Master boolean configurations keys.
* `public.user_roles` -> RBAC title lists.
* `public.role_permissions` -> Permission mapping matrices for user roles.
* `public.counselor_permissions` -> Direct counselor permission overrides.
