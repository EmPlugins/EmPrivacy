// SPDX-License-Identifier: MIT

const HOSTNAME = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;
const FATHOM_ID = /^[A-Za-z0-9]{4,32}$/;
const UMAMI_ID = /^[A-Za-z0-9-]{8,64}$/;
const GA4_ID = /^G-[A-Z0-9]{4,14}$/;
const GTM_ID = /^GTM-[A-Z0-9]{4,12}$/;

export function isHostname(s: string): boolean {
	const t = s.trim().toLowerCase();
	if (!t || t.length > 253) return false;
	if (t === "localhost" || t.endsWith(".localhost")) return false;
	return HOSTNAME.test(t);
}

export function isGa4Id(s: string): boolean {
	return GA4_ID.test(s.trim());
}

export function isGtmId(s: string): boolean {
	return GTM_ID.test(s.trim());
}

export function isFathomId(s: string): boolean {
	return FATHOM_ID.test(s.trim());
}

export function isUmamiId(s: string): boolean {
	return UMAMI_ID.test(s.trim());
}
