---
title: "模組開發"
description: "使用現代 PHP 實踐的 XOOPS 模組開發綜合指南"
---

本節提供使用現代 PHP 實踐、設計模式和最佳實踐開發 XOOPS 模組的綜合文件。

## 概述

XOOPS 模組開發在多年來已經進化顯著。現代模組利用：

- **MVC 架構** - 清晰的關注點分離
- **PHP 8.x 功能** - 型別宣告、屬性、具名引數
- **設計模式** - Repository、DTO、Service Layer 模式
- **測試** - PHPUnit 與現代測試實踐
- **XMF 框架** - XOOPS 模組框架工具

## 文件結構

### 教學

為從頭開始建立 XOOPS 模組的逐步指南。

- Tutorials/Hello-World-Module - 你的第一個 XOOPS 模組
- Tutorials/Building-a-CRUD-Module - 完整的建立、讀取、更新、刪除功能

### 設計模式

現代 XOOPS 模組開發中使用的架構模式。

- Patterns/MVC-Pattern - 模型-檢視-控制器架構
- Patterns/Repository-Pattern - 資料存取抽象
- Patterns/DTO-Pattern - 資料傳輸物件以實現清潔資料流

### 最佳實踐

編寫可維護、高品質程式碼的指南。

- Best-Practices/Clean-Code - XOOPS 的清潔程式碼原則
- Best-Practices/Code-Smells - 常見反模式及其修復方法
- Best-Practices/Testing - PHPUnit 測試策略

### 範例

真實世界的模組分析和實現範例。

- Publisher-Module-Analysis - Publisher 模組的深入探討

## 模組目錄結構

組織良好的 XOOPS 模組遵循此目錄結構：

```
/modules/mymodule/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /css/
        /js/
        /images/
    /blocks/
        myblock.php
    /class/
        /Controller/
        /Entity/
        /Repository/
        /Service/
    /include/
        common.php
        install.php
        uninstall.php
        update.php
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /preloads/
        core.php
    /sql/
        mysql.sql
    /templates/
        /admin/
        /blocks/
        main_index.tpl
    /test/
        bootstrap.php
        /Unit/
        /Integration/
    index.php
    xoops_version.php
```

## 關鍵檔案說明

### xoops_version.php

告訴 XOOPS 關於你的模組的模組定義檔案：

```php
<?php
$modversion = [];

// 基本資訊
$modversion['name']        = 'My Module';
$modversion['version']     = 1.00;
$modversion['description'] = 'A sample XOOPS module';
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'Your Team';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['dirname']     = 'mymodule';
$modversion['image']       = 'assets/images/logo.png';

// 模組旗標
$modversion['hasMain']     = 1;  // 有前端頁面
$modversion['hasAdmin']    = 1;  // 有管理員部分
$modversion['system_menu'] = 1;  // 在管理員功能表中顯示

// 管理員組態
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';

// 資料庫
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
];

// 範本
$modversion['templates'][] = [
    'file'        => 'mymodule_index.tpl',
    'description' => 'Index page template',
];

// 區塊
$modversion['blocks'][] = [
    'file'        => 'myblock.php',
    'name'        => 'My Block',
    'description' => 'Displays recent items',
    'show_func'   => 'mymodule_block_show',
    'edit_func'   => 'mymodule_block_edit',
    'template'    => 'mymodule_block.tpl',
];

// 模組偏好設定
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];
```

### 通用包含檔案

為你的模組建立一個通用引導檔案：

```php
<?php
// include/common.php

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

// 模組常數
define('MYMODULE_DIRNAME', 'mymodule');
define('MYMODULE_PATH', XOOPS_ROOT_PATH . '/modules/' . MYMODULE_DIRNAME);
define('MYMODULE_URL', XOOPS_URL . '/modules/' . MYMODULE_DIRNAME);

// 自動載入類別
require_once MYMODULE_PATH . '/class/autoload.php';
```

## PHP 版本要求

現代 XOOPS 模組應該以 PHP 8.0 或更高版本為目標，以利用：

- **建構子屬性提升**
- **具名引數**
- **聯合型別**
- **Match 運算式**
- **屬性**
- **Nullsafe 運算子**

## 開始使用

1. 從 Tutorials/Hello-World-Module 教學開始
2. 進行到 Tutorials/Building-a-CRUD-Module
3. 研究 Patterns/MVC-Pattern 以獲得架構指導
4. 在整個過程中應用 Best-Practices/Clean-Code 實踐
5. 從一開始就實施 Best-Practices/Testing

## 相關資源

- ../05-XMF-Framework/XMF-Framework - XOOPS 模組框架工具
- Database-Operations - 使用 XOOPS 資料庫
- ../04-API-Reference/Template/Template-System - XOOPS 中的 Smarty 範本化
- ../02-Core-Concepts/Security/Security-Best-Practices - 保護你的模組安全

## 版本歷史

| 版本 | 日期 | 變更 |
|---------|------|---------|
| 1.0 | 2025-01-28 | 初始文件 |
