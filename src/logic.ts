// ============================================================
// logic.ts - EduBoard ビジネスロジック（純粋関数のみ）
// GAS APIに依存しないため、Jestで単体テスト可能
// ============================================================

export const REQUIRED_COLUMNS = [
  "対象月",
  "種別",
  "科目",
  "大項目",
  "単元名",
] as const;

export type ScheduleRecord = Record<string, string | number | boolean>;

export interface SuccessResponse {
  status: "success";
  data: ScheduleRecord[];
}

export interface ErrorResponse {
  status: "error";
  message: string;
}

export type ApiResponse = SuccessResponse | ErrorResponse;

/**
 * ヘッダー行に必須カラムが揃っているか検証する
 * @returns 不足しているカラム名の配列（空配列なら問題なし）
 */
export function validateHeaders(headers: string[]): string[] {
  return REQUIRED_COLUMNS.filter((col) => !headers.includes(col));
}

/**
 * スプレッドシートのデータ行をオブジェクト配列に変換する
 * 空行は除外する
 */
export function parseRecords(
  dataRows: unknown[][],
  headers: string[]
): ScheduleRecord[] {
  return dataRows
    .filter((row) => row.some((cell) => cell !== ""))
    .map((row) => {
      const record: ScheduleRecord = {};
      headers.forEach((header, i) => {
        const cell = (row as (string | number | boolean)[])[i];
        record[header] = cell !== undefined ? cell : "";
      });
      return record;
    });
}

/** 成功レスポンスのJSON文字列を返す */
export function buildSuccessResponse(data: ScheduleRecord[]): string {
  return JSON.stringify({ status: "success", data } satisfies SuccessResponse);
}

/** エラーレスポンスのJSON文字列を返す */
export function buildErrorResponse(message: string): string {
  return JSON.stringify({ status: "error", message } satisfies ErrorResponse);
}
