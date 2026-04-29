---
title: "Simpan Konfigurasi"
---
Halaman ini memaparkan keputusan menyimpan maklumat konfigurasi yang telah anda masukkan sehingga ke tahap ini.Selepas menyemak dan membetulkan sebarang isu, pilih butang "Teruskan" untuk meneruskan.## Pada KejayaanBahagian _Menyimpan konfigurasi sistem anda_ menunjukkan maklumat yang telah disimpan. Tetapan disimpan dalam salah satu daripada dua fail. Satu fail ialah _mainfile.php_ dalam akar web. Yang lain ialah _data/secure.php_ dalam direktori _xoops_data_.![XOOPS Pemasang Simpan Konfigurasi](/XOOPS-docs/2.7/img/installation/installer-07.png)Kedua-dua fail dijana daripada fail templat yang dihantar dengan XOOPS 2.7.0:* `mainfile.php` dijana daripada `mainfile.dist.php` dalam akar web.
* `xoops_data/data/secure.php` dijana daripada `xoops_data/data/secure.dist.php`.Selain laluan dan URL yang anda masukkan, `mainfile.php` kini termasuk beberapa pemalar yang baharu dalam XOOPS 2.7.0:* `XOOPS_TRUST_PATH` — disimpan sebagai alias serasi ke belakang bagi `XOOPS_PATH`; anda tidak perlu mengkonfigurasinya secara berasingan.
* `XOOPS_COOKIE_DOMAIN_USE_PSL` — lalai kepada `true`; menggunakan Senarai Akhiran Awam untuk memperoleh domain kuki yang betul.
* `XOOPS_DB_LEGACY_LOG` — lalai kepada `false`; ditetapkan kepada `true` dalam pembangunan untuk mengelog penggunaan API pangkalan data lama.
* `XOOPS_DEBUG` — lalai kepada `false`; ditetapkan kepada `true` dalam pembangunan untuk membolehkan pelaporan ralat tambahan.Anda tidak perlu mengedit ini dengan tangan semasa pemasangan — lalai adalah sesuai untuk tapak pengeluaran. Ia disebut di sini supaya anda tahu apa yang perlu dicari jika anda membuka `mainfile.php` kemudian.## RalatJika XOOPS mengesan ralat dalam menulis fail konfigurasi, ia akan memaparkan mesej, memperincikan apa yang salah.![XOOPS Installer Save Ralat Konfigurasi](/XOOPS-docs/2.7/img/installation/installer-07-errors.png)Dalam kebanyakan kes, pemasangan lalai sistem terbitan Debian menggunakan mod_php dalam Apache adalah punca ralat. Kebanyakan penyedia pengehosan mempunyai konfigurasi yang tidak mempunyai masalah ini.### Isu kebenaran kumpulanProses PHP dijalankan menggunakan kebenaran sesetengah pengguna. Fail juga dimiliki oleh sesetengah pengguna. Jika kedua-dua ini bukan pengguna yang sama, kebenaran kumpulan boleh digunakan untuk membenarkan proses PHP berkongsi fail dengan akaun pengguna anda. Ini biasanya bermakna anda perlu menukar kumpulan fail dan direktori yang perlu ditulis XOOPS.Untuk konfigurasi lalai yang dinyatakan di atas ini bermakna kumpulan _www-data_ perlu ditentukan sebagai kumpulan untuk fail dan direktori, dan fail serta direktori tersebut perlu boleh ditulis mengikut kumpulan.Anda harus menyemak konfigurasi anda dengan teliti dan memilih cara menyelesaikan isu ini dengan teliti untuk kotak yang tersedia di internet terbuka.Contoh arahan boleh:
```
text
chgrp -R www-data xoops_data
chmod -R g+w xoops_data
chgrp -R www-data uploads
chmod -R g+w uploads
```
### Tidak boleh mencipta mainfile.phpDalam sistem seperti Unix, kebenaran untuk mencipta fail baharu bergantung pada kebenaran yang diberikan pada folder induk. Dalam sesetengah kes, kebenaran itu tidak tersedia dan pemberiannya mungkin menjadi kebimbangan keselamatan.Jika anda menghadapi masalah konfigurasi, anda boleh mencari dummy _mainfile.php_ dalam direktori _extras_ dalam pengedaran XOOPS. Salin fail itu ke dalam akar web dan tetapkan kebenaran pada fail:
```
text
chgrp www-data mainfile.php
chmod g+w mainfile.php
```
### Persekitaran SELinuxKonteks keselamatan SELinux boleh menjadi punca masalah. Jika ini mungkin berkenaan, sila rujuk [Topik Khas](../specialtopics.md) untuk mendapatkan maklumat lanjut.