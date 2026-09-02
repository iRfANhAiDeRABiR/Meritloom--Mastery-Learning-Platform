# Meritloom

Meritloom is a modern, structured learning platform focused on individual learners. It provides clear, self-paced mastery learning through a four-part learning cycle: **understand the concept**, **practice it in a live workspace**, **reinforce with knowledge checks**, and **continue with confidence**.

Meritloom is built without subscriptions, paywalls, XP gamification, leaderboards, forced daily streaks, or score-based course gating.

Production deployment: **[meritloom.iabir.me](https://meritloom.iabir.me)**

---

## Table of Contents

- [Core Learning Model](#core-learning-model)
- [Workspaces & Features](#workspaces--features)
  - [Learner Experience](#learner-experience)
  - [Instructor Studio](#instructor-studio)
  - [Admin Studio](#admin-studio)
  - [Sub-Admin & Delegated Permissions](#sub-admin--delegated-permissions)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Application Routes](#application-routes)
- [Authentication & Identity](#authentication--identity)
- [Roles & Permissions](#roles--permissions)
- [Database & Schema](#database--schema)
- [Course Content Model](#course-content-model)
- [Knowledge Checks](#knowledge-checks)
- [Practice Workspace](#practice-workspace)
- [Learning Paths](#learning-paths)
- [System Health & Observability](#system-health--observability)
- [Error Handling](#error-handling)
- [Security Architecture](#security-architecture)
- [Performance Optimizations](#performance-optimizations)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Supabase Setup & Migrations](#supabase-setup--migrations)
  - [Running Locally](#running-locally)
- [Available Scripts](#available-scripts)
- [Production Build & Deployment](#production-build--deployment)
- [Troubleshooting](#troubleshooting)
- [Content Attribution](#content-attribution)
- [Development Guidelines](#development-guidelines)
- [License](#license)

---

## Core Learning Model

Meritloom structures courses around pedagogical progression:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────────┐     ┌───────────────────┐
│  Learn Concept  │ ──► │  Live Practice  │ ──► │   Knowledge Check   │ ──► │ Continue Learning │
│  Video/Article  │     │ Sandboxed Code  │     │ Self-Assess Concept │     │ Next Lesson/Path  │
└─────────────────┘     └─────────────────┘     └─────────────────────┘     └───────────────────┘
```

1. **Concept Delivery**: High-definition video lectures and rich text curriculum with structured objectives.
2. **Interactive Practice**: In-browser code editors with real-time sandboxed iframe execution for HTML, CSS, and JavaScript.
3. **Knowledge Checks**: Module-level reinforcement checks with instant explanations, answer explanations, and unlimited retries designed to reinforce learning rather than block course access.
4. **Natural Continuation**: Clear resume points, completion summaries, and learning path progress.

---

## Workspaces & Features

### Learner Experience

- **Learner Dashboard (`/learn`)**: Personalized home displaying active courses, continue-learning shortcuts, learning path progress, recent activity history, and study tips.
- **My Learning (`/learn/courses`)**: Enrolled course library with individual completion percentages and quick resume actions.
- **Course Discovery (`/learn/explore`)**: Category-filtered catalog with search, difficulty filters, and instant enrollment.
- **Structured Lesson Player**: Clean learning layout with collapsible sidebar, video player, markdown content viewer, resource links, and sticky lesson navigation.
- **Interactive Practice Workspace**: Integrated code editor with live split-pane sandboxed preview and automatic local draft persistence.
- **Knowledge Checks**: Module-level comprehension quizzes with immediate feedback and explanation breakdowns.
- **Saved Courses & Notes (`/learn/saved`, `/learn/notes`)**: Dedicated pages for bookmarked courses and personal lesson study notes.
- **Course & Path Completion (`/learn/courses/[slug]/complete`, `/learn/learning-paths/[slug]/complete`)**: Celebratory completion views with milestone metrics, certificate downloads, and recommended next steps.
- **Profile & Account (`/profile`)**: Manage personal details, custom avatar uploads (with automatic Google OAuth image fallback), theme selection, and account deletion.

### Instructor Studio

- **Assigned Course Management (`/instructor`, `/instructor/courses`)**: Dedicated workspace for instructors to view and edit courses they are explicitly assigned to manage.
- **Curriculum & Lesson Authoring (`/instructor/courses/[courseId]`)**: Create modules, add video/article lessons, configure code practice starters, and manage knowledge checks.
- **Content Quality Health (`/instructor/quality`)**: Automated curriculum diagnostics checking for missing descriptions, empty modules, unlinked quizzes, and broken video URLs.
- **Instructor Profile Settings (`/instructor/profile`)**: Bio, expertise areas, display name, and avatar configuration.

### Admin Studio

- **Executive Overview (`/admin`)**: Real-time platform KPI cards, enrollment trends, completion analytics, and quick admin shortcuts.
- **Course & Path Management (`/admin/courses`, `/admin/learning-paths`)**: Full lifecycle publishing, curriculum reordering, and preview tools.
- **User & Staff Management (`/admin/users`, `/admin/staff`)**: Searchable user directory, enrollment history, account suspension/reactivation controls, staff role assignment, and granular permission editing.
- **Knowledge Check Studio (`/admin/quizzes`)**: Create, reorder, and edit question banks, multiple-choice options, and explanations.
- **Content Taxonomy & Tools (`/admin/categories`, `/admin/skills`, `/admin/content-tools`)**: Category structuring, skill tagging, and course syllabus JSON export/import utilities.
- **Audit Logging (`/admin/audit-log`)**: Immutable activity trail recording staff actions, permission updates, account suspensions, and content edits.

### Sub-Admin & Delegated Permissions

Sub-admins access `/admin` with dynamically rendered metric cards and sidebar navigation tailored strictly to their assigned granular permissions:

- `users.view`, `users.suspend`, `users.reactivate`
- `courses.view`, `courses.create`, `courses.edit`, `courses.publish`, `courses.delete`
- `learning_paths.view`, `learning_paths.edit`
- `categories.manage`, `skills.manage`, `content_tools.export`, `content_tools.import`
- `quality.view`, `quality.run`
- `system.view`, `staff.view`

Access is strictly enforced at the server level via server authorization guards (`requireAdminSession` and `requireStaffPermission`) rather than relying on UI hiding alone.

---

## Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16.3.3](https://nextjs.org/) | App Router, Server Components, Server Actions, Turbopack |
| **UI Library** | [React 19.2.8](https://react.dev/) | Concurrent rendering, `useActionState`, React `cache()` |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type checking, zero `any` policy for core domains |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern CSS tokens, dark and light theme variables |
| **Database & Auth** | [Supabase](https://supabase.com/) | PostgreSQL, Supabase Auth (OAuth + Password), Storage, RLS |
| **Components** | Radix UI primitives | Headless accessible components (Dialog, Dropdown, Accordion, Progress) |
| **Notifications** | [Sonner 2](https://sonner.emilkowal.ski/) | Toast notification system |
| **Theme System** | `next-themes` | System preference detection and persistent dark/light theme switching |
| **Icons & Typography** | [Lucide React](https://lucide.dev/) / DM Sans | Accessible icon library and Google Font integration |

---

## System Architecture

```
                                      CLIENT BROWSER
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
              Public / Learner UI                          Staff / Admin UI
             (/, /courses, /learn)                       (/admin, /instructor)
                       │                                           │
                       └─────────────────────┬─────────────────────┘
                                             ▼
                                  NEXT.JS 16 APP ROUTER
                                             │
             ┌───────────────────────────────┼───────────────────────────────┐
             ▼                               ▼                               ▼
     Server Components                Server Actions                  Route Handlers
     (Request-memoized data           (Mutations with safe           (PKCE auth callback,
      fetching via React cache)        validation & audit logs)       health checks, exports)
             │                               │                               │
             └───────────────────────────────┼───────────────────────────────┘
                                             ▼
                                  SUPABASE BACKEND LAYER
                                             │
             ┌───────────────────────────────┼───────────────────────────────┐
             ▼                               ▼                               ▼
       Supabase Auth                   PostgreSQL                      Supabase Storage
   (Email/PW, Google PKCE,         (RLS Policies, composite        (Custom learner/staff
    secure session cookies)         indexes, JSONB schemas)         profile avatars)
```

---

## Project Structure

```
meritloom/
├── public/                     # Static public assets (SVG icons, brand marks)
├── scripts/                    # Database inspection & maintenance scripts
├── src/
│   ├── app/                    # Next.js App Router route hierarchy
│   │   ├── (public)/           # Landing, courses, learning paths, legal, contact
│   │   ├── admin/              # Admin & Sub-admin management suite
│   │   ├── auth/               # Sign-in, sign-up, password reset, OAuth callback
│   │   ├── instructor/         # Instructor Studio workspace
│   │   ├── learn/              # Learner dashboard, lesson player, quizzes, completion
│   │   ├── profile/            # Learner profile & account settings
│   │   ├── error.tsx           # Segment-level runtime error boundary
│   │   ├── global-error.tsx    # Root layout catastrophic error boundary
│   │   ├── not-found.tsx       # Branded 404 page
│   │   └── layout.tsx          # Root HTML layout with theme & route progress bar
│   ├── components/             # Reusable UI & workspace components
│   │   ├── admin/              # Admin views, tables, course editor, system health
│   │   ├── auth/               # Authentication forms, OAuth buttons, error alerts
│   │   ├── brand/              # Meritloom SVG logo & marks
│   │   ├── common/             # Route progress bar, section error boundaries
│   │   ├── completion/         # Course & learning path completion views
│   │   ├── errors/             # Error shells, illustrations, copy-reference buttons
│   │   ├── instructor/         # Instructor course cards, topbar, sidebar, editor
│   │   ├── landing/            # Public site header, hero, footer, mobile navigation
│   │   ├── learn/              # Learner dashboard cards, sidebar, lesson player
│   │   ├── staff/              # Staff profile menu, workspace switcher buttons
│   │   ├── theme/              # Theme provider & theme toggle button
│   │   └── ui/                 # Base components (Button, Card, Avatar, Dropdown, Modal)
│   └── lib/                    # Core business logic, queries, and integrations
│       ├── actions/            # Server Actions (enrollments, progress, profile, admin)
│       ├── auth/               # RBAC session helpers, workspace resolvers, guards
│       ├── errors/             # Error catalog, sanitization, reference generator, logger
│       ├── profile/            # Canonical avatar resolution (Custom -> Google -> Initials)
│       ├── queries/            # Request-memoized Supabase database queries
│       ├── supabase/           # Server, browser, and middleware Supabase client factories
│       ├── system-health/      # Real-time latency, database health, and telemetry engine
│       └── types/              # Domain TypeScript interfaces (Courses, Lessons, Staff)
├── supabase/
│   ├── migrations/             # 20 sequential PostgreSQL migration files
│   ├── schema.sql              # Consolidated reference database schema
│   └── seed/                   # Curated curriculum SQL seeds (HTML, CSS, JS)
└── package.json
```

---

## Application Routes

| Area | Route | Access | Purpose |
| :--- | :--- | :--- | :--- |
| **Public** | `/` | Public | Landing page & platform overview |
| **Public** | `/courses`, `/courses/[slug]` | Public | Public course catalog & syllabus previews |
| **Public** | `/learning-paths`, `/learning-paths/[slug]` | Public | Recommended learning path guides |
| **Public** | `/how-it-works`, `/about`, `/help`, `/contact` | Public | Informational & support pages |
| **Auth** | `/auth/sign-in`, `/auth/sign-up` | Anonymous | Email/password & Google OAuth authentication |
| **Auth** | `/auth/callback` | Public | Supabase PKCE OAuth code exchange |
| **Auth** | `/auth/forgot-password`, `/auth/reset-password` | Public | Password recovery flow |
| **Learner** | `/learn` | Authenticated | Learner Home Dashboard |
| **Learner** | `/learn/courses` | Authenticated | My Learning (enrolled courses & progress) |
| **Learner** | `/learn/explore` | Authenticated | In-app course discovery |
| **Learner** | `/learn/courses/[slug]/lessons/[lessonSlug]` | Authenticated | Lesson player with practice & quizzes |
| **Learner** | `/learn/courses/[slug]/complete` | Authenticated | Course completion milestone view |
| **Learner** | `/learn/learning-paths/[slug]/complete` | Authenticated | Learning path completion milestone view |
| **Learner** | `/learn/saved`, `/learn/notes` | Authenticated | Bookmarked courses and personal lesson notes |
| **Learner** | `/profile` | Authenticated | Profile details, avatar upload, and account settings |
| **Instructor**| `/instructor`, `/instructor/courses` | Instructor | Assigned courses & curriculum management |
| **Instructor**| `/instructor/courses/[courseId]` | Instructor | Course curriculum editor (assigned courses only) |
| **Instructor**| `/instructor/quality`, `/instructor/profile` | Instructor | Course health diagnostics & instructor profile |
| **Admin** | `/admin` | Staff | Executive Overview / Sub-admin dashboard |
| **Admin** | `/admin/courses`, `/admin/courses/[courseId]` | Staff | Platform course catalog editor & preview |
| **Admin** | `/admin/learning-paths` | Staff | Learning path sequencing editor |
| **Admin** | `/admin/quizzes` | Staff | Knowledge check question bank studio |
| **Admin** | `/admin/users`, `/admin/users/[userId]` | Staff | User management & suspension controls |
| **Admin** | `/admin/staff`, `/admin/staff/[staffId]` | Admin | Staff member roles & permission editor |
| **Admin** | `/admin/system` | Staff | Server performance, error logs, and health status |
| **Admin** | `/admin/audit-log` | Admin | Administrative audit log viewer |
| **System** | `/account-suspended` | Suspended | Notice page for suspended user accounts |
| **System** | `/error` | Public | Safe dedicated error page with error catalog codes |

---

## Authentication & Identity

Meritloom uses Supabase Auth with server-side cookie sessions managed via `@supabase/ssr`:

1. **Email & Password**: Registration, login, password update, and password reset flows with client and server validation.
2. **Google OAuth (PKCE Flow)**:
   - Client initiates OAuth via `supabase.auth.signInWithOAuth({ provider: 'google', ... })`.
   - Browser redirects to Google &rarr; Supabase &rarr; `/auth/callback?code=...`.
   - The route handler exchanges the code for a secure session and syncs the user's Google display name and avatar without overwriting existing custom profile uploads.
3. **Session Hydration & Guarding**:
   - `getCurrentUser()`: Request-memoized via React `cache()` to fetch user metadata and profile in a single pass per request.
   - `requireActiveUser()`: Verifies the account is active and redirects suspended accounts to `/account-suspended`.
   - `requireAdmin()`, `requireInstructorSession()`: Strictly enforces workspace-level server authorization.
4. **Unified Avatar Resolution Pipeline**:
   - **Priority 1**: Custom uploaded profile avatar stored in Supabase Storage (`avatars` bucket).
   - **Priority 2**: Google OAuth profile image (`user_metadata.avatar_url` or `user_metadata.picture`).
   - **Fallback**: Branded letter initials with uppercase gradient badge and automatic `onError` recovery.

---

## Roles & Permissions

| Role | Primary Workspace | Authorization Scope |
| :--- | :--- | :--- |
| **`learner`** | `/learn` | Enrolls in courses, tracks progress, takes quizzes, saves notes, and manages profile. |
| **`instructor`**| `/instructor` | Edits curriculum, lessons, and quizzes for assigned courses in `course_instructors`. |
| **`sub_admin`** | `/admin` | Accesses Admin Studio with permissions defined in `staff_permissions`. |
| **`admin`** | `/admin` | Root platform administrator with full access to users, staff, system health, and audit logs. |

---

## Database & Schema

Meritloom’s PostgreSQL database is organized into structured domain areas:

- **Content**: `courses`, `course_modules`, `lessons`, `categories`, `skills`, `course_skills`, `lesson_resources`, `lesson_objectives`
- **Learner Progress**: `profiles`, `course_enrollments`, `lesson_progress`, `saved_courses`, `lesson_notes`, `lesson_bookmarks`, `lesson_practice_drafts`
- **Knowledge Checks**: `practice_quizzes`, `practice_questions`, `practice_question_options`, `practice_question_correct_options`, `practice_quiz_attempts`
- **Learning Paths**: `learning_paths`, `learning_path_items`
- **Administration & Staff**: `staff_permissions`, `course_instructors`, `admin_audit_log`, `support_messages`
- **Telemetry & Health**: `system_performance_metrics`

### Important Constraints & Conventions
- `course_modules`: `UNIQUE(course_id, slug)` and `UNIQUE(course_id, position)`
- `lessons`: `UNIQUE(slug)`
- `practice_question_correct_options`: Separated into a private table protected by Row Level Security so correct answers are never sent to the client browser before submission.

---

## Course Content Model

Current curriculum included in database migrations and seed scripts:

1. **HTML Fundamentals (`html-fundamentals`)**: 5 modules, 37 structured lessons covering elements, semantic markup, forms, tables, accessibility, and modern layout.
2. **CSS Fundamentals (`css-fundamentals`)**: 6 modules, 40 structured lessons covering selectors, box model, Flexbox, Grid, transitions, animations, and responsive design.
3. **JavaScript Fundamentals (`javascript-fundamentals`)**: 6 modules, 41 structured lessons covering variables, data types, functions, DOM manipulation, async/await, and modern ES6+.

---

## Knowledge Checks

- Module-level comprehension quizzes containing single-choice, multiple-choice, and code output evaluation questions.
- **Server-Side Grading**: Submission evaluated via Server Action (`submitQuizAttemptAction`) that queries `practice_question_correct_options` on the server.
- **Immediate Explanations**: Learners receive comprehensive explanations for each option after submitting.
- **Unlimited Retries**: Non-punitive scoring designed for mastery reinforcement.

---

## Practice Workspace

- Split-pane code editor supporting HTML, CSS, and JavaScript.
- **Sandboxed Execution**: Code renders inside an isolated `<iframe>` with strict sandbox attributes (`allow-scripts`, `allow-modals`), ensuring learner code cannot access application cookies or local storage.
- **Local & Database Persistence**: Code drafts persist across sessions via `lesson_practice_drafts`.

---

## Learning Paths

- Curated multi-course journeys designed to guide learners from beginner to proficient.
- **Web Development Foundations (`web-development-foundations`)**: HTML Fundamentals &rarr; CSS Fundamentals &rarr; JavaScript Fundamentals.
- Visual milestone indicators, cumulative progress calculations, and path completion certificates.

---

## System Health & Observability

Located at `/admin/system` (accessible to root admins and sub-admins with `system.view`):

- **Live Service Latency**: Measures database query latency and authentication service response times.
- **Sanitized Operational Errors**: Real-time aggregation of server exceptions grouped by route and category.
- **Telemetry Protection**: Strips all query parameters, tokens, OAuth codes, passwords, and private user payloads before recording metrics.

---

## Error Handling

- **Branded 404 (`src/app/not-found.tsx`)**: Replaces default framework 404s with a branded illustration, quick navigation links (`Go to home`, `Explore courses`, `Go back`), and zero database query overhead.
- **Segment Error Boundary (`src/app/error.tsx`)**: Gracefully catches client and segment exceptions, allows segment retry via `reset()`, and provides a collapsible safe error reference disclosure with one-click clipboard copying.
- **Global Error Boundary (`src/app/global-error.tsx`)**: Self-contained catastrophic root failure boundary rendering minimal HTML/body tags.
- **Dedicated Error Page (`src/app/error/page.tsx`)**: Controlled catalog-driven redirect target for HTTP 401, 403, 500, and 503 states.

---

## Security Architecture

- **Row Level Security (RLS)**: Enforced across all tables in PostgreSQL. Learners can only read/write their own enrollments, notes, progress, and drafts.
- **Strict Server Guards**: Role and permission checks execute inside Server Components and Server Actions; client-side navigation restrictions are purely visual.
- **Service-Role Key Isolation**: The Supabase service-role key is never exposed to the client bundle and is never prefixed with `NEXT_PUBLIC_`.
- **Sensitive Data Sanitization**: Error boundaries and logging utilities automatically sanitize technical messages, SQL queries, and authorization headers.
- **Sandboxed Code Execution**: Learner code evaluation occurs exclusively within restricted iframe sandboxes.

---

## Performance Optimizations

- **Server Components by Default**: Zero client JavaScript shipped for static curriculum views, landing pages, and read-only layouts.
- **Request Memoization**: Repeated auth and profile lookups are wrapped in React `cache()` to execute at most once per HTTP request.
- **Composite Database Indexes**: Optimized PostgreSQL composite indexes on `(user_id, course_id)`, `(user_id, lesson_id)`, and `(course_id, position)`.
- **Next.js Route Prefetching**: Instant route transitions across public and learner navigation links.
- **Image Optimization**: Configured remote image domains (`lh3.googleusercontent.com`, `*.supabase.co`, `images.unsplash.com`, `i.ytimg.com`) with modern WebP/AVIF formats.

---

## Getting Started

### Prerequisites

- **Node.js**: `v20.x` or `v22.x` recommended
- **Package Manager**: `npm` (v10+)
- **Supabase Project**: A hosted Supabase project or local Supabase CLI instance

### Installation

```bash
# Clone the repository
git clone https://github.com/iRfANhAiDeRABiR/Meritloom--Mastery-Learning-Platform.git
cd Meritloom--Mastery-Learning-Platform

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Configure the following variables:

| Variable | Required | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | Your Supabase project URL (`https://<ref>.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | Your Supabase public anonymous API key |
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical site URL (defaults to `http://localhost:3000` in development) |
| `YOUTUBE_API_KEY` | Optional | YouTube Data API v3 key (only needed for admin YouTube playlist import tools) |

> **Security Note**: Never place the `SUPABASE_SERVICE_ROLE_KEY` inside `.env.local` or prefix it with `NEXT_PUBLIC_`.

### Supabase Setup & Migrations

1. Link your Supabase project or run local Supabase:
   ```bash
   npx supabase link --project-ref <your-project-ref>
   ```
2. Apply migrations sequentially:
   ```bash
   npx supabase db push
   ```
   *(Or execute the migration SQL files located in `supabase/migrations/` in ascending numerical order via the Supabase SQL Editor).*

3. Configure Authentication URLs in your Supabase Dashboard:
   - **Site URL**: `http://localhost:3000` (development) or `https://meritloom.iabir.me` (production)
   - **Redirect URLs**:
     - `http://localhost:3000/auth/callback`
     - `https://meritloom.iabir.me/auth/callback`

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| **`dev`** | `npm run dev` | Start Next.js development server with Turbopack |
| **`build`** | `npm run build` | Compile optimized production build |
| **`start`** | `npm run start` | Start production server |
| **`lint`** | `npm run lint` | Run ESLint checks across all project files |
| **`typecheck`** | `npm run typecheck` | Run TypeScript compiler type checking (`tsc --noEmit`) |

---

## Production Build & Deployment

Meritloom is deployed using [Vercel](https://vercel.com/) with automated deployments from the `main` branch.

```bash
# Verify typecheck and linting
npm run typecheck
npm run lint

# Build production bundle
npm run build
```

Production domain: **[https://meritloom.iabir.me](https://meritloom.iabir.me)**

---

## Troubleshooting

### Google OAuth redirects to wrong domain or fails
- **Cause**: Supabase Authentication **Site URL** or **Redirect URLs** does not match the current origin.
- **Solution**: Ensure `https://meritloom.iabir.me/auth/callback` (or `http://localhost:3000/auth/callback`) is added to Supabase **Authentication &rarr; URL Configuration &rarr; Redirect URLs**.

### `redirect_uri_mismatch` on Google Sign-In
- **Cause**: The redirect URI configured in Google Cloud Console does not match Supabase's callback URL.
- **Solution**: In Google Cloud Console &rarr; Credentials &rarr; OAuth 2.0 Client IDs, set the **Authorized redirect URI** to `https://<your-supabase-ref>.supabase.co/auth/v1/callback`.

### Broken Avatar Images
- **Cause**: Image domain is not listed in `next.config.ts` or image URL is malformed.
- **Solution**: The unified avatar component automatically falls back to letter initials on error. Ensure custom hosts are added to `images.remotePatterns` in `next.config.ts`.

### Database Seed Unique Constraint Error
- **Cause**: Re-running content seed scripts on existing courses where slugs or positions conflict.
- **Solution**: Ensure seed scripts use `ON CONFLICT (slug) DO UPDATE` or `ON CONFLICT (course_id, slug) DO NOTHING` rather than raw `INSERT` statements.

---

## Content Attribution

Some course curriculum modules link to externally hosted educational videos (such as the W3Schools YouTube curriculum playlist). All rights and attribution remain with the original content creators and publishers.

---

## Development Guidelines

- **Server Components First**: Use Server Components for all data fetching and pages; only add `"use client"` when state or event listeners are required.
- **Request Memoization**: Wrap multi-use server queries in React `cache()`.
- **Zero Client Secrets**: Never reference private API keys or service credentials in client components.
- **Strict Verification**: Always verify changes by running `npm run typecheck`, `npm run lint`, and `npm run build` prior to committing.

---

## License

All rights reserved. Proprietary software.
