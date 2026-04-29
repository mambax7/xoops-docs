---
title: "Aliran Kerja Sumbangan"
description: "Panduan langkah demi langkah untuk menyumbang kepada projek XOOPS"
---
> Panduan ini membimbing anda melalui proses lengkap menyumbang kepada XOOPS, daripada persediaan awal hingga permintaan tarik gabungan.---

## PrasyaratSebelum anda mula menyumbang, pastikan anda mempunyai:- **Git** dipasang dan dikonfigurasikan
- **Akaun GitHub** (percuma)
- **PHP 7.4+** untuk pembangunan XOOPS
- **Komposer** untuk pengurusan pergantungan
- Pengetahuan asas aliran kerja Git
- Kebiasaan dengan Tatakelakuan---

## Langkah 1: Fork Repositori### Pada Antara Muka Web GitHub1. Navigasi ke repositori (cth., `XOOPS/XoopsCore27`)
2. Klik butang **Fork** di penjuru kanan sebelah atas
3. Pilih tempat untuk bercabang (akaun peribadi anda)
4. Tunggu garpu siap### Mengapa Garpu?- Anda mendapat salinan anda sendiri untuk diusahakan
- Penyelenggara tidak perlu menguruskan banyak cawangan
- Anda mempunyai kawalan penuh ke atas garpu anda
- Permintaan Tarik merujuk garpu anda dan repo huluan---

## Langkah 2: Klon Garpu Anda Secara Tempatan
```
bash
# Clone your fork (replace YOUR_USERNAME)
git clone https://github.com/YOUR_USERNAME/XoopsCore27.git
cd XoopsCore27

# Add upstream remote to track original repository
git remote add upstream https://github.com/XOOPS/XoopsCore27.git

# Verify remotes are set correctly
git remote -v
# origin    https://github.com/YOUR_USERNAME/XoopsCore27.git (fetch)
# origin    https://github.com/YOUR_USERNAME/XoopsCore27.git (push)
# upstream  https://github.com/XOOPS/XoopsCore27.git (fetch)
# upstream  https://github.com/XOOPS/XoopsCore27.git (nofetch)
```
---

## Langkah 3: Sediakan Persekitaran Pembangunan### Pasang Ketergantungan
```
bash
# Install Composer dependencies
composer install

# Install development dependencies
composer install --dev

# For module development
cd modules/mymodule
composer install
```
### Konfigurasikan Git
```
bash
# Set your Git identity
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Optional: Set global Git config
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```
### Jalankan Ujian
```
bash
# Make sure tests pass in clean state
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit --testsuite unit
```
---

## Langkah 4: Cipta Cawangan Ciri### Konvensyen Penamaan CawanganIkut corak ini: `<type>/<description>`**Jenis:**
- `feature/` - Ciri baharu
- `fix/` - Pembetulan pepijat
- `docs/` - Dokumentasi sahaja
- `refactor/` - Pemfaktoran semula kod
- `test/` - Tambahan ujian
- `chore/` - Penyelenggaraan, perkakas**Contoh:**
```
bash
# Feature branch
git checkout -b feature/add-two-factor-auth

# Bug fix branch
git checkout -b fix/prevent-xss-in-forms

# Documentation branch
git checkout -b docs/update-api-guide

# Always branch from upstream/main (or develop)
git checkout -b feature/my-feature upstream/main
```
### Pastikan Cawangan Kemas Kini
```
bash
# Before you start work, sync with upstream
git fetch upstream
git merge upstream/main

# Later, if upstream has changed
git fetch upstream
git rebase upstream/main
```
---

## Langkah 5: Buat Perubahan Anda### Amalan Pembangunan1. **Tulis kod** mengikut Piawaian PHP
2. **Tulis ujian** untuk fungsi baharu
3. **Kemas kini dokumentasi** jika perlu
4. **Jalankan linter** dan pemformat kod### Pemeriksaan Kualiti Kod
```
bash
# Run all tests
./vendor/bin/phpunit

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/

# Run PHP CS Fixer
./vendor/bin/php-cs-fixer fix --dry-run

# Run PHPStan static analysis
./vendor/bin/phpstan analyse class/ src/
```
### Lakukan Perubahan Baik
```
bash
# Check what you changed
git status
git diff

# Stage specific files
git add class/MyClass.php
git add tests/MyClassTest.php

# Or stage all changes
git add .

# Commit with descriptive message
git commit -m "feat(auth): add two-factor authentication support"
```
---

## Langkah 6: Pastikan Cawangan dalam SegerakSemasa mengusahakan ciri anda, cawangan utama mungkin maju:
```
bash
# Fetch latest changes from upstream
git fetch upstream

# Option A: Rebase (preferred for clean history)
git rebase upstream/main

# Option B: Merge (simpler but adds merge commits)
git merge upstream/main

# If conflicts occur, resolve them then:
git add .
git rebase --continue  # or git merge --continue
```
---

## Langkah 7: Tolak ke Garpu Anda
```
bash
# Push your branch to your fork
git push origin feature/my-feature

# On subsequent pushes
git push

# If you rebased, you might need force push (use carefully!)
git push --force-with-lease origin feature/my-feature
```
---

## Langkah 8: Buat Permintaan Tarik### Pada Antara Muka Web GitHub1. Pergi ke garpu anda di GitHub
2. Anda akan melihat pemberitahuan untuk membuat PR daripada cawangan anda
3. Klik **"Banding & tarik permintaan"**
4. Atau klik secara manual **"Permintaan tarik baharu"** dan pilih cawangan anda### Tajuk dan Penerangan PR**Format Tajuk:**
```
<type>(<scope>): <subject>
```
Contoh:
```
feat(auth): add two-factor authentication
fix(forms): prevent XSS in text input
docs: update installation guide
refactor(core): improve performance
```
**Templat Penerangan:**
```
markdown
## Description
Brief explanation of what this PR does.

## Changes
- Changed X from A to B
- Added feature Y
- Fixed bug Z

## Type of Change
- [ ] New feature (adds new functionality)
- [ ] Bug fix (fixes an issue)
- [ ] Breaking change (API/behavior change)
- [ ] Documentation update

## Testing
- [ ] Added tests for new functionality
- [ ] All existing tests pass
- [ ] Manual testing performed

## Screenshots (if applicable)
Include before/after screenshots for UI changes.

## Related Issues
Closes #123
Related to #456

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed own code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings generated
- [ ] Tests pass locally
```
### Senarai Semak Semakan PRSebelum menghantar, pastikan:- [ ] Kod mengikut Piawaian PHP
- [ ] Ujian disertakan dan lulus
- [ ] Dokumentasi dikemas kini (jika perlu)
- [ ] Tiada konflik gabungan
- [ ] Komit mesej adalah jelas
- [ ] Isu berkaitan dirujuk
- [ ] Penerangan PR adalah terperinci
- [ ] Tiada kod nyahpepijat atau log konsol---

## Langkah 9: Balas Maklum Balas### Semasa Semakan Kod1. **Baca komen dengan teliti** - Fahami maklum balas
2. **Tanya soalan** - Jika kurang jelas, minta penjelasan
3. **Bincangkan alternatif** - Pendekatan perbahasan dengan hormat
4. **Buat perubahan yang diminta** - Kemas kini cawangan anda
5. **Paksa-tolak dikemas kini komit** - Jika menulis semula sejarah
```
bash
# Make changes
git add .
git commit --amend  # Modify last commit
git push --force-with-lease origin feature/my-feature

# Or add new commits
git commit -m "Address feedback on PR review"
git push origin feature/my-feature
```
### Jangkakan Lelaran- Kebanyakan PR memerlukan beberapa pusingan semakan
- Bersabar dan membina
- Lihat maklum balas sebagai peluang pembelajaran
- Penyelenggara boleh mencadangkan refactor---

## Langkah 10: Gabung dan Pembersihan### Selepas KelulusanSetelah penyelenggara meluluskan dan menggabungkan:1. **Gabung automatik GitHub** atau gabungan klik penyelenggara
2. **Cawangan anda dipadamkan** (biasanya automatik)
3. **Perubahan ada di hulu**### Pembersihan Tempatan
```
bash
# Switch to main branch
git checkout main

# Update main with merged changes
git fetch upstream
git merge upstream/main

# Delete local feature branch
git branch -d feature/my-feature

# Delete from your fork (if not auto-deleted)
git push origin --delete feature/my-feature
```
---

## Gambarajah Aliran Kerja
```
mermaid
graph LR
    A[Fork Repository] --> B[Clone Fork]
    B --> C[Create Branch]
    C --> D[Make Changes]
    D --> E[Commit & Push]
    E --> F[Create PR]
    F --> G{Review}
    G -->|Approved| H[Merge]
    G -->|Changes Needed| I[Update PR]
    I --> G
    H --> J[Cleanup]
    J --> K[Done]
```
---

## Senario Biasa### Menyegerakkan Sebelum Mula
```
bash
# Always start fresh
git fetch upstream
git checkout -b feature/new-thing upstream/main
```
### Menambah Lebih Banyak Komit
```
bash
# Just push again
git add .
git commit -m "feat: additional changes"
git push origin feature/new-thing
```
### Membetulkan Kesilapan
```
bash
# Last commit has wrong message
git commit --amend -m "Correct message"
git push --force-with-lease

# Revert to previous state (careful!)
git reset --soft HEAD~1  # Keep changes
git reset --hard HEAD~1  # Discard changes
```
### Mengendalikan Konflik Gabungan
```
bash
# Rebase and resolve conflicts
git fetch upstream
git rebase upstream/main

# Edit conflicted files to resolve
# Then continue
git add .
git rebase --continue
git push --force-with-lease
```
---

## Amalan Terbaik### Lakukan- Pastikan cawangan fokus pada isu tunggal
- Buat komitmen yang kecil dan logik
- Tulis mesej komit deskriptif
- Kemas kini cawangan anda dengan kerap
- Uji sebelum menolak
- Perubahan dokumen
- Bersikap responsif terhadap maklum balas### Jangan- Bekerja terus di cawangan main/master
- Campurkan perubahan yang tidak berkaitan dalam satu PR
- Komit fail yang dijana atau node_modules
- Tolak paksa selepas PR adalah umum (gunakan --paksa-dengan-pajakan)
- Abaikan maklum balas semakan kod
- Buat PR yang besar (pecah menjadi yang lebih kecil)
- Komit data sensitif (kunci API, kata laluan)---

## Petua untuk Berjaya### Berkomunikasi- Tanya soalan dalam isu sebelum memulakan kerja
- Minta panduan tentang perubahan yang kompleks
- Bincangkan pendekatan dalam huraian PR
- Balas maklum balas dengan segera### Ikut Piawaian- Semak Piawaian PHP
- Semak garis panduan Pelaporan Isu
- Baca Gambaran Keseluruhan Menyumbang
- Ikut Garis Panduan Permintaan Tarik### Ketahui Pangkalan Kod- Baca corak kod sedia ada
- Kaji pelaksanaan yang serupa
- Fahami seni bina
- Semak Konsep Teras---

## Dokumentasi Berkaitan- Tatakelakuan
- Garis Panduan Permintaan Tarik
- Pelaporan Isu
- Piawaian Pengekodan PHP
- Gambaran Keseluruhan Menyumbang---

#XOOPS #git #github #contributing #workflow #pull-request