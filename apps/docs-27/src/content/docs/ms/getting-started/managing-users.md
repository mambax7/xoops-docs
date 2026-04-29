---
title: "Menguruskan Pengguna"
description: "Panduan komprehensif untuk pentadbiran pengguna dalam XOOPS termasuk mencipta pengguna, kumpulan pengguna, kebenaran dan peranan pengguna"
---
# Mengurus Pengguna dalam XOOPSKetahui cara membuat akaun pengguna, menyusun pengguna ke dalam kumpulan dan mengurus kebenaran dalam XOOPS.## Gambaran Keseluruhan Pengurusan PenggunaXOOPS menyediakan pengurusan pengguna yang komprehensif dengan:
```
Users > Accounts
├── Individual users
├── User profiles
├── Registration requests
└── Online users

Users > Groups
├── User groups/roles
├── Group permissions
└── Group membership

System > Permissions
├── Module access
├── Content access
├── Function permissions
└── Group capabilities
```
## Mengakses Pengurusan Pengguna### Navigasi Panel Pentadbir1. Log masuk ke pentadbir: `http://your-domain.com/XOOPS/admin/`
2. Klik **Pengguna** dalam bar sisi kiri
3. Pilih daripada pilihan:
   - **Pengguna:** Urus akaun individu
   - **Kumpulan:** Urus kumpulan pengguna
   - **Pengguna Dalam Talian:** Lihat pengguna aktif pada masa ini
   - **Permintaan Pengguna:** Memproses permintaan pendaftaran## Memahami Peranan PenggunaXOOPS disertakan dengan peranan pengguna yang telah ditetapkan:| Kumpulan | Peranan | Keupayaan | Kes Penggunaan |
|---|---|---|---|
| **Juruweb** | Pentadbir | Kawalan tapak penuh | Pentadbir utama |
| **Pentadbir** | Pentadbir | Akses pentadbir terhad | Pengguna yang dipercayai |
| **Moderator** | Kawalan kandungan | Luluskan kandungan | Pengurus komuniti |
| **Penyunting** | Penciptaan kandungan | Kandungan Create/edit | Kakitangan kandungan |
| **Berdaftar** | Ahli | Siar, ulasan, profil | Pengguna biasa |
| **Tanpa Nama** | Pelawat | Baca sahaja | Pengguna tidak log masuk |## Mencipta Akaun Pengguna### Kaedah 1: Pentadbir Mencipta Pengguna**Langkah 1: Akses Penciptaan Pengguna**1. Pergi ke **Pengguna > Pengguna**
2. Klik **"Tambah Pengguna Baharu"** atau **"Buat Pengguna"****Langkah 2: Masukkan Maklumat Pengguna**Isikan butiran pengguna:
```
Username: [4+ characters, letters/numbers/underscore only]
Example: john_smith

Email Address: [Valid email address]
Example: john@example.com

Password: [Strong password]
Example: MyStr0ng!Pass2025

Confirm Password: [Repeat password]
Example: MyStr0ng!Pass2025

Real Name: [User's full name]
Example: John Smith

URL: [Optional user website]
Example: https://johnsmith.com

Signature: [Optional forum signature]
Example: "Happy XOOPS user!"
```
**Langkah 3: Konfigurasikan Tetapan Pengguna**
```
User Status: ☑ Active
             ☐ Inactive
             ☐ Pending Approval

User Groups:
☑ Registered Users
☐ Webmasters
☐ Admins
☐ Moderators
```
**Langkah 4: Pilihan Tambahan**
```
Notify User: ☑ Send welcome email
Allow Avatar: ☑ Yes
User Theme: [Default theme]
Show Email: ☐ Public / ☑ Private
```
**Langkah 5: Buat Akaun**Klik **"Tambah Pengguna"** atau **"Buat"**Pengesahan:
```
User created successfully!
Username: john_smith
Email: john@example.com
Groups: Registered Users
```
### Kaedah 2: Pendaftaran Diri PenggunaBenarkan pengguna mendaftar diri mereka:**Panel Pentadbiran > Sistem > Keutamaan > Tetapan Pengguna**
```
Allow User Registration: ☑ Yes

Registration Type:
☐ Instant (Approve automatically)
☑ Email Verification (Email confirmation)
☐ Admin Approval (You approve each)

Send Verification Email: ☑ Yes
```
Kemudian:
1. Pengguna melawat halaman pendaftaran
2. Isikan maklumat asas
3. Sahkan e-mel atau tunggu kelulusan
4. Akaun diaktifkan## Mengurus Akaun Pengguna### Lihat Semua Pengguna**Lokasi:** Pengguna > PenggunaMenunjukkan senarai pengguna dengan:
- Nama pengguna
- Alamat e-mel
- Tarikh pendaftaran
- Log masuk terakhir
- Status pengguna (Active/Inactive)
- Keahlian kumpulan### Edit Akaun Pengguna1. Dalam senarai pengguna, klik nama pengguna
2. Ubah suai mana-mana medan:
   - Alamat e-mel
   - Kata laluan
   - Nama sebenar
   - Kumpulan pengguna
   - Status3. Klik **"Simpan"** atau **"Kemas Kini"**### Tukar Kata Laluan Pengguna1. Klik pengguna dalam senarai
2. Tatal ke bahagian "Tukar Kata Laluan".
3. Masukkan kata laluan baharu
4. Sahkan kata laluan
5. Klik **"Tukar Kata Laluan"**Pengguna akan menggunakan kata laluan baharu pada log masuk seterusnya.### Pengguna Deactivate/SuspendLumpuhkan akaun buat sementara waktu tanpa pemadaman:1. Klik pengguna dalam senarai
2. Tetapkan **Status Pengguna** kepada "Tidak Aktif"
3. Klik **"Simpan"**Pengguna tidak boleh log masuk semasa tidak aktif.### Aktifkan Semula Pengguna1. Klik pengguna dalam senarai
2. Tetapkan **Status Pengguna** kepada "Aktif"
3. Klik **"Simpan"**Pengguna boleh log masuk semula.### Padamkan Akaun PenggunaAlih keluar pengguna secara kekal:1. Klik pengguna dalam senarai
2. Tatal ke bawah
3. Klik **"Padam Pengguna"**
4. Sahkan: "Padam pengguna dan semua data?"
5. Klik **"Ya"****Amaran:** Pemadaman adalah kekal!### Lihat Profil PenggunaLihat butiran profil pengguna:1. Klik nama pengguna dalam senarai pengguna
2. Semak maklumat profil:
   - Nama sebenar
   - E-mel
   - Laman web
   - Tarikh sertai
   - Log masuk terakhir
   - Bio pengguna
   - Avatar
   - Posts/contributions## Memahami Kumpulan Pengguna### Kumpulan Pengguna LalaiXOOPS termasuk kumpulan lalai:| Kumpulan | Tujuan | Istimewa | Edit |
|---|---|---|---|
| **Tanpa Nama** | Pengguna tidak log masuk | Tetap | Tidak |
| **Pengguna Berdaftar** | Ahli tetap | Lalai | Ya |
| **Juruweb** | Pentadbir tapak | Pentadbir | Ya |
| **Pentadbir** | Pentadbir terhad | Pentadbir | Ya |
| **Moderator** | Penyederhana kandungan | Tersuai | Ya |### Buat Kumpulan TersuaiBuat kumpulan untuk peranan tertentu:**Lokasi:** Pengguna > Kumpulan1. Klik **"Tambah Kumpulan Baharu"**
2. Masukkan butiran kumpulan:
```
Group Name: Content Editors
Group Description: Users who can create and edit content

Display Group: ☑ Yes (Show in member profiles)
Group Type: ☑ Regular / ☐ Admin
```
3. Klik **"Buat Kumpulan"**### Urus Keahlian KumpulanTetapkan pengguna kepada kumpulan:**Pilihan A: Daripada Senarai Pengguna**1. Pergi ke **Pengguna > Pengguna**
2. Klik pengguna
3. Check/uncheck kumpulan dalam bahagian "Kumpulan Pengguna".
4. Klik **"Simpan"****Pilihan B: Daripada Kumpulan**1. Pergi ke **Pengguna > Kumpulan**
2. Klik nama kumpulan
3. View/edit senarai ahli
4. Tambah atau alih keluar pengguna
5. Klik **"Simpan"**### Edit Sifat KumpulanSesuaikan tetapan kumpulan:1. Pergi ke **Pengguna > Kumpulan**
2. Klik nama kumpulan
3. Ubah suai:
   - Nama kumpulan
   - Penerangan kumpulan
   - Kumpulan paparan (show/hide)
   - Jenis kumpulan
4. Klik **"Simpan"**## Kebenaran Pengguna### Memahami KebenaranTiga tahap kebenaran:| Tahap | Skop | Contoh |
|---|---|---|
| **Akses Modul** | Bolehkah modul see/use | Boleh mengakses modul Forum |
| **Kebenaran Kandungan** | Boleh melihat kandungan khusus | Boleh membaca berita yang diterbitkan |
| **Kebenaran Fungsi** | Boleh melakukan tindakan | Boleh hantar komen |### Konfigurasi Akses Modul**Lokasi:** Sistem > KebenaranHadkan kumpulan yang boleh mengakses setiap modul:
```
Module: News

Admin Access:
☑ Webmasters
☑ Admins
☐ Moderators
☐ Registered Users
☐ Anonymous

User Access:
☐ Webmasters
☐ Admins
☑ Moderators
☑ Registered Users
☑ Anonymous
```
Klik **"Simpan"** untuk memohon.### Tetapkan Kebenaran KandunganKawal akses kepada kandungan tertentu:Contoh - Artikel berita:
```
View Permission:
☑ All groups can read

Post Permission:
☑ Registered Users
☑ Content Editors
☐ Anonymous

Moderate Comments:
☑ Moderators required
```
### Amalan Terbaik Kebenaran
```
Public Content (News, Pages):
├── View: All groups
├── Post: Registered Users + Editors
└── Moderate: Admins + Moderators

Community (Forum, Comments):
├── View: All groups
├── Post: Registered Users
└── Moderate: Moderators + Admins

Admin Tools:
├── View: Webmasters + Admins only
├── Configure: Webmasters only
└── Delete: Webmasters only
```
## Pengurusan Pendaftaran Pengguna### Mengendalikan Permintaan PendaftaranJika "Kelulusan Pentadbiran" didayakan:1. Pergi ke **Pengguna > Permintaan Pengguna**
2. Lihat pendaftaran yang belum selesai:
   - Nama pengguna
   - E-mel
   - Tarikh pendaftaran
   - Minta status3. Untuk setiap permintaan:
   - Klik untuk menyemak
   - Klik **"Luluskan"** untuk mengaktifkan
   - Klik **"Tolak"** untuk menafikan### Hantar E-mel PendaftaranHantar semula e-mel welcome/verification:1. Pergi ke **Pengguna > Pengguna**
2. Klik pengguna
3. Klik **"Hantar E-mel"** atau **"Hantar Semula Pengesahan"**
4. E-mel dihantar kepada pengguna## Pemantauan Pengguna Dalam Talian### Lihat Pengguna Dalam Talian Pada Masa IniJejaki pelawat tapak aktif:**Lokasi:** Pengguna > Pengguna Dalam TalianRancangan:
- Pengguna dalam talian semasa
- Pengiraan pelawat tetamu
- Masa aktiviti terakhir
- Alamat IP
- Lokasi menyemak imbas### Pantau Aktiviti PenggunaFahami tingkah laku pengguna:
```
Active Users: 12
Registered: 8
Anonymous: 4

Recent Activity:
- User1 - Forum post (2 min ago)
- User2 - Comment (5 min ago)
- User3 - Page view (8 min ago)
```
## Penyesuaian Profil Pengguna### Dayakan Profil PenggunaKonfigurasikan pilihan profil pengguna:**Pentadbir > Sistem > Keutamaan > Tetapan Pengguna**
```
Allow User Profiles: ☑ Yes
Show Member List: ☑ Yes
Users Can Edit Profile: ☑ Yes
Show User Avatar: ☑ Yes
Show Last Online: ☑ Yes
Show Email Address: ☐ Yes / ☑ No
```
### Medan ProfilKonfigurasikan perkara yang boleh ditambahkan oleh pengguna pada profil:Contoh medan profil:
- Nama sebenar
- URL tapak web
- Biografi
- Lokasi
- Avatar (gambar)
- Tandatangan
- Minat
- Pautan media sosialSesuaikan dalam tetapan modul.## Pengesahan Pengguna### Dayakan Pengesahan Dua FaktorPilihan keselamatan yang dipertingkatkan (jika ada):**Pentadbir > Pengguna > Tetapan**
```
Two-Factor Authentication: ☑ Enabled

Methods:
☑ Email
☑ SMS
☑ Authenticator App
```
Pengguna mesti mengesahkan dengan kaedah kedua.### Dasar Kata LaluanKuatkuasakan kata laluan yang kukuh:**Pentadbir > Sistem > Keutamaan > Tetapan Pengguna**
```
Minimum Password Length: 8 characters
Require Uppercase: ☑ Yes
Require Numbers: ☑ Yes
Require Special Chars: ☑ Yes

Password Expiration: 90 days
Force Change on First Login: ☑ Yes
```
### Percubaan Log MasukCegah serangan kekerasan:
```
Lock After Failed Attempts: 5
Lock Duration: 15 minutes
Log All Attempts: ☑ Yes
Notify Admin: ☑ Yes
```
## Pengurusan E-mel Pengguna### Hantar E-mel Pukal ke KumpulanHantar mesej kepada beberapa pengguna:1. Pergi ke **Pengguna > Pengguna**
2. Pilih berbilang pengguna (kotak pilihan)
3. Klik **"Hantar E-mel"**
4. Karang mesej:
   - Subjek
   - Badan mesej
   - Sertakan tandatangan
5. Klik **"Hantar"**### Tetapan Pemberitahuan E-melKonfigurasikan e-mel yang diterima oleh pengguna:**Pentadbir > Sistem > Keutamaan > Tetapan E-mel**
```
New Registration: ☑ Send welcome email
Password Reset: ☑ Send reset link
Comments: ☑ Notify on replies
Messages: ☑ Notify new messages
Notifications: ☑ Site announcements
Frequency: ☐ Immediate / ☑ Daily / ☐ Weekly
```
## Statistik Pengguna### Lihat Laporan PenggunaPantau metrik pengguna:**Pentadbir > Sistem > Papan Pemuka**
```
User Statistics:
├── Total Users: 256
├── Active Users: 189
├── New This Month: 24
├── Registration Requests: 3
├── Currently Online: 12
└── Last 24h Posts: 45
```
### Penjejakan Pertumbuhan PenggunaPantau trend pendaftaran:
```
Registrations Last 7 Days: 12 users
Registrations Last 30 Days: 48 users
Active Users (30 days): 156
Inactive Users (30+ days): 100
```
## Tugasan Pengurusan Pengguna Biasa### Buat Pengguna Pentadbir1. Buat pengguna baharu (langkah di atas)
2. Berikan kepada kumpulan **Webmasters** atau **Admins**
3. Berikan kebenaran dalam Sistem > Kebenaran
4. Sahkan capaian pentadbir berfungsi### Cipta Moderator1. Buat pengguna baharu
2. Berikan kepada kumpulan **Moderator**
3. Konfigurasikan kebenaran untuk menyederhanakan modul tertentu
4. Pengguna boleh meluluskan kandungan, mengurus komen### Sediakan Editor Kandungan1. Buat kumpulan **Editor Kandungan**
2. Buat pengguna, tetapkan kepada kumpulan
3. Berikan kebenaran untuk:
   - halaman Create/edit
   - Siaran Create/edit
   - Komen sederhana
4. Hadkan akses panel pentadbir### Tetapkan Semula Kata Laluan TerlupaPengguna terlupa kata laluan mereka:1. Pergi ke **Pengguna > Pengguna**
2. Cari pengguna
3. Klik nama pengguna
4. Klik **"Tetapkan Semula Kata Laluan"** atau edit medan kata laluan
5. Tetapkan kata laluan sementara
6. Maklumkan pengguna (hantar e-mel)
7. Pengguna log masuk, menukar kata laluan### Pengguna Import PukalImport senarai pengguna (lanjutan):Banyak panel pengehosan menyediakan alatan untuk:
1. Sediakan fail CSV dengan data pengguna
2. Muat naik melalui panel pentadbir
3. Buat akaun beramai-ramaiAtau gunakan script/plugin tersuai untuk import.## Privasi Pengguna### Hormati Privasi PenggunaAmalan terbaik privasi:
```
Do:
✓ Hide emails by default
✓ Let users choose visibility
✓ Protect against spam

Don't:
✗ Share private data
✗ Display without permission
✗ Use for marketing without consent
```
### Pematuhan GDPRJika melayani pengguna EU:1. Dapatkan persetujuan untuk pengumpulan data
2. Benarkan pengguna memuat turun data mereka
3. Berikan pilihan padam akaun
4. Mengekalkan dasar privasi
5. Log aktiviti pemprosesan data## Menyelesaikan Masalah Pengguna### Pengguna Tidak Boleh Log Masuk**Masalah:** Pengguna terlupa kata laluan atau tidak boleh mengakses akaun**Penyelesaian:**
1. Sahkan akaun pengguna adalah "Aktif"
2. Tetapkan semula kata laluan:
   - Pentadbir > Pengguna > Cari pengguna
   - Tetapkan kata laluan sementara baharu
   - Hantar kepada pengguna melalui e-mel
3. Kosongkan pengguna cookies/cache
4. Semak sama ada akaun tidak dikunci### Pendaftaran Pengguna Tersekat**Masalah:** Pengguna tidak dapat melengkapkan pendaftaran**Penyelesaian:**
1. Pendaftaran cek dibenarkan:
   - Pentadbir > Sistem > Keutamaan > Tetapan Pengguna
   - Dayakan pendaftaran
2. Semak tetapan e-mel berfungsi
3. Jika pengesahan e-mel diperlukan:
   - Hantar semula e-mel pengesahan
   - Semak folder spam
4. Kurangkan keperluan kata laluan jika terlalu ketat### Akaun Pendua**Masalah:** Pengguna mempunyai berbilang akaun**Penyelesaian:**
1. Kenal pasti akaun pendua dalam senarai Pengguna
2. Simpan akaun utama
3. Gabungkan data jika boleh
4. Padamkan akaun pendua
5. Dayakan "Cegah E-mel Pendua" dalam tetapan## Senarai Semak Pengurusan PenggunaUntuk persediaan awal:- [ ] Tetapkan jenis pendaftaran pengguna (instant/email/admin)
- [ ] Buat kumpulan pengguna yang diperlukan
- [ ] Konfigurasikan kebenaran kumpulan
- [ ] Tetapkan dasar kata laluan
- [ ] Dayakan profil pengguna
- [ ] Konfigurasikan pemberitahuan e-mel
- [ ] Tetapkan pilihan avatar pengguna
- [ ] Proses pendaftaran ujian
- [ ] Buat akaun ujian
- [ ] Sahkan kebenaran berfungsi
- [ ] Dokumen struktur kumpulan
- [ ] Rancang kemasukan pengguna## Langkah SeterusnyaSelepas menyediakan pengguna:1. Pasang modul yang pengguna perlukan
2. Buat kandungan untuk pengguna
3. Akaun pengguna selamat
4. Teroka lebih banyak ciri pentadbir
5. Konfigurasikan tetapan seluruh sistem---

**Tag:** #pengguna #kumpulan #kebenaran #pentadbiran #kawalan akses**Artikel Berkaitan:**
- Gambaran Keseluruhan Panel-Pentadbir
- Memasang-Modul
- ../Configuration/Security-Configuration
- ../Configuration/System-Settings