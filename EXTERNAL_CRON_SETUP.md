# External Cron Setup — Automated Notifications

Vercel Hobby plans only allow **daily** cron jobs (`0 0 * * *`). Since Annex needs **hourly** notification checks, the scheduler has been moved to an external service.

> **Nothing changed** in the notification logic. Only the *trigger mechanism* moved from Vercel Cron to an external HTTP scheduler.

---

## How It Works

```
External Scheduler (every hour)
        │
        ▼  GET request with Bearer token
https://your-domain.vercel.app/api/cron/notifications
        │
        ▼  Checks CRON_SECRET header
   Runs notification logic (missing docs, meeting reminders)
```

---

## Step 1: Set `CRON_SECRET` in Vercel

1. Go to **Vercel Dashboard → Project → Settings → Environment Variables**
2. Add a new variable:

| Key | Value | Environments |
|-----|-------|-------------|
| `CRON_SECRET` | Any strong random string (e.g. `cron_sk_a8f3x9...`) | Production, Preview |

Generate a secret:
```bash
openssl rand -hex 32
```

---

## Step 2: Choose an External Scheduler

### Option A: cron-job.org (Free — Recommended)

1. Go to [https://cron-job.org](https://cron-job.org) and create a free account
2. Click **Create Cronjob**
3. Configure:

| Field | Value |
|-------|-------|
| **Title** | Annex Notifications |
| **URL** | `https://your-domain.vercel.app/api/cron/notifications` |
| **Schedule** | Every 1 hour (`0 * * * *`) |
| **Request Method** | `GET` |
| **Request Header** | `Authorization: Bearer YOUR_CRON_SECRET_VALUE` |

4. Enable the job and save

---

### Option B: Supabase Edge Functions + pg_cron

If you have a Supabase Pro plan, you can use `pg_cron` + `pg_net`:

```sql
-- Run this in Supabase SQL Editor
SELECT cron.schedule(
  'annex-notifications',
  '0 * * * *',
  $$
  SELECT net.http_get(
    url := 'https://your-domain.vercel.app/api/cron/notifications',
    headers := jsonb_build_object(
      'Authorization', 'Bearer YOUR_CRON_SECRET_VALUE'
    )
  );
  $$
);
```

To check scheduled jobs:
```sql
SELECT * FROM cron.job;
```

To remove:
```sql
SELECT cron.unschedule('annex-notifications');
```

---

### Option C: GitHub Actions (Free)

Create `.github/workflows/cron-notifications.yml`:

```yaml
name: Annex Notification Cron
on:
  schedule:
    - cron: '0 * * * *'  # Every hour
  workflow_dispatch: # Allow manual trigger

jobs:
  trigger:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Notification Endpoint
        run: |
          curl -s -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            "https://your-domain.vercel.app/api/cron/notifications"
```

Then add `CRON_SECRET` to **GitHub → Repo → Settings → Secrets → Actions**.

> ⚠️ GitHub Actions cron can have up to ~15 min delay. For time-sensitive meeting reminders, prefer cron-job.org.

---

### Option D: UptimeRobot (Free)

1. Go to [https://uptimerobot.com](https://uptimerobot.com)
2. Create a new **HTTP(s) - Keyword** monitor
3. Set URL to `https://your-domain.vercel.app/api/cron/notifications`
4. Set interval to **60 minutes**
5. Add custom header: `Authorization: Bearer YOUR_CRON_SECRET_VALUE`
6. Set keyword to `success` (the endpoint returns `"success": true`)

---

## Step 3: Verify It Works

Test manually from your terminal:

```bash
curl -X GET \
  -H "Authorization: Bearer YOUR_CRON_SECRET_VALUE" \
  https://your-domain.vercel.app/api/cron/notifications
```

Expected response:
```json
{
  "success": true,
  "message": "Cron execution finished.",
  "activityLogs": []
}
```

---

## What Was Changed

| File | Change |
|------|--------|
| `vercel.json` | Removed `crons` array (was causing Hobby plan deployment failure) |
| `api/cron/notifications/route.ts` | **No changes** — endpoint already supports `CRON_SECRET` auth |

## What Was NOT Changed

- ✅ Notification logic is identical
- ✅ Missing documents reminders still work
- ✅ Consultation meeting reminders still work
- ✅ 24-hour cooldown logic untouched
- ✅ Global enable/disable switch untouched
- ✅ Per-student notification preferences untouched
