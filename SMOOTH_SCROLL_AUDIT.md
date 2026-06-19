# Smooth Scroll Bug Audit Report

This audit documents the scroll behavior, layout issues, and root causes of scroll limits failing to reach the footer across the Annex Consultancy application after the implementation of Lenis smooth scrolling.

---

## 1. Global Root Causes

### A. Root Viewport Capping (`html` and `body` Height Restrictions)
* **File:** [`src/app/layout.tsx`](file:///Users/sourik/projects/Annex/src/app/layout.tsx#L37-L39)
* **CSS Class:** `html { h-full }` (translates to `height: 100%`) and `body { min-h-full }` (translates to `min-height: 100%`).
* **Mechanism:** Capping `html` at `height: 100%` overrides the default `height: auto` styling required by Lenis for global window-scrolling. It restricts the root element viewport and forces the browser to miscalculate the maximum scroll bounds, causing page scrolling to freeze prematurely.

### B. Route Transitions Ignored (Client-Side Navigation)
* **File:** [`src/components/scroll-manager.tsx`](file:///Users/sourik/projects/Annex/src/components/scroll-manager.tsx#L63)
* **Mechanism:** `ScrollManager` is mounted once in the root layout. Its initialization effect runs with an empty dependency array `[]`. When Next.js performs client-side page routing (e.g., navigating from `/study-abroad` to `/study-abroad/uk`), the page contents change instantly, but the scroll manager is not notified. Lenis retains the height bounds of the *previous* page, locking the user out of scrolling to the bottom of longer pages.

### C. Dynamic Database Content Loads (Supabase Hydration)
* **Affects:** `/training-placement`, `/success-stories`, `/blog`
* **Mechanism:** These pages fetch collections (career experts, success testimonials, blog posts) from Supabase on mount. While fetching, they render height-capped placeholders or skeletons. Once hydrations complete, the content heights expand significantly. Since Lenis has no observer tracking layout growth, it does not recompute its limits, causing scroll limits to end at the initial skeleton heights.

### D. Lazy-Loaded Images Layout Shifts
* **Affects:** All public pages (Home, About, Study Abroad)
* **Mechanism:** Images without predefined dimensions or loading indicators load asynchronously. As they paint, they shift the layout down. Without a ResizeObserver, Lenis fails to track these layout shifts, leading to incomplete scrolls.

---

## 2. Page-Specific Audit & Analysis

| Page Route | Footer Reachable? | Root Cause |
|---|---|---|
| **Home (`/`)** | ❌ No | Capped `html` `height: 100%` restriction and lazy-loaded hero/destination images causing boundary misalignment. |
| **About (`/about`)** | ❌ No | `html` height capping + layout shifts from dynamic team/counselor photos. |
| **Study Abroad Country Pages (`/study-abroad/[country]`)** | ❌ No | Navigation issue: navigating from the main page leaves Lenis locked to the shorter main page's height limit. |
| **Training & Placement (`/training-placement`)** | ❌ No | Loads expert profiles and training packages from Supabase on mount; content extends down after render, causing scroll to freeze mid-way. |
| **Success Stories (`/success-stories`)** | ❌ No | Loads dynamic testimonial lists from Supabase, extending page height beyond initial render limits. |
| **Blog (`/blog`)** | ❌ No | Dynamic blog articles loaded after mount; height grows after Lenis initialization bounds are set. |
| **Student Portal (`/student/dashboard`)** | ⚠️ N/A | Full-screen app layout with absolute sidebar and internal `overflow-y-auto` panels. Window scrolling should be prevented/ignored here to avoid conflict. |

---

## 3. Core Mitigation Strategy
1. **Remove Viewport Caps:** Update `src/app/layout.tsx` to remove `h-full` from the `html` element and change `min-h-full` to `min-h-screen` on `body`. This satisfies the `height: auto` constraint of Lenis while maintaining full-height layouts on empty/short pages.
2. **Implement Pathname Observer:** Add `usePathname()` inside `ScrollManager` to capture client-side route transitions and trigger `lenis.resize()` automatically.
3. **Implement ResizeObserver:** Configure a `ResizeObserver` observing `document.body` inside `ScrollManager`. Whenever the DOM height changes (due to image loads, Supabase queries rendering, or Framer Motion animations), the observer will automatically call `lenis.resize()`, guaranteeing perfect bounds alignment.
