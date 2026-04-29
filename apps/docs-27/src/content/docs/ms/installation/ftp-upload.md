---
title: "Lampiran 2: Memuat naik XOOPS melalui FTP"
---
Lampiran ini berjalan melalui penggunaan XOOPS 2.7.0 ke hos jauh menggunakan FTP atau SFTP. Mana-mana panel kawalan (cPanel, Plesk, DirectAdmin, dll.) akan mendedahkan langkah asas yang sama.## 1. Sediakan pangkalan dataMelalui panel kawalan hos anda:1. Cipta pangkalan data MySQL baharu untuk XOOPS.
2. Buat pengguna pangkalan data dengan kata laluan yang kuat.
3. Berikan pengguna keistimewaan penuh pada pangkalan data yang baru dibuat.
4. Rekod nama pangkalan data, nama pengguna, kata laluan dan hos — anda akan memasukkannya ke dalam pemasang XOOPS.> **Petua**
>
> Panel kawalan moden menjana kata laluan yang kukuh untuk anda. Memandangkan aplikasi menyimpan kata laluan dalam `xoops_data/data/secure.php`, anda tidak perlu menaipnya dengan kerap — lebih suka nilai yang panjang dan dijana secara rawak.## 2. Buat peti mel pentadbirBuat peti mel e-mel yang akan menerima pemberitahuan pentadbiran tapak. Pemasang XOOPS meminta alamat ini semasa persediaan akaun juruweb dan mengesahkannya dengan `FILTER_VALIDATE_EMAIL`.## 3. Muat naik failXOOPS 2.7.0 dihantar dengan kebergantungan pihak ketiga yang diprapasang dalam `xoops_lib/vendor/` (Pakej komposer, Smarty 4, HTMLPurifier, PHPMailer, Monolog, TCPDF dan banyak lagi). Ini menjadikan `xoops_lib/` jauh lebih besar daripada 2.5.x — jangkakan berpuluh-puluh megabait.**Jangan melangkau fail secara selektif di dalam `xoops_lib/vendor/`.** Melangkau fail dalam pepohon vendor Komposer akan memecahkan autoloading dan pemasangan akan gagal.Struktur muat naik (dengan andaian `public_html` ialah punca dokumen):1. Muat naik `xoops_data/` dan `xoops_lib/` **bersebelahan** `public_html`, bukan di dalamnya. Meletakkannya di luar akar web ialah postur keselamatan yang disyorkan untuk 2.7.0.
```
   /home/your-user/
   ├── public_html/
   ├── xoops_data/ ← muat naik di sini
   └── xoops_lib/ ← muat naik di sini
   ```![](/XOOPS-docs/2.7/img/installation/img_66.jpg)
   ![](/XOOPS-docs/2.7/img/installation/img_67.jpg)2. Muat naik kandungan selebihnya bagi direktori `htdocs/` ke dalam `public_html/`.![](/XOOPS-docs/2.7/img/installation/img_68.jpg)> **Jika hos anda tidak membenarkan direktori di luar akar dokumen**
>
> Muat naik `xoops_data/` dan `xoops_lib/` **di dalam** `public_html/` dan **menamakan semula mereka kepada nama yang tidak jelas** (contohnya `xdata_8f3k2/` dan `xlib_7h2m1/`). Anda akan memasukkan laluan yang dinamakan semula ke dalam pemasang apabila ia meminta Laluan Data XOOPS dan Laluan Perpustakaan XOOPS.## 4. Jadikan direktori boleh tulis boleh ditulisMelalui dialog CHMOD pelanggan FTP (atau SSH), jadikan direktori yang disenaraikan dalam Bab 2 boleh ditulis oleh pelayan web. Pada kebanyakan hos kongsi, `0775` pada direktori dan `0664` pada `mainfile.php` sudah memadai. `0777` boleh diterima semasa pemasangan jika hos anda menjalankan PHP di bawah pengguna selain pengguna FTP, tetapi ketatkan kebenaran selepas pemasangan selesai.## 5. Lancarkan pemasangHalakan penyemak imbas anda pada URL awam tapak tersebut. Jika semua fail ada di tempatnya, Wizard Pemasangan XOOPS bermula dan anda boleh mengikuti panduan ini yang lain dari [Bab 2](chapter-2-introduction.md) dan seterusnya.