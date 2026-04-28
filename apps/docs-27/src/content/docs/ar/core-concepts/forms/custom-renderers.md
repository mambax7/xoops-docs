---
title: "عارضات النموذج المخصصة"
dir: rtl
lang: ar
---

## نظرة عامة

يسمح XOOPS بتخصيص عرض النموذج من خلال عارضات مخصصة. يتيح هذا أنمطة خاصة بالمظهر وتحسينات إمكانية الوصول والتكامل مع أطر عمل الواجهة الأمامية مثل Bootstrap أو Tailwind CSS.

## العرض الافتراضي

بشكل افتراضي، تستخدم نماذج XOOPS فئة `XoopsFormRenderer` التي تنتج HTML أساسي:

```php
// عرض افتراضي
$form = new XoopsThemeForm('My Form', 'myform', 'submit.php');
$form->addElement(new XoopsFormText('Name', 'name', 50, 255));
echo $form->render();
```

## معمارية عارض مخصص

```mermaid
classDiagram
    class XoopsFormRenderer {
        <<interface>>
        +renderForm(XoopsForm form)
        +renderElement(XoopsFormElement element)
        +renderLabel(string caption)
    }

    XoopsFormRenderer <|-- XoopsFormRendererBootstrap4
    XoopsFormRenderer <|-- XoopsFormRendererBootstrap5
    XoopsFormRenderer <|-- XoopsFormRendererTailwind
    XoopsFormRenderer <|-- CustomFormRenderer
```

## إنشاء عارض مخصص

### فئة عارض أساسية

```php
namespace Xoops\Modules\MyModule\Form;

use XoopsFormRenderer;
use XoopsForm;
use XoopsFormElement;

class BootstrapRenderer extends XoopsFormRenderer
{
    public function renderFormStart(XoopsForm $form): string
    {
        $class = $form->getExtra() ?: 'needs-validation';
        return sprintf(
            '<form name="%s" id="%s" action="%s" method="%s" class="%s" %s>',
            $form->getName(),
            $form->getName(),
            $form->getAction(),
            $form->getMethod(),
            $class,
            $form->getExtra()
        );
    }

    public function renderFormEnd(): string
    {
        return '</form>';
    }

    public function renderElement(XoopsFormElement $element): string
    {
        $output = '<div class="mb-3">';

        // التسمية
        if ($element->getCaption()) {
            $output .= sprintf(
                '<label for="%s" class="form-label">%s</label>',
                $element->getName(),
                $element->getCaption()
            );
        }

        // عنصر مع فئات Bootstrap
        $element->setExtra($element->getExtra() . ' class="form-control"');
        $output .= $element->render();

        // الوصف
        if ($element->getDescription()) {
            $output .= sprintf(
                '<div class="form-text">%s</div>',
                $element->getDescription()
            );
        }

        $output .= '</div>';

        return $output;
    }

    public function renderButton(XoopsFormElement $button): string
    {
        $type = $button->getType() === 'submit' ? 'btn-primary' : 'btn-secondary';
        return sprintf(
            '<button type="%s" name="%s" class="btn %s">%s</button>',
            $button->getType(),
            $button->getName(),
            $type,
            $button->getValue()
        );
    }
}
```

### تسجيل العارض

```php
// في xoops_version.php للوحدة الخاصة بك أو التمهيد
$GLOBALS['xoopsOption']['form_renderer'] = new BootstrapRenderer();

// أو قم بتعيينه لكل نموذج
$form = new XoopsThemeForm('My Form', 'myform', 'submit.php');
$form->setRenderer(new BootstrapRenderer());
```

## العارضات المدمجة

### عارض Bootstrap 4

```php
use Xoops\Form\Renderer\Bootstrap4Renderer;

$form->setRenderer(new Bootstrap4Renderer());
```

### عارض Bootstrap 5

```php
use Xoops\Form\Renderer\Bootstrap5Renderer;

$form->setRenderer(new Bootstrap5Renderer([
    'floating_labels' => true,
    'validation_style' => 'tooltip'
]));
```

## عرض العناصر المحددة

### عارض تحديد مخصص

```php
public function renderSelect(XoopsFormSelect $select): string
{
    $multiple = $select->isMultiple() ? 'multiple' : '';
    $size = $select->getSize();

    $output = sprintf(
        '<select name="%s%s" id="%s" class="form-select" %s size="%d">',
        $select->getName(),
        $multiple ? '[]' : '',
        $select->getName(),
        $multiple,
        $size
    );

    foreach ($select->getOptions() as $value => $label) {
        $selected = in_array($value, (array)$select->getValue()) ? 'selected' : '';
        $output .= sprintf(
            '<option value="%s" %s>%s</option>',
            htmlspecialchars($value),
            $selected,
            htmlspecialchars($label)
        );
    }

    $output .= '</select>';

    return $output;
}
```

### عارض إدخال ملف مخصص

```php
public function renderFile(XoopsFormFile $file): string
{
    return sprintf(
        '<div class="mb-3">
            <label for="%s" class="form-label">%s</label>
            <input type="file" class="form-control" id="%s" name="%s" %s>
        </div>',
        $file->getName(),
        $file->getCaption(),
        $file->getName(),
        $file->getName(),
        $file->getExtra()
    );
}
```

## تكامل المظهر

### في نموذج المظهر

```smarty
{* في قالب النموذج للمظهر *}
{foreach $form.elements as $element}
    <div class="form-group {$element.class}">
        {if $element.caption}
            <label class="control-label">{$element.caption}</label>
        {/if}
        {$element.body}
        {if $element.description}
            <span class="help-block">{$element.description}</span>
        {/if}
    </div>
{/foreach}
```

## أفضل الممارسات

1. **وراثة من عارض أساسي** - وسّع `XoopsFormRenderer` للاتساق
2. **دعم جميع أنواع العناصر** - التعامل مع النص والتحديد والمربع والراديو وما إلى ذلك
3. **إمكانية الوصول** - تضمين التسميات والخصائص المناسبة ARIA
4. **أنماط التحقق من الصحة** - إظهار حالات الخطأ بشكل صحيح
5. **التصميم سريع الاستجابة** - تأكد من عمل النماذج على الأجهزة المحمولة

## الوثائق ذات الصلة

- نظرة عامة على النماذج
- مرجع عناصر النموذج
- التحقق من صحة النموذج
- تطوير المظهر
