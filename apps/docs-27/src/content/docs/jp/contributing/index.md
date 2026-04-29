---
title: "貢献ガイドラインズ"
description: "XOOPS CMSの開発、コーディング基準、およびコミュニティガイドラインへの貢献方法"
---

# 🤝 XOOPSへの貢献

> XOOPSコミュニティに参加して、世界最高のCMSにするのを手伝いましょう。

---

## 📋 概要

XOOPSはコミュニティの貢献で活動するオープンソースプロジェクトです。バグの修正、機能の追加、ドキュメントの改善、他の人を助けることなど、どのような形式の貢献でも価値があります。

---

## 🗂️ セクション内容

### ガイドラインズ
- コミュニティ規約
- 貢献ワークフロー
- プルリクエストガイドラインズ
- 問題報告

### コードスタイル
- PHPコーディング基準
- JavaScriptコーディング基準
- CSSガイドラインズ
- Smartyテンプレート基準

### アーキテクチャ決定
- ADRインデックス
- ADRテンプレート
- ADR-001: モジュール式アーキテクチャ
- ADR-002: データベース抽象化

---

## 🚀 はじめに

### 1. 開発環境をセットアップ

```bash
# GitHubでリポジトリをフォーク
# 次に、フォークをクローン
git clone https://github.com/YOUR_USERNAME/XoopsCore27.git
cd XoopsCore27

# アップストリームリモートを追加
git remote add upstream https://github.com/XOOPS/XoopsCore27.git

# 依存関係をインストール
composer install
```

### 2. フィーチャーブランチを作成

```bash
# アップストリームと同期
git fetch upstream
git checkout -b feature/my-feature upstream/main
```

### 3. 変更を加える

コーディング基準に従い、新機能のテストを作成します。

### 4. プルリクエストを送信

```bash
# 変更をコミット
git add .
git commit -m "Add: 変更の簡潔な説明"

# フォークにプッシュ
git push origin feature/my-feature
```

次にGitHubでプルリクエストを作成します。

---

## 📝 コーディング基準

### PHP基準

XOOPSはPSR-1、PSR-4、PSR-12コーディング基準に従います。

```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule;

use Xmf\Request;
use XoopsObject;

/**
 * クラス Item
 *
 * モジュール内のアイテムを表します
 */
class Item extends XoopsObject
{
    /**
     * コンストラクタ
     */
    public function __construct()
    {
        $this->initVar('id', \XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', \XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', \XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('created', \XOBJ_DTYPE_INT, time(), false);
    }

    /**
     * フォーマットされたタイトルを取得
     *
     * @return string
     */
    public function getTitle(): string
    {
        return $this->getVar('title', 'e');
    }
}
```

### 主要な規約

| ルール | 例 |
|------|---------|
| クラス名 | `PascalCase` |
| メソッド名 | `camelCase` |
| 定数 | `UPPER_SNAKE_CASE` |
| 変数 | `$camelCase` |
| ファイル | `ClassName.php` |
| インデント | 4スペース |
| 行の長さ | 最大120文字 |

### Smartyテンプレート

```smarty
{* ファイル: templates/mymodule_index.tpl *}
{* 説明: インデックスページテンプレート *}

<{include file="db:mymodule_header.tpl"}>

<div class="mymodule-container">
    <h1><{$page_title}></h1>

    <{if $items|@count > 0}>
        <ul class="item-list">
            <{foreach item=item from=$items}>
                <li class="item">
                    <a href="<{$item.url}>"><{$item.title}></a>
                </li>
            <{/foreach}>
        </ul>
    <{else}>
        <p class="no-items"><{$smarty.const._MD_MYMODULE_NO_ITEMS}></p>
    <{/if}>
</div>

<{include file="db:mymodule_footer.tpl"}>
```

---

## 🔀 Gitワークフロー

### ブランチの名前付け

| タイプ | パターン | 例 |
|------|---------|---------|
| フィーチャー | `feature/description` | `feature/add-user-export` |
| バグフィックス | `fix/description` | `fix/login-validation` |
| ホットフィックス | `hotfix/description` | `hotfix/security-patch` |
| リリース | `release/version` | `release/2.7.0` |

### コミットメッセージ

従来型コミットに従う：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**タイプ:**
- `feat`: 新機能
- `fix`: バグフィックス
- `docs`: ドキュメント
- `style`: コードスタイル(フォーマット)
- `refactor`: コード改善
- `test`: テスト追加
- `chore`: メンテナンス

**例:**
```
feat(auth): 二要素認証を追加

TOTP ベースの2FAをユーザーアカウント向けに実装。
- 認証器アプリ用のQRコード生成を追加
- ユーザープロフィールに暗号化されたシークレットを保存
- バックアップコード機能を追加

#123を修正
```

```
fix(forms): テキスト入力のXSS脆弱性を解決

XoopsFormTextのレンダー方法でユーザー入力を正しくエスケープします。

セキュリティ: CVE-2024-XXXX
```

---

## 🧪 テスト

### テストを実行

```bash
# すべてのテストを実行
./vendor/bin/phpunit

# 特定のテストスイートを実行
./vendor/bin/phpunit --testsuite unit

# カバレッジ付きで実行
./vendor/bin/phpunit --coverage-html coverage/
```

### テストを作成

```php
<?php

namespace XoopsModulesTest\MyModule;

use PHPUnit\Framework\TestCase;
use XoopsModules\MyModule\Item;

class ItemTest extends TestCase
{
    private Item $item;

    protected function setUp(): void
    {
        $this->item = new Item();
    }

    public function testInitialValues(): void
    {
        $this->assertNull($this->item->getVar('id'));
        $this->assertEquals('', $this->item->getVar('title'));
    }

    public function testSetTitle(): void
    {
        $this->item->setVar('title', 'Test Title');
        $this->assertEquals('Test Title', $this->item->getVar('title'));
    }

    public function testTitleEscaping(): void
    {
        $this->item->setVar('title', '<script>alert("xss")</script>');
        $escaped = $this->item->getTitle();
        $this->assertStringNotContainsString('<script>', $escaped);
    }
}
```

---

## 📋 プルリクエストチェックリスト

PRを送信する前に、以下を確認します:

- [ ] コードはXOOPSコーディング基準に従っている
- [ ] すべてのテストが合格
- [ ] 新機能にはテストがある
- [ ] 必要に応じてドキュメントを更新
- [ ] メインブランチとのマージコンフリクトなし
- [ ] コミットメッセージは説明的
- [ ] PR説明が変更を説明している
- [ ] 関連する問題がリンクされている

---

## 🏗️ アーキテクチャ決定記録

ADRsは重要なアーキテクチャの決定を文書化します。

### ADRテンプレート

```markdown
# ADR-XXX: タイトル

## ステータス
提案 | 承認 | 廃止予定 | 後継

## コンテクスト
どのような問題に対処しているのか？

## 決定
提案される変更は何か？

## 結果
どのような肯定的および否定的な影響があるか？

## 代替案の検討
他にどのようなオプションが評価されたか？
```

### 現在のADRs

| ADR | タイトル | ステータス |
|-----|-------|--------|
| ADR-001 | モジュール式アーキテクチャ | 承認 |
| ADR-002 | オブジェクト指向データベース アクセス | 承認 |
| ADR-003 | Smartyテンプレートエンジン | 承認 |
| ADR-004 | セキュリティシステム設計 | 承認 |
| ADR-005 | PSR-15ミドルウェア(4.0.x) | 提案 |

---

## 🎖️ 認識

貢献者は以下を通じて認識されます:

- **貢献者リスト** - リポジトリにリストアップ
- **リリースノート** - リリースでクレジット
- **殿堂** - 優れた貢献者
- **モジュール認証** - モジュールの品質バッジ

---

## 🔗 関連ドキュメント

- XOOPS 4.0ロードマップ
- コアコンセプト
- モジュール開発

---

## 📚 リソース

- [GitHubリポジトリ](https://github.com/XOOPS/XoopsCore27)
- [問題トラッカー](https://github.com/XOOPS/XoopsCore27/issues)
- [XOOPSフォーラム](https://xoops.org/modules/newbb/)
- [Discordコミュニティ](https://discord.gg/xoops)

---

#xoops #contributing #open-source #community #development #coding-standards
