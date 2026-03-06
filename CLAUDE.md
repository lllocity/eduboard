# EduBoard プロジェクト

中高一貫校受験に向けたスケジュール・単元管理のためのGASベースのローカルWebアプリ。

## アーキテクチャ・技術スタック
- バックエンド: Google Apps Script (GAS)
- フロントエンド: HTML, CSS, Vanilla JS + CDNライブラリ (Vue.js/Alpine.js, Tailwind CSS)
- インフラ/デプロイ: GAS Webアプリ

## ディレクトリ構成
- `docs/`: 要件定義 (`01_requirements.md`) やプロンプト指示書 (`prompts/`) を配置
- `src/`: GASにデプロイするソースコード (`.gs`, `.html`) を配置

## 開発の基本ルール（AI向け指示）
1. **セキュリティ第一 (Public Repo)**: 本リポジトリは公開されるため、スプレッドシートID、APIキー、WebアプリURLなどのシークレット情報は絶対にコードにハードコードしないこと。
2. **シークレットの管理**: シークレットな定数は `src/env.gs` という設定ファイルに切り出して参照する設計とすること。`src/env.gs` は `.gitignore` でリポジトリから除外される。
3. **Prompt-as-Code**: 機能追加や修正を行う際は、ユーザーから提供される `docs/prompts/` 配下の指示書と、`docs/01_requirements.md` を必ず参照し、コンテキストを維持すること。