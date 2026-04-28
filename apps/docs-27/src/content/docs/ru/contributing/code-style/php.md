---
title: "Стандарты кодирования PHP"
description: "Стандарты кодирования PHP XOOPS, основанные на PSR-1, PSR-4 и PSR-12"
---

# Стандарты PHP

> XOOPS следует стандартам кодирования PSR-1, PSR-4 и PSR-12 с соглашениями, специфичными для XOOPS.

---

## Обзор стандартов

```mermaid
graph TB
    subgraph "PSR Standards"
        A[PSR-1: Basic Coding]
        B[PSR-4: Autoloading]
        C[PSR-12: Extended Style]
    end

    subgraph "XOOPS Conventions"
        D[Naming Patterns]
        E[File Organization]
        F[Documentation]
    end

    A --> G[Clean Code]
    B --> G
    C --> G
    D --> G
    E --> G
    F --> G
```

---

## Структура файлов

### Теги PHP

```php
<?php
// Всегда используйте полные теги PHP, никогда короткие теги
// Пропустите закрывающий ?> тег в чистых PHP файлах

declare(strict_types=1);

namespace XoopsModules\MyModule;

// Код здесь...
```

### Заголовок файла

```php
<?php

declare(strict_types=1);

/**
 * XOOPS - PHP Content Management System
 *
 * @package    XoopsModules\MyModule
 * @subpackage Class
 * @author     Your Name <email@example.com>
 * @copyright  2026 XOOPS Project
 * @license    GPL-2.0-or-later
 * @link       https://xoops.org
 */

namespace XoopsModules\MyModule;

use XoopsObject;
use XoopsPersistableObjectHandler;
```

---

## Соглашения об именовании

### Классы

```php
// PascalCase для имен классов
class ItemHandler extends XoopsPersistableObjectHandler
{
    // ...
}

// Интерфейсы заканчиваются на "Interface"
interface RepositoryInterface
{
    public function find(int $id): ?object;
}

// Traits заканчиваются на "Trait"
trait TimestampTrait
{
    public function getCreatedAt(): \DateTimeInterface
    {
        // ...
    }
}

// Абстрактные классы начинаются с "Abstract"
abstract class AbstractEntity
{
    // ...
}
```

### Методы и функции

```php
// camelCase для методов
public function getActiveItems(): array
{
    // ...
}

// Глаголы для методов действия
public function createItem(array $data): Item
public function updateItem(int $id, array $data): bool
public function deleteItem(int $id): bool
public function findById(int $id): ?Item
public function hasPermission(string $permission): bool
public function isActive(): bool
public function canEdit(): bool
```

### Переменные и свойства

```php
class Item
{
    // camelCase для свойств
    private int $itemId;
    private string $itemTitle;
    private bool $isPublished;
    private array $categoryIds;

    // camelCase для переменных
    public function process(): void
    {
        $itemCount = 0;
        $activeItems = [];
        $isValid = true;
    }
}
```

### Константы

```php
// UPPER_SNAKE_CASE для констант
class Config
{
    public const DEFAULT_ITEMS_PER_PAGE = 10;
    public const MAX_UPLOAD_SIZE = 10485760;
    public const CACHE_LIFETIME = 3600;
}

// Или в вызовах define()
define('XOOPS_ROOT_PATH', '/path/to/xoops');
define('MYMODULE_VERSION', '1.0.0');
```

---

## Структура класса

```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule;

use XoopsDatabase;
use XoopsPersistableObjectHandler;

/**
 * Обработчик для объектов Item
 *
 * @package XoopsModules\MyModule
 */
class ItemHandler extends XoopsPersistableObjectHandler
{
    // 1. Константы
    public const TABLE_NAME = 'mymodule_items';

    // 2. Свойства (порядок видимости: public, protected, private)
    public int $defaultLimit = 10;

    protected string $table;

    private XoopsDatabase $db;

    // 3. Конструктор
    public function __construct(?XoopsDatabase $db = null)
    {
        $this->db = $db ?? \XoopsDatabaseFactory::getDatabaseConnection();
        parent::__construct($this->db, self::TABLE_NAME, Item::class, 'id', 'title');
    }

    // 4. Публичные методы
    public function getPublishedItems(int $limit = 10): array
    {
        $criteria = new \CriteriaCompo();
        $criteria->add(new \Criteria('status', 'published'));
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    public function findBySlug(string $slug): ?Item
    {
        $criteria = new \Criteria('slug', $slug);
        $items = $this->getObjects($criteria);

        return $items[0] ?? null;
    }

    // 5. Защищенные методы
    protected function validateItem(Item $item): bool
    {
        // Логика валидации
        return true;
    }

    // 6. Приватные методы
    private function sanitizeInput(string $input): string
    {
        return htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    }
}
```

---

## Правила форматирования

### Отступы и интервалы

```php
// Используйте 4 пробела для отступа (не табуляции)
class Example
{
    public function method(): void
    {
        if ($condition) {
            // 4 пробела
            foreach ($items as $item) {
                // 8 пробелов
                $this->process($item);
            }
        }
    }
}

// Одна пустая строка между методами
public function methodOne(): void
{
    // ...
}

public function methodTwo(): void
{
    // ...
}

// Без пробелов в конце
// Файлы заканчиваются одной новой строкой
```

### Длина строки

```php
// Максимум 120 символов на строку
// Разбивайте длинные строки логически

// Долгие вызовы методов
$result = $this->someHandler->processComplexOperation(
    $parameter1,
    $parameter2,
    $parameter3,
    $parameter4
);

// Долгие массивы
$config = [
    'option1' => 'value1',
    'option2' => 'value2',
    'option3' => 'value3',
];

// Долгие условия
if ($condition1
    && $condition2
    && $condition3
) {
    // ...
}
```

### Управляющие структуры

```php
// if/elseif/else
if ($condition) {
    // code
} elseif ($otherCondition) {
    // code
} else {
    // code
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
    // code
}

// for
for ($i = 0; $i < $count; $i++) {
    // code
}
```

---

## Объявления типов

```php
<?php

declare(strict_types=1);

class TypeExample
{
    // Типы свойств (PHP 7.4+)
    private int $id;
    private string $title;
    private ?string $description = null;
    private array $tags = [];
    private bool $isActive = false;

    // Конструктор с типизированными параметрами
    public function __construct(
        int $id,
        string $title,
        ?string $description = null
    ) {
        $this->id = $id;
        $this->title = $title;
        $this->description = $description;
    }

    // Объявления типов возврата
    public function getId(): int
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    // Типы возврата, допускающие null
    public function getDescription(): ?string
    {
        return $this->description;
    }

    // Объединенные типы (PHP 8.0+)
    public function getValue(): int|string
    {
        return $this->value;
    }

    // Тип возврата void
    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    // Возврат массива с docblock для содержимого
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

## Документация

### DocBlock класса

```php
/**
 * Обрабатывает операции CRUD для сущностей Article
 *
 * Этот обработчик предоставляет методы для создания, чтения, обновления
 * и удаления статей в базе данных.
 *
 * @package    XoopsModules\Publisher
 * @subpackage Handler
 * @author     XOOPS Development Team
 * @since      1.0.0
 */
class ArticleHandler extends XoopsPersistableObjectHandler
{
```

### DocBlock метода

```php
/**
 * Получить статьи по категории
 *
 * Выбирает опубликованные статьи, принадлежащие определенной категории,
 * упорядоченные по дате создания в порядке убывания.
 *
 * @param int  $categoryId Идентификатор категории
 * @param int  $limit      Максимум статей для возврата
 * @param int  $offset     Начальное смещение для пагинации
 * @param bool $published  Возвращать только опубликованные статьи
 *
 * @return Article[] Массив объектов Article
 *
 * @throws \InvalidArgumentException Если ID категории недействителен
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

## Конфигурация инструментов

### PHP CS Fixer

```php
// .php-cs-fixer.php
<?php

$finder = PhpCsFixer\Finder::create()
    ->in(__DIR__ . '/class')
    ->in(__DIR__ . '/src');

return (new PhpCsFixer\Config())
    ->setRules([
        '@PSR12' => true,
        'array_syntax' => ['syntax' => 'short'],
        'ordered_imports' => ['sort_algorithm' => 'alpha'],
        'no_unused_imports' => true,
        'declare_strict_types' => true,
    ])
    ->setFinder($finder);
```

### PHPStan

```yaml
# phpstan.neon
parameters:
    level: 6
    paths:
        - class/
        - src/
    ignoreErrors:
        - '#Call to an undefined method XoopsObject::#'
```

---

## Связанная документация

- Стандарты JavaScript
- Организация кода
- Рекомендации pull request

---

#xoops #php #coding-standards #psr #best-practices
