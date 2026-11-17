---
name: ui-design
description: Comprehensive UI design standards, design-system extraction, component architecture, visual harmony, state modeling, and ship verdict auditing.
---

# UI Design Skill

## Purpose
Governs the creation, refactoring, and auditing of user interfaces. Establishes unified component contracts across all user portals, eliminating disparate styles and visual drift.

## Core Directives

### 1. Unified Component Contract
Every interactive component must adhere to a single unified variant architecture:
- **Button Variants**:
  - `primary`: Solid Espresso (`#41332B`), text Ivory (`#F5EFE7`), rounded-full or `rounded-lg`.
  - `secondary`: Warm Latte surface (`#E8D8C7`), text Espresso (`#41332B`), subtle border.
  - `outline`: 1px solid border (`rgba(65,51,43,0.2)`), transparent background, hover subtle tint.
  - `ghost`: Transparent background, hover subtle warm tint (`rgba(65,51,43,0.05)`).
  - `danger`: Muted crimson (`#9E2A2B`), non-garish, clear confirmation required.
- **Form Controls**:
  - Consistent height (`h-10` or `h-11`), border radius (`rounded-lg`), padding (`px-3.5`).
  - Clear label positioned *above* input (never placeholder-only).
  - Explicit error state with helper text and red-tinted border (`border-rose-500`).
  - Focus state: Accessible focus ring (`ring-2 ring-[#B99470]/40 border-[#B99470]`).

### 2. Design Token Consistency
- No arbitrary inline hex codes scattered in JSX without token alignment.
- Consistent border radii: `rounded-lg` (8px) for cards and inputs, `rounded-full` for chips and pill CTAs.
- Elevation:
  - Surface: `bg-[#FDFBF7]` / `bg-[#201511]`
  - Elevated: `bg-[#FFFFFF]` / `bg-[#2A1E18]`
  - Shadow: Soft, ambient diffuse shadows (`shadow-[0_4px_20px_rgba(65,51,43,0.06)]`), never harsh pitch-black drop shadows.

### 3. Visual Audit & Ship Verdict Criteria
A screen passes ship audit only when:
1. Zero visual overlap across desktop (1440px), laptop (1366px), tablet (768px), and mobile (375px).
2. All interactive elements have complete state definitions (`hover`, `focus-visible`, `active`, `disabled`).
3. Meaningful empty states (no blank white boxes).
4. Skeletons or subtle spinners for loading states.
