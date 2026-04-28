---
title: "Podstawy Smarty"
description: "Fundamenty szablonów Smarty w XOOPS"
---

<span class="version-badge version-25x">2.5.x: Smarty 3</span> <span class="version-badge version-40x">4.0.x: Smarty 4</span>

:::note[Wersja Smarty wg wydania XOOPS]
| Wersja XOOPS | Wersja Smarty | Kluczowe różnice |
|---------------|----------------|-----------------|
| 2.5.11 | Smarty 3.x | Bloki `{php}` dozwolone (ale niezalecane) |
| 2.7.0+ | Smarty 3.x/4.x | Przygotowanie kompatybilności Smarty 4 |
| 4.0 | Smarty 4.x | Bloki `{php}` usunięte, bardziej surowa składnia |

Patrz Smarty-4-Migration dla wskazówek migracji.
:::

Smarty to silnik szablonów dla PHP, który pozwala programistom oddzielić prezentację (HTML/CSS) od logiki aplikacji. XOOPS używa Smarty dla wszystkich potrzeb szablonów, umożliwiając czystą separację między kodem PHP a wyjściem HTML.

## Powiązana dokumentacja

- Theme-Development - Tworzenie motywów XOOPS
- Template-Variables - Dostępne zmienne w szablonach
- Smarty-4-Migration - Aktualizacja z Smarty 3 na 4

## Co to jest Smarty?

Smarty zapewnia:

- **Rozdzielenie problemów**: Trzymaj HTML w szablonach, logikę PHP w klasach
- **Dziedziczenie szablonów**: Buduj złożone układy z prostych bloków
- **Cachowanie**: Poprawiaj wydajność ze skompilowanymi szablonami
- **Modyfikatory**: Transformuj wyjście z wbudowanymi lub niestandardowymi funkcjami
- **Bezpieczeństwo**: Kontroluj jakie funkcje PHP mogą uzyskać dostęp szablony

## Konfiguracja Smarty XOOPS

XOOPS konfiguruje Smarty z niestandardowymi delimitami:

```
Domyślny Smarty: { i }
Smarty XOOPS:   <{ i }>
```

To zapobiega konfliktom z kodem JavaScript w szablonach.

## Podstawowa składnia

### Zmienne

Zmienne są przekazywane z PHP do szablonów:

```php
// W PHP
$GLOBALS['xoopsTpl']->assign('title', 'My Page Title');
$GLOBALS['xoopsTpl']->assign('count', 42);
```

```smarty
{* W szablonie *}
<h1><{$title}></h1>
<p>Total items: <{$count}></p>
```

### Dostęp do tablicy

```php
// PHP
$item = [
    'id' => 1,
    'title' => 'Article Title',
    'author' => 'John Doe'
];
$GLOBALS['xoopsTpl']->assign('item', $item);
```

```smarty
{* Szablon *}
<h2><{$item.title}></h2>
<p>By: <{$item.author}></p>
```

### Właściwości obiektu

```php
// PHP
$GLOBALS['xoopsTpl']->assign('user', $xoopsUser);
```

```smarty
{* Szablon *}
<p>Welcome, <{$user->getVar('uname')}>!</p>
```

## Komentarze

Komentarze w Smarty nie są renderowane do HTML:

```smarty
{* To jest komentarz - nie pojawi się w wyjściu HTML *}

{*
   Komentarze wieloliniowe
   są również obsługiwane
*}
```

## Struktury kontrolne

### Instrukcje If/Else

```smarty
<{if $user_logged_in}>
    <p>Welcome back!</p>
<{elseif $is_guest}>
    <p>Hello, Guest!</p>
<{else}>
    <p>Please log in.</p>
<{/if}>
```

### Operatory porównania

```smarty
{* Równość *}
<{if $status == 'published'}>Published<{/if}>
<{if $status eq 'published'}>Published<{/if}>

{* Nierówność *}
<{if $count != 0}>Has items<{/if}>
<{if $count neq 0}>Has items<{/if}>

{* Większy/mniejszy niż *}
<{if $count > 10}>Many items<{/if}>
<{if $count gt 10}>Many items<{/if}>
<{if $count < 5}>Few items<{/if}>
<{if $count lt 5}>Few items<{/if}>

{* Większy/mniejszy lub równy *}
<{if $count >= 10}>Ten or more<{/if}>
<{if $count gte 10}>Ten or more<{/if}>
<{{if $count <= 5}>Five or less<{/if}>
<{if $count lte 5}>Five or less<{/if}>

{* Operatory logiczne *}
<{if $logged_in && $is_admin}>Admin Panel<{/if}>
<{if $logged_in and $is_admin}>Admin Panel<{/if}>
<{if $option1 || $option2}>One option selected<{/if}>
<{if $option1 or $option2}>One option selected<{/if}>
<{if !$is_banned}>Access granted<{/if}>
<{if not $is_banned}>Access granted<{/if}>
```

### Sprawdzanie pustego/isset

```smarty
{* Sprawdź czy zmienna istnieje i ma wartość *}
<{if $title}>
    <h1><{$title}></h1>
<{/if}>

{* Sprawdź czy tablica nie jest pusta *}
<{if $items|@count > 0}>
    <ul>
        <{foreach $items as $item}>
            <li><{$item.name}></li>
        <{/foreach}>
    </ul>
<{/if}>

{* Używając isset *}
<{if isset($description)}>
    <p><{$description}></p>
<{/if}>
```

### Pętle Foreach

```smarty
{* Podstawowe foreach *}
<ul>
<{foreach $items as $item}>
    <li><{$item.name}></li>
<{/foreach}>
</ul>

{* Z kluczem *}
<{foreach $options as $key => $value}>
    <option value="<{$key}>"><{$value}></option>
<{/foreach}>

{* Z @index, @first, @last *}
<{foreach $items as $item}>
    <{if $item@first}><ul><{/if}>
    <li class="item-<{$item@index}>"><{$item.name}></li>
    <{if $item@last}></ul><{/if}>
<{/foreach}>

{* Zmień kolory wierszy *}
<{foreach $rows as $row}>
    <tr class="<{if $row@iteration is odd}>odd<{else}>even<{/if}>">
        <td><{$row.name}></td>
    </tr>
<{/foreach}>

{* Foreachelse dla pustych tablic *}
<{foreach $items as $item}>
    <li><{$item.name}></li>
<{foreachelse}>
    <li>No items found.</li>
<{/foreach}>
```

### Pętle For

```smarty
<{for $i=1 to 10}>
    <p>Item <{$i}></p>
<{/for}>

<{for $i=10 to 1 step -1}>
    <p>Countdown: <{$i}></p>
<{/for}>
```

### Pętle While

```smarty
<{while $count > 0}>
    <p><{$count}></p>
    <{$count = $count - 1}>
<{/while}>
```

## Modyfikatory zmiennych

Modyfikatory transformują wyjście zmiennych:

### Modyfikatory ciągów

```smarty
{* Zescapuj HTML (zawsze używaj dla wejścia użytkownika!) *}
<{$title|escape}>
<{$title|escape:'html'}>

{* Kodowanie URL *}
<{$url|escape:'url'}>

{* Wielkie litery/małe litery *}
<{$name|upper}>
<{$name|lower}>
<{$name|capitalize}>

{* Obetnij tekst *}
<{$content|truncate:100:'...'}>

{* Usuń tagi HTML *}
<{$html|strip_tags}>

{* Zastąp *}
<{$text|replace:'old':'new'}>

{* Zawijanie słów *}
<{{$text|wordwrap:80:"\n"}>

{* Wartość domyślna *}
<{$optional_var|default:'No value'}>
```

### Modyfikatory numeryczne

```smarty
{* Formatowanie liczby *}
<{$price|string_format:"%.2f"}>
<{$count|number_format}>

{* Formatowanie daty *}
<{$timestamp|date_format:"%B %e, %Y"}>
<{$timestamp|date_format:"%Y-%m-%d %H:%M"}>
```

### Modyfikatory tablicy

```smarty
{* Policz elementy *}
<{$items|@count}> items

{* Połącz tablicę *}
<{$tags|@implode:', '}>

{* Koduj JSON *}
<{$data|@json_encode}>
```

### Łańcuchowanie modyfikatorów

```smarty
<{$content|strip_tags|truncate:200:'...'|escape}>
```

## Dołącz i wstaw

### Dołączanie innych szablonów

```smarty
{* Dołącz plik szablonu *}
<{include file="db:mymodule_header.tpl"}>

{* Dołącz ze zmiennymi *}
<{include file="db:mymodule_item.tpl" item=$currentItem}>

{* Dołącz ze zmiennymi przypisanymi *}
<{include file="db:sidebar.tpl" assign="sidebar_content"}>
<div class="sidebar"><{$sidebar_content}></div>
```

### Wstawianie dynamicznej zawartości

```smarty
{* Insert wywołuje funkcję PHP dla dynamicznej zawartości *}
<{insert name="getBanner"}>
```

## Przypisz zmienne w szablonach

```smarty
{* Proste przypisanie *}
<{assign var="page_title" value="Welcome"}>
<{$page_title = "Welcome"}>

{* Przypisanie z wyrażenia *}
<{assign var="full_name" value="`$first_name` `$last_name`"}>

{* Zawartość bloku przechwytywania *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
    <ul>
        <li>Link 1</li>
        <li>Link 2</li>
    </ul>
<{/capture}>
<div class="sidebar"><{$smarty.capture.sidebar}></div>
```

## Wbudowane zmienne Smarty

### Zmienna $smarty

```smarty
{* Bieżący timestamp *}
<{$smarty.now|date_format:"%Y-%m-%d"}>

{* Zmienne żądania *}
<{$smarty.get.page}>
<{$smarty.post.username}>
<{$smarty.request.id}>
<{$smarty.cookies.session_id}>
<{$smarty.server.HTTP_HOST}>

{* Stałe *}
<{$smarty.const.XOOPS_URL}>

{* Zmienne konfiguracji *}
<{$smarty.config.var_name}>

{* Informacje szablonu *}
<{$smarty.template}>
<{$smarty.current_dir}>

{* Wersja Smarty *}
<{$smarty.version}>

{* Właściwości sekcji/foreach *}
<{$smarty.foreach.items.index}>
<{$smarty.foreach.items.iteration}>
<{$smarty.foreach.items.first}>
<{$smarty.foreach.items.last}>
```

## Literal bloki

Dla JavaScript z nawiasami klamrowymi:

```smarty
<{literal}>
<script>
    var config = {
        url: 'https://example.com',
        count: 10
    };
    if (config.count > 5) {
        console.log('Many items');
    }
</script>
<{/literal}>
```

Lub używaj zmiennych Smarty w JavaScript:

```smarty
<script>
var moduleUrl = '<{$xoops_url}>/modules/mymodule';
var items = <{$items_json}>;
</script>
```

## Niestandardowe funkcje

XOOPS zapewnia niestandardowe funkcje Smarty:

```smarty
{* URL obrazu XOOPS *}
<img src="<{xoImgUrl}>images/logo.png" alt="Logo">

{* URL modułu XOOPS *}
<a href="<{xoModuleUrl}>">Module Home</a>

{* URL aplikacji *}
<a href="<{xoAppUrl 'item.php'}>?id=<{$item.id}>">View Item</a>
```

## Najlepsze praktyki

### Zawsze zescapuj wyjście

```smarty
{* Dla zawartości generowanej przez użytkownika, zawsze zescapuj *}
<p><{$user_comment|escape}></p>

{* Dla zawartości HTML, użyj odpowiedniej metody *}
<div><{$content}></div> {* Tylko jeśli zawartość jest wstępnie czyszczona *}
```

### Używaj znaczących nazw zmiennych

```php
// Dobrze
$GLOBALS['xoopsTpl']->assign('article_title', $title);
$GLOBALS['xoopsTpl']->assign('article_items', $items);

// Unikaj
$GLOBALS['xoopsTpl']->assign('t', $title);
$GLOBALS['xoopsTpl']->assign('arr', $items);
```

### Utrzymaj logikę na minimalnym poziomie

Szablony powinny skoncentrować się na prezentacji. Przenieś złożoną logikę do PHP:

```smarty
{* Unikaj złożonej logiki w szablonach *}
{* Źle *}
<{if $user && $user->getVar('level') > 5 && $user->getVar('status') == 'active' && $permissions|in_array:'edit'}>

{* Dobrze - oblicz w PHP i przekaż prostą flagę *}
<{if $can_edit}>
```

### Używaj dziedziczenia szablonów

Dla spójnych układów, użyj dziedziczenia szablonów (patrz Theme-Development).

## Debugowanie szablonów

### Debug console

```smarty
{* Pokaż wszystkie przypisane zmienne *}
<{debug}>
```

### Tymczasowe wyjście

```smarty
{* Debuguj konkretną zmienną *}
<pre><{$variable|@print_r}></pre>
<pre><{$variable|@var_export}></pre>
```

## Powszechne wzorce szablonów XOOPS

### Struktura szablonu modułu

```smarty
{* Nagłówek modułu *}
<div class="mymodule">
    <h2><{$module_name}></h2>

    {* Breadcrumb *}
    <{if $breadcrumb}>
    <nav class="breadcrumb">
        <{foreach $breadcrumb as $crumb}>
            <{if $crumb@last}>
                <span><{$crumb.title}></span>
            <{else}>
                <a href="<{$crumb.link}>"><{$crumb.title}></a> &raquo;
            <{/if}>
        <{/foreach}>
    </nav>
    <{/if}>

    {* Zawartość *}
    <div class="content">
        <{$content}>
    </div>
</div>
```

### Paginacja

```smarty
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```

### Wyświetlanie formularza

```smarty
<{if $form}>
<div class="form-container">
    <{$form}>
</div>
<{/if}>
```

---

#smarty #szablony #xoops #frontend #silnik-szablonów
