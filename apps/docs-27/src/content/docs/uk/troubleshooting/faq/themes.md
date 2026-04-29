---
title: "Тема FAQ"
description: "Часті запитання щодо XOOPS тем"
---
# Тема Часті запитання

> Поширені запитання та відповіді щодо тем XOOPS, налаштування та керування.

---

## Встановлення та активація теми

### Q: Як мені встановити нову тему в XOOPS?

**A:**
1. Завантажте zip-файл теми
2. Перейдіть до XOOPS Адміністратор > Вигляд > Теми
3. Натисніть «Завантажити» та виберіть файл zip
4. Тема з’явиться у списку тем
5. Натисніть, щоб активувати його для свого сайту

Альтернатива: розпакуйте вручну в каталог `/themes/` та оновіть панель адміністратора.

---

### Q: Завантаження теми не вдається через "Дозвіл відмовлено"

**A:** Виправити дозволи каталогу тем:
```bash
# Make themes directory writable
chmod 755 /path/to/xoops/themes

# Fix uploads if uploading
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops/themes
```
---

### Q: Як встановити іншу тему для окремих користувачів?

**A:**
1. Перейдіть до Менеджера користувачів > Редагувати користувача
2. Перейдіть на вкладку «Інше».
3. Виберіть потрібну тему в спадному списку «Тема користувача».
4. Зберегти

Вибрані користувачем теми замінюють тему сайту за замовчуванням.

---

### Q: Чи можу я мати різні теми для сайтів адміністратора та користувачів?

**A:** Так, установіть у XOOPS Адміністратор > Налаштування:

1. **Frontend theme** – тема сайту за умовчанням
2. **Тема адміністратора** – тема панелі керування адміністратора (зазвичай окрема)

Знайдіть такі параметри, як:
- `theme_set` - Тема інтерфейсу
- `admin_theme` - Тема адміністратора

---

## Налаштування теми

### Q: Як налаштувати існуючу тему?

**A:** Створіть дочірню тему, щоб зберегти оновлення:
```
themes/
├── original_theme/
│   ├── style.css
│   ├── templates/
│   └── images/
└── custom_theme/          {* Create copy for editing *}
    ├── style.css
    ├── templates/
    └── images/
```
Потім відредагуйте `theme.html` у власній темі.

---

### З: Як змінити кольори теми?

**A:** Відредагуйте файл CSS теми:
```bash
# Locate theme CSS
themes/mytheme/style.css

# Or theme template
themes/mytheme/theme.html
```
Для 000000 тем:
```css
/* themes/mytheme/style.css */
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
}

body {
    background-color: var(--primary-color);
    color: #333;
}

a {
    color: var(--secondary-color);
}

.button {
    background-color: var(--accent-color);
}
```
---

### Q: Як додати власний CSS до теми?

**A:** Кілька варіантів:

**Варіант 1: Редагувати theme.html**
```html
<!-- themes/mytheme/theme.html -->
<head>
    {* Existing CSS *}
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/custom.css">
</head>
```
**Варіант 2: створити custom.css**
```bash
# Create file
themes/mytheme/custom.css

# Add your styles
body { background: #fff; }
```
**Варіант 3: налаштування адміністратора (якщо підтримується)**
Перейдіть до XOOPS Адміністратор > Налаштування > Налаштування теми та додайте власний CSS.

---

### З: Як змінити шаблони теми HTML?

**A:** Знайдіть файл шаблону:
```bash
# List theme templates
ls -la themes/mytheme/templates/

# Common templates
themes/mytheme/templates/theme.html      {* Main layout *}
themes/mytheme/templates/header.html     {* Header *}
themes/mytheme/templates/footer.html     {* Footer *}
themes/mytheme/templates/sidebar.html    {* Sidebar *}
```
Відредагуйте з відповідним синтаксисом Smarty:
```html
<!-- themes/mytheme/templates/theme.html -->
{* XOOPS Theme Template *}
<!DOCTYPE html>
<html>
<head>
    <meta charset="{$xoops_charset}">
    <title>{$xoops_pagetitle}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
</head>
<body>
    <header>
        {include file="file:header.html"}
    </header>

    <main>
        <div class="container">
            <div class="row">
                <div class="col-md-9">
                    {$xoops_contents}
                </div>
                <aside class="col-md-3">
                    {include file="file:sidebar.html"}
                </aside>
            </div>
        </div>
    </main>

    <footer>
        {include file="file:footer.html"}
    </footer>
</body>
</html>
```
---

## Структура теми

### Q: Які файли потрібні для теми?

**A:** Мінімальна структура:
```
themes/mytheme/
├── theme.html              {* Main template (required) *}
├── style.css              {* Stylesheet (optional but recommended) *}
├── screenshot.png         {* Preview image for admin (optional) *}
├── images/                {* Theme images *}
│   └── logo.png
└── templates/             {* Optional: Additional templates *}
    ├── header.html
    ├── footer.html
    └── sidebar.html
```
Дивіться структуру теми для деталей.

---

### З: Як створити тему з нуля?

**A:** Створіть структуру:
```bash
mkdir -p themes/mytheme/images
cd themes/mytheme
```
Створити `theme.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="{$xoops_charset}">
    <title>{$xoops_pagetitle}</title>
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
</head>
<body>
    <header>{$xoops_headers}</header>
    <main>{$xoops_contents}</main>
    <footer>{$xoops_footers}</footer>
</body>
</html>
```
Створити `style.css`:
```css
* { margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; }
header { background: #333; color: #fff; padding: 20px; }
main { padding: 20px; }
footer { background: #f5f5f5; padding: 20px; border-top: 1px solid #ddd; }
```
---

## Змінні теми

### Q: Які змінні доступні в шаблонах тем?

**A:** Загальні XOOPS змінні теми:
```smarty
{* Site Information *}
{$xoops_sitename}          {* Site name *}
{$xoops_url}               {* Site URL *}
{$xoops_theme}             {* Current theme name *}

{* Page Content *}
{$xoops_contents}          {* Main page content *}
{$xoops_pagetitle}         {* Page title *}
{$xoops_headers}           {* Meta tags, styles in head *}

{* Module Information *}
{$xoops_module_header}     {* Module-specific header *}
{$xoops_moduledesc}        {* Module description *}

{* User Information *}
{$xoops_isuser}            {* Is user logged in? *}
{$xoops_userid}            {* User ID *}
{$xoops_uname}             {* Username *}

{* Blocks *}
{$xoops_blocks}            {* All block content *}

{* Other *}
{$xoops_charset}           {* Document charset *}
{$xoops_version}           {* XOOPS version *}
```
---

### З: Як додати користувальницькі змінні до моєї теми?

**A:** У вашому коді PHP перед відтворенням:
```php
<?php
// In module or admin code
require_once XOOPS_ROOT_PATH . '/class/xoopstpl.php';
$xoopsTpl = new XoopsTpl();

// Add custom variables
$xoopsTpl->assign('my_variable', 'value');
$xoopsTpl->assign('data_array', ['key1' => 'val1', 'key2' => 'val2']);

// Use in theme template
$xoopsTpl->display('file:theme.html');
?>
```
В темі:
```smarty
<p>{$my_variable}</p>
<p>{$data_array.key1}</p>
```
---

## Стиль теми

### З: Як зробити свою тему адаптивною?

**A:** Використовуйте CSS Grid або Flexbox:
```css
/* themes/mytheme/style.css */

/* Mobile first approach */
body {
    font-size: 14px;
}

.container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}

main {
    order: 2;
}

aside {
    order: 3;
}

/* Tablet and up */
@media (min-width: 768px) {
    .container {
        grid-template-columns: 2fr 1fr;
    }
}

/* Desktop and up */
@media (min-width: 1200px) {
    .container {
        grid-template-columns: 3fr 1fr;
    }
}
```
Або скористайтеся інтеграцією Bootstrap:
```html
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<div class="container">
    <div class="row">
        <div class="col-md-9">{$xoops_contents}</div>
        <div class="col-md-3">{* Sidebar *}</div>
    </div>
</div>
```
---

### Q: Як додати темний режим до своєї теми?

**A:**
```css
/* themes/mytheme/style.css */

/* Light mode (default) */
:root {
    --bg-color: #ffffff;
    --text-color: #000000;
    --border-color: #cccccc;
}

body {
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
    :root {
        --bg-color: #1a1a1a;
        --text-color: #ffffff;
        --border-color: #444444;
    }
}

/* Or with CSS class */
body.dark-mode {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
    --border-color: #444444;
}
```
Перемикання з JavaScript:
```html
<script>
document.getElementById('dark-mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Load preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
</script>
```
---

## Тематичні питання

### З: Тема показує помилки «нерозпізнана змінна шаблону».

**A:** Змінна не передається в шаблон. перевірити:

1. **Змінна призначається** в PHP:
```php
<?php
$xoopsTpl->assign('variable_name', $value);
?>
```
2. **Шаблон існує**, де вказано
3. **Синтаксис шаблону правильний**:
```smarty
{* Correct *}
{$variable_name}

{* Wrong *}
$variable_name
{variable_name}
```
---

### Q: CSS зміни не відображаються в браузері

**A:** Очистити кеш браузера:

1. Повне оновлення: `Ctrl+Shift+R` (Cmd+Shift+R на Mac)
2. Очистіть кеш теми на сервері:
```bash
rm -rf xoops_data/caches/smarty_cache/themes/*
rm -rf xoops_data/caches/smarty_compile/themes/*
```
3. Перевірте шлях до файлу CSS у темі:
```bash
ls -la themes/mytheme/style.css
```
---

### Q: Зображення в темі не завантажуються

**A:** Перевірте шляхи зображень:
```html
{* WRONG - relative path from web root *}
<img src="themes/mytheme/images/logo.png">

{* CORRECT - use xoops_url *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* Or in CSS *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```
---

### Q: Шаблони тем відсутні або викликають помилки

**A:** Перегляньте помилки шаблону для налагодження.

---

## Розповсюдження теми

### З: Як запакувати тему для розповсюдження?

**A:** Створіть розповсюджуваний zip:
```bash
# Structure
mytheme/
├── theme.html           {* Required *}
├── style.css
├── screenshot.png       {* 300x225 recommended *}
├── README.txt
├── LICENSE
├── images/
│   ├── logo.png
│   └── favicon.ico
└── templates/           {* Optional *}
    ├── header.html
    └── footer.html

# Create zip
zip -r mytheme.zip mytheme/
```
---

### З: Чи можу я продати свою тему XOOPS?

**A:** Перевірити ліцензію XOOPS:
- Теми, що використовують XOOPS classes/templates, мають відповідати ліцензії XOOPS
- Чисті теми CSS/HTML мають менше обмежень
- Перегляньте XOOPS Інструкції щодо внесення подробиць, щоб дізнатися більше

---

## Виконання теми

### З: Як оптимізувати продуктивність теми?

**A:**
1. **Згорнути CSS/JS** – видалити невикористаний код
2. **Оптимізуйте зображення** - використовуйте відповідні формати (WebP, AVIF)
3. **Використовуйте CDN** для ресурсів
4. **Відкладене завантаження** зображень:
```html
<img src="image.jpg" loading="lazy">
```
5. **Кешовані версії**:
```html
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css?v={$xoops_version}">
```
Див. Продуктивність FAQ для отримання додаткової інформації.

---

## Пов'язана документація

- Помилки шаблону
- Структура теми
- Продуктивність FAQ
- Smarty Debugging

---

#XOOPS #themes #faq #troubleshooting #customization