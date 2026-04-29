---
title: "ผู้ช่วยอนุญาต"
description: "การจัดการสิทธิ์ของกลุ่ม XOOPS ด้วยตัวช่วยอนุญาต XMF"
---
XOOPS มีระบบการอนุญาตที่มีประสิทธิภาพและยืดหยุ่นตามการเป็นสมาชิกกลุ่มผู้ใช้ XMF Permission Helper ช่วยลดความยุ่งยากในการทำงานกับสิทธิ์เหล่านี้ ลดการตรวจสอบสิทธิ์ที่ซับซ้อนในการเรียกวิธีเดียว

## ภาพรวม

ระบบการอนุญาต XOOPS จะเชื่อมโยงกลุ่มกับ:
- โมดูล ID
- ชื่อการอนุญาต
- รายการ ID

การตรวจสอบสิทธิ์โดยปกติแล้วจำเป็นต้องมีการค้นหากลุ่มผู้ใช้ ค้นหา ID ของโมดูล และสอบถามตารางสิทธิ์ XMF Permission Helper จัดการทั้งหมดนี้โดยอัตโนมัติ

## เริ่มต้นใช้งาน

### การสร้างตัวช่วยอนุญาต
```php
// For the current module
$permHelper = new \Xmf\Module\Helper\Permission();

// For a specific module
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');
```
ตัวช่วยจะใช้กลุ่มของผู้ใช้ปัจจุบันและโมดูล ID ของโมดูลที่ระบุโดยอัตโนมัติ

## กำลังตรวจสอบสิทธิ์

### ผู้ใช้ไม่ได้รับอนุญาตหรือไม่?

ตรวจสอบว่าผู้ใช้ปัจจุบันมีสิทธิ์เฉพาะสำหรับรายการหรือไม่:
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
### ตรวจสอบด้วยการเปลี่ยนเส้นทาง

เปลี่ยนเส้นทางผู้ใช้ที่ไม่มีสิทธิ์โดยอัตโนมัติ:
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
### แทนที่ผู้ดูแลระบบ

ตามค่าเริ่มต้น ผู้ใช้ที่เป็นผู้ดูแลระบบจะมีสิทธิ์เสมอ วิธีตรวจสอบแม้แต่ผู้ดูแลระบบ:
```php
// Normal check - admins always have permission
$hasPermission = $permHelper->checkPermission('viewtopic', $id);

// Check even for admins (third parameter = false)
$hasPermission = $permHelper->checkPermission('viewtopic', $id, false);
```
### รับรหัสรายการที่ได้รับอนุญาต

ดึง ID รายการทั้งหมดที่กลุ่มเฉพาะมีสิทธิ์สำหรับ:
```php
// Get items the current user's groups can view
$viewableIds = $permHelper->getItemIds('viewtopic', $GLOBALS['xoopsUser']->getGroups());

// Get items a specific group can view
$viewableIds = $permHelper->getItemIds('viewtopic', [XOOPS_GROUP_USERS]);

// Use in queries
$criteria = new Criteria('topic_id', '(' . implode(',', $viewableIds) . ')', 'IN');
```
## การจัดการสิทธิ์

### รับกลุ่มสำหรับรายการ

ค้นหากลุ่มที่มีสิทธิ์เฉพาะ:
```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Get groups that can view topic 42
$groups = $permHelper->getGroupsForItem('viewtopic', 42);
// Returns: [1, 2, 5] (array of group IDs)
```
### บันทึกสิทธิ์

ให้สิทธิ์แก่กลุ่มเฉพาะ:
```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Allow groups 1, 2, and 3 to view topic 42
$groups = [1, 2, 3];
$permHelper->savePermissionForItem('viewtopic', 42, $groups);
```
### ลบสิทธิ์

ลบสิทธิ์ทั้งหมดสำหรับรายการ (โดยทั่วไปเมื่อลบรายการ):
```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// Delete view permission for this topic
$permHelper->deletePermissionForItem('viewtopic', $topicId);
```
สำหรับการอนุญาตหลายประเภท:
```php
// Delete multiple permission types at once
$permissionNames = ['viewtopic', 'posttopic', 'edittopic'];
$permHelper->deletePermissionForItem($permissionNames, $topicId);
```
## การรวมแบบฟอร์ม

### การเพิ่มการเลือกสิทธิ์ในแบบฟอร์ม

ผู้ช่วยเหลือสามารถสร้างองค์ประกอบแบบฟอร์มสำหรับการเลือกกลุ่ม:
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
### ตัวเลือกองค์ประกอบแบบฟอร์ม

ลายเซ็นวิธีการแบบเต็ม:
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
### กำลังดำเนินการส่งแบบฟอร์ม
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
### ชื่อฟิลด์เริ่มต้น

ตัวช่วยสร้างชื่อฟิลด์ที่สอดคล้องกัน:
```php
$fieldName = $permHelper->defaultFieldName('viewtopic', 42);
// Returns something like: 'mymodule_viewtopic_42'
```
## ตัวอย่างที่สมบูรณ์: รายการที่ได้รับการปกป้องโดยสิทธิ์

### การสร้างรายการที่มีสิทธิ์
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
### การดูพร้อมการตรวจสอบสิทธิ์
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
### การลบด้วยการล้างข้อมูลตามสิทธิ์
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
## API อ้างอิง

| วิธีการ | คำอธิบาย |
|--------|-------------|
| `checkPermission($name, $itemId, $trueIfAdmin)` | ตรวจสอบว่าผู้ใช้มีสิทธิ์ |
| `checkPermissionRedirect($name, $itemId, $url, $time, $message, $trueIfAdmin)` | ตรวจสอบและเปลี่ยนเส้นทางหากถูกปฏิเสธ |
| `getItemIds($name, $groupIds)` | รับกลุ่ม ID รายการสามารถเข้าถึง |
| `getGroupsForItem($name, $itemId)` | รับกลุ่มที่ได้รับอนุญาต |
| `savePermissionForItem($name, $itemId, $groups)` | บันทึกสิทธิ์ |
| `deletePermissionForItem($name, $itemId)` | ลบการอนุญาต |
| `getGroupSelectFormForItem(...)` | สร้างองค์ประกอบการเลือกแบบฟอร์ม |
| `defaultFieldName($name, $itemId)` | รับชื่อฟิลด์ฟอร์มเริ่มต้น |

## ดูเพิ่มเติม

- ../Basics/XMF-Module-Helper - เอกสารประกอบของตัวช่วยโมดูล
- โมดูล-ผู้ดูแลระบบ-หน้า - การสร้างส่วนต่อประสานผู้ดูแลระบบ
- ../พื้นฐาน/การเริ่มต้นใช้งาน-XMF - XMF พื้นฐาน

---

#xmf #สิทธิ์ #ความปลอดภัย #กลุ่ม #แบบฟอร์ม