---
title: "Memindahkan Situs"
---

Ini bisa menjadi teknik yang sangat berguna untuk membuat prototipe situs XOOPS baru di sistem lokal atau server pengembangan. Sebaiknya uji pemutakhiran XOOPS pada salinan situs produksi Anda terlebih dahulu, untuk berjaga-jaga jika terjadi kesalahan. Untuk mencapai hal ini, Anda harus dapat memindahkan situs XOOPS Anda dari satu situs ke situs lainnya. Inilah yang perlu Anda ketahui agar berhasil memindahkan situs XOOPS Anda.

Langkah pertama adalah membangun lingkungan situs baru Anda. Item yang sama yang tercakup dalam bagian [Persiapan Lanjutan](../installation/preparations/) juga berlaku di sini.

Secara ulasan, langkah-langkah tersebut adalah:

* dapatkan hosting, termasuk nama domain atau persyaratan email apa pun
* dapatkan akun pengguna dan kata sandi MySQL
* Dapatkan database MySQL yang semua hak istimewanya dimiliki oleh pengguna di atas

Proses selanjutnya cukup mirip dengan instalasi normal, namun:

* Daripada menyalin file dari distribusi XOOPS, Anda akan menyalinnya dari situs yang ada
* alih-alih menjalankan penginstal, Anda akan mengimpor database yang sudah terisi
* Daripada memasukkan jawaban di installer, Anda akan mengubah jawaban sebelumnya di file dan database

## Copy File Situs yang Ada

Buat salinan lengkap file situs Anda yang ada ke mesin lokal tempat Anda dapat mengeditnya. Jika Anda bekerja dengan host jarak jauh, Anda dapat menggunakan FTP untuk menyalin file. Anda memerlukan salinan untuk digunakan meskipun situs tersebut berjalan di mesin lokal Anda, cukup buat salinan lain dari direktori situs tersebut.

Penting untuk diingat untuk menyertakan direktori _xoops_data_ dan _xoops_lib_ meskipun namanya diubah menjadi and/or yang direlokasi.

Untuk mempermudah, Anda harus menghilangkan cache dan file template terkompilasi Smarty dari salinan Anda. File-file ini akan dibuat ulang di lingkungan baru Anda, dan mungkin menyebabkan masalah dengan penyimpanan informasi lama yang salah jika tidak dihapus. Untuk melakukannya, hapus semua file, kecuali _index.html_, di ketiga direktori berikut:

*_xoops_data_/caches/smarty_cache
*_xoops_data_/caches/smarty_compile
*_xoops_data_/caches/xoops_cache

> **Catatan:** Menghapus `smarty_compile` sangat penting ketika memindahkan situs ke atau dari XOOPS 2.7.0. XOOPS 2.7.0 menggunakan Smarty 4, dan template terkompilasi Smarty 4 tidak dapat dipertukarkan dengan template terkompilasi Smarty 3. Membiarkan file kompilasi yang sudah basi akan menyebabkan kesalahan template saat halaman pertama dimuat di situs baru.

### `xoops_lib` dan Ketergantungan Komposer

XOOPS 2.7.0 mengelola dependensi PHP melalui Komposer, di dalam `xoops_lib/`. Direktori `xoops_lib/vendor/` berisi perpustakaan pihak ketiga yang dibutuhkan XOOPS saat runtime (Smarty 4, PHPMailer, HTMLPurifier, dll.). Saat memindahkan situs, Anda harus menyalin seluruh pohon `xoops_lib/` — termasuk `vendor/` — ke host baru. Jangan mencoba membuat ulang `vendor/` pada host target kecuali Anda adalah pengembang yang telah mengkustomisasi `composer.json` dan memiliki Komposer yang tersedia pada target.

## Siapkan Lingkungan Baru

Item yang sama yang dibahas di bagian [Persiapan Lanjutan](../installation/preparations/) juga berlaku di sini. Kami akan berasumsi di sini bahwa Anda memiliki hosting apa pun yang Anda perlukan untuk situs yang Anda pindahkan.

### Informasi Penting (mainfile.php dan secure.php)

Pemindahan situs yang berhasil melibatkan perubahan referensi apa pun ke file absolut dan nama jalur, URL, parameter basis data, dan kredensial akses.

Dua file, `mainfile.php` di root web situs Anda, dan `data/secure.php` di direktori _xoops_data_ situs Anda (berganti nama menjadi and/or dipindahkan) _xoops_data_ menentukan parameter dasar situs Anda, seperti URL, lokasinya di sistem file host, dan cara kerjanya terhubung ke database.

Anda perlu mengetahui nilai-nilai yang ada di sistem lama dan nilai-nilai yang akan ada di sistem baru.

#### mainfile.php

| Nama | Nilai Lama di mainfile.php | Nilai Baru di mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH |  |  |
| XOOPS_PATH |  |  |
| XOOPS_VAR_PATH |  |  |
| XOOPS_URL |  |  |
| XOOPS_COOKIE_DOMAIN |  |  |Buka _mainfile.php_ di editor Anda. Ubah nilai definisi yang ditunjukkan pada bagan di atas dari nilai lama, ke nilai yang sesuai untuk situs baru.

Catat nilai-nilai lama dan baru, karena kita perlu melakukan perubahan serupa di tempat lain dalam beberapa langkah selanjutnya.

Sebagai contoh, jika Anda memindahkan situs dari PC lokal ke layanan hosting komersial, nilainya mungkin terlihat seperti ini:

| Nama | Nilai Lama di mainfile.php | Nilai Baru di mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH | c:/wamp/xoopscore27/htdocs | /home8/example/public_html |
| XOOPS_PATH | c:/wamp/xoopscore27/htdocs/xoops_lib | /home8/example/private/xoops_lib |
| XOOPS_VAR_PATH | c:/wamp/xoopscore27/htdocs/xoops_data | /home8/example/private/xoops_data |
| XOOPS_URL | http://localhost/xoops | https://example.com |
| XOOPS_COOKIE_DOMAIN | host lokal | contoh.com |

Setelah Anda mengubah _mainfile.php_, simpan.

Ada kemungkinan bahwa beberapa file lain mungkin berisi referensi hardcode ke URL atau bahkan jalur Anda. Hal ini lebih mungkin terjadi pada theme dan menu yang disesuaikan, namun dengan editor Anda, Anda dapat mencari di semua file, hanya untuk memastikan.

Di editor Anda, lakukan pencarian di seluruh file dalam salinan Anda, cari nilai XOOPS_URL yang lama, dan ganti dengan nilai yang baru.

Lakukan hal yang sama untuk nilai XOOPS_ROOT_PATH lama, ganti semua kemunculan dengan nilai baru.

Simpan catatan Anda, karena kami harus menggunakannya lagi nanti saat kami memindahkan database.

#### data/secure.php

| Nama | Nilai Lama di data/secure.php | Nilai Baru di data/secure.php |
| :--- | :--- | :--- |
| XOOPS_DB_HOST |  |  |
| XOOPS_DB_USER |  |  |
| XOOPS_DB_PASS |  |  |
| XOOPS_DB_NAME |  |  |

Buka _data/secure.php_ di direktori _xoops_data_ yang telah diubah namanya menjadi and/or yang direlokasi di editor Anda. Ubah nilai definisi yang ditunjukkan pada bagan di atas dari nilai lama, ke nilai yang sesuai untuk situs baru.

#### File Lainnya

Mungkin ada file lain yang mungkin memerlukan perhatian saat situs Anda dipindahkan. Beberapa contoh umum adalah kunci API untuk berbagai layanan yang mungkin terkait dengan domain, seperti:

* Google Peta
* Ambil Ulang2
* Suka tombol
* Berbagi tautan iklan and/or seperti Shareaholic atau AddThis

Mengubah jenis asosiasi ini tidak dapat diotomatisasi dengan mudah, karena koneksi ke domain lama biasanya merupakan bagian dari pendaftaran di sisi layanan. Dalam beberapa kasus, tindakan ini mungkin hanya menambah atau mengubah domain yang terkait dengan layanan.

### Salin File ke Situs Baru

Salin file Anda yang sekarang dimodifikasi ke situs baru Anda. Tekniknya sama seperti yang digunakan pada [Instalasi](../installation/installation/), yaitu menggunakan FTP.

## Copy Database Situs yang Ada

### Backup Database dari Server Lama

Untuk langkah ini, sangat disarankan menggunakan _phpMyAdmin_. Masuk ke _phpMyAdmin_ untuk situs Anda yang ada, pilih database Anda, dan pilih _Ekspor_.

Pengaturan default biasanya baik-baik saja, jadi pilih saja "Metode ekspor" dari _Quick_ dan "Format" dari _SQL_.

Gunakan tombol _Go_ untuk mengunduh cadangan basis data.

![Exporting a Database with phpMyAdmin](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

Jika Anda memiliki tabel di database Anda yang bukan dari XOOPS atau modulnya, dan TIDAK seharusnya dipindahkan, Anda harus memilih "Metode ekspor" dari _Custom_ dan pilih tabel terkait XOOPS saja di database Anda. (Ini dimulai dengan "awalan" yang Anda tentukan saat instalasi. Anda dapat mencari awalan database Anda di file `xoops_data/data/secure.php`.)

### Mengembalikan Database ke Server Baru

Di host baru Anda, dengan menggunakan database baru, pulihkan database menggunakan [alat](../tools/tools.md) seperti tab _Import_ di _phpMyAdmin_ (atau _bigdump_ jika diperlukan.)

### Perbarui URL dan Jalur di Database

Perbarui tautan http apa pun ke sumber daya di situs Anda di database Anda. Ini bisa menjadi upaya yang sangat besar, dan ada [alat](../tools/tools.md) untuk mempermudahnya.

Interconnect/it memiliki produk bernama Search-Replace-DB yang dapat membantu dalam hal ini. Alat ini hadir dengan kesadaran akan lingkungan bawaan Wordpress dan Drupal. Alat ini bisa sangat membantu, namun akan lebih baik lagi bila alat ini mengetahui XOOPS Anda. Anda dapat menemukan versi sadar XOOPS di [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb)Ikuti instruksi dalam file README.md untuk mengunduh dan menginstal sementara utilitas ini di situs Anda. Sebelumnya, kami mengubah definisi XOOPS_URL. Saat Anda menjalankan alat ini, Anda ingin mengganti definisi XOOPS_URL asli dengan definisi baru, yaitu mengganti [http://localhost/xoops](http://localhost/xoops) dengan [https://example.com](https://example.com)

![Using Seach and Replace DB](/xoops-docs/2.7/img/installation/srdb-01.png)

Masukkan URL lama dan baru Anda, dan pilih opsi uji coba. Tinjau perubahannya, dan jika semuanya terlihat baik, pilih opsi live run. Langkah ini akan menangkap item konfigurasi dan tautan di dalam konten Anda yang merujuk ke situs Anda URL.

![Reviewing Changes in SRDB](/xoops-docs/2.7/img/installation/srdb-02.png)

Ulangi proses menggunakan nilai lama dan baru untuk XOOPS_ROOT_PATH.

#### Pendekatan Alternatif Tanpa SRDB

Cara lain untuk menyelesaikan langkah ini tanpa alat srdb adalah dengan membuang database Anda, mengedit dump di editor teks dengan mengubah URL dan jalur, lalu memuat ulang database dari dump yang telah Anda edit. Ya, proses tersebut cukup melibatkan dan membawa risiko yang cukup sehingga orang-orang termotivasi untuk membuat alat khusus seperti Search-Replace-DB.

## Cobalah Situs Anda yang Direlokasi

Pada titik ini, situs Anda sudah siap dijalankan di lingkungan barunya!

Tentu saja, masalah selalu ada. Jangan takut untuk mengirimkan pertanyaan apa pun di [Forum xoops.org](https://xoops.org/modules/newbb/index.php).