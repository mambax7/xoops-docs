---
title: "XOOPS sablonrendszer"
description: "Intelligens integráció, XOOPSTpl osztály, sablonváltozók, témakezelés és sablonmegjelenítés"
---
A XOOPS sablonrendszer az erőteljes Smarty sablonmotorra épül, rugalmas és bővíthető módot biztosítva a prezentációs logika és az üzleti logika elkülönítésére. Kezeli a témákat, a sablonok megjelenítését, a változók hozzárendelését és a dinamikus tartalomgenerálást.

## Template Architecture

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

## XOOPSTpl osztály

A fő sablon motorosztály, amely kiterjeszti a Smartyt.

### Osztály áttekintése

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

### Extending Smarty

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

### Alapvető módszerek

#### getInstance

Lekéri a singleton sablonpéldányt.

```php
public static function getInstance(): XoopsTpl
```

**Visszaküldés:** `XOOPSTpl` - Egyetlen példány

**Példa:**
```php
$xoopsTpl = XoopsTpl::getInstance();
```

#### assign

Változót rendel a sablonhoz.

```php
public function assign(
    string|array $tplVar,
    mixed $value = null
): void
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$tplVar` | string\|tömb | Változónév vagy asszociatív tömb |
| `$value` | vegyes | Variable value |

**Példa:**
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

Értékeket fűz hozzá a sablontömb változóihoz.

```php
public function appendAssign(
    string $tplVar,
    mixed $value
): void
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$tplVar` | húr | Változó neve |
| `$value` | vegyes | Value to append |

**Példa:**
```php
$xoopsTpl->assign('breadcrumbs', ['Home']);
$xoopsTpl->appendAssign('breadcrumbs', 'Blog');
$xoopsTpl->appendAssign('breadcrumbs', 'Posts');
// breadcrumbs = ['Home', 'Blog', 'Posts']
```

#### getAssignedVars

Lekéri az összes hozzárendelt sablonváltozót.

```php
public function getAssignedVars(): array
```

**Vissza:** `array` – Hozzárendelt változók

**Példa:**
```php
$vars = $xoopsTpl->getAssignedVars();
foreach ($vars as $name => $value) {
    echo "$name = " . var_export($value, true) . "\n";
}
```

#### display

Megjeleníti a sablont, és kiadja a böngészőbe.

```php
public function display(
    string $resource,
    string|array $cache_id = null,
    string $compile_id = null,
    object $parent = null
): void
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$resource` | húr | Template file path |
| `$cache_id` | string\|tömb | Cache identifier |
| `$compile_id` | húr | Compile identifier |
| `$parent` | object | Parent template object |

**Példa:**
```php
$xoopsTpl->assign('page_title', 'Home');
$xoopsTpl->display('user:index.tpl');

// With absolute path
$xoopsTpl->display(XOOPS_ROOT_PATH . '/templates/user/index.tpl');
```

#### fetch

Megjelenít egy sablont, és karakterláncként tér vissza.

```php
public function fetch(
    string $resource,
    string|array $cache_id = null,
    string $compile_id = null,
    object $parent = null
): string
```

**Visszaküldés:** `string` – Renderelt sablontartalom

**Példa:**
```php
$xoopsTpl->assign('message', 'Hello World');
$html = $xoopsTpl->fetch('user:message.tpl');
echo $html;

// Use for email templates
$emailContent = $xoopsTpl->fetch('mail:notification.tpl');
mail($to, $subject, $emailContent);
```

#### loadTheme

Loads a specific theme.

```php
public function loadTheme(string $themeName): bool
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$themeName` | húr | Theme directory name |

**Visszaküldés:** `bool` - Igaz a sikerre

**Példa:**
```php
if ($xoopsTpl->loadTheme('bluemoon')) {
    echo "Theme loaded successfully";
}
```

#### getCurrentTheme

Gets the name of the currently active theme.

```php
public function getCurrentTheme(): string
```

**Visszaküldés:** `string` – A téma neve

**Példa:**
```php
$currentTheme = $xoopsTpl->getCurrentTheme();
echo "Active theme: $currentTheme";
```

#### setOutputFilter

Kimeneti szűrőt ad hozzá a sablonkimenet feldolgozásához.

```php
public function setOutputFilter(string $function): void
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$function` | húr | Filter function name |

**Példa:**
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

Egyéni Smarty bővítmény regisztrálása.

```php
public function registerPlugin(
    string $type,
    string $name,
    callable $callback
): void
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$type` | húr | Beépülő modul típusa (módosító, blokk, függvény) |
| `$name` | húr | Plugin name |
| `$callback` | hívható | Callback function |

**Példa:**
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

## Theme System

### Theme Structure

Szabványos XOOPS téma könyvtárszerkezet:

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

### Theme Manager Class

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

## Template Variables

### Szabványos globális változók

XOOPS automatikusan hozzárendel több globális sablonváltozót:

| Variable | Típus | Leírás |
|----------|------|--------------|
| `$xoops_url` | húr | XOOPS telepítés URL |
| `$xoops_user` | XOOPSUser\|null | Current user object |
| `$xoops_uname` | húr | Current username |
| `$xoops_isadmin` | bool | User is admin |
| `$xoops_banner` | húr | Banner HTML |
| `$xoops_notification` | húr | Notification markup |
| `$xoops_version` | húr | XOOPS verzió |

### Blokkspecifikus változók

When rendering blocks:

| Variable | Típus | Leírás |
|----------|------|--------------|
| `$block` | tömb | Block information |
| `$block.title` | húr | Block title |
| `$block.content` | húr | Block content |
| `$block.id` | int | Block ID |
| `$block.module` | húr | module name |

### modulsablon változóiA modulok általában a következőket rendelik hozzá:

| Variable | Típus | Leírás |
|----------|------|--------------|
| `$module_name` | húr | modul megjelenített neve |
| `$module_dir` | húr | module directory |
| `$xoops_module_header` | húr | modul CSS/JS |

## Smarty Configuration

### Általános Smarty módosítók

| Modifier | Leírás | Példa |
|----------|-------------|---------|
| `capitalize` | Nagy kezdőbetű | `{$title\|capitalize}` |
| `count_characters` | Character count | `{$text\|count_characters}` |
| `date_format` | Format timestamp | `{$timestamp\|date_format:'%Y-%m-%d'}` |
| `escape` | Escape special chars | `{$html\|escape:'html'}` |
| `nl2br` | Új sorok konvertálása `<br>` | `{$text\|nl2br}` |
| `strip_tags` | HTML címkék eltávolítása | `{$content\|strip_tags}` |
| `truncate` | Limit string length | `{$text\|truncate:100}` |
| `upper` | Convert to uppercase | `{$name\|upper}` |
| `lower` | Convert to lowercase | `{$name\|lower}` |

### Vezérlési struktúrák

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

## Teljes sablon példa

### PHP kód

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

### Sablonfájl (list.tpl)

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

## Egyedi Smarty funkciók

### Egyéni blokkfunkció létrehozása

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

Register and use:

```php
$xoopsTpl->registerPlugin('block', 'permission', 'smarty_block_permission');
```

Template:

```smarty
{permission name="edit_articles"}
    <button>Edit Article</button>
{/permission}
```

## Bevált gyakorlatok

1. **Escape User Content** – Mindig használja a `|escape` kódot a felhasználók által létrehozott tartalomhoz
2. **Sablonútvonalak használata** – Hivatkozási sablonok a témához képest
3. **Válassza el a logikát a prezentációtól** - Tartsa meg az összetett logikát a PHP-ban
4. **Gyorsítótár sablonok** – Engedélyezze a sablon gyorsítótárazását éles környezetben
5. **Használja helyesen a módosítókat** - Alkalmazza a kontextusnak megfelelő szűrőket
6. **Blocks rendezés** - Helyezze el a blokkosablonokat egy dedikált könyvtárba
7. **Dokumentumváltozók** – Az összes sablonváltozó dokumentálása a PHP-ban

## Kapcsolódó dokumentáció

- ../module/module-System - modulrendszer és hookok
- ../Kernel/Kernel-Classes - Kernel and configuration
- ../Core/XOOPSObject - Alap objektumosztály

---

*Lásd még: [Smarty Documentation](https://www.smarty.net/docs) | [XOOPS sablon API](https://github.com/XOOPS/XOOPSCore27/tree/master/htdocs/class)*
