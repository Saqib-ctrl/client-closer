

## Plan: Add Mockup Usage Limits + App Improvements

This is a large scope request. I will break it into phases, starting with the most concrete items.

---

### Phase 1: Add 5 Free Mockup Limit (immediate)

**Database changes:**
- Add `mockups_generated` (default 0) and `mockups_limit` (default 5) columns to `user_usage` table
- Create `check_mockup_usage_limit` and `record_mockup_usage` database functions (mirroring the proposal usage pattern)

**Edge function changes:**
- Update `generate-mockup/index.ts` to check mockup usage limits before generation and record usage after

**Frontend changes:**
- Create a `MockupUsageIndicator` component (or reuse `UsageIndicator` with a `type` prop)
- Update `MockupGenerator.tsx` to fetch and display mockup usage, disable generation when limit reached, show upgrade CTA
- Update `user_usage` type references

---

### Phase 2: Fix Paddle Checkout

The "Something went wrong" error persists despite code fixes. The most likely remaining cause is that your **preview/published domains are not whitelisted** in Paddle Dashboard. You need to add these exact domains in Paddle > Checkout Settings > Allowed Domains:
- `propeldev.lovable.app`
- `*.lovableproject.com`

No code changes needed for this -- it is a Paddle dashboard configuration issue.

---

### Phase 3: UI Polish & Advanced Features (follow-up)

After the core fixes, we can tackle in subsequent iterations:
- Professional dashboard redesign with better layout, charts, analytics
- Password reset flow
- Additional AI tools (cover letter generator, portfolio page builder)
- Team/collaboration features
- Landing page polish and animations fixes

---

### Summary of Immediate Changes

| Area | Change |
|------|--------|
| Database | Add `mockups_generated`, `mockups_limit` to `user_usage` |
| Database | New functions for mockup usage tracking |
| Edge Function | `generate-mockup` checks/records usage |
| Frontend | `MockupGenerator` shows usage + limits |
| Frontend | Reuse `UsageIndicator` for mockups |

