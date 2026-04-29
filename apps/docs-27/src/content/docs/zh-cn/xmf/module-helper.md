---
title: “XMF模区块助手”
description: “使用XMF\Module\Helper类和相关帮助程序简化模区块操作”
---

`XMF\Module\Helper`类提供了一种访问模区块-related信息、配置、处理程序等的简单方法。使用模区块助手可以简化代码并减少样板文件。

## 概述

模区块助手提供：

- 简化的配置访问
- 模区块对象检索
- 处理程序实例化
- 路径和URL分辨率
- 权限和会话助手
- 缓存管理

## 获取模区块助手

### 基本用法

```php
use Xmf\Module\Helper;

// Get helper for a specific module
$helper = Helper::getHelper('mymodule');

// The helper is automatically associated with the module directory
```

### 来自当前模区块

如果不指定模区块名称，它将使用当前活动模区块：

```php
$helper = Helper::getHelper('');
// or
$helper = Helper::getHelper(basename(__DIR__));
```

## 配置访问

### 传统XOOPS方式

以旧方式获取模区块配置很冗长：

```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```

### XMF方式

使用模区块助手，相同的任务变得简单：

```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```

## 辅助方法

### getModule()

返回助手模区块的 XOOPSModule 对象。

```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```

### getConfig($name, $default)

返回模区块配置值或所有配置。

```php
// Get single config with default
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Get all configs as array
$allConfigs = $helper->getConfig('');
```

### getHandler($name)

返回模区块的对象处理程序。

```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Use the handler
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```

### loadLanguage($name)

加载模区块的语言文件。

```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```

### isCurrentModule()

检查该模区块是否是当前活动的模区块。

```php
if ($helper->isCurrentModule()) {
    // We're in the module's own pages
} else {
    // Called from another module or location
}
```

### isUserAdmin()

检查当前用户是否具有该模区块的管理员权限。

```php
if ($helper->isUserAdmin()) {
    // Show admin options
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```

## 路径和 URL 方法

### 网址($url)

返回模区块-relative路径的绝对URL。

```php
$logoUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Returns: https://example.com/modules/mymodule/admin/index.php
```

### 路径($path)

返回模区块-relative路径的绝对文件系统路径。

```php
$templatePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```

### uploadUrl($url)

返回模区块上传文件的绝对URL。

```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```

### 上传路径($path)

返回模区块上传文件的绝对文件系统路径。

```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```

### 重定向（$url、$time、$message）

在模区块内重定向到模区块-relativeURL。

```php
$helper->redirect('index.php', 3, 'Item saved successfully');
$helper->redirect('view.php?id=' . $newId, 2, 'Created!');
```

## 调试支持

### setDebug($bool)

启用或禁用帮助程序的调试模式。

```php
$helper->setDebug(true);  // Enable
$helper->setDebug(false); // Disable
$helper->setDebug();      // Enable (default is true)
```

### addLog($log)

将消息添加到模区块日志。

```php
$helper->addLog('Processing item ID: ' . $id);
$helper->addLog('Cache miss, loading from database');
```

## 相关辅助类

XMF 提供扩展 `XMF\Module\Helper\AbstractHelper` 的专业帮助程序：

### 权限助手

有关详细文档，请参阅../Recipes/Permission-Helper。

```php
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');

// Check permission
if ($permHelper->checkPermission('view', $itemId)) {
    // User has permission
}

// Check and redirect if no permission
$permHelper->checkPermissionRedirect('edit', $itemId, 'index.php', 3, 'Access denied');
```

### 会话助手

具有自动密钥前缀的模区块-aware会话存储。

```php
$session = new \Xmf\Module\Helper\Session('mymodule');

// Store value
$session->set('last_viewed', $itemId);

// Retrieve value
$lastViewed = $session->get('last_viewed', 0);

// Delete value
$session->del('last_viewed');

// Clear all module session data
$session->destroy();
```

### 缓存助手

模区块-aware具有自动键前缀的缓存。

```php
$cache = new \Xmf\Module\Helper\Cache('mymodule');

// Write to cache (TTL in seconds)
$cache->write('item_' . $id, $itemData, 3600);

// Read from cache
$data = $cache->read('item_' . $id, null);

// Delete from cache
$cache->delete('item_' . $id);

// Read with automatic regeneration
$data = $cache->cacheRead(
    'expensive_data',
    function() {
        // This runs only if cache miss
        return computeExpensiveData();
    },
    3600
);
```

## 完整示例

这是使用模区块助手的综合示例：

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;
use Xmf\Module\Helper\Session;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// Initialize helpers
$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');
$session = new Session('mymodule');

// Load language
$helper->loadLanguage('main');

// Get configuration
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableComments = $helper->getConfig('enable_comments', true);

// Handle request
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

require_once XOOPS_ROOT_PATH . '/header.php';

switch ($op) {
    case 'view':
        // Check permission
        if (!$permHelper->checkPermission('view', $id)) {
            redirect_header($helper->url('index.php'), 3, _NOPERM);
        }

        // Track in session
        $session->set('last_viewed', $id);

        // Get handler and item
        $itemHandler = $helper->getHandler('items');
        $item = $itemHandler->get($id);

        if (!$item) {
            redirect_header($helper->url('index.php'), 3, 'Item not found');
        }

        // Display item
        $xoopsTpl->assign('item', $item->toArray());
        break;

    case 'list':
    default:
        $itemHandler = $helper->getHandler('items');

        $criteria = new CriteriaCompo();
        $criteria->setLimit($itemsPerPage);
        $criteria->setSort('created');
        $criteria->setOrder('DESC');

        $items = $itemHandler->getObjects($criteria);
        $xoopsTpl->assign('items', $items);

        // Show last viewed if exists
        $lastViewed = $session->get('last_viewed', 0);
        if ($lastViewed > 0) {
            $xoopsTpl->assign('last_viewed', $lastViewed);
        }
        break;
}

// Admin link if authorized
if ($helper->isUserAdmin()) {
    $xoopsTpl->assign('admin_url', $helper->url('admin/index.php'));
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

## AbstractHelper 基类

所有 XMF 帮助程序类都扩展了 `XMF\Module\Helper\AbstractHelper`，它提供：

### 构造函数

```php
public function __construct($dirname)
```

使用模区块目录名称实例化。如果为空，则使用当前模区块。

### dirname()

返回与助手关联的模区块目录名称。

```php
$dirname = $helper->dirname();
```

### init()

模区块加载后由构造函数调用。重写自定义帮助程序的初始化逻辑。

## 创建自定义助手

您可以扩展模区块-specific功能的帮助程序：

```php
<?php
// mymodule/class/Helper.php
namespace XoopsModules\Mymodule;

class Helper extends \Xmf\Module\Helper\GenericHelper
{
    public function init()
    {
        // Custom initialization
    }

    public function getItemUrl($id)
    {
        return $this->url('item.php?id=' . $id);
    }

    public function getUploadDirectory()
    {
        $path = $this->uploadPath('');
        if (!is_dir($path)) {
            mkdir($path, 0755, true);
        }
        return $path;
    }
}
```

## 另请参阅

- 获取-Started-with-XMF - 基本XMF用法
- XMF-Request - 请求处理
- ../Recipes/Permission-Helper - 权限管理
- ../Recipes/Module-Admin-Pages - 管理界面创建

---

#xmf#模区块-helper#configuration #handlers #session #cache