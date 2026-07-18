# LabCircle Design System Specification

This document details the core design decisions, tokens, and components for the **LabCircle** preventive healthcare platform. All UI implementations must adhere strictly to these guidelines.

---

## 1. Brand Identity & Visual Personality

LabCircle represents premium preventive healthcare. The visual interface prioritizes clarity, minimal visual noise, and high information accessibility.
*   **Aesthetics:** White + Charcoal foundation with Premium Gold accents. No large yellow or gold backgrounds. Clean white cards with soft shadows are preferred over decorative borders.
*   **Accessibility Level:** Target compliance with WCAG 2.1 AA (minimum contrast ratios > 4.5:1 for text, clear focus rings, and explicit semantic structure).

---

## 2. Design Tokens

### 2.1 CSS Variables (`globals.css`)
CSS custom properties define theme configurations and support dark/light toggles:

```css
:root {
  /* Brand Foundations */
  --primary: 47.9% 95.8% 35.3%;      /* Premium Gold (#EAB308) */
  --foreground: 224% 71.4% 4.1%;     /* Charcoal (#111827) */
  --background: 0% 0% 100%;          /* White (#FFFFFF) */
  --surface: 210% 40% 98%;           /* Light Muted Gray (#F8FAFC) */
  --border: 220% 13% 91%;            /* Light Gray Border (#E5E7EB) */

  /* Status Colors */
  --success: 142% 76.2% 36.3%;       /* Green (#22C55E) */
  --warning: 37.9% 92.1% 50%;        /* Orange/Amber (#F59E0B) */
  --error: 0% 84.2% 60.2%;           /* Red (#EF4444) */
  --info: 217.2% 91.2% 59.8%;        /* Blue (#3B82F6) */

  /* Radius and Motion */
  --radius: 0.375rem;                /* Minimal clean roundness */
}
```

### 2.2 TypeScript Constants (`src/lib/constants/theme.ts`)
Programmatic hex color variables utilized in chart utilities and canvas rendering:
*   `BRAND_GOLD`: `#EAB308`
*   `CHARCOAL`: `#111827`
*   `BACKGROUND_WHITE`: `#FFFFFF`
*   `SUCCESS_GREEN`: `#22C55E`
*   `WARNING_AMBER`: `#F59E0B`
*   `ERROR_RED`: `#EF4444`

---

## 3. Typography Hierarchy

The platform uses the **Inter** font as its primary typeface to maximize legibility.

| Name | Font Size | Line Height | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | 2.5rem / 40px | 1.2 | Extra Bold | Major banners, landing stats |
| **Heading 1** | 2rem / 32px | 1.25 | Bold | Primary page titles |
| **Heading 2** | 1.5rem / 24px | 1.3 | Semi-Bold | Section headers, modal titles |
| **Heading 3** | 1.25rem / 20px | 1.35 | Medium | Card titles, secondary divisions |
| **Body** | 1rem / 16px | 1.5 | Regular | Paragraphs, results input |
| **Small** | 0.875rem / 14px| 1.45 | Regular | Metadata, form labels, helpers |
| **Caption** | 0.75rem / 12px | 1.4 | Medium | Small badges, table headers |

---

## 4. Icon System (`lucide-react`)

Unified icon mappings are established using Lucide symbols:
*   **Diagnostics:** `FlaskConical` (lab activities, catalog configurations).
*   **Reports:** `FileText` (report compilation, pathologist signature approvals).
*   **Home Collection:** `MapPin` (phlebotomist geo-tracking, home addresses).
*   **Membership:** `Award` (family plans, discount tiers).
*   **Doctors:** `Stethoscope` (consultation portals, digital prescriptions).
*   **Family:** `Users` (sub-profiles, dependent directories).
*   **Payments:** `CreditCard` (pricing, payment checkouts).
*   **Notifications:** `Bell` (report notifications, log registries).
*   **Wallet:** `Wallet` (payment refunds, cash balances).
*   **Settings:** `Settings` (security settings, panel configs).

---

## 5. Form Design Standards

All inputs must adhere to these unified styling rules to ensure accuracy in medical telemetry data entry:

1.  **Labels & Mandatory Fields:** Labels are block elements sitting above inputs. Required fields display a red asterisk (`*`) styled with `text-red-500`.
2.  **Helper Text:** Rendered in `text-xs text-slate-500` immediately below the label or input field to describe constraints (e.g. "Enter values in mg/dL").
3.  **Validation & Error State:** An invalid field highlights the border with `border-red-500` and displays a red helper message leading with an error icon.
4.  **Success State:** Highlights validated fields with `border-green-500` and displays a confirmation checkmark.
5.  **Disabled State:** Gray background (`bg-slate-100`), lower opacity (`opacity-60`), and cursor lock (`cursor-not-allowed`) prevent editing.
6.  **Read-Only State:** Displayed flat (without default border overlays) but remains focusable for copying.

---

## 6. Layout Primitives

We construct the responsive grid layout using unified wrappers:
*   **Container:** Standardizes horizontal padding and max-widths across devices.
*   **Page & Section:** Grid and padding templates for managing headers and layout divisions.
*   **Stack & Grid:** Typings-based layout primitives mapping to flex column gaps and dynamic CSS grids.
*   **Sidebar & Top Navigation:** Clean navigation panels for dashboard operations.
*   **Dashboard Shell:** Integrates the sidebar, top navigation, and content grid.

---

## 7. Healthcare Display Components

Specific display widgets are built to standardize clinical data representation:
*   **Metric Card:** Highlights a clinical parameter (e.g. Hemoglobin), its numerical value, metric unit, reference range status, and indicators.
*   **Statistic Card:** Displays active workload counters (e.g. "Pending Sign-off: 12").
*   **Health Status Indicator:** A linear slider mapping a patient's numerical result against Low-Normal-High ranges to warn of critical telemetry.
*   **Timeline:** Tracks samples from collection to sign-off (`Collected` -> `In-Lab` -> `Signed`).
*   **Progress Stepper:** Outlines multistep registration or order checkout stages.
*   **Report Status Badge:** Displays signature validation and locks statuses.
