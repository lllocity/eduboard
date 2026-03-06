import {
  REQUIRED_COLUMNS,
  validateHeaders,
  parseRecords,
  buildSuccessResponse,
  buildErrorResponse,
} from "../src/logic";

// ============================================================
// validateHeaders
// ============================================================
describe("validateHeaders", () => {
  it("正常系: 全必須カラムが存在する場合、空配列を返す", () => {
    expect(validateHeaders([...REQUIRED_COLUMNS])).toEqual([]);
  });

  it("正常系: 必須カラム以外の余分なカラムがあっても問題なし", () => {
    expect(validateHeaders([...REQUIRED_COLUMNS, "余分なカラム"])).toEqual([]);
  });

  it("異常系: カラムが不足している場合、不足カラム名の配列を返す", () => {
    const headers = ["対象月", "科目", "単元名"]; // 種別・大項目 が欠如
    const missing = validateHeaders(headers);
    expect(missing).toContain("種別");
    expect(missing).toContain("大項目");
    expect(missing).not.toContain("対象月");
    expect(missing).not.toContain("単元名");
  });

  it("異常系: ヘッダーが空の場合、全必須カラムを返す", () => {
    const missing = validateHeaders([]);
    expect(missing).toEqual([...REQUIRED_COLUMNS]);
  });

  it("異常系: 1カラムだけ欠如している場合、そのカラムのみ返す", () => {
    const headers = REQUIRED_COLUMNS.filter((c) => c !== "単元名");
    expect(validateHeaders([...headers])).toEqual(["単元名"]);
  });
});

// ============================================================
// parseRecords
// ============================================================
describe("parseRecords", () => {
  const headers = ["対象月", "種別", "科目", "大項目", "単元名"];

  it("正常系: データ行をオブジェクト配列に変換する", () => {
    const rows = [[4, "学習", "算数", "計算", "分数の足し算"]];
    const result = parseRecords(rows, headers);
    expect(result).toHaveLength(1);
    expect(result[0]["対象月"]).toBe(4);
    expect(result[0]["科目"]).toBe("算数");
    expect(result[0]["単元名"]).toBe("分数の足し算");
  });

  it("正常系: 空行を除外する", () => {
    const rows = [
      ["", "", "", "", ""],
      [5, "学習", "国語", "読解", "物語文"],
    ];
    const result = parseRecords(rows, headers);
    expect(result).toHaveLength(1);
    expect(result[0]["科目"]).toBe("国語");
  });

  it("正常系: 全行が空行の場合、空配列を返す", () => {
    const rows = [
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ];
    expect(parseRecords(rows, headers)).toEqual([]);
  });

  it("正常系: 複数行を正しく変換する", () => {
    const rows = [
      [4, "学習", "算数", "計算", "分数"],
      [4, "学習", "国語", "読解", "物語文"],
      [5, "模試", "全科", "-", "春期模試"],
    ];
    const result = parseRecords(rows, headers);
    expect(result).toHaveLength(3);
    expect(result[2]["種別"]).toBe("模試");
  });

  it("正常系: 値が undefined の場合、空文字にフォールバックする", () => {
    // 列数がヘッダーより少ない行
    const rows = [[4, "学習"]]; // 残り3カラム分なし
    const result = parseRecords(rows, headers);
    expect(result[0]["科目"]).toBe("");
    expect(result[0]["単元名"]).toBe("");
  });
});

// ============================================================
// buildSuccessResponse / buildErrorResponse
// ============================================================
describe("buildSuccessResponse", () => {
  it("status: success と data を含むJSONを返す", () => {
    const data = [{ 科目: "算数", 単元名: "分数" }];
    const json = JSON.parse(buildSuccessResponse(data));
    expect(json.status).toBe("success");
    expect(json.data).toEqual(data);
  });

  it("dataが空配列でも正しいJSONを返す", () => {
    const json = JSON.parse(buildSuccessResponse([]));
    expect(json.status).toBe("success");
    expect(json.data).toEqual([]);
  });
});

describe("buildErrorResponse", () => {
  it("status: error と message を含むJSONを返す", () => {
    const json = JSON.parse(buildErrorResponse("シートが見つかりません"));
    expect(json.status).toBe("error");
    expect(json.message).toBe("シートが見つかりません");
  });
});
