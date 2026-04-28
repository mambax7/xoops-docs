---
title: "Szablony i Bloki"
---

## Przegląd

Publisher dostarcza dostosowywalne szablony do wyświetlania artykułów i bloki do integracji na pasku bocznym/widżety. Ten przewodnik obejmuje dostosowywanie szablonów i konfigurację bloków.

## Pliki Szablonów

### Szablony Bazowe

| Szablon | Cel |
|----------|---------|
| `publisher_index.tpl` | Strona główna modułu |
| `publisher_item.tpl` | Widok pojedynczego artykułu |
| `publisher_category.tpl` | Lista kategorii |
| `publisher_archive.tpl` | Strona archiwum |
| `publisher_search.tpl` | Wyniki wyszukiwania |
| `publisher_submit.tpl` | Formularz przesyłania artykułu |
| `publisher_print.tpl` | Widok do druku |

### Szablony Bloków

| Szablon | Cel |
|----------|---------|
| `publisher_block_latest.tpl` | Blok ostatnich artykułów |
| `publisher_block_spotlight.tpl` | Blok wyróżnionego artykułu |
| `publisher_block_category.tpl` | Blok listy kategorii |
| `publisher_block_author.tpl` | Blok artykułów autora |

## Zmienne Szablonów

### Zmienne Artykułu

```smarty
{* Dostępne w publisher_item.tpl *}
<{$item.title}>           {* Tytuł artykułu *}
<{$item.body}>            {* Pełna zawartość *}
<{$item.summary}>         {* Streszczenie/wyciąg *}
<{$item.author}>          {* Nazwa autora *}
<{$item.authorid}>        {* ID użytkownika autora *}
<{$item.datesub}>         {* Data publikacji *}
<{$item.datemodified}>    {* Data ostatniej modyfikacji *}
<{$item.counter}>         {* Liczba wyświetleń *}
<{$item.rating}>          {* Średnia ocena *}
<{$item.votes}>           {* Liczba głosów *}
<{$item.categoryname}>    {* Nazwa kategorii *}
<{$item.categorylink}>    {* URL kategorii *}
<{$item.itemurl}>         {* URL artykułu *}
<{$item.image}>           {* Obraz wyróżniony *}
```

### Zmienne Kategorii

```smarty
{* Dostępne w publisher_category.tpl *}
<{$category.name}>        {* Nazwa kategorii *}
<{$category.description}> {* Opis kategorii *}
<{$category.image}>       {* Obraz kategorii *}
<{$category.total}>       {* Liczba artykułów *}
<{$category.link}>        {* URL kategorii *}
```

## Dostosowywanie Szablonów

### Lokalizacja Przesłonięcia

Skopiuj szablony do swojego motywu, aby dostosować:

```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```

### Przykład: Niestandardowy Szablon Artykułu

```smarty
{* themes/mytheme/modules/publisher/publisher_item.tpl *}
<article class="publisher-article">
    <header>
        <h1><{$item.title}></h1>
        <div class="meta">
            <span class="author">Autor: <{$item.author}></span>
            <span class="date"><{$item.datesub}></span>
            <span class="category">
                <a href="<{$item.categorylink}>"><{$item.categoryname}></a>
            </span>
        </div>
    </header>

    <{if $item.image}>
    <figure class="featured-image">
        <img src="<{$item.image}>" alt="<{$item.title}>">
    </figure>
    <{/if}>

    <div class="content">
        <{$item.body}>
    </div>

    <footer>
        <{if $item.who_when}>
            <p class="attribution"><{$item.who_when}></p>
        <{/if}>

        <div class="actions">
            <{if $can_edit}>
                <a href="<{$xoops_url}>/modules/publisher/submit.php?itemid=<{$item.itemid}>">
                    Edytuj Artykuł
                </a>
            <{/if}>
            <a href="<{$item.printlink}>" target="_blank">Drukuj</a>
            <a href="<{$item.maillink}>">Wyślij E-mail</a>
        </div>
    </footer>
</article>
```

## Bloki

### Dostępne Bloki

| Blok | Opis |
|-------|-------------|
| Ostatnie Wiadomości | Pokazuje ostatnie artykuły |
| Wyróżnione | Wyróżnienie wyróżnionego artykułu |
| Menu Kategorii | Nawigacja kategorii |
| Archiwum | Linki archiwum |
| Najlepsi Autorzy | Najbardziej aktywni pisarze |
| Popularne Elementy | Najczęściej przeglądane artykuły |

### Opcje Bloku

#### Blok Ostatnich Wiadomości

| Opcja | Opis |
|--------|-------------|
| Elementy do wyświetlenia | Liczba artykułów |
| Filtr kategorii | Ograniczu do określonych kategorii |
| Pokaż streszczenie | Wyświetlaj wyciąg artykułu |
| Długość tytułu | Skróć tytuły |
| Szablon | Plik szablonu bloku |

### Niestandardowy Szablon Bloku

```smarty
{* themes/mytheme/modules/publisher/blocks/publisher_block_latest.tpl *}
<div class="publisher-latest-block">
    <{foreach item=item from=$block.items}>
    <article class="block-item">
        <h4>
            <a href="<{$item.link}>"><{$item.title}></a>
        </h4>
        <{if $block.show_summary}>
            <p><{$item.summary}></p>
        <{/if}>
        <div class="block-meta">
            <span class="date"><{$item.date}></span>
            <span class="views"><{$item.counter}> wyświetleń</span>
        </div>
    </article>
    <{/foreach}>
</div>
```

## Sztuczki Szablonów

### Warunkowe Wyświetlanie

```smarty
{* Pokaż różną zawartość dla różnych użytkowników *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Edycja Administracyjna</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Edytuj Swój Artykuł</a>
<{/if}>
```

### Niestandardowa Klasa CSS

```smarty
{* Dodaj stylowanie oparte na statusie *}
<article class="article <{$item.status}>">
    {* Zawartość *}
</article>
```

### Formatowanie Daty

```smarty
{* Sformatuj daty za pomocą Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```

## Powiązana Dokumentacja

- ../User-Guide/Basic-Configuration - Ustawienia modułu
- ../User-Guide/Creating-Articles - Zarządzanie treścią
- ../../04-API-Reference/Template/Template-System - Aparat szablonów XOOPS
- ../../02-Core-Concepts/Themes/Theme-Development - Dostosowywanie motywu
