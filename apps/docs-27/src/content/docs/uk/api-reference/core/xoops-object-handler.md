---
title: "Клас XoopsObjectHandler"
description: "Базовий клас обробника для операцій CRUD на екземплярах XoopsObject із збереженням бази даних"
---
Клас `XoopsObjectHandler` і його розширення `XoopsPersistableObjectHandler` надають стандартизований інтерфейс для виконання операцій CRUD (Створення, читання, оновлення, видалення) на примірниках `XoopsObject`. Це реалізує шаблон Data Mapper, відокремлюючи логіку домену від доступу до бази даних.

## Огляд класу
```php
namespace Xoops\Core;

abstract class XoopsObjectHandler
{
    protected XoopsDatabase $db;

    public function __construct(XoopsDatabase $db);
    abstract public function create(bool $isNew = true);
    abstract public function get(int $id);
    abstract public function insert(XoopsObject $obj, bool $force = false): bool;
    abstract public function delete(XoopsObject $obj, bool $force = false): bool;
}
```
## Ієрархія класів
```
XoopsObjectHandler (Abstract Base)
└── XoopsPersistableObjectHandler (Extended Implementation)
    ├── XoopsUserHandler
    ├── XoopsGroupHandler
    ├── XoopsModuleHandler
    ├── XoopsBlockHandler
    ├── XoopsConfigHandler
    └── [Custom Module Handlers]
```
## XoopsObjectHandler

### Конструктор
```php
public function __construct(XoopsDatabase $db)
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$db` | База даних Xoops | Екземпляр підключення до бази даних |

**Приклад:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```
---

### створити

Створює новий екземпляр об’єкта.
```php
abstract public function create(bool $isNew = true): ?XoopsObject
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$isNew` | bool | Чи є об’єкт новим (за замовчуванням: true) |

**Повертає:** `XoopsObject|null` – новий екземпляр об’єкта

**Приклад:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```
---

### отримати

Отримує об'єкт за його первинним ключем.
```php
abstract public function get(int $id): ?XoopsObject
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$id` | int | Значення первинного ключа |

**Повертає:** `XoopsObject|null` - екземпляр об'єкта або null, якщо не знайдено

**Приклад:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```
---

### вставка

Зберігає об’єкт у базі даних (вставити або оновити).
```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$obj` | XoopsObject | Об'єкт для збереження |
| `$force` | bool | Примусова операція, навіть якщо об'єкт не змінений |

**Повертає:** `bool` – вірно в разі успіху

**Приклад:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'testuser');
$user->setVar('email', 'test@example.com');

if ($handler->insert($user)) {
    echo "User saved with ID: " . $user->getVar('uid');
} else {
    echo "Save failed: " . implode(', ', $user->getErrors());
}
```
---

### видалити

Видаляє об’єкт із бази даних.
```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$obj` | XoopsObject | Об'єкт для видалення |
| `$force` | bool | Примусове видалення |

**Повертає:** `bool` – вірно в разі успіху

**Приклад:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```
---

## XoopsPersistableObjectHandler

`XoopsPersistableObjectHandler` розширює `XoopsObjectHandler` додатковими методами для запитів і масових операцій.

### Конструктор
```php
public function __construct(
    XoopsDatabase $db,
    string $table,
    string $className,
    string $keyName,
    string $identifierName = ''
)
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$db` | База даних Xoops | Підключення до бази даних |
| `$table` | рядок | Назва таблиці (без префікса) |
| `$className` | рядок | Повне ім'я класу об'єкта |
| `$keyName` | рядок | Назва поля первинного ключа |
| `$identifierName` | рядок | Зрозуміле поле ідентифікатора |

**Приклад:**
```php
class ArticleHandler extends XoopsPersistableObjectHandler
{
    public function __construct(XoopsDatabase $db)
    {
        parent::__construct(
            $db,
            'mymodule_articles',    // Table name
            'Article',               // Class name
            'article_id',            // Primary key
            'title'                  // Identifier field
        );
    }
}
```
---

### getObjects

Отримує кілька об’єктів, які відповідають критеріям.
```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$criteria` | КритерійЕлемент | Критерії запиту (необов'язково) |
| `$idAsKey` | bool | Використовувати первинний ключ як ключ масиву |
| `$asObject` | bool | Повертає об'єкти (true) або масиви (false) |

**Повертає:** `array` - масив об'єктів або асоціативний масив

**Приклад:**
```php
$handler = xoops_getHandler('user');

// Get all active users
$criteria = new Criteria('level', 0, '>');
$users = $handler->getObjects($criteria);

// Get users with ID as key
$users = $handler->getObjects($criteria, true);
echo $users[1]->getVar('uname'); // Access by ID

// Get as arrays instead of objects
$usersArray = $handler->getObjects($criteria, false, false);
foreach ($usersArray as $userData) {
    echo $userData['uname'];
}
```
---

### getCount

Підраховує об'єкти, що відповідають критеріям.
```php
public function getCount(CriteriaElement $criteria = null): int
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$criteria` | КритерійЕлемент | Критерії запиту (необов'язково) |

**Повертає:** `int` - кількість відповідних об'єктів

**Приклад:**
```php
$handler = xoops_getHandler('user');

// Count all users
$totalUsers = $handler->getCount();

// Count active users
$criteria = new Criteria('level', 0, '>');
$activeUsers = $handler->getCount($criteria);

echo "Total: $totalUsers, Active: $activeUsers";
```
---

### getAll

Отримує всі об’єкти (псевдонім getObjects без критеріїв).
```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$criteria` | КритерійЕлемент | Критерії запиту |
| `$fields` | масив | Спеціальні поля для отримання |
| `$asObject` | bool | Повернути як об'єкти |
| `$idAsKey` | bool | Використовувати ID як ключ масиву |

**Приклад:**
```php
$handler = xoops_getHandler('module');

// Get all modules
$modules = $handler->getAll();

// Get only specific fields
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```
---

### getIds

Отримує лише первинні ключі відповідних об’єктів.
```php
public function getIds(CriteriaElement $criteria = null): array
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$criteria` | КритерійЕлемент | Критерії запиту |

**Повертає:** `array` – масив значень первинного ключа

**Приклад:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Array of admin user IDs
```
---

### getList

Отримує список ключ-значення для спадних меню.
```php
public function getList(CriteriaElement $criteria = null): array
```
**Повертає:** `array` - Асоціативний масив [id => ідентифікатор]

**Приклад:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// For a select dropdown
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```
---

### видалити все

Видаляє всі об’єкти, що відповідають критеріям.
```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$criteria` | КритерійЕлемент | Критерії об'єктів для видалення |
| `$force` | bool | Примусове видалення |
| `$asObject` | bool | Завантажити об'єкти перед видаленням (ініціює події) |

**Повертає:** `bool` – вірно в разі успіху

**Приклад:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Delete all comments for a specific article
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Delete with object loading (triggers delete events)
$handler->deleteAll($criteria, true, true);
```
---

### оновити все

Оновлює значення поля для всіх відповідних об’єктів.
```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$fieldname` | рядок | Поле для оновлення |
| `$fieldvalue` | змішаний | Нове значення |
| `$criteria` | КритерійЕлемент | Критерії об'єктів для оновлення |
| `$force` | bool | Примусове оновлення |

**Повертає:** `bool` – вірно в разі успіху

**Приклад:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Mark all articles by an author as draft
$criteria = new Criteria('author_id', $authorId);
$handler->updateAll('published', 0, $criteria);

// Update view count
$criteria = new Criteria('article_id', $id);
$handler->updateAll('views', $views + 1, $criteria);
```
---

### вставка (розширена)

Розширений метод вставки з додатковою функціональністю.
```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```
**Поведінка:**
- Якщо об'єкт новий (`isNew() === true`): INSERT
- Якщо об'єкт існує (`isNew() === false`): ОНОВИТИ
- Автоматично викликає `cleanVars()`
— Встановлює автоматичне збільшення ідентифікатора для нових об’єктів

**Приклад:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Create new article
$article = $handler->create();
$article->setVar('title', 'New Article');
$article->setVar('content', 'Content here');
$handler->insert($article);
echo "Created with ID: " . $article->getVar('article_id');

// Update existing article
$article = $handler->get(5);
$article->setVar('title', 'Updated Title');
$handler->insert($article);
```
---

## Допоміжні функції

### xoops_getHandler

Глобальна функція для отримання основного обробника.
```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$name` | рядок | Ім'я обробника (користувач, модуль, група тощо) |
| `$optional` | bool | Повернути значення null замість виклику помилки |

**Приклад:**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```
---

### xoops_getModuleHandler

Отримує спеціальний обробник модуля.
```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$name` | рядок | Ім'я обробника |
| `$dirname` | рядок | Назва каталогу модуля |
| `$optional` | bool | Повернути null у разі помилки |

**Приклад:**
```php
// Get handler from current module
$articleHandler = xoops_getModuleHandler('article');

// Get handler from specific module
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```
---

## Створення власних обробників

### Реалізація базового обробника
```php
<?php
namespace XoopsModules\MyModule;

use XoopsPersistableObjectHandler;
use XoopsDatabase;
use CriteriaElement;
use Criteria;
use CriteriaCompo;

/**
 * Handler for Article objects
 */
class ArticleHandler extends XoopsPersistableObjectHandler
{
    /**
     * Constructor
     */
    public function __construct(XoopsDatabase $db = null)
    {
        parent::__construct(
            $db,
            'mymodule_articles',
            Article::class,
            'article_id',
            'title'
        );
    }

    /**
     * Get published articles
     */
    public function getPublished(int $limit = 10, int $start = 0): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('published', 1));
        $criteria->add(new Criteria('publish_date', time(), '<='));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);
        $criteria->setStart($start);

        return $this->getObjects($criteria);
    }

    /**
     * Get articles by author
     */
    public function getByAuthor(int $authorId, bool $publishedOnly = true): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('author_id', $authorId));

        if ($publishedOnly) {
            $criteria->add(new Criteria('published', 1));
        }

        $criteria->setSort('created');
        $criteria->setOrder('DESC');

        return $this->getObjects($criteria);
    }

    /**
     * Get articles by category
     */
    public function getByCategory(int $categoryId, int $limit = 0): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('category_id', $categoryId));
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');

        if ($limit > 0) {
            $criteria->setLimit($limit);
        }

        return $this->getObjects($criteria);
    }

    /**
     * Search articles
     */
    public function search(string $query, array $fields = ['title', 'content']): array
    {
        $criteria = new CriteriaCompo();
        $searchCriteria = new CriteriaCompo();

        foreach ($fields as $field) {
            $searchCriteria->add(
                new Criteria($field, '%' . $query . '%', 'LIKE'),
                'OR'
            );
        }

        $criteria->add($searchCriteria);
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');

        return $this->getObjects($criteria);
    }

    /**
     * Get popular articles by view count
     */
    public function getPopular(int $limit = 5): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('views');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    /**
     * Increment view count
     */
    public function incrementViews(int $articleId): bool
    {
        $sql = sprintf(
            "UPDATE %s SET views = views + 1 WHERE article_id = %d",
            $this->db->prefix($this->table),
            $articleId
        );

        return $this->db->queryF($sql) !== false;
    }

    /**
     * Override insert for custom behavior
     */
    public function insert(\XoopsObject $obj, bool $force = false): bool
    {
        // Set updated timestamp
        $obj->setVar('updated', time());

        // If new, set created timestamp
        if ($obj->isNew()) {
            $obj->setVar('created', time());
        }

        return parent::insert($obj, $force);
    }

    /**
     * Override delete for cascade operations
     */
    public function delete(\XoopsObject $obj, bool $force = false): bool
    {
        // Delete associated comments
        $commentHandler = xoops_getModuleHandler('comment', 'mymodule');
        $criteria = new Criteria('article_id', $obj->getVar('article_id'));
        $commentHandler->deleteAll($criteria);

        return parent::delete($obj, $force);
    }
}
```
### Використання спеціального обробника
```php
// Get the handler
$articleHandler = xoops_getModuleHandler('article', 'mymodule');

// Create a new article
$article = $articleHandler->create();
$article->setVars([
    'title' => 'My New Article',
    'content' => 'Article content here...',
    'author_id' => $xoopsUser->getVar('uid'),
    'category_id' => 1,
    'published' => 1,
    'publish_date' => time()
]);

if ($articleHandler->insert($article)) {
    redirect_header('article.php?id=' . $article->getVar('article_id'), 2, 'Article created');
}

// Get published articles
$articles = $articleHandler->getPublished(10);

// Search articles
$results = $articleHandler->search('xoops');

// Get popular articles
$popular = $articleHandler->getPopular(5);

// Update view count
$articleHandler->incrementViews($articleId);
```
## Найкращі практики

1. **Використовуйте критерії для запитів**: завжди використовуйте об’єкти критеріїв для типобезпечних запитів

2. **Розширення для користувальницьких методів**: додайте до обробників методи запиту для домену

3. **Перевизначити insert/delete**: додайте каскадні операції та мітки часу в перевизначеннях

4. **Використовуйте транзакцію там, де це необхідно**: оберніть складні операції в транзакції

5. **Використовуйте getList**: використовуйте `getList()` для вибору, що випадає, щоб зменшити кількість запитів

6. **Ключі індексу**: переконайтеся, що поля бази даних, які використовуються в критеріях, індексовані

7. **Обмеження результатів**: завжди використовуйте `setLimit()` для потенційно великих наборів результатів

## Пов'язана документація

- XoopsObject - Базовий клас об'єктів
- ../Database/Criteria - Побудова критеріїв запиту
- ../Database/XoopsDatabase - Операції з базою даних

---

*Див. також: [Вихідний код XOOPS](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*