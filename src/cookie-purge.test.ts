// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vitest";

import { cookiesToExpire } from "./cookie-purge.js";

describe("cookiesToExpire", () => {
	it("expires known analytics and marketing names when those categories are off", () => {
		const header = "_ga=1; _ga_ABC=2; _gid=3; _clck=4; _uetsid=5; emprivacy_cc=keep; session=keep";
		expect(cookiesToExpire(header, { analytics: true, marketing: true }).sort()).toEqual(
			["_clck", "_ga", "_ga_ABC", "_gid", "_uetsid"].sort(),
		);
	});

	it("leaves analytics cookies when only marketing is denied", () => {
		expect(cookiesToExpire("_ga=1; _uetsid=5", { analytics: false, marketing: true })).toEqual(["_uetsid"]);
	});

	it("ignores the consent cookie and names outside the fixed list", () => {
		expect(
			cookiesToExpire("emprivacy_cc=1; session=1; =cmd; @evil=1", {
				analytics: true,
				marketing: true,
			}),
		).toEqual([]);
	});
});
