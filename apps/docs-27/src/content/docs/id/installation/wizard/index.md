---
title: "Wizard Instalasi"
description: "Panduan langkah demi langkah dari wizard instalasi XOOPS — penjelasan 15 layar."
---

Wizard instalasi XOOPS memandu Anda melalui proses 15 langkah yang mengonfigurasi database Anda, membuat akun admin, dan mempersiapkan situs Anda untuk penggunaan pertama.

## Sebelum Anda mulai

- Anda telah [mengunggah XOOPS ke server Anda](/xoops-docs/2.7/installation/ftp-upload/) atau menyiapkan lingkungan lokal
- Anda telah [memverifikasi persyaratan](/xoops-docs/2.7/installation/requirements/)
- Anda telah menyiapkan kredensial basis data Anda

## Langkah penyihir

| Langkah | Layar | Apa yang terjadi |
|------|--------|--------------|
| 1 | [Pilihan Bahasa](./step-01/) | Pilih bahasa instalasi |
| 2 | [Selamat Datang](./step-02/) | Perjanjian lisensi |
| 3 | [Pemeriksaan Konfigurasi](./step-03/) | Pemeriksaan lingkungan PHP/server |
| 4 | [Pengaturan Jalur](./step-04/) | Tetapkan jalur root dan URL |
| 5 | [Koneksi Basis Data](./step-05/) | Masukkan host basis data, pengguna, kata sandi |
| 6 | [Konfigurasi Basis Data](./step-06/) | Tetapkan nama database dan awalan tabel |
| 7 | [Simpan Konfigurasi](./step-07/) | Tulis mainfile.php |
| 8 | [Pembuatan Tabel](./step-08/) | Buat skema database |
| 9 | [Pengaturan Awal](./step-09/) | Nama situs, email admin |
| 10 | [Penyisipan Data](./step-10/) | Isi data default |
| 11 | [Konfigurasi Situs](./step-11/) | URL, zona waktu, bahasa |
| 12 | [Pilih theme](./step-12/) | Pilih theme bawaan |
| 13 | [Instalasi module](./step-13/) | Instal module yang dibundel |
| 14 | [Selamat Datang](./step-14/) | Pesan instalasi selesai |
| 15 | [Pembersihan](./step-15/) | Hapus folder instalasi |

:::hati-hati[Keamanan]
Setelah menyelesaikan wizard, **hapus atau ganti nama folder `install/`** — langkah 15 memandu Anda melakukannya. Membiarkannya dapat diakses adalah risiko keamanan.
:::