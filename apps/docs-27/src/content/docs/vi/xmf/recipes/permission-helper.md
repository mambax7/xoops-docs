---
title: "Người trợ giúp cấp phép"
description: "Quản lý quyền của nhóm XOOPS bằng Trình trợ giúp quyền XMF"
---
XOOPS có hệ thống cấp phép mạnh mẽ và linh hoạt dựa trên tư cách thành viên nhóm người dùng. Trình trợ giúp quyền XMF đơn giản hóa hoạt động với các quyền này, giảm việc kiểm tra quyền phức tạp đối với các cuộc gọi phương thức đơn lẻ.

## Tổng quan

Hệ thống cấp phép XOOPS liên kết các nhóm với:
- ID mô-đun
- Tên quyền
- Mã mặt hàng

Việc kiểm tra quyền theo truyền thống yêu cầu tìm nhóm người dùng, tra cứu ID mô-đun và truy vấn các bảng quyền. Trình trợ giúp cấp phép XMF tự động xử lý tất cả những điều này.

## Bắt đầu

### Tạo Trình trợ giúp cấp phép

```php
// For the current module
$permHelper = new \Xmf\Module\Helper\Permission();

// For a specific module
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');
```

Trình trợ giúp tự động sử dụng các nhóm của người dùng hiện tại và ID của mô-đun được chỉ định.

## Kiểm tra quyền

### Người dùng có được phép không?

Kiểm tra xem người dùng hiện tại có quyền cụ thể cho một mục hay không:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Check if user can view topic ID 42
$canView = $permHelper->checkPermission('viewtopic', 42);

if ($canView) {
    // Display the topic
} else {
    // Show access denied message
}
```

### Kiểm tra bằng chuyển hướng

Tự động chuyển hướng người dùng thiếu quyền:

```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// Redirects to index.php after 3 seconds if no permission
$permHelper->checkPermissionRedirect(
    'viewtopic',
    $topicId,
    'index.php',
    3,
    'You are not allowed to view that topic'
);

// Code here only runs if user has permission
displayTopic($topicId);
```

### Ghi đè quản trị viên

Theo mặc định, người dùng admin luôn có quyền. Để kiểm tra ngay cả admins:

```php
// Normal check - admins always have permission
$hasPermission = $permHelper->checkPermission('viewtopic', $id);

// Check even for admins (third parameter = false)
$hasPermission = $permHelper->checkPermission('viewtopic', $id, false);
```

### Nhận ID vật phẩm được phép

Truy xuất tất cả ID mục mà các nhóm cụ thể có quyền:

```php
// Get items the current user's groups can view
$viewableIds = $permHelper->getItemIds('viewtopic', $GLOBALS['xoopsUser']->getGroups());

// Get items a specific group can view
$viewableIds = $permHelper->getItemIds('viewtopic', [XOOPS_GROUP_USERS]);

// Use in queries
$criteria = new Criteria('topic_id', '(' . implode(',', $viewableIds) . ')', 'IN');
```

## Quản lý quyền

### Nhận nhóm cho một mục

Tìm nhóm nào có quyền cụ thể:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Get groups that can view topic 42
$groups = $permHelper->getGroupsForItem('viewtopic', 42);
// Returns: [1, 2, 5] (array of group IDs)
```

### Lưu quyền

Cấp quyền cho các nhóm cụ thể:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Allow groups 1, 2, and 3 to view topic 42
$groups = [1, 2, 3];
$permHelper->savePermissionForItem('viewtopic', 42, $groups);
```

### Xóa quyền

Xóa tất cả các quyền cho một mục (thường là khi xóa mục đó):

```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// Delete view permission for this topic
$permHelper->deletePermissionForItem('viewtopic', $topicId);
```

Đối với nhiều loại quyền:

```php
// Delete multiple permission types at once
$permissionNames = ['viewtopic', 'posttopic', 'edittopic'];
$permHelper->deletePermissionForItem($permissionNames, $topicId);
```

## Tích hợp biểu mẫu

### Thêm lựa chọn quyền vào biểu mẫu

Người trợ giúp có thể tạo một thành phần biểu mẫu để chọn nhóm:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Build your form
$form = new XoopsThemeForm('Edit Topic', 'topicform', 'save.php');

// Add title field, etc.
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, $topic->getVar('title')));

// Add permission selector
$form->addElement(
    $permHelper->getGroupSelectFormForItem(
        'viewtopic',                           // Permission name
        $topicId,                              // Item ID
        'Groups with View Topic Permission'   // Caption
    )
);

$form->addElement(new XoopsFormButton('', 'submit', 'Save', 'submit'));
```

### Tùy chọn thành phần biểu mẫu

Chữ ký phương thức đầy đủ:

```php
getGroupSelectFormForItem(
    $gperm_name,      // Permission name
    $gperm_itemid,    // Item ID
    $caption,         // Form element caption
    $name,            // Element name (auto-generated if empty)
    $include_anon,    // Include anonymous group (default: false)
    $size,            // Number of visible rows (default: 5)
    $multiple         // Allow multiple selection (default: true)
)
```

### Đang xử lý việc gửi biểu mẫu

```php
use Xmf\Request;

$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = Request::getInt('topic_id', 0);

// Get the auto-generated field name
$fieldName = $permHelper->defaultFieldName('viewtopic', $topicId);

// Get selected groups from form
$selectedGroups = Request::getArray($fieldName, [], 'POST');

// Save the permissions
$permHelper->savePermissionForItem('viewtopic', $topicId, $selectedGroups);
```

### Tên trường mặc định

Trình trợ giúp tạo tên trường nhất quán:

```php
$fieldName = $permHelper->defaultFieldName('viewtopic', 42);
// Returns something like: 'mymodule_viewtopic_42'
```

## Ví dụ hoàn chỉnh: Các mục được cấp phép bảo vệ

### Tạo một mục có quyền

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/header.php';

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$op = Request::getCmd('op', 'form');
$itemId = Request::getInt('id', 0);

switch ($op) {
    case 'save':
        // Save item data
        $handler = $helper->getHandler('items');

        if ($itemId > 0) {
            $item = $handler->get($itemId);
        } else {
            $item = $handler->create();
        }

        $item->setVar('title', Request::getString('title', ''));
        $item->setVar('content', Request::getText('content', ''));

        if ($handler->insert($item)) {
            $newId = $item->getVar('item_id');

            // Save view permission
            $viewFieldName = $permHelper->defaultFieldName('view', $newId);
            $viewGroups = Request::getArray($viewFieldName, [], 'POST');
            $permHelper->savePermissionForItem('view', $newId, $viewGroups);

            // Save edit permission
            $editFieldName = $permHelper->defaultFieldName('edit', $newId);
            $editGroups = Request::getArray($editFieldName, [], 'POST');
            $permHelper->savePermissionForItem('edit', $newId, $editGroups);

            redirect_header('index.php', 2, 'Item saved');
        }
        break;

    case 'form':
    default:
        $handler = $helper->getHandler('items');

        if ($itemId > 0) {
            $item = $handler->get($itemId);
        } else {
            $item = $handler->create();
            $itemId = 0;
        }

        $form = new XoopsThemeForm('Edit Item', 'itemform', 'edit.php');
        $form->addElement(new XoopsFormHidden('op', 'save'));
        $form->addElement(new XoopsFormHidden('id', $itemId));

        $form->addElement(new XoopsFormText('Title', 'title', 50, 255, $item->getVar('title')));
        $form->addElement(new XoopsFormTextArea('Content', 'content', $item->getVar('content')));

        // View permission selector
        $form->addElement(
            $permHelper->getGroupSelectFormForItem('view', $itemId, 'Groups that can view')
        );

        // Edit permission selector
        $form->addElement(
            $permHelper->getGroupSelectFormForItem('edit', $itemId, 'Groups that can edit')
        );

        $form->addElement(new XoopsFormButton('', 'submit', 'Save', 'submit'));

        $form->display();
        break;
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

### Xem bằng Kiểm tra quyền

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$itemId = Request::getInt('id', 0);

// Check view permission - redirects if denied
$permHelper->checkPermissionRedirect(
    'view',
    $itemId,
    'index.php',
    3,
    'You do not have permission to view this item'
);

require_once XOOPS_ROOT_PATH . '/header.php';

// User has permission, display the item
$handler = $helper->getHandler('items');
$item = $handler->get($itemId);

$xoopsTpl->assign('item', $item->toArray());

// Show edit button only if user has edit permission
if ($permHelper->checkPermission('edit', $itemId)) {
    $xoopsTpl->assign('can_edit', true);
    $xoopsTpl->assign('edit_url', $helper->url('edit.php?id=' . $itemId));
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

### Xóa bằng quyền dọn dẹp

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$itemId = Request::getInt('id', 0);

// Delete the item
$handler = $helper->getHandler('items');
$item = $handler->get($itemId);

if ($item && $handler->delete($item)) {
    // Clean up all permissions for this item
    $permissionNames = ['view', 'edit', 'delete'];
    $permHelper->deletePermissionForItem($permissionNames, $itemId);

    redirect_header('index.php', 2, 'Item deleted');
}
```

## API Tham khảo

| Phương pháp | Mô tả |
|--------|-------------|
| `checkPermission($name, $itemId, $trueIfAdmin)` | Kiểm tra xem người dùng có được phép không |
| `checkPermissionRedirect($name, $itemId, $url, $time, $message, $trueIfAdmin)` | Kiểm tra và chuyển hướng nếu bị từ chối |
| `getItemIds($name, $groupIds)` | Nhận ID vật phẩm mà nhóm có thể truy cập |
| `getGroupsForItem($name, $itemId)` | Nhận các nhóm có sự cho phép |
| `savePermissionForItem($name, $itemId, $groups)` | Lưu quyền |
| `deletePermissionForItem($name, $itemId)` | Xóa quyền |
| `getGroupSelectFormForItem(...)` | Tạo phần tử chọn biểu mẫu |
| `defaultFieldName($name, $itemId)` | Nhận tên trường biểu mẫu mặc định |

## Xem thêm

- ../Basics/XMF-Module-Helper - Tài liệu về trình trợ giúp mô-đun
- Module-Admin-Pages - Tạo giao diện quản trị
- ../Cơ bản/Bắt đầu với-XMF - XMF cơ bản

---

#xmf #quyền #bảo mật #nhóm #biểu mẫu