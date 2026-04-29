---
title: "XoopsObject Sınıfı"
description: "XOOPS sistemindeki tüm veri nesneleri için özellik yönetimi, doğrulama ve serileştirme sağlayan temel sınıf"
---
`XoopsObject` sınıfı, XOOPS sistemindeki tüm veri nesneleri için temel temel sınıftır. Nesne özelliklerini, doğrulamayı, kirli izlemeyi ve serileştirmeyi yönetmek için standartlaştırılmış bir arayüz sağlar.

## Sınıfa Genel Bakış
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
## Sınıf Hiyerarşisi
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
## Özellikler

| Emlak | Tür | Görünürlük | Açıklama |
|----------|------|---------------|------------|
| `$vars` | dizi | korumalı | Değişken tanımlarını ve değerlerini saklar |
| `$cleanVars` | dizi | korumalı | database işlemleri için arındırılmış değerleri saklar |
| `$isNew` | bool | korumalı | Nesnenin yeni olup olmadığını belirtir (henüz veritabanında değil) |
| `$errors` | dizi | korumalı | Doğrulama ve hata mesajlarını saklar |

## Yapıcı
```php
public function __construct()
```
Yeni bir XoopsObject örneği oluşturur. Nesne varsayılan olarak yeni olarak işaretlenir.

**Örnek:**
```php
$object = new XoopsObject();
// Object is new and has no defined variables
```
## Temel Yöntemler

### initVar

Nesne için bir değişken tanımı başlatır.
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
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$key` | dize | Değişken adı |
| `$dataType` | int | Veri türü sabiti (bkz. Veri Türleri) |
| `$value` | karışık | Varsayılan değer |
| `$required` | bool | Alanın gerekli olup olmadığı |
| `$maxlength` | int | Dize türleri için maksimum uzunluk |
| `$options` | dize | Ek seçenekler |

**Veri Türleri:**

| Sabit | Değer | Açıklama |
|----------|-------|------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | Metin kutusu girişi |
| `XOBJ_DTYPE_TXTAREA` | 2 | Metin alanı içeriği |
| `XOBJ_DTYPE_INT` | 3 | Tam sayı değeri |
| `XOBJ_DTYPE_URL` | 4 | URL dize |
| `XOBJ_DTYPE_EMAIL` | 5 | E-posta adresi |
| `XOBJ_DTYPE_ARRAY` | 6 | Serileştirilmiş dizi |
| `XOBJ_DTYPE_OTHER` | 7 | Özel tip |
| `XOBJ_DTYPE_SOURCE` | 8 | Kaynak kodu |
| `XOBJ_DTYPE_STIME` | 9 | Kısa süreli format |
| `XOBJ_DTYPE_MTIME` | 10 | Orta saat formatı |
| `XOBJ_DTYPE_LTIME` | 11 | Uzun zaman formatı |
| `XOBJ_DTYPE_FLOAT` | 12 | Kayan nokta |
| `XOBJ_DTYPE_DECIMAL` | 13 | Ondalık sayı |
| `XOBJ_DTYPE_ENUM` | 14 | Numaralandırma |

**Örnek:**
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

Bir değişkenin değerini ayarlar.
```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$key` | dize | Değişken adı |
| `$value` | karışık | Ayarlanacak değer |
| `$notGpc` | bool | Doğruysa, değer GET/POST/COOKIE'den değildir |

**Döndürür:** `bool` - Başarılıysa doğru, değilse yanlış

**Örnek:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Not from user input
$object->setVar('status', 1);
```
---

### getVar

İsteğe bağlı biçimlendirmeyle bir değişkenin değerini alır.
```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$key` | dize | Değişken adı |
| `$format` | dize | Çıkış formatı |

**Biçim Seçenekleri:**

| Biçim | Açıklama |
|----------|----------------|
| `'s'` | Göster - HTML varlıklar görüntülenmek üzere kaçtı |
| `'e'` | Düzenle - Form giriş değerleri için |
| `'p'` | Önizleme - Gösteriye benzer |
| `'f'` | Form verileri - Form işleme için ham |
| `'n'` | Yok - Ham değer, biçimlendirme yok |

**Döndürür:** `mixed` - Biçimlendirilmiş değer

**Örnek:**
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

Bir diziden birden fazla değişkeni aynı anda ayarlar.
```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$values` | dizi | Anahtar => değer çiftlerinin ilişkisel dizisi |
| `$notGpc` | bool | Doğruysa, değerler GET/POST/COOKIE'den değildir |

**Örnek:**
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

### Değerleri Al

Tüm değişken değerlerini alır.
```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$keys` | dizi | Alınacak belirli anahtarlar (tümü için boş) |
| `$format` | dize | Çıkış formatı |
| `$maxDepth` | int | İç içe geçmiş nesneler için maksimum derinlik |

**Döndürür:** `array` - Değerlerin ilişkisel dizisi

**Örnek:**
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

### atamaVar

Doğrulama olmadan doğrudan bir değer atar (dikkatli kullanın).
```php
public function assignVar(
    string $key,
    mixed $value
): void
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$key` | dize | Değişken adı |
| `$value` | karışık | Atanacak değer |

**Örnek:**
```php
// Direct assignment from trusted source (e.g., database)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```
---

### cleanVars

database işlemleri için tüm değişkenleri temizler.
```php
public function cleanVars(): bool
```
**Döndürür:** `bool` - Tüm değişkenler geçerliyse doğrudur

**Örnek:**
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

###Yeni

Nesnenin yeni olup olmadığını kontrol eder veya ayarlar.
```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```
**Örnek:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```
---

## Hata İşleme Yöntemleri

### setErrors

Bir hata mesajı ekler.
```php
public function setErrors(string|array $error): void
```
**Örnek:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```
---

### getErrors

Tüm hata mesajlarını alır.
```php
public function getErrors(): array
```
**Örnek:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```
---

### getHtmlErrors

HTML olarak biçimlendirilmiş hataları döndürür.
```php
public function getHtmlErrors(): string
```
**Örnek:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```
---

## Yardımcı Yöntemler

### diziye

Nesneyi bir diziye dönüştürür.
```php
public function toArray(): array
```
**Örnek:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```
---

### getVars

Değişken tanımlarını döndürür.
```php
public function getVars(): array
```
**Örnek:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```
---

## Tam Kullanım Örneği
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
## En İyi Uygulamalar

1. **Değişkenleri Her Zaman Başlat**: Yapıcıdaki tüm değişkenleri `initVar()` kullanarak tanımlayın

2. **Uygun Veri Türlerini Kullanın**: Doğrulama için doğru `XOBJ_DTYPE_*` sabitini seçin

3. **user Girişini Dikkatli Kullanın**: user girişi için `setVar()` ile `$notGpc = false` kullanın

4. **Kaydetmeden Önce Doğrula**: database işlemlerinden önce daima `cleanVars()`'yi arayın

5. **Biçim Parametrelerini Kullan**: Bağlam için `getVar()`'deki uygun biçimi kullanın

6. **Özel Mantık için Genişlet**: Alt sınıflara alana özgü yöntemler ekleyin

## İlgili Belgeler

- XoopsObjectHandler - Nesne kalıcılığı için işleyici modeli
- ../Database/Criteria - Kriterlerle sorgulama oluşturma
- ../Database/XoopsDatabase - database işlemleri

---

*Ayrıca bakınız: [XOOPS Kaynak Kodu](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*