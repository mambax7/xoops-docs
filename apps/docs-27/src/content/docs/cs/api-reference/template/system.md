---
title: "Systém šablon XOOPS"
description: "Integrace Smarty, třída XoopsTpl, proměnné šablony, správa motivů a vykreslování šablon"
---

Systém šablon XOOPS je postaven na výkonném enginu šablon Smarty, který poskytuje flexibilní a rozšiřitelný způsob oddělení prezentační logiky od obchodní logiky. Spravuje témata, vykreslování šablon, přiřazení proměnných a generování dynamického obsahu.

## Architektura šablon

```mermaid
graph TD
    A[XOOPSTpl] -->|extends| B[Smarty]
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

## Třída XOOPSTpl

Hlavní třída šablony, která rozšiřuje Smarty.

### Přehled třídy

```php
namespace XOOPS\Core;

class XOOPSTpl extends Smarty
{
    protected array $vars = [];
    protected string $currentTheme = '';
    protected array $blocks = [];
    protected bool $isAdmin = false;
}
```

### Rozšíření Smarty

```php
use XOOPS\Core\XOOPSTpl;

class XOOPSTpl extends Smarty
{
    private static ?XOOPSTpl $instance = null;

    private function __construct()
    {
        parent::__construct();
        $this->configureDirectories();
        $this->registerPlugins();
    }

    public static function getInstance(): XOOPSTpl
    {
        if (!isset(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }
}
```

### Základní metody

#### getInstance

Získá instanci šablony singleton.

```php
public static function getInstance(): XOOPSTpl
```

**Vrátí:** `XOOPSTpl` – instance Singleton

**Příklad:**
```php
$xoopsTpl = XOOPSTpl::getInstance();
```

#### přiřadit

Přiřadí šabloně proměnnou.

```php
public function assign(
    string|array $tplVar,
    mixed $value = null
): void
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$tplVar` | řetězec\|pole | Název proměnné nebo asociativní pole |
| `$value` | smíšené | Proměnná hodnota |

**Příklad:**
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

Připojí hodnoty k proměnným pole šablony.

```php
public function appendAssign(
    string $tplVar,
    mixed $value
): void
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$tplVar` | řetězec | Název proměnné |
| `$value` | smíšené | Hodnota k připojení |

**Příklad:**
```php
$xoopsTpl->assign('breadcrumbs', ['Home']);
$xoopsTpl->appendAssign('breadcrumbs', 'Blog');
$xoopsTpl->appendAssign('breadcrumbs', 'Posts');
// breadcrumbs = ['Home', 'Blog', 'Posts']
```

#### getAssignedVars

Získá všechny přiřazené proměnné šablony.

```php
public function getAssignedVars(): array
```

**Vrátí:** `array` - Přiřazené proměnné

**Příklad:**
```php
$vars = $xoopsTpl->getAssignedVars();
foreach ($vars as $name => $value) {
    echo "$name = " . var_export($value, true) . "\n";
}
```

#### displej

Vykreslí šablonu a výstupy do prohlížeče.

```php
public function display(
    string $resource,
    string|array $cache_id = null,
    string $compile_id = null,
    object $parent = null
): void
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$resource` | řetězec | Cesta k souboru šablony |
| `$cache_id` | řetězec\|pole | Identifikátor mezipaměti |
| `$compile_id` | řetězec | Identifikátor kompilace |
| `$parent` | objekt | Nadřazený objekt šablony |

**Příklad:**
```php
$xoopsTpl->assign('page_title', 'Home');
$xoopsTpl->display('user:index.tpl');

// With absolute path
$xoopsTpl->display(XOOPS_ROOT_PATH . '/templates/user/index.tpl');
```

#### aport

Vykreslí šablonu a vrátí se jako řetězec.

```php
public function fetch(
    string $resource,
    string|array $cache_id = null,
    string $compile_id = null,
    object $parent = null
): string
```

**Vrátí:** `string` – Vykreslený obsah šablony

**Příklad:**
```php
$xoopsTpl->assign('message', 'Hello World');
$html = $xoopsTpl->fetch('user:message.tpl');
echo $html;

// Use for email templates
$emailContent = $xoopsTpl->fetch('mail:notification.tpl');
mail($to, $subject, $emailContent);
```

#### načíst téma

Načte konkrétní téma.

```php
public function loadTheme(string $themeName): bool
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$themeName` | řetězec | Název adresáře motivu |

**Vrátí se:** `bool` – Pravda při úspěchu

**Příklad:**
```php
if ($xoopsTpl->loadTheme('bluemoon')) {
    echo "Theme loaded successfully";
}
```

#### getCurrentTheme

Získá název aktuálně aktivního motivu.

```php
public function getCurrentTheme(): string
```

**Vrátí:** `string` – Název motivu

**Příklad:**
```php
$currentTheme = $xoopsTpl->getCurrentTheme();
echo "Active theme: $currentTheme";
```

#### setOutputFilter

Přidá výstupní filtr ke zpracování výstupu šablony.

```php
public function setOutputFilter(string $function): void
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$function` | řetězec | Název funkce filtru |

**Příklad:**
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

Registruje vlastní plugin Smarty.

```php
public function registerPlugin(
    string $type,
    string $name,
    callable $callback
): void
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$type` | řetězec | Typ pluginu (modifikátor, blok, funkce) |
| `$name` | řetězec | Název pluginu |
| `$callback` | povolatelný | Funkce zpětného volání |

**Příklad:**
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

## Systém motivů

### Struktura tématu

Standardní struktura adresářů motivů XOOPS:

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

### Třída Správce motivů

```php
namespace XOOPS\Core\Theme;

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

## Proměnné šablony

### Standardní globální proměnné

XOOPS automaticky přiřadí několik globálních proměnných šablony:

| Proměnná | Typ | Popis |
|----------|------|-------------|
| `$xoops_url` | řetězec | Instalace XOOPS URL |
| `$xoops_user` | XOOPSUser\|null | Aktuální uživatelský objekt |
| `$xoops_uname` | řetězec | Aktuální uživatelské jméno |
| `$xoops_isadmin` | bool | Uživatel je admin |
| `$xoops_banner` | řetězec | Banner HTML |
| `$xoops_notification` | řetězec | Označení oznámení |
| `$xoops_version` | řetězec | Verze XOOPS |

### Blokově specifické proměnné

Při vykreslování bloků:

| Proměnná | Typ | Popis |
|----------|------|-------------|
| `$block` | pole | Blokovat informace |
| `$block.title` | řetězec | Název bloku |
| `$block.content` | řetězec | Blokovat obsah |
| `$block.id` | int | ID bloku |
| `$block.module` | řetězec | Název modulu |

### Proměnné šablony modulu

Moduly obvykle přiřazují:

| Proměnná | Typ | Popis |
|----------|------|-------------|
| `$module_name` | řetězec | Zobrazovaný název modulu |
| `$module_dir` | řetězec | Adresář modulu |
| `$xoops_module_header` | řetězec | Modul CSS/JS |

## Konfigurace Smarty### Běžné modifikátory Smarty

| Modifikátor | Popis | Příklad |
|----------|-------------|---------|
| `capitalize` | První písmeno velké | `{$title\|capitalize}` |
| `count_characters` | Počet postav | `{$text\|count_characters}` |
| `date_format` | Formát časového razítka | `{$timestamp\|date_format:'%Y-%m-%d'}` |
| `escape` | Uniknout speciálním znakům | `{$html\|escape:'html'}` |
| `nl2br` | Převést nové řádky na `<br>` | `{$text\|nl2br}` |
| `strip_tags` | Odebrat značky HTML | `{$content\|strip_tags}` |
| `truncate` | Limitní délka řetězce | `{$text\|truncate:100}` |
| `upper` | Převést na velká | `{$name\|upper}` |
| `lower` | Převést na malá písmena | `{$name\|lower}` |

### Řídicí struktury

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

## Kompletní příklad šablony

### Kód PHP

```php
<?php
/**
 * Module Article List Page
 */

include __DIR__ . '/include/common.inc.php';

$xoopsTpl = XOOPSTpl::getInstance();

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

### Soubor šablony (list.tpl)

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

## Vlastní funkce Smarty

### Vytvoření funkce vlastního bloku

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

Zaregistrujte se a použijte:

```php
$xoopsTpl->registerPlugin('block', 'permission', 'smarty_block_permission');
```

Šablona:

```smarty
{permission name="edit_articles"}
    <button>Edit Article</button>
{/permission}
```

## Nejlepší postupy

1. **Escape User Content** – Vždy používejte `|escape` pro obsah vytvářený uživateli
2. **Použít cesty šablon** – Referenční šablony vztahující se k tématu
3. **Oddělte logiku od prezentace** – Udržujte komplexní logiku v PHP
4. **Šablony mezipaměti** – Povolí ukládání šablon do mezipaměti v produkci
5. **Používejte modifikátory správně** – Použijte vhodné filtry pro kontext
6. **Uspořádat bloky** - Umístěte šablony bloků do vyhrazeného adresáře
7. **Proměnné dokumentu** – Dokumentujte všechny proměnné šablony v PHP

## Související dokumentace

- ../Module/Module-System - Modulový systém a háčky
- ../Kernel/Kernel-Classes - Jádro a konfigurace
- ../Core/XOOPSObject - Základní třída objektu

---

*Viz také: [Dokumentace Smarty](https://www.smarty.net/docs) | [XOOPS šablona API](https://github.com/XOOPS/XOOPSCore27/tree/master/htdocs/class)*