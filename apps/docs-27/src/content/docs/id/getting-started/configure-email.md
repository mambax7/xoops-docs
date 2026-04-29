---
title: "Konfigurasi Email"
---

![XOOPS Email Configuration](/xoops-docs/2.7/img/installation/xoops-04-email-setup.png)

XOOPS mengandalkan email untuk banyak interaksi pengguna yang penting, seperti memvalidasi pendaftaran, atau mengatur ulang kata sandi. Jadi, penting untuk mengaturnya dengan benar.

Mengonfigurasi email situs bisa sangat mudah dalam beberapa kasus, dan sangat sulit dalam kasus lain.

Berikut beberapa tip untuk membantu menyukseskan penyiapan Anda.

## Metode Pengiriman Email

Bagian konfigurasi ini memiliki 4 kemungkinan nilai

* **PHP Mail()** - cara termudah, jika tersedia. Tergantung pada sistem program _sendmail_.
* **sendmail** - Opsi kekuatan industri, namun sering ditargetkan untuk SPAM dengan mengeksploitasi kelemahan perangkat lunak lain.
* **SMTP** - Simple Mail Transfer Protocol biasanya tidak tersedia di akun hosting baru karena masalah keamanan dan potensi penyalahgunaan. Sebagian besar telah digantikan dengan SMTP Auth.
* **SMTP Auth** - SMTP dengan Otorisasi biasanya lebih disukai daripada SMTP biasa. Dalam hal ini XOOPS terhubung langsung ke server email dengan cara yang lebih aman.

## Host SMTP

Jika Anda perlu menggunakan SMTP, dengan atau tanpa "Auth", Anda perlu menentukan nama server di sini. Nama tersebut mungkin berupa nama host atau alamat IP sederhana, atau mungkin berisi informasi port dan protokol tambahan. Kasus paling sederhana adalah `localhost` untuk server SMTP (tanpa autentikasi) yang berjalan pada mesin yang sama dengan server web.

Nama pengguna SMTP dan kata sandi SMTP selalu diperlukan saat menggunakan SMTP Auth. Dimungkinkan untuk menentukan TLS atau SSL, serta port di bidang konfigurasi XOOPS Host SMTP.

Ini dapat digunakan untuk menyambung ke SMTP Gmail: `tls://smtp.gmail.com:587`

Contoh lain menggunakan SSL: `ssl://mail.example.com:465`

## Kiat untuk Mengatasi Masalah

Terkadang, segalanya tidak berjalan semulus yang kita harapkan. Berikut beberapa saran dan sumber daya yang mungkin bisa membantu.

### Periksa dokumentasi penyedia hosting Anda

Saat Anda membuat layanan hosting dengan penyedia, mereka harus memberikan informasi tentang cara mengakses server email. Anda ingin ini tersedia saat Anda mengonfigurasi email untuk sistem XOOPS Anda.

### XOOPS Menggunakan PHPMailer

XOOPS menggunakan perpustakaan [PHPMailer](https://github.com/PHPMailer/PHPMailer) untuk mengirim email. Bagian [pemecahan masalah](https://github.com/PHPMailer/PHPMailer/wiki/Troubleshooting) di wiki menawarkan beberapa wawasan.