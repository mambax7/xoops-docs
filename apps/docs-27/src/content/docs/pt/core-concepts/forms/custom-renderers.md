---
title: "Renderizadores de Formulário Personalizados"
---

## Visão Geral

O XOOPS permite a personalização da renderização de formulário através de renderizadores personalizados. Isso permite estilo específico de tema, melhorias de acessibilidade e integração com frameworks front-end como Bootstrap ou Tailwind CSS.

## Renderização Padrão

Por padrão, os formulários XOOPS usam a classe `XoopsFormRenderer` que produz HTML básico:

```php
// Renderização padrão
$form = new XoopsThemeForm('Meu Formulário', 'myform', 'submit.php');
$form->addElement(new XoopsFormText('Nome', 'name', 50, 255));
echo $form->render();
```

## Arquitetura de Renderizador Personalizado

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

## Criando um Renderizador Personalizado

### Classe Renderizador Básica

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

        // Elemento com classes Bootstrap
        $element->setExtra($element->getExtra() . ' class="form-control"');
        $output .= $element->render();

        // Descrição
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

### Registrando o Renderizador

```php
// No arquivo xoops_version.php ou bootstrap do seu módulo
$GLOBALS['xoopsOption']['form_renderer'] = new BootstrapRenderer();

// Ou defina por formulário
$form = new XoopsThemeForm('Meu Formulário', 'myform', 'submit.php');
$form->setRenderer(new BootstrapRenderer());
```

## Renderizadores Embutidos

### Renderizador Bootstrap 4

```php
use Xoops\Form\Renderer\Bootstrap4Renderer;

$form->setRenderer(new Bootstrap4Renderer());
```

### Renderizador Bootstrap 5

```php
use Xoops\Form\Renderer\Bootstrap5Renderer;

$form->setRenderer(new Bootstrap5Renderer([
    'floating_labels' => true,
    'validation_style' => 'tooltip'
]));
```

## Renderizando Elementos Específicos

### Renderizador de Seleção Personalizado

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

### Renderizador de Entrada de Arquivo Personalizado

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

## Integração de Tema

### No Template do Tema

```smarty
{* No form.tpl do tema *}
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

## Boas Práticas

1. **Herdar do renderizador base** - Estender `XoopsFormRenderer` para consistência
2. **Suportar todos os tipos de elemento** - Lidar com texto, seleção, checkbox, rádio, etc.
3. **Acessibilidade** - Incluir labels apropriadas, atributos ARIA
4. **Estilos de validação** - Mostrar estados de erro apropriadamente
5. **Design responsivo** - Garantir que formulários funcionem em móvel

## Documentação Relacionada

- Visão Geral de Formulários
- Referência de Elementos de Formulário
- Validação de Formulário
- Desenvolvimento de Tema
