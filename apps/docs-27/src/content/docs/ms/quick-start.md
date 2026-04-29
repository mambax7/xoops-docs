---
title: Mula Pantas
description: Dapatkan XOOPS 2.7 berjalan dalam masa kurang dari 5 minit.
---
## Keperluan

| Komponen | Minimum | Disyorkan |
|------------|------------------------|----------------|
| PHP | 8.2 | 8.4+ |
| MySQL | 5.7 | 8.0+ |
| MariaDB | 10.4 | 10.11+ |
| Pelayan web | Apache 2.4 / Nginx 1.20 | Stabil terkini |

## Muat turun

Muat turun keluaran terbaharu daripada [GitHub Releases](https://github.com/XOOPS/XoopsCore27/releases).
```bash
# Or clone directly
git clone https://github.com/XOOPS/XoopsCore27.git mysite
cd mysite
```
## Langkah Pemasangan

1. **Muat naik fail** ke akar dokumen pelayan web anda (cth. `public_html/`).
2. **Buat pangkalan data MySQL** dan pengguna dengan keistimewaan penuh padanya.
3. **Buka penyemak imbas anda** dan navigasi ke domain anda — pemasang XOOPS bermula secara automatik.
4. **Ikuti wizard 5 langkah** — ia mengkonfigurasi laluan, mencipta jadual dan menyediakan akaun pentadbir anda.
5. **Padam folder `install/`** apabila digesa. Ini adalah wajib untuk keselamatan.

## Sahkan Pemasangan

Selepas persediaan, lawati:

- **Halaman hadapan:** `https://yourdomain.com/`
- **Panel Pentadbiran:** `https://yourdomain.com/xoops_data/` *(laluan yang anda pilih semasa pemasangan)*

## Langkah Seterusnya

- [Panduan Pemasangan Penuh](./installation/) — konfigurasi pelayan, kebenaran, penyelesaian masalah
- [Panduan Modul](./module-guide/introduction/) — bina modul pertama anda
- [Panduan Tema](./theme-guide/introduction/) — cipta atau sesuaikan tema