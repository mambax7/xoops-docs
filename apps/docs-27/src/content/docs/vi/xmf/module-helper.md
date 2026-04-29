---
title: "Trình trợ giúp mô-đun XMF"
description: 'Đơn giản hóa hoạt động của mô-đun bằng cách sử dụng Xmf\Module\Helper class và các công cụ trợ giúp liên quan'
---
`Xmf\Module\Helper` class cung cấp một cách dễ dàng để truy cập thông tin, cấu hình, trình xử lý, v.v. liên quan đến mô-đun. Việc sử dụng trình trợ giúp mô-đun sẽ đơn giản hóa mã của bạn và giảm bớt bản soạn sẵn.

## Tổng quan

Trình trợ giúp mô-đun cung cấp:

- Truy cập cấu hình đơn giản hóa
- Truy xuất đối tượng mô-đun
- Khởi tạo trình xử lý
- Đường dẫn và độ phân giải URL
- Người trợ giúp quyền và phiên
- Quản lý bộ đệm

## Nhận người trợ giúp mô-đun

### Cách sử dụng cơ bản

```php
use Xmf\Module\Helper;

// Get helper for a specific module
$helper = Helper::getHelper('mymodule');

// The helper is automatically associated with the module directory
```

### Từ mô-đun hiện tại

Nếu bạn không chỉ định tên mô-đun, nó sẽ sử dụng mô-đun đang hoạt động hiện tại:

```php
$helper = Helper::getHelper('');
// or
$helper = Helper::getHelper(basename(__DIR__));
```

## Truy cập cấu hình

### Cách XOOPS truyền thống

Bắt cấu hình mô-đun theo cách cũ là dài dòng:

```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```

### Cách XMF

Với trình trợ giúp mô-đun, nhiệm vụ tương tự trở nên đơn giản:

```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```

## Phương thức trợ giúp

### getModule()

Trả về đối tượng XoopsModule cho mô-đun của trình trợ giúp.

```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```

### getConfig($name, $default)

Trả về giá trị cấu hình mô-đun hoặc tất cả các cấu hình.

```php
// Get single config with default
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Get all configs as array
$allConfigs = $helper->getConfig('');
```

### getHandler($name)

Trả về một trình xử lý đối tượng cho mô-đun.

```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Use the handler
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```

### ngôn ngữ tải($name)

Tải tệp language cho mô-đun.

```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```

### isCurrentModule()

Kiểm tra xem mô-đun này có phải là mô-đun hiện đang hoạt động hay không.

```php
if ($helper->isCurrentModule()) {
    // We're in the module's own pages
} else {
    // Called from another module or location
}
```

### isUserAdmin()

Kiểm tra xem người dùng hiện tại có quyền admin đối với mô-đun này hay không.

```php
if ($helper->isUserAdmin()) {
    // Show admin options
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```

## Phương thức đường dẫn và URL

### url($url)

Trả về URL tuyệt đối cho đường dẫn tương đối mô-đun.

```php
$logoUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Returns: https://example.com/modules/mymodule/admin/index.php
```

đường dẫn ###($path)

Trả về đường dẫn hệ thống tệp tuyệt đối cho đường dẫn tương đối của mô-đun.

```php
$templatePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```

### Url tải lên($url)

Trả về URL tuyệt đối cho các tệp tải lên mô-đun.

```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```

### đường dẫn tải lên($path)

Trả về đường dẫn hệ thống tệp tuyệt đối cho các tệp tải lên mô-đun.

```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```

### chuyển hướng ($url, $time, $message)

Chuyển hướng trong mô-đun tới URL tương đối với mô-đun.

```php
$helper->redirect('index.php', 3, 'Item saved successfully');
$helper->redirect('view.php?id=' . $newId, 2, 'Created!');
```

## Hỗ trợ gỡ lỗi

### setDebug($bool)

Bật hoặc tắt chế độ gỡ lỗi cho người trợ giúp.

```php
$helper->setDebug(true);  // Enable
$helper->setDebug(false); // Disable
$helper->setDebug();      // Enable (default is true)
```

### addLog($log)

Thêm thông báo vào nhật ký mô-đun.

```php
$helper->addLog('Processing item ID: ' . $id);
$helper->addLog('Cache miss, loading from database');
```

## Các lớp trợ giúp liên quan

XMF cung cấp các công cụ trợ giúp chuyên dụng mở rộng `Xmf\Module\Helper\AbstractHelper`:

### Trình trợ giúp cấp phép

Xem ../Recipes/Permission-Helper để biết tài liệu chi tiết.

```php
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');

// Check permission
if ($permHelper->checkPermission('view', $itemId)) {
    // User has permission
}

// Check and redirect if no permission
$permHelper->checkPermissionRedirect('edit', $itemId, 'index.php', 3, 'Access denied');
```

### Trình trợ giúp phiên

Lưu trữ phiên nhận biết mô-đun với tiền tố khóa tự động.

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

### Trình trợ giúp bộ đệm

Bộ nhớ đệm nhận biết mô-đun với tiền tố khóa tự động.

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

## Ví dụ hoàn chỉnh

Đây là một ví dụ toàn diện về cách sử dụng trình trợ giúp mô-đun:

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

## Lớp cơ sở của trình trợ giúp trừu tượng

Tất cả trình trợ giúp XMF classes mở rộng `Xmf\Module\Helper\AbstractHelper`, cung cấp:

### Trình xây dựng

```php
public function __construct($dirname)
```

Khởi tạo bằng tên thư mục mô-đun. Nếu trống, sử dụng mô-đun hiện tại.

### dirname()

Trả về tên thư mục mô-đun được liên kết với trình trợ giúp.

```php
$dirname = $helper->dirname();
```

### init()Được hàm tạo gọi sau khi mô-đun được tải. Ghi đè trong trình trợ giúp tùy chỉnh cho logic khởi tạo.

## Tạo người trợ giúp tùy chỉnh

Bạn có thể mở rộng trình trợ giúp cho chức năng dành riêng cho mô-đun:

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

## Xem thêm

- Bắt đầu với XMF - Cách sử dụng XMF cơ bản
- XMF-Request - Xử lý yêu cầu
- ../Recipes/Permission-Helper - Quản lý quyền
- ../Recipes/Module-Admin-Pages - Tạo giao diện quản trị

---

#xmf #module-helper #configuration #handlers #session #cache