---
title: "Kriteria dan KriteriaKelas Compo"
description: "Pembuatan kueri dan pemfilteran lanjutan menggunakan kelas Kriteria"
---

Kelas `Criteria` dan `CriteriaCompo` menyediakan antarmuka berorientasi objek yang lancar untuk membangun kueri database yang kompleks. Kelas-kelas ini mengabstraksi klausa SQL WHERE, memungkinkan pengembang membuat kueri dinamis dengan aman dan mudah dibaca.

## Ikhtisar Kelas

### Kelas Kriteria

Kelas `Criteria` mewakili kondisi tunggal dalam klausa WHERE:

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

## Penggunaan Dasar

### Kriteria Sederhana

```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Single condition
$criteria = new Criteria('status', 'active');
// Renders: `status` = 'active'
```

### Operator Berbeda

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

## Membangun Kueri yang Kompleks

### DAN Logika (Default)

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Renders: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```

### ATAU Logika

```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```

## Integrasi dengan Pola Repositori

### Contoh Repositori

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

## Keselamatan dan Keamanan

### Pelarian Otomatis

Kelas `Criteria` secara otomatis keluar dari nilai untuk mencegah injeksi SQL:

```php
// Safe - value is automatically escaped
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Safely renders: `username` = '\''; DROP TABLE users; --'
```

## Referensi API

### Metode Kriteria

| Metode | Deskripsi | Kembali |
|--------|-------------|--------|
| `__construct()` | Inisialisasi kondisi kriteria | batal |
| `render($prefix = '')` | Render ke segmen klausa SQL WHERE | tali |
| `getColumn()` | Dapatkan nama kolom | tali |
| `getValue()` | Dapatkan nilai perbandingan | campuran |
| `getOperator()` | Dapatkan operator perbandingan | tali |

### Metode KriteriaCompo

| Metode | Deskripsi | Kembali |
|--------|-------------|--------|
| `__construct($logic = 'AND')` | Inisialisasi kriteria gabungan | batal |
| `add($criteria, $logic = null)` | Tambahkan kriteria atau gabungan bertingkat | batal |
| `render($prefix = '')` | Render untuk melengkapi klausa WHERE | tali |
| `count()` | Dapatkan sejumlah kriteria | ke dalam |
| `clear()` | Hapus semua kriteria | batal |

## Dokumentasi Terkait

- XoopsDatabase - Referensi kelas database
- ../../03-Module-Development/Patterns/Repository-Pattern - Pola repositori di XOOPS
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - Pola lapisan layanan

## Informasi Versi

- **Diperkenalkan:** XOOPS 2.5.0
- **Terakhir Diperbarui:** XOOPS 4.0
- **Kompatibilitas:** PHP 7.4+
