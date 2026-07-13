# PureMaids — Technical Handbook

> **Enterprise-grade documentation for the PureMaids cleaning service platform.**
> This document is the definitive reference for developers, DevOps engineers, database architects, and security consultants working on the PureMaids SaaS platform.

---

## Table of Contents

| Section | Title |
|---------|-------|
| 1 | [Project Overview](#1-project-overview) |
| 2 | [System Architecture](#2-system-architecture) |
| 3 | [Project Structure](#3-project-structure) |
| 4 | [Installation](#4-installation) |
| 5 | [Environment Variables](#5-environment-variables) |
| 6 | [User Types](#6-user-types) |
| 7 | [User Journeys](#7-user-journeys) |
| 8 | [Database](#8-database) |
| 9 | [API](#9-api) |
| 10 | [Authentication](#10-authentication) |
| 11 | [Authorization](#11-authorization) |
| 12 | [Booking Engine](#12-booking-engine) |
| 13 | [Payment System](#13-payment-system) |
| 14 | [Email System](#14-email-system) |
| 15 | [File Storage](#15-file-storage) |
| 16 | [Logging](#16-logging) |
| 17 | [Error Handling](#17-error-handling) |
| 18 | [Testing](#18-testing) |
| 19 | [Deployment](#19-deployment) |
| 20 | [Monitoring](#20-monitoring) |
| 21 | [Scalability](#21-scalability) |
| 22 | [Troubleshooting](#22-troubleshooting) |
| 23 | [Future Roadmap](#23-future-roadmap) |
| 24 | [Contributing](#24-contributing) |
| 25 | [Appendix](#25-appendix) |

---

&nbsp;

---

## 1. Project Overview

### 1.1 What PureMaids Is

PureMaids is a **SaaS cleaning service platform** that connects customers in Bolton and the Greater Manchester area with professional, DBS-checked cleaners. The platform handles the entire lifecycle of a cleaning booking — from instant online quoting and deposit-based payment to cleaner assignment, job tracking, invoicing, and subscription management.

PureMaids is not a marketplace. It is a **vertically integrated service platform** where all cleaners are employed or contracted directly by PureMaids Ltd, ensuring quality control, accountability, and a consistent customer experience.

### 1.2 Business Objectives

| Objective | Description |
|-----------|-------------|
| **Frictionless booking** | Customers can get a quote and book a cleaning service in under 2 minutes without a phone call. |
| **Deposit-based revenue** | Secure bookings with a 20% deposit via Stripe, reducing no-shows and improving cash flow. |
| **Subscription retention** | Offer weekly, fortnightly, and monthly plans to create predictable recurring revenue. |
| **Operational efficiency** | Provide cleaners and admin staff with digital tools for check-in, task tracking, and issue reporting. |
| **Trust and compliance** | Maintain GDPR compliance, DBS verification, and transparent pricing to build customer confidence. |
| **Local market dominance** | Target Bolton and 8 surrounding towns with SEO-optimised, location-specific landing pages. |

### 1.3 Target Users

The platform serves **four primary user categories**:

1. **Customers** — Homeowners and tenants booking domestic, deep, end-of-tenancy, or office cleaning.
2. **Cleaners** — Field staff who receive job assignments, check in/out, complete task lists, and report issues.
3. **Administrators** — Office staff who manage bookings, assign cleaners, process refunds, and view revenue.
4. **Anonymous visitors** — Prospective customers browsing the website, getting quotes, and submitting enquiries.

### 1.4 Key Features

| Feature | Description |
|---------|-------------|
| Instant quoting | Service selection with live price calculation including optional extras |
| 3-step booking wizard | Service selection → customer details → payment (deposit or full) |
| Stripe payments | Card, Apple Pay, Google Pay via Stripe Checkout |
| Subscription plans | Weekly, fortnightly, monthly recurring cleaning with Stripe Subscriptions |
| Cleaner assignment | Admin assigns cleaners to bookings; cleaners see their schedule |
| Job tracking | Check-in/check-out with duration calculation, task lists, photo uploads |
| Issue reporting | Cleaners can flag issues with severity levels for admin attention |
| Automated notifications | Database-triggered notifications on booking status changes |
| Invoice generation | Automatic invoice numbering with PDF storage |
| Refund management | Admin panel for full and partial refunds via Stripe |
| Customer portal | Authenticated users can view invoices, bookings, and notifications |
| Availability management | Cleaners set recurring and date-specific availability |
| Review system | Customers can rate and review completed services |
| GDPR compliance | Cookie consent banner, privacy policy, data retention controls |
| SEO optimisation | LocalBusiness and FAQPage schema.org structured data, per-page metadata |
| PWA support | Web app manifest for installable home screen experience |

### 1.5 SaaS Architecture

PureMaids follows a **serverless SaaS architecture**:

- **Frontend**: Next.js 14 App Router with server-side rendering and static generation
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions + Storage)
- **Payments**: Stripe (Checkout, Subscriptions, Payment Intents, Refunds)
- **Email**: Resend (transactional email delivery)
- **Hosting**: Bolt (managed Next.js deployment)

The platform is designed as a **multi-tenant single-instance** SaaS — all customers share one database instance with Row Level Security enforcing data isolation at the PostgreSQL level.

### 1.6 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend framework | Next.js | 14.1.0 |
| UI library | React | 18.3.1 |
| Language | TypeScript | 5.5.3 |
| Styling | Tailwind CSS | 3.4.4 |
| Database | PostgreSQL (Supabase) | 15.x |
| Auth + DB client | Supabase JS SDK | 2.45.0 |
| Payments | Stripe Node SDK | 15.0.0 |
| Stripe client | Stripe.js | 4.0.0 |
| Email | Resend | via Edge Function |
| Edge runtime | Deno | (Supabase Edge Functions) |
| Package manager | npm | 10.x |
| Node.js | Node | 20.x |
| Font loading | next/font (Inter + Plus Jakarta Sans) | — |
| Image optimisation | next/image (AVIF + WebP) | — |

### 1.7 High-Level System Architecture

```mermaid
graph TB
    subgraph "Client"
        A[Browser / Mobile]
    end

    subgraph "Next.js 14 App Router"
        B[SSR / SSG Pages]
        C[Client Components]
        D[API Routes]
    end

    subgraph "Supabase Platform"
        E[PostgreSQL Database]
        F[Auth Service]
        G[Edge Functions — Deno]
        H[Storage Buckets]
        I[Realtime Subscriptions]
    end

    subgraph "External Services"
        J[Stripe API]
        K[Resend Email API]
    end

    A -->|HTTPS| B
    A -->|Client-side rendering| C
    B -->|Server-side queries| E
    B -->|Auth checks| F
    C -->|Supabase JS SDK| E
    C -->|Supabase JS SDK| F
    C -->|fetch()| G
    C -->|Realtime| I
    D -->|Service Role| E
    G -->|Stripe SDK| J
    G -->|fetch()| K
    G -->|Service Role| E
    G -->|Upload| H
    J -->|Webhook| G
```

### 1.8 Development Philosophy

| Principle | Implementation |
|-----------|---------------|
| **Security first** | RLS on every table, fixed `search_path` on all functions, CSP headers, SECURITY INVOKER views |
| **Type safety** | Strict TypeScript (`"strict": true`), no implicit `any`, typed Supabase responses |
| **Convention over configuration** | Next.js App Router file-based routing, Tailwind component classes |
| **Progressive enhancement** | Core booking flow works without JavaScript; enhancements layered on top |
| **Accessibility as a requirement** | WCAG 2.1 AA compliance, skip links, ARIA landmarks, keyboard navigation |
| **Performance budget** | < 100 kB shared JS bundle, lazy-loaded routes, AVIF/WebP images |
| **GDPR by design** | Cookie consent, data retention policies, user data export and deletion rights |

---

&nbsp;

---

## 2. System Architecture

### 2.1 Architecture Overview

PureMaids uses a **serverless-first architecture** where the database is the source of truth and Edge Functions handle business logic that cannot be expressed in SQL alone. The frontend communicates with the database directly via the Supabase JS SDK (using the anon key with RLS) for CRUD operations, and via Edge Functions for operations requiring secrets (Stripe, Resend).

### 2.2 Component Diagram

```mermaid
graph LR
    subgraph "Presentation Layer"
        UI[Next.js Pages & Components]
    end

    subgraph "Business Logic Layer"
        EF1[create-checkout]
        EF2[stripe-webhook]
        EF3[process-refund]
        EF4[send-reminder]
        EF5[notify-booking]
        TR[Database Triggers]
    end

    subgraph "Data Layer"
        DB[(PostgreSQL)]
        RLS[Row Level Security]
        IDX[Indexes]
        VW[Views]
    end

    subgraph "External Services"
        ST[Stripe]
        RS[Resend]
    end

    subgraph "Auth Layer"
        AU[Supabase Auth]
        JW[JWT Tokens]
    end

    UI -->|Anon Key + RLS| DB
    UI -->|fetch()| EF1
    UI -->|fetch()| EF3
    EF1 -->|Stripe SDK| ST
    EF2 -->|Webhook| ST
    EF2 -->|Service Role| DB
    EF2 -->|fetch()| RS
    EF3 -->|Stripe SDK| ST
    EF4 -->|fetch()| RS
    EF4 -->|Service Role| DB
    EF5 -->|fetch()| RS
    TR -->|Trigger on INSERT/UPDATE| DB
    UI -->|Auth SDK| AU
    AU -->|Issue| JW
    JW -->|Validated by| RLS
```

### 2.3 Frontend

The frontend is a **Next.js 14 App Router** application. Pages are either server-rendered (dynamic) or statically generated at build time. Client components use the `'use client'` directive for interactivity (forms, state, animations).

| Concern | Technology | Notes |
|---------|-----------|-------|
| Routing | App Router (`app/` directory) | File-based, nested layouts |
| Rendering | SSR + SSG | `force-dynamic` for pages with live data; static for content pages |
| Styling | Tailwind CSS 3.4 | Custom design system with brand/accent colour ramps |
| Fonts | `next/font` (Inter + Plus Jakarta Sans) | `display: swap` to prevent layout shift |
| Images | `next/image` | AVIF/WebP, lazy loading, priority for hero |
| Animations | Tailwind `animation` + `keyframes` | `prefers-reduced-motion` respected |
| State | React `useState` / `useEffect` | No global state library — data fetched per-page |
| API calls | `fetch()` to Edge Functions | Supabase JS SDK for direct DB queries |

### 2.4 Backend

The backend is **Supabase Edge Functions** (Deno runtime) for operations requiring server-side secrets, and **PostgreSQL triggers and functions** for data-level automation.

| Function | Purpose | Auth |
|----------|---------|------|
| `create-checkout` | Creates Stripe Checkout sessions for bookings and subscriptions | Anon key (public) |
| `stripe-webhook` | Receives Stripe webhook events, updates payment/booking status | Stripe webhook signature |
| `process-refund` | Issues full or partial refunds via Stripe | User JWT (admin-only via RLS) |
| `send-reminder` | Sends booking reminder emails via Resend | Supabase service role (cron-triggered) |
| `notify-booking` | Sends booking confirmation/notification emails via Resend | Supabase service role (triggered by webhook) |

### 2.5 Database

PostgreSQL 15 hosted on Supabase. The database contains **22 tables**, **2 views**, **14 functions**, and **14 triggers**. Row Level Security is enabled on every table.

```mermaid
erDiagram
    bookings ||--o{ booking_extras : "has"
    bookings ||--o| payments : "paid_by"
    bookings ||--o| invoices : "billed_via"
    bookings ||--o| job_checkins : "tracked_by"
    bookings ||--o{ job_tasks : "has"
    bookings ||--o{ job_photos : "documented_by"
    bookings ||--o| job_issues : "may_have"
    bookings ||--o| reviews : "reviewed_by"
    bookings ||--o| notifications : "triggers"
    bookings }o--|| cleaners : "assigned_to"
    cleaners ||--o{ availability : "has"
    cleaners ||--o{ availability_overrides : "has"
    cleaners ||--o{ cleaner_notifications : "receives"
    cleaners ||--o| cleaner_profiles : "profile"
    cleaners ||--o{ job_checkins : "performs"
    subscription_plans ||--o{ subscriptions : "subscribed_to"
    payments ||--o| invoices : "generates"
    admin_profiles }o--|| auth_users : "is"
    customer_profiles }o--|| auth_users : "is"
    cleaner_profiles }o--|| auth_users : "is"
```

### 2.6 Authentication

Supabase Auth provides JWT-based authentication. The platform uses email/password authentication (no social providers or magic links, per product requirements). Sessions are managed by the Supabase JS SDK, which stores the access token and refresh token in browser storage.

| Aspect | Implementation |
|--------|---------------|
| Provider | Supabase Auth (email/password) |
| Token type | JWT (access token) + refresh token |
| Token storage | Browser localStorage (default) |
| Token refresh | Automatic via Supabase JS SDK |
| Email confirmation | Disabled (per product requirement) |
| MFA | Not currently implemented (roadmap) |
| Password reset | Supabase Auth `resetPasswordForEmail()` |

### 2.7 Payments

Stripe handles all payment processing. The platform uses **Stripe Checkout** for one-time payments (deposits and full payments) and **Stripe Subscriptions** for recurring cleaning plans.

```mermaid
sequenceDiagram
    participant C as Customer
    participant N as Next.js
    participant EF as Edge Function
    participant S as Stripe
    participant DB as Database

    C->>N: Selects service, fills details
    N->>DB: Inserts booking (status: pending)
    N->>EF: POST /create-checkout
    EF->>S: Creates Checkout Session
    S-->>EF: Returns session URL
    EF-->>N: Returns URL
    N->>S: Redirects to Stripe Checkout
    C->>S: Pays deposit/full
    S->>EF: Webhook: checkout.session.completed
    EF->>DB: Updates booking (status: confirmed, deposit_paid)
    EF->>DB: Creates payment record
    S-->>C: Redirects to /book/success
```

### 2.8 Storage

Supabase Storage is used for invoice PDFs and job photos. Storage buckets are configured with appropriate access policies.

| Bucket | Contents | Access |
|--------|----------|--------|
| `invoices` | Generated PDF invoices | Customer can read own invoices; admin can read all |
| `job-photos` | Before/after photos uploaded by cleaners | Cleaner can read/write own; admin can read all |

### 2.9 Email

Transactional emails are sent via **Resend** through Edge Functions. The platform does not currently use email templates stored in Resend — emails are composed inline in the Edge Function code.

| Trigger | Template | Sent by |
|---------|----------|---------|
| Booking confirmed | Confirmation email with booking reference | `notify-booking` Edge Function |
| Booking reminder | 24-hour reminder before scheduled clean | `send-reminder` Edge Function (cron) |
| Payment receipt | Receipt after successful payment | `stripe-webhook` Edge Function |
| Refund processed | Refund confirmation | `process-refund` Edge Function |

### 2.10 Notifications

In-app notifications are generated by a **PostgreSQL trigger** (`notify_on_booking_status_change`) that fires on `bookings` table updates. When a booking status changes to `confirmed`, `completed`, or `cancelled`, a row is inserted into the `notifications` table.

| Notification type | Trigger | Recipient |
|-------------------|---------|-----------|
| `booking_confirmed` | Booking status → confirmed | Customer (user_id) |
| `booking_completed` | Booking status → completed | Customer (user_id) |
| `booking_cancelled` | Booking status → cancelled | Customer (user_id) |

### 2.11 API

The platform exposes two types of API:

1. **Supabase REST API** (auto-generated from PostgreSQL) — available at `/rest/v1/` for all tables with RLS
2. **Edge Functions** (Deno) — available at `/functions/v1/` for business logic

See [Section 9](#9-api) for full endpoint documentation.

### 2.12 Caching

| Layer | Strategy |
|-------|----------|
| Next.js | Static generation for content pages (privacy, terms, cookies) |
| Browser | `Cache-Control` headers set via Next.js config |
| Supabase | Connection pooling via Supabase's PgBouncer |
| CDN | Bolt's edge CDN caches static assets |

### 2.13 Analytics

Analytics are not currently implemented. The cookie banner includes an analytics toggle (disabled by default) for future Google Analytics 4 integration.

### 2.14 Logging

| Layer | What is logged |
|-------|---------------|
| Edge Functions | `console.log()` output captured by Supabase |
| Database | Trigger-based audit logging (roadmap) |
| Client | Error boundary captures and displays errors |
| Stripe | Payment events logged in `payments` table |

### 2.15 Monitoring

| Aspect | Tool | Notes |
|---------|------|-------|
| Uptime | Bolt platform monitoring | Automatic health checks |
| Database | Supabase dashboard | Query performance, connection count |
| Edge Functions | Supabase dashboard | Invocation count, error rate, latency |
| Stripe | Stripe dashboard | Payment success rate, webhook delivery |
| Errors | Client-side `ErrorBoundary` | Catches and displays React render errors |

### 2.16 Deployment

```mermaid
graph LR
    subgraph "Developer"
        D[Local Dev]
    end
    subgraph "Bolt Platform"
        B[Build Process]
        N[Next.js Server]
        CDN[Edge CDN]
    end
    subgraph "Supabase Cloud"
        S[PostgreSQL]
        A[Auth Service]
        EF[Edge Functions]
    end
    subgraph "Stripe"
        ST[Stripe API]
        SW[Stripe Webhooks]
    end

    D -->|git push| B
    B -->|Builds| N
    N -->|Serves| CDN
    N -->|Queries| S
    N -->|Auth| A
    EF -->|Deployed via MCP| EF
    EF -->|Calls| ST
    SW -->|POST webhook| EF
```

---

&nbsp;

---

## 3. Project Structure

### 3.1 Directory Tree

```
puremaids/
├── app/                          # Next.js App Router (pages, layouts, styles)
│   ├── globals.css               # Global styles + Tailwind layers + design system
│   ├── layout.tsx                # Root layout (fonts, SEO metadata, schema.org, cookie banner)
│   ├── page.tsx                  # Homepage (hero, services, reviews, FAQ, CTA)
│   ├── loading.tsx               # Route-level loading spinner
│   ├── not-found.tsx             # Custom 404 page
│   ├── global-error.tsx          # Global error boundary (catches unhandled errors)
│   ├── book/                     # Booking flow
│   │   ├── page.tsx              # 3-step booking wizard (service → details → payment)
│   │   ├── success/              # Stripe Checkout success redirect
│   │   │   └── page.tsx
│   │   └── cancel/               # Stripe Checkout cancel redirect
│   │       └── page.tsx
│   ├── subscriptions/            # Subscription plans
│   │   ├── page.tsx              # Plan cards + Stripe subscription checkout
│   │   ├── success/              # Subscription success redirect
│   │   │   └── page.tsx
│   │   └── cancel/               # Subscription cancel redirect
│   │       └── page.tsx
│   ├── account/                  # Customer portal (authenticated)
│   │   └── invoices/
│   │       └── page.tsx          # Invoice list with download links
│   ├── admin/                    # Admin panel (admin-only)
│   │   └── refunds/
│   │       └── page.tsx          # Refund management with modal
│   ├── privacy/                  # GDPR privacy policy
│   │   └── page.tsx
│   ├── terms/                    # Terms & conditions
│   │   └── page.tsx
│   └── cookies/                  # Cookie policy
│       └── page.tsx
├── components/                   # Shared React components
│   ├── layout/                   # Structural components
│   │   ├── Nav.tsx               # Sticky nav with mobile drawer
│   │   └── Footer.tsx            # Footer with trust signals, legal links
│   ├── ui/                       # Reusable UI primitives
│   │   ├── Spinner.tsx           # Accessible loading spinner
│   │   ├── ErrorBoundary.tsx     # React error boundary
│   │   └── Stars.tsx             # Star rating component
│   └── gdpr/                     # GDPR components
│       └── CookieBanner.tsx      # Cookie consent with granular toggles
├── lib/                          # Shared business logic and utilities
│   ├── constants.ts              # Business constants (services, prices, areas, reviews)
│   ├── pricing.ts                # Price calculation and formatting
│   ├── stripe-api.ts             # Client-side Stripe API wrappers
│   ├── subscription-plans.ts     # Subscription plan definitions
│   └── supabase-client.ts        # Supabase client singleton
├── public/                       # Static assets
│   ├── manifest.json             # PWA manifest
│   └── robots.txt                # Crawler directives
├── supabase/                     # Supabase configuration
│   └── functions/                # Edge Functions (Deno)
│       └── create-checkout/
│           └── index.ts          # Stripe Checkout session creation
├── package.json                  # Dependencies and scripts
├── next.config.js                # Next.js config (security headers, image optimisation)
├── tailwind.config.js            # Tailwind theme (colours, animations, fonts)
├── postcss.config.js             # PostCSS plugins
├── tsconfig.json                 # TypeScript compiler config
├── next-env.d.ts                 # Next.js type declarations
└── README.md                     # This document
```

### 3.2 Folder Purposes

| Folder | Purpose |
|--------|---------|
| `app/` | Next.js App Router — all pages, layouts, and route-level error/loading states |
| `components/` | Shared React components organised by domain (layout, ui, gdpr) |
| `lib/` | Business logic, constants, API wrappers, and the Supabase client |
| `public/` | Static files served at the root URL (manifest, robots.txt, icons) |
| `supabase/functions/` | Deno Edge Functions deployed to Supabase |
| `supabase/migrations/` | SQL migration files (applied via Supabase MCP tool) |

### 3.3 Key File Reference

| File | Role |
|------|------|
| `app/layout.tsx` | Root HTML shell — fonts, `<head>`, metadata, schema.org JSON-LD, skip link, cookie banner |
| `app/globals.css` | Tailwind layers + design system (buttons, cards, inputs, badges, alerts, animations) |
| `app/page.tsx` | Homepage with 7 sections: hero, stats, trust badges, services, how-it-works, reviews, areas, FAQ, CTA |
| `app/book/page.tsx` | 3-step booking wizard with live price calculation and Stripe Checkout integration |
| `lib/constants.ts` | All business data: services, extras, pricing, service areas, reviews, trust stats |
| `lib/pricing.ts` | `calcPrice()` function for deposit/total calculation, GBP and date formatting |
| `lib/stripe-api.ts` | `fetch()` wrappers for `create-checkout` and `process-refund` Edge Functions |
| `lib/supabase-client.ts` | Lazy-initialised Supabase client via Proxy (avoids module-eval-time errors) |
| `next.config.js` | Security headers (CSP, HSTS, X-Frame-Options, etc.), image optimisation, `poweredByHeader: false` |
| `tailwind.config.js` | Brand/accent colour ramps, custom animations (fade-in, slide-up, pulse-dot, bounce-y) |
| `components/layout/Nav.tsx` | Sticky nav with scroll-based transparency, mobile drawer with Escape-to-close |
| `components/gdpr/CookieBanner.tsx` | GDPR consent with analytics/marketing toggles, `localStorage` persistence, `gdpr:consent` event |

---

&nbsp;

---

## 4. Installation

### 4.1 Prerequisites

| Requirement | Minimum Version | Notes |
|-------------|-----------------|-------|
| Node.js | 20.x | Use `nvm use 20` or `fnm use 20` |
| npm | 10.x | Comes with Node 20 |
| Git | 2.40+ | For version control |
| Supabase account | — | Project must be provisioned (already done in this environment) |
| Stripe account | — | API keys required for payments |
| Resend account | — | API key required for transactional email |

### 4.2 Environment Setup

The Supabase project is already provisioned. The following credentials are pre-populated in the environment and `.env` file:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only, used by Edge Functions)
- `STRIPE_SECRET_KEY` (stored as an Edge Function secret)
- `RESEND_API_KEY` (stored as an Edge Function secret)
- `STRIPE_WEBHOOK_SECRET` (stored as an Edge Function secret)
- `SITE_URL` (stored as an Edge Function secret)

### 4.3 Development Setup

```bash
# 1. Clone the repository
git clone <repo-url> puremaids
cd puremaids

# 2. Install dependencies
npm install

# 3. Create .env.local with required variables
# (See Section 5 for full variable list)
cp .env.example .env.local
# Edit .env.local with your values

# 4. Start the development server
npm run dev
# The app will be available at http://localhost:3000
```

### 4.4 Production Setup

```bash
# 1. Install dependencies (production-only)
npm ci

# 2. Build the application
npm run build

# 3. Start the production server
npm start
```

### 4.5 Stripe Webhook Setup (Local Development)

For local development, use the Stripe CLI to forward webhooks to your local server:

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Forward webhooks to local Edge Function
stripe listen --forward-to https://<your-supabase-project>.supabase.co/functions/v1/stripe-webhook

# Copy the webhook signing secret and add it as an Edge Function secret:
# STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4.6 Edge Function Deployment

Edge Functions are deployed using the Supabase MCP tool. To deploy or update an Edge Function:

1. Write the function source to `supabase/functions/<slug>/index.ts`
2. Deploy using the `deploy_edge_function` MCP tool with the appropriate slug and `verify_jwt` setting

Currently deployed Edge Functions:

| Slug | verify_jwt | Purpose |
|------|------------|---------|
| `create-checkout` | false | Public — creates Stripe Checkout sessions |
| `stripe-webhook` | false | Public — receives Stripe webhooks (verified by signature) |
| `process-refund` | false | JWT verified inside function via admin_profiles RLS |
| `send-reminder` | false | Cron-triggered — sends reminder emails |
| `notify-booking` | false | Triggered by webhook — sends booking notification emails |

---

&nbsp;

---

## 5. Environment Variables

### 5.1 Complete Variable Reference

| Variable | Purpose | Required | Example | Security Notes |
|----------|---------|----------|---------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL used by the client SDK | Yes | `https://xyz.supabase.co` | Public — safe to expose in browser |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key for client-side queries (RLS-protected) | Yes | `eyJhbGciOi...` | Public — safe to expose, RLS enforces access |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key for Edge Functions (bypasses RLS) | Yes (server) | `eyJhbGciOi...` | **NEVER expose in client code** — full DB access |
| `SUPABASE_URL` | Same as public URL, used by Edge Functions | Yes (server) | `https://xyz.supabase.co` | Server-only |
| `SUPABASE_ANON_KEY` | Same as anon key, used by Edge Functions | Yes (server) | `eyJhbGciOi...` | Server-only |
| `STRIPE_SECRET_KEY` | Stripe API secret key for creating charges, refunds, sessions | Yes (server) | `sk_live_...` or `sk_test_...` | **NEVER expose in client code** |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret for verifying webhook payloads | Yes (server) | `whsec_...` | Server-only — used to verify webhook authenticity |
| `RESEND_API_KEY` | Resend API key for sending transactional emails | Yes (server) | `re_...` | Server-only |
| `SITE_URL` | Public site URL for Stripe Checkout redirect URLs | Yes (server) | `https://puremaids.co.uk` | Used in success/cancel URLs |

### 5.2 Edge Function Secrets

The following secrets are configured on the Supabase Edge Functions:

| Secret Name | Used By |
|-------------|---------|
| `SUPABASE_URL` | All functions |
| `SUPABASE_ANON_KEY` | `create-checkout` |
| `SUPABASE_SERVICE_ROLE_KEY` | `stripe-webhook`, `send-reminder`, `notify-booking`, `process-refund` |
| `STRIPE_SECRET_KEY` | `create-checkout`, `process-refund`, `stripe-webhook` |
| `STRIPE_WEBHOOK_SECRET` | `stripe-webhook` |
| `RESEND_API_KEY` | `send-reminder`, `notify-booking` |
| `SITE_URL` | `create-checkout`, `stripe-webhook` |

### 5.3 Security Rules

1. **Never commit `.env` files to git.** Add `.env` and `.env.local` to `.gitignore`.
2. **Never use `SUPABASE_SERVICE_ROLE_KEY` in client-side code.** It bypasses RLS entirely.
3. **Never use `STRIPE_SECRET_KEY` in client-side code.** It can create charges.
4. **Prefix client-safe variables with `NEXT_PUBLIC_`.** Next.js only exposes variables with this prefix to the browser.
5. **Rotate keys regularly.** Especially after team member departures.

---

&nbsp;

---

## 6. User Types

### 6.1 User Type Overview

The platform distinguishes between **eight user types**, though only four have distinct database-level implementations. The remaining four are conceptual roles within the admin hierarchy.

```mermaid
graph TD
    A[Anonymous Visitor] -->|Creates account| B[Customer]
    A -->|Submits enquiry| A
    B -->|Books service| B
    B -->|Becomes cleaner| C[Cleaner]
    C -->|Promoted| D[Supervisor]
    D -->|Promoted| E[Office Staff]
    E -->|Promoted| F[Manager]
    F -->|Promoted| G[Administrator]
    G -->|Owner| H[Owner]

    style A fill:#e5e7eb
    style B fill:#d3f2ea
    style C fill:#aae4d5
    style D fill:#70cebb
    style E fill:#3cb5a0
    style F fill:#259a87
    style G fill:#1b7c6d
    style H fill:#14413b
```

### 6.2 Anonymous Visitor

| Aspect | Description |
|--------|-------------|
| **Purpose** | Prospective customer browsing the website, getting quotes, and submitting enquiries |
| **Authentication** | None — no login required |
| **Database identity** | No `auth.uid()` — operates under the `anon` role |
| **Allowed actions** | View all public pages; get instant quotes; submit booking (guest checkout); submit contact enquiries |
| **Restricted actions** | Cannot view invoices, bookings, or account pages; cannot access admin; cannot subscribe to plans (requires login) |
| **Security rules** | RLS policies for `anon` role on `bookings` (INSERT with `user_id IS NULL AND status = 'pending'`), `booking_extras` (INSERT referencing unowned pending booking), `contact_enquiries` (INSERT with `status = 'new'`) |

### 6.3 Customer

| Aspect | Description |
|--------|-------------|
| **Purpose** | Authenticated user who books and manages cleaning services |
| **Authentication** | Supabase Auth (email/password) |
| **Database identity** | `auth.uid()` linked via `customer_profiles.user_id` |
| **Allowed actions** | Everything an anonymous visitor can do, plus: view own bookings; view own invoices; subscribe to plans; leave reviews; manage saved addresses; receive notifications |
| **Restricted actions** | Cannot view other customers' data; cannot access admin or cleaner pages; cannot modify booking status (only admin can) |
| **Security rules** | RLS policies enforce `auth.uid() = user_id` on all customer-facing tables (bookings, invoices, notifications, reviews, saved_addresses, subscriptions) |

### 6.4 Cleaner

| Aspect | Description |
|--------|-------------|
| **Purpose** | Field staff who perform cleaning jobs |
| **Authentication** | Supabase Auth (email/password) |
| **Database identity** | `auth.uid()` linked via `cleaner_profiles.user_id` → `cleaner_profiles.cleaner_id` → `cleaners.id` |
| **Allowed actions** | View assigned bookings; check in/out of jobs; complete task lists; upload job photos; report job issues; manage own availability; receive cleaner notifications |
| **Restricted actions** | Cannot view unassigned bookings; cannot modify booking status (only admin can); cannot access customer contact details beyond what's needed for the job; cannot access financial data |
| **Security rules** | RLS policies on `bookings` check `assigned_cleaner_id IN (SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid())` |

### 6.5 Supervisor

| Aspect | Description |
|--------|-------------|
| **Purpose** | Senior cleaner who oversees a team of cleaners |
| **Authentication** | Supabase Auth (email/password) |
| **Database identity** | `admin_profiles` with `role = 'supervisor'` |
| **Allowed actions** | Everything a cleaner can do, plus: view all bookings for their team; reassign cleaners within their team; approve or reject job issues |
| **Restricted actions** | Cannot process refunds; cannot manage subscription plans; cannot access revenue reports |
| **Security rules** | Same admin RLS policies as other admin roles, with application-level checks on `admin_profiles.role` |

### 6.6 Office Staff

| Aspect | Description |
|--------|-------------|
| **Purpose** | Administrative support staff handling day-to-day operations |
| **Authentication** | Supabase Auth (email/password) |
| **Database identity** | `admin_profiles` with `role = 'staff'` |
| **Allowed actions** | View all bookings; assign cleaners; update booking status; respond to contact enquiries; view all cleaners and availability |
| **Restricted actions** | Cannot process refunds; cannot delete bookings; cannot manage admin accounts |
| **Security rules** | Admin RLS policies check `EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = auth.uid())` |

### 6.7 Manager

| Aspect | Description |
|--------|-------------|
| **Purpose** | Senior staff overseeing operations and staff |
| **Authentication** | Supabase Auth (email/password) |
| **Database identity** | `admin_profiles` with `role = 'manager'` |
| **Allowed actions** | Everything office staff can do, plus: process refunds (full and partial); view revenue reports; manage subscription plans; manage cleaner profiles |
| **Restricted actions** | Cannot manage admin accounts (create/delete admin users) |
| **Security rules** | Admin RLS policies + application-level role checks |

### 6.8 Administrator

| Aspect | Description |
|--------|-------------|
| **Purpose** | System administrator with full access to all platform features |
| **Authentication** | Supabase Auth (email/password) |
| **Database identity** | `admin_profiles` with `role = 'admin'` |
| **Allowed actions** | Full CRUD on all tables; manage admin accounts; configure system settings; process refunds; view all data |
| **Restricted actions** | None (within the application) |
| **Security rules** | Admin RLS policies grant full access based on `admin_profiles` membership |

### 6.9 Owner

| Aspect | Description |
|--------|-------------|
| **Purpose** | Business owner with ultimate authority |
| **Authentication** | Supabase Auth (email/password) |
| **Database identity** | `admin_profiles` with `role = 'owner'` |
| **Allowed actions** | Everything an administrator can do, plus: dissolve the business; transfer ownership; access audit logs |
| **Restricted actions** | None |
| **Security rules** | Same as administrator; the `owner` role is a conceptual distinction in the `admin_profiles.role` column |

### 6.10 Role Summary Table

| Role | `admin_profiles.role` | Bookings | Refunds | Revenue | Admin Mgmt | Cleaners |
|------|----------------------|----------|---------|---------|------------|----------|
| Anonymous | — | Create (guest) | ✗ | ✗ | ✗ | ✗ |
| Customer | — | Own only | ✗ | ✗ | ✗ | ✗ |
| Cleaner | — | Assigned only | ✗ | ✗ | ✗ | Own profile |
| Supervisor | `supervisor` | Team | ✗ | ✗ | ✗ | Team |
| Office Staff | `staff` | All | ✗ | ✗ | ✗ | All |
| Manager | `manager` | All | ✓ | ✓ | ✗ | All |
| Administrator | `admin` | All | ✓ | ✓ | ✓ | All |
| Owner | `owner` | All | ✓ | ✓ | ✓ | All |

---

&nbsp;

---

## 7. User Journeys

### 7.1 Primary Journey: Visitor to Repeat Customer

```mermaid
sequenceDiagram
    actor V as Visitor
    participant W as Website
    participant DB as Database
    participant EF as Edge Function
    participant S as Stripe
    participant E as Email

    V->>W: Visits homepage
    V->>W: Clicks "Get a Quote"
    V->>W: Selects service + extras
    W->>W: Calculates price (client-side)
    V->>W: Fills personal details
    V->>W: Clicks "Pay Deposit"
    W->>DB: INSERT booking (status: pending)
    W->>DB: INSERT booking_extras
    W->>EF: POST /create-checkout
    EF->>S: Create Checkout Session
    S-->>EF: Session URL
    EF-->>W: Redirect URL
    W->>S: Redirect to Stripe Checkout
    V->>S: Pays deposit (card/Apple Pay)
    S->>EF: Webhook: checkout.session.completed
    EF->>DB: UPDATE booking (status: confirmed)
    EF->>DB: INSERT payment record
    EF->>E: Send confirmation email
    S-->>V: Redirect to /book/success?ref=PM-XXXX
    V->>W: Sees success page

    Note over DB: Admin assigns cleaner
    DB->>DB: UPDATE booking SET assigned_cleaner_id

    Note over DB: Day of cleaning
    DB->>DB: Cleaner checks in (job_checkins)
    DB->>DB: Cleaner completes tasks (job_tasks)
    DB->>DB: Cleaner checks out
    DB->>DB: UPDATE booking SET status = 'completed'
    DB->>DB: TRIGGER: notify_on_booking_status_change
    DB->>DB: INSERT notification (booking_completed)

    V->>W: Receives notification
    V->>W: Leaves review
    V->>W: Views invoice
    V->>W: Books again (repeat)
```

### 7.2 Guest Booking Journey (No Account)

```mermaid
flowchart TD
    A[Visitor lands on /book] --> B[Selects service type]
    B --> C[Selects optional extras]
    C --> D[Chooses property size & frequency]
    D --> E[Fills name, email, phone, address]
    E --> F[Selects preferred date & time]
    F --> G[Agrees to GDPR consent]
    G --> H[Reviews booking summary]
    H --> I{Payment choice}
    I -->|Deposit| J[Pay 20% via Stripe]
    I -->|Full| K[Pay 100% via Stripe]
    J --> L[Stripe Checkout]
    K --> L
    L --> M{Payment result}
    M -->|Success| N[Redirect to /book/success]
    M -->|Cancel| O[Redirect to /book/cancel]
    N --> P[Confirmation email sent]
    P --> Q[Booking confirmed in DB]
    O --> R[Booking remains pending]
```

### 7.3 Subscription Journey

```mermaid
sequenceDiagram
    actor C as Customer
    participant W as Website
    participant EF as Edge Function
    participant S as Stripe

    C->>W: Visits /subscriptions
    C->>W: Selects plan (e.g. Fortnightly)
    W->>EF: POST /create-checkout (mode: subscription)
    EF->>S: Create Checkout Session (mode: subscription)
    S-->>EF: Session URL
    EF-->>W: Redirect URL
    W->>S: Redirect to Stripe Checkout
    C->>S: Enters card details
    S->>S: Create subscription + charge
    S->>EF: Webhook: customer.subscription.created
    EF->>S: Confirm subscription active
    S-->>C: Redirect to /subscriptions/success
```

### 7.4 Cleaner Daily Workflow

```mermaid
flowchart TD
    A[Cleaner logs in] --> B[Views today's assigned jobs]
    B --> C[Navigates to job]
    C --> D[Checks in — records timestamp]
    D --> E[Views task list]
    E --> F[Completes each task]
    F --> G{Issues found?}
    G -->|Yes| H[Reports issue with severity]
    G -->|No| I[Uploads before/after photos]
    H --> I
    I --> J[Checks out — records timestamp]
    J --> K[Duration auto-calculated]
    K --> L[Earnings calculated]
```

### 7.5 Admin Refund Journey

```mermaid
sequenceDiagram
    actor A as Admin
    participant W as Website
    participant EF as Edge Function
    participant S as Stripe
    participant DB as Database

    A->>W: Navigates to /admin/refunds
    W->>DB: SELECT payments WHERE status = 'succeeded'
    DB-->>W: Returns payment list
    A->>W: Clicks "Refund" on a payment
    W->>W: Opens refund modal
    A->>W: Enters amount + reason
    A->>W: Clicks "Confirm Refund"
    W->>EF: POST /process-refund (with JWT)
    EF->>DB: Verify admin_profiles (JWT → auth.uid())
    DB-->>EF: Confirmed admin
    EF->>S: stripe.refunds.create()
    S-->>EF: Refund object (status: succeeded)
    EF->>DB: UPDATE payment (refund_amount_pence)
    EF-->>W: Success response
    W->>W: Refresh payment list
```

### 7.6 Notification Journey

```mermaid
flowchart TD
    A[Admin updates booking status] --> B[PostgreSQL trigger fires]
    B --> C{Status changed?}
    C -->|No| D[No action]
    C -->|Yes| E{Which status?}
    E -->|confirmed| F[Insert: booking_confirmed notification]
    E -->|completed| G[Insert: booking_completed notification]
    E -->|cancelled| H[Insert: booking_cancelled notification]
    F --> I[Customer sees notification in account]
    G --> I
    H --> I
```

---

&nbsp;

---

## 8. Database

### 8.1 Database Overview

The PureMaids database runs on **PostgreSQL 15** hosted by Supabase. It contains **22 tables**, **2 views**, **14 functions** (all with fixed `search_path = public, pg_catalog`), and **14 triggers**. Row Level Security (RLS) is enabled on every table.

### 8.2 Migration History

| Migration File | Description |
|----------------|-------------|
| `20260702223206_create_puremaids_schema.sql` | Initial schema: bookings, booking_extras, cleaners, reviews, contact_enquiries |
| `20260702231914_upgrade_booking_system.sql` | Added booking reference, pricing, user_id, assigned_cleaner_id, deposit fields |
| `20260703113903_create_admin_system.sql` | Created admin_profiles table with role hierarchy |
| `20260703114617_admin_profiles_insert_policy.sql` | RLS policy for admin self-insert |
| `20260703121751_create_customer_portal.sql` | Customer profiles, saved addresses, referrals |
| `20260704223501_create_staff_portal.sql` | Cleaner profiles, job checkins, job tasks, job photos, job issues, cleaner notifications, availability |
| `20260705221245_20260705_001_create_payments_table.sql` | Payments table with Stripe integration |
| `20260705221313_20260705_002_create_invoices_table.sql` | Invoices table with auto-numbering |
| `20260705221347_20260705_003_create_availability_tables.sql` | Availability and availability_overrides tables |
| `20260705221418_20260705_004_create_notifications_table.sql` | Customer notifications table |
| `20260705221454_20260705_005_production_hardening.sql` | RLS policies, indexes, security hardening |
| `20260710004857_20260710_001_create_subscription_tables.sql` | Subscription plans and subscriptions tables |
| `20260713154052_20260713_001_fix_security_issues.sql` | Fixed SECURITY DEFINER views, mutable search_path, always-true RLS policies |

### 8.3 Entity-Relationship Diagram

```mermaid
erDiagram
    bookings {
        uuid id PK
        text reference UK
        text first_name
        text last_name
        text email
        text phone
        text address
        text postcode
        text service_type
        text property_size
        text frequency
        date preferred_date
        text preferred_time
        text special_instructions
        boolean gdpr_consent
        text status
        timestamptz created_at
        integer base_price_pence
        integer extras_price_pence
        integer total_price_pence
        boolean deposit_paid
        integer deposit_amount_pence
        text stripe_session_id
        uuid user_id FK
        uuid assigned_cleaner_id FK
        timestamptz updated_at
        text notes
        text internal_notes
    }

    booking_extras {
        uuid id PK
        uuid booking_id FK
        text name
        integer price_pence
        timestamptz created_at
    }

    cleaners {
        uuid id PK
        text full_name
        text email
        text phone
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    payments {
        uuid id PK
        uuid booking_id FK
        uuid user_id
        text stripe_payment_intent_id
        text stripe_charge_id
        text stripe_customer_id
        integer amount_pence
        integer deposit_pence
        text currency
        text status
        text payment_method
        text description
        text failure_reason
        integer refund_amount_pence
        timestamptz refunded_at
        jsonb metadata
        timestamptz created_at
        timestamptz updated_at
    }

    invoices {
        uuid id PK
        uuid booking_id FK
        uuid payment_id FK
        uuid user_id
        text invoice_number UK
        date invoice_date
        date due_date
        integer subtotal_pence
        numeric vat_rate
        integer vat_amount_pence
        integer total_pence
        integer amount_paid_pence
        integer amount_due_pence
        text status
        text customer_name
        text customer_email
        text customer_address
        text service_description
        jsonb line_items
        text notes
        text pdf_url
        timestamptz sent_at
        timestamptz paid_at
        timestamptz voided_at
        timestamptz created_at
        timestamptz updated_at
    }

    bookings ||--o{ booking_extras : has
    bookings ||--o| payments : paid_by
    bookings ||--o| invoices : billed_via
    bookings }o--|| cleaners : assigned_to
```

### 8.4 Table: `bookings`

**Purpose**: Central table storing all cleaning bookings — the core entity of the platform.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NOT NULL | `gen_random_uuid()` | Primary key |
| `reference` | text | NULL | (trigger) | Human-readable booking reference (e.g. `PM-A3F2B1C9`) — auto-generated by `set_booking_reference()` trigger |
| `first_name` | text | NOT NULL | — | Customer first name |
| `last_name` | text | NOT NULL | — | Customer last name |
| `email` | text | NOT NULL | — | Customer email |
| `phone` | text | NOT NULL | — | Customer phone |
| `address` | text | NOT NULL | — | Property address |
| `postcode` | text | NOT NULL | — | Property postcode |
| `service_type` | text | NOT NULL | — | Service key (`domestic`, `deep`, `end_of_tenancy`, `office`) |
| `property_size` | text | NOT NULL | — | Property size (e.g. `2 bedrooms`) |
| `frequency` | text | NOT NULL | — | Frequency (`one_off`, `weekly`, `fortnightly`, `monthly`) |
| `preferred_date` | date | NOT NULL | — | Customer's preferred date |
| `preferred_time` | text | NOT NULL | — | Customer's preferred time slot |
| `special_instructions` | text | NULL | — | Free-text instructions from customer |
| `gdpr_consent` | boolean | NOT NULL | — | Customer agreed to privacy policy |
| `status` | text | NOT NULL | `'pending'` | Booking lifecycle: `pending` → `confirmed` → `completed` / `cancelled` |
| `created_at` | timestamptz | NOT NULL | `now()` | Creation timestamp |
| `updated_at` | timestamptz | NOT NULL | `now()` | Last update (trigger-maintained) |
| `base_price_pence` | integer | NULL | — | Base service price in pence |
| `extras_price_pence` | integer | NULL | — | Sum of extras prices in pence |
| `total_price_pence` | integer | NULL | — | Total booking price in pence |
| `deposit_paid` | boolean | NULL | `false` | Whether deposit has been paid |
| `deposit_amount_pence` | integer | NULL | — | Deposit amount in pence (20% of total) |
| `stripe_session_id` | text | NULL | — | Stripe Checkout Session ID |
| `user_id` | uuid | NULL | — | Linked auth user (NULL for guest bookings) |
| `assigned_cleaner_id` | uuid | NULL | — | FK to `cleaners.id` |
| `notes` | text | NULL | — | Public notes (visible to customer) |
| `internal_notes` | text | NULL | — | Private admin notes |

**Primary Key**: `id`
**Foreign Keys**: `user_id` → `auth.users.id`, `assigned_cleaner_id` → `cleaners.id`
**Unique Constraint**: `reference`

**Indexes**:
- `bookings_pkey` — primary key on `id`
- `idx_bookings_user_id` — on `user_id` for customer queries
- `idx_bookings_status` — on `status` for admin filtering
- `idx_bookings_assigned_cleaner` — on `assigned_cleaner_id` for cleaner schedule
- `idx_bookings_preferred_date` — on `preferred_date` for scheduling
- `idx_bookings_email` — on `email` for lookup by email

**Triggers**:
- `bookings_set_reference` — BEFORE INSERT → calls `set_booking_reference()` to auto-generate reference
- `bookings_updated_at` — BEFORE UPDATE → calls `update_updated_at()` to set `updated_at = now()`
- `bookings_notify_customer` — AFTER UPDATE → calls `notify_on_booking_status_change()` to create notifications

**RLS Policies**:

| Policy | Role | Command | Condition |
|--------|------|---------|-----------|
| `anon_insert_bookings` | anon | INSERT | `user_id IS NULL AND status = 'pending' AND deposit_paid = false AND stripe_session_id IS NULL` |
| `auth_insert_own_bookings` | authenticated | INSERT | `(user_id IS NULL OR user_id = auth.uid()) AND status = 'pending' AND deposit_paid = false AND stripe_session_id IS NULL` |
| `anon_select_bookings` | anon, authenticated | SELECT | `true` (public booking visibility) |
| `customers_select_own_bookings` | authenticated | SELECT | `auth.uid() = user_id` |
| `customers_update_own_bookings` | authenticated | UPDATE | `auth.uid() = user_id` |
| `auth_update_own_booking` | authenticated | UPDATE | `auth.uid() = user_id` |
| `cleaner_select_assigned` | authenticated | SELECT | `assigned_cleaner_id IN (SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid())` |
| `cleaner_update_assigned` | authenticated | UPDATE | Same as above |
| `admin_select_bookings` | authenticated | SELECT | `EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = auth.uid())` |
| `admin_update_bookings` | authenticated | UPDATE | Same admin check |
| `admin_delete_bookings` | authenticated | DELETE | Same admin check |

**Example Query** — Get a customer's bookings with extras:
```sql
SELECT
  b.id, b.reference, b.status, b.preferred_date, b.preferred_time,
  b.service_type, b.total_price_pence, b.deposit_paid,
  COALESCE(
    json_agg(
      json_build_object('name', be.name, 'price', be.price_pence)
    ) FILTER (WHERE be.id IS NOT NULL),
    '[]'
  ) AS extras
FROM bookings b
LEFT JOIN booking_extras be ON be.booking_id = b.id
WHERE b.user_id = auth.uid()
GROUP BY b.id
ORDER BY b.preferred_date DESC;
```

### 8.5 Table: `booking_extras`

**Purpose**: Stores optional add-on services for a booking (oven clean, fridge clean, etc.).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NOT NULL | `gen_random_uuid()` | Primary key |
| `booking_id` | uuid | NOT NULL | — | FK to `bookings.id` |
| `name` | text | NOT NULL | — | Extra service name (e.g. "Oven Clean") |
| `price_pence` | integer | NOT NULL | `0` | Price in pence |
| `created_at` | timestamptz | NOT NULL | `now()` | Creation timestamp |

**Primary Key**: `id`
**Foreign Key**: `booking_id` → `bookings.id` (ON DELETE CASCADE)
**Index**: `idx_booking_extras_booking_id` on `booking_id`

**RLS Policies**:

| Policy | Role | Command | Condition |
|--------|------|---------|-----------|
| `anon_insert_booking_extras` | anon | INSERT | EXISTS booking with `user_id IS NULL AND status = 'pending'` |
| `auth_insert_own_booking_extras` | authenticated | INSERT | EXISTS booking with `(user_id = auth.uid() OR user_id IS NULL) AND status = 'pending'` |
| `anon_select_booking_extras` | anon, authenticated | SELECT | `true` |
| `admin_select_booking_extras` | authenticated | SELECT | Admin check |
| `cleaner_select_extras` | authenticated | SELECT | Booking assigned to calling cleaner |

### 8.6 Table: `cleaners`

**Purpose**: Stores cleaner profiles (field staff who perform cleaning jobs).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NOT NULL | `gen_random_uuid()` | Primary key |
| `full_name` | text | NOT NULL | — | Cleaner's full name |
| `email` | text | NOT NULL | — | Cleaner's email |
| `phone` | text | NOT NULL | — | Cleaner's phone |
| `is_active` | boolean | NOT NULL | `true` | Whether the cleaner is currently active |
| `created_at` | timestamptz | NOT NULL | `now()` | Creation timestamp |
| `updated_at` | timestamptz | NOT NULL | `now()` | Last update |

**Primary Key**: `id`
**Triggers**: `cleaners_updated_at` → `update_cleaners_updated_at()`

**RLS Policies**: Admin has full CRUD; cleaners can SELECT own record (via `cleaner_profiles` link); anon/authenticated can SELECT active cleaners.

### 8.7 Table: `cleaner_profiles`

**Purpose**: Links a Supabase Auth user to a cleaner record, enabling login.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NOT NULL | `gen_random_uuid()` | Primary key |
| `user_id` | uuid | NOT NULL | — | FK to `auth.users.id` |
| `cleaner_id` | uuid | NOT NULL | — | FK to `cleaners.id` |
| `hourly_rate_pence` | integer | NULL | — | Hourly rate in pence |
| `created_at` | timestamptz | NOT NULL | `now()` | Creation timestamp |

**Primary Key**: `id`
**Foreign Keys**: `user_id` → `auth.users.id`, `cleaner_id` → `cleaners.id`
**Unique Constraint**: `user_id` (one cleaner profile per auth user)

### 8.8 Table: `admin_profiles`

**Purpose**: Identifies which Supabase Auth users are administrators and their role level.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NOT NULL | `gen_random_uuid()` | Primary key |
| `user_id` | uuid | NOT NULL | — | FK to `auth.users.id` |
| `full_name` | text | NOT NULL | `''` | Admin's display name |
| `role` | text | NOT NULL | `'admin'` | Role: `admin`, `manager`, `staff`, `supervisor`, `owner` |
| `created_at` | timestamptz | NOT NULL | `now()` | Creation timestamp |

**Primary Key**: `id`
**Unique Constraint**: `user_id` (one admin profile per auth user)

**RLS Policies**: Self-select (`auth.uid() = user_id`), self-insert (`auth.uid() = user_id`). All other operations require admin membership check from other tables.

### 8.9 Table: `customer_profiles`

**Purpose**: Extended profile information for authenticated customers.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NOT NULL | `gen_random_uuid()` | Primary key |
| `user_id` | uuid | NOT NULL | — | FK to `auth.users.id` |
| `full_name` | text | NOT NULL | — | Customer's display name |
| `phone` | text | NULL | — | Phone number |
| `created_at` | timestamptz | NOT NULL | `now()` | Creation timestamp |
| `updated_at` | timestamptz | NOT NULL | `now()` | Last update |

### 8.10 Table: `payments`

**Purpose**: Records all payment transactions synced from Stripe.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NOT NULL | `gen_random_uuid()` | Primary key |
| `booking_id` | uuid | NOT NULL | — | FK to `bookings.id` |
| `user_id` | uuid | NULL | — | Auth user ID (if authenticated) |
| `stripe_payment_intent_id` | text | NULL | — | Stripe Payment Intent ID |
| `stripe_charge_id` | text | NULL | — | Stripe Charge ID |
| `stripe_customer_id` | text | NULL | — | Stripe Customer ID |
| `amount_pence` | integer | NOT NULL | — | Total amount charged in pence |
| `deposit_pence` | integer | NULL | — | Deposit portion in pence |
| `currency` | text | NOT NULL | `'gbp'` | ISO currency code |
| `status` | text | NOT NULL | `'pending'` | `pending`, `succeeded`, `failed`, `partially_refunded`, `refunded` |
| `payment_method` | text | NULL | — | Payment method type (card, apple_pay, etc.) |
| `description` | text | NULL | — | Payment description |
| `failure_reason` | text | NULL | — | Failure reason if `status = 'failed'` |
| `refund_amount_pence` | integer | NULL | `0` | Total refunded amount in pence |
| `refunded_at` | timestamptz | NULL | — | When the refund was processed |
| `metadata` | jsonb | NULL | — | Additional Stripe metadata |
| `created_at` | timestamptz | NOT NULL | `now()` | Creation timestamp |
| `updated_at` | timestamptz | NOT NULL | `now()` | Last update |

**Primary Key**: `id`
**Foreign Key**: `booking_id` → `bookings.id`
**Triggers**: `payments_updated_at` → `update_payments_updated_at()`

**RLS Policies**: Customers can SELECT own payments (`auth.uid() = user_id`); admin can SELECT/UPDATE all payments.

### 8.11 Table: `invoices`

**Purpose**: Generated invoices for completed or paid bookings.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NOT NULL | `gen_random_uuid()` | Primary key |
| `booking_id` | uuid | NULL | — | FK to `bookings.id` |
| `payment_id` | uuid | NULL | — | FK to `payments.id` |
| `user_id` | uuid | NULL | — | Auth user ID |
| `invoice_number` | text | NOT NULL | (trigger) | Auto-generated: `INV-2026-00001` |
| `invoice_date` | date | NOT NULL | `CURRENT_DATE` | Invoice issue date |
| `due_date` | date | NULL | — | Payment due date |
| `subtotal_pence` | integer | NOT NULL | `0` | Pre-VAT subtotal |
| `vat_rate` | numeric | NOT NULL | `0` | VAT rate (e.g. 0.20 for 20%) |
| `vat_amount_pence` | integer | NOT NULL | `0` | VAT amount |
| `total_pence` | integer | NOT NULL | `0` | Total including VAT |
| `amount_paid_pence` | integer | NOT NULL | `0` | Amount already paid |
| `amount_due_pence` | integer | NOT NULL | `0` | Outstanding amount |
| `status` | text | NOT NULL | `'draft'` | `draft`, `sent`, `paid`, `overdue`, `void`, `cancelled` |
| `customer_name` | text | NULL | — | Customer name (denormalised) |
| `customer_email` | text | NULL | — | Customer email |
| `customer_address` | text | NULL | — | Customer address |
| `service_description` | text | NULL | — | Description of service |
| `line_items` | jsonb | NULL | — | JSON array of line items |
| `notes` | text | NULL | — | Invoice notes |
| `pdf_url` | text | NULL | — | URL to PDF in Supabase Storage |
| `sent_at` | timestamptz | NULL | — | When invoice was sent |
| `paid_at` | timestamptz | NULL | — | When invoice was paid |
| `voided_at` | timestamptz | NULL | — | When invoice was voided |
| `created_at` | timestamptz | NOT NULL | `now()` | Creation timestamp |
| `updated_at` | timestamptz | NOT NULL | `now()` | Last update |

**Primary Key**: `id`
**Foreign Keys**: `booking_id` → `bookings.id`, `payment_id` → `payments.id`
**Unique Constraint**: `invoice_number`
**Sequence**: `invoice_number_seq` for auto-incrementing invoice numbers
**Triggers**: `invoices_set_number` → `generate_invoice_number()`, `invoices_updated_at` → `update_invoices_updated_at()`

### 8.12 Table: `notifications`

**Purpose**: In-app notifications for authenticated customers.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NOT NULL | `gen_random_uuid()` | Primary key |
| `user_id` | uuid | NOT NULL | — | FK to `auth.users.id` |
| `booking_id` | uuid | NULL | — | FK to `bookings.id` |
| `invoice_id` | uuid | NULL | — | FK to `invoices.id` |
| `type` | text | NOT NULL | — | Notification type (`booking_confirmed`, `booking_completed`, `booking_cancelled`) |
| `title` | text | NOT NULL | — | Notification title |
| `body` | text | NOT NULL | — | Notification body text |
| `action_url` | text | NULL | — | URL for notification action |
| `read` | boolean | NOT NULL | `false` | Whether notification has been read |
| `read_at` | timestamptz | NULL | — | When notification was read |
| `sent_via_email` | boolean | NOT NULL | `false` | Whether also sent via email |
| `sent_via_sms` | boolean | NOT NULL | `false` | Whether also sent via SMS |
| `created_at` | timestamptz | NOT NULL | `now()` | Creation timestamp |

**Primary Key**: `id`
**Foreign Keys**: `booking_id` → `bookings.id`, `invoice_id` → `invoices.id`
**Index**: `idx_notifications_user_unread` on `(user_id) WHERE read = false`

**RLS Policies**: Users can SELECT/UPDATE own notifications (`auth.uid() = user_id`); admin can SELECT all.

### 8.13 Table: `reviews`

**Purpose**: Customer reviews and ratings for completed bookings.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NOT NULL | `gen_random_uuid()` | Primary key |
| `user_id` | uuid | NOT NULL | — | FK to `auth.users.id` |
| `booking_id` | uuid | NOT NULL | — | FK to `bookings.id` |
| `rating` | integer | NOT NULL | — | Rating from 1 to 5 |
| `title` | text | NULL | — | Review title |
| `body` | text | NULL | — | Review body text |
| `created_at` | timestamptz | NOT NULL | `now()` | Creation timestamp |
| `updated_at` | timestamptz | NOT NULL | `now()` | Last update |

**Primary Key**: `id`
**Foreign Key**: `booking_id` → `bookings.id`
**Constraint**: `rating` CHECK (rating BETWEEN 1 AND 5)
**Triggers**: `reviews_updated_at` → `update_reviews_updated_at()`

### 8.14 Table: `contact_enquiries`

**Purpose**: Contact form submissions from anonymous visitors.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NOT NULL | `gen_random_uuid()` | Primary key |
| `first_name` | text | NOT NULL | — | Enquirer first name |
| `last_name` | text | NOT NULL | — | Enquirer last name |
| `email` | text | NOT NULL | — | Enquirer email |
| `phone` | text | NULL | — | Enquirer phone |
| `service` | text | NULL | — | Service of interest |
| `message` | text | NOT NULL | — | Message body |
| `gdpr_consent` | boolean | NOT NULL | — | GDPR consent flag |
| `status` | text | NOT NULL | `'new'` | `new`, `responded`, `closed` |
| `created_at` | timestamptz | NOT NULL | `now()` | Creation timestamp |
| `updated_at` | timestamptz | NOT NULL | `now()` | Last update |

**RLS Policies**: Anon/authenticated can INSERT with `status = 'new'`; admin can SELECT/UPDATE; anon SELECT denied (`false`).

### 8.15 Table: `availability`

**Purpose**: Cleaner availability slots — recurring (day of week) or specific dates.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NOT NULL | `gen_random_uuid()` | Primary key |
| `cleaner_id` | uuid | NOT NULL | — | FK to `cleaners.id` |
| `type` | text | NOT NULL | `'recurring'` | `recurring`, `specific_date`, `blocked` |
| `day_of_week` | smallint | NULL | — | 0=Sunday to 6=Saturday (for recurring) |
| `specific_date` | date | NULL | — | Specific date (for date-specific or blocked) |
| `start_time` | time | NOT NULL | — | Start time |
| `end_time` | time | NOT NULL | — | End time |
| `max_bookings` | smallint | NOT NULL | `1` | Maximum concurrent bookings in this slot |
| `notes` | text | NULL | — | Notes |
| `is_active` | boolean | NOT NULL | `true` | Whether this slot is active |
| `created_at` | timestamptz | NOT NULL | `now()` | Creation timestamp |
| `updated_at` | timestamptz | NOT NULL | `now()` | Last update |

**Indexes**: `idx_availability_cleaner_day` (partial, recurring active), `idx_availability_cleaner_date` (partial, specific/blocked), `idx_availability_active` (partial, active).

### 8.16 Table: `availability_overrides`

**Purpose**: One-off availability changes (holidays, sick days) for a cleaner on a specific date.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NOT NULL | `gen_random_uuid()` | Primary key |
| `cleaner_id` | uuid | NOT NULL | — | FK to `cleaners.id` |
| `date` | date | NOT NULL | — | Date of override |
| `reason` | text | NOT NULL | `'personal'` | Reason: `personal`, `sick`, `holiday`, `other` |
| `all_day` | boolean | NOT NULL | `true` | Whether the entire day is blocked |
| `notes` | text | NULL | — | Notes |
| `created_at` | timestamptz | NOT NULL | `now()` | Creation timestamp |

**Unique Constraint**: `(cleaner_id, date)` — one override per cleaner per date.

### 8.17 Table: `job_checkins`

**Purpose**: Records cleaner check-in and check-out times for booking jobs.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NOT NULL | `gen_random_uuid()` | Primary key |
| `booking_id` | uuid | NOT NULL | — | FK to `bookings.id` |
| `cleaner_id` | uuid | NOT NULL | — | FK to `cleaners.id` |
| `checked_in_at` | timestamptz | NULL | — | Check-in timestamp |
| `checked_out_at` | timestamptz | NULL | — | Check-out timestamp |
| `duration_minutes` | integer | NULL | — | Auto-calculated duration |
| `created_at` | timestamptz | NOT NULL | `now()` | Creation timestamp |

### 8.18 Table: `job_tasks`

**Purpose**: Task checklists for each booking job.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NOT NULL | `gen_random_uuid()` | Primary key |
| `booking_id` | uuid | NOT NULL | — | FK to `bookings.id` |
| `cleaner_id` | uuid | NOT NULL | — | FK to `cleaners.id` |
| `label` | text | NOT NULL | — | Task description |
| `completed` | boolean | NOT NULL | `false` | Whether task is done |
| `completed_at` | timestamptz | NULL | — | When task was completed |
| `sort_order` | integer | NOT NULL | `0` | Display order |
| `created_at` | timestamptz | NOT NULL | `now()` | Creation timestamp |

### 8.19 Table: `job_photos`

**Purpose**: Before/after photos uploaded by cleaners during a job.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NOT NULL | `gen_random_uuid()` | Primary key |
| `booking_id` | uuid | NOT NULL | — | FK to `bookings.id` |
| `cleaner_id` | uuid | NOT NULL | — | FK to `cleaners.id` |
| `photo_url` | text | NOT NULL | — | URL to photo in Supabase Storage |
| `type` | text | NULL | — | `before`, `after`, `issue` |
| `caption` | text | NULL | — | Photo caption |
| `created_at` | timestamptz | NOT NULL | `now()` | Creation timestamp |

### 8.20 Table: `job_issues`

**Purpose**: Issues reported by cleaners during a job.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NOT NULL | `gen_random_uuid()` | Primary key |
| `booking_id` | uuid | NOT NULL | — | FK to `bookings.id` |
| `cleaner_id` | uuid | NOT NULL | — | FK to `cleaners.id` |
| `title` | text | NOT NULL | — | Issue title |
| `description` | text | NULL | — | Issue description |
| `severity` | text | NOT NULL | `'low'` | `low`, `medium`, `high` |
| `resolved` | boolean | NOT NULL | `false` | Whether issue is resolved |
| `created_at` | timestamptz | NOT NULL | `now()` | Creation timestamp |

### 8.21 Table: `cleaner_notifications`

**Purpose**: Notifications sent to cleaners (separate from customer notifications).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NOT NULL | `gen_random_uuid()` | Primary key |
| `cleaner_id` | uuid | NOT NULL | — | FK to `cleaners.id` |
| `title` | text | NOT NULL | — | Notification title |
| `body` | text | NOT NULL | — | Notification body |
| `type` | text | NOT NULL | — | Notification type |
| `read` | boolean | NOT NULL | `false` | Whether read |
| `booking_id` | uuid | NULL | — | FK to `bookings.id` |
| `created_at` | timestamptz | NOT NULL | `now()` | Creation timestamp |

### 8.22 Table: `saved_addresses`

**Purpose**: Saved addresses for authenticated customers to speed up repeat bookings.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NOT NULL | `gen_random_uuid()` | Primary key |
| `user_id` | uuid | NOT NULL | — | FK to `auth.users.id` |
| `label` | text | NOT NULL | — | Address label (e.g. "Home", "Mum's house") |
| `address` | text | NOT NULL | — | Full address |
| `postcode` | text | NOT NULL | — | Postcode |
| `is_default` | boolean | NOT NULL | `false` | Whether this is the default address |
| `created_at` | timestamptz | NOT NULL | `now()` | Creation timestamp |

### 8.23 Table: `referrals`

**Purpose**: Referral codes for customer referral program.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NOT NULL | `gen_random_uuid()` | Primary key |
| `referrer_id` | uuid | NOT NULL | — | FK to `auth.users.id` |
| `code` | text | NOT NULL | — | Unique referral code |
| `uses` | integer | NOT NULL | `0` | Number of times used |
| `created_at` | timestamptz | NOT NULL | `now()` | Creation timestamp |

### 8.24 Table: `subscription_plans`

**Purpose**: Defines available subscription plans for recurring cleaning.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NOT NULL | `gen_random_uuid()` | Primary key |
| `slug` | text | NOT NULL | — | URL-safe slug |
| `name` | text | NOT NULL | — | Plan display name |
| `description` | text | NULL | — | Plan description |
| `stripe_price_id` | text | NOT NULL | — | Stripe Price ID for recurring billing |
| `monthly_price_pence` | integer | NOT NULL | — | Monthly price in pence |
| `visits_per_month` | integer | NOT NULL | — | Number of visits per month |
| `hours_per_visit` | integer | NOT NULL | — | Hours per visit |
| `features` | jsonb | NULL | — | JSON array of feature strings |
| `is_active` | boolean | NOT NULL | `true` | Whether plan is available |
| `sort_order` | integer | NOT NULL | `0` | Display order |
| `created_at` | timestamptz | NOT NULL | `now()` | Creation timestamp |
| `updated_at` | timestamptz | NOT NULL | `now()` | Last update |

### 8.25 Table: `subscriptions`

**Purpose**: Active subscriptions linked to Stripe Subscription objects.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NOT NULL | `gen_random_uuid()` | Primary key |
| `user_id` | uuid | NOT NULL | — | FK to `auth.users.id` |
| `plan_id` | uuid | NOT NULL | — | FK to `subscription_plans.id` |
| `stripe_subscription_id` | text | NULL | — | Stripe Subscription ID |
| `stripe_customer_id` | text | NULL | — | Stripe Customer ID |
| `status` | text | NOT NULL | `'pending'` | `pending`, `active`, `past_due`, `canceled`, `trialing` |
| `current_period_start` | timestamptz | NULL | — | Current billing period start |
| `current_period_end` | timestamptz | NULL | — | Current billing period end |
| `cancel_at_period_end` | boolean | NOT NULL | `false` | Whether cancellation is scheduled |
| `canceled_at` | timestamptz | NULL | — | Cancellation timestamp |
| `trial_end` | timestamptz | NULL | — | Trial end timestamp |
| `metadata` | jsonb | NULL | — | Additional metadata |
| `created_at` | timestamptz | NOT NULL | `now()` | Creation timestamp |
| `updated_at` | timestamptz | NOT NULL | `now()` | Last update |

### 8.26 Views

#### `booking_services`

**Purpose**: Flattens bookings and their extras into a single row-per-line-item view for reporting.

```sql
CREATE OR REPLACE VIEW public.booking_services
  WITH (security_invoker = true)
AS
SELECT b.id AS booking_id, b.reference, b.user_id, b.service_type AS service_name,
       b.property_size, b.frequency, b.preferred_date, b.preferred_time,
       b.status AS booking_status, b.assigned_cleaner_id,
       'base'::text AS line_type, NULL::uuid AS extra_id,
       b.service_type AS line_label, b.base_price_pence AS line_price_pence,
       b.created_at
FROM bookings b
UNION ALL
SELECT b.id AS booking_id, b.reference, b.user_id, b.service_type AS service_name,
       b.property_size, b.frequency, b.preferred_date, b.preferred_time,
       b.status AS booking_status, b.assigned_cleaner_id,
       'extra'::text AS line_type, be.id AS extra_id,
       be.name AS line_label, be.price_pence AS line_price_pence,
       b.created_at
FROM bookings b JOIN booking_extras be ON be.booking_id = b.id;
```

**Security**: `SECURITY INVOKER` — runs with the querying role's permissions, so RLS on `bookings` and `booking_extras` is enforced.

#### `cleaner_earnings`

**Purpose**: Calculates earned amounts per job based on check-in duration and hourly rate.

```sql
CREATE OR REPLACE VIEW public.cleaner_earnings
  WITH (security_invoker = true)
AS
SELECT ci.cleaner_id, c.full_name AS cleaner_name, ci.booking_id, b.reference,
       b.preferred_date, b.service_type, b.total_price_pence,
       cp.hourly_rate_pence, ci.checked_in_at, ci.checked_out_at,
       ci.duration_minutes,
       ROUND(ci.duration_minutes::numeric / 60 * cp.hourly_rate_pence::numeric)::integer AS earned_pence,
       EXTRACT(year FROM ci.checked_in_at)::integer AS earn_year,
       EXTRACT(month FROM ci.checked_in_at)::integer AS earn_month
FROM job_checkins ci
JOIN cleaners c ON c.id = ci.cleaner_id
JOIN bookings b ON b.id = ci.booking_id
LEFT JOIN cleaner_profiles cp ON cp.cleaner_id = ci.cleaner_id
WHERE ci.checked_in_at IS NOT NULL AND ci.checked_out_at IS NOT NULL;
```

**Security**: `SECURITY INVOKER` — runs with the querying role's permissions.

### 8.27 Database Functions

All functions have `SET search_path = public, pg_catalog` to prevent search-path hijacking.

| Function | Type | Returns | Trigger | Purpose |
|----------|------|---------|---------|---------|
| `set_booking_reference()` | Trigger | trigger | `bookings_set_reference` (BEFORE INSERT on `bookings`) | Auto-generates `PM-XXXXXXXX` reference |
| `update_updated_at()` | Trigger | trigger | `bookings_updated_at` (BEFORE UPDATE on `bookings`) | Sets `updated_at = now()` |
| `notify_on_booking_status_change()` | Trigger | trigger | `bookings_notify_customer` (AFTER UPDATE on `bookings`) | Inserts notification row on status change |
| `generate_invoice_number()` | Trigger | trigger | `invoices_set_number` (BEFORE INSERT on `invoices`) | Auto-generates `INV-YYYY-NNNNN` |
| `update_payments_updated_at()` | Trigger | trigger | `payments_updated_at` | Sets `updated_at = now()` on payments |
| `update_invoices_updated_at()` | Trigger | trigger | `invoices_updated_at` | Sets `updated_at = now()` on invoices |
| `update_availability_updated_at()` | Trigger | trigger | `availability_updated_at` | Sets `updated_at = now()` on availability |
| `update_cleaners_updated_at()` | Trigger | trigger | `cleaners_updated_at` | Sets `updated_at = now()` on cleaners |
| `update_reviews_updated_at()` | Trigger | trigger | `reviews_updated_at` | Sets `updated_at = now()` on reviews |
| `update_contact_enquiries_updated_at()` | Trigger | trigger | `contact_enquiries_updated_at` | Sets `updated_at = now()` on enquiries |
| `update_subscription_plans_updated_at()` | Trigger | trigger | `subscription_plans_updated_at` | Sets `updated_at = now()` on plans |
| `update_subscriptions_updated_at()` | Trigger | trigger | `subscriptions_updated_at` | Sets `updated_at = now()` on subscriptions |
| `get_unread_notification_count(p_user_id uuid)` | RPC | integer | — | Returns unread notification count for a user. `SECURITY INVOKER`. EXECUTE revoked from `anon`. |
| `get_monthly_revenue(p_year int, p_month int)` | RPC | TABLE | — | Returns revenue grouped by service type for a given month. `SECURITY INVOKER`. EXECUTE revoked from `anon`. |

### 8.28 Complete Index Reference

| Table | Index | Type | Columns | Partial |
|-------|-------|------|---------|---------|
| `admin_profiles` | `admin_profiles_pkey` | UNIQUE | `id` | — |
| `admin_profiles` | `admin_profiles_user_id_key` | UNIQUE | `user_id` | — |
| `availability` | `availability_pkey` | UNIQUE | `id` | — |
| `availability` | `idx_availability_cleaner_id` | INDEX | `cleaner_id` | — |
| `availability` | `idx_availability_cleaner_day` | INDEX | `cleaner_id, day_of_week` | `type = 'recurring' AND is_active = true` |
| `availability` | `idx_availability_cleaner_date` | INDEX | `cleaner_id, specific_date` | `type IN ('specific_date', 'blocked')` |
| `availability` | `idx_availability_active` | INDEX | `is_active` | `is_active = true` |
| `availability_overrides` | `availability_overrides_pkey` | UNIQUE | `id` | — |
| `availability_overrides` | `availability_overrides_cleaner_id_date_key` | UNIQUE | `cleaner_id, date` | — |
| `booking_extras` | `booking_extras_pkey` | UNIQUE | `id` | — |
| `booking_extras` | `idx_booking_extras_booking_id` | INDEX | `booking_id` | — |
| `bookings` | `bookings_pkey` | UNIQUE | `id` | — |
| `bookings` | `idx_bookings_user_id` | INDEX | `user_id` | — |
| `bookings` | `idx_bookings_status` | INDEX | `status` | — |
| `bookings` | `idx_bookings_assigned_cleaner` | INDEX | `assigned_cleaner_id` | — |
| `bookings` | `idx_bookings_preferred_date` | INDEX | `preferred_date` | — |
| `bookings` | `idx_bookings_email` | INDEX | `email` | — |
| `cleaners` | `cleaners_pkey` | UNIQUE | `id` | — |
| `cleaner_notifications` | `cleaner_notifications_pkey` | UNIQUE | `id` | — |
| `cleaner_profiles` | `cleaner_profiles_pkey` | UNIQUE | `id` | — |
| `cleaner_profiles` | `cleaner_profiles_user_id_key` | UNIQUE | `user_id` | — |
| `contact_enquiries` | `contact_enquiries_pkey` | UNIQUE | `id` | — |
| `customer_profiles` | `customer_profiles_pkey` | UNIQUE | `id` | — |
| `invoices` | `invoices_pkey` | UNIQUE | `id` | — |
| `invoices` | `invoices_invoice_number_key` | UNIQUE | `invoice_number` | — |
| `job_checkins` | `job_checkins_pkey` | UNIQUE | `id` | — |
| `job_issues` | `job_issues_pkey` | UNIQUE | `id` | — |
| `job_photos` | `job_photos_pkey` | UNIQUE | `id` | — |
| `job_tasks` | `job_tasks_pkey` | UNIQUE | `id` | — |
| `notifications` | `notifications_pkey` | UNIQUE | `id` | — |
| `notifications` | `idx_notifications_user_unread` | INDEX | `user_id` | `read = false` |
| `payments` | `payments_pkey` | UNIQUE | `id` | — |
| `referrals` | `referrals_pkey` | UNIQUE | `id` | — |
| `reviews` | `reviews_pkey` | UNIQUE | `id` | — |
| `saved_addresses` | `saved_addresses_pkey` | UNIQUE | `id` | — |
| `subscription_plans` | `subscription_plans_pkey` | UNIQUE | `id` | — |
| `subscriptions` | `subscriptions_pkey` | UNIQUE | `id` | — |

---

&nbsp;

---

## 9. API

### 9.1 API Overview

The PureMaids platform exposes two API surfaces:

1. **Supabase REST API** — Auto-generated from PostgreSQL schema, available at `{SUPABASE_URL}/rest/v1/`. Supports CRUD on all tables with RLS enforcement. Authentication via Bearer token (anon key or JWT).
2. **Edge Functions** — Custom Deno functions at `{SUPABASE_URL}/functions/v1/`. Handle business logic requiring server-side secrets.

### 9.2 Edge Function Endpoints

#### `POST /functions/v1/create-checkout`

Creates a Stripe Checkout Session for one-time payments (bookings) or subscriptions.

| Aspect | Value |
|--------|-------|
| **Authentication** | Anon key (public) |
| **verify_jwt** | false |
| **Content-Type** | `application/json` |

**Request — Booking Payment**:
```json
{
  "bookingId": "uuid",
  "bookingReference": "PM-A3F2B1C9",
  "serviceType": "deep",
  "serviceLabel": "Deep Cleaning",
  "totalPricePence": 14900,
  "depositPence": 2980,
  "customerEmail": "customer@example.com",
  "customerName": "Jane Doe",
  "paymentType": "deposit"
}
```

**Request — Subscription**:
```json
{
  "mode": "subscription",
  "planId": "fortnightly",
  "priceId": "price_fortnightly_puremaids",
  "planName": "Fortnightly Clean",
  "customerEmail": "customer@example.com",
  "customerName": "Jane Doe"
}
```

**Response (200)**:
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

**Error Response (500)**:
```json
{
  "error": "Stripe API error: Invalid price ID"
}
```

#### `POST /functions/v1/stripe-webhook`

Receives Stripe webhook events and updates the database accordingly.

| Aspect | Value |
|--------|-------|
| **Authentication** | Stripe webhook signature (verified via `STRIPE_WEBHOOK_SECRET`) |
| **verify_jwt** | false |
| **Content-Type** | `application/json` |

**Handled Events**:
- `checkout.session.completed` — Marks booking as confirmed, creates payment record
- `payment_intent.payment_failed` — Updates payment status to failed
- `customer.subscription.created` — Creates subscription record
- `customer.subscription.updated` — Updates subscription status
- `customer.subscription.deleted` — Marks subscription as canceled
- `charge.refunded` — Updates payment refund amount

#### `POST /functions/v1/process-refund`

Issues a full or partial refund via Stripe.

| Aspect | Value |
|--------|-------|
| **Authentication** | User JWT (must have `admin_profiles` entry) |
| **verify_jwt** | false (JWT verified inside function) |
| **Content-Type** | `application/json` |

**Request**:
```json
{
  "paymentId": "uuid",
  "amountPence": 5000,
  "reason": "requested_by_customer",
  "mode": "partial"
}
```

**Response (200)**:
```json
{
  "refundId": "re_...",
  "amountRefundedPence": 5000,
  "status": "succeeded"
}
```

#### `POST /functions/v1/send-reminder`

Sends a booking reminder email to a customer 24 hours before their scheduled clean.

| Aspect | Value |
|--------|-------|
| **Authentication** | Supabase service role (cron-triggered) |
| **verify_jwt** | false |

#### `POST /functions/v1/notify-booking`

Sends a booking confirmation or status update email to a customer.

| Aspect | Value |
|--------|-------|
| **Authentication** | Supabase service role (triggered by webhook) |
| **verify_jwt** | false |

### 9.3 Supabase REST API Endpoints

All tables are accessible via the Supabase REST API at `{SUPABASE_URL}/rest/v1/{table}`. Access is controlled by RLS policies.

| Table | GET (SELECT) | POST (INSERT) | PATCH (UPDATE) | DELETE |
|-------|-------------|---------------|----------------|--------|
| `bookings` | Own (customer) / Assigned (cleaner) / All (admin) | Anon: guest (restricted); Auth: own | Own (customer) / Assigned (cleaner) / All (admin) | Admin only |
| `booking_extras` | All (public) | Anon: guest booking; Auth: own booking | — | Admin only |
| `payments` | Own / All (admin) | — (created by webhook) | Own / All (admin) | — |
| `invoices` | Own / All (admin) | — (created by system) | All (admin) | — |
| `notifications` | Own | — (created by trigger) | Own (mark read) | — |
| `reviews` | All (public) / Own | Own | Own | Admin only |
| `contact_enquiries` | Admin only | Anon (with `status = 'new'`) | Admin only | — |
| `cleaners` | Active (public) / All (admin) | Admin only | Admin only | Admin only |
| `availability` | Active (public) / Own (cleaner) / All (admin) | Own (cleaner) / Admin | Own / Admin | Own / Admin |
| `subscriptions` | Own / All (admin) | — (created by webhook) | Own (cancel) / Admin | — |
| `subscription_plans` | All (public) | Admin only | Admin only | Admin only |

### 9.4 RPC Endpoints

| Function | Method | Path | Auth | Description |
|----------|--------|------|------|-------------|
| `get_unread_notification_count` | POST | `/rest/v1/rpc/get_unread_notification_count` | authenticated | Returns unread notification count for the calling user |
| `get_monthly_revenue` | POST | `/rest/v1/rpc/get_monthly_revenue` | authenticated (admin in practice) | Returns revenue by service type for a given month |

### 9.5 Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful request |
| 400 | Bad Request | Invalid input, missing required fields |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | RLS policy denies access |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Edge Function error, Stripe API error |

---

&nbsp;

---

## 10. Authentication

### 10.1 Supabase Auth

PureMaids uses **Supabase Auth** for all authentication. The auth system is built on PostgreSQL's `auth.users` table and JWT tokens.

### 10.2 Authentication Flow

```mermaid
sequenceDiagram
    actor U as User
    participant C as Client (Next.js)
    participant SA as Supabase Auth
    participant DB as PostgreSQL

    U->>C: Enters email + password
    C->>SA: supabase.auth.signInWithPassword()
    SA->>DB: Verifies credentials against auth.users
    DB-->>SA: Valid
    SA->>SA: Generates JWT (access token)
    SA->>SA: Generates refresh token
    SA-->>C: Returns session {access_token, refresh_token, user}
    C->>C: Stores session in localStorage
    C->>DB: Query with Authorization: Bearer <access_token>
    DB->>DB: RLS policy checks auth.uid()
    DB-->>C: Returns authorised rows
```

### 10.3 JWT Tokens

| Property | Value |
|----------|-------|
| Algorithm | HS256 |
| Issuer | Supabase |
| Expiry | 1 hour (default) |
| Refresh | Automatic via Supabase JS SDK |
| Storage | localStorage (browser) |
| Claims | `sub` (user UUID), `email`, `role`, `exp`, `iat` |

### 10.4 Session Management

The Supabase JS SDK handles session management automatically:
- On page load, the SDK checks for an existing session in localStorage
- If the access token is expired, the SDK automatically refreshes it using the refresh token
- If the refresh token is also expired, the user must sign in again
- The `onAuthStateChange` listener can be used to react to session changes

### 10.5 Password Reset

```typescript
// Client-side password reset
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: 'https://puremaids.co.uk/account/reset-password',
});
```

### 10.6 Email Verification

Email verification is **disabled** per product requirement. Users can sign in immediately after registration without confirming their email address. This reduces friction in the booking flow.

### 10.7 Role-Based Access

Roles are not stored in the JWT directly. Instead, the platform uses database tables to determine a user's role:

| Role determination | Query |
|--------------------|-------|
| Admin | `SELECT 1 FROM admin_profiles WHERE user_id = auth.uid()` |
| Cleaner | `SELECT 1 FROM cleaner_profiles WHERE user_id = auth.uid()` |
| Customer | Implicit — any authenticated user without an admin or cleaner profile |

### 10.8 Multi-Factor Authentication

MFA is not currently implemented. It is on the roadmap for admin accounts (see [Section 23](#23-future-roadmap)).

---

&nbsp;

---

## 11. Authorization

### 11.1 Authorization Model

PureMaids uses **Row Level Security (RLS)** as the primary authorization mechanism. RLS policies are defined at the PostgreSQL level and are enforced for every query, regardless of whether it comes from the client SDK, an Edge Function, or a direct database connection.

### 11.2 RBAC vs RLS

| Aspect | RBAC | RLS (PureMaids approach) |
|--------|------|--------------------------|
| Where enforced | Application layer | Database layer |
| Bypass risk | Application bugs can leak data | Cannot be bypassed by application code |
| Granularity | Role-level | Row-level |
| Performance | No DB overhead | Minimal overhead with proper indexes |

### 11.3 RLS Policy Pattern

All RLS policies follow a consistent pattern based on the user's role:

```sql
-- Customer: can only access their own rows
CREATE POLICY "customers_select_own" ON bookings
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Cleaner: can only access assigned bookings
CREATE POLICY "cleaner_select_assigned" ON bookings
  FOR SELECT TO authenticated
  USING (
    assigned_cleaner_id IN (
      SELECT cleaner_id FROM cleaner_profiles
      WHERE user_id = auth.uid()
    )
  );

-- Admin: can access all rows
CREATE POLICY "admin_select_all" ON bookings
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE user_id = auth.uid()
    )
  );
```

### 11.4 Ownership Rules

| Table | Owner column | Rule |
|-------|-------------|------|
| `bookings` | `user_id` | Customer owns bookings where `user_id = auth.uid()`; guest bookings have `user_id IS NULL` |
| `payments` | `user_id` | Customer owns payments where `user_id = auth.uid()` |
| `invoices` | `user_id` | Customer owns invoices where `user_id = auth.uid()` |
| `notifications` | `user_id` | Customer owns notifications where `user_id = auth.uid()` |
| `reviews` | `user_id` | Customer owns reviews where `user_id = auth.uid()` |
| `saved_addresses` | `user_id` | Customer owns addresses where `user_id = auth.uid()` |
| `subscriptions` | `user_id` | Customer owns subscriptions where `user_id = auth.uid()` |
| `availability` | `cleaner_id` | Cleaner owns availability where `cleaner_id` matches their profile |
| `job_checkins` | `cleaner_id` | Cleaner owns check-ins where `cleaner_id` matches their profile |
| `job_tasks` | `cleaner_id` | Cleaner can update tasks where `cleaner_id` matches their profile |
| `job_photos` | `cleaner_id` | Cleaner owns photos where `cleaner_id` matches their profile |
| `job_issues` | `cleaner_id` | Cleaner owns issues where `cleaner_id` matches their profile |

### 11.5 INSERT Policy Security

After the security hardening migration, INSERT policies enforce strict constraints:

| Table | Constraint |
|-------|-----------|
| `bookings` (anon) | `user_id IS NULL AND status = 'pending' AND deposit_paid = false AND stripe_session_id IS NULL` |
| `bookings` (authenticated) | `(user_id IS NULL OR user_id = auth.uid()) AND status = 'pending' AND deposit_paid = false AND stripe_session_id IS NULL` |
| `booking_extras` (anon) | Referenced booking must have `user_id IS NULL AND status = 'pending'` |
| `booking_extras` (authenticated) | Referenced booking must be owned by caller or unowned, and `status = 'pending'` |
| `contact_enquiries` | `status = 'new'` (prevents setting admin workflow fields) |

### 11.6 Function Security

All database functions have:
- `SET search_path = public, pg_catalog` — prevents search-path hijacking
- `SECURITY INVOKER` (for RPC functions) — runs with the caller's permissions, not the definer's
- `EXECUTE` revoked from `anon` on admin-only functions

---

&nbsp;

---

## 12. Booking Engine

### 12.1 Booking Lifecycle

```mermaid
stateDiagram-v2
    [*] --> pending: Customer submits booking
    pending --> confirmed: Deposit/full payment received
    pending --> cancelled: Customer cancels before payment
    pending --> expired: 1 hour with no payment
    confirmed --> assigned: Admin assigns cleaner
    assigned --> in_progress: Cleaner checks in
    in_progress --> completed: Cleaner checks out
    confirmed --> cancelled: Customer/admin cancels
    assigned --> cancelled: Customer/admin cancels
    completed --> [*]
    cancelled --> [*]
    expired --> [*]
```

### 12.2 Price Calculation

Pricing is calculated client-side in `lib/pricing.ts` and stored in the database on booking creation.

```typescript
function calcPrice(serviceKey: string, extraKeys: string[] = []): PriceBreakdown {
  const basePence   = SERVICES[serviceKey].basePence;
  const extrasPence = extraKeys.reduce((s, k) => s + EXTRAS[k].pence, 0);
  const totalPence  = basePence + extrasPence;
  const depositPence = Math.round(totalPence * 20 / 100);
  return { basePence, extrasPence, totalPence, depositPence, balancePence: totalPence - depositPence };
}
```

| Service | Base Price |
|---------|-----------|
| Domestic Cleaning | £59.00 |
| Deep Cleaning | £129.00 |
| End of Tenancy Cleaning | £189.00 |
| Office Cleaning | £99.00 |

| Extra | Price |
|-------|-------|
| Oven Clean | +£20.00 |
| Fridge Clean | +£15.00 |
| Carpet Shampoo | +£35.00 |
| Window Cleaning | +£18.00 |
| Skirting Boards | +£12.00 |

### 12.3 Booking Reference Generation

The `set_booking_reference()` trigger generates a unique reference on INSERT:

```sql
NEW.reference := 'PM-' || upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8));
-- Example: PM-A3F2B1C9
```

### 12.4 Deposit System

- Deposit is **20% of total price** (base + extras)
- Customer can choose to pay the deposit or the full amount at checkout
- Deposit is non-refundable (see Terms & Conditions)
- Balance is due on completion of the service

### 12.5 Cancellation

| Timing | Refund |
|--------|--------|
| More than 48 hours before | Full balance refunded (deposit non-refundable) |
| Within 48 hours | Up to 50% cancellation fee |
| After completion | No refund (satisfaction guarantee applies instead) |

### 12.6 Recurring Bookings

Recurring bookings (weekly, fortnightly, monthly) are managed through the **subscription system** (see [Section 13](#13-payment-system)). Individual bookings are created from the subscription schedule by admin staff.

---

&nbsp;

---

## 13. Payment System

### 13.1 Stripe Integration Overview

```mermaid
graph TB
    subgraph "Client"
        BC[Booking Form]
        SC[Subscription Page]
    end
    subgraph "Edge Functions"
        CC[create-checkout]
        WH[stripe-webhook]
        PR[process-refund]
    end
    subgraph "Stripe"
        S[Stripe API]
        SW[Stripe Webhooks]
    end
    subgraph "Database"
        B[bookings]
        P[payments]
        SUB[subscriptions]
    end

    BC -->|POST| CC
    SC -->|POST| CC
    CC -->|Creates Session| S
    S -->|Redirect| BC
    S -->|Webhook| WH
    WH -->|Updates| B
    WH -->|Creates/Updates| P
    WH -->|Creates/Updates| SUB
    PR -->|Issues Refund| S
    PR -->|Updates| P
```

### 13.2 Payment Flow (One-Time)

1. Customer completes the booking wizard and clicks "Pay Deposit" or "Pay in Full"
2. Client inserts the booking record into the database (status: `pending`)
3. Client calls `POST /functions/v1/create-checkout` with booking details
4. Edge Function creates a Stripe Checkout Session with:
   - `mode: 'payment'`
   - `payment_method_types: ['card']`
   - Line item with the deposit or total amount
   - `customer_email` from booking
   - Metadata: `booking_id`, `booking_reference`, `service_type`, `payment_type`
   - `success_url`: `/book/success?session_id={CHECKOUT_SESSION_ID}&ref={reference}`
   - `cancel_url`: `/book/cancel`
   - `expires_at`: 1 hour from creation
5. Client redirects the browser to the Stripe Checkout URL
6. Customer completes payment on Stripe's hosted page
7. Stripe sends `checkout.session.completed` webhook to the Edge Function
8. Edge Function updates the booking (status: `confirmed`, `deposit_paid: true`)
9. Edge Function creates a `payments` record
10. Stripe redirects the customer to `/book/success`

### 13.3 Payment Flow (Subscription)

1. Customer selects a plan on `/subscriptions`
2. Client calls `POST /functions/v1/create-checkout` with `mode: 'subscription'`
3. Edge Function creates a Stripe Checkout Session with:
   - `mode: 'subscription'`
   - Line item with the plan's Stripe Price ID
   - `customer_email`
   - `success_url`: `/subscriptions/success`
   - `cancel_url`: `/subscriptions/cancel`
4. Customer completes checkout on Stripe
5. Stripe sends `customer.subscription.created` webhook
6. Edge Function creates a `subscriptions` record

### 13.4 Refunds

Refunds are processed through the admin panel at `/admin/refunds`:

1. Admin navigates to `/admin/refunds`
2. Page queries `payments` where `status IN ('succeeded', 'partially_refunded')`
3. Admin clicks "Refund" on a payment, enters amount and reason
4. Client calls `POST /functions/v1/process-refund` with the admin's JWT
5. Edge Function verifies the caller is an admin (via `admin_profiles`)
6. Edge Function calls `stripe.refunds.create()`
7. Edge Function updates the `payments` record (`refund_amount_pence`, `refunded_at`, `status`)
8. Stripe sends `charge.refunded` webhook (additional confirmation)

### 13.5 Webhook Handling

The `stripe-webhook` Edge Function handles the following events:

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Update booking status to `confirmed`, create payment record |
| `payment_intent.payment_failed` | Update payment status to `failed`, set `failure_reason` |
| `customer.subscription.created` | Create subscription record |
| `customer.subscription.updated` | Update subscription status and period dates |
| `customer.subscription.deleted` | Mark subscription as `canceled` |
| `charge.refunded` | Update payment `refund_amount_pence` and `status` |

### 13.6 Failure Handling

| Failure | Handling |
|---------|----------|
| Stripe API error during checkout creation | Edge Function returns 500 with error message; client displays error |
| Payment failure at Stripe | Webhook updates payment to `failed`; booking remains `pending` |
| Webhook delivery failure | Stripe retries automatically (up to 3 days); events are idempotent |
| Refund failure | Edge Function returns error; admin sees error message in modal |

---

&nbsp;

---

## 14. Email System

### 14.1 Overview

Transactional emails are sent via **Resend** through Edge Functions. Emails are composed inline in the function code.

### 14.2 Email Templates

| Template | Trigger | Sender | Subject |
|----------|---------|--------|---------|
| Booking Confirmation | `checkout.session.completed` webhook | `notify-booking` function | "Your PureMaids Booking is Confirmed — {reference}" |
| Booking Reminder | 24 hours before scheduled clean (cron) | `send-reminder` function | "Reminder: Your cleaning tomorrow — {reference}" |
| Booking Completed | Booking status → `completed` | `notify-booking` function | "Your Cleaning is Complete — {reference}" |
| Booking Cancelled | Booking status → `cancelled` | `notify-booking` function | "Booking Cancelled — {reference}" |
| Refund Confirmation | Refund processed | `process-refund` function | "Refund Processed — {amount}" |

### 14.3 Retry Logic

Resend handles retries internally. If an email fails to deliver, Resend retries with exponential backoff. The Edge Function itself does not implement retry logic — it fires and forgets.

### 14.4 Notifications vs Email

In-app notifications (stored in the `notifications` table) are generated by PostgreSQL triggers. Email notifications are sent by Edge Functions. These are separate systems:

| Channel | Source | Trigger |
|---------|--------|---------|
| In-app notification | `notify_on_booking_status_change()` trigger | Database row update |
| Email | `notify-booking` Edge Function | Stripe webhook or manual trigger |

---

&nbsp;

---

## 15. File Storage

### 15.1 Supabase Storage

The platform uses Supabase Storage for file uploads. Two buckets are defined:

| Bucket | Contents | Access Control |
|--------|----------|---------------|
| `invoices` | Generated PDF invoices | Customer can read own invoices; admin can read all |
| `job-photos` | Before/after photos uploaded by cleaners | Cleaner can read/write own; admin can read all |

### 15.2 Invoice PDFs

Invoice PDFs are generated and uploaded to the `invoices` bucket. The URL is stored in `invoices.pdf_url`. Access is controlled by storage policies that check ownership via the invoice's `user_id` column.

### 15.3 Job Photos

Cleaners upload before/after photos during a job. Photos are uploaded to the `job-photos` bucket, and the URL is stored in `job_photos.photo_url` with a type (`before`, `after`, `issue`).

### 15.4 Security

- Storage bucket policies enforce ownership checks
- File uploads are authenticated — no public uploads
- File URLs are signed URLs with expiration (for private buckets)
- Public buckets are not used for user-generated content

---

&nbsp;

---

## 16. Logging

### 16.1 Application Logs

| Layer | Logging Mechanism |
|-------|-------------------|
| Next.js client | `console.error()` captured by `ErrorBoundary` component |
| Next.js server | Next.js built-in logging |
| Edge Functions | `console.log()` / `console.error()` captured by Supabase platform |
| Database | `RAISE NOTICE` / `RAISE EXCEPTION` in PL/pgSQL functions |

### 16.2 Audit Logs

Audit logging is not currently implemented at the database level. The `updated_at` columns on all tables provide a basic audit trail of when records were last modified.

**Roadmap**: Implement a dedicated `audit_logs` table with triggers on all tables to capture who changed what and when.

### 16.3 Security Logs

| Event | Logged Where |
|-------|-------------|
| Failed login attempt | Supabase Auth logs |
| RLS policy violation | PostgreSQL logs ( Supabase dashboard) |
| Stripe webhook received | Edge Function console output |
| Refund processed | `payments` table (`refund_amount_pence`, `refunded_at`) |

### 16.4 Error Logs

Client-side errors are caught by the `ErrorBoundary` component and displayed to the user. For production error tracking, integrate with Sentry or similar (roadmap).

---

&nbsp;

---

## 17. Error Handling

### 17.1 Global Exception Handling

| Layer | Mechanism |
|-------|-----------|
| Next.js App Router | `app/global-error.tsx` — catches unhandled errors in any route |
| React components | `ErrorBoundary` component — wraps client components to catch render errors |
| Next.js 404 | `app/not-found.tsx` — custom 404 page |
| Route loading | `app/loading.tsx` — spinner during route transitions |

### 17.2 Validation

| Layer | Mechanism |
|-------|-----------|
| Client-side forms | Field-level validation in booking wizard (email regex, required fields, GDPR consent) |
| Database | NOT NULL constraints, CHECK constraints, foreign keys |
| Edge Functions | Input validation at function entry; `res.json()` error responses |

### 17.3 API Error Handling

All Edge Functions follow a consistent error pattern:

```typescript
try {
  // ... business logic
} catch (err) {
  const msg = err instanceof Error ? err.message : 'Unknown error';
  return new Response(JSON.stringify({ error: msg }), {
    status: 500,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
```

### 17.4 Retry Strategy

| Operation | Retry Strategy |
|-----------|---------------|
| Stripe API calls | Stripe SDK handles retries internally (up to 3) |
| Resend email | Resend handles retries internally |
| Database queries | No retry — errors surface immediately |
| Webhook delivery | Stripe retries for up to 3 days with exponential backoff |

### 17.5 Graceful Failures

| Scenario | User Experience |
|----------|-----------------|
| Stripe Checkout creation fails | Error alert shown on booking form with message; user can retry |
| Payment fails at Stripe | Redirected to `/book/cancel` page with explanation |
| Database insert fails | Error alert shown; user can retry |
| Edge Function is down | Error alert shown; user can retry or call phone number |
| Image fails to load | `alt` text displayed; layout shift prevented by `next/image` |

---

&nbsp;

---

## 18. Testing

### 18.1 Testing Strategy

| Level | Tool | Status |
|-------|------|--------|
| Unit tests | Jest (not yet configured) | Planned |
| Integration tests | Jest + Supertest | Planned |
| API tests | Edge Function invocation tests | Planned |
| E2E tests | Playwright | Planned |
| Security tests | Supabase Security Advisor | Active — all issues resolved |
| Performance tests | Lighthouse | Manual |
| Database tests | pgTAP | Planned |

### 18.2 Test Coverage Goals

| Area | Target Coverage |
|------|----------------|
| `lib/pricing.ts` | 100% — pure function, no side effects |
| `lib/constants.ts` | N/A — static data |
| Booking wizard | 80% — critical user flow |
| Edge Functions | 80% — payment-critical |
| RLS policies | 100% — security-critical |

### 18.3 Security Testing

The platform has been audited by the Supabase Security Advisor. All identified issues have been resolved:

- SECURITY DEFINER views → converted to SECURITY INVOKER
- Mutable search_path functions → fixed with `SET search_path = public, pg_catalog`
- Always-true RLS policies → tightened with proper WITH CHECK clauses
- Public execution of admin functions → EXECUTE revoked from `anon`

---

&nbsp;

---

## 19. Deployment

### 19.1 Environments

| Environment | Purpose | URL |
|-------------|---------|-----|
| Development | Local development | `http://localhost:3000` |
| Staging | Pre-production testing | `https://staging.puremaids.co.uk` |
| Production | Live customer-facing | `https://puremaids.co.uk` |

### 19.2 Deployment Process

```mermaid
graph LR
    A[Local Dev] -->|npm run dev| B[Dev Server]
    B -->|Test locally| C[Commit]
    C -->|Push to main| D[Bolt Build]
    D -->|Build & optimise| E[Production Deploy]
    E -->|Live| F[puremaids.co.uk]

    C -->|Push to staging| G[Staging Build]
    G -->|Test on staging| H[Verify]
    H -->|Merge to main| D
```

### 19.3 Build Process

```bash
# Install dependencies (deterministic)
npm ci

# Build the application
npm run build
# This:
# 1. Compiles TypeScript
# 2. Runs ESLint
# 3. Generates static pages (SSG)
# 4. Creates server bundles (SSR)
# 5. Optimises images (AVIF/WebP)
# 6. Collects build traces

# Start production server
npm start
```

### 19.4 Edge Function Deployment

Edge Functions are deployed using the Supabase MCP `deploy_edge_function` tool. The function source must be written to `supabase/functions/<slug>/index.ts` before deployment.

### 19.5 Database Migrations

Database migrations are applied using the Supabase MCP `apply_migration` tool. Each migration is a SQL file with a timestamped filename. Migrations are tracked in the `supabase_migrations.schema_migrations` table.

### 19.6 Rollback

| Component | Rollback Strategy |
|-----------|-------------------|
| Next.js app | Bolt platform supports instant rollback to previous deployment |
| Edge Functions | Redeploy previous version using `deploy_edge_function` MCP tool |
| Database migrations | Manual SQL to reverse the migration (no automated rollback) |

### 19.7 Backups

| Component | Backup Strategy |
|-----------|-----------------|
| Database | Supabase automatic daily backups (point-in-time recovery) |
| Storage | Supabase Storage replication |
| Code | Git repository (all versions) |
| Stripe data | Stripe dashboard (all transaction history) |

### 19.8 CI/CD

CI/CD is managed by the Bolt platform. On push to the main branch:
1. Dependencies are installed (`npm ci`)
2. The application is built (`npm run build`)
3. If the build succeeds, the new version is deployed
4. If the build fails, the previous version remains live

---

&nbsp;

---

## 20. Monitoring

### 20.1 Health Checks

| Check | Method | Alert Condition |
|-------|--------|-----------------|
| Next.js server | Bolt platform health check | HTTP 5xx response rate > 1% |
| Supabase database | Supabase dashboard | Connection pool exhausted |
| Edge Functions | Supabase dashboard | Error rate > 5% |
| Stripe webhooks | Stripe dashboard | Webhook delivery failure |

### 20.2 Metrics

| Metric | Source | Target |
|--------|--------|--------|
| First Load JS (shared) | Next.js build output | < 100 kB |
| Page load time | Lighthouse | < 2 seconds (LCP) |
| Lighthouse performance | Lighthouse | > 90 |
| Lighthouse accessibility | Lighthouse | > 95 |
| Lighthouse SEO | Lighthouse | 100 |
| Database query time | Supabase dashboard | < 100ms (p95) |

### 20.3 Alerts

Alerts are not currently automated. Manual monitoring via:
- Bolt platform dashboard (deployment status, uptime)
- Supabase dashboard (database health, Edge Function logs)
- Stripe dashboard (payment success rate, webhook delivery)

**Roadmap**: Integrate Sentry for automated error alerting and PagerDuty for on-call notifications.

---

&nbsp;

---

## 21. Scalability

### 21.1 Current Architecture Limits

| Component | Limit | Mitigation |
|-----------|-------|------------|
| Next.js (Bolt) | Auto-scaled by platform | No action needed |
| Supabase database | Connection pool size | Use connection pooling; avoid long-running queries |
| Edge Functions | Concurrent invocations | Auto-scaled by Supabase |
| Stripe API | Rate limits (100 req/sec) | Not likely to hit; webhooks are async |

### 21.2 Horizontal Scaling

The Next.js application is stateless and can be scaled horizontally by the Bolt platform. Edge Functions are also stateless and auto-scaled by Supabase. The only stateful component is the PostgreSQL database.

### 21.3 Database Scaling

| Technique | Status | Notes |
|-----------|--------|-------|
| Connection pooling | Active | Supabase PgBouncer |
| Read replicas | Available | Supabase supports read replicas for read-heavy workloads |
| Partitioning | Not needed | Current data volume does not require partitioning |
| Indexing | Active | All foreign keys and frequently queried columns are indexed |

### 21.4 Caching

| Layer | Strategy |
|-------|----------|
| Next.js | Static generation for content pages; `Cache-Control` headers |
| CDN | Bolt edge CDN caches static assets |
| Database | Supabase connection pooling |
| Client | Browser cache for static assets; service worker (roadmap) |

### 21.5 Future Scaling Considerations

- Implement Redis for session caching and rate limiting
- Add a job queue (e.g., Supabase Queue or external) for background tasks
- Implement CDN caching for API responses with `stale-while-revalidate`
- Consider database partitioning when bookings exceed 1M rows

---

&nbsp;

---

## 22. Troubleshooting

### 22.1 Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "Missing Supabase env vars" | Environment variables not set | Check `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Build fails with "export metadata from use client" | Metadata export in a `'use client'` component | Move metadata to a separate server component or remove it |
| Stripe Checkout redirect fails | Invalid Stripe key or wrong price ID | Check `STRIPE_SECRET_KEY` is set and valid; verify price IDs in Stripe dashboard |
| Webhook not received | Stripe webhook endpoint not configured | Use Stripe CLI for local dev; ensure webhook URL is publicly accessible in production |
| RLS policy blocks legitimate access | Policy condition too restrictive | Check `auth.uid()` is present in the session; verify policy conditions |
| Edge Function returns CORS error | Missing CORS headers | Ensure all responses include `corsHeaders` (including OPTIONS and error responses) |
| "Function search_path mutable" warning | Function lacks `SET search_path` | Add `SET search_path = public, pg_catalog` to function definition |
| Booking insert fails with RLS error | INSERT policy conditions not met | Ensure `status = 'pending'`, `user_id IS NULL` (for anon), `deposit_paid = false` |

### 22.2 Debugging

| Task | How |
|------|-----|
| View Edge Function logs | Supabase dashboard → Functions → select function → Logs |
| View database queries | Supabase dashboard → SQL Editor → run diagnostic queries |
| Test RLS policies | Use Supabase SQL Editor with `SET ROLE anon` or `SET ROLE authenticated` |
| Debug Stripe webhooks | Stripe dashboard → Developers → Webhooks → view event details |
| Debug auth issues | Supabase dashboard → Authentication → Users |
| Check migration status | Supabase dashboard → SQL Editor → `SELECT * FROM supabase_migrations.schema_migrations` |

### 22.3 Useful Diagnostic Queries

```sql
-- Check RLS is enabled on all tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check all policies for a table
SELECT * FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'bookings';

-- Check function security settings
SELECT proname, prosecdef, proconfig
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public';

-- Check active bookings
SELECT status, COUNT(*) FROM bookings GROUP BY status;

-- Check recent payments
SELECT id, amount_pence, status, created_at
FROM payments ORDER BY created_at DESC LIMIT 10;
```

---

&nbsp;

---

## 23. Future Roadmap

### 23.1 Planned Modules

| Module | Priority | Description |
|--------|----------|-------------|
| **Customer auth** | High | Sign up / sign in / sign out pages with Supabase Auth |
| **Cleaner portal** | High | Dashboard for cleaners to view schedule, check in/out, complete tasks |
| **Admin dashboard** | High | Full admin panel for booking management, cleaner assignment, revenue reports |
| **Automated invoicing** | High | Generate and email invoices automatically on payment completion |
| **SMS notifications** | Medium | Twilio integration for SMS booking reminders |
| **Google Calendar sync** | Medium | Two-way sync between booking schedule and Google Calendar |
| **MFA for admins** | Medium | Multi-factor authentication for admin accounts |
| **Audit logging** | Medium | Dedicated audit_logs table with triggers on all tables |
| **Service area pages** | Medium | Individual landing pages for each service area with local SEO |
| **Blog/CMS** | Low | Content management system for SEO blog articles |
| **Mobile app** | Low | React Native app for customers and cleaners |
| **AI scheduling** | Low | Automatic cleaner assignment based on availability, location, and skills |
| **Loyalty programme** | Low | Points-based loyalty system for repeat customers |
| **Team cleaning** | Low | Support for multi-cleaner jobs (large properties) |
| **Inventory management** | Low | Track cleaning supplies and equipment per cleaner |
| **Real-time tracking** | Low | Live GPS tracking of cleaners during jobs |
| **Ratings analytics** | Low | Dashboard for analysing review trends and customer satisfaction |

---

&nbsp;

---

## 24. Contributing

### 24.1 Development Workflow

1. **Create a branch**: `git checkout -b feature/your-feature-name`
2. **Make changes**: Follow the coding conventions below
3. **Test locally**: `npm run dev` and verify your changes
4. **Run the build**: `npm run build` — ensure no errors or warnings
5. **Commit**: Use conventional commit messages (see below)
6. **Push and create a PR**: Describe your changes clearly

### 24.2 Coding Conventions

| Convention | Rule |
|------------|------|
| Language | TypeScript — strict mode (`"strict": true`) |
| Framework | Next.js 14 App Router |
| Styling | Tailwind CSS — use design system classes from `globals.css` |
| File naming | `kebab-case` for files; `PascalCase` for components |
| Component type | `'use client'` only when interactivity is required; default to server components |
| Imports | Use `@/` alias (configured in `tsconfig.json`) |
| Functions | Add `SET search_path = public, pg_catalog` to all PostgreSQL functions |
| RLS | Every new table must have RLS enabled with per-role policies |
| Security | Never use `SUPABASE_SERVICE_ROLE_KEY` in client code |
| Comments | Minimal — only for non-obvious WHY, never for WHAT |

### 24.3 Conventional Commits

```
feat: add subscription cancellation flow
fix: correct deposit calculation for rounded amounts
docs: update README with database schema
refactor: extract price calculation to lib/pricing.ts
chore: upgrade Next.js to 14.1.0
```

### 24.4 Pull Request Checklist

- [ ] Build passes (`npm run build`)
- [ ] No new TypeScript errors
- [ ] RLS policies added for any new tables
- [ ] `search_path` set on any new database functions
- [ ] No secrets committed to git
- [ ] No `SUPABASE_SERVICE_ROLE_KEY` in client code
- [ ] Responsive design verified (mobile + desktop)
- [ ] Accessibility checked (keyboard navigation, ARIA labels)
- [ ] SEO metadata set for new pages

---

&nbsp;

---

## 25. Appendix

### 25.1 Glossary

| Term | Definition |
|------|-----------|
| **RLS** | Row Level Security — PostgreSQL feature that restricts which rows a user can access based on policy conditions |
| **SECURITY DEFINER** | Function property that causes the function to execute with the privileges of the function owner, not the caller |
| **SECURITY INVOKER** | Function property that causes the function to execute with the privileges of the calling role |
| **search_path** | PostgreSQL setting that determines the order in which schemas are searched for unqualified object names |
| **JWT** | JSON Web Token — compact, URL-safe token used for authentication |
| **Edge Function** | Serverless function running on Supabase's Deno runtime |
| **DBS** | Disclosure and Barring Service — UK criminal record check for staff working with vulnerable people |
| **ICO** | Information Commissioner's Office — UK data protection regulator |
| **GDPR** | General Data Protection Regulation — EU/UK data protection law |
| **CSP** | Content Security Policy — HTTP header that restricts which resources can be loaded |
| **HSTS** | HTTP Strict Transport Security — forces HTTPS connections |
| **PWA** | Progressive Web App — installable web application with offline support |
| **SSR** | Server-Side Rendering — HTML generated on the server |
| **SSG** | Static Site Generation — HTML generated at build time |
| **PgBouncer** | PostgreSQL connection pooler used by Supabase |
| **Stripe Checkout** | Stripe's hosted payment page |
| **Stripe Webhook** | HTTP notification sent by Stripe when an event occurs (e.g. payment completed) |
| **Deposit** | Partial payment (20%) required to secure a booking |
| **Booking reference** | Human-readable unique identifier for a booking (e.g. `PM-A3F2B1C9`) |

### 25.2 Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint

# Supabase (via MCP tools, not CLI)
# Apply migration:  use mcp__supabase__apply_migration
# Execute SQL:      use mcp__supabase__execute_sql
# Deploy function:  use mcp__supabase__deploy_edge_function
# List tables:      use mcp__supabase__list_tables
# List migrations:  use mcp__supabase__list_migrations
# List functions:   use mcp__supabase__list_edge_functions
# List secrets:     use mcp__supabase__list_edge_function_secrets

# Stripe CLI (local development)
stripe listen --forward-to <webhook-url>
stripe trigger checkout.session.completed
```

### 25.3 Security Headers Reference

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Force HTTPS for 2 years |
| `Content-Security-Policy` | `default-src 'self'; ...` | Prevent XSS, data injection |
| `X-Frame-Options` | `SAMEORIGIN` | Prevent clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS protection |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer information |
| `Permissions-Policy` | `camera=(), microphone=(), ...` | Restrict browser APIs |

### 25.4 References

| Resource | URL |
|----------|-----|
| Next.js documentation | https://nextjs.org/docs |
| Supabase documentation | https://supabase.com/docs |
| Stripe documentation | https://stripe.com/docs |
| Resend documentation | https://resend.com/docs |
| Tailwind CSS documentation | https://tailwindcss.com/docs |
| PostgreSQL RLS documentation | https://www.postgresql.org/docs/current/ddl-rowsecurity.html |
| UK GDPR guidance | https://ico.org.uk |
| WCAG 2.1 guidelines | https://www.w3.org/TR/WCAG21/ |
| Mermaid diagram syntax | https://mermaid.js.org/syntax/ |

---

&nbsp;

---

> **Document Version**: 1.0.0
> **Last Updated**: January 2026
> **Maintained by**: PureMaids Engineering Team
> **License**: Proprietary — PureMaids Ltd
