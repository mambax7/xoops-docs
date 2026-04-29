---
title: "Kelas XoopsObject"
description: "Kelas asas untuk semua objek data dalam sistem XOOPS yang menyediakan pengurusan harta, pengesahan dan penyiaran"
---
Kelas `XoopsObject` ialah kelas asas asas untuk semua objek data dalam sistem XOOPS. Ia menyediakan antara muka piawai untuk mengurus sifat objek, pengesahan, penjejakan kotor dan bersiri.## Gambaran Keseluruhan Kelas
```
php
namespace XOOPS\Core;

class XoopsObject
{
    protected array $vars = [];
    protected array $cleanVars = [];
    protected bool $isNew = true;
    protected array $errors = [];
}
```
## Hierarki Kelas
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
## Hartanah| Hartanah | Taip | Keterlihatan | Penerangan |
|----------|------|------------|-------------|
| `$vars` | tatasusunan | dilindungi | Menyimpan definisi dan nilai berubah |
| `$cleanVars` | tatasusunan | dilindungi | Menyimpan nilai bersih untuk operasi pangkalan data |
| `$isNew` | bool | dilindungi | Menunjukkan jika objek baru (belum dalam pangkalan data) |
| `$errors` | tatasusunan | dilindungi | Menyimpan mesej pengesahan dan ralat |## Pembina
```
php
public function __construct()
```
Mencipta contoh XoopsObject baharu. Objek ditandakan sebagai baharu secara lalai.**Contoh:**
```
php
$object = new XoopsObject();
// Object is new and has no defined variables
```
## Kaedah Teras### initVarMemulakan definisi pembolehubah untuk objek.
```
php
public function initVar(
    string $key,
    int $dataType,
    mixed $value = null,
    bool $required = false,
    int $maxlength = null,
    string $options = ''
): void
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$key` | rentetan | Nama pembolehubah |
| `$dataType` | int | Pemalar jenis data (lihat Jenis Data) |
| `$value` | bercampur | Nilai lalai |
| `$required` | bool | Sama ada medan diperlukan |
| `$maxlength` | int | Panjang maksimum untuk jenis rentetan |
| `$options` | rentetan | Pilihan tambahan |**Jenis Data:**| Malar | Nilai | Penerangan |
|----------|-------|-------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | Input kotak teks |
| `XOBJ_DTYPE_TXTAREA` | 2 | Kandungan Textarea |
| `XOBJ_DTYPE_INT` | 3 | Nilai integer |
| `XOBJ_DTYPE_URL` | 4 | Rentetan URL |
| `XOBJ_DTYPE_EMAIL` | 5 | Alamat e-mel |
| `XOBJ_DTYPE_ARRAY` | 6 | Tatasusunan bersiri |
| `XOBJ_DTYPE_OTHER` | 7 | Jenis tersuai |
| `XOBJ_DTYPE_SOURCE` | 8 | Kod sumber |
| `XOBJ_DTYPE_STIME` | 9 | Format masa singkat |
| `XOBJ_DTYPE_MTIME` | 10 | Format masa sederhana |
| `XOBJ_DTYPE_LTIME` | 11 | Format lama |
| `XOBJ_DTYPE_FLOAT` | 12 | Titik terapung |
| `XOBJ_DTYPE_DECIMAL` | 13 | Nombor perpuluhan |
| `XOBJ_DTYPE_ENUM` | 14 | Penghitungan |**Contoh:**
```
php
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

### setVarMenetapkan nilai pembolehubah.
```
php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$key` | rentetan | Nama pembolehubah |
| `$value` | bercampur | Nilai untuk ditetapkan |
| `$notGpc` | bool | Jika benar, nilai bukan daripada GET/POST/COOKIE |**Pemulangan:** `bool` - Benar jika berjaya, salah sebaliknya**Contoh:**
```
php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Not from user input
$object->setVar('status', 1);
```
---

### getVarMendapatkan semula nilai pembolehubah dengan pemformatan pilihan.
```
php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$key` | rentetan | Nama pembolehubah |
| `$format` | rentetan | Format output |**Pilihan Format:**| Format | Penerangan |
|--------|--------------|
| `'s'` | Tunjukkan - HTML entiti terlepas untuk paparan |
| `'e'` | Edit - Untuk nilai input borang |
| `'p'` | Pratonton - Sama seperti ditunjukkan |
| `'f'` | Data borang - Mentah untuk pemprosesan borang |
| `'n'` | Tiada - Nilai mentah, tiada pemformatan |**Pemulangan:** `mixed` - Nilai yang diformatkan**Contoh:**
```
php
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

### setVarsMenetapkan berbilang pembolehubah sekaligus daripada tatasusunan.
```
php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$values` | tatasusunan | Tatasusunan bersekutu kunci => pasangan nilai |
| `$notGpc` | bool | Jika benar, nilai bukan daripada GET/POST/COOKIE |**Contoh:**
```
php
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

### getValuesMendapatkan semula semua nilai pembolehubah.
```
php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$keys` | tatasusunan | Kekunci khusus untuk diambil (null untuk semua) |
| `$format` | rentetan | Format output |
| `$maxDepth` | int | Kedalaman maksimum untuk objek bersarang |**Pemulangan:** `array` - Tatasusunan nilai bersekutu**Contoh:**
```
php
$object = new MyObject();

// Get all values
$allValues = $object->getValues();

// Get specific values
$subset = $object->getValues(['title', 'status']);

// Get raw values for database
$rawValues = $object->getValues(null, 'n');
```
---

### assignVarBerikan nilai secara langsung tanpa pengesahan (gunakan dengan berhati-hati).
```
php
public function assignVar(
    string $key,
    mixed $value
): void
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$key` | rentetan | Nama pembolehubah |
| `$value` | bercampur | Nilai untuk diberikan |**Contoh:**
```
php
// Direct assignment from trusted source (e.g., database)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```
---

### cleanVarsMembersihkan semua pembolehubah untuk operasi pangkalan data.
```
php
public function cleanVars(): bool
```
**Pulangan:** `bool` - Benar jika semua pembolehubah adalah sah**Contoh:**
```
php
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

### adalah BaharuMenyemak atau menetapkan sama ada objek itu baharu.
```
php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```
**Contoh:**
```
php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```
---

## Kaedah Pengendalian Ralat### setErrorsMenambah mesej ralat.
```
php
public function setErrors(string|array $error): void
```
**Contoh:**
```
php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```
---

### getErrorsMendapatkan semula semua mesej ralat.
```
php
public function getErrors(): array
```
**Contoh:**
```
php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```
---

### getHtmlErrorsMengembalikan ralat yang diformatkan sebagai HTML.
```
php
public function getHtmlErrors(): string
```
**Contoh:**
```
php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```
---

## Kaedah Utiliti### kepadaArrayMenukar objek kepada tatasusunan.
```
php
public function toArray(): array
```
**Contoh:**
```
php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```
---

### getVarsMengembalikan definisi pembolehubah.
```
php
public function getVars(): array
```
**Contoh:**
```
php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```
---

## Contoh Penggunaan Lengkap
```
php
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
    'keywords' => ['XOOPS', 'cms', 'php'],
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
## Amalan Terbaik1. **Sentiasa Mulakan Pembolehubah**: Tentukan semua pembolehubah dalam pembina menggunakan `initVar()`2. **Gunakan Jenis Data yang Sesuai**: Pilih pemalar `XOBJ_DTYPE_*` yang betul untuk pengesahan3. **Kendalikan Input Pengguna Dengan Berhati-hati**: Gunakan `setVar()` dengan `$notGpc = false` untuk input pengguna4. **Sahkan Sebelum Menyimpan**: Sentiasa hubungi `cleanVars()` sebelum operasi pangkalan data5. **Gunakan Parameter Format**: Gunakan format yang sesuai dalam `getVar()` untuk konteks6. **Extend for Custom Logic**: Tambahkan kaedah khusus domain dalam subkelas## Dokumentasi Berkaitan- XoopsObjectHandler - Corak pengendali untuk kegigihan objek
- ../Database/Criteria - Pembinaan pertanyaan dengan Kriteria
- ../Database/XoopsDatabase - Operasi pangkalan data---

*Lihat juga: [XOOPS Kod Sumber](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*