---
title: "Membuat Halaman Pertama Anda"
description: "Panduan langkah demi langkah untuk membuat dan menerbitkan konten di XOOPS, termasuk opsi pemformatan, penyematan media, dan penerbitan"
---

# Membuat Halaman Pertama Anda di XOOPS

Pelajari cara membuat, memformat, dan mempublikasikan konten pertama Anda di XOOPS.

## Memahami Konten XOOPS

### Apa itu Page/Post?

Di XOOPS, konten dikelola melalui module. Tipe konten yang paling umum adalah:

| Ketik | Deskripsi | Kasus Penggunaan |
|---|---|---|
| **Halaman** | Konten statis | Tentang kami, Kontak, Layanan |
| **Post/Article** | Konten dengan cap waktu | Berita, Entri blog |
| **Kategori** | Organisasi konten | Konten terkait grup |
| **Komentar** | Umpan balik pengguna | Izinkan interaksi pengunjung |

Panduan ini mencakup pembuatan page/article menggunakan module konten default XOOPS.

## Mengakses Editor Konten

### Dari Panel Admin

1. Masuk ke panel admin: `http://your-domain.com/xoops/admin/`
2. Navigasikan ke **Konten > Halaman** (atau module konten Anda)
3. Klik "Tambahkan Halaman Baru" atau "Postingan Baru"

### front-end (jika Diaktifkan)

Jika XOOPS Anda dikonfigurasi untuk mengizinkan pembuatan konten front-end:

1. Masuk sebagai pengguna terdaftar
2. Buka profil Anda
3. Cari opsi "Kirim Konten".
4. Ikuti langkah yang sama di bawah ini

## Antarmuka Editor Konten

Editor konten meliputi:

```
┌─────────────────────────────────────┐
│ Content Editor                      │
├─────────────────────────────────────┤
│                                     │
│ Title: [________________]           │
│                                     │
│ Category: [Dropdown]                │
│                                     │
│ [B I U] [Link] [Image] [Video]    │
│ ┌─────────────────────────────────┐ │
│ │ Enter your content here...      │ │
│ │                                 │ │
│ │ You can use HTML tags here      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Description (Meta): [____________]  │
│                                     │
│ [Publish] [Save Draft] [Preview]   │
│                                     │
└─────────────────────────────────────┘
```

## Panduan Langkah demi Langkah: Membuat Halaman Pertama Anda

### Langkah 1: Akses Editor Konten

1. Di panel admin, klik **Konten > Halaman**
2. Klik **"Tambahkan Halaman Baru"** atau **"Buat"**
3. Anda akan melihat editor konten

### Langkah 2: Masukkan Judul Halaman

Di bidang "Judul", masukkan nama halaman Anda:

```
Title: Welcome to Our Website
```

Praktik terbaik untuk judul:
- Jelas dan deskriptif
- Sertakan kata kunci jika memungkinkan
- Idealnya 50-60 karakter
- Hindari HURUF BESAR SEMUA (sulit dibaca)
- Bersikaplah spesifik (bukan "Halaman 1")

### Langkah 3: Pilih Kategori

Pilih tempat untuk mengatur konten ini:

```
Category: [Dropdown ▼]
```

Pilihannya mungkin termasuk:
- Umum
- Berita
- Blog
- Pengumuman
- Layanan

Jika kategori tidak ada, mintalah administrator untuk membuatnya.

### Langkah 4: Tulis Konten Anda

Klik di area editor konten dan ketik teks Anda.

#### Pemformatan Teks Dasar

Gunakan bilah alat editor:

| Tombol | Aksi | Hasil |
|---|---|---|
| **B** | Tebal | **Teks ​​tebal** |
| *saya* | Miring | *Teks ​​miring* |
| <u>kamu</u> | Garis bawahi | <u>Teks yang digarisbawahi</u> |

#### Menggunakan HTML

XOOPS memungkinkan tag HTML yang aman. Contoh umum:

```html
<!-- Paragraphs -->
<p>This is a paragraph.</p>

<!-- Headings -->
<h1>Main Heading</h1>
<h2>Subheading</h2>

<!-- Lists -->
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<!-- Bold and Italic -->
<strong>Bold text</strong>
<em>Italic text</em>

<!-- Links -->
<a href="https://example.com">Link text</a>

<!-- Line breaks -->
<br>

<!-- Horizontal rule -->
<hr>
```

#### Contoh HTML Aman

**Tag yang direkomendasikan:**
- Paragraf: `<p>`, `<br>`
- Judul: `<h1>` hingga `<h6>`
- Teks: `<strong>`, `<em>`, `<u>`
- Daftar: `<ul>`, `<ol>`, `<li>`
- Tautan: `<a href="">`
- Blockquote: `<blockquote>`
- Tabel: `<table>`, `<tr>`, `<td>`

**Hindari tag ini** (mungkin dinonaktifkan demi keamanan):
- Skrip: `<script>`
- Gaya: `<style>`
- Iframe: `<iframe>` (kecuali dikonfigurasi)
- Formulir: `<form>`, `<input>`

### Langkah 5: Tambahkan Gambar

#### Opsi 1: Sisipkan Gambar URL

Menggunakan editor:

1. Klik tombol **Sisipkan Gambar** (ikon gambar)
2. Masukkan gambar URL: `https://example.com/image.jpg`
3. Masukkan teks alternatif: "Deskripsi gambar"
4. Klik "Sisipkan"

Setara dengan HTML:

```html
<img src="https://example.com/image.jpg" alt="Description">
```

#### Opsi 2: Unggah Gambar

1. Unggah gambar ke XOOPS terlebih dahulu:
   - Buka **Konten > Manajer Media**
   - Unggah gambar Anda
   - Salin gambar URL

2. Di editor konten, masukkan menggunakan URL (langkah di atas)

#### Praktik Terbaik Gambar

- Gunakan ukuran file yang sesuai (optimalkan gambar)
- Gunakan nama file deskriptif
- Selalu sertakan teks alternatif (aksesibilitas)
- Format yang didukung: JPG, PNG, GIF, WebP
- Lebar yang disarankan: 600-800 piksel untuk konten

### Langkah 6: Sematkan Media

#### Sematkan Video dari YouTube

```html
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0" allowfullscreen>
</iframe>
```

Ganti `VIDEO_ID` dengan ID video YouTube.

**Untuk menemukan ID video YouTube:**
1. Buka video di YouTube
2. URL adalah: `https://www.youtube.com/watch?v=VIDEO_ID`
3. Salin ID (karakter setelah `v=`)

#### Sematkan Video dari Vimeo

```html
<iframe src="https://player.vimeo.com/video/VIDEO_ID"
  width="640" height="360" frameborder="0"
  allow="autoplay; fullscreen" allowfullscreen>
</iframe>
```
### Langkah 7: Tambahkan Deskripsi Meta

Di bidang "Deskripsi", tambahkan ringkasan singkat:

```
Description: Learn how to get started with our website.
This page provides an overview of our services and how we can help you.
```

**Praktik terbaik deskripsi meta:**
- 150-160 karakter
- Sertakan kata kunci utama
- Harus meringkas konten secara akurat
- Digunakan dalam hasil mesin pencari
- Buatlah menarik (pengguna melihat ini)

### Langkah 8: Konfigurasikan Opsi Penerbitan

#### Status Publikasi

Pilih status publikasi:

```
Status: ☑ Published
```

Pilihan:
- **Diterbitkan:** Dapat dilihat oleh publik
- **Draf:** Hanya dapat dilihat oleh admin
- **Menunggu Peninjauan:** Menunggu persetujuan
- **Diarsipkan:** Tersembunyi namun tetap disimpan

#### Visibilitas

Tetapkan siapa yang dapat melihat konten ini:

```
Visibility: ☐ Public
           ☐ Registered Users Only
           ☐ Private (Admin Only)
```

#### Tanggal Publikasi

Tetapkan kapan konten terlihat:

```
Publish Date: [Date Picker] [Time]
```

Biarkan sebagai "Sekarang" untuk segera menerbitkan.

#### Izinkan Komentar

Mengaktifkan atau menonaktifkan komentar pengunjung:

```
Allow Comments: ☑ Yes
```

Jika diaktifkan, pengunjung dapat menambahkan masukan.

### Langkah 9: Simpan Konten Anda

Beberapa opsi penyimpanan:

```
[Publish Now]  [Save as Draft]  [Schedule]  [Preview]
```

- **Terbitkan Sekarang:** Segera tampilkan
- **Simpan sebagai Draf:** Jaga privasi untuk saat ini
- **Jadwal:** Publikasikan di date/time mendatang
- **Pratinjau:** Lihat tampilannya sebelum menyimpan

Klik pilihan Anda:

```
Click [Publish Now]
```

### Langkah 10: Verifikasi Halaman Anda

Setelah dipublikasikan, verifikasi konten Anda:

1. Buka beranda situs web Anda
2. Navigasikan ke area konten Anda
3. Cari halaman yang baru Anda buat
4. Klik untuk melihatnya
5. Periksa:
   - [ ] Konten ditampilkan dengan benar
   - [ ] Gambar muncul
   - [ ] Pemformatan terlihat bagus
   - [ ] Tautan berfungsi
   - [ ] Judul dan deskripsi benar

## Contoh: Halaman Lengkap

### Judul
```
Getting Started with XOOPS
```

### Konten
```html
<h2>Welcome to XOOPS</h2>

<p>XOOPS is a powerful and flexible open-source
content management system. It allows you to build
dynamic websites with minimal technical knowledge.</p>

<h3>Key Features</h3>

<ul>
  <li>Easy content management</li>
  <li>User registration and management</li>
  <li>Module system for extensibility</li>
  <li>Flexible theming system</li>
  <li>Built-in security features</li>
</ul>

<h3>Getting Started</h3>

<p>Here are the first steps to get your XOOPS site
running:</p>

<ol>
  <li>Configure basic settings</li>
  <li>Create your first page</li>
  <li>Set up user accounts</li>
  <li>Install additional modules</li>
  <li>Customize appearance</li>
</ol>

<img src="https://example.com/xoops-logo.jpg"
  alt="XOOPS Logo">

<p>For more information, visit
<a href="https://xoops.org/">xoops.org</a></p>
```

### Deskripsi Meta
```
Get started with XOOPS CMS. Learn about features
and the first steps to launch your dynamic website.
```

## Fitur Konten Tingkat Lanjut

### Menggunakan Editor WYSIWYG

Jika editor teks kaya diinstal:

```
[B] [I] [U] [Link] [Image] [Code] [Quote]
```

Klik tombol untuk memformat teks tanpa HTML.

### Memasukkan block Kode

Contoh kode tampilan:

```html
<pre><code>
// PHP Example
$variable = "Hello World";
echo $variable;
</code></pre>
```

### Membuat Tabel

Atur data dalam tabel:

```html
<table border="1" cellpadding="5">
  <tr>
    <th>Feature</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>Flexible</td>
    <td>Easy to customize</td>
  </tr>
  <tr>
    <td>Powerful</td>
    <td>Full-featured CMS</td>
  </tr>
</table>
```

### Kutipan Sebaris

Sorot teks penting:

```html
<blockquote>
"XOOPS is a powerful content management system
that empowers you to build dynamic websites."
</blockquote>
```

## Praktik Terbaik SEO untuk Konten

Optimalkan konten Anda untuk mesin pencari:

### Judul
- Sertakan kata kunci utama
- 50-60 karakter
- Unik per halaman

### Deskripsi Meta
- Sertakan kata kunci secara alami
- 150-160 karakter
- Menarik dan akurat

### Konten
- Tulislah secara natural, hindari penjejalan kata kunci
- Gunakan heading (h2, h3) dengan tepat
- Sertakan tautan internal ke halaman lain
- Gunakan teks alternatif pada semua gambar
- Targetkan 300+ kata untuk artikel

### Struktur URL
- Jaga agar URL tetap pendek dan deskriptif
- Gunakan tanda hubung untuk memisahkan kata
- Hindari karakter khusus
- Contoh: `/about-our-company`

## Mengelola Konten Anda

### Edit Halaman yang Ada

1. Buka **Konten > Halaman**
2. Temukan halaman Anda dalam daftar
3. Klik **Edit** atau judul halaman
4. Lakukan perubahan
5. Klik **Perbarui**

### Hapus Halaman

1. Buka **Konten > Halaman**
2. Temukan halaman Anda
3. Klik **Hapus**
4. Konfirmasikan penghapusan

### Ubah Status Publikasi

1. Buka **Konten > Halaman**
2. Temukan halaman, klik **Edit**
3. Ubah status di dropdown
4. Klik **Perbarui**

## Memecahkan Masalah Pembuatan Konten

### Konten Tidak Muncul

**Gejala:** Halaman yang dipublikasikan tidak muncul di situs web

**Solusi:**
1. Periksa status publikasi: Harus "Diterbitkan"
2. Periksa tanggal publikasi: Harus terkini atau sudah lewat
3. Periksa visibilitas: Harus "Publik"
4. Hapus cache: Admin > Alat > Hapus Cache
5. Periksa izin: Grup pengguna harus memiliki akses

### Pemformatan Tidak Berfungsi

**Gejala:** Tag atau pemformatan HTML muncul sebagai teks

**Solusi:**
1. Pastikan HTML diaktifkan di pengaturan module
2. Gunakan sintaks HTML yang tepat
3. Tutup semua tag: `<p>Text</p>`
4. Gunakan tag yang diperbolehkan saja
5. Gunakan entitas HTML: `&lt;` untuk `<`, `&amp;` untuk `&`

### Gambar Tidak Ditampilkan

**Gejala:** Gambar menunjukkan ikon rusak

**Solusi:**
1. Pastikan gambar URL sudah benar
2. Periksa apakah file gambar ada
3. Verifikasi izin yang tepat pada gambar
4. Coba unggah gambar ke XOOPS
5. Periksa pemblokiran eksternal (mungkin memerlukan CORS)

### Masalah Pengkodean Karakter

**Gejala:** Karakter khusus muncul sebagai omong kosong**Solusi:**
1. Simpan file sebagai pengkodean UTF-8
2. Pastikan rangkaian karakter halaman adalah UTF-8
3. Tambahkan ke kepala HTML: `<meta charset="UTF-8">`
4. Hindari copy-paste dari Word (gunakan teks biasa)

## Praktik Terbaik Alur Kerja Konten

### Proses yang Direkomendasikan

1. **Tulis di Editor Terlebih Dahulu:** Gunakan editor konten admin
2. **Pratinjau Sebelum Diterbitkan:** Klik tombol Pratinjau
3. **Tambahkan Metadata:** Judul lengkap, deskripsi, tag
4. **Simpan sebagai Draf Pertama:** Simpan sebagai draf agar pekerjaan tidak hilang
5. **Ulasan Akhir:** Baca ulang sebelum dipublikasikan
6. **Publikasikan:** Klik Publikasikan jika sudah siap
7. **Verifikasi:** Periksa di situs langsung
8. **Edit jika Diperlukan:** Lakukan koreksi dengan cepat

### Kontrol Versi

Selalu simpan cadangan:

1. **Sebelum Perubahan Besar:** Simpan sebagai versi baru atau cadangan
2. **Arsipkan Konten Lama:** Simpan versi yang belum dipublikasikan
3. **Tanggal Draf Anda:** Gunakan penamaan yang jelas: "Draf-Halaman-28-01-2025"

## Menerbitkan Banyak Halaman

Buat strategi konten:

```
Homepage
├── About Us
├── Services
│   ├── Service 1
│   ├── Service 2
│   └── Service 3
├── Blog
│   ├── Article 1
│   ├── Article 2
│   └── Article 3
├── Contact
└── FAQ
```

Buat halaman untuk mengikuti struktur ini.

## Langkah Selanjutnya

Setelah membuat halaman pertama Anda:

1. Siapkan akun pengguna
2. Pasang module tambahan
3. Jelajahi fitur admin
4. Konfigurasikan pengaturan
5. Optimalkan dengan pengaturan kinerja

---

**Tag:** #pembuatan konten #halaman #penerbitan #editor

**Artikel Terkait:**
- Ikhtisar Panel-Admin
- Mengelola-Pengguna
- Instalasi-module
- ../Configuration/Basic-Configuration
