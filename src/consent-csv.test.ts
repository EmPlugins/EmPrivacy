// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vitest";

import { buildConsentCsv, csvCell } from "./consent-csv.js";

describe("consent csv", () => {
	it("prefixes formula characters so a spreadsheet treats the cell as text", () => {
		expect(csvCell("=1+1")).toBe(`"'=1+1"`);
		expect(csvCell("+1")).toBe(`"'+1"`);
		expect(csvCell("-1")).toBe(`"'-1"`);
		expect(csvCell("@cmd")).toBe(`"'@cmd"`);
		expect(csvCell('say "hi"')).toBe(`"say ""hi"""`);
	});

	it("exports category flags and a GPC column without inventing a signal", () => {
		const csv = buildConsentCsv([
			{
				createdAt: "2026-09-28T12:00:00.000Z",
				policyVersion: "2026-09",
				functional: false,
				analytics: true,
				marketing: false,
				gpc: true,
			},
			{
				createdAt: "2026-09-27T12:00:00.000Z",
				policyVersion: "=HYPERLINK(\"https://evil.example\")",
				functional: true,
				analytics: false,
				marketing: true,
			},
		]);
		expect(csv.startsWith("\uFEFF")).toBe(true);
		expect(csv).toContain("gpc");
		expect(csv).toContain('"true"');
		expect(csv).toContain(`"'=HYPERLINK(""https://evil.example"")"`);
		expect(csv).not.toContain("192.168");
	});
});
