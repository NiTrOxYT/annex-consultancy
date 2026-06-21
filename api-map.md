# Annex Consultancy API Inventory Map

This inventory documents all backend route handlers, mapping their HTTP methods, inputs, outputs, database actions, dependencies, and authentication rules.

---

## 1. Notification APIs

### A. Endpoint: `/api/admin/notifications`
* **Route File:** `src/app/api/admin/notifications/route.ts`
* **GET Method:**
  * **Input Parameters:** `studentId` (string, optional), `trainingStudentId` (string, optional)
  * **Behavior:**
    * If both are empty: Reads the global settings table `system_settings` for key `notifications_enabled` and queries the last 200 items in `notification_history`.
    * If student/candidate identifier is provided: Queries the notification preferences and history specific to that client.
  * **Output Schema:** `{ success: true, globalSetting?, preferences?, history: [] }`
* **POST Method:**
  * **Input Payload:**
    * Toggle global: `{ action: "toggle-global", enabled: boolean }`
    * Update individual: `{ action: "update-prefs", studentId?, trainingStudentId?, key: string, value: boolean }`
  * **Output Schema:** `{ success: true, message: string }`
* **Database Tables Accessed:** `public.system_settings` (select, upsert), `public.notification_preferences` (select, insert, update), `public.notification_history` (select), `public.students` (join), `public.training_students` (join)
* **Auth Requirement:** Counselor Session (must pass `verifyAdminSession`)

### B. Endpoint: `/api/send-student-notification`
* **Route File:** `src/app/api/send-student-notification/route.ts`
* **POST Method:**
  * **Input Payload:** `{ studentId?, trainingStudentId?, action: "visa-status-updated" | "missing-documents-reminder" | "consultation-reminder", details: { status?, note?, meetingId?, manual? } }`
  * **Behavior:**
    1. Checks global master switch in `system_settings` (bypassed if `details.manual` is true).
    2. Fetches the student details from `students` or `training_students`.
    3. Triggers specific email dispatch helper: `sendVisaStatusUpdateEmail`, `sendMissingDocumentsReminderEmail`, or `sendConsultationReminderEmail`.
    4. Logs transaction status in `notification_history`.
  * **Output Schema:** `{ success: true, message: string }` / `{ success: false, error: string }`
* **Database Tables Accessed:** `public.system_settings`, `public.students`, `public.training_students`, `public.student_documents`, `public.training_documents`, `public.notification_preferences`, `public.notification_history`
* **Auth Requirement:** Counselor Session (`verifyAdminSession`)

### C. Endpoint: `/api/send-career-notification`
* **Route File:** `src/app/api/send-career-notification/route.ts`
* **POST Method:**
  * **Input Payload:** `{ action: "lead" | "activated" | "task-assigned" | "task-completed" | "meeting-scheduled" | "message", studentId?, details: { password?, taskTitle?, dueDate?, meetingTitle?, scheduledAt?, meetingLink?, messageContent?, senderType?, leadName?, leadEmail?, serviceTitle? } }`
  * **Behavior:** Dispatches specialized career portal notification emails (e.g., student activation credentials, task updates, meetings, message logs) and relays notification triggers.
  * **Output Schema:** `{ success: true, emailResult: { success, messageId, error? } }`
* **Database Tables Accessed:** `public.training_students`, `public.training_services`, `public.counselors`
* **Auth Requirement:** Counselor Session or Direct Trigger

### D. Endpoint: `/api/send-chat-notification`
* **Route File:** `src/app/api/send-chat-notification/route.ts`
* **POST Method:**
  * **Input Payload:** `{ senderType: "student" | "counselor", studentId: string, messageContent: string, counselorName?, messageId? }`
  * **Behavior:** Sends notification mail whenever a message is exchanged. If student sends, logs email to counselor; if counselor replies, sends to student. Stores transaction status in `message_notifications`.
  * **Output Schema:** `{ success: true, emailResult: { success, messageId } }`
* **Database Tables Accessed:** `public.students`, `public.counselors`, `public.student_messages`, `public.message_notifications`
* **Auth Requirement:** Active Client / Session

### E. Endpoint: `/api/send-meeting-notification`
* **Route File:** `src/app/api/send-meeting-notification/route.ts`
* **POST Method:**
  * **Input Payload:**
    * Reminders loop: `{ action: "send-reminders" }`
    * General: `{ action: "scheduled" | "updated" | "cancelled", studentId: string, meetingData: { title, scheduled_at, meeting_link?, meeting_type?, duration_minutes? } }`
  * **Behavior:**
    * If `send-reminders`: Scans all scheduled upcoming meetings in the next hour and dispatches warning emails to students.
    * If general: Emails meeting scheduling, rescheduling, or cancellation details.
  * **Output Schema:** `{ success: true }`
* **Database Tables Accessed:** `public.meetings`, `public.students`, `public.counselors`
* **Auth Requirement:** Counselor Session / System Cron Key

---

## 2. System Settings & RBAC APIs

### A. Endpoint: `/api/admin/rbac`
* **Route File:** `src/app/api/admin/rbac/route.ts`
* **GET Method:**
  * **Action Parameters:**
    * `get-current-user-perms`: Checks logged in counselor and returns a list of verified system permissions keys.
    * `list-roles`: Lists all user roles (`user_roles`), default mapping keys, and the counts of counselors assigned to each.
    * `get-counselor-perms`: Retrieves inheritance matrix and overrides mapping values for a specific counselor ID.
* **POST Method:**
  * **Action Payload Parameters:**
    * `create-role`: `{ name, description, permissions: [] }`
    * `edit-role`: `{ roleId, name, description, permissions: [] }`
    * `clone-role`: `{ sourceRoleId, name, description }`
    * `save-counselor-perms`: `{ counselorId, roleId, overrides: { [key]: boolean } }`
    * `provision-login`: `{ counselorId, email, password }`
* **Database Tables Accessed:** `public.counselors` (select, update), `public.user_roles` (select, insert, update), `public.role_permissions` (select, insert, delete), `public.counselor_permissions` (select, insert, delete)
* **Auth Requirement:** Super Admin / System Admin for writes; General Counselor session for reads.

---

## 3. Automation & Cron APIs

### A. Endpoint: `/api/cron/notifications`
* **Route File:** `src/app/api/cron/notifications/route.ts`
* **GET Method:**
  * **Headers Guard:** `Authorization: Bearer <CRON_SECRET>` or `Authorization: Bearer <ADMIN_PASSWORD>` or `x-vercel-cron: true`
  * **Behavior:**
    1. Checks if notifications are globally active in `system_settings`.
    2. Trigger 1 (Missing Documents): Identifies active students/candidates missing mandatory files (Passport, Certificates, SOP, LOR, Resume), checks cooldown, and dispatches reminder email.
    3. Trigger 2 (Consultations): Locates meetings occurring in the next 24 hours, checks cooldown, and sends meeting links.
  * **Output Schema:** `{ success: true, message: string, activityLogs: string[] }`
* **Database Tables Accessed:** `public.system_settings`, `public.students`, `public.training_students`, `public.student_documents`, `public.training_documents`, `public.meetings`, `public.notification_preferences`, `public.notification_history`
* **Auth Requirement:** Cron/Admin Header

---

## 4. Diagnostics & Debugging APIs (Proposed for Removal in Phase 0)

* `/api/career-auth-debug` (GET): Runs a diagnostic checklist mapping auth credentials profiles to public/career student tables.
* `/api/email-debug` (GET): Confirms whether SMTP brevo configuration details are resolved.
* `/api/email-status` (GET): Displays configuration details for email parameters.
* `/api/test-email` (POST): Relays a test HTML email containing timestamp and recipient details.
