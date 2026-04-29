---
title: "Modul Penerbit"
description: "Dokumentasi lengkap untuk modul berita dan blog Penerbit untuk XOOPS"
---
> Modul penerbitan berita dan blog terulung untuk XOOPS CMS.

---

## Gambaran Keseluruhan

Penerbit ialah modul pengurusan kandungan muktamad untuk XOOPS, berkembang daripada SmartSection untuk menjadi penyelesaian blog dan berita yang paling kaya dengan ciri. Ia menyediakan alatan yang komprehensif untuk mencipta, menyusun dan menerbitkan kandungan dengan sokongan aliran kerja editorial penuh.

**Keperluan:**
- XOOPS 2.5.10+
- PHP 7.1+ (PHP 8.x disyorkan)

---

## 🌟 Ciri Utama

### Pengurusan Kandungan
- **Kategori & Subkategori** - Organisasi kandungan hierarki
- **Pengeditan Teks Kaya** - Berbilang WYSIWYG editor disokong
- **Lampiran Fail** - Lampirkan fail pada artikel
- **Pengurusan Imej** - Imej halaman dan kategori
- **Pembungkusan Fail** - Balut fail sebagai artikel

### Aliran Kerja Penerbitan
- **Penerbitan Berjadual** - Tetapkan tarikh penerbitan masa hadapan
- **Tarikh Tamat Tempoh** - Kandungan automatik tamat tempoh
- **Kesederhanaan** - Aliran kerja kelulusan editorial
- **Pengurusan Draf** - Simpan kerja yang sedang dijalankan

### Paparan & Templat
- **Empat Templat Asas** - Berbilang susun atur paparan
- **Templat Tersuai** - Buat reka bentuk anda sendiri
- **SEO Pengoptimuman** - URL mesra enjin carian
- **Reka Bentuk Responsif** - Output sedia mudah alih

### Interaksi Pengguna
- **Penilaian** - Sistem penarafan artikel
- **Komen** - Perbincangan pembaca
- **Perkongsian Sosial** - Kongsi ke rangkaian sosial### Kebenaran
- **Kawalan Penyerahan** - Siapa yang boleh menghantar artikel
- **Kebenaran Peringkat Medan** - Kawal medan borang mengikut kumpulan
- **Kebenaran Kategori** - Kawalan akses setiap kategori
- **Hak Kesederhanaan** - Tetapan penyederhanaan global

---

## 🗂️ Kandungan Bahagian

### Panduan Pengguna
- Panduan Pemasangan
- Konfigurasi Asas
- Mencipta Artikel
- Menguruskan Kategori
- Sediakan Kebenaran

### Panduan Pembangun
- Memperluaskan Penerbit
- Mencipta Templat Tersuai
- API Rujukan
- Cangkuk dan Acara

---

## 🚀 Mula Pantas

### 1. Pemasangan
```bash
# Download from GitHub
git clone https://github.com/XoopsModules25x/publisher.git

# Copy to modules directory
cp -r publisher /path/to/xoops/htdocs/modules/
```
Kemudian pasang melalui XOOPS Admin → Modul → Pasang.

### 2. Cipta Kategori Pertama Anda

1. Pergi ke **Pentadbir → Penerbit → Kategori**
2. Klik **Tambah Kategori**
3. Isikan:
   - **Nama**: Berita
   - **Penerangan**: Berita dan kemas kini terkini
   - **Imej**: Muat naik imej kategori
4. Jimat

### 3. Cipta Artikel Pertama Anda

1. Pergi ke **Pentadbir → Penerbit → Artikel**
2. Klik **Tambah Artikel**
3. Isikan:
   - **Tajuk**: Selamat Datang ke Tapak Kami
   - **Kategori**: Berita
   - **Kandungan**: Kandungan artikel anda
4. Tetapkan **Status**: Diterbitkan
5. Jimat

---

## ⚙️ Pilihan Konfigurasi

### Tetapan Umum

| Tetapan | Penerangan | Lalai |
|---------|-------------|---------|
| Editor | WYSIWYG editor untuk menggunakan | XOOPS Lalai |
| Item setiap halaman | Artikel dipaparkan setiap halaman | 10 |
| Tunjukkan serbuk roti | Paparkan denai navigasi | Ya |
| Benarkan penilaian | Dayakan penilaian artikel | Ya |
| Benarkan ulasan | Dayakan ulasan artikel | Ya |

### SEO Tetapan

| Tetapan | Penerangan | Lalai |
|---------|-------------|---------|
| SEO URL | Dayakan URL mesra | Tidak |
| URL menulis semula | Apache mod_rewrite | Tiada |
| Kata kunci meta | Autojana kata kunci | Ya |

### Matriks Kebenaran

| Kebenaran | Tanpa Nama | Berdaftar | Editor | Pentadbir |
|------------|-----------|------------|--------|-------|
| Lihat artikel | ✓ | ✓ | ✓ | ✓ |
| Hantar artikel | ✗ | ✓ | ✓ | ✓ |
| Edit artikel sendiri | ✗ | ✓ | ✓ | ✓ |
| Edit semua artikel | ✗ | ✗ | ✓ | ✓ |
| Luluskan artikel | ✗ | ✗ | ✓ | ✓ |
| Uruskan kategori | ✗ | ✗ | ✗ | ✓ |---

## 📦 Struktur Modul
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

## 🔄 Penghijrahan

### Daripada SmartSection

Penerbit termasuk alat migrasi terbina dalam:

1. Pergi ke **Pentadbir → Penerbit → Import**
2. Pilih **SmartSection** sebagai sumber
3. Pilih pilihan import:
   - Kategori
   - Artikel
   - Komen
4. Klik **Import**

### Daripada Modul Berita

1. Pergi ke **Pentadbir → Penerbit → Import**
2. Pilih **Berita** sebagai sumber
3. Kategori peta
4. Klik **Import**

---

## 🔗 Dokumentasi Berkaitan

- Panduan Pembangunan Modul
- Templat Pintar
- XMF Rangka Kerja

---

## 📚 Sumber

- [Repositori GitHub](https://github.com/XoopsModules25x/publisher)
- [Penjejak Isu](https://github.com/XoopsModules25x/publisher/issues)
- [Tutorial Asal](https://XOOPS.gitbook.io/publisher-tutorial/)

---

#XOOPS #publisher #modul #blog #news #cms #content-management