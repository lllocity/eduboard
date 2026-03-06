// ============================================================
// main.ts - EduBoard GASエントリーポイント
// シークレット情報は env.gs で管理（このファイルにIDを書かないこと）
// ============================================================

import {
  validateHeaders,
  parseRecords,
  buildSuccessResponse,
  buildErrorResponse,
} from "./logic";

// env.gs で定義されるグローバル定数
declare const SPREADSHEET_ID: string;
declare const SHEET_NAME: string;

// esbuild のバンドル後も GAS がグローバル関数として認識できるよう
// global オブジェクトへ明示的にアサインする
declare const global: Record<string, unknown>;

/**
 * GAS WebアプリのエントリーポイントとしてHTMLを配信する
 */
global.doGet = (
  _e: GoogleAppsScript.Events.DoGet
): GoogleAppsScript.HTML.HtmlOutput => {
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("EduBoard")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
};

/**
 * スプレッドシートからスケジュールデータを取得し JSON 文字列で返す
 * フロントエンドから google.script.run 経由で呼び出す
 * @returns { status: "success", data: [...] } または { status: "error", message: "..." }
 */
global.getScheduleData = (): string => {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return buildErrorResponse(
        `シート "${SHEET_NAME}" が見つかりません。スプレッドシートに "${SHEET_NAME}" という名前のシートが存在するか確認してください。`
      );
    }

    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return buildSuccessResponse([]);
    }

    const headers = data[0].map(String);
    const missingColumns = validateHeaders(headers);
    if (missingColumns.length > 0) {
      return buildErrorResponse(
        `スプレッドシートに必須カラムが不足しています: ${missingColumns.join(", ")}`
      );
    }

    const records = parseRecords(data.slice(1), headers);
    return buildSuccessResponse(records);
  } catch (e) {
    const err = e as Error;
    console.error("getScheduleData エラー:", err);
    return buildErrorResponse(
      `データ取得中に予期しないエラーが発生しました: ${err.message}`
    );
  }
};
