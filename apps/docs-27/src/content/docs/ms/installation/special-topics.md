---
title: "Topik Khas"
---
Sesetengah gabungan perisian sistem tertentu mungkin memerlukan beberapa konfigurasi tambahan untuk berfungsi
 dengan XOOPS. Berikut ialah beberapa butiran isu yang diketahui dan panduan untuk menanganinya.## Persekitaran SELinuxFail dan direktori tertentu perlu boleh ditulis semasa pemasangan, naik taraf dan operasi biasa
daripada XOOPS. Dalam persekitaran Linux tradisional, ini dicapai dengan memastikan bahawa
pengguna sistem yang dikendalikan oleh pelayan web mempunyai kebenaran pada direktori XOOPS, biasanya oleh 
menetapkan kumpulan yang sesuai untuk direktori tersebut.Sistem yang didayakan SELinux (seperti CentOS dan RHEL) mempunyai konteks keselamatan tambahan, yang
boleh menyekat keupayaan proses untuk menukar sistem fail. Sistem ini mungkin memerlukan 
perubahan kepada konteks keselamatan untuk XOOPS berfungsi dengan betul.XOOPS menjangkakan dapat menulis secara bebas ke direktori tertentu semasa operasi biasa. 
Selain itu, semasa pemasangan dan peningkatan XOOPS, fail tertentu mesti boleh ditulis juga.
 
Semasa operasi biasa, XOOPS menjangka dapat menulis fail dan mencipta sub direktori 
dalam direktori ini:- `uploads` dalam akar web XOOPS utama
- `xoops_data` di mana sahaja ia dipindahkan semasa pemasanganSemasa proses pemasangan atau peningkatan XOOPS perlu menulis pada fail ini:- `mainfile.php` dalam akar web XOOPS utamaUntuk sistem berasaskan Apache CentOS biasa, perubahan konteks keselamatan mungkin 
dicapai dengan arahan ini:
```
chcon -Rv --type=httpd_sys_rw_content_t /path/to/web/root/uploads/
chcon -Rv --type=httpd_sys_rw_content_t /path/to/xoops_data/
```
Anda boleh membuat mainfile.php boleh ditulis dengan:
```
chcon -v --type=httpd_sys_rw_content_t /path/to/web/root/mainfile.php
```
Nota: Semasa memasang, anda boleh menyalin mainfile.php kosong daripada direktori *tambahan*.Anda juga harus membenarkan httpd menghantar mel:
```
setsebool -P httpd_can_sendmail=1
```
Tetapan lain yang mungkin anda perlukan termasuk:Benarkan httpd membuat sambungan rangkaian, iaitu ambil suapan rss atau buat panggilan API:
```
setsebool -P httpd_can_network_connect 1
```
Dayakan sambungan rangkaian ke pangkalan data dengan:
```
setsebool -P httpd_can_network_connect_db=1
```
Untuk maklumat lanjut rujuk dokumentasi sistem anda and/or pentadbir sistem.## Smarty 4 dan Tema TersuaiXOOPS 2.7.0 menaik taraf enjin templatnya daripada Smarty 3 kepada **Smarty 4**. Smarty 4 lebih ketat
tentang sintaks templat daripada Smarty 3, dan beberapa corak yang diterima dalam templat lama
kini akan menyebabkan kesilapan. Jika anda memasang salinan baharu XOOPS 2.7.0 menggunakan hanya tema
dan modul yang dihantar bersama keluaran, tiada apa yang perlu dibimbangkan — setiap templat yang dihantar
telah dikemas kini untuk keserasian Smarty 4.Kebimbangan terpakai apabila anda:- menaik taraf tapak XOOPS 2.5.x sedia ada yang mempunyai tema tersuai, atau
- memasang tema tersuai atau modul pihak ketiga yang lebih lama ke dalam XOOPS 2.7.0.Sebelum menukar trafik langsung ke tapak yang dinaik taraf, jalankan pengimbas prapenerbangan yang dihantar dalam
Direktori `/upgrade/`. Ia mengimbas `/themes/` dan `/modules/` mencari ketidakserasian Smarty 4
dan secara automatik boleh membaiki kebanyakannya. Lihat
Halaman [Semakan Pra Penerbangan](../upgrading/upgrade/preflight.md) untuk butiran.Jika anda terkena ralat templat selepas pemasangan atau peningkatan:1. Jalankan semula `/upgrade/preflight.php` dan atasi sebarang isu yang dilaporkan.
2. Kosongkan cache templat yang disusun dengan mengalih keluar semua kecuali `index.html` daripada
   `xoops_data/caches/smarty_compile/`.
3. Tukar sementara kepada tema yang dihantar seperti `xbootstrap5` atau `default` untuk mengesahkan masalah
   adalah khusus tema dan bukannya di seluruh tapak.
4. Sahkan sebarang perubahan tema atau templat modul tersuai sebelum mengembalikan tapak kepada pengeluaran.