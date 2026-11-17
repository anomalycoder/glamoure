---
name: dashboard-and-data-design
description: Enterprise SaaS dashboard architecture, high-density data tables, operational KPI hierarchies, elimination of card bloat, actionable filters, and real-time state visualization.
---

# Dashboard and Data Design Skill

## Purpose
Directs the architecture and layout of business-critical dashboards (Salon Owner and Salon Member portals). Replaces sprawling, generic card grids with structured, scannable, and actionable enterprise SaaS workflows.

## Core Directives

### 1. Eliminating Card Bloat & Widget Clutter
- **Rule of Purpose**: Every dashboard element must serve an immediate operational purpose (e.g. "What appointments do I have today?", "Who is waiting in line right now?", "Which invoices are unpaid?").
- Avoid dividing related metrics into 8 separate floating cards. Group complementary metrics into cohesive executive summary strips.
- Prefer data tables with sorting, pagination, and inline status badges over giant vertically-stacked cards for long lists.

### 2. High-Density Scannable Tables
- Clear column headers with muted utility font (`font-['Montserrat'] uppercase text-xs tracking-wider`).
- Consistent row heights (`py-3.5` or `py-4`), alternating or subtle border dividers (`border-b border-black/[0.06]`).
- Right-aligned numerical amounts and currency values; left-aligned names, emails, and textual descriptions.
- Quick action menus (View, Reschedule, Check In, Cancel) accessible on hover or via a trailing action dropdown.

### 3. Meaningful Metric Hierarchy
- **Primary KPIs (Top Strip)**: 4 to 5 core metrics with clean delta badges:
  - Today's Revenue (`₹ 42,800` `+12.4% vs last week`)
  - Confirmed Appointments (`18 slots booked`)
  - Live Queue (`3 clients waiting`)
  - Active Artisans (`4 on duty`)
- **Secondary Views**:
  - Live timeline / schedule view with time blocks.
  - Actionable pending requests list (e.g. Leave requests needing owner approval).
