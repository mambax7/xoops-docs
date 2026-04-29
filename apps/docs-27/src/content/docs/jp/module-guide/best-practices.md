---
title: "モジュール開発ベストプラクティス"
---

## 概要

このドキュメントは高品質な XOOPS モジュール開発のベストプラクティスをまとめています。これらのガイドラインに従うことで、保守性、セキュリティ、パフォーマンスに優れたモジュールが実現できます。

## アーキテクチャ

### クリーンアーキテクチャに従う

コードを層に編成します。

```
src/
├── Domain/          # ビジネスロジック、エンティティ
├── Application/     # ユースケース、サービス
├── Infrastructure/  # データベース、外部サービス
└── Presentation/    # コントローラー、テンプレート
```

### 単一責任原則

各クラスは 1 つの変更理由を持つべきです。

```php
// 良い: フォーカスされたクラス
class ArticleRepository { /* 永続化のみ */ }
class ArticleValidator { /* 検証のみ */ }
class ArticleNotifier { /* 通知のみ */ }

// 悪い: 神クラス
class Article {
    public function save() { }
    public function validate() { }
    public function notify() { }
    public function generatePDF() { }
}
```

### 依存性注入

依存性を作成するのではなく注入します。

```php
// 良い
public function __construct(
    private readonly ArticleRepositoryInterface $repository
) {}

// 悪い
public function __construct() {
    $this->repository = new ArticleRepository();
}
```

## コード品質

### 型安全性

厳密な型と型宣言を使用します。

```php
<?php

declare(strict_types=1);

final class ArticleService
{
    public function findById(int $id): ?Article
    {
        // ...
    }

    public function create(CreateArticleDTO $dto): Article
    {
        // ...
    }
}
```

### エラーハンドリング

例外を適切に使用します。

```php
// 特定の例外をスロー
throw new ArticleNotFoundException($id);
throw new ValidationException($errors);
throw new UnauthorizedException('Cannot edit this article');

// 適切なレベルでキャッチ
try {
    $article = $service->create($dto);
} catch (ValidationException $e) {
    return $this->renderForm($e->getErrors());
} catch (UnauthorizedException $e) {
    return $this->redirectToLogin();
}
```

### Null 安全性

可能な限り null を回避します。

```php
// Null オブジェクトパターンを使用
public function getAuthor(): UserInterface
{
    return $this->author ?? new AnonymousUser();
}

// Optional/Maybe パターンを使用
public function findById(int $id): ?Article
{
    // 明示的に nullable な戻り値
}
```

## データベース

### Criteria を使用してクエリを実行

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created_at');
$criteria->setOrder('DESC');
$criteria->setLimit($limit);

$items = $handler->getObjects($criteria);
```

### ユーザー入力をエスケープ

```php
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d AND title = %s",
    $db->prefix('mymodule_items'),
    intval($id),
    $db->quoteString($title)
);
```

### トランザクションを使用

```php
$db->query('START TRANSACTION');

try {
    $handler->insert($article);
    $handler->insert($metadata);
    $db->query('COMMIT');
} catch (\Exception $e) {
    $db->query('ROLLBACK');
    throw $e;
}
```

## セキュリティ

### 常に入力を検証

```php
use Xmf\Request;

$id = Request::getInt('id', 0);
$title = Request::getString('title', '');
$data = Request::getArray('data', []);

// 追加の検証
if (strlen($title) < 5) {
    throw new ValidationException('Title too short');
}
```

### CSRF トークンを使用

```php
// フォーム内
$form->addElement(new XoopsFormHiddenToken());

// 送信時
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, 'Invalid token');
}
```

### パーミッションを確認

```php
if (!$helper->isUserAdmin()) {
    redirect_header('index.php', 3, _NOPERM);
}

if (!$permHandler->isGranted('edit', $categoryId)) {
    throw new UnauthorizedException();
}
```

## パフォーマンス

### キャッシュを使用

```php
$cache = $helper->getCache();
$cacheKey = "articles_{$categoryId}_{$limit}";

$articles = $cache->read($cacheKey);
if ($articles === false) {
    $articles = $handler->getArticles($categoryId, $limit);
    $cache->write($cacheKey, $articles, 3600);
}
```

### クエリを最適化

```php
// インデックスを使用
// sql/mysql.sql に追加:
// INDEX `idx_status_date` (`status`, `created_at`)

// 必要な列のみを選択
$handler->getObjects($criteria, false, true); // asArray = true

// ページネーションを使用
$criteria->setLimit($perPage);
$criteria->setStart($offset);
```

## テスト

### ユニットテストを作成

```php
public function testCreateArticle(): void
{
    $repository = $this->createMock(ArticleRepositoryInterface::class);
    $repository->expects($this->once())->method('save');

    $service = new ArticleService($repository);
    $dto = new CreateArticleDTO('Title', 'Content');

    $article = $service->create($dto);

    $this->assertInstanceOf(Article::class, $article);
}
```

## 関連ドキュメント

- Clean-Code - クリーンコード原則
- Code-Organization - プロジェクト構造
- Testing - テストガイド
- ../02-Core-Concepts/Security/Security-Best-Practices - セキュリティガイド
