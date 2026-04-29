---
title: "Keperluan"
---
## Persekitaran Perisian (Timbunan)Kebanyakan tapak pengeluaran XOOPS dijalankan pada timbunan _LAMP_ (sistem **L**inux menjalankan **A**pache, **M**ySQL dan **P**HP) tetapi, terdapat banyak tindanan yang mungkin berbeza.Selalunya paling mudah untuk membuat prototaip tapak baharu pada mesin tempatan. Untuk kes ini, ramai pengguna XOOPS memilih tindanan _WAMP_ (menggunakan **W**indows sebagai OS,) manakala yang lain menjalankan tindanan _LAMP_ atau _MAMP_ (**M**AC).### PHPMana-mana versi PHP &gt;= 8.2.0 (PHP 8.4 atau lebih tinggi amat disyorkan)> **Penting:** XOOPS 2.7.0 memerlukan **PHP 8.2 atau lebih baharu**. PHP 7.x dan lebih awal tidak lagi disokong. Jika anda sedang menaik taraf tapak yang lebih lama, sahkan hos anda menawarkan PHP 8.2+ sebelum memulakan.### MySQLPelayan MySQL 5.7 atau lebih tinggi (Pelayan MySQL 8.4 atau lebih tinggi amat disyorkan.) MySQL 9.0 juga disokong. MariaDB ialah penggantian drop-in MySQL yang serasi ke belakang, dan juga berfungsi dengan baik dengan XOOPS.### Pelayan webPelayan web yang menyokong menjalankan skrip PHP, seperti Apache, NGINX, LiteSpeed, dll.### Sambungan PHP DiperlukanPemasang XOOPS mengesahkan sambungan berikut dimuatkan sebelum membenarkan pemasangan diteruskan:* `mysqli` — pemacu pangkalan data MySQL
* `session` — pengendalian sesi
* `pcre` — Ungkapan biasa yang serasi dengan Perl
* `filter` — penapisan dan pengesahan input
* `fileinfo` — MIME-jenis pengesanan untuk muat naik### Tetapan PHP DiperlukanSelain sambungan di atas, pemasang mengesahkan tetapan `php.ini` berikut:* `file_uploads` mesti **Hidup** — tanpanya, XOOPS tidak boleh menerima fail yang dimuat naik### Sambungan PHP yang DisyorkanPemasang juga menyemak sambungan ini. Ia tidak diperlukan secara ketat, tetapi XOOPS dan kebanyakan modul bergantung padanya untuk kefungsian penuh. Dayakan seberapa banyak yang dibenarkan oleh hos anda:* `mbstring` — pengendalian rentetan berbilang bait
* `intl` — pengantarabangsaan
* `iconv` — penukaran set aksara
* `xml` — Penghuraian XML
* `zlib` — pemampatan
* `gd` — pemprosesan imej
* `exif` — metadata imej
* `curl` — HTTP pelanggan untuk suapan dan panggilan API## Perkhidmatan### Akses Sistem Fail (untuk Akses Juruweb)Anda memerlukan beberapa kaedah (FTP, SFTP, dll.) untuk memindahkan fail pengedaran XOOPS ke pelayan web.### Akses Sistem Fail (untuk Proses Pelayan Web)Untuk menjalankan XOOPS, keupayaan untuk mencipta, membaca dan memadam fail dan direktori diperlukan. Laluan berikut mesti boleh ditulis oleh proses pelayan web untuk pemasangan biasa dan untuk operasi harian biasa:* `uploads/`
* `uploads/avatars/`
* `uploads/files/`
* `uploads/images/`
* `uploads/ranks/`
* `uploads/smilies/`
* `mainfile.php` (boleh ditulis semasa pemasangan dan peningkatan)
* `xoops_data/`
* `xoops_data/caches/`
* `xoops_data/caches/xoops_cache/`
* `xoops_data/caches/smarty_cache/`
* `xoops_data/caches/smarty_compile/`
* `xoops_data/configs/`
* `xoops_data/configs/captcha/`
* `xoops_data/configs/textsanitizer/`
* `xoops_data/data/`
* `xoops_data/protector/`### Pangkalan dataXOOPS perlu mencipta, mengubah suai dan membuat pertanyaan jadual dalam MySQL. Untuk ini anda perlu:* akaun pengguna MySQL dan kata laluan
* pangkalan data MySQL yang pengguna mempunyai semua keistimewaan (atau secara bergantian, pengguna boleh mempunyai keistimewaan untuk mencipta pangkalan data sedemikian)### E-melUntuk tapak langsung, anda memerlukan alamat e-mel yang berfungsi yang XOOPS boleh gunakan untuk komunikasi pengguna, seperti pengaktifan akaun dan penetapan semula kata laluan. Walaupun tidak diperlukan sepenuhnya, adalah disyorkan jika boleh menggunakan alamat e-mel yang sepadan dengan domain yang XOOPS anda jalankan. Itu membantu untuk mengelakkan komunikasi anda akhirnya ditolak atau ditandai sebagai spam.## AlatanAnda mungkin memerlukan beberapa alatan tambahan untuk menyediakan dan menyesuaikan pemasangan XOOPS anda. Ini mungkin termasuk:* Perisian Pelanggan FTP
* Editor Teks
* Arkib Perisian untuk berfungsi dengan fail keluaran XOOPS (_.zip_ atau _.tar.gz_).Lihat bahagian [Tools of the Trade](../tools/tools.md) untuk beberapa cadangan alat yang sesuai dan susunan pelayan web jika perlu.## Topik KhasSesetengah gabungan perisian sistem tertentu mungkin memerlukan beberapa konfigurasi tambahan untuk berfungsi dengan XOOPS. Jika anda menggunakan persekitaran SELinux, atau menaik taraf tapak lama dengan tema tersuai, sila rujuk [Topik Khas](specialtopics.md) untuk mendapatkan maklumat lanjut.