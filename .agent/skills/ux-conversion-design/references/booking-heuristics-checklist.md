# Luxury Salon Booking Heuristics Checklist

Use this 12-point audit checklist before launching or revising any booking, scheduling, or conversion touchpoint.

| # | Heuristic | Requirement | Verification Method |
|---|---|---|---|
| **01** | **Context Preservation** | Opening the booking modal never causes page reload or loss of scroll position. | Test modal trigger from all 5 sections. |
| **02** | **Pre-Selection Carryover** | Clicking "Book" on a Hair card pre-populates category='hair' in modal. | Inspect modal initial category state. |
| **03** | **Zero Field Bloat** | Only request Name, Mobile/WhatsApp, and Date/Time. No address or credit card fields upfront. | Count form inputs (must be $\le 4$). |
| **04** | **Touch Target Sizing** | All date/time pills, category tabs, and close buttons measure $\ge 44\text{px} \times 44\text{px}$. | Inspect bounding box dimensions on mobile viewport. |
| **05** | **Explicit Cancellation Policy** | State "No deposit required · Free reschedule anytime" directly beside the submit button. | Visual check below primary CTA. |
| **06** | **Live Feedback & Validation** | Validate phone number formatting inline; never clear form on failed validation. | Submit incomplete input and check error display. |
| **07** | **Visual Contrast (AAA)** | Primary button text (`#fbf7f2` on `#41332B`) contrast ratio $\ge 12:1$. | Run WCAG contrast analyzer. |
| **08** | **Keyboard Escape & Trapping** | Pressing `Esc` closes modal; Tab key remains trapped within modal while open. | Keyboard navigation test. |
| **09** | **Mobile Thumb-Zone Alignment** | Primary confirmation CTA sits in bottom $30\%$ of mobile screen. | Test on iPhone/Android mobile viewports. |
| **10** | **Instant Confirmation State** | Provide clear visual success confirmation with appointment summary and calendar export. | Complete test booking flow. |
| **11** | **Opening Hours Transparency** | Display current salon operational status (e.g., "Mon–Sat · 10:00 AM – 8:00 PM"). | Verify header/footer status badges. |
| **12** | **Stylist Transparency** | Show stylist portrait, name, and specialty so clients book individuals, not faceless slots. | Inspect stylist selection cards. |
