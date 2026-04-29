---
title: "MVC Corak dalam XOOPS"
description: "Pelaksanaan seni bina Model-View-Controller dalam XOOPS modul"
---
<span class="version-badge version-XMF">XMF Diperlukan</span> <span class="version-badge version-40x">4.0.x Native</span>

:::nota[Tidak pasti sama ada ini corak yang betul?]
Lihat [Memilih Corak Akses Data](../Choosing-Data-Access-Pattern.md) untuk mendapatkan panduan tentang masa untuk menggunakan MVC vs corak yang lebih ringkas.
:::

:::awas[Penjelasan: XOOPS Seni Bina]
**Standard XOOPS 2.5.x** menggunakan corak **Pengawal Halaman** (juga dipanggil Skrip Transaksi), bukan MVC. Modul warisan menggunakan `index.php` dengan termasuk langsung, objek global (`$xoopsUser`, `$xoopsDB`), dan akses data berasaskan pengendali.

**Untuk menggunakan MVC dalam XOOPS 2.5.x**, anda memerlukan **XMF Framework** yang menyediakan sokongan penghalaan dan pengawal.

**XOOPS 4.0** akan menyokong MVC secara asli dengan PSR-15 perisian tengah dan penghalaan yang betul.

Lihat juga: [Seni Bina XOOPS Semasa](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

Corak Model-View-Controller (MVC) ialah corak seni bina asas untuk memisahkan kebimbangan dalam modul XOOPS. Corak ini membahagikan aplikasi kepada tiga komponen yang saling berkaitan.

## MVC Penjelasan

### Model
**Model** mewakili data dan logik perniagaan aplikasi anda. Ia:
- Menguruskan kegigihan data
- Melaksanakan peraturan perniagaan
- Mengesahkan data
- Berkomunikasi dengan pangkalan data
- Bebas daripada UI### Lihat
**View** bertanggungjawab untuk membentangkan data kepada pengguna. Ia:
- Memaparkan HTML templat
- Memaparkan data model
- Mengendalikan persembahan antara muka pengguna
- Menghantar tindakan pengguna kepada pengawal
- Harus mengandungi logik yang minimum

### Pengawal
**Pengawal** mengendalikan interaksi dan koordinat pengguna antara Model dan Paparan. Ia:
- Menerima permintaan pengguna
- Memproses data input
- Kaedah model panggilan
- Memilih pandangan yang sesuai
- Menguruskan aliran aplikasi

## XOOPS Pelaksanaan

Dalam XOOPS, corak MVC dilaksanakan menggunakan pengendali dan templat dengan enjin Smarty menyediakan sokongan templat.

### Struktur Model Asas
```php
<?php
class UserModel
{
    private $db;
    
    public function getUserById($id)
    {
        // Database query implementation
    }
    
    public function createUser($data)
    {
        // Create user implementation
    }
}
?>
```
### Pelaksanaan Pengawal
```php
<?php
class UserController
{
    private $model;
    
    public function listAction()
    {
        $users = $this->model->getAllUsers();
        return ['users' => $users];
    }
}
?>
```
### Lihat Templat
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```
## Amalan Terbaik

- Simpan logik perniagaan dalam Model
- Simpan persembahan dalam Views  
- Simpan routing/coordination dalam Pengawal
- Jangan campurkan kebimbangan antara lapisan
- Sahkan semua input di peringkat Pengawal

## Dokumentasi Berkaitan

Lihat juga:
- [Repositori-Corak](../Patterns/Repository-Pattern.md) untuk capaian data lanjutan
- [Lapisan Perkhidmatan](../Patterns/Service-Layer.md) untuk abstraksi logik perniagaan
- [Kod-Organisasi](../Best-Practices/Code-Organization.md) untuk struktur projek
- [Ujian](../Best-Practices/Testing.md) untuk MVC strategi pengujian

---

Tag: #mvc #corak #senibina #pembangunanmodul #corak-reka bentuk