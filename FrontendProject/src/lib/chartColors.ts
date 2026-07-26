import type { Theme } from "@/theme/ThemeContext";

/**
 * Fixed-order categorical palette for charts (8 slots, blue→red). Colorblind-
 * safe adjacent-pair separation validated for both surfaces — see the
 * `dataviz` skill's reference palette. Assign by position, in a chart's own
 * natural category order; never reshuffle when a filter changes the count.
 */
const CATEGORICAL_PALETTE: { light: string; dark: string }[] = [
  { light: "#2a78d6", dark: "#3987e5" }, // blue
  { light: "#eb6834", dark: "#d95926" }, // orange
  { light: "#1baf7a", dark: "#199e70" }, // aqua
  { light: "#eda100", dark: "#c98500" }, // yellow
  { light: "#e87ba4", dark: "#d55181" }, // magenta
  { light: "#008300", dark: "#008300" }, // green
  { light: "#4a3aa7", dark: "#9085e9" }, // violet
  { light: "#e34948", dark: "#e66767" }, // red
];

export function categoricalColor(index: number, theme: Theme): string {
  const slot = CATEGORICAL_PALETTE[index % CATEGORICAL_PALETTE.length];
  return theme === "dark" ? slot.dark : slot.light;
}
