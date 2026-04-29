---
title: "Corak Repositori dalam XOOPS"
description: "Pelaksanaan lapisan abstraksi capaian data"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::nota[Tidak pasti sama ada ini corak yang betul?]
Lihat [Memilih Corak Akses Data](../Choosing-Data-Access-Pattern.md) untuk mendapatkan pepohon keputusan yang membandingkan pengendali, repositori, perkhidmatan dan CQRS.
:::

:::tip[Bekerja Hari Ini & Esok]
Corak Repositori **berfungsi dalam kedua-dua XOOPS 2.5.x dan XOOPS 4.0.x**. Dalam 2.5.x, bungkus `XoopsPersistableObjectHandler` anda yang sedia ada dalam kelas Repositori untuk mendapatkan faedah pengabstrakan:

| Pendekatan | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|------------|
| Akses pengendali langsung | `xoops_getModuleHandler()` | Melalui bekas DI |
| Pembalut repositori | ✅ Disyorkan | ✅ Corak asli |
| Menguji dengan ejekan | ✅ Dengan manual DI | ✅ Pendawaian automatik kontena |

**Mulakan dengan corak Repositori hari ini** untuk menyediakan modul anda untuk XOOPS 4.0 migrasi.
:::

Corak Repositori ialah corak capaian data yang mengabstraksi operasi pangkalan data, menyediakan antara muka yang bersih untuk mengakses data. Ia bertindak sebagai orang tengah antara logik perniagaan dan lapisan pemetaan data.

## Konsep Repositori

Corak Repositori menyediakan:
- Abstraksi butiran pelaksanaan pangkalan data
- Mudah mengejek untuk ujian unit
- Logik capaian data terpusat
- Fleksibiliti untuk menukar pangkalan data tanpa menjejaskan logik perniagaan
- Logik akses data boleh guna semula merentas aplikasi## Bila Menggunakan Repositori

**Gunakan Repositori apabila:**
- Memindahkan data antara lapisan aplikasi
- Perlu menukar pelaksanaan pangkalan data
- Menulis kod yang boleh diuji dengan olok-olok
- Abstrak corak capaian data

## Corak Pelaksanaan
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
## Penggunaan dalam Perkhidmatan
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
## Amalan Terbaik

- Gunakan antara muka untuk menentukan kontrak repositori
- Setiap repositori mengendalikan satu jenis entiti
- Simpan logik perniagaan dalam perkhidmatan, bukan repositori
- Gunakan objek entiti untuk pemetaan data
- Buang pengecualian yang sesuai untuk operasi yang tidak sah

## Dokumentasi Berkaitan

Lihat juga:
- [MVC-Corak](../Patterns/MVC-Pattern.md) untuk penyepaduan pengawal
- [Lapisan Perkhidmatan](../Patterns/Service-Layer.md) untuk pelaksanaan perkhidmatan
- [DTO-Corak](DTO-Pattern.md) untuk objek pemindahan data
- [Ujian](../Best-Practices/Testing.md) untuk ujian repositori

---

Tag: #corak-repositori #akses data #corak-rekaan #pembangunan-modul