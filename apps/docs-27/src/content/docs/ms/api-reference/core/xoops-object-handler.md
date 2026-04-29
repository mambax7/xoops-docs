---
title: "Kelas XoopsObjectHandler"
description: "Kelas pengendali asas untuk operasi CRUD pada contoh XoopsObject dengan kegigihan pangkalan data"
---
Kelas `XoopsObjectHandler` dan sambungannya `XoopsPersistableObjectHandler` menyediakan antara muka piawai untuk melaksanakan operasi CRUD (Buat, Baca, Kemas Kini, Padam) pada kejadian `XoopsObject`. Ini melaksanakan corak Pemeta Data, memisahkan logik domain daripada akses pangkalan data.## Gambaran Keseluruhan Kelas
```
php
namespace XOOPS\Core;

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
## Hierarki Kelas
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
## XoopsObjectHandler### Pembina
```
php
public function __construct(XoopsDatabase $db)
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$db` | XoopsDatabase | Contoh sambungan pangkalan data |**Contoh:**
```
php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```
---

### ciptaMencipta contoh objek baharu.
```
php
abstract public function create(bool $isNew = true): ?XoopsObject
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$isNew` | bool | Sama ada objek baharu (lalai: benar) |**Pemulangan:** `XoopsObject|null` - Contoh objek baharu**Contoh:**
```
php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```
---

### dapatkanMendapat semula objek dengan kunci utamanya.
```
php
abstract public function get(int $id): ?XoopsObject
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$id` | int | Nilai kunci utama |**Pemulangan:** `XoopsObject|null` - Contoh objek atau batal jika tidak ditemui**Contoh:**
```
php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```
---

### masukkanMenyimpan objek ke pangkalan data (masukkan atau kemas kini).
```
php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$obj` | XoopsObject | Objek untuk disimpan |
| `$force` | bool | Paksa operasi walaupun objek tidak berubah |**Pulangan:** `bool` - Benar pada kejayaan**Contoh:**
```
php
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

### padamMemadam objek daripada pangkalan data.
```
php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$obj` | XoopsObject | Objek untuk dipadamkan |
| `$force` | bool | Paksa pemadaman |**Pulangan:** `bool` - Benar pada kejayaan**Contoh:**
```
php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```
---

## XoopsPersistableObjectHandler`XoopsPersistableObjectHandler` memanjangkan `XoopsObjectHandler` dengan kaedah tambahan untuk pertanyaan dan operasi pukal.### Pembina
```
php
public function __construct(
    XoopsDatabase $db,
    string $table,
    string $className,
    string $keyName,
    string $identifierName = ''
)
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$db` | XoopsDatabase | Sambungan pangkalan data |
| `$table` | rentetan | Nama jadual (tanpa awalan) |
| `$className` | rentetan | Nama kelas penuh objek |
| `$keyName` | rentetan | Nama medan kunci utama |
| `$identifierName` | rentetan | Medan pengecam boleh dibaca manusia |**Contoh:**
```
php
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

### getObjectsMendapatkan berbilang objek padanan kriteria.
```
php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$criteria` | Elemen Kriteria | Kriteria pertanyaan (pilihan) |
| `$idAsKey` | bool | Gunakan kunci utama sebagai kunci tatasusunan |
| `$asObject` | bool | Kembalikan objek (benar) atau tatasusunan (salah) |**Pemulangan:** `array` - Tatasusunan objek atau tatasusunan bersekutu**Contoh:**
```
php
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

### getCountMembilang objek padanan kriteria.
```
php
public function getCount(CriteriaElement $criteria = null): int
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$criteria` | Elemen Kriteria | Kriteria pertanyaan (pilihan) |**Pemulangan:** `int` - Kiraan objek yang sepadan**Contoh:**
```
php
$handler = xoops_getHandler('user');

// Count all users
$totalUsers = $handler->getCount();

// Count active users
$criteria = new Criteria('level', 0, '>');
$activeUsers = $handler->getCount($criteria);

echo "Total: $totalUsers, Active: $activeUsers";
```
---

### dapatkanSemuaMendapatkan semula semua objek (alias untuk getObjects tanpa kriteria).
```
php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$criteria` | Elemen Kriteria | Kriteria pertanyaan |
| `$fields` | tatasusunan | Medan khusus untuk mendapatkan semula |
| `$asObject` | bool | Kembali sebagai objek |
| `$idAsKey` | bool | Gunakan ID sebagai kunci tatasusunan |**Contoh:**
```
php
$handler = xoops_getHandler('module');

// Get all modules
$modules = $handler->getAll();

// Get only specific fields
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```
---

### getIdsHanya mengambil kunci utama objek yang sepadan.
```
php
public function getIds(CriteriaElement $criteria = null): array
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$criteria` | Elemen Kriteria | Kriteria pertanyaan |**Pemulangan:** `array` - Tatasusunan nilai kunci utama**Contoh:**
```
php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Array of admin user IDs
```
---

### getListMendapatkan semula senarai nilai kunci untuk lungsur turun.
```
php
public function getList(CriteriaElement $criteria = null): array
```
**Pemulangan:** `array` - Tatasusunan bersekutu [id => pengecam]**Contoh:**
```
php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// For a select dropdown
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```
---

### padamSemuaMemadam semua kriteria padanan objek.
```
php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$criteria` | Elemen Kriteria | Kriteria untuk objek dipadamkan |
| `$force` | bool | Paksa pemadaman |
| `$asObject` | bool | Muatkan objek sebelum memadam (mencetuskan peristiwa) |**Pulangan:** `bool` - Benar pada kejayaan**Contoh:**
```
php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Delete all comments for a specific article
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Delete with object loading (triggers delete events)
$handler->deleteAll($criteria, true, true);
```
---

### kemas kiniSemuaMengemas kini nilai medan untuk semua objek yang sepadan.
```
php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$fieldname` | rentetan | Medan untuk dikemas kini |
| `$fieldvalue` | bercampur | Nilai baharu |
| `$criteria` | Elemen Kriteria | Kriteria untuk mengemas kini objek |
| `$force` | bool | Paksa kemas kini |**Pulangan:** `bool` - Benar pada kejayaan**Contoh:**
```
php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Mark all articles by an author as draft
$criteria = new Criteria('author_id', $authorId);
$handler->updateAll('published', 0, $criteria);

// Update view count
$criteria = new Criteria('article_id', $id);
$handler->updateAll('views', $views + 1, $criteria);
```
---

### sisip (Dilanjutkan)Kaedah sisipan lanjutan dengan fungsi tambahan.
```
php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```
**Kelakuan:**
- Jika objek baharu (`isNew() === true`): INSERT
- Jika objek wujud (`isNew() === false`): UPDATE
- Memanggil `cleanVars()` secara automatik
- Menetapkan ID kenaikan automatik pada objek baharu**Contoh:**
```
php
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

## Fungsi Pembantu### xoops_getHandlerFungsi global untuk mendapatkan pengendali teras.
```
php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$name` | rentetan | Nama pengendali (pengguna, modul, kumpulan, dll.) |
| `$optional` | bool | Kembalikan null dan bukannya mencetuskan ralat |**Contoh:**
```
php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```
---

### xoops_getModuleHandlerMendapatkan pengendali khusus modul.
```
php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$name` | rentetan | Nama pengendali |
| `$dirname` | rentetan | Nama direktori modul |
| `$optional` | bool | Kembalikan batal apabila gagal |**Contoh:**
```
php
// Get handler from current module
$articleHandler = xoops_getModuleHandler('article');

// Get handler from specific module
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```
---

## Mencipta Pengendali Tersuai### Pelaksanaan Pengendali Asas
```
php
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
### Menggunakan Pengendali Tersuai
```
php
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
$results = $articleHandler->search('XOOPS');

// Get popular articles
$popular = $articleHandler->getPopular(5);

// Update view count
$articleHandler->incrementViews($articleId);
```
## Amalan Terbaik1. **Gunakan Kriteria untuk Pertanyaan**: Sentiasa gunakan objek Kriteria untuk pertanyaan selamat jenis2. **Perpanjang untuk Kaedah Tersuai**: Tambahkan kaedah pertanyaan khusus domain kepada pengendali3. **Timpa insert/delete**: Tambahkan operasi lata dan cap masa dalam penggantian4. **Gunakan Transaksi Di Mana Diperlukan**: Balut operasi kompleks dalam urus niaga5. **Leverage getList**: Gunakan `getList()` untuk menu lungsur terpilih untuk mengurangkan pertanyaan6. **Kunci Indeks**: Pastikan medan pangkalan data yang digunakan dalam kriteria diindeks7. **Hadkan Keputusan**: Sentiasa gunakan `setLimit()` untuk set hasil yang berpotensi besar## Dokumentasi Berkaitan- XoopsObject - Kelas objek asas
- ../Database/Criteria - Membina kriteria pertanyaan
- ../Database/XoopsDatabase - Operasi pangkalan data---

*Lihat juga: [XOOPS Kod Sumber](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*