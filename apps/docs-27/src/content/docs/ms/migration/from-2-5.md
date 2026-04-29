---
title: Menaik taraf daripada XOOPS 2.5 kepada 2.7
description: Panduan langkah demi langkah untuk meningkatkan pemasangan XOOPS anda dengan selamat daripada 2.5.x kepada 2.7.x.
---
:::awas[Sandarkan dahulu]
Sentiasa sandarkan pangkalan data dan fail anda sebelum menaik taraf. Tiada pengecualian.
:::## Apa yang Berubah dalam 2.7- **PHP 8.2+ diperlukan** — PHP 7.x tidak lagi disokong
- **Kebergantungan diurus komposer** — Pustaka teras diurus melalui `composer.json`
- **Pemuatan auto PSR-4** — Kelas modul boleh menggunakan ruang nama
- **XoopsObject Diperbaiki** — Keselamatan jenis `getVar()` baharu, `obj2Array()` tidak digunakan
- **Pentadbir Bootstrap 5** — Panel pentadbir dibina semula dengan Bootstrap 5## Senarai Semak Pra-Naik Taraf- [ ] PHP 8.2+ tersedia pada pelayan anda
- [ ] Sandaran pangkalan data penuh (`mysqldump -u user -p xoops_db > backup.sql`)
- [ ] Sandaran fail penuh pemasangan anda
- [ ] Senarai modul yang dipasang dan versinya
- [ ] Tema tersuai disandarkan secara berasingan## Langkah Naik Taraf### 1. Letakkan tapak dalam mod penyelenggaraan
```
php
// mainfile.php — add temporarily
define('XOOPS_MAINTENANCE', true);
```
### 2. Muat turun XOOPS 2.7
```
bash
wget https://github.com/XOOPS/XoopsCore27/releases/latest/download/XOOPS-2.7.x.zip
unzip XOOPS-2.7.x.zip
```
### 3. Gantikan fail terasMuat naik fail baharu, **tidak termasuk**:
- `uploads/` — fail yang anda muat naik
- `xoops_data/` — konfigurasi anda
- `modules/` — modul dipasang anda
- `themes/` — tema anda
- `mainfile.php` — konfigurasi tapak anda
```
bash
rsync -av --exclude='uploads/' --exclude='xoops_data/' \
  --exclude='modules/' --exclude='themes/' --exclude='mainfile.php' \
  XOOPS-2.7/ /var/www/html/
```
### 4. Jalankan skrip naik tarafNavigasi ke `https://yourdomain.com/upgrade/` dalam penyemak imbas anda.
Wizard peningkatan akan menggunakan migrasi pangkalan data.### 5. Kemas kini modulModul XOOPS 2.7 mestilah serasi dengan PHP 8.2.
Semak [Ekosistem Modul](/XOOPS-docs/2.7/module-guide/introduction/) untuk versi yang dikemas kini.Dalam Pentadbiran → Modul, klik **Kemas kini** untuk setiap modul yang dipasang.### 6. Alih keluar mod penyelenggaraan dan ujiKeluarkan baris `XOOPS_MAINTENANCE` daripada `mainfile.php` dan
sahkan semua halaman dimuatkan dengan betul.## Isu Biasa**Ralat "Kelas tidak ditemui" selepas naik taraf**
- Jalankan `composer dump-autoload` dalam akar XOOPS
- Kosongkan direktori `xoops_data/caches/`**Modul rosak selepas kemas kini**
- Semak keluaran GitHub modul untuk versi yang serasi dengan 2.7
- Modul mungkin memerlukan perubahan kod untuk PHP 8.2 (fungsi tidak digunakan, sifat ditaip)**Panel pentadbir CSS rosak**
- Kosongkan cache penyemak imbas anda
- Pastikan `xoops_lib/` telah diganti sepenuhnya semasa muat naik fail