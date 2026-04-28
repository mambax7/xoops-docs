---
title: "Custom Form Renderers"
---

## Übersicht

XOOPS ermöglicht Anpassung des Form-Renderings durch Custom Renderer. Dies ermöglicht Theme-spezifisches Styling, Accessibility-Verbesserungen und Integration mit Frontend-Frameworks wie Bootstrap oder Tailwind CSS.

## Default Rendering

Standardmäßig nutzen XOOPS Forms die `XoopsFormRenderer` Klasse, die grundlegendes HTML ausgibt:

```php
// Default Rendering
$form = new XoopsThemeForm('My Form', 'myform', 'submit.php');
$form->addElement(new XoopsFormText('Name', 'name', 50, 255));
echo $form->render();
```

## Custom Renderer Architektur

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

## Custom Renderer erstellen

### Basis Renderer Klasse

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

        // Element mit Bootstrap Classes
        $element->setExtra($element->getExtra() . ' class="form-control"');
        $output .= $element->render();

        // Beschreibung
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

### Renderer registrieren

```php
// In Ihres Moduls xoops_version.php oder Bootstrap
$GLOBALS['xoopsOption']['form_renderer'] = new BootstrapRenderer();

// Oder pro Form setzen
$form = new XoopsThemeForm('My Form', 'myform', 'submit.php');
$form->setRenderer(new BootstrapRenderer());
```

## Built-in Renderer

### Bootstrap 4 Renderer

```php
use Xoops\Form\Renderer\Bootstrap4Renderer;

$form->setRenderer(new Bootstrap4Renderer());
```

### Bootstrap 5 Renderer

```php
use Xoops\Form\Renderer\Bootstrap5Renderer;

$form->setRenderer(new Bootstrap5Renderer([
    'floating_labels' => true,
    'validation_style' => 'tooltip'
]));
```

## Spezifische Elemente Rendering

### Custom Select Renderer

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

### Custom File Input Renderer

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

## Theme Integration

### In Theme Template

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

## Best Practices

1. **Von Base Renderer erben** - Erweitern Sie `XoopsFormRenderer` für Konsistenz
2. **Alle Element-Typen unterstützen** - Behandeln Sie Text, Select, Checkbox, Radio usw.
3. **Accessibility** - Inklusive proper Labels, ARIA Attributes
4. **Validation Styles** - Error-States angemessen anzeigen
5. **Responsive Design** - Stellen Sie sicher, dass Forms auf Mobile funktionieren

## Verwandte Dokumentation

- Forms Overview
- Form Elements Reference
- Form Validation
- Theme Development
