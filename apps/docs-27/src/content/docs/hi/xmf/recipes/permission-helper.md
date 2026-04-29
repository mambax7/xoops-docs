---
title: "अनुमति सहायक"
description: "XMF अनुमति हेल्पर के साथ XOOPS समूह अनुमतियाँ प्रबंधित करना"
---
XOOPS में उपयोगकर्ता समूह सदस्यता पर आधारित एक शक्तिशाली और लचीली अनुमति प्रणाली है। XMF अनुमति हेल्पर इन अनुमतियों के साथ काम करना सरल बनाता है, जटिल अनुमति जांच को एकल विधि कॉल तक कम कर देता है।

## अवलोकन

XOOPS अनुमति प्रणाली समूहों को इनसे संबद्ध करती है:
-मॉड्यूल आईडी
- अनुमति का नाम
- आइटम आईडी

अनुमतियों की जाँच करने के लिए पारंपरिक रूप से उपयोगकर्ता समूहों को खोजने, मॉड्यूल आईडी देखने और अनुमति तालिकाओं को क्वेरी करने की आवश्यकता होती है। XMF परमिशन हेल्पर यह सब स्वचालित रूप से संभालता है।

## आरंभ करना

### एक अनुमति सहायक बनाना

```php
// For the current module
$permHelper = new \Xmf\Module\Helper\Permission();

// For a specific module
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');
```

सहायक स्वचालित रूप से वर्तमान उपयोगकर्ता के समूहों और निर्दिष्ट मॉड्यूल की आईडी का उपयोग करता है।

## अनुमतियाँ जाँचना

### क्या उपयोगकर्ता के पास अनुमति है?

जांचें कि क्या वर्तमान उपयोगकर्ता के पास किसी आइटम के लिए विशिष्ट अनुमति है:

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

### रीडायरेक्ट से जांचें

जिन उपयोगकर्ताओं के पास अनुमति नहीं है, उन्हें स्वचालित रूप से पुनर्निर्देशित करें:

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

### एडमिन ओवरराइड

डिफ़ॉल्ट रूप से, व्यवस्थापक उपयोगकर्ताओं के पास हमेशा अनुमति होती है। व्यवस्थापकों के लिए भी जाँच करने के लिए:

```php
// Normal check - admins always have permission
$hasPermission = $permHelper->checkPermission('viewtopic', $id);

// Check even for admins (third parameter = false)
$hasPermission = $permHelper->checkPermission('viewtopic', $id, false);
```

### अनुमत आइटम आईडी प्राप्त करें

उन सभी आइटम आईडी को पुनः प्राप्त करें जिनके लिए विशिष्ट समूहों को अनुमति है:

```php
// Get items the current user's groups can view
$viewableIds = $permHelper->getItemIds('viewtopic', $GLOBALS['xoopsUser']->getGroups());

// Get items a specific group can view
$viewableIds = $permHelper->getItemIds('viewtopic', [XOOPS_GROUP_USERS]);

// Use in queries
$criteria = new Criteria('topic_id', '(' . implode(',', $viewableIds) . ')', 'IN');
```

## अनुमतियाँ प्रबंधित करना

### किसी आइटम के लिए समूह प्राप्त करें

पता लगाएं कि किन समूहों के पास विशिष्ट अनुमति है:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Get groups that can view topic 42
$groups = $permHelper->getGroupsForItem('viewtopic', 42);
// Returns: [1, 2, 5](array of group IDs)
```

### अनुमतियाँ सहेजें

विशिष्ट समूहों को अनुमति प्रदान करें:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Allow groups 1, 2, and 3 to view topic 42
$groups = [1, 2, 3];
$permHelper->savePermissionForItem('viewtopic', 42, $groups);
```

### अनुमतियाँ हटाएँ

किसी आइटम के लिए सभी अनुमतियाँ हटाएँ (आमतौर पर आइटम हटाते समय):

```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// Delete view permission for this topic
$permHelper->deletePermissionForItem('viewtopic', $topicId);
```

एकाधिक अनुमति प्रकारों के लिए:

```php
// Delete multiple permission types at once
$permissionNames = ['viewtopic', 'posttopic', 'edittopic'];
$permHelper->deletePermissionForItem($permissionNames, $topicId);
```

## फॉर्म एकीकरण

### प्रपत्रों में अनुमति चयन जोड़ना

सहायक समूहों के चयन के लिए एक प्रपत्र तत्व बना सकता है:

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

### प्रपत्र तत्व विकल्प

पूर्ण विधि हस्ताक्षर:

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

### फॉर्म जमा करने की प्रक्रिया

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

### डिफ़ॉल्ट फ़ील्ड नाम

सहायक लगातार फ़ील्ड नाम उत्पन्न करता है:

```php
$fieldName = $permHelper->defaultFieldName('viewtopic', 42);
// Returns something like: 'mymodule_viewtopic_42'
```

## पूर्ण उदाहरण: अनुमति-संरक्षित आइटम

### अनुमतियों के साथ एक आइटम बनाना

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

### अनुमति जांच के साथ देखना

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

### अनुमति सफ़ाई के साथ हटाना

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

## API संदर्भ

| विधि | विवरण |
|-------|----|
| `checkPermission($name, $itemId, $trueIfAdmin)` | जांचें कि क्या उपयोगकर्ता के पास अनुमति है |
| `checkPermissionRedirect($name, $itemId, $url, $time, $message, $trueIfAdmin)` | यदि अस्वीकृत हो तो जांचें और पुनर्निर्देशित करें |
| `getItemIds($name, $groupIds)` | आइटम आईडी प्राप्त करें जिन्हें समूह एक्सेस कर सकते हैं |
| `getGroupsForItem($name, $itemId)` | अनुमति के साथ समूह प्राप्त करें |
| `savePermissionForItem($name, $itemId, $groups)` | अनुमतियाँ सहेजें |
| `deletePermissionForItem($name, $itemId)` | अनुमतियाँ हटाएँ |
| `getGroupSelectFormForItem(...)` | प्रपत्र चयन तत्व बनाएं |
| `defaultFieldName($name, $itemId)` | डिफ़ॉल्ट प्रपत्र फ़ील्ड नाम प्राप्त करें |

## यह भी देखें

- ../बेसिक्स/XMF-मॉड्यूल-हेल्पर - मॉड्यूल सहायक दस्तावेज़ीकरण
- मॉड्यूल-एडमिन-पेज - एडमिन इंटरफ़ेस निर्माण
- ../बेसिक्स/गेटिंग-स्टार्टेड-विद-XMF - XMF बेसिक्स

---

#xmf #अनुमतियाँ #सुरक्षा #समूह #प्रपत्र