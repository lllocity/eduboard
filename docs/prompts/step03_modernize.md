# Step 3: バックエンドのモダン化とテスト基盤の構築

## 目的
レガシーなGASの記述方法（`コード.gs`）を破棄し、TypeScript、ES Modules、およびバンドラーを用いたモダンなGASローカル開発・テスト基盤へ移行する。

## タスク
1. **ファイル名の適正化:**
   - `src/コード.gs` を `src/main.ts` にリネーム（または移行して削除）し、マルチバイトのファイル名を排除すること。

2. **モダンな開発環境のセットアップ (Node.js):**
   - `package.json` を初期化し、以下の開発依存関係をインストールすること。
     - TypeScript環境: `typescript`, `@types/google-apps-script`
     - テスト環境: `jest`, `ts-jest`, `@types/jest`
     - バンドル環境: `esbuild`, `esbuild-gas-plugin` (またはそれに準ずるGAS向けバンドル設定)
   - `tsconfig.json` と `jest.config.js` を生成し、適切な設定を行うこと。

3. **ロジックの分離とTypeScript化:**
   - データ検証などのビジネスロジックを `src/logic.ts` に切り出し、ES Modules (`export const ...`) で記述すること。
   - `src/main.ts` は `logic.ts` を `import` し、GASのエンドポイント（`doGet`等）として機能するよう型定義を適用して記述すること。

4. **単体テストの実装:**
   - `tests/logic.test.ts` を作成し、切り出したロジックに対する単体テスト（正常系・異常系）をJestで記述すること。

5. **ビルドスクリプトの追加:**
   - `package.json` の `scripts` に以下を追加すること。
     - `"test": "jest"`
     - `"build": "esbuild src/main.ts --bundle --outfile=dist/main.js --plugin:gas-plugin..."` (適切なビルドコマンドを設定)
   - `clasp.json` の `rootDir` をビルド出力先（例: `dist/` または `build/`。`index.html` もそこにコピーされるようにする）へ変更すること。

## 注意事項
- フロントエンド（`index.html`）は引き続きCDNを利用した構成とし、今回は複雑なフロントエンドビルド（Vite等）は導入しない。
- `clasp push` を行った際、GAS上でエントリーポイント（`doGet`）が正しく認識され、画面がエラーなくレンダリングされることをゴールとする。