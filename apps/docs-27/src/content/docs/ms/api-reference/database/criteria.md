---
title: "Kriteria dan KriteriaKelas Kompo"
description: "Pembinaan pertanyaan dan penapisan lanjutan menggunakan kelas Kriteria"
---
Kelas `Criteria` dan `CriteriaCompo` menyediakan antara muka berorientasikan objek yang lancar untuk membina pertanyaan pangkalan data yang kompleks. Kelas ini mengabstrak klausa SQL WHERE, membenarkan pembangun membina pertanyaan dinamik dengan selamat dan boleh dibaca.## Gambaran Keseluruhan Kelas### Kelas KriteriaKelas `Criteria` mewakili satu syarat dalam klausa WHERE:
```
php
namespace XOOPS\Database;

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
## Penggunaan Asas### Kriteria Mudah
```
php
use XOOPS\Database\Criteria;
use XOOPS\Database\CriteriaCompo;

// Single condition
$criteria = new Criteria('status', 'active');
// Renders: `status` = 'active'
```
### Operator Berbeza
```
php
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
## Pertanyaan Kompleks Bangunan### DAN Logik (Lalai)
```
php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Renders: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```
### ATAU Logik
```
php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```
## Integrasi dengan Corak Repositori### Contoh Repositori
```
php
namespace MyModule\Repository;

use XOOPS\Database\XoopsDatabase;
use XOOPS\Database\Criteria;
use XOOPS\Database\CriteriaCompo;

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
## Keselamatan dan Keselamatan### Melarikan diri automatikKelas `Criteria` secara automatik melepaskan nilai untuk menghalang suntikan SQL:
```
php
// Safe - value is automatically escaped
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Safely renders: `username` = '\''; DROP TABLE users; --'
```
## Rujukan API### Kaedah Kriteria| Kaedah | Penerangan | Kembali |
|--------|--------------|--------|
| `__construct()` | Mulakan syarat kriteria | batal |
| `render($prefix = '')` | Render kepada segmen klausa SQL WHERE | rentetan |
| `getColumn()` | Dapatkan nama lajur | rentetan |
| `getValue()` | Dapatkan nilai perbandingan | bercampur |
| `getOperator()` | Dapatkan operator perbandingan | rentetan |### Kaedah KriteriaKompo| Kaedah | Penerangan | Kembali |
|--------|--------------|--------|
| `__construct($logic = 'AND')` | Mulakan kriteria komposit | batal |
| `add($criteria, $logic = null)` | Tambahkan kriteria atau komposit bersarang | batal |
| `render($prefix = '')` | Render untuk melengkapkan klausa WHERE | rentetan |
| `count()` | Dapatkan bilangan kriteria | int |
| `clear()` | Alih keluar semua kriteria | batal |## Dokumentasi Berkaitan- XoopsDatabase - Rujukan kelas pangkalan data
- ../../03-Module-Development/Patterns/Repository-Pattern - Corak repositori dalam XOOPS
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - Corak lapisan perkhidmatan## Maklumat Versi- **Diperkenalkan:** XOOPS 2.5.0
- **Terakhir Dikemas Kini:** XOOPS 4.0
- **Keserasian:** PHP 7.4+