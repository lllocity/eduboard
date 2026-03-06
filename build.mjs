// ============================================================
// build.mjs - EduBoard ビルドスクリプト
// TypeScript → GAS向けJS にバンドルし、dist/ にファイルを集約する
// ============================================================

import * as esbuild from "esbuild";
import { GasPlugin } from "esbuild-gas-plugin";
import { copyFileSync, existsSync, mkdirSync } from "fs";

mkdirSync("dist", { recursive: true });

// TypeScript をバンドル（GAS向けにグローバル関数として出力）
await esbuild.build({
  bundle: true,
  entryPoints: ["src/main.ts"],
  outfile: "dist/Code.js",
  plugins: [GasPlugin],
  target: "es2019",
  logLevel: "info",
});

// 静的ファイルを dist/ にコピー
copyFileSync("src/index.html", "dist/index.html");
copyFileSync("src/appsscript.json", "dist/appsscript.json");

// env.gs は gitignore 対象だが clasp push には必要
if (existsSync("src/env.gs")) {
  copyFileSync("src/env.gs", "dist/env.gs");
  console.log("✓ src/env.gs → dist/env.gs");
} else {
  console.warn(
    "⚠ src/env.gs が見つかりません。dist/env.gs を手動で作成するか、src/env.gs に SPREADSHEET_ID と SHEET_NAME を設定してください。"
  );
}

console.log("✓ ビルド完了 → dist/");
