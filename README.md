# Propel — AI-Powered Freelance Toolkit

Propel is a full-stack SaaS platform that gives freelancers 8 AI-powered tools to win more clients. It consolidates proposal writing, mockup generation, cover letters, email drafting, invoicing, CRM, portfolio building, and analytics into a single dashboard.

## 🚀 Product Overview

| Metric | Detail |
|--------|--------|
| **Model** | Freemium SaaS (Free tier + $19/mo Pro) |
| **Billing** | Paddle (subscriptions, webhooks) |
| **Auth** | Email/password via Supabase Auth |
| **AI** | LLM-powered content generation |
| **Users** | Freelancers, consultants, agencies |

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui, Framer Motion |
| Backend | Supabase (Postgres, Auth, Edge Functions, RLS) |
| Payments | Paddle (subscriptions, webhooks) |
| Hosting | Lovable (preview + production) |

## 📦 Features (8 AI Tools)

1. **Proposal Generator** — Paste a job description, get a tailored client proposal
2. **Mockup Generator** — Upload reference images, get AI-generated visual mockups
3. **Cover Letter Writer** — Targeted cover letters from job postings + resume
4. **Email Assistant** — Professional follow-ups, pitches, and client communication
5. **Invoice Generator** — Create, manage, and track client invoices
6. **Client CRM** — Track clients, projects, revenue, and deadlines
7. **Portfolio Builder** — Publishable portfolio with 11 section types, 10 themes, custom domains
8. **Analytics Dashboard** — Usage tracking, tool breakdown, weekly activity charts

## 🏗 Architecture

```
src/
├── components/
│   ├── dashboard/       # 12 dashboard feature components
│   ├── landing/         # 15 landing page sections
│   └── ui/              # 40+ shadcn/ui components
├── pages/               # 12 route pages
├── hooks/               # Custom React hooks
├── integrations/        # Supabase client + auto-generated types
└── lib/                 # Utilities (PDF export, helpers)

supabase/
├── functions/           # 8 Edge Functions (auth, AI, billing, admin)
├── migrations/          # Database migrations
└── config.toml          # Supabase project config
```

## 🗄 Database Schema

| Table | Purpose |
|-------|---------|
| `profiles` | User profile data |
| `proposals` | Generated proposals |
| `cover_letters` | Generated cover letters |
| `emails` | Generated emails |
| `mockups` | Generated mockups |
| `invoices` | Client invoices (items as JSON) |
| `clients` | CRM client records |
| `projects` | CRM project tracking |
| `portfolios` | Published portfolio sites |
| `templates` | Saved content templates |
| `subscriptions` | Paddle subscription state |
| `user_usage` | Usage limits + premium status |
| `user_roles` | RBAC (admin, moderator, user) |
| `ip_usage` | Anonymous usage tracking |

All tables have Row-Level Security (RLS) enabled with per-user policies.

## ⚡ Edge Functions

| Function | Purpose |
|----------|---------|
| `generate-proposal` | AI proposal generation |
| `generate-cover-letter` | AI cover letter generation |
| `generate-email` | AI email drafting |
| `generate-mockup` | AI mockup generation |
| `paddle-webhook` | Subscription lifecycle events |
| `cancel-subscription` | User-initiated cancellation |
| `check-admin` | Admin role verification |
| `admin-data` | Admin dashboard data + actions |

## 🔐 Security

- Row-Level Security on all tables
- RBAC via `user_roles` table + `has_role()` security definer function
- Admin actions gated behind Edge Function auth checks
- Paddle webhook signature verification (HMAC-SHA256)
- Usage limits enforced server-side via database functions

## 💰 Revenue Model

- **Free Tier**: 5 proposals, 5 mockups, 3 cover letters, 5 emails
- **Pro Plan**: $19/month (or yearly) — unlimited everything via Paddle

## 🧪 Local Development

```bash
# Clone and install
git clone <YOUR_GIT_URL>
cd propel
npm install

# Start dev server
npm run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID |

Edge function secrets (configured in Supabase):
- `PADDLE_WEBHOOK_SECRET` — Paddle webhook verification
- AI model API keys (configured via Lovable AI integration)

## 📄 License

Proprietary. All rights reserved.
