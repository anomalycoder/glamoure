# Luxury Motion Easing Curves & Manifest

## Easing Curves Reference

| Name | CSS Value | Framer Motion Array | Character & Usage |
|---|---|---|---|
| **Luxury Quintic Out** | `cubic-bezier(0.16, 1, 0.3, 1)` | `[0.16, 1, 0.3, 1]` | Primary editorial entrance for headings, cards, and image reveals. Zero bounce. |
| **Gentle Natural Decelerate** | `cubic-bezier(0.25, 0.1, 0.25, 1)` | `[0.25, 0.1, 0.25, 1]` | Modal overlays, drawer slide-ins. Soft, tactile deceleration. |
| **Micro Hover Accelerate** | `cubic-bezier(0.4, 0, 0.2, 1)` | `[0.4, 0, 0.2, 1]` | Fast button response, icon micro-movements ($200\text{ms}$). |
| **Smooth Drift** | `cubic-bezier(0.33, 1, 0.68, 1)` | `[0.33, 1, 0.68, 1]` | Parallax media offset, gentle background floating arcs. |

---

## Standard Choreography Timing

```text
Section Enters Viewport
├── 0ms: Section container fades in (opacity 0 -> 1, 600ms)
├── 80ms: Eyebrow text reveals (translateY 12px -> 0, opacity 0 -> 1, 600ms)
├── 160ms: Main headline reveals (translateY 18px -> 0, opacity 0 -> 1, 800ms)
├── 240ms: Subheader / body paragraph fades in (opacity 0 -> 1, 700ms)
└── 320ms: Editorial cards stagger in (60ms interval per card, scale 0.98 -> 1, opacity 0 -> 1)
```
