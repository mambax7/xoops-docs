---
title: "Lampiran 3: Menterjemah XOOPS kepada Bahasa Tempatan"
---
XOOPS 2.7.0 dihantar dengan fail bahasa Inggeris sahaja. Terjemahan ke dalam bahasa lain diselenggara oleh komuniti dan diedarkan melalui GitHub dan pelbagai tapak sokongan XOOPS setempat.## Tempat untuk mencari terjemahan sedia ada- **GitHub** — terjemahan komuniti semakin diterbitkan sebagai repositori berasingan di bawah [organisasi XOOPS](https://github.com/XOOPS) dan pada akaun penyumbang individu. Cari GitHub untuk `XOOPS-language-<your-language>` atau semak imbas organisasi XOOPS untuk pakej semasa.
- **Tapak sokongan XOOPS tempatan** — banyak komuniti XOOPS serantau menerbitkan terjemahan di tapak mereka sendiri. Lawati [https://XOOPS.org](https://XOOPS.org) dan ikuti pautan ke komuniti setempat.
- **Terjemahan modul** — terjemahan untuk modul komuniti individu biasanya tinggal bersebelahan dengan modul itu sendiri dalam organisasi GitHub `XoopsModules25x` (`25x` dalam namanya adalah sejarah; modul di sana dikekalkan untuk kedua-dua XOOPS ZXQPH001x. 2.7.x).Jika terjemahan untuk bahasa anda sudah wujud, lepaskan direktori bahasa ke dalam pemasangan XOOPS anda (lihat "Cara memasang terjemahan" di bawah).## Apa yang perlu diterjemahkanXOOPS 2.7.0 menyimpan fail bahasa di sebelah kod yang menggunakannya. Terjemahan lengkap merangkumi semua lokasi ini:- **Teras** — `htdocs/language/english/` — pemalar seluruh tapak yang digunakan oleh setiap halaman (log masuk, ralat biasa, tarikh, templat mel, dsb.).
- **Pemasang** — `htdocs/install/language/english/` — rentetan ditunjukkan oleh wizard pemasangan. Terjemah ini *sebelum* menjalankan pemasang jika anda mahukan pengalaman pemasangan setempat.
- **Modul sistem** — `htdocs/modules/system/language/english/` — set terbesar setakat ini; meliputi keseluruhan Panel Kawalan pentadbir.
- **Modul yang digabungkan** — setiap satu daripada `htdocs/modules/pm/language/english/`, `htdocs/modules/profile/language/english/`, `htdocs/modules/protector/language/english/` dan `htdocs/modules/debugbar/language/english/`.
- **Tema** — segelintir tema menghantar fail bahasa mereka sendiri; semak `htdocs/themes/<theme>/language/` jika ia wujud.Terjemahan "teras sahaja" ialah unit berguna minimum dan sepadan dengan dua titik pertama di atas.## Bagaimana untuk menterjemah1. Salin direktori `english/` di sebelahnya dan namakan semula salinan itu kepada bahasa anda. Nama direktori hendaklah nama Inggeris huruf kecil bahasa (`spanish`, `german`, `french`, `japanese`, `arabic`, dsb.).
```
   htdocs/language/english/ → htdocs/language/spanish/
   ```2. Buka setiap fail `.php` dalam direktori baharu dan terjemah **nilai rentetan** di dalam panggilan `define()`. Jangan **jangan** tukar nama tetap — ia dirujuk daripada kod PHP di seluruh teras.
```
php
   // Sebelum:
   define('_CM_COMDELETED', 'Ulasan(s) dipadamkan.');
   define('_CM_COMDELETENG', 'Tidak dapat memadam ulasan.');
   define('_CM_DELETESELECT', 'Padam semua ulasan anaknya?');// Selepas (Bahasa Sepanyol):
   define('_CM_COMDELETED', 'Commentario(s) eliminado(s).');
   define('_CM_COMDELETENG', 'Tidak boleh menghapuskan komen.');
   define('_CM_DELETESELECT', '¿Eliminar también todos sus comentarios secundarios?');
   ```3. **Simpan setiap fail sebagai UTF-8 *tanpa* BOM.** XOOPS 2.7.0 menggunakan `utf8mb4` hujung ke hujung (pangkalan data, sesi, output) dan menolak fail dengan tanda pesanan bait. Dalam Notepad++ ini ialah pilihan **"UTF-8"**, *bukan* "UTF-8-BOM". Dalam Kod VS ia adalah lalai; hanya sahkan pengekodan dalam bar status.4. Kemas kini bahasa dan metadata charset di bahagian atas setiap fail agar sepadan dengan bahasa anda:
```
php
   // _LANGCODE: es
   // _CHARSET : UTF-8
   // Penterjemah: Nama Anda
   ````_LANGCODE` mestilah kod [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) untuk bahasa anda. `_CHARSET` sentiasa `UTF-8` dalam XOOPS 2.7.0 — tiada lagi varian ISO-8859-1.5. Ulang untuk pemasang, modul Sistem, dan mana-mana modul yang digabungkan yang anda perlukan.## Cara memasang terjemahanJika anda memperoleh terjemahan siap sebagai pepohon direktori:1. Salin setiap direktori `<language>/` ke dalam induk `language/english/` yang sepadan dalam pemasangan XOOPS anda. Contohnya, salin `language/spanish/` ke dalam `htdocs/language/`, `install/language/spanish/` ke dalam `htdocs/install/language/` dan seterusnya.
2. Pastikan pemilikan fail dan kebenaran boleh dibaca oleh pelayan web.
3. Sama ada pilih bahasa baharu pada masa pemasangan (wizard mengimbas `htdocs/language/` untuk bahasa yang tersedia) atau, pada tapak sedia ada, tukar bahasa dalam **Pentadbir → Sistem → Keutamaan → Tetapan Umum**.## Berkongsi terjemahan anda kembaliSila sumbangkan terjemahan anda kembali kepada komuniti.1. Buat repositori GitHub (atau buat repositori bahasa sedia ada jika ada untuk bahasa anda).
2. Gunakan nama yang jelas seperti `XOOPS-language-<language-code>` (cth. `XOOPS-language-es`, `XOOPS-language-pt-br`).
3. Cerminkan struktur direktori XOOPS di dalam repositori anda supaya fail selaras dengan tempat ia disalin:
```
   XOOPS-language-es/
   ├── language/spanish/(files).php
   ├── install/language/spanish/(files).php
   └── modules/system/language/spanish/(files).php
   ```4. Sertakan dokumentasi `README.md`:
   - Nama bahasa dan kod ISO
   - Keserasian versi XOOPS (cth. `XOOPS 2.7.0+`)
   - Penterjemah dan kredit
   - Sama ada terjemahan adalah teras sahaja atau meliputi modul yang digabungkan
5. Buka permintaan tarik terhadap repositori module/core yang berkaitan pada GitHub atau siarkan pengumuman pada [https://XOOPS.org](https://XOOPS.org) supaya komuniti boleh menemuinya.> **Nota**
>
> Jika bahasa anda memerlukan perubahan pada teras untuk pemformatan tarikh atau kalendar, sertakan perubahan tersebut dalam pakej juga. Bahasa dengan skrip kanan ke kiri (Arab, Ibrani, Parsi, Urdu) berfungsi di luar kotak dalam XOOPS 2.7.0 — Sokongan RTL telah ditambahkan dalam keluaran ini dan tema individu mengambilnya secara automatik.