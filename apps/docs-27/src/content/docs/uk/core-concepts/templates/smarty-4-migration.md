---
title: "Smarty 4 Міграція"
description: "Посібник з оновлення шаблонів XOOPS із Smarty 3 до Smarty 4"
---
У цьому посібнику описано зміни та етапи міграції, необхідні під час оновлення з Smarty 3 до Smarty 4 у XOOPS. Розуміння цих відмінностей є важливим для підтримки сумісності з сучасними установками XOOPS.

## Пов'язана документація

- Smarty-Basics - Основи Smarty у XOOPS
- Розробка тем - Створення тем XOOPS
- Template-Variables - доступні змінні в шаблонах

## Огляд змін

У Smarty 4 представлено кілька критичних змін у порівнянні з Smarty 3:

1. Змінено поведінку присвоювання змінних
2. Теги `{php}` повністю видалено
3. Кешування змін API
4. Модифікатор обробки оновлень
5. Зміни політики безпеки
6. Застарілі функції видалено

## Зміни доступу до змінних

### Проблема

У Smarty 2/3 призначені значення були доступні безпосередньо:
```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - worked fine *}
<img src="<{$mod_url}>/assets/images/icon.png">
```
У Smarty 4 змінні загорнуті в об’єкти `Smarty_Variable`:
```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```
### Рішення 1: отримати доступ до властивості Value
```smarty
{* Smarty 4 - access the value property *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```
### Рішення 2: Режим сумісності

Увімкніть режим сумісності в PHP:
```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```
Це дозволяє прямий доступ до змінних, наприклад Smarty 3.

### Рішення 3: Умовна перевірка версії

Напишіть шаблони, які працюють в обох версіях:
```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```
### Рішення 4: функція Wrapper

Створіть допоміжну функцію для завдань:
```php
function smartyAssign($smarty, $name, $value)
{
    if (version_compare($smarty->version, '4.0.0', '>=')) {
        // Smarty 4+ - assign normally, access via ->value in templates
        $smarty->assign($name, $value);
    } else {
        // Smarty 3 - standard assignment
        $smarty->assign($name, $value);
    }
}
```
## Видалення тегів {php}

### Проблема

Smarty 3+ не підтримує теги `{php}` з міркувань безпеки:
```smarty
{* This NO LONGER works in Smarty 3+ *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```
### Рішення: використовуйте змінні Smarty
```smarty
{* Use Smarty's built-in variable access *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```
### Рішення: перемістіть логіку в PHP

Складна логіка має бути в PHP, а не в шаблонах:
```php
// In PHP - do the processing
$catid = $downloads['cid'];
$categoryInfo = getCategoryInfo($catid);

// Assign processed data to template
$GLOBALS['xoopsTpl']->assign('category', $categoryInfo);
```

```smarty
{* In template - just display *}
<h2><{$category.name}></h2>
```
### Рішення: спеціальні плагіни

Для багаторазового використання створіть плагіни Smarty:
```php
// /class/smarty/plugins/function.getcategory.php
function smarty_function_getcategory($params, $smarty)
{
    $catId = $params['id'] ?? 0;
    $categoryHandler = xoops_getModuleHandler('category', 'mymodule');
    $category = $categoryHandler->get($catId);

    if ($category) {
        $smarty->assign($params['assign'], $category->toArray());
    }
}
```

```smarty
{* In template *}
<{getcategory id=$cid assign="category"}>
<h2><{$category.name}></h2>
```
## Кешування змін

### Smarty 3 Кешування
```php
// Smarty 3 style
$smarty->caching = true;
$smarty->cache_lifetime = 3600;
$smarty->cache_dir = '/path/to/cache';

// Per-variable nocache
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```
### Smarty 4 Кешування
```php
// Smarty 4 style
$smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$smarty->setCacheLifetime(3600);
$smarty->setCacheDir('/path/to/cache');

// Or using properties (still works)
$smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$smarty->cache_lifetime = 3600;
```
### Кешування констант
```php
// Caching modes
Smarty::CACHING_OFF                  // No caching
Smarty::CACHING_LIFETIME_CURRENT     // Use cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // Use cached lifetime
```
### Nocache у шаблонах
```smarty
{* Mark content as never cached *}
<{nocache}>
    <p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```
## Зміни модифікатора

### Модифікатори рядків

Деякі модифікатори були перейменовані або визнані застарілими:
```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - use 'html' instead *}
<{$text|escape:'html'}>
```
### Модифікатори масиву

Для модифікаторів масиву потрібен префікс `@`:
```smarty
{* Count array elements *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```
### Спеціальні модифікатори

Користувацькі модифікатори повинні бути зареєстровані:
```php
// Register a custom modifier
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // Process and return
    return processed_string($string, $param1);
}
```
## Зміни політики безпеки

### Smarty 4 Безпека

Smarty 4 має суворішу безпеку за замовчуванням:
```php
// Configure security policy
$smarty->enableSecurity('Smarty_Security');

// Or create custom policy
class MySecurityPolicy extends Smarty_Security
{
    public $php_functions = ['isset', 'empty', 'count'];
    public $php_modifiers = ['escape', 'count'];
    public $allow_super_globals = false;
}

$smarty->enableSecurity(new MySecurityPolicy($smarty));
```
### Дозволені функції

За замовчуванням Smarty 4 обмежує, які функції PHP можна використовувати:
```smarty
{* These may be restricted *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```
За потреби налаштуйте дозволені функції:
```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```
## Оновлення успадкування шаблонів

### Синтаксис блоку

Синтаксис блоку залишається подібним, але з деякими змінами:
```smarty
{* Parent template *}
<html>
<head>
    {block name=head}
    <title>Default Title</title>
    {/block}
</head>
<body>
    {block name=content}{/block}
</body>
</html>
```

```smarty
{* Child template *}
{extends file="parent.tpl"}

{block name=head}
    {$smarty.block.parent}  {* Include parent block content *}
    <meta name="custom" content="value">
{/block}

{block name=content}
    <h1>My Content</h1>
{/block}
```
### Додавання та початок
```smarty
{block name=head append}
    {* This is added after parent content *}
    <link rel="stylesheet" href="extra.css">
{/block}

{block name=scripts prepend}
    {* This is added before parent content *}
    <script src="early.js"></script>
{/block}
```
## Застарілі функції

### Видалено в Smarty 4

| Особливість | Альтернатива |
|---------|-------------|
| `{php}` теги | Перемістіть логіку до PHP або скористайтеся плагінами |
| `{include_php}` | Використовуйте зареєстровані плагіни |
| `$smarty.capture` | Все ще працює, але не підтримується |
| `{strip}` з пробілами | Використовуйте інструменти мінімізації |

### Використовуйте альтернативи
```smarty
{* Instead of {php} *}
{* Move to PHP and assign result *}

{* Instead of include_php *}
<{include file="db:mytemplate.tpl"}>

{* Instead of capture (still works but consider) *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
<{/capture}>
<div><{$smarty.capture.sidebar}></div>
```
## Контрольний список міграції

### Перед міграцією

1. [ ] Створіть резервну копію всіх шаблонів
2. [ ] Перелік усіх використаних тегів `{php}`
3. [ ] Спеціальні плагіни документа
4. [ ] Перевірте поточну функціональність

### Під час міграції

1. [ ] Видаліть усі теги `{php}`
2. [ ] Оновити синтаксис доступу до змінних
3. [ ] Перевірте використання модифікатора
4. [ ] Оновити конфігурацію кешування
5. [ ] Перегляньте налаштування безпеки

### Після міграції

1. [ ] Перевірте всі шаблони
2. [ ] Перевірте роботу всіх форм
3. [ ] Перевірка кешування працює
4. [ ] Перевірте з різними ролями користувачів

## Тестування на сумісність

### Виявлення версії
```php
// Check Smarty version in PHP
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Smarty 4+ specific code
} else {
    // Smarty 3 code
}
```
### Перевірка версії шаблону
```smarty
{* Check version in template *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Smarty 4+ template code *}
<{else}>
    {* Smarty 3 template code *}
<{/if}>
```
## Написання крос-сумісних шаблонів

### Найкращі практики

1. **Повністю уникайте тегів `{php}`** - вони не працюють у Smarty 3+

2. **Зберігайте шаблони простими** - Складна логіка належить до PHP

3. **Використовуйте стандартні модифікатори** – уникайте застарілих

4. **Тестуйте в обох версіях** - якщо вам потрібно підтримувати обидві

5. **Використовуйте плагіни для складних операцій** - Більш зручна в обслуговуванні

### Приклад: крос-сумісний шаблон
```smarty
{* Works in both Smarty 3 and 4 *}
<!DOCTYPE html>
<html>
<head>
    <title><{$page_title|default:'Default Title'|escape}></title>
</head>
<body>
    <{if isset($items) && $items|@count > 0}>
        <ul>
        <{foreach $items as $item}>
            <li><{$item.name|escape}></li>
        <{/foreach}>
        </ul>
    <{else}>
        <p>No items found.</p>
    <{/if}>
</body>
</html>
```
## Поширені проблеми міграції

### Проблема: змінні повертають порожні

**Проблема**: `<{$mod_url}>` нічого не повертає в Smarty 4

**Рішення**: використовуйте `<{$mod_url->value}>` або ввімкніть режим сумісності

### Проблема: помилки тегів PHP

**Проблема**: шаблон видає помилку для тегів `{php}`

**Рішення**: видаліть усі теги PHP і перемістіть логіку до файлів PHP

### Проблема: модифікатор не знайдено

**Проблема**: спеціальний модифікатор видає помилку "невідомий модифікатор".

**Рішення**: зареєструйте модифікатор за допомогою `registerPlugin()`

### Проблема: обмеження безпеки

**Проблема**: функція не дозволена в шаблоні

**Рішення**: додайте функцію до дозволеного списку політики безпеки

---

#smarty #migration #upgrade #xoops #smarty4 #compatibility