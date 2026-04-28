---
title: "Операции с базой данных"
---

## Обзор

XOOPS предоставляет уровень абстракции базы данных, поддерживающий как устаревшие процедурные паттерны, так и современные объектно-ориентированные подходы. Это руководство охватывает распространенные операции с базой данных для разработки модулей.

## Подключение к базе данных

### Получение экземпляра базы данных

```php
// Устаревший подход
global $xoopsDB;

// Современный подход через помощник
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// Через помощник XMF
$helper = \Xmf\Module\Helper::getHelper('mymodule');
$db = $GLOBALS['xoopsDB'];
```

## Основные операции

### SELECT запросы

```php
// Простой запрос
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE status = 1";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo $row['title'];
}

// С параметрами (безопасный подход)
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);

// Одна строка
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = " . intval($id);
$result = $db->query($sql);
$row = $db->fetchArray($result);
```

### Операции INSERT

```php
// Основной вставок
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    $db->quoteString($content),
    time()
);
$db->queryF($sql);

// Получить ID последней вставки
$newId = $db->getInsertId();
```

### Операции UPDATE

```php
$sql = sprintf(
    "UPDATE %s SET title = %s, updated = %d WHERE id = %d",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    time(),
    intval($id)
);
$db->queryF($sql);

// Проверить затронутые строки
$affectedRows = $db->getAffectedRows();
```

### Операции DELETE

```php
$sql = sprintf(
    "DELETE FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);
$db->queryF($sql);
```

## Использование Criteria

Система Criteria обеспечивает типобезопасный способ построения запросов:

```php
use Criteria;
use CriteriaCompo;

// Простая критерия
$criteria = new Criteria('status', 1);
$items = $itemHandler->getObjects($criteria);

// Составная критерия
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
$criteria->setStart($offset);

$items = $itemHandler->getObjects($criteria);
$count = $itemHandler->getCount($criteria);
```

### Операторы Criteria

| Оператор | Описание |
|----------|-------------|
| `=` | Равно (по умолчанию) |
| `!=` | Не равно |
| `<` | Меньше чем |
| `>` | Больше чем |
| `<=` | Меньше или равно |
| `>=` | Больше или равно |
| `LIKE` | Сопоставление по шаблону |
| `IN` | В наборе значений |

```php
// LIKE критерия
$criteria = new Criteria('title', '%search%', 'LIKE');

// IN критерия
$criteria = new Criteria('id', '(1,2,3)', 'IN');

// Диапазон дат
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('created', $startDate, '>='));
$criteria->add(new Criteria('created', $endDate, '<='));
```

## Обработчики объектов

### Методы обработчика

```php
$handler = xoops_getModuleHandler('item', 'mymodule');

// Создать новый объект
$item = $handler->create();

// Получить по ID
$item = $handler->get($id);

// Получить несколько
$items = $handler->getObjects($criteria);

// Получить как массив
$items = $handler->getAll($criteria);

// Подсчет
$count = $handler->getCount($criteria);

// Сохранить
$success = $handler->insert($item);

// Удалить
$success = $handler->delete($item);
```

### Пользовательские методы обработчика

```php
class ItemHandler extends \XoopsPersistableObjectHandler
{
    public function getPublished(int $limit = 10): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('status', 'published'));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    public function getByCategory(int $categoryId): array
    {
        $criteria = new Criteria('category_id', $categoryId);
        return $this->getObjects($criteria);
    }
}
```

## Транзакции

```php
// Начать транзакцию
$db->query('START TRANSACTION');

try {
    // Выполнить несколько операций
    $db->queryF($sql1);
    $db->queryF($sql2);
    $db->queryF($sql3);

    // Коммит, если все удалось
    $db->query('COMMIT');
} catch (\Exception $e) {
    // Откат при ошибке
    $db->query('ROLLBACK');
    throw $e;
}
```

## Подготовленные выражения (современные)

```php
// Использование PDO через уровень базы данных XOOPS
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = :id";
$stmt = $db->prepare($sql);
$stmt->execute(['id' => $id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
```

## Управление схемой

### Создание таблиц

```sql
-- sql/mysql.sql
CREATE TABLE `{PREFIX}_mymodule_items` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT,
    `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    `author_id` INT(11) UNSIGNED NOT NULL,
    `created` INT(11) UNSIGNED NOT NULL,
    `updated` INT(11) UNSIGNED DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_author` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Миграции

```php
// migrations/001_create_items.php
return new class {
    public function up(\XoopsDatabase $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS " . $db->prefix('mymodule_items') . " (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            created INT UNSIGNED NOT NULL
        )";
        $db->queryF($sql);
    }

    public function down(\XoopsDatabase $db): void
    {
        $sql = "DROP TABLE IF EXISTS " . $db->prefix('mymodule_items');
        $db->queryF($sql);
    }
};
```

## Лучшие практики

1. **Всегда цитируйте строки** - Используйте `$db->quoteString()` для пользовательского ввода
2. **Используйте Intval** - Приводите целые числа с `intval()` или объявлениями типов
3. **Предпочитайте обработчики** - Используйте обработчики объектов вместо сырого SQL, когда это возможно
4. **Используйте Criteria** - Создавайте запросы с Criteria для типобезопасности
5. **Обработайте ошибки** - Проверьте возвращаемые значения и обработайте сбои
6. **Используйте транзакции** - Оберните связанные операции в транзакции

## Связанная документация

- ../04-API-Reference/Kernel/Criteria - Построение запросов с Criteria
- ../04-API-Reference/Core/XoopsObjectHandler - Паттерн обработчика
- ../02-Core-Concepts/Database/Database-Layer - Абстракция базы данных
- Database/Database-Schema - Руководство по проектированию схемы
