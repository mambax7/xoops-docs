---
title: "XOOPS 2.7.0 Semakan Keserasian Untuk Panduan Ini"
---
Dokumen ini menyenaraikan perubahan yang diperlukan dalam repositori ini supaya Panduan Pemasangan sepadan dengan XOOPS 2.7.0.

Dasar semakan:

- Repositori panduan semasa: `L:\GitHub\XoopsDocs\XOOPS-installation-guide`
- XOOPS 2.7.0 teras disemak di: `L:\GitHub\MAMBAX7\CORE\XoopsCore27`
- Sumber utama 2.7.0 disemak:
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
  - `upgrade/preflight.php`
  - `upgrade/README.md`
  - `upgrade/upd_2.5.11-to-2.7.0/index.php`

## Skop

Repo ini pada masa ini mengandungi:

- Fail Markdown Bahasa Inggeris peringkat akar digunakan sebagai panduan utama.
- Salinan separa `en/`.
- Pokok buku `de/` dan `fr/` penuh dengan aset sendiri.

Fail peringkat akar memerlukan laluan pertama. Selepas itu, perubahan yang setara perlu dicerminkan kepada `de/book/` dan `fr/book/`. Pokok `en/` juga memerlukan pembersihan kerana ia kelihatan hanya sebahagiannya diselenggara.

## 1. Perubahan Repositori Global### 1.1 Versi dan metadata

Kemas kini semua rujukan peringkat panduan daripada XOOPS 2.5.x hingga XOOPS 2.7.0.

Fail terjejas:

- `README.md`
- `SUMMARY.md` — hidup utama TOC untuk panduan akar; label navigasi dan tajuk bahagian perlu sepadan dengan tajuk bab baharu dan bahagian Nota Naik Taraf Sejarah yang dinamakan semula
- `en/README.md`
- `en/SUMMARY.md`
- `de/README.md`
- `de/SUMMARY.md`
- `fr/README.md`
- `fr/SUMMARY.md`
- `chapter-2-introduction.md`
- `about-XOOPS-cms.md`
- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`
- `appendix-5-increase-security-of-your-XOOPS-installation.md`
- setempat `de/book/*.md` dan `fr/book/*.md`

Perubahan yang diperlukan:

- Tukar `for XOOPS 2.5.7.x` kepada `for XOOPS 2.7.0`.
- Kemas kini tahun hak cipta dari `2018` hingga `2026`.
- Gantikan rujukan XOOPS 2.5.x dan 2.6.0 lama di mana ia menerangkan keluaran semasa.
- Gantikan panduan muat turun era SourceForge dengan Keluaran GitHub:
  - `https://github.com/XOOPS/XoopsCore27/releases`

### 1.2 Muat semula pautan

Fail `about-XOOPS-cms.md` dan setempat `10aboutxoops.md` masih menunjuk ke lokasi 2.5.x dan 2.6.0 GitHub lama. Pautan tersebut perlu dikemas kini ke lokasi projek 2.7.x semasa.

### 1.3 Muat semula tangkapan skrin

Semua tangkapan skrin yang menunjukkan pemasang, naik taraf UI, papan pemuka pentadbir, pemilih tema, pemilih modul dan skrin selepas pemasangan sudah lapuk.Pokok aset terjejas:

- `.gitbook/assets/`
- `en/assets/`
- `de/assets/`
- `fr/assets/`

Ini adalah muat semula penuh, bukan separa. Pemasang 2.7.0 menggunakan reka letak berasaskan Bootstrap yang berbeza dan struktur visual yang berbeza.

## 2. Bab 2: Pengenalan

Fail:

- `chapter-2-introduction.md`

### 2.1 Keperluan sistem mesti ditulis semula

Bab semasa hanya menyatakan Apache, MySQL, dan PHP. XOOPS 2.7.0 mempunyai minimum yang jelas:

| Komponen | 2.7.0 minimum | 2.7.0 syor |
| --- | --- | --- |
| PHP | 8.2.0 | 8.4+ |
| MySQL | 5.7.8 | 8.4+ |
| Pelayan web | Sebarang sokongan pelayan diperlukan PHP | Apache atau Nginx disyorkan |

Nota untuk ditambah:

- IIS masih disenaraikan dalam pemasang yang mungkin, tetapi Apache dan Nginx adalah contoh yang disyorkan.
- Nota keluaran juga memanggil keserasian MySQL 9.0.

### 2.2 Tambah senarai semak sambungan PHP yang diperlukan dan disyorkan

Pemasang 2.7.0 kini memisahkan keperluan keras daripada sambungan yang disyorkan.

Pemeriksaan yang diperlukan ditunjukkan oleh pemasang:

- MySQLi
- Sesi
- PCRE
- penapis
- `file_uploads`
- maklumat fail

Sambungan yang disyorkan:

- mbstring
- intl
- ikonv
- xml
- zlib
- gd
- exif
- keriting

### 2.3 Alih keluar arahan checksum

Langkah 5 semasa menerangkan `checksum.php` dan `checksum.mdi`. Fail tersebut bukan sebahagian daripada XOOPS 2.7.0.Tindakan:

- Alih keluar bahagian pengesahan semak sepenuhnya.

### 2.4 Kemas kini pakej dan arahan muat naik

Simpan `docs/`, `extras/`, `htdocs/`, `upgrade/` perihalan susun atur pakej, tetapi kemas kini muat naik dan teks penyediaan untuk menggambarkan jangkaan laluan boleh tulis semasa:

- `mainfile.php`
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

Panduan pada masa ini meremehkan perkara ini.

### 2.5 Gantikan bahasa SourceForge translation/download

Teks semasa masih mengatakan untuk melawati XOOPS pada SourceForge untuk pakej bahasa lain. Itu perlu diganti dengan panduan muat turun project/community semasa.

## 3. Bab 3: Semakan Konfigurasi Pelayan

Fail:

- `chapter-3-server-configuration-check.md`

Perubahan yang diperlukan:

- Tulis semula huraian halaman di sekitar susun atur dua blok semasa:
  - Keperluan
  - Sambungan yang disyorkan
- Gantikan tangkapan skrin lama.
- Dokumentasikan semakan keperluan yang disenaraikan di atas dengan jelas.## 4. Bab 4: Ambil Jalan Yang Benar

Fail:

- `chapter-4-take-the-right-path.md`

Perubahan yang diperlukan:

- Tambahkan medan `Cookie Domain` baharu.
- Kemas kini nama dan perihalan medan laluan untuk dipadankan dengan 2.7.0:
  - XOOPS Laluan Akar
  - XOOPS Laluan Data
  - XOOPS Laluan Perpustakaan
  - XOOPS URL
  - Domain Kuki
- Tambahkan nota bahawa menukar laluan perpustakaan kini memerlukan pemuat auto Komposer yang sah di `vendor/autoload.php`.

Ini adalah semakan keserasian sebenar dalam 2.7.0 dan harus didokumenkan dengan jelas. Panduan semasa tidak menyebut Komposer sama sekali.

## 5. Bab 5: Sambungan Pangkalan Data

Fail:

- `chapter-5-database-connections.md`

Perubahan yang diperlukan:

- Simpan kenyataan bahawa hanya MySQL disokong.
- Kemas kini bahagian konfigurasi pangkalan data untuk mencerminkan:
  - set aksara lalai kini `utf8mb4`
  - pemilihan koleksi dikemas kini secara dinamik apabila charset berubah
- Gantikan tangkapan skrin untuk kedua-dua sambungan pangkalan data dan halaman konfigurasi.

Teks semasa yang mengatakan charset dan collation tidak memerlukan perhatian adalah terlalu lemah untuk 2.7.0. Ia hendaklah sekurang-kurangnya menyebut `utf8mb4` lalai baharu dan pemilih pengumpulan dinamik.

## 6. Bab 6: Konfigurasi Sistem Akhir

Fail:

- `chapter-6-final-system-configuration.md`### 6.1 Fail konfigurasi yang dijana ditukar

Panduan pada masa ini mengatakan pemasang menulis `mainfile.php` dan `secure.php`.

Dalam 2.7.0 ia juga memasang fail konfigurasi ke dalam `xoops_data/configs/`, termasuk:

- `xoopsconfig.php`
- fail konfigurasi captcha
- fail konfigurasi textsanitizer

### 6.2 Fail konfigurasi sedia ada dalam `xoops_data/configs/` tidak ditimpa

Tingkah laku bukan tulis ganti adalah **skop**, bukan global. Dua laluan kod yang berbeza dalam `page_configsave.php` menulis fail konfigurasi:

- `writeConfigurationFile()` (dipanggil pada baris 59 dan 66) **sentiasa** menjana semula `xoops_data/data/secure.php` dan `mainfile.php` daripada input wizard. Tiada pemeriksaan kewujudan; salinan sedia ada diganti.
- `copyConfigDistFiles()` (dipanggil pada baris 62, ditakrifkan pada baris 317) hanya menyalin fail `xoops_data/configs/` (`xoopsconfig.php`, konfigurasi captcha, konfigurasi textsanitizer) **jika destinasi belum wujud**.

Penulisan semula bab mesti mencerminkan kedua-dua tingkah laku dengan jelas:

- Untuk `mainfile.php` dan `secure.php`: beri amaran bahawa sebarang suntingan tangan pada fail ini akan ditimpa apabila pemasang dijalankan semula.
- Untuk fail `xoops_data/configs/`: terangkan bahawa penyesuaian setempat dikekalkan merentas jalankan semula dan peningkatan, dan memulihkan lalai yang dihantar memerlukan pemadaman fail dan jalankan semula (atau menyalin `.dist.php` yang sepadan dengan tangan).Jangan umumkan "fail sedia ada dikekalkan" merentas semua fail konfigurasi yang ditulis pemasang — itu tidak betul dan akan mengelirukan pentadbir yang mengedit `mainfile.php` atau `secure.php`.

### 6.3 HTTPS dan pengendalian proksi terbalik berubah

`mainfile.php` yang dihasilkan kini menyokong pengesanan protokol yang lebih luas, termasuk pengepala proksi terbalik. Panduan harus menyebut perkara ini dan bukannya hanya membayangkan pengesanan `http` atau `https` secara langsung.

### 6.4 Kiraan jadual adalah salah

Bab semasa mengatakan tapak baharu mencipta `32` jadual.

XOOPS 2.7.0 mencipta `33` jadual. Jadual yang hilang ialah:

- `tokens`

Tindakan:

- Kemas kini kiraan dari 32 hingga 33.
- Tambahkan `tokens` pada senarai jadual.

## 7. Bab 7: Tetapan Pentadbiran

Fail:

- `chapter-7-administration-settings.md`

### 7.1 Perihalan UI kata laluan sudah lapuk

Pemasang masih termasuk penjanaan kata laluan, tetapi kini turut termasuk:

- meter kekuatan kata laluan berasaskan zxcvbn
- label kekuatan visual
- Penjana 16 aksara dan aliran salinan

Kemas kini teks dan tangkapan skrin untuk menerangkan panel kata laluan semasa.

### 7.2 Pengesahan e-mel kini dikuatkuasakan

E-mel pentadbir disahkan dengan `FILTER_VALIDATE_EMAIL`. Bab ini harus menyebut bahawa nilai e-mel yang tidak sah ditolak.### 7.3 Bahagian kunci lesen adalah salah

Ini adalah salah satu pembetulan fakta yang paling penting.

Panduan semasa berkata:

- terdapat `License System Key`
- ia disimpan dalam `/include/license.php`
- `/include/license.php` mesti boleh ditulis semasa pemasangan

Itu tidak lagi tepat.

Apa yang sebenarnya dilakukan oleh 2.7.0:

- pemasangan menulis data lesen kepada `xoops_data/data/license.php`
- `htdocs/include/license.php` kini hanyalah pembungkus yang tidak digunakan lagi yang memuatkan fail daripada `XOOPS_VAR_PATH`
- perkataan lama tentang membuat `/include/license.php` boleh ditulis hendaklah dibuang

Tindakan:

- Tulis semula bahagian ini dan bukannya memadamkannya.
- Kemas kini laluan daripada `/include/license.php` kepada `xoops_data/data/license.php`.

### 7.4 Senarai tema sudah lapuk

Panduan semasa masih merujuk kepada Zetagenesis dan set tema era 2.5 yang lebih lama.

Tema yang terdapat dalam XOOPS 2.7.0:

- `default`
- `xbootstrap`
- `xbootstrap5`
- `xswatch4`
- `xswatch5`
- `xtailwind`
- `xtailwind2`

Juga ambil perhatian:

- `xswatch4` ialah tema lalai semasa yang disisipkan oleh data pemasang.
- Zetagenesis bukan lagi sebahagian daripada senarai tema berpakej.

### 7.5 Senarai modul sudah lapuk

Modul yang terdapat dalam pakej 2.7.0:

- `system` — dipasang secara automatik semasa langkah mengisi jadual / pemasukan data. Sentiasa hadir, tidak pernah kelihatan dalam pemilih.
- `debugbar` — boleh dipilih dalam langkah pemasang.
- `pm` — boleh dipilih dalam langkah pemasang.
- `profile` — boleh dipilih dalam langkah pemasang.
- `protector` — boleh dipilih dalam langkah pemasang.Penting: halaman pemasang modul (`htdocs/install/page_moduleinstaller.php`) membina senarai calonnya dengan mengulangi `XoopsLists::getModulesList()` dan **menapis apa sahaja yang sudah ada dalam jadual modul** (baris 95-102 mengumpul `$listed_mods`; baris 116 melangkau mana-mana direktori yang terdapat dalam senarai itu). Oleh kerana `system` dipasang sebelum langkah ini dijalankan, ia tidak pernah muncul sebagai kotak pilihan.

Perubahan panduan diperlukan:

- Berhenti mengatakan hanya terdapat tiga modul yang digabungkan.
- Terangkan langkah pemasang sebagai menunjukkan **empat modul boleh dipilih** (`debugbar`, `pm`, `profile`, `protector`), bukan lima.
- Dokumen `system` secara berasingan sebagai modul teras yang sentiasa dipasang yang tidak muncul dalam pemilih.
- Tambahkan `debugbar` pada perihalan modul berpakatan sebagai baharu dalam 2.7.0.
- Ambil perhatian bahawa prapilihan modul lalai pemasang kini kosong; modul tersedia untuk dipilih, tetapi tidak disemak terlebih dahulu oleh konfigurasi pemasang.

## 8. Bab 8: Sedia Untuk Pergi

Fail:

- `chapter-8-ready-to-go.md`

### 8.1 Proses pembersihan pemasangan memerlukan penulisan semula

Panduan semasa mengatakan pemasang menamakan semula folder pemasangan kepada nama yang unik.

Itu masih berlaku, tetapi mekanismenya berubah:

- skrip pembersihan luaran dibuat dalam akar web
- halaman akhir mencetuskan pembersihan melalui AJAX
- folder install dinamakan semula kepada `install_remove_<unique suffix>`
- sandaran kepada `cleanup.php` masih wujudTindakan:

- Kemas kini penjelasan.
- Pastikan arahan yang dihadapi pengguna mudah: padamkan direktori pemasangan yang dinamakan semula selepas pemasangan.

### 8.2 Rujukan lampiran papan pemuka pentadbir sudah lapuk

Bab 8 masih menunjukkan pembaca ke arah pengalaman pentadbir era Oksigen yang lama. Itu perlu diselaraskan dengan tema pentadbir semasa:

- `default`
- `dark`
- `modern`
- `transition`

### 8.3 Panduan penyuntingan laluan selepas pemasangan memerlukan pembetulan

Teks semasa memberitahu pembaca untuk mengemas kini `secure.php` dengan definisi laluan. Dalam 2.7.0, pemalar laluan tersebut ditakrifkan dalam `mainfile.php`, manakala `secure.php` memegang data selamat. Contoh blok dalam bab ini hendaklah diperbetulkan sewajarnya.

### 8.4 Tetapan pengeluaran perlu ditambah

Panduan hendaklah menyebut secara eksplisit lalai pengeluaran yang kini terdapat dalam `mainfile.dist.php`:

- `XOOPS_DB_LEGACY_LOG` hendaklah kekal `false`
- `XOOPS_DEBUG` hendaklah kekal `false`

## 9. Bab 9: Naik Taraf XOOPS Pemasangan Sedia Ada

Fail:

- `chapter-9-upgrade-existing-XOOPS-installation.md`

Bab ini memerlukan penulisan semula yang terbesar.

### 9.1 Tambah langkah pra-penerbangan Smarty 4 mandatori

XOOPS 2.7.0 aliran naik taraf kini memaksa proses pra-penerbangan sebelum selesai naik taraf.

Aliran baharu yang diperlukan:1. Salin direktori `upgrade/` ke akar tapak.
2. Lari `/upgrade/preflight.php`.
3. Imbas `/themes/` dan `/modules/` untuk sintaks Smarty lama.
4. Gunakan mod pembaikan pilihan jika sesuai.
5. Jalankan semula sehingga bersih.
6. Teruskan ke `/upgrade/`.

Bab semasa tidak menyebut perkara ini sama sekali, yang menjadikannya tidak serasi dengan panduan 2.7.0.

### 9.2 Gantikan naratif gabungan era 2.5.2 manual

Bab semasa masih menerangkan peningkatan gaya 2.5.2 manual dengan gabungan rangka kerja, nota AltSys dan penstrukturan semula fail yang diuruskan dengan tangan. Itu harus digantikan dengan urutan naik taraf 2.7.x sebenar daripada `release_notes.txt` dan `upgrade/README.md`.

Garis besar bab yang disyorkan:

1. Sandarkan fail dan pangkalan data.
2. Matikan tapak.
3. Salin `htdocs/` ke atas akar hidup.
4. Salin `htdocs/xoops_lib` ke dalam laluan perpustakaan aktif.
5. Salin `htdocs/xoops_data` ke dalam laluan data aktif.
6. Salin `upgrade/` ke akar web.
7. Lari `preflight.php`.
8. Lari `/upgrade/`.
9. Gesaan pengemas kini lengkap.
10. Kemas kini modul `system`.
11. Kemas kini `pm`, `profile`, dan `protector` jika dipasang.
12. Padamkan `upgrade/`.
13. Hidupkan semula tapak.

### 9.3 Dokumen perubahan naik taraf 2.7.0 sebenar

Pengemas kini untuk 2.7.0 termasuk sekurang-kurangnya perubahan konkrit ini:- cipta `tokens` jadual
- luaskan `bannerclient.passwd` untuk cincang kata laluan moden
- tambah tetapan pilihan kuki sesi
- alih keluar direktori yang dibundel yang usang

Panduan tidak perlu mendedahkan setiap perincian pelaksanaan, tetapi ia harus berhenti membayangkan peningkatan hanya salinan fail ditambah kemas kini modul.

## 10. Halaman Naik Taraf Sejarah

Fail:

- `upgrading-from-XOOPS-2.4.5-easy-way.md`
- `upgrading-from-XOOPS-2.0.-above-2.0.14-and-2.2..md`
- `upgrading-from-any-XOOPS-2.0.7-to-2.0.13.2.md`
- `upgrading-a-non-utf-8-site.md`
- `upgrading-xoopseditor-package.md`

**Status:** keputusan struktur telah pun diselesaikan — akar `SUMMARY.md` mengalihkannya ke bahagian **Nota Naik Taraf Sejarah** khusus, dan setiap fail membawa butiran "Rujukan sejarah" yang menunjukkan pembaca kepada Bab 9 untuk peningkatan 2.7.0. Mereka bukan lagi panduan peningkatan kelas pertama.

**Baki kerja (konsistensi sahaja):**

- Pastikan `README.md` (root) menyenaraikan ini di bawah tajuk "Nota Naik Taraf Sejarah" yang sama, bukan di bawah pengepala "Naik Taraf" generik.
- Cerminkan pemisahan yang sama dalam `de/README.md`, `de/SUMMARY.md`, `fr/README.md`, `fr/SUMMARY.md`, dan `en/SUMMARY.md`.
- Pastikan setiap halaman naik taraf sejarah (root dan salinan `de/book/upg*.md` / `fr/book/upg*.md` yang disetempatkan) membawa petak bual kandungan yang menghubungkan kembali ke Bab 9.## 11. Lampiran 1: Pentadbir GUI

Fail:

- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`

Lampiran ini terikat dengan pentadbir Oksigen GUI dan memerlukan penulisan semula.

Perubahan yang diperlukan:

- menggantikan semua rujukan Oksigen
- gantikan tangkapan skrin icon/menu lama
- dokumenkan tema pentadbir semasa:
  - lalai
  - gelap
  - moden
  - peralihan
- sebutkan keupayaan pentadbir 2.7.0 semasa yang disebut dalam nota keluaran:
  - keupayaan lebihan templat dalam tema pentadbir sistem
  - set tema pentadbir dikemas kini

## 12. Lampiran 2: Memuat naik XOOPS Melalui FTP

Fail:

- `appendix-2-uploading-XOOPS-via-ftp.md`

Perubahan yang diperlukan:

- alih keluar andaian khusus HostGator dan khusus cPanel
- memodenkan kata-kata muat naik fail
- ambil perhatian bahawa `xoops_lib` kini termasuk kebergantungan Komposer, jadi muat naik lebih besar dan tidak boleh dipangkas secara terpilih

## 13. Lampiran 5: Keselamatan

Fail:

- `appendix-5-increase-security-of-your-XOOPS-installation.md`

Perubahan yang diperlukan:

- buang `register_globals` perbincangan sepenuhnya
- alih keluar bahasa tiket hos yang lapuk
- teks kebenaran yang betul dari `404` hingga `0444` di mana baca sahaja bertujuan
- kemas kini perbincangan `mainfile.php` dan `secure.php` agar sepadan dengan reka letak 2.7.0
- tambah konteks pemalar berkaitan keselamatan domain cookie baharu:
  - `XOOPS_COOKIE_DOMAIN_USE_PSL`
  - `XOOPS_COOKIE_DOMAIN`
- tambah panduan pengeluaran untuk:
  - `XOOPS_DB_LEGACY_LOG`
  - `XOOPS_DEBUG`## 14. Kesan Penyelenggaraan Merentas Bahasa

Selepas fail Bahasa Inggeris peringkat akar ditetapkan, kemas kini yang setara diperlukan dalam:

- `de/book/`
- `fr/book/`
- `de/README.md`
- `fr/README.md`
- `de/SUMMARY.md`
- `fr/SUMMARY.md`

Pokok `en/` juga memerlukan semakan kerana ia mengandungi README dan set aset yang berasingan, tetapi kelihatan hanya mempunyai separa pokok `book/`.

## 15. Susunan Keutamaan

### Kritikal sebelum dikeluarkan

1. Kemas kini repo/version rujukan kepada 2.7.0.
2. Tulis semula Bab 9 di sekitar aliran naik taraf 2.7.0 sebenar dan pra-penerbangan Smarty 4.
3. Kemas kini keperluan sistem kepada PHP 8.2+ dan MySQL 5.7.8+.
4. Betulkan laluan fail kunci lesen Bab 7.
5. Betulkan tema dan inventori modul.
6. Betulkan kiraan jadual Bab 6 dari 32 hingga 33.

### Penting untuk ketepatan

7. Tulis semula panduan laluan boleh tulis.
8. Tambahkan keperluan autoloader Komposer pada persediaan laluan.
9. Kemas kini panduan charset pangkalan data kepada `utf8mb4`.
10. Betulkan panduan penyuntingan laluan Bab 8 supaya pemalar didokumenkan dalam fail yang betul.
11. Alih keluar arahan checksum.
12. Keluarkan `register_globals` dan lain-lain PHP bimbingan.

### Pembersihan kualiti keluaran

13. Gantikan semua tangkapan skrin pemasang dan pentadbir.
14. Alihkan halaman naik taraf sejarah daripada aliran utama.
15. Segerakkan salinan Jerman dan Perancis selepas bahasa Inggeris dibetulkan.
16. Bersihkan pautan yang lapuk dan garisan README pendua.