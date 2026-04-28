---
title: "自訂表單呈現器"
---

## 概述

XOOPS 允許透過自訂呈現器自訂表單呈現。這使特定主題的樣式、可存取性改進和與 Bootstrap 或 Tailwind CSS 等前端框架的整合成為可能。

## 預設呈現

預設情況下，XOOPS 表單使用 `XoopsFormRenderer` 類別，輸出基本 HTML：

```php
// 預設呈現
$form = new XoopsThemeForm('My Form', 'myform', 'submit.php');
$form->addElement(new XoopsFormText('Name', 'name', 50, 255));
echo $form->render();
```

## 自訂呈現器架構

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

## 建立自訂呈現器

### 基本呈現器類別

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

        // 標籤
        if ($element->getCaption()) {
            $output .= sprintf(
                '<label for="%s" class="form-label">%s</label>',
                $element->getName(),
                $element->getCaption()
            );
        }

        // 具有 Bootstrap 類別的元素
        $element->setExtra($element->getExtra() . ' class="form-control"');
        $output .= $element->render();

        // 描述
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

### 登錄呈現器

```php
// 在模組的 xoops_version.php 或啟動中
$GLOBALS['xoopsOption']['form_renderer'] = new BootstrapRenderer();

// 或按表單設定
$form = new XoopsThemeForm('My Form', 'myform', 'submit.php');
$form->setRenderer(new BootstrapRenderer());
```

## 內置呈現器

### Bootstrap 4 呈現器

```php
use Xoops\Form\Renderer\Bootstrap4Renderer;

$form->setRenderer(new Bootstrap4Renderer());
```

### Bootstrap 5 呈現器

```php
use Xoops\Form\Renderer\Bootstrap5Renderer;

$form->setRenderer(new Bootstrap5Renderer([
    'floating_labels' => true,
    'validation_style' => 'tooltip'
]));
```

## 呈現特定元素

### 自訂選擇呈現器

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

### 自訂檔案輸入呈現器

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

## 主題整合

### 在主題模板中

```smarty
{* 在主題的 form.tpl 中 *}
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

## 最佳實踐

1. **從基本呈現器繼承** - 擴展 `XoopsFormRenderer` 以保持一致性
2. **支援所有元素類型** - 處理文字、選擇、核取方塊、選項按鈕等
3. **可存取性** - 包含適當的標籤、ARIA 屬性
4. **驗證樣式** - 適當地顯示錯誤狀態
5. **回應式設計** - 確保表單在行動裝置上有效

## 相關文檔

- 表單概述
- 表單元素參考
- 表單驗證
- 主題開發
