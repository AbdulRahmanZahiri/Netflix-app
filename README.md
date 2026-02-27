# ScholarFlow - AI Study Organizer for University Students

Production-ready SaaS scaffold built with Next.js 14 (App Router), Supabase, Stripe subscriptions, and a structured AI assistant.

## Features
- Authentication (Supabase email/password)
- Protected dashboard routes
- Course & assignment management
- Smart study planner (rule-based, 50-minute blocks)
- Flashcards with spaced repetition
- AI study assistant (safe, structured JSON outputs)
- Stripe subscription logic (Free + Pro)

## Folder Structure
```
/app
  /(auth)
    /login
    /register
  /api
    /ai
    /planner
    /stripe
      /checkout
      /portal
      /webhook
  /dashboard
    /assignments
    /courses
    /flashcards
    /planner
    /settings
    layout.tsx
    page.tsx
  globals.css
  layout.tsx
  page.tsx
/auth
  actions.ts
/dashboard
  metrics.ts
/api
  client.ts
/components
  AuthForm.tsx
  Button.tsx
  FeatureCard.tsx
  Input.tsx
  PricingCard.tsx
  ProgressBar.tsx
  SectionHeader.tsx
  Sidebar.tsx
  StatCard.tsx
  Topbar.tsx
/lib
  ai-usage.ts
  ai.ts
  db.ts
  flags.ts
  planner.ts
  spaced-repetition.ts
  stripe-client.ts
  stripe.ts
  subscription.ts
  utils.ts
  /supabase
    admin.ts
    browser.ts
    middleware.ts
    server.ts
/styles
  theme.css
/types
  database.ts
/database
  schema.sql
middleware.ts
```

## Environment Variables
Copy `.env.example` to `.env.local` and fill in values:

```
NEXT_PUBLIC_APP_URL=
DEV_BYPASS_AUTH=false
BILLING_ENABLED=true
DEV_LOCAL_DB=false

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO_MONTHLY=

AI_API_URL=
AI_API_KEY=
AI_MODEL=
```

## Quick Local Test (no paid setup)
Set these in `.env.local` to bypass auth and billing while you verify UI:
```
DEV_BYPASS_AUTH=true
BILLING_ENABLED=false
DEV_LOCAL_DB=true
```
Local data persists in `data/dev-db.json`.

## Database Schema
Run the SQL in `database/schema.sql` in Supabase SQL editor.

## AI Prompts
Prompts are embedded in `lib/ai.ts` and enforce:
- Only user-provided content
- No direct assignment solving
- JSON-only output

## Stripe Logic
- `POST /api/stripe/checkout` creates a subscription checkout session
- `POST /api/stripe/portal` opens billing portal
- `POST /api/stripe/webhook` updates `subscriptions` table

## Planner Logic
The rule-based planner lives in `lib/planner.ts` and:
- Calculates urgency = weight / days_until_due
- Sorts by urgency
- Distributes weekly hours into 50-minute blocks
- Caps sessions per day to avoid overload

## Running locally
```
npm install
npm run dev
```
