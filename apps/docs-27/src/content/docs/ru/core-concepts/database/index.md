---
title: "Слой базы данных"
description: "Всестороннее руководство по абстракции базы данных XOOPS, XoopsObject, обработчики и система Criteria"
---

# Слой базы данных

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

> Понимание абстракции базы данных XOOPS, персистентности объектов и построения запросов.

:::tip[Защитите своё будущее с данными]
Паттерн handler/Criteria работает в обеих версиях. Для подготовки к XOOPS 4.0 рассмотрите возможность обёртки обработчиков в [классы Repository](../../03-Module-Development/Patterns/Repository-Pattern.md) для лучшей тестируемости. См. [Выбор паттерна доступа к данным](../../03-Module-Development/Choosing-Data-Access-Pattern.md).
:::

---

## Обзор

Слой базы данных XOOPS обеспечивает надёжную абстракцию MySQL/MariaDB, включающую:

- **Паттерн Factory** - централизованное управление подключением к базе данных
- **Объектно-реляционное отображение** - XoopsObject и обработчики
- **Построение запросов** - система Criteria для сложных запросов
- **Переиспользование подключений** - одно подключение через фабрику-синглтон (не пулирование)

---

## Архитектура

```mermaid
flowchart TB
    subgraph App["📱 Код приложения"]
        AppCode["Ваш код модуля"]
    end

    subgraph Handler["🔧 XoopsPersistableObjectHandler"]
        HandlerMethods["create() | get() | insert() | delete()<br/>getObjects() | getCount() | deleteAll()"]
    end

    subgraph Object["📦 XoopsObject"]
        ObjectMethods["initVar() | getVar() | setVar() | toArray()"]
    end

    subgraph Criteria["🔍 Система Criteria"]
        CriteriaMethods["Criteria | CriteriaCompo | CriteriaElement"]
    end

    subgraph Database["🗄️ XoopsDatabase"]
        DatabaseMethods["query() | queryF() | fetchArray() | insert()"]
    end

    subgraph Storage["💾 MySQL / MariaDB"]
        DB[(База данных)]
    end

    App --> Handler
    Handler --> Object
    Object --> Criteria
    Criteria --> Database
    Database --> Storage

    style App fill:#e3f2fd,stroke:#1976d2
    style Handler fill:#e8f5e9,stroke:#388e3c
    style Object fill:#fff3e0,stroke:#f57c00
    style Criteria fill:#f3e5f5,stroke:#7b1fa2
    style Database fill:#fce4ec,stroke:#c2185b
    style Storage fill:#eceff1,stroke:#546e7a
```

---

## Подключение к базе данных

### Получение подключения

```php
// Рекомендуется: используйте глобальный экземпляр базы данных
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// Legacy: глобальная переменная (всё ещё работает)
global $xoopsDB;
```

### XoopsDatabaseFactory

Паттерн фабрики гарантирует повторное использование одного подключения к базе данных:

```php
<?php

class XoopsDatabaseFactory
{
    private static ?XoopsDatabase $instance = null;

    public static function getDatabaseConnection(): XoopsDatabase
    {
        if (self::$instance === null) {
            self::$instance = new XoopsMySQLDatabase();
        }
        return self::$instance;
    }
}
```

---

## XoopsObject

Базовый класс для всех объектов данных в XOOPS.

### Определение объекта

```php
<?php

namespace XoopsModules\MyModule;

class Article extends \XoopsObject
{
    public function __construct()
    {
        $this->initVar('article_id', \XOBJ_DTYPE_INT, null, false);
        $this->initVar('category_id', \XOBJ_DTYPE_INT, 0, true);
        $this->initVar('title', \XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', \XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('author_id', \XOBJ_DTYPE_INT, 0, true);
        $this->initVar('status', \XOBJ_DTYPE_TXTBOX, 'draft', true, 20);
        $this->initVar('views', \XOBJ_DTYPE_INT, 0, false);
        $this->initVar('created', \XOBJ_DTYPE_INT, time(), false);
        $this->initVar('updated', \XOBJ_DTYPE_INT, 0, false);
    }
}
```

### Типы данных

| Константа | Тип | Описание |
|-----------|-----|---------|
| `XOBJ_DTYPE_INT` | Integer | Числовые значения |
| `XOBJ_DTYPE_TXTBOX` | String | Короткий текст (< 255 символов) |
| `XOBJ_DTYPE_TXTAREA` | Text | Длинное содержимое текста |
| `XOBJ_DTYPE_EMAIL` | Email | Адреса электронной почты |
| `XOBJ_DTYPE_URL` | URL | Веб-адреса |
| `XOBJ_DTYPE_FLOAT` | Float | Десятичные числа |
| `XOBJ_DTYPE_ARRAY` | Array | Сериализованные массивы |
| `XOBJ_DTYPE_OTHER` | Mixed | Сырые данные |

### Работа с объектами

```php
// Создать новый объект
$article = new Article();

// Установить значения
$article->setVar('title', 'My Article');
$article->setVar('content', 'Article content here...');
$article->setVar('category_id', 5);
$article->setVar('author_id', $xoopsUser->getVar('uid'));

// Получить значения
$title = $article->getVar('title');           // Сырое значение
$titleDisplay = $article->getVar('title', 'e'); // Для редактирования (HTML-сущности)
$titleShow = $article->getVar('title', 's');    // Для отображения (санитизировано)

// Массовое присваивание из массива
$article->assignVars([
    'title' => 'New Title',
    'status' => 'published'
]);

// Преобразовать в массив
$data = $article->toArray();
```

---

## Обработчики объектов

### XoopsPersistableObjectHandler

Класс обработчика управляет операциями CRUD для экземпляров XoopsObject.

```php
<?php

namespace XoopsModules\MyModule;

class ArticleHandler extends \XoopsPersistableObjectHandler
{
    public function __construct(\XoopsDatabase $db = null)
    {
        parent::__construct(
            $db,
            'mymodule_articles',  // Имя таблицы
            Article::class,       // Класс объекта
            'article_id',         // Первичный ключ
            'title'               // Поле идентификатора
        );
    }
}
```

### Методы обработчика

```php
// Получить экземпляр обработчика
$articleHandler = xoops_getModuleHandler('article', 'mymodule');

// Создать новый объект
$article = $articleHandler->create();

// Получить по ID
$article = $articleHandler->get(123);

// Вставить (создать или обновить)
$success = $articleHandler->insert($article);

// Удалить
$success = $articleHandler->delete($article);

// Получить несколько объектов
$articles = $articleHandler->getObjects($criteria);

// Получить количество
$count = $articleHandler->getCount($criteria);

// Получить как массив (ключ => значение)
$list = $articleHandler->getList($criteria);

// Удалить несколько
$deleted = $articleHandler->deleteAll($criteria);
```

### Пользовательские методы обработчика

```php
<?php

namespace XoopsModules\MyModule;

class ArticleHandler extends \XoopsPersistableObjectHandler
{
    // ... конструктор

    /**
     * Получить опубликованные статьи
     */
    public function getPublished(int $limit = 10, int $start = 0): array
    {
        $criteria = new \CriteriaCompo();
        $criteria->add(new \Criteria('status', 'published'));
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);
        $criteria->setStart($start);

        return $this->getObjects($criteria);
    }

    /**
     * Получить статьи по категории
     */
    public function getByCategory(int $categoryId, int $limit = 10): array
    {
        $criteria = new \CriteriaCompo();
        $criteria->add(new \Criteria('category_id', $categoryId));
        $criteria->add(new \Criteria('status', 'published'));
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    /**
     * Получить статьи по автору
     */
    public function getByAuthor(int $authorId): array
    {
        $criteria = new \Criteria('author_id', $authorId);
        return $this->getObjects($criteria);
    }

    /**
     * Увеличить счётчик просмотров
     */
    public function incrementViews(int $articleId): bool
    {
        $sql = sprintf(
            'UPDATE %s SET views = views + 1 WHERE article_id = %d',
            $this->table,
            $articleId
        );
        return $this->db->queryF($sql) !== false;
    }

    /**
     * Получить популярные статьи
     */
    public function getPopular(int $limit = 5): array
    {
        $criteria = new \CriteriaCompo();
        $criteria->add(new \Criteria('status', 'published'));
        $criteria->setSort('views');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }
}
```

---

## Система Criteria

Система Criteria обеспечивает мощный, объектно-ориентированный способ построения SQL WHERE предложений.

### Базовая Criteria

```php
// Простое равенство
$criteria = new \Criteria('status', 'published');

// С оператором
$criteria = new \Criteria('views', 100, '>=');

// Сравнение столбцов
$criteria = new \Criteria('updated', 'created', '>');
```

### CriteriaCompo (Комбинирование Criteria)

```php
$criteria = new \CriteriaCompo();

// Условия И (по умолчанию)
$criteria->add(new \Criteria('status', 'published'));
$criteria->add(new \Criteria('category_id', 5));

// Условия ИЛИ
$criteria->add(new \Criteria('featured', 1), 'OR');

// Вложенные условия
$subCriteria = new \CriteriaCompo();
$subCriteria->add(new \Criteria('author_id', 1));
$subCriteria->add(new \Criteria('author_id', 2), 'OR');
$criteria->add($subCriteria);
```

### Сортировка и разбиение на страницы

```php
$criteria = new \CriteriaCompo();
$criteria->add(new \Criteria('status', 'published'));

// Сортировка
$criteria->setSort('created');
$criteria->setOrder('DESC');

// Несколько полей сортировки
$criteria->setSort('category_id, created');
$criteria->setOrder('ASC, DESC');

// Разбиение на страницы
$criteria->setLimit(10);    // Элементов на странице
$criteria->setStart(20);    // Смещение

// Группировка
$criteria->setGroupby('category_id');
```

### Операторы

| Оператор | Пример | Вывод SQL |
|----------|--------|----------|
| `=` | `new Criteria('status', 'published')` | `status = 'published'` |
| `!=` | `new Criteria('status', 'draft', '!=')` | `status != 'draft'` |
| `>` | `new Criteria('views', 100, '>')` | `views > 100` |
| `>=` | `new Criteria('views', 100, '>=')` | `views >= 100` |
| `<` | `new Criteria('views', 100, '<')` | `views < 100` |
| `<=` | `new Criteria('views', 100, '<=')` | `views <= 100` |
| `LIKE` | `new Criteria('title', '%php%', 'LIKE')` | `title LIKE '%php%'` |
| `NOT LIKE` | `new Criteria('title', '%test%', 'NOT LIKE')` | `title NOT LIKE '%test%'` |
| `IN` | `new Criteria('id', '(1,2,3)', 'IN')` | `id IN (1,2,3)` |
| `NOT IN` | `new Criteria('id', '(1,2,3)', 'NOT IN')` | `id NOT IN (1,2,3)` |

### Сложный пример

```php
// Найти опубликованные статьи в конкретных категориях,
// с поисковым термином в заголовке, отсортированные по просмотрам
$criteria = new \CriteriaCompo();

// Статус должен быть опубликован
$criteria->add(new \Criteria('status', 'published'));

// В категориях 1, 2 или 3
$criteria->add(new \Criteria('category_id', '(1, 2, 3)', 'IN'));

// Заголовок содержит поисковый термин
$searchTerm = '%' . $db->escape($searchQuery) . '%';
$criteria->add(new \Criteria('title', $searchTerm, 'LIKE'));

// Создано за последние 30 дней
$thirtyDaysAgo = time() - (30 * 24 * 60 * 60);
$criteria->add(new \Criteria('created', $thirtyDaysAgo, '>='));

// Сортировать по просмотрам в убывающем порядке
$criteria->setSort('views');
$criteria->setOrder('DESC');

// Разбиение на страницы
$criteria->setLimit(10);
$criteria->setStart($page * 10);

$articles = $articleHandler->getObjects($criteria);
$totalCount = $articleHandler->getCount($criteria);
```

---

## Прямые запросы

Для сложных запросов, невозможных с Criteria, используйте прямой SQL.

### Безопасные запросы (чтение)

```php
$db = \XoopsDatabaseFactory::getDatabaseConnection();

$sql = sprintf(
    'SELECT a.*, c.category_name
     FROM %s a
     LEFT JOIN %s c ON a.category_id = c.category_id
     WHERE a.status = %s
     ORDER BY a.created DESC
     LIMIT %d',
    $db->prefix('mymodule_articles'),
    $db->prefix('mymodule_categories'),
    $db->quoteString('published'),
    10
);

$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    // Обработать строку
    echo $row['title'];
}
```

### Запросы на запись

```php
// Вставить
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('mymodule_articles'),
    $db->quoteString($title),
    $db->quoteString($content),
    time()
);
$db->queryF($sql);
$newId = $db->getInsertId();

// Обновить
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('mymodule_articles'),
    $articleId
);
$db->queryF($sql);
$affectedRows = $db->getAffectedRows();

// Удалить
$sql = sprintf(
    "DELETE FROM %s WHERE article_id = %d",
    $db->prefix('mymodule_articles'),
    $articleId
);
$db->queryF($sql);
```

### Экранирование значений

```php
// Экранирование строк
$safeString = $db->quoteString($userInput);
// или
$safeString = $db->escape($userInput);

// Целое число (экранирование не требуется, просто приведение типа)
$safeInt = (int) $userInput;
```

---

## Рекомендации по безопасности

### Всегда экранируйте пользовательский ввод

```php
// НИКОГДА так не делайте
$sql = "SELECT * FROM articles WHERE title = '$_GET[title]'"; // SQL Injection!

// ДЕЛАЙТЕ так
$title = $db->escape($_GET['title']);
$sql = "SELECT * FROM articles WHERE title = '$title'";

// Или лучше используйте Criteria
$criteria = new \Criteria('title', $db->escape($_GET['title']));
```

### Используйте параметризованные запросы (XMF)

```php
use Xmf\Database\TableLoad;

// Безопасная массовая вставка
$tableLoad = new TableLoad('mymodule_articles');
$tableLoad->insert([
    ['title' => 'Article 1', 'content' => 'Content 1'],
    ['title' => 'Article 2', 'content' => 'Content 2'],
]);
```

### Проверяйте типы входных данных

```php
use Xmf\Request;

$id = Request::getInt('id', 0, 'GET');
$title = Request::getString('title', '', 'POST');
```

---

## Пример схемы базы данных

```sql
-- sql/mysql.sql

CREATE TABLE `{PREFIX}_mymodule_articles` (
    `article_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `category_id` INT(11) UNSIGNED NOT NULL DEFAULT 0,
    `title` VARCHAR(255) NOT NULL DEFAULT '',
    `content` TEXT,
    `author_id` INT(11) UNSIGNED NOT NULL DEFAULT 0,
    `status` VARCHAR(20) NOT NULL DEFAULT 'draft',
    `views` INT(11) UNSIGNED NOT NULL DEFAULT 0,
    `created` INT(11) UNSIGNED NOT NULL DEFAULT 0,
    `updated` INT(11) UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (`article_id`),
    KEY `category_id` (`category_id`),
    KEY `author_id` (`author_id`),
    KEY `status` (`status`),
    KEY `created` (`created`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## Связанная документация

- [Детальное изучение системы Criteria](../../04-API-Reference/Kernel/Criteria.md)
- [Паттерны проектирования - Factory](../Architecture/Design-Patterns.md)
- [Предотвращение SQL Injection](../Security/SQL-Injection-Prevention.md)
- [Справочник API XoopsDatabase](../../04-API-Reference/Database/XoopsDatabase.md)

---

#xoops #database #orm #criteria #handlers #mysql
