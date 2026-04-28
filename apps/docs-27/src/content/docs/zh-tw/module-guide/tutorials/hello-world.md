---
title: "Hello World 模塊"
description: "分步教程用於創建您的第一個 XOOPS 模塊"
---

# Hello World 模塊教程

本教程指導您創建第一個 XOOPS 模塊。完成後，您將擁有一個在前端和管理區域都顯示"Hello World"的工作模塊。

## 先決條件

- 已安裝並運行 XOOPS 2.5.x
- PHP 8.0 或更高版本
- 基本 PHP 知識
- 文本編輯器或 IDE（推薦使用 PhpStorm）

## 步驟 1：創建目錄結構

在 `/modules/helloworld/` 中創建以下目錄結構：

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## 步驟 2：創建模塊定義

創建 `xoops_version.php`：

```php
<?php
/**
 * Hello World 模塊 - 模塊定義
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$modversion = [];

// 基本模塊信息
$modversion['name']        = _MI_HELLOWORLD_NAME;
$modversion['version']     = 1.00;
$modversion['description'] = _MI_HELLOWORLD_DESC;
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'XOOPS Community';
$modversion['help']        = 'page=help';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['license_url'] = 'https://www.gnu.org/licenses/gpl-2.0.html';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = 'helloworld';

// 模塊狀態
$modversion['release_date']        = '2025/01/28';
$modversion['module_website_url']  = 'https://xoops.org/';
$modversion['module_website_name'] = 'XOOPS';
$modversion['min_php']             = '8.0';
$modversion['min_xoops']           = '2.5.11';

// 管理配置
$modversion['hasAdmin']    = 1;
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';
$modversion['system_menu'] = 1;

// 主菜單
$modversion['hasMain'] = 1;

// 模板
$modversion['templates'][] = [
    'file'        => 'helloworld_index.tpl',
    'description' => _MI_HELLOWORLD_INDEX_TPL,
];

// 管理模板
$modversion['templates'][] = [
    'file'        => 'admin/helloworld_admin_index.tpl',
    'description' => _MI_HELLOWORLD_ADMIN_INDEX_TPL,
];

// 此簡單模塊不需要數據庫表
$modversion['tables'] = [];
```

## 步驟 3：創建語言文件

### modinfo.php (模塊信息)

創建 `language/english/modinfo.php`：

```php
<?php
/**
 * 模塊信息語言常量
 */

// 模塊信息
define('_MI_HELLOWORLD_NAME', 'Hello World');
define('_MI_HELLOWORLD_DESC', 'A simple Hello World module for learning XOOPS development.');

// 模板描述
define('_MI_HELLOWORLD_INDEX_TPL', 'Main index page template');
define('_MI_HELLOWORLD_ADMIN_INDEX_TPL', 'Admin index page template');
```

### main.php (前端語言)

創建 `language/english/main.php`：

```php
<?php
/**
 * 前端語言常量
 */

define('_MD_HELLOWORLD_TITLE', 'Hello World');
define('_MD_HELLOWORLD_WELCOME', 'Welcome to the Hello World Module!');
define('_MD_HELLOWORLD_MESSAGE', 'This is your first XOOPS module. Congratulations!');
define('_MD_HELLOWORLD_CURRENT_TIME', 'Current server time:');
define('_MD_HELLOWORLD_VISITOR_COUNT', 'You are visitor number:');
```

### admin.php (管理語言)

創建 `language/english/admin.php`：

```php
<?php
/**
 * 管理語言常量
 */

define('_AM_HELLOWORLD_INDEX', 'Dashboard');
define('_AM_HELLOWORLD_ADMIN_TITLE', 'Hello World Administration');
define('_AM_HELLOWORLD_ADMIN_WELCOME', 'Welcome to the Hello World Module Administration');
define('_AM_HELLOWORLD_MODULE_INFO', 'Module Information');
define('_AM_HELLOWORLD_VERSION', 'Version:');
define('_AM_HELLOWORLD_AUTHOR', 'Author:');
```

## 步驟 4：創建前端索引

在模塊根目錄創建 `index.php`：

```php
<?php
/**
 * Hello World 模塊 - 前端索引
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';

// 加載語言文件
xoops_loadLanguage('main', 'helloworld');

// 獲取模塊幫助程序
$helper = \Xmf\Module\Helper::getHelper('helloworld');

// 設置頁面模板
$GLOBALS['xoopsOption']['template_main'] = 'helloworld_index.tpl';

// 包含 XOOPS 標題
require XOOPS_ROOT_PATH . '/header.php';

// 獲取模塊配置
/** @var \XoopsModule $xoopsModule */
$xoopsModule = $GLOBALS['xoopsModule'];

// 生成頁面內容
$pageTitle = _MD_HELLOWORLD_TITLE;
$welcomeMessage = _MD_HELLOWORLD_WELCOME;
$contentMessage = _MD_HELLOWORLD_MESSAGE;
$currentTime = date('Y-m-d H:i:s');

// 簡單訪問計數器（使用會話）
if (!isset($_SESSION['helloworld_visits'])) {
    $_SESSION['helloworld_visits'] = 0;
}
$_SESSION['helloworld_visits']++;
$visitorCount = $_SESSION['helloworld_visits'];

// 將變量分配給模板
$xoopsTpl->assign([
    'page_title'      => $pageTitle,
    'welcome_message' => $welcomeMessage,
    'content_message' => $contentMessage,
    'current_time'    => $currentTime,
    'visitor_count'   => $visitorCount,
    'time_label'      => _MD_HELLOWORLD_CURRENT_TIME,
    'visitor_label'   => _MD_HELLOWORLD_VISITOR_COUNT,
]);

// 包含 XOOPS 頁腳
require XOOPS_ROOT_PATH . '/footer.php';
```

## 步驟 5：創建前端模板

創建 `templates/helloworld_index.tpl`：

```smarty
<{* Hello World 模塊 - 索引模板 *}>

<div class="helloworld-container">
    <h1><{$page_title}></h1>

    <div class="helloworld-welcome">
        <p class="lead"><{$welcome_message}></p>
    </div>

    <div class="helloworld-content">
        <p><{$content_message}></p>
    </div>

    <div class="helloworld-info">
        <ul>
            <li><strong><{$time_label}></strong> <{$current_time}></li>
            <li><strong><{$visitor_label}></strong> <{$visitor_count}></li>
        </ul>
    </div>
</div>

<style>
.helloworld-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.helloworld-welcome {
    background-color: #f8f9fa;
    border-left: 4px solid #007bff;
    padding: 15px;
    margin: 20px 0;
}

.helloworld-content {
    margin: 20px 0;
}

.helloworld-info {
    background-color: #e9ecef;
    padding: 15px;
    border-radius: 5px;
}

.helloworld-info ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.helloworld-info li {
    padding: 5px 0;
}
</style>
```

## 步驟 6：創建管理文件

### 管理標題

創建 `admin/admin_header.php`：

```php
<?php
/**
 * 管理標題
 */

declare(strict_types=1);

require_once dirname(__DIR__, 3) . '/include/cp_header.php';

// 加載管理語言文件
xoops_loadLanguage('admin', 'helloworld');
xoops_loadLanguage('modinfo', 'helloworld');

// 獲取模塊幫助程序
$helper = \Xmf\Module\Helper::getHelper('helloworld');
$adminObject = \Xmf\Module\Admin::getInstance();

// 模塊目錄
$moduleDirname = $helper->getDirname();
$modulePath = XOOPS_ROOT_PATH . '/modules/' . $moduleDirname;
$moduleUrl = XOOPS_URL . '/modules/' . $moduleDirname;
```

### 管理頁腳

創建 `admin/admin_footer.php`：

```php
<?php
/**
 * 管理頁腳
 */

// 顯示管理頁腳
$adminObject->displayFooter();

require_once dirname(__DIR__, 3) . '/include/cp_footer.php';
```

### 管理菜單

創建 `admin/menu.php`：

```php
<?php
/**
 * 管理菜單配置
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$adminmenu = [];

// 儀表板
$adminmenu[] = [
    'title' => _AM_HELLOWORLD_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => 'home.png',
];
```

### 管理索引頁面

創建 `admin/index.php`：

```php
<?php
/**
 * 管理索引頁面
 */

declare(strict_types=1);

require_once __DIR__ . '/admin_header.php';

// 顯示管理導航
$adminObject->displayNavigation('index.php');

// 創建管理信息框
$adminObject->addInfoBox(_AM_HELLOWORLD_MODULE_INFO);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_VERSION, $helper->getModule()->getVar('version'))
);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_AUTHOR, $helper->getModule()->getVar('author'))
);

// 顯示信息框
$adminObject->displayInfoBox(_AM_HELLOWORLD_MODULE_INFO);

// 顯示管理頁腳
require_once __DIR__ . '/admin_footer.php';
```

## 步驟 7：創建管理模板

創建 `templates/admin/helloworld_admin_index.tpl`：

```smarty
<{* Hello World 模塊 - 管理索引模板 *}>

<div class="helloworld-admin">
    <h2><{$admin_title}></h2>
    <p><{$admin_welcome}></p>
</div>
```

## 步驟 8：創建模塊徽標

創建或複製 PNG 圖像（推薦大小：92x92 像素）至：
`assets/images/logo.png`

您可以使用任何圖像編輯器創建簡單徽標，或使用來自 placeholder.com 之類網站的佔位符。

## 步驟 9：安裝模塊

1. 以管理員身份登錄您的 XOOPS 網站
2. 轉到**系統管理** > **模塊**
3. 在可用模塊列表中找到"Hello World"
4. 點擊**安裝**按鈕
5. 確認安裝

## 步驟 10：測試您的模塊

### 前端測試

1. 導航到您的 XOOPS 網站
2. 點擊主菜單中的"Hello World"
3. 您應該看到歡迎消息和當前時間

### 管理測試

1. 轉到管理區域
2. 點擊管理菜單中的"Hello World"
3. 您應該看到管理儀表板

## 故障排除

### 模塊未出現在安裝列表中

- 檢查文件權限（目錄 755，文件 644）
- 驗證 `xoops_version.php` 沒有語法錯誤
- 清除 XOOPS 緩存

### 模板未加載

- 確保模板文件在正確的目錄中
- 檢查模板文件名與 `xoops_version.php` 中的匹配
- 驗證 Smarty 語法正確

### 語言字符串未顯示

- 檢查語言文件路徑
- 確保定義了語言常量
- 驗證正確的語言文件夾存在

## 後續步驟

現在您已有一個工作模塊，請繼續學習：

- Building-a-CRUD-Module - 添加數據庫功能
- ../Patterns/MVC-Pattern - 正確組織代碼
- ../Best-Practices/Testing - 添加 PHPUnit 測試

## 完整文件參考

您完成的模塊應該具有這些文件：

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## 總結

恭喜！您已創建了第一個 XOOPS 模塊。涵蓋的關鍵概念：

1. **模塊結構** - 標準 XOOPS 模塊目錄佈局
2. **xoops_version.php** - 模塊定義和配置
3. **語言文件** - 國際化支持
4. **模板** - Smarty 模板集成
5. **管理界面** - 基本管理面板

另見：../Module-Development | Building-a-CRUD-Module | ../Patterns/MVC-Pattern
