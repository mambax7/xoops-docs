---
title: "PHP 編碼標準"
description: "基於 PSR-1、PSR-4 和 PSR-12 的 XOOPS PHP 編碼標準"
---

# PHP 標準

> XOOPS 遵循 PSR-1、PSR-4 和 PSR-12 編碼標準以及 XOOPS 特定慣例。

---

## 標準概述

XOOPS PHP 標準包括：

- **PSR-1：基本編碼** - 基本代碼風格
- **PSR-4：自動加載** - 命名空間和自動加載
- **PSR-12：擴展風格** - 詳細的風格指南
- **XOOPS 慣例** - 特定於項目的慣例

---

## 文件結構

### PHP 標籤

```php
<?php
// 始終使用完整 PHP 標籤，不使用短標籤
// 在純 PHP 文件中省略結束 ?> 標籤

declare(strict_types=1);

namespace XoopsModules\MyModule;

// 代碼在這裡...
```

### 文件頭部

```php
<?php

declare(strict_types=1);

/**
 * XOOPS - PHP 內容管理系統
 *
 * @package    XoopsModules\MyModule
 * @subpackage Class
 * @author     您的名稱 <email@example.com>
 * @copyright  2026 XOOPS 項目
 * @license    GPL-2.0-or-later
 * @link       https://xoops.org
 */

namespace XoopsModules\MyModule;

use XoopsObject;
use XoopsPersistableObjectHandler;
```

---

## 命名約定

### 類

```php
// 類名使用 PascalCase
class ItemHandler extends XoopsPersistableObjectHandler
{
    // ...
}

// 接口以 "Interface" 結尾
interface RepositoryInterface
{
    public function find(int $id): ?object;
}

// 特徵以 "Trait" 結尾
trait TimestampTrait
{
    public function getCreatedAt(): \DateTimeInterface
    {
        // ...
    }
}

// 抽象類以 "Abstract" 為前綴
abstract class AbstractEntity
{
    // ...
}
```

### 方法和函數

```php
// 方法使用 camelCase
public function getActiveItems(): array
{
    // ...
}

// 動詞用於操作方法
public function createItem(array $data): Item
public function updateItem(int $id, array $data): bool
public function deleteItem(int $id): bool
public function findById(int $id): ?Item
public function hasPermission(string $permission): bool
public function isActive(): bool
public function canEdit(): bool
```

### 變量和屬性

```php
class Item
{
    // 屬性使用 camelCase
    private int $itemId;
    private string $itemTitle;
    private bool $isPublished;
    private array $categoryIds;

    // 變量使用 camelCase
    public function process(): void
    {
        $itemCount = 0;
        $activeItems = [];
        $isValid = true;
    }
}
```

### 常量

```php
// 常量使用 UPPER_SNAKE_CASE
class Config
{
    public const DEFAULT_ITEMS_PER_PAGE = 10;
    public const MAX_UPLOAD_SIZE = 10485760;
    public const CACHE_LIFETIME = 3600;
}

// 或在 define() 調用中
define('XOOPS_ROOT_PATH', '/path/to/xoops');
define('MYMODULE_VERSION', '1.0.0');
```

---

## 類結構

```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule;

use XoopsDatabase;
use XoopsPersistableObjectHandler;

/**
 * Item 對象的處理器
 *
 * @package XoopsModules\MyModule
 */
class ItemHandler extends XoopsPersistableObjectHandler
{
    // 1. 常量
    public const TABLE_NAME = 'mymodule_items';

    // 2. 屬性（可見性順序：public、protected、private）
    public int $defaultLimit = 10;

    protected string $table;

    private XoopsDatabase $db;

    // 3. 構造函數
    public function __construct(?XoopsDatabase $db = null)
    {
        $this->db = $db ?? \XoopsDatabaseFactory::getDatabaseConnection();
        parent::__construct($this->db, self::TABLE_NAME, Item::class, 'id', 'title');
    }

    // 4. 公開方法
    public function getPublishedItems(int $limit = 10): array
    {
        $criteria = new \CriteriaCompo();
        $criteria->add(new \Criteria('status', 'published'));
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    // 5. 受保護的方法
    protected function validateItem(Item $item): bool
    {
        // 驗證邏輯
        return true;
    }

    // 6. 私有方法
    private function sanitizeInput(string $input): string
    {
        return htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    }
}
```

---

## 格式化規則

### 縮進和間距

```php
// 使用 4 個空格縮進（不是製表符）
class Example
{
    public function method(): void
    {
        if ($condition) {
            // 4 個空格
            foreach ($items as $item) {
                // 8 個空格
                $this->process($item);
            }
        }
    }
}

// 方法之間有一個空行
public function methodOne(): void
{
    // ...
}

public function methodTwo(): void
{
    // ...
}

// 沒有尾隨空格
// 文件以單個換行符結尾
```

### 行長度

```php
// 每行最多 120 個字符
// 邏輯分割長行

// 長方法調用
$result = $this->someHandler->processComplexOperation(
    $parameter1,
    $parameter2,
    $parameter3,
    $parameter4
);

// 長數組
$config = [
    'option1' => 'value1',
    'option2' => 'value2',
    'option3' => 'value3',
];

// 長條件
if ($condition1
    && $condition2
    && $condition3
) {
    // ...
}
```

### 控制結構

```php
// if/elseif/else
if ($condition) {
    // 代碼
} elseif ($otherCondition) {
    // 代碼
} else {
    // 代碼
}

// switch
switch ($value) {
    case 1:
        doSomething();
        break;

    case 2:
        doSomethingElse();
        break;

    default:
        doDefault();
        break;
}

// try/catch
try {
    $result = $this->riskyOperation();
} catch (SpecificException $e) {
    $this->handleSpecific($e);
} catch (\Exception $e) {
    $this->handleGeneral($e);
} finally {
    $this->cleanup();
}

// foreach
foreach ($items as $key => $value) {
    // 代碼
}
```

---

## 類型聲明

```php
<?php

declare(strict_types=1);

class TypeExample
{
    // 屬性類型 (PHP 7.4+)
    private int $id;
    private string $title;
    private ?string $description = null;
    private array $tags = [];
    private bool $isActive = false;

    // 具有類型參數的構造函數
    public function __construct(
        int $id,
        string $title,
        ?string $description = null
    ) {
        $this->id = $id;
        $this->title = $title;
        $this->description = $description;
    }

    // 返回類型聲明
    public function getId(): int
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    // 可空返回類型
    public function getDescription(): ?string
    {
        return $this->description;
    }

    // Void 返回類型
    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    // 帶 docblock 的數組返回，用於內容
    /**
     * @return Item[]
     */
    public function getItems(): array
    {
        return $this->items;
    }
}
```

---

## 文檔

### 類 DocBlock

```php
/**
 * 處理文章實體的 CRUD 操作
 *
 * 此處理器為創建、讀取、更新和刪除提供方法
 * 數據庫中的文章。
 *
 * @package    XoopsModules\Publisher
 * @subpackage Handler
 * @author     XOOPS 開發團隊
 * @since      1.0.0
 */
class ArticleHandler extends XoopsPersistableObjectHandler
{
```

### 方法 DocBlock

```php
/**
 * 按類別檢索文章
 *
 * 獲取屬於特定類別的已發佈文章，
 * 按創建日期降序排序。
 *
 * @param int  $categoryId 類別標識符
 * @param int  $limit      返回的最大文章數
 * @param int  $offset     分頁的起始偏移量
 * @param bool $published  僅返回已發佈的文章
 *
 * @return Article[] 文章對象數組
 *
 * @throws \InvalidArgumentException 如果類別 ID 無效
 *
 * @since 1.0.0
 */
public function getByCategory(
    int $categoryId,
    int $limit = 10,
    int $offset = 0,
    bool $published = true
): array {
```

---

## 相關文檔

- JavaScript 標準
- 代碼組織
- 拉取請求指南

---

#xoops #php #coding-standards #psr #best-practices
