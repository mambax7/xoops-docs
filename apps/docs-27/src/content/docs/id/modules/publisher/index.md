---
title: "module Penerbit"
description: "Dokumentasi lengkap untuk module berita dan blog Penerbit untuk XOOPS"
---

> module berita dan penerbitan blog utama untuk XOOPS CMS.

---

## Ikhtisar

Publisher adalah module manajemen konten definitif untuk XOOPS, berevolusi dari SmartSection menjadi solusi blog dan berita paling kaya fitur. Ini menyediakan alat komprehensif untuk membuat, mengatur, dan menerbitkan konten dengan dukungan alur kerja editorial penuh.

**Persyaratan:**
- XOOPS 2.5.10+
- PHP 7.1+ (disarankan PHP 8.x)

---

## 🌟 Fitur Utama

### Manajemen Konten
- **Kategori & Subkategori** - Organisasi konten hierarkis
- **Pengeditan Teks Kaya** - Mendukung beberapa editor WYSIWYG
- **Lampiran File** - Melampirkan file ke artikel
- **Manajemen Gambar** - Gambar halaman dan kategori
- **Pembungkus File** - Membungkus file sebagai artikel

### Alur Kerja Penerbitan
- **Penerbitan Terjadwal** - Tetapkan tanggal penerbitan di masa mendatang
- **Tanggal Kedaluwarsa** - Konten kedaluwarsa otomatis
- **Moderasi** - Alur kerja persetujuan editorial
- **Manajemen Draf** - Simpan pekerjaan yang sedang berlangsung

### Tampilan & template
- **Empat template Dasar** - Beberapa tata letak tampilan
- **template Khusus** - Buat desain Anda sendiri
- **Optimasi SEO** - URL ramah mesin pencari
- **Desain Responsif** - Output siap seluler

### Interaksi Pengguna
- **Peringkat** - Sistem peringkat artikel
- **Komentar** - Diskusi pembaca
- **Berbagi Sosial** - Bagikan ke jejaring sosial

### Izin
- **Kontrol Pengiriman** - Siapa yang dapat mengirimkan artikel
- **Izin Tingkat Lapangan** - Kontrol bidang formulir berdasarkan grup
- **Izin Kategori** - Kontrol akses per kategori
- **Hak Moderasi** - Pengaturan moderasi global

---

## 🗂️ Bagian Isi

### Panduan Pengguna
- Panduan Instalasi
- Konfigurasi Dasar
- Membuat Artikel
- Mengelola Kategori
- Menyiapkan Izin

### Panduan Pengembang
- Memperluas Penerbit
- Membuat Template Kustom
- Referensi API
- Kait dan Acara

---

## 🚀 Mulai Cepat

### 1. Instalasi

```bash
# Download from GitHub
git clone https://github.com/XoopsModules25x/publisher.git

# Copy to modules directory
cp -r publisher /path/to/xoops/htdocs/modules/
```

Kemudian instal melalui XOOPS Admin → module → Instal.

### 2. Buat Kategori Pertama Anda

1. Buka **Admin → Penerbit → Kategori**
2. Klik **Tambahkan Kategori**
3. Isi:
   - **Nama**: Berita
   - **Deskripsi**: Berita dan pembaruan terkini
   - **Gambar**: Unggah gambar kategori
4. Simpan

### 3. Buat Artikel Pertama Anda

1. Buka **Admin → Penerbit → Artikel**
2. Klik **Tambahkan Artikel**
3. Isi:
   - **Judul**: Selamat Datang di Situs Kami
   - **Kategori**: Berita
   - **Konten**: Konten artikel Anda
4. Tetapkan **Status**: Diterbitkan
5. Simpan

---

## ⚙️ Opsi Konfigurasi

### Pengaturan Umum

| Pengaturan | Deskripsi | Bawaan |
|---------|-------------|---------|
| Penyunting | Editor WYSIWYG untuk menggunakan | XOOPS Bawaan |
| Item per halaman | Artikel ditampilkan per halaman | 10 |
| Tampilkan remah roti | Tampilkan jalur navigasi | Ya |
| Izinkan peringkat | Aktifkan peringkat artikel | Ya |
| Izinkan komentar | Aktifkan komentar artikel | Ya |

### Pengaturan SEO

| Pengaturan | Deskripsi | Bawaan |
|---------|-------------|---------|
| URL SEO | Aktifkan URL ramah | Tidak |
| URL menulis ulang | Apache mod_rewrite | Tidak ada |
| Kata kunci meta | Kata kunci yang dihasilkan secara otomatis | Ya |

### Matriks Izin

| Izin | Anonim | Terdaftar | Penyunting | Admin |
|------------|-----------|------------|--------|-------|
| Lihat artikel | ✓ | ✓ | ✓ | ✓ |
| Kirim artikel | ✗ | ✓ | ✓ | ✓ |
| Edit artikel sendiri | ✗ | ✓ | ✓ | ✓ |
| Sunting semua artikel | ✗ | ✗ | ✓ | ✓ |
| Setujui artikel | ✗ | ✗ | ✓ | ✓ |
| Kelola kategori | ✗ | ✗ | ✗ | ✓ |

---

## 📦 Struktur module

```
modules/publisher/
├── admin/                  # Admin interface
│   ├── index.php
│   ├── category.php
│   ├── item.php
│   └── menu.php
├── class/                  # PHP classes
│   ├── Category.php
│   ├── CategoryHandler.php
│   ├── Item.php
│   ├── ItemHandler.php
│   └── Helper.php
├── include/                # Include files
│   ├── common.php
│   └── functions.php
├── templates/              # Smarty templates
│   ├── publisher_index.tpl
│   ├── publisher_item.tpl
│   └── publisher_category.tpl
├── language/               # Translations
│   └── english/
├── sql/                    # Database schema
│   └── mysql.sql
├── xoops_version.php       # Module info
└── index.php               # Module entry
```

---

## 🔄 Migrasi

### Dari SmartSection

Penerbit menyertakan alat migrasi bawaan:

1. Buka **Admin → Penerbit → Impor**
2. Pilih **SmartSection** sebagai sumber
3. Pilih opsi impor:
   - Kategori
   - Artikel
   - Komentar
4. Klik **Impor**

### Dari module Berita

1. Buka **Admin → Penerbit → Impor**
2. Pilih **Berita** sebagai sumber
3. Kategori peta
4. Klik **Impor**

---

## 🔗 Dokumentasi Terkait

- Panduan Pengembangan module
- template Smarty
- Kerangka XMF

---

## 📚 Sumber Daya- [Repositori GitHub](https://github.com/XoopsModules25x/publisher)
- [Pelacak Masalah](https://github.com/XoopsModules25x/publisher/issues)
- [Tutorial Asli](https://xoops.gitbook.io/publisher-tutorial/)

---

#xoops #publisher #module #blog #news #cms #content-management
