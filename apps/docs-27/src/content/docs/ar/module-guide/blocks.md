---
title: "تطوير الكتل"
dir: rtl
lang: ar
---

## نظرة عامة

الكتل عبارة عن عناصر واجهة محتوى قابلة لإعادة الاستخدام تُعرض في أشرطة جانبية للمظهر ومناطق محتوى. يغطي هذا الدليل إنشاء وتكوين وتخصيص كتل XOOPS.

## هيكل الكتلة

### تعريف الكتلة في xoops_version.php

```php
$modversion['blocks'][] = [
    'file'        => 'blocks/recent.php',
    'name'        => '_MI_MYMODULE_BLOCK_RECENT',
    'description' => '_MI_MYMODULE_BLOCK_RECENT_DESC',
    'show_func'   => 'mymodule_recent_show',
    'edit_func'   => 'mymodule_recent_edit',
    'template'    => 'mymodule_block_recent.tpl',
    'options'     => '10|0|date',  // الخيارات الافتراضية: limit|category|sort
];
```

### معاملات الكتلة

| المعامل | الوصف |
|-----------|-------------|
| `file` | ملف PHP يحتوي على دوال الكتلة |
| `name` | ثابت اللغة لعنوان الكتلة |
| `description` | ثابت اللغة للوصف |
| `show_func` | الدالة لعرض محتوى الكتلة |
| `edit_func` | الدالة لعرض نموذج خيارات الكتلة |
| `template` | ملف قالب Smarty |
| `options` | خيارات مفصولة بأنابيب |

## دوال الكتلة

### دالة العرض

```php
// blocks/recent.php

function mymodule_recent_show(array $options): array
{
    // تحليل الخيارات
    $limit = (int) ($options[0] ?? 10);
    $categoryId = (int) ($options[1] ?? 0);
    $sortBy = $options[2] ?? 'date';

    // احصل على مساعد الوحدة
    $helper = \Xmf\Module\Helper::getHelper('mymodule');
    $handler = $helper->getHandler('Item');

    // بناء المعايير
    $criteria = new \CriteriaCompo();
    $criteria->add(new \Criteria('status', 'published'));

    if ($categoryId > 0) {
        $criteria->add(new \Criteria('category_id', $categoryId));
    }

    $criteria->setSort($sortBy === 'popular' ? 'views' : 'created_at');
    $criteria->setOrder('DESC');
    $criteria->setLimit($limit);

    // جلب العناصر
    $items = $handler->getObjects($criteria);

    // بناء مصفوفة الكتلة
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

### دالة التحرير

```php
function mymodule_recent_edit(array $options): string
{
    $helper = \Xmf\Module\Helper::getHelper('mymodule');

    // الخيار 1: عدد العناصر
    $form = _MI_MYMODULE_BLOCK_LIMIT . ': ';
    $form .= '<input type="text" name="options[0]" value="' . ($options[0] ?? 10) . '" size="5">';
    $form .= '<br>';

    // الخيار 2: اختيار الفئة
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

    // الخيار 3: ترتيب الفرز
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

## قالب الكتلة

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

## كتلة مع دعم النسخ

كتل قابلة للاستنساخ تسمح بعدة مثيلات:

```php
$modversion['blocks'][] = [
    'file'        => 'blocks/category.php',
    'name'        => '_MI_MYMODULE_BLOCK_CATEGORY',
    'description' => '_MI_MYMODULE_BLOCK_CATEGORY_DESC',
    'show_func'   => 'mymodule_category_show',
    'edit_func'   => 'mymodule_category_edit',
    'template'    => 'mymodule_block_category.tpl',
    'options'     => '0',
    'can_clone'   => true,  // تمكين الاستنساخ
];
```

## محتوى كتلة ديناميكي

### كتل محملة بـ AJAX

```php
function mymodule_ajax_show(array $options): array
{
    $block = [
        'block_id'  => $options['bid'] ?? 0,
        'ajax_url'  => XOOPS_URL . '/modules/mymodule/ajax/block.php',
        'interval'  => (int) ($options[0] ?? 30),  // فترة التحديث بالثواني
    ];

    return $block;
}
```

```smarty
{* القالب مع تحديث AJAX *}
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

## أفضل الممارسات

1. **نتائج التخزين المؤقت** - نتائج الاستعلامات المكلفة
2. **التحقق من الخيارات** - تحقق دائماً من خيارات الكتلة
3. **مخرجات الهروب** - تطهير جميع محتوى المستخدم
4. **استخدم المعايير** - بناء الاستعلامات مع فئة المعايير
5. **حد من الاستعلامات** - تعيين حدود معقولة للأداء
6. **قوالب سريعة الاستجابة** - تأكد من أن الكتل تعمل على الهاتف المحمول

## الوثائق ذات الصلة

- Module-Development - دليل إنشاء الوحدة
- ../02-Core-Concepts/Templates/Smarty-Templating - بناء جملة القالب
- ../04-API-Reference/Template/Template-System - محرك قوالب XOOPS
- xoops_version.php - بيان الوحدة
