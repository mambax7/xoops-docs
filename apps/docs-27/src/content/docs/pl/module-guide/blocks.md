---
title: "Rozwój bloków"
---

## Przegląd

Bloki to wielokrotnie używane widgety treści wyświetlane na pasach bocznych i obszarach treści motywu. Ten przewodnik obejmuje tworzenie, konfigurowanie i dostosowywanie bloków XOOPS.

## Struktura bloku

### Definicja bloku w xoops_version.php

```php
$modversion['blocks'][] = [
    'file'        => 'blocks/recent.php',
    'name'        => '_MI_MYMODULE_BLOCK_RECENT',
    'description' => '_MI_MYMODULE_BLOCK_RECENT_DESC',
    'show_func'   => 'mymodule_recent_show',
    'edit_func'   => 'mymodule_recent_edit',
    'template'    => 'mymodule_block_recent.tpl',
    'options'     => '10|0|date',  // Opcje domyślne: limit|kategoria|sortuj
];
```

### Parametry bloku

| Parametr | Opis |
|-----------|-------------|
| `file` | Plik PHP zawierający funkcje bloku |
| `name` | Stała języka dla tytułu bloku |
| `description` | Stała języka dla opisu |
| `show_func` | Funkcja do renderowania zawartości bloku |
| `edit_func` | Funkcja do renderowania formularza opcji bloku |
| `template` | Plik szablonu Smarty |
| `options` | Domyślne opcje oddzielone pionową kreską |

## Funkcje bloku

### Funkcja pokaż

```php
// blocks/recent.php

function mymodule_recent_show(array $options): array
{
    // Przeanalizuj opcje
    $limit = (int) ($options[0] ?? 10);
    $categoryId = (int) ($options[1] ?? 0);
    $sortBy = $options[2] ?? 'date';

    // Pobierz helper modułu
    $helper = \Xmf\Module\Helper::getHelper('mymodule');
    $handler = $helper->getHandler('Item');

    // Zbuduj kryteria
    $criteria = new \CriteriaCompo();
    $criteria->add(new \Criteria('status', 'published'));

    if ($categoryId > 0) {
        $criteria->add(new \Criteria('category_id', $categoryId));
    }

    $criteria->setSort($sortBy === 'popular' ? 'views' : 'created_at');
    $criteria->setOrder('DESC');
    $criteria->setLimit($limit);

    // Pobierz elementy
    $items = $handler->getObjects($criteria);

    // Zbuduj tablicę bloku
    $block = [];
    foreach ($items as $item) {
        $block['items'][] = [
            'id'      => $item->getVar('id'),
            'title'   => $item->getVar('title'),
            'link'    => $helper->url("item.php?id=" . $item->getVar('id')),
            'date'    => formatTimestamp($item->getVar('created_at'), 's'),
            'summary' => $item->getVar('summary'),
            'views'   => $item->getVar('views'),
        ];
    }

    $block['show_summary'] = $helper->getConfig('block_show_summary');

    return $block;
}
```

### Funkcja edycji

```php
function mymodule_recent_edit(array $options): string
{
    $helper = \Xmf\Module\Helper::getHelper('mymodule');

    // Opcja 1: Liczba elementów
    $form = _MI_MYMODULE_BLOCK_LIMIT . ': ';
    $form .= '<input type="text" name="options[0]" value="' . ($options[0] ?? 10) . '" size="5">';
    $form .= '<br>';

    // Opcja 2: Wybór kategorii
    $form .= _MI_MYMODULE_BLOCK_CATEGORY . ': ';
    $form .= '<select name="options[1]">';
    $form .= '<option value="0">' . _ALL . '</option>';

    $categoryHandler = $helper->getHandler('Category');
    $categories = $categoryHandler->getObjects();
    foreach ($categories as $cat) {
        $selected = ($cat->getVar('id') == ($options[1] ?? 0)) ? ' selected' : '';
        $form .= '<option value="' . $cat->getVar('id') . '"' . $selected . '>';
        $form .= $cat->getVar('name') . '</option>';
    }
    $form .= '</select><br>';

    // Opcja 3: Kolejność sortowania
    $form .= _MI_MYMODULE_BLOCK_SORT . ': ';
    $form .= '<select name="options[2]">';
    $sortOptions = ['date' => _MI_MYMODULE_SORT_DATE, 'popular' => _MI_MYMODULE_SORT_POPULAR];
    foreach ($sortOptions as $value => $label) {
        $selected = ($value == ($options[2] ?? 'date')) ? ' selected' : '';
        $form .= '<option value="' . $value . '"' . $selected . '>' . $label . '</option>';
    }
    $form .= '</select>';

    return $form;
}
```

## Szablon bloku

```smarty
{* templates/blocks/mymodule_block_recent.tpl *}
<div class="mymodule-block-recent">
    <{if $block.items}>
        <ul class="item-list">
            <{foreach item=item from=$block.items}>
            <li class="item">
                <a href="<{$item.link}>" class="item-title">
                    <{$item.title}>
                </a>
                <{if $block.show_summary && $item.summary}>
                    <p class="item-summary"><{$item.summary|truncate:100}></p>
                <{/if}>
                <span class="item-meta">
                    <span class="date"><{$item.date}></span>
                    <span class="views"><{$item.views}> widoków</span>
                </span>
            </li>
            <{/foreach}>
        </ul>
    <{else}>
        <p class="no-items"><{$smarty.const._MI_MYMODULE_NO_ITEMS}></p>
    <{/if}>
</div>
```

## Blok z obsługą klonowania

Bloki, które można klonować, pozwalają na wiele instancji:

```php
$modversion['blocks'][] = [
    'file'        => 'blocks/category.php',
    'name'        => '_MI_MYMODULE_BLOCK_CATEGORY',
    'description' => '_MI_MYMODULE_BLOCK_CATEGORY_DESC',
    'show_func'   => 'mymodule_category_show',
    'edit_func'   => 'mymodule_category_edit',
    'template'    => 'mymodule_block_category.tpl',
    'options'     => '0',
    'can_clone'   => true,  // Włącz klonowanie
];
```

## Dynamiczna zawartość bloku

### Bloki załadowane AJAX

```php
function mymodule_ajax_show(array $options): array
{
    $block = [
        'block_id'  => $options['bid'] ?? 0,
        'ajax_url'  => XOOPS_URL . '/modules/mymodule/ajax/block.php',
        'interval'  => (int) ($options[0] ?? 30),  // Interwał odświeżenia w sekundach
    ];

    return $block;
}
```

```smarty
{* Szablon z odświeżaniem AJAX *}
<div id="mymodule-block-<{$block.block_id}>" class="ajax-block">
    <div class="block-content"></div>
</div>

<script>
(function() {
    const container = document.getElementById('mymodule-block-<{$block.block_id}>');
    const url = '<{$block.ajax_url}>?bid=<{$block.block_id}>';

    function loadContent() {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                container.querySelector('.block-content').innerHTML = html;
            });
    }

    loadContent();
    setInterval(loadContent, <{$block.interval}> * 1000);
})();
</script>
```

## Najlepsze praktyki

1. **Buforuj wyniki** - Buforuj kosztowne zapytania
2. **Waliduj opcje** - Zawsze waliduj opcje bloku
3. **Uciekaj dane wyjściowe** - Oczyszczaj całą treść użytkownika
4. **Używaj kryteriów** - Konstruuj zapytania z klasą Criteria
5. **Ogranicz zapytania** - Ustal rozsądne limity wydajności
6. **Responsywne szablony** - Upewnij się, że bloki działają na urządzeniach mobilnych

## Powiązana dokumentacja

- Module-Development - Przewodnik tworzenia modułów
- ../02-Core-Concepts/Templates/Smarty-Templating - Składnia szablonów
- ../04-API-Reference/Template/Template-System - Silnik szablonów XOOPS
- xoops_version.php - Manifest modułu
