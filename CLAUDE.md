# Folia — Project Instructions for Claude

## What We're Building
Folia is a houseplant tracker web app. Users can search and add plants, view AI-generated care profiles, log health observations analyzed by AI, chat with an AI assistant per plant, and receive daily email reminders when plants are due for watering.

## App Name
This app is called **Folia**. All UI text, branding, email copy, and user-facing strings use "Folia" — not "Plantwise".

## Tech Stack
- Next.js 14 (App Router) — framework
- Tailwind CSS — styling
- Clerk — authentication
- Neon Postgres — database
- Prisma — ORM
- Resend — email
- Vercel — hosting and cron jobs
- Sentry — error monitoring
- Claude API (`claude-sonnet-4-20250514`) — AI chat and health log analysis
- Gemini Image API — plant illustrations
- Perenual API — plant search and care data
- GSAP — animations

## Build Order (strict — do not skip ahead)
1. Next.js scaffold, Tailwind, Clerk auth, Neon + Prisma, deployed to Vercel
2. Plant search via Perenual API, plant card UI, save to database
3. Plant illustration generation via Gemini Image API
4. Health log submission, Claude AI analysis, display
5. AI chat per plant with full health log context
6. Sentry integration
7. Resend email, Vercel cron job, watering confirmation flow
8. GSAP animations and UI polish
9. Seed demo data

---

## How Claude Should Teach

### Before each feature
Explain in 3–5 plain sentences:
- What is about to be built
- Why this approach was chosen
- What problem it solves

No jargon without explanation. Write like explaining to a smart non-specialist.

### After each feature
Give a short plain-English summary covering:
- What was just built
- The key architectural decision and why
- One concept worth researching further (with a specific search term, not a vague recommendation)

Keep it scannable — readable in under a minute.

### Mental models over memorization
When introducing a new tool or concept, explain the mental model first. What is the thing doing? Why does it exist? The user does not need to memorize syntax — they need to understand what is happening and why.

### Flag interview-worthy moments
When we build or decide something that commonly comes up in engineering interviews, flag it clearly. Include: why we chose this approach, what the tradeoffs were, how the technology works under the hood at a high level.

### Flag learning checkpoints
At foundational concepts (auth flow, serverless functions, ORMs, cron jobs, etc.), suggest the user pause and watch a short video or read a short article before proceeding. Give a specific search term, not a vague recommendation.

### Keep momentum
Do not quiz the user or require them to prove understanding before moving forward. Do not over-explain every line of code. Keep all explanations short and scannable. When in flow, the user should be able to skip explanations and return to them later.

---

## Behavioral Rules

- Do what has been asked; nothing more, nothing less
- Explain every architectural decision before implementing it
- Flag tradeoffs when multiple approaches exist
- Never skip error handling
- Mobile-first on all UI
- ALWAYS read a file before editing it
- NEVER create files unless absolutely necessary
- ALWAYS prefer editing an existing file to creating a new one
- NEVER commit secrets, credentials, or .env files
- NEVER save working files or tests to the root folder

## File Organization
- `/app` — Next.js App Router pages and API routes
- `/lib` — shared utilities, API clients, Prisma singleton
- `/components` — React components
- `/emails` — React Email templates
- `/prisma` — schema and migrations
- `/scripts` — one-off utility scripts (e.g. illustration seeding)
- `/public` — static assets

## Code Style
- TypeScript throughout — no `any` types
- Null-check all external API responses (Perenual especially)
- Error handling on every API route — never let errors reach the user as raw stack traces
- Keep files under 300 lines — split if larger
- Prefer server components for data fetching; use client components only when interactivity is needed

## Environment Variables
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
CLERK_WEBHOOK_SECRET
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
DATABASE_URL
ANTHROPIC_API_KEY
GEMINI_API_KEY
PERENUAL_API_KEY
RESEND_API_KEY
RESEND_FROM_EMAIL
BLOB_READ_WRITE_TOKEN
NEXT_PUBLIC_APP_URL
CRON_SECRET
SENTRY_DSN
```

## AI Prompts (exact — do not deviate)

### Health log analysis (Claude)
> "You are a plant care expert. The user is logging an observation about their [plant name] ([scientific name]). Their care profile says: watering every [X] days, [light], [soil], [humidity]. Analyze their observation, flag anything concerning, and suggest one specific action. Keep your response under 100 words."

### AI chat per plant (Claude)
> "You are a friendly plant care expert. The user is asking about their [plant name] ([scientific name]). Care profile: watering every [X] days, [light], [soil], [humidity]. Health log history: [all log entries with dates]. Give concise, practical advice. Keep responses under 150 words unless the user asks for detail."

### Plant illustration (Gemini)
> "Minimalist botanical line art illustration of a [plant name] in a simple pot, thin clean lines, sage green and warm cream tones, flat design, white background, no shading, no text, modern app UI style."

## UI Design
- Color palette: deep greens, warm cream, soft sage
- Typography: serif for plant names, sans-serif for everything else
- Plant cards: image on top, name, scientific name, watering status badge
- Badge colors: green if >2 days away, amber if within 2 days, red if overdue
- Empty states: friendly and instructional, never just blank
- Animations: GSAP for card entrance (staggered, 200–300ms) and page transitions only; use Tailwind transitions for everything else
