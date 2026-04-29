---
title: "Catatan untuk Pengembang"
---

Meskipun penginstalan XOOPS sebenarnya untuk penggunaan pengembangan serupa dengan penginstalan normal yang telah dijelaskan, terdapat perbedaan utama saat membangun sistem siap pengembang.

Satu perbedaan besar dalam instalasi pengembang adalah bahwa alih-alih hanya berfokus pada konten direktori _htdocs_, instalasi pengembang menyimpan semua file, dan menyimpannya di bawah kendali kode sumber menggunakan git.

Perbedaan lainnya adalah direktori _xoops_data_ dan _xoops_lib_ biasanya dapat tetap berada di tempatnya tanpa mengganti nama, selama sistem pengembangan Anda tidak dapat diakses secara langsung di internet terbuka (yaitu di jaringan pribadi, seperti di belakang router.)

Sebagian besar pengembang bekerja pada sistem _localhost_, yang memiliki kode sumber, tumpukan server web, dan alat apa pun yang diperlukan untuk bekerja dengan kode dan database.

Anda dapat menemukan informasi lebih lanjut di bab [Alat Perdagangan](../tools/tools.md).

## Git dan Host Virtual

Sebagian besar pengembang ingin tetap mendapatkan informasi terbaru tentang sumber terkini, dan memberikan kontribusi perubahan kembali ke upstream [repositori XOOPS/XoopsCore27 di GitHub](https://github.com/XOOPS/XoopsCore27). Artinya, alih-alih mengunduh arsip rilis, Anda sebaiknya [fork](https://help.github.com/articles/fork-a-repo/) salinan XOOPS dan menggunakan **git** untuk [mengkloning](https://help.github.com/categories/bootcamp/) repositori tersebut ke kotak pengembang Anda.

Karena repositori memiliki struktur tertentu, daripada _menyalin_ file dari direktori _htdocs_ ke server web Anda, lebih baik arahkan server web Anda ke folder htdocs di dalam repositori kloning lokal Anda. Untuk mencapai hal ini, kami biasanya membuat _Virtual Host_ baru, atau _vhost_ yang menunjuk ke kode sumber yang dikontrol git.

Di lingkungan [WAMP](http://www.wampserver.com/), halaman [localhost](http://localhost/) default di bagian _Tools_ memiliki tautan ke _Tambahkan Host Virtual_ yang mengarah ke sini:

![WAMP Add Virtual Host](/xoops-docs/2.7/img/installation/wamp-vhost-03.png)

Dengan menggunakan ini, Anda dapat mengatur entri VirtualHost yang akan langsung masuk ke repositori Anda (yang masih) dikontrol git.

Berikut adalah contoh entri di `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf`

```text
<VirtualHost *:80>
    ServerName xoops.localhost
    DocumentRoot "c:/users/username/documents/github/xoopscore27/htdocs"
    <Directory  "c:/users/username/documents/github/xoopscore27/htdocs/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>
```

Anda mungkin juga perlu menambahkan entri di `Windows/System32/drivers/etc/hosts`:

```text
127.0.0.1    xoops.localhost
```

Sekarang, Anda dapat menginstal di `http://xoops.localhost/` untuk pengujian, sekaligus menjaga repositori Anda tetap utuh, dan menjaga server web di dalam direktori htdocs dengan URL sederhana. Selain itu, Anda dapat memperbarui salinan lokal XOOPS ke master terbaru kapan saja tanpa harus menginstal ulang atau menyalin file. Dan, Anda dapat melakukan penyempurnaan dan perbaikan pada kode untuk berkontribusi kembali ke XOOPS melalui GitHub.

## Ketergantungan Komposer

XOOPS 2.7.0 menggunakan [Komposer](https://getcomposer.org/) untuk mengelola dependensi PHP-nya. Pohon ketergantungan berada di `htdocs/xoops_lib/` di dalam repositori sumber:

* `composer.dist.json` adalah daftar utama dependensi yang dikirimkan bersama rilis.
* `composer.json` adalah salinan lokal, yang dapat Anda sesuaikan untuk lingkungan pengembangan Anda jika diperlukan.
* `composer.lock` menyematkan versi yang tepat sehingga pemasangan dapat direproduksi.
* `vendor/` berisi perpustakaan yang diinstal (Smarty 4, PHPMailer, HTMLPurifier, firebase/php-jwt, monolog, symfony/var-dumper, xoops/xmf, xoops/regdom, dan lainnya).

Untuk git clone baru dari XOOPS 2.7.0, mulai dari root repo, jalankan:

```text
cd htdocs/xoops_lib
composer install
```

Perhatikan bahwa tidak ada `composer.json` di root repo — proyek berada di bawah `htdocs/xoops_lib/`, jadi Anda harus memasukkan `cd` ke direktori tersebut sebelum menjalankan Composer.

Tarball rilis dikirimkan dengan `vendor/` yang telah diisi sebelumnya, tetapi klon git mungkin tidak. Jaga agar `vendor/` tetap utuh pada instalasi pengembangan — XOOPS akan memuat dependensinya dari sana saat runtime.

Pustaka [XMF (XOOPS Module Framework)](https://github.com/XOOPS/xmf) dikirimkan sebagai ketergantungan Komposer di 2.7.0, sehingga Anda dapat menggunakan `Xmf\Request`, `Xmf\Database\TableLoad`, dan kelas terkait dalam kode module Anda tanpa tambahan apa pun instalasi.

## module DebugBarXOOPS 2.7.0 mengirimkan module **DebugBar** berdasarkan Symfony VarDumper. Itu menambahkan toolbar debug ke halaman yang dirender yang memperlihatkan informasi permintaan, database, dan template. Instal dari area admin module di situs pengembangan dan pementasan. Jangan membiarkannya terpasang di situs produksi yang dapat dilihat publik kecuali Anda menginginkannya.
