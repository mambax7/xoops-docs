---
title: "โปรแกรมสร้างแบบฟอร์มแบบกำหนดเอง"
---
## ภาพรวม

XOOPS อนุญาตให้ปรับแต่งการแสดงแบบฟอร์มผ่านตัวเรนเดอร์ที่กำหนดเอง ซึ่งช่วยให้สามารถกำหนดสไตล์เฉพาะธีม ปรับปรุงการเข้าถึง และการผสานรวมกับเฟรมเวิร์กส่วนหน้า เช่น Bootstrap หรือ Tailwind CSS

## การแสดงผลเริ่มต้น

ตามค่าเริ่มต้น แบบฟอร์ม XOOPS จะใช้คลาส `XoopsFormRenderer` ซึ่งส่งเอาต์พุต HTML พื้นฐาน:
```php
// Default rendering
$form = new XoopsThemeForm('My Form', 'myform', 'submit.php');
$form->addElement(new XoopsFormText('Name', 'name', 50, 255));
echo $form->render();
```
## สถาปัตยกรรมการเรนเดอร์แบบกำหนดเอง
```
mermaid
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
## การสร้าง Renderer แบบกำหนดเอง

### คลาสตัวเรนเดอร์พื้นฐาน
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
### การลงทะเบียน Renderer
```php
// In your module's xoops_version.php or bootstrap
$GLOBALS['xoopsOption']['form_renderer'] = new BootstrapRenderer();

// Or set it per-form
$form = new XoopsThemeForm('My Form', 'myform', 'submit.php');
$form->setRenderer(new BootstrapRenderer());
```
## ตัวเรนเดอร์ในตัว

### Bootstrap 4 เรนเดอร์
```php
use Xoops\Form\Renderer\Bootstrap4Renderer;

$form->setRenderer(new Bootstrap4Renderer());
```
### Bootstrap 5 เรนเดอร์
```php
use Xoops\Form\Renderer\Bootstrap5Renderer;

$form->setRenderer(new Bootstrap5Renderer([
    'floating_labels' => true,
    'validation_style' => 'tooltip'
]));
```
## การแสดงผลองค์ประกอบเฉพาะ

### เลือก Renderer แบบกำหนดเอง
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
### ตัวเรนเดอร์อินพุตไฟล์แบบกำหนดเอง
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
## บูรณาการธีม

### ในเทมเพลตธีม
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
## แนวทางปฏิบัติที่ดีที่สุด

1. **สืบทอดจากตัวเรนเดอร์ฐาน** - ขยาย `XoopsFormRenderer` เพื่อความสอดคล้อง
2. **รองรับองค์ประกอบทุกประเภท** - จัดการข้อความ เลือก ช่องทำเครื่องหมาย วิทยุ ฯลฯ
3. **การเข้าถึง** - รวมป้ายกำกับที่เหมาะสม แอตทริบิวต์ ARIA
4. **รูปแบบการตรวจสอบ** - แสดงสถานะข้อผิดพลาดอย่างเหมาะสม
5. **การออกแบบที่ตอบสนอง** - ตรวจสอบให้แน่ใจว่าแบบฟอร์มทำงานบนมือถือ

## เอกสารที่เกี่ยวข้อง

- ภาพรวมแบบฟอร์ม
- การอ้างอิงองค์ประกอบของแบบฟอร์ม
- การตรวจสอบแบบฟอร์ม
- การพัฒนาธีม