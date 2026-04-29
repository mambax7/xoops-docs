---
title: "Apa yang Baharu dalam XOOPS 2.7.0"
---
XOOPS 2.7.0 ialah kemas kini penting daripada siri 2.5.x. Sebelum memasang atau menaik taraf, semak perubahan pada halaman ini supaya anda tahu perkara yang boleh dijangkakan. Senarai di bawah tertumpu pada item yang mempengaruhi pemasangan dan pentadbiran tapak — untuk senarai lengkap perubahan, lihat nota keluaran yang dihantar bersama pengedaran.

## PHP 8.2 ialah minimum baharu

XOOPS 2.7.0 memerlukan **PHP 8.2 atau lebih baru**. PHP 7.x dan lebih awal tidak lagi disokong. PHP 8.4 atau lebih tinggi amat disyorkan.

**Tindakan:** Sahkan tawaran hos anda PHP 8.2+ sebelum anda mula. Lihat [Keperluan](installation/requirements.md).

## MySQL 5.7 ialah minimum baharu

Minimum baharu ialah **MySQL 5.7** (atau MariaDB yang serasi). MySQL 8.4 atau lebih tinggi amat disyorkan. MySQL 9.0 juga disokong.

Amaran lama tentang masalah keserasian PHP/MySQL 8 tidak lagi digunakan, kerana versi PHP yang terjejas tidak lagi disokong oleh XOOPS.

## Smarty 4 menggantikan Smarty 3

Ini adalah satu-satunya perubahan terbesar untuk tapak sedia ada. XOOPS 2.7.0 menggunakan **Smarty 4** sebagai enjin templatnya. Smarty 4 lebih ketat tentang sintaks templat berbanding Smarty 3, dan beberapa tema tersuai dan templat modul mungkin memerlukan pelarasan sebelum ia akan dipaparkan dengan betul.Untuk membantu anda mengenal pasti dan membaiki isu ini, XOOPS 2.7.0 menghantar **pengimbas pra penerbangan** dalam direktori `upgrade/` yang memeriksa templat sedia ada anda untuk mengetahui ketidakserasian Smarty 4 yang diketahui dan boleh membaiki kebanyakannya secara automatik.

**Tindakan:** Jika anda sedang menaik taraf daripada 2.5.x dan mempunyai tema tersuai atau modul yang lebih lama, jalankan [Semakan Preflight](upgrading/upgrade/preflight.md) _sebelum_ menjalankan peningkatan utama.

## Kebergantungan yang diuruskan oleh komposer

XOOPS 2.7.0 menggunakan **Komposer** untuk mengurus kebergantungan PHPnya. Mereka ini tinggal di `xoops_lib/vendor/`. Pustaka pihak ketiga yang sebelum ini digabungkan ke dalam teras atau ke dalam modul — PHPMailer, HTMLPurifier, Smarty dan lain-lain — kini dibekalkan melalui Composer.

**Tindakan:** Kebanyakan pengendali tapak tidak perlu melakukan apa-apa — lepaskan tarballs dengan `vendor/` sudah diisi. Jika anda memindahkan atau menaik taraf tapak, salin keseluruhan pokok `xoops_lib/`, termasuk `vendor/`. Pemaju mengklonkan git repository should run `composer install` inside `htdocs/xoops_lib/`. See [Notes for Developers](notes-for-developers/developers.md).

## Pilihan kuki sesi keras baharu

Dua pilihan baharu ditambah semasa naik taraf:

* **`session_cookie_samesite`** — mengawal atribut SameSite pada kuki sesi (`Lax`, `Strict`, atau `None`).
* **`session_cookie_secure`** — apabila didayakan, kuki sesi hanya dihantar melalui HTTPS.**Tindakan:** Selepas menaik taraf, semak ini di bawah Pilihan Sistem → Keutamaan → Tetapan Umum. Lihat [Selepas Naik Taraf](upgrading/upgrade/ustep-04.md).

## Meja `tokens` baharu

XOOPS 2.7.0 menambah jadual pangkalan data `tokens` untuk penyimpanan token berskop generik. Penaik taraf mencipta jadual ini secara automatik sebagai sebahagian daripada peningkatan 2.5.11 → 2.7.0.

## Storan kata laluan moden

Lajur `bannerclient.passwd` telah diluaskan kepada `VARCHAR(255)` supaya ia boleh menyimpan cincang kata laluan moden (bcrypt, argon2). Penaik taraf meluaskan lajur secara automatik.

## Tema dan barisan modul dikemas kini

XOOPS 2.7.0 dihantar dengan tema bahagian hadapan yang dikemas kini:

* `default`, `xbootstrap` (warisan), `xbootstrap5`, `xswatch4`, `xswatch5`, `xtailwind`, `xtailwind2`

Tema pentadbir **Moden** baharu disertakan bersama tema Peralihan sedia ada.

Modul **DebugBar** baharu berdasarkan Symfony VarDumper dihantar sebagai salah satu modul boleh dipasang pilihan. Ia berguna untuk pembangunan dan pementasan, tetapi biasanya tidak dipasang di tapak pengeluaran awam.

Lihat [Pilih Tema](installation/installation/step-12.md) dan [Pemasangan Modul](installation/installation/step-13.md).

## Menyalin dalam keluaran baharu tidak lagi menimpa konfigurasiSebelum ini, menyalin pengedaran XOOPS baharu di atas tapak sedia ada memerlukan penjagaan untuk mengelak daripada menulis ganti `mainfile.php` dan fail konfigurasi lain. Dalam 2.7.0, proses penyalinan meninggalkan fail konfigurasi sedia ada, yang menjadikan peningkatan lebih selamat.

Anda masih harus membuat sandaran penuh sebelum sebarang peningkatan.

## Keupayaan lebihan templat dalam tema pentadbir sistem

Tema pentadbir dalam XOOPS 2.7.0 kini boleh mengatasi templat pentadbir sistem individu, menjadikannya lebih mudah untuk menyesuaikan UI pentadbiran tanpa memotong keseluruhan modul sistem.

## Apa yang tidak berubah

Untuk jaminan, bahagian XOOPS ini berfungsi dengan cara yang sama dalam 2.7.0 seperti yang dilakukan dalam 2.5.x:

* Susunan halaman pemasang dan aliran keseluruhan
* Pemisahan konfigurasi `mainfile.php` tambah `xoops_data/data/secure.php`
* Amalan yang disyorkan untuk menempatkan semula `xoops_data` dan `xoops_lib` di luar akar web
* Model pemasangan modul dan `xoops_version.php` format manifes
* Aliran kerja alih tapak (sandaran, edit `mainfile.php`/`secure.php`, gunakan SRDB atau serupa)

## Ke mana hendak pergi seterusnya

* Bermula segar? Teruskan ke [Keperluan](installation/requirements.md).
* Menaik taraf daripada 2.5.x? Mulakan dengan [Menaik taraf](upgrading/upgrade/README.md), kemudian jalankan [Semakan Pralampu](upgrading/upgrade/preflight.md).