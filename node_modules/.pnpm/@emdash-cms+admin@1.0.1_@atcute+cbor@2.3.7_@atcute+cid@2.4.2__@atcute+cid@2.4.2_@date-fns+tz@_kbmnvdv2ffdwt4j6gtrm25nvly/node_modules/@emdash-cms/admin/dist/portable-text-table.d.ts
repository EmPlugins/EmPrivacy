//#region src/portable-text-table.d.ts
declare const MAX_TABLE_SPAN = 100;
declare const MAX_TABLE_COLUMN_WIDTH = 4096;
declare const TABLE_CELL_MIN_WIDTH = 96;
declare const TABLE_COLUMN_WIDTH_STEP = 16;
declare const TABLE_RESIZE_HANDLE_WIDTH = 2;
declare const TABLE_RESIZE_TARGET_WIDTH = 24;
declare const MAX_TABLE_REPAIRED_SLOTS = 20000;
declare const MAX_TABLE_PASTE_ROWS = 100;
declare const MAX_TABLE_PASTE_COLUMNS = 100;
declare const MAX_TABLE_PASTE_CELLS = 10000;
declare const MAX_TABLE_PASTE_TEXT_BYTES = 1048576;
type PortableTextTableAlignment = "left" | "center" | "right" | "justify";
type PortableTextTableSpan = {
  _type: "span";
  _key: string;
  text: string;
  marks?: string[];
};
type PortableTextTableMarkDef = {
  _type: string;
  _key: string;
  [key: string]: unknown;
};
interface PortableTextTableCell {
  _type: "tableCell";
  _key: string;
  content: PortableTextTableSpan[];
  markDefs?: PortableTextTableMarkDef[];
  isHeader?: boolean;
  colspan?: number;
  rowspan?: number;
  colwidth?: number[];
  textAlign?: PortableTextTableAlignment;
  [key: string]: unknown;
}
interface PortableTextTableRow {
  _type: "tableRow";
  _key: string;
  cells: PortableTextTableCell[];
  [key: string]: unknown;
}
interface PortableTextTableBlock {
  _type: "table";
  _key: string;
  rows: PortableTextTableRow[];
  hasHeaderRow?: boolean;
  markDefs?: PortableTextTableMarkDef[];
  [key: string]: unknown;
}
interface PortableTextTableProseMirrorNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: PortableTextTableProseMirrorNode[];
  marks?: Array<{
    type: string;
    attrs?: Record<string, unknown>;
  }>;
  text?: string;
}
type UnsafePortableTextTableReason = "INVALID_TABLE" | "TABLE_TOO_LARGE" | "UNSUPPORTED_CELL_CONTENT" | "UNSUPPORTED_MARK_DEFINITION";
type PortableTextTableContext = {
  path: string;
  createKey: () => string;
};
interface PortableTextTableToProseMirrorContext extends PortableTextTableContext {
  spansToInline: (content: PortableTextTableSpan[], markDefs: PortableTextTableMarkDef[]) => PortableTextTableProseMirrorNode[];
}
interface ProseMirrorTableToPortableTextContext extends PortableTextTableContext {
  inlineToSpans: (content: PortableTextTableProseMirrorNode[]) => {
    content: PortableTextTableSpan[];
    markDefs?: PortableTextTableMarkDef[];
  };
}
type UnknownRecord = Record<string, unknown>;
declare class UnsafePortableTextTableError extends Error {
  readonly reason: UnsafePortableTextTableReason;
  readonly raw: unknown;
  readonly renderFallback?: PortableTextTableBlock | undefined;
  readonly code = "UNSAFE_PORTABLE_TEXT_TABLE";
  constructor(reason: UnsafePortableTextTableReason, raw: unknown, renderFallback?: PortableTextTableBlock | undefined);
}
declare function isPortableTextTableInput(value: unknown): value is UnknownRecord & {
  _type: "table";
};
declare function normalizePortableTextTable(value: unknown, context: PortableTextTableContext): {
  ok: true;
  table: PortableTextTableBlock;
  width: number;
  height: number;
} | {
  renderFallback?: PortableTextTableBlock | undefined;
  ok: false;
  reason: UnsafePortableTextTableReason;
  raw: unknown;
};
declare function portableTextTableToProseMirror(value: unknown, context: PortableTextTableToProseMirrorContext): {
  renderFallback?: PortableTextTableBlock | undefined;
  ok: false;
  reason: UnsafePortableTextTableReason;
  raw: unknown;
} | {
  ok: true;
  width: number;
  height: number;
  node: {
    type: string;
    attrs: UnknownRecord;
    content: {
      type: string;
      attrs: UnknownRecord;
      content: {
        type: string;
        attrs: {
          colspan: number;
          rowspan: number;
          colwidth: number[] | null;
          textAlign: PortableTextTableAlignment | null;
        };
        content: {
          type: string;
          content: PortableTextTableProseMirrorNode[];
        }[];
      }[];
    }[];
  };
};
declare function proseMirrorTableToPortableText(value: unknown, context: ProseMirrorTableToPortableTextContext): {
  ok: true;
  table: PortableTextTableBlock;
  width: number;
  height: number;
} | {
  renderFallback?: PortableTextTableBlock | undefined;
  ok: false;
  reason: UnsafePortableTextTableReason;
  raw: unknown;
};
declare function getPortableTextTableCellMarkDefs(table: PortableTextTableBlock, cell: PortableTextTableCell): PortableTextTableMarkDef[];
declare function createPortableTextTableCellMarkResolver(table: PortableTextTableBlock): (cell: PortableTextTableCell) => PortableTextTableMarkDef[];
declare function getPortableTextTableColumnWidths(table: PortableTextTableBlock): number[] | undefined;
//#endregion
export { MAX_TABLE_COLUMN_WIDTH, MAX_TABLE_PASTE_CELLS, MAX_TABLE_PASTE_COLUMNS, MAX_TABLE_PASTE_ROWS, MAX_TABLE_PASTE_TEXT_BYTES, MAX_TABLE_REPAIRED_SLOTS, MAX_TABLE_SPAN, PortableTextTableAlignment, PortableTextTableBlock, PortableTextTableCell, PortableTextTableMarkDef, PortableTextTableProseMirrorNode, PortableTextTableRow, PortableTextTableSpan, TABLE_CELL_MIN_WIDTH, TABLE_COLUMN_WIDTH_STEP, TABLE_RESIZE_HANDLE_WIDTH, TABLE_RESIZE_TARGET_WIDTH, UnsafePortableTextTableError, UnsafePortableTextTableReason, createPortableTextTableCellMarkResolver, getPortableTextTableCellMarkDefs, getPortableTextTableColumnWidths, isPortableTextTableInput, normalizePortableTextTable, portableTextTableToProseMirror, proseMirrorTableToPortableText };
//# sourceMappingURL=portable-text-table.d.ts.map