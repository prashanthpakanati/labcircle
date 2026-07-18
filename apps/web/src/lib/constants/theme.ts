/**
 * LabCircle Programmatic Design System Theme Constants
 * Useful for Canvas rendering, Chart overrides, and static templates.
 */

export const BRAND_COLORS = {
  accent: {
    gold: "#EAB308", // Primary Accent (Premium Gold)
  },
  neutral: {
    charcoal: "#111827", // Text & Primary Navigation
    background: "#FFFFFF", // Page background
    surface: "#F8FAFC", // Secondary surface panels
    border: "#E5E7EB", // Dividers and frames
  },
  status: {
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },
} as const;

export const ANIMATION_TRANSITIONS = {
  duration: {
    fast: "150ms",
    normal: "200ms",
    slow: "250ms",
  },
  easing: {
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    exit: "cubic-bezier(0.4, 0, 1, 1)",
    enter: "cubic-bezier(0, 0, 0.2, 1)",
  },
} as const;

export const TYPOGRAPHY_SCALE = {
  display: "text-[40px] leading-[1.2] font-extrabold tracking-tight",
  h1: "text-[32px] leading-[1.25] font-bold tracking-tight",
  h2: "text-[24px] leading-[1.3] font-semibold tracking-tight",
  h3: "text-[20px] leading-[1.35] font-medium tracking-tight",
  body: "text-[16px] leading-[1.5] font-normal",
  small: "text-[14px] leading-[1.45] font-normal",
  caption: "text-[12px] leading-[1.4] font-medium uppercase tracking-wider",
} as const;
