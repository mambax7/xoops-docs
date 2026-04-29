---
title: "การโยกย้ายอย่างชาญฉลาด 4"
description: "คำแนะนำในการอัปเกรดเทมเพลต XOOPS จาก Smarty 3 เป็น Smarty 4"
---
คู่มือนี้ครอบคลุมถึงการเปลี่ยนแปลงและขั้นตอนการย้ายข้อมูลที่จำเป็นเมื่ออัปเกรดจาก Smarty 3 เป็น Smarty 4 ใน XOOPS การทำความเข้าใจความแตกต่างเหล่านี้ถือเป็นสิ่งสำคัญสำหรับการรักษาความเข้ากันได้กับการติดตั้ง XOOPS สมัยใหม่

## เอกสารที่เกี่ยวข้อง

- Smarty-Basics - พื้นฐานของ Smarty ใน XOOPS
- การพัฒนาธีม - การสร้างธีม XOOPS
- เทมเพลต-ตัวแปร - ตัวแปรที่มีอยู่ในเทมเพลต

## ภาพรวมของการเปลี่ยนแปลง

Smarty 4 นำเสนอการเปลี่ยนแปลงที่สำคัญหลายประการจาก Smarty 3:

1. พฤติกรรมการกำหนดตัวแปรเปลี่ยนไป
2. แท็ก `{php}` ถูกลบออกทั้งหมด
3. การแคช API เปลี่ยนแปลง
4. การปรับปรุงการจัดการตัวแก้ไข
5. การเปลี่ยนแปลงนโยบายความปลอดภัย
6. คุณลักษณะที่เลิกใช้งานถูกลบออก

## การเปลี่ยนแปลงการเข้าถึงตัวแปร

### ปัญหา

ใน Smarty 2/3 ค่าที่กำหนดสามารถเข้าถึงได้โดยตรง:
```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - worked fine *}
<img src="<{$mod_url}>/assets/images/icon.png">
```
ใน Smarty 4 ตัวแปรจะรวมอยู่ในอ็อบเจ็กต์ `Smarty_Variable`:
```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```
### โซลูชันที่ 1: เข้าถึงคุณสมบัติมูลค่า
```smarty
{* Smarty 4 - access the value property *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```
### โซลูชันที่ 2: โหมดความเข้ากันได้

เปิดใช้งานโหมดความเข้ากันได้ใน PHP:
```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```
ซึ่งช่วยให้สามารถเข้าถึงตัวแปรโดยตรงเช่น Smarty 3

### โซลูชันที่ 3: การตรวจสอบเวอร์ชันแบบมีเงื่อนไข

เขียนเทมเพลตที่ใช้งานได้ทั้งสองเวอร์ชัน:
```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```
### โซลูชันที่ 4: ฟังก์ชัน Wrapper

สร้างฟังก์ชันตัวช่วยสำหรับการมอบหมายงาน:
```php
function smartyAssign($smarty, $name, $value)
{
    if (version_compare($smarty->version, '4.0.0', '>=')) {
        // Smarty 4+ - assign normally, access via ->value in templates
        $smarty->assign($name, $value);
    } else {
        // Smarty 3 - standard assignment
        $smarty->assign($name, $value);
    }
}
```
## การลบแท็ก {php}

### ปัญหา

Smarty 3+ ไม่รองรับแท็ก `{php}` ด้วยเหตุผลด้านความปลอดภัย:
```smarty
{* This NO LONGER works in Smarty 3+ *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```
### วิธีแก้ไข: ใช้ตัวแปร Smarty
```smarty
{* Use Smarty's built-in variable access *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```
### วิธีแก้ไข: ย้ายลอจิกไปที่ PHP

ตรรกะที่ซับซ้อนควรอยู่ใน PHP ไม่ใช่เทมเพลต:
```php
// In PHP - do the processing
$catid = $downloads['cid'];
$categoryInfo = getCategoryInfo($catid);

// Assign processed data to template
$GLOBALS['xoopsTpl']->assign('category', $categoryInfo);
```

```smarty
{* In template - just display *}
<h2><{$category.name}></h2>
```
### วิธีแก้ปัญหา: ปลั๊กอินแบบกำหนดเอง

สำหรับฟังก์ชันที่นำมาใช้ซ้ำได้ ให้สร้างปลั๊กอิน Smarty:
```php
// /class/smarty/plugins/function.getcategory.php
function smarty_function_getcategory($params, $smarty)
{
    $catId = $params['id'] ?? 0;
    $categoryHandler = xoops_getModuleHandler('category', 'mymodule');
    $category = $categoryHandler->get($catId);

    if ($category) {
        $smarty->assign($params['assign'], $category->toArray());
    }
}
```

```smarty
{* In template *}
<{getcategory id=$cid assign="category"}>
<h2><{$category.name}></h2>
```
## การเปลี่ยนแปลงแคช

### แคช Smarty 3
```php
// Smarty 3 style
$smarty->caching = true;
$smarty->cache_lifetime = 3600;
$smarty->cache_dir = '/path/to/cache';

// Per-variable nocache
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```
### แคช Smarty 4
```php
// Smarty 4 style
$smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$smarty->setCacheLifetime(3600);
$smarty->setCacheDir('/path/to/cache');

// Or using properties (still works)
$smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$smarty->cache_lifetime = 3600;
```
### ค่าคงที่การแคช
```php
// Caching modes
Smarty::CACHING_OFF                  // No caching
Smarty::CACHING_LIFETIME_CURRENT     // Use cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // Use cached lifetime
```
### Nocache ในเทมเพลต
```smarty
{* Mark content as never cached *}
<{nocache}>
    <p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```
## การเปลี่ยนแปลงตัวแก้ไข

### ตัวแก้ไขสตริง

ตัวแก้ไขบางตัวถูกเปลี่ยนชื่อหรือเลิกใช้แล้ว:
```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - use 'html' instead *}
<{$text|escape:'html'}>
```
### ตัวดัดแปลงอาร์เรย์

ตัวแก้ไขอาร์เรย์ต้องมีคำนำหน้า `@`:
```smarty
{* Count array elements *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```
### ตัวแก้ไขแบบกำหนดเอง

ตัวแก้ไขแบบกำหนดเองจะต้องได้รับการลงทะเบียน:
```php
// Register a custom modifier
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // Process and return
    return processed_string($string, $param1);
}
```
## การเปลี่ยนแปลงนโยบายความปลอดภัย

### ความปลอดภัยอัจฉริยะ 4

Smarty 4 มีการรักษาความปลอดภัยเริ่มต้นที่เข้มงวดยิ่งขึ้น:
```php
// Configure security policy
$smarty->enableSecurity('Smarty_Security');

// Or create custom policy
class MySecurityPolicy extends Smarty_Security
{
    public $php_functions = ['isset', 'empty', 'count'];
    public $php_modifiers = ['escape', 'count'];
    public $allow_super_globals = false;
}

$smarty->enableSecurity(new MySecurityPolicy($smarty));
```
### ฟังก์ชั่นที่อนุญาต

ตามค่าเริ่มต้น Smarty 4 จะจำกัดฟังก์ชัน PHP ที่สามารถใช้ได้:
```smarty
{* These may be restricted *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```
กำหนดค่าฟังก์ชันที่อนุญาตหากจำเป็น:
```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```
## การอัปเดตการสืบทอดเทมเพลต

### บล็อกไวยากรณ์

ไวยากรณ์ของบล็อกยังคงเหมือนเดิม แต่มีการเปลี่ยนแปลงบางอย่าง:
```smarty
{* Parent template *}
<html>
<head>
    {block name=head}
    <title>Default Title</title>
    {/block}
</head>
<body>
    {block name=content}{/block}
</body>
</html>
```

```smarty
{* Child template *}
{extends file="parent.tpl"}

{block name=head}
    {$smarty.block.parent}  {* Include parent block content *}
    <meta name="custom" content="value">
{/block}

{block name=content}
    <h1>My Content</h1>
{/block}
```
### ผนวกและเติมหน้า
```smarty
{block name=head append}
    {* This is added after parent content *}
    <link rel="stylesheet" href="extra.css">
{/block}

{block name=scripts prepend}
    {* This is added before parent content *}
    <script src="early.js"></script>
{/block}
```
## คุณสมบัติที่เลิกใช้แล้ว

### ลบออกใน Smarty 4

| คุณสมบัติ | ทางเลือก |
|---------|-------------|
| `{php}` แท็ก | ย้ายตรรกะไปที่ PHP หรือใช้ปลั๊กอิน |
| `{include_php}` | ใช้ปลั๊กอินที่ลงทะเบียน |
| `$smarty.capture` | ยังคงใช้งานได้ แต่เลิกใช้แล้ว |
| `{strip}` มีช่องว่าง | ใช้เครื่องมือย่อขนาด |

### ใช้ทางเลือกอื่น
```smarty
{* Instead of {php} *}
{* Move to PHP and assign result *}

{* Instead of include_php *}
<{include file="db:mytemplate.tpl"}>

{* Instead of capture (still works but consider) *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
<{/capture}>
<div><{$smarty.capture.sidebar}></div>
```
## รายการตรวจสอบการย้ายถิ่นฐาน

### ก่อนการโยกย้าย

1. [ ] สำรองข้อมูลเทมเพลตทั้งหมด
2. [ ] แสดงรายการการใช้แท็ก `{php}` ทั้งหมด
3. [ ] ปลั๊กอินที่กำหนดเองของเอกสาร
4. [ ] ทดสอบการทำงานปัจจุบัน

### ระหว่างการย้ายถิ่นฐาน

1. [ ] ลบแท็ก `{php}` ทั้งหมด
2. [ ] อัปเดตไวยากรณ์การเข้าถึงตัวแปร
3. [ ] ตรวจสอบการใช้งานตัวแก้ไข
4. [ ] อัปเดตการกำหนดค่าแคช
5. [ ] ตรวจสอบการตั้งค่าความปลอดภัย

### หลังการย้ายถิ่นฐาน

1. [ ] ทดสอบเทมเพลตทั้งหมด
2. [ ] ตรวจสอบงานทุกรูปแบบ
3. [ ] ตรวจสอบการทำงานของแคช
4. [ ] ทดสอบกับบทบาทผู้ใช้ที่แตกต่างกัน

## การทดสอบความเข้ากันได้

### การตรวจจับเวอร์ชัน
```php
// Check Smarty version in PHP
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Smarty 4+ specific code
} else {
    // Smarty 3 code
}
```
### ตรวจสอบเวอร์ชันเทมเพลต
```smarty
{* Check version in template *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Smarty 4+ template code *}
<{else}>
    {* Smarty 3 template code *}
<{/if}>
```
## การเขียนเทมเพลตที่เข้ากันได้ข้าม

### แนวทางปฏิบัติที่ดีที่สุด

1. **หลีกเลี่ยงแท็ก `{php}` ทั้งหมด** - แท็กเหล่านี้ใช้ไม่ได้กับ Smarty 3+

2. **ทำให้เทมเพลตเรียบง่าย** - ตรรกะที่ซับซ้อนอยู่ใน PHP

3. **ใช้ตัวแก้ไขมาตรฐาน** - หลีกเลี่ยงตัวแก้ไขที่เลิกใช้แล้ว

4. **ทดสอบทั้งสองเวอร์ชัน** - หากคุณต้องการรองรับทั้งสองเวอร์ชัน

5. **ใช้ปลั๊กอินสำหรับการดำเนินการที่ซับซ้อน** - บำรุงรักษาได้มากขึ้น

### ตัวอย่าง: เทมเพลตที่เข้ากันได้ข้าม
```smarty
{* Works in both Smarty 3 and 4 *}
<!DOCTYPE html>
<html>
<head>
    <title><{$page_title|default:'Default Title'|escape}></title>
</head>
<body>
    <{if isset($items) && $items|@count > 0}>
        <ul>
        <{foreach $items as $item}>
            <li><{$item.name|escape}></li>
        <{/foreach}>
        </ul>
    <{else}>
        <p>No items found.</p>
    <{/if}>
</body>
</html>
```
## ปัญหาการย้ายถิ่นทั่วไป

### ปัญหา: ตัวแปรส่งคืนค่าว่าง

**ปัญหา**: `<{$mod_url}>` ไม่ส่งคืนสิ่งใดใน Smarty 4

**วิธีแก้ปัญหา**: ใช้ `<{$mod_url->value}>` หรือเปิดใช้งานโหมดความเข้ากันได้

### ปัญหา: PHP ข้อผิดพลาดของแท็ก

**ปัญหา**: เทมเพลตแสดงข้อผิดพลาดในแท็ก `{php}`¤

**วิธีแก้ปัญหา**: ลบแท็ก PHP ทั้งหมด และย้ายตรรกะไปที่ไฟล์ PHP

### ปัญหา: ไม่พบตัวแก้ไข

**ปัญหา**: ตัวแก้ไขแบบกำหนดเองแสดงข้อผิดพลาด "ตัวแก้ไขที่ไม่รู้จัก"

**วิธีแก้ปัญหา**: ลงทะเบียนตัวแก้ไขด้วย `registerPlugin()`

### ปัญหา: ข้อจำกัดด้านความปลอดภัย

**ปัญหา**: ไม่อนุญาตให้ใช้ฟังก์ชันในเทมเพลต

**วิธีแก้ไข**: เพิ่มฟังก์ชันลงในรายการที่อนุญาตของนโยบายความปลอดภัย

---

#smarty #migration #upgrade #xoops #smarty4 #ความเข้ากันได้