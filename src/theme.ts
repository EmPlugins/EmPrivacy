// SPDX-License-Identifier: MIT

/** Hex colors only — rejects CSS injection via theme fields. */
const HEX = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

export interface EmprivacyTheme {
	bg: string;
	text: string;
	accent: string;
	radiusPx: number;
}

/** Fixed banner palettes. Colors are constants, never taken from the admin form. */
export const THEME_PROFILES = {
	slate: { bg: "#0f172a", text: "#f8fafc", accent: "#3b82f6", radiusPx: 8 },
	paper: { bg: "#f7f6f3", text: "#37352f", accent: "#1d4ed8", radiusPx: 6 },
	ink: { bg: "#000000", text: "#ededed", accent: "#0070f3", radiusPx: 8 },
	indigo: { bg: "#ffffff", text: "#0f172a", accent: "#4f46e5", radiusPx: 12 },
	primer: { bg: "#f6f8fa", text: "#1f2328", accent: "#0969da", radiusPx: 6 },
} as const satisfies Record<string, EmprivacyTheme>;

export type ThemeProfileId = keyof typeof THEME_PROFILES;
export type ThemeChoice = ThemeProfileId | "custom";

export const THEME_PROFILE_IDS: readonly ThemeProfileId[] = ["slate", "paper", "ink", "indigo", "primer"];

/** First profile. New installs and configs with no theme choice use this. */
export const DEFAULT_THEME_PROFILE: ThemeProfileId = THEME_PROFILE_IDS[0];

export const DEFAULT_THEME: EmprivacyTheme = {
	bg: THEME_PROFILES[DEFAULT_THEME_PROFILE].bg,
	text: THEME_PROFILES[DEFAULT_THEME_PROFILE].text,
	accent: THEME_PROFILES[DEFAULT_THEME_PROFILE].accent,
	radiusPx: THEME_PROFILES[DEFAULT_THEME_PROFILE].radiusPx,
};

export function isThemeProfileId(value: string): value is ThemeProfileId {
	return (THEME_PROFILE_IDS as readonly string[]).includes(value);
}

/** Stored JSON: a missing or unknown choice uses the first profile. Explicit `custom` is kept. */
export function normalizeThemeChoice(value: unknown): ThemeChoice {
	if (value === "custom") return "custom";
	if (typeof value === "string" && isThemeProfileId(value)) return value;
	return DEFAULT_THEME_PROFILE;
}

/** Admin save: blank uses the first profile. `custom` is the manual option. */
export function parseThemeChoice(value: string): ThemeChoice {
	const t = value.trim().toLowerCase();
	if (!t) return DEFAULT_THEME_PROFILE;
	if (t === "custom") return "custom";
	if (isThemeProfileId(t)) return t;
	throw new Error("Banner theme must be Custom, Slate, Paper, Ink, Indigo, or Primer.");
}

export function themeForChoice(choice: ThemeChoice, custom: EmprivacyTheme): EmprivacyTheme {
	if (choice === "custom") return custom;
	const profile = THEME_PROFILES[choice];
	return { bg: profile.bg, text: profile.text, accent: profile.accent, radiusPx: profile.radiusPx };
}

export function isSafeHexColor(s: string): boolean {
	return HEX.test(s.trim());
}

export function normalizeHexColor(s: string, fallback: string): string {
	const t = s.trim();
	return isSafeHexColor(t) ? t : fallback;
}

export function normalizeRadiusPx(n: unknown, fallback: number): number {
	if (typeof n !== "number" || !Number.isFinite(n)) return fallback;
	return Math.min(24, Math.max(0, Math.round(n)));
}

export function parseRadiusInput(s: string, fallback: number): number {
	const t = s.trim();
	if (!t) return fallback;
	if (!/^\d{1,2}$/.test(t)) throw new Error("Corner radius must be a whole number from 0 to 24.");
	const n = Number(t);
	if (n > 24) throw new Error("Corner radius must be a whole number from 0 to 24.");
	return normalizeRadiusPx(n, fallback);
}
