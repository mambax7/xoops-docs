---
title: "Simpan Konfigurasi"
---

Halaman ini menampilkan hasil penyimpanan informasi konfigurasi yang Anda masukkan hingga saat ini.

Setelah meninjau dan memperbaiki masalah apa pun, pilih tombol "Lanjutkan" untuk melanjutkan.

## Pada Sukses

Bagian _Menyimpan konfigurasi sistem Anda_ menunjukkan informasi yang telah disimpan. Pengaturan disimpan dalam salah satu dari dua file. Satu file adalah _mainfile.php_ di root web. Yang lainnya adalah _data/secure.php_ di direktori _xoops_data_.

![XOOPS Installer Save Configuration](/xoops-docs/2.7/img/installation/installer-07.png)

Kedua file dihasilkan dari file template yang dikirimkan dengan XOOPS 2.7.0:

* `mainfile.php` dihasilkan dari `mainfile.dist.php` di root web.
* `xoops_data/data/secure.php` dihasilkan dari `xoops_data/data/secure.dist.php`.

Selain jalur dan URL yang Anda masukkan, `mainfile.php` kini menyertakan beberapa konstanta yang baru di XOOPS 2.7.0:

* `XOOPS_TRUST_PATH` — disimpan sebagai alias `XOOPS_PATH` yang kompatibel dengan versi sebelumnya; Anda tidak perlu mengkonfigurasinya secara terpisah.
* `XOOPS_COOKIE_DOMAIN_USE_PSL` — defaultnya adalah `true`; menggunakan Daftar Sufiks Publik untuk mendapatkan domain cookie yang benar.
* `XOOPS_DB_LEGACY_LOG` — defaultnya adalah `false`; disetel ke `true` dalam pengembangan untuk mencatat penggunaan API database lama.
* `XOOPS_DEBUG` — defaultnya adalah `false`; disetel ke `true` dalam pengembangan untuk mengaktifkan pelaporan kesalahan tambahan.

Anda tidak perlu mengeditnya secara manual selama instalasi — pengaturan defaultnya sesuai untuk situs produksi. Mereka disebutkan di sini sehingga Anda tahu apa yang harus dicari jika Anda membuka `mainfile.php` nanti.

## Kesalahan

Jika XOOPS mendeteksi kesalahan dalam penulisan file konfigurasi, ia akan menampilkan pesan yang merinci apa yang salah.

![XOOPS Installer Save Configuration Errors](/xoops-docs/2.7/img/installation/installer-07-errors.png)

Dalam banyak kasus, instalasi default sistem turunan Debian menggunakan mod_php di Apache adalah sumber kesalahan. Sebagian besar penyedia hosting memiliki konfigurasi yang tidak mengalami masalah ini.

### Masalah izin grup

Proses PHP dijalankan menggunakan izin beberapa pengguna. File juga dimiliki oleh beberapa pengguna. Jika keduanya bukan pengguna yang sama, izin grup dapat digunakan untuk mengizinkan proses PHP berbagi file dengan akun pengguna Anda. Ini biasanya berarti Anda perlu mengubah grup file dan direktori tempat XOOPS perlu menulis.

Untuk konfigurasi default yang disebutkan di atas, ini berarti grup _www-data_ perlu ditentukan sebagai grup untuk file dan direktori, dan file serta direktori tersebut harus dapat ditulis berdasarkan grup.

Anda harus meninjau konfigurasi Anda dengan hati-hati, dan dengan hati-hati memilih cara mengatasi masalah ini untuk kotak yang tersedia di internet terbuka.

Contoh perintahnya bisa berupa:

```text
chgrp -R www-data xoops_data
chmod -R g+w xoops_data
chgrp -R www-data uploads
chmod -R g+w uploads
```

### Tidak dapat membuat mainfile.php

Dalam sistem mirip Unix, izin untuk membuat file baru bergantung pada izin yang diberikan pada folder induk. Dalam beberapa kasus, izin tersebut tidak tersedia, dan pemberiannya mungkin menimbulkan masalah keamanan.

Jika Anda memiliki masalah konfigurasi, Anda dapat menemukan _mainfile.php_ tiruan di direktori _extras_ di distribusi XOOPS. Salin file itu ke root web dan atur izin pada file:

```text
chgrp www-data mainfile.php
chmod g+w mainfile.php
```

### Lingkungan SELinux

Konteks keamanan SELinux dapat menjadi sumber masalah. Jika ini mungkin berlaku, silakan lihat [Topik Khusus](../specialtopics.md) untuk informasi lebih lanjut.
