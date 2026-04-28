---
title: "نماذج XOOPS"
description: "دليل شامل لنظام إنشاء النماذج في XOOPS، بما في ذلك جميع عناصر النموذج والتحقق من الصحة والعرض"
dir: rtl
lang: ar
---

# 📝 نظام نماذج XOOPS

> إنشاء النماذج والتحقق من الصحة والعرض الشامل والمرن لوحدات XOOPS.

---

## نظرة عامة

يوفر نظام النماذج في XOOPS نهج موجه للكائنات قوي لإنشاء نماذج HTML. يتعامل مع إنشاء النماذج والتحقق من الصحة وحماية CSRF والعرض المرن مع دعم أطر عمل CSS المختلفة.

---

## 🚀 البدء السريع

### إنشاء نموذج أساسي

```php
<?php
use XoopsFormButton;
use XoopsFormHidden;
use XoopsFormHiddenToken;
use XoopsFormText;
use XoopsThemeForm;

// إنشاء نموذج
$form = new XoopsThemeForm(
    'Contact Form',           // العنوان
    'contact_form',           // الاسم
    'submit.php',             // الإجراء
    'post',                   // الطريقة
    true                      // استخدام الرمز
);

// إضافة العناصر
$form->addElement(new XoopsFormText('Name', 'name', 50, 255, ''), true);
$form->addElement(new XoopsFormText('Email', 'email', 50, 255, ''), true);
$form->addElement(new XoopsFormTextArea('Message', 'message', '', 5, 60), true);
$form->addElement(new XoopsFormHiddenToken());
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

// عرض
echo $form->render();
```

---

## 📦 فئات النماذج

### XoopsForm (الفئة الأساسية)

فئة أساسية مجردة لجميع النماذج.

```php
// أنواع النماذج المتاحة
$simpleForm = new XoopsSimpleForm($title, $name, $action, $method);
$themeForm = new XoopsThemeForm($title, $name, $action, $method, $addToken);
$tableForm = new XoopsTableForm($title, $name, $action, $method, $addToken);
```

### XoopsThemeForm

فئة النموذج الأكثر استخداماً، تعرض مع تصميم المظهر.

```php
$form = new XoopsThemeForm('My Form', 'myform', 'process.php', 'post', true);

// طرق النموذج
$form->addElement($element, $required = false);
$form->insertElement($position, $element, $required = false);
$form->getElement($name);
$form->getElements();
$form->setExtra($extra);        // خصائص HTML الإضافية
$form->render();
$form->display();               // اطبع مباشرة
```

---

## 🧩 عناصر النموذج

### إدخال نصي

```php
// نص سطر واحد
$text = new XoopsFormText(
    'Username',     // التسمية
    'username',     // الاسم
    50,             // الحجم
    255,            // الحد الأقصى للطول
    $defaultValue   // القيمة الافتراضية
);

// مع عنصر نائب
$text->setExtra('placeholder="Enter username"');
```

### إدخال كلمة المرور

```php
$password = new XoopsFormPassword(
    'Password',
    'password',
    50,             // الحجم
    255             // الحد الأقصى للطول
);
```

### مجال النص

```php
$textarea = new XoopsFormTextArea(
    'Description',
    'description',
    $defaultValue,
    5,              // الصفوف
    60              // الأعمدة
);
```

### قائمة منسدلة محددة

```php
$select = new XoopsFormSelect(
    'Category',
    'category_id',
    $defaultValue,
    1,              // الحجم (1 = منسدل)
    false           // متعدد
);

// إضافة خيارات
$select->addOption(1, 'Option 1');
$select->addOption(2, 'Option 2');

// أو أضف مصفوفة
$options = [
    1 => 'Category A',
    2 => 'Category B',
    3 => 'Category C'
];
$select->addOptionArray($options);
```

### تحديد متعدد

```php
$multiSelect = new XoopsFormSelect(
    'Tags',
    'tags[]',
    $selectedValues,
    5,              // الصفوف المرئية
    true            // تحديد متعدد
);
$multiSelect->addOptionArray($tagOptions);
```

### خانة اختيار

```php
// خانة اختيار واحدة
$checkbox = new XoopsFormCheckBox(
    'Active',
    'active',
    1               // مختارة إذا كانت القيمة تطابق
);
$checkbox->addOption(1, 'Enable this feature');

// خانات اختيار متعددة
$checkboxGroup = new XoopsFormCheckBox(
    'Features',
    'features[]',
    $selectedFeatures
);
$checkboxGroup->addOptionArray([
    'comments' => 'Enable Comments',
    'ratings' => 'Enable Ratings',
    'sharing' => 'Enable Sharing'
]);
```

### أزرار الراديو

```php
$radio = new XoopsFormRadio(
    'Status',
    'status',
    $defaultStatus
);
$radio->addOptionArray([
    'draft' => 'Draft',
    'published' => 'Published',
    'archived' => 'Archived'
]);
```

### تحميل الملف

```php
$file = new XoopsFormFile(
    'Upload Image',
    'image',
    1048576         // الحد الأقصى للحجم بالبايت (1MB)
);

// ملفات متعددة
$file->setExtra('multiple accept="image/*"');
```

### حقل مخفي

```php
$hidden = new XoopsFormHidden('item_id', $itemId);

// رمز CSRF (دائماً قم بتضمينه!)
$token = new XoopsFormHiddenToken();
```

### الزر

```php
// زر الإرسال
$submit = new XoopsFormButton('', 'submit', _SUBMIT, 'submit');

// زر إعادة تعيين
$reset = new XoopsFormButton('', 'reset', _CANCEL, 'reset');

// زر مخصص
$custom = new XoopsFormButton('', 'preview', 'Preview', 'button');
$custom->setExtra('onclick="previewContent()"');
```

### التسمية (عرض فقط)

```php
$label = new XoopsFormLabel(
    'Created',
    date('Y-m-d H:i:s', $item->getVar('created'))
);
```

### منتقي التاريخ والوقت

```php
$date = new XoopsFormDateTime(
    'Publish Date',
    'publish_date',
    15,             // الحجم
    $timestamp      // الطابع الزمني الافتراضي
);

// التاريخ فقط (إدخال نصي)
$dateText = new XoopsFormTextDateSelect(
    'Event Date',
    'event_date',
    15,
    $timestamp
);
```

### محرر WYSIWYG

```php
$editor = new XoopsFormEditor(
    'Content',
    'content',
    [
        'name' => 'content',
        'value' => $defaultContent,
        'rows' => 15,
        'cols' => 60,
        'width' => '100%',
        'height' => '400px'
    ],
    false,          // لا يُسمح بـ HTML
    'textarea'      // محرر بديل
);
```

### صينية العنصر (عناصر المجموعة)

```php
$tray = new XoopsFormElementTray('Date Range', ' - ');
$tray->addElement(new XoopsFormTextDateSelect('', 'start_date', 10, $startDate));
$tray->addElement(new XoopsFormTextDateSelect('', 'end_date', 10, $endDate));
$form->addElement($tray);
```

---

## ✅ التحقق من صحة النموذج

### الحقول المطلوبة

```php
// ضع علامة على أنه مطلوب (المعامل الثاني)
$form->addElement(new XoopsFormText('Name', 'name', 50, 255, ''), true);

// أو حدد على العنصر
$element = new XoopsFormText('Email', 'email', 50, 255, '');
$form->addElement($element, true);
```

### التحقق من الصحة المخصص

```php
// التحقق من صحة جانب الخادم
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // التحقق من رمز CSRF
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, 'Security token invalid');
        exit;
    }

    // احصل على المدخلات المطهرة
    $name = \Xmf\Request::getString('name', '', 'POST');
    $email = \Xmf\Request::getString('email', '', 'POST');

    $errors = [];

    // تحقق
    if (empty($name)) {
        $errors[] = 'Name is required';
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email address';
    }

    if (!empty($errors)) {
        // اعرض الأخطاء
        foreach ($errors as $error) {
            echo "<div class='errorMsg'>$error</div>";
        }
    } else {
        // معالجة النموذج
    }
}
```

### التحقق من صحة جانب العميل

```php
$form->setExtra('onsubmit="return validateForm()"');
```

```javascript
function validateForm() {
    const name = document.forms['myform']['name'].value;
    if (name.trim() === '') {
        alert('Name is required');
        return false;
    }
    return true;
}
```

---

## 🎨 عارضات مخصصة

### عارض Bootstrap 5

```php
// تسجيل عارض مخصص
XoopsFormRenderer::getInstance()->set(
    new XoopsFormRendererBootstrap5()
);

// الآن جميع النماذج تستخدم نمط Bootstrap 5
$form = new XoopsThemeForm('My Form', 'myform', 'process.php');
```

### إنشاء عارض مخصص

```php
<?php

class XoopsFormRendererBulma implements XoopsFormRendererInterface
{
    public function renderFormText(XoopsFormText $element): string
    {
        return sprintf(
            '<div class="field">
                <label class="label">%s</label>
                <div class="control">
                    <input class="input" type="text" name="%s" value="%s" size="%d" maxlength="%d" %s>
                </div>
            </div>',
            $element->getCaption(),
            $element->getName(),
            htmlspecialchars($element->getValue(), ENT_QUOTES),
            $element->getSize(),
            $element->getMaxlength(),
            $element->getExtra()
        );
    }

    public function renderFormSelect(XoopsFormSelect $element): string
    {
        $html = sprintf(
            '<div class="field">
                <label class="label">%s</label>
                <div class="control">
                    <div class="select">
                        <select name="%s" %s>',
            $element->getCaption(),
            $element->getName(),
            $element->getExtra()
        );

        foreach ($element->getOptions() as $value => $label) {
            $selected = ($value == $element->getValue()) ? ' selected' : '';
            $html .= sprintf(
                '<option value="%s"%s>%s</option>',
                htmlspecialchars($value, ENT_QUOTES),
                $selected,
                htmlspecialchars($label, ENT_QUOTES)
            );
        }

        $html .= '</select></div></div></div>';

        return $html;
    }

    // ... تنفيذ طرق العرض الأخرى
}
```

---

## 🔐 الأمان

### حماية CSRF

قم دائماً بتضمين الرمز المخفي:

```php
$form->addElement(new XoopsFormHiddenToken());

// أو تلقائي مع معامل useToken
$form = new XoopsThemeForm('Form', 'form', 'action.php', 'post', true);
```

### التحقق من الرمز عند الإرسال

```php
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, implode('<br>', $GLOBALS['xoopsSecurity']->getErrors()));
    exit;
}
```

### تطهير المدخلات

```php
use Xmf\Request;

// قم دائماً بتطهير المدخلات
$string = Request::getString('field', 'default', 'POST');
$int = Request::getInt('id', 0, 'POST');
$array = Request::getArray('items', [], 'POST');
$email = Request::getEmail('email', '', 'POST');
$url = Request::getUrl('website', '', 'POST');
```

---

## 📋 مثال كامل

```php
<?php
require_once dirname(__DIR__) . '/mainfile.php';

use Xmf\Request;
use XoopsFormButton;
use XoopsFormHiddenToken;
use XoopsFormRadio;
use XoopsFormSelect;
use XoopsFormText;
use XoopsFormTextArea;
use XoopsThemeForm;

// معالجة النموذج
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // تحقق من CSRF
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, 'Invalid security token');
        exit;
    }

    // احصل على المدخلات والتحقق منها
    $title = Request::getString('title', '', 'POST');
    $content = Request::getText('content', '', 'POST');
    $categoryId = Request::getInt('category_id', 0, 'POST');
    $status = Request::getString('status', 'draft', 'POST');

    if (empty($title)) {
        $error = 'Title is required';
    } else {
        // حفظ في قاعدة البيانات
        $itemHandler = xoops_getModuleHandler('item', 'mymodule');
        $item = $itemHandler->create();
        $item->setVar('title', $title);
        $item->setVar('content', $content);
        $item->setVar('category_id', $categoryId);
        $item->setVar('status', $status);
        $item->setVar('created', time());

        if ($itemHandler->insert($item)) {
            redirect_header('index.php', 2, 'Item saved successfully');
            exit;
        } else {
            $error = 'Error saving item';
        }
    }
}

// احصل على الفئات للقائمة المنسدلة
$categoryHandler = xoops_getModuleHandler('category', 'mymodule');
$categories = $categoryHandler->getList();

// بناء النموذج
$form = new XoopsThemeForm('Add New Item', 'item_form', 'form.php', 'post', true);

$form->addElement(new XoopsFormText('Title', 'title', 50, 255, $title ?? ''), true);

$categorySelect = new XoopsFormSelect('Category', 'category_id', $categoryId ?? 0);
$categorySelect->addOptionArray($categories);
$form->addElement($categorySelect, true);

$form->addElement(new XoopsFormTextArea('Content', 'content', $content ?? '', 10, 60));

$statusRadio = new XoopsFormRadio('Status', 'status', $status ?? 'draft');
$statusRadio->addOptionArray([
    'draft' => 'Draft',
    'published' => 'Published'
]);
$form->addElement($statusRadio);

$form->addElement(new XoopsFormHiddenToken());
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

// عرض
require_once XOOPS_ROOT_PATH . '/header.php';

if (!empty($error)) {
    echo "<div class='errorMsg'>$error</div>";
}

$form->display();

require_once XOOPS_ROOT_PATH . '/footer.php';
```

---

## 🔗 الوثائق ذات الصلة

- مرجع عناصر النموذج
- التحقق من صحة النموذج
- عارضات النموذج المخصصة
- حماية CSRF
- تطهير المدخلات

---

#xoops #نماذج #التحقق #الأمان #ui #عناصر
