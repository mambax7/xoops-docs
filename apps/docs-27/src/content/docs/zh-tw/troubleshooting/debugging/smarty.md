---
title: "Smarty 樣板除錯"
description: "XOOPS 中高級樣板除錯和故障排除技術"
---

> XOOPS 主題和模組中除錯 Smarty 樣板的進階技術。

---

## 啟用 Smarty 除錯模式

### 方法 1：管理員面板

XOOPS 管理員 > 設置 > 效能：
- 啟用「除錯輸出」
- 將「除錯等級」設置為 2

---

### 方法 2：程式碼設定

```php
<?php
// 在 mainfile.php 或模組程式碼中
require_once XOOPS_ROOT_PATH . '/class/smarty/Smarty.class.php';

$tpl = new XoopsTpl();

// 啟用除錯模式
$tpl->debugging = true;

// 可選：設置自訂除錯樣板
$tpl->debug_tpl = XOOPS_ROOT_PATH . '/class/smarty/debug.tpl';

// 呈現樣板
$tpl->display('file:template.html');
?>
```

---

### 方法 3：在瀏覽器中除錯彈出視窗

```smarty
{* 添加到樣板以啟用頁尾除錯 *}
{debug}
```

這會顯示一個彈出視窗，其中包含所有分配的變數。

---

## 常見 Smarty 除錯技術

### 傾印所有變數

```php
<?php
// 在 PHP 程式碼中
$tpl = new XoopsTpl();

// 取得所有分配的變數
$variables = $tpl->get_template_vars();

echo "<pre>";
print_r($variables);
echo "</pre>";
?>
```

在樣板中：
```smarty
{* 顯示除錯資訊 *}
<div style="border: 1px red solid; background: #ffffcc; padding: 10px;">
    <h3>Debug Info</h3>
    {debug}
</div>
```

---

### 記錄特定變數

```php
<?php
$tpl = new XoopsTpl();

// 檢查變數是否存在
$user = $tpl->get_template_var('user');

if ($user === null) {
    error_log("Variable 'user' not assigned to template");
} else {
    error_log("User data: " . json_encode($user));
}
?>
```

---

### 在樣板中檢查變數

```smarty
{* 傾印變數以除錯 *}
<pre>
{$variable|print_r}
</pre>

{* 或帶標籤 *}
<pre>
User Data:
{$user|print_r}
</pre>

{* 檢查變數是否存在 *}
{if isset($user)}
    <p>User: {$user.name}</p>
{else}
    <p style="color: red;">ERROR: user variable not set</p>
{/if}
```

---

## 檢視編譯的樣板

Smarty 將樣板編譯為 PHP 以提高效能。透過檢視編譯的程式碼進行除錯：

```bash
# 尋找編譯的樣板
ls -la xoops_data/caches/smarty_compile/

# 檢視編譯的樣板
cat xoops_data/caches/smarty_compile/filename.php
```

```php
<?php
// 建立除錯指令碼以檢視最新編譯的樣板
$compile_dir = XOOPS_CACHE_PATH . '/smarty_compile';

// 取得最新編譯的檔案
$files = glob($compile_dir . '/*.php');
usort($files, function($a, $b) {
    return filemtime($b) - filemtime($a);
});

if ($files) {
    echo "<h1>Latest Compiled Template</h1>";
    echo "<pre>";
    echo htmlspecialchars(file_get_contents($files[0]));
    echo "</pre>";
}
?>
```

---

## 分析樣板編譯

```php
<?php
// 建立 modules/yourmodule/debug_smarty.php

require_once '../../mainfile.php';
require_once XOOPS_ROOT_PATH . '/vendor/autoload.php';

$tpl = new XoopsTpl();
$ray = ray();  // 如果使用 Ray 偵錯工具

$ray->group('Smarty Configuration');

// 取得 Smarty 路徑
$ray->label('Compile Dir')->info($tpl->getCompileDir());
$ray->label('Cache Dir')->info($tpl->getCacheDir());
$ray->label('Template Dirs')->dump($tpl->getTemplateDir());

// 檢查編譯的樣板
$compile_dir = $tpl->getCompileDir();
$compiled_files = glob($compile_dir . '*.php');
$ray->label('Compiled Templates')->info(count($compiled_files) . " files");

// 顯示編譯統計
$total_size = 0;
foreach ($compiled_files as $file) {
    $total_size += filesize($file);
}
$ray->label('Compiled Cache Size')->info(round($total_size / 1024 / 1024, 2) . " MB");

// 檢查快取目錄
$cache_dir = $tpl->getCacheDir();
$cache_files = glob($cache_dir . '*.php');
$ray->label('Cached Templates')->info(count($cache_files) . " files");

$ray->groupEnd();
?>
```

---

## 清除和重新建置快取

```php
<?php
// 強制重新建置所有樣板

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
5. **在多個瀏覽器中測試**以尋找編碼問題
6. **記錄自訂外掛程式**和修飾符
7. **使用樣板繼承**以保持一致性

---

## 相關文件

- 啟用除錯模式
- 樣板錯誤
- 使用 Ray 偵錯工具
- Smarty 樣板化

---

#xoops #templates #smarty #debugging #troubleshooting
