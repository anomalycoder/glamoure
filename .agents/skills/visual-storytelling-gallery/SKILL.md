---
name: visual-storytelling-gallery
description: >-
  Guides the design and implementation of luxury editorial image galleries,
  before-and-after interactive transformation comparisons, asymmetrical masonry arrangements,
  sculpted corner crops, and visual narrative pacing for beauty, salon, and fashion portfolios.
  Use when designing or auditing galleries, moments, transformations, or portfolio showcases.
---

# Visual Storytelling & Gallery Design Skill

## 1. Overview
In luxury beauty and salon art direction, photography is the primary proof of craft. This skill standardizes the presentation of client transformations, editorial moments, and artistic styling into cohesive, magazine-quality visual narratives.

---

## 2. Core Gallery Archetypes

### A. The 2-Row Asymmetric Editorial Grid (Moments / Portfolio)
Instead of uniform symmetrical rows, use contrasting visual weights across two balanced rows:
- **Row 1 Layout (12 Columns)**:
  - Card 1: `col-span-3` (Regular height: $195\text{px}$, standard `8px` radius).
  - Card 2: `col-span-4` (**Featured Big**: $210\text{px}$, sculpted `8px 25px 8px 8px` corner with editorial pill tag).
  - Card 3: `col-span-2` (**Small accent**: $180\text{px}$, standard `8px` radius).
  - Card 4: `col-span-3` (Regular height: $195\text{px}$, sculpted `8px 8px 8px 25px` corner).
- **Row 2 Layout (12 Columns)**:
  - Card 5: `col-span-2` (**Small accent**: $180\text{px}$, sculpted `25px 8px 8px 8px` corner).
  - Card 6: `col-span-3` (Regular height: $195\text{px}$, standard `8px` radius).
  - Card 7: `col-span-3` (Regular height: $195\text{px}$, standard `8px` radius).
  - Card 8: `col-span-4` (**Featured Big**: $210\text{px}$, sculpted `8px 8px 25px 8px` corner with editorial pill tag).

### B. Numbering & Editorial Metadata
Every gallery item must feature discrete editorial metadata above the container:
- **Index Tag**: `01`, `02`, `03` in `Plus Jakarta Sans` $10\text{px} - 10.5\text{px}$, letter-spacing `1.5px`, dark espresso `#41332B`.
- **Category Tag**: Pill badge (e.g., `LUXURY HAIR STYLING EXPERIENCE`) in uppercase $7\text{px} - 8\text{px}$, tracking `0.14em`, champagne tone `#B99470`.

### C. Before-and-After Interactive Transformation Comparisons
For hair coloring, skin clarity, nail architecture, or spa renewal:
1. **Interactive Split-Screen Slider**: Horizontal touch/drag handle revealing the pristine 'Before' and radiant 'After' states.
2. **Synchronized Framing**: Ensure identical camera angle, framing, and focal distance between both shots.
3. **Discrete Pill Labels**: Floating understated badges (`BEFORE` / `AFTER`) in $10\text{px}$ uppercase with soft background blur.

---

## 3. Aspect Ratio & Crop Standards
- **Vaulted Portrait Arch**: $3:5.2$ or $3:5$ aspect ratio (e.g., $300\text{px} \times 520\text{px}$ with `rounded-t-full`).
- **Editorial Card Portrait**: $3:4$ aspect ratio for detailed facial therapy and chignon updos.
- **Landscape Strip**: $16:9$ or $2:1$ for panoramic salon interior and Japanese head spa suites.
- **Square Detail**: $1:1$ for precision nail architecture and apparatus manicures.

---

## 4. Hover & Interaction Guidelines
- **Subtle Zoom**: Scale $1.04\times - 1.05\times$ with smooth $700\text{ms}$ cubic-bezier easing (`ease-out`). Never use rapid, jumpy scales.
- **Circular Floating Indicator**: Small $28\text{px} - 32\text{px}$ white glass circle with an `ArrowUpRight` icon fading in on hover.
- **Lightbox Overlay**: Modal backdrop in high-opacity dark espresso blur (`bg-black/75 backdrop-blur-md`).

---

## 5. Supporting Resources
- [Gallery Aspect Ratios & Specs](./references/gallery-aspect-ratios.md)
- [Interactive Before/After Slider Example](./examples/before-after-slider.tsx)
