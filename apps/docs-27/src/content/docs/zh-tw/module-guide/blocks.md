---
title: "區塊開發"
---

## 概述

區塊是顯示在主題側邊欄和內容區域中的可重複使用內容小工具。本指南涵蓋建立、組態和自訂 XOOPS 區塊。

## 區塊結構

### xoops_version.php 中的區塊定義

```php
$modversion['blocks'][] = [
    'file'        => 'blocks/recent.php',
    'name'        => '_MI_MYMODULE_BLOCK_RECENT',
    'description' => '_MI_MYMODULE_BLOCK_RECENT_DESC',
    'show_func'   => 'mymodule_recent_show',
    'edit_func'   => 'mymodule_recent_edit',
    'template'    => 'mymodule_block_recent.tpl',
    'options'     => '10|0|date',  // 預設選項: 限制|類別|排序
];
```

### 區塊參數

| 參數 | 說明 |
|-----------|-------------|
| `file` | 包含區塊函數的 PHP 檔案 |
| `name` | 區塊標題的語言常數 |
| `description` | 說明的語言常數 |
| `show_func` | 呈現區塊內容的函數 |
| `edit_func` | 呈現區塊選項表單的函數 |
| `template` | Smarty 範本檔案 |
| `options` | 管道分隔的預設選項 |

## 區塊函數

### 顯示函數

```php
// blocks/recent.php

function mymodule_recent_show(array $options): array
{
    // 解析選項
    $limit = (int) ($options[0] ?? 10);
    $categoryId = (int) ($options[1] ?? 0);
    $sortBy = $options[2] ?? 'date';

    // 取得模組協助者
    $helper = \Xmf\Module\Helper::getHelper('mymodule');
    $handler = $helper->getHandler('Item');

    // 建立條件
    $criteria = new \CriteriaCompo();
    $criteria->add(new \Criteria('status', 'published'));

    if ($categoryId > 0) {
        $criteria->add(new \Criteria('category_id', $categoryId));
    }

    $criteria->setSort($sortBy === 'popular' ? 'views' : 'created_at');
    $criteria->setOrder('DESC');
    $criteria->setLimit($limit);

    // 擷取項目
    $items = $handler->getObjects($criteria);

    // 建立區塊陣列
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

### 編輯函數

```php
function mymodule_recent_edit(array $options): string
{
    $helper = \Xmf\Module\Helper::getHelper('mymodule');

    // 選項 1: 項目數量
    $form = _MI_MYMODULE_BLOCK_LIMIT . ': ';
    $form .= '<input type="text" name="options[0]" value="' . ($options[0] ?? 10) . '" size="5">';
    $form .= '<br>';

    // 選項 2: 類別選擇
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

    // 選項 3: 排序順序
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

## 區塊範本

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

## 具有複製支援的區塊

可複製的區塊允許多個實例：

```php
$modversion['blocks'][] = [
    'file'        => 'blocks/category.php',
    'name'        => '_MI_MYMODULE_BLOCK_CATEGORY',
    'description' => '_MI_MYMODULE_BLOCK_CATEGORY_DESC',
    'show_func'   => 'mymodule_category_show',
    'edit_func'   => 'mymodule_category_edit',
    'template'    => 'mymodule_block_category.tpl',
    'options'     => '0',
    'can_clone'   => true,  // 啟用複製
];
```

## 動態區塊內容

### AJAX 載入的區塊

```php
function mymodule_ajax_show(array $options): array
{
    $block = [
        'block_id'  => $options['bid'] ?? 0,
        'ajax_url'  => XOOPS_URL . '/modules/mymodule/ajax/block.php',
        'interval'  => (int) ($options[0] ?? 30),  // 重新整理間隔 (秒)
    ];

    return $block;
}
```

```smarty
{* 具有 AJAX 重新整理的範本 *}
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

## 最佳實踐

1. **快取結果** - 快取昂貴的查詢
2. **驗證選項** - 始終驗證區塊選項
3. **逸出輸出** - 清理所有用戶內容
4. **使用 Criteria** - 使用 Criteria 類別建立查詢
5. **限制查詢** - 為效能設定合理限制
6. **回應式範本** - 確保區塊適用於行動裝置

## 相關文件

- Module-Development - 模組建立指南
- ../02-Core-Concepts/Templates/Smarty-Templating - 範本語法
- ../04-API-Reference/Template/Template-System - XOOPS 範本引擎
- xoops_version.php - 模組清單
