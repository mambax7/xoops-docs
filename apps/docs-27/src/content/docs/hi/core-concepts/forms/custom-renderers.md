---
title: "कस्टम फॉर्म रेंडरर्स"
---
## अवलोकन

XOOPS कस्टम रेंडरर्स के माध्यम से फॉर्म रेंडरिंग के अनुकूलन की अनुमति देता है। यह थीम-विशिष्ट स्टाइलिंग, पहुंच में सुधार और बूटस्ट्रैप या टेलविंड CSS जैसे फ्रंटएंड फ्रेमवर्क के साथ एकीकरण को सक्षम बनाता है।

## डिफ़ॉल्ट रेंडरिंग

डिफ़ॉल्ट रूप से, XOOPS फॉर्म `XoopsFormRenderer` क्लास का उपयोग करते हैं जो मूल HTML आउटपुट करता है:

```php
// Default rendering
$form = new XoopsThemeForm('My Form', 'myform', 'submit.php');
$form->addElement(new XoopsFormText('Name', 'name', 50, 255));
echo $form->render();
```

## कस्टम रेंडरर आर्किटेक्चर

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

## एक कस्टम रेंडरर बनाना

### बेसिक रेंडरर क्लास

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

        // Label
        if ($element->getCaption()) {
            $output .= sprintf(
                '<label for="%s" class="form-label">%s</label>',
                $element->getName(),
                $element->getCaption()
            );
        }

        // Element with Bootstrap classes
        $element->setExtra($element->getExtra() . ' class="form-control"');
        $output .= $element->render();

        // Description
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

### रेंडरर को पंजीकृत करना

```php
// In your module's xoops_version.php or bootstrap
$GLOBALS['xoopsOption']['form_renderer'] = new BootstrapRenderer();

// Or set it per-form
$form = new XoopsThemeForm('My Form', 'myform', 'submit.php');
$form->setRenderer(new BootstrapRenderer());
```

## बिल्ट-इन रेंडरर्स

### बूटस्ट्रैप 4 रेंडरर

```php
use Xoops\Form\Renderer\Bootstrap4Renderer;

$form->setRenderer(new Bootstrap4Renderer());
```

### बूटस्ट्रैप 5 रेंडरर

```php
use Xoops\Form\Renderer\Bootstrap5Renderer;

$form->setRenderer(new Bootstrap5Renderer([
    'floating_labels' => true,
    'validation_style' => 'tooltip'
]));
```

## विशिष्ट तत्वों का प्रतिपादन

### कस्टम चयन रेंडरर

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

### कस्टम फ़ाइल इनपुट रेंडरर

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

## थीम एकीकरण

### थीम टेम्पलेट में

```smarty
{* In theme's form.tpl *}
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

## सर्वोत्तम प्रथाएँ

1. **बेस रेंडरर से इनहेरिट करें** - स्थिरता के लिए `XoopsFormRenderer` बढ़ाएँ
2. **सभी प्रकार के तत्व का समर्थन करें** - टेक्स्ट, चयन, चेकबॉक्स, रेडियो इत्यादि संभालें।
3. **पहुंच-योग्यता** - उचित लेबल, ARIA विशेषताएँ शामिल करें
4. **सत्यापन शैलियाँ** - त्रुटि स्थितियाँ उचित रूप से दिखाएँ
5. **उत्तरदायी डिजाइन** - सुनिश्चित करें कि फॉर्म मोबाइल पर काम करें

## संबंधित दस्तावेज़ीकरण

- प्रपत्र अवलोकन
- प्रपत्र तत्व संदर्भ
- प्रपत्र सत्यापन
- थीम विकास