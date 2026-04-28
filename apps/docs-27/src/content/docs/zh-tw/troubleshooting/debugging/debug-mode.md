---
title: "啟用除錯模式"
description: "如何啟用和使用 XOOPS 除錯模式進行故障排除"
---

> XOOPS 除錯功能和工具的綜合指南。

---

## XOOPS 除錯等級

### 在 mainfile.php 中啟用

```php
<?php
// 除錯等級設置
define('XOOPS_DEBUG_LEVEL', 2);

// 等級 0：除錯關閉 (生產環境)
// 等級 1：僅 PHP 除錯
// 等級 2：PHP + SQL 查詢
// 等級 3：PHP + SQL + Smarty 樣板
```

### 等級詳細資訊

| 等級 | PHP 錯誤 | SQL 查詢 | 樣板變數 | 推薦用於 |
|-------|------------|-------------|---------------|-----------------|
| 0 | 隱藏 | 否 | 否 | 生產環境 |
| 1 | 顯示 | 否 | 否 | 快速檢查 |
| 2 | 顯示 | 記錄 | 否 | 開發 |
| 3 | 顯示 | 記錄 | 顯示 | 深度除錯 |

---

## PHP 錯誤顯示

### 開發設置

```php
// 添加到 mainfile.php 以進行開發
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
ini_set('log_errors', '1');
ini_set('error_log', XOOPS_VAR_PATH . '/logs/php_errors.log');
```

### 生產設置

```php
// 生產環境的安全設置
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', XOOPS_VAR_PATH . '/logs/php_errors.log');
```

---

## SQL 查詢除錯

### 在除錯模式中檢視查詢

將 `XOOPS_DEBUG_LEVEL` 設置為 2 或 3 時，SQL 查詢會出現在頁面底部。

### 手動查詢記錄

```php
// 記錄特定查詢
$sql = "SELECT * FROM " . $GLOBALS['xoopsDB']->prefix('mymodule_items');

// 執行前
error_log("SQL Query: " . $sql);

$result = $GLOBALS['xoopsDB']->query($sql);

// 記錄查詢時間
$start = microtime(true);
$result = $GLOBALS['xoopsDB']->query($sql);
$time = microtime(true) - $start;
error_log("Query took: " . number_format($time * 1000, 2) . "ms");
```

---

## Smarty 樣板除錯

### 啟用 Smarty 除錯控制台

```php
// 在您的模組或樣板中
{debug}

// 或在 PHP 中
$GLOBALS['xoopsTpl']->debugging = true;
$GLOBALS['xoopsTpl']->debugging_ctrl = 'URL';  // 添加 SMARTY_DEBUG 到 URL
```

### 在 PHP 中檢視分配的變數

```php
// 在顯示樣板前
echo "<pre>";
print_r($GLOBALS['xoopsTpl']->getTemplateVars());
echo "</pre>";
```

---

## Ray 偵錯工具整合

### 安裝

```bash
composer require spatie/ray --dev
```

### 使用範例

```php
// 基本輸出
ray('Hello from XOOPS');

// 變數檢查
ray($item)->label('Item Object');

// 展開檢視
ray($complexArray)->expand();

// 衡量執行時間
ray()->measure();
// ... 要衡量的程式碼 ...
ray()->measure();

// 顏色編碼
ray('Error occurred')->red();
ray('Success!')->green();
```

---

## 相關文件

- 白色死亡螢幕
- 使用 Ray 偵錯工具
- 安全最佳實踐

---

#xoops #debugging #troubleshooting #development #logging
