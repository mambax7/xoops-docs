---
title: "توسعه بلوک"
---
## بررسی اجمالی

بلوک ها ویجت های محتوای قابل استفاده مجدد هستند که در نوارهای کناری موضوع و مناطق محتوا نمایش داده می شوند. این راهنما ایجاد، پیکربندی و سفارشی کردن بلوک های XOOPS را پوشش می دهد.

## ساختار بلوک

### تعریف بلوک در xoops_version.php

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

### پارامترهای بلوک

| پارامتر | توضیحات |
|-----------|-------------|
| `file` | فایل PHP حاوی توابع بلوک |
| `name` | ثابت زبان برای عنوان بلوک |
| `description` | ثابت زبان برای توصیف |
| `show_func` | عملکرد رندر محتوای بلوک |
| `edit_func` | تابع رندر گزینه های بلوک فرم |
| `template` | فایل قالب هوشمند |
| `options` | گزینه های پیش فرض جدا شده با لوله |

## توابع بلوک

### نمایش تابع

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

### تابع ویرایش

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

## قالب بلوک

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

## با پشتیبانی Clone مسدود کنید

بلوک‌های قابل شبیه‌سازی به چندین نمونه اجازه می‌دهند:

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

## محتوای بلوک پویا

### بلوک های بارگذاری شده با AJAX

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

## بهترین شیوه ها

1. **نتایج کش** - پرس و جوهای گران قیمت را ذخیره کنید
2. ** گزینه های اعتبارسنجی ** - همیشه گزینه های بلوک را تأیید کنید
3. ** خروجی فرار ** - تمام محتوای کاربر را پاکسازی کنید
4. **استفاده از معیارها** - ساخت کوئری ها با کلاس Criteria
5. **پرسش های محدود ** - محدودیت های معقولی برای عملکرد تعیین کنید
6. **قالب های پاسخگو** - اطمینان حاصل کنید که بلوک ها روی موبایل کار می کنند

## مستندات مرتبط

- ماژول-توسعه - راهنمای ایجاد ماژول
- ../02-Core-Concepts/Templates/Smarty-Templating - نحو الگو
- ../04-API-Reference/Template/Template-System - موتور قالب XOOPS
- xoops_version.php - Module manifest