---
name: editorial-web-design
description: >-
  Applies luxury editorial website design standards, high-fashion art direction,
  asymmetric spatial compositions, strict typographic hierarchy (display serif/script + utility sans),
  and paper-like tonal palettes. Use when designing, reviewing, or refactoring layouts,
  hero sections, or brand narrative sections for Glamouré or high-end beauty/editorial web projects.
---

# Editorial Web Design Skill

## 1. Overview & Philosophy
This skill equips the agent with high-fashion, editorial art direction principles derived from publications like *Vogue*, *Kinfolk*, and *Cereal*, tailored specifically for luxury salon and beauty web experiences (such as **Glamouré**).

The goal is to eliminate generic SaaS website patterns (centered hero blocks, floating glass cards, neon gradient buttons) and replace them with intentional spatial rhythm, editorial typography, asymmetric magazine compositions, and tactile paper-like tonal palettes.

---

## 2. Core Art Direction Principles

### A. Spatial Rhythm & Whitespace
1. **Generous Editorial Gaps**:
   - Maintain uniform inter-section breathing room ($160\text{px} - 192\text{px}$ on desktop, $96\text{px} - 120\text{px}$ on mobile).
   - Never cram sections together; negative space is an active luxury design element.
2. **Asymmetrical Grid Composition**:
   - Reject standard centered 3-card equal grids.
   - Use dynamic column splits (e.g., 5-col narrative + 7-col asymmetrical gallery, or left architectural arch + right 2-column editorial copy).
   - Offset adjacent items vertically to create visual pacing and natural eye movement.
3. **Architectural Anchoring**:
   - Anchor elements with fine hairline dividers (`1px` with low opacity `border-[#DCCBBB]`).
   - Use subtle structural vertical guides or subtle curved watermark paths (`opacity-10`) rather than solid heavy containers.

### B. Typographic System & Hierarchy
1. **Editorial Display Headline**:
   - Primary Heading: `Montserrat` (Weight 300 / Light), wide tracking (`3.5px` to `4px`), uppercase.
   - Initial Script Flourish: `Alex Brush` cursive flourish on signature leading letters (scale $1.35\times - 1.45\times$).
2. **Editorial Serif Accent**:
   - Sub-titles & Card Titles: `Playfair Display` (Italic or Regular), natural casing, tight tracking.
3. **Structured Body & Utility Text**:
   - Body Copy, Eyebrows & Navigation: `Plus Jakarta Sans` (Weight 400/500).
   - Eyebrows: Uppercase, `11px - 12px`, letter-spacing `3px - 3.5px`, muted dark brown tone (`#5c473b` / `#806B5C`).
   - Paragraphs: Single refined narrative block, `14px - 15px`, line-height $1.65 - 1.75$, max-width $580\text{px} - 620\text{px}$.

### C. Color Architecture
Strictly observe the Glamouré editorial palette:
- **Background Surfaces**:
  - Services: `#F4EEE7` / `#DED5CC` (Sandstone Cashmere)
  - Transformations/Moments: `#F1EAE2` / `#D3C4B8` (Latte Mocha)
  - Artists/Experience: `#EEE6DC` / `#C5B4A6` (Hazelnut Taupe)
  - Appointments/Booking: `#F3ECE7`
  - Testimonials/Reviews: `#F2ECE5`
- **Typographic Tones**:
  - Primary Headings & Bold Text: `#41332B` / `#241812` (Deep Velvet Espresso)
  - Secondary Copy & Subheaders: `#806B5C` / `#544237` (Warm Mocha)
  - Eyebrows & Meta: `#5c473b`
- **Accents & Hairlines**:
  - Accent / Badges: `#B99470` / `#EFC9A5` (Champagne Gold / Warm Caramel)
  - Fine Dividers: `#DCCBBB` / `#41332B` at $10\% - 15\%$ opacity

### D. Photography & Visual Presentation
1. **Sculpted Architectural Cropping**:
   - Use vaulted arches (`rounded-t-full`) for hero focal portraits.
   - Mix asymmetrical corner radii on editorial photo cards (e.g., standard `8px` with a single sculpted `25px` corner on select featured cards).
2. **Warm Tonal Grading**:
   - Photography must feature warm, golden, natural ambient salon lighting.
   - Avoid cold blue, overly saturated, or synthetic AI-looking textures.

---

## 3. Anti-Patterns to Strictly Reject
- ❌ **No Centered Generic SaaS Heroes**: Never place a centered headline with two identical pill buttons beneath it.
- ❌ **No Glassmorphism & Heavy Blurred Backdrops**: Avoid excessive `backdrop-blur-xl` panels that look like modern tech apps.
- ❌ **No Rainbow or High-Saturation Gradients**: Gradients must be strictly tonal shifts between neighboring shades of the same warm brown/cream scale.
- ❌ **No Generic Stock Cards**: Every image container must feel curated, framed, and art-directed.

---

## 4. Supporting Resources
- [Typography Hierarchy Reference](./references/typography-hierarchy.md)
- [Editorial Section Layout Example](./examples/editorial-layout-example.tsx)
