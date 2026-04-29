---
title: "Nota untuk Pembangun"
---
Walaupun pemasangan sebenar XOOPS untuk kegunaan pembangunan adalah serupa dengan pemasangan biasa yang telah diterangkan, terdapat perbezaan utama apabila membina sistem sedia pembangun.Satu perbezaan besar dalam pemasangan pembangun ialah daripada hanya memfokuskan pada kandungan direktori _htdocs_, pemasangan pembangun menyimpan semua fail dan menyimpannya di bawah kawalan kod sumber menggunakan git.Perbezaan lain ialah direktori _xoops_data_ dan _xoops_lib_ biasanya boleh kekal di tempatnya tanpa menamakan semula, selagi sistem pembangunan anda tidak boleh diakses secara langsung di internet terbuka (iaitu pada rangkaian peribadi, seperti di belakang penghala.)Kebanyakan pembangun bekerja pada sistem _localhost_, yang mempunyai kod sumber, timbunan pelayan web dan sebarang alat yang diperlukan untuk berfungsi dengan kod dan pangkalan data.Anda boleh mendapatkan maklumat lanjut dalam bab [Tools of the Trade](../tools/tools.md).## Git dan Hos MayaKebanyakan pembangun mahu dapat mengikuti perkembangan terkini dengan sumber semasa dan menyumbangkan perubahan kembali kepada huluan [repositori XOOPS/XoopsCore27 pada GitHub](https://github.com/XOOPS/XoopsCore27). Ini bermakna daripada memuat turun arkib keluaran, anda perlu [membuang](https://help.github.com/articles/fork-a-repo/) salinan XOOPS dan menggunakan **git** untuk [klon](https://help.github.com/categories/bootcamp/) repositori itu ke kotak pembangun anda.Memandangkan repositori mempunyai struktur khusus, bukannya _copying_ fail daripada direktori _htdocs_ ke pelayan web anda, adalah lebih baik untuk menghalakan pelayan web anda ke folder htdocs di dalam repositori klon setempat anda. Untuk menyelesaikannya, kami biasanya mencipta _Hos Maya_ baharu, atau _vhost_ yang menunjuk kepada kod sumber terkawal git kami.Dalam persekitaran [WAMP](http://www.wampserver.com/), halaman lalai [localhost](http://localhost/) mempunyai dalam bahagian _Tools_ pautan ke _Tambah Hos Maya_ yang menuju ke sini:![WAMP Tambah Hos Maya](/XOOPS-docs/2.7/img/installation/wamp-vhost-03.png)Menggunakan ini, anda boleh menyediakan entri VirtualHost yang akan jatuh terus ke dalam repositori terkawal git (masih) anda.Berikut ialah entri contoh dalam `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf`
```
text
<VirtualHost *:80>
    ServerName XOOPS.localhost
    DocumentRoot "c:/users/username/documents/github/xoopscore27/htdocs"
    <Directory  "c:/users/username/documents/github/xoopscore27/htdocs/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>
```
Anda juga mungkin perlu menambah entri dalam `Windows/System32/drivers/etc/hosts`:
```
text
127.0.0.1    XOOPS.localhost
```
Kini, anda boleh memasang pada `http://XOOPS.localhost/` untuk ujian, sambil mengekalkan repositori anda utuh, dan memastikan pelayan web di dalam direktori htdocs dengan URL ringkas. Selain itu, anda boleh mengemas kini salinan tempatan anda XOOPS kepada induk terkini pada bila-bila masa tanpa perlu memasang semula atau menyalin fail. Dan, anda boleh membuat peningkatan dan pembetulan pada kod untuk menyumbang kembali kepada XOOPS melalui GitHub.## Ketergantungan KomposerXOOPS 2.7.0 menggunakan [Komposer](https://getcomposer.org/) untuk mengurus kebergantungan PHPnya. Pokok pergantungan hidup dalam `htdocs/xoops_lib/` di dalam repositori sumber:* `composer.dist.json` ialah senarai induk kebergantungan yang dihantar bersama keluaran.
* `composer.json` ialah salinan tempatan, yang boleh anda sesuaikan untuk persekitaran pembangunan anda jika perlu.
* `composer.lock` pin versi tepat supaya pemasangan boleh dihasilkan semula.
* `vendor/` mengandungi perpustakaan yang dipasang (Smarty 4, PHPMailer, HTMLPurifier, firebase/php-jwt, monolog, symfony/var-dumper, XOOPS/XMF, XOOPS/regdom, dan lain-lain).Untuk klon git segar XOOPS 2.7.0, bermula dari akar repo, jalankan:
```
text
cd htdocs/xoops_lib
composer install
```
Ambil perhatian bahawa tiada `composer.json` pada akar repo — projek itu hidup di bawah `htdocs/xoops_lib/`, jadi anda mesti `cd` ke dalam direktori itu sebelum menjalankan Komposer.Lepaskan tarballs dihantar dengan `vendor/` pra-isi, tetapi klon git mungkin tidak. Pastikan `vendor/` kekal pada pemasangan pembangunan — XOOPS akan memuatkan kebergantungannya dari sana pada masa jalan.Pustaka [XMF (XOOPS Module Framework)](https://github.com/XOOPS/XMF) dihantar sebagai kebergantungan Komposer dalam 2.7.0, jadi anda boleh menggunakan `XMF\Request`, `XMF\Database\TableLoad` tanpa sebarang pemasangan kelas dan kod yang berkaitan.## Modul DebugBarXOOPS 2.7.0 menghantar modul **DebugBar** berdasarkan Symfony VarDumper. Ia menambahkan bar alat nyahpepijat pada halaman yang diberikan yang mendedahkan permintaan, pangkalan data dan maklumat templat. Pasangnya dari kawasan pentadbir Modul pada tapak pembangunan dan pementasan. Jangan biarkan ia dipasang pada tapak pengeluaran yang menghadap awam melainkan anda tahu anda mahu.