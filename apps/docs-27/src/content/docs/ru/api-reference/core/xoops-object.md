---
title: "Класс XoopsObject"
description: "Базовый класс для всех объектов данных в системе XOOPS, обеспечивающий управление свойствами, валидацию и сериализацию"
---

Класс `XoopsObject` является фундаментальным базовым классом для всех объектов данных в системе XOOPS. Он предоставляет стандартизированный интерфейс для управления свойствами объекта, валидации, отслеживания изменений и сериализации.

## Обзор класса

```php
namespace Xoops\Core;

class XoopsObject
{
    protected array $vars = [];
    protected array $cleanVars = [];
    protected bool $isNew = true;
    protected array $errors = [];
}
```

## Иерархия класса

```
XoopsObject
├── XoopsUser
├── XoopsGroup
├── XoopsModule
├── XoopsBlock
├── XoopsComment
├── XoopsNotification
├── XoopsConfig
└── [Custom Module Objects]
```

## Свойства

| Свойство | Тип | Видимость | Описание |
|----------|-----|-----------|---------|
| `$vars` | array | protected | Хранит определения и значения переменных |
| `$cleanVars` | array | protected | Хранит санированные значения для операций БД |
| `$isNew` | bool | protected | Указывает, является ли объект новым (еще не в БД) |
| `$errors` | array | protected | Хранит сообщения валидации и ошибок |

## Конструктор

```php
public function __construct()
```

Создает новый экземпляр XoopsObject. По умолчанию объект помечается как новый.

**Пример:**
```php
$object = new XoopsObject();
// Объект новый и не имеет определенных переменных
```

## Основные методы

### initVar

Инициализирует определение переменной для объекта.

```php
public function initVar(
    string $key,
    int $dataType,
    mixed $value = null,
    bool $required = false,
    int $maxlength = null,
    string $options = ''
): void
```

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `$key` | string | Имя переменной |
| `$dataType` | int | Константа типа данных (см. Типы данных) |
| `$value` | mixed | Значение по умолчанию |
| `$required` | bool | Является ли поле обязательным |
| `$maxlength` | int | Максимальная длина для строковых типов |
| `$options` | string | Дополнительные опции |

**Типы данных:**

| Константа | Значение | Описание |
|-----------|---------|---------|
| `XOBJ_DTYPE_TXTBOX` | 1 | Текстовое поле ввода |
| `XOBJ_DTYPE_TXTAREA` | 2 | Содержимое области текста |
| `XOBJ_DTYPE_INT` | 3 | Целочисленное значение |
| `XOBJ_DTYPE_URL` | 4 | Строка URL |
| `XOBJ_DTYPE_EMAIL` | 5 | Адрес электронной почты |
| `XOBJ_DTYPE_ARRAY` | 6 | Сериализованный массив |
| `XOBJ_DTYPE_OTHER` | 7 | Пользовательский тип |
| `XOBJ_DTYPE_SOURCE` | 8 | Исходный код |
| `XOBJ_DTYPE_STIME` | 9 | Короткий формат времени |
| `XOBJ_DTYPE_MTIME` | 10 | Средний формат времени |
| `XOBJ_DTYPE_LTIME` | 11 | Длинный формат времени |
| `XOBJ_DTYPE_FLOAT` | 12 | Число с плавающей точкой |
| `XOBJ_DTYPE_DECIMAL` | 13 | Десятичное число |
| `XOBJ_DTYPE_ENUM` | 14 | Перечисление |

**Пример:**
```php
class MyObject extends XoopsObject
{
    public function __construct()
    {
        parent::__construct();
        $this->initVar('id', XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('email', XOBJ_DTYPE_EMAIL, '', true, 100);
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('status', XOBJ_DTYPE_INT, 1, true);
    }
}
```

---

### setVar

Устанавливает значение переменной.

```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `$key` | string | Имя переменной |
| `$value` | mixed | Значение для установки |
| `$notGpc` | bool | Если true, значение не из GET/POST/COOKIE |

**Возвращает:** `bool` - True если успешно, false в противном случае

**Пример:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Не из пользовательского ввода
$object->setVar('status', 1);
```

---

### getVar

Получает значение переменной с опциональным форматированием.

```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `$key` | string | Имя переменной |
| `$format` | string | Формат вывода |

**Опции формата:**

| Формат | Описание |
|--------|---------|
| `'s'` | Show - Сущности HTML экранированы для отображения |
| `'e'` | Edit - Для значений ввода формы |
| `'p'` | Preview - Аналогично show |
| `'f'` | Form data - Сырое для обработки формы |
| `'n'` | None - Сырое значение, без форматирования |

**Возвращает:** `mixed` - Форматированное значение

**Пример:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello <World>');

echo $object->getVar('title', 's'); // "Hello &lt;World&gt;"
echo $object->getVar('title', 'e'); // "Hello &lt;World&gt;" (для значения ввода)
echo $object->getVar('title', 'n'); // "Hello <World>" (сырое)

// Для типов массивов данных
$object->setVar('options', ['a', 'b', 'c']);
$options = $object->getVar('options', 'n'); // Возвращает массив
```

---

### setVars

Устанавливает несколько переменных одновременно из массива.

```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `$values` | array | Ассоциативный массив пар ключ => значение |
| `$notGpc` | bool | Если true, значения не из GET/POST/COOKIE |

**Пример:**
```php
$object = new MyObject();
$object->setVars([
    'title' => 'My Title',
    'content' => 'My content',
    'status' => 1
]);

// Из базы данных (не из пользовательского ввода)
$object->setVars($row, true);
```

---

### getValues

Получает все значения переменных.

```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `$keys` | array | Специальные ключи для получения (null для всех) |
| `$format` | string | Формат вывода |
| `$maxDepth` | int | Максимальная глубина для вложенных объектов |

**Возвращает:** `array` - Ассоциативный массив значений

**Пример:**
```php
$object = new MyObject();

// Получить все значения
$allValues = $object->getValues();

// Получить конкретные значения
$subset = $object->getValues(['title', 'status']);

// Получить сырые значения для БД
$rawValues = $object->getValues(null, 'n');
```

---

### assignVar

Присваивает значение напрямую без валидации (используйте с осторожностью).

```php
public function assignVar(
    string $key,
    mixed $value
): void
```

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `$key` | string | Имя переменной |
| `$value` | mixed | Значение для присвоения |

**Пример:**
```php
// Прямое присвоение из доверенного источника (напр. БД)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```

---

### cleanVars

Санирует все переменные для операций базы данных.

```php
public function cleanVars(): bool
```

**Возвращает:** `bool` - True если все переменные корректны

**Пример:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$object->setVar('email', 'user@example.com');

if ($object->cleanVars()) {
    // Переменные санированы и готовы для БД
    $cleanData = $object->cleanVars;
} else {
    // Произошли ошибки валидации
    $errors = $object->getErrors();
}
```

---

### isNew

Проверяет или устанавливает, является ли объект новым.

```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```

**Пример:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```

---

## Методы обработки ошибок

### setErrors

Добавляет сообщение об ошибке.

```php
public function setErrors(string|array $error): void
```

**Пример:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```

---

### getErrors

Получает все сообщения об ошибках.

```php
public function getErrors(): array
```

**Пример:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```

---

### getHtmlErrors

Возвращает ошибки отформатированные как HTML.

```php
public function getHtmlErrors(): string
```

**Пример:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```

---

## Служебные методы

### toArray

Преобразует объект в массив.

```php
public function toArray(): array
```

**Пример:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```

---

### getVars

Возвращает определения переменных.

```php
public function getVars(): array
```

**Пример:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```

---

## Полный пример использования

```php
<?php
/**
 * Пользовательский объект статьи
 */
class Article extends XoopsObject
{
    /**
     * Конструктор - Инициализирует все переменные
     */
    public function __construct()
    {
        parent::__construct();

        // Первичный ключ
        $this->initVar('article_id', XOBJ_DTYPE_INT, null, false);

        // Обязательные поля
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('author_id', XOBJ_DTYPE_INT, 0, true);

        // Опциональные поля
        $this->initVar('summary', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('category_id', XOBJ_DTYPE_INT, 0, false);

        // Временные метки
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('updated', XOBJ_DTYPE_INT, time(), false);

        // Флаги статуса
        $this->initVar('published', XOBJ_DTYPE_INT, 0, false);
        $this->initVar('views', XOBJ_DTYPE_INT, 0, false);

        // Метаданные как массив
        $this->initVar('meta', XOBJ_DTYPE_ARRAY, [], false);
    }

    /**
     * Получить отформатированную дату создания
     */
    public function getCreatedDate(string $format = 'Y-m-d H:i:s'): string
    {
        return date($format, $this->getVar('created', 'n'));
    }

    /**
     * Проверить, опубликована ли статья
     */
    public function isPublished(): bool
    {
        return $this->getVar('published', 'n') == 1;
    }

    /**
     * Увеличить счетчик просмотров
     */
    public function incrementViews(): void
    {
        $views = $this->getVar('views', 'n');
        $this->setVar('views', $views + 1);
    }

    /**
     * Пользовательская валидация
     */
    public function validate(): bool
    {
        $this->errors = [];

        // Валидация заголовка
        $title = trim($this->getVar('title', 'n'));
        if (empty($title)) {
            $this->setErrors('Title is required');
        } elseif (strlen($title) < 5) {
            $this->setErrors('Title must be at least 5 characters');
        }

        // Валидация автора
        if ($this->getVar('author_id', 'n') <= 0) {
            $this->setErrors('Author is required');
        }

        return empty($this->errors);
    }
}

// Использование
$article = new Article();
$article->setVar('title', 'My First Article');
$article->setVar('author_id', 1);
$article->setVar('content', '<p>Article content here...</p>', true);
$article->setVar('meta', [
    'keywords' => ['xoops', 'cms', 'php'],
    'description' => 'An example article'
]);

if ($article->validate() && $article->cleanVars()) {
    // Сохранить в БД через обработчик
    $handler = xoops_getModuleHandler('article', 'mymodule');
    $handler->insert($article);

    echo "Article saved with ID: " . $article->getVar('article_id');
} else {
    echo "Errors: " . $article->getHtmlErrors();
}
```

## Лучшие практики

1. **Всегда инициализируйте переменные**: Определите все переменные в конструкторе с помощью `initVar()`

2. **Используйте подходящие типы данных**: Выберите правильную константу `XOBJ_DTYPE_*` для валидации

3. **Тщательно обрабатывайте пользовательский ввод**: Используйте `setVar()` с `$notGpc = false` для пользовательского ввода

4. **Валидируйте перед сохранением**: Всегда вызывайте `cleanVars()` перед операциями БД

5. **Используйте параметры формата**: Используйте подходящий формат в `getVar()` для контекста

6. **Расширяйте для пользовательской логики**: Добавьте методы, специфичные для домена, в подклассы

## Связанная документация

- XoopsObjectHandler - Паттерн обработчика для сохранения объектов
- ../Database/Criteria - Построение запросов с Criteria
- ../Database/XoopsDatabase - Операции с БД

---

*См. также: [Исходный код XOOPS](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
