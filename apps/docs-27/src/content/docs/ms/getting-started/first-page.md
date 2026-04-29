---
title: "Mencipta Halaman Pertama Anda"
description: "Panduan langkah demi langkah untuk mencipta dan menerbitkan kandungan dalam XOOPS, termasuk pilihan pemformatan, pembenaman media dan penerbitan"
---
# Mencipta Halaman Pertama Anda dalam XOOPSKetahui cara membuat, memformat dan menerbitkan kandungan pertama anda dalam XOOPS.## Memahami Kandungan XOOPS### Apakah itu Page/Post?Dalam XOOPS, kandungan diuruskan melalui modul. Jenis kandungan yang paling biasa ialah:| Taip | Penerangan | Kes Penggunaan |
|---|---|---|
| **Halaman** | Kandungan statik | Mengenai kami, Kenalan, Perkhidmatan |
| **Post/Article** | Kandungan dicap masa | Berita, Catatan blog |
| **Kategori** | Organisasi kandungan | Kandungan berkaitan kumpulan |
| **Ulasan** | Maklum balas pengguna | Benarkan interaksi pelawat |Panduan ini merangkumi mencipta page/article asas menggunakan modul kandungan lalai XOOPS.## Mengakses Editor Kandungan### Daripada Panel Pentadbiran1. Log masuk ke panel pentadbir: `http://your-domain.com/XOOPS/admin/`
2. Navigasi ke **Kandungan > Halaman** (atau modul kandungan anda)
3. Klik "Tambah Halaman Baharu" atau "Siaran Baharu"### Bahagian hadapan (jika Didayakan)Jika XOOPS anda dikonfigurasikan untuk membenarkan penciptaan kandungan bahagian hadapan:1. Log masuk sebagai pengguna berdaftar
2. Pergi ke profil anda
3. Cari pilihan "Serahkan Kandungan".
4. Ikuti langkah yang sama di bawah## Antara Muka Editor KandunganEditor kandungan termasuk:
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
## Panduan Langkah demi Langkah: Mencipta Halaman Pertama Anda### Langkah 1: Akses Editor Kandungan1. Dalam panel pentadbir, klik **Kandungan > Halaman**
2. Klik **"Tambah Halaman Baharu"** atau **"Buat"**
3. Anda akan melihat penyunting kandungan### Langkah 2: Masukkan Tajuk HalamanDalam medan "Tajuk", masukkan nama halaman anda:
```
Title: Welcome to Our Website
```
Amalan terbaik untuk tajuk:
- Jelas dan deskriptif
- Sertakan kata kunci jika boleh
- 50-60 aksara sesuai
- Elakkan SEMUA CAPS (sukar dibaca)
- Jadi khusus (bukan "Halaman 1")### Langkah 3: Pilih KategoriPilih tempat untuk menyusun kandungan ini:
```
Category: [Dropdown ▼]
```
Pilihan mungkin termasuk:
- Umum
- Berita
- Blog
- Pengumuman
- PerkhidmatanJika kategori tidak wujud, minta pentadbir untuk menciptanya.### Langkah 4: Tulis Kandungan AndaKlik di kawasan editor kandungan dan taip teks anda.#### Pemformatan Teks AsasGunakan bar alat editor:| Butang | Tindakan | Keputusan |
|---|---|---|
| **B** | Berani | **Teks ​​tebal** |
| *Saya* | Italic | *Teks ​​condong* |
| <u>U</u> | Garis bawah | <u>Teks bergaris bawah</u> |#### Menggunakan HTMLXOOPS membenarkan teg HTML selamat. Contoh biasa:
```
html
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
#### Contoh HTML Selamat**Tag yang disyorkan:**
- Perenggan: `<p>`, `<br>`
- Tajuk: `<h1>` hingga `<h6>`
- Teks: `<strong>`, `<em>`, `<u>`
- Senarai: `<ul>`, `<ol>`, `<li>`
- Pautan: `<a href="">`
- Sebut Harga: `<blockquote>`
- Jadual: `<table>`, `<tr>`, `<td>`**Elakkan teg ini** (mungkin dilumpuhkan untuk keselamatan):
- Skrip: `<script>`
- Gaya: `<style>`
- Iframes: `<iframe>` (melainkan dikonfigurasikan)
- Borang: `<form>`, `<input>`### Langkah 5: Tambah Imej#### Pilihan 1: Masukkan URL ImejMenggunakan editor:1. Klik butang **Sisipkan Imej** (ikon imej)
2. Masukkan URL imej: `https://example.com/image.jpg`
3. Masukkan teks alt: "Perihalan imej"
4. Klik "Sisipkan"HTML setara:
```
html
<img src="https://example.com/image.jpg" alt="Description">
```
#### Pilihan 2: Muat Naik Imej1. Muat naik imej ke XOOPS dahulu:
   - Pergi ke **Kandungan > Pengurus Media**
   - Muat naik imej anda
   - Salin URL imej2. Dalam editor kandungan, sisipkan menggunakan URL (langkah di atas)#### Amalan Terbaik Imej- Gunakan saiz fail yang sesuai (optimumkan imej)
- Gunakan nama fail deskriptif
- Sentiasa sertakan teks alt (kebolehcapaian)
- Format yang disokong: JPG, PNG, GIF, WebP
- Lebar yang disyorkan: 600-800 piksel untuk kandungan### Langkah 6: Benamkan Media#### Benamkan Video daripada YouTube
```
html
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0" allowfullscreen>
</iframe>
```
Gantikan `VIDEO_ID` dengan ID video YouTube.**Untuk mencari ID video YouTube:**
1. Buka video di YouTube
2. URL ialah: `https://www.youtube.com/watch?v=VIDEO_ID`
3. Salin ID (aksara selepas `v=`)#### Benamkan Video daripada Vimeo
```
html
<iframe src="https://player.vimeo.com/video/VIDEO_ID"
  width="640" height="360" frameborder="0"
  allow="autoplay; fullscreen" allowfullscreen>
</iframe>
```
### Langkah 7: Tambah Perihalan MetaDalam medan "Perihalan", tambahkan ringkasan ringkas:
```
Description: Learn how to get started with our website.
This page provides an overview of our services and how we can help you.
```
**Amalan terbaik perihalan meta:**
- 150-160 aksara
- Sertakan kata kunci utama
- Harus meringkaskan kandungan dengan tepat
- Digunakan dalam hasil carian enjin
- Jadikan ia menarik (pengguna lihat ini)### Langkah 8: Konfigurasikan Pilihan Penerbitan#### Status TerbitPilih status penerbitan:
```
Status: ☑ Published
```
Pilihan:
- **Diterbitkan:** Kelihatan kepada umum
- **Draf:** Hanya kelihatan kepada pentadbir
- **Semakan Belum Selesai:** Menunggu kelulusan
- **Diarkibkan:** Disembunyikan tetapi disimpan#### KeterlihatanTetapkan siapa yang boleh melihat kandungan ini:
```
Visibility: ☐ Public
           ☐ Registered Users Only
           ☐ Private (Admin Only)
```
#### Tarikh PenerbitanTetapkan apabila kandungan menjadi kelihatan:
```
Publish Date: [Date Picker] [Time]
```
Tinggalkan sebagai "Sekarang" untuk menerbitkan serta-merta.#### Benarkan KomenDayakan atau lumpuhkan ulasan pelawat:
```
Allow Comments: ☑ Yes
```
Jika didayakan, pelawat boleh menambah maklum balas.### Langkah 9: Simpan Kandungan AndaPelbagai pilihan simpan:
```
[Publish Now]  [Save as Draft]  [Schedule]  [Preview]
```
- **Terbitkan Sekarang:** Jadikan kelihatan serta-merta
- **Simpan sebagai Draf:** Simpan peribadi buat masa ini
- **Jadual:** Terbitkan pada date/time akan datang
- **Pratonton:** Lihat penampilannya sebelum menyimpanKlik pilihan anda:
```
Click [Publish Now]
```
### Langkah 10: Sahkan Halaman AndaSelepas menerbitkan, sahkan kandungan anda:1. Pergi ke halaman utama tapak web anda
2. Navigasi ke kawasan kandungan anda
3. Cari halaman anda yang baru dibuat
4. Klik untuk melihatnya
5. Semak:
   - [ ] Kandungan dipaparkan dengan betul
   - [ ] Imej muncul
   - [ ] Pemformatan kelihatan baik
   - [ ] Pautan berfungsi
   - [ ] Tajuk dan huraian betul## Contoh: Halaman Lengkap### Tajuk
```
Getting Started with XOOPS
```
### Kandungan
```
html
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

<img src="https://example.com/XOOPS-logo.jpg"
  alt="XOOPS Logo">

<p>For more information, visit
<a href="https://XOOPS.org/">XOOPS.org</a></p>
```
### Penerangan Meta
```
Get started with XOOPS CMS. Learn about features
and the first steps to launch your dynamic website.
```
## Ciri Kandungan Lanjutan### Menggunakan WYSIWYG EditorJika editor teks kaya dipasang:
```
[B] [I] [U] [Link] [Image] [Code] [Quote]
```
Klik butang untuk memformat teks tanpa HTML.### Memasukkan Blok KodContoh kod paparan:
```
html
<pre><code>
// PHP Example
$variable = "Hello World";
echo $variable;
</code></pre>
```
### Mencipta JadualSusun data dalam jadual:
```
html
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
### Petikan SebarisSerlahkan teks penting:
```
html
<blockquote>
"XOOPS is a powerful content management system
that empowers you to build dynamic websites."
</blockquote>
```
## Amalan Terbaik SEO untuk KandunganOptimumkan kandungan anda untuk enjin carian:### Tajuk
- Sertakan kata kunci utama
- 50-60 aksara
- Unik setiap halaman### Penerangan Meta
- Sertakan kata kunci secara semula jadi
- 150-160 aksara
- Menarik dan tepat### Kandungan
- Tulis secara semula jadi, elakkan pemadat kata kunci
- Gunakan tajuk (h2, h3) dengan sewajarnya
- Sertakan pautan dalaman ke halaman lain
- Gunakan teks alt pada semua imej
- Sasarkan 300+ perkataan untuk artikel### Struktur URL
- Pastikan URL pendek dan deskriptif
- Gunakan tanda sempang untuk memisahkan perkataan
- Elakkan watak istimewa
- Contoh: `/about-our-company`## Menguruskan Kandungan Anda### Edit Halaman Sedia Ada1. Pergi ke **Kandungan > Halaman**
2. Cari halaman anda dalam senarai
3. Klik **Edit** atau tajuk halaman
4. Buat perubahan
5. Klik **Kemas kini**### Padam Halaman1. Pergi ke **Kandungan > Halaman**
2. Cari halaman anda
3. Klik **Padam**
4. Sahkan pemadaman### Tukar Status Penerbitan1. Pergi ke **Kandungan > Halaman**
2. Cari halaman, klik **Edit**
3. Tukar status dalam lungsur turun
4. Klik **Kemas kini**## Menyelesaikan Masalah Penciptaan Kandungan### Kandungan Tidak Muncul**Simptom:** Halaman yang diterbitkan tidak dipaparkan di tapak web**Penyelesaian:**
1. Semak status penerbitan: Harus "Diterbitkan"
2. Semak tarikh penerbitan: Hendaklah semasa atau lampau
3. Semak keterlihatan: Harus "Awam"
4. Kosongkan cache: Pentadbir > Alat > Kosongkan Cache
5. Semak kebenaran: Kumpulan pengguna mesti mempunyai akses### Pemformatan Tidak Berfungsi**Simptom:** Teg atau pemformatan HTML muncul sebagai teks**Penyelesaian:**
1. Sahkan HTML didayakan dalam tetapan modul
2. Gunakan sintaks HTML yang betul
3. Tutup semua tag: `<p>Text</p>`
4. Gunakan tag yang dibenarkan sahaja
5. Gunakan entiti HTML: `&lt;` untuk `<`, `&amp;` untuk `&`### Imej Tidak Dipaparkan**Simptom:** Imej menunjukkan ikon rosak**Penyelesaian:**
1. Sahkan URL imej adalah betul
2. Semak fail imej wujud
3. Sahkan kebenaran yang betul pada imej
4. Cuba muat naik imej ke XOOPS sebaliknya
5. Semak sekatan luaran (mungkin memerlukan CORS)### Isu Pengekodan Aksara**Simptom:** Watak khas muncul sebagai omong kosong**Penyelesaian:**
1. Simpan fail sebagai pengekodan UTF-8
2. Pastikan carset halaman adalah UTF-8
3. Tambahkan pada kepala HTML: `<meta charset="UTF-8">`
4. Elakkan salin-tampal daripada Word (gunakan teks biasa)## Amalan Terbaik Aliran Kerja Kandungan### Proses Disyorkan1. **Tulis dalam Editor Dahulu:** Gunakan editor kandungan pentadbir
2. **Pratonton Sebelum Penerbitan:** Klik butang Pratonton
3. **Tambah Metadata:** Tajuk, penerangan, tag yang lengkap
4. **Simpan sebagai Draf Dahulu:** Simpan sebagai draf untuk mengelakkan kehilangan kerja
5. **Semakan Akhir:** Baca semula sebelum diterbitkan
6. **Terbitkan:** Klik Terbitkan apabila bersedia
7. **Sahkan:** Semak di tapak langsung
8. **Sunting jika Diperlukan:** Buat pembetulan dengan cepat### Kawalan VersiSentiasa simpan sandaran:1. **Sebelum Perubahan Besar:** Simpan sebagai versi baharu atau sandaran
2. **Arkibkan Kandungan Lama:** Simpan versi yang tidak diterbitkan
3. **Tarikh Draf Anda:** Gunakan penamaan yang jelas: "Halaman-Draf-2025-01-28"## Menerbitkan Berbilang HalamanBuat strategi kandungan:
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
Buat halaman untuk mengikuti struktur ini.## Langkah SeterusnyaSelepas membuat halaman pertama anda:1. Sediakan akaun pengguna
2. Pasang modul tambahan
3. Terokai ciri pentadbir
4. Konfigurasikan tetapan
5. Optimumkan dengan tetapan prestasi---

**Tag:** #penciptaan kandungan #halaman #penerbitan #editor**Artikel Berkaitan:**
- Gambaran Keseluruhan Panel-Pentadbir
- Mengurus-Pengguna
- Memasang-Modul
- ../Configuration/Basic-Configuration