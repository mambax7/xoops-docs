---
title: "System Szablonów XOOPS"
description: "Integracja Smarty, klasa XoopsTpl, zmienne szablonów, zarządzanie motywami i renderowanie szablonów"
---

System Szablonów XOOPS jest zbudowany na potężnym silniku szablonów Smarty, zapewniając elastyczny i rozszerzalny sposób na oddzielenie logiki prezentacji od logiki biznesowej. Zarządza motywami, renderowaniem szablonów, przypisywaniem zmiennych i dynamicznym generowaniem zawartości.

## Architektura Szablonów

```mermaid
graph TD
    A[XoopsTpl] -->|extends| B[Smarty]
    A -->|manages| C[Motywy]
    A -->|manages| D[Zmienne Szablonów]
    A -->|handles| E[Renderowanie Bloków]

    C -->|contains| F[Szablony]
    C -->|contains| G[CSS/JS]
    C -->|contains| H[Obrazy]

    I[Menedżer Motywów] -->|loads| C
    I -->|applies| J[Aktywny Motyw]
    I -->|configures| K[Ścieżki Szablonów]

    L[System Bloków] -->|uses| A
    M[Szablony Modułów] -->|uses| A
    N[Szablony Admin] -->|uses| A
```

## Klasa XoopsTpl

Główna klasa silnika szablonów rozszerzająca Smarty.

### Class Overview

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

### Główne Metody

#### getInstance

Pobiera instancję singleton szablonu.

```php
public static function getInstance(): XoopsTpl
```

**Zwraca:** `XoopsTpl` - Instancja singleton

**Przykład:**
```php
$xoopsTpl = XoopsTpl::getInstance();
```

#### assign

Przypisuje zmienną do szablonu.

```php
public function assign(
    string|array $tplVar,
    mixed $value = null
): void
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$tplVar` | string\|array | Nazwa zmiennej lub tablica asocjacyjna |
| `$value` | mixed | Wartość zmiennej |

**Przykład:**
```php
$xoopsTpl->assign('page_title', 'Welcome');
$xoopsTpl->assign('user_name', 'John Doe');

// Wiele przypisań
$xoopsTpl->assign([
    'items' => $items,
    'total_count' => count($items),
    'show_pagination' => true
]);
```

#### appendAssign

Dołącza wartości do zmiennych tablicy szablonu.

```php
public function appendAssign(
    string $tplVar,
    mixed $value
): void
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$tplVar` | string | Nazwa zmiennej |
| `$value` | mixed | Wartość do dołączenia |

**Przykład:**
```php
$xoopsTpl->assign('breadcrumbs', ['Home']);
$xoopsTpl->appendAssign('breadcrumbs', 'Blog');
$xoopsTpl->appendAssign('breadcrumbs', 'Posts');
// breadcrumbs = ['Home', 'Blog', 'Posts']
```

#### getAssignedVars

Pobiera wszystkie przypisane zmienne szablonu.

```php
public function getAssignedVars(): array
```

**Zwraca:** `array` - Przypisane zmienne

**Przykład:**
```php
$vars = $xoopsTpl->getAssignedVars();
foreach ($vars as $name => $value) {
    echo "$name = " . var_export($value, true) . "\n";
}
```

#### display

Renderuje szablon i wyświetla w przeglądarce.

```php
public function display(
    string $resource,
    string|array $cache_id = null,
    string $compile_id = null,
    object $parent = null
): void
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$resource` | string | Ścieżka pliku szablonu |
| `$cache_id` | string\|array | Identyfikator pamięci podręcznej |
| `$compile_id` | string | Identyfikator kompilacji |
| `$parent` | object | Obiekt szablonu nadrzędnego |

**Przykład:**
```php
$xoopsTpl->assign('page_title', 'Home');
$xoopsTpl->display('user:index.tpl');

// Ze ścieżką bezwzględną
$xoopsTpl->display(XOOPS_ROOT_PATH . '/templates/user/index.tpl');
```

#### fetch

Renderuje szablon i zwraca jako ciąg znaków.

```php
public function fetch(
    string $resource,
    string|array $cache_id = null,
    string $compile_id = null,
    object $parent = null
): string
```

**Zwraca:** `string` - Wyrenderowana zawartość szablonu

**Przykład:**
```php
$xoopsTpl->assign('message', 'Hello World');
$html = $xoopsTpl->fetch('user:message.tpl');
echo $html;

// Użyj dla szablonów e-mail
$emailContent = $xoopsTpl->fetch('mail:notification.tpl');
mail($to, $subject, $emailContent);
```

#### loadTheme

Ładuje konkretny motyw.

```php
public function loadTheme(string $themeName): bool
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$themeName` | string | Nazwa katalogu motywu |

**Zwraca:** `bool` - True na sukces

**Przykład:**
```php
if ($xoopsTpl->loadTheme('bluemoon')) {
    echo "Theme loaded successfully";
}
```

#### getCurrentTheme

Pobiera nazwę aktywnie używanego motywu.

```php
public function getCurrentTheme(): string
```

**Zwraca:** `string` - Nazwa motywu

**Przykład:**
```php
$currentTheme = $xoopsTpl->getCurrentTheme();
echo "Active theme: $currentTheme";
```

#### setOutputFilter

Dodaje filtr wyjścia do przetwarzania wyjścia szablonu.

```php
public function setOutputFilter(string $function): void
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$function` | string | Nazwa funkcji filtra |

**Przykład:**
```php
// Usuń białe znaki z wyjścia
$xoopsTpl->setOutputFilter('trim');

// Niestandardowy filtr
function my_output_filter($output) {
    // Minifikuj HTML
    $output = preg_replace('/\s+/', ' ', $output);
    return trim($output);
}
$xoopsTpl->setOutputFilter('my_output_filter');
```

#### registerPlugin

Rejestruje niestandardowy plugin Smarty.

```php
public function registerPlugin(
    string $type,
    string $name,
    callable $callback
): void
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$type` | string | Typ pluginu (modifier, block, function) |
| `$name` | string | Nazwa pluginu |
| `$callback` | callable | Funkcja callback |

**Przykład:**
```php
// Zarejestruj niestandardowy modyfikator
$xoopsTpl->registerPlugin('modifier', 'markdown', function($text) {
    return markdown_parse($text);
});

// Użyj w szablonie: {$content|markdown}

// Zarejestruj niestandardowy tag bloku
$xoopsTpl->registerPlugin('block', 'permission', function($params, $content, $smarty, &$repeat) {
    if ($repeat) return;

    // Sprawdź uprawnienia
    if (has_permission($params['name'])) {
        return $content;
    }
    return '';
});

// Użyj w szablonie: {permission name="admin"}...{/permission}
```

## System Motywów

### Struktura Motywu

Standardowa struktura katalogu motywu XOOPS:

```
bluemoon/
├── style.css              # Główny arkusz stylów
├── admin.css              # Arkusz stylów admin
├── theme.html             # Główny szablon strony
├── admin.html             # Szablon strony admin
├── blocks/                # Szablony bloków
│   ├── block_left.tpl
│   └── block_right.tpl
├── modules/               # Szablony modułów
│   ├── publisher/
│   │   ├── index.tpl
│   │   └── item.tpl
│   └── news/
│       └── index.tpl
├── images/                # Obrazy motywu
│   ├── logo.png
│   └── banner.png
├── js/                    # JavaScript motywu
│   └── script.js
└── readme.txt             # Dokumentacja motywu
```

### Klasa Menedżera Motywów

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

## Zmienne Szablonów

### Standardowe Zmienne Globalne

XOOPS automatycznie przypisuje kilka globalnych zmiennych szablonu:

| Zmienna | Typ | Opis |
|---------|-----|------|
| `$xoops_url` | string | URL instalacji XOOPS |
| `$xoops_user` | XoopsUser\|null | Obiekt bieżącego użytkownika |
| `$xoops_uname` | string | Nazwa bieżącego użytkownika |
| `$xoops_isadmin` | bool | Użytkownik jest administratorem |
| `$xoops_banner` | string | HTML baneru |
| `$xoops_notification` | string | Znaczniki powiadomień |
| `$xoops_version` | string | Wersja XOOPS |

### Zmienne Specyficzne dla Bloków

Podczas renderowania bloków:

| Zmienna | Typ | Opis |
|---------|-----|------|
| `$block` | array | Informacje o bloku |
| `$block.title` | string | Tytuł bloku |
| `$block.content` | string | Zawartość bloku |
| `$block.id` | int | ID bloku |
| `$block.module` | string | Nazwa modułu |

### Zmienne Szablonów Modułów

Moduły zazwyczaj przypisują:

| Zmienna | Typ | Opis |
|---------|-----|------|
| `$module_name` | string | Wyświetlana nazwa modułu |
| `$module_dir` | string | Katalog modułu |
| `$xoops_module_header` | string | CSS/JS modułu |

## Konfiguracja Smarty

### Popularne Modyfikatory Smarty

| Modyfikator | Opis | Przykład |
|-------------|------|---------|
| `capitalize` | Kapitalizuj pierwszą literę | `{$title\|capitalize}` |
| `count_characters` | Liczba znaków | `{$text\|count_characters}` |
| `date_format` | Formatuj timestamp | `{$timestamp\|date_format:'%Y-%m-%d'}` |
| `escape` | Usunięcie znaków specjalnych | `{$html\|escape:'html'}` |
| `nl2br` | Konwertuj nowe linie na `<br>` | `{$text\|nl2br}` |
| `strip_tags` | Usuń tagi HTML | `{$content\|strip_tags}` |
| `truncate` | Ogranicz długość ciągu | `{$text\|truncate:100}` |
| `upper` | Konwertuj na wielkie litery | `{$name\|upper}` |
| `lower` | Konwertuj na małe litery | `{$name\|lower}` |

### Struktury Kontrolne

```smarty
{* Instrukcja if *}
{if $user->isAdmin()}
    <p>Admin content</p>
{else}
    <p>User content</p>
{/if}

{* Pętla for *}
{foreach $items as $item}
    <div class="item">{$item.title}</div>
{/foreach}

{* Pętla for z licznikiem *}
{foreach $items as $item name=item_loop}
    {$smarty.foreach.item_loop.iteration}: {$item.title}
{/foreach}

{* Pętla while *}
{while $condition}
    <!-- content -->
{/while}

{* Instrukcja switch *}
{switch $status}
    {case 'draft'}<span class="draft">Draft</span>{break}
    {case 'published'}<span class="published">Published</span>{break}
    {default}<span class="unknown">Unknown</span>
{/switch}
```

## Kompletny Przykład Szablonu

### Kod PHP

```php
<?php
/**
 * Strona Listy Artykułów Modułu
 */

include __DIR__ . '/include/common.inc.php';

$xoopsTpl = XoopsTpl::getInstance();

// Sprawdź czy moduł jest aktywny
$module = xoops_getModuleByDirname('articles');
if (!$module) {
    redirect_header(XOOPS_URL, 3, 'Module not found');
}

// Pobierz handler elementów
$itemHandler = xoops_getModuleHandler('item', 'articles');

// Pobierz parametry paginacji
$page = !empty($_GET['page']) ? (int)$_GET['page'] : 1;
$perPage = $module->getConfig('items_per_page') ?: 10;
$offset = ($page - 1) * $perPage;

// Zbuduj kryteria
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$criteria->setSort('published', 'DESC');
$criteria->setLimit($perPage);
$criteria->setStart($offset);

// Pobierz elementy
$items = $itemHandler->getObjects($criteria);
$total = $itemHandler->getCount(new Criteria('status', 1));

// Oblicz paginację
$pages = ceil($total / $perPage);

// Przypisz zmienne szablonu
$xoopsTpl->assign([
    'module_name' => $module->getName(),
    'items' => $items,
    'total_items' => $total,
    'current_page' => $page,
    'total_pages' => $pages,
    'items_per_page' => $perPage,
    'show_pagination' => $pages > 1
]);

// Dodaj okruszki chleba
$xoopsTpl->assign('xoops_breadcrumbs', [
    ['url' => XOOPS_URL, 'title' => 'Home'],
    ['url' => $module->getUrl(), 'title' => $module->getName()],
    ['title' => 'Articles']
]);

// Wyświetl szablon
$xoopsTpl->display($module->getPath() . '/templates/user/list.tpl');
```

### Plik Szablonu (list.tpl)

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

        {* Paginacja *}
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

## Niestandardowe Funkcje Smarty

### Tworzenie Niestandardowej Funkcji Bloku

```php
<?php
/**
 * Niestandardowa funkcja bloku Smarty do sprawdzenia uprawnień
 */

function smarty_block_permission($params, $content, $smarty, &$repeat)
{
    if ($repeat) return;

    if (!isset($params['name'])) {
        return 'Permission name required';
    }

    $permName = $params['name'];
    $user = $GLOBALS['xoopsUser'];

    // Sprawdź czy użytkownik ma uprawnienia
    if ($user && $user->isAdmin()) {
        return $content;
    }

    if ($user && check_user_permission($user->uid(), $permName)) {
        return $content;
    }

    return '';
}
```

Zarejestruj i używaj:

```php
$xoopsTpl->registerPlugin('block', 'permission', 'smarty_block_permission');
```

Szablon:

```smarty
{permission name="edit_articles"}
    <button>Edit Article</button>
{/permission}
```

## Najlepsze Praktyki

1. **Usuwanie Zawartości Użytkownika** - Zawsze używaj `|escape` dla zawartości generowanej przez użytkownika
2. **Używaj Ścieżek Szablonów** - Odnośniki do szablonów względem motywu
3. **Oddziel Logikę od Prezentacji** - Utrzymuj złożoną logikę w PHP
4. **Cachuj Szablony** - Włącz cachowanie szablonów w produkcji
5. **Poprawnie Używaj Modyfikatorów** - Zastosuj odpowiednie filtry dla kontekstu
6. **Organizuj Bloki** - Umieść szablony bloków w dedykowanym katalogu
7. **Dokumentuj Zmienne** - Dokumentuj wszystkie zmienne szablonów w PHP

## Powiązana Dokumentacja

- ../Module/Module-System - System modułów i haki
- ../Kernel/Kernel-Classes - Rdzeń i konfiguracja
- ../Core/XoopsObject - Klasa obiektu bazowego

---

*Patrz też: [Dokumentacja Smarty](https://www.smarty.net/docs) | [API Szablonów XOOPS](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class)*
