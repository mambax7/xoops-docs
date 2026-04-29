---
title: "Vlastní vykreslovače formulářů"
---

## Přehled

XOOPS umožňuje přizpůsobení vykreslování formulářů pomocí vlastních rendererů. To umožňuje stylování podle témat, vylepšení přístupnosti a integraci s rozhraními frontend, jako je Bootstrap nebo Tailwind CSS.

## Výchozí vykreslování

Ve výchozím nastavení formuláře XOOPS používají třídu `XOOPSFormRenderer`, která vydává základní HTML:

```php
// Default rendering
$form = new XOOPSThemeForm('My Form', 'myform', 'submit.php');
$form->addElement(new XOOPSFormText('Name', 'name', 50, 255));
echo $form->render();
```

## Architektura vlastního rendereru

```mermaid
classDiagram
    class XOOPSFormRenderer {
        <<interface>>
        +renderForm(XOOPSForm form)
        +renderElement(XOOPSFormElement element)
        +renderLabel(string caption)
    }

    XOOPSFormRenderer <|-- XOOPSFormRendererBootstrap4
    XOOPSFormRenderer <|-- XOOPSFormRendererBootstrap5
    XOOPSFormRenderer <|-- XOOPSFormRendererTailwind
    XOOPSFormRenderer <|-- CustomFormRenderer
```

## Vytvoření vlastního vykreslovače

### Základní třída rendereru

```php
namespace XOOPS\Modules\MyModule\Form;

use XOOPSFormRenderer;
use XOOPSForm;
use XOOPSFormElement;

class BootstrapRenderer extends XOOPSFormRenderer
{
    public function renderFormStart(XOOPSForm $form): string
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

    public function renderElement(XOOPSFormElement $element): string
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

    public function renderButton(XOOPSFormElement $button): string
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

### Registrace Rendereru

```php
// In your module's xoops_version.php or bootstrap
$GLOBALS['xoopsOption']['form_renderer'] = new BootstrapRenderer();

// Or set it per-form
$form = new XOOPSThemeForm('My Form', 'myform', 'submit.php');
$form->setRenderer(new BootstrapRenderer());
```

## Vestavěné renderery

### Bootstrap 4 Renderer

```php
use XOOPS\Form\Renderer\Bootstrap4Renderer;

$form->setRenderer(new Bootstrap4Renderer());
```

### Bootstrap 5 Renderer

```php
use XOOPS\Form\Renderer\Bootstrap5Renderer;

$form->setRenderer(new Bootstrap5Renderer([
    'floating_labels' => true,
    'validation_style' => 'tooltip'
]));
```

## Vykreslování konkrétních prvků

### Custom Select Renderer

```php
public function renderSelect(XOOPSFormSelect $select): string
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
public function renderFile(XOOPSFormFile $file): string
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

## Integrace tématu

### V šabloně motivu

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

## Nejlepší postupy

1. **Zdědit ze základního vykreslovacího modulu** – Pro konzistenci rozšiřte `XOOPSFormRenderer`
2. **Podpora všech typů prvků** – Zvládejte text, výběr, zaškrtávací políčko, rádio atd.
3. **Přístupnost** – Zahrňte správné štítky, atributy ARIA
4. **Styly ověření** – Přiměřeně zobrazí chybové stavy
5. **Responzivní design** – Zajistěte, aby formuláře fungovaly na mobilu

## Související dokumentace

- Přehled formulářů
- Odkaz na prvky formuláře
- Ověření formuláře
- Vývoj tématu