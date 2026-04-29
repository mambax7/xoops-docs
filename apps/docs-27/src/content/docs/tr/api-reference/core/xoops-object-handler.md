---
title: "XoopsObjectHandler Sınıfı"
description: "database kalıcılığına sahip XoopsObject bulut sunucularında CRUD işlemleri için temel işleyici sınıfı"
---
`XoopsObjectHandler` sınıfı ve onun uzantısı `XoopsPersistableObjectHandler`, `XoopsObject` bulut sunucularında CRUD (Oluşturma, Okuma, Güncelleme, Silme) işlemlerini gerçekleştirmek için standartlaştırılmış bir arayüz sağlar. Bu, etki alanı mantığını database erişiminden ayıran Veri Eşleyici modelini uygular.

## Sınıfa Genel Bakış
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
## Sınıf Hiyerarşisi
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

### Yapıcı
```php
public function __construct(XoopsDatabase $db)
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$db` | XoopsDatabase | database bağlantı örneği |

**Örnek:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```
---

### oluştur

Yeni bir nesne örneği oluşturur.
```php
abstract public function create(bool $isNew = true): ?XoopsObject
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$isNew` | bool | Nesnenin yeni olup olmadığı (varsayılan: true) |

**Döndürür:** `XoopsObject|null` - Yeni nesne örneği

**Örnek:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```
---

### al

Bir nesneyi birincil anahtarına göre alır.
```php
abstract public function get(int $id): ?XoopsObject
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$id` | int | Birincil anahtar değeri |

**Döndürür:** `XoopsObject|null` - Nesne örneği veya bulunamazsa null

**Örnek:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```
---

### ekle

Bir nesneyi veritabanına kaydeder (ekleme veya güncelleme).
```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$obj` | XoopsObject | Kaydedilecek nesne |
| `$force` | bool | Nesne değişmese bile işlemi zorla |

**Dönüş:** `bool` - Başarı durumunda doğru

**Örnek:**
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

### sil

Veritabanından bir nesneyi siler.
```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$obj` | XoopsObject | Silinecek nesne |
| `$force` | bool | Silmeye zorla |

**Dönüş:** `bool` - Başarı durumunda doğru

**Örnek:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```
---

## XoopsPersistableObjectHandler

`XoopsPersistableObjectHandler`, `XoopsObjectHandler`'yi sorgulama ve toplu işlemler için ek yöntemlerle genişletir.

### Yapıcı
```php
public function __construct(
    XoopsDatabase $db,
    string $table,
    string $className,
    string $keyName,
    string $identifierName = ''
)
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$db` | XoopsDatabase | database bağlantısı |
| `$table` | dize | Tablo adı (ön ek olmadan) |
| `$className` | dize | Nesnenin tam sınıf adı |
| `$keyName` | dize | Birincil anahtar alan adı |
| `$identifierName` | dize | İnsan tarafından okunabilen tanımlayıcı alan |

**Örnek:**
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

### getObjects

Kriterlerle eşleşen birden fazla nesneyi alır.
```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$criteria` | Kriter Öğesi | Sorgu kriterleri (isteğe bağlı) |
| `$idAsKey` | bool | Birincil anahtarı dizi anahtarı olarak kullanın |
| `$asObject` | bool | Nesneleri (doğru) veya dizileri (yanlış) döndür |

**Döndürür:** `array` - Nesnelerin veya ilişkisel dizilerin dizisi

**Örnek:**
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

### getCount

Kriterlerle eşleşen nesneleri sayar.
```php
public function getCount(CriteriaElement $criteria = null): int
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$criteria` | Kriter Öğesi | Sorgu kriterleri (isteğe bağlı) |

**Döndürür:** `int` - Eşleşen nesnelerin sayısı

**Örnek:**
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

###Hepsini al

Tüm nesneleri alır (ölçütü olmayan getObjects'in takma adı).
```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$criteria` | Kriter Öğesi | Sorgu kriterleri |
| `$fields` | dizi | Alınacak belirli alanlar |
| `$asObject` | bool | Nesne olarak geri dön |
| `$idAsKey` | bool | Kimliği dizi anahtarı olarak kullan |

**Örnek:**
```php
$handler = xoops_getHandler('module');

// Get all modules
$modules = $handler->getAll();

// Get only specific fields
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```
---

### kimlikleri al

Yalnızca eşleşen nesnelerin birincil anahtarlarını alır.
```php
public function getIds(CriteriaElement $criteria = null): array
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$criteria` | Kriter Öğesi | Sorgu kriterleri |

**Döndürür:** `array` - Birincil anahtar değerleri dizisi

**Örnek:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Array of admin user IDs
```
---

### getList

Açılır listeler için anahtar/değer listesini alır.
```php
public function getList(CriteriaElement $criteria = null): array
```
**Döndürür:** `array` - İlişkisel dizi [id => tanımlayıcı]

**Örnek:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// For a select dropdown
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```
---

### Tümünü sil

Kriterlerle eşleşen tüm nesneleri siler.
```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$criteria` | Kriter Öğesi | Silinecek nesnelere ilişkin kriterler |
| `$force` | bool | Silmeye zorla |
| `$asObject` | bool | Nesneleri silmeden önce yükleyin (olayları tetikler) |

**Döndürür:** `bool` - Başarı durumunda doğru

**Örnek:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Delete all comments for a specific article
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Delete with object loading (triggers delete events)
$handler->deleteAll($criteria, true, true);
```
---

### güncellemeTümü

Eşleşen tüm nesneler için bir alan değerini günceller.
```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$fieldname` | dize | Güncellenecek alan |
| `$fieldvalue` | karışık | Yeni değer |
| `$criteria` | Kriter Öğesi | Güncellenecek nesnelere ilişkin kriterler |
| `$force` | bool | Güncellemeyi zorla |

**Returns:** `bool` - True on success

**Örnek:**
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

### ekle (Genişletilmiş)

Ek işlevlere sahip genişletilmiş ekleme yöntemi.
```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```
**Davranış:**
- Nesne yeniyse (`isNew() === true`): INSERT
- Nesne mevcutsa (`isNew() === false`): UPDATE
- Otomatik olarak `cleanVars()`'yi arar
- Yeni nesnelerde otomatik artış kimliğini ayarlar

**Örnek:**
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

## Yardımcı İşlevler

### xoops_getHandler

Bir Core işleyiciyi almak için genel işlev.
```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$name` | dize | İşleyici adı (user, module, grup vb.) |
| `$optional` | bool | Hatayı tetiklemek yerine null değerini döndürün |

**Örnek:**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```
---

### xoops_getModuleHandler

Modüle özgü bir işleyici alır.
```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$name` | dize | İşleyici adı |
| `$dirname` | dize | module dizini adı |
| `$optional` | bool | Başarısızlık durumunda null değerini döndür |

**Örnek:**
```php
// Get handler from current module
$articleHandler = xoops_getModuleHandler('article');

// Get handler from specific module
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```
---

## Özel İşleyiciler Oluşturma

### Temel İşleyici Uygulaması
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
### Özel İşleyiciyi Kullanma
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
## En İyi Uygulamalar

1. **Use Criteria for Queries**: Always use Criteria objects for type-safe queries

2. **Extend for Custom Methods**: Add domain-specific query methods to handlers

3. **Override insert/delete**: Add cascade operations and timestamps in overrides

4. **Use Transaction Where Needed**: Wrap complex operations in transactions

5. **Leverage getList**: Use `getList()` for select dropdowns to reduce queries

6. **Index Keys**: Ensure database fields used in criteria are indexed

7. **Limit Results**: Always use `setLimit()` for potentially large result sets

## İlgili Belgeler

- XoopsObject - Temel nesne sınıfı
- ../Database/Criteria - Bina sorgu kriterleri
- ../Database/XoopsDatabase - database işlemleri

---

*See also: [XOOPS Source Code](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*