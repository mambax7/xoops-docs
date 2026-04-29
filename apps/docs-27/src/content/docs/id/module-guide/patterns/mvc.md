---
title: "Pola MVC di XOOPS"
description: "Implementasi arsitektur Model-View-Controller dalam module XOOPS"
---

<span class="version-badge version-xmf">XMF Diperlukan</span> <span class="version-badge version-40x">4.0.x Asli</span>

:::note[Tidak yakin apakah ini pola yang benar?]
Lihat [Memilih Pola Akses Data](../Choosing-Data-Access-Pattern.md) untuk panduan kapan menggunakan MVC vs pola yang lebih sederhana.
:::

:::hati-hati[Klarifikasi: Arsitektur XOOPS]
**Standar XOOPS 2.5.x** menggunakan pola **Pengontrol Halaman** (juga disebut Skrip Transaksi), bukan MVC. module lama menggunakan `index.php` dengan penyertaan langsung, objek global (`$xoopsUser`, `$xoopsDB`), dan akses data berbasis handler.

**Untuk menggunakan MVC di XOOPS 2.5.x**, Anda memerlukan **Kerangka XMF** yang menyediakan dukungan perutean dan pengontrol.

**XOOPS 4.0** secara asli akan mendukung MVC dengan middleware PSR-15 dan perutean yang tepat.

Lihat juga: [Arsitektur XOOPS Saat Ini](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

Pola Model-View-Controller (MVC) adalah pola arsitektur mendasar untuk memisahkan masalah dalam module XOOPS. Pola ini membagi aplikasi menjadi tiga komponen yang saling berhubungan.

## Penjelasan MVC

### Model
**Model** mewakili data dan logika bisnis aplikasi Anda. Itu:
- Mengelola persistensi data
- Menerapkan aturan bisnis
- Memvalidasi data
- Berkomunikasi dengan database
- Apakah independen dari UI

### Lihat
**Tampilan** bertanggung jawab untuk menyajikan data kepada pengguna. Itu:
- Merender template HTML
- Menampilkan data model
- Menangani presentasi antarmuka pengguna
- Mengirim tindakan pengguna ke pengontrol
- Harus mengandung logika minimal

### Pengendali
**Pengontrol** menangani interaksi pengguna dan koordinat antara Model dan Tampilan. Itu:
- Menerima permintaan pengguna
- Memproses data masukan
- Memanggil metode model
- Memilih tampilan yang sesuai
- Mengelola aliran aplikasi

## Implementasi XOOPS

Di XOOPS, pola MVC diimplementasikan menggunakan handler dan template dengan mesin Smarty yang menyediakan dukungan template.

### Struktur Model Dasar
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

### Implementasi Pengontrol
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

### Lihat template
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```

## Praktik Terbaik

- Simpan logika bisnis di Model
- Simpan presentasi dalam Tampilan  
- Simpan routing/coordination di Pengendali
- Jangan mencampuradukkan kekhawatiran antar lapisan
- Validasi semua input di level Pengendali

## Dokumentasi Terkait

Lihat juga:
- [Pola-Repositori](../Patterns/Repository-Pattern.md) untuk akses data tingkat lanjut
- [Layer-Layanan](../Patterns/Service-Layer.md) untuk abstraksi logika bisnis
- [Kode-Organisasi](../Best-Practices/Code-Organization.md) untuk struktur proyek
- [Pengujian](../Best-Practices/Testing.md) untuk strategi pengujian MVC

---

Tag: #mvc #patterns #architecture #module-development #design-patterns
