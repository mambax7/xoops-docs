---
title: "Pembantu Kebenaran"
description: "Menguruskan XOOPS kebenaran kumpulan dengan XMF Pembantu Kebenaran"
---
XOOPS mempunyai sistem kebenaran yang berkuasa dan fleksibel berdasarkan keahlian kumpulan pengguna. XMF Pembantu Kebenaran memudahkan kerja dengan kebenaran ini, mengurangkan semakan kebenaran kompleks kepada panggilan kaedah tunggal.

## Gambaran Keseluruhan

Sistem kebenaran XOOPS mengaitkan kumpulan dengan:
- ID Modul
- Nama kebenaran
- ID Item

Menyemak kebenaran secara tradisinya memerlukan mencari kumpulan pengguna, mencari ID modul dan menanyakan jadual kebenaran. XMF Pembantu Kebenaran mengendalikan semua ini secara automatik.

## Bermula

### Mencipta Pembantu Kebenaran
```php
// For the current module
$permHelper = new \Xmf\Module\Helper\Permission();

// For a specific module
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');
```
Pembantu secara automatik menggunakan kumpulan pengguna semasa dan ID modul yang ditentukan.

## Menyemak Kebenaran

### Adakah Pengguna Mempunyai Kebenaran?

Semak sama ada pengguna semasa mempunyai kebenaran khusus untuk item:
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
### Semak dengan Ubah hala

Ubah hala secara automatik pengguna yang tidak mempunyai kebenaran:
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
### Admin Override

Secara lalai, pengguna pentadbir sentiasa mempunyai kebenaran. Untuk menyemak walaupun untuk pentadbir:
```php
// Normal check - admins always have permission
$hasPermission = $permHelper->checkPermission('viewtopic', $id);

// Check even for admins (third parameter = false)
$hasPermission = $permHelper->checkPermission('viewtopic', $id, false);
```
### Dapatkan ID Item Yang Dibenarkan

Dapatkan semua ID item yang kumpulan tertentu mempunyai kebenaran untuk:
```php
// Get items the current user's groups can view
$viewableIds = $permHelper->getItemIds('viewtopic', $GLOBALS['xoopsUser']->getGroups());

// Get items a specific group can view
$viewableIds = $permHelper->getItemIds('viewtopic', [XOOPS_GROUP_USERS]);

// Use in queries
$criteria = new Criteria('topic_id', '(' . implode(',', $viewableIds) . ')', 'IN');
```
## Menguruskan Kebenaran

### Dapatkan Kumpulan untuk Item

Cari kumpulan yang mempunyai kebenaran khusus:
```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Get groups that can view topic 42
$groups = $permHelper->getGroupsForItem('viewtopic', 42);
// Returns: [1, 2, 5] (array of group IDs)
```
### Simpan Kebenaran

Berikan kebenaran kepada kumpulan tertentu:
```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Allow groups 1, 2, and 3 to view topic 42
$groups = [1, 2, 3];
$permHelper->savePermissionForItem('viewtopic', 42, $groups);
```
### Padamkan Kebenaran

Alih keluar semua kebenaran untuk item (biasanya apabila memadamkan item):
```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// Delete view permission for this topic
$permHelper->deletePermissionForItem('viewtopic', $topicId);
```
Untuk pelbagai jenis kebenaran:
```php
// Delete multiple permission types at once
$permissionNames = ['viewtopic', 'posttopic', 'edittopic'];
$permHelper->deletePermissionForItem($permissionNames, $topicId);
```
## Integrasi Borang

### Menambah Pilihan Kebenaran pada Borang

Pembantu boleh mencipta elemen borang untuk memilih kumpulan:
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
### Pilihan Elemen Borang

Tandatangan kaedah penuh:
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
### Memproses Penyerahan Borang
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
### Nama Medan Lalai

Pembantu menjana nama medan yang konsisten:
```php
$fieldName = $permHelper->defaultFieldName('viewtopic', 42);
// Returns something like: 'mymodule_viewtopic_42'
```
## Contoh Lengkap: Item yang Dilindungi Kebenaran

### Mencipta Item dengan Kebenaran
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
### Melihat dengan Semakan Kebenaran
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
### Memadam dengan Pembersihan Kebenaran
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
## API Rujukan

| Kaedah | Penerangan |
|--------|--------------|
| `checkPermission($name, $itemId, $trueIfAdmin)` | Semak sama ada pengguna mempunyai kebenaran |
| `checkPermissionRedirect($name, $itemId, $url, $time, $message, $trueIfAdmin)` | Semak dan ubah hala jika dinafikan |
| `getItemIds($name, $groupIds)` | Dapatkan ID item kumpulan boleh mengakses |
| `getGroupsForItem($name, $itemId)` | Dapatkan kumpulan dengan kebenaran |
| `savePermissionForItem($name, $itemId, $groups)` | Simpan kebenaran |
| `deletePermissionForItem($name, $itemId)` | Padamkan kebenaran |
| `getGroupSelectFormForItem(...)` | Cipta elemen pilih borang |
| `defaultFieldName($name, $itemId)` | Dapatkan nama medan borang lalai |

## Lihat Juga

- ../Asas/XMF-Modul-Helper - Dokumentasi pembantu modul
- Modul-Admin-Pages - Penciptaan antara muka pentadbir
- ../Basics/Getting-Started-with-XMF - XMF asas

---

#XMF #permissions #security #groups #borang