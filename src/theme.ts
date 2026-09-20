// SPDX-License-Identifier: MIT

/** Hex colors only — rejects CSS injection via theme fields. */
const HEX = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

export interface EmprivacyTheme {
	bg: string;
	text: string;
	accent: string;
	radiusPx: number;
}

export const DEFAULT_THEME: EmprivacyTheme = {
	bg: "#111111",
	text: "#eeeeee",
	accent: "#3b82f6",
	radiusPx: 6,
};

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
