---
title: "Konfigurasi Basis Data"
---

Halaman ini mengumpulkan informasi tentang database yang akan digunakan XOOPS.

Setelah memasukkan informasi yang diminta dan memperbaiki masalah apa pun, pilih tombol "Lanjutkan" untuk melanjutkan.

![XOOPS Installer Database Configuration](/xoops-docs/2.7/img/installation/installer-06.png)

## Data yang Dikumpulkan pada Langkah Ini

### Basis Data

#### Nama basis data

Nama database pada host yang harus digunakan XOOPS. Pengguna basis data yang dimasukkan pada langkah sebelumnya harus memiliki semua hak istimewa pada basis data ini. Penginstal akan mencoba membuat database ini jika tidak ada.

#### Awalan tabel

Awalan ini akan ditambahkan ke nama semua tabel baru yang dibuat oleh XOOPS. Hal ini membantu menghindari konflik nama jika database dibagikan dengan aplikasi lain. Awalan yang unik juga membuat nama tabel lebih sulit ditebak, sehingga memiliki manfaat keamanan. Jika Anda tidak yakin, pertahankan saja defaultnya

#### Kumpulan karakter basis data

Penginstal defaultnya adalah `utf8mb4`, yang mendukung seluruh rangkaian Unicode termasuk emoji dan karakter tambahan. Anda dapat memilih rangkaian karakter yang berbeda di sini, namun `utf8mb4` direkomendasikan untuk hampir semua bahasa dan lokal dan harus dibiarkan apa adanya kecuali Anda memiliki alasan khusus untuk mengubahnya.

#### Pengumpulan basis data

Bidang pemeriksaan dibiarkan kosong secara default. Jika kosong, MySQL menerapkan susunan default untuk kumpulan karakter mana pun yang dipilih di atas (untuk `utf8mb4` biasanya `utf8mb4_general_ci` atau `utf8mb4_0900_ai_ci`, bergantung pada versi MySQL). Jika Anda memerlukan susunan tertentu — misalnya untuk mencocokkan database yang ada — pilih di sini. Jika tidak, membiarkannya kosong adalah pilihan yang disarankan.