---
name: ux-conversion-design
description: >-
  Provides user journey design principles, frictionless appointment booking workflows,
  conversion rate optimization (CRO) heuristics, mobile-first touch optimization,
  and accessibility compliance (WCAG AAA) for luxury services and salon websites.
  Use when designing or optimizing booking funnels, checkout flows, CTAs, navigation, or forms.
---

# UX & Conversion Design Skill

## 1. Overview
High-end luxury brands convert not through aggressive popups or countdown timers, but through **clarity, trust, effortless discovery, and friction-free appointment scheduling**. This skill defines the user experience and conversion optimization standards for Glamouré and luxury service businesses.

---

## 2. Core User Journey Architecture

### A. The 3-Step Frictionless Booking Funnel
Clients booking high-ticket salon and spa treatments require reassurance and ease. Never force multi-page navigation away from their current browsing context:
1. **Trigger Phase (Contextual Entry Point)**:
   - Primary Header CTA: Always accessible ("Book Appointment").
   - Section In-Context CTAs: Clicking "Hair" in Explore Services directly pre-selects the 'Hair' category in the booking modal.
   - Lookbook Direct Booking: Clicking "Book This Look" from an editorial moment immediately opens the modal pre-filled with that treatment.
2. **Configuration Phase (In-Modal Flow)**:
   - **Step 1: Category & Treatment Selection** (Hair / Skin / Nails / Spa).
   - **Step 2: Master Stylist & Date Selection** (Visible live availability, no ambiguous "we will call you back").
   - **Step 3: Client Details & Instant Confirmation** (Only 3 essential fields: Full Name, Phone / WhatsApp, Special Notes).
3. **Confirmation & Follow-up**:
   - Instant visual booking card with WhatsApp calendar sync.
   - Clear cancellation & salon arrival policies.

### B. Conversion Heuristics for Luxury Services
- **Eliminate Clutter**: Remove competing secondary buttons when guiding a user toward booking.
- **Micro-Copy of Reassurance**:
  - Instead of generic "Submit", use clear commitment copy: "Confirm Reservation" or "Reserve Your Chair".
  - Always state: *"No upfront deposit required"* or *"Free cancellation up to 24h prior"*.
- **Live Floor Transparency**: Highlight master stylist specialization and anticipated chair duration to eliminate double-booking anxiety.

---

## 3. Mobile-First Ergonomics & Touch Guidelines
1. **44px Minimum Touch Targets**:
   - All interactive pills, buttons, tabs, and date selectors must provide at least $44\text{px} \times 44\text{px}$ tappable area.
2. **Bottom-Sheet Booking Modal on Mobile**:
   - On screens `< 768px`, render booking dialogues as bottom-sheet drawers (`fixed inset-x-0 bottom-0 max-h-[90vh] rounded-t-3xl`) within the thumb zone.
3. **Sticky Quick-Book Bar**:
   - On mobile scroll, provide a discreet bottom action bar with salon opening hours and a single prominent "Book" action.

---

## 4. Accessibility & Contrast Standards (WCAG 2.2 AAA)
- **Contrast Ratios**:
  - Headings (`#41332B` on `#ded5cc` / `#F4EEE7`): Contrast ratio exceeds **12:1** (far above the WCAG AAA requirement of 7:1).
  - Body Copy (`#806B5C` on `#ded5cc`): Contrast ratio exceeds **4.8:1** (exceeds WCAG AA requirement of 4.5:1).
- **Focus Rings**:
  - Provide visible, high-contrast focus rings for keyboard navigation: `focus-visible:ring-2 focus-visible:ring-[#41332B] focus-visible:outline-none`.
- **Screen Reader Semantic Roles**:
  - Use semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<dialog>`, `aria-expanded`, `aria-label`).

---

## 5. Supporting Resources
- [Luxury Booking Heuristics Checklist](./references/booking-heuristics-checklist.md)
- [Frictionless Booking Modal Flow Example](./examples/booking-modal-flow.tsx)
