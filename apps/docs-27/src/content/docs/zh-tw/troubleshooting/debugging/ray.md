---
title: "使用 Ray 偵錯工具"
description: "使用 Ray 偵錯工具除錯 XOOPS 應用程式"
---

# 使用 Ray 偵錯工具進行 XOOPS

> 使用 Ray 進行現代除錯：檢查變數、記錄訊息、追蹤 SQL 查詢，以及在 XOOPS 應用程式中分析效能。

---

## 什麼是 Ray？

Ray 是一個輕量級的除錯工具，可幫助您檢查應用程式狀態，而無需停止執行或使用中斷點。非常適合 XOOPS 開發。

**功能：**
- 記錄訊息和變數
- 檢查 SQL 查詢
- 追蹤效能
- 分析程式碼
- 將相關日誌分組
- 視覺化時間表

**需求：**
- PHP 7.4+
- Ray 應用程式 (免費版本可用)
- Composer

---

## 安裝

### 步驟 1：安裝 Ray 套件

```bash
cd /path/to/xoops

# 透過 Composer 安裝 Ray
composer require spatie/ray

# 或全域安裝
composer global require spatie/ray
```

### 步驟 2：下載 Ray 應用程式

從 [ray.so](https://ray.so) 下載：
- Mac: Ray.app
- Windows: Ray.exe
- Linux: ray (AppImage)

---

## 基本使用

### 簡單記錄

```php
<?php
require_once 'mainfile.php';
require 'vendor/autoload.php';

// 初始化 Ray
$ray = ray();

// 記錄簡單訊息
$ray->info('Page loaded');

// 記錄變數
$user = ['name' => 'John', 'email' => 'john@example.com'];
$ray->dump($user);

// 帶標籤的記錄
$ray->label('User Data')->dump($user);
?>
```

**Ray 應用程式中的輸出：**
```
ℹ Page loaded
👁 User Data: ['name' => 'John', 'email' => 'john@example.com']
```

---

### 不同的記錄等級

```php
<?php
$ray = ray();

// 資訊
$ray->info('Informational message');

// 成功
$ray->success('Operation completed');

// 警告
$ray->warning('Potential issue');

// 錯誤
$ray->error('An error occurred');

// 除錯
$ray->debug('Debug information');

// 通知
$ray->notice('Notice message');
?>
```

---

## XOOPS 專項除錯

### 模組除錯

```php
<?php
// modules/mymodule/index.php
require_once '../../mainfile.php';
require_once XOOPS_ROOT_PATH . '/vendor/autoload.php';

$ray = ray();

// 記錄模組初始化
$ray->group('Module Initialization');
    $ray->info('Module: ' . XOOPS_MODULE_NAME);

    // 檢查模組是否啟用
    if (is_object($xoopsModule)) {
        $ray->success('Module loaded');
        $ray->dump($xoopsModule->getValues());
    }

    // 檢查使用者權限
    if (xoops_isUser()) {
        $ray->info('User: ' . $xoopsUser->getVar('uname'));
    } else {
        $ray->warning('Anonymous user');
    }
$ray->groupEnd();

// 取得模組設定
$config_handler = xoops_getHandler('config');
$module = xoops_getHandler('module')->getByDirname(XOOPS_MODULE_NAME);
$settings = $config_handler->getConfigsByCat(0, $module->mid());

$ray->label('Module Settings')->dump($settings);
?>
```

### 樣板除錯

```php
<?php
// 在樣板或 PHP 程式碼中
$ray = ray();

// 記錄分配的變數
$tpl = new XoopsTpl();
$ray->label('Template Variables')->dump($tpl->get_template_vars());

// 記錄特定變數
$ray->label('User Variable')->dump($tpl->get_template_vars('user'));

// 記錄 Smarty 引擎狀態
$ray->label('Smarty Config')->dump([
    'compile_dir' => $tpl->getCompileDir(),
    'cache_dir' => $tpl->getCacheDir(),
    'debugging' => $tpl->debugging
]);
?>
```

### 資料庫除錯

```php
<?php
$ray = ray();

// 記錄資料庫操作
$ray->group('Database Operations');

// 計數查詢
$ray->info('Database Prefix: ' . XOOPS_DB_PREFIX);

// 列出表
$result = $GLOBALS['xoopsDB']->query("SHOW TABLES");
$tables = [];
while ($row = $result->fetch_row()) {
    $tables[] = $row[0];
}
$ray->label('Tables')->dump($tables);

// 檢查連接
if ($GLOBALS['xoopsDB']) {
    $ray->success('Database connected');
} else {
    $ray->error('Database connection failed');
}

$ray->groupEnd();
?>
```

---

## 效能監控

### 查詢效能

```php
<?php
$ray = ray();

// 衡量查詢時間
$ray->group('Query Performance');

$queries = [
    "SELECT COUNT(*) FROM xoops_users",
    "SELECT * FROM xoops_articles LIMIT 1000",
    "SELECT a.*, u.uname FROM xoops_articles a JOIN xoops_users u"
];

foreach ($queries as $query) {
    $start = microtime(true);
    $result = $GLOBALS['xoopsDB']->query($query);
    $time = (microtime(true) - $start) * 1000;  // ms

    $ray->label(substr($query, 0, 40) . '...')->info("${time}ms");
}

$ray->groupEnd();
?>
```

### 請求效能

```php
<?php
$ray = ray();

// 衡量總請求時間
$ray->group('Request Metrics');

// 記憶體使用
$memory = memory_get_usage() / 1024 / 1024;
$peak = memory_get_peak_usage() / 1024 / 1024;
$ray->info("Memory: {$memory}MB / Peak: {$peak}MB");

// 檢查執行時間
if (function_exists('microtime')) {
    $elapsed = isset($_SERVER['REQUEST_TIME_FLOAT'])
        ? microtime(true) - $_SERVER['REQUEST_TIME_FLOAT']
        : 0;
    $ray->info("Execution time: {$elapsed}s");
}

// 包含檔案計數
if (function_exists('get_included_files')) {
    $files = count(get_included_files());
    $ray->info("Files included: $files");
}

$ray->groupEnd();
?>
```

---

## 最佳實踐

1. **標籤您的日誌** - 使用 ray.label()
2. **分組相關日誌** - 使用 ray.group()
3. **使用適當的等級** - info、warning、error
4. **生產前清除** - 移除 ray() 呼叫
5. **衡量效能** - 使用 ray.measure()

---

## 相關文件

- 啟用除錯模式
- 資料庫除錯
- 效能常見問題解答
- 故障排除指南

---

#xoops #debugging #ray #profiling #monitoring
