---
title: "info php"
---

Langkah ini opsional, tetapi dapat dengan mudah menyelamatkan Anda dari rasa frustrasi selama berjam-jam.

Sebagai pengujian pra-instal sistem hosting, skrip PHP yang sangat kecil namun berguna dibuat secara lokal, dan diunggah ke sistem target.

Skrip PHP hanya satu baris:

```php
<?php phpinfo();
```

Menggunakan editor teks, buat file bernama _info.php_ dengan satu baris ini.

Selanjutnya, unggah file ini ke root web Anda.

![Filezilla info.php Upload](/xoops-docs/2.7/img/installation/filezilla-01-info.png)

Akses skrip Anda dengan membukanya di browser Anda, yaitu mengakses `http://example.com/info.php`. Jika semuanya berfungsi dengan benar, Anda akan melihat halaman seperti ini:

![phpinfo() Example](/xoops-docs/2.7/img/installation/php-info.png)

Catatan: beberapa layanan hosting mungkin menonaktifkan fungsi _phpinfo()_ sebagai tindakan pengamanan. Anda biasanya akan menerima pesan seperti itu, jika itu masalahnya.

Keluaran skrip mungkin berguna untuk pemecahan masalah, jadi pertimbangkan untuk menyimpan salinannya.

Jika tes berhasil, Anda sebaiknya melanjutkan instalasi. Anda harus menghapus skrip _info.php_, dan melanjutkan instalasi.

Jika tes gagal, selidiki alasannya! Masalah apa pun yang menghalangi pengujian sederhana ini **akan** mencegah penginstalan sebenarnya berfungsi.
