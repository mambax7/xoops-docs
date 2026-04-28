---
title: "XMF Request"
description: 'Безопасная обработка HTTP запроса и валидация входных данных с классом Xmf\Request'
---

Класс `Xmf\Request` предоставляет контролируемый доступ к переменным HTTP запроса с встроенной очисткой и преобразованием типов. Он защищает от потенциально вредоносных инъекций по умолчанию, одновременно приводя входные данные к указанным типам.

## Обзор

Обработка запросов - один из наиболее критичных с точки зрения безопасности аспектов веб-разработки. Класс Request XMF:

- Автоматически очищает входные данные для предотвращения атак XSS
- Предоставляет типобезопасные аксессоры для общих типов данных
- Поддерживает несколько источников запросов (GET, POST, COOKIE и т.д.)
- Предлагает последовательную обработку значений по умолчанию

## Базовое использование

```php
use Xmf\Request;

// Получить строковый ввод
$name = Request::getString('name', '');

// Получить целочисленный ввод
$id = Request::getInt('id', 0);

// Получить из конкретного источника
$postData = Request::getString('data', '', 'POST');
```

## Методы запроса

### getMethod()

Возвращает метод HTTP запроса для текущего запроса.

```php
$method = Request::getMethod();
// Возвращает: 'GET', 'HEAD', 'POST', или 'PUT'
```

### getVar($name, $default, $hash, $type, $mask)

Основной метод, который большинство других методов `get*()` вызывают. Получает и возвращает названную переменную из данных запроса.

**Параметры:**
- `$name` - Название переменной для получения
- `$default` - Значение по умолчанию, если переменная не существует
- `$hash` - Источник хэша: GET, POST, FILES, COOKIE, ENV, SERVER, METHOD, или REQUEST (по умолчанию)
- `$type` - Тип данных для очистки (см. типы FilterInput ниже)
- `$mask` - Битовая маска для опций очистки

**Значения маски:**

| Константа маски | Эффект |
|---------------|--------|
| `MASK_NO_TRIM` | Не обрезать пробелы в начале/конце |
| `MASK_ALLOW_RAW` | Пропустить очистку, разрешить сырой ввод |
| `MASK_ALLOW_HTML` | Разрешить ограниченный набор "безопасного" HTML разметки |

```php
// Получить сырой ввод без очистки
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Разрешить безопасный HTML
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```

## Методы для конкретных типов

### getInt($name, $default, $hash)

Возвращает целочисленное значение. Разрешены только цифры.

```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```

### getFloat($name, $default, $hash)

Возвращает значение с плавающей точкой. Разрешены только цифры и точки.

```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```

### getBool($name, $default, $hash)

Возвращает логическое значение.

```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```

### getWord($name, $default, $hash)

Возвращает строку с только буквами и подчеркиваниями `[A-Za-z_]`.

```php
$action = Request::getWord('action', 'view');
```

### getCmd($name, $default, $hash)

Возвращает командную строку с только `[A-Za-z0-9.-_]`, принудительно в нижний регистр.

```php
$op = Request::getCmd('op', 'list');
// Ввод "View_Item" становится "view_item"
```

### getString($name, $default, $hash, $mask)

Возвращает очищенную строку с удаленным плохим HTML кодом (если не переопределено маской).

```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Разрешить некоторый HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```

### getArray($name, $default, $hash)

Возвращает массив, рекурсивно обработанный для удаления XSS и плохого кода.

```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```

### getText($name, $default, $hash)

Возвращает сырой текст без очистки. Используйте с осторожностью.

```php
$rawContent = Request::getText('raw_content', '');
```

### getUrl($name, $default, $hash)

Возвращает проверенный веб-URL (относительный, http, или только схемы https).

```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```

### getPath($name, $default, $hash)

Возвращает проверенный путь файловой системы или веб-путь.

```php
$filePath = Request::getPath('file', '');
```

### getEmail($name, $default, $hash)

Возвращает проверенный адрес электронной почты или значение по умолчанию.

```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```

### getIP($name, $default, $hash)

Возвращает проверенный IPv4 или IPv6 адрес.

```php
$userIp = Request::getIP('client_ip', '');
```

### getHeader($headerName, $default)

Возвращает значение заголовка HTTP запроса.

```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```

## Утилиты-методы

### hasVar($name, $hash)

Проверить, существует ли переменная в указанном хэше.

```php
if (Request::hasVar('submit', 'POST')) {
    // Форма была отправлена
}

if (Request::hasVar('id', 'GET')) {
    // Параметр ID существует
}
```

### setVar($name, $value, $hash, $overwrite)

Установить переменную в указанный хэш. Возвращает предыдущее значение или null.

```php
// Установить значение
$oldValue = Request::setVar('processed', true, 'POST');

// Установить только если не существует уже
Request::setVar('default_op', 'list', 'GET', false);
```

### get($hash, $mask)

Возвращает очищенную копию всего массива хэша.

```php
// Получить все POST данные очищены
$postData = Request::get('POST');

// Получить все GET данные
$getData = Request::get('GET');

// Получить REQUEST данные без обрезки
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```

### set($array, $hash, $overwrite)

Установить несколько переменных из массива.

```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Не перезаписывать существующие
```

## Интеграция FilterInput

Класс Request использует `Xmf\FilterInput` для очистки. Доступные типы фильтров:

| Тип | Описание |
|------|-------------|
| ALPHANUM / ALNUM | Только буквенно-цифровой |
| ARRAY | Рекурсивно очистить каждый элемент |
| BASE64 | Строка закодированная в Base64 |
| BOOLEAN / BOOL | True или false |
| CMD | Команда - A-Z, 0-9, подчеркивание, тире, точка (нижний регистр) |
| EMAIL | Действительный адрес электронной почты |
| FLOAT / DOUBLE | Число с плавающей точкой |
| INTEGER / INT | Целочисленное значение |
| IP | Действительный IP адрес |
| PATH | Путь файловой системы или веб-путь |
| STRING | Общая строка (по умолчанию) |
| USERNAME | Формат имени пользователя |
| WEBURL | Веб-URL |
| WORD | Буквы A-Z и подчеркивание только |

## Практические примеры

### Обработка формы

```php
use Xmf\Request;

if ('POST' === Request::getMethod()) {
    // Валидировать отправку формы
    $title = Request::getString('title', '');
    $content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
    $categoryId = Request::getInt('category_id', 0);
    $tags = Request::getArray('tags', []);
    $published = Request::getBool('published', false);

    if (empty($title)) {
        $errors[] = 'Title is required';
    }

    if ($categoryId <= 0) {
        $errors[] = 'Please select a category';
    }
}
```

### AJAX обработчик

```php
use Xmf\Request;

// Проверить, является ли это AJAX запросом
$isAjax = (Request::getHeader('X-Requested-With', '') === 'XMLHttpRequest');

if ($isAjax) {
    $action = Request::getCmd('action', '');
    $itemId = Request::getInt('item_id', 0);

    switch ($action) {
        case 'delete':
            // Обработать удаление
            break;
        case 'update':
            $data = Request::getArray('data', []);
            // Обработать обновление
            break;
    }
}
```

### Пагинация

```php
use Xmf\Request;

$page = Request::getInt('page', 1);
$limit = Request::getInt('limit', 20);
$sort = Request::getCmd('sort', 'date');
$order = Request::getWord('order', 'DESC');

// Валидировать диапазоны
$page = max(1, $page);
$limit = min(100, max(10, $limit));
$order = in_array($order, ['ASC', 'DESC']) ? $order : 'DESC';

$offset = ($page - 1) * $limit;
```

### Форма поиска

```php
use Xmf\Request;

$query = Request::getString('q', '');
$category = Request::getInt('cat', 0);
$dateFrom = Request::getString('from', '');
$dateTo = Request::getString('to', '');

// Построить критерии поиска
$criteria = new CriteriaCompo();

if (!empty($query)) {
    $criteria->add(new Criteria('title', '%' . $query . '%', 'LIKE'));
}

if ($category > 0) {
    $criteria->add(new Criteria('category_id', $category));
}
```

## Лучшие практики безопасности

1. **Всегда используйте методы для конкретных типов** - Используйте `getInt()` для ID, `getEmail()` для электронной почты и т.д.

2. **Предоставьте разумные значения по умолчанию** - Никогда не предполагайте, что ввод существует

3. **Валидируйте после очистки** - Очистка удаляет плохие данные, валидация гарантирует правильные данные

4. **Используйте подходящий хэш** - Указывайте POST для данных формы, GET для параметров запроса

5. **Избегайте сырого ввода** - Используйте только `getText()` или `MASK_ALLOW_RAW` когда абсолютно необходимо

```php
// Хорошо - тип-специфичный с значением по умолчанию
$id = Request::getInt('id', 0);

// Плохо - использование getString для числовых данных
$id = (int) Request::getString('id', '0');
```

## Также см.

- Getting-Started-with-XMF - Базовые концепции XMF
- XMF-Module-Helper - Класс помощника модулей
- ../XMF-Framework - Обзор фреймворка

---

#xmf #request #security #input-validation #sanitization
