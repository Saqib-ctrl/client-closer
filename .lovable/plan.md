

## Plan: Premium Landing Page Redesign

The current landing page is functional but looks like a standard SaaS template. To achieve a premium, modern, minimalistic feel that impresses Acquire buyers, here's the approach:

### Core Concept
Replace the current text-heavy hero with a **floating 3D-perspective dashboard mockup** showing live client messages, notifications, and tool activity. Use CSS `perspective` and `transform: rotateX/rotateY` (no heavy 3D libraries) to create an isometric app screen effect with animated content inside it. Keep it lightweight per the user's performance preference.

### Changes

**1. Hero Section - Complete Redesign (`Hero.tsx`)**
- Clean, minimal headline with large whitespace — fewer words, more impact
- Remove the 8 tool pills (cluttered) — move them to a subtle animated ticker below
- Add a **floating 3D perspective mockup** below the CTA: a CSS-perspective card showing an animated dashboard with:
  - Incoming client message notifications sliding in
  - "Proposal sent" / "Invoice paid" status updates
  - A mini tool switcher bar
- Subtle gradient mesh background instead of blurry circles
- Monochrome color palette with primary accent only on key elements

**2. New Animated Dashboard Preview Component (`HeroDashboardPreview.tsx`)**
- Pure CSS 3D perspective card (rotateX: 12deg, rotateY: -8deg) with a glass-morphism border
- Inside: animated fake UI showing:
  - A sidebar with tool icons
  - A main content area with a "New message from Sarah Chen" notification sliding in
  - A proposal preview card fading in
  - Status badges ("Sent", "Viewed", "Paid") animating
- Uses framer-motion for staggered entry animations
- Hover: card slightly flattens toward the viewer (reduces rotation)

**3. Refined Section Spacing & Typography**
- Increase hero vertical padding significantly for breathing room
- Reduce subtitle text size — let the visual do the talking
- Use `font-light` for subtitles instead of regular weight

**4. LogoBar Polish (`LogoBar.tsx`)**
- Replace emoji icons with subtle monochrome text-only logos
- Add a slow infinite horizontal scroll/marquee effect

**5. Subtle Grid/Dot Background (`Index.tsx`)**
- Add a faint dot grid pattern overlay to the page background for depth

### Files to Create/Edit
| File | Action |
|------|--------|
| `src/components/landing/Hero.tsx` | Redesign with minimal copy + 3D preview |
| `src/components/landing/HeroDashboardPreview.tsx` | New floating 3D dashboard mockup |
| `src/components/landing/LogoBar.tsx` | Marquee scroll + cleaner styling |
| `src/index.css` | Add dot grid background utility, glass-morphism classes |

### Technical Approach
- CSS `perspective` + `transform3d` for the 3D card — no external 3D libraries needed
- `framer-motion` for staggered content animations inside the preview
- CSS `backdrop-filter: blur()` for glass effect
- Infinite CSS `@keyframes` marquee for logo bar
- All lightweight, no performance concerns

