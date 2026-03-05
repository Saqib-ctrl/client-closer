

## Plan: Prepare Propel for Acquire.com Listing

Selling on Acquire requires making the product look professional, credible, and investor/buyer-ready. Here are the changes needed:

### 1. Update Stats & Social Proof to Be Realistic
- **StatsCounter.tsx**: Update "3 tools" to "8 tools" to match the current product. Review other stats for accuracy.
- **Hero.tsx**: The "500+ freelancers winning clients" claim needs to either be accurate or softened (e.g., "Join freelancers winning clients").

### 2. Update Footer Copyright Year
- **Footer.tsx**: Change "© 2025" to "© 2026" (current year).

### 3. Add Acquire-Friendly Pages
- **Create `/about` page**: A professional "About Propel" page with product story, tech stack overview (React, AI-powered, Paddle payments), team info placeholder, and key metrics. Buyers on Acquire want to understand the business at a glance.

### 4. Polish Landing Page Copy for Buyer Appeal
- **Solution.tsx, Problem.tsx**: Verify these sections reference all 8 tools (not just original 3). Update if outdated.
- **FinalCTA.tsx**: Update copy from "Proposals. Mockups. Cover letters." to include the full toolkit.
- **InteractiveDemo.tsx**: Ensure the demo reflects current capabilities.
- **Testimonials.tsx**: Review for consistency with current feature set.

### 5. Add Business Metrics to Admin Dashboard
- **Admin.tsx**: Add an MRR estimate card (Pro users x $19), churn indicator, and a simple revenue projection. Buyers want to see business health metrics.

### 6. Code & Documentation Cleanup
- **README.md**: Rewrite with a professional project overview including tech stack, features list, architecture summary, setup instructions, and environment variables needed. This is critical for Acquire due diligence.

### Summary of Files to Create/Edit
| File | Action |
|------|--------|
| `src/components/landing/Footer.tsx` | Update copyright year |
| `src/components/landing/StatsCounter.tsx` | Update to 8 tools |
| `src/components/landing/FinalCTA.tsx` | Update copy for full toolkit |
| `src/components/landing/Hero.tsx` | Soften unverifiable social proof |
| `src/pages/About.tsx` | Create new page |
| `src/App.tsx` | Add `/about` route |
| `src/components/landing/Footer.tsx` | Add About link |
| `src/pages/Admin.tsx` | Add MRR/revenue metrics |
| `README.md` | Rewrite for buyer due diligence |
| `src/components/landing/Solution.tsx` | Verify/update for 8 tools |
| `src/components/landing/Problem.tsx` | Verify/update if needed |

