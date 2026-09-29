import { FailFastPostgresDialect } from "../database/pg-migration-lock.mjs";
import { Pool } from "pg";

//#region src/db/postgres.ts
const URL_PATTERN = /[A-Za-z][A-Za-z0-9+.-]*:\/\/\S+/g;
const CREDENTIAL_PATTERN = /\b(auth|credential|key|password|secret|signature|token)\s*[=:]\s*\S+/gi;
const ERROR_CODE_PATTERN = /^[A-Za-z0-9_-]{1,32}$/;
function redactPoolErrorMessage(message) {
	return message.replace(URL_PATTERN, "[REDACTED_URL]").replace(CREDENTIAL_PATTERN, "$1=[REDACTED]").replaceAll(/[\r\n\t]/g, " ").slice(0, 1e3);
}
function logPoolError(error) {
	const code = "code" in error && typeof error.code === "string" ? error.code : void 0;
	const safeCode = code && ERROR_CODE_PATTERN.test(code) ? ` (${code})` : "";
	const message = redactPoolErrorMessage(error.message) || "Unknown error";
	console.error(`[emdash] PostgreSQL idle client error${safeCode}: ${message}`);
}
/**
* Create a PostgreSQL dialect from config
*/
function createDialect(config) {
	const pool = new Pool({
		connectionString: config.connectionString,
		host: config.host,
		port: config.port,
		database: config.database,
		user: config.user,
		password: config.password,
		ssl: config.ssl,
		min: config.pool?.min ?? 0,
		max: config.pool?.max ?? 10,
		connectionTimeoutMillis: config.pool?.connectionTimeoutMillis,
		idleTimeoutMillis: config.pool?.idleTimeoutMillis
	});
	pool.on("error", logPoolError);
	return new FailFastPostgresDialect({ pool });
}

//#endregion
export { createDialect };
//# sourceMappingURL=postgres.mjs.map