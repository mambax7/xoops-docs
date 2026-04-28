---
title: "Migracja Smarty 4"
description: "Przewodnik aktualizacji szablonów XOOPS z Smarty 3 na Smarty 4"
---

Ten przewodnik obejmuje zmiany i kroki migracji potrzebne do aktualizacji z Smarty 3 na Smarty 4 w XOOPS. Zrozumienie tych różnic jest niezbędne do utrzymania kompatybilności z nowoczesną instalacją XOOPS.

## Powiązana dokumentacja

- Smarty-Basics - Fundamenty Smarty w XOOPS
- Theme-Development - Tworzenie motywów XOOPS
- Template-Variables - Dostępne zmienne w szablonach

## Przegląd zmian

Smarty 4 wprowadził kilka przełomowych zmian z Smarty 3:

1. Zmienione zachowanie przypisania zmiennych
2. Tagi `{php}` całkowicie usunięte
3. Zmiany API cachowania
4. Aktualizacje obsługi modyfikatorów
5. Zmiany polityki bezpieczeństwa
6. Usunięte przestarzałe funkcje

## Zmiany dostępu do zmiennych

### Problem

W Smarty 2/3 przypisane wartości były bezpośrednio dostępne:

```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - działało dobrze *}
<img src="<{$mod_url}>/assets/images/icon.png">
```

W Smarty 4 zmienne są owiniętę w obiekty `Smarty_Variable`:

```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```

### Rozwiązanie 1: Dostęp do właściwości Value

```smarty
{* Smarty 4 - dostęp do właściwości value *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```

### Rozwiązanie 2: Tryb kompatybilności

Włącz tryb kompatybilności w PHP:

```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```

Umożliwia bezpośredni dostęp do zmiennych jak w Smarty 3.

### Rozwiązanie 3: Warunkowy check wersji

Pisz szablony, które działają w obu wersjach:

```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```

### Rozwiązanie 4: Funkcja Wrapper

Utwórz funkcję pomocniczą do przypisań:

```php
function smartyAssign($smarty, $name, $value)
{
    if (version_compare($smarty->version, '4.0.0', '>=')) {
        // Smarty 4+ - przypisz normalnie, dostęp przez ->value w szablonach
        $smarty->assign($name, $value);
    } else {
        // Smarty 3 - standardowe przypisanie
        $smarty->assign($name, $value);
    }
}
```

## Usuwanie tagów {php}

### Problem

Smarty 3+ nie obsługuje tagów `{php}` ze względów bezpieczeństwa:

```smarty
{* To NIE DZIAŁA JUŻ w Smarty 3+ *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```

### Rozwiązanie: Używaj zmiennych Smarty

```smarty
{* Używaj wbudowanego dostępu do zmiennych Smarty *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```

### Rozwiązanie: Przenieś logikę do PHP

Złożona logika powinna być w PHP, nie w szablonach:

```php
// W PHP - wykonaj przetwarzanie
$catid = $downloads['cid'];
$categoryInfo = getCategoryInfo($catid);

// Przypisz przetworzone dane do szablonu
$GLOBALS['xoopsTpl']->assign('category', $categoryInfo);
```

```smarty
{* W szablonie - po prostu wyświetl *}
<h2><{$category.name}></h2>
```

### Rozwiązanie: Niestandardowe wtyczki

Dla wielokrotnego użytku funkcjonalności, utwórz wtyczki Smarty:

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
{* W szablonie *}
<{getcategory id=$cid assign="category"}>
<h2><{$category.name}></h2>
```

## Zmiany cachowania

### Cachowanie Smarty 3

```php
// Styl Smarty 3
$smarty->caching = true;
$smarty->cache_lifetime = 3600;
$smarty->cache_dir = '/path/to/cache';

// Per-zmienna nocache
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```

### Cachowanie Smarty 4

```php
// Styl Smarty 4
$smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$smarty->setCacheLifetime(3600);
$smarty->setCacheDir('/path/to/cache');

// Lub przy użyciu właściwości (nadal działa)
$smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$smarty->cache_lifetime = 3600;
```

### Konstancie cachowania

```php
// Tryby cachowania
Smarty::CACHING_OFF                  // Brak cachowania
Smarty::CACHING_LIFETIME_CURRENT     // Użyj cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // Użyj cached lifetime
```

### Nocache w szablonach

```smarty
{* Oznacz zawartość jako nigdy nie cached *}
<{nocache}>
    <p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```

## Zmiany modyfikatorów

### Modyfikatory ciągów

Niektóre modyfikatory zostały zmienione lub wycofane:

```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - użyj 'html' zamiast *}
<{$text|escape:'html'}>
```

### Modyfikatory tablicy

Modyfikatory tablicy wymagają prefiksu `@`:

```smarty
{* Policz elementy tablicy *}
<{$items|@count}> items

{* Połącz tablicę *}
<{$tags|@implode:', '}>

{* Koduj JSON *}
<{$data|@json_encode}>
```

### Niestandardowe modyfikatory

Niestandardowe modyfikatory muszą być zarejestrowane:

```php
// Zarejestruj niestandardowy modyfikator
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // Przetwórz i zwróć
    return processed_string($string, $param1);
}
```

## Zmiany polityki bezpieczeństwa

### Bezpieczeństwo Smarty 4

Smarty 4 ma bardziej surowe domyślne bezpieczeństwo:

```php
// Konfiguruj politykę bezpieczeństwa
$smarty->enableSecurity('Smarty_Security');

// Lub utwórz niestandardową politykę
class MySecurityPolicy extends Smarty_Security
{
    public $php_functions = ['isset', 'empty', 'count'];
    public $php_modifiers = ['escape', 'count'];
    public $allow_super_globals = false;
}

$smarty->enableSecurity(new MySecurityPolicy($smarty));
```

### Dozwolone funkcje

Domyślnie Smarty 4 ogranicza które funkcje PHP mogą być używane:

```smarty
{* Te mogą być ograniczone *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```

Skonfiguruj dozwolone funkcje jeśli to konieczne:

```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```

## Aktualizacje dziedziczenia szablonów

### Składnia bloku

Składnia bloku pozostaje podobna ale z niektórymi zmianami:

```smarty
{* Szablon rodzica *}
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
{* Szablon dziecka *}
{extends file="parent.tpl"}

{block name=head}
    {$smarty.block.parent}  {* Dołącz zawartość bloku rodzica *}
    <meta name="custom" content="value">
{/block}

{block name=content}
    <h1>My Content</h1>
{/block}
```

### Append i Prepend

```smarty
{block name=head append}
    {* To jest dodane po zawartości rodzica *}
    <link rel="stylesheet" href="extra.css">
{/block}

{block name=scripts prepend}
    {* To jest dodane przed zawartością rodzica *}
    <script src="early.js"></script>
{/block}
```

## Przestarzałe funkcje

### Usunięte w Smarty 4

| Funkcja | Alternatywa |
|---------|-------------|
| `{php}` tags | Przenieś logikę do PHP lub użyj wtyczek |
| `{include_php}` | Użyj zarejestrowanych wtyczek |
| `$smarty.capture` | Nadal działa ale przestarzałe |
| `{strip}` z spacjami | Użyj narzędzi minifikacji |

### Używaj alternatyw

```smarty
{* Zamiast {php} *}
{* Przenieś do PHP i przypisz wynik *}

{* Zamiast include_php *}
<{include file="db:mytemplate.tpl"}>

{* Zamiast capture (nadal działa ale rozważ) *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
<{/capture}>
<div><{$smarty.capture.sidebar}></div>
```

## Lista kontrolna migracji

### Przed migracją

1. [ ] Backupuj wszystkie szablony
2. [ ] Wypisz wszystkie użycia `{php}` tagu
3. [ ] Dokumentuj niestandardowe wtyczki
4. [ ] Testuj bieżącą funkcjonalność

### Podczas migracji

1. [ ] Usuń wszystkie tagi `{php}`
2. [ ] Aktualizuj składnię dostępu do zmiennych
3. [ ] Sprawdź użycie modyfikatorów
4. [ ] Aktualizuj konfigurację cachowania
5. [ ] Przejrzyj ustawienia bezpieczeństwa

### Po migracji

1. [ ] Testuj wszystkie szablony
2. [ ] Sprawdzaj czy wszystkie formularze działają
3. [ ] Weryfikuj czy cachowanie działa
4. [ ] Testuj z różnymi rolami użytkownika

## Testowanie kompatybilności

### Detektowanie wersji

```php
// Sprawdzaj wersję Smarty w PHP
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Kod specyficzny dla Smarty 4+
} else {
    // Kod Smarty 3
}
```

### Check wersji szablonu

```smarty
{* Check wersję w szablonie *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Kod szablonu Smarty 4+ *}
<{else}>
    {* Kod szablonu Smarty 3 *}
<{/if}>
```

## Pisanie szablonów kompatybilnych między wersjami

### Najlepsze praktyki

1. **Całkowicie unikaj tagów `{php}`** - Nie działają w Smarty 3+

2. **Utrzymuj szablony proste** - Złożona logika należy do PHP

3. **Używaj standardowych modyfikatorów** - Unikaj przestarzałych

4. **Testuj w obu wersjach** - Jeśli musisz obsługiwać obie

5. **Używaj wtyczek dla złożonych operacji** - Łatwiejsze do utrzymania

### Przykład: Szablon kompatybilny między wersjami

```smarty
{* Działa zarówno w Smarty 3 jak i 4 *}
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

## Powszechne problemy migracji

### Problem: Zmienne zwracają puste

**Problem**: `<{$mod_url}>` zwraca nic w Smarty 4

**Rozwiązanie**: Użyj `<{$mod_url->value}>` lub włącz tryb kompatybilności

### Problem: Błędy tagu PHP

**Problem**: Szablon wyrzuca błąd na tagach `{php}`

**Rozwiązanie**: Usuń wszystkie tagi PHP i przenieś logikę do plików PHP

### Problem: Modyfikator nie znaleziony

**Problem**: Niestandardowy modyfikator wyrzuca błąd "unknown modifier"

**Rozwiązanie**: Zarejestruj modyfikator z `registerPlugin()`

### Problem: Ograniczenie bezpieczeństwa

**Problem**: Funkcja nie dozwolona w szablonie

**Rozwiązanie**: Dodaj funkcję do listy dozwolonych polityki bezpieczeństwa

---

#smarty #migracja #aktualizacja #xoops #smarty4 #kompatybilność
