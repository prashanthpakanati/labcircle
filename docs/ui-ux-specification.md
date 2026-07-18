# UI/UX Specification: LabCircle

## 1. Design Philosophy
LabCircle should feel clinical, clean, and highly intuitive. The visual interface focuses on clarity, reducing cognitive load during medical data entry, and providing easy accessibility options for patient consumers.

## 2. Color System
We use custom HSL palettes instead of generic raw colors to maintain a premium visual layout.
- **Brand Primary:** `#0066cc` (Deep Sea Blue) -> HSL `(210, 100%, 40%)`
- **Secondary / Actions:** `#00a884` (Teal Green) -> HSL `(167, 100%, 33%)`
- **Error / Out of Range:** `#e02424` (Crimson Red) -> HSL `(0, 75%, 51%)`
- **Surface Dark Mode:** `#0f172a` (Slate Black) -> HSL `(222, 47%, 11%)`
- **Surface Light Mode:** `#f8fafc` (Soft White) -> HSL `(210, 40%, 98%)`

## 3. Typography
- **Primary Font:** `Outfit`, Sans-Serif (from Google Fonts)
- **Technical/Report Font:** `Inter`, Sans-Serif (from Google Fonts) for readability of values and numbers.
- **Scale:**
  - `h1`: 2rem / 32px (Bold)
  - `h2`: 1.5rem / 24px (Semi-Bold)
  - `body-large`: 1rem / 16px (Regular)
  - `body-small`: 0.875rem / 14px (Regular)

## 4. Key Design Patterns
- **Glassmorphism Panels:** Dashboard widgets use `backdrop-filter: blur(12px) saturate(180%)` with a semi-transparent border on dark/light background variants.
- **Micro-Animations:**
  - Button state transitions: `transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`.
  - Alert badges pulse gently on Critical Low/High medical results.

## 5. Layout Adaptability (Responsive)
- Mobile First: Stacked list components for order pipelines.
- Desktop Panel: Multicolumn grid highlighting queues, diagnostic results, and patient profiles simultaneously.
