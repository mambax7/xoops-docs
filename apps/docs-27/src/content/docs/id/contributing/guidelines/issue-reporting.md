---
title: "Pedoman Pelaporan Masalah"
description: "Cara melaporkan bug, permintaan fitur, dan masalah lainnya secara efektif"
---

> Laporan bug dan permintaan fitur yang efektif sangat penting untuk pengembangan XOOPS. Panduan ini membantu Anda membuat isu berkualitas tinggi.

---

## Sebelum Melapor

### Periksa Masalah yang Ada

**Selalu cari dulu:**

1. Buka [Masalah GitHub](https://github.com/XOOPS/XoopsCore27/issues)
2. Cari kata kunci yang berhubungan dengan masalah Anda
3. Periksa masalah yang sudah ditutup - mungkin sudah terselesaikan
4. Lihat permintaan tarik - mungkin sedang berlangsung

Gunakan filter pencarian:
- `is:issue is:open label:bug` - Buka bug
- `is:issue is:open label:feature` - Buka permintaan fitur
- `is:issue sort:updated` - Masalah yang baru diperbarui

### Benarkah Ini Suatu Masalah?

Pertimbangkan dulu:

- **Masalah konfigurasi?** - Periksa dokumentasi
- **Pertanyaan penggunaan?** - Tanyakan di forum atau komunitas Discord
- **Masalah keamanan?** - Lihat bagian #masalah keamanan di bawah
- **Khusus module?** - Laporkan ke pengelola module
- **Khusus theme?** - Laporkan ke penulis theme

---

## Jenis Masalah

### Laporan Bug

Bug adalah perilaku atau cacat yang tidak terduga.

**Contoh:**
- Masuk tidak berfungsi
- Kesalahan basis data
- Validasi formulir tidak ada
- Kerentanan keamanan

### Permintaan Fitur

Permintaan fitur adalah saran untuk fungsionalitas baru.

**Contoh:**
- Tambahkan dukungan untuk fitur baru
- Meningkatkan fungsionalitas yang ada
- Tambahkan dokumentasi yang hilang
- Peningkatan kinerja

### Peningkatan

Peningkatan meningkatkan fungsionalitas yang ada.

**Contoh:**
- Pesan kesalahan yang lebih baik
- Peningkatan kinerja
- Desain API yang lebih baik
- Pengalaman pengguna yang lebih baik

### Dokumentasi

Masalah dokumentasi mencakup dokumentasi yang hilang atau salah.

**Contoh:**
- Dokumentasi API tidak lengkap
- Panduan usang
- Contoh kode tidak ada
- Kesalahan ketik dalam dokumentasi

---

## Melaporkan Bug

### template Laporan Bug

```markdown
## Description
Brief, clear description of the bug.

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- XOOPS Version: X.Y.Z
- PHP Version: 8.2/8.3/8.4
- Database: MySQL/MariaDB version
- Operating System: Windows/macOS/Linux
- Browser: Chrome/Firefox/Safari

## Screenshots
If applicable, add screenshots showing the issue.

## Additional Context
Any other relevant information.

## Possible Fix
If you have suggestions for fixing the issue (optional).
```

### Contoh Laporan Bug yang Baik

```markdown
## Description
Login page shows blank page when database connection fails.

## Steps to Reproduce
1. Stop the MySQL service
2. Navigate to the login page
3. Observe the behavior

## Expected Behavior
Show a user-friendly error message explaining the database connection issue.

## Actual Behavior
The page is completely blank - no error message, no interface visible.

## Environment
- XOOPS Version: 2.7.0
- PHP Version: 8.0.28
- Database: MySQL 5.7
- Operating System: Ubuntu 20.04
- Browser: Chrome 120

## Additional Context
This likely affects other pages too. The error should be displayed to admins or logged appropriately.

## Possible Fix
Check database connection in header.php before rendering the template.
```

### Contoh Laporan Bug Buruk

```markdown
## Description
Login doesn't work

## Steps to Reproduce
It doesn't work

## Expected Behavior
It should work

## Actual Behavior
It doesn't

## Environment
Latest version
```

---

## Melaporkan Permintaan Fitur

### template Permintaan Fitur

```markdown
## Description
Clear, concise description of the feature.

## Problem Statement
Why is this feature needed? What problem does it solve?

## Proposed Solution
Describe your ideal implementation or UX.

## Alternatives Considered
Are there other ways to achieve this goal?

## Additional Context
Any mockups, examples, or references.

## Expected Impact
How would this benefit users? Would it be breaking?
```

### Contoh Permintaan Fitur yang Bagus

```markdown
## Description
Add two-factor authentication (2FA) for user accounts.

## Problem Statement
With increasing security breaches, many CMS platforms now offer 2FA. XOOPS users want stronger account security beyond passwords.

## Proposed Solution
Implement TOTP-based 2FA (compatible with Google Authenticator, Authy, etc.).
- Users can enable 2FA in their profile
- Display QR code for setup
- Generate backup codes for recovery
- Require 2FA code at login

## Alternatives Considered
- SMS-based 2FA (requires carrier integration, less secure)
- Hardware keys (too complex for average users)

## Additional Context
Similar to GitHub, GitLab, and WordPress implementations.
Reference: [TOTP Standard RFC 6238](https://tools.ietf.org/html/rfc6238)

## Expected Impact
Increases account security. Could be optional initially, mandatory in future versions.
```

---

## Masalah Keamanan

### JANGAN Melaporkan Secara Publik

**Jangan pernah membuat masalah publik karena kerentanan keamanan.**

### Laporkan Secara Pribadi

1. **Kirim email ke tim keamanan:** security@xoops.org
2. **Sertakan:**
   - Deskripsi kerentanan
   - Langkah-langkah untuk mereproduksi
   - Potensi dampak
   - Informasi kontak Anda

### Pengungkapan yang Bertanggung Jawab

- Kami akan mengonfirmasi penerimaan dalam waktu 48 jam
- Kami akan memberikan update setiap 7 hari sekali
- Kami akan mengerjakan timeline yang tepat
- Anda dapat meminta penghargaan atas penemuan tersebut
- Mengkoordinasikan waktu pengungkapan publik

### Contoh Masalah Keamanan

```
Subject: [SECURITY] XSS Vulnerability in Comment Form

Description:
The comment form in Publisher module does not properly escape user input,
allowing stored XSS attacks.

Steps to Reproduce:
1. Create a comment with: <img src=x onerror="alert('xss')">
2. Submit the form
3. The JavaScript executes when viewing the comment

Impact:
Attackers can steal user session tokens, perform actions as users,
or deface the website.

Environment:
- XOOPS 2.7.0
- Publisher Module 1.x
```

---

## Judul Masalah Praktik Terbaik

### Judul Bagus

```
✅ Login page shows blank error when database connection fails
✅ Add two-factor authentication support
✅ Form validation not preventing SQL injection in name field
✅ Improve performance of user list query
✅ Update installation documentation for PHP 8.2
```

### Judul Buruk

```
❌ Bug in system
❌ Help me!!
❌ It doesn't work
❌ Question about XOOPS
❌ Error
```

### Pedoman Judul

- **Spesifikasi** - Sebutkan apa dan di mana
- **Singkat** - Kurang dari 75 karakter
- **Gunakan present tense** - "tampilkan halaman kosong" bukan "tampilkan kosong"
- **Sertakan konteks** - "di panel admin", "selama instalasi"
- **Hindari kata-kata umum** - Bukan "memperbaiki", "membantu", "masalah"

---

## Deskripsi Masalah Praktik Terbaik

### Sertakan Informasi Penting

1. **Apa** - Deskripsi masalah yang jelas
2. **Di mana** - Halaman, module, atau fitur mana
3. **Kapan** - Langkah-langkah untuk mereproduksi
4. **Lingkungan** - Versi, OS, browser, PHP
5. **Mengapa** - Mengapa ini penting

### Gunakan Pemformatan Kode

```markdown
Error message: `Error: Cannot find user`

Code snippet:
```php
$user = $this->getUser($id);
jika (!$user) {
    echo "Kesalahan: Tidak dapat menemukan pengguna";
}
```
```

### Sertakan Tangkapan Layar

Untuk masalah UI, meliputi:
- Tangkapan layar masalahnya
- Tangkapan layar dari perilaku yang diharapkan
- Beri anotasi apa yang salah (panah, lingkaran)

### Gunakan Label

Tambahkan label untuk mengkategorikan:
- `bug` - Laporan bug
- `enhancement` - Permintaan peningkatan
- `documentation` - Masalah dokumentasi
- `help wanted` - Mencari bantuan
- `good first issue` - Cocok untuk kontributor baru

---

## Setelah Pelaporan

### Jadilah Responsif

- Periksa pertanyaan di komentar terbitan
- Berikan informasi tambahan jika diminta
- Uji perbaikan yang disarankan
- Verifikasi bug masih ada dengan versi baru

### Ikuti Etiket- Bersikap hormat dan profesional
- Asumsikan niat baik
- Jangan menuntut perbaikan - pengembang adalah sukarelawan
- Tawarkan bantuan jika memungkinkan
- Ucapkan terima kasih kepada kontributor atas pekerjaan mereka

### Tetap Fokus pada Masalah

- Tetap pada topik
- Jangan membahas masalah yang tidak berhubungan
- Tautkan ke masalah terkait
- Jangan gunakan isu untuk pemungutan suara fitur

---

## Apa yang Terjadi pada Masalah

### Proses Triase

1. **Masalah baru dibuat** - GitHub memberi tahu pengelola
2. **Tinjauan awal** - Diperiksa kejelasan dan duplikatnya
3. **Penetapan label** - Dikategorikan dan diprioritaskan
4. **Penugasan** - Ditugaskan kepada seseorang jika diperlukan
5. **Diskusi** - Info tambahan dikumpulkan jika diperlukan

### Tingkat Prioritas

- **Kritis** - Kehilangan data, keamanan, kerusakan total
- **Tinggi** - Fitur utama rusak, memengaruhi banyak pengguna
- **Sedang** - Bagian dari fitur rusak, solusi tersedia
- **Rendah** - Masalah kecil, kosmetik, atau kasus penggunaan khusus

### Hasil Resolusi

- **Tetap** - Masalah diselesaikan dalam PR
- **Tidak akan diperbaiki** - Ditolak karena alasan teknis atau strategis
- **Duplikat** - Sama seperti masalah lainnya
- **Tidak Valid** - Sebenarnya bukan masalah
- **Membutuhkan info lebih lanjut** - Menunggu detail tambahan

---

## Contoh Masalah

### Contoh: Laporan Bug Bagus

```markdown
## Description
Admin users cannot delete items when using MySQL with strict mode enabled.

## Steps to Reproduce
1. Enable `sql_mode='STRICT_TRANS_TABLES'` in MySQL
2. Navigate to Publisher admin panel
3. Click delete button on any article
4. Error is shown

## Expected Behavior
Article should be deleted or show meaningful error.

## Actual Behavior
Error: "SQL Error - Unknown column 'deleted_at' in ON clause"

## Environment
- XOOPS Version: 2.7.0
- PHP Version: 8.2.0
- Database: MySQL 8.0.32 with STRICT_TRANS_TABLES
- Operating System: Ubuntu 22.04
- Browser: Firefox 120

## Screenshots
[Screenshot of error message]

## Additional Context
This only happens with strict SQL mode. Works fine with default settings.
The query is in class/PublisherItem.php:248

## Possible Fix
Use single quotes around 'deleted_at' or use backticks for all column names.
```

### Contoh: Permintaan Fitur Bagus

```markdown
## Description
Add REST API endpoints for read-only access to public content.

## Problem Statement
Developers want to build mobile apps and external services using XOOPS data.
Currently limited to SOAP API which is outdated and poorly documented.

## Proposed Solution
Implement RESTful API with:
- Endpoints for articles, users, comments (read-only)
- Token-based authentication
- Standard HTTP status codes and errors
- OpenAPI/Swagger documentation
- Pagination support

## Alternatives Considered
- Enhanced SOAP API (legacy, not standards-compliant)
- GraphQL (more complex, maybe future)

## Additional Context
See Publisher module API refactoring for similar patterns.
Would align with modern web development practices.

## Expected Impact
Enable ecosystem of third-party tools and mobile apps.
Would improve XOOPS adoption and ecosystem.
```

---

## Dokumentasi Terkait

- Kode Etik
- Alur Kerja Kontribusi
- Pedoman Permintaan Tarik
- Ikhtisar Kontribusi

---

#xoops #masalah #pelaporan bug #permintaan fitur #github
