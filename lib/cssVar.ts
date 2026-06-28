// Reads a CSS custom property's computed value (e.g. "--accent") at runtime.
// This is how the canvas stays in sync with your design tokens / --accent-h knob.
export function cssVar(name: string): string {
  if (typeof window === "undefined") return ""; // guard: no DOM during server render
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}