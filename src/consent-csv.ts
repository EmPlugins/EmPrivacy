// SPDX-License-Identifier: MIT

import type { ConsentRecordPayload } from "./config.js";

const FORMULA_PREFIX = /^[\t\r ]*[=+\-@]/;

/** Quote a cell and neutralize spreadsheet formula injection. */
export function csvCell(value: string): string {
	let s = value.replace(/\r\n|\n|\r/g, " ");
	if (FORMULA_PREFIX.test(s)) s = `'${s}`;
	return `"${s.replace(/"/g, '""')}"`;
}

function boolCell(value: unknown): string {
	return value === true ? "true" : value === false ? "false" : "";
}

export function buildConsentCsv(rows: readonly ConsentRecordPayload[]): string {
	const header = ["createdAt", "policyVersion", "functional", "analytics", "marketing", "gpc"];
	const lines = [header.map(csvCell).join(",")];
	for (const row of rows) {
		lines.push(
			[
				csvCell(typeof row.createdAt === "string" ? row.createdAt : ""),
				csvCell(typeof row.policyVersion === "string" ? row.policyVersion : ""),
				csvCell(boolCell(row.functional)),
				csvCell(boolCell(row.analytics)),
				csvCell(boolCell(row.marketing)),
				csvCell(row.gpc === true ? "true" : ""),
			].join(","),
		);
	}
	return `\uFEFF${lines.join("\r\n")}\r\n`;
}
