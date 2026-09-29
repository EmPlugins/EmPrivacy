//#region src/portable-text-table.ts
const MAX_TABLE_SPAN = 100;
const MAX_TABLE_COLUMN_WIDTH = 4096;
const TABLE_CELL_MIN_WIDTH = 96;
const TABLE_COLUMN_WIDTH_STEP = 16;
const TABLE_RESIZE_HANDLE_WIDTH = 2;
const TABLE_RESIZE_TARGET_WIDTH = 24;
const MAX_TABLE_REPAIRED_SLOTS = 2e4;
const MAX_TABLE_PASTE_ROWS = 100;
const MAX_TABLE_PASTE_COLUMNS = 100;
const MAX_TABLE_PASTE_CELLS = 1e4;
const MAX_TABLE_PASTE_TEXT_BYTES = 1048576;
const MAX_TABLE_SOURCE_ENTRIES = MAX_TABLE_REPAIRED_SLOTS * 4;
var NormalizationFailure = class extends Error {
	constructor(reason) {
		super();
		this.reason = reason;
	}
};
const fail = (reason) => {
	throw new NormalizationFailure(reason);
};
const DECORATOR_MARKS = new Set("strong em underline strike-through subscript superscript code".split(" "));
const TABLE_FIELDS = new Set("_type _key rows hasHeaderRow markDefs".split(" "));
const ROW_FIELDS = new Set("_type _key cells".split(" "));
const CELL_FIELDS = new Set("_type _key content markDefs isHeader colspan rowspan colwidth textAlign".split(" "));
const DOM_FIELD = /^(?:aria-|data-|class(?:name)?$|id$|role$|style$|on(?:animation(?:end|iteration|start)|beforeinput|blur|change|click|contextmenu|copy|cut|drag|drop|error|focus|input|key(?:down|press|up)|load|mouse(?:down|move|up)|paste|pointer(?:down|move|up)|scroll|submit|touch(?:end|move|start)|transition(?:cancel|end|run|start)|wheel)$)/i;
var UnsafePortableTextTableError = class extends Error {
	code = "UNSAFE_PORTABLE_TEXT_TABLE";
	constructor(reason, raw, renderFallback) {
		super(`Unsafe Portable Text table: ${reason}`);
		this.reason = reason;
		this.raw = raw;
		this.renderFallback = renderFallback;
		this.name = "UnsafePortableTextTableError";
	}
};
function isPortableTextTableInput(value) {
	return isRecord(value) && value._type === "table";
}
function normalizePortableTextTable(value, context) {
	return catchFailure(value, context, () => normalizeTable(value, context));
}
function normalizeTable(value, context) {
	if (!isPortableTextTableInput(value) || value.rows !== void 0 && !Array.isArray(value.rows)) return fail("INVALID_TABLE");
	const rawRows = Array.isArray(value.rows) ? value.rows : [];
	let sourceCells = 0;
	let sourceEntries = rawRows.length + (Array.isArray(value.markDefs) ? value.markDefs.length : 0);
	for (const row of rawRows) {
		if (!isRecord(row) || !Array.isArray(row.cells)) continue;
		sourceCells += row.cells.length;
		sourceEntries += row.cells.length;
		for (const cell of row.cells) {
			if (!isRecord(cell)) continue;
			if (Array.isArray(cell.content)) sourceEntries += cell.content.length;
			if (Array.isArray(cell.markDefs)) sourceEntries += cell.markDefs.length;
		}
		if (sourceCells > MAX_TABLE_REPAIRED_SLOTS || sourceEntries > MAX_TABLE_SOURCE_ENTRIES) return fail("TABLE_TOO_LARGE");
	}
	if (sourceEntries > MAX_TABLE_SOURCE_ENTRIES) return fail("TABLE_TOO_LARGE");
	const seen = /* @__PURE__ */ new Set();
	const tableKey = reserveKey(readKey(value._key) ?? legacyKey(`${context.path}:table`), seen);
	const tableMarkDefs = normalizeMarkDefs(value.markDefs);
	const tableMarks = indexMarkDefs(tableMarkDefs);
	const firstContentRow = rawRows.findIndex((row) => isRecord(row) && Array.isArray(row.cells) && row.cells.length > 0);
	const firstCells = firstContentRow >= 0 && isRecord(rawRows[firstContentRow]) ? rawRows[firstContentRow].cells : void 0;
	const promoteHeader = value.hasHeaderRow === true && Array.isArray(firstCells) && !firstCells.some((cell) => isRecord(cell) && hasOwn(cell, "isHeader"));
	const sourceRows = rawRows.map((rawRow, rowIndex) => {
		const record = asRecord(rawRow);
		const rowKey = reserveKey(readKey(record._key) ?? legacyKey(`${tableKey}:row:${rowIndex}`), seen);
		const rawCells = Array.isArray(record.cells) ? record.cells : [];
		return {
			row: {
				...safeFields(record, ROW_FIELDS),
				_type: "tableRow",
				_key: rowKey
			},
			cells: rawCells.map((cell, cellIndex) => normalizeCell(cell, {
				path: `${rowKey}:cell:${cellIndex}`,
				remainingRows: rawRows.length - rowIndex,
				promoteHeader: promoteHeader && rowIndex === firstContentRow,
				seen,
				tableMarks
			}))
		};
	});
	if (!sourceRows.some((row) => row.cells.length > 0)) return {
		ok: true,
		table: tableFrom(value, tableKey, tableMarkDefs, [{
			_type: "tableRow",
			_key: reserveKey(legacyKey(`${tableKey}:repair-row:0`), seen),
			cells: [emptyCell(reserveKey(legacyKey(`${tableKey}:repair-cell:0:0`), seen))]
		}]),
		width: 1,
		height: 1
	};
	const height = sourceRows.length;
	const occupied = Array.from({ length: height }, () => /* @__PURE__ */ new Set());
	const placed = Array.from({ length: height }, () => []);
	let width = 0;
	for (let row = 0; row < height; row++) {
		let cursor = 0;
		for (const cell of sourceRows[row].cells) {
			const colspan = cell.colspan ?? 1;
			const rowspan = cell.rowspan ?? 1;
			while (!rectangleFree(occupied, row, cursor, rowspan, colspan)) assertGridBound(++cursor + colspan, height);
			assertGridBound(Math.max(width, cursor + colspan), height);
			occupy(occupied, row, cursor, rowspan, colspan);
			placed[row].push({
				cell,
				column: cursor
			});
			cursor += colspan;
			width = Math.max(width, cursor);
		}
	}
	const columnWidths = Array.from({ length: width });
	for (const row of placed) for (const { cell, column } of row) for (let offset = 0; offset < (cell.colspan ?? 1); offset++) {
		const candidate = cell.colwidth?.[offset];
		if (candidate && columnWidths[column + offset] === void 0) columnWidths[column + offset] = candidate;
	}
	const hasWidths = columnWidths.some((entry) => entry !== void 0);
	if (hasWidths) for (let column = 0; column < width; column++) columnWidths[column] ??= TABLE_CELL_MIN_WIDTH;
	const rows = sourceRows.map((source, rowIndex) => {
		const anchors = new Map(placed[rowIndex].map(({ cell, column }) => [column, cell]));
		const headers = source.cells.length > 0 && source.cells.every((cell) => cell.isHeader === true);
		const cells = [];
		for (let column = 0; column < width;) {
			const anchored = anchors.get(column);
			if (anchored) {
				const span = anchored.colspan ?? 1;
				cells.push(withWidths(anchored, column, span, columnWidths, hasWidths));
				column += span;
			} else if (occupied[rowIndex].has(column)) column++;
			else {
				const key = reserveKey(legacyKey(`${tableKey}:repair-cell:${rowIndex}:${column}`), seen);
				cells.push(withWidths(emptyCell(key, headers), column++, 1, columnWidths, hasWidths));
			}
		}
		return {
			...source.row,
			cells
		};
	});
	return {
		ok: true,
		table: tableFrom(value, tableKey, tableMarkDefs, rows, sourceRows[0].cells.length > 0 && rows[0].cells.every((cell) => cell.isHeader === true && (cell.rowspan ?? 1) === 1)),
		width,
		height
	};
}
function portableTextTableToProseMirror(value, context) {
	const normalized = normalizePortableTextTable(value, context);
	if (!normalized.ok) return normalized;
	const { table } = normalized;
	const resolveCellMarkDefs = createPortableTextTableCellMarkResolver(table);
	return {
		ok: true,
		width: normalized.width,
		height: normalized.height,
		node: {
			type: "table",
			attrs: pmAttrs(table, TABLE_FIELDS),
			content: table.rows.map((row) => ({
				type: "tableRow",
				attrs: pmAttrs(row, ROW_FIELDS),
				content: row.cells.map((cell) => ({
					type: cell.isHeader ? "tableHeader" : "tableCell",
					attrs: {
						colspan: cell.colspan ?? 1,
						rowspan: cell.rowspan ?? 1,
						colwidth: cell.colwidth ?? null,
						textAlign: cell.textAlign ?? null,
						...pmAttrs(cell, CELL_FIELDS)
					},
					content: [{
						type: "paragraph",
						content: context.spansToInline(cell.content, resolveCellMarkDefs(cell))
					}]
				}))
			}))
		}
	};
}
function proseMirrorTableToPortableText(value, context) {
	return catchFailure(value, context, () => {
		if (!isRecord(value) || value.type !== "table" || !Array.isArray(value.content)) return fail("INVALID_TABLE");
		let sourceCells = 0;
		let sourceEntries = value.content.length;
		for (const row of value.content) {
			if (!isRecord(row) || !Array.isArray(row.content)) continue;
			sourceCells += row.content.length;
			sourceEntries += row.content.length;
			for (const cell of row.content) {
				if (!isRecord(cell) || !Array.isArray(cell.content)) continue;
				sourceEntries += cell.content.length;
				for (const paragraph of cell.content) if (isRecord(paragraph) && Array.isArray(paragraph.content)) sourceEntries += paragraph.content.length;
			}
			if (sourceCells > MAX_TABLE_REPAIRED_SLOTS || sourceEntries > MAX_TABLE_SOURCE_ENTRIES) return fail("TABLE_TOO_LARGE");
		}
		const tableAttrs = asRecord(value.attrs);
		const rows = value.content.map((row) => {
			if (!isRecord(row) || row.type !== "tableRow" || !Array.isArray(row.content)) return fail("INVALID_TABLE");
			const attrs = asRecord(row.attrs);
			return {
				...safeFields(attrs.emdashData),
				_type: "tableRow",
				_key: readKey(attrs.emdashKey) ?? context.createKey(),
				cells: row.content.map((cell) => pmCell(cell, context))
			};
		});
		return normalizeTable({
			...safeFields(tableAttrs.emdashData),
			_type: "table",
			_key: readKey(tableAttrs.emdashKey) ?? context.createKey(),
			rows
		}, context);
	});
}
function pmCell(value, context) {
	if (!isRecord(value) || value.type !== "tableCell" && value.type !== "tableHeader" || !Array.isArray(value.content)) return fail("UNSUPPORTED_CELL_CONTENT");
	const attrs = asRecord(value.attrs);
	const content = [];
	const markDefs = [];
	for (let index = 0; index < value.content.length; index++) {
		const paragraph = value.content[index];
		if (!isRecord(paragraph) || paragraph.type !== "paragraph") return fail("UNSUPPORTED_CELL_CONTENT");
		const inline = Array.isArray(paragraph.content) ? paragraph.content : [];
		if (!inline.every((node) => isProseMirrorNode(node) && (node.type === "text" || node.type === "hardBreak"))) return fail("UNSUPPORTED_CELL_CONTENT");
		const converted = context.inlineToSpans(inline);
		if (index > 0) content.push({
			_type: "span",
			_key: context.createKey(),
			text: "\n"
		});
		content.push(...converted.content);
		markDefs.push(...converted.markDefs ?? []);
	}
	return {
		...safeFields(attrs.emdashData),
		_type: "tableCell",
		_key: readKey(attrs.emdashKey) ?? context.createKey(),
		content,
		...markDefs.length > 0 ? { markDefs } : {},
		isHeader: value.type === "tableHeader",
		colspan: attrs.colspan,
		rowspan: attrs.rowspan,
		colwidth: attrs.colwidth,
		textAlign: attrs.textAlign
	};
}
function getPortableTextTableCellMarkDefs(table, cell) {
	return getMarkDefs(table.markDefs ?? [], cell.markDefs ?? []);
}
function createPortableTextTableCellMarkResolver(table) {
	const shared = indexMarkDefs(table.markDefs ?? []);
	return (cell) => {
		const local = indexMarkDefs(cell.markDefs ?? []);
		const referenced = /* @__PURE__ */ new Map();
		for (const span of cell.content) for (const key of span.marks ?? []) {
			const definition = local.get(key) ?? shared.get(key);
			if (definition) referenced.set(key, definition);
		}
		return [...referenced.values()];
	};
}
function getPortableTextTableColumnWidths(table) {
	const occupied = Array.from({ length: table.rows.length }, () => /* @__PURE__ */ new Set());
	const widths = [];
	for (let row = 0; row < table.rows.length; row++) {
		let column = 0;
		for (const cell of table.rows[row].cells) {
			while (occupied[row].has(column)) column++;
			const colspan = cell.colspan ?? 1;
			for (let offset = 0; offset < colspan; offset++) {
				const value = cell.colwidth?.[offset];
				if (value && widths[column + offset] === void 0) widths[column + offset] = Math.max(TABLE_CELL_MIN_WIDTH, value);
			}
			occupy(occupied, row, column, cell.rowspan ?? 1, colspan);
			column += colspan;
		}
	}
	return widths.some(Boolean) ? widths.map((width) => width ?? TABLE_CELL_MIN_WIDTH) : void 0;
}
function normalizeCell(value, context) {
	if (typeof value !== "string" && !isRecord(value)) return fail("UNSUPPORTED_CELL_CONTENT");
	const record = asRecord(value);
	const key = reserveKey(readKey(record._key) ?? legacyKey(context.path), context.seen);
	const markDefs = normalizeMarkDefs(record.markDefs);
	const localMarks = indexMarkDefs(markDefs);
	const colspan = normalizeSpan(record.colspan);
	const rowspan = Math.min(normalizeSpan(record.rowspan), Math.max(1, context.remainingRows));
	const colwidth = normalizeColwidth(record.colwidth, colspan);
	const textAlign = normalizeAlignment(record.textAlign);
	const explicitHeader = hasOwn(record, "isHeader");
	const isHeader = context.promoteHeader || record.isHeader === true ? true : explicitHeader && record.isHeader === false ? false : void 0;
	const cell = {
		...safeFields(record, CELL_FIELDS),
		_type: "tableCell",
		_key: key,
		content: normalizeContent(value, record.content, key, (mark) => localMarks.get(mark) ?? context.tableMarks.get(mark))
	};
	if (markDefs.length > 0) cell.markDefs = markDefs;
	if (isHeader !== void 0) cell.isHeader = isHeader;
	if (colspan > 1) cell.colspan = colspan;
	if (rowspan > 1) cell.rowspan = rowspan;
	if (colwidth) cell.colwidth = colwidth;
	if (textAlign) cell.textAlign = textAlign;
	return cell;
}
function normalizeContent(rawCell, rawContent, cellKey, resolveMark) {
	const fallbackSpan = (text) => ({
		_type: "span",
		_key: legacyKey(`${cellKey}:span:0`),
		text
	});
	const values = typeof rawCell === "string" ? [fallbackSpan(rawCell)] : typeof rawContent === "string" ? [fallbackSpan(rawContent)] : rawContent === void 0 ? [] : rawContent;
	if (!Array.isArray(values)) return fail("UNSUPPORTED_CELL_CONTENT");
	const content = values.map((value, index) => {
		if (!isRecord(value) || value._type !== "span" || typeof value.text !== "string") return fail("UNSUPPORTED_CELL_CONTENT");
		const marks = value.marks ?? [];
		if (!Array.isArray(marks)) return fail("UNSUPPORTED_MARK_DEFINITION");
		const normalizedMarks = [];
		for (const mark of marks) {
			if (typeof mark !== "string" || !DECORATOR_MARKS.has(mark) && resolveMark(mark)?._type !== "link") return fail("UNSUPPORTED_MARK_DEFINITION");
			normalizedMarks.push(mark);
		}
		return {
			_type: "span",
			_key: readKey(value._key) ?? legacyKey(`${cellKey}:span:${index}`),
			text: value.text,
			...normalizedMarks.length > 0 ? { marks: normalizedMarks } : {}
		};
	});
	return content.length > 0 ? content : [emptySpan(cellKey)];
}
function normalizeMarkDefs(value) {
	if (value === void 0) return [];
	if (!Array.isArray(value)) return fail("UNSUPPORTED_MARK_DEFINITION");
	return value.map((mark) => {
		const key = isRecord(mark) ? readKey(mark._key) : void 0;
		if (!isRecord(mark) || mark._type !== "link" || !key || typeof mark.href !== "string") return fail("UNSUPPORTED_MARK_DEFINITION");
		return {
			...safeFields(mark),
			_type: "link",
			_key: key
		};
	});
}
const normalizeSpan = (value) => typeof value === "number" && Number.isInteger(value) && value > 0 && value <= MAX_TABLE_SPAN ? value : 1;
function normalizeAlignment(value) {
	return value === "left" || value === "center" || value === "right" || value === "justify" ? value : void 0;
}
function normalizeColwidth(value, colspan) {
	if (!Array.isArray(value) || value.length !== colspan || !value.every(validWidth)) return void 0;
	return value;
}
const validWidth = (value) => typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= MAX_TABLE_COLUMN_WIDTH;
function assertGridBound(width, height) {
	if (width * height > MAX_TABLE_REPAIRED_SLOTS) return fail("TABLE_TOO_LARGE");
}
function rectangleFree(occupied, row, column, rowspan, colspan) {
	for (let y = row; y < row + rowspan; y++) for (let x = column; x < column + colspan; x++) if (occupied[y].has(x)) return false;
	return true;
}
function occupy(occupied, row, column, rowspan, colspan) {
	for (let y = row; y < row + rowspan; y++) for (let x = column; x < column + colspan; x++) occupied[y]?.add(x);
}
function withWidths(cell, column, colspan, widths, hasWidths) {
	const { colwidth: _colwidth, ...rest } = cell;
	if (!hasWidths) return rest;
	return {
		...rest,
		colwidth: widths.slice(column, column + colspan).map((width) => width ?? TABLE_CELL_MIN_WIDTH)
	};
}
function tableFrom(raw, key, markDefs, rows, hasHeaderRow = false) {
	return {
		...safeFields(raw, TABLE_FIELDS),
		_type: "table",
		_key: key,
		rows,
		...hasHeaderRow ? { hasHeaderRow: true } : {},
		...markDefs.length > 0 ? { markDefs } : {}
	};
}
const emptySpan = (key) => ({
	_type: "span",
	_key: legacyKey(`${key}:span:0`),
	text: ""
});
function emptyCell(key, isHeader = false) {
	return {
		_type: "tableCell",
		_key: key,
		content: [emptySpan(key)],
		...isHeader ? { isHeader: true } : {}
	};
}
function catchFailure(raw, context, operation) {
	try {
		return operation();
	} catch (error) {
		if (error instanceof NormalizationFailure) return unsafeResult(error.reason, raw, context.path);
		throw error;
	}
}
function unsafeResult(reason, raw, path) {
	return {
		ok: false,
		reason,
		raw,
		...reason === "TABLE_TOO_LARGE" ? {} : { renderFallback: makeRenderFallback(raw, path) }
	};
}
function makeRenderFallback(raw, path) {
	const record = asRecord(raw);
	const seen = /* @__PURE__ */ new Set();
	const tableKey = reserveKey(readKey(record._key) ?? legacyKey(`${path}:fallback-table`), seen);
	let remaining = MAX_TABLE_REPAIRED_SLOTS;
	const rows = [];
	for (const [rowIndex, rawRow] of (Array.isArray(record.rows) ? record.rows : []).entries()) {
		const row = asRecord(rawRow);
		const rawCells = Array.isArray(row.cells) ? row.cells : [];
		if (Math.max(rawCells.length, 1) > remaining) return void 0;
		const rowKey = reserveKey(readKey(row._key) ?? legacyKey(`${tableKey}:fallback-row:${rowIndex}`), seen);
		const cells = rawCells.map((rawCell, cellIndex) => {
			return fallbackCell(rawCell, reserveKey(readKey(asRecord(rawCell)._key) ?? legacyKey(`${rowKey}:fallback-cell:${cellIndex}`), seen));
		});
		if (cells.length === 0) cells.push(emptyCell(reserveKey(legacyKey(`${rowKey}:empty`), seen)));
		remaining -= cells.length;
		rows.push({
			_type: "tableRow",
			_key: rowKey,
			cells
		});
	}
	if (rows.length > 0) return {
		_type: "table",
		_key: tableKey,
		rows
	};
	return {
		_type: "table",
		_key: tableKey,
		rows: [{
			_type: "tableRow",
			_key: reserveKey(legacyKey(`${tableKey}:empty-row`), seen),
			cells: [emptyCell(reserveKey(legacyKey(`${tableKey}:empty-cell`), seen))]
		}]
	};
}
const fallbackCell = (raw, key) => ({
	_type: "tableCell",
	_key: key,
	content: [{
		...emptySpan(key),
		text: recoverText(raw)
	}]
});
function recoverText(value, depth = 0) {
	if (depth > 32) return "";
	if (typeof value === "string") return value;
	if (Array.isArray(value)) return value.map((entry) => recoverText(entry, depth + 1)).join("");
	const record = asRecord(value);
	if (typeof record.text === "string") return record.text;
	if (typeof record.content === "string") return record.content;
	return recoverText(Array.isArray(record.content) ? record.content : Array.isArray(record.children) ? record.children : [], depth + 1);
}
const indexMarkDefs = (marks) => new Map(marks.map((mark) => [mark._key, mark]));
function getMarkDefs(table, cell) {
	const byKey = indexMarkDefs(table);
	for (const mark of cell) byKey.set(mark._key, mark);
	return [...byKey.values()];
}
function legacyKey(value) {
	let hash = 2166136261;
	for (let index = 0; index < value.length; index++) {
		hash ^= value.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}
	return `legacy-table-${(hash >>> 0).toString(36)}`;
}
function reserveKey(base, seen) {
	let candidate = base;
	for (let suffix = 1; seen.has(candidate); suffix++) candidate = `${base}-${suffix}`;
	seen.add(candidate);
	return candidate;
}
const pmAttrs = (record, fields) => ({
	emdashKey: record._key,
	emdashData: safeFields(record, fields)
});
function safeFields(value, excluded = /* @__PURE__ */ new Set()) {
	if (!isRecord(value)) return {};
	return Object.fromEntries(Object.entries(value).filter(([key]) => !excluded.has(key) && key !== "__proto__" && key !== "prototype" && key !== "constructor" && !DOM_FIELD.test(key)));
}
const isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const asRecord = (value) => isRecord(value) ? value : {};
const readKey = (value) => typeof value === "string" && value.length > 0 ? value : void 0;
const hasOwn = (record, key) => Object.hasOwn(record, key);
const isProseMirrorNode = (value) => isRecord(value) && typeof value.type === "string";

//#endregion
export { MAX_TABLE_COLUMN_WIDTH, MAX_TABLE_PASTE_CELLS, MAX_TABLE_PASTE_COLUMNS, MAX_TABLE_PASTE_ROWS, MAX_TABLE_PASTE_TEXT_BYTES, MAX_TABLE_REPAIRED_SLOTS, MAX_TABLE_SPAN, TABLE_CELL_MIN_WIDTH, TABLE_COLUMN_WIDTH_STEP, TABLE_RESIZE_HANDLE_WIDTH, TABLE_RESIZE_TARGET_WIDTH, UnsafePortableTextTableError, createPortableTextTableCellMarkResolver, getPortableTextTableCellMarkDefs, getPortableTextTableColumnWidths, isPortableTextTableInput, normalizePortableTextTable, portableTextTableToProseMirror, proseMirrorTableToPortableText };
//# sourceMappingURL=portable-text-table.js.map