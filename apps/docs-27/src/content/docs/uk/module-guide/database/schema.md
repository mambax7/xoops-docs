---
title: "Проектування схеми бази даних"
---
## Огляд

Належний дизайн схеми бази даних має вирішальне значення для продуктивності та зручності обслуговування модуля XOOPS. Цей посібник охоплює найкращі практики щодо дизайну таблиць, зв’язків, індексування та міграцій.

## Правила іменування таблиць

### Стандартний формат
```
{prefix}_{modulename}_{tablename}
```
приклади:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (сполучний стіл)

### У файлах схем

Використовуйте заповнювач `{PREFIX}`:
```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```
## Типи стовпців

### Рекомендовані типи

| Дані | MySQL Тип | PHP Тип | Опис |
|------|-----------|----------|-------------|
| ID (ULID) | `VARCHAR(26)` | `string` | Ідентифікатори ULID |
| ID (Авто) | `INT UNSIGNED AUTO_INCREMENT` | `int` | Послідовні ідентифікатори |
| Короткий текст | `VARCHAR(n)` | `string` | До 255 символів |
| Довгий текст | `TEXT` | `string` | Необмежений текст |
| Rich Text | `MEDIUMTEXT` | `string` | Зміст HTML |
| Логічний | `TINYINT(1)` | `bool` | True/false |
| Enum | `ENUM(...)` | `string` | Виправлені параметри |
| Дата | `DATE` | `DateTimeImmutable` | Тільки дата |
| ДатаЧас | `DATETIME` | `DateTimeImmutable` | Дата і час |
| Мітка часу | `INT UNSIGNED` | `int` | Мітка часу Unix |
| Ціна | `DECIMAL(10,2)` | `float` | Валютні цінності |
| JSON | `JSON` | `array` | Структуровані дані |

### Приклад схеми сутності
```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    `id` VARCHAR(26) NOT NULL COMMENT 'ULID identifier',
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `content` MEDIUMTEXT,
    `summary` TEXT,
    `status` ENUM('draft', 'pending', 'published', 'archived') DEFAULT 'draft',
    `author_id` INT UNSIGNED NOT NULL,
    `category_id` INT UNSIGNED,
    `views` INT UNSIGNED DEFAULT 0,
    `is_featured` TINYINT(1) DEFAULT 0,
    `published_at` DATETIME DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_slug` (`slug`),
    KEY `idx_status` (`status`),
    KEY `idx_author` (`author_id`),
    KEY `idx_category` (`category_id`),
    KEY `idx_published` (`published_at`),
    KEY `idx_featured` (`is_featured`, `published_at`),

    CONSTRAINT `fk_article_author`
        FOREIGN KEY (`author_id`) REFERENCES `{PREFIX}_users` (`uid`)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_article_category`
        FOREIGN KEY (`category_id`) REFERENCES `{PREFIX}_mymodule_categories` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```
## Стосунки

### Один до багатьох
```sql
-- Categories (one)
CREATE TABLE `{PREFIX}_mymodule_categories` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);

-- Articles (many)
CREATE TABLE `{PREFIX}_mymodule_articles` (
    `id` VARCHAR(26) PRIMARY KEY,
    `category_id` INT UNSIGNED,
    FOREIGN KEY (`category_id`) REFERENCES `{PREFIX}_mymodule_categories` (`id`)
);
```
### Багато-до-багатьох
```sql
-- Articles
CREATE TABLE `{PREFIX}_mymodule_articles` (
    `id` VARCHAR(26) PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL
);

-- Tags
CREATE TABLE `{PREFIX}_mymodule_tags` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    UNIQUE KEY (`name`)
);

-- Junction table
CREATE TABLE `{PREFIX}_mymodule_article_tags` (
    `article_id` VARCHAR(26) NOT NULL,
    `tag_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`article_id`, `tag_id`),
    FOREIGN KEY (`article_id`) REFERENCES `{PREFIX}_mymodule_articles` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tag_id`) REFERENCES `{PREFIX}_mymodule_tags` (`id`) ON DELETE CASCADE
);
```
### Самопосилання (ієрархія)
```sql
CREATE TABLE `{PREFIX}_mymodule_categories` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `parent_id` INT UNSIGNED DEFAULT NULL,
    `name` VARCHAR(255) NOT NULL,
    `path` VARCHAR(1000) COMMENT 'Materialized path: /1/5/12/',
    `depth` TINYINT UNSIGNED DEFAULT 0,

    KEY `idx_parent` (`parent_id`),
    KEY `idx_path` (`path`(255)),

    FOREIGN KEY (`parent_id`) REFERENCES `{PREFIX}_mymodule_categories` (`id`)
        ON DELETE SET NULL
);
```
## Стратегія індексування

### Коли індексувати

| Сценарій | Тип індексу |
|----------|-----------|
| Первинний ключ | ПЕРВИННИЙ |
| Унікальне обмеження | УНІКАЛЬНЕ |
| Зовнішній ключ | Звичайний КЛЮЧ |
| Стовпець пропозиції WHERE | Звичайний КЛЮЧ |
| ПОРЯДОК ЗА колонкою | Звичайний КЛЮЧ |
| Повнотекстовий пошук | ПОВНИЙ ТЕКСТ |

### Композитні індекси

Порядок має значення - першим стовпець із найбільш вибраним значенням:
```sql
-- Good: matches WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Query optimization
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```
### Індекси покриття

Включіть усі запитувані стовпці, щоб уникнути пошуку в таблиці:
```sql
-- Covers: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```
## Міграції

### Структура файлу міграції
```php
// migrations/001_create_articles.php
<?php

return new class {
    public function up(\XoopsDatabase $db): void
    {
        $prefix = $db->prefix('mymodule_articles');

        $sql = "CREATE TABLE IF NOT EXISTS `{$prefix}` (
            `id` VARCHAR(26) NOT NULL,
            `title` VARCHAR(255) NOT NULL,
            `created_at` DATETIME NOT NULL,
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

        $db->queryF($sql);
    }

    public function down(\XoopsDatabase $db): void
    {
        $prefix = $db->prefix('mymodule_articles');
        $db->queryF("DROP TABLE IF EXISTS `{$prefix}`");
    }
};
```
### Додавання стовпців
```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```
## Найкращі практики

1. **Використовуйте InnoDB** - підтримує транзакції та зовнішні ключі
2. **UTF8MB4** - повна підтримка Unicode, включаючи емодзі
3. **NOT NULL** - Використовуйте значення за замовчуванням замість стовпців із значенням NULL, коли це можливо
4. **Відповідні типи** - не використовуйте TEXT для коротких рядків
5. **Економне індексування** - кожен індекс сповільнює запис
6. **Схема документа** - Додайте КОМЕНТАР до стовпців
7. **Уникайте зарезервованих слів** - не використовуйте `order`, `group`, `key` як назви стовпців

## Пов'язана документація

- ../Database-Operations - Виконання запиту
- ../../04-API-Reference/Database/Criteria - Побудова запиту
- Міграції - Керування версіями схеми
- ../../01-Getting-Started/Configuration/Performance-Optimization - Оптимізація запитів