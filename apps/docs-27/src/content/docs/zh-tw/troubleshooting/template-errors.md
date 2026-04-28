---
title: "樣板錯誤"
description: "除錯和修復 XOOPS 中的 Smarty 樣板錯誤"
---

# 樣板錯誤 (Smarty 除錯)

> XOOPS 主題和模組中常見的 Smarty 樣板問題和除錯技術。

---

## 1. 語法錯誤

**症狀：**
- 「Smarty 語法錯誤」訊息
- 樣板不會編譯
- 無輸出的空白頁面

**錯誤訊息：**
```
Syntax error: unrecognized tag 'myfunction'
Unexpected "}" near end of template
```

### 常見語法問題

**缺少結束標籤：**
```smarty
{* 錯誤 *}
{if $user}
User: {$user.name}
{* 缺少 {/if} *}

{* 正確 *}
{if $user}
User: {$user.name}
{/if}
```

**錯誤的變數語法：**
```smarty
{* 錯誤 *}
{$user->name}          {* 使用 . 不是 -> *}
{$array[key]}          {* 使用引號的鍵 *}
{$func()}              {* 不能直接呼叫函式 *}

{* 正確 *}
{$user.name}
{$array.key}
{$array['key']}
{$user|@function}      {* 使用修飾符代替 *}
```

**不匹配的引號：**
```smarty
{* 錯誤 *}
{if $name == 'John}     {* 引號不匹配 *}
{assign var="user' value="John"}

{* 正確 *}
{if $name == 'John'}
{assign var="user" value="John"}
```

### 解決方案

```smarty
{* 始終平衡大括號 *}
{if condition}
  ...
{elseif condition}
  ...
{else}
  ...
{/if}

{* 驗證標籤格式 *}
{foreach $items as $item}
  ...
{/foreach}

{* 檢查所有變數都已定義 *}
{if isset($variable)}
  {$variable}
{/if}
```

---

## 2. 未定義的變數錯誤

**症狀：**
- 「未定義的變數」警告
- 變數顯示為空
- 錯誤日誌中的 PHP 通知

**錯誤訊息：**
```
Notice: Undefined variable: myvar
Smarty notice: variable "$user" not available
```

### 修復在 PHP 中

```php
<?php
// 確保變數在呈現前被分配
$xoopsTpl = new XoopsTpl();

// 錯誤 - 變數未分配
$xoopsTpl->display('file:templates/page.html');

// 正確 - 首先分配變數
$user = [
    'name' => 'John',
    'email' => 'john@example.com'
];
$xoopsTpl->assign('user', $user);
$xoopsTpl->display('file:templates/page.html');
?>
```

### 修復在樣板中

```smarty
{* 使用變數前檢查是否存在 *}
{if isset($user)}
    <p>User: {$user.name}</p>
{else}
    <p>No user data</p>
{/if}

{* 使用預設值 *}
<p>Name: {$user.name|default:"No name"}</p>

{* 檢查陣列鍵是否存在 *}
{if isset($array.key)}
    {$array.key}
{/if}
```

---

## 3. 缺少或不正確的修飾符

**症狀：**
- 資料格式不正確
- 文字顯示為 HTML
- 不正確的大小寫/編碼

**錯誤訊息：**
```
Warning: undefined modifier 'stripslashes'
```

### 常見修飾符

```smarty
{* 字元串操作 *}
{$text|upper}                    {* 大寫 *}
{$text|lower}                    {* 小寫 *}
{$text|capitalize}               {* 首字母大寫 *}
{$text|truncate:20:"..."}        {* 截短到 20 個字符 *}
{$text|strip_tags}               {* 移除 HTML 標籤 *}

{* HTML/格式化 *}
{$html|escape}                   {* HTML 逸出 *}
{$html|escape:'html'}
{$url|escape:'url'}              {* URL 逸出 *}
{$text|nl2br}                    {* 換行轉 <br> *}

{* 陣列 *}
{$array|@count}                  {* 陣列計數 *}
{$array|@implode:', '}           {* 連接陣列 *}

{* 預設值 *}
{$var|default:"No value"}

{* 日期格式化 *}
{$date|date_format:"%Y-%m-%d"}   {* 格式化日期 *}

{* 數學操作 *}
{$number|math:'+':10}            {* 數學操作 *}
```

---

## 4. 快取問題

**症狀：**
- 樣板變更不出現
- 舊內容仍顯示
- 過時的包含或資源

### 解決方案

```bash
# 清除 Smarty 快取目錄
rm -rf /path/to/xoops/xoops_data/caches/smarty_cache/*
rm -rf /path/to/xoops/xoops_data/caches/smarty_compile/*

# 清除特定模組快取
rm -rf /path/to/xoops/xoops_data/caches/smarty_cache/modules/*
```

### 在程式碼中清除快取

```php
<?php
// 清除所有 Smarty 快取
$xoopsTpl = new XoopsTpl();
$xoopsTpl->clear_cache();
$xoopsTpl->clear_compiled_tpl();

// 清除特定樣板快取
$xoopsTpl->clear_cache('file:templates/page.html');

// 清除所有快取檔案
require_once XOOPS_ROOT_PATH . '/class/xoopsfile.php';
$dh = opendir(XOOPS_CACHE_PATH . '/smarty_cache');
while (($file = readdir($dh)) !== false) {
    if (is_file(XOOPS_CACHE_PATH . '/smarty_cache/' . $file)) {
        unlink(XOOPS_CACHE_PATH . '/smarty_cache/' . $file);
    }
}
closedir($dh);
?>
```

---

## 5. 找不到外掛程式錯誤

**症狀：**
- 「未知修飾符」或「未知外掛程式」
- 自訂函式不運作
- 外掛程式編譯錯誤

**錯誤訊息：**
```
Fatal error: Call to undefined function smarty_modifier_custom
Unknown modifier 'myfunction'
```

### 建立自訂外掛程式

```php
<?php
// 建立：modules/yourmodule/plugins/modifier.custom.php

/**
 * Smarty {$var|custom} 修飾符外掛程式
 */
function smarty_modifier_custom($string, $param = '') {
    // 您的自訂程式碼
    return strtoupper($string) . $param;
}
?>
```

### 註冊外掛程式

```php
<?php
// 在您的模組初始化程式碼中
$xoopsTpl = new XoopsTpl();

// 新增外掛程式目錄到 Smarty
$xoopsTpl->addPluginDir(
    XOOPS_ROOT_PATH . '/modules/yourmodule/plugins'
);

// 或手動註冊
$xoopsTpl->register_modifier(
    'custom',
    'smarty_modifier_custom'
);
?>
```

---

## 6. 樣板包含/延伸問題

**症狀：**
- 包含的樣板不加載
- 找不到父樣板
- CSS/JS 不加載

**錯誤訊息：**
```
Template file 'file:path/to/template.html' not found
Can't find template file 'header.html'
```

### 正確的包含語法

```smarty
{* 包含樣板 *}
{include file="file:templates/header.html"}

{* 包含帶變數 *}
{include file="file:templates/header.html" title="My Page"}

{* 樣板繼承 *}
{extends file="file:templates/base.html"}

{* 命名區塊 *}
{block name="content"}
    頁面內容在此
{/block}

{* 靜態資源 *}
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
<script src="{$xoops_url}/modules/{$xoops_module_dir}/js/script.js"></script>
```

---

## 清除和重建快取

```php
<?php
// 強制重新建立所有樣板

$tpl = new XoopsTpl();

// 清除快取
$tpl->clearCache();
$tpl->clearCompiledTemplate();

// 強制重新編譯
$tpl->force_compile = true;

// 呈現所有模組樣板
$modules = ['mymodule', 'publisher', 'downloads'];

foreach ($modules as $module) {
    $template = "file:" . XOOPS_ROOT_PATH . "/modules/$module/templates/index.html";

    try {
        $tpl->display($template);
        error_log("Compiled: $module");
    } catch (Exception $e) {
        error_log("Error compiling $module: " . $e->getMessage());
    }
}

// 完成後禁用強制編譯
$tpl->force_compile = false;
?>
```

---

## 預防和最佳實踐

1. **啟用除錯**在開發期間
2. **驗證樣板**部署前
3. **清除快取**變更後
4. **使用 git** 追蹤樣板變更
5. **在多個瀏覽器中測試**尋找編碼問題
6. **記錄自訂外掛程式**和修飾符
7. **使用樣板繼承**以保持一致性

---

## 相關文件

- Smarty 除錯指南
- Smarty 樣板化
- 啟用除錯模式
- 主題常見問題解答

---

#xoops #troubleshooting #templates #smarty #debugging
