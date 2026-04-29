---
title: "Xoopsคลาสวัตถุ"
description: "คลาสพื้นฐานสำหรับออบเจ็กต์ข้อมูลทั้งหมดในระบบ XOOPS ที่ให้การจัดการคุณสมบัติ การตรวจสอบ และการทำให้เป็นอนุกรม"
---
คลาส `XoopsObject` เป็นคลาสพื้นฐานพื้นฐานสำหรับออบเจ็กต์ข้อมูลทั้งหมดในระบบ XOOPS โดยมีอินเทอร์เฟซมาตรฐานสำหรับการจัดการคุณสมบัติของออบเจ็กต์ การตรวจสอบ การติดตามที่สกปรก และการทำให้เป็นอนุกรม

## ภาพรวมชั้นเรียน
```php
namespace Xoops\Core;

class XoopsObject
{
    protected array $vars = [];
    protected array $cleanVars = [];
    protected bool $isNew = true;
    protected array $errors = [];
}
```
## ลำดับชั้นของชั้นเรียน
```
XoopsObject
├── XoopsUser
├── XoopsGroup
├── XoopsModule
├── XoopsBlock
├── XoopsComment
├── XoopsNotification
├── XoopsConfig
└── [Custom Module Objects]
```
## คุณสมบัติ

| คุณสมบัติ | พิมพ์ | การมองเห็น | คำอธิบาย |
|----------|-|------------|-------------|
| `$vars` | อาร์เรย์ | ป้องกัน | เก็บคำจำกัดความและค่าของตัวแปร |
| `$cleanVars` | อาร์เรย์ | ป้องกัน | เก็บค่าที่ถูกสุขอนามัยสำหรับการดำเนินการฐานข้อมูล |
| `$isNew` | บูล | ป้องกัน | ระบุว่าวัตถุใหม่ (ยังไม่มีในฐานข้อมูล) |
| `$errors` | อาร์เรย์ | ป้องกัน | เก็บการตรวจสอบและข้อความแสดงข้อผิดพลาด |

## คอนสตรัคเตอร์
```php
public function __construct()
```
สร้างอินสแตนซ์ XoopsObject ใหม่ วัตถุถูกทำเครื่องหมายว่าเป็นของใหม่ตามค่าเริ่มต้น

**ตัวอย่าง:**
```php
$object = new XoopsObject();
// Object is new and has no defined variables
```
## วิธีการหลัก

### initVar

เตรียมข้อมูลเบื้องต้นให้กับนิยามตัวแปรสำหรับอ็อบเจ็กต์
```php
public function initVar(
    string $key,
    int $dataType,
    mixed $value = null,
    bool $required = false,
    int $maxlength = null,
    string $options = ''
): void
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$key` | สตริง | ชื่อตัวแปร |
| `$dataType` | อินท์ | ค่าคงที่ชนิดข้อมูล (ดูชนิดข้อมูล) |
| `$value` | ผสม | ค่าเริ่มต้น |
| `$required` | บูล | ต้องระบุข้อมูลหรือไม่ |
| `$maxlength` | อินท์ | ความยาวสูงสุดสำหรับประเภทสตริง |
| `$options` | สตริง | ตัวเลือกเพิ่มเติม |

**ประเภทข้อมูล:**

| ค่าคงที่ | ค่า | คำอธิบาย |
|----------|-------|-------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | อินพุตกล่องข้อความ |
| `XOBJ_DTYPE_TXTAREA` | 2 | เนื้อหาพื้นที่ข้อความ |
| `XOBJ_DTYPE_INT` | 3 | ค่าจำนวนเต็ม |
| `XOBJ_DTYPE_URL` | 4 | URL สตริง |
| `XOBJ_DTYPE_EMAIL` | 5 | ที่อยู่อีเมล |
| `XOBJ_DTYPE_ARRAY` | 6 | อาร์เรย์แบบอนุกรม |
| `XOBJ_DTYPE_OTHER` | 7 | ประเภทที่กำหนดเอง |
| `XOBJ_DTYPE_SOURCE` | 8 | ซอร์สโค้ด |
| `XOBJ_DTYPE_STIME` | 9 | รูปแบบเวลาสั้น |
| `XOBJ_DTYPE_MTIME` | 10 | รูปแบบเวลากลาง |
| `XOBJ_DTYPE_LTIME` | 11 | รูปแบบเวลานาน |
| `XOBJ_DTYPE_FLOAT` | 12 | จุดลอยตัว |
| `XOBJ_DTYPE_DECIMAL` | 13 | เลขทศนิยม |
| `XOBJ_DTYPE_ENUM` | 14 | การแจงนับ |

**ตัวอย่าง:**
```php
class MyObject extends XoopsObject
{
    public function __construct()
    {
        parent::__construct();
        $this->initVar('id', XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('email', XOBJ_DTYPE_EMAIL, '', true, 100);
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('status', XOBJ_DTYPE_INT, 1, true);
    }
}
```
---

### setVar

ตั้งค่าของตัวแปร
```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$key` | สตริง | ชื่อตัวแปร |
| `$value` | ผสม | ค่าที่จะตั้งค่า |
| `$notGpc` | บูล | ถ้าเป็นจริง ค่าไม่ได้มาจาก GET/¤POST/¤COOKIE |

**ผลตอบแทน:** `bool` - จริงถ้าสำเร็จ ถ้าอย่างอื่นเป็นเท็จ

**ตัวอย่าง:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Not from user input
$object->setVar('status', 1);
```
---

###getVar

ดึงค่าของตัวแปรที่มีการจัดรูปแบบเพิ่มเติม
```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$key` | สตริง | ชื่อตัวแปร |
| `$format` | สตริง | รูปแบบเอาต์พุต |

**ตัวเลือกรูปแบบ:**

| รูปแบบ | คำอธิบาย |
|--------|-------------|
| `'s'` | แสดง - HTML เอนทิตีหนีเพื่อแสดง |
| `'e'` | แก้ไข - สำหรับค่าอินพุตของแบบฟอร์ม |
| `'p'` | ดูตัวอย่าง - คล้ายกับการแสดง |
| `'f'` | ข้อมูลแบบฟอร์ม - Raw สำหรับการประมวลผลแบบฟอร์ม |
| `'n'` | ไม่มี - ค่า Raw ไม่มีการจัดรูปแบบ |

**ผลตอบแทน:** `mixed` - ค่าที่จัดรูปแบบ

**ตัวอย่าง:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello <World>');

echo $object->getVar('title', 's'); // "Hello &lt;World&gt;"
echo $object->getVar('title', 'e'); // "Hello &lt;World&gt;" (for input value)
echo $object->getVar('title', 'n'); // "Hello <World>" (raw)

// For array data types
$object->setVar('options', ['a', 'b', 'c']);
$options = $object->getVar('options', 'n'); // Returns array
```
---

### setVars

ตั้งค่าตัวแปรหลายตัวพร้อมกันจากอาร์เรย์
```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$values` | อาร์เรย์ | อาร์เรย์ที่เชื่อมโยงของคีย์ => คู่ค่า |
| `$notGpc` | บูล | หากเป็นจริง ค่าจะไม่ได้มาจาก GET/¤POST/¤COOKIE |

**ตัวอย่าง:**
```php
$object = new MyObject();
$object->setVars([
    'title' => 'My Title',
    'content' => 'My content',
    'status' => 1
]);

// From database (not user input)
$object->setVars($row, true);
```
---

### รับค่า

ดึงค่าตัวแปรทั้งหมด
```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$keys` | อาร์เรย์ | คีย์เฉพาะที่จะดึงข้อมูล (null สำหรับทั้งหมด) |
| `$format` | สตริง | รูปแบบเอาต์พุต |
| `$maxDepth` | อินท์ | ความลึกสูงสุดสำหรับวัตถุที่ซ้อนกัน |

**ผลตอบแทน:** `array` - อาร์เรย์ของค่าที่เชื่อมโยง

**ตัวอย่าง:**
```php
$object = new MyObject();

// Get all values
$allValues = $object->getValues();

// Get specific values
$subset = $object->getValues(['title', 'status']);

// Get raw values for database
$rawValues = $object->getValues(null, 'n');
```
---

### มอบหมายVar

กำหนดค่าโดยตรงโดยไม่มีการตรวจสอบความถูกต้อง (ใช้ด้วยความระมัดระวัง)
```php
public function assignVar(
    string $key,
    mixed $value
): void
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$key` | สตริง | ชื่อตัวแปร |
| `$value` | ผสม | ค่าที่จะกำหนด |

**ตัวอย่าง:**
```php
// Direct assignment from trusted source (e.g., database)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```
---

### สะอาดวาร์ส

ฆ่าเชื้อตัวแปรทั้งหมดสำหรับการทำงานของฐานข้อมูล
```php
public function cleanVars(): bool
```
**ผลตอบแทน:** `bool` - เป็นจริงหากตัวแปรทั้งหมดถูกต้อง

**ตัวอย่าง:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$object->setVar('email', 'user@example.com');

if ($object->cleanVars()) {
    // Variables are sanitized and ready for database
    $cleanData = $object->cleanVars;
} else {
    // Validation errors occurred
    $errors = $object->getErrors();
}
```
---

### เป็นของใหม่

ตรวจสอบหรือตั้งค่าว่าวัตถุนั้นเป็นวัตถุใหม่หรือไม่
```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```
**ตัวอย่าง:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```
---

## วิธีการจัดการข้อผิดพลาด

### ตั้งค่าข้อผิดพลาด

เพิ่มข้อความแสดงข้อผิดพลาด
```php
public function setErrors(string|array $error): void
```
**ตัวอย่าง:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```
---

### รับข้อผิดพลาด

ดึงข้อความแสดงข้อผิดพลาดทั้งหมด
```php
public function getErrors(): array
```
**ตัวอย่าง:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```
---

### getHtmlErrors

ส่งกลับข้อผิดพลาดที่จัดรูปแบบเป็น HTML
```php
public function getHtmlErrors(): string
```
**ตัวอย่าง:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```
---

## วิธีการอรรถประโยชน์

### ถึง Array

แปลงวัตถุเป็นอาร์เรย์
```php
public function toArray(): array
```
**ตัวอย่าง:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```
---

### รับวาร์ส

ส่งกลับคำจำกัดความของตัวแปร
```php
public function getVars(): array
```
**ตัวอย่าง:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```
---

## ตัวอย่างการใช้งานที่สมบูรณ์
```php
<?php
/**
 * Custom Article Object
 */
class Article extends XoopsObject
{
    /**
     * Constructor - Initialize all variables
     */
    public function __construct()
    {
        parent::__construct();

        // Primary key
        $this->initVar('article_id', XOBJ_DTYPE_INT, null, false);

        // Required fields
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('author_id', XOBJ_DTYPE_INT, 0, true);

        // Optional fields
        $this->initVar('summary', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('category_id', XOBJ_DTYPE_INT, 0, false);

        // Timestamps
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('updated', XOBJ_DTYPE_INT, time(), false);

        // Status flags
        $this->initVar('published', XOBJ_DTYPE_INT, 0, false);
        $this->initVar('views', XOBJ_DTYPE_INT, 0, false);

        // Metadata as array
        $this->initVar('meta', XOBJ_DTYPE_ARRAY, [], false);
    }

    /**
     * Get formatted creation date
     */
    public function getCreatedDate(string $format = 'Y-m-d H:i:s'): string
    {
        return date($format, $this->getVar('created', 'n'));
    }

    /**
     * Check if article is published
     */
    public function isPublished(): bool
    {
        return $this->getVar('published', 'n') == 1;
    }

    /**
     * Increment view counter
     */
    public function incrementViews(): void
    {
        $views = $this->getVar('views', 'n');
        $this->setVar('views', $views + 1);
    }

    /**
     * Custom validation
     */
    public function validate(): bool
    {
        $this->errors = [];

        // Title validation
        $title = trim($this->getVar('title', 'n'));
        if (empty($title)) {
            $this->setErrors('Title is required');
        } elseif (strlen($title) < 5) {
            $this->setErrors('Title must be at least 5 characters');
        }

        // Author validation
        if ($this->getVar('author_id', 'n') <= 0) {
            $this->setErrors('Author is required');
        }

        return empty($this->errors);
    }
}

// Usage
$article = new Article();
$article->setVar('title', 'My First Article');
$article->setVar('author_id', 1);
$article->setVar('content', '<p>Article content here...</p>', true);
$article->setVar('meta', [
    'keywords' => ['xoops', 'cms', 'php'],
    'description' => 'An example article'
]);

if ($article->validate() && $article->cleanVars()) {
    // Save to database via handler
    $handler = xoops_getModuleHandler('article', 'mymodule');
    $handler->insert($article);

    echo "Article saved with ID: " . $article->getVar('article_id');
} else {
    echo "Errors: " . $article->getHtmlErrors();
}
```
## แนวทางปฏิบัติที่ดีที่สุด

1. **เริ่มต้นตัวแปรเสมอ**: กำหนดตัวแปรทั้งหมดในตัวสร้างโดยใช้ `initVar()`

2. **ใช้ประเภทข้อมูลที่เหมาะสม**: เลือกค่าคงที่ `XOBJ_DTYPE_*` ที่ถูกต้องสำหรับการตรวจสอบ

3. **จัดการอินพุตของผู้ใช้อย่างระมัดระวัง**: ใช้ `setVar()` กับ `$notGpc = false` สำหรับการป้อนข้อมูลของผู้ใช้

4. **ตรวจสอบก่อนบันทึก**: โทร `cleanVars()` ก่อนดำเนินการฐานข้อมูลทุกครั้ง

5. **ใช้พารามิเตอร์รูปแบบ**: ใช้รูปแบบที่เหมาะสมใน `getVar()` สำหรับบริบท

6. **ขยายสำหรับ Custom Logic**: เพิ่มวิธีการเฉพาะโดเมนในคลาสย่อย

## เอกสารที่เกี่ยวข้อง

- XoopsObjectHandler - รูปแบบตัวจัดการสำหรับการคงอยู่ของวัตถุ
- ../ฐานข้อมูล/เกณฑ์ - การสร้างแบบสอบถามด้วยเกณฑ์
- ../Database/XoopsDatabase - การทำงานของฐานข้อมูล

---

*ดูเพิ่มเติมที่: [XOOPS Source Code](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*