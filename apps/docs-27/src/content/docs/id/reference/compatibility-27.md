---
title: "XOOPS 2.7.0 Tinjauan Kompatibilitas Untuk Panduan Ini"
---

Dokumen ini mencantumkan perubahan yang diperlukan dalam repositori ini sehingga Panduan Instalasi cocok dengan XOOPS 2.7.0.

Dasar peninjauan:

- Repositori panduan saat ini: `L:\GitHub\XoopsDocs\xoops-installation-guide`
- core XOOPS 2.7.0 diulas di: `L:\GitHub\MAMBAX7\CORE\XoopsCore27`
- Sumber primer 2.7.0 diperiksa:
  - `README.md`
  - `release_notes.txt`
  - `htdocs/install/language/english/welcome.php`
  - `htdocs/install/include/config.php`
  - `htdocs/install/include/page.php`
  - `htdocs/install/class/pathcontroller.php`
  - `htdocs/install/page_dbsettings.php`
  - `htdocs/install/page_configsave.php`
  - `htdocs/install/page_siteinit.php`
  - `htdocs/install/page_end.php`
  - `htdocs/mainfile.dist.php`
  -`upgrade/preflight.php`
  - `upgrade/README.md`
  - `upgrade/upd_2.5.11-to-2.7.0/index.php`

## Ruang Lingkup

Repo ini saat ini berisi:

- File Markdown Bahasa Inggris tingkat root digunakan sebagai panduan utama.
- Sebagian salinan `en/`.
- Pohon buku `de/` dan `fr/` lengkap dengan asetnya sendiri.

File tingkat root memerlukan pass pertama. Setelah itu, perubahan yang setara perlu dicerminkan ke `de/book/` dan `fr/book/`. Pohon `en/` juga perlu dibersihkan karena tampaknya hanya dirawat sebagian.

## 1. Perubahan Repositori Global

### 1.1 Versi dan metadata

Perbarui semua referensi tingkat panduan dari XOOPS 2.5.x ke XOOPS 2.7.0.

File yang terpengaruh:

- `README.md`
- `SUMMARY.md` — TOC langsung utama untuk panduan root; label navigasi dan judul bagian harus cocok dengan judul bab baru dan bagian Catatan Peningkatan Historis yang diganti namanya
- `en/README.md`
- `en/SUMMARY.md`
- `de/README.md`
- `de/SUMMARY.md`
- `fr/README.md`
- `fr/SUMMARY.md`
- `chapter-2-introduction.md`
- `about-xoops-cms.md`
- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`
- `appendix-5-increase-security-of-your-xoops-installation.md`
- `de/book/*.md` dan `fr/book/*.md` terlokalisasi

Perubahan yang diperlukan:

- Ubah `for XOOPS 2.5.7.x` menjadi `for XOOPS 2.7.0`.
- Perbarui tahun hak cipta dari `2018` ke `2026`.
- Ganti referensi XOOPS 2.5.x dan 2.6.0 lama yang menjelaskan rilis saat ini.
- Ganti panduan pengunduhan era SourceForge dengan Rilis GitHub:
  - `https://github.com/XOOPS/XoopsCore27/releases`

### 1.2 Penyegaran tautan

File `about-xoops-cms.md` dan `10aboutxoops.md` yang dilokalkan masih mengarah ke lokasi GitHub 2.5.x dan 2.6.0 yang lama. Tautan tersebut perlu diperbarui ke lokasi proyek 2.7.x saat ini.

### 1.3 Penyegaran tangkapan layar

Semua tangkapan layar yang menunjukkan layar penginstal, pemutakhiran UI, dasbor admin, pemilih theme, pemilih module, dan pasca-instalasi sudah usang.

Pohon aset yang terpengaruh:

- `.gitbook/assets/`
- `en/assets/`
- `de/assets/`
- `fr/assets/`

Ini merupakan penyegaran menyeluruh, bukan parsial. Penginstal 2.7.0 menggunakan tata letak berbasis Bootstrap yang berbeda dan struktur visual yang berbeda.

## 2. Bab 2: Pendahuluan

Berkas:

- `chapter-2-introduction.md`

### 2.1 Persyaratan sistem harus ditulis ulang

Bab saat ini hanya menyebutkan Apache, MySQL, dan PHP. XOOPS 2.7.0 memiliki minimum eksplisit:

| Komponen | minimal 2.7.0 | 2.7.0 rekomendasi |
| --- | --- | --- |
| PHP | 8.2.0 | 8.4+ |
| MySQL | 5.7.8 | 8.4+ |
| Server web | Server apa pun yang mendukung PHP | Apache atau Nginx direkomendasikan |

Catatan untuk ditambahkan:

- IIS mungkin masih terdaftar di installer, tetapi Apache dan Nginx adalah contoh yang direkomendasikan.
- Catatan rilis juga menyebutkan kompatibilitas MySQL 9.0.

### 2.2 Tambahkan daftar periksa ekstensi PHP yang diperlukan dan direkomendasikan

Penginstal 2.7.0 sekarang memisahkan persyaratan keras dari ekstensi yang direkomendasikan.

Pemeriksaan yang diperlukan ditunjukkan oleh penginstal:

- MySQLi
- Sesi
- PCR
- menyaring
- `file_uploads`
- info file

Ekstensi yang disarankan:

- mbstring
- internasional
- ikonv
-xml
- zlib
- gd
- exik
- keriting

### 2.3 Hapus instruksi checksum

Langkah 5 saat ini menjelaskan `checksum.php` dan `checksum.mdi`. File-file itu bukan bagian dari XOOPS 2.7.0.

Tindakan:

- Hapus bagian verifikasi checksum sepenuhnya.

### 2.4 Perbarui paket dan instruksi unggah

Pertahankan deskripsi tata letak paket `docs/`, `extras/`, `htdocs/`, `upgrade/`, tetapi perbarui teks unggahan dan persiapan untuk mencerminkan ekspektasi jalur yang dapat ditulisi saat ini:- `mainfile.php`
- `uploads/`
- `uploads/avatars/`
- `uploads/files/`
- `uploads/images/`
- `uploads/ranks/`
- `uploads/smilies/`
- `xoops_data/caches/`
- `xoops_data/caches/xoops_cache/`
- `xoops_data/caches/smarty_cache/`
- `xoops_data/caches/smarty_compile/`
- `xoops_data/configs/`
- `xoops_data/configs/captcha/`
- `xoops_data/configs/textsanitizer/`
- `xoops_data/data/`
- `xoops_data/protector/`

Panduan saat ini mengecilkan hal ini.

### 2.5 Ganti bahasa SourceForge translation/download

Teks saat ini masih mengatakan untuk mengunjungi XOOPS di SourceForge untuk paket bahasa lainnya. Itu perlu diganti dengan panduan pengunduhan project/community saat ini.

## 3. Bab 3: Pemeriksaan Konfigurasi Server

Berkas:

- `chapter-3-server-configuration-check.md`

Perubahan yang diperlukan:

- Tulis ulang deskripsi halaman berdasarkan tata letak dua block saat ini:
  - Persyaratan
  - Ekstensi yang disarankan
- Ganti tangkapan layar lama.
- Dokumentasikan secara eksplisit pemeriksaan persyaratan yang tercantum di atas.

## 4. Bab 4: Ambil Jalan yang Benar

Berkas:

- `chapter-4-take-the-right-path.md`

Perubahan yang diperlukan:

- Tambahkan bidang `Cookie Domain` baru.
- Perbarui nama dan deskripsi bidang jalur agar sesuai dengan 2.7.0:
  - Jalur Akar XOOPS
  - Jalur Data XOOPS
  - Jalur Perpustakaan XOOPS
  - XOOPS URL
  - Domain Kue
- Tambahkan catatan bahwa mengubah jalur perpustakaan sekarang memerlukan autoloader Komposer yang valid di `vendor/autoload.php`.

Ini adalah pemeriksaan kompatibilitas nyata di 2.7.0 dan harus didokumentasikan dengan jelas. Panduan saat ini tidak menyebutkan Komposer sama sekali.

## 5. Bab 5: Koneksi Basis Data

Berkas:

- `chapter-5-database-connections.md`

Perubahan yang diperlukan:

- Simpan pernyataan bahwa hanya MySQL yang didukung.
- Perbarui bagian konfigurasi database untuk mencerminkan:
  - rangkaian karakter default sekarang adalah `utf8mb4`
  - pemilihan susunan diperbarui secara dinamis ketika rangkaian karakter berubah
- Ganti tangkapan layar untuk koneksi database dan halaman konfigurasi.

Teks saat ini yang mengatakan rangkaian karakter dan susunan tidak memerlukan perhatian terlalu lemah untuk 2.7.0. Setidaknya harus menyebutkan default `utf8mb4` baru dan pemilih susunan dinamis.

## 6. Bab 6: Konfigurasi Sistem Akhir

Berkas:

- `chapter-6-final-system-configuration.md`

### 6.1 File konfigurasi yang dihasilkan diubah

Panduan saat ini mengatakan penginstal menulis `mainfile.php` dan `secure.php`.

Di 2.7.0 juga menginstal file konfigurasi ke `xoops_data/configs/`, termasuk:

- `xoopsconfig.php`
- file konfigurasi captcha
- file konfigurasi pembersih teks

### 6.2 File konfigurasi yang ada di `xoops_data/configs/` tidak ditimpa

Perilaku non-timpa **meliputi**, bukan global. Dua jalur kode berbeda di `page_configsave.php` menulis file konfigurasi:

- `writeConfigurationFile()` (dipanggil pada baris 59 dan 66) **selalu** membuat ulang `xoops_data/data/secure.php` dan `mainfile.php` dari input wizard. Tidak ada pemeriksaan keberadaan; salinan yang ada diganti.
- `copyConfigDistFiles()` (disebut pada baris 62, ditentukan pada baris 317) hanya menyalin file `xoops_data/configs/` (`xoopsconfig.php`, konfigurasi captcha, konfigurasi textsanitizer) **jika tujuan belum ada**.

Penulisan ulang bab harus mencerminkan kedua perilaku dengan jelas:

- Untuk `mainfile.php` dan `secure.php`: peringatkan bahwa setiap pengeditan manual pada file-file ini akan ditimpa ketika penginstal dijalankan kembali.
- Untuk file `xoops_data/configs/`: jelaskan bahwa kustomisasi lokal dipertahankan saat dijalankan ulang dan ditingkatkan, dan bahwa pemulihan default yang dikirimkan memerlukan penghapusan file dan menjalankan kembali (atau menyalin `.dist.php` secara manual).

Jangan menggeneralisasi "file yang ada dipertahankan" di semua file konfigurasi yang ditulis penginstal — hal ini tidak benar dan akan menyesatkan administrator yang mengedit `mainfile.php` atau `secure.php`.

### 6.3 HTTPS dan penanganan proksi terbalik diubah

`mainfile.php` yang dihasilkan sekarang mendukung deteksi protokol yang lebih luas, termasuk header proxy terbalik. Panduan ini harus menyebutkan hal ini alih-alih hanya menyiratkan deteksi langsung `http` atau `https`.

### 6.4 Jumlah tabel salah

Bab saat ini mengatakan situs baru membuat tabel `32`.

XOOPS 2.7.0 membuat tabel `33`. Tabel yang hilang adalah:

-`tokens`

Tindakan:

- Perbarui hitungan dari 32 menjadi 33.
- Tambahkan `tokens` ke daftar tabel.

## 7. Bab 7: Pengaturan Administrasi

Berkas:

- `chapter-7-administration-settings.md`### 7.1 Deskripsi Kata Sandi UI sudah usang

Penginstal masih menyertakan pembuatan kata sandi, namun sekarang juga mencakup:

- pengukur kekuatan kata sandi berbasis zxcvbn
- label kekuatan visual
- Generator 16 karakter dan aliran penyalinan

Perbarui teks dan tangkapan layar untuk menjelaskan panel kata sandi saat ini.

### 7.2 Validasi email kini diterapkan

Email admin divalidasi dengan `FILTER_VALIDATE_EMAIL`. Bab ini harus menyebutkan bahwa nilai email yang tidak valid ditolak.

### 7.3 Bagian kunci lisensi salah

Ini adalah salah satu perbaikan faktual yang paling penting.

Panduan saat ini mengatakan:

- ada `License System Key`
- disimpan di `/include/license.php`
- `/include/license.php` harus dapat ditulisi selama instalasi

Itu tidak lagi akurat.

Apa yang sebenarnya dilakukan 2.7.0:

- instalasi menulis data lisensi ke `xoops_data/data/license.php`
- `htdocs/include/license.php` sekarang hanyalah pembungkus yang tidak digunakan lagi yang memuat file dari `XOOPS_VAR_PATH`
- kata-kata lama tentang membuat `/include/license.php` dapat ditulis harus dihapus

Tindakan:

- Tulis ulang bagian ini alih-alih menghapusnya.
- Perbarui jalur dari `/include/license.php` ke `xoops_data/data/license.php`.

### 7.4 Daftar theme sudah usang

Panduan saat ini masih mengacu pada Zetagenesis dan kumpulan theme era 2.5 yang lebih lama.

theme yang ada di XOOPS 2.7.0:

-`default`
-`xbootstrap`
-`xbootstrap5`
-`xswatch4`
-`xswatch5`
-`xtailwind`
-`xtailwind2`

Perhatikan juga:

- `xswatch4` adalah theme default saat ini yang disisipkan oleh data penginstal.
- Zetagenesis tidak lagi menjadi bagian dari daftar theme yang dikemas.

### 7.5 Daftar module sudah usang

module yang ada dalam paket 2.7.0:

- `system` — diinstal secara otomatis selama langkah pengisian tabel/penyisipan data. Selalu hadir, tidak pernah terlihat di alat pilih.
- `debugbar` — dapat dipilih pada langkah penginstal.
- `pm` — dapat dipilih pada langkah penginstal.
- `profile` — dapat dipilih pada langkah penginstal.
- `protector` — dapat dipilih pada langkah penginstal.

Penting: halaman pemasang module (`htdocs/install/page_moduleinstaller.php`) membuat daftar kandidatnya dengan mengulangi `XoopsLists::getModulesList()` dan **menyaring apa pun yang sudah ada di tabel module** (baris 95-102 mengumpulkan `$listed_mods`; baris 116 melewatkan direktori mana pun yang ada dalam daftar itu). Karena `system` diinstal sebelum langkah ini dijalankan, maka tidak pernah muncul sebagai kotak centang.

Perubahan panduan diperlukan:

- Berhenti mengatakan hanya ada tiga module yang dibundel.
- Jelaskan langkah penginstal dengan menunjukkan **empat module yang dapat dipilih** (`debugbar`, `pm`, `profile`, `protector`), bukan lima.
- Dokumentasikan `system` secara terpisah sebagai module core yang selalu diinstal dan tidak muncul di pemilih.
- Tambahkan `debugbar` ke deskripsi module yang dibundel sebagai baru di 2.7.0.
- Perhatikan bahwa pemilihan module default penginstal sekarang kosong; module tersedia untuk dipilih, tetapi tidak diperiksa sebelumnya oleh konfigurasi penginstal.

## 8. Bab 8: Siap Berangkat

Berkas:

-`chapter-8-ready-to-go.md`

### 8.1 Proses pembersihan instalasi perlu ditulis ulang

Panduan saat ini mengatakan penginstal mengganti nama folder instalasi menjadi nama unik.

Hal ini masih berlaku, namun mekanismenya berubah:

- skrip pembersihan eksternal dibuat di root web
- halaman terakhir memicu pembersihan melalui AJAX
- folder instalasi diubah namanya menjadi `install_remove_<unique suffix>`
- fallback ke `cleanup.php` masih ada

Tindakan:

- Perbarui penjelasannya.
- Jaga agar instruksi yang dihadapi pengguna tetap sederhana: hapus direktori instalasi yang diganti namanya setelah instalasi.

### 8.2 Referensi lampiran dasbor admin sudah tidak berlaku lagi

Bab 8 masih mengarahkan pembaca pada pengalaman admin era Oksigen yang lama. Itu harus selaras dengan theme admin saat ini:

-`default`
-`dark`
- `modern`
-`transition`

### 8.3 Panduan pengeditan jalur pasca-instalasi perlu diperbaiki

Teks saat ini memberitahu pembaca untuk memperbarui `secure.php` dengan definisi jalur. Di 2.7.0, konstanta jalur tersebut ditentukan di `mainfile.php`, sedangkan `secure.php` menyimpan data aman. block contoh dalam bab ini harus diperbaiki.

### 8.4 Pengaturan produksi harus ditambahkan

Panduan ini harus secara eksplisit menyebutkan default produksi yang sekarang ada di `mainfile.dist.php`:- `XOOPS_DB_LEGACY_LOG` harus tetap `false`
- `XOOPS_DEBUG` harus tetap `false`

## 9. Bab 9: Tingkatkan Instalasi XOOPS yang Ada

Berkas:

-`chapter-9-upgrade-existing-xoops-installation.md`

Bab ini membutuhkan penulisan ulang terbesar.

### 9.1 Tambahkan langkah preflight Smarty 4 wajib

Alur pemutakhiran XOOPS 2.7.0 kini memaksa proses pra-penerbangan sebelum penyelesaian pemutakhiran.

Aliran baru yang diperlukan:

1. Salin direktori `upgrade/` ke root situs.
2. Jalankan `/upgrade/preflight.php`.
3. Pindai `/themes/` dan `/modules/` untuk sintaks Smarty lama.
4. Gunakan mode perbaikan opsional jika diperlukan.
5. Jalankan kembali hingga bersih.
6. Lanjutkan ke `/upgrade/`.

Bab saat ini tidak menyebutkan hal ini sama sekali, sehingga tidak sesuai dengan panduan 2.7.0.

### 9.2 Mengganti narasi penggabungan era 2.5.2 secara manual

Bab saat ini masih menjelaskan pemutakhiran manual gaya 2.5.2 dengan penggabungan kerangka kerja, catatan AltSys, dan restrukturisasi file yang dikelola secara manual. Itu harus diganti dengan urutan pemutakhiran 2.7.x sebenarnya dari `release_notes.txt` dan `upgrade/README.md`.

Garis besar bab yang direkomendasikan:

1. Cadangkan file dan database.
2. Matikan situs.
3. Salin `htdocs/` melalui root langsung.
4. Salin `htdocs/xoops_lib` ke jalur perpustakaan aktif.
5. Salin `htdocs/xoops_data` ke jalur data aktif.
6. Salin `upgrade/` ke root web.
7. Jalankan `preflight.php`.
8. Jalankan `/upgrade/`.
9. Selesaikan perintah pembaru.
10. Perbarui module `system`.
11. Perbarui `pm`, `profile`, dan `protector` jika diinstal.
12. Hapus `upgrade/`.
13. Aktifkan kembali situs.

### 9.3 Dokumentasikan perubahan pemutakhiran 2.7.0 yang sebenarnya

Pembaru untuk 2.7.0 mencakup setidaknya perubahan nyata berikut:

- membuat tabel `tokens`
- memperluas `bannerclient.passwd` untuk hash kata sandi modern
- tambahkan pengaturan preferensi cookie sesi
- hapus direktori paket yang sudah usang

Panduan ini tidak perlu memaparkan setiap detail implementasi, namun tidak lagi menyiratkan bahwa pemutakhiran hanyalah salinan file ditambah pembaruan module.

## 10. Halaman Peningkatan Historis

File:

-`upgrading-from-xoops-2.4.5-easy-way.md`
-`upgrading-from-xoops-2.0.-above-2.0.14-and-2.2..md`
-`upgrading-from-any-xoops-2.0.7-to-2.0.13.2.md`
-`upgrading-a-non-utf-8-site.md`
-`upgrading-xoopseditor-package.md`

**Status:** keputusan struktural telah diselesaikan — root `SUMMARY.md` memindahkannya ke bagian khusus **Catatan Peningkatan Historis**, dan setiap file membawa keterangan "Referensi historis" yang mengarahkan pembaca ke Bab 9 untuk peningkatan versi 2.7.0. Panduan tersebut bukan lagi panduan peningkatan kelas satu.

**Sisa pekerjaan (hanya konsistensi):**

- Pastikan `README.md` (root) mencantumkannya di bawah judul "Catatan Peningkatan Historis" yang sama, bukan di bawah header "Peningkatan" yang umum.
- Mencerminkan pemisahan yang sama di `de/README.md`, `de/SUMMARY.md`, `fr/README.md`, `fr/SUMMARY.md`, dan `en/SUMMARY.md`.
- Pastikan setiap halaman riwayat pemutakhiran (root dan salinan `de/book/upg*.md` / `fr/book/upg*.md` yang dilokalkan) membawa info konten basi yang menghubungkan kembali ke Bab 9.

## 11. Lampiran 1: Admin GUI

Berkas:

-`appendix-1-working-with-the-new-admin-gui-our-dashboard.md`

Lampiran ini terkait dengan GUI admin Oxygen dan perlu ditulis ulang.

Perubahan yang diperlukan:

- ganti semua referensi Oksigen
- ganti screenshot icon/menu yang lama
- mendokumentasikan theme admin saat ini:
  - bawaan
  - gelap
  - modern
  - transisi
- sebutkan kemampuan admin 2.7.0 saat ini yang disebutkan dalam catatan rilis:
  - Kemampuan template yang berlebihan dalam theme admin sistem
  - kumpulan theme admin yang diperbarui

## 12. Lampiran 2: Mengunggah XOOPS Melalui FTP

Berkas:

-`appendix-2-uploading-xoops-via-ftp.md`

Perubahan yang diperlukan:

- menghapus asumsi khusus HostGator dan khusus cPanel
- memodernisasi kata-kata unggahan file
- perhatikan bahwa `xoops_lib` sekarang menyertakan dependensi Komposer, jadi unggahan lebih besar dan tidak boleh dipangkas secara selektif

## 13. Lampiran 5: Keamanan

Berkas:

-`appendix-5-increase-security-of-your-xoops-installation.md`

Perubahan yang diperlukan:

- hapus diskusi `register_globals` sepenuhnya
- menghapus bahasa tiket tuan rumah yang ketinggalan jaman
- teks izin yang benar dari `404` ke `0444` yang dimaksudkan hanya untuk dibaca
- perbarui diskusi `mainfile.php` dan `secure.php` agar sesuai dengan tata letak 2.7.0
- tambahkan konteks konstan terkait keamanan domain cookie baru:
  -`XOOPS_COOKIE_DOMAIN_USE_PSL`
  -`XOOPS_COOKIE_DOMAIN`
- tambahkan panduan produksi untuk:
  - `XOOPS_DB_LEGACY_LOG`
  -`XOOPS_DEBUG`## 14. Dampak Pemeliharaan Lintas Bahasa

Setelah file bahasa Inggris tingkat root diperbaiki, pembaruan yang setara diperlukan di:

- `de/book/`
-`fr/book/`
- `de/README.md`
-`fr/README.md`
- `de/SUMMARY.md`
- `fr/SUMMARY.md`

Pohon `en/` juga perlu ditinjau karena berisi README dan kumpulan aset yang terpisah, namun tampaknya hanya memiliki sebagian pohon `book/`.

## 15. Urutan Prioritas

### Penting sebelum rilis

1. Perbarui referensi repo/version ke 2.7.0.
2. Tulis ulang Bab 9 berdasarkan alur peningkatan 2.7.0 yang sebenarnya dan preflight Smarty 4.
3. Perbarui persyaratan sistem ke PHP 8.2+ dan MySQL 5.7.8+.
4. Perbaiki jalur file kunci lisensi Bab 7.
5. Persediaan theme dan module yang benar.
6. Perbaiki jumlah tabel Bab 6 dari 32 menjadi 33.

### Penting untuk akurasi

7. Menulis ulang panduan jalur yang dapat ditulis.
8. Tambahkan persyaratan pemuat otomatis Komposer ke pengaturan jalur.
9. Perbarui panduan rangkaian karakter basis data ke `utf8mb4`.
10. Perbaiki panduan pengeditan jalur Bab 8 sehingga konstanta didokumentasikan dalam file yang benar.
11. Hapus instruksi checksum.
12. Hapus `register_globals` dan panduan PHP mati lainnya.

### Pembersihan berkualitas rilis

13. Ganti semua screenshot installer dan admin.
14. Pindahkan halaman riwayat pemutakhiran keluar dari alur utama.
15. Sinkronkan salinan Jerman dan Prancis setelah bahasa Inggris diperbaiki.
16. Bersihkan tautan basi dan duplikat baris README.