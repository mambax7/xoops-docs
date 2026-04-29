---
title: "Pomočnik za dovoljenja"
description: "Upravljanje dovoljenj skupine XOOPS s pomočnikom za dovoljenja XMF"
---
XOOPS ima močan in prilagodljiv sistem dovoljenj, ki temelji na članstvu v skupini uporabnikov. Pomočnik za dovoljenja XMF poenostavi delo s temi dovoljenji in zmanjša zapletena preverjanja dovoljenj na klice posamezne metode.

## Pregled

Sistem dovoljenj XOOPS povezuje skupine z:
- ID modula
- Ime dovoljenja
- ID artikla

Preverjanje dovoljenj običajno zahteva iskanje skupin uporabnikov, iskanje ID-jev modulov in poizvedovanje po tabelah dovoljenj. Pomočnik za dovoljenja XMF vse to uredi samodejno.

## Kako začeti

### Ustvarjanje pomočnika za dovoljenja
```php
// For the current module
$permHelper = new \Xmf\Module\Helper\Permission();

// For a specific module
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');
```
Pomočnik samodejno uporabi trenutne uporabniške skupine in podani ID modula.

## Preverjanje dovoljenj

### Ali ima uporabnik dovoljenje?

Preverite, ali ima trenutni uporabnik posebno dovoljenje za element:
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
### Preverite s preusmeritvijo

Samodejno preusmeri uporabnike, ki nimajo dovoljenja:
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
### Skrbniška preglasitev

Privzeto imajo skrbniški uporabniki vedno dovoljenje. Če želite preveriti tudi za skrbnike:
```php
// Normal check - admins always have permission
$hasPermission = $permHelper->checkPermission('viewtopic', $id);

// Check even for admins (third parameter = false)
$hasPermission = $permHelper->checkPermission('viewtopic', $id, false);
```
### Pridobite dovoljene ID-je elementov

Pridobite vse ID-je elementov, za katere imajo določene skupine dovoljenje:
```php
// Get items the current user's groups can view
$viewableIds = $permHelper->getItemIds('viewtopic', $GLOBALS['xoopsUser']->getGroups());

// Get items a specific group can view
$viewableIds = $permHelper->getItemIds('viewtopic', [XOOPS_GROUP_USERS]);

// Use in queries
$criteria = new Criteria('topic_id', '(' . implode(',', $viewableIds) . ')', 'IN');
```
## Upravljanje dovoljenj

### Pridobite skupine za predmet

Ugotovite, katere skupine imajo določeno dovoljenje:
```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Get groups that can view topic 42
$groups = $permHelper->getGroupsForItem('viewtopic', 42);
// Returns: [1, 2, 5] (array of group IDs)
```
### Shrani dovoljenja

Podeli dovoljenje določenim skupinam:
```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Allow groups 1, 2, and 3 to view topic 42
$groups = [1, 2, 3];
$permHelper->savePermissionForItem('viewtopic', 42, $groups);
```
### Izbriši dovoljenja

Odstranite vsa dovoljenja za element (običajno pri brisanju elementa):
```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// Delete view permission for this topic
$permHelper->deletePermissionForItem('viewtopic', $topicId);
```
Za več vrst dovoljenj:
```php
// Delete multiple permission types at once
$permissionNames = ['viewtopic', 'posttopic', 'edittopic'];
$permHelper->deletePermissionForItem($permissionNames, $topicId);
```
## Integracija obrazca

### Dodajanje izbire dovoljenja obrazcem

Pomočnik lahko ustvari element obrazca za izbiro skupin:
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
### Možnosti elementa obrazca

Celoten podpis metode:
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
### Obdelava oddaje obrazca
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
### Privzeto ime polja

Pomočnik ustvari dosledna imena polj:
```php
$fieldName = $permHelper->defaultFieldName('viewtopic', 42);
// Returns something like: 'mymodule_viewtopic_42'
```
## Celoten primer: Elementi, zaščiteni z dovoljenjem

### Ustvarjanje predmeta z dovoljenji
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
### Ogled s preverjanjem dovoljenj
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
### Brisanje s čiščenjem dovoljenj
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
## API Referenca

| Metoda | Opis |
|--------|-------------|
| `checkPermission($name, $itemId, $trueIfAdmin)` | Preverite, ali ima uporabnik dovoljenje |
| `checkPermissionRedirect($name, $itemId, $url, $time, $message, $trueIfAdmin)` | Preveri in preusmeri, če je zavrnjeno |
| `getItemIds($name, $groupIds)` | Pridobi ID-je elementov, do katerih lahko dostopajo skupine |
| `getGroupsForItem($name, $itemId)` | Pridobite skupine z dovoljenjem |
| `savePermissionForItem($name, $itemId, $groups)` | Shrani dovoljenja |
| `deletePermissionForItem($name, $itemId)` | Izbriši dovoljenja |
| `getGroupSelectFormForItem(...)` | Ustvari element za izbiro obrazca |
| `defaultFieldName($name, $itemId)` | Pridobi privzeto ime polja obrazca |

## Glej tudi

- ../Basics/XMF-Module-Helper - Dokumentacija za pomoč modulom
- Module-Admin-Pages - Ustvarjanje skrbniškega vmesnika
- ../Basics/Getting-Started-with-XMF - XMF osnove

---

#XMF #dovoljenja #varnost #skupine #obrazci