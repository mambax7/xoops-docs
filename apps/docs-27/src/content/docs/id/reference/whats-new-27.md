---
title: "Apa yang Baru di XOOPS 2.7.0"
---

XOOPS 2.7.0 merupakan pembaruan signifikan dari seri 2.5.x. Sebelum memasang atau memutakhirkan, tinjau perubahan di halaman ini sehingga Anda tahu apa yang diharapkan. Daftar di bawah ini difokuskan pada item yang mempengaruhi instalasi dan administrasi situs — untuk daftar lengkap perubahan, lihat catatan rilis yang dikirimkan bersama distribusi.

## PHP 8.2 adalah minimum baru

XOOPS 2.7.0 memerlukan **PHP 8.2 atau lebih baru**. PHP 7.x dan versi lebih lama tidak lagi didukung. PHP 8.4 atau lebih tinggi sangat disarankan.

**Tindakan:** Konfirmasikan penawaran host Anda PHP 8.2+ sebelum Anda memulai. Lihat [Persyaratan](installation/requirements.md).

## MySQL 5.7 adalah minimum baru

Minimum baru adalah **MySQL 5.7** (atau MariaDB yang kompatibel). MySQL 8.4 atau lebih tinggi sangat disarankan. MySQL 9.0 juga didukung.

Peringatan lama tentang masalah kompatibilitas PHP/MySQL 8 tidak berlaku lagi, karena versi PHP yang terpengaruh tidak lagi didukung oleh XOOPS.

## Smarty 4 menggantikan Smarty 3

Ini adalah perubahan terbesar pada situs yang sudah ada. XOOPS 2.7.0 menggunakan **Smarty 4** sebagai mesin templatenya. Smarty 4 lebih ketat dalam hal sintaksis template dibandingkan Smarty 3, dan beberapa theme khusus serta template module mungkin memerlukan penyesuaian sebelum dapat dirender dengan benar.

Untuk membantu Anda mengidentifikasi dan memperbaiki masalah ini, XOOPS 2.7.0 mengirimkan **pemindai preflight** di direktori `upgrade/` yang memeriksa template Anda yang ada untuk mengetahui ketidakcocokan Smarty 4 dan dapat memperbaiki banyak di antaranya secara otomatis.

**Tindakan:** Jika Anda meningkatkan versi dari 2.5.x dan memiliki theme khusus atau module lama, jalankan [Pemeriksaan Preflight](upgrading/upgrade/preflight.md) _before_ menjalankan pemutakhiran utama.

## Dependensi yang dikelola komposer

XOOPS 2.7.0 menggunakan **Composer** untuk mengelola dependensi PHP-nya. Ini tinggal di `xoops_lib/vendor/`. Pustaka pihak ketiga yang sebelumnya digabungkan ke dalam core atau ke dalam module — PHPMailer, HTMLPurifier, Smarty, dan lainnya — kini disediakan melalui Komposer.

**Tindakan:** Sebagian besar operator situs tidak perlu melakukan apa pun — tarball rilis dikirimkan dengan `vendor/` yang sudah terisi. Jika Anda memindahkan atau meningkatkan versi situs, salin seluruh pohon `xoops_lib/`, termasuk `vendor/`. Pengembang yang mengkloning repositori git harus menjalankan `composer install` di dalam `htdocs/xoops_lib/`. Lihat [Catatan untuk Pengembang](notes-for-developers/developers.md).

## Preferensi cookie sesi baru yang diperkeras

Dua preferensi baru ditambahkan selama peningkatan:

* **`session_cookie_samesite`** — mengontrol atribut SameSite pada cookie sesi (`Lax`, `Strict`, atau `None`).
* **`session_cookie_secure`** — jika diaktifkan, cookie sesi hanya dikirim melalui HTTPS.

**Tindakan:** Setelah memutakhirkan, tinjau ini di bawah Opsi Sistem → Preferensi → Pengaturan Umum. Lihat [Setelah Peningkatan](upgrading/upgrade/ustep-04.md).

## Tabel `tokens` baru

XOOPS 2.7.0 menambahkan tabel database `tokens` untuk penyimpanan token cakupan umum. Pemutakhiran membuat tabel ini secara otomatis sebagai bagian dari pemutakhiran 2.5.11 → 2.7.0.

## Penyimpanan kata sandi yang dimodernisasi

Kolom `bannerclient.passwd` telah diperluas menjadi `VARCHAR(255)` sehingga dapat menampung hash kata sandi modern (bcrypt, argon2). Pemutakhiran memperluas kolom secara otomatis.

## Pembaruan theme dan susunan module

XOOPS 2.7.0 dikirimkan dengan theme front-end yang diperbarui:

* `default`, `xbootstrap` (warisan), `xbootstrap5`, `xswatch4`, `xswatch5`, `xtailwind`, `xtailwind2`

theme admin **Modern** baru disertakan bersama theme Transisi yang sudah ada.

module **DebugBar** baru berdasarkan Symfony VarDumper dikirimkan sebagai salah satu module opsional yang dapat diinstal. Ini berguna untuk pengembangan dan pementasan, tetapi biasanya tidak dipasang di lokasi produksi publik.

Lihat [Pilih theme](installation/installation/step-12.md) dan [Instalasi module](installation/installation/step-13.md).

## Menyalin dalam rilis baru tidak lagi menimpa konfigurasiSebelumnya, menyalin distribusi XOOPS baru di atas situs yang sudah ada memerlukan kehati-hatian untuk menghindari penimpaan `mainfile.php` dan file konfigurasi lainnya. Di 2.7.0, proses penyalinan membiarkan file konfigurasi yang ada tetap utuh, sehingga membuat pemutakhiran terasa lebih aman.

Anda tetap harus membuat cadangan penuh sebelum melakukan peningkatan apa pun.

## Kemampuan template yang berlebihan dalam theme admin sistem

theme admin di XOOPS 2.7.0 kini dapat menggantikan template admin sistem individual, sehingga memudahkan penyesuaian UI administrasi tanpa membagi seluruh module sistem.

## Apa yang tidak berubah

Untuk meyakinkan, bagian XOOPS ini bekerja dengan cara yang sama di 2.7.0 seperti di 2.5.x:

* Urutan halaman penginstal dan alur keseluruhan
* Pembagian konfigurasi `mainfile.php` plus `xoops_data/data/secure.php`
* Praktik yang disarankan untuk merelokasi `xoops_data` dan `xoops_lib` di luar root web
* Model instalasi module dan format manifes `xoops_version.php`
* Alur kerja pemindahan situs (cadangan, edit `mainfile.php`/`secure.php`, gunakan SRDB atau serupa)

## Ke mana harus pergi selanjutnya

* Mulai baru? Lanjutkan ke [Persyaratan](installation/requirements.md).
* Meningkatkan dari 2.5.x? Mulailah dengan [Peningkatan](upgrading/upgrade/README.md), lalu jalankan [Pemeriksaan Preflight](upgrading/upgrade/preflight.md).