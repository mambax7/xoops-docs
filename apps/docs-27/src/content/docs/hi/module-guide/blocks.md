---
title: "ब्लॉक विकास"
---
## अवलोकन

ब्लॉक थीम साइडबार और सामग्री क्षेत्रों में प्रदर्शित पुन: प्रयोज्य सामग्री विजेट हैं। यह मार्गदर्शिका XOOPS ब्लॉक बनाने, कॉन्फ़िगर करने और अनुकूलित करने को कवर करती है।

## ब्लॉक संरचना

### xoops_version.php में ब्लॉक परिभाषा

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

### ब्लॉक पैरामीटर

| पैरामीटर | विवरण |
|----|----|
| `file` | PHP फ़ाइल जिसमें ब्लॉक फ़ंक्शंस हैं |
| `name` | ब्लॉक शीर्षक के लिए भाषा स्थिरांक |
| `description` | विवरण के लिए भाषा स्थिरांक |
| `show_func` | ब्लॉक सामग्री प्रस्तुत करने का कार्य |
| `edit_func` | ब्लॉक विकल्प प्रपत्र प्रस्तुत करने का कार्य |
| `template` | Smarty टेम्पलेट फ़ाइल |
| `options` | पाइप से अलग किए गए डिफ़ॉल्ट विकल्प |

## ब्लॉक फ़ंक्शंस

### फ़ंक्शन दिखाएँ

```php
// blocks/recent.php

function mymodule_recent_show(array $options): array
{
    // Parse options
    $limit = (int) ($options[0] ?? 10);
    $categoryId = (int) ($options[1] ?? 0);
    $sortBy = $options[2] ?? 'date';

    // Get module helper
    $helper = \Xmf\Module\Helper::getHelper('mymodule');
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

### फ़ंक्शन संपादित करें

```php
function mymodule_recent_edit(array $options): string
{
    $helper = \Xmf\Module\Helper::getHelper('mymodule');

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

## ब्लॉक टेम्पलेट

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

## क्लोन समर्थन से ब्लॉक करें

क्लोन करने योग्य ब्लॉक कई उदाहरणों की अनुमति देते हैं:

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

## गतिशील ब्लॉक सामग्री

### AJAX-लोडेड ब्लॉक

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

## सर्वोत्तम प्रथाएँ

1. **कैश परिणाम** - कैशे महँगे प्रश्न
2. **विकल्प मान्य करें** - हमेशा ब्लॉक विकल्पों को मान्य करें
3. **एस्केप आउटपुट** - सभी उपयोगकर्ता सामग्री को स्वच्छ करें
4. **Criteria** का उपयोग करें - Criteria क्लास के साथ क्वेरी बनाएं
5. **प्रश्नों को सीमित करें** - प्रदर्शन के लिए उचित सीमाएँ निर्धारित करें
6. **उत्तरदायी टेम्प्लेट** - सुनिश्चित करें कि ब्लॉक मोबाइल पर काम करें

## संबंधित दस्तावेज़ीकरण

- मॉड्यूल-विकास - मॉड्यूल निर्माण मार्गदर्शिका
- ../02-कोर-कॉन्सेप्ट्स/टेम्पलेट्स/Smarty-टेम्पलेटिंग - टेम्प्लेट सिंटैक्स
- ../04-API-संदर्भ/टेम्पलेट/टेम्पलेट-सिस्टम - XOOPS टेम्पलेट इंजन
- xoops_version.php - मॉड्यूल मेनिफेस्ट