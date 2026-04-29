---
title: "プルリクエスト ガイドライン"
description: "XOOPS プロジェクトへプルリクエストを送信するためのガイドライン"
---

このドキュメントは XOOPS プロジェクトへプルリクエストを送信するための包括的なガイドラインを提供します。これらのガイドラインに従うことで、スムーズなコード レビューと高速なマージが確保されます。

## プルリクエスト作成前

### ステップ 1: 既存の問題をチェック

```
1. GitHub リポジトリにアクセス
2. Issues タブに進む
3. 変更に関連する既存の問題を検索
4. 未解決とクローズされた問題の両方をチェック
```

### ステップ 2: リポジトリをフォークしてクローン

```bash
# GitHub でリポジトリをフォーク
# リポジトリ ページで "Fork" ボタンをクリック

# フォークをクローン
git clone https://github.com/YOUR_USERNAME/XOOPS.git
cd XOOPS

# アップストリーム リモートを追加
git remote add upstream https://github.com/XOOPS/XOOPS.git

# リモートを確認
git remote -v
# origin (フォーク) と upstream (公式) を表示する必要があります
```

### ステップ 3: フィーチャー ブランチを作成

```bash
# メイン ブランチを更新
git fetch upstream
git checkout main
git merge upstream/main

# フィーチャー ブランチを作成
# 説明的な名前を使用: bugfix/issue-number または feature/description
git checkout -b bugfix/123-fix-database-connection
git checkout -b feature/add-psr-7-support
```

### ステップ 4: 変更を行う

```bash
# ファイルに変更を加える
# コード スタイル ガイドラインに従う

# 変更をステージ
git add .

# 明確なメッセージでコミット
git commit -m "Fix database connection timeout issue"

# 論理的な変更のために複数のコミットを作成
git commit -m "Add connection retry logic"
git commit -m "Improve error messages for debugging"
```

## コミット メッセージ標準

### 良いコミット メッセージ

明確で説明的なメッセージを使用し、以下のパターンに従います:

```
# フォーマット
<type>: <subject>

<body>

<footer>

# 例 1: バグ修正
fix: resolve database connection timeout

Add exponential backoff retry mechanism to database connection.
Connections now retry up to 3 times with increasing delays.

Fixes #123
```

---

## プルリクエスト説明

### PR テンプレート

```markdown
## 説明
加えた変更と理由の明確な説明。

## 変更タイプ
- [ ] バグ修正
- [ ] 新機能
- [ ] 破壊的な変更
- [ ] ドキュメント更新

## 関連する問題
Closes #123
関連: #456

## 加えた変更
- 変更 1
- 変更 2
- 変更 3

## テスト
- [ ] ローカルでテスト
- [ ] すべてのテストがパス
- [ ] 新しいテストを追加
- [ ] マニュアル テスト ステップを含む

## チェックリスト
- [ ] コードはスタイル ガイドラインに従う
- [ ] セルフ レビューを完了
- [ ] 複雑なロジックにコメントを追加
- [ ] ドキュメントを更新
- [ ] 新しい警告は生成されない
- [ ] 新機能にテストを追加
- [ ] すべてのテストがパス
```

---

## コード品質要件

### コード スタイル

Code-Style ガイドラインに従う:

```php
<?php
// 良い: PSR-12 スタイル
namespace MyModule\Controller;

use MyModule\Model\Item;
use MyModule\Repository\ItemRepository;

class ItemController
{
    private ItemRepository $repository;

    public function __construct(ItemRepository $repository)
    {
        $this->repository = $repository;
    }

    public function indexAction()
    {
        $items = $this->repository->findAll();
        return $this->render('items', ['items' => $items]);
    }
}
```

---

## テスト要件

### ユニット テスト

```php
// tests/Feature/DatabaseConnectionTest.php
namespace Tests\Feature;

use PHPUnit\Framework\TestCase;
use Xoops\Database\XoopsDatabase;

class DatabaseConnectionTest extends TestCase
{
    private XoopsDatabase $database;

    protected function setUp(): void
    {
        $this->database = new XoopsDatabase();
    }

    public function testConnectionWithValidCredentials()
    {
        $result = $this->database->connect();
        $this->assertTrue($result);
    }

    public function testConnectionWithInvalidCredentials()
    {
        $this->database->setCredentials('invalid', 'invalid');
        $result = $this->database->connect();
        $this->assertFalse($result);
    }
}
```

### テストを実行

```bash
# すべてのテストを実行
vendor/bin/phpunit

# 特定のテスト ファイルを実行
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# カバレッジで実行
vendor/bin/phpunit --coverage-html coverage/
```

---

## ブランチの操作

### ブランチを最新に保つ

```bash
# アップストリームから最新を取得
git fetch upstream

# メイン ブランチ上でリベース
git rebase upstream/main

# またはマージを優先
git merge upstream/main

# リベースした場合は強制プッシュ (警告: ブランチのみ!)
git push -f origin bugfix/123-fix-database-connection
```

---

## プルリクエストを作成

### PR タイトル フォーマット

```
[Type] 短い説明 (fix/feature/docs)

例:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```

---

## コード レビュー プロセス

### レビュアーが見るもの

1. **正確性**
   - コードは述べられた問題を解決するか
   - エッジ ケースは処理されるか
   - エラー処理は適切か

2. **品質**
   - コーディング標準に従うか
   - メンテナンス可能か
   - よくテストされているか

3. **パフォーマンス**
   - パフォーマンス回帰はないか
   - クエリは最適化されているか
   - メモリ使用は合理的か

4. **セキュリティ**
   - 入力検証か
   - SQL インジェクション防止か
   - 認証/認可か

### フィードバックに対応

```bash
# フィードバックに対応
# レビュー コメントに基づいてファイルを編集

# 変更をコミット
git commit -m "Address code review feedback

- Add additional error handling
- Improve test coverage for edge cases
- Update documentation"

# 変更をプッシュ
git push origin bugfix/123-fix-database-connection
```

---

## ベストプラクティス サマリー

### すべき こと

- 説明的なコミット メッセージを作成
- フォーカスされた、単一目的の PR を作成
- 新機能にテストを含める
- ドキュメントを更新
- 関連する問題を参照
- PR 説明を明確に保つ
- レビューに迅速に対応

### しないこと

- 無関連な変更を含める
- main をブランチにマージ (リベースを使用)
- レビュー開始後に強制プッシュ
- テストをスキップ
- 進行中の作業を送信
- コード レビュー フィードバックを無視

---

## 関連ドキュメント

- ../貢献 - 貢献概要
- Code-Style - コード スタイル ガイドライン
- ../../03-Module-Development/Best-Practices/Testing - テスト ベストプラクティス
- ../Architecture-Decisions/ADR-Index - アーキテクチャ ガイドライン

## リソース

- [Git ドキュメント](https://git-scm.com/doc)
- [GitHub プルリクエスト ヘルプ](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [XOOPS GitHub Organization](https://github.com/XOOPS)

---

**最終更新:** 2026-01-31
**適用対象:** すべての XOOPS プロジェクト
**リポジトリ:** https://github.com/XOOPS/XOOPS
