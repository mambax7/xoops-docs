---
title: "Memasang Modul"
description: "Panduan lengkap untuk mencari, memasang, mengkonfigurasi dan mengurus modul XOOPS, serta kitaran hayat modul"
---
# Memasang dan Mengurus Modul XOOPSKetahui cara melanjutkan fungsi XOOPS dengan memasang dan mengkonfigurasi modul.## Memahami Modul XOOPS### Apakah itu Modul?Modul ialah sambungan yang menambahkan fungsi pada XOOPS:| Taip | Tujuan | Contoh |
|---|---|---|
| **Kandungan** | Urus jenis kandungan khusus | Berita, Blog, Tiket |
| **Komuniti** | Interaksi pengguna | Forum, Komen, Ulasan |
| **eDagang** | Menjual produk | Kedai, Troli, Pembayaran |
| **Media** | Mengendalikan files/images | Galeri, Muat Turun, Video |
| **Utiliti** | Alat dan pembantu | E-mel, Sandaran, Analitis |### Teras lwn. Modul Pilihan| Modul | Taip | Termasuk | Boleh tanggal |
|---|---|---|---|
| **Sistem** | Teras | Ya | Tidak |
| **Pengguna** | Teras | Ya | Tidak |
| **Profil** | Disyorkan | Ya | Ya |
| **PM (Mesej Peribadi)** | Disyorkan | Ya | Ya |
| **Saluran WF** | Pilihan | Selalunya | Ya |
| **Berita** | Pilihan | Tidak | Ya |
| **Forum** | Pilihan | Tidak | Ya |## Kitaran Hayat Modul
```
mermaid
graph LR
    A[Find Module] --> B[Download]
    B --> C[Extract]
    C --> D[Install]
    D --> E[Configure]
    E --> F[Use]
    F --> G{Maintain?}
    G -->|Yes| H[Update]
    G -->|No| I[Disable]
    I --> J[Remove]
    H --> E
```
## Mencari Modul### Repositori Modul XOOPSRepositori modul XOOPS rasmi:**Lawatan:** https://XOOPS.org/modules/repository/
```
Directory > Modules > [Browse Categories]
```
Semak imbas mengikut kategori:
- Pengurusan Kandungan
- Komuniti
- eDagang
- Multimedia
- Pembangunan
- Pentadbiran Tapak### Menilai ModulSebelum memasang, semak:| Kriteria | Apa yang Perlu Dicari |
|---|---|
| **Keserasian** | Berfungsi dengan versi XOOPS anda |
| **Penilaian** | Ulasan dan penilaian pengguna yang baik |
| **Kemas kini** | Diselenggara baru-baru ini |
| **Muat turun** | Popular dan digunakan secara meluas |
| **Keperluan** | Serasi dengan pelayan anda |
| **Lesen** | GPL atau sumber terbuka yang serupa |
| **Sokongan** | Pembangun dan komuniti aktif |### Baca Maklumat ModulSetiap penyenaraian modul menunjukkan:
```
Module Name: [Name]
Version: [X.X.X]
Requires: XOOPS [Version]
Author: [Name]
Last Update: [Date]
Downloads: [Number]
Rating: [Stars]
Description: [Brief description]
Compatibility: PHP [Version], MySQL [Version]
```
## Memasang Modul### Kaedah 1: Pemasangan Panel Pentadbiran**Langkah 1: Bahagian Modul Akses**1. Log masuk ke panel pentadbir
2. Navigasi ke **Modules > Modules**
3. Klik **"Pasang Modul Baharu"** atau **"Semak Imbas Modul"****Langkah 2: Muat Naik Modul**Pilihan A - Muat Naik Terus:
1. Klik **"Pilih Fail"**
2. Pilih fail modul .zip daripada komputer
3. Klik **"Muat Naik"**Pilihan B - Muat Naik URL:
1. Tampal URL modul
2. Klik **"Muat Turun dan Pasang"****Langkah 3: Semak Maklumat Modul**
```
Module Name: [Name shown]
Version: [Version]
Author: [Author info]
Description: [Full description]
Requirements: [PHP/MySQL versions]
```
Semak dan klik **"Teruskan dengan Pemasangan"****Langkah 4: Pilih Jenis Pemasangan**
```
☐ Fresh Install (New installation)
☐ Update (Upgrade existing)
☐ Delete Then Install (Replace existing)
```
Pilih pilihan yang sesuai.**Langkah 5: Sahkan Pemasangan**Semak pengesahan akhir:
```
Module will be installed to: /modules/modulename/
Database: xoops_db
Proceed? [Yes] [No]
```
Klik **"Ya"** untuk mengesahkan.**Langkah 6: Pemasangan Selesai**
```
Installation successful!

Module: [Module Name]
Version: [Version]
Tables created: [Number]
Files installed: [Number]

[Go to Module Settings]  [Return to Modules]
```
### Kaedah 2: Pemasangan Manual (Lanjutan)Untuk pemasangan manual atau penyelesaian masalah:**Langkah 1: Muat Turun Modul**1. Muat turun modul .zip dari repositori
2. Ekstrak kepada `/var/www/html/XOOPS/modules/modulename/`
```
bash
# Extract module
unzip module_name.zip
cp -r module_name /var/www/html/XOOPS/modules/

# Set permissions
chmod -R 755 /var/www/html/XOOPS/modules/module_name
```
**Langkah 2: Jalankan Skrip Pemasangan**
```
Visit: http://your-domain.com/XOOPS/modules/module_name/admin/index.php?op=install
```
Atau melalui panel pentadbir (Sistem > Modul > Kemas Kini DB).**Langkah 3: Sahkan Pemasangan**1. Pergi ke **Modules > Modules** dalam admin
2. Cari modul anda dalam senarai
3. Sahkan ia ditunjukkan sebagai "Aktif"## Konfigurasi Modul### Tetapan Modul Akses1. Pergi ke **Modules > Modules**
2. Cari modul anda
3. Klik pada nama modul
4. Klik **"Keutamaan"** atau **"Tetapan"**### Tetapan Modul BiasaKebanyakan modul menawarkan:
```
Module Status: [Enabled/Disabled]
Display in Menu: [Yes/No]
Module Weight: [1-999] (display order)
Visible To Groups: [Checkboxes for user groups]
```
### Pilihan Khusus ModulSetiap modul mempunyai tetapan yang unik. Contoh:**Modul Berita:**
```
Items Per Page: 10
Show Author: Yes
Allow Comments: Yes
Moderation Required: Yes
```
**Modul Forum:**
```
Topics Per Page: 20
Posts Per Page: 15
Maximum Attachment Size: 5MB
Enable Signatures: Yes
```
**Modul Galeri:**
```
Images Per Page: 12
Thumbnail Size: 150x150
Maximum Upload: 10MB
Watermark: Yes/No
```
Semak dokumentasi modul anda untuk pilihan tertentu.### Simpan KonfigurasiSelepas melaraskan tetapan:1. Klik **"Serah"** atau **"Simpan"**
2. Anda akan melihat pengesahan:
   
```
   Tetapan berjaya disimpan!
   ```## Menguruskan Blok ModulBanyak modul mencipta "blok" - kawasan kandungan seperti widget.### Lihat Blok Modul1. Pergi ke **Penampilan > Blok**
2. Cari blok daripada modul anda
3. Kebanyakan modul menunjukkan "[Nama Modul] - [Penerangan Blok]"### Konfigurasi Blok1. Klik pada nama blok
2. Laraskan:
   - Tajuk blok
   - Keterlihatan (semua halaman atau khusus)
   - Kedudukan pada halaman (kiri, tengah, kanan)
   - Kumpulan pengguna yang boleh melihat
3. Klik **"Serah"**### Blok Paparan pada Halaman Utama1. Pergi ke **Penampilan > Blok**
2. Cari blok yang anda mahu
3. Klik **"Edit"**
4. Set:
   - **Kelihatan kepada:** Pilih kumpulan
   - **Kedudukan:** Pilih lajur (left/center/right)
   - **Halaman:** Halaman utama atau semua halaman
5. Klik **"Serah"**## Memasang Contoh Modul Tertentu### Memasang Modul Berita**Sesuai untuk:** Catatan blog, pengumuman1. Muat turun modul Berita dari repositori
2. Muat naik melalui **Modul > Modul > Pasang**
3. Konfigurasikan dalam **Modul > Berita > Keutamaan**:
   - Cerita setiap halaman: 10
   - Benarkan ulasan: Ya
   - Luluskan sebelum diterbitkan: Ya
4. Buat blok untuk berita terkini
5. Mula menerbitkan cerita!### Memasang Modul Forum**Sesuai untuk:** Perbincangan komuniti1. Muat turun modul Forum
2. Pasang melalui panel pentadbir
3. Buat kategori forum dalam modul
4. Konfigurasikan tetapan:
   - Topics/page: 20
   - Posts/page: 15
   - Dayakan penyederhanaan: Ya
5. Berikan kebenaran kumpulan pengguna
6. Buat blok untuk topik terkini### Memasang Modul Galeri**Sesuai untuk:** Pameran imej1. Muat turun modul Galeri
2. Pasang dan konfigurasikan
3. Cipta album foto
4. Muat naik imej
5. Tetapkan kebenaran untuk viewing/uploading
6. Paparkan galeri di laman web## Mengemas kini Modul### Semak Kemas Kini
```
Admin Panel > Modules > Modules > Check for Updates
```
Ini menunjukkan:
- Kemas kini modul yang tersedia
- Versi semasa vs. baharu
- Nota Changelog/release### Kemas kini Modul1. Pergi ke **Modules > Modules**
2. Klik modul dengan kemas kini yang tersedia
3. Klik butang **"Kemas Kini"**
4. Pilih **"Kemas Kini" daripada Jenis Pemasangan**
5. Ikuti wizard pemasangan
6. Modul dikemas kini!### Nota Kemas Kini PentingSebelum mengemas kini:- [ ] Sandaran pangkalan data
- [ ] Fail modul sandaran
- [ ] Semak log perubahan
- [ ] Uji pada pelayan pementasan dahulu
- [ ] Perhatikan sebarang pengubahsuaian tersuaiSelepas mengemas kini:
- [ ] Sahkan kefungsian
- [ ] Semak tetapan modul
- [ ] Semakan untuk warnings/errors
- [ ] Kosongkan cache## Kebenaran Modul### Berikan Akses Kumpulan PenggunaKawal kumpulan pengguna yang boleh mengakses modul:**Lokasi:** Sistem > KebenaranUntuk setiap modul, konfigurasikan:
```
Module: [Module Name]

Admin Access: [Select groups]
User Access: [Select groups]
Read Permission: [Groups allowed to view]
Write Permission: [Groups allowed to post]
Delete Permission: [Administrators only]
```
### Tahap Kebenaran Biasa
```
Public Content (News, Pages):
├── Admin Access: Webmaster
├── User Access: All logged-in users
└── Read Permission: Everyone

Community Features (Forum, Comments):
├── Admin Access: Webmaster, Moderators
├── User Access: All logged-in users
└── Write Permission: All logged-in users

Admin Tools:
├── Admin Access: Webmaster only
└── User Access: Disabled
```
## Melumpuhkan dan Mengalih Keluar Modul### Lumpuhkan Modul (Simpan Fail)Simpan modul tetapi sembunyikan dari tapak:1. Pergi ke **Modules > Modules**
2. Cari modul
3. Klik nama modul
4. Klik **"Lumpuhkan"** atau tetapkan status kepada Tidak Aktif
5. Modul tersembunyi tetapi data disimpanDayakan semula pada bila-bila masa:
1. Klik modul
2. Klik **"Dayakan"**### Keluarkan Modul SepenuhnyaPadamkan modul dan datanya:1. Pergi ke **Modules > Modules**
2. Cari modul
3. Klik **"Nyahpasang"** atau **"Padam"**
4. Sahkan: "Padam modul dan semua data?"
5. Klik **"Ya"** untuk mengesahkan**Amaran:** Menyahpasang memadam semua data modul!### Pasang Semula Selepas NyahpasangJika anda menyahpasang modul:
- Fail modul dipadamkan
- Jadual pangkalan data dipadamkan
- Semua data hilang
- Mesti pasang semula untuk digunakan semula
- Boleh memulihkan dari sandaran## Pemasangan Modul Penyelesaian Masalah### Modul Tidak Muncul Selepas Pemasangan**Simptom:** Modul disenaraikan tetapi tidak kelihatan di tapak**Penyelesaian:**
```
1. Check module is "Active" (Modules > Modules)
2. Enable module blocks (Appearance > Blocks)
3. Verify user permissions (System > Permissions)
4. Clear cache (System > Tools > Clear Cache)
5. Check .htaccess doesn't block module
```
### Ralat Pemasangan: "Jadual Sudah Wujud"**Simptom:** Ralat semasa pemasangan modul**Penyelesaian:**
```
1. Module partially installed before
2. Try "Delete then Install" option
3. Or uninstall first, then install fresh
4. Check database for existing tables:
   mysql> SHOW TABLES LIKE 'xoops_module%';
```
### Modul Tiada Ketergantungan**Simptom:** Modul tidak akan dipasang - memerlukan modul lain**Penyelesaian:**
```
1. Note required modules from error message
2. Install required modules first
3. Then install the module
4. Install in correct order
```
### Halaman Kosong Apabila Mengakses Modul**Simptom:** Modul dimuatkan tetapi tidak menunjukkan apa-apa**Penyelesaian:**
```
1. Enable debug mode in mainfile.php:
   define('XOOPS_DEBUG', 1);

2. Check PHP error log:
   tail -f /var/log/php_errors.log

3. Verify file permissions:
   chmod -R 755 /var/www/html/XOOPS/modules/modulename

4. Check database connection in module config

5. Disable module and reinstall
```
### Tapak Pecah Modul**Simptom:** Memasang modul memecahkan tapak web**Penyelesaian:**
```
1. Disable the problematic module immediately:
   Admin > Modules > [Module] > Disable

2. Clear cache:
   rm -rf /var/www/html/XOOPS/cache/*
   rm -rf /var/www/html/XOOPS/templates_c/*

3. Restore from backup if needed

4. Check error logs for root cause

5. Contact module developer
```
## Pertimbangan Keselamatan Modul### Hanya Pasang daripada Sumber Dipercayai
```
✓ Official XOOPS Repository
✓ GitHub official XOOPS modules
✓ Trusted module developers
✗ Unknown websites
✗ Unverified sources
```
### Semak Kebenaran ModulSelepas pemasangan:1. Semak kod modul untuk aktiviti yang mencurigakan
2. Semak jadual pangkalan data untuk anomali
3. Pantau perubahan fail
4. Pastikan modul dikemas kini
5. Keluarkan modul yang tidak digunakan### Amalan Terbaik Kebenaran
```
Module directory: 755 (readable, not writable by web server)
Module files: 644 (readable only)
Module data: Protected by database
```
## Sumber Pembangunan Modul### Belajar Pembangunan Modul- Dokumentasi Rasmi: https://XOOPS.org/
- Repositori GitHub: https://github.com/XOOPS/
- Forum Komuniti: https://XOOPS.org/modules/newbb/
- Panduan Pembangun: Tersedia dalam folder dokumen## Amalan Terbaik untuk Modul1. **Pasang Satu Persatu:** Pantau konflik
2. **Ujian Selepas Pemasangan:** Sahkan kefungsian
3. **Konfigurasi Tersuai Dokumen:** Perhatikan tetapan anda
4. **Kekalkan Kemas Kini:** Pasang kemas kini modul dengan segera
5. **Alih Keluar Tidak Digunakan:** Padamkan modul yang tidak diperlukan
6. **Sandaran Sebelum:** Sentiasa sandarkan sebelum memasang
7. **Baca Dokumentasi:** Semak arahan modul
8. **Sertai Komuniti:** Minta bantuan jika perlu## Senarai Semak Pemasangan ModulUntuk setiap pemasangan modul:- [ ] Selidik dan baca ulasan
- [ ] Sahkan keserasian versi XOOPS
- [ ] Sandaran pangkalan data dan fail
- [ ] Muat turun versi terkini
- [ ] Pasang melalui panel pentadbir
- [ ] Konfigurasikan tetapan
- [ ] Create/position blok
- [ ] Tetapkan kebenaran pengguna
- [ ] Uji kefungsian
- [ ] Konfigurasi dokumen
- [ ] Jadual untuk kemas kini## Langkah SeterusnyaSelepas memasang modul:1. Cipta kandungan untuk modul
2. Sediakan kumpulan pengguna
3. Terokai ciri pentadbir
4. Optimumkan prestasi
5. Pasang modul tambahan mengikut keperluan---

**Tag:** #modul #pemasangan #sambungan #pengurusan**Artikel Berkaitan:**
- Gambaran Keseluruhan Panel-Pentadbir
- Mengurus-Pengguna
- Mencipta-Halaman-Pertama-Anda
- ../Configuration/System-Settings