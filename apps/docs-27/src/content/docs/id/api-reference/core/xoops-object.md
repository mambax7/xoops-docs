---
title: "Kelas XoopsObject"
description: "Kelas dasar untuk semua objek data dalam sistem XOOPS yang menyediakan manajemen properti, validasi, dan serialisasi"
---

Kelas `XoopsObject` adalah kelas dasar fundamental untuk semua objek data dalam sistem XOOPS. Ini menyediakan antarmuka standar untuk mengelola properti objek, validasi, pelacakan kotor, dan serialisasi.

## Ikhtisar Kelas

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

## Hirarki Kelas

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

## Properti

| Properti | Ketik | Visibilitas | Deskripsi |
|----------|------|------------|-------------|
| `$vars` | susunan | dilindungi | Menyimpan definisi dan nilai variabel |
| `$cleanVars` | susunan | dilindungi | Menyimpan nilai yang disanitasi untuk operasi database |
| `$isNew` | bodoh | dilindungi | Menunjukkan apakah objek baru (belum ada di database) |
| `$errors` | susunan | dilindungi | Menyimpan validasi dan pesan kesalahan |

## Konstruktor

```php
public function __construct()
```

Membuat instance XoopsObject baru. Objek ditandai sebagai baru secara default.

**Contoh:**
```php
$object = new XoopsObject();
// Object is new and has no defined variables
```

## Metode core

### initVar

Menginisialisasi definisi variabel untuk objek.

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

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$key` | tali | Nama variabel |
| `$dataType` | ke dalam | Konstanta tipe data (lihat Tipe Data) |
| `$value` | campuran | Nilai bawaan |
| `$required` | bodoh | Apakah kolom wajib diisi |
| `$maxlength` | ke dalam | Panjang maksimum untuk tipe string |
| `$options` | tali | Opsi tambahan |

**Tipe Data:**

| Konstan | Nilai | Deskripsi |
|----------|-------|-------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | Masukan kotak teks |
| `XOBJ_DTYPE_TXTAREA` | 2 | Konten area teks |
| `XOBJ_DTYPE_INT` | 3 | Nilai bilangan bulat |
| `XOBJ_DTYPE_URL` | 4 | Tali URL |
| `XOBJ_DTYPE_EMAIL` | 5 | Alamat email |
| `XOBJ_DTYPE_ARRAY` | 6 | Array berseri |
| `XOBJ_DTYPE_OTHER` | 7 | Tipe khusus |
| `XOBJ_DTYPE_SOURCE` | 8 | Kode sumber |
| `XOBJ_DTYPE_STIME` | 9 | Format waktu singkat |
| `XOBJ_DTYPE_MTIME` | 10 | Format waktu sedang |
| `XOBJ_DTYPE_LTIME` | 11 | Format lama |
| `XOBJ_DTYPE_FLOAT` | 12 | Titik mengambang |
| `XOBJ_DTYPE_DECIMAL` | 13 | Angka desimal |
| `XOBJ_DTYPE_ENUM` | 14 | Pencacahan |

**Contoh:**
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

Menetapkan nilai variabel.

```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$key` | tali | Nama variabel |
| `$value` | campuran | Nilai yang akan ditetapkan |
| `$notGpc` | bodoh | Jika benar, nilainya bukan dari GET/POST/COOKIE |

**Pengembalian:** `bool` - Benar jika berhasil, salah jika sebaliknya

**Contoh:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Not from user input
$object->setVar('status', 1);
```

---

### dapatkanVar

Mengambil nilai variabel dengan format opsional.

```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$key` | tali | Nama variabel |
| `$format` | tali | Format keluaran |

**Opsi Format:**

| Format | Deskripsi |
|--------|-------------|
| `'s'` | Tampilkan - Entitas HTML lolos untuk ditampilkan |
| `'e'` | Sunting - Untuk nilai masukan formulir |
| `'p'` | Pratinjau - Mirip dengan pertunjukan |
| `'f'` | Data formulir - Mentah untuk pemrosesan formulir |
| `'n'` | Tidak Ada - Nilai mentah, tanpa pemformatan |

**Pengembalian:** `mixed` - Nilai yang diformat

**Contoh:**
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

Menetapkan beberapa variabel sekaligus dari sebuah array.

```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$values` | susunan | Array asosiatif pasangan kunci => nilai |
| `$notGpc` | bodoh | Jika benar, nilainya bukan dari GET/POST/COOKIE |

**Contoh:**
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

### dapatkan Nilai

Mengambil semua nilai variabel.

```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$keys` | susunan | Kunci khusus untuk diambil (null untuk semua) |
| `$format` | tali | Format keluaran |
| `$maxDepth` | ke dalam | Kedalaman maksimum untuk objek bersarang |

**Pengembalian:** `array` - Rangkaian nilai asosiatif**Contoh:**
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

### tetapkanVar

Menetapkan nilai secara langsung tanpa validasi (gunakan dengan hati-hati).

```php
public function assignVar(
    string $key,
    mixed $value
): void
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$key` | tali | Nama variabel |
| `$value` | campuran | Nilai untuk ditetapkan |

**Contoh:**
```php
// Direct assignment from trusted source (e.g., database)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```

---

### cleanVars

Membersihkan semua variabel untuk operasi database.

```php
public function cleanVars(): bool
```

**Pengembalian:** `bool` - Benar jika semua variabel valid

**Contoh:**
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

### Baru

Memeriksa atau menyetel apakah objek tersebut baru.

```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```

**Contoh:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```

---

## Metode Penanganan Kesalahan

### setKesalahan

Menambahkan pesan kesalahan.

```php
public function setErrors(string|array $error): void
```

**Contoh:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```

---

### dapatkan Kesalahan

Mengambil semua pesan kesalahan.

```php
public function getErrors(): array
```

**Contoh:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```

---

### getHtmlErrors

Mengembalikan kesalahan yang diformat sebagai HTML.

```php
public function getHtmlErrors(): string
```

**Contoh:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```

---

## Metode Utilitas

### ke Array

Mengonversi objek menjadi array.

```php
public function toArray(): array
```

**Contoh:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```

---

### dapatkanVars

Mengembalikan definisi variabel.

```php
public function getVars(): array
```

**Contoh:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```

---

## Contoh Penggunaan Lengkap

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

## Praktik Terbaik

1. **Selalu Inisialisasi Variabel**: Tentukan semua variabel dalam konstruktor menggunakan `initVar()`

2. **Gunakan Tipe Data yang Sesuai**: Pilih konstanta `XOBJ_DTYPE_*` yang benar untuk validasi

3. **Tangani Input Pengguna dengan Hati-hati**: Gunakan `setVar()` dengan `$notGpc = false` untuk input pengguna

4. **Validasi Sebelum Menyimpan**: Selalu hubungi `cleanVars()` sebelum operasi database

5. **Gunakan Parameter Format**: Gunakan format yang sesuai di `getVar()` untuk konteksnya

6. **Perluas untuk Logika Kustom**: Tambahkan metode khusus domain di subkelas

## Dokumentasi Terkait

- XoopsObjectHandler - Pola handler untuk persistensi objek
- ../Database/Criteria - Pembuatan kueri dengan Kriteria
- ../Database/XoopsDatabase - Operasi basis data

---

*Lihat juga: [Kode Sumber XOOPS](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
