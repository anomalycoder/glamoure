---
name: design-systems-tokens
description: >-
  Provides structured design tokens, color palette architectures, typography systems,
  spacing scales, and reusable component variant patterns. Use when establishing, auditing,
  or building design system tokens and component libraries for Glamouré or web design projects.
---

# Design Systems & Component Design Skill

## 1. Overview
This skill guides the definition and governance of design tokens, component variants, and spatial scales. It enforces design system consistency across colors, typography, sizing, radii, and elevation so that all components share a single source of truth.

---

## 2. Token Architecture

### A. Color Palette Tokens (`#41332B` Scale & Surfaces)
All colors must resolve to semantic or primitive design tokens defined in Tailwind CSS v4 `@theme` and CSS variables:

```css
:root {
  /* Section Background Tokens */
  --bg-services: #F4EEE7;       /* Sandstone Cashmere */
  --bg-transformations: #F1EAE2; /* Latte Mocha */
  --bg-artists: #EEE6DC;        /* Hazelnut Taupe */
  --bg-appointments: #F3ECE7;   /* Warm Linen */
  --bg-testimonials: #F2ECE5;   /* Warm Alabaster */

  /* Semantic Brand Tokens */
  --color-heading: #41332B;     /* Deep Espresso */
  --color-body: #806B5C;        /* Warm Mocha */
  --color-accent: #B99470;      /* Champagne Gold */
  --color-divider: #DCCBBB;     /* Hairline Divider */
  --color-footer: #41332B;
}
```

#### Primitive Tonal Classes for `#41332B`:
- `brown-50` (`#f7f4f3`): Highlight surface / Ultra-light tint
- `brown-100` (`#ede7e3`): Soft Cashmere surface
- `brown-200` (`#ded1ca`): Sandstone Cashmere (Section 2)
- `brown-300` (`#cfbbb0`): Warm Latte Mocha (Section 3)
- `brown-400` (`#c0a596`): Hazelnut Taupe (Section 4)
- `brown-500` (`#a98470`): Medium Mocha (Badges / Muted accents)
- `brown-600` (`#856451`): Deep Chestnut (Borders / Outlines)
- `brown-700` (`#604a3e`): Dark Cocoa (Subheaders / Eyebrows)
- `brown-800` (`#40332b`): Pure Base `#41332B` (Deep Espresso)
- `brown-900` (`#2f241e`): Dark Velvet Espresso (Headings)
- `brown-950` (`#1d1511`): Near-Black Caviar (High-emphasis)

### B. Spatial & Sizing Grid (8pt System)
All padding, margin, and gaps must strictly adhere to the $4\text{px} / 8\text{px}$ rhythm:
- `space-1`: $4\text{px}$ (micro gaps, icon-to-text)
- `space-2`: $8\text{px}$ (tight element spacing)
- `space-3`: $12\text{px}$ (compact card padding)
- `space-4`: $16\text{px}$ (standard element gap)
- `space-6`: $24\text{px}$ (container sub-padding)
- `space-8`: $32\text{px}$ (component separation)
- `space-12`: $48\text{px}$ (column separation)
- `space-16`: $64\text{px}$ (section sub-padding)
- `space-24`: $96\text{px}$ (section padding desktop: `py-24`)
- `space-48`: $192\text{px}$ (inter-section gap: `pb-24` + `pt-24`)

### C. Corner Radius Scale
- `radius-sm`: $4\text{px}$ (tags, micro badges)
- `radius-md`: $8\text{px}$ (standard photo cards, inputs)
- `radius-lg`: $16\text{px}$ (dialogs, cards)
- `radius-xl`: $25\text{px}$ (sculpted asymmetric corners)
- `radius-full`: $9999\text{px}$ (pill buttons, vaulted arch tops)

---

## 3. Component Variant Guidelines

When authoring reusable UI components:
1. **Explicit TypeScript Props**: Use union types for variants (e.g. `variant: 'primary' | 'secondary' | 'outline' | 'ghost'`).
2. **Deterministic Class Mapping**: Map variants to fixed token combinations rather than ad-hoc inline styles.
3. **Interactive States**: Every interactive component must define `:hover`, `:active`, `:focus-visible`, and `disabled` states with smooth transitions (`duration-300 ease-out`).
4. **Touch Target Size**: Mobile touch targets must never be smaller than $44\text{px} \times 44\text{px}$.

---

## 4. Supporting Resources
- [Complete Tokens Manifest JSON](./references/tokens-manifest.json)
- [Component Variant Implementation Example](./examples/button-variants.tsx)
