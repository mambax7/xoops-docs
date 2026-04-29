---
title: "یاور اجازه"
description: "مدیریت مجوزهای گروه XOOPS با کمک کننده مجوز XMF"
---
XOOPS دارای یک سیستم مجوز قدرتمند و منعطف بر اساس عضویت در گروه کاربر است. XMF Permission Helper کار با این مجوزها را ساده می کند و بررسی های پیچیده مجوز را به فراخوانی های تک روش کاهش می دهد.

## بررسی اجمالی

سیستم مجوز XOOPS گروه ها را با:
- شناسه ماژول
- نام مجوز
- شناسه مورد

بررسی مجوزها به طور سنتی مستلزم یافتن گروه‌های کاربری، جستجوی شناسه‌های ماژول و جستجو در جداول مجوز است. XMF Permission Helper همه اینها را به طور خودکار کنترل می کند.

## شروع به کار

### ایجاد یک راهنما مجوز

```php
// For the current module
$permHelper = new \XMF\Module\Helper\Permission();

// For a specific module
$permHelper = new \XMF\Module\Helper\Permission('mymodule');
```

کمک کننده به طور خودکار از گروه های کاربر فعلی و شناسه ماژول مشخص شده استفاده می کند.

## بررسی مجوزها

### آیا کاربر مجوز دارد؟

بررسی کنید که آیا کاربر فعلی مجوز خاصی برای یک مورد دارد:

```php
$permHelper = new \XMF\Module\Helper\Permission();

// Check if user can view topic ID 42
$canView = $permHelper->checkPermission('viewtopic', 42);

if ($canView) {
    // Display the topic
} else {
    // Show access denied message
}
```

### با Redirect بررسی کنید

هدایت خودکار کاربرانی که فاقد مجوز هستند:

```php
$permHelper = new \XMF\Module\Helper\Permission();
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

### لغو مدیریت

به طور پیش فرض، کاربران ادمین همیشه مجوز دارند. برای بررسی حتی برای مدیران:

```php
// Normal check - admins always have permission
$hasPermission = $permHelper->checkPermission('viewtopic', $id);

// Check even for admins (third parameter = false)
$hasPermission = $permHelper->checkPermission('viewtopic', $id, false);
```

### شناسه مورد مجاز را دریافت کنید

همه شناسه‌های موردی را که گروه‌های خاص مجوز دارند، بازیابی کنید:

```php
// Get items the current user's groups can view
$viewableIds = $permHelper->getItemIds('viewtopic', $GLOBALS['xoopsUser']->getGroups());

// Get items a specific group can view
$viewableIds = $permHelper->getItemIds('viewtopic', [XOOPS_GROUP_USERS]);

// Use in queries
$criteria = new Criteria('topic_id', '(' . implode(',', $viewableIds) . ')', 'IN');
```

## مدیریت مجوزها

### دریافت گروه برای یک آیتم

پیدا کنید کدام گروه ها مجوز خاصی دارند:

```php
$permHelper = new \XMF\Module\Helper\Permission();

// Get groups that can view topic 42
$groups = $permHelper->getGroupsForItem('viewtopic', 42);
// Returns: [1, 2, 5](array of group IDs)
```

### مجوزها را ذخیره کنید

اعطای مجوز به گروه های خاص:

```php
$permHelper = new \XMF\Module\Helper\Permission();

// Allow groups 1, 2, and 3 to view topic 42
$groups = [1, 2, 3];
$permHelper->savePermissionForItem('viewtopic', 42, $groups);
```

### مجوزها را حذف کنید

حذف تمام مجوزهای یک مورد (معمولاً هنگام حذف مورد):

```php
$permHelper = new \XMF\Module\Helper\Permission();
$topicId = 42;

// Delete view permission for this topic
$permHelper->deletePermissionForItem('viewtopic', $topicId);
```

برای چندین نوع مجوز:

```php
// Delete multiple permission types at once
$permissionNames = ['viewtopic', 'posttopic', 'edittopic'];
$permHelper->deletePermissionForItem($permissionNames, $topicId);
```

## یکپارچه سازی فرم

### افزودن انتخاب مجوز به فرم ها

کمک کننده می تواند یک عنصر فرم برای انتخاب گروه ها ایجاد کند:

```php
$permHelper = new \XMF\Module\Helper\Permission();

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

### گزینه های عنصر فرم

امضای روش کامل:

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

### پردازش فرم ارسال

```php
use XMF\Request;

$permHelper = new \XMF\Module\Helper\Permission();
$topicId = Request::getInt('topic_id', 0);

// Get the auto-generated field name
$fieldName = $permHelper->defaultFieldName('viewtopic', $topicId);

// Get selected groups from form
$selectedGroups = Request::getArray($fieldName, [], 'POST');

// Save the permissions
$permHelper->savePermissionForItem('viewtopic', $topicId, $selectedGroups);
```

### نام فیلد پیش فرض

کمک کننده نام فیلدهای سازگار را ایجاد می کند:

```php
$fieldName = $permHelper->defaultFieldName('viewtopic', 42);
// Returns something like: 'mymodule_viewtopic_42'
```

## مثال کامل: موارد محافظت شده با مجوز

### ایجاد یک آیتم با مجوز

```php
<?php
use XMF\Request;
use XMF\Module\Helper;
use XMF\Module\Helper\Permission;

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

### مشاهده با بررسی مجوز

```php
<?php
use XMF\Request;
use XMF\Module\Helper;
use XMF\Module\Helper\Permission;

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

### حذف با پاکسازی مجوز

```php
<?php
use XMF\Request;
use XMF\Module\Helper;
use XMF\Module\Helper\Permission;

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

## مرجع API

| روش | توضیحات |
|--------|------------|
| `checkPermission($name, $itemId, $trueIfAdmin)` | بررسی کنید که آیا کاربر مجوز دارد |
| `checkPermissionRedirect($name, $itemId, $url, $time, $message, $trueIfAdmin)` | بررسی کنید و در صورت رد شدن، تغییر مسیر دهید |
| `getItemIds($name, $groupIds)` | دریافت شناسه های موردی که گروه ها می توانند به |
| `getGroupsForItem($name, $itemId)` | دریافت گروه های با مجوز |
| `savePermissionForItem($name, $itemId, $groups)` | ذخیره مجوزها |
| `deletePermissionForItem($name, $itemId)` | حذف مجوزها |
| `getGroupSelectFormForItem(...)` | ایجاد عنصر انتخاب فرم |
| `defaultFieldName($name, $itemId)` | دریافت نام فیلد فرم پیش فرض |

## همچنین ببینید

- ../Basics/XMF-Module-Helper - مستندات کمکی ماژول
- ماژول-ادمین-صفحات - ایجاد رابط مدیریت
- ../Basics/Getting-Started-with-XMF - اصول اولیه XMF

---

#xmf #مجوزها #امنیتی #گروه ها #فرم ها