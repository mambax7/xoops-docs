---
title: "Gambaran Keseluruhan Panel Pentadbir"
description: "Panduan komprehensif untuk reka letak panel pentadbir XOOPS, navigasi, ciri papan pemuka dan fungsi pentadbiran teras"
---
# XOOPS Gambaran Keseluruhan Panel PentadbirPanduan lengkap untuk menavigasi dan menggunakan papan pemuka pentadbir XOOPS.## Mengakses Panel Pentadbiran### Log Masuk AdminBuka penyemak imbas anda dan navigasi ke:
```
http://your-domain.com/XOOPS/admin/
```
Atau jika XOOPS berada dalam akar:
```
http://your-domain.com/admin/
```
Masukkan bukti kelayakan pentadbir anda:
```
Username: [Your admin username]
Password: [Your admin password]
```
### Selepas Log MasukAnda akan melihat papan pemuka pentadbir utama:
```
mermaid
flowchart TB
    subgraph Dashboard["🖥️ Admin Dashboard"]
        direction TB
        Header["👤 Welcome, Administrator | Logout | My Account"]
        Title["📊 Dashboard"]
        subgraph Content["Main Content Area"]
            Widgets["⚡ Quick Access Widgets"]
            Stats["📈 Statistics"]
            Recent["🕐 Recent Activities"]
        end
    end

    Header --> Title
    Title --> Content

    style Header fill:#1976d2,color:#fff
    style Title fill:#e3f2fd,stroke:#1976d2
    style Content fill:#f5f5f5,stroke:#ccc
```
## Reka Letak Panel Pentadbiran
```
mermaid
graph TD
    A[Admin Dashboard] --> B[Top Navigation]
    A --> C[Left Sidebar]
    A --> D[Main Content Area]
    B --> B1[Admin Name]
    B --> B2[My Account]
    B --> B3[Logout]
    C --> C1[System]
    C --> C2[Content]
    C --> C3[Users]
    C --> C4[Modules]
    C --> C5[Appearance]
    C --> C6[Tools]
    D --> D1[Dashboard Stats]
    D --> D2[Quick Actions]
    D --> D3[Recent Items]
```
## Komponen Papan Pemuka### Bar AtasBar atas mengandungi kawalan penting:| Elemen | Tujuan |
|---|---|
| **Logo Pentadbir** | Klik untuk kembali ke papan pemuka |
| **Mesej Selamat Datang** | Menunjukkan nama pentadbir log masuk |
| **Akaun Saya** | Edit profil pentadbir dan kata laluan |
| **Bantuan** | Akses dokumentasi |
| **Log Keluar** | Log keluar daripada panel pentadbir |### Bar Sisi Navigasi KiriMenu utama disusun mengikut fungsi:
```
├── System
│   ├── Dashboard
│   ├── Preferences
│   ├── Admin Users
│   ├── Groups
│   ├── Permissions
│   ├── Modules
│   └── Tools
├── Content
│   ├── Pages
│   ├── Categories
│   ├── Comments
│   └── Media Manager
├── Users
│   ├── Users
│   ├── User Requests
│   ├── Online Users
│   └── User Groups
├── Modules
│   ├── Modules
│   ├── Module Settings
│   └── Module Updates
├── Appearance
│   ├── Themes
│   ├── Templates
│   ├── Blocks
│   └── Images
└── Tools
    ├── Maintenance
    ├── Email
    ├── Statistics
    ├── Logs
    └── Backups
```
### Bidang Kandungan UtamaMemaparkan maklumat dan kawalan untuk bahagian yang dipilih:- Borang untuk konfigurasi
- Jadual data dengan senarai
- Carta dan statistik
- Butang tindakan pantas
- Teks bantuan dan petua alat### Widget Papan PemukaAkses pantas kepada maklumat penting:- **Maklumat Sistem:** Versi PHP, versi MySQL, versi XOOPS
- **Statistik Pantas:** Kiraan pengguna, jumlah siaran, modul yang dipasang
- **Aktiviti Terkini:** Log masuk terkini, perubahan kandungan, ralat
- **Status Pelayan:** CPU, memori, penggunaan cakera
- **Pemberitahuan:** Makluman sistem, kemas kini belum selesai## Fungsi Pentadbir Teras### Pengurusan Sistem**Lokasi:** Sistem > [Pelbagai Pilihan]#### KeutamaanKonfigurasikan tetapan sistem asas:
```
System > Preferences > [Settings Category]
```
kategori:
- Tetapan Umum (nama tapak, zon waktu)
- Tetapan Pengguna (pendaftaran, profil)
- Tetapan E-mel (konfigurasi SMTP)
- Tetapan Cache (pilihan cache)
- Tetapan URL (URL mesra)
- Meta Tag (tetapan SEO)Lihat Konfigurasi Asas dan Tetapan Sistem.#### Pengguna PentadbirUrus akaun pentadbir:
```
System > Admin Users
```
Fungsi:
- Tambah pentadbir baharu
- Edit profil pentadbir
- Tukar kata laluan pentadbir
- Padam akaun pentadbir
- Tetapkan kebenaran pentadbir### Pengurusan Kandungan**Lokasi:** Kandungan > [Pelbagai Pilihan]#### Pages/ArticlesUrus kandungan tapak:
```
Content > Pages (or your module)
```
Fungsi:
- Buat halaman baharu
- Edit kandungan sedia ada
- Padam halaman
- Publish/unpublish
- Tetapkan kategori
- Mengurus semakan#### KategoriSusun kandungan:
```
Content > Categories
```
Fungsi:
- Buat hierarki kategori
- Edit kategori
- Padamkan kategori
- Berikan kepada halaman#### KomenKomen pengguna sederhana:
```
Content > Comments
```
Fungsi:
- Lihat semua komen
- Luluskan ulasan
- Edit komen
- Padamkan spam
- Sekat pengulas### Pengurusan Pengguna**Lokasi:** Pengguna > [Pelbagai Pilihan]#### PenggunaUrus akaun pengguna:
```
Users > Users
```
Fungsi:
- Lihat semua pengguna
- Buat pengguna baharu
- Edit profil pengguna
- Padam akaun
- Tetapkan semula kata laluan
- Tukar status pengguna
- Berikan kepada kumpulan#### Pengguna Dalam TalianPantau pengguna aktif:
```
Users > Online Users
```
Rancangan:
- Pengguna dalam talian pada masa ini
- Masa aktiviti terakhir
- Alamat IP
- Lokasi pengguna (jika dikonfigurasikan)#### Kumpulan PenggunaUrus peranan dan kebenaran pengguna:
```
Users > Groups
```
Fungsi:
- Buat kumpulan tersuai
- Tetapkan kebenaran kumpulan
- Tetapkan pengguna kepada kumpulan
- Padam kumpulan### Pengurusan Modul**Lokasi:** Modul > [Pelbagai Pilihan]#### ModulPasang dan konfigurasikan modul:
```
Modules > Modules
```
Fungsi:
- Lihat modul yang dipasang
- Modul Enable/disable
- Kemas kini modul
- Konfigurasikan tetapan modul
- Pasang modul baharu
- Lihat butiran modul#### Semak Kemas Kini
```
Modules > Modules > Check for Updates
```
Paparan:
- Kemas kini modul yang tersedia
- Log perubahan
- Muat turun dan pasang pilihan### Pengurusan Penampilan**Lokasi:** Rupa > [Pelbagai Pilihan]#### TemaUrus tema tapak:
```
Appearance > Themes
```
Fungsi:
- Lihat tema yang dipasang
- Tetapkan tema lalai
- Muat naik tema baharu
- Padamkan tema
- Pratonton tema
- Konfigurasi tema#### BlokUrus blok kandungan:
```
Appearance > Blocks
```
Fungsi:
- Buat blok tersuai
- Edit kandungan blok
- Susun blok pada halaman
- Tetapkan keterlihatan blok
- Padamkan blok
- Konfigurasikan cache blok#### TemplatUrus templat (lanjutan):
```
Appearance > Templates
```
Untuk pengguna dan pembangun lanjutan.### Alatan Sistem**Lokasi:** Sistem > Alat#### Mod PenyelenggaraanHalang akses pengguna semasa penyelenggaraan:
```
System > Maintenance Mode
```
Konfigurasikan:
- Penyelenggaraan Enable/disable
- Mesej penyelenggaraan tersuai
- Alamat IP yang dibenarkan (untuk ujian)#### Pengurusan Pangkalan Data
```
System > Database
```
Fungsi:
- Semak ketekalan pangkalan data
- Jalankan kemas kini pangkalan data
- Membaiki meja
- Optimumkan pangkalan data
- Eksport struktur pangkalan data#### Log Aktiviti
```
System > Logs
```
Pantau:
- Aktiviti pengguna
- Tindakan pentadbiran
- Acara sistem
- Log ralat## Tindakan PantasTugas biasa boleh diakses dari papan pemuka:
```
Quick Links:
├── Create New Page
├── Add New User
├── Create Content Block
├── Upload Image
├── Send Mass Email
├── Update All Modules
└── Clear Cache
```
## Pintasan Papan Kekunci Panel PentadbirNavigasi pantas:| Pintasan | Tindakan |
|---|---|
| `Ctrl+H` | Pergi untuk membantu |
| `Ctrl+D` | Pergi ke papan pemuka |
| `Ctrl+Q` | Carian pantas |
| `Ctrl+L` | Log keluar |## Pengurusan Akaun Pengguna### Akaun SayaAkses profil pentadbir anda:1. Klik "Akaun Saya" di bahagian atas sebelah kanan
2. Edit maklumat profil:
   - Alamat e-mel
   - Nama sebenar
   - Maklumat pengguna
   - Avatar### Tukar Kata LaluanTukar kata laluan pentadbir anda:1. Pergi ke **Akaun Saya**
2. Klik "Tukar Kata Laluan"
3. Masukkan kata laluan semasa
4. Masukkan kata laluan baharu (dua kali)
5. Klik "Simpan"**Petua Keselamatan:**
- Gunakan kata laluan yang kukuh (16+ aksara)
- Sertakan huruf besar, huruf kecil, nombor, simbol
- Tukar kata laluan setiap 90 hari
- Jangan sekali-kali berkongsi kelayakan pentadbir### Log keluarLog keluar daripada panel pentadbir:1. Klik "Log Keluar" di bahagian atas sebelah kanan
2. Anda akan dialihkan ke halaman log masuk## Statistik Panel Pentadbiran### Statistik Papan PemukaGambaran keseluruhan pantas metrik tapak:| Metrik | Nilai |
|--------|-------|
| Pengguna Dalam Talian | 12 |
| Jumlah Pengguna | 256 |
| Jumlah Catatan | 1,234 |
| Jumlah Komen | 5,678 |
| Jumlah Modul | 8 |### Status SistemMaklumat pelayan dan prestasi:| Komponen | Version/Value |
|-----------|----------------|
| Versi XOOPS | 2.5.11 |
| Versi PHP | 8.2.x |
| Versi MySQL | 8.0.x |
| Muatan Pelayan | 0.45, 0.42 |
| Masa aktif | 45 hari |### Aktiviti TerkiniGaris masa peristiwa terkini:
```
12:45 - Admin login
12:30 - New user registered
12:15 - Page published
12:00 - Comment posted
11:45 - Module updated
```
## Sistem Pemberitahuan### Makluman PentadbirTerima pemberitahuan untuk:- Pendaftaran pengguna baharu
- Komen menunggu penyederhanaan
- Percubaan log masuk gagal
- Ralat sistem
- Kemas kini modul tersedia
- Isu pangkalan data
- Amaran ruang cakeraKonfigurasikan makluman:**Sistem > Keutamaan > Tetapan E-mel**
```
Notify Admin on Registration: Yes
Notify Admin on Comments: Yes
Notify Admin on Errors: Yes
Alert Email: admin@your-domain.com
```
## Tugas Pentadbiran Biasa### Buat Halaman Baharu1. Pergi ke **Kandungan > Halaman** (atau modul berkaitan)
2. Klik "Tambah Halaman Baharu"
3. Isikan:
   - Tajuk
   - Kandungan
   - Penerangan
   - Kategori
   - Metadata
4. Klik "Terbitkan"### Urus Pengguna1. Pergi ke **Pengguna > Pengguna**
2. Lihat senarai pengguna dengan:
   - Nama pengguna
   - E-mel
   - Tarikh pendaftaran
   - Log masuk terakhir
   - Status3. Klik nama pengguna untuk:
   - Edit profil
   - Tukar kata laluan
   - Edit kumpulan
   - Pengguna Block/unblock### Konfigurasi Modul1. Pergi ke **Modules > Modules**
2. Cari modul dalam senarai
3. Klik nama modul
4. Klik "Keutamaan" atau "Tetapan"
5. Konfigurasikan pilihan modul
6. Simpan perubahan### Buat Blok Baharu1. Pergi ke **Penampilan > Blok**
2. Klik "Tambah Blok Baharu"
3. Masukkan:
   - Tajuk blok
   - Sekat kandungan (HTML dibenarkan)
   - Kedudukan pada halaman
   - Keterlihatan (semua halaman atau khusus)
   - Modul (jika berkenaan)
4. Klik "Serah"## Bantuan Panel Pentadbiran### Dokumentasi Terbina dalamAkses bantuan daripada panel pentadbir:1. Klik butang "Bantuan" di bar atas
2. Bantuan sensitif konteks untuk halaman semasa
3. Pautan kepada dokumentasi
4. Soalan lazim### Sumber Luaran- Tapak Rasmi XOOPS: https://XOOPS.org/
- Forum Komuniti: https://XOOPS.org/modules/newbb/
- Repositori Modul: https://XOOPS.org/modules/repository/
- Bugs/Issues: https://github.com/XOOPS/XoopsCore/issues## Menyesuaikan Panel Pentadbiran### Tema PentadbirPilih tema antara muka pentadbir:**Sistem > Keutamaan > Tetapan Umum**
```
Admin Theme: [Select theme]
```
Tema yang tersedia:
- Lalai (cahaya)
- Mod gelap
- Tema tersuai### Penyesuaian Papan PemukaPilih widget yang muncul:**Papan Pemuka > Sesuaikan**Pilih:
- Maklumat sistem
- Perangkaan
- Aktiviti terkini
- Pautan pantas
- Widget tersuai## Kebenaran Panel PentadbirTahap pentadbir yang berbeza mempunyai kebenaran yang berbeza:| Peranan | Keupayaan |
|---|---|
| **Juruweb** | Akses penuh kepada semua fungsi pentadbir |
| **Pentadbir** | Fungsi pentadbir terhad |
| **Moderator** | Penyederhanaan kandungan sahaja |
| **Editor** | Penciptaan dan penyuntingan kandungan |Urus kebenaran:**Sistem > Kebenaran**## Amalan Terbaik Keselamatan untuk Panel Pentadbiran1. **Kata Laluan Kuat:** Gunakan kata laluan 16+ aksara
2. **Perubahan Biasa:** Tukar kata laluan setiap 90 hari
3. **Akses Pantau:** Semak log "Pengguna Pentadbir" dengan kerap
4. **Hadkan Akses:** Namakan semula folder pentadbir untuk keselamatan tambahan
5. **Gunakan HTTPS:** Sentiasa akses pentadbir melalui HTTPS
6. **Penyenaraian Putih IP:** Hadkan akses pentadbir kepada IP tertentu
7. **Log Keluar Biasa:** Log Keluar apabila selesai
8. **Keselamatan Pelayar:** Kosongkan cache penyemak imbas dengan kerapLihat Konfigurasi Keselamatan.## Panel Pentadbir Menyelesaikan masalah### Tidak Dapat Mengakses Panel Pentadbiran**Penyelesaian:**
1. Sahkan kelayakan log masuk
2. Kosongkan cache dan kuki penyemak imbas
3. Cuba pelayar yang berbeza
4. Semak sama ada laluan folder pentadbir adalah betul
5. Sahkan kebenaran fail pada folder pentadbir
6. Semak sambungan pangkalan data dalam mainfile.php### Halaman Pentadbir Kosong**Penyelesaian:**
```
bash
# Check PHP errors
tail -f /var/log/apache2/error.log

# Enable debug mode temporarily
sed -i "s/define('XOOPS_DEBUG', 0)/define('XOOPS_DEBUG', 1)/" /var/www/html/XOOPS/mainfile.php

# Check file permissions
ls -la /var/www/html/XOOPS/admin/
```
### Panel Pentadbiran Lambat**Penyelesaian:**
1. Kosongkan cache: **Sistem > Alat > Kosongkan Cache**
2. Optimumkan pangkalan data: **Sistem > Pangkalan Data > Optimumkan**
3. Semak sumber pelayan: `htop`
4. Semak pertanyaan perlahan dalam MySQL### Modul Tidak Muncul**Penyelesaian:**
1. Sahkan modul dipasang: **Modul > Modul**
2. Semak modul didayakan
3. Sahkan kebenaran yang diberikan
4. Semak fail modul wujud
5. Semak log ralat## Langkah SeterusnyaSelepas membiasakan diri dengan panel pentadbir:1. Buat halaman pertama anda
2. Sediakan kumpulan pengguna
3. Pasang modul tambahan
4. Konfigurasikan tetapan asas
5. Melaksanakan keselamatan---

**Tag:** #panel admin #papan pemuka #navigasi #bermula**Artikel Berkaitan:**
- ../Configuration/Basic-Configuration
- ../Configuration/System-Settings
- Mencipta-Halaman-Pertama-Anda
- Mengurus-Pengguna
- Memasang-Modul