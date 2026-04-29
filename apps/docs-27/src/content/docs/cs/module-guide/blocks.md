---
title: "Vývoj bloku"
---

## Přehled

Bloky jsou opakovaně použitelné widgety obsahu zobrazené na postranních panelech motivu a v oblastech obsahu. Tato příručka popisuje vytváření, konfiguraci a přizpůsobení bloků XOOPS.

## Bloková struktura

### Definice bloku v xoops_version.php

```php
$modversion['blocks'][] = [
    'file'        => 'blocks/recent.php',
    'name'        => '_MI_MYMODULE_BLOCK_RECENT',
    'description' => '_MI_MYMODULE_BLOCK_RECENT_DESC',
    'show_func'   => 'mymodule_recent_show',
    'edit_func'   => 'mymodule_recent_edit',
    'template'    => 'mymodule_block_recent.tpl',
    'options'     => '10|0|date',  // Default options: limit|category|sort
];
```

### Parametry bloku

| Parametr | Popis |
|-----------|-------------|
| `file` | Soubor PHP obsahující blokové funkce |
| `name` | Jazyková konstanta pro název bloku |
| `description` | Jazyková konstanta pro popis |
| `show_func` | Funkce pro vykreslení obsahu bloku |
| `edit_func` | Funkce pro vykreslení možností bloku formuláře |
| `template` | Soubor šablony Smarty |
| `options` | Výchozí možnosti oddělené potrubím |

## Blokové funkce

### Zobrazit funkci

```php
// blocks/recent.php

function mymodule_recent_show(array $options): array
{
    // Parse options
    $limit = (int) ($options[0] ?? 10);
    $categoryId = (int) ($options[1] ?? 0);
    $sortBy = $options[2] ?? 'date';

    // Get module helper
    $helper = \XMF\Module\Helper::getHelper('mymodule');
    $handler = $helper->getHandler('Item');

    // Build criteria
    $criteria = new \CriteriaCompo();
    $criteria->add(new \Criteria('status', 'published'));

    if ($categoryId > 0) {
        $criteria->add(new \Criteria('category_id', $categoryId));
    }

    $criteria->setSort($sortBy === 'popular' ? 'views' : 'created_at');
    $criteria->setOrder('DESC');
    $criteria->setLimit($limit);

    // Fetch items
    $items = $handler->getObjects($criteria);

    // Build block array
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

### Funkce úprav

```php
function mymodule_recent_edit(array $options): string
{
    $helper = \XMF\Module\Helper::getHelper('mymodule');

    // Option 1: Number of items
    $form = _MI_MYMODULE_BLOCK_LIMIT . ': ';
    $form .= '<input type="text" name="options[0]" value="' . ($options[0] ?? 10) . '" size="5">';
    $form .= '<br>';

    // Option 2: Category select
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

    // Option 3: Sort order
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

## Šablona bloku

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
                    <span class="views"><{$item.views}> views</span>
                </span>
            </li>
            <{/foreach}>
        </ul>
    <{else}>
        <p class="no-items"><{$smarty.const._MI_MYMODULE_NO_ITEMS}></p>
    <{/if}>
</div>
```

## Blokování s podporou klonování

Klonovatelné bloky umožňují více instancí:

```php
$modversion['blocks'][] = [
    'file'        => 'blocks/category.php',
    'name'        => '_MI_MYMODULE_BLOCK_CATEGORY',
    'description' => '_MI_MYMODULE_BLOCK_CATEGORY_DESC',
    'show_func'   => 'mymodule_category_show',
    'edit_func'   => 'mymodule_category_edit',
    'template'    => 'mymodule_block_category.tpl',
    'options'     => '0',
    'can_clone'   => true,  // Enable cloning
];
```

## Obsah dynamického bloku

### Bloky nabité AJAX

```php
function mymodule_ajax_show(array $options): array
{
    $block = [
        'block_id'  => $options['bid'] ?? 0,
        'ajax_url'  => XOOPS_URL . '/modules/mymodule/ajax/block.php',
        'interval'  => (int) ($options[0] ?? 30),  // Refresh interval in seconds
    ];

    return $block;
}
```

```smarty
{* Template with AJAX refresh *}
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

## Nejlepší postupy

1. **Výsledky mezipaměti** – Ukládejte do mezipaměti drahé dotazy
2. **Validate Options** – Vždy ověřte možnosti bloku
3. **Escape Output** – dezinfikujte veškerý uživatelský obsah
4. **Use Criteria** – Vytvářejte dotazy s třídou Criteria
5. **Limit dotazy** – Nastavte přiměřené limity výkonu
6. **Responzivní šablony** – Zajistěte, aby bloky fungovaly na mobilu

## Související dokumentace

- Module-Development - Module vytvoření průvodce
- ../02-Core-Concepts/Templates/Smarty-Templating - Syntaxe šablony
- ../04-API-Reference/Template/Template-System - XOOPS šablonový modul
- xoops_version.php - Manifest modulu