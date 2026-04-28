---
title: "Класс XoopsObjectHandler"
description: "Базовый класс обработчика для CRUD операций на экземплярах XoopsObject с сохранением в БД"
---

Класс `XoopsObjectHandler` и его расширение `XoopsPersistableObjectHandler` предоставляют стандартизированный интерфейс для выполнения операций CRUD (Create, Read, Update, Delete) на экземплярах `XoopsObject`. Это реализует паттерн Data Mapper, разделяя логику домена от доступа к БД.

## Обзор класса

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

## Иерархия класса

```
XoopsObjectHandler (Абстрактная база)
└── XoopsPersistableObjectHandler (Расширенная реализация)
    ├── XoopsUserHandler
    ├── XoopsGroupHandler
    ├── XoopsModuleHandler
    ├── XoopsBlockHandler
    ├── XoopsConfigHandler
    └── [Пользовательские обработчики модулей]
```

## XoopsObjectHandler

### Конструктор

```php
public function __construct(XoopsDatabase $db)
```

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `$db` | XoopsDatabase | Экземпляр соединения с БД |

**Пример:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```

---

### create

Создает новый экземпляр объекта.

```php
abstract public function create(bool $isNew = true): ?XoopsObject
```

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `$isNew` | bool | Является ли объект новым (по умолчанию: true) |

**Возвращает:** `XoopsObject|null` - Новый экземпляр объекта

**Пример:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```

---

### get

Получает объект по его первичному ключу.

```php
abstract public function get(int $id): ?XoopsObject
```

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `$id` | int | Значение первичного ключа |

**Возвращает:** `XoopsObject|null` - Экземпляр объекта или null если не найден

**Пример:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```

---

### insert

Сохраняет объект в БД (вставка или обновление).

```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `$obj` | XoopsObject | Объект для сохранения |
| `$force` | bool | Принудительно выполнить операцию даже если объект не изменился |

**Возвращает:** `bool` - True при успехе

**Пример:**
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

### delete

Удаляет объект из БД.

```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `$obj` | XoopsObject | Объект для удаления |
| `$force` | bool | Принудительное удаление |

**Возвращает:** `bool` - True при успехе

**Пример:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```

---

## XoopsPersistableObjectHandler

`XoopsPersistableObjectHandler` расширяет `XoopsObjectHandler` дополнительными методами для запросов и массовых операций.

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

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `$db` | XoopsDatabase | Соединение с БД |
| `$table` | string | Имя таблицы (без префикса) |
| `$className` | string | Полное имя класса объекта |
| `$keyName` | string | Имя поля первичного ключа |
| `$identifierName` | string | Поле идентификатора для человека |

**Пример:**
```php
class ArticleHandler extends XoopsPersistableObjectHandler
{
    public function __construct(XoopsDatabase $db)
    {
        parent::__construct(
            $db,
            'mymodule_articles',    // Имя таблицы
            'Article',               // Имя класса
            'article_id',            // Первичный ключ
            'title'                  // Поле идентификатора
        );
    }
}
```

---

### getObjects

Получает несколько объектов, соответствующих критериям.

```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `$criteria` | CriteriaElement | Критерии запроса (опционально) |
| `$idAsKey` | bool | Использовать первичный ключ как ключ массива |
| `$asObject` | bool | Вернуть объекты (true) или массивы (false) |

**Возвращает:** `array` - Массив объектов или ассоциативных массивов

**Пример:**
```php
$handler = xoops_getHandler('user');

// Получить всех активных пользователей
$criteria = new Criteria('level', 0, '>');
$users = $handler->getObjects($criteria);

// Получить пользователей с ID как ключ
$users = $handler->getObjects($criteria, true);
echo $users[1]->getVar('uname'); // Доступ по ID

// Получить как массивы вместо объектов
$usersArray = $handler->getObjects($criteria, false, false);
foreach ($usersArray as $userData) {
    echo $userData['uname'];
}
```

---

### getCount

Подсчитывает объекты, соответствующие критериям.

```php
public function getCount(CriteriaElement $criteria = null): int
```

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `$criteria` | CriteriaElement | Критерии запроса (опционально) |

**Возвращает:** `int` - Количество найденных объектов

**Пример:**
```php
$handler = xoops_getHandler('user');

// Подсчитать всех пользователей
$totalUsers = $handler->getCount();

// Подсчитать активных пользователей
$criteria = new Criteria('level', 0, '>');
$activeUsers = $handler->getCount($criteria);

echo "Total: $totalUsers, Active: $activeUsers";
```

---

### getAll

Получает все объекты (псевдоним для getObjects без критериев).

```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `$criteria` | CriteriaElement | Критерии запроса |
| `$fields` | array | Конкретные поля для получения |
| `$asObject` | bool | Вернуть как объекты |
| `$idAsKey` | bool | Использовать ID как ключ массива |

**Пример:**
```php
$handler = xoops_getHandler('module');

// Получить все модули
$modules = $handler->getAll();

// Получить только конкретные поля
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```

---

### getIds

Получает только первичные ключи найденных объектов.

```php
public function getIds(CriteriaElement $criteria = null): array
```

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `$criteria` | CriteriaElement | Критерии запроса |

**Возвращает:** `array` - Массив значений первичного ключа

**Пример:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Массив ID администраторов
```

---

### getList

Получает список ключ-значение для выпадающих списков.

```php
public function getList(CriteriaElement $criteria = null): array
```

**Возвращает:** `array` - Ассоциативный массив [id => identifier]

**Пример:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// Для выпадающего списка select
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```

---

### deleteAll

Удаляет все объекты, соответствующие критериям.

```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `$criteria` | CriteriaElement | Критерии для объектов к удалению |
| `$force` | bool | Принудительное удаление |
| `$asObject` | bool | Загрузить объекты перед удалением (запускает события) |

**Возвращает:** `bool` - True при успехе

**Пример:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Удалить все комментарии для конкретной статьи
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Удалить с загрузкой объектов (запускает события удаления)
$handler->deleteAll($criteria, true, true);
```

---

### updateAll

Обновляет значение поля для всех объектов, соответствующих критериям.

```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `$fieldname` | string | Поле для обновления |
| `$fieldvalue` | mixed | Новое значение |
| `$criteria` | CriteriaElement | Критерии для объектов к обновлению |
| `$force` | bool | Принудительное обновление |

**Возвращает:** `bool` - True при успехе

**Пример:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Отметить все статьи автора как черновик
$criteria = new Criteria('author_id', $authorId);
$handler->updateAll('published', 0, $criteria);

// Обновить счетчик просмотров
$criteria = new Criteria('article_id', $id);
$handler->updateAll('views', $views + 1, $criteria);
```

---

### insert (Расширенный)

Расширенный метод insert с дополнительной функциональностью.

```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Поведение:**
- Если объект новый (`isNew() === true`): INSERT
- Если объект существует (`isNew() === false`): UPDATE
- Автоматически вызывает `cleanVars()`
- Устанавливает ID автоинкремента для новых объектов

**Пример:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Создать новую статью
$article = $handler->create();
$article->setVar('title', 'New Article');
$article->setVar('content', 'Content here');
$handler->insert($article);
echo "Created with ID: " . $article->getVar('article_id');

// Обновить существующую статью
$article = $handler->get(5);
$article->setVar('title', 'Updated Title');
$handler->insert($article);
```

---

## Вспомогательные функции

### xoops_getHandler

Глобальная функция для получения основного обработчика.

```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `$name` | string | Имя обработчика (user, module, group, и т. д.) |
| `$optional` | bool | Вернуть null вместо вызова ошибки |

**Пример:**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```

---

### xoops_getModuleHandler

Получает обработчик, специфичный для модуля.

```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `$name` | string | Имя обработчика |
| `$dirname` | string | Имя директории модуля |
| `$optional` | bool | Вернуть null при ошибке |

**Пример:**
```php
// Получить обработчик из текущего модуля
$articleHandler = xoops_getModuleHandler('article');

// Получить обработчик из конкретного модуля
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```

---

## Создание пользовательских обработчиков

### Базовая реализация обработчика

```php
<?php
namespace XoopsModules\MyModule;

use XoopsPersistableObjectHandler;
use XoopsDatabase;
use CriteriaElement;
use Criteria;
use CriteriaCompo;

/**
 * Обработчик для объектов Article
 */
class ArticleHandler extends XoopsPersistableObjectHandler
{
    /**
     * Конструктор
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
     * Получить опубликованные статьи
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
     * Получить статьи по автору
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
     * Получить статьи по категории
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
     * Поиск статей
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
     * Получить популярные статьи по количеству просмотров
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
     * Увеличить счетчик просмотров
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
     * Переопределить insert для пользовательского поведения
     */
    public function insert(\XoopsObject $obj, bool $force = false): bool
    {
        // Установить временную метку обновления
        $obj->setVar('updated', time());

        // Если новый, установить временную метку создания
        if ($obj->isNew()) {
            $obj->setVar('created', time());
        }

        return parent::insert($obj, $force);
    }

    /**
     * Переопределить delete для каскадных операций
     */
    public function delete(\XoopsObject $obj, bool $force = false): bool
    {
        // Удалить связанные комментарии
        $commentHandler = xoops_getModuleHandler('comment', 'mymodule');
        $criteria = new Criteria('article_id', $obj->getVar('article_id'));
        $commentHandler->deleteAll($criteria);

        return parent::delete($obj, $force);
    }
}
```

### Использование пользовательского обработчика

```php
// Получить обработчик
$articleHandler = xoops_getModuleHandler('article', 'mymodule');

// Создать новую статью
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

// Получить опубликованные статьи
$articles = $articleHandler->getPublished(10);

// Поиск статей
$results = $articleHandler->search('xoops');

// Получить популярные статьи
$popular = $articleHandler->getPopular(5);

// Обновить счетчик просмотров
$articleHandler->incrementViews($articleId);
```

## Лучшие практики

1. **Используйте Criteria для запросов**: Всегда используйте объекты Criteria для типобезопасных запросов

2. **Расширяйте для пользовательских методов**: Добавьте методы запроса, специфичные для домена, в обработчики

3. **Переопределяйте insert/delete**: Добавьте каскадные операции и временные метки в переопределениях

4. **Используйте транзакции где необходимо**: Оберните сложные операции в транзакции

5. **Используйте getList**: Используйте `getList()` для выпадающих списков select, чтобы уменьшить запросы

6. **Индексируйте ключи**: Убедитесь, что поля БД, используемые в критериях, индексированы

7. **Ограничьте результаты**: Всегда используйте `setLimit()` для потенциально больших наборов результатов

## Связанная документация

- XoopsObject - Базовый класс объекта
- ../Database/Criteria - Построение критериев запроса
- ../Database/XoopsDatabase - Операции с БД

---

*См. также: [Исходный код XOOPS](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
