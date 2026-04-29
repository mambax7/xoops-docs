---
title: “模区块管理页面”
description: “使用XMF创建标准化和转发-compatible模区块管理页面”
---

`XMF\Module\Admin`类提供了创建模区块管理接口的一致方法。对管理页面使用 XMF 可确保与未来的 XOOPS 版本向前兼容，同时保持统一的用户体验。

## 概述

XOOPS 框架中的 ModuleAdmin 类使管理变得更加容易，但其 API 已在各个版本中不断发展。 `XMF\Module\Admin`包装器：

- 提供稳定的API，可跨XOOPS版本运行
- 自动处理API版本之间的差异
- 确保您的管理代码转发-compatible
- 为常见任务提供方便的静态方法

## 开始使用

### 创建管理实例

```php
$admin = \Xmf\Module\Admin::getInstance();
```

这将返回 `XMF\Module\Admin` 实例或本机系统类（如果已经兼容）。

## 图标管理

### 图标位置问题

图标在 XOOPS 版本之间移动，导致维护麻烦。 XMF用实用方法解决了这个问题。

### 寻找图标

**旧方法（版本-dependent）：**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```

**XMF方式：**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```

`iconUrl()`方法返回完整的URL，因此您无需担心路径构造。

### 图标大小

```php
// 16x16 icons
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// 32x32 icons (default)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Just the path (no filename)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```

### 菜单图标

对于管理菜单.php 文件：

**旧方法：**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon32 = $module->getInfo('icons32');

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => '../../' . $pathIcon32 . '/home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => '../../' . $pathIcon32 . '/about.png'
];
```

**XMF方式：**
```php
// Get path to icons
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## 标准管理页面

### 索引页

**旧格式：**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```

**XMF格式：**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```

### 关于页面

**旧格式：**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```

**XMF格式：**
```php
$aboutAdmin = \Xmf\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\Xmf\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```

> **注意：** 在未来的XOOPS版本中，PayPal信息在XOOPS_version.php中设置。 `setPaypal()` 调用可确保与当前版本的兼容性，同时对较新版本没有影响。

## 导航

### 显示导航菜单

```php
$admin = \Xmf\Module\Admin::getInstance();

// Display navigation for current page
$admin->displayNavigation('items.php');

// Or get HTML string
$navHtml = $admin->renderNavigation('items.php');
```

## 信息框

### 创建信息框

```php
$admin = \Xmf\Module\Admin::getInstance();

// Add an info box
$admin->addInfoBox('Module Statistics');

// Add lines to the info box
$admin->addInfoBoxLine('Total Items: ' . $itemCount, 'default', 'green');
$admin->addInfoBoxLine('Active Users: ' . $userCount, 'default', 'blue');

// Display the info box
$admin->displayInfoBox();
```

## 配置框

配置框显示系统要求和状态检查。

### 基本配置行

```php
$admin = \Xmf\Module\Admin::getInstance();

// Add a simple message
$admin->addConfigBoxLine('Module is properly configured', 'default');

// Check if directory exists
$admin->addConfigBoxLine('/uploads/mymodule', 'folder');

// Check directory with permissions
$admin->addConfigBoxLine(['/uploads/mymodule', '0755'], 'chmod');

// Check if module is installed
$admin->addConfigBoxLine('xlanguage', 'module');

// Check module with warning instead of error if missing
$admin->addConfigBoxLine(['xlanguage', 'warning'], 'module');
```

### 便捷方法

```php
$admin = \Xmf\Module\Admin::getInstance();

// Add error message
$admin->addConfigError('Upload directory is not writable');

// Add success/accept message
$admin->addConfigAccept('Database tables verified');

// Add warning message
$admin->addConfigWarning('Cache directory should be cleared');

// Check module version
$admin->addConfigModuleVersion('xlanguage', '1.0');
```

### 配置框类型

|类型 |价值|行为 |
|------|--------|----------|
| `default` |消息字符串 |直接显示消息 |
| `folder` |目录路径 |如果存在则显示接受，如果不存在则显示错误 |
| `chmod` | `[path, permission]`|检查目录是否存在且具有权限 |
| `module` |模区块名称|如果已安装则接受，如果未安装则出错 |
| `module` | `[name, 'warning']` |如果已安装则接受，如果未安装则警告 |

## 项目按钮

将操作按钮添加到管理页面：

```php
$admin = \Xmf\Module\Admin::getInstance();

// Add buttons
$admin->addItemButton('Add New Item', 'item.php?op=new', 'add');
$admin->addItemButton('Import Items', 'import.php', 'import');

// Display buttons (left aligned by default)
$admin->displayButton('left');

// Or get HTML
$buttonHtml = $admin->renderButton('right', ' | ');
```

## 完整的管理页面示例

###索引。php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Display navigation
$adminObject->displayNavigation(basename(__FILE__));

// Add info box with statistics
$adminObject->addInfoBox(_MI_MYMODULE_DASHBOARD);

$itemHandler = $helper->getHandler('items');
$itemCount = $itemHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_ITEMS, $itemCount));

$categoryHandler = $helper->getHandler('categories');
$categoryCount = $categoryHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_CATEGORIES, $categoryCount));

// Check configuration
$uploadDir = XOOPS_UPLOAD_PATH . '/mymodule';
$adminObject->addConfigBoxLine($uploadDir, 'folder');
$adminObject->addConfigBoxLine([$uploadDir, '0755'], 'chmod');

// Check optional modules
$adminObject->addConfigBoxLine(['xlanguage', 'warning'], 'module');

// Display the index page
$adminObject->displayIndex();

require_once __DIR__ . '/admin_footer.php';
```

### 项目。php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Get operation
$op = \Xmf\Request::getCmd('op', 'list');

switch ($op) {
    case 'list':
    default:
        $adminObject->displayNavigation(basename(__FILE__));

        // Add action buttons
        $adminObject->addItemButton(_MI_MYMODULE_ADD_ITEM, 'items.php?op=new', 'add');
        $adminObject->displayButton('left');

        // List items
        $itemHandler = $helper->getHandler('items');
        $criteria = new CriteriaCompo();
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit(20);

        $items = $itemHandler->getObjects($criteria);

        // Display table
        echo '<table class="outer">';
        echo '<tr><th>' . _MI_MYMODULE_TITLE . '</th><th>' . _MI_MYMODULE_ACTIONS . '</th></tr>';

        foreach ($items as $item) {
            $editUrl = 'items.php?op=edit&amp;id=' . $item->getVar('item_id');
            $deleteUrl = 'items.php?op=delete&amp;id=' . $item->getVar('item_id');

            echo '<tr>';
            echo '<td>' . $item->getVar('title') . '</td>';
            echo '<td>';
            echo '<a href="' . $editUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('edit.png', 16) . '" alt="Edit"></a> ';
            echo '<a href="' . $deleteUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('delete.png', 16) . '" alt="Delete"></a>';
            echo '</td>';
            echo '</tr>';
        }

        echo '</table>';
        break;

    case 'new':
    case 'edit':
        // Form handling code...
        break;
}

require_once __DIR__ . '/admin_footer.php';
```

### 关于.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

$adminObject->displayNavigation(basename(__FILE__));

// Set PayPal ID for donations (optional)
\Xmf\Module\Admin::setPaypal('YOUR_PAYPAL_ID');

// Display about page
// Pass false to hide XOOPS logo, true to show it
$adminObject->displayAbout(false);

require_once __DIR__ . '/admin_footer.php';
```

### 菜单。php

```php
<?php
defined('XOOPS_ROOT_PATH') || exit('XOOPS root path not defined');

// Get icon path using XMF
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];

// Dashboard
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];

// Items
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ITEMS,
    'link'  => 'admin/items.php',
    'icon'  => $pathIcon32 . 'content.png'
];

// Categories
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_CATEGORIES,
    'link'  => 'admin/categories.php',
    'icon'  => $pathIcon32 . 'category.png'
];

// Permissions
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_PERMISSIONS,
    'link'  => 'admin/permissions.php',
    'icon'  => $pathIcon32 . 'permissions.png'
];

// About
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## API 参考

### 静态方法

|方法|描述 |
|--------|-------------|
| `getInstance()` |获取管理实例 |
| `iconUrl($name, $size)` |获取图标URL（大小：16 或 32）|
| `menuIconPath($image)` |获取菜单的图标路径。php |
| `setPaypal($paypal)` |为关于页面设置 PayPal ID |

### 实例方法

|方法|描述 |
|--------|-------------|
| `displayNavigation($menu)` |显示导航菜单 |
| `renderNavigation($menu)` |返回导航 HTML |
| `addInfoBox($title)` |添加信息框 |
| `addInfoBoxLine($text, $type, $color)`|将行添加到信息框 |
| `displayInfoBox()` |显示信息框|
| `renderInfoBox()` |返回信息框HTML |
| `addConfigBoxLine($value, $type)` |添加配置检查行 |
| `addConfigError($value)` |将错误添加到配置框 |
| `addConfigAccept($value)` |添加成功到配置框|
| `addConfigWarning($value)` |添加警告到配置框 |
| `addConfigModuleVersion($moddir, $version)` |检查模区块版本 |
| `addItemButton($title, $link, $icon, $extra)` |添加操作按钮 |
| `displayButton($position, $delimiter)` |显示按钮|
| `renderButton($position, $delimiter)` |返回按钮HTML |
| `displayIndex()` |显示索引页 |
| `renderIndex()` |返回索引页HTML |
| `displayAbout($logo_XOOPS)` |显示关于页面 |
| `renderAbout($logo_XOOPS)` |返回第 HTML 页面 |

## 另请参阅- ../Basics/XMF-Module-Helper - 模区块助手类
- 权限-Helper - 权限管理
- ../XMF-Framework - 框架概述

---

#xmf #admin #module-development #navigation #icons