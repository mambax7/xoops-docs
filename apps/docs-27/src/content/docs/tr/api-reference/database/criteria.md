---
title: "Kriterler ve KriterlerCompo Sınıfları"
description: "Ölçüt sınıflarını kullanarak sorgu oluşturma ve gelişmiş filtreleme"
---
`Criteria` ve `CriteriaCompo` sınıfları, karmaşık database sorguları oluşturmak için akıcı, nesne yönelimli bir arayüz sağlar. Bu sınıflar soyut SQL WHERE cümlelerini kullanarak geliştiricilerin güvenli ve okunabilir şekilde dinamik sorgular oluşturmasına olanak tanır.

## Sınıfa Genel Bakış

### Kriter Sınıfı

`Criteria` sınıfı, WHERE yan tümcesindeki tek bir koşulu temsil eder:
```php
namespace Xoops\Database;

class Criteria
{
    protected $column;
    protected $operator;
    protected $value;
    protected $function;

    public function __construct(
        string $column,
        mixed $value = null,
        string $operator = '=',
        string $function = ''
    ) {}

    public function render(string $prefix = ''): string {}
}
```
## Temel Kullanım

### Basit Kriterler
```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Single condition
$criteria = new Criteria('status', 'active');
// Renders: `status` = 'active'
```
### Farklı Operatörler
```php
// Equality (default)
$criteria = new Criteria('status', 'active', '=');

// Not equal
$criteria = new Criteria('status', 'active', '<>');

// Greater than
$criteria = new Criteria('age', 18, '>');

// Less than or equal
$criteria = new Criteria('age', 65, '<=');

// LIKE (for pattern matching)
$criteria = new Criteria('email', '%@example.com', 'LIKE');

// IN (for multiple values)
$criteria = new Criteria('status', ['active', 'pending', 'review'], 'IN');
```
## Karmaşık Sorgular Oluşturma

### AND Mantık (Varsayılan)
```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Renders: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```
### VEYA Mantık
```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```
## Depo Modeli ile Entegrasyon

### Depo Örneği
```php
namespace MyModule\Repository;

use Xoops\Database\XoopsDatabase;
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

class UserRepository
{
    private $db;
    private $table = 'users';

    public function __construct(XoopsDatabase $db)
    {
        $this->db = $db;
    }

    public function findByCriteria(CriteriaCompo $criteria): array
    {
        $sql = "SELECT * FROM {$this->table}";

        if ($criteria->count() > 0) {
            $sql .= " WHERE " . $criteria->render();
        }

        $result = $this->db->query($sql);
        $users = [];

        while ($row = $this->db->fetchArray($result)) {
            $users[] = new User($row);
        }

        return $users;
    }
}
```
## Emniyet ve Güvenlik

### Otomatik Kaçış

`Criteria` sınıfı, SQL enjeksiyonunu önlemek için değerlerden otomatik olarak çıkar:
```php
// Safe - value is automatically escaped
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Safely renders: `username` = '\''; DROP TABLE users; --'
```
## API Referans

### Kriter Yöntemleri

| Yöntem | Açıklama | Geri Dön |
|----------|----------------|-----------|
| `__construct()` | Ölçüt koşulunu başlat | geçersiz |
| `render($prefix = '')` | SQL WHERE cümleciğine işleyin | dize |
| `getColumn()` | Sütun adını alın | dize |
| `getValue()` | Karşılaştırma değerini alın | karışık |
| `getOperator()` | Karşılaştırma operatörünü edinin | dize |

### CriteriaCompo Yöntemleri

| Yöntem | Açıklama | Geri Dön |
|----------|----------------|-----------|
| `__construct($logic = 'AND')` | Bileşik kriterleri başlat | geçersiz |
| `add($criteria, $logic = null)` | Ölçüt veya iç içe bileşik ekleme | geçersiz |
| `render($prefix = '')` | WHERE cümlesini tamamlamak için oluştur | dize |
| `count()` | Kriter sayısını al | int |
| `clear()` | Tüm kriterleri kaldır | geçersiz |

## İlgili Belgeler

- XoopsDatabase - database sınıfı referansı
- ../../03-Module-Development/Patterns/Repository-Pattern - XOOPS'deki depo modeli
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - Hizmet katmanı modeli

## Sürüm Bilgisi

- **Sunulan:** XOOPS 2.5.0
- **Son Güncelleme:** XOOPS 4.0
- **Uyumluluk:** PHP 7,4+