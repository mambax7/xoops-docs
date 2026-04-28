---
title: "模組開發最佳實踐"
---

## 概述

本文件彙總了開發高品質 XOOPS 模組的最佳實踐。遵循這些指南可確保可維護、安全和高效的模組。

## 架構

### 遵循清潔架構

將程式碼組織成層：

```
src/
├── Domain/          # 業務邏輯、實體
├── Application/     # 使用案例、服務
├── Infrastructure/  # 資料庫、外部服務
└── Presentation/    # 控制器、範本
```

### 單一責任

每個類別應該只有一個變更原因：

```php
// 好: 集中的類別
class ArticleRepository { /* 持久性僅 */ }
class ArticleValidator { /* 驗證僅 */ }
class ArticleNotifier { /* 通知僅 */ }

// 差: 神祇類別
class Article {
    public function save() { }
    public function validate() { }
    public function notify() { }
    public function generatePDF() { }
}
```

### 依賴注入

注入依賴，不要建立它們：

```php
// 好
public function __construct(
    private readonly ArticleRepositoryInterface $repository
) {}

// 差
public function __construct() {
    $this->repository = new ArticleRepository();
}
```

## 程式碼品質

### 型別安全

使用嚴格型別和型別宣告：

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

### 錯誤處理

適當使用例外狀況：

```php
// 擲回特定例外狀況
throw new ArticleNotFoundException($id);
throw new ValidationException($errors);
throw new UnauthorizedException('Cannot edit this article');

// 在適當層級擷取
try {
    $article = $service->create($dto);
} catch (ValidationException $e) {
    return $this->renderForm($e->getErrors());
} catch (UnauthorizedException $e) {
    return $this->redirectToLogin();
}
```

### 空值安全

盡可能避免空值：

```php
// 使用空物件模式
public function getAuthor(): UserInterface
{
    return $this->author ?? new AnonymousUser();
}

// 使用選用的/可能模式
public function findById(int $id): ?Article
{
    // 明確可為空的傳回
}
```

## 資料庫

### 對查詢使用 Criteria

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created_at');
$criteria->setOrder('DESC');
$criteria->setLimit($limit);

$items = $handler->getObjects($criteria);
```

### 逸出使用者輸入

```php
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d AND title = %s",
    $db->prefix('mymodule_items'),
    intval($id),
    $db->quoteString($title)
);
```

### 使用交易

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

## 安全

### 始終驗證輸入

```php
use Xmf\Request;

$id = Request::getInt('id', 0);
$title = Request::getString('title', '');
$data = Request::getArray('data', []);

// 其他驗證
if (strlen($title) < 5) {
    throw new ValidationException('Title too short');
}
```

### 使用 CSRF 權杖

```php
// 在表單中
$form->addElement(new XoopsFormHiddenToken());

// 在提交時
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, 'Invalid token');
}
```

### 檢查權限

```php
if (!$helper->isUserAdmin()) {
    redirect_header('index.php', 3, _NOPERM);
}

if (!$permHandler->isGranted('edit', $categoryId)) {
    throw new UnauthorizedException();
}
```

## 效能

### 使用快取

```php
$cache = $helper->getCache();
$cacheKey = "articles_{$categoryId}_{$limit}";

$articles = $cache->read($cacheKey);
if ($articles === false) {
    $articles = $handler->getArticles($categoryId, $limit);
    $cache->write($cacheKey, $articles, 3600);
}
```

### 最佳化查詢

```php
// 使用索引
// 新增至 sql/mysql.sql:
// INDEX `idx_status_date` (`status`, `created_at`)

// 僅選擇需要的列
$handler->getObjects($criteria, false, true); // asArray = true

// 使用分頁
$criteria->setLimit($perPage);
$criteria->setStart($offset);
```

## 測試

### 編寫單元測試

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

## 相關文件

- Clean-Code - 清潔程式碼原則
- Code-Organization - 專案結構
- Testing - 測試指南
- ../02-Core-Concepts/Security/Security-Best-Practices - 安全指南
