---
name: frontend-design
description: Production-grade frontend interface design, anti-AI-slop design principles, typography hierarchy, intentional spacing, and distinctive luxury aesthetics.
---

# Frontend Design Skill (Anti-AI-Slop & Editorial Aesthetics)

## Purpose
Enforces distinct, high-end frontend craftsmanship. Explicitly bans generic AI-generated design defaults, cookie-cutter cards, meaningless floating blobs, and purple-blue gradient clichés in favor of grounded, intentional, luxury product aesthetics.

## Core Directives

### 1. The Anti-AI-Slop Ban List
NEVER use:
- Generic purple-to-blue linear gradients on buttons or hero backgrounds.
- Meaningless decorative glassmorphic blur blobs floating behind clean text.
- Glowing border animations or neon drop shadows without semantic purpose.
- Three identical cards crammed onto every screen regardless of content.
- Cards nested inside cards nested inside cards.
- Huge icons centered above every small heading.
- Random emojis as interface icons.
- Tiny, unreadable gray text (`#9ca3af` on `#1f2937`) failing WCAG contrast.
- Vague, generic marketing titles inside functional dashboards ("Unlock Potential", "Welcome Back, Superstar").

### 2. Subject-Grounded Aesthetic Blueprint
For Glamouré (Luxury Salon Management & Client Sanctuaries):
- **Tone**: Understated luxury, editorial restraint, architectural calm, modern precision SaaS.
- **Palette**: Warm Espresso (`#41332B`), Warm Latte (`#E8D8C7`), Ivory (`#F5EFE7`), Champagne (`#B99470`), Muted Mocha (`#806B5C`).
- **Surfaces**: Crisp borders (`rgba(65,51,43,0.08)` on light mode, `rgba(232,216,199,0.12)` on dark mode), matte paper-like card surfaces with subtle single-pixel borders rather than muddy heavy shadows.
- **Typography Rhythm**: Distinct display serif/refined sans for high-level headings (`Montserrat` / `General Sans`), utility sans with generous x-height (`Plus Jakarta Sans`) for tabular data, forms, and dense dashboard elements.

### 3. Deliberate Layout & Whitespace
- Avoid crowding: minimum `p-6` or `p-8` for major containers; strict 8px/12px/16px/24px/32px/48px spacing scale.
- Hierarchy through scale, weight, and tone — not decoration.
- Every button must communicate clear affordance (default, hover, active, focus-visible).
