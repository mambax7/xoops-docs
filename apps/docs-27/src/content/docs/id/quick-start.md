---
title: Mulai Cepat
description: Jalankan XOOPS 2.7 dalam waktu kurang dari 5 menit.
---

## Persyaratan

| Komponen | Minimal | Direkomendasikan |
|------------|-------------------------|---------------|
| PHP | 8.2 | 8.4+ |
| MySQL | 5.7 | 8.0+ |
| MariaDB | 10.4 | 10.11+ |
| Server web | Apache 2.4 / Nginx 1.20 | Stabil terbaru |

## Unduh

Unduh rilis terbaru dari [Rilis GitHub](https://github.com/XOOPS/XoopsCore27/releases).

```bash
# Or clone directly
git clone https://github.com/XOOPS/XoopsCore27.git mysite
cd mysite
```

## Langkah Instalasi

1. **Unggah file** ke root dokumen server web Anda (misalnya `public_html/`).
2. **Buat database MySQL** dan pengguna dengan hak penuh di dalamnya.
3. **Buka browser Anda** dan navigasikan ke domain Anda — penginstal XOOPS dimulai secara otomatis.
4. **Ikuti panduan 5 langkah** — panduan ini mengonfigurasi jalur, membuat tabel, dan menyiapkan akun admin Anda.
5. **Hapus folder `install/`** saat diminta. Ini wajib untuk keamanan.

## Verifikasi Instalasi

Setelah pengaturan, kunjungi:

- **Halaman depan:** `https://yourdomain.com/`
- **Panel Admin:** `https://yourdomain.com/xoops_data/` *(jalur yang Anda pilih saat instalasi)*

## Langkah Selanjutnya

- [Panduan Instalasi Lengkap](./installation/) — konfigurasi server, izin, pemecahan masalah
- [Panduan module](./module-guide/introduction/) — buat module pertama Anda
- [Panduan theme](./theme-guide/introduction/) — membuat atau menyesuaikan theme
