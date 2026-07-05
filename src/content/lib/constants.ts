export const WIDGET_HOST_ID = "ai-shopping-copilot-root";

export const STORAGE_KEYS = {
  theme: "acp:theme",
  collapsed: "acp:collapsed",
  position: "acp:position",
} as const;

export type ThemePreference = "light" | "dark" | "system";

export interface WidgetPosition {
  /** Distance from the right edge of the viewport, in px. */
  right: number;
  /** Distance from the top edge of the viewport, in px. */
  top: number;
}

export const DEFAULT_POSITION: WidgetPosition = { right: 24, top: 96 };
