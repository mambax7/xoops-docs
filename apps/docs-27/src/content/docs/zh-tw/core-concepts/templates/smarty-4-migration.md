---
title: "Smarty 4遷移"
description: "從Smarty 3升級XOOPS範本到Smarty 4的指南"
---

本指南涵蓋從Smarty 3升級到Smarty 4時所需的更改和遷移步驟。理解這些差異對於維護與現代XOOPS安裝的相容性至關重要。

## 相關文檔

- Smarty基礎知識 - XOOPS中Smarty的基礎
- 主題開發 - 建立XOOPS主題
- 範本變量 - 範本中可用的變量

## 更改概覽

Smarty 4從Smarty 3引入了幾個破壞性更改：

1. 變量指派行為改變
2. `{php}`標籤完全移除
3. 快取API更改
4. 修飾符處理更新
5. 安全政策更改
6. 移除已棄用的功能

## 變量訪問更改

### 問題

在Smarty 2/3中，指派的值可直接訪問：

```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - 工作正常 *}
<img src="<{$mod_url}>/assets/images/icon.png">
```

在Smarty 4中，變量包裝在`Smarty_Variable`對象中：

```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```

### 解決方案1：訪問Value屬性

```smarty
{* Smarty 4 - 訪問value屬性 *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```

### 解決方案2：相容性模式

在PHP中啟用相容性模式：

```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```

這允許像Smarty 3一樣的直接變量訪問。

### 解決方案3：條件版本檢查

編寫在兩個版本中都可用的範本：

```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```

### 解決方案4：包裝函數

為指派建立幫助函數：

```php
function smartyAssign($smarty, $name, $value)
{
    if (version_compare($smarty->version, '4.0.0', '>=')) {
        // Smarty 4+ - 正常指派，在範本中透過->value訪問
        $smarty->assign($name, $value);
    } else {
        // Smarty 3 - 標準指派
        $smarty->assign($name, $value);
    }
}
```

## 移除{php}標籤

### 問題

Smarty 3+出於安全原因不支援`{php}`標籤：

```smarty
{* 這在Smarty 3+中不再有效 *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```

### 解決方案：使用Smarty變量

```smarty
{* 使用Smarty的內置變量訪問 *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```

### 解決方案：將邏輯移到PHP

複雜邏輯應在PHP中，不在範本中：

```php
// 在PHP中 - 進行處理
$catid = $downloads['cid'];
$categoryInfo = getCategoryInfo($catid);

// 將處理後的數據指派給範本
$GLOBALS['xoopsTpl']->assign('category', $categoryInfo);
```

```smarty
{* 在範本中 - 只顯示 *}
<h2><{$category.name}></h2>
```

### 解決方案：自訂插件

針對可重複使用的功能，建立Smarty插件：

```php
// /class/smarty/plugins/function.getcategory.php
function smarty_function_getcategory($params, $smarty)
{
    $catId = $params['id'] ?? 0;
    $categoryHandler = xoops_getModuleHandler('category', 'mymodule');
    $category = $categoryHandler->get($catId);

    if ($category) {
        $smarty->assign($params['assign'], $category->toArray());
    }
}
```

```smarty
{* 在範本中 *}
<{getcategory id=$cid assign="category"}>
<h2><{$category.name}></h2>
```

## 快取更改

### Smarty 3快取

```php
// Smarty 3風格
$smarty->caching = true;
$smarty->cache_lifetime = 3600;
$smarty->cache_dir = '/path/to/cache';

// 個別變量nocache
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```

### Smarty 4快取

```php
// Smarty 4風格
$smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$smarty->setCacheLifetime(3600);
$smarty->setCacheDir('/path/to/cache');

// 或使用屬性(仍然有效)
$smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$smarty->cache_lifetime = 3600;
```

### 快取常數

```php
// 快取模式
Smarty::CACHING_OFF                  // 無快取
Smarty::CACHING_LIFETIME_CURRENT     // 使用cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // 使用快取生命週期
```

### 在範本中Nocache

```smarty
{* 標記內容為永遠不快取 *}
<{nocache}>
    <p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```

## 修飾符更改

### 字符串修飾符

某些修飾符已重新命名或已棄用：

```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - 改用'html' *}
<{$text|escape:'html'}>
```

### 數組修飾符

陣列修飾符需要`@`首碼：

```smarty
{* 計算數組元素 *}
<{$items|@count}> items

{* 連接數組 *}
<{$tags|@implode:', '}>

{* JSON編碼 *}
<{$data|@json_encode}>
```

### 自訂修飾符

必須註冊自訂修飾符：

```php
// 註冊自訂修飾符
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // 處理並返回
    return processed_string($string, $param1);
}
```

## 安全政策更改

### Smarty 4安全

Smarty 4有更嚴格的預設安全性：

```php
// 配置安全政策
$smarty->enableSecurity('Smarty_Security');

// 或建立自訂政策
class MySecurityPolicy extends Smarty_Security
{
    public $php_functions = ['isset', 'empty', 'count'];
    public $php_modifiers = ['escape', 'count'];
    public $allow_super_globals = false;
}

$smarty->enableSecurity(new MySecurityPolicy($smarty));
```

### 允許的函數

預設情況下，Smarty 4限制可以使用的PHP函數：

```smarty
{* 這些可能受限制 *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```

如果需要，配置允許的函數：

```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```

## 範本繼承更新

### 區塊語法

區塊語法基本相同，但有一些更改：

```smarty
{* 父範本 *}
<html>
<head>
    {block name=head}
    <title>Default Title</title>
    {/block}
</head>
<body>
    {block name=content}{/block}
</body>
</html>
```

```smarty
{* 子範本 *}
{extends file="parent.tpl"}

{block name=head}
    {$smarty.block.parent}  {* 包括父區塊內容 *}
    <meta name="custom" content="value">
{/block}

{block name=content}
    <h1>My Content</h1>
{/block}
```

### 附加和前置

```smarty
{block name=head append}
    {* 這在父內容之後新增 *}
    <link rel="stylesheet" href="extra.css">
{/block}

{block name=scripts prepend}
    {* 這在父內容之前新增 *}
    <script src="early.js"></script>
{/block}
```

## 已棄用的功能

### 在Smarty 4中移除

| 功能 | 替代 |
|------|------|
| `{php}`標籤 | 將邏輯移到PHP或使用插件 |
| `{include_php}` | 使用註冊的插件 |
| `$smarty.capture` | 仍有效但已棄用 |
| `{strip}`帶空格 | 使用縮小化工具 |

### 使用替代品

```smarty
{* 而不是{php} *}
{* 移到PHP並指派結果 *}

{* 而不是include_php *}
<{include file="db:mytemplate.tpl"}>

{* 而不是capture(仍有效但考慮) *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
<{/capture}>
<div><{$smarty.capture.sidebar}></div>
```

## 遷移檢查清單

### 遷移前

1. [ ] 備份所有範本
2. [ ] 列出所有`{php}`標籤使用
3. [ ] 記錄自訂插件
4. [ ] 測試當前功能

### 遷移期間

1. [ ] 移除所有`{php}`標籤
2. [ ] 更新變量訪問語法
3. [ ] 檢查修飾符使用
4. [ ] 更新快取配置
5. [ ] 檢查安全設定

### 遷移後

1. [ ] 測試所有範本
2. [ ] 檢查所有表單工作
3. [ ] 驗證快取工作
4. [ ] 用不同的用戶角色測試

## 相容性測試

### 版本檢測

```php
// 檢查PHP中的Smarty版本
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Smarty 4+特定代碼
} else {
    // Smarty 3代碼
}
```

### 範本版本檢查

```smarty
{* 檢查範本中的版本 *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Smarty 4+範本代碼 *}
<{else}>
    {* Smarty 3範本代碼 *}
<{/if}>
```

## 編寫跨相容範本

### 最佳實踐

1. **完全避免`{php}`標籤** - 它們在Smarty 3+中不起作用

2. **保持範本簡單** - 複雜邏輯屬於PHP

3. **使用標準修飾符** - 避免棄用的修飾符

4. **在兩個版本中測試** - 如果您需要支援兩者

5. **為複雜操作使用插件** - 更易於維護

### 範例：跨相容範本

```smarty
{* 在Smarty 3和4中工作 *}
<!DOCTYPE html>
<html>
<head>
    <title><{$page_title|default:'Default Title'|escape}></title>
</head>
<body>
    <{if isset($items) && $items|@count > 0}>
        <ul>
        <{foreach $items as $item}>
            <li><{$item.name|escape}></li>
        <{/foreach}>
        </ul>
    <{else}>
        <p>No items found.</p>
    <{/if}>
</body>
</html>
```

## 常見遷移問題

### 問題：變量返回空

**問題**：`<{$mod_url}>`在Smarty 4中返回為空

**解決方案**：使用`<{$mod_url->value}>`或啟用相容性模式

### 問題：PHP標籤錯誤

**問題**：範本在`{php}`標籤上引發錯誤

**解決方案**：移除所有PHP標籤並將邏輯移到PHP檔案

### 問題：修飾符未找到

**問題**：自訂修飾符引發「未知修飾符」錯誤

**解決方案**：使用`registerPlugin()`註冊修飾符

### 問題：安全限制

**問題**：範本中不允許函數

**解決方案**：將函數新增到安全政策的允許清單

---

#smarty #migration #upgrade #xoops #smarty4 #compatibility
