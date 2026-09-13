// lib/colors.ts
// Single source of truth for the CampusCompass design system.
// Mirrors the web app's Tailwind config (tailwind.config.ts).

export const Colors = {
  midnight: '#16213E',   // Primary headings, dark backgrounds, tab bar icons
  sage: '#3D7A6B',       // Primary CTA buttons, active states, accent
  amber: '#E09C2D',      // AI badge, highlights
  parchment: '#F5F3EE',  // Screen backgrounds (light cream)
  steel: '#64748B',      // Body text, secondary labels, placeholders
  white: '#FFFFFF',      // Card backgrounds, inputs
  border: '#E2E8F0',     // slate-200 equivalent — input borders, dividers
  errorRed: '#DC2626',   // Error text
  errorBg: '#FEF2F2',    // Error background
  errorBorder: '#FECACA',// Error border
};

export type ColorKey = keyof typeof Colors;
