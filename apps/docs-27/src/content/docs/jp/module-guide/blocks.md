---
title: "ブロック開発"
---

## 概要

ブロックは、テーマのサイドバーとコンテンツ領域に表示される再利用可能なコンテンツウィジェットです。このガイドでは、ブロックの作成、設定、およびカスタマイズについて説明します。

## ブロック構造

### xoops_version.php のブロック定義

```php
$modversion['blocks'][] = [
    'file'        => 'blocks/recent.php',
    'name'        => '_MI_MYMODULE_BLOCK_RECENT',
    'description' => '_MI_MYMODULE_BLOCK_RECENT_DESC',
    'show_func'   => 'mymodule_recent_show',
    'edit_func'   => 'mymodule_recent_edit',
    'template'    => 'mymodule_block_recent.tpl',
    'options'     => '10|0|date',  // デフォルトオプション: 制限|カテゴリ|ソート
];
```

### ブロック パラメーター

| パラメーター | 説明 |
|-----------|-------------|
| `file` | ブロック関数を含む PHP ファイル |
| `name` | ブロックタイトルの言語定数 |
| `description` | 説明の言語定数 |
| `show_func` | ブロックコンテンツをレンダリングする関数 |
| `edit_func` | ブロックオプションフォームをレンダリングする関数 |
| `template` | Smarty テンプレートファイル |
| `options` | パイプで区切られたデフォルトオプション |

## ブロック関数

### 表示関数

```php
// blocks/recent.php

function mymodule_recent_show(array $options): array
{
    // オプションを解析
    $limit = (int) ($options[0] ?? 10);
    $categoryId = (int) ($options[1] ?? 0);
    $sortBy = $options[2] ?? 'date';

    // モジュールヘルパーを取得
    $helper = \Xmf\Module\Helper::getHelper('mymodule');
    $handler = $helper->getHandler('Item');

    // 基準を構築
    $criteria = new \CriteriaCompo();
    $criteria->add(new \Criteria('status', 'published'));

    if ($categoryId > 0) {
        $criteria->add(new \Criteria('category_id', $categoryId));
    }

    $criteria->setSort($sortBy === 'popular' ? 'views' : 'created_at');
    $criteria->setOrder('DESC');
    $criteria->setLimit($limit);

    // アイテムを取得
    $items = $handler->getObjects($criteria);

    // ブロック配列を構築
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

### 編集関数

```php
function mymodule_recent_edit(array $options): string
{
    $helper = \Xmf\Module\Helper::getHelper('mymodule');

    // オプション 1: アイテム数
    $form = _MI_MYMODULE_BLOCK_LIMIT . ': ';
    $form .= '<input type="text" name="options[0]" value="' . ($options[0] ?? 10) . '" size="5">';
    $form .= '<br>';

    // オプション 2: カテゴリ選択
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

    // オプション 3: ソート順
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

## ブロックテンプレート

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
                    <span class="views"><{$item.views}> 閲覧</span>
                </span>
            </li>
            <{/foreach}>
        </ul>
    <{else}>
        <p class="no-items"><{$smarty.const._MI_MYMODULE_NO_ITEMS}></p>
    <{/if}>
</div>
```

## クローン対応ブロック

クローン可能なブロックは複数のインスタンスを許可します。

```php
$modversion['blocks'][] = [
    'file'        => 'blocks/category.php',
    'name'        => '_MI_MYMODULE_BLOCK_CATEGORY',
    'description' => '_MI_MYMODULE_BLOCK_CATEGORY_DESC',
    'show_func'   => 'mymodule_category_show',
    'edit_func'   => 'mymodule_category_edit',
    'template'    => 'mymodule_block_category.tpl',
    'options'     => '0',
    'can_clone'   => true,  // クローンを有効にする
];
```

## 動的ブロックコンテンツ

### AJAX 読み込みブロック

```php
function mymodule_ajax_show(array $options): array
{
    $block = [
        'block_id'  => $options['bid'] ?? 0,
        'ajax_url'  => XOOPS_URL . '/modules/mymodule/ajax/block.php',
        'interval'  => (int) ($options[0] ?? 30),  // 秒単位のリフレッシュ間隔
    ];

    return $block;
}
```

```smarty
{* AJAX リフレッシュを含むテンプレート *}
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

## ベストプラクティス

1. **結果をキャッシュ** - 高負荷のクエリをキャッシュ
2. **オプションを検証** - ブロックオプションを常に検証
3. **出力をエスケープ** - すべてのユーザーコンテンツをサニタイズ
4. **Criteria を使用** - Criteria クラスでクエリを構築
5. **クエリを制限** - パフォーマンスのための合理的な制限を設定
6. **レスポンシブテンプレート** - ブロックがモバイルで動作することを確認

## 関連ドキュメント

- Module-Development - モジュール作成ガイド
- ../02-Core-Concepts/Templates/Smarty-Templating - テンプレート構文
- ../04-API-Reference/Template/Template-System - XOOPS テンプレートエンジン
- xoops_version.php - モジュールマニフェスト
