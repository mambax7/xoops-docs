---
title: "Защита от CSRF"
description: "Понимание и реализация защиты от CSRF в XOOPS с использованием класса XoopsSecurity"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Атаки подделки межсайтовых запросов (CSRF) заставляют пользователей выполнять нежелательные действия на сайте, где они аутентифицированы. XOOPS предоставляет встроенную защиту от CSRF через класс `XoopsSecurity`.

## Связанная документация

- Security-Best-Practices - Комплексное руководство по безопасности
- Input-Sanitization - MyTextSanitizer и валидация
- SQL-Injection-Prevention - Практики безопасности базы данных

## Понимание атак CSRF

Атака CSRF происходит, когда:

1. Пользователь аутентифицирован на вашем сайте XOOPS
2. Пользователь посещает вредоносный веб-сайт
3. Вредоносный сайт отправляет запрос на ваш сайт XOOPS, используя сеанс пользователя
4. Ваш сайт обрабатывает запрос так, как если бы он пришёл от законного пользователя

## Класс XoopsSecurity

XOOPS предоставляет класс `XoopsSecurity` для защиты от атак CSRF. Этот класс управляет токенами безопасности, которые должны быть включены в формы и проверены при обработке запросов.

### Генерация токена

Класс безопасности генерирует уникальные токены, которые хранятся в сеансе пользователя и должны быть включены в формы:

```php
$security = new XoopsSecurity();

// Получение поля HTML с входящим токеном
$tokenHTML = $security->getTokenHTML();

// Получение только значения токена
$tokenValue = $security->createToken();
```

### Проверка токена

При обработке отправки формы убедитесь, что токен действителен:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```

## Использование системы токенов XOOPS

### С классами XoopsForm

При использовании классов форм XOOPS защита токеном проста:

```php
// Создание формы
$form = new XoopsThemeForm('Add Item', 'form_name', 'submit.php');

// Добавление элементов формы
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('Content', 'content', ''));

// Добавление скрытого поля токена - ВСЕГДА включайте это
$form->addElement(new XoopsFormHiddenToken());

// Добавление кнопки отправки
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));
```

### С пользовательскими формами

Для пользовательских HTML-форм, которые не используют XoopsForm:

```php
// В вашем шаблоне формы или PHP-файле
$security = new XoopsSecurity();
?>
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    <!-- Включение токена -->
    <?php echo $security->getTokenHTML(); ?>

    <button type="submit">Submit</button>
</form>
```

### В шаблонах Smarty

При генерации форм в шаблонах Smarty:

```php
// В вашем PHP-файле
$security = new XoopsSecurity();
$GLOBALS['xoopsTpl']->assign('token', $security->getTokenHTML());
```

```smarty
{* В вашем шаблоне *}
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    {* Включение токена *}
    <{$token}>

    <button type="submit">Submit</button>
</form>
```

## Обработка отправки форм

### Базовая проверка токена

```php
// В вашем скрипте обработки формы
$security = new XoopsSecurity();

// Проверка токена
if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}

// Токен действителен, обработка формы
$title = $_POST['title'];
// ... продолжение обработки
```

### С пользовательской обработкой ошибок

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Получение подробной информации об ошибке
    $errors = $security->getErrors();

    // Логирование ошибки
    error_log('CSRF token validation failed: ' . implode(', ', $errors));

    // Перенаправление с сообщением об ошибке
    redirect_header('form.php', 3, 'Security token expired. Please try again.');
    exit();
}
```

### Для запросов AJAX

При работе с запросами AJAX включите токен в ваш запрос:

```javascript
// JavaScript - получение токена из скрытого поля
var token = document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value;

// Включение в запрос AJAX
fetch('ajax_handler.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'action=save&XOOPS_TOKEN_REQUEST=' + encodeURIComponent(token)
});
```

```php
// Обработчик PHP AJAX
$security = new XoopsSecurity();

if (!$security->check()) {
    echo json_encode(['error' => 'Invalid security token']);
    exit();
}

// Обработка запроса AJAX
```

## Проверка HTTP Referer

Для дополнительной защиты, особенно для запросов AJAX, вы также можете проверить заголовок HTTP referer:

```php
$security = new XoopsSecurity();

// Проверка заголовка referer
if (!$security->checkReferer()) {
    echo json_encode(['error' => 'Invalid request']);
    exit();
}

// Также проверка токена
if (!$security->check()) {
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```

### Комбинированная проверка безопасности

```php
$security = new XoopsSecurity();

// Выполнение обеих проверок
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```

## Конфигурация токена

### Время жизни токена

Токены имеют ограниченное время жизни, чтобы предотвратить атаки повтора. Вы можете настроить это в параметрах XOOPS или обработать истёкшие токены корректно:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Токен может истечь
    // Регенерировать форму с новым токеном
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```

### Несколько форм на одной странице

Если на странице несколько форм, каждая должна иметь свой токен:

```php
// Форма 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Форма 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```

## Лучшие практики

### Всегда используйте токены для операций, изменяющих состояние

Включайте токены в любую форму, которая:

- Создаёт данные
- Обновляет данные
- Удаляет данные
- Изменяет параметры пользователя
- Выполняет любое административное действие

### Не полагайтесь исключительно на проверку Referer

Заголовок HTTP referer может быть:

- Удалён инструментами конфиденциальности
- Отсутствовать в некоторых браузерах
- Подделан в некоторых случаях

Всегда используйте проверку токена в качестве основной защиты.

### Регенерируйте токены правильно

Рассмотрите регенерацию токенов:

- После успешной отправки формы
- После входа/выхода
- Через регулярные промежутки времени для продолжительных сеансов

### Обработка истечения токена корректно

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Сохранение данных формы временно
    $_SESSION['form_backup'] = $_POST;

    // Перенаправление обратно на форму с сообщением
    redirect_header('form.php?restore=1', 3, 'Please resubmit the form.');
    exit();
}
```

## Распространённые проблемы и решения

### Ошибка "Токен не найден"

**Проблема**: Проверка безопасности не удаётся с ошибкой "token not found"

**Решение**: Убедитесь, что поле токена включено в вашу форму:

```php
$form->addElement(new XoopsFormHiddenToken());
```

### Ошибка истечения токена

**Проблема**: Пользователи видят "token expired" после длительного заполнения формы

**Решение**: Рассмотрите использование JavaScript для периодического обновления токена:

```javascript
// Обновление токена каждые 10 минут
setInterval(function() {
    fetch('refresh_token.php')
        .then(response => response.json())
        .then(data => {
            document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value = data.token;
        });
}, 600000);
```

### Проблемы с токеном AJAX

**Проблема**: Запросы AJAX не проходят проверку токена

**Решение**: Убедитесь, что токен передаётся с каждым запросом AJAX и проверяется на стороне сервера:

```php
// Обработчик AJAX
header('Content-Type: application/json');

$security = new XoopsSecurity();
if (!$security->check(true, false)) { // Не очищайте токен для AJAX
    http_response_code(403);
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```

## Пример: полная реализация формы

```php
<?php
// form.php
require_once dirname(__DIR__) . '/mainfile.php';

$security = new XoopsSecurity();

// Обработка отправки формы
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$security->check()) {
        redirect_header('form.php', 3, 'Security token expired. Please try again.');
        exit();
    }

    // Обработка корректной отправки
    $title = $myts->htmlSpecialChars($_POST['title']);
    // ... сохранение в базе данных

    redirect_header('success.php', 3, 'Item saved successfully!');
    exit();
}

// Отображение формы
$GLOBALS['xoopsOption']['template_main'] = 'mymodule_form.tpl';
include XOOPS_ROOT_PATH . '/header.php';

$form = new XoopsThemeForm('Add Item', 'add_item', 'form.php');
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('Content', 'content', ''));
$form->addElement(new XoopsFormHiddenToken());
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

$GLOBALS['xoopsTpl']->assign('form', $form->render());

include XOOPS_ROOT_PATH . '/footer.php';
```

---

#security #csrf #xoops #forms #tokens #XoopsSecurity
