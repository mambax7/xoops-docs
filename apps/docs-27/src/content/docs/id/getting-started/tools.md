---
title: "Alat Perdagangan"
---

Ada banyak hal yang diperlukan untuk menyesuaikan dan memelihara situs web XOOPS yang perlu dilakukan di luar XOOPS, atau lebih mudah dilakukan di sana.

Ini adalah daftar jenis alat yang mungkin ingin Anda sediakan, bersama dengan beberapa saran untuk alat tertentu yang menurut webmaster XOOPS berguna.

## Editor

Editor adalah pilihan yang sangat pribadi, dan orang-orang bisa menjadi sangat tertarik dengan favorit mereka. Kami hanya akan menyajikan beberapa dari sekian banyak kemungkinan.

Untuk penggunaan XOOPS, Anda memerlukan editor untuk mengubah beberapa opsi konfigurasi serta menyesuaikan theme untuk situs Anda. Untuk penggunaan ini, akan sangat membantu jika memiliki editor yang dapat bekerja dengan banyak file secara bersamaan, dapat mencari dan mengganti banyak file, dan menyediakan penyorotan sintaksis. Anda dapat menggunakan editor yang sangat sederhana dan tanpa embel-embel, tetapi Anda akan bekerja lebih keras untuk menyelesaikan beberapa tugas.

**PhpStorm** dari _JetBrains_ adalah IDE (lingkungan pengembangan terintegrasi) yang dirancang khusus untuk pengembangan web PHP. _JetBrains_ sangat membantu dalam mensponsori XOOPS, dan produknya menjadi favorit banyak pengembang. Ini adalah produk komersial, dan mungkin biayanya mahal bagi beberapa webmaster baru, namun penghematan waktu membuatnya menarik bagi pengembang berpengalaman.

**Visual Studio Code** adalah editor kode sumber multi-platform gratis dari Microsoft. Ini memiliki dukungan, baik bawaan atau melalui ekstensi, untuk teknologi web core seperti HTML, JavaScript, dan PHP, sehingga cocok untuk penggunaan XOOPS.

**Notepad++** adalah pesaing gratis dan terhormat dalam kategori ini untuk Windows, dengan pengguna setia.

**Meld** bukan editor, namun membandingkan file teks yang menunjukkan perbedaan, dan memungkinkan penggabungan perubahan secara selektif, dan melakukan pengeditan kecil. Sangat berguna saat membandingkan file konfigurasi, template theme, dan tentunya kode PHP.

| Nama | Tautan | Lisensi | Peron |
| :--- | :--- | :--- | :--- |
| PhpStorm | [https://www.jetbrains.com/phpstorm/](https://www.jetbrains.com/phpstorm/) | Komersial | Apa saja |
| Kode Visual Studio | [https://code.visualstudio.com/](https://code.visualstudio.com/) | MIT | Apa saja |
| Buku Catatan++ | [https://notepad-plus-plus.org/](https://notepad-plus-plus.org/) | GPL | Menangkan |
| berbaur | [https://meldmerge.org/](https://meldmerge.org/) | GPL | Apa saja |

## Klien FTP

File Transfer Protocol (FTP,) atau variasinya, digunakan untuk memindahkan file dari satu komputer ke komputer lain. Sebagian besar instalasi XOOPS memerlukan klien FTP untuk memindahkan file yang berasal dari distribusi XOOPS ke sistem host tempat situs akan disebarkan.

**FileZilla** adalah Klien FTP gratis dan tangguh yang tersedia untuk sebagian besar platform. Konsistensi lintas platform menjadikannya pilihan contoh FTP dalam buku ini.

**PuTTY** adalah klien SSH gratis, berguna untuk akses Shell ke server, serta menyediakan kemampuan transfer file dengan SCP

**WinSCP** adalah klien FTP/SFTP/SCP untuk sistem Windows.

| Nama | Tautan | Lisensi | Peron |
| :--- | :--- | :--- | :--- |
| FileZilla | [https://filezilla-project.org/](https://filezilla-project.org/) | GPL | Apa saja |
| Dempul | [https://www.chiark.greenend.org.uk/~sgtatham/putty/](https://www.chiark.greenend.org.uk/~sgtatham/putty/) | BSD | Menangkan/*nix |
| WinSCP | [https://winscp.net/eng/index.php](https://winscp.net/eng/index.php) | GPL | jendela |

## MySQL/MariaDB

Basis data berisi semua konten situs Anda, konfigurasi yang menyesuaikan situs Anda, informasi tentang pengguna situs Anda, dan banyak lagi. Melindungi dan memelihara informasi tersebut mungkin lebih mudah dengan beberapa alat tambahan yang khusus menangani database.

**phpMyAdmin** adalah alat berbasis web paling populer untuk bekerja dengan database MySQL, termasuk membuat cadangan satu kali.

**BigDump** adalah anugerah bagi akun hosting terbatas, yang membantu memulihkan dump cadangan database besar sambil menghindari batasan waktu dan ukuran.

**srdb**, Search Ganti DB untuk XOOPS adalah adaptasi XOOPS dari [Search and replace DB](https://github.com/interconnectit/Search-Replace-DB) dari interconnect/it. Sangat berguna untuk mengubah URL dan referensi sistem file di data MySQL saat Anda memindahkan situs.| Nama | Tautan | Lisensi | Peron |
| :--- | :--- | :--- | :--- |
| phpMyAdmin | [https://www.phpmyadmin.net/](https://www.phpmyadmin.net/) | GPL | Apa saja |
| Dump Besar | [http://www.ozerov.de/bigdump/](http://www.ozerov.de/bigdump/) | GPL | Apa saja |
| srdb | [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) | GPL3 | Apa saja |

## Tumpukan Pengembang

Beberapa platform, seperti Ubuntu, memiliki seluruh tumpukan yang diperlukan untuk menjalankan XOOPS bawaan, sementara yang lain memerlukan beberapa tambahan.

**WAMP** dan **Uniform Server Zero** adalah tumpukan lengkap untuk Windows.

**XAMPP**, tumpukan lengkap dari Apache Friends, tersedia untuk berbagai platform.

**bitnami** menawarkan beragam tumpukan aplikasi bawaan, termasuk mesin virtual dan image container. Penawaran mereka dapat menjadi sumber berharga untuk mencoba aplikasi dengan cepat (termasuk XOOPS) atau berbagai teknologi web. Mereka mungkin cocok untuk produksi serta penggunaan pengembangan.

**Docker** adalah platform kontainer aplikasi, yang digunakan untuk membuat dan menjalankan kontainer untuk mengimplementasikan lingkungan kustom. 

**Devilbox** adalah tumpukan pengembangan berbasis Docker yang mudah dikonfigurasi. Ini menawarkan berbagai versi untuk semua komponen tumpukan, dan memungkinkan pengembang untuk menguji dalam lingkungan yang dapat direproduksi dan dibagikan. 

| Nama | Tautan | Lisensi | Peron |
| :--- | :--- | :--- | :--- |
| WAMP | [http://www.wampserver.com/](http://www.wampserver.com/) | Banyak | Menangkan |
| Seragam Server Nol | [http://www.uniformserver.com/](http://www.uniformserver.com/) | Banyak | Menangkan |
| XAMPP | [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html) | Banyak | Apa saja |
| bitnami | [https://bitnami.com/](https://bitnami.com/) | Banyak | Apa saja |
| buruh pelabuhan | [https://www.docker.com/](https://www.docker.com/) | Banyak | Apa saja |
| Kotak Setan | [http://devilbox.org/](http://devilbox.org/) | MIT | Apa saja |