---
title: "xoops_version.php - मॉड्यूल मेनिफेस्ट"
---
## अवलोकन

`xoops_version.php` फ़ाइल प्रत्येक XOOPS मॉड्यूल का हृदय है। यह मॉड्यूल मेटाडेटा, डेटाबेस टेबल, टेम्प्लेट, ब्लॉक, कॉन्फ़िगरेशन विकल्प और इंस्टॉलेशन हुक को परिभाषित करता है।

## बुनियादी संरचना

```php
<?php
/**
 * Module manifest file
 */

$modversion = [
    // Module identity
    'name'           => _MI_MYMODULE_NAME,
    'version'        => '1.0.0',
    'description'    => _MI_MYMODULE_DESC,
    'author'         => 'Your Name',
    'author_mail'    => 'your@email.com',
    'author_website' => 'https://yoursite.com',
    'credits'        => 'Contributors',
    'license'        => 'GPL 2.0 or later',
    'license_url'    => 'https://www.gnu.org/licenses/gpl-2.0.html',
    'dirname'        => basename(__DIR__),

    // Images
    'image'          => 'assets/images/logo.png',
    'modicons16'     => 'assets/images/icons/16',
    'modicons32'     => 'assets/images/icons/32',

    // System settings
    'system_menu'    => 1,
    'hasAdmin'       => 1,
    'adminindex'     => 'admin/index.php',
    'adminmenu'      => 'admin/menu.php',
    'hasMain'        => 1,
    'hasSearch'      => 1,
    'hasComments'    => 0,
    'hasNotification'=> 0,
];
```

## पूरा संदर्भ

### मॉड्यूल पहचान

| कुंजी | प्रकार | विवरण |
|----|------|----|
| `name` | स्ट्रिंग | प्रदर्शन नाम (भाषा स्थिरांक का प्रयोग करें) |
| `version` | स्ट्रिंग | सिमेंटिक संस्करण (MAJOR.MINOR.PATCH) |
| `description` | स्ट्रिंग | मॉड्यूल विवरण |
| `author` | स्ट्रिंग | प्राथमिक लेखक का नाम |
| `credits` | स्ट्रिंग | अतिरिक्त योगदानकर्ता |
| `license` | स्ट्रिंग | लाइसेंस का नाम |
| `dirname` | स्ट्रिंग | मॉड्यूल निर्देशिका नाम |

### डेटाबेस तालिकाएँ

```php
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';

$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
    'mymodule_comments',
];
```

### टेम्पलेट्स

```php
$modversion['templates'] = [
    ['file' => 'mymodule_index.tpl', 'description' => 'Index page template'],
    ['file' => 'mymodule_item.tpl', 'description' => 'Single item view'],
    ['file' => 'mymodule_category.tpl', 'description' => 'Category listing'],
];
```

### ब्लॉक

```php
$modversion['blocks'][] = [
    'file'        => 'blocks/recent.php',
    'name'        => _MI_MYMODULE_BLOCK_RECENT,
    'description' => _MI_MYMODULE_BLOCK_RECENT_DESC,
    'show_func'   => 'mymodule_recent_show',
    'edit_func'   => 'mymodule_recent_edit',
    'template'    => 'mymodule_block_recent.tpl',
    'options'     => '10|0',  // default options
    'can_clone'   => true,
];
```

### कॉन्फ़िगरेशन विकल्प

```php
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];

$modversion['config'][] = [
    'name'        => 'enable_comments',
    'title'       => '_MI_MYMODULE_ENABLE_COMMENTS',
    'description' => '',
    'formtype'    => 'yesno',
    'valuetype'   => 'int',
    'default'     => 1,
];

$modversion['config'][] = [
    'name'        => 'display_mode',
    'title'       => '_MI_MYMODULE_DISPLAY_MODE',
    'description' => '',
    'formtype'    => 'select',
    'valuetype'   => 'text',
    'default'     => 'list',
    'options'     => [
        _MI_MYMODULE_MODE_LIST => 'list',
        _MI_MYMODULE_MODE_GRID => 'grid',
    ],
];
```

### फॉर्म प्रकार

| फॉर्मटाइप | वैल्यूटाइप | विवरण |
|---|----|----|
| `textbox` | `text`/`int` | सिंगल-लाइन इनपुट |
| `textarea` | `text` | मल्टी-लाइन इनपुट |
| `yesno` | `int` | हाँ/नहीं रेडियो |
| `select` | `text` | ड्रॉपडाउन चयन |
| `select_multi` | `array` | बहु-चयन |
| `group` | `int` | समूह चयनकर्ता |
| `group_multi` | `array` | बहु-समूह चयनकर्ता |
| `user` | `int` | उपयोगकर्ता चयनकर्ता |
| `color` | `text` | रंग बीनने वाला |
| `hidden` | `text` | छिपा हुआ क्षेत्र |

### मेनू आइटम

```php
// Main menu
$modversion['sub'][] = [
    'name' => _MI_MYMODULE_SMENU_INDEX,
    'url'  => 'index.php',
];

$modversion['sub'][] = [
    'name' => _MI_MYMODULE_SMENU_SUBMIT,
    'url'  => 'submit.php',
];
```

### इंस्टालेशन हुक

```php
$modversion['onInstall'] = 'include/oninstall.php';
$modversion['onUpdate']  = 'include/onupdate.php';
$modversion['onUninstall'] = 'include/onuninstall.php';
```

### खोज एकीकरण

```php
$modversion['hasSearch'] = 1;
$modversion['search'] = [
    'file' => 'include/search.php',
    'func' => 'mymodule_search',
];
```

### टिप्पणियाँ एकीकरण

```php
$modversion['hasComments'] = 1;
$modversion['comments'] = [
    'itemName' => 'item_id',
    'pageName' => 'item.php',
];
```

### सूचनाएं

```php
$modversion['hasNotification'] = 1;
$modversion['notification'] = [
    'lookup_file' => 'include/notification.php',
    'lookup_func' => 'mymodule_notify_iteminfo',
    'category' => [
        [
            'name'           => 'global',
            'title'          => _MI_MYMODULE_NOTIFY_GLOBAL,
            'description'    => '',
            'subscribe_from' => 'index.php',
        ],
        [
            'name'           => 'item',
            'title'          => _MI_MYMODULE_NOTIFY_ITEM,
            'description'    => '',
            'subscribe_from' => 'item.php',
            'item_name'      => 'item_id',
        ],
    ],
    'event' => [
        [
            'name'          => 'new_item',
            'category'      => 'global',
            'title'         => _MI_MYMODULE_NOTIFY_NEW_ITEM,
            'caption'       => _MI_MYMODULE_NOTIFY_NEW_ITEM_CAP,
            'mail_template' => 'notify_newitem',
            'mail_subject'  => _MI_MYMODULE_NOTIFY_NEW_ITEM_SUBJ,
        ],
    ],
];
```

## संबंधित दस्तावेज़ीकरण

- मॉड्यूल-विकास - संपूर्ण मॉड्यूल गाइड
- मॉड्यूल-संरचना - निर्देशिका संरचना
- ब्लॉक-विकास - ब्लॉक बनाना
- डेटाबेस-संचालन - डेटाबेस सेटअप