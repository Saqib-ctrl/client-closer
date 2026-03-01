

## Plan: Add Advanced Features to Propel

This is a large scope. I'll break it into prioritized phases to implement incrementally.

---

### Phase 1: PDF Export (Quick Win)

Add PDF export for proposals and cover letters using browser-native `window.print()` with a styled print view, or use a lightweight library approach with `jspdf` + `html2canvas`.

**Changes:**
- Install `jspdf` and `html2canvas` packages
- Create a shared `exportToPdf()` utility function
- Add "Download PDF" buttons in `ProposalGenerator.tsx` and `CoverLetterGenerator.tsx`
- Add PDF export option in `HistoryPanel.tsx` for saved items

---

### Phase 2: Dark Mode

Add a theme toggle using the already-installed `next-themes` package.

**Changes:**
- Wrap app in `ThemeProvider` in `main.tsx`
- Add a theme toggle button in the dashboard sidebar and landing page header
- Ensure all components use CSS variables (already mostly done via Tailwind/shadcn)

---

### Phase 3: AI Email Assistant (New Tool)

A new AI tool that generates follow-up emails, negotiation responses, and client communication templates.

**Database changes:**
- Add `emails_generated` and `emails_limit` (default 5) to `user_usage`
- Create `emails` table for saving generated emails
- Create `check_email_usage_limit` and `record_email_usage` functions

**Backend:**
- New edge function `generate-email/index.ts` using Gemini Flash

**Frontend:**
- New `EmailAssistant.tsx` component with email type selector (follow-up, negotiation, thank you, cold outreach)
- Add to dashboard nav

---

### Phase 4: Templates Library

Save and reuse best proposals/letters as reusable templates.

**Database changes:**
- Create `templates` table (id, user_id, type, title, content, created_at)
- RLS policies for user-owned templates

**Frontend:**
- "Save as Template" button on generated content
- Templates tab in dashboard sidebar
- "Use Template" option when starting a new generation (pre-fills form)

---

### Phase 5: Invoice Generator

AI-powered invoice creation with PDF export.

**Database changes:**
- Create `invoices` table (id, user_id, client_name, items JSON, total, currency, status, due_date, created_at)
- Add `invoices_generated` and `invoices_limit` to `user_usage`

**Backend:**
- Edge function to format invoice data with AI assistance

**Frontend:**
- `InvoiceGenerator.tsx` with line items editor, client info, tax calculation
- PDF export using the shared utility from Phase 1
- Add to dashboard nav

---

### Phase 6: Analytics Dashboard

Usage charts and trends over time.

**Frontend:**
- New `AnalyticsDashboard.tsx` component using `recharts` (already installed)
- Show generation trends (daily/weekly), tool usage breakdown, and activity timeline
- Query existing tables for aggregated data
- Replace or enhance the Overview tab

---

### Phase 7: Client CRM Dashboard

Track clients, projects, and earnings.

**Database changes:**
- Create `clients` table (id, user_id, name, email, company, notes, created_at)
- Create `projects` table (id, user_id, client_id, title, status, amount, deadline, created_at)

**Frontend:**
- `ClientCRM.tsx` with client list, project tracking, earnings summary
- Link proposals/invoices to clients
- Add to dashboard nav

---

### Phase 8: Portfolio Page Builder

Generate a shareable portfolio page from work samples.

**Database changes:**
- Create `portfolios` table (id, user_id, slug, title, bio, theme, sections JSON, is_published)

**Frontend:**
- `PortfolioBuilder.tsx` with drag-and-drop sections
- Theme picker and preview
- Public shareable URL at `/portfolio/:slug`

---

### Implementation Priority

| Phase | Feature | Complexity | Impact |
|-------|---------|-----------|--------|
| 1 | PDF Export | Low | High |
| 2 | Dark Mode | Low | Medium |
| 3 | AI Email Assistant | Medium | High |
| 4 | Templates Library | Medium | High |
| 5 | Invoice Generator | Medium | High |
| 6 | Analytics Dashboard | Medium | Medium |
| 7 | Client CRM | High | High |
| 8 | Portfolio Builder | High | Medium |

I recommend implementing Phases 1-5 first as they add the most value for the $19/mo price point. Phases 6-8 can follow as premium differentiators.

