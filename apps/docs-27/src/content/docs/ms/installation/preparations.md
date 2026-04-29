---
title: "phpinfo"
---
Langkah ini adalah pilihan, tetapi boleh menjimatkan masa anda kekecewaan dengan mudah.Sebagai ujian pra-pemasangan sistem pengehosan, skrip PHP yang sangat kecil tetapi berguna dibuat secara tempatan, dan dimuat naik ke sistem sasaran.Skrip PHP hanya satu baris:
```
php
<?php phpinfo();
```
Menggunakan editor teks, buat fail bernama _info.php_ dengan satu baris ini.Seterusnya, muat naik fail ini ke akar web anda.![Filezilla info.php Muat Naik](/XOOPS-docs/2.7/img/installation/filezilla-01-info.png)Akses skrip anda dengan membukanya dalam penyemak imbas anda, iaitu mengakses `http://example.com/info.php`. Jika semuanya berfungsi dengan betul, anda seharusnya melihat halaman seperti ini:![phpinfo() Contoh](/XOOPS-docs/2.7/img/installation/php-info.png)Nota: sesetengah perkhidmatan pengehosan mungkin melumpuhkan fungsi _phpinfo()_ sebagai langkah keselamatan. Anda biasanya akan menerima mesej tentang kesan itu, jika itu yang berlaku.Output skrip mungkin berguna untuk menyelesaikan masalah, jadi pertimbangkan untuk menyimpan salinannya.Jika ujian berfungsi, anda sepatutnya bersedia untuk memasang. Anda harus memadamkan skrip _info.php_ dan teruskan dengan pemasangan.Jika ujian gagal, siasat mengapa! Apa sahaja isu yang menghalang ujian mudah ini daripada berfungsi **akan** menghalang pemasangan sebenar daripada berfungsi.