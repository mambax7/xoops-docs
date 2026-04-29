---
title: "CSRF Захист"
description: "Розуміння та впровадження захисту CSRF у XOOPS за допомогою класу XoopsSecurity"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Атаки Cross-Site Request Forgery (CSRF) змушують користувачів виконувати небажані дії на сайті, де вони пройшли автентифікацію. XOOPS забезпечує вбудований захист CSRF через клас `XoopsSecurity`.

## Пов'язана документація

- Security-Best-Practices - Вичерпний посібник із безпеки
- Очистка введення - MyTextSanitizer і перевірка
- SQL-Injection-Prevention - Методи безпеки бази даних

## Розуміння атак CSRF

Атака CSRF виникає, коли:

1. Користувач аутентифікований на вашому сайті XOOPS
2. Користувач відвідує шкідливий веб-сайт
3. Шкідливий сайт надсилає запит на ваш сайт XOOPS, використовуючи сеанс користувача
4. Ваш сайт обробляє запит так, ніби він надійшов від законного користувача

## Клас безпеки Xoops

XOOPS надає клас `XoopsSecurity` для захисту від атак CSRF. Цей клас керує маркерами безпеки, які мають бути включені у форми та перевірені під час обробки запитів.

### Генерація маркерів

Клас безпеки генерує унікальні токени, які зберігаються в сеансі користувача та мають бути включені у форми:
```php
$security = new XoopsSecurity();

// Get token HTML input field
$tokenHTML = $security->getTokenHTML();

// Get just the token value
$tokenValue = $security->createToken();
```
### Перевірка маркера

Під час обробки надсилання форми переконайтеся, що маркер дійсний:
```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```
## Використання XOOPS Token System

### З класами XoopsForm

При використанні класів форм XOOPS захист токенів є простим:
```php
// Create a form
$form = new XoopsThemeForm('Add Item', 'form_name', 'submit.php');

// Add form elements
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('Content', 'content', ''));

// Add hidden token field - ALWAYS include this
$form->addElement(new XoopsFormHiddenToken());

// Add submit button
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));
```
### За допомогою спеціальних форм

Для спеціальних форм HTML, які не використовують XoopsForm:
```php
// In your form template or PHP file
$security = new XoopsSecurity();
?>
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    <!-- Include the token -->
    <?php echo $security->getTokenHTML(); ?>

    <button type="submit">Submit</button>
</form>
```
### У шаблонах Smarty

Під час створення форм у шаблонах Smarty:
```php
// In your PHP file
$security = new XoopsSecurity();
$GLOBALS['xoopsTpl']->assign('token', $security->getTokenHTML());
```

```smarty
{* In your template *}
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    {* Include the token *}
    <{$token}>

    <button type="submit">Submit</button>
</form>
```
## Обробка подання форми

### Базова перевірка маркерів
```php
// In your form processing script
$security = new XoopsSecurity();

// Verify the token
if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}

// Token is valid, process the form
$title = $_POST['title'];
// ... continue processing
```
### З індивідуальною обробкою помилок
```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Get detailed error information
    $errors = $security->getErrors();

    // Log the error
    error_log('CSRF token validation failed: ' . implode(', ', $errors));

    // Redirect with error message
    redirect_header('form.php', 3, 'Security token expired. Please try again.');
    exit();
}
```
### Для запитів AJAX

Працюючи із запитами AJAX, додайте в запит маркер:
```javascript
// JavaScript - get token from hidden field
var token = document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value;

// Include in AJAX request
fetch('ajax_handler.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'action=save&XOOPS_TOKEN_REQUEST=' + encodeURIComponent(token)
});
```

```php
// PHP AJAX handler
$security = new XoopsSecurity();

if (!$security->check()) {
    echo json_encode(['error' => 'Invalid security token']);
    exit();
}

// Process AJAX request
```
## Перевірка посилання HTTP

Для додаткового захисту, особливо для запитів AJAX, ви також можете перевірити реферер HTTP:
```php
$security = new XoopsSecurity();

// Check referer header
if (!$security->checkReferer()) {
    echo json_encode(['error' => 'Invalid request']);
    exit();
}

// Also verify the token
if (!$security->check()) {
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```
### Комбінована перевірка безпеки
```php
$security = new XoopsSecurity();

// Perform both checks
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```
## Конфігурація маркера

### Термін служби маркера

Жетони мають обмежений термін служби, щоб запобігти повторним атакам. Ви можете налаштувати це в налаштуваннях XOOPS або акуратно обробляти прострочені токени:
```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Token may have expired
    // Regenerate form with new token
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```
### Кілька форм на одній сторінці

Якщо у вас є кілька форм на одній сторінці, кожна має мати власний маркер:
```php
// Form 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Form 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```
## Найкращі практики

### Завжди використовуйте маркери для операцій зміни стану

Включайте маркери в будь-якій формі, яка:

- Створює дані
- Оновлення даних
- Видалення даних
- Змінює налаштування користувача
- Виконує будь-які адміністративні дії

### Не покладайтеся виключно на перевірку за рекомендаціями

Заголовок посилання HTTP може бути:

- Позбавлені інструментів конфіденційності
- Відсутній у деяких браузерах
- У деяких випадках підроблено

Завжди використовуйте перевірку маркерів як основний захист.

### Регенеруйте токени належним чином

Розглянемо регенерацію токенів:

- Після успішної подачі форми
- Після login/logout
- Через рівні проміжки часу для тривалих сеансів

### Витончено обробляйте термін дії маркера
```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Store form data temporarily
    $_SESSION['form_backup'] = $_POST;

    // Redirect back to form with message
    redirect_header('form.php?restore=1', 3, 'Please resubmit the form.');
    exit();
}
```
## Поширені проблеми та рішення

### Помилка маркера не знайдено

**Проблема**: помилка перевірки безпеки з повідомленням «токен не знайдено»

**Рішення**: переконайтеся, що поле маркера включено у вашу форму:
```php
$form->addElement(new XoopsFormHiddenToken());
```
### Помилка терміну дії маркера

**Проблема**: після тривалого заповнення форми користувачі бачать «термін дії маркера минув».

**Рішення**: спробуйте використовувати JavaScript для періодичного оновлення маркера:
```javascript
// Refresh token every 10 minutes
setInterval(function() {
    fetch('refresh_token.php')
        .then(response => response.json())
        .then(data => {
            document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value = data.token;
        });
}, 600000);
```
### Проблеми з маркером AJAX

**Проблема**: запити AJAX не проходять перевірку маркера

**Рішення**: переконайтеся, що маркер передається з кожним запитом AJAX і перевірте його на стороні сервера:
```php
// AJAX handler
header('Content-Type: application/json');

$security = new XoopsSecurity();
if (!$security->check(true, false)) { // Don't clear token for AJAX
    http_response_code(403);
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```
## Приклад: повна реалізація форми
```php
<?php
// form.php
require_once dirname(__DIR__) . '/mainfile.php';

$security = new XoopsSecurity();

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$security->check()) {
        redirect_header('form.php', 3, 'Security token expired. Please try again.');
        exit();
    }

    // Process valid submission
    $title = $myts->htmlSpecialChars($_POST['title']);
    // ... save to database

    redirect_header('success.php', 3, 'Item saved successfully!');
    exit();
}

// Display form
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

#безпека #csrf #xoops #форми #токени #XoopsSecurity