---
name: accessibility-and-wcag
description: Web Content Accessibility Guidelines (WCAG 2.2 AA) compliance, accessible contrast ratios, keyboard navigation, focus trap management, ARIA semantics, and assistive technology support.
---

# Accessibility and WCAG 2.2 AA Skill

## Purpose
Guarantees full WCAG 2.2 Level AA conformance across Glamouré. Ensures every user, regardless of ability or assistive device, experiences flawless interaction.

## Core Directives

### 1. Contrast Ratios & Color Independence
- **Normal Text**: Minimum 4.5:1 contrast against background surface.
- **Large Text (>= 18pt or 14pt bold)**: Minimum 3.0:1 contrast.
- **UI Components & Graphical Objects**: Minimum 3.0:1 against adjacent background (e.g., input borders, active tab indicators).
- **Never rely on color alone**: Every status indicator (e.g. `confirmed`, `cancelled`, `pending`) must include text or an icon in addition to color.

### 2. Keyboard Navigation & Focus Management
- Every interactive element (`<button>`, `<a>`, `<input>`, `<select>`, `<dialog>`) must be reachable via `Tab` key.
- NEVER set `outline: none` without providing an explicit `:focus-visible` ring (e.g. `focus-visible:ring-2 focus-visible:ring-[#B99470] focus-visible:ring-offset-2`).
- Modals and drawers must trap focus while open and return focus to the trigger element upon closing with `Escape`.

### 3. Touch Target Sizing (Mobile Accessibility)
- Minimum target size of 44x44 CSS pixels for all touch targets (`min-h-[44px] min-w-[44px]`).
- Adequate spacing (minimum 8px) between adjacent touch targets to prevent accidental taps.

### 4. Semantic HTML & ARIA Attributes
- Use native HTML elements (`<button>`, `<dialog>`, `<nav>`, `<main>`, `<header>`) over generic `<div>` with `onClick`.
- Icon-only buttons MUST have `aria-label` (e.g., `<button aria-label="Close modal"><X /></button>`).
- Live regions (`aria-live="polite"`) for toast notifications and real-time queue position updates.
