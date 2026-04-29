---
title: "Semakan Prapenerbangan"
---
XOOPS 2.7.0 menaik taraf enjin templatnya daripada Smarty 3 kepada Smarty 4. Smarty 4 lebih ketat mengenai sintaks templat berbanding Smarty 3 dan beberapa tema tersuai dan templat modul mungkin perlu dilaraskan sebelum ia berfungsi dengan betul pada ZXQQPHX000Z0033Untuk membantu mengenal pasti dan membaiki isu ini _sebelum_ anda menjalankan penaik taraf utama, XOOPS 2.7.0 dihantar dengan **pengimbas preflight** dalam direktori `upgrade/`. Anda mesti menjalankan pengimbas prapenerbangan sekurang-kurangnya sekali sebelum aliran kerja naik taraf utama membolehkan anda meneruskan.## Perkara yang Dilakukan PengimbasPengimbas prapenerbangan menelusuri tema dan templat modul sedia ada anda mencari ketidakserasian Smarty 4 yang diketahui. Ia boleh:* **Imbas** direktori `themes/` dan `modules/` anda untuk fail templat `.tpl` dan `.html` yang mungkin memerlukan perubahan
* **Laporkan** isu dihimpunkan mengikut fail dan mengikut jenis masalah
* **Baiki secara automatik** banyak isu biasa apabila anda memintanyaTidak semua masalah boleh dibaiki secara automatik. Sesetengah templat memerlukan pengeditan manual, terutamanya jika mereka menggunakan simpulan bahasa Smarty 3 yang lebih lama yang tidak mempunyai persamaan langsung dalam Smarty 4.## Menjalankan Pengimbas1. Salin direktori pengedaran `upgrade/` ke dalam akar web tapak anda (jika anda belum melakukannya sebagai sebahagian daripada langkah [Persediaan untuk Peningkatan](ustep-01.md)).
2. Halakan penyemak imbas anda pada URL pra-penerbangan:
```
teks
   http://example.com/upgrade/preflight.php
   ```3. Log masuk dengan akaun pentadbir apabila digesa.
4. Pengimbas membentangkan borang dengan tiga kawalan:
   * **Direktori templat** — biarkan kosong untuk mengimbas kedua-dua `themes/` dan `modules/`. Masukkan laluan seperti `/themes/mytheme/` untuk mengecilkan imbasan kepada satu direktori.
   * **Sambungan templat** — biarkan kosong untuk mengimbas kedua-dua fail `.tpl` dan `.html`. Masukkan sambungan tunggal untuk mengecilkan imbasan.
   * **Cuba pembetulan automatik** — tandai kotak ini jika anda mahu pengimbas membaiki isu yang diketahuinya cara membetulkannya. Biarkan ia tidak ditandai untuk imbasan baca sahaja.
5. Tekan butang **Run**. Pengimbas menjalankan direktori yang dipilih dan melaporkan setiap isu yang ditemuinya.## Mentafsir KeputusanLaporan imbasan menyenaraikan setiap fail yang diperiksa dan setiap isu yang ditemuinya. Setiap entri isu memberitahu anda:* Fail mana yang mengandungi masalah
* Peraturan Smarty 4 yang dilanggarnya
* Sama ada pengimbas boleh membaikinya secara automatikJika anda menjalankan imbasan dengan _Percubaan pembetulan automatik_ didayakan, laporan itu juga akan mengesahkan fail yang telah ditulis semula.## Menyelesaikan Isu Secara ManualUntuk isu pengimbas tidak boleh membaiki secara automatik, buka fail templat yang dibenderakan dalam editor dan buat perubahan yang diperlukan. Ketidakserasian Smarty 4 biasa termasuk:* Blok `{php} ... {/php}` (tidak lagi disokong dalam Smarty 4)
* Pengubah suai dan panggilan fungsi yang ditamatkan
* Penggunaan pembatas sensitif ruang putih
* Andaian pemalam masa daftar yang berubah dalam Smarty 4Jika anda tidak selesa mengedit templat, pendekatan paling selamat ialah menukar kepada tema yang dihantar (`xbootstrap5`, `default`, `xswatch5`, dsb.) dan berurusan dengan tema tersuai secara berasingan selepas peningkatan selesai.## Berjalan semula Sehingga BersihSelepas membuat pembetulan — sama ada automatik atau manual — jalankan semula pengimbas prapenerbangan. Ulangi sehingga imbasan melaporkan tiada isu yang tinggal.Setelah imbasan bersih, anda boleh menamatkan sesi prapenerbangan dengan menekan butang **Keluar Pengimbas** dalam UI pengimbas. Ini menandakan prapenerbangan sebagai lengkap dan membenarkan penaik taraf utama di `/upgrade/` untuk meneruskan.## Meneruskan ke PeningkatanDengan prapenerbangan selesai, anda boleh melancarkan peningkatan utama di:
```
text
http://example.com/upgrade/
```
Lihat [Menjalankan Naik Taraf](ustep-02.md) untuk langkah seterusnya.## Jika Anda Melangkau PrapenerbanganMelangkau prapenerbangan amat tidak digalakkan, tetapi jika anda menaik taraf tanpa menjalankannya dan kini melihat ralat templat, lihat bahagian Ralat Templat Smarty 4 pada [Penyelesaian Masalah](ustep-03.md). Anda boleh menjalankan prapenerbangan selepas fakta dan menghapuskan `xoops_data/caches/smarty_compile/` untuk pulih.