---
title: "XOOPS-sjabloonsysteem"
description: "Slimme integratie, XoopsTpl-klasse, sjabloonvariabelen, themabeheer en sjabloonweergave"
---
Het XOOPS-sjabloonsysteem is gebouwd op de krachtige Smarty-sjabloonengine en biedt een flexibele en uitbreidbare manier om presentatielogica te scheiden van bedrijfslogica. Het beheert thema's, sjabloonweergave, toewijzing van variabelen en het genereren van dynamische inhoud.

## Sjabloonarchitectuur

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

## XoopsTpl-klasse

De belangrijkste sjabloonengineklasse die Smarty uitbreidt.

### Klassenoverzicht

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

### Smarty uitbreiden

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

### Kernmethoden

#### getInstance

Haalt de singleton-sjablooninstantie op.

```php
public static function getInstance(): XoopsTpl
```

**Retourneert:** `XoopsTpl` - Singleton-instantie

**Voorbeeld:**
```php
$xoopsTpl = XoopsTpl::getInstance();
```

#### toewijzen

Wijst een variabele toe aan de sjabloon.

```php
public function assign(
    string|array $tplVar,
    mixed $value = null
): void
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$tplVar` | tekenreeks\|array | Variabelenaam of associatieve array |
| `$value` | gemengd | Variabele waarde |

**Voorbeeld:**
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

#### toevoegenToewijzen

Voegt waarden toe aan sjabloonmatrixvariabelen.

```php
public function appendAssign(
    string $tplVar,
    mixed $value
): void
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$tplVar` | tekenreeks | Variabelenaam |
| `$value` | gemengd | Toe te voegen waarde |

**Voorbeeld:**
```php
$xoopsTpl->assign('breadcrumbs', ['Home']);
$xoopsTpl->appendAssign('breadcrumbs', 'Blog');
$xoopsTpl->appendAssign('breadcrumbs', 'Posts');
// breadcrumbs = ['Home', 'Blog', 'Posts']
```

#### getAssignedVars

Haalt alle toegewezen sjabloonvariabelen op.

```php
public function getAssignedVars(): array
```

**Retourneert:** `array` - Toegewezen variabelen

**Voorbeeld:**
```php
$vars = $xoopsTpl->getAssignedVars();
foreach ($vars as $name => $value) {
    echo "$name = " . var_export($value, true) . "\n";
}
```

#### weergave

Rendert een sjabloon en voert deze uit naar de browser.

```php
public function display(
    string $resource,
    string|array $cache_id = null,
    string $compile_id = null,
    object $parent = null
): void
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$resource` | tekenreeks | Sjabloonbestandspad |
| `$cache_id` | tekenreeks\|array | Cache-ID |
| `$compile_id` | tekenreeks | Compile-ID |
| `$parent` | voorwerp | Bovenliggend sjabloonobject |

**Voorbeeld:**
```php
$xoopsTpl->assign('page_title', 'Home');
$xoopsTpl->display('user:index.tpl');

// With absolute path
$xoopsTpl->display(XOOPS_ROOT_PATH . '/templates/user/index.tpl');
```

#### ophalen

Rendert een sjabloon en retourneert als tekenreeks.

```php
public function fetch(
    string $resource,
    string|array $cache_id = null,
    string $compile_id = null,
    object $parent = null
): string
```

**Retourzendingen:** `string` - Weergegeven sjablooninhoud

**Voorbeeld:**
```php
$xoopsTpl->assign('message', 'Hello World');
$html = $xoopsTpl->fetch('user:message.tpl');
echo $html;

// Use for email templates
$emailContent = $xoopsTpl->fetch('mail:notification.tpl');
mail($to, $subject, $emailContent);
```

#### laadTheme

Laadt een specifiek thema.

```php
public function loadTheme(string $themeName): bool
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$themeName` | tekenreeks | Naam themamap |

**Retourzendingen:** `bool` - Klopt bij succes

**Voorbeeld:**
```php
if ($xoopsTpl->loadTheme('bluemoon')) {
    echo "Theme loaded successfully";
}
```

#### getCurrentTheme

Krijgt de naam van het momenteel actieve thema.

```php
public function getCurrentTheme(): string
```

**Retourzendingen:** `string` - Themanaam

**Voorbeeld:**
```php
$currentTheme = $xoopsTpl->getCurrentTheme();
echo "Active theme: $currentTheme";
```

####setOutputFilter

Voegt een uitvoerfilter toe om de sjabloonuitvoer te verwerken.

```php
public function setOutputFilter(string $function): void
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$function` | tekenreeks | Naam filterfunctie |

**Voorbeeld:**
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

Registreert een aangepaste Smarty-plug-in.

```php
public function registerPlugin(
    string $type,
    string $name,
    callable $callback
): void
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$type` | tekenreeks | Type plug-in (modifier, blok, functie) |
| `$name` | tekenreeks | Naam van plug-in |
| `$callback` | opvraagbaar | Terugbelfunctie |

**Voorbeeld:**
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

## Themasysteem

### Themastructuur

Standaard XOOPS-themamapstructuur:

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

### Themamanagerklasse

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

## Sjabloonvariabelen

### Standaard globale variabelen

XOOPS wijst automatisch verschillende globale sjabloonvariabelen toe:

| Variabel | Typ | Beschrijving |
|----------|------|-------------|
| `$xoops_url` | tekenreeks | XOOPS installatie URL |
| `$xoops_user` | XoopsGebruiker\|null | Huidig ​​gebruikersobject |
| `$xoops_uname` | tekenreeks | Huidige gebruikersnaam |
| `$xoops_isadmin` | bool | Gebruiker is beheerder |
| `$xoops_banner` | tekenreeks | Banner HTML |
| `$xoops_notification` | tekenreeks | Meldingsmarkering |
| `$xoops_version` | tekenreeks | XOOPS-versie |

### Blokspecifieke variabelen

Bij het renderen van blokken:

| Variabel | Typ | Beschrijving |
|----------|------|-------------|
| `$block` | array | Blokkeer informatie |
| `$block.title` | tekenreeks | Bloktitel |
| `$block.content` | tekenreeks | Inhoud blokkeren |
| `$block.id` | int | Blok-ID |
| `$block.module` | tekenreeks | Modulenaam |

### Modulesjabloonvariabelen

Modules wijzen doorgaans toe:| Variabel | Typ | Beschrijving |
|----------|------|-------------|
| `$module_name` | tekenreeks | Moduleweergavenaam |
| `$module_dir` | tekenreeks | Modulemap |
| `$xoops_module_header` | tekenreeks | Module CSS/JS |

## Smarty-configuratie

### Algemene Smarty-modificatoren

| Modificator | Beschrijving | Voorbeeld |
|----------|-------------|---------|
| `capitalize` | Begin met een hoofdletter | `{$title\|capitalize}` |
| `count_characters` | Aantal tekens | `{$text\|count_characters}` |
| `date_format` | Tijdstempel opmaken | `{$timestamp\|date_format:'%Y-%m-%d'}` |
| `escape` | Ontsnap aan speciale tekens | `{$html\|escape:'html'}` |
| `nl2br` | Nieuwe regels converteren naar `<br>` | `{$text\|nl2br}` |
| `strip_tags` | HTML-tags verwijderen | `{$content\|strip_tags}` |
| `truncate` | Limiet stringlengte | `{$text\|truncate:100}` |
| `upper` | Converteren naar hoofdletters | `{$name\|upper}` |
| `lower` | Converteren naar kleine letters | `{$name\|lower}` |

### Controlestructuren

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

## Compleet sjabloonvoorbeeld

### PHP-code

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

### Sjabloonbestand (list.tpl)

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

## Aangepaste Smarty-functies

### Een aangepaste blokfunctie maken

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

Registreren en gebruiken:

```php
$xoopsTpl->registerPlugin('block', 'permission', 'smarty_block_permission');
```

Sjabloon:

```smarty
{permission name="edit_articles"}
    <button>Edit Article</button>
{/permission}
```

## Beste praktijken

1. **Escape gebruikersinhoud** - Gebruik altijd `|escape` voor door gebruikers gegenereerde inhoud
2. **Gebruik sjabloonpaden** - Referentiesjablonen relatief aan thema
3. **Scheid logica van presentatie** - Behoud complexe logica in PHP
4. **Cachesjablonen** - Schakel sjablooncaching in productie in
5. **Gebruik modificatoren correct** - Pas geschikte filters toe voor de context
6. **Blokken organiseren** - Plaats bloksjablonen in een speciale map
7. **Documentvariabelen** - Documenteer alle sjabloonvariabelen in PHP

## Gerelateerde documentatie

- ../Module/Module-System - Modulesysteem en haken
- ../Kernel/Kernel-Classes - Kernel en configuratie
- ../Core/XoopsObject - Basisobjectklasse

---

*Zie ook: [Smarty-documentatie](https://www.smarty.net/docs) | [XOOPS-sjabloon API](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class)*