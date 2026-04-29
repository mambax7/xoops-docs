---
title: "XOOPS Sustav predložaka"
description: "Integracija Smarty, XoopsTpl class, varijable predloška, ​​upravljanje temom i renderiranje predloška"
---
Sustav predložaka XOOPS izgrađen je na snažnom pogonu predložaka Smarty, pružajući fleksibilan i proširiv način za odvajanje logike prezentacije od poslovne logike. Upravlja themes, prikazom predložaka, dodjeljivanjem varijabli i dinamičkim generiranjem sadržaja.

## Arhitektura predloška

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

## XoopsTpl klasa

Glavni mehanizam predloška class koji proširuje Smarty.

### Pregled razreda

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

### Proširenje Smarty

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

### Osnovne metode

#### getInstance

Dobiva instancu predloška singleton.

```php
public static function getInstance(): XoopsTpl
```

**Vraća:** `XoopsTpl` - Singleton instanca

**Primjer:**
```php
$xoopsTpl = XoopsTpl::getInstance();
```

#### dodijeliti

Dodjeljuje varijablu predlošku.

```php
public function assign(
    string|array $tplVar,
    mixed $value = null
): void
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$tplVar` | niz\|niz | Naziv varijable ili asocijativni niz |
| `$value` | mješoviti | Vrijednost varijable |

**Primjer:**
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

#### dodajDodijeli

Dodaje vrijednosti varijablama polja predloška.

```php
public function appendAssign(
    string $tplVar,
    mixed $value
): void
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$tplVar` | niz | Ime varijable |
| `$value` | mješoviti | Vrijednost za dodavanje |

**Primjer:**
```php
$xoopsTpl->assign('breadcrumbs', ['Home']);
$xoopsTpl->appendAssign('breadcrumbs', 'Blog');
$xoopsTpl->appendAssign('breadcrumbs', 'Posts');
// breadcrumbs = ['Home', 'Blog', 'Posts']
```

#### getAssignedVars

Dobiva sve dodijeljene varijable predloška.

```php
public function getAssignedVars(): array
```

**Vraća:** `array` - Dodijeljene varijable

**Primjer:**
```php
$vars = $xoopsTpl->getAssignedVars();
foreach ($vars as $name => $value) {
    echo "$name = " . var_export($value, true) . "\n";
}
```

#### prikaz

Renderira predložak i šalje ga u preglednik.

```php
public function display(
    string $resource,
    string|array $cache_id = null,
    string $compile_id = null,
    object $parent = null
): void
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$resource` | niz | Putanja datoteke predloška |
| `$cache_id` | niz\|niz | Identifikator predmemorije |
| `$compile_id` | niz | Prevedi identifikator |
| `$parent` | objekt | Nadređeni objekt predloška |

**Primjer:**
```php
$xoopsTpl->assign('page_title', 'Home');
$xoopsTpl->display('user:index.tpl');

// With absolute path
$xoopsTpl->display(XOOPS_ROOT_PATH . '/templates/user/index.tpl');
```

#### dohvati

Prikazuje predložak i vraća kao niz.

```php
public function fetch(
    string $resource,
    string|array $cache_id = null,
    string $compile_id = null,
    object $parent = null
): string
```

**Povrat:** `string` - Prikazani sadržaj predloška

**Primjer:**
```php
$xoopsTpl->assign('message', 'Hello World');
$html = $xoopsTpl->fetch('user:message.tpl');
echo $html;

// Use for email templates
$emailContent = $xoopsTpl->fetch('mail:notification.tpl');
mail($to, $subject, $emailContent);
```

#### loadTheme

Učitava određenu temu.

```php
public function loadTheme(string $themeName): bool
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$themeName` | niz | Naziv direktorija tema |

**Vraća:** `bool` - vrijedi nakon uspjeha

**Primjer:**
```php
if ($xoopsTpl->loadTheme('bluemoon')) {
    echo "Theme loaded successfully";
}
```

#### getCurrentTheme

Dobiva naziv trenutno aktivne teme.

```php
public function getCurrentTheme(): string
```

**Povratak:** `string` - Naziv teme

**Primjer:**
```php
$currentTheme = $xoopsTpl->getCurrentTheme();
echo "Active theme: $currentTheme";
```

#### setOutputFilter

Dodaje izlazni filtar za obradu izlaza predloška.

```php
public function setOutputFilter(string $function): void
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$function` | niz | Naziv funkcije filtra |

**Primjer:**
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

#### registrirajte dodatak

Registrira prilagođeni dodatak Smarty.

```php
public function registerPlugin(
    string $type,
    string $name,
    callable $callback
): void
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$type` | niz | Vrsta dodatka (modifikator, blok, funkcija) |
| `$name` | niz | Naziv dodatka |
| `$callback` | pozivati ​​| Funkcija povratnog poziva |

**Primjer:**
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

## Sustav tema

### Struktura teme

Standardna struktura direktorija teme XOOPS:

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

### Razred upravitelja tema
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

## Varijable predloška

### Standardne globalne varijable

XOOPS automatski dodjeljuje nekoliko globalnih varijabli predloška:

| Varijabla | Upišite | Opis |
|----------|------|-------------|
| `$xoops_url` | niz | XOOPS instalacija URL |
| `$xoops_user` | XoopsUser\|null | Trenutačni korisnički objekt |
| `$xoops_uname` | niz | Trenutno korisničko ime |
| `$xoops_isadmin` | bool | Korisnik je admin |
| `$xoops_banner` | niz | Banner HTML |
| `$xoops_notification` | niz | Označavanje obavijesti |
| `$xoops_version` | niz | XOOPS verzija |

### Varijable specifične za blok

Prilikom renderiranja blokova:

| Varijabla | Upišite | Opis |
|----------|------|-------------|
| `$block` | niz | Blokirajte informacije |
| `$block.title` | niz | Naslov bloka |
| `$block.content` | niz | Blokiraj sadržaj |
| `$block.id` | int | ID bloka |
| `$block.module` | niz | Naziv modula |

### Varijable predloška modula

moduli obično dodjeljuju:

| Varijabla | Upišite | Opis |
|----------|------|-------------|
| `$module_name` | niz | Naziv za prikaz modula |
| `$module_dir` | niz | Imenik modula |
| `$xoops_module_header` | niz | modul CSS/JS |

## Smarty Konfiguracija

### Uobičajeni modifikatori Smarty

| Modifikator | Opis | Primjer |
|----------|-------------|---------|
| `capitalize` | Veliko prvo slovo | `{$title\|capitalize}` |
| `count_characters` | Broj znakova | `{$text\|count_characters}` |
| `date_format` | Oblikovanje vremenske oznake | `{$timestamp\|date_format:'%Y-%m-%d'}` |
| `escape` | Escape posebni znakovi | `{$html\|escape:'html'}` |
| `nl2br` | Pretvori nove retke u `<br>` | `{$text\|nl2br}` |
| `strip_tags` | Ukloni HTML oznake | `{$content\|strip_tags}` |
| `truncate` | Ograniči duljinu niza | `{$text\|truncate:100}` |
| `upper` | Pretvori u velika slova | `{$name\|upper}` |
| `lower` | Pretvori u mala slova | `{$name\|lower}` |

### Kontrolne strukture

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

## Cijeli primjer predloška

### PHP kod

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

### Datoteka predloška (list.tpl)

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

## Prilagođene funkcije Smarty

### Stvaranje prilagođene funkcije bloka

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

Registrirajte se i koristite:

```php
$xoopsTpl->registerPlugin('block', 'permission', 'smarty_block_permission');
```

predložak:

```smarty
{permission name="edit_articles"}
    <button>Edit Article</button>
{/permission}
```

## Najbolji primjeri iz prakse

1. **Escape User Content** - Uvijek koristite `|escape` za korisnički generirani sadržaj
2. **Koristite staze predložaka** - Referenca templates u odnosu na temu
3. **Odvojite logiku od prezentacije** - Zadržite složenu logiku u PHP
4. **Cache Templates** - Omogućite predmemoriranje predložaka u proizvodnji
5. **Koristite modifikatore ispravno** - Primijenite odgovarajuće filtre za kontekst
6. **Organizirajte blokove** - Postavite blok templates u namjenski direktorij
7. **Varijable dokumenta** - Dokumentirajte sve varijable predloška u PHP

## Povezana dokumentacija

- ../Module/Module-System - Sustav modula i kuke
- ../Kernel/Kernel-Classes - Kernel i konfiguracija
- ../Core/XoopsObject - Osnovni objekt class

---

*Vidi također: [Smarty Dokumentacija](https://www.smarty.net/docs) | [XOOPS predložak API](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class)*
