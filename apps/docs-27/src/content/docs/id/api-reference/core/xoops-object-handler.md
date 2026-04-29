---
title: "Kelas XoopsObjectHandler"
description: "Kelas handler dasar untuk operasi CRUD pada instance XoopsObject dengan persistensi database"
---

Kelas `XoopsObjectHandler` dan ekstensinya `XoopsPersistableObjectHandler` menyediakan antarmuka standar untuk melakukan operasi CRUD (Buat, Baca, Perbarui, Hapus) pada instans `XoopsObject`. Ini mengimplementasikan pola Data Mapper, yang memisahkan logika domain dari akses database.

## Ikhtisar Kelas

```php
namespace Xoops\Core;

abstract class XoopsObjectHandler
{
    protected XoopsDatabase $db;

    public function __construct(XoopsDatabase $db);
    abstract public function create(bool $isNew = true);
    abstract public function get(int $id);
    abstract public function insert(XoopsObject $obj, bool $force = false): bool;
    abstract public function delete(XoopsObject $obj, bool $force = false): bool;
}
```

## Hirarki Kelas

```
XoopsObjectHandler (Abstract Base)
└── XoopsPersistableObjectHandler (Extended Implementation)
    ├── XoopsUserHandler
    ├── XoopsGroupHandler
    ├── XoopsModuleHandler
    ├── XoopsBlockHandler
    ├── XoopsConfigHandler
    └── [Custom Module Handlers]
```

## XoopsObjectHandler

### Konstruktor

```php
public function __construct(XoopsDatabase $db)
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$db` | XoopsDatabase | Contoh koneksi database |

**Contoh:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```

---

### buat

Membuat instance objek baru.

```php
abstract public function create(bool $isNew = true): ?XoopsObject
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$isNew` | bodoh | Apakah objek baru (default: true) |

**Pengembalian:** `XoopsObject|null` - Contoh objek baru

**Contoh:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```

---

### dapatkan

Mengambil objek dengan kunci utamanya.

```php
abstract public function get(int $id): ?XoopsObject
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$id` | ke dalam | Nilai kunci utama |

**Pengembalian:** `XoopsObject|null` - Contoh objek atau null jika tidak ditemukan

**Contoh:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```

---

### masukkan

Menyimpan objek ke database (memasukkan atau memperbarui).

```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$obj` | XoopsObjek | Objek untuk disimpan |
| `$force` | bodoh | Paksa operasi meskipun objek tidak berubah |

**Pengembalian:** `bool` - Benar dalam kesuksesan

**Contoh:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'testuser');
$user->setVar('email', 'test@example.com');

if ($handler->insert($user)) {
    echo "User saved with ID: " . $user->getVar('uid');
} else {
    echo "Save failed: " . implode(', ', $user->getErrors());
}
```

---

### hapus

Menghapus objek dari database.

```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$obj` | XoopsObjek | Keberatan untuk dihapus |
| `$force` | bodoh | Penghapusan paksa |

**Pengembalian:** `bool` - Benar dalam kesuksesan

**Contoh:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```

---

## XoopsPersistableObjectHandler

`XoopsPersistableObjectHandler` memperluas `XoopsObjectHandler` dengan metode tambahan untuk kueri dan operasi massal.

### Konstruktor

```php
public function __construct(
    XoopsDatabase $db,
    string $table,
    string $className,
    string $keyName,
    string $identifierName = ''
)
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$db` | XoopsDatabase | Koneksi basis data |
| `$table` | tali | Nama tabel (tanpa awalan) |
| `$className` | tali | Nama kelas lengkap objek |
| `$keyName` | tali | Nama bidang kunci utama |
| `$identifierName` | tali | Bidang pengenal yang dapat dibaca manusia |

**Contoh:**
```php
class ArticleHandler extends XoopsPersistableObjectHandler
{
    public function __construct(XoopsDatabase $db)
    {
        parent::__construct(
            $db,
            'mymodule_articles',    // Table name
            'Article',               // Class name
            'article_id',            // Primary key
            'title'                  // Identifier field
        );
    }
}
```

---

### dapatkan Objek

Mengambil beberapa objek yang cocok dengan kriteria.

```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$criteria` | Elemen Kriteria | Kriteria kueri (opsional) |
| `$idAsKey` | bodoh | Gunakan kunci utama sebagai kunci array |
| `$asObject` | bodoh | Mengembalikan objek (benar) atau array (salah) |

**Pengembalian:** `array` - Array objek atau array asosiatif

**Contoh:**
```php
$handler = xoops_getHandler('user');

// Get all active users
$criteria = new Criteria('level', 0, '>');
$users = $handler->getObjects($criteria);

// Get users with ID as key
$users = $handler->getObjects($criteria, true);
echo $users[1]->getVar('uname'); // Access by ID

// Get as arrays instead of objects
$usersArray = $handler->getObjects($criteria, false, false);
foreach ($usersArray as $userData) {
    echo $userData['uname'];
}
```

---

### dapatkan Hitungan

Menghitung objek yang cocok dengan kriteria.

```php
public function getCount(CriteriaElement $criteria = null): int
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$criteria` | Elemen Kriteria | Kriteria kueri (opsional) |

**Pengembalian:** `int` - Jumlah objek yang cocok

**Contoh:**
```php
$handler = xoops_getHandler('user');

// Count all users
$totalUsers = $handler->getCount();

// Count active users
$criteria = new Criteria('level', 0, '>');
$activeUsers = $handler->getCount($criteria);

echo "Total: $totalUsers, Active: $activeUsers";
```

---

### dapatkan Semua

Mengambil semua objek (alias untuk getObjects tanpa kriteria).

```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$criteria` | Elemen Kriteria | Kriteria kueri |
| `$fields` | susunan | Bidang khusus untuk diambil |
| `$asObject` | bodoh | Kembali sebagai objek |
| `$idAsKey` | bodoh | Gunakan ID sebagai kunci array |

**Contoh:**
```php
$handler = xoops_getHandler('module');

// Get all modules
$modules = $handler->getAll();

// Get only specific fields
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```

---

### getId

Hanya mengambil kunci utama dari objek yang cocok.

```php
public function getIds(CriteriaElement $criteria = null): array
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$criteria` | Elemen Kriteria | Kriteria kueri |

**Pengembalian:** `array` - Kumpulan nilai kunci utama**Contoh:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Array of admin user IDs
```

---

### dapatkan Daftar

Mengambil daftar nilai kunci untuk dropdown.

```php
public function getList(CriteriaElement $criteria = null): array
```

**Pengembalian:** `array` - Array asosiatif [id => pengidentifikasi]

**Contoh:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// For a select dropdown
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```

---

### hapusSemua

Menghapus semua objek yang cocok dengan kriteria.

```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$criteria` | Elemen Kriteria | Kriteria objek yang akan dihapus |
| `$force` | bodoh | Penghapusan paksa |
| `$asObject` | bodoh | Memuat objek sebelum menghapus (memicu kejadian) |

**Pengembalian:** `bool` - Benar dalam kesuksesan

**Contoh:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Delete all comments for a specific article
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Delete with object loading (triggers delete events)
$handler->deleteAll($criteria, true, true);
```

---

### perbaruiSemua

Memperbarui nilai bidang untuk semua objek yang cocok.

```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$fieldname` | tali | Bidang yang akan diperbarui |
| `$fieldvalue` | campuran | Nilai baru |
| `$criteria` | Elemen Kriteria | Kriteria objek yang akan diperbarui |
| `$force` | bodoh | Paksa pembaruan |

**Pengembalian:** `bool` - Benar dalam kesuksesan

**Contoh:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Mark all articles by an author as draft
$criteria = new Criteria('author_id', $authorId);
$handler->updateAll('published', 0, $criteria);

// Update view count
$criteria = new Criteria('article_id', $id);
$handler->updateAll('views', $views + 1, $criteria);
```

---

### sisipkan (Diperpanjang)

Metode penyisipan yang diperluas dengan fungsionalitas tambahan.

```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Perilaku:**
- Jika objek baru (`isNew() === true`): INSERT
- Jika objek ada (`isNew() === false`): UPDATE
- Memanggil `cleanVars()` secara otomatis
- Menetapkan ID kenaikan otomatis pada objek baru

**Contoh:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Create new article
$article = $handler->create();
$article->setVar('title', 'New Article');
$article->setVar('content', 'Content here');
$handler->insert($article);
echo "Created with ID: " . $article->getVar('article_id');

// Update existing article
$article = $handler->get(5);
$article->setVar('title', 'Updated Title');
$handler->insert($article);
```

---

## Fungsi Pembantu

### xoops_getHandler

Fungsi global untuk mengambil pengendali core.

```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$name` | tali | Nama handler (pengguna, module, grup, dll.) |
| `$optional` | bodoh | Kembalikan null alih-alih memicu kesalahan |

**Contoh:**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```

---

### xoops_getModuleHandler

Mengambil pengendali khusus module.

```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```

**Parameter:**

| Parameter | Ketik | Deskripsi |
|-----------|------|-------------|
| `$name` | tali | Nama pengendali |
| `$dirname` | tali | Nama direktori module |
| `$optional` | bodoh | Kembalikan null jika gagal |

**Contoh:**
```php
// Get handler from current module
$articleHandler = xoops_getModuleHandler('article');

// Get handler from specific module
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```

---

## Membuat handler Khusus

### Implementasi Pengendali Dasar

```php
<?php
namespace XoopsModules\MyModule;

use XoopsPersistableObjectHandler;
use XoopsDatabase;
use CriteriaElement;
use Criteria;
use CriteriaCompo;

/**
 * Handler for Article objects
 */
class ArticleHandler extends XoopsPersistableObjectHandler
{
    /**
     * Constructor
     */
    public function __construct(XoopsDatabase $db = null)
    {
        parent::__construct(
            $db,
            'mymodule_articles',
            Article::class,
            'article_id',
            'title'
        );
    }

    /**
     * Get published articles
     */
    public function getPublished(int $limit = 10, int $start = 0): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('published', 1));
        $criteria->add(new Criteria('publish_date', time(), '<='));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);
        $criteria->setStart($start);

        return $this->getObjects($criteria);
    }

    /**
     * Get articles by author
     */
    public function getByAuthor(int $authorId, bool $publishedOnly = true): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('author_id', $authorId));

        if ($publishedOnly) {
            $criteria->add(new Criteria('published', 1));
        }

        $criteria->setSort('created');
        $criteria->setOrder('DESC');

        return $this->getObjects($criteria);
    }

    /**
     * Get articles by category
     */
    public function getByCategory(int $categoryId, int $limit = 0): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('category_id', $categoryId));
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');

        if ($limit > 0) {
            $criteria->setLimit($limit);
        }

        return $this->getObjects($criteria);
    }

    /**
     * Search articles
     */
    public function search(string $query, array $fields = ['title', 'content']): array
    {
        $criteria = new CriteriaCompo();
        $searchCriteria = new CriteriaCompo();

        foreach ($fields as $field) {
            $searchCriteria->add(
                new Criteria($field, '%' . $query . '%', 'LIKE'),
                'OR'
            );
        }

        $criteria->add($searchCriteria);
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');

        return $this->getObjects($criteria);
    }

    /**
     * Get popular articles by view count
     */
    public function getPopular(int $limit = 5): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('views');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    /**
     * Increment view count
     */
    public function incrementViews(int $articleId): bool
    {
        $sql = sprintf(
            "UPDATE %s SET views = views + 1 WHERE article_id = %d",
            $this->db->prefix($this->table),
            $articleId
        );

        return $this->db->queryF($sql) !== false;
    }

    /**
     * Override insert for custom behavior
     */
    public function insert(\XoopsObject $obj, bool $force = false): bool
    {
        // Set updated timestamp
        $obj->setVar('updated', time());

        // If new, set created timestamp
        if ($obj->isNew()) {
            $obj->setVar('created', time());
        }

        return parent::insert($obj, $force);
    }

    /**
     * Override delete for cascade operations
     */
    public function delete(\XoopsObject $obj, bool $force = false): bool
    {
        // Delete associated comments
        $commentHandler = xoops_getModuleHandler('comment', 'mymodule');
        $criteria = new Criteria('article_id', $obj->getVar('article_id'));
        $commentHandler->deleteAll($criteria);

        return parent::delete($obj, $force);
    }
}
```

### Menggunakan handler Khusus

```php
// Get the handler
$articleHandler = xoops_getModuleHandler('article', 'mymodule');

// Create a new article
$article = $articleHandler->create();
$article->setVars([
    'title' => 'My New Article',
    'content' => 'Article content here...',
    'author_id' => $xoopsUser->getVar('uid'),
    'category_id' => 1,
    'published' => 1,
    'publish_date' => time()
]);

if ($articleHandler->insert($article)) {
    redirect_header('article.php?id=' . $article->getVar('article_id'), 2, 'Article created');
}

// Get published articles
$articles = $articleHandler->getPublished(10);

// Search articles
$results = $articleHandler->search('xoops');

// Get popular articles
$popular = $articleHandler->getPopular(5);

// Update view count
$articleHandler->incrementViews($articleId);
```

## Praktik Terbaik

1. **Gunakan Kriteria untuk Kueri**: Selalu gunakan objek Kriteria untuk kueri yang aman untuk tipe

2. **Perluas untuk Metode Kustom**: Tambahkan metode kueri khusus domain ke handler

3. **Override insert/delete**: Tambahkan operasi kaskade dan stempel waktu dalam override

4. **Gunakan Transaksi Jika Diperlukan**: Gabungkan operasi kompleks dalam transaksi

5. **Manfaatkan getList**: Gunakan `getList()` untuk dropdown pilihan guna mengurangi kueri

6. **Kunci Indeks**: Pastikan kolom database yang digunakan dalam kriteria diindeks

7. **Batasi Hasil**: Selalu gunakan `setLimit()` untuk kumpulan hasil yang berpotensi besar

## Dokumentasi Terkait

- XoopsObject - Kelas objek dasar
- ../Database/Criteria - Membangun kriteria kueri
- ../Database/XoopsDatabase - Operasi basis data

---

*Lihat juga: [Kode Sumber XOOPS](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
