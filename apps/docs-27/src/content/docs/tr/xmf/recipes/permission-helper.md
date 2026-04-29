---
title: "İzin Yardımcısı"
description: "XOOPS grup izinlerini XMF İzin Yardımcısı ile yönetme"
---
XOOPS, user grubu üyeliğine dayalı güçlü ve esnek bir izin sistemine sahiptir. XMF İzin Yardımcısı, karmaşık izin kontrollerini tek yöntem çağrılarına indirgeyerek bu izinlerle çalışmayı basitleştirir.

## Genel Bakış

XOOPS izin sistemi, grupları aşağıdakilerle ilişkilendirir:
- module Kimliği
- İzin adı
- Öğe Kimliği

İzinlerin kontrol edilmesi geleneksel olarak user gruplarının bulunmasını, module kimliklerinin aranmasını ve izin tablolarının sorgulanmasını gerektirir. XMF İzin Yardımcısı tüm bunları otomatik olarak yönetir.

## Başlarken

### İzin Yardımcısı Oluşturma
```php
// For the current module
$permHelper = new \Xmf\Module\Helper\Permission();

// For a specific module
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');
```
Yardımcı, geçerli kullanıcının gruplarını ve belirtilen modülün kimliğini otomatik olarak kullanır.

## İzinleri Kontrol Etme

### Kullanıcının İzni Var mı?

Geçerli kullanıcının bir öğe için belirli bir izne sahip olup olmadığını kontrol edin:
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
### Yönlendirmeyle Kontrol Et

İzni olmayan kullanıcıları otomatik olarak yönlendirin:
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
### Yöneticinin Geçersiz Kılması

Varsayılan olarak yönetici kullanıcıların her zaman izni vardır. Yöneticileri bile kontrol etmek için:
```php
// Normal check - admins always have permission
$hasPermission = $permHelper->checkPermission('viewtopic', $id);

// Check even for admins (third parameter = false)
$hasPermission = $permHelper->checkPermission('viewtopic', $id, false);
```
### İzin Verilen Öğe Kimliklerini Alın

Belirli grupların izne sahip olduğu tüm öğe kimliklerini alın:
```php
// Get items the current user's groups can view
$viewableIds = $permHelper->getItemIds('viewtopic', $GLOBALS['xoopsUser']->getGroups());

// Get items a specific group can view
$viewableIds = $permHelper->getItemIds('viewtopic', [XOOPS_GROUP_USERS]);

// Use in queries
$criteria = new Criteria('topic_id', '(' . implode(',', $viewableIds) . ')', 'IN');
```
## İzinleri Yönetme

### Bir Öğe için Grupları Alma

Hangi grupların belirli izne sahip olduğunu bulun:
```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Get groups that can view topic 42
$groups = $permHelper->getGroupsForItem('viewtopic', 42);
// Returns: [1, 2, 5] (array of group IDs)
```
### İzinleri Kaydet

Belirli gruplara izin verin:
```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Allow groups 1, 2, and 3 to view topic 42
$groups = [1, 2, 3];
$permHelper->savePermissionForItem('viewtopic', 42, $groups);
```
### İzinleri Sil

Bir öğenin tüm izinlerini kaldırın (genellikle öğeyi silerken):
```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// Delete view permission for this topic
$permHelper->deletePermissionForItem('viewtopic', $topicId);
```
Birden fazla izin türü için:
```php
// Delete multiple permission types at once
$permissionNames = ['viewtopic', 'posttopic', 'edittopic'];
$permHelper->deletePermissionForItem($permissionNames, $topicId);
```
## Form Entegrasyonu

### Formlara İzin Seçimi Ekleme

Yardımcı, grupları seçmek için bir form öğesi oluşturabilir:
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
### Form Öğesi Seçenekleri

Tam yöntem imzası:
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
### Form Gönderimi İşleniyor
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
### Varsayılan Alan Adı

Yardımcı tutarlı alan adları oluşturur:
```php
$fieldName = $permHelper->defaultFieldName('viewtopic', 42);
// Returns something like: 'mymodule_viewtopic_42'
```
## Tam Örnek: İzin Korumalı Öğeler

### İzinlere Sahip Bir Öğe Oluşturma
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
### İzin Kontrolüyle Görüntüleme
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
### İzinli Temizleme ile Silme
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
## API Referans

| Yöntem | Açıklama |
|----------|----------------|
| `checkPermission($name, $itemId, $trueIfAdmin)` | Kullanıcının izne sahip olup olmadığını kontrol edin |
| `checkPermissionRedirect($name, $itemId, $url, $time, $message, $trueIfAdmin)` | Reddedildiyse kontrol edin ve yönlendirin |
| `getItemIds($name, $groupIds)` | Grupların erişebileceği öğe kimliklerini alın |
| `getGroupsForItem($name, $itemId)` | İzne sahip grupları alın |
| `savePermissionForItem($name, $itemId, $groups)` | İzinleri kaydet |
| `deletePermissionForItem($name, $itemId)` | İzinleri sil |
| `getGroupSelectFormForItem(...)` | Form seçme öğesi oluştur |
| `defaultFieldName($name, $itemId)` | Varsayılan form alanı adını al |

## Ayrıca Bakınız

- ../Basics/XMF-Module-Helper - module yardımcı belgeleri
- module-Yönetici-Sayfaları - Yönetici arayüzü oluşturma
- ../Basics/Getting-Started-with-XMF - XMF temel bilgiler

---

#xmf #permissions #güvenlik #gruplar #formlar