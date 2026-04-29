---
title: "การพัฒนาบล็อก"
---
## ภาพรวม

บล็อกคือวิดเจ็ตเนื้อหาที่นำมาใช้ซ้ำได้ซึ่งแสดงอยู่ในแถบด้านข้างของธีมและพื้นที่เนื้อหา คู่มือนี้ครอบคลุมถึงการสร้าง กำหนดค่า และปรับแต่งบล็อก XOOPS

## โครงสร้างบล็อก

### คำจำกัดความของบล็อกใน xoops_version.php
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
### พารามิเตอร์บล็อก

| พารามิเตอร์ | คำอธิบาย |
|-----------|-------------|
| `file` | PHP ไฟล์ที่มีฟังก์ชันบล็อก |
| `name` | ค่าคงที่ภาษาสำหรับชื่อบล็อก |
| `description` | ค่าคงที่ภาษาสำหรับคำอธิบาย |
| `show_func` | ฟังก์ชั่นในการแสดงเนื้อหาบล็อก |
| `edit_func` | ฟังก์ชั่นในการเรนเดอร์ตัวเลือกบล็อกในรูปแบบ |
| `template` | ไฟล์เทมเพลต Smarty |
| `options` | ตัวเลือกเริ่มต้นที่คั่นด้วยไปป์ |

## ฟังก์ชั่นบล็อก

### แสดงฟังก์ชั่น
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
### แก้ไขฟังก์ชั่น
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
## เทมเพลตบล็อก
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
## บล็อกด้วยการสนับสนุนโคลน

บล็อกแบบโคลนได้อนุญาตให้มีหลายอินสแตนซ์:
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
## เนื้อหาบล็อกแบบไดนามิก

### AJAX-บล็อกที่โหลดแล้ว
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
## แนวทางปฏิบัติที่ดีที่สุด

1. **ผลลัพธ์แคช** - แคชคำสั่งราคาแพง
2. **ตรวจสอบตัวเลือก** - ตรวจสอบตัวเลือกบล็อกเสมอ
3. **Escape Output** - ทำความสะอาดเนื้อหาของผู้ใช้ทั้งหมด
4. **ใช้เกณฑ์** - สร้างการสืบค้นด้วยคลาสเกณฑ์
5. **จำกัดการสืบค้น** - กำหนดขีดจำกัดที่เหมาะสมสำหรับประสิทธิภาพ
6. **เทมเพลตที่ตอบสนอง** - ตรวจสอบให้แน่ใจว่าบล็อกทำงานบนมือถือ

## เอกสารที่เกี่ยวข้อง

- การพัฒนาโมดูล - คู่มือการสร้างโมดูล
- ../02-Core-Concepts/Templates/Smarty-Templating - ไวยากรณ์ของเทมเพลต
- ../04-API-อ้างอิง/เทมเพลต/ระบบเทมเพลต - XOOPS โปรแกรมเทมเพลต
- xoops_version.php - รายการโมดูล