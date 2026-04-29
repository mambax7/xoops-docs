---
title: "Система шаблонів XOOPS"
description: "Інтеграція Smarty, клас XoopsTpl, змінні шаблону, керування темами та рендеринг шаблонів"
---
Система шаблонів XOOPS побудована на потужній системі шаблонів Smarty, що забезпечує гнучкий і розширюваний спосіб відокремлення логіки презентації від бізнес-логіки. Він керує темами, відтворенням шаблонів, призначенням змінних і генерацією динамічного вмісту.

## Архітектура шаблону
```mermaid
graph TD
    A[XoopsTpl] -->|extends| B[Smarty]
    A -->|manages| C[Themes]
    A -->|manages| D[Template Variables]
    A -->|handles| E[Block Rendering]

    C -->|contains| F[Templates]
    C -->|contains| G[CSS/JS]
    C -->|contains| H[Images]

    I[Theme Manager] -->|loads| C
    I -->|applies| J[Active Theme]
    I -->|configures| K[Template Paths]

    L[Block System] -->|uses| A
    M[Module Templates] -->|uses| A
    N[Admin Templates] -->|uses| A
```
## Клас XoopsTpl

Основний клас механізму шаблонів, який розширює Smarty.

### Огляд класу
```php
namespace Xoops\Core;

class XoopsTpl extends Smarty
{
    protected array $vars = [];
    protected string $currentTheme = '';
    protected array $blocks = [];
    protected bool $isAdmin = false;
}
```
### Розширення Smarty
```php
use Xoops\Core\XoopsTpl;

class XoopsTpl extends Smarty
{
    private static ?XoopsTpl $instance = null;

    private function __construct()
    {
        parent::__construct();
        $this->configureDirectories();
        $this->registerPlugins();
    }

    public static function getInstance(): XoopsTpl
    {
        if (!isset(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }
}
```
### Основні методи

#### getInstance

Отримує екземпляр шаблону singleton.
```php
public static function getInstance(): XoopsTpl
```
**Повертає:** `XoopsTpl` - екземпляр Singleton

**Приклад:**
```php
$xoopsTpl = XoopsTpl::getInstance();
```
#### призначити

Призначає змінну шаблону.
```php
public function assign(
    string|array $tplVar,
    mixed $value = null
): void
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$tplVar` | рядок\|масив | Ім'я змінної або асоціативний масив |
| `$value` | змішаний | Змінна величина |

**Приклад:**
```php
$xoopsTpl->assign('page_title', 'Welcome');
$xoopsTpl->assign('user_name', 'John Doe');

// Multiple assignments
$xoopsTpl->assign([
    'items' => $items,
    'total_count' => count($items),
    'show_pagination' => true
]);
```
#### appendAssign

Додає значення до змінних масиву шаблону.
```php
public function appendAssign(
    string $tplVar,
    mixed $value
): void
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$tplVar` | рядок | Ім'я змінної |
| `$value` | змішаний | Значення для додавання |

**Приклад:**
```php
$xoopsTpl->assign('breadcrumbs', ['Home']);
$xoopsTpl->appendAssign('breadcrumbs', 'Blog');
$xoopsTpl->appendAssign('breadcrumbs', 'Posts');
// breadcrumbs = ['Home', 'Blog', 'Posts']
```
#### getAssignedVars

Отримує всі призначені змінні шаблону.
```php
public function getAssignedVars(): array
```
**Повертає:** `array` - Призначені змінні

**Приклад:**
```php
$vars = $xoopsTpl->getAssignedVars();
foreach ($vars as $name => $value) {
    echo "$name = " . var_export($value, true) . "\n";
}
```
#### дисплей

Відтворює шаблон і виводить у браузер.
```php
public function display(
    string $resource,
    string|array $cache_id = null,
    string $compile_id = null,
    object $parent = null
): void
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$resource` | рядок | Шлях до файлу шаблону |
| `$cache_id` | рядок\|масив | Ідентифікатор кешу |
| `$compile_id` | рядок | Ідентифікатор компіляції |
| `$parent` | об'єкт | Батьківський об'єкт шаблону |

**Приклад:**
```php
$xoopsTpl->assign('page_title', 'Home');
$xoopsTpl->display('user:index.tpl');

// With absolute path
$xoopsTpl->display(XOOPS_ROOT_PATH . '/templates/user/index.tpl');
```
#### принести

Відтворює шаблон і повертає як рядок.
```php
public function fetch(
    string $resource,
    string|array $cache_id = null,
    string $compile_id = null,
    object $parent = null
): string
```
**Повернення:** `string` – відтворений вміст шаблону

**Приклад:**
```php
$xoopsTpl->assign('message', 'Hello World');
$html = $xoopsTpl->fetch('user:message.tpl');
echo $html;

// Use for email templates
$emailContent = $xoopsTpl->fetch('mail:notification.tpl');
mail($to, $subject, $emailContent);
```
#### loadTheme

Завантажує певну тему.
```php
public function loadTheme(string $themeName): bool
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$themeName` | рядок | Назва каталогу теми |

**Повертає:** `bool` - True у разі успіху

**Приклад:**
```php
if ($xoopsTpl->loadTheme('bluemoon')) {
    echo "Theme loaded successfully";
}
```
#### getCurrentTheme

Отримує назву поточної активної теми.
```php
public function getCurrentTheme(): string
```
**Повернення:** `string` - назва теми

**Приклад:**
```php
$currentTheme = $xoopsTpl->getCurrentTheme();
echo "Active theme: $currentTheme";
```
#### setOutputFilter

Додає вихідний фільтр для обробки вихідних даних шаблону.
```php
public function setOutputFilter(string $function): void
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$function` | рядок | Назва функції фільтра |

**Приклад:**
```php
// Remove whitespace from output
$xoopsTpl->setOutputFilter('trim');

// Custom filter
function my_output_filter($output) {
    // Minify HTML
    $output = preg_replace('/\s+/', ' ', $output);
    return trim($output);
}
$xoopsTpl->setOutputFilter('my_output_filter');
```
#### registerPlugin

Реєструє спеціальний плагін Smarty.
```php
public function registerPlugin(
    string $type,
    string $name,
    callable $callback
): void
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$type` | рядок | Тип плагіна (модифікатор, блок, функція) |
| `$name` | рядок | Назва плагіна |
| `$callback` | викликний | Функція зворотного виклику |

**Приклад:**
```php
// Register custom modifier
$xoopsTpl->registerPlugin('modifier', 'markdown', function($text) {
    return markdown_parse($text);
});

// Use in template: {$content|markdown}

// Register custom block tag
$xoopsTpl->registerPlugin('block', 'permission', function($params, $content, $smarty, &$repeat) {
    if ($repeat) return;

    // Check permission
    if (has_permission($params['name'])) {
        return $content;
    }
    return '';
});

// Use in template: {permission name="admin"}...{/permission}
```
## Система тем

### Структура теми

Стандартна структура каталогу теми XOOPS:
```
bluemoon/
├── style.css              # Main stylesheet
├── admin.css              # Admin stylesheet
├── theme.html             # Main page template
├── admin.html             # Admin page template
├── blocks/                # Block templates
│   ├── block_left.tpl
│   └── block_right.tpl
├── modules/               # Module templates
│   ├── publisher/
│   │   ├── index.tpl
│   │   └── item.tpl
│   └── news/
│       └── index.tpl
├── images/                # Theme images
│   ├── logo.png
│   └── banner.png
├── js/                    # Theme JavaScript
│   └── script.js
└── readme.txt             # Theme documentation
```
### Клас менеджера тем
```php
namespace Xoops\Core\Theme;

class ThemeManager
{
    protected array $themes = [];
    protected string $activeTheme = '';
    protected string $themeDirectory = '';

    public function getActiveTheme(): string {}
    public function setActiveTheme(string $theme): bool {}
    public function getThemeList(): array {}
    public function themeExists(string $name): bool {}
}
```
## Змінні шаблону

### Стандартні глобальні змінні

XOOPS автоматично призначає кілька глобальних змінних шаблону:

| Змінна | Тип | Опис |
|----------|------|-------------|
| `$xoops_url` | рядок | Установка XOOPS URL |
| `$xoops_user` | XoopsUser\|null | Поточний об'єкт користувача |
| `$xoops_uname` | рядок | Поточне ім'я користувача |
| `$xoops_isadmin` | bool | Користувач адміністратор |
| `$xoops_banner` | рядок | Банер HTML |
| `$xoops_notification` | рядок | Розмітка сповіщень |
| `$xoops_version` | рядок | Версія XOOPS |

### Спеціальні змінні для блоку

Під час відтворення блоків:

| Змінна | Тип | Опис |
|----------|------|-------------|
| `$block` | масив | Інформаційний блок |
| `$block.title` | рядок | Назва блоку |
| `$block.content` | рядок | Блокувати вміст |
| `$block.id` | int | Ідентифікатор блоку |
| `$block.module` | рядок | Назва модуля |

### Змінні шаблону модуля

Модулі зазвичай призначають:

| Змінна | Тип | Опис |
|----------|------|-------------|
| `$module_name` | рядок | Відображуване ім'я модуля |
| `$module_dir` | рядок | Каталог модулів |
| `$xoops_module_header` | рядок | Модуль CSS/JS |

## Конфігурація Smarty

### Загальні модифікатори Smarty

| Модифікатор | Опис | Приклад |
|----------|-------------|---------|
| `capitalize` | Велика перша літера | `{$title\|capitalize}` |
| `count_characters` | Кількість символів | `{$text\|count_characters}` |
| `date_format` | Форматувати позначку часу | `{$timestamp\|date_format:'%Y-%m-%d'}` |
| `escape` | Ескейп спеціальні символи | `{$html\|escape:'html'}` |
| `nl2br` | Перетворення символів нового рядка на `<br>` | `{$text\|nl2br}` |
| `strip_tags` | Видалити теги HTML | `{$content\|strip_tags}` |
| `truncate` | Обмежити довжину рядка | `{$text\|truncate:100}` |
| `upper` | Перетворити у верхній регістр | `{$name\|upper}` |
| `lower` | Перетворити на малі літери | `{$name\|lower}` |

### Керуючі структури
```smarty
{* If statement *}
{if $user->isAdmin()}
    <p>Admin content</p>
{else}
    <p>User content</p>
{/if}

{* For loop *}
{foreach $items as $item}
    <div class="item">{$item.title}</div>
{/foreach}

{* For loop with counter *}
{foreach $items as $item name=item_loop}
    {$smarty.foreach.item_loop.iteration}: {$item.title}
{/foreach}

{* While loop *}
{while $condition}
    <!-- content -->
{/while}

{* Switch statement *}
{switch $status}
    {case 'draft'}<span class="draft">Draft</span>{break}
    {case 'published'}<span class="published">Published</span>{break}
    {default}<span class="unknown">Unknown</span>
{/switch}
```
## Повний приклад шаблону

### Код PHP
```php
<?php
/**
 * Module Article List Page
 */

include __DIR__ . '/include/common.inc.php';

$xoopsTpl = XoopsTpl::getInstance();

// Check if module is active
$module = xoops_getModuleByDirname('articles');
if (!$module) {
    redirect_header(XOOPS_URL, 3, 'Module not found');
}

// Get item handler
$itemHandler = xoops_getModuleHandler('item', 'articles');

// Get pagination parameters
$page = !empty($_GET['page']) ? (int)$_GET['page'] : 1;
$perPage = $module->getConfig('items_per_page') ?: 10;
$offset = ($page - 1) * $perPage;

// Build criteria
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$criteria->setSort('published', 'DESC');
$criteria->setLimit($perPage);
$criteria->setStart($offset);

// Fetch items
$items = $itemHandler->getObjects($criteria);
$total = $itemHandler->getCount(new Criteria('status', 1));

// Calculate pagination
$pages = ceil($total / $perPage);

// Assign template variables
$xoopsTpl->assign([
    'module_name' => $module->getName(),
    'items' => $items,
    'total_items' => $total,
    'current_page' => $page,
    'total_pages' => $pages,
    'items_per_page' => $perPage,
    'show_pagination' => $pages > 1
]);

// Add breadcrumbs
$xoopsTpl->assign('xoops_breadcrumbs', [
    ['url' => XOOPS_URL, 'title' => 'Home'],
    ['url' => $module->getUrl(), 'title' => $module->getName()],
    ['title' => 'Articles']
]);

// Display template
$xoopsTpl->display($module->getPath() . '/templates/user/list.tpl');
```
### Файл шаблону (list.tpl)
```smarty
<div id="articles-list">
    <h1>{$module_name|escape}</h1>

    {if $items}
        <div class="articles-container">
            {foreach $items as $item}
                <article class="article-item">
                    <header>
                        <h2>
                            <a href="{$item.url|escape}">
                                {$item.title|escape}
                            </a>
                        </h2>
                        <div class="meta">
                            <span class="author">By {$item.author|escape}</span>
                            <span class="date">
                                {$item.published|date_format:'%B %d, %Y'}
                            </span>
                        </div>
                    </header>

                    <div class="content">
                        <p>{$item.summary|truncate:150}</p>
                    </div>

                    <footer>
                        <a href="{$item.url|escape}" class="read-more">
                            Read More »
                        </a>
                    </footer>
                </article>
            {/foreach}
        </div>

        {* Pagination *}
        {if $show_pagination}
            <nav class="pagination">
                {if $current_page > 1}
                    <a href="?page=1" class="first">« First</a>
                    <a href="?page={$current_page - 1}" class="prev">‹ Previous</a>
                {/if}

                {for $i=1 to $total_pages}
                    {if $i == $current_page}
                        <span class="current">{$i}</span>
                    {else}
                        <a href="?page={$i}">{$i}</a>
                    {/if}
                {/for}

                {if $current_page < $total_pages}
                    <a href="?page={$current_page + 1}" class="next">Next ›</a>
                    <a href="?page={$total_pages}" class="last">Last »</a>
                {/if}
            </nav>
        {/if}
    {else}
        <p class="no-items">No articles found.</p>
    {/if}
</div>
```
## Спеціальні функції Smarty

### Створення спеціальної функції блоку
```php
<?php
/**
 * Custom Smarty block function for permission checking
 */

function smarty_block_permission($params, $content, $smarty, &$repeat)
{
    if ($repeat) return;

    if (!isset($params['name'])) {
        return 'Permission name required';
    }

    $permName = $params['name'];
    $user = $GLOBALS['xoopsUser'];

    // Check if user has permission
    if ($user && $user->isAdmin()) {
        return $content;
    }

    if ($user && check_user_permission($user->uid(), $permName)) {
        return $content;
    }

    return '';
}
```
Реєструйтеся та використовуйте:
```php
$xoopsTpl->registerPlugin('block', 'permission', 'smarty_block_permission');
```
Шаблон:
```smarty
{permission name="edit_articles"}
    <button>Edit Article</button>
{/permission}
```
## Найкращі практики

1. **Вихід із вмісту користувача** - завжди використовуйте `|escape` для вмісту, створеного користувачами
2. **Використовуйте шляхи до шаблонів** – довідкові шаблони щодо теми
3. **Відокремте логіку від презентації** - Зберігайте складну логіку в PHP
4. **Шаблони кешу** - увімкніть кешування шаблонів у виробництві
5. **Правильно використовуйте модифікатори** - застосовуйте відповідні фільтри для контексту
6. **Упорядкувати блоки** - Розмістіть шаблони блоків у спеціальному каталозі
7. **Змінні документа** - задокументуйте всі змінні шаблону в PHP

## Пов'язана документація

- ../Module/Module-System - Модульна система та гаки
- ../Kernel/Kernel-Classes - Ядро та конфігурація
- ../Core/XoopsObject - Базовий клас об'єктів

---

*Див. також: [Документація Smarty](https://www.smarty.net/docs) | [XOOPS Шаблон API](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class)*