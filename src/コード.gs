// ============================================================
// コード.gs - EduBoard バックエンド
// シークレット情報は env.gs で管理（このファイルにIDを書かないこと）
// ============================================================

// 要件定義書で定義された必須カラム
const REQUIRED_COLUMNS = ["対象月", "種別", "科目", "大項目", "単元名", "備考"];

/**
 * GAS WebアプリのエントリーポイントとしてHTMLを配信する
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("EduBoard")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * スプレッドシートからスケジュールデータを取得し JSON 文字列で返す
 * フロントエンドから google.script.run 経由で呼び出す
 * @returns {string} { status: "success", data: [...] } または { status: "error", message: "..." }
 */
function getScheduleData() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return _error(`シート "${SHEET_NAME}" が見つかりません。スプレッドシートに "${SHEET_NAME}" という名前のシートが存在するか確認してください。`);
    }

    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return _success([]);
    }

    // ヘッダー検証
    const headers = data[0].map(String);
    const missingColumns = REQUIRED_COLUMNS.filter(col => !headers.includes(col));
    if (missingColumns.length > 0) {
      return _error(`スプレッドシートに必須カラムが不足しています: ${missingColumns.join(", ")}`);
    }

    // データ行をオブジェクト配列に変換（空行除外）
    const records = data.slice(1)
      .filter(row => row.some(cell => cell !== ""))
      .map(row => {
        const record = {};
        headers.forEach((header, i) => {
          record[header] = row[i] !== undefined ? row[i] : "";
        });
        return record;
      });

    return _success(records);

  } catch (e) {
    console.error("getScheduleData エラー:", e);
    return _error(`データ取得中に予期しないエラーが発生しました: ${e.message}`);
  }
}

// --- ヘルパー ---

function _success(data) {
  return JSON.stringify({ status: "success", data: data });
}

function _error(message) {
  console.error("EduBoard Error:", message);
  return JSON.stringify({ status: "error", message: message });
}
