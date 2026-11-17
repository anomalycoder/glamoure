---
name: motion-design-interactions
description: >-
  Provides performance-optimized motion design principles, Framer Motion / GSAP animation rules,
  luxury scroll-triggered image reveals, choreographed micro-interactions, and accessibility standards.
  Use when implementing or reviewing animations, transitions, hovers, scroll effects, or interactive states.
---

# Motion Design & Micro-interactions Skill

## 1. Overview & Philosophy
In luxury editorial web design, motion is an accent of elegance, never a distraction. Animations must feel **silky, organic, and grounded in physical weight**, reminiscent of turning the heavy parchment pages of a couture lookbook.

Strictly avoid bouncy, playful, elastic, or game-like animations. Prioritize smooth cubic-bezier fades, subtle vertical drifts, and hardware-accelerated image reveal masks.

---

## 2. Core Motion Rules & Standards

### A. Easing & Timing Standards
1. **The Luxury Ease Curve**:
   - Primary Ease: `cubic-bezier(0.16, 1, 0.3, 1)` (Out-Expo / Quintic ease).
   - Smooth entrance, gentle deceleration, zero bounce.
2. **Standard Duration Scale**:
   - Micro-interactions (Button hovers, icon shifts): $200\text{ms} - 300\text{ms}$.
   - Container State Transitions (Modals, drawers): $400\text{ms} - 500\text{ms}$.
   - Editorial Image Scale / Reveals: $700\text{ms} - 900\text{ms}$ (`ease-out`).
   - Stagger Delays: $60\text{ms} - 100\text{ms}$ between sequential cards or list items.

### B. Hardware Acceleration & Performance
Only animate **composited properties**:
- ✅ `transform: translateY()`, `translateX()`, `scale()`
- ✅ `opacity`
- ❌ **Never animate**: `width`, `height`, `top`, `left`, `margin`, or `padding` during scroll or runtime interactions (which cause expensive layout reflows / jank).
- Always apply `will-change: transform, opacity` only when active, or rely on GPU-accelerated Tailwind transitions (`transition-transform duration-700 ease-out`).

### C. Editorial Masked Image Reveal
For fashion and salon photography:
- Combine an initial container clip-path or scale ($1.06\times \to 1.0\times$) with an opacity fade ($0 \to 1$) over $800\text{ms}$.
- Parallax effects must remain subtle (max $15\text{px} - 25\text{px}$ vertical delta) to prevent scroll sickness.

---

## 3. Accessibility & `prefers-reduced-motion`
Always provide a graceful zero-motion fallback:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
In Framer Motion:
```tsx
import { useReducedMotion } from 'framer-motion';
const shouldReduceMotion = useReducedMotion();
const transition = shouldReduceMotion ? { duration: 0 } : { duration: 0.8, ease: [0.16, 1, 0.3, 1] };
```

---

## 4. Supporting Resources
- [Easing Curves & Duration Manifest](./references/easing-curves-manifest.md)
- [Framer Motion Reveal Card Example](./examples/motion-reveal-card.tsx)
