---
title: "Pola Repositori di XOOPS"
description: "Implementasi lapisan abstraksi akses data"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[Tidak yakin apakah ini pola yang benar?]
Lihat [Memilih Pola Akses Data](../Choosing-Data-Access-Pattern.md) untuk pohon keputusan yang membandingkan handler, repositori, layanan, dan CQRS.
:::

:::tip[Bekerja Hari Ini & Besok]
Pola Repositori **berfungsi di XOOPS 2.5.x dan XOOPS 4.0.x**. Di 2.5.x, gabungkan `XoopsPersistableObjectHandler` yang ada ke dalam kelas Repositori untuk mendapatkan manfaat abstraksi:

| Pendekatan | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|------------|
| Akses pengendali langsung | `xoops_getModuleHandler()` | Melalui wadah DI |
| Pembungkus repositori | ✅ Direkomendasikan | ✅ Pola asli |
| Pengujian dengan tiruan | ✅ Dengan manual DI | ✅ Pengkabelan otomatis kontainer |

**Mulailah dengan pola Repositori hari ini** untuk mempersiapkan module Anda untuk migrasi XOOPS 4.0.
:::

Pola Repositori adalah pola akses data yang mengabstraksi operasi database, menyediakan antarmuka yang bersih untuk mengakses data. Ini bertindak sebagai perantara antara logika bisnis dan lapisan pemetaan data.

## Konsep Repositori

Pola Repositori menyediakan:
- Abstraksi detail implementasi database
- Mudah diejek untuk pengujian unit
- Logika akses data terpusat
- Fleksibilitas untuk mengubah database tanpa mempengaruhi logika bisnis
- Logika akses data yang dapat digunakan kembali di seluruh aplikasi

## Kapan Menggunakan Repositori

**Gunakan Repositori ketika:**
- Mentransfer data antar lapisan aplikasi
- Perlu mengubah implementasi database
- Menulis kode yang dapat diuji dengan tiruan
- Mengabstraksi pola akses data

## Pola Penerapan

```php
<?php
// Define repository interface
interface UserRepositoryInterface
{
    public function find($id);
    public function findAll($limit = null, $offset = 0);
    public function findBy(array $criteria);
    public function save($entity);
    public function update($id, $entity);
    public function delete($id);
}

// Implement repository
class UserRepository implements UserRepositoryInterface
{
    private $db;
    
    public function __construct($connection)
    {
        $this->db = $connection;
    }
    
    public function find($id)
    {
        // Implementation
    }
    
    public function save($entity)
    {
        // Implementation
    }
}
?>
```

## Penggunaan dalam Layanan

```php
<?php
class UserService
{
    private $userRepository;
    
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }
    
    public function registerUser($username, $email, $password)
    {
        // Check if user exists
        if ($this->userRepository->findByUsername($username)) {
            throw new \InvalidArgumentException('Username exists');
        }
        
        // Create user
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        return $this->userRepository->save($user);
    }
}
?>
```

## Praktik Terbaik

- Gunakan antarmuka untuk menentukan kontrak repositori
- Setiap repositori menangani satu tipe entitas
- Pertahankan logika bisnis dalam layanan, bukan repositori
- Gunakan objek entitas untuk pemetaan data
- Lemparkan pengecualian yang sesuai untuk operasi yang tidak valid

## Dokumentasi Terkait

Lihat juga:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) untuk integrasi pengontrol
- [Layer-Layanan](../Patterns/Service-Layer.md) untuk implementasi layanan
- [DTO-Pattern](DTO-Pattern.md) untuk objek transfer data
- [Pengujian](../Best-Practices/Testing.md) untuk pengujian repositori

---

Tag: #pola-repositori #akses-data #pola-desain #pengembangan-module
